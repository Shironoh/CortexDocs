#!/usr/bin/env python3
"""G1 : signale les termes des sujets de test (tools/overfit_terms.json) dans les lignes AJOUTÉES entre deux
versions du skill. Usage : overfit_lint.py SKILL.vA.md SKILL.vB.md [--all]   (--all : contrôle tout le fichier B)"""
import difflib, json, pathlib, re, sys

TERMS = json.loads((pathlib.Path(__file__).parent / "overfit_terms.json").read_text(encoding="utf-8"))
ALLOW = [r"google fonts", r"fonts\.googleapis", r"analyze\.py", r"explainer", r"ElevenLabs, Google, Azure"]  # faux positifs connus (hébergeur de polices)

def main(a, b, full=False):
    old = open(a, encoding="utf-8").read().splitlines(); new = open(b, encoding="utf-8").read().splitlines()
    lines = new if full else [l[1:] for l in difflib.unified_diff(old, new, lineterm="", n=0) if l.startswith("+") and not l.startswith("+++")]
    hits = []
    for line in lines:
        clean = line
        for al in ALLOW: clean = re.sub(al, "", clean, flags=re.I)
        for subject, pats in TERMS.items():
            if subject.startswith("_"): continue
            for pat in pats:
                if re.search(pat, clean, re.I): hits.append((subject, pat, line.strip()[:140]))
    print(f"lignes contrôlées : {len(lines)} | {len(old)} -> {len(new)} lignes ({(len(new)-len(old))/max(1,len(old))*100:+.1f} %)")
    if not hits: print("G1 OK : aucun terme d'un sujet de test ou témoin")
    for s, p, l in hits: print(f"G1 ALERTE [{s} · {p}] : {l}")
    return 1 if hits else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1], sys.argv[2], "--all" in sys.argv))
