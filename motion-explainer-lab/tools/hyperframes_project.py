#!/usr/bin/env python3
"""Turn a built episode (versions/<id>/index.html + soundtrack.mp3) into a HyperFrames project, so the HyperFrames CLI
can check it (layout, contrast, runtime) and render it (BeginFrame capture, audio mux) without touching the episode.

The engine is exposed as a seekable timeline: window.__timelines.main.seek(t) -> __mx.render(t). The interactive
player's wall-clock loop (requestAnimationFrame, performance.now) is neutralised in the copy: it never runs in a render.

Usage: hyperframes_project.py versions/<id> <out_dir>
Then:  cd <out_dir> && HYPERFRAMES_NO_TELEMETRY=1 npx hyperframes@0.9.0 check --json
       HYPERFRAMES_NO_TELEMETRY=1 npx hyperframes@0.9.0 render --fps 24 --workers 4 --quality looks -o video.mp4
Measured on v7-c14 (2:36, 4 cores): identical frames to tools/export.mjs; see rnd/animation/RESULTS.md for timings."""
import json, pathlib, re, shutil, sys

ADAPTER = '''
<audio id="hf-sound" class="clip" src="soundtrack.mp3" data-start="0" data-duration="{D}" data-track-index="9"></audio>
<script>
/* HyperFrames adapter: the motion-explainer engine as a seekable composition timeline. */
(function () {{
  __mx.exportMode(1920, true);
  const D = __mx.duration; let cur = 0;
  const tl = {{ seek(t) {{ cur = t; __mx.render(t); return tl; }}, time(t) {{ return t === undefined ? cur : tl.seek(t); }},
    totalTime(t) {{ return tl.time(t); }}, duration() {{ return D; }}, totalDuration() {{ return D; }},
    progress(p) {{ return p === undefined ? cur / D : tl.seek(p * D); }}, globalTime(t) {{ return t === undefined ? cur : t; }},
    pause() {{ return tl; }}, play() {{ return tl; }}, paused() {{ return true; }}, isActive() {{ return false; }},
    getChildren() {{ return []; }}, eventCallback() {{ return tl; }}, kill() {{ }}, invalidate() {{ return tl; }},
    timeScale() {{ return 1; }}, render(t) {{ return tl.seek(t); }}, startTime() {{ return 0; }}, endTime() {{ return D; }},
    iteration() {{ return 1; }}, reversed() {{ return false; }}, vars: {{}}, labels: {{}}, data: {{}} }};
  window.__timelines = window.__timelines || {{}}; window.__timelines.main = tl; tl.seek(0);
}})();
</script>
'''

def main(vdir, out):
    vdir, out = pathlib.Path(vdir), pathlib.Path(out); out.mkdir(parents=True, exist_ok=True)
    D = json.loads((vdir / "meta.json").read_text())["duration"]  # written by tools/export.mjs (META_ONLY=1 is enough)
    s = (vdir / "index.html").read_text(encoding="utf-8")
    s = re.sub(r'<audio id="snd"[^>]*></audio>', "", s)                      # the player's embedded soundtrack
    s = s.replace("requestAnimationFrame(loop)", "0").replace("performance.now()", "0")  # player loop: unused in a render
    root = f' data-composition-id="main" data-start="0" data-duration="{D:.3f}" data-width="1920" data-height="1080"'
    if '<div class="app">' not in s: sys.exit("page sans <div class=\"app\"> : construire avec tools/build.py")
    s = s.replace('<div class="app">', '<div class="app"' + root + '>', 1)
    s = s.replace("<script>boot(EP);</script>", "<script>boot(EP);</script>" + ADAPTER.format(D=f"{D:.3f}"))
    i = s.index('<div class="app"')
    s = '<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n' + s[:i] + "</head>\n<body>\n" + s[i:] + "\n</body>\n</html>\n"
    (out / "index.html").write_text(s, encoding="utf-8")
    if (vdir / "soundtrack.mp3").exists(): shutil.copy(vdir / "soundtrack.mp3", out / "soundtrack.mp3")
    (out / "package.json").write_text(json.dumps({"name": vdir.name, "private": True, "type": "module"}, indent=2))
    print(f"{out}/index.html ({len(s)//1024} Ko), durée {D:.1f} s")

if __name__ == "__main__":
    main(*sys.argv[1:3])
