# Itération 4 — vidéo v4 générée avec `SKILL.v3`

Livrables : `versions/v4/index.html`, `versions/v4/video.mp4` (2:56), planches `iterations/v4/sheets/`, `QA.md`.

## 1. Effet des règles de v3 (mesuré)

| Règle v3 | v3 → v4 |
|---|---|
| Le fond n'est pas une surface de décor | surface vide **42 % → 7 %** (murs et sols en teintes de zone) : la contradiction palette/vide est levée |
| Sons sémantiques | carillon montant aux 3 révélations (automatique), buzzer grave sur les 2 « Faux », coups sourds sur les conséquences |
| Le récap dit où agir | étiquettes « Logs Explorer », « IAM », « Enquête » sur les objets-réflexes ; dit dans la narration |
| (correction E de v3) récap trop petit | un plan par réflexe puis plan d'ensemble ; cartes à mi-hauteur |

Fenêtres figées : 1 → **0**. Trous de beats : 0. Scènes sous 3 échelles : 2 → 1.

## 2. Grille

| Critère | Note | Preuve |
|---|---|---|
| F1 | 4 | Inchangé. |
| F2 | 3 | **Régression** : le récap introduit d'un coup deux noms nouveaux (Logs Explorer, IAM). |
| F3 | 4 | Inchangé. |
| F4 | 4 | Chaque réflexe a son déclencheur, son objet et son lieu. |
| F5 | 4 | Lieux vérifiés (alerte de journal depuis Logs Explorer ; Data Access dans IAM et administration › Journaux d'audit). |
| F6 | 3 | Inchangé. |
| F7 | 3 | Inchangé. |
| **Fond** | **3,57** | (= v3 : +1 en F4, −1 en F2) |
| V1 | 3 | 2 captures à plus de 3 textes. |
| V2 | 4 | 6/7 scènes à 3 échelles ou plus. |
| V3 | 3 | 7 textes coupés (gros plans qui coupent l'en-tête de la fiche). |
| V4 | 4 | Aucune fenêtre figée. |
| V5 | 3 | Personnages lisibles, l'analyste se rapproche des objets du récap. |
| V6 | 3 | Vide 7 % ; mais la caméra arrive parfois sur un objet pas encore apparu (c18 : cadre vide 0,3 s). |
| V7 | 3 | Sons porteurs de sens ; voix toujours synthétique. |
| **Forme** | **3,29** | (v3 : 2,71) |

## 3. Diagnostic

| # | Observation | Étiquette | Suite |
|---|---|---|---|
| 1 | « Un seul terme nouveau par scène » contre « chaque action nomme son lieu » : le récap concentre deux noms nouveaux (F2 −1, G5 : régression d'un point, tolérée mais à traiter) | **C** | Le lieu est introduit dans la scène qui explique l'action (il y compte comme son terme) ; le récap ne fait que rappeler |
| 2 | Caméra posée sur un objet pas encore apparu (effet de bord de `frame()` corrigé en v3) | **S + T** | Règle : l'objet cadré est visible à l'arrivée ; contrôle QA `focus_hidden` |
| 3 | Les manques du récap (où agir) ont survécu à 3 itérations sans qu'aucun contrôle ne les voie | **S** (vérification) | Relecture pédagogique : écrire les 3 questions que le spectateur doit savoir résoudre, dont « où ? », et vérifier que la narration y répond |
| 4 | Contrôle « sujet trop petit » à 8 % de surface contradictoire avec « personnage ≥ 25 % de la hauteur » (un personnage à 25 % de hauteur ≈ 3 % de surface) | **T** | Contrôle aligné : 8 % de surface **ou** 25 % de hauteur |

## 4. Garde-fous

| Règle (skill v4) | G1 | G2 H1 / H2 / H3 | G3 | Verdict |
|---|---|---|---|---|
| Lieu introduit dans la scène qui l'explique | ok | utile (« réglages Wi-Fi ») / utile (« journal Sécurité ») / utile (« offre de prêt ») | obs. 1 | ✅ |
| Objet cadré visible à l'arrivée de la caméra | ok | utile partout (technique) | obs. 2 | ✅ |
| Test de compréhension en 3 questions | ok | utile / utile / **très** utile (public non technique) | obs. 3 | ✅ |
| Contrôle taille du sujet (surface ou hauteur) | ok | neutre (outillage) | obs. 4 | ✅ |

G5 : F2 a perdu 1 point (toléré : ≤ 1) ; la règle 1 vise précisément cette régression.
