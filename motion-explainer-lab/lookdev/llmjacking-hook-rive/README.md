# Look-dev + personnage Rive

Le voleur est écrit en RML (`rnd/rive/thief_t/scene.rml`), compilé par Rive CLI (`rive rnd/rive/thief_t --once` → `thief.riv`),
puis dessiné dans un canvas WebGL2 par `@rive-app/webgl2-advanced` 2.44.2, recalé à chaque image sur le rocher de la scène
(caméra et balancement compris). Ses quatre paramètres (bouche, yeux, bras, inclinaison) sont fixés par le temps : même image à chaque passe.

Bibliothèque non versionnée (MIT, 2,3 Mo) : `npm pack @rive-app/webgl2-advanced@2.44.2`, puis copier `webgl2_advanced.mjs`
et `rive.wasm` dans `lib/rive/`. Rendu : `HYPERFRAMES_NO_TELEMETRY=1 npx hyperframes@0.9.0 render --fps 30 --workers 4 -o lookdev_rive.mp4` (80 s).
