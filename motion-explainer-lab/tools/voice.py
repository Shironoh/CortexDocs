#!/usr/bin/env python3
"""Narration pipeline: one WAV per cue part (Piper neural TTS), exact word timings and visemes
(from Piper's phoneme alignments), optional Whisper intelligibility check.

Writes versions/<id>/timing.json, read by build.py and the engine: every K.T(cue, word) anchor then
falls on the real spoken word, and characters that speak a cue (cue.who) move their mouth on the visemes.

Usage:
  voice.py versions/<id> [--voice fr_FR-siwis-medium] [--ls 1.08] [--pause 0.35] [--speaker N]
                         [--engine piper|espeak] [--check] [--whisper small]

Fallback chain (documented in the skill):
  1. piper + phoneme alignments (exact)            -> align = "phonemes"
  2. piper, word counts disagree for a part        -> Whisper word timestamps on that part -> "whisper"
  3. no Whisper either                             -> words spread by character length     -> "proportional"
  4. no piper / no voice model                     -> espeak-ng (mbrola fr4 if present) + 2/3
  5. no TTS at all                                 -> no timing.json: the engine keeps its 2.6 words/s model
Voices are looked up in $PIPER_VOICES or ~/.local/share/piper-voices (download: see skill, section Voix)."""
import argparse, hashlib, json, os, pathlib, re, subprocess, sys, unicodedata, wave
import numpy as np

LAB = pathlib.Path(__file__).resolve().parent.parent
VOICES = pathlib.Path(os.environ.get("PIPER_VOICES", "~/.local/share/piper-voices")).expanduser()
SR_OUT = 44100

# ---------- tokenisation shared with the engine (engine.js: words()) ----------
def words(s):
    return [w for w in s.replace("|", " ").split() if re.search(r"[^\W_]", w) or re.search(r"\d", w)]

def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    return "".join(c for c in s if unicodedata.category(c) != "Mn" and (c.isalnum()))

# ---------- visemes (mouth shapes) from IPA phonemes ----------
# X rest · M lips closed (m b p) · F lip on teeth (f v) · O rounded · A wide open · E spread · C small opening
VIS = {}
for ch in "mbp": VIS[ch] = "M"
for ch in "fv": VIS[ch] = "F"
for ch in "oɔuwyøœɥʊɒ": VIS[ch] = "O"
for ch in "aɑæʌ": VIS[ch] = "A"
for ch in "eɛiɪj": VIS[ch] = "E"
SILENT = set(" ^$_.,;:!?¡¿—–-…\"'«»()")
MODIFIERS = set("ˈˌːˑ̃ʲʰ")  # stress, length, nasal tilde, palatalisation: continue the previous phoneme

def visemes_from(al, sr):
    """al: list of (phoneme, n_samples). Returns [[t, shape], ...] merged, >= 45 ms each."""
    out, t, prev = [], 0.0, "X"
    for ph, n in al:
        d = n / sr
        if ph in MODIFIERS: shape = prev
        elif ph in SILENT: shape = "X"
        else: shape = VIS.get(ph, "C")
        if not out or out[-1][1] != shape: out.append([round(t, 3), shape])
        prev = shape; t += d
    merged = []
    for i, (t0, s) in enumerate(out):
        t1 = out[i + 1][0] if i + 1 < len(out) else t
        if merged and t1 - t0 < .045 and s != "X": continue  # too short to read at 24 fps
        if merged and merged[-1][1] == s: continue
        merged.append([t0, s])
    return merged

# ---------- lexicon: foreign words respelled for the French voice ----------
LEX = {}
def load_lexicon(extra):
    LEX.clear()
    base = json.loads((LAB / "tools/lexicon_fr.json").read_text(encoding="utf-8"))
    for k, v in {**base, **(extra or {})}.items():
        if not k.startswith("_"): LEX[norm(k)] = v

def respell(text):
    def sub(m):
        w = m.group(0); r = LEX.get(norm(w))
        return r if r is not None else w
    return re.sub(r"[A-Za-zÀ-ÿ]+", sub, text)

# ---------- engines ----------
class Piper:
    def __init__(self, voice, ls, pause, speaker, noise, noise_w):
        from piper import PiperVoice, SynthesisConfig
        path = VOICES / f"{voice}.onnx"
        if not path.exists(): raise FileNotFoundError(path)
        self.v = PiperVoice.load(str(path), include_alignments=True)
        self.cfg = SynthesisConfig(length_scale=ls, speaker_id=speaker, noise_scale=noise, noise_w_scale=noise_w)
        self.sr = self.v.config.sample_rate; self.pause = pause
        self.name = f"piper:{voice}"

    def count_words(self, w):
        """How many phoneme-words espeak produces for one script word (numbers, acronyms...)."""
        ph = "".join("".join(s) + " " for s in self.v.phonemize(respell(w)))
        return len([x for x in ph.split(" ") if any(c not in SILENT and c not in MODIFIERS for c in x)])

    def synth(self, text):
        text = respell(text)
        chunks, al, pw = [], [], []  # pw: phoneme-word spans in seconds
        t = 0.0
        for k, ch in enumerate(self.v.synthesize(text, syn_config=self.cfg, include_alignments=True)):
            a = ch.audio_int16_array.astype(np.float32) / 32768
            if k: chunks.append(np.zeros(int(self.pause * self.sr), np.float32)); al.append(("_", int(self.pause * self.sr))); t += self.pause
            chunks.append(a)
            cur = None
            for p in (ch.phoneme_alignments or []):
                d = int(p.num_samples) / self.sr; al.append((p.phoneme, int(p.num_samples)))
                speech = p.phoneme not in SILENT and p.phoneme not in MODIFIERS
                if speech and cur is None: cur = [t, t + d]
                elif speech or (cur is not None and p.phoneme in MODIFIERS): cur[1] = t + d
                elif cur is not None: pw.append(cur); cur = None
                t += d
            if cur is not None: pw.append(cur)
            if not ch.phoneme_alignments: t += len(a) / self.sr
        x = np.concatenate(chunks) if chunks else np.zeros(1, np.float32)
        return x, self.sr, al, pw

class Espeak:
    def __init__(self, speed=160):
        self.speed = speed; self.sr = 22050
        voices = subprocess.run(["espeak-ng", "--voices=fr"], capture_output=True, text=True).stdout
        self.voice = "mb-fr4" if pathlib.Path("/usr/share/mbrola/fr4").exists() else "fr"
        self.name = f"espeak:{self.voice}"
    def synth(self, text):
        text = respell(text); f = pathlib.Path("/tmp/_esp.wav")
        subprocess.run(["espeak-ng", "-v", self.voice, "-s", str(self.speed), "-w", str(f), text], check=True, capture_output=True)
        with wave.open(str(f)) as w:
            sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
        self.sr = sr
        return x, sr, None, None

# ---------- whisper (check + fallback alignment) ----------
_WM = {}
def whisper(size):
    if size not in _WM:
        from faster_whisper import WhisperModel
        _WM[size] = WhisperModel(size, device="cpu", compute_type="int8")
    return _WM[size]

def to16k(x, sr):
    n = int(len(x) * 16000 / sr)
    return np.interp(np.linspace(0, len(x), n, endpoint=False), np.arange(len(x)), x).astype(np.float32)

def whisper_words(x, sr, size, prompt=None):
    segs, _ = whisper(size).transcribe(to16k(x, sr), language="fr", word_timestamps=True, beam_size=5,
                                        initial_prompt=prompt, condition_on_previous_text=False)
    return [(w.word.strip(), w.start, w.end, w.probability) for s in segs for w in s.words]

def align_chars(script, hyp):
    """Map each script word to a time via a character-level match against Whisper words."""
    import difflib
    sc, sidx = "", []
    for i, w in enumerate(script):
        n = norm(w); sidx.append(len(sc)); sc += n or "_"
    hc, ht = "", []
    for w, a, b, _ in hyp:
        n = norm(w)
        for k, c in enumerate(n): hc += c; ht.append(a + (b - a) * k / max(1, len(n)))
    m = difflib.SequenceMatcher(None, sc, hc, autojunk=False)
    cmap = {}
    for blk in m.get_matching_blocks():
        for k in range(blk.size): cmap[blk.a + k] = ht[blk.b + k]
    out = []
    for i, w in enumerate(script):
        a, n = sidx[i], max(1, len(norm(w)))
        ts = [cmap[a + k] for k in range(n) if a + k in cmap]
        out.append(ts[0] if ts else None)
    return out

def fill(times, total):
    """Interpolate missing word starts (None) monotonically."""
    n = len(times); t = list(times)
    known = [(i, v) for i, v in enumerate(t) if v is not None]
    if not known: return [total * i / max(1, n) for i in range(n)]
    for i in range(n):
        if t[i] is not None: continue
        lo = max([k for k in known if k[0] < i], default=(-1, 0.0), key=lambda k: k[0])
        hi = min([k for k in known if k[0] > i], default=(n, total), key=lambda k: k[0])
        t[i] = lo[1] + (hi[1] - lo[1]) * (i - lo[0]) / (hi[0] - lo[0])
    for i in range(1, n): t[i] = max(t[i], t[i - 1] + .02)
    return t

def proportional(script, pw_total, lead=0.1):
    L = [max(1, len(norm(w))) + 2 for w in script]; s = sum(L); acc, out = 0, []
    for l in L: out.append(lead + (pw_total - lead) * acc / s); acc += l
    return out

def envelope_visemes(x, sr):
    """Fallback lip-sync from loudness when no phonemes are known (espeak, external recording)."""
    hop = int(sr * .05); out = []
    for i in range(0, len(x), hop):
        e = float(np.sqrt(np.mean(x[i:i + hop] ** 2)) if len(x[i:i + hop]) else 0)
        s = "X" if e < .02 else ("C" if e < .06 else ("E" if e < .12 else "A"))
        if not out or out[-1][1] != s: out.append([round(i / sr, 3), s])
    return out

# ---------- main ----------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("vdir"); ap.add_argument("--voice", default="fr_FR-siwis-medium")
    ap.add_argument("--ls", type=float, default=1.08); ap.add_argument("--pause", type=float, default=.35)
    ap.add_argument("--speaker", type=int, default=None); ap.add_argument("--noise", type=float, default=.667)
    ap.add_argument("--noise-w", type=float, default=.8); ap.add_argument("--engine", default="piper")
    ap.add_argument("--check", action="store_true"); ap.add_argument("--whisper", default="small")
    a = ap.parse_args()
    vdir = pathlib.Path(a.vdir); cache = vdir / "voice"; cache.mkdir(exist_ok=True)
    meta_voice = {}
    m = re.search(r"/\*META(.*?)META\*/", (vdir / "episode.js").read_text(encoding="utf-8"), re.S)
    if m: meta_voice = json.loads(m.group(1)).get("voice", {})
    for k, v in meta_voice.items():  # per-episode overrides from META "voice": {voice, ls, pause, speaker}
        if k in ("voice", "ls", "pause", "speaker"): setattr(a, k, v)
    load_lexicon(meta_voice.get("lexicon"))
    cues = json.loads(subprocess.run(["node", str(LAB / "tools/cues.mjs"), str(vdir / "episode.js")], capture_output=True, text=True, check=True).stdout)
    cast = meta_voice.get("cast", {})  # who -> {voice, ls, speaker}: one voice per speaking character
    ENG = {}
    def engine_for(who):
        c = {"voice": a.voice, "ls": a.ls, "speaker": a.speaker, **cast.get(who or "", {})}
        k = json.dumps(c, sort_keys=True)
        if k not in ENG:
            e = None
            if a.engine == "piper":
                try: e = Piper(c["voice"], c["ls"], a.pause, c["speaker"], a.noise, a.noise_w)
                except Exception as ex: print(f"[voice] piper indisponible ({ex}) -> repli espeak-ng", file=sys.stderr)
            if e is None:
                try: e = Espeak()
                except Exception as ex: sys.exit(f"[voice] aucune synthèse vocale ({ex}) : pas de timing.json, le moteur garde 2,6 mots/s")
            ENG[k] = (e, c)
        return ENG[k]
    eng, _ = engine_for(None)
    settings = {"lex": hashlib.sha1(json.dumps(LEX, sort_keys=True).encode()).hexdigest()[:8], "engine": eng.name, "ls": a.ls, "pause": a.pause, "speaker": a.speaker, "noise": a.noise, "noise_w": a.noise_w}
    out = {"engine": eng.name, "settings": settings, "cues": {}}
    report = {"engine": eng.name, "parts": [], "align": {}}
    total_words = total_speech = 0.0
    for c in cues:
        parts = [p.strip() for p in c["say"].split("|")]
        cp = []; eng, cconf = engine_for(c.get("who"))
        for pi, text in enumerate(parts):
            key = hashlib.sha1(json.dumps([settings, cconf, eng.name, text], ensure_ascii=False).encode()).hexdigest()[:12]
            wavp, js = cache / f"{key}.wav", cache / f"{key}.json"
            if wavp.exists() and js.exists():
                info = json.loads(js.read_text()); cp.append(info); continue
            x, sr, al, pw = eng.synth(text)
            sw = words(text); method = None; wt = None
            if pw is not None:
                counts = [eng.count_words(w) for w in sw]
                if sum(counts) == len(pw):
                    wt, k = [], 0
                    for n in counts: wt.append([pw[k][0], pw[k + n - 1][1]]); k += n
                    method = "phonemes"
            if wt is None:
                total = len(x) / sr
                try:
                    hyp = whisper_words(x, sr, a.whisper, prompt=text)
                    st = fill(align_chars(sw, hyp), total); method = "whisper"
                except Exception as e:
                    st = proportional(sw, total); method = "proportional"
                wt = [[st[i], (st[i + 1] if i + 1 < len(st) else total) - .02] for i in range(len(st))]
            vis = visemes_from(al, sr) if al else envelope_visemes(x, sr)
            y = np.interp(np.linspace(0, len(x), int(len(x) * SR_OUT / sr), endpoint=False), np.arange(len(x)), x)
            with wave.open(str(wavp), "w") as w:
                w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR_OUT); w.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())
            info = {"wav": f"voice/{key}.wav", "text": text, "dur": round(len(x) / sr, 3), "align": method,
                    "words": [[round(p, 3), round(q, 3)] for p, q in wt], "vis": vis}
            js.write_text(json.dumps(info, ensure_ascii=False)); cp.append(info)
        out["cues"][c["id"]] = {"parts": cp}
        for p in cp:
            report["align"][p["align"]] = report["align"].get(p["align"], 0) + 1
            total_speech += p["dur"]
        total_words += len(words(c.get("sub") or c["say"]))  # words as read (a number = one word)
    out["wpm"] = round(total_words / max(1e-6, total_speech) * 60, 1)
    (vdir / "timing.json").write_text(json.dumps(out, ensure_ascii=False))
    print(f"[voice] {eng.name} | {sum(len(c['parts']) for c in out['cues'].values())} parties | alignement {report['align']} | débit {out['wpm']} mots/min (mots du sous-titre / durée des voix)")
    if a.check: check(out, vdir, a.whisper)

def cmp_tokens(s):
    """Tokens for the intelligibility check: no accents, apostrophes/hyphens split, digits spelled out."""
    try:
        from num2words import num2words
    except ImportError: num2words = None
    s = re.sub(r"[’'\-]", " ", s.lower())
    if num2words:
        s = re.sub(r"\b(\d+)(?:e|ème|eme)\b", lambda m: num2words(int(m.group(1)), lang="fr", to="ordinal"), s)
        s = re.sub(r"\d+", lambda m: num2words(int(m.group(0)), lang="fr"), s)
        s = s.replace("-", " ")
    return [t for t in (norm(w) for w in s.split()) if t]

def same(a, b):
    import difflib
    return a == b or difflib.SequenceMatcher(None, a, b).ratio() >= .8

def check(out, vdir, size):
    """Whisper listens to every part WITHOUT the script: words it mishears are words a viewer may mishear."""
    import difflib, collections
    rows, bad, miss = [], [], collections.Counter()
    for cid, c in out["cues"].items():
        for p in c["parts"]:
            with wave.open(str(vdir / p["wav"])) as w: x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
            hyp = " ".join(w[0] for w in whisper_words(x, SR_OUT, size))
            ref, got = cmp_tokens(p["text"]), cmp_tokens(hyp)
            sm = difflib.SequenceMatcher(None, ref, got, autojunk=False); errs, n_err = [], 0
            for op, i1, i2, j1, j2 in sm.get_opcodes():
                if op == "equal": continue
                r, g = ref[i1:i2], got[j1:j2]
                if op == "replace" and len(r) == len(g) and all(same(u, v) for u, v in zip(r, g)): continue
                if "".join(r) == "".join(g): continue  # same letters, different word split
                if r and all(w in LEX for w in r): continue  # respelled foreign words: listen to them, not scored
                n_err += max(len(r), len(g)); errs.append([" ".join(r), " ".join(g)])
                for w in r: miss[w] += 1
            wer = n_err / max(1, len(ref))
            rows.append({"cue": cid, "wer": round(wer, 3), "heard": hyp.strip(), "errors": errs})
            if wer > .2: bad.append((cid, round(wer, 2), errs[:4]))
    mean = float(np.mean([r["wer"] for r in rows])) if rows else 0
    rep = {"engine": out["engine"], "wer_mean": round(mean, 3), "to_fix": bad, "often_misheard": miss.most_common(15), "parts": rows}
    (vdir / "voice_check.json").write_text(json.dumps(rep, ensure_ascii=False, indent=1))
    print(f"[voice] contrôle Whisper : WER moyen {mean*100:.1f} % ; parties à revoir (WER > 20 %) : {len(bad)}")
    for b in bad: print("   ", b)
    if miss: print("    mots souvent mal entendus :", ", ".join(f"{w}×{n}" for w, n in miss.most_common(10)))

if __name__ == "__main__":
    main()
