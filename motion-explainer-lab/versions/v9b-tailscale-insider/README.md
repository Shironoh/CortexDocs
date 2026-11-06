# Tailscale, épisode 1 bis — et si l'attaquant était dans la tour ?

Variante demandée le 6 novembre 2026 : « une version alternative où c'est un insider de Tailscale qui fait l'attaque ».
Interprétation retenue : un employé de Tailscale (ou quiconque contrôle son plan de contrôle) agit contre un client. **Scénario hypothétique** : aucun incident public de ce type trouvé ; il est dit comme tel dans la narration et à l'écran.

Le modèle de menace vient de Tailscale lui-même : le livre blanc Tailnet Lock explique qu'un plan de contrôle compromis ou malveillant pourrait diffuser des nœuds porteurs de clés générées par l'attaquant, puis envoyer ou recevoir du trafic en clair. Faits 31 à 45 de `research/tailscale/SOURCES.md`.

| | |
|---|---|
| Script | `episode.js` : 20 cues, 2 « devinez » (l'insider peut-il lire votre trafic ? le nœud fantôme passe-t-il le verrou ?), récap en 3 actions |
| Voix | Piper siwis (insider : tom), WER 8 % ; les écarts restants sont des homophones (« pair » / « père », « nœud » / « ne ») |
| Image | `parts/` + `src/illus/props.js` (accessoires partagés avec l'épisode 1), assemblés par `tools/illus_build.py` ; sous-titres de plus de deux lignes découpés automatiquement en deux moitiés |
| Durée | 2 min 36 |

Lieux : la tour et son insider · le nœud fantôme (clé diffusée, trafic détourné) · ce que vous verriez (audit tenu par Tailscale, `tailscale status --json` → `Peer`, journaux aux deux bouts) ·
Tailnet Lock (nœuds de signature, vérification, refus du nœud non signé, secret de désactivation) · limites (coupure, premier état, `tailscale lock status`, `--statedir`, TS-2025-008) · récap.
