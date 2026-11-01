# Reprendre le projet dans une nouvelle session

Dépôt `Shironoh/CortexDocs`, branche `claude/kurzgesagt-motion-design-loop-98obv8`, dossier `motion-explainer-lab/`.
Galerie (privée) : https://claude.ai/artifact/6ztZsnHguFMHhbD2ofp6nz — pour la mettre à jour depuis une autre
session, la lire (`action: read`) puis publier avec ce lien en `url` (sinon un nouvel artifact est créé).

## État au 1er novembre 2026 (fin de l'itération 7)

- Skill courant : `skill/SKILL.md` (= `SKILL.v7.md`, 202 lignes) + `skill/reference/TOOLKIT.md`.
  **Skill installable** : `skill/dist/motion-explainer/` (ou `skill/dist/motion-explainer.zip`) = SKILL.md + reference/ + toolkit/
  (moteur, kit, lecteur, outils). Régénérer avec `python3 tools/package_skill.py` après toute modification de `src/`, `tools/` ou du skill.
  Le skill installé sur le compte est toujours la version d'origine (v0) : le remplacer par ce dossier.
- Itérations 1-5 : vidéo unique (sujet GCP) ; 6 : série GCP en 3 épisodes ; **7 : skill v7 testé sur deux sujets nouveaux**
  (`versions/v7-c14` carbone 14 grand public, `versions/v7-pgexplain` EXPLAIN ANALYZE pour développeurs) + non-régression
  (`versions/v7-reg-gcp-ep2`). Revue : `iterations/v7/REVIEW.md`.
- Protocole : `PROTOCOL.md` ; historique du skill : `skill/CHANGELOG.md` ; évaluation des outils : `docs/TOOLS_EVAL.md` ;
  fiches sources : `research/<sujet>/SOURCES.md` ; voix et musiques testées : `voice-lab/`.

## En attente

1. **Retour utilisateur sur l'itération 7** (voix siwis, musique générée, bouches, profondeur, rythme) : observation S/C
   prioritaire avant d'écrire la v8. Candidats déjà notés dans la revue (variété de plans mesurée par la part du cadre, budget
   d'idées pour un praticien, ouverture animée).
2. Itération 8 : régénérer les deux sujets v7 avec `SKILL.v8` + **un troisième sujet nouveau** (histoire ou économie,
   en dehors des témoins H1-H4) ; série GCP en non-régression ; `tools/overfit_terms.json` à compléter avec le nouveau sujet.
3. Validation finale (protocole §7) : H4 (vaccin ARNm, lycéen), jamais produit jusqu'ici.

## Installer l'environnement (conteneur neuf)

```bash
pip install piper-tts onnx faster-whisper librosa && pip install --no-deps num2words
mkdir -p ~/.local/share/piper-voices && cd ~/.local/share/piper-voices && B=https://huggingface.co/rhasspy/piper-voices/resolve/main/fr/fr_FR
for v in siwis/medium/fr_FR-siwis-medium tom/medium/fr_FR-tom-medium; do curl -sSLO "$B/$v.onnx"; curl -sSLO "$B/$v.onnx.json"; done
mkdir -p /tmp/f && cd /tmp/f && npm pack @fontsource/poppins @fontsource/jetbrains-mono \
  && for t in *.tgz; do tar xzf $t --one-top-level=${t%.tgz}; done \
  && mkdir -p ~/.local/share/fonts && cp */package/files/*-latin-{400,600,700,800}-normal.woff ~/.local/share/fonts/ 2>/dev/null; fc-cache -f
apt-get update && apt-get install -y espeak-ng mbrola mbrola-fr4      # repli voix seulement
# PostgreSQL 18 (pour régénérer les plans réels) : dépôt apt.postgresql.org, puis pg_createcluster 18 main && pg_ctlcluster 18 main start
# Playwright + Chromium, ffmpeg, numpy, scipy : déjà présents dans l'image par défaut
```
Réseau constaté : huggingface.co, pypi, npm, sites de documentation, PubMed, Cambridge Core, téléchargements de releases GitHub
et raw.githubusercontent accessibles ; pages et API github.com limitées aux dépôts de la session. Aucune clé d'API vocale.

## Boucle de travail (un épisode)

```bash
cd motion-explainer-lab
python3 tools/voice.py versions/<id> --check            # voix Piper, horodatage des mots, visèmes, écoute Whisper
python3 tools/build.py <id>                              # page autonome
node tools/beats.mjs versions/<id>/index.html            # trous de rythme, sans rendu
node tools/qa.mjs versions/<id>/index.html iterations/vN/<sujet> && python3 tools/analyze.py iterations/vN/<sujet>
python3 tools/factcheck.py versions/<id> research/<sujet>/SOURCES.md [sorties réelles…]
node tools/export.mjs versions/<id>/index.html versions/<id> 4 && python3 tools/audio.py versions/<id> && python3 tools/build.py <id>
python3 tools/overfit_lint.py skill/SKILL.v7.md skill/SKILL.v8.md   # G1 avant toute nouvelle version du skill
python3 tools/gallery.py                                 # régénère gallery/ (puis publier avec l'url ci-dessus)
```
Export : ~10 min par vidéo de 2:40 sur 4 cœurs. Les 1080p (`video.mp4`), `voice/` et `soundtrack.wav` ne sont pas versionnés ;
les 720p et `timing.json` le sont (la voix se régénère à l'identique depuis le cache texte → WAV).

## Pièges connus (moteur)

- Un deuxième `K.A()` sur un même élément écrase sa position : chaîner via `moves` ou `k.pulse`.
- Un attribut `opacity` est écrasé par l'animateur : `fill-opacity` pour un calque translucide.
- Ancres de mots : `T(cue, mot, n)` compare le début du mot normalisé (« l'azote » → `azote`, « nœud » → `noeud`) ; un mot absent lève une erreur.
- Pas de `//` dans une ligne de code compacte (coupe la suite) : `/* */`.
- `kit_series.js` = ancien kit propre à la série GCP (v6) ; le kit générique est `kit.js` (`sceneKit`).
