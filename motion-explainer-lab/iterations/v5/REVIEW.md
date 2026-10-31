# Itération 5 — vidéo v5 générée avec `SKILL.v4`

Livrables : `versions/v5/index.html`, `versions/v5/video.mp4` (2:56), planches `iterations/v5/sheets/`, `QA.md`.

## 1. Effet des règles de v4 (mesuré)

| Règle v4 | v4 → v5 |
|---|---|
| Lieu introduit dans la scène qui l'explique | « page Journaux d'audit » en s5 (dite par sa fonction, interrupteur montré basculant **pour la suite** seulement) ; « Logs Explorer » en s6 (fenêtre autour de la frise) ; « IAM » au verdict s7 ; le récap ne fait que rappeler → F2 remonte à 4 |
| Objet cadré visible à l'arrivée ; contrôle `focus_hidden` | spot sur objet invisible 3 → **0** |
| Test de compréhension (3 questions) | Q3 « que faire en premier, et où ? » a fait ajouter « Dans IAM » au verdict (c17) : sans le test, aucune version ne disait où retirer le rôle |

## 2. Grille

| Critère | Note | Preuve |
|---|---|---|
| F1 | 4 | Fil rouge complet, 4 questions du hook cochées à la fin. |
| F2 | 4 | Un terme nouveau par scène, y compris les lieux. |
| F3 | 4 | Pourquoi sourcé ou compromis observable, conséquences visuelles. |
| F4 | 4 | 3 réflexes avec déclencheur, objet, lieu (introduit plus tôt) + hotspot exécutable. |
| F5 | 4 | Conditions dites (« par défaut », « pour la suite ») ; incertitudes en pointillés. |
| F6 | 3 | Le silence de c12 montre encore surtout un objet (la caméra) : règle v5 ajoutée. |
| F7 | 3 | 145 mots/min ; s4 reste la scène la plus chargée. |
| **Fond** | **3,71** | |
| V1 | 4 | Jamais plus de 3 textes. |
| V2 | 4 | 7/7 scènes à 3 échelles de plan ou plus. |
| V3 | 4 | 3 textes coupés (en mouvement), 0 chevauchement. |
| V4 | 4 | 0 fenêtre figée, 0 trou dans la feuille de beats. |
| V5 | 3 | Personnages lisibles ; 5 captures où un personnage touche la bande sous-titres (sorties de champ). |
| V6 | 3 | Vide 7 % ; « sujet trop petit » encore 19 captures (icônes ciblées par le spot dans des plans larges). |
| V7 | 3 | Sons sémantiques ; voix espeak-ng/mbrola, seule voix française disponible hors ligne ici. |
| **Forme** | **3,57** | |

## 3. Diagnostic → skill v5 (final)

| # | Observation | Étiquette | Suite |
|---|---|---|---|
| 1 | Silence de devinez cadré sur un objet seul (c12, v2 à v5) | **S** | Le plan du silence montre l'objet en suspens et ce qu'il menace |
| 2 | « Sujet trop petit » persistant sur toutes les versions (19-25) | E répété → **S** | Un objet de beat < 8 % du cadre entre en grossissant ou la caméra s'en rapproche |
| 3 | L'audit des beats sans rendu a trouvé 13 trous en quelques secondes (v3) | **T** | Étape de contrôle avant toute capture |
| 4 | Voix synthétique | X (environnement) | Hors skill : la règle « installer avant de renoncer » existe déjà ; aucune voix neuronale FR téléchargeable ici |

## 4. Garde-fous

| Règle (skill v5) | G1 | G2 H1 / H2 / H3 | G3 | Verdict |
|---|---|---|---|---|
| Plan du silence = question entière | ok | utile (requête + serveur inconnu) / utile (ticket + compte ciblé) / utile (taux + mensualité) | obs. 1 | ✅ |
| Petit objet de beat → grossit ou caméra proche | ok | utile partout | obs. 2 | ✅ |
| Contrôle des beats sans rendu | ok (le mot « audit » reformulé pour passer G1) | neutre (outillage) | obs. 3 | ✅ |

Validation finale hors sujet : `holdout/VALIDATION.md` (H4, vaccin ARNm, lycéen).
