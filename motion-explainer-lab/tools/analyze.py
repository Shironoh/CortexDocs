#!/usr/bin/env python3
"""Post-process qa_raw.json: empty-area, frozen windows, contact sheets, metric summary -> qa.json + QA.md"""
import json, sys, pathlib, collections
from PIL import Image, ImageDraw, ImageFont
import numpy as np

out = pathlib.Path(sys.argv[1]); raw = json.load(open(out / 'qa_raw.json'))
meta, caps, frozen = raw['meta'], raw['caps'], raw['frozen']
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
except Exception: font = ImageFont.load_default()

BG = np.array([11, 26, 58], np.float32)  # #0B1A3A
def empty_frac(img):
    # 'vide' = bloc 10x10 uniforme ET proche de la couleur de fond (ou plus sombre) — un aplat coloré n'est pas vide
    a = np.asarray(img.convert('RGB').resize((320, 180)), dtype=np.float32)
    b = a.reshape(18, 10, 32, 10, 3).transpose(0, 2, 1, 3, 4).reshape(18, 32, 100, 3)
    flat = b.std(axis=2).max(axis=2) < 4.0; mean = b.mean(axis=2)
    near = (np.linalg.norm(mean - BG, axis=2) < 26) | (mean.mean(axis=2) < 22)
    return float((flat & near).mean())

MOTION_TOLERATED = {'cut', 'focus_offcenter', 'focus_small', 'subj_cut', 'subj_in_band'}  # normal pendant un trajet de caméra
for c in caps:
    img = Image.open(out / c['file']); c['empty'] = round(empty_frac(img), 3)
    if c['empty'] > .40: c['issues'].append({'k': 'empty', 'v': c['empty']})
    if c.get('moving'): c['issues'] = [k for k in c['issues'] if k['k'] not in MOTION_TOLERATED]

# frozen windows
guess = meta['guess']; prev = None; static = []
for f in frozen:
    g = np.asarray(Image.open(out / f['file']).convert('L'), dtype=np.float32)
    if prev is not None: static.append((f['t'], float(np.abs(g - prev).mean()) < 0.35))
    prev = g
wins = []; run = None
for t, st in static:
    if st and run is None: run = t - .5
    if not st and run is not None: wins.append((run, t - .5)); run = None
if run is not None: wins.append((run, static[-1][0]))
def in_guess(a, b): return any(a >= g0 - .6 and b <= g1 + .6 for g0, g1 in guess)
def cue_at(t): return next((c['id'] for c in meta['cues'] if c['start'] <= t < c['end']), '-')
frozen_bad = [(round(a, 1), round(b, 1), cue_at(a)) for a, b in wins if b - a > 2.5 and not in_guess(a, b)]

# contact sheets per scene
(out / 'sheets').mkdir(exist_ok=True)
by_sc = collections.OrderedDict()
for c in caps: by_sc.setdefault(c['sc'], []).append(c)
W, H = 426, 240
for sc, lst in by_sc.items():
    rows = (len(lst) + 2) // 3; sheet = Image.new('RGB', (W * 3, rows * (H + 30)), (5, 11, 30)); d = ImageDraw.Draw(sheet)
    for i, c in enumerate(lst):
        im = Image.open(out / c['file']).resize((W, H)); x, y = (i % 3) * W, (i // 3) * (H + 30)
        sheet.paste(im, (x, y + 30)); flag = '!' if c['issues'] else ''
        d.text((x + 6, y + 4), f"{c['cue']} {int(c['q']*100)}% {flag}{','.join(sorted(set(k['k'] for k in c['issues'])))[:28]}", fill=(255, 183, 3) if flag else (200, 210, 230), font=font)
    sheet.save(out / 'sheets' / f'{sc}.jpg', quality=82)

# metrics
cnt = collections.Counter(k['k'] for c in caps for k in c['issues'])
dur = meta['duration']; say_words = sum(len(s.replace('|', ' ').split()) for s in meta['says'])
# variété de plans : nombre d'échelles distinctes par scène (zooms séparés d'un facteur >= 1,35)
zl = collections.defaultdict(list)
for cm in meta['cams']:
    sc = next((s['id'] for s in reversed(meta['scenes']) if cm['t'] + cm['d'] >= s['start'] - 1.3), meta['scenes'][0]['id'])
    zl[sc].append(cm['z'])
zooms = {}
for sc, zs in zl.items():
    zs = sorted(zs); cl = [zs[0]]
    for z in zs[1:]:
        if z / cl[-1] >= 1.35: cl.append(z)
    zooms[sc] = [round(z, 2) for z in cl]
scn = {s['id']: s for s in meta['scenes']}
def chars_in(sc, name):
    s = scn[sc]; n = 0
    for ch in meta['chars']:
        if ch['name'] not in name: continue
        n += sum(1 for t, _ in ch['poses'] if s['start'] - .5 <= t <= s['end']) + sum(1 for t in ch['walks'] if s['start'] - 1.5 <= t <= s['end'])
    return n
analyst_scenes = sum(1 for s in meta['scenes'] if chars_in(s['id'], ('analyste', 'hero')) > 0)
villain_scenes = sum(1 for s in meta['scenes'] if any(ch['name'] in ('attaquant', 'foe') and ch['pop'] is not None and ch['pop'] <= scn[s['id']]['end'] and ch['pop'] >= scn[s['id']]['start'] - 2 for ch in meta['chars']))
# audit de la feuille de beats (sans rendu) : trous > 2,5 s entre deux marques, hors silences devinez, et quota par cue
marks = sorted(set(round(m, 2) for m in meta['marks']))
beat_gaps = []
for a_, b_ in zip(marks, marks[1:]):
    if b_ - a_ > 2.5 and not in_guess(a_ + .1, b_ - .1) and a_ < dur - 2.5: beat_gaps.append((a_, b_, cue_at(a_ + .01)))
quota_miss = []
import math
for c in meta['cues']:
    n = sum(1 for m in marks if c['start'] - .3 <= m < c['end']); q = math.ceil(c['dur'] / 2)
    if n < q: quota_miss.append((c['id'], n, q))
summary = {
    'beat_gaps_gt2_5s': beat_gaps, 'cues_under_beat_quota': quota_miss,
    'moving_captures': sum(1 for c in caps if c.get('moving')),
    'duration_s': round(dur, 1), 'cues': len(meta['cues']), 'scenes': len(meta['scenes']), 'say_words': say_words,
    'words_per_min': round(say_words / dur * 60, 1), 'captures': len(caps), 'captures_with_issue': sum(1 for c in caps if c['issues']),
    'issues': dict(cnt), 'frozen_windows_gt2_5s': frozen_bad, 'avg_text_blocks': round(sum(c['ntext'] for c in caps) / len(caps), 2),
    'avg_onscreen_words': round(sum(c['words'] for c in caps) / len(caps), 2), 'avg_empty': round(sum(c['empty'] for c in caps) / len(caps), 3),
    'shot_values_per_scene': zooms, 'scenes_lt3_shot_values': [k for k, v in zooms.items() if len(v) < 3],
    'analyst_acting_scenes': f"{analyst_scenes}/{len(meta['scenes'])}", 'villain_scenes': f"{villain_scenes}/{len(meta['scenes'])}",
    'js_errors': raw['errors'], 'mobile_hscroll': raw['mobileHScroll'], 'sound_events': meta['events'],
}
json.dump({'summary': summary, 'captures': caps}, open(out / 'qa.json', 'w'), indent=1, ensure_ascii=False)
L = [f"# QA automatique — {out.name}", '', '```json', json.dumps(summary, indent=1, ensure_ascii=False), '```', '', '## Captures signalées', '']
for c in caps:
    if c['issues']: L.append(f"- `{c['cue']}` {int(c['q']*100)} % : " + '; '.join(f"{k['k']}" + (f"({k.get('v')})" if 'v' in k else '') + (f" « {k['s']} »" if 's' in k else '') for k in c['issues']))
(out / 'QA.md').write_text('\n'.join(L), encoding='utf-8')
print(json.dumps(summary, indent=1, ensure_ascii=False))
