# Itération 3 — vidéo v3 générée avec `SKILL.v2`

Livrables : `versions/v3/index.html`, `versions/v3/video.mp4` (2:52), planches `iterations/v3/sheets/`, `QA.md`.
Processus : fiche + script régénérés (termes listés par scène, quota de beats), audit des beats sans rendu
(`tools/beats.mjs` : 13 trous > 2,5 s au premier jet → 0), QA, une passe de corrections, QA finale.

## 1. Effet des règles de v2 (mesuré)

| Règle v2 | v2 → v3 |
|---|---|
| Quota de beats, beat ≥ 5 % du cadre | fenêtres figées 3 → **1** (la dernière image, 3 s) ; trous dans la feuille de beats 13 → 0 |
| Termes listés par scène | s2 : « organisation » dite « votre entreprise » (nom à l'écran) ; s4 : SetIamPolicy dit « un changement de droits » ; s6 : « il crée une nouvelle clé » (nom tapé à l'écran) |
| Nettoyage | trop de textes simultanés 5 → 2 captures ; chevauchements 2 → 1 |
| Personnage jamais devant un texte | 3 cas au 1er jet → 0 après correction |
| Spotlight 25 % + décor | surface vide 48 % → 42 % |

**Bug moteur découvert par la QA** : `frame()` mesurait les objets avant leur apparition (taille ~0), d'où un
récap hors champ. Corrigé (`FRAMING` : mesure à l'état final). C'est un défaut d'outillage, pas une règle.

## 2. Grille

| Critère | Note | Preuve |
|---|---|---|
| F1 | 4 | Inchangé, fil rouge complet. |
| F2 | 4 | Un terme nouveau par scène, les noms exacts portés par l'écran. |
| F3 | 4 | Inchangé. |
| F4 | 3 | Réflexes concrets mais on ne dit toujours pas **où** les appliquer (console, quel écran). |
| F5 | 4 | Inchangé. |
| F6 | 3 | Les devinez ont gagné un objet en suspens (gomme levée c7, « ? » dans la case c9). |
| F7 | 3 | Inchangé. |
| **Fond** | **3,57** | |
| V1 | 3 | 2 captures à plus de 3 textes. |
| V2 | 3 | 5/7 scènes à 3 échelles ou plus (s5, s7 à 2). |
| V3 | 3 | 6 coupés, 1 chevauchement. |
| V4 | 3 | 1 fenêtre figée (fin). |
| V5 | 3 | Personnages lisibles ; récap : l'analyste loin des objets qu'il présente. |
| V6 | 2 | Vide 42 % : murs et sol encore en couleur de fond (#0B1A3A/#081330). Récap (c18-c19) petit et haut dans le cadre. |
| V7 | 2 | Voix synthétique ; bruitages génériques (le même « pop » pour tout). |
| **Forme** | **2,71** | |

## 3. Diagnostic

| # | Observation | Étiquette | Suite |
|---|---|---|---|
| 1 | Vide à 42 % alors que la composition est correcte : le sol et les murs **sont** la couleur du fond. La palette du skill (« fond sombre profond ») et la règle « < 40 % de pixels proches du fond » se contredisent dès qu'on peint le décor avec le fond | **C** | Le fond n'est pas une surface de décor : murs/sols en teintes de plan ou de zone ; le fond n'apparaît qu'en profondeur |
| 2 | Le son ne porte aucun sens : même « pop » pour une révélation, une erreur, un impact | **S** | Sons sémantiques (comme le code couleur) : révélation, idée reçue démentie, conséquence |
| 3 | Les actions ne disent jamais où les appliquer | **S** | Chaque action du récap nomme son lieu (outil, écran, commande) dans la narration ; détail au hotspot |
| 4 | Récap trop petit, analyste loin des objets (c18) | E (mise en place, règle v2) | à corriger en v4 ; si ça revient → règle à durcir |
| 5 | Dernière image tenue 3 s | E | à corriger en v4 |
| 6 | `frame()` mesurait des objets invisibles | **T** (moteur) | corrigé |

## 4. Garde-fous

| Règle (skill v3) | G1 | G2 H1 / H2 / H3 | G3 | Verdict |
|---|---|---|---|---|
| Le fond n'est pas une surface de décor | ok | utile / utile / utile | obs. 1 | ✅ |
| Sons sémantiques | ok | utile (requête qui aboutit / échoue) / utile / utile (hausse / baisse) | obs. 2 | ✅ |
| Le récap dit où agir | ok | utile (« dans les réglages réseau du téléphone ») / utile (« dans l'observateur d'événements, ID 4769 ») / utile (« dans l'offre de prêt, ligne TAEG ») | obs. 3 | ✅ |
