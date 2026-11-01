#!/usr/bin/env python3
"""Assemble the installable skill: skill/dist/motion-explainer/ = SKILL.md + reference/ + toolkit/{src,tools}.
Usage: package_skill.py [vN]   (default: the version in skill/SKILL.md)"""
import pathlib, shutil, sys

LAB = pathlib.Path(__file__).resolve().parent.parent
TOOLS = ["voice.py", "music.py", "audio.py", "build.py", "cues.mjs", "beats.mjs", "qa.mjs", "analyze.py", "export.mjs", "factcheck.py", "lexicon_fr.json", "overfit_lint.py", "overfit_terms.json"]
SRC = ["engine.js", "icons.js", "kit.js", "player.js", "style.css", "shell.html"]

def main():
    out = LAB / "skill/dist/motion-explainer"
    if out.exists(): shutil.rmtree(out)
    (out / "toolkit/src").mkdir(parents=True); (out / "toolkit/tools").mkdir(); (out / "reference").mkdir()
    shutil.copy(LAB / "skill/SKILL.md", out / "SKILL.md")
    for f in (LAB / "skill/reference").iterdir(): shutil.copy(f, out / "reference" / f.name)
    for f in SRC: shutil.copy(LAB / "src" / f, out / "toolkit/src" / f)
    (out / "toolkit/src/kit_series.js").write_text("/* placeholder: series kits live with their episodes */\n", encoding="utf-8")
    for f in TOOLS: shutil.copy(LAB / "tools" / f, out / "toolkit/tools" / f)
    zipf = shutil.make_archive(str(LAB / "skill/dist/motion-explainer"), "zip", out.parent, "motion-explainer")
    n = sum(1 for _ in out.rglob("*") if _.is_file())
    print(f"{out} : {n} fichiers ; archive {zipf}")

if __name__ == "__main__":
    main()
