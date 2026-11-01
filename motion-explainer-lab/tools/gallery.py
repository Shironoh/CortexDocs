#!/usr/bin/env python3
"""Build the gallery artifact: gallery/index.html (+ gallery/vN.html wrapped players). Videos are mapped at publish time."""
import json, pathlib, html

LAB = pathlib.Path(__file__).resolve().parent.parent
G = LAB / "gallery"; G.mkdir(exist_ok=True)
VERS = ["v1", "v2", "v3", "v4", "v5"]
SCORES = {"v1": (2.71, 2.00), "v2": (3.43, 2.57), "v3": (3.57, 2.71), "v4": (3.57, 3.29), "v5": (3.71, 3.57)}
SKILL_USED = {"v1": "v0 (d'origine)", "v2": "v1", "v3": "v2", "v4": "v3", "v5": "v4"}
WHAT = {
 "v1": "Référence : le skill tel quel. Premier jet à 3:54, compressé à 2:56. Personnages sous les sous-titres, cadres vides, vol « montré » alors qu'il est improuvable.",
 "v2": "Budget de mots avant d'écrire, cadrage calculé sur la taille du sujet, bande sous-titres protégée, incertitude en pointillés, récap en objets.",
 "v3": "Beats opérationnels (quota par cue), mise en place, nettoyage, un terme nouveau par scène. Plus aucune fenêtre figée au milieu.",
 "v4": "Le fond n'est plus une surface de décor (vide 42 % → 7 %), sons sémantiques, chaque réflexe dit où agir.",
 "v5": "Lieux d'action introduits dans leur scène, test de compréhension en 3 questions (« dans IAM »), caméra jamais posée sur un vide.",
}
cmp = {v: json.load(open(LAB / f"iterations/compare/{v}/qa.json"))["summary"] for v in VERS}

def wrap_player(v):
    src = (LAB / f"versions/{v}/index.html").read_text(encoding="utf-8")
    page = ('<!doctype html><html lang="fr"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
            '<style>body{margin:0}</style></head><body>' + src + '</body></html>')
    (G / f"{v}.html").write_text(page, encoding="utf-8")

for v in VERS: wrap_player(v)
EPS = [("ep1", "Lire une entrée, champ par champ", "Les 4 journaux et ce que chacun voit, puis une vraie entrée déroulée ligne par ligne : serviceName, methodName, resourceName, principalEmail, callerIp, callerSuppliedUserAgent, bindingDeltas."),
       ("ep2", "Les portes de persistance", "SetIamPolicy · CreateServiceAccount · CreateServiceAccountKey · setCommonInstanceMetadata (ssh-keys) · GenerateAccessToken, invisible par défaut."),
       ("ep3", "Effacer, exposer, exploiter", "DeleteSink / UpdateSink · auditConfigDeltas · firewalls.insert 0.0.0.0/0 · storage.setIamPermissions allUsers · instances.insert.")]
for e, _, _ in EPS:
    src = (LAB / f"versions/v6-{e}/index.html").read_text(encoding="utf-8")
    (G / f"{e}.html").write_text('<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0}</style></head><body>' + src + '</body></html>', encoding="utf-8")
series = "".join(f'''
<article class="ver"><div class="vh"><span class="tag">{e.upper()}</span><span class="by">{t}</span></div>
  <video controls preload="metadata" playsinline src="{e}.mp4"></video><p>{d}</p>
  <a class="open" href="{e}.html" target="_blank" rel="noopener">Ouvrir le lecteur interactif (requêtes complètes en pause)</a></article>''' for e, t, d in EPS)

def row(label, fn, best=None):
    cells = "".join(f"<td>{fn(cmp[v])}</td>" for v in VERS)
    return f"<tr><th scope='row'>{label}</th>{cells}</tr>"

rows = "".join([
    row("Captures avec défaut", lambda s: f"{s['captures_with_issue']}/{s['captures']}"),
    row("Fenêtres figées &gt; 2,5 s", lambda s: len(s['frozen_windows_gt2_5s'])),
    row("Surface vide moyenne", lambda s: f"{s['avg_empty']*100:.0f} %"),
    row("Personnage sous les sous-titres", lambda s: s['issues'].get('subj_in_band', 0)),
    row("Personnage masqué (1er plan)", lambda s: s['issues'].get('subj_occluded', 0)),
    row("Plus de 3 textes à l'écran", lambda s: s['issues'].get('toomanytext', 0)),
    row("Spot sur un objet invisible", lambda s: s['issues'].get('focus_hidden', 0)),
    row("Scènes sous 3 échelles de plan", lambda s: f"{len(s['scenes_lt3_shot_values'])}/{s['scenes']}"),
    row("Durée", lambda s: f"{int(s['duration_s']//60)}:{int(s['duration_s']%60):02d}"),
])
score_rows = ("<tr><th scope='row'>Note fond (/4)</th>" + "".join(f"<td class='sc'>{SCORES[v][0]:.2f}</td>" for v in VERS) + "</tr>"
              "<tr><th scope='row'>Note forme (/4)</th>" + "".join(f"<td class='sc'>{SCORES[v][1]:.2f}</td>" for v in VERS) + "</tr>")
cards = ""
for v in VERS:
    f, fo = SCORES[v]
    cards += f"""
<article class="ver" id="{v}">
  <div class="vh"><span class="tag">{v}</span><span class="by">générée avec le skill {SKILL_USED[v]}</span><span class="nums">fond {f:.2f} · forme {fo:.2f}</span></div>
  <video controls preload="metadata" playsinline src="{v}.mp4"></video>
  <p>{WHAT[v]}</p>
  <a class="open" href="{v}.html" target="_blank" rel="noopener">Ouvrir le lecteur interactif {v} (chapitres, pause avec détails, quiz)</a>
</article>"""
skill = html.escape((LAB / "skill/SKILL.md").read_text(encoding="utf-8"))
repo = "https://github.com/Shironoh/CortexDocs/tree/claude/kurzgesagt-motion-design-loop-98obv8/motion-explainer-lab"
page = f"""<title>Labo motion-explainer</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&family=JetBrains+Mono:wght@400;700&display=swap">
<style>
/* Layout: one reading column; header, score table, five version cards (video + player link), protocol, final skill. Single dark look matching the videos. */
:root {{ --ink:#050B1E; --night:#0B1A3A; --panel:#14295C; --line:#26407e; --text:#F8FAFC; --muted:#a9b8db; --amber:#FFB703; --cyan:#22D3EE; --green:#06D6A0;
  --f-disp: Poppins, 'DejaVu Sans', system-ui, sans-serif; --f-mono: 'JetBrains Mono', 'DejaVu Sans Mono', monospace; color-scheme: dark; }}
html, body {{ background: var(--ink); color: var(--text); }}
body {{ font: 15px/1.55 var(--f-disp); padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }}
main {{ max-width: 1040px; margin: 0 auto; padding-block: 28px 56px; display: grid; gap: 28px; }}
.eyebrow {{ color: var(--amber); text-transform: uppercase; letter-spacing: .14em; font-size: 12px; font-weight: 600; }}
h1 {{ font-size: clamp(26px, 4vw, 40px); line-height: 1.1; margin: 6px 0 10px; font-weight: 800; text-wrap: balance; }}
h2 {{ font-size: 20px; margin: 0 0 10px; font-weight: 800; }}
p {{ margin: 0; max-width: 70ch; color: var(--muted); }} p b {{ color: var(--text); }}
.tw {{ overflow-x: auto; border: 1px solid var(--line); border-radius: 12px; }}
table {{ border-collapse: collapse; width: 100%; min-width: 560px; font-variant-numeric: tabular-nums; }}
th, td {{ padding: 8px 10px; border-bottom: 1px solid var(--line); text-align: right; font-size: 14px; }}
th[scope=row] {{ text-align: left; font-weight: 600; color: var(--muted); }} thead th {{ color: var(--amber); font-family: var(--f-mono); }}
td.sc {{ font-weight: 800; color: var(--text); }} tr:last-child th, tr:last-child td {{ border-bottom: 0; }}
.vers {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }}
.ver {{ background: var(--night); border: 1px solid var(--line); border-radius: 14px; padding: 12px; display: grid; gap: 10px; align-content: start; min-width: 0; }}
.ver#v5 {{ border-color: var(--amber); }}
.vh {{ display: flex; flex-wrap: wrap; gap: 6px 10px; align-items: baseline; }}
.tag {{ font: 700 14px var(--f-mono); color: var(--ink); background: var(--amber); padding: 1px 8px; border-radius: 6px; }}
.by {{ color: var(--muted); font-size: 13px; }} .nums {{ margin-left: auto; font: 600 12px var(--f-mono); color: var(--cyan); }}
video {{ width: 100%; max-width: 100%; aspect-ratio: 16/9; background: #000; border-radius: 10px; }}
.ver p {{ font-size: 14px; }}
a {{ color: var(--cyan); }} a:focus-visible, button:focus-visible {{ outline: 3px solid var(--amber); outline-offset: 2px; }}
.open {{ font-weight: 600; font-size: 14px; }}
ol {{ margin: 0; padding-left: 1.2em; color: var(--muted); display: grid; gap: 6px; max-width: 75ch; }} ol b {{ color: var(--text); }}
details {{ border: 1px solid var(--line); border-radius: 12px; background: var(--night); }}
summary {{ cursor: pointer; padding: 12px 14px; font-weight: 700; }}
.sk {{ padding: 0 14px 14px; display: grid; gap: 8px; }}
pre {{ margin: 0; max-height: 520px; overflow: auto; background: var(--ink); border-radius: 10px; padding: 12px; font: 12px/1.5 var(--f-mono); white-space: pre-wrap; color: var(--text); }}
button {{ justify-self: start; font: 700 14px var(--f-disp); background: var(--amber); color: var(--ink); border: 0; border-radius: 10px; padding: 8px 14px; cursor: pointer; }}
.note {{ font-size: 13px; }}
</style>
<main>
  <header>
    <div class="eyebrow">Skill motion-explainer · boucle d'amélioration continue</div>
    <h1>Six itérations, un skill réécrit, une série DFIR</h1>
    <p>Sujet de test : <b>les journaux Admin Activity de Google Cloud, côté détection et réponse</b>, pour quelqu'un qui ne connaît pas GCP, en moins de 3 minutes.
    Chaque vidéo est générée avec la version précédente du skill, mesurée, notée, puis le skill est corrigé par des règles valables pour n'importe quel sujet.</p>
  </header>
  <section>
    <h2>v6 · La série DFIR (après ton retour)</h2>
    <p class="note" style="margin-bottom:12px">Ton retour : « superficiel et abstrait ». Le skill v6 cadre l'audience sur deux axes (métier détection/réponse, outil GCP), part d'un inventaire des artefacts à reconnaître et montre les vrais noms de méthodes et de champs à l'écran. Résultat : 3 épisodes, 15 événements et champs réels, chacun avec sa condition d'alerte.</p>
    <div class="vers">{series}</div>
  </section>
  <section>
    <h2>Progression (itérations 1 à 5)</h2>
    <div class="tw"><table>
      <thead><tr><th></th>{''.join(f'<th>{v}</th>' for v in VERS)}</tr></thead>
      <tbody>{score_rows}{rows}</tbody>
    </table></div>
    <p class="note" style="margin-top:8px">Mesures automatiques recalculées avec les mêmes outils pour les cinq versions (captures à 25, 50 et 75 % de chaque phrase). Notes /4 : grille de 14 critères, chaque note cite sa preuve dans <code>iterations/vN/REVIEW.md</code>.</p>
  </section>
  <section>
    <h2>Les versions</h2>
    <div class="vers">{cards}</div>
  </section>
  <section>
    <h2>Ce que la boucle a appris au skill</h2>
    <ol>
      <li><b>Budget de mots avant d'écrire</b>, et couper une idée plutôt que comprimer toutes les phrases.</li>
      <li><b>Cadrer par la taille du sujet</b> (caméra calculée sur sa boîte englobante), jamais par un zoom au jugé.</li>
      <li><b>Le visuel n'en sait pas plus que la narration</b> : l'incertain se montre en pointillés.</li>
      <li><b>Beats opérationnels</b> : au moins ⌈durée/2⌉ changements visibles par phrase ; mise en place ; nettoyage.</li>
      <li><b>Le fond n'est pas une surface de décor</b> : murs et sols en teintes de zone.</li>
      <li><b>Sons sémantiques</b> : révélation, idée reçue démentie, conséquence.</li>
      <li><b>Où agir</b>, avec le lieu introduit dans la scène qui explique l'action.</li>
      <li><b>Test de compréhension en 3 questions</b>, dont « où est-ce que je fais ça ? ».</li>
    </ol>
    <p class="note" style="margin-top:10px">Garde-fous anti-surapprentissage : aucun terme du sujet de test ajouté au skill (contrôle automatique), chaque règle testée sur trois sujets témoins éloignés (DNS grand public, Kerberoasting, taux BCE), skill +6 % seulement, validation finale sur un sujet jamais vu (vaccin ARNm, lycéen). Tout est dans le <a href="{repo}" target="_blank" rel="noopener">dossier du dépôt</a>.</p>
  </section>
  <section>
    <details>
      <summary>Skill final (v6), à copier</summary>
      <div class="sk"><button type="button" id="cp">Copier le skill</button><pre id="skill">{skill}</pre></div>
    </details>
  </section>
  <p class="note">Limites : voix de synthèse espeak-ng/mbrola dans les MP4 (dans les lecteurs interactifs, le bouton « Voix » utilise la voix du navigateur) ; les notes de fond sont une auto-évaluation appuyée sur des preuves.</p>
</main>
<script>
document.getElementById('cp').addEventListener('click', async e => {{
  const t = document.getElementById('skill').textContent;
  try {{ await navigator.clipboard.writeText(t); e.target.textContent = 'Copié'; }}
  catch (_) {{ const r = document.createRange(); r.selectNodeContents(document.getElementById('skill')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); e.target.textContent = 'Texte sélectionné : Ctrl+C'; }}
}});
</script>
"""
(G / "index.html").write_text(page, encoding="utf-8")
print("gallery ok", sum(f.stat().st_size for f in G.iterdir()) // 1024, "Ko")
