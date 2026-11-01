# Outillage `motion-explainer` — mode d'emploi

Tout ce qui suit est générique : rien ne dépend du sujet. Un épisode = un dossier `versions/<id>/` contenant `episode.js` ;
les outils produisent le reste à côté (`timing.json`, `voice/`, `index.html`, `soundtrack.mp3`, `video.mp4`).

## 1. Installer (conteneur neuf, une fois)

```bash
pip install piper-tts onnx faster-whisper librosa && pip install --no-deps num2words
mkdir -p ~/.local/share/piper-voices && cd ~/.local/share/piper-voices
B=https://huggingface.co/rhasspy/piper-voices/resolve/main/fr/fr_FR
for v in siwis/medium/fr_FR-siwis-medium tom/medium/fr_FR-tom-medium; do
  curl -sSLO "$B/$v.onnx"; curl -sSLO "$B/$v.onnx.json"; done
# polices identiques page / vidéo
mkdir -p /tmp/f && cd /tmp/f && npm pack @fontsource/poppins @fontsource/jetbrains-mono && for t in *.tgz; do tar xzf $t --one-top-level=${t%.tgz}; done \
  && mkdir -p ~/.local/share/fonts && cp */package/files/*-latin-{400,600,700,800}-normal.woff ~/.local/share/fonts/; fc-cache -f
# repli voix : apt-get install -y espeak-ng mbrola mbrola-fr4 ; Playwright + Chromium + ffmpeg requis pour QA et export
```
Autres voix FR : `upmc/medium` (2 locuteurs : jessica, pierre), `mls/medium` (125 locuteurs), `gilles/low`.

## 2. Pipeline d'un épisode

| Étape | Commande | Produit |
|---|---|---|
| Voix | `python3 toolkit/tools/voice.py versions/<id> --check` | `voice/*.wav` (cache par texte), `timing.json` (mots, visèmes), `voice_check.json` |
| Page | `python3 toolkit/tools/build.py versions/<id>` | `index.html` autonome (moteur figé dans `_*.js`) |
| Rythme | `node toolkit/tools/beats.mjs versions/<id>/index.html` | trous > 2,5 s, cues sous le quota (quelques secondes, sans rendu) |
| QA | `node toolkit/tools/qa.mjs versions/<id>/index.html <out> && python3 toolkit/tools/analyze.py <out>` | `<out>/sheets/*.jpg` (planches par scène), `qa.json`, `QA.md` |
| Faits | `python3 toolkit/tools/factcheck.py versions/<id> research/<sujet>/SOURCES.md [sorties réelles…]` | nombres affichés ou dits absents de la fiche |
| Vidéo | `node toolkit/tools/export.mjs versions/<id>/index.html versions/<id> 4` | `_silent.mp4` 1080p24, `meta.json` |
| Son | `python3 toolkit/tools/audio.py versions/<id> [--music piste.mp3\|none] [--mood wonder]` | `soundtrack.mp3`, `video.mp4` |
| Page finale | `python3 toolkit/tools/build.py versions/<id>` | `index.html` avec la bande son embarquée (≈ 1 Mo/min) |

Durées indicatives (4 cœurs) : voix 1-2 min, QA 40 s, export 4-6 min pour 2:45, son 20 s.

## 3. `episode.js`

```js
/*META{"title":"…","h1":"…","eyebrow":"…","footer":"<p class='footer'>sources…</p>",
  "voice":{"voice":"fr_FR-siwis-medium","ls":1.08,"pause":0.35,"lexicon":{"mot":"graphie"},"cast":{"foe":{"voice":"fr_FR-tom-medium","ls":1.0}}},
  "music":{"mood":"curious|wonder|tense|warm","key":"D","level":0.55}}META*/
/* FICHE : audience (métier × domaine), savoir-faire après, inventaire, métaphore, idées reçues, devinez, termes nouveaux par scène */
const EP = {
  zones: { a: [0, 0], b: [2300, 0] },                       // une zone = un lieu, 2300 d'écart
  scenes: [{ id: 's1', title: '…' }],
  cues: [{ id: 'c1', sc: 's1', sub: 'sous-titre, 1991', say: 'texte dit, mille neuf cent…', who: 'foe', breath: .9 },
         { id: 'c2', sc: 's1', sub: 'Devinez : … ?|Réponse.', say: 'Devinez : … ? | Réponse.' }],   // « | » = silence devinez
  quiz: { c2: { q: '…', choices: ['…'], answer: 1, why: '…' } },
  build(K) { const k = sceneKit(K); /* … */ },
};
```

## 4. API du moteur (`K`)

| Appel | Rôle |
|---|---|
| `K.T(cue, mot, n = 0, after)` | instant du n-ième mot qui commence par `mot` (normalisé : minuscules, sans accents, « l'azote » → `azote` ou `lazote`) ; `after` = fin du mot |
| `K.reveal(cue)` | fin du silence d'un devinez |
| `K.cue(id)`, `K.sc(id)` | `{start, end, dur, …}` |
| `K.A(el, {x, y, s, r, pop, fin:[t,d], out, outd, moves:[[t, d, {x,y,s,r,a}, ease]], fn(st, t), dash:[t,d]})` | anime un élément (`fn` pour un mouvement libre) |
| `K.frame(t, d, cibles, part, {zmax, dx, dy, focus})` | caméra calculée depuis la boîte englobante ; `part` ≈ 0,9 ensemble, 0,55 travail, 0,7 gros plan |
| `K.cam(t, d, x, y, z)` | caméra brute (ouverture, plan hors sujet) |
| `K.focus(t, el)` | point lumineux (spotlight) |
| `K.char(parent, {name, color, shape: 'blob'\|'robot', x, y, s, dir, mask, headset, ghost, expr})` | personnage : `.pop .out .walk(t,d,x) .slide .pose(t,d,nom,{x,y}) .expr(t,e) .look(t,x,y) .hold(el)` |
| `K.tx(parent, x, y, texte, {size, mono, fill, weight, anchor, deco, axis, block, bleed})` | texte ; `axis`/`block` regroupent pour le compte des blocs |
| `K.hot({x, y, at, until, title, html})` | hotspot en pause (coordonnées monde) |
| `K.ev(t, 'pop'\|'whoosh'\|'reveal'\|'myth'\|'impact'\|'tick')` | bruitage sémantique |
| `K.mark(t)`, `K.fx(t => …)` | beat déclaré ; fonction libre par image |

Poses : `point` `loupe` `shrug` `cheer` `hold` `type` `jump` `nod` `lean` `walkcycle`. Expressions : `neutral happy smug angry surprise worried`.

## 5. Kit générique `sceneKit(K)`

`room(zone, teinte, {decor: room|outdoor|lab|void, seed, sun:[x,y]})` · `world(zones, {silhouette})` · `hero(g, x, o)` / `foe(g, x, o)`
· `bubble(g, perso, texte, t0, t1)` · `card(g, x, y, {head, value, note, col, w, mono, icon}, tPop, tValue, tNote, tOut)` (artefact réel)
· `panel(g, x, y, lignes, {w, size, title, col, pop, out, typeAt})` + `._hi(ligne, début, longueur, t, {col, box, out})` (segment éclairé) + `._dim(t, garder, t1)`
· `doc(g, x, y, lignes, [[t, i]], o)` (artefact long déroulé, 3 lignes lisibles) · `counter(g, x, y, {from, to, t0, dur, fmt})`
· `bars(g, x, y, {vals:[{v, label, col, top}], max, t0})` · `curve(g, pts, {t0, dur, col})` · `arrow(g, x1, y1, x2, y2, {t, col, dashed})`
· `label(g, x, y, texte, {pop, out, size, col, mono})` · `timeline(g, x, y, {w, ticks:[[p, texte]], t0})` · `balance(g, x, y, {t, tilt})`
· `unknown(el)` · `suspense(g, x, y, t0, t1)` · `pulse(el, t)` (beat de rappel) · `typeIn(el, texte, t0, d)`.

Ajouter au kit ce qui sert à plusieurs sujets ; dessiner dans l'épisode ce qui est propre au sujet.

## 6. Pièges connus

- Un deuxième `K.A()` sur un même élément écrase sa position : chaîner dans `moves` (ou `pulse`).
- `opacity` est réécrit par l'animateur : `fill-opacity` pour un calque translucide.
- Cadrer un élément pas encore apparu marche (le cadrage mesure la taille finale) ; cadrer un texte en cours de frappe aussi.
- Un `//` commentaire dans une ligne de code compacte coupe la suite : préférer `/* */`.
- Pendant le calcul des cadrages (`FRAMING`), `pop`/`out` sont ignorés : la boîte englobante est la taille finale.

## 7. Sans l'outillage

Reconstruire un moteur minimal : tout est fonction du temps (`render(t)` mute des attributs) ; acteurs `{pop, moves, out}` ;
caméra en keyframes `[t, x, y, z]` interpolées (ease in-out, zoom en log) ; trois calques à parallaxe (0,5 / 1 / 1,3) ;
`window.__mx = {render, duration, cues, scenes, events}` pour la QA et l'export ; export image par image en capture Playwright → ffmpeg.
