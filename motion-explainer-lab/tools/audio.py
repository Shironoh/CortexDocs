#!/usr/bin/env python3
"""Soundtrack: espeak-ng (mbrola fr) voice per cue, synthesized SFX from events, ducked ambient pad,
loudnorm, mux with the silent video. Reports voice overruns (voice longer than its slot).
Usage: audio.py versions/vN [voice]"""
import json, subprocess, sys, pathlib, wave, tempfile
import numpy as np

SR = 44100
out = pathlib.Path(sys.argv[1]); VOICE = sys.argv[2] if len(sys.argv) > 2 else 'mb-fr4'
meta = json.load(open(out / 'meta.json')); dur = meta['duration']; N = int(dur * SR) + SR
tmp = pathlib.Path(tempfile.mkdtemp())

def tts(text, speed):
    f = tmp / 'v.wav'
    subprocess.run(['espeak-ng', '-v', VOICE, '-s', str(speed), '-w', str(f), text], check=True, capture_output=True)
    with wave.open(str(f)) as w:
        sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    if sr != SR: x = np.interp(np.linspace(0, len(x), int(len(x) * SR / sr), endpoint=False), np.arange(len(x)), x)
    nz = np.nonzero(np.abs(x) > .01)[0]
    return x[nz[0]:nz[-1] + 1] if len(nz) else x

voice = np.zeros(N, np.float32); report = []
for c in meta['cues']:
    parts = [p.strip() for p in c['say'].split('|')]
    slots = [(c['start'] + .15, (c['pauseAt'] if c['guess'] else c['end']) - .25)]
    if c['guess']: slots.append((c['pauseAt'] + 1.5 + .05, c['end'] - .25))
    for text, (a, b) in zip(parts, slots):
        avail = b - a; speed = 165; x = tts(text, speed)
        while len(x) / SR > avail and speed < 215: speed += 10; x = tts(text, speed)
        over = len(x) / SR - avail
        report.append({'cue': c['id'], 'speed': speed, 'len': round(len(x) / SR, 2), 'slot': round(avail, 2), 'overrun': round(max(0, over), 2)})
        i = int(a * SR); voice[i:i + len(x)] += x[:max(0, N - i)] * .9

t = np.arange(N) / SR
def env(n, a=.005, r=None):
    e = np.ones(n, np.float32); ka = max(1, int(a * SR)); e[:ka] = np.linspace(0, 1, ka)
    kr = int((r if r is not None else n / SR * .8) * SR); kr = min(kr, n); e[-kr:] *= np.linspace(1, 0, kr) ** 2; return e
sfx = np.zeros(N, np.float32); rng = np.random.default_rng(7)
def place(sig, at):
    i = int(at * SR); j = min(N, i + len(sig)); sfx[i:j] += sig[:j - i]
last = {}
for k, e in enumerate(meta['events']):
    if e['type'] in last and e['t'] - last[e['type']] < .07: continue
    last[e['type']] = e['t']
    if e['type'] == 'pop':
        f = 600 + 300 * ((k * 37) % 10) / 10; n = int(.08 * SR); tt = np.arange(n) / SR
        place(np.sin(2 * np.pi * f * tt * (1 + .4 * tt / .08)) * env(n, .003, .07) * .16, e['t'])
    elif e['type'] == 'whoosh':
        n = int(.7 * SR); x = rng.standard_normal(n).astype(np.float32); y = np.zeros(n, np.float32); a = 0.0
        cut = np.linspace(.02, .12, n) * np.hanning(n) + .01
        for i in range(n): a += cut[i] * (x[i] - a); y[i] = a
        place(y * np.hanning(n) * .55, e['t'])
    elif e['type'] == 'reveal':  # carillon montant
        for k2, f in enumerate((660, 880, 1320)):
            n = int(.35 * SR); tt = np.arange(n) / SR
            place((np.sin(2 * np.pi * f * tt) + .3 * np.sin(4 * np.pi * f * tt)) * env(n, .004, .33) * .14, e['t'] + k2 * .08)
    elif e['type'] == 'myth':  # idée reçue démentie : buzzer doux et grave
        n = int(.38 * SR); tt = np.arange(n) / SR; saw = 2 * ((110 * tt) % 1) - 1
        place((.6 * saw + .4 * np.sin(2 * np.pi * 116 * tt)) * (1 + .5 * np.sin(2 * np.pi * 18 * tt)) * env(n, .01, .3) * .16, e['t'])
    elif e['type'] == 'impact':
        n = int(.16 * SR); tt = np.arange(n) / SR
        place((np.sin(2 * np.pi * 120 * tt) + .3 * np.sin(2 * np.pi * 240 * tt)) * env(n, .002, .15) * .5, e['t'])
# ambient pad: detuned low sines, ducked under the voice, muted in "devinez" silences
pad = (np.sin(2 * np.pi * 110 * t) + np.sin(2 * np.pi * 110.7 * t) + .5 * np.sin(2 * np.pi * 164.8 * t)) * (.5 + .5 * np.sin(2 * np.pi * .05 * t))
pad = pad.astype(np.float32) * .035
venv = np.convolve(np.abs(voice), np.ones(4410) / 4410, mode='same'); duck = 1 - .6 * np.clip(venv * 12, 0, 1)
for a, b in meta['guess']:
    i, j = int(a * SR), int(b * SR); pad[i:j] *= np.linspace(1, 0, j - i) ** 4 * 0  # silence
mix = voice + sfx + pad * duck
mix = np.clip(mix / max(1e-6, np.abs(mix).max()) * .9, -1, 1)
st = (np.stack([mix, mix], 1) * 32767).astype(np.int16)
raw = tmp / 'mix.wav'
with wave.open(str(raw), 'w') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())
final = out / 'video.mp4'
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(out / '_silent.mp4'), '-i', str(raw), '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11',
                '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', str(final)], check=True)
json.dump(report, open(out / 'voice_report.json', 'w'), indent=1)
ov = [r for r in report if r['overrun'] > 0]
print(f"video -> {final} | voice parts {len(report)}, overruns {len(ov)}, max speed {max(r['speed'] for r in report)}")
