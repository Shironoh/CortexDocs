# Itération 1 — vidéo v1 générée avec `SKILL.v0`

Livrables : `versions/v1/index.html` (jouable), `versions/v1/video.mp4` (2:56, 1080p, voix + bande son),
`iterations/v1/sheets/*.jpg` (planches contact), `iterations/v1/QA.md` + `qa.json`.

## 1. Ce qui s'est passé à la génération

- Premier jet du script : **234 s** pour une limite de 180 s. Le skill donne la formule de durée par cue mais
  aucun budget de mots *avant* d'écrire. Rattrapé en comprimant toutes les phrases et en fusionnant deux cues
  (s4, s7) → 176 s, mais la scène s7 se retrouve avec un seul cue.
- Bug de comptage : en typographie française, « : » et « ? » précédés d'une espace étaient comptés comme des
  mots (≈ 14 s fantômes). Le skill ne définit pas ce qu'est un mot.

## 2. Grille (0-4) avec preuves

| Critère | Note | Preuve |
|---|---|---|
| F1 Question + fil rouge | 3 | Cas présent dans 8/8 scènes, résolu en s8. Mais s7 (centralisation) bâclée en un cue. |
| F2 Accessibilité | 3 | Scène prérequis immeuble/API. s4 introduit 3 termes (SetIamPolicy, compte de service, user agent). |
| F3 Pourquoi + conséquence | 3 | Présents en s3, s5, s6. Absents en s4 ; s7 réduit à une phrase. |
| F4 Actionnabilité | 2 | Récap = trois étiquettes « Alerte / Sink / Data Access » (c22) : rien d'exécutable à l'écran. |
| F5 Exactitude | 3 | Faits sourcés et conditionnés (« par défaut »). Mais « les modifications sont rares : ça coûte peu » est une justification inventée, et s5 **montre** l'attaquant voler les fichiers alors que la narration dit qu'on ne peut pas le prouver. |
| F6 Engagement | 3 | 2 idées reçues explicites (c6, c18), 3 devinez (c7, c10, c14). |
| F7 Charge cognitive | 2 | 5 idées en 176 s, phrases comprimées après coup, une scène à un seul cue. |
| **Moyenne fond** | **2,71** | |
| V1 Montrer > écrire | 3 | 2,0 blocs de texte et 3 mots affichés en moyenne. |
| V2 Caméra | 2 | Trajets de continuité partout, mais 5/8 scènes sous trois valeurs de plan. |
| V3 Lisibilité | 2 | 16 textes coupés, 4 trop petits, 2 chevauchements. |
| V4 Rythme | 2 | 5 fenêtres figées > 2,5 s (c5, c9, c10, c12, c21). |
| V5 Personnages | 2 | Analyste actif 8/8, mais **33/63 captures avec un personnage sous les sous-titres** et 18 masqués par le premier plan (robot caché derrière une plante en c10). |
| V6 Cadrage & lumière | 1 | Surface vide 53 %, sujet trop petit dans 35/63 captures. |
| V7 Son & voix | 2 | Voix espeak-ng/mbrola intelligible mais robotique, aucun dépassement (une phrase accélérée à 195 mots/min) ; bruitages synchrones. |
| **Moyenne forme** | **2,00** | |

## 3. Diagnostic

| # | Observation | Étiquette | Suite |
|---|---|---|---|
| 1 | Script à 234 s ; ensuite tout est comprimé au lieu de couper une idée | **S** | Budget de mots avant d'écrire + « couper une idée, pas les respirations » |
| 2 | « : » et « ? » comptés comme des mots | **S + outil** | Définition du mot dans le skill ; moteur corrigé |
| 3 | Plans définis par des zooms fixes → sujets minuscules, 53 % de vide | **C** | La règle « sujet = 40-60 % du cadre » contredit des zooms fixes indépendants de la taille des objets. Plans définis par la taille du sujet, caméra calculée depuis sa boîte englobante |
| 4 | Personnages posés au sol, en bas du cadre, donc sous les sous-titres | **S + T** | Bande sous-titres interdite aux personnages et objets du beat ; contrôle QA ajouté |
| 5 | Premier plan devant le sujet (robot c10) | **S + T** | Le premier plan ne passe que pendant les trajets ; contrôle QA d'occultation |
| 6 | L'image affirme le vol que la narration déclare improuvable | **S** | « Le visuel n'en sait pas plus que la narration » |
| 7 | « Pourquoi » inventé pour remplir le gabarit | **C** | Le gabarit exige un pourquoi, la règle des faits non confirmés l'interdit s'il n'est pas sourcé : pourquoi sourcé, ou compromis observable |
| 8 | Récap en étiquettes | **S** | Récap = objets manipulés avec déclencheur + hotspot exécutable |
| 9 | Fenêtres figées, scènes à < 3 plans | E | Règles existantes : à corriger dans v2 (devient S si ça revient) |
| 10 | Poppins absente, espeak-ng absent | **T** | Installer avant de renoncer (npm @fontsource, apt) |
| 11 | Exemples du skill v0 tirés du sujet de test (Data Access, bindingDeltas, _Required, « analyste », « requête ») | **G6** | Exemples remplacés par d'autres domaines |
| 12 | « IAM » jamais expliqué, prononciation de SetIamPolicy | X | Notes de production, pas dans le skill |

## 4. Règles proposées et garde-fous

Test de transfert G2 sur H1 (DNS, grand public), H2 (Kerberoasting, praticien), H3 (taux BCE, non technique) :

| Règle | G1 | G2 H1 / H2 / H3 | G3 | Verdict |
|---|---|---|---|---|
| Budget de mots + couper une idée plutôt que comprimer | ok | utile / utile / utile (toute vidéo bornée) | obs. 1 | ✅ |
| Définition du mot (tokens alphanumériques) | ok | neutre / neutre / utile (« 4,5 % ») | obs. 2 | ✅ |
| Plans par taille du sujet + `frame(el, part)` | ok | utile / utile / utile | obs. 3 | ✅ |
| Bande sous-titres interdite aux personnages ; sol au-dessus de y = 700 | ok | utile / utile / utile | obs. 4 | ✅ |
| Premier plan jamais devant le sujet | ok | utile / utile / utile | obs. 5 | ✅ |
| Le visuel n'en sait pas plus que la narration | ok | neutre (rien d'incertain) / utile (ce que les journaux ne montrent pas) / utile (prévisions) | obs. 6 | ✅ |
| Pourquoi sourcé ou dit comme une lecture | ok | utile / utile / **très** utile (causalités économiques discutées) | obs. 7 | ✅ |
| Récap = objets avec déclencheur | ok | utile (« quand une page ne charge pas → … ») / utile / utile | obs. 8 | ✅ |
| Installer police / TTS avant de renoncer | ok (« Google Fonts » = faux positif connu, autorisé) | neutre partout (environnement) | obs. 10 | ✅ |
| Exemples diversifiés (G6) | ok | — | obs. 11 | ✅ |

G4 : 197 → 200 lignes (+1,5 %). `tools/overfit_lint.py` : aucun terme du sujet dans les ajouts.

## 5. Notes de production (X, spécifiques au sujet, hors skill)

- Dire « Set I A M Policy » ; « ci-deployer » se dit « ci déployeur » ; « SIEM » se dit « sim ».
- La centralisation multi-projets (sink agrégé) mérite son propre épisode.
