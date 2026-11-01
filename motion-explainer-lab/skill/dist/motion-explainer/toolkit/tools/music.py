#!/usr/bin/env python3
"""Original background music, generated offline (no sample, no licence question): chord progression by mood,
soft pad + mallet arpeggio + sub bass + light percussion. The arrangement follows the episode structure:
sparse on the hook, fuller in the mechanism scenes, a cadence at the end; it drops out during "devinez"
silences and lifts at each reveal. Used by tools/audio.py; can also run alone to audition a mood.

Usage: music.py out.wav --dur 150 [--mood curious|wonder|tense|warm] [--bpm 84] [--key D] [--scenes 0,20,45] [--guess 30:31.5]
Replaceable by any royalty-free file: audio.py --music path/to/track.mp3 (credit it in the footer)."""
import argparse, wave
import numpy as np
from scipy.signal import lfilter

SR = 44100
NOTES = {"C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7, "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11}
# chords as semitone offsets from the key's root (one chord per bar)
MOODS = {
    "curious": {"prog": [[0, 4, 7, 11], [9, 12, 16, 19], [5, 9, 12, 16], [7, 11, 14, 17]], "bpm": 88, "perc": .8},   # Imaj7 vi7 IVmaj7 V7
    "wonder":  {"prog": [[0, 4, 7, 14], [4, 7, 11, 14], [5, 9, 12, 16], [5, 8, 12, 15]], "bpm": 76, "perc": .4},    # I iii IV iv
    "tense":   {"prog": [[0, 3, 7, 10], [8, 12, 15, 19], [3, 7, 10, 14], [10, 14, 17, 21]], "bpm": 92, "perc": 1.0},  # i VI III VII
    "warm":    {"prog": [[0, 4, 7, 14], [7, 11, 14, 19], [9, 12, 16, 21], [5, 9, 12, 16]], "bpm": 80, "perc": .6},    # I V vi IV
}

def add(buf, i, x):
    j = min(len(buf), i + len(x))
    if j > i >= 0: buf[i:j] += x[:j - i]

def hz(midi): return 440 * 2 ** ((midi - 69) / 12)

def adsr(n, a, r, sustain=1.0):
    e = np.full(n, sustain, np.float32); ka, kr = min(n, int(a * SR)), min(n, int(r * SR))
    if ka: e[:ka] = np.linspace(0, sustain, ka)
    if kr: e[-kr:] *= np.linspace(1, 0, kr) ** 1.5
    return e

def lowpass(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); return lfilter([1 - a], [1, -a], x).astype(np.float32)

def render(dur, mood="curious", bpm=None, key="D", scenes=(), guess=(), seed=3):
    M = MOODS[mood]; bpm = bpm or M["bpm"]; beat = 60 / bpm; bar = 4 * beat
    N = int((dur + 3) * SR); rng = np.random.default_rng(seed)
    pad, arp, bass, perc = (np.zeros(N, np.float32) for _ in range(4))
    root = 50 + NOTES.get(key, 2)  # around D3
    scenes = sorted(scenes) or [0.0]
    def section(t):  # 0 = intro (first scene), 1 = body, 2 = last scene
        k = sum(1 for s in scenes if s <= t + 1e-3) - 1
        return 0 if k <= 0 else (2 if k >= len(scenes) - 1 else 1)
    nbars = int(np.ceil((dur + 2) / bar))
    for b in range(nbars):
        t0 = b * bar; ch = M["prog"][b % len(M["prog"])]; sec = section(t0)
        last = t0 + bar >= dur - .5
        if last: ch = M["prog"][0]
        # pad: 3 slightly detuned partial stacks per chord tone, slow attack, overlaps the next bar
        n = int((bar + 1.2) * SR); tt = np.arange(n) / SR; i0 = int(t0 * SR)
        seg = np.zeros(n, np.float32)
        for k, iv in enumerate(ch):
            f = hz(root + 12 + iv)
            for det in (-.0035, 0, .0035):
                ph = 2 * np.pi * f * (1 + det) * tt + rng.uniform(0, 6.28)
                seg += (np.sin(ph) + .35 * np.sin(2 * ph) + .15 * np.sin(3 * ph)) * (.9 if k else 1)
        seg *= adsr(n, .9, 1.4, 1) * (.010 if sec == 0 else .013)
        add(pad, i0, seg)
        # bass: root on beats 1 and 3 (body and outro)
        if sec > 0 or b % 2 == 1:
            for bt in (0, 2):
                n = int(beat * 1.8 * SR); tt = np.arange(n) / SR; f = hz(root - 12 + ch[0])
                x = (np.sin(2 * np.pi * f * tt) + .25 * np.sin(4 * np.pi * f * tt)) * adsr(n, .02, .6, 1) * .11
                i = int((t0 + bt * beat) * SR); add(bass, i, x)
        # mallet arpeggio on eighths (denser in the body)
        pattern = [0, 2, 1, 3, 2, 1, 3, 2] if sec == 1 else [0, None, 2, None, 1, None, 3, None]
        if sec == 0 and b < 1: pattern = [0, None, None, None, 2, None, None, None]
        for e, ix in enumerate(pattern):
            if ix is None: continue
            f = hz(root + 24 + ch[ix % len(ch)]); n = int(.9 * SR); tt = np.arange(n) / SR
            v = .045 * (1.0 if e % 4 == 0 else .7) * rng.uniform(.8, 1.05)
            x = (np.sin(2 * np.pi * f * tt) * np.exp(-tt * 5) + .25 * np.sin(2 * np.pi * f * 4.01 * tt) * np.exp(-tt * 18)) * v
            x[:40] *= np.linspace(0, 1, 40)
            i = int((t0 + e * beat / 2) * SR); add(arp, i, x)
        # light percussion: soft kick on 1 and 3, shaker on off-beats (body only)
        if sec == 1 and M["perc"] > 0:
            for bt in (0, 2):
                n = int(.25 * SR); tt = np.arange(n) / SR; f = 90 * np.exp(-tt * 18) + 45
                x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 14) * .16 * M["perc"]
                i = int((t0 + bt * beat) * SR); add(perc, i, x)
            for e in range(8):
                if e % 2 == 0: continue
                n = int(.06 * SR); x = lowpass(rng.standard_normal(n).astype(np.float32), 7000) - lowpass(rng.standard_normal(n).astype(np.float32), 2500)
                x = lowpass(x, 9000) * np.exp(-np.arange(n) / SR * 70) * .012 * M["perc"]
                i = int((t0 + e * beat / 2) * SR); add(perc, i, x)
    pad = lowpass(pad, 1800)
    mix = pad + arp + bass + perc
    # transitions: a soft swell into each new scene
    for s in scenes[1:]:
        n = int(1.2 * SR); x = lowpass(lowpass(lowpass(rng.standard_normal(n).astype(np.float32), 900), 900), 900) * np.linspace(0, 1, n) ** 3 * .06
        i = int(max(0, s - 1.2) * SR); add(mix, i, x)
    # "devinez": music drops out, comes back with the reveal
    g = np.ones(N, np.float32)
    for a, b in guess:
        i, j = int(a * SR), int(b * SR); fade = int(.25 * SR)
        g[max(0, i - fade):i] = np.minimum(g[max(0, i - fade):i], np.linspace(1, .08, i - max(0, i - fade)))
        g[i:j] = .08; k = min(N, j + int(.4 * SR)); g[j:k] = np.linspace(.08, 1, k - j)
    mix *= g
    # global fade in / out
    fi, fo = int(1.5 * SR), int(3 * SR); e = int((dur + 1) * SR)
    mix[:fi] *= np.linspace(0, 1, fi); mix[e - fo:e] *= np.linspace(1, 0, fo); mix[e:] = 0
    return mix[:int(dur * SR) + SR]

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("out"); ap.add_argument("--dur", type=float, default=60)
    ap.add_argument("--mood", default="curious"); ap.add_argument("--bpm", type=float); ap.add_argument("--key", default="D")
    ap.add_argument("--scenes", default="0,15,30,45"); ap.add_argument("--guess", default="")
    a = ap.parse_args()
    sc = [float(x) for x in a.scenes.split(",") if x]
    gs = [tuple(map(float, g.split(":"))) for g in a.guess.split(",") if g]
    x = render(a.dur, a.mood, a.bpm, a.key, sc, gs); x = x / max(1e-6, np.abs(x).max()) * .8
    with wave.open(a.out, "w") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())
    print(a.out)

if __name__ == "__main__":
    main()
