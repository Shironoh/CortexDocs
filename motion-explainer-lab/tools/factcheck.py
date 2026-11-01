#!/usr/bin/env python3
"""Fact lint: every number shown or said in an episode must appear in the research sheet (SOURCES.md).
Numbers are read from cue subtitles (`sub`, digits) and from on-screen strings in episode.js; a number is
covered when the same value (spaces, thin spaces, dots and commas ignored) appears in the sheet.
Usage: factcheck.py versions/<id> research/<topic>/SOURCES.md [--ignore 1,2,3]"""
import json, pathlib, re, subprocess, sys

LAB = pathlib.Path(__file__).resolve().parent.parent

def nums(s):
    out = set()
    for m in re.finditer(r"\d[\d   .,]*\d|\d", s):
        v = re.sub(r"[   ]", "", m.group(0)).rstrip(".,")
        out.add(v)
        out.add(v.replace(",", ".")); out.add(v.replace(".", "").replace(",", ""))
    return out

def key(v): return re.sub(r"[^\d]", "", v)

def main(vdir, sheet, ignore=()):
    vdir = pathlib.Path(vdir); src = (vdir / "episode.js").read_text(encoding="utf-8")
    cues = json.loads(subprocess.run(["node", "-e", "const fs=require('fs');const EP=new Function(fs.readFileSync(process.argv[1],'utf8')+';return EP;')();console.log(JSON.stringify(EP.cues.map(c=>[c.id,c.sub])))", str(vdir / "episode.js")], capture_output=True, text=True, check=True).stdout)
    sheet_keys = {key(v) for v in nums(pathlib.Path(sheet).read_text(encoding="utf-8"))}
    build = src[src.find("build(K)"):]
    strings = re.findall(r"'((?:[^'\\]|\\.)*)'", build) + re.findall(r'"((?:[^"\\]|\\.)*)"', build)
    found = []
    for cid, sub in cues: found += [(cid, v) for v in nums(sub)]
    for s in strings:
        if re.fullmatch(r"[MLHVCSQTAZmlhvcsqtaz\d\s.,\-]+", s) or re.search(r"translate\(|rotate\(|scale\(|url\(|^#|^c\d+$|^s\d+$|^z\d", s): continue
        if re.search(r"[A-Za-zÀ-ÿ%:±]", s) or len(s) > 3: found += [("écran", v) for v in nums(s)]
    trivial = {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"} | set(ignore)
    orphans = sorted({(w, v) for w, v in found if key(v) and key(v) not in sheet_keys and key(v) not in trivial and len(key(v)) > 1}, key=lambda x: x[1])
    print(f"[factcheck] {len({v for _, v in found})} nombres relevés, {len(orphans)} absents de la fiche sources")
    for w, v in orphans: print(f"   {w:6s} {v}")
    return 1 if orphans else 0

if __name__ == "__main__":
    ign = sys.argv[sys.argv.index("--ignore") + 1].split(",") if "--ignore" in sys.argv else ()
    sys.exit(main(sys.argv[1], sys.argv[2], ign))
