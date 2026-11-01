#!/usr/bin/env python3
"""Soundtrack: narration (WAVs from tools/voice.py placed at their exact cue times), original music
(tools/music.py) ducked under the voice, semantic sound effects from __mx.events, loudness normalisation.
Outputs soundtrack.mp3 (embedded by build.py in the interactive player) and video.mp4 (if _silent.mp4 exists).

Usage: audio.py versions/<id> [--music file.mp3|none] [--mood curious] [--no-video]
Fallback when there is no timing.json (no TTS): espeak-ng per cue, sped up to fit its slot (legacy, overruns listed)."""
import argparse, json, pathlib, re, subprocess, sys, tempfile, wave
import numpy as np
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import music as MUS

SR = 44100

def read_wav(p):
    with wave.open(str(p)) as w:
        sr, ch = w.getframerate(), w.getnchannels()
        x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    if ch == 2: x = x.reshape(-1, 2).mean(1)
    if sr != SR: x = np.interp(np.linspace(0, len(x), int(len(x) * SR / sr), endpoint=False), np.arange(len(x)), x).astype(np.float32)
    return x

def decode(path):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(path), "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768

def env(n, a=.005, r=None):
    e = np.ones(n, np.float32); ka = max(1, int(a * SR)); e[:ka] = np.linspace(0, 1, ka)
    kr = min(n, int((r if r is not None else n / SR * .8) * SR)); e[-kr:] *= np.linspace(1, 0, kr) ** 2; return e

def place(buf, sig, at):
    i = int(at * SR); j = min(len(buf), i + len(sig))
    if j > i >= 0: buf[i:j] += sig[:j - i]

def legacy_voice(meta, N, tmp, report):
    """espeak-ng fallback (no timing.json): one WAV per part, sped up to fit the cue."""
    voice = np.zeros(N, np.float32)
    v = "mb-fr4" if pathlib.Path("/usr/share/mbrola/fr4").exists() else "fr"
    for c in meta["cues"]:
        parts = [p.strip() for p in c["say"].split("|")]
        slots = [(c["start"] + .15, (c["pauseAt"] if c["guess"] else c["end"]) - .25)]
        if c["guess"]: slots.append((c["pauseAt"] + 1.5 + .05, c["end"] - .25))
        for text, (a, b) in zip(parts, slots):
            speed = 165
            while True:
                f = tmp / "v.wav"; subprocess.run(["espeak-ng", "-v", v, "-s", str(speed), "-w", str(f), text], check=True, capture_output=True)
                x = read_wav(f)
                if len(x) / SR <= b - a or speed >= 215: break
                speed += 10
            report.append({"cue": c["id"], "speed": speed, "overrun": round(max(0, len(x) / SR - (b - a)), 2)})
            place(voice, x * .9, a)
    return voice

def sfx_track(events, N):
    sfx = np.zeros(N, np.float32); rng = np.random.default_rng(7); last = {}
    for k, e in enumerate(events):
        if e["type"] in last and e["t"] - last[e["type"]] < .07: continue
        last[e["type"]] = e["t"]
        if e["type"] == "pop":
            f = 600 + 300 * ((k * 37) % 10) / 10; n = int(.08 * SR); tt = np.arange(n) / SR
            place(sfx, np.sin(2 * np.pi * f * tt * (1 + .4 * tt / .08)) * env(n, .003, .07) * .12, e["t"])
        elif e["type"] == "whoosh":
            n = int(.7 * SR); x = rng.standard_normal(n).astype(np.float32)
            y = MUS.lowpass(MUS.lowpass(x, 1200), 1200)
            place(sfx, y * np.hanning(n) * .5, e["t"])
        elif e["type"] == "reveal":  # rising chime
            for k2, f in enumerate((660, 880, 1320)):
                n = int(.35 * SR); tt = np.arange(n) / SR
                place(sfx, (np.sin(2 * np.pi * f * tt) + .3 * np.sin(4 * np.pi * f * tt)) * env(n, .004, .33) * .12, e["t"] + k2 * .08)
        elif e["type"] == "myth":  # misconception refuted: soft low buzzer
            n = int(.38 * SR); tt = np.arange(n) / SR; saw = 2 * ((110 * tt) % 1) - 1
            place(sfx, (.6 * saw + .4 * np.sin(2 * np.pi * 116 * tt)) * (1 + .5 * np.sin(2 * np.pi * 18 * tt)) * env(n, .01, .3) * .14, e["t"])
        elif e["type"] == "impact":  # consequence: dull thud
            n = int(.16 * SR); tt = np.arange(n) / SR
            place(sfx, (np.sin(2 * np.pi * 120 * tt) + .3 * np.sin(2 * np.pi * 240 * tt)) * env(n, .002, .15) * .45, e["t"])
        elif e["type"] == "tick":  # counter / typewriter tick
            n = int(.03 * SR); place(sfx, rng.standard_normal(n).astype(np.float32) * env(n, .001, .025) * .05, e["t"])
    return sfx

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("vdir"); ap.add_argument("--music", default=None)
    ap.add_argument("--mood", default=None); ap.add_argument("--no-video", action="store_true")
    a = ap.parse_args()
    out = pathlib.Path(a.vdir); meta = json.load(open(out / "meta.json")); dur = meta["duration"]; N = int(dur * SR) + SR
    ep_meta = json.loads(re.search(r"/\*META(.*?)META\*/", (out / "episode.js").read_text(encoding="utf-8"), re.S).group(1))
    mconf = ep_meta.get("music", {}); tmp = pathlib.Path(tempfile.mkdtemp()); report = []
    # 1. narration
    if all(c.get("parts") for c in meta["cues"]):
        voice = np.zeros(N, np.float32)
        for c in meta["cues"]:
            for p in c["parts"]: place(voice, read_wav(out / p["wav"]) * .95, p["t"])
        vmode = "piper (timing réel)"
    else:
        voice = legacy_voice(meta, N, tmp, report); vmode = "espeak (repli)"
    # 2. music: file given, none, or generated from the episode structure
    src = a.music or mconf.get("file")
    if src == "none": mus = np.zeros(N, np.float32)
    elif src: m = decode(out / src if (out / src).exists() else src); mus = np.zeros(N, np.float32); mus[:min(N, len(m))] = m[:N] * .5
    else:
        mus = MUS.render(dur, a.mood or mconf.get("mood", "curious"), mconf.get("bpm"), mconf.get("key", "D"),
                         [s["start"] for s in meta.get("scenes", [])], meta["guess"])
        mus = np.pad(mus, (0, max(0, N - len(mus))))[:N]
        mus = mus / max(1e-6, np.abs(mus).max()) * .5
    # duck the music under the voice (smoothed envelope, ~-12 dB while speaking)
    venv = np.convolve(np.abs(voice), np.ones(int(.25 * SR)) / int(.25 * SR), mode="same")
    duck = 1 - .72 * np.clip(venv * 25, 0, 1)
    level = mconf.get("level", .55)
    sfx = sfx_track(meta["events"], N)
    mix = voice + sfx + mus * duck * level
    mix = np.clip(mix / max(1e-6, np.abs(mix).max()) * .9, -1, 1)
    raw = tmp / "mix.wav"
    with wave.open(str(raw), "w") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
    norm = ["-af", "loudnorm=I=-16:TP=-1.5:LRA=11"]
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), *norm, "-ar", "44100", "-ac", "1", "-b:a", "96k", str(out / "soundtrack.mp3")], check=True)
    msg = f"soundtrack -> {out/'soundtrack.mp3'} | voix : {vmode}"
    if (out / "_silent.mp4").exists() and not a.no_video:
        final = out / "video.mp4"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(out / "_silent.mp4"), "-i", str(raw), *norm,
                        "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", str(final)], check=True)
        msg += f" | video -> {final}"
    if report: json.dump(report, open(out / "voice_report.json", "w"), indent=1); msg += f" | dépassements espeak : {sum(1 for r in report if r['overrun'] > 0)}"
    print(msg)

if __name__ == "__main__":
    main()
