#!/usr/bin/env python3
"""Render a Rive CLI character frame by frame, driven by our voice pipeline (visemes + word times).
Each frame: `rive <proj> --screenshot --advance=<frames at 60 fps> --data=<param>=<value>` (deterministic).
Usage: render_lipsync.py <project_dir> <timing.json> <cue_id> <out.mp4> [fps]"""
import json, math, os, pathlib, subprocess, sys, tempfile
from concurrent.futures import ThreadPoolExecutor

proj, timing, cid, out = sys.argv[1:5]; fps = int(sys.argv[5]) if len(sys.argv) > 5 else 24
LAB = pathlib.Path(__file__).resolve().parents[2]
part = json.load(open(timing))["cues"][cid]["parts"][0]
vis, words, dur = part["vis"], part["words"], part["dur"]
OPEN = {"X": .04, "M": 0, "F": .22, "C": .38, "E": .55, "O": .8, "A": 1.0}
def mouth(t):  # viseme target, eased over 45 ms
    cur, prev, t0 = "X", "X", 0
    for a, s in vis:
        if t >= a: prev, cur, t0 = cur, s, a
    k = min(1, (t - t0) / .045); return OPEN[prev] + (OPEN[cur] - OPEN[prev]) * (k * k * (3 - 2 * k))
def smooth(a, b, t, d=.35):
    k = max(0, min(1, (t - a) / d)); return k * k * (3 - 2 * k)
w = lambda i: words[i][0]  # word i start
def params(t):
    eyes = 1.0
    for bt in (1.1, 3.6):  # blinks
        if bt <= t < bt + .14: eyes = .08 + .92 * abs((t - bt - .07) / .07)
    eyes *= 1 - .45 * smooth(w(7), 0, t)                     # « rien » : smug squint
    arm = smooth(w(3) - .25, 0, t) - .35 * smooth(w(5), 0, t)  # raise the key on « token »
    lean = .15 + .45 * smooth(w(6) - .2, 0, t, .5)
    return {"mouth": round(mouth(t), 3), "eyes": round(eyes, 3), "arm": round(arm, 3), "lean": round(lean, 3)}
tmp = pathlib.Path(tempfile.mkdtemp()); n = math.ceil((dur + .4) * fps)
def frame(i):
    t = i / fps; p = params(t)
    cmd = [os.path.expanduser("~/.rive/bin/rive"), proj, f"--screenshot={tmp}/f{i:04d}.png", f"--advance={max(1, round(t * 60))}"] + [f"--data={k}={v}" for k, v in p.items()]
    subprocess.run(cmd, capture_output=True, check=True)
with ThreadPoolExecutor(4) as ex: list(ex.map(frame, range(n)))
wav = LAB / "versions/v8test-llmjacking" / part["wav"]
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(fps), "-i", f"{tmp}/f%04d.png", "-i", str(wav),
                "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-c:a", "aac", "-shortest", out], check=True)
print(out, n, "frames")
