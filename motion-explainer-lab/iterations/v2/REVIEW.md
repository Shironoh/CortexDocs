# Itération 2 — vidéo v2 générée avec `SKILL.v1`

Livrables : `versions/v2/index.html`, `versions/v2/video.mp4` (2:54), planches `iterations/v2/sheets/`, `QA.md`.
Processus : script régénéré depuis la fiche (budget de mots calculé avant d'écrire : 394 mots pour 177 s),
QA, **une** passe de corrections (comme le prévoit le skill), QA finale. Chiffres ci-dessous = après correction.

## 1. Effet des règles de v1 (mesuré)

| Règle v1 | Mesure v1 → v2 |
|---|---|
| Budget de mots avant d'écrire | 1er jet 234 s → 1er jet **174 s** (aucune compression a posteriori) |
| Couper une idée plutôt que comprimer | centralisation multi-projets sortie vers un épisode 2 ; aucune scène à 1 cue |
| Plans définis par la taille du sujet (`frame`) | sujet trop petit 35/63 → 28/57 ; gros plans enfin pleins (planches s4) |
| Bande sous-titres interdite aux personnages | personnages sous les sous-titres **33 → 4** captures |
| Premier plan jamais devant le sujet | occultations **18 → 0** |
| Le visuel n'en sait pas plus | vol montré par une silhouette en pointillés + « ? » (s5), clé fuitée en pointillés |
| Pourquoi sourcé | « Google le juge indispensable à l'audit » (_Required = conformité/audit, doc) |
| Récap = objets + déclencheur | couronne + clé → cloche ; caméra qui s'allume ; loupe sur les pas |

## 2. Grille

| Critère | Note | Preuve |
|---|---|---|
| F1 | 4 | Fil rouge 7/7 scènes, verdict + retour des 4 questions du hook cochées (c19). |
| F2 | 3 | s4 introduit encore 2 termes (SetIamPolicy prononcé + compte de service) ; s2 en a 3 (organisation, projet, API). |
| F3 | 4 | Pourquoi sourcé (s3) ou compromis observable (s5) ; conséquences visuelles (dôme, trou dans la frise, couronne qui revient). |
| F4 | 3 | Réflexes montrés comme objets avec déclencheur + hotspot exécutable. On ne dit jamais **où** agir (quel écran, quel outil). |
| F5 | 4 | Incertitudes montrées comme telles ; « sa clé a sans doute fuité ». |
| F6 | 3 | 2 idées reçues + 3 devinez ; le silence de c12 est un gros plan statique sur une caméra (peu de suspense). |
| F7 | 3 | 4 idées, 145 mots/min, toutes les scènes ≥ 2 cues ; s4 reste dense. |
| **Fond** | **3,43** | (v1 : 2,71) |
| V1 | 3 | 1,96 bloc de texte en moyenne. |
| V2 | 3 | 2 scènes sous 3 échelles de plan (v1 : 6). |
| V3 | 3 | Textes coupés 16 → 7, chevauchements 2. |
| V4 | 2 | Encore 3 fenêtres figées (c8, c11, c15) après correction. |
| V5 | 3 | Personnages visibles et lisibles ; antagoniste en 2/7 scènes + silhouette incertaine + robot. |
| V6 | 2 | Surface vide 48 % : les plans d'ensemble restent des aplats sombres (sol, périphérie assombrie). |
| V7 | 2 | Même voix synthétique ; 0 dépassement (1 phrase à 195 mots/min). |
| **Forme** | **2,57** | (v1 : 2,00) |

## 3. Diagnostic

| # | Observation | Étiquette | Suite |
|---|---|---|---|
| 1 | Fenêtres figées en v1 **et** en v2 malgré la règle « un mouvement toutes les 1,5 s » | E ×2 → **S** | Règle rendue opérationnelle : quota ⌈durée/2⌉ beats par cue, définition d'un beat (≥ 5 % du cadre), gros plan qui s'anime |
| 2 | Robot loin de la case qu'il « signe » → plan forcément petit (avant correction) | **S** | Mise en place : ce qui est vu ensemble est posé à moins d'une demi-largeur de cadre |
| 3 | Éléments d'un beat qui traînent dans le suivant (v1 c15, v2 c13, c6) | E ×2 → **S** | Nettoyage : chaque élément a une sortie ; le récap part d'un décor vidé |
| 4 | Analyste debout devant le libellé « 03:07 » | **S + T** | Un personnage ne se tient jamais devant un texte ; contrôle QA « perso devant texte » |
| 5 | Deux termes nouveaux par scène en v1 **et** en v2 | E ×2 → **S** | Liste des termes par scène dans la fiche ; le second dit par sa fonction, nom exact à l'écran |
| 6 | Assombrissement 30-40 % → bords noirs, plans « vides » | **S** | Spotlight 20-30 % ; décor qui remplit le plan d'ensemble |
| 7 | Sous-titres visibles pendant le test d'image figée (bug CSS) ; variété de plans mesurée sur des zooms absolus (sans sens depuis `frame`) | **T** | Corrigés ; variété = nombre d'échelles distinctes par scène |
| 8 | Prononciation, choix du compte Gmail fictif | X | notes de production |

## 4. Garde-fous

| Règle (skill v2) | G1 | G2 H1 / H2 / H3 | G3 | Verdict |
|---|---|---|---|---|
| Quota de beats + définition d'un beat | ok | utile / utile / utile | obs. 1 | ✅ |
| Mise en place (demi-cadre) | ok | utile (client/serveur DNS) / utile (attaquant/DC) / utile (banque/emprunteur) | obs. 2 | ✅ |
| Nettoyage | ok | utile / utile / utile | obs. 3 | ✅ |
| Personnage jamais devant un texte | ok | utile / utile / utile | obs. 4 | ✅ |
| Termes listés par scène | ok | utile / **très** utile (jargon AD dense) / utile | obs. 5 | ✅ |
| Spotlight 20-30 % + décor qui remplit | ok | neutre / neutre / neutre (style) | obs. 6 | ✅ (réglage, pas une règle de fond) |
| Contrôles QA (image figée sans sous-titres, échelles, perso devant texte) | ok | neutre (outillage) | obs. 4, 7 | ✅ |

G4 : 200 → 205 lignes (+2,5 %). Lint G1 : OK.
