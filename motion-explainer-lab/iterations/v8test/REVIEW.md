# Test en conditions réelles — LLMjacking, épisode 1 (skill v7, sans retouche du skill)

Demande de l'utilisateur (2 novembre 2026) : « expliquer ça et comment détecter », à partir de l'article GTIG / Mandiant publié le jour
même. Le skill v7 a été appliqué tel quel ; seules les vidéos et l'outillage de l'épisode ont été corrigés pendant la production.

## 1. Ce que le skill a fait

| Étape | Résultat |
|---|---|
| Cadrage | audience = détection/réponse praticien × services LLM novice ; inventaire de 14 artefacts ; l'inventaire dépassait un épisode → **découpage** : épisode 1 = la chaîne vue depuis la détection ; épisode 2 annoncé (escalade, persistance) |
| Recherche | article lu et **vérifié mot à mot dans le texte brut** (le résumé automatique contenait une confusion de numéro de figure) ; recoupé avec 4 pages de documentation officielle (AWS Bedrock/CloudTrail, Google Cloud Audit Logs, Service Usage, Agent Platform). Fait clé trouvé par recoupement, absent de l'article : AWS journalise `InvokeModel`/`Converse` comme événements de gestion (par défaut), alors que l'inférence Google Cloud est en Data Access (éteint par défaut) → devenu l'idée reçue centrale |
| Faits | 19 lignes dans la fiche, 0 nombre orphelin (`factcheck.py`) ; cas du fil rouge déclaré « cas type » composite |
| Voix | 24 parties, 2:52 ; WER Whisper 8,5 % ; « LLMjacking » et « LLM mixer » bien reconnus ; termes anglais dits par leur fonction (« l'activation du service », « la demande d'accès à un modèle »), noms exacts à l'écran |
| Rythme | 17 trous de plus de 2,5 s au premier jet → 0 |

## 2. QA : premier jet → version exportée

| | 1er jet | après 3 passes |
|---|---|---|
| Captures avec alerte | 52/66 | 47/66 |
| Textes trop petits | 153 | 23 (surtout 35-43 unités, juste sous le seuil de 44) |
| Plus de 3 blocs de texte | 27 | 15 |
| Texte dans la bande sous-titres | 24 | 7 |
| Fenêtres figées > 2,5 s | 6 | 0 |
| Scènes sous 3 échelles de plan | 6/7 | 5/7 (la mesure par zoom absolu reste trompeuse, cf. revue v7) |

## 3. Diagnostic (à confirmer par ton avis)

| Observation | Étiquette | Proposition pour la v8 |
|---|---|---|
| Du texte posé sous le niveau du sol d'une zone tombe dans la bande des sous-titres dès que la caméra cadre un objet plus haut (s1, s5, s6, s7) | **S** (3ᵉ itération où la règle « zones de sécurité » n'empêche pas la faute) | contrôle à la construction : le kit refuse ou signale tout texte sous `FLOOR − 40` dans une zone |
| Objets d'un beat laissés sous le beat suivant (panneau CloudTrail sur les bâtiments, étiquettes empilées) | **S** (E répété : v7-PG puis ici) | chaque objet déclare sa sortie au cue où son beat se termine ; contrôle QA « objet d'un cue précédent encore visible sous l'objet du beat » |
| Les « pulsations » ajoutées pour remplir le quota de beats ne suffisent pas à casser une image figée, et HyperFrames les classe parmi les signes d'une vidéo générée | **C** (quota de beats ↔ qualité du mouvement) | un beat = changement d'état, entrée, geste ou mouvement de caméra ; la pulsation ne compte pas |
| Gros plans trop serrés qui coupent leur propre étiquette (récap) | **E** | cadrer l'objet avec son étiquette |
| Le résumé automatique d'une page a introduit une erreur de détail ; la vérification dans le texte brut l'a évitée | **S** (bonne pratique non écrite) | « citer depuis le texte de la source, jamais depuis un résumé » dans la section Rechercher |
| Pas d'environnement cloud pour produire de vrais événements | **X** (environnement) | exemples publiés par les fournisseurs, dits comme tels |
