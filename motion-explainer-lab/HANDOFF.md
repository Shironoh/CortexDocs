# Reprendre le projet dans une nouvelle session

Dépôt `Shironoh/CortexDocs`, branche `claude/kurzgesagt-motion-design-loop-98obv8`, dossier `motion-explainer-lab/`.
Galerie (privée) : https://claude.ai/artifact/6ztZsnHguFMHhbD2ofp6nz — pour la mettre à jour depuis une autre
session, publier avec ce lien en `url` (sinon un nouvel artifact est créé).

## État au 1er novembre 2026

- Skill courant : `skill/SKILL.md` (= `SKILL.v6.md`). Le skill installé sur le compte est toujours la version d'origine (v0) :
  le remplacer par `skill/SKILL.md` pour que les nouvelles sessions l'utilisent.
- Itérations 1 à 5 : vidéo unique (`versions/v1`…`v5`). Itération 6 : série DFIR en 3 épisodes (`versions/v6-ep1..3`).
- Revues : `iterations/vN/REVIEW.md` ; protocole : `PROTOCOL.md` ; historique du skill : `skill/CHANGELOG.md`.

## En attente

1. **Retour utilisateur sur la série v6** (profondeur suffisante ? épisode trop léger ?). Le traiter comme une observation
   S/C prioritaire (protocole §2) avant toute nouvelle règle.
2. **Voix** : espeak-ng/mbrola, jugée « horrible ». Options : clé API Google Cloud Text-to-Speech (secret d'environnement,
   l'API est joignable), autoriser `huggingface.co` (voix Piper FR), ou enregistrement externe à partir du script.
3. Épisodes possibles : centraliser les journaux de tous les projets (sink agrégé d'organisation), activer Data Access
   de façon ciblée, rejouer l'incident complet en enquête chronologique.

## Installer l'environnement (conteneur neuf)

```bash
apt-get update && apt-get install -y espeak-ng mbrola mbrola-fr4      # voix
mkdir -p /tmp/f && cd /tmp/f && npm pack @fontsource/poppins @fontsource/jetbrains-mono \
  && for t in *.tgz; do tar xzf $t --one-top-level=${t%.tgz}; done \
  && mkdir -p ~/.local/share/fonts && cp */package/files/*-latin-{400,600,700,800}-normal.woff ~/.local/share/fonts/ 2>/dev/null; fc-cache -f
# Playwright + Chromium, ffmpeg, numpy, PIL : déjà présents dans l'image par défaut
```

## Boucle de travail

```bash
cd motion-explainer-lab
python3 tools/build.py v6-ep1                           # versions/<id>/episode.js -> index.html
node tools/beats.mjs versions/v6-ep1/index.html         # trous de rythme, sans rendu (quelques secondes)
node tools/qa.mjs versions/v6-ep1/index.html iterations/v6/ep1 && python3 tools/analyze.py iterations/v6/ep1
node tools/export.mjs versions/v6-ep1/index.html versions/v6-ep1 3 && python3 tools/audio.py versions/v6-ep1
python3 tools/overfit_lint.py skill/SKILL.v6.md skill/SKILL.v7.md   # garde-fou G1 avant toute nouvelle version du skill
python3 tools/gallery.py                                # régénère gallery/ (puis publier avec l'url ci-dessus)
```

Nouvel épisode : copier `versions/v6-ep2/episode.js` dans `versions/v6-ep4/`, réécrire la fiche (inventaire de valeur),
les cues et les `kit.eventRoom({...})`. Les 1080p (`video.mp4`) ne sont pas versionnées ; les 720p le sont.

## Pièges connus (moteur)

- Un deuxième `K.A()` sur un même élément écrase sa position : chaîner via `el._a.o.fn` / `moves`.
- Un attribut `opacity` est écrasé par l'animateur : utiliser `fill-opacity` pour un calque translucide.
- Ancres de mots : `T(cue, mot, n)` compare le mot normalisé (« l'API » → `lapi`, « n'importe » → `nimporte`).

## Stack cible quand l'environnement est ouvert (à vérifier au démarrage)

Variables lues si présentes (secrets de l'environnement, jamais dans le chat) :
`ELEVENLABS_API_KEY` · `GOOGLE_TTS_API_KEY` · `AZURE_SPEECH_KEY` + `AZURE_SPEECH_REGION` ·
`GCP_SANDBOX_SA_JSON` + `GCP_SANDBOX_PROJECT` (projet bac à sable dédié, pour produire de vraies entrées d'audit).

- **Voix** : ElevenLabs (meilleure expressivité FR) ou Google Chirp 3 HD / Azure neural FR ; à défaut Piper FR (huggingface.co).
  Récupérer les **horodatages par mot** et caler les beats dessus (au lieu du modèle 2,6 mots/s).
- **Animation** : garder le moteur SVG pour le lecteur interactif ; pour la vidéo, évaluer Motion Canvas ou Remotion (npm),
  personnages en Lottie, synchro des bouches (Rhubarb), musique libre de droits.
- **Contenu** : docs.cloud.google.com, github.com (règles Sigma / Elastic detection-rules), attack.mitre.org ; vraies entrées
  JSON générées dans le projet bac à sable plutôt que reconstituées.
