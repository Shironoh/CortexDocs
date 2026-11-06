#!/usr/bin/env python3
"""Cue timeline for illustrated (HyperFrames) episodes, without the lab engine.

Reads versions/<id>/episode.js (cues) and timing.json (tools/voice.py) and lays the cues out exactly like
src/engine.js does: lead-in, voicePre before the voice, the spoken parts, a 1.5 s "devinez" silence between
the two parts of a guess cue, a breath after each cue (0.45 s, or cue.breath), 2.2 s minimum per cue, tail.

Writes:
  words.json  absolute word times for the composition: {duration, scenes, guess, cues:[{id, sc, start, end, sub,
              guess, pauseAt, who, words:[[word, t0, t1]...], vis:[[t, viseme]...] (speaking characters only)}]}
  meta.json   the same timeline in the format tools/audio.py reads (cues[].parts[] with t/dur/wav); events are
              left empty: fill them with the composition's sound list (window.__SFX) before running audio.py.

Usage: timeline.py versions/<id> [--lead 0.6] [--tail 2.2]"""
import argparse, json, pathlib, re, subprocess

LAB = pathlib.Path(__file__).resolve().parent.parent
GUESS_PAUSE, PRE, BREATH, MIN_CUE = 1.5, .2, .45, 2.2

def words(s):
    return [w for w in s.replace('|', ' ').split() if re.search(r"[^\W_]", w) or re.search(r"\d", w)]

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('vdir'); ap.add_argument('--lead', type=float, default=.6); ap.add_argument('--tail', type=float, default=2.2)
    a = ap.parse_args(); vdir = pathlib.Path(a.vdir)
    cues = json.loads(subprocess.run(['node', str(LAB / 'tools/cues.mjs'), str(vdir / 'episode.js')], capture_output=True, text=True, check=True).stdout)
    src = (vdir / 'episode.js').read_text(encoding='utf-8')
    scenes = json.loads(subprocess.run(['node', '-e', "const fs=require('fs');const EP=new Function(fs.readFileSync(process.argv[1],'utf8')+';return EP;')();console.log(JSON.stringify(EP.scenes))", str(vdir / 'episode.js')], capture_output=True, text=True, check=True).stdout)
    tim = json.loads((vdir / 'timing.json').read_text(encoding='utf-8'))['cues']
    t0 = a.lead; W, M = [], []
    for c in cues:
        tm = tim[c['id']]; parts = c['say'].split('|'); assert len(parts) == len(tm['parts']), c['id']
        t = t0 + PRE; pause = None; ws, vis, mp = [], [], []
        for i, (txt, p) in enumerate(zip(parts, tm['parts'])):
            if i == 1: pause = t + .1; t = pause + GUESS_PAUSE
            toks = words(txt)
            if len(toks) != len(p['words']): print(f"[timeline] {c['id']} part {i}: {len(toks)} mots écrits, {len(p['words'])} horodatés")
            ws += [[w, round(t + x[0], 3), round(t + x[1], 3)] for w, x in zip(toks, p['words'])]
            if c.get('who'): vis += [[round(t + v[0], 3), v[1]] for v in p.get('vis', [])]
            mp.append({'t': round(t, 3), 'dur': p['dur'], 'wav': p['wav'], 'vis': p.get('vis', [])})
            t += p['dur']
        breath = c['breath'] if c.get('breath') is not None else BREATH
        end = t0 + max(MIN_CUE, t - t0 + breath)
        guess = len(parts) > 1
        W.append({'id': c['id'], 'sc': c['sc'], 'start': round(t0, 3), 'end': round(end, 3), 'sub': c['sub'], 'guess': guess,
                  'pauseAt': round(pause, 3) if pause else None, 'who': c.get('who'), 'words': ws, 'vis': vis})
        M.append({'id': c['id'], 'start': t0, 'end': end, 'say': c['say'], 'guess': guess, 'pauseAt': pause, 'parts': mp, 'who': c.get('who')})
        t0 = end
    dur = round(t0 + a.tail, 3)
    sc = [{'id': s['id'], 'start': next(c['start'] for c in W if c['sc'] == s['id']), 'title': s['title']} for s in scenes]
    guess = [[c['pauseAt'], round(c['pauseAt'] + GUESS_PAUSE, 3)] for c in W if c['guess']]
    (vdir / 'words.json').write_text(json.dumps({'duration': dur, 'scenes': sc, 'guess': guess, 'cues': W}, ensure_ascii=False), encoding='utf-8')
    (vdir / 'meta.json').write_text(json.dumps({'duration': dur, 'events': [], 'guess': guess, 'scenes': sc, 'cues': M}, ensure_ascii=False), encoding='utf-8')
    print(f"[timeline] {len(W)} cues, {dur:.1f} s -> {vdir}/words.json, meta.json")
    for c in W: print(f"  {c['id']:>4} {c['start']:7.2f}-{c['end']:7.2f}  " + ' '.join(f"{w[0]}@{w[1]:.1f}" for w in c['words']))

if __name__ == '__main__':
    main()
