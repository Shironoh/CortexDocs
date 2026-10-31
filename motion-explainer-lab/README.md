# Labo d'amélioration continue — skill `motion-explainer` (style motion design flat)

Boucle de 5 itérations complètes : générer une vidéo avec le skill, la mesurer, la noter, diagnostiquer,
corriger **le skill** (pas seulement la vidéo), régénérer. Sujet de test : *les journaux d'audit Admin Activity
de Google Cloud, côté détection et réponse, pour quelqu'un qui ne connaît pas GCP* (3 min max).

- Protocole : [`PROTOCOL.md`](PROTOCOL.md) (grille 14 critères, étiquettes E/S/C/T/X, 6 garde-fous anti-surapprentissage)
- Skill final : [`skill/SKILL.md`](skill/SKILL.md) (= `SKILL.v5.md`) ; versions `SKILL.v0.md` → `v5` ; [`skill/CHANGELOG.md`](skill/CHANGELOG.md)
- Vidéos : `versions/vN/index.html` (lecteur interactif autonome) et `versions/vN/video_720p.mp4`
- Revues : `iterations/vN/REVIEW.md`, planches contact `iterations/vN/sheets/`, QA `iterations/vN/QA.md`
- Validation hors sujet : [`holdout/VALIDATION.md`](holdout/VALIDATION.md) ; sujets témoins : [`holdout/HOLDOUT.md`](holdout/HOLDOUT.md)

## Résultats

| | v1 | v2 | v3 | v4 | v5 |
|---|---|---|---|---|---|
| Générée avec | skill v0 | v1 | v2 | v3 | v4 |
| **Note fond (/4)** | 2,71 | 3,43 | 3,57 | 3,57 | **3,71** |
| **Note forme (/4)** | 2,00 | 2,57 | 2,71 | 3,29 | **3,57** |
| Durée | 2:56 | 2:54 | 2:52 | 2:56 | 2:56 |
| Captures avec défaut | 61/63 | 53/57 | 47/57 | 29/57 | **24/57** |
| Fenêtres figées > 2,5 s | 5 | 4 | 1 | 0 | **0** |
| Surface vide moyenne | 53 % | 48 % | 42 % | 7 % | **7 %** |
| Personnage sous les sous-titres | 33 | 4 | 5 | 5 | 5 |
| Personnage masqué par le premier plan | 18 | 0 | 0 | 0 | 0 |
| Plus de 3 textes à l'écran | 7 | 5 | 2 | 2 | **0** |
| Spot sur un objet invisible | 4 | 3 | 3 | 3 | **0** |
| Scènes sous 3 échelles de plan | 6/8 | 2/7 | 2/7 | 1/7 | **0/7** |

Métriques recalculées à la fin avec les mêmes outils pour les 5 versions (`iterations/compare/`).
Notes de la grille : voir chaque `REVIEW.md` (chaque note cite sa preuve).

## Ce que la boucle a appris au skill (résumé)

1. **Budget avant d'écrire** (v1) : le skill donnait une formule de durée mais pas de budget ; le 1er jet faisait 3:54.
2. **Cadrer par la taille du sujet, pas par un zoom** (v1, contradiction) : la caméra se calcule depuis la boîte englobante.
3. **Le visuel n'en sait pas plus que la narration** (v1) : l'incertain se montre en pointillés.
4. **Beats opérationnels, mise en place, nettoyage** (v2) : quota par cue, définition d'un beat.
5. **Le fond n'est pas une surface de décor** (v3, contradiction) : vide 42 % → 7 % en une itération.
6. **Où agir** (v3) puis **lieu introduit dans sa scène** (v4, contradiction avec « un terme par scène »).
7. **Test de compréhension en 3 questions** (v4) : a révélé que personne ne disait où retirer le rôle.
8. **Silence de devinez = la question entière ; petit objet qui grossit ; contrôle des beats sans rendu** (v5).

Anti-surapprentissage : aucun terme du sujet de test ajouté au skill (lint G1), chaque règle testée par écrit
sur 3 sujets témoins (DNS grand public, Kerberoasting praticien, taux BCE non technique), exemples du skill v0
qui ressemblaient au sujet de test remplacés, skill +6 % seulement (196 → 208 lignes), validation finale sur
un sujet jamais vu (vaccin ARNm, lycéen).

## Reproduire

```
python3 tools/build.py vN                      # assemble versions/vN/index.html
node tools/beats.mjs versions/vN/index.html    # contrôle de la feuille de beats (sans rendu)
node tools/qa.mjs versions/vN/index.html iterations/vN && python3 tools/analyze.py iterations/vN
node tools/export.mjs versions/vN/index.html versions/vN 3 && python3 tools/audio.py versions/vN
python3 tools/overfit_lint.py skill/SKILL.vA.md skill/SKILL.vB.md
```
Prérequis : Playwright + Chromium, ffmpeg, numpy/PIL, espeak-ng + mbrola-fr4, Poppins/JetBrains Mono.

## Limites

- Voix : espeak-ng/mbrola (robotique), seule voix française hors ligne disponible dans l'environnement ; dans le
  lecteur interactif, la voix du navigateur (bouton « Voix ») est souvent meilleure.
- Notes « fond » : auto-évaluation par le même modèle qui a produit la vidéo, appuyée sur des preuves citées ;
  un regard humain reste le meilleur juge.
- docs.cloud.google.com n'était pas joignable directement ; les faits GCP ont été vérifiés via des extraits de la
  documentation officielle remontés par la recherche web (voir le pied de page de chaque version).
