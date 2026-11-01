# Évaluation de l'outillage (novembre 2026)

Critères : (1) une seule source pour le lecteur HTML interactif **et** le MP4 ; (2) rendu déterministe (fonction pure du temps,
seek, tests sans rendu) ; (3) coût d'apprentissage pour un agent qui doit produire un épisode en une session ; (4) licence ;
(5) fonctionne hors ligne dans un artifact (pas de CDN obligatoire).

| Option | Testé | Résultat | Verdict |
|---|---|---|---|
| **Moteur maison SVG** (`src/engine.js`) + export Playwright (`tools/export.mjs`) | oui, 7 vidéos | 1080p24, ~14 img/s avec 3 workers ; même code pour le lecteur et la vidéo ; hotspots, quiz, chapitres | **retenu** |
| **Remotion 4.0.539** (React, `@remotion/renderer`) | oui : composition SVG 1080p, Chromium headless de l'image | 240 images en 13,3 s (≈ 18 img/s, concurrency 4), bundle 2,3 s | non retenu : gain de vitesse faible (même principe, captures Chromium), et il faudrait maintenir un deuxième rendu à côté du lecteur interactif. Licence : gratuite pour un particulier ou une entreprise ≤ 3 personnes, licence payante au-delà. À reconsidérer seulement si l'on abandonne le lecteur interactif. |
| **Motion Canvas 3.17** (TypeScript, générateurs) | non (lecture de la doc, paquet npm joignable) | éditeur Vite + rendu image par image dans le navigateur ; MIT | non retenu : modèle impératif par générateurs (le seek passe par une relecture), pas de lecteur interactif autonome léger. Idées reprises : signaux et tweens nommés. |
| **Lottie** (`lottie-web` 5.13, `goToAndStop(frame, true)`) | lecture de l'API | déterministe si piloté image par image ; exige des animations créées dans After Effects ou trouvées sur LottieFiles (licence « Lottie Simple License » à vérifier pour chaque fichier) ; style et palette rarement cohérents avec le flat maison | **optionnel** : utile pour une animation secondaire précise (un geste complexe) si un fichier libre et cohérent existe. Intégration : charger le JSON inline, `K.fx(t => anim.goToAndStop(t * fps, true))`. Pas par défaut. |
| **Rhubarb Lip Sync** (bouches depuis l'audio) | téléchargement de la release joignable | inutile avec Piper : les alignements de phonèmes de Piper donnent les visèmes exacts | **repli** pour une voix enregistrée (fichier externe) : `rhubarb -r phonetic voix.wav`. Sans Rhubarb : enveloppe d'amplitude (`voice.py`, `envelope_visemes`). |
| **Piper TTS 1.8** (voix neuronales, onnx, CPU) | oui | 5 voix FR testées ; alignement des phonèmes exact (`include_alignments=True`, paquet `onnx`) ; ~1 s de calcul par phrase | **retenu** : voix par défaut `fr_FR-siwis-medium`, `length_scale 1.08`, pause 0,35 s |
| **faster-whisper 1.2** (`small`, int8, CPU) | oui | transcription d'un épisode ≈ 1 min ; horodatage par mot | **retenu** comme contrôle d'intelligibilité (écoute sans le script) et repli d'alignement |
| **espeak-ng + mbrola fr4** | oui | robotique, débit forcé pour tenir dans le cue | **repli** si aucune voix Piper |
| **Musique** | `tools/music.py` | musique originale générée (accords par ambiance, pad, arpèges, basse, percussions légères), suit les scènes, se tait pendant les « devinez » ; aucune question de licence | **retenu** par défaut ; repli : `audio.py --music piste.mp3` (fichier CC0 ou CC-BY crédité dans le pied de page) |
| API vocales payantes (ElevenLabs, Google, Azure) | clés absentes de l'environnement | — | à brancher si une clé est fournie en secret d'environnement (voir HANDOFF) |

## Mesures Piper (même texte de 43 mots, `voice-lab/samples/`)

| Voix | WER Whisper (intelligibilité) | Étendue de F0 (p5-p95) | Débit |
|---|---|---|---|
| siwis-medium (F) | 4,3 % | 11,0 demi-tons | 175 mots/min (157 avec `length_scale 1.08`) |
| tom-medium (H, 44,1 kHz) | 2,2 % | 7,2 demi-tons | 161 |
| upmc-jessica (F) | 6,5 % | 8,4 | 187 |
| upmc-pierre (H) | 8,7 % | 18,7 | 187 |
| gilles-low (H, 16 kHz) | 10,9 % | 11,5 | 150 |
| espeak mbrola fr4 (référence) | 2,2 % | 5,8 | 247 |

L'intelligibilité seule ne dit pas le naturel (espeak est très intelligible et très robotique) : l'étendue de F0 mesure
l'intonation. siwis combine bonne intelligibilité et intonation la plus vivante parmi les voix nettes ; tom est l'alternative masculine.

**Limite trouvée** : les termes anglais sont mal prononcés par une voix française (« Create Service Account Key » entendu
« crisier de service à compte… »). Correctifs, dans cet ordre : dire le terme par sa fonction en français et le montrer
écrit à l'écran ; sinon le respeller dans le lexique (`tools/lexicon_fr.json` ou META `voice.lexicon`) ; vérifier avec `voice.py --check`.
