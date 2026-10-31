#!/usr/bin/env python3
"""G1 : signale les termes du sujet de test qui apparaissent dans les lignes AJOUTÉES
entre deux versions du skill. Usage : overfit_lint.py SKILL.vA.md SKILL.vB.md"""
import difflib, re, sys

BLACKLIST = [r"\bgcp\b", r"google", r"cloud", r"\baudit", r"\blogs?\b", r"journa(l|ux)",
             r"\biam\b", r"bucket", r"admin activity", r"data access", r"bindingdelta",
             r"principalemail", r"service account", r"\bsoc\b", r"\bsiem\b", r"sink",
             r"owner", r"methodname", r"projet"]

ALLOW = [r"google fonts"]  # faux positifs connus (hébergeur de polices, présent dès v0)

def main(a, b):
    old = open(a, encoding="utf-8").read().splitlines()
    new = open(b, encoding="utf-8").read().splitlines()
    added = [l[1:] for l in difflib.unified_diff(old, new, lineterm="", n=0)
             if l.startswith("+") and not l.startswith("+++")]
    hits = []
    for line in added:
        for pat in BLACKLIST:
            clean = line
            for al in ALLOW: clean = re.sub(al, '', clean, flags=re.I)
            if re.search(pat, clean, re.I):
                hits.append((pat, line.strip()))
    print(f"lignes ajoutées : {len(added)} | lignes v-old : {len(old)} -> v-new : {len(new)} "
          f"({(len(new)-len(old))/max(1,len(old))*100:+.1f} %)")
    if not hits:
        print("G1 OK : aucun terme du sujet de test dans les ajouts")
    for pat, line in hits:
        print(f"G1 ALERTE [{pat}] : {line}")
    return 1 if hits else 0

if __name__ == "__main__":
    sys.exit(main(*sys.argv[1:3]))
