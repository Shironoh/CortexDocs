# LLMjacking, épisode 1 — refonte illustrée

Même fond, même voix, même fiche de sources que `versions/v8test-llmjacking` (skill v7) ; image refaite dans la direction
validée par le look-dev (`lookdev/llmjacking-hook*`) : un monde illustré continu, deux personnages Rive, rendu HyperFrames.

| | |
|---|---|
| Image | `index.html` : une composition HyperFrames, une timeline GSAP en pause calée sur les temps réels des mots (`words.json`, issu de `tools/voice.py`) |
| Monde | 6 lieux posés sur une seule carte (île du cloud, dépôt qui fuit, salle du réacteur, couloir des caméras, trois îles fournisseurs, marché noir) + une constellation qui sert de fil rouge (5 étapes du cas, puis récap) ; caméra continue avec parallaxe sur 4 couches |
| Personnages | voleur (`thief.riv`) et analyste (`analyst.riv`, source `rnd/rive/analyst/scene.rml`) : RML compilé par Rive CLI, dessinés par `@rive-app/webgl2-advanced` 2.44.2 dans un canvas recalé à chaque image sur leur ancre SVG ; bouche pilotée par les visèmes Piper pour les répliques du voleur (c5, c10) |
| Artefacts réels | noms de méthodes et valeurs imprimés sur des tickets et plaques du décor (EnableService, PutUseCaseForModelAccess, GetIamPolicy, DeleteModelInvocationLoggingConfiguration, inputTokens/outputTokens, ThrottlingException) |
| Son | voix `../v8test-llmjacking/voice` (lien), musique générée « tense », bruitages = `window.__SFX` de la composition (pops espacés d'au moins 0,25 s) ; `python3 tools/audio.py versions/v8-llmjacking-illustre` |

## Reconstruire

```bash
# bibliothèque Rive (non versionnée, MIT) : npm pack @rive-app/webgl2-advanced@2.44.2 → lib/rive/{webgl2_advanced.mjs,rive.wasm}
cd versions/v8-llmjacking-illustre
HYPERFRAMES_NO_TELEMETRY=1 npx hyperframes@0.9.0 lint
HYPERFRAMES_NO_TELEMETRY=1 npx hyperframes@0.9.0 render --fps 24 --workers 4 --quality looks -o _silent.mp4   # en tâche de fond
cd ../.. && python3 tools/audio.py versions/v8-llmjacking-illustre
```

## Corrections faites pendant la production (candidates pour le skill v8)

| Défaut vu sur les captures | Cause | Correction |
|---|---|---|
| Récap resté en plan large alors que la caméra devait zoomer | deux mouvements de caméra qui se chevauchent : le plus ancien finit après le plus récent et impose sa valeur finale | `camTo` collecte les mouvements puis raccourcit chacun pour qu'il finisse avant le suivant (générique) |
| Analyste posé sur les règles du récap et sur le ticket AWS | ancre du personnage placée sans tenir compte de la hauteur réelle du personnage | personnage à gauche de la constellation, règles centrées dessous ; ticket AWS retiré à la fin de sa phrase |
| Plaques des îles dans la bande des sous-titres | cadrage calculé sur l'objet, pas sur l'objet + son étiquette | caméra abaissée sur ces plans |
| Sous-titre de 3 lignes après la pause « Devinez » | la réponse s'ajoutait à la question | après la pause, seul le texte de la réponse est affiché |
| Mot-repère « aws » introuvable, « le » trouvé dans « les » | les sigles sont dits lettre à lettre (A W S) ; recherche par préfixe | repère pris sur un autre mot ; à outiller : recherche exacte par défaut |
