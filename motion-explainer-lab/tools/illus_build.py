#!/usr/bin/env python3
"""Assemble an illustrated (HyperFrames) episode from the shared shell and the episode's own parts.

  src/illus/shell.html          layers, gradients, helpers (plaque, ticket, cloudIsland, camera, bell, keyIcon…),
                                parallax camera with non-overlapping moves, Rive characters, subtitles, sound list
  versions/<id>/words.json      tools/timeline.py (real word times)
  src/illus/props.js            shared props (pc, rack, laptop, control tower, wall, balloon, sealed box, key card, book, terminal, tunnels…)
  versions/<id>/parts/world.js  the world: zones, props, beats keyed on T(cue, word)
  versions/<id>/parts/camera.js camTo(t, d, x, y, s) keyframes
  versions/<id>/parts/chars.js  window.__CHARS = {thief, hero}: anchors [group, t0, t1, dir, scale] + params(t)

Writes versions/<id>/index.html and copies the Rive runtime and characters next to it if they are missing.
Usage: illus_build.py versions/<id> "Title" """
import json, math, pathlib, shutil, sys

LAB = pathlib.Path(__file__).resolve().parent.parent

def main(vdir, title):
    v = pathlib.Path(vdir); shell = (LAB / 'src/illus/shell.html').read_text(encoding='utf-8')
    words = (v / 'words.json').read_text(encoding='utf-8'); dur = math.ceil(json.loads(words)['duration'])
    part = lambda n: (v / 'parts' / n).read_text(encoding='utf-8')
    out = (shell.replace('__TITLE__', title).replace('__DUR__', str(dur)).replace('__WORDS__', words.replace('</', '<\\/'))
           .replace('/* __WORLD__ */', (LAB / 'src/illus/props.js').read_text(encoding='utf-8') + '\n' + part('world.js')).replace('/* __CAMERA__ */', part('camera.js')).replace('/* __CHARS__ */', part('chars.js')))
    (v / 'index.html').write_text(out, encoding='utf-8')
    src = LAB / 'versions/v8-llmjacking-illustre'
    for f in ['thief.riv', 'analyst.riv']:
        if not (v / f).exists(): shutil.copy(src / f, v / f)
    if not (v / 'lib/rive').exists() and (src / 'lib/rive').exists(): shutil.copytree(src / 'lib/rive', v / 'lib/rive')
    print(f'[illus] {v}/index.html, {dur} s, {len(out.splitlines())} lignes')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else v.name)
