# Tailscale, épisode 1 — fonctionnement, incidents, journaux

Demande (6 novembre 2026) : « recherche sur Tailscale : à quoi ressemblent les incidents, quels journaux, comment ça fonctionne ; vidéo motion avec le skill ».
Recherche selon le skill v7 (§0 bis) : `research/tailscale/SOURCES.md` (30 faits, citations relues dans le texte brut) et `research/tailscale/RECHERCHE.md` (synthèse).
Image produite avec le pipeline illustré éprouvé sur la refonte LLMjacking (HyperFrames + personnages Rive), désormais outillé.

| | |
|---|---|
| Script | `episode.js` : 23 cues, 2 « devinez », 2 idées reçues, cas type composite (Cyble 2024 + Cato CTRL 2026), récap en 3 actions |
| Voix | `python3 tools/voice.py versions/v9-tailscale --check` : Piper siwis (voleur : tom), WER Whisper 6,5 %, 148 mots/min |
| Minutage | `python3 tools/timeline.py versions/v9-tailscale` → `words.json` (temps des mots) + `meta.json` (pour `audio.py`) ; 3 min 12 |
| Image | `parts/world.js` (7 lieux), `parts/camera.js`, `parts/chars.js`, assemblés dans `src/illus/shell.html` par `python3 tools/illus_build.py versions/v9-tailscale "Tailscale · épisode 1"` |
| Rendu | `HYPERFRAMES_NO_TELEMETRY=1 npx hyperframes@0.9.0 render --fps 24 --workers 4 --quality looks -o _silent.mp4` (en tâche de fond) |
| Son | bruitages = `window.__SFX` de la composition (pops et tics espacés de 0,25 s) copiés dans `meta.json`, puis `python3 tools/audio.py versions/v9-tailscale` (musique « curious ») |
| Faits | `tools/factcheck.py` sur les sous-titres + même contrôle sur les textes de `parts/world.js` : 0 nombre orphelin |

Lieux : poste piraté et C2 qui tombe · archipel du tailnet et sa tour de contrôle (coordination) · passage direct (WireGuard) ou ballon-relais (DERP) et mur pare-feu ·
le poste rejoint le tailnet de l'attaquant · bibliothèque des trois journaux (audit, flow logs, client) et le registre de l'attaquant · fouille du poste (`tailscale status --json`) et clé réutilisable volée · récap sur le même poste.
