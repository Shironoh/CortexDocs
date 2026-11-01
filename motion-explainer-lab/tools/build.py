#!/usr/bin/env python3
"""Assemble a self-contained page: versions/<id>/index.html from src/ + versions/<id>/episode.js.
Optional inputs next to the episode: timing.json (tools/voice.py: real word timings, visemes) and
soundtrack.mp3 (tools/audio.py: voice + music + effects, played by the interactive player).
The engine/player/css used are snapshotted into versions/<id>/ so each version stays reproducible."""
import base64, json, pathlib, re, shutil, sys

LAB = pathlib.Path(__file__).resolve().parent.parent
ENGINE = ("engine.js", "icons.js", "kit.js", "kit_series.js")

def main(ver, embed_audio=True):
    vdir = LAB / "versions" / ver
    src = LAB / "src"
    for f in ENGINE + ("player.js", "style.css", "shell.html"):
        shutil.copy(src / f, vdir / f"_{f}")
    ep = (vdir / "episode.js").read_text(encoding="utf-8")
    meta = json.loads(re.search(r"/\*META(.*?)META\*/", ep, re.S).group(1))
    html = (src / "shell.html").read_text(encoding="utf-8")
    timing = vdir / "timing.json"
    tj = "null"
    if timing.exists():
        t = json.loads(timing.read_text(encoding="utf-8"))
        tj = json.dumps({"engine": t["engine"], "cues": {k: {"parts": [{x: p[x] for x in ("wav", "dur", "words", "vis")} for p in v["parts"]]} for k, v in t["cues"].items()}}, ensure_ascii=False, separators=(",", ":"))
    snd = vdir / "soundtrack.mp3"
    audio = f' src="data:audio/mpeg;base64,{base64.b64encode(snd.read_bytes()).decode()}"' if (embed_audio and snd.exists()) else ""
    rep = {
        "{{TITLE}}": meta["title"], "{{H1}}": meta["h1"], "{{EYEBROW}}": meta["eyebrow"],
        "{{CSS}}": (src / "style.css").read_text(encoding="utf-8"),
        "{{ENGINE}}": "\n".join((src / f).read_text(encoding="utf-8") for f in ENGINE),
        "{{PLAYER}}": (src / "player.js").read_text(encoding="utf-8"),
        "{{EPISODE}}": ep, "{{FOOTER}}": meta.get("footer", ""), "{{TIMING}}": tj, "{{AUDIO}}": audio,
    }
    for k, v in rep.items():
        if k not in html:
            sys.exit(f"placeholder manquant : {k}")
        html = html.replace(k, v)
    (vdir / "index.html").write_text(html, encoding="utf-8")
    print(f"{vdir/'index.html'} : {len(html)/1024:.0f} Ko | voix réelle : {'oui' if tj != 'null' else 'non (2,6 mots/s)'} | bande son intégrée : {'oui' if audio else 'non'}")

if __name__ == "__main__":
    main(sys.argv[1], "--no-audio" not in sys.argv)
