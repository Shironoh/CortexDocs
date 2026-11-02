# Essais d'animation (2 novembre 2026)

Conteneur 4 cœurs, Chromium headless de Playwright. Scène identique : cercle → carré (morphing), tracé d'une courbe,
point le long d'un chemin (texte en plus pour Manim). Installer `gsap@3.15.0 animejs@4.5.0` dans `node_modules/` à côté.

| Outil | Déterminisme (même image à t donné, quel que soit l'ordre des seeks) | Coût par image | Remarque |
|---|---|---|---|
| GSAP 3.15 (MorphSVG, DrawSVG, MotionPath) | oui : t = 1 s et t = 2,5 s donnent les mêmes empreintes MD5 à l'aller et au retour | 240 seeks en 365 ms (1,5 ms) | morphing en courbes de Bézier propres |
| anime.js 4.5 (`svg.morphTo`, `createDrawable`) | oui | 240 seeks en 433 ms (1,8 ms) | morphing converti en polyligne (chemins plus lourds) |
| Manim CE 0.22.1 | rendu image par image natif | 3 s en 1080p24 : 6,8 s de bout en bout (démarrage compris) | `Write()` du texte très réussi ; pas de lecteur interactif ; dépendance `srt` à installer à la main (setuptools Debian) |
| Remotion 4.0.539 (essai du 1er nov.) | oui | 240 images 1080p en 13,3 s (concurrency 4) | licence entreprise au-delà de 3 personnes |
| Moteur du labo + `export.mjs` | oui | 3 735 images 1080p en 263 s avec 4 workers, encodage compris | lecteur interactif et MP4 depuis le même code |
| HyperFrames 0.9.0 | non testé | — | l'exécution de la CLI a été refusée par le contrôle de sécurité de la session ; évalué sur sa documentation |

Captures : `gsap.png` (t = 1,2 s), `anime.png`, `manim.png` (t = 1,5 s).
