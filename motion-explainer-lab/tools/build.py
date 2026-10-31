#!/usr/bin/env python3
"""Assemble a self-contained page: versions/vN/index.html from src/ + versions/vN/episode.js.
The engine/player/css used are snapshotted into versions/vN/ so each version stays reproducible."""
import json, pathlib, re, shutil, sys

LAB = pathlib.Path(__file__).resolve().parent.parent

def main(ver):
    vdir = LAB / "versions" / ver
    src = LAB / "src"
    # snapshot engine sources next to the episode (frozen per version)
    for f in ("engine.js", "icons.js", "player.js", "style.css", "shell.html"):
        shutil.copy(src / f, vdir / f"_{f}")
    ep = (vdir / "episode.js").read_text(encoding="utf-8")
    meta = json.loads(re.search(r"/\*META(.*?)META\*/", ep, re.S).group(1))
    html = (src / "shell.html").read_text(encoding="utf-8")
    rep = {
        "{{TITLE}}": meta["title"], "{{H1}}": meta["h1"], "{{EYEBROW}}": meta["eyebrow"],
        "{{CSS}}": (src / "style.css").read_text(encoding="utf-8"),
        "{{ENGINE}}": (src / "engine.js").read_text(encoding="utf-8") + "\n" + (src / "icons.js").read_text(encoding="utf-8"),
        "{{PLAYER}}": (src / "player.js").read_text(encoding="utf-8"),
        "{{EPISODE}}": ep, "{{FOOTER}}": meta.get("footer", ""),
    }
    for k, v in rep.items():
        if k not in html:
            sys.exit(f"placeholder manquant : {k}")
        html = html.replace(k, v)
    (vdir / "index.html").write_text(html, encoding="utf-8")
    print(f"{vdir/'index.html'} : {len(html)/1024:.0f} Ko")

if __name__ == "__main__":
    main(sys.argv[1])
