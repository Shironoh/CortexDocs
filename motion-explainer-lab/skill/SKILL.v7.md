---
name: "motion-explainer"
description: "Use when the user wants to understand a topic through an animated motion-design explainer (flat vector, Kurzgesagt-like style) built as an interactive HTML artifact."
---

# Motion Explainer

Objectif : transformer un sujet complexe en une courte "vidéo" animée de 2 à 3 minutes, style motion design flat vector, jouable dans un artifact HTML (play, pause, scène par scène) et exportable en MP4 avec voix neuronale, musique et bruitages. La compréhension prime, l'animation sert l'explication. Deux métiers : **chercher** (des faits sûrs, datés, sourcés) puis **réaliser**.
Outillage réutilisable (moteur, kit de scènes, voix, son, QA, export) : dossier `toolkit/` à côté de ce fichier, mode d'emploi dans `reference/TOOLKIT.md`.
- **On montre, on n'écrit pas** : si une scène ressemble à une diapositive, elle est ratée.
- **On filme, on ne pose pas** : si chaque plan est un plan large fixe, la scène est ratée.
- **On explique, on ne décrit pas** : si le spectateur sait quoi mais pas pourquoi, ni quoi en faire, la scène est ratée.

## 0. Cadrer

- **Niveau d'audience, sur deux axes** : le métier (ce que la personne fait : débutant, praticien, expert) et l'outil ou le domaine du sujet (le connaît-elle ?). Les deux se règlent séparément : un praticien qui découvre l'outil garde la profondeur de son métier, le contexte de l'outil se limite à ce qu'il faut pour lire les artefacts. Ne demander que si c'est vraiment ambigu ; si la demande ne dit pas ce que le spectateur doit savoir faire après, le demander. Pour un public sans métier lié au sujet, « savoir faire » = un raisonnement réutilisable (lire une valeur qu'il croisera, reconnaître un cas où la règle ne s'applique pas, démonter une idée reçue).
- **Inventaire de valeur** (avant le script) : la liste des artefacts concrets que le spectateur doit reconnaître après la vidéo (noms exacts, champs, valeurs, seuils, commandes), chacun avec ce qu'on en fait. Pour un praticien, c'est le cœur de l'épisode : chaque artefact apparaît à l'écran tel qu'il est en vrai et la narration dit à quoi il sert. Si l'inventaire dépasse le budget d'un épisode, découper en épisodes par famille plutôt que de rester en surface.
- **Fiche pertinence** (écrite avant le script, non publiée) :
  - ce que l'audience sait déjà : à réduire à une ligne de rappel, 15 % du temps au maximum
  - ce qu'elle ignore ou croit à tort : c'est le cœur de l'épisode
  - les 3 choses qu'elle fera différemment après (un geste, un réglage, un réflexe). Si l'épisode ne change aucune action, revoir le sujet ou l'angle.
- **Tri des faits** : (a) non évidents et lourds de conséquences (pièges, valeurs par défaut trompeuses, angles morts), (b) actionnables, (c) contexte. La narration porte (a) et (b) ; (c) seulement si nécessaire à la compréhension. Pour un praticien, le contenu de valeur ne doit jamais être relégué dans les hotspots : les hotspots portent le détail (code, chiffres complets), pas l'idée.
- **Question centrale** : une seule, écrite en une phrase.
- **Budget d'idées** : 3 à 5 idées clés maximum. Au-delà, découper en épisodes : produire l'épisode 1 et lister les suivants dans la réponse finale.
- Repérer le prérequis que le spectateur risque de ne pas avoir et prévoir une scène pour lui (débutant) ou une phrase (praticien).
- Si la demande est ambiguë sur le style (ex : "stop motion" peut vouloir dire "refais l'animation" ou un vrai rendu image par image), dire en une ligne l'interprétation retenue.

## 0 bis. Rechercher (avant la fiche, pour tout sujet)

1. **Sources primaires d'abord** : le texte qui fait autorité sur le fait (spécification ou documentation officielle de la version courante, article de recherche original, texte de loi, publication de l'organisme qui produit le chiffre, données brutes). Les sources secondaires (presse, blogs, encyclopédies, réponses de recherche résumées) servent à trouver les primaires, pas à citer. Lire la source elle-même (page, PDF) plutôt que son résumé.
2. **Produire l'artefact quand c'est possible** : exécuter la commande, générer la sortie, calculer la valeur dans l'environnement plutôt que la reconstituer. L'artefact montré est alors vrai par construction ; noter comment il a été produit (version, données, graine).
3. **Recouper** : chaque fait de la narration a une source primaire ou deux sources indépendantes ; un chiffre clé, les deux si possible. Sources en désaccord : montrer la plage ou la condition, ne pas choisir en silence.
4. **Dater** : un fait qui peut changer (version, valeur par défaut, prix, taux, record, état de la science) porte sa date ou sa version dans la narration (« depuis la version 18 », « calibration publiée en 1994 ») ; vérifier qu'il est encore vrai à la date du jour.
5. **Fiche sources** (non publiée) : une ligne par fait, avec les valeurs qu'il contient, la citation exacte de la source, l'URL, la date de consultation et le niveau (primaire, recoupé, à vérifier). Tout nombre affiché ou dit doit y figurer (`factcheck.py` le contrôle).
6. **Faits non confirmés** : jamais dans la narration ni à l'écran. Seulement dans un hotspot marqué "à vérifier", et signalés dans la réponse finale.
## 1. Script pédagogique

Structure, 6 à 8 scènes :
1. **Hook** : un cas concret (une alerte, un bug, une situation) qui pose la question centrale.
2. **Contexte** : le monde "avant", le problème.
3. **Mécanisme** (3 à 5 scènes) : une idée par scène, du simple au complexe. Une scène qui compare deux choses = deux idées = deux scènes.
4. **Zoom technique** (praticien/expert seulement) : les vrais artefacts. C'est la seule scène où du code apparaît, 4 lignes au maximum.
5. **Zoom out** : comment les pièces s'assemblent.
6. **Résolution + récap** : revenir au cas du hook et le résoudre, puis le récap actionnable.

**Gabarit de chaque scène de mécanisme** (dans cet ordre, une phrase ou un beat chacun) :
1. la question que la scène résout
2. l'intuition : la métaphore système appliquée
3. le mécanisme : comment ça marche vraiment
4. le pourquoi : la raison de conception ou le compromis (coût, volume, sécurité, historique). Sourcé, ou dit comme une lecture (« en pratique », « probablement ») ; sans source, donner le compromis observable, jamais une intention inventée
5. la conséquence pour le rôle de l'audience ("en enquête, ça veut dire que...")
6. l'application au cas du fil rouge

**Engagement et mémorisation** :
- **Idées reçues** : au moins 2 par épisode, démontrées explicitement ("on croit que... en réalité..."), choisies parmi ce que l'audience risque vraiment de croire.
- **Devinez** : au moins 2 moments où la narration pose une question, laisse 1,5 s de silence visuel (l'objet en suspens), puis révèle. Le plan du silence montre la question entière : l'objet en suspens et ce qu'il menace ou promet, jamais un objet seul au milieu du vide.
- **Ancrage concret** : chaque règle est illustrée par une valeur réelle du cas (une IP, une date, un nom de méthode), jamais par une abstraction seule.
- **Rappels** : dans une série, rappeler en une phrase un élément d'un épisode précédent quand il sert.

**Précision** :
- **Précision conditionnelle** : chaque affirmation porte sa condition quand elle en a une ("par défaut", "si l'option est activée", "à partir de la version N", "pour les écritures"). Exemple de faute à éviter : "le cache évite la requête" alors qu'il ne l'évite que si l'entrée n'a pas expiré.
- **Un seul concept nouveau par scène** (les artefacts de l'inventaire n'entrent pas dans ce compte : ils sont montrés tels quels et expliqués par leur usage), défini par son rôle à sa première apparition ("hash, l'empreinte d'un fichier"). Dans la fiche, lister les termes nouveaux scène par scène ; si une scène en a deux, dire le second par sa fonction (« un changement de droits ») et laisser son nom exact à l'écran ou au hotspot, ou l'introduire dans une scène précédente.

**Récap actionnable** :
- 3 actions concrètes au maximum (un geste, un réglage, un réflexe), formulées comme des actions, chacune avec son lieu dit dans la narration (l'outil, l'écran, la commande où on la fait). Le lieu est introduit dans la scène qui explique l'action (il y compte comme son terme nouveau) ; le récap ne fait que le rappeler ; à l'écran, chaque action est un objet manipulé avec son déclencheur (« quand… → … »), pas une étiquette ; son détail exécutable va dans un hotspot de la scène
- une phrase "vous savez maintenant répondre à..." qui reprend la question centrale
- les simplifications, dites dans la narration ("en réalité, c'est un peu plus subtil : ...")

Règles générales :
- **Fil rouge obligatoire** : le cas du hook réapparaît dans au moins la moitié des scènes et se conclut à la fin. Dans une série, chaque épisode résout une partie et ouvre la suivante.
- **Une seule métaphore système** déclinée partout. Si un concept ne rentre pas dedans, l'adapter plutôt qu'en introduire une seconde.
- Narration en français, termes techniques en anglais non francisés.
- Pour chaque cue : `sub` (sous-titre, chiffres en chiffres) et `say` (texte prononcé, nombres en toutes lettres : "x²" se dit "x au carré", "48 Mo" se dit "quarante-huit méga-octets"). Un terme étranger est dit par sa fonction en français quand c'est possible, son nom exact restant à l'écran ; sinon il passe par le lexique de prononciation (§8).
- **Personnages qui parlent** : un cue peut être dit par un personnage (`who`), avec sa propre voix et sa bouche synchronisée. Bon usage : l'antagoniste énonce l'idée reçue, le protagoniste pose la question du spectateur ; une réplique courte (≤ 12 mots), la narration garde l'explication.
- **Pas de doublon** : le sous-titre ne répète jamais mot pour mot un texte affiché. À l'écran, un mot-clé ; en sous-titre, la phrase.
- Durée cible 2 à 3 minutes (une limite donnée par l'utilisateur ne se dépasse jamais), 25 cues maximum. **La voix fixe le temps** : chaque cue dure sa narration réelle plus une respiration (0,45 s, davantage après une idée clé : `breath`), plus 1,5 s pour un moment "devinez" ; chaque ancre `T(cue, mot)` tombe sur le mot réellement prononcé. Sans voix de synthèse, le moteur retombe sur 2,6 mots/s. Un mot = un token qui contient une lettre ou un chiffre.
- **Budget avant d'écrire** : mots disponibles ≈ (durée cible − 0,6 × cues − 1,5 × devinez − 2) × 2,4 (débit de la voix par défaut). Compter dès le premier jet. Si ça déborde, **supprimer une idée ou une scène entière** plutôt que de comprimer toutes les phrases : une scène de mécanisme garde au moins 2 cues (une seule ne laisse de place ni aux trois plans ni au pourquoi).

## 2. Storyboard : un monde, une caméra, des beats

- **Un monde unique** : poser toutes les scènes d'un épisode sur un grand canevas (ex : 8000x3000) découpé en zones (bureau du protagoniste, usine, archives...). La caméra voyage de zone en zone : c'est la transition par défaut. Au moins 70 % des changements de scène sont des transitions de continuité (travelling, zoom à travers un objet, smart cut sur une mise en page identique). Le fondu est l'exception.
- **Trajets habités** : le chemin entre deux zones porte du décor (couloir, câbles, panneaux, objets du fil rouge qui passent). Un trajet dure 1,2 à 1,8 s ; la narration peut commencer pendant le trajet, mais le premier beat important tombe après l'arrivée de la caméra.
- **Liste de plans par scène** : au moins trois valeurs de plan, définies par la taille du sujet dans le cadre, pas par un zoom :
  - plan d'ensemble pour situer : la zone entière, le sujet repérable
  - plan de travail sur l'action : le sujet (personnage + objet manipulé) occupe 45 à 60 % de la hauteur du cadre
  - gros plan sur l'artefact clé : il occupe 60 à 80 % de la largeur ou de la hauteur, calé sur le mot qui le nomme
  Calculer chaque cadrage depuis la boîte englobante du sujet (`frame(el, part)`), jamais avec un zoom choisi au jugé. L'objet cadré est visible au plus tard quand la caméra arrive : jamais de caméra qui se pose sur un vide. Dans un plan de travail, un personnage mesure au moins 25 % de la hauteur du cadre. Aucun plan ne laisse plus de 40 % de surface vide.
- **Profondeur** : 3 plans de parallaxe minimum : fond lent (facteur 0,4 à 0,7), plan principal (1), premier plan rapide (1,2 à 1,4, silhouettes sombres partielles : câbles, rebords, plantes, racks) qui passe devant pendant les mouvements de caméra. Le premier plan ne recouvre jamais l'objet du beat ni un personnage qui agit : il traverse pendant les trajets et se range sur les bords du cadre.
- **Lumière** : un spotlight radial suit le point d'attention ; le reste du décor est assombri de 20 à 30 % (au-delà, les bords virent au noir et le plan paraît vide). Le sujet est l'élément le plus lumineux du cadre.
- **Décor qui remplit** : chaque zone a un sol et des murs habités (2 ou 3 objets de contexte, texture, teinte de zone) pour que le plan d'ensemble ne soit pas un aplat sombre.
- **Beat sheet** : pour chaque cue, des beats visuels ancrés sur des mots de la phrase ("« clé » : la clé tombe dans la main du blob"), au moins ⌈durée du cue / 2⌉. Un beat est un changement visible à l'échelle du cadre (au moins 5 % de la surface : un objet qui entre, se déplace ou change d'état, un geste, un mouvement de caméra), pas un détail. Jamais plus de 2,5 s sans beat (l'ambiance ne compte pas), sauf le silence voulu d'un moment "devinez". Un gros plan qui dure s'anime lui-même (segment qui s'allume, valeur qui s'écrit, icône qui change d'état). Un objet de beat qui ferait moins de 8 % du cadre entre en grossissant (pop à 1,5×) ou la caméra s'en rapproche. Le beat du "pourquoi" et celui de la "conséquence" sont visuels aussi (ex : une balance coût/volume qui penche, un trou dans une frise).
- **Mise en place** : ce qui doit être vu ensemble dans un plan est posé à moins d'une demi-largeur de cadre l'un de l'autre ; sinon le cadrage qui les réunit les rend minuscules. Un personnage ne se tient jamais devant un texte ou l'objet du beat.
- **Nettoyage** : chaque élément a une entrée et une sortie. Quand le beat qui l'utilisait est fini, il sort du cadre ou s'efface, sauf s'il porte le fil rouge. Une scène de récap part d'un décor vidé.
- **Personnages qui jouent** : un protagoniste (celui qui enquête ou apprend) et un antagoniste (la menace, le problème, la force contraire).
  - le protagoniste fait une action dans au moins la moitié des scènes, l'antagoniste apparaît dans au moins un tiers
  - bibliothèque de gestes : marcher (bras qui balancent, pas seulement un rebond), pointer une cible, lever la loupe à l'œil, hocher la tête, hausser les épaules, sursauter, se pencher
  - anticipation avant chaque geste (petit recul de 0,15 s), regard qui suit la cible du beat courant
  - expressions : neutre, surprise, satisfait, contrarié ; le protagoniste incarne l'idée reçue puis la correction (sûr de lui, puis surpris)
- **Montrer plutôt qu'écrire** : une liste devient des objets qui arrivent, une table devient un tri d'objets dans des bacs, l'anatomie d'un message devient une cassette qui se déroule et dont chaque segment s'allume. Une carte de plus de 3 lignes ou une table va dans un hotspot, pas dans la scène.
- **Icônes pour les concepts, vrais artefacts pour les artefacts** : une métaphore aide à comprendre un mécanisme, elle ne remplace jamais ce que le spectateur aura sous les yeux dans son métier (le vrai nom, le vrai champ, la vraie valeur). Un artefact long se déroule ligne par ligne, 3 lignes lisibles à la fois, les autres en grisé.
- **Le visuel n'en sait pas plus que la narration** : ce que la narration déclare inconnu, improuvable ou hypothétique est montré comme incertain (silhouette en pointillés, ombre, point d'interrogation), jamais joué comme un fait.

## 3. Direction artistique

- Flat vector 100 % original : formes simples, coins arrondis, peu de contours, ombres plates décalées. Personnages : créatures simples (blobs, robots géométriques). Ne jamais reproduire personnage, mascotte, logo ou nom d'une chaîne existante.
- Fond sombre profond, accents saturés. Le fond n'est jamais une surface de décor : murs, sols et meubles prennent les teintes de plan ou la teinte de zone ; la couleur de fond ne se voit qu'en profondeur (ciel, lointain). Palette de départ : fond `#0B1A3A`, plans `#14295C` et `#1E3A8A`, accents `#FFB703` `#FB8500` `#22D3EE` `#EF476F` `#06D6A0` `#A78BFA`, texte `#F8FAFC`. Chaque zone a une teinte d'ambiance légèrement différente pour qu'on sache où on est.
- Code couleur sémantique fixe, légende HTML sous la vidéo.
- **Typo identique dans l'artifact et le MP4** : avant de choisir, lancer `fc-list` dans l'environnement de rendu. Par défaut Poppins (titres et texte, sur Google Fonts) et JetBrains Mono avec repli `DejaVu Sans Mono` pour le code. Si une police manque localement, l'installer avant tout rendu (paquet npm `@fontsource/<nom>`, fichiers woff dans `~/.local/share/fonts`, puis `fc-cache -f`).
- **Lisibilité mobile** (viewBox 1600x900, affichée vers 360 px de large) : texte 44 unités minimum à l'écran après zoom caméra, 36 pour du code ; 3 éléments textuels simultanés maximum ; 12 mots par carton.
- **Zones de sécurité** : la bande sous-titres (y > 760) ne contient rien d'important (ni texte, ni personnage, ni objet du beat) : poser le sol des personnages au-dessus de y = 700 à l'écran. Marges de 60 unités sur les côtés et en haut.
- **Son** : une voix posée (≈ 140-160 mots/min), une musique douce qui suit la structure (plus clairsemée au hook, plus pleine dans le mécanisme, cadence finale) et se tait pendant les silences "devinez", des bruitages sémantiques fixes (§8). La musique ne couvre jamais la voix.
- Animation : easing systématique (`easeOutCubic`, `easeOutBack` pour les apparitions), stagger 0.05 à 0.15 s, squash and stretch léger, un seul point d'attention, 1 à 2 s de respiration après chaque idée clé.

## 4. Moteur et kit de scènes (`toolkit/`)

Tout est une **fonction pure du temps** (`render(t)` ne fait que muter des attributs) : seek, tests sans rendu, lecteur et MP4 sortent de la même source. Pas de librairie d'animation ni de CDN. Utiliser l'outillage fourni ; s'il manque, reconstruire le squelette décrit dans `reference/TOOLKIT.md`.
- **Épisode** = `versions/<id>/episode.js` : `META` (titre, voix, musique), fiche en commentaire, `EP = { zones, scenes, cues, quiz, build(K) }`. `K.T(cue, mot)` donne l'instant d'un mot, `K.A(el, {pop, moves, out, fn})` anime, `K.frame(t, d, cibles, part)` cadre depuis la boîte englobante, `K.char(...)` crée un personnage, `K.focus`, `K.hot`, `K.ev(t, type)` (son).
- **Kit générique** `sceneKit(K)` : `room` (décor de zone : room, outdoor, lab, void), `world` (fond, trajets, premier plan), `hero`/`foe`, `bubble`, `card` (artefact réel : en-tête, valeur tapée, ligne éclairée), `doc` (artefact long déroulé ligne par ligne, 3 lisibles), `counter`, `bars`, `curve`, `arrow`, `label`, `timeline`, `balance`, `unknown` (incertain en pointillés), `suspense` (« ? » du devinez). Un besoin qui revient d'un sujet à l'autre s'ajoute au kit, jamais un objet propre à un sujet.
- **Personnages vivants** : respiration, clignements, regard qui suit la cible et saccades au repos, pieds qui marchent, gestes avec anticipation (`point`, `loupe`, `shrug`, `cheer`, `hold`, `type`, `jump`, `nod`, `lean`, `walkcycle`), expressions ; la bouche suit les visèmes de la voix quand le personnage dit le cue (`who`).
- **Coordonnées relatives** : chaque zone a une origine (`zones: {bureau: [0, 0], ...}`) et tout ce qui la compose est placé relativement à elle, caméra et hotspots compris.
- **Ambiance séparable** : idle, particules, saccades lisent `AMBIENT` ; `render(t, {ambient:false})` les fige pour les tests.
- **Pièges connus** :
  - masquer une scène avec `display="none"`, jamais `visibility`
  - un deuxième `K.A()` sur un même élément écrase sa position : chaîner dans `moves`
  - un attribut `opacity` est écrasé par l'animateur : `fill-opacity` pour un calque translucide
  - texte monospace : `white-space: pre` ; `getTotalLength()` mesuré à la construction, élément dans le DOM
  - ancres : `T(cue, mot)` compare le début du mot normalisé (« l'API » → `lapi`) ; un mot absent lève une erreur
  - modifications par remplacement de chaînes : faire échouer tout le lot si une seule chaîne manque

## 5. Player

- Une page HTML autonome, SVG inline `viewBox="0 0 1600 900"`, letterbox 16:9 qui tient sur mobile.
- Contrôles : play/pause, scène précédente/suivante, barre de progression, vitesse (0.75x, 1x, 1.25x), sous-titres on/off, son on/off, chapitres cliquables, raccourcis (espace, flèches, Échap).
- **Bande son intégrée** : la page embarque la même bande son que le MP4 (voix, musique, bruitages) et **l'audio est l'horloge** de la lecture (seek, vitesse, pause synchronisés). Sans bande son, repli sur `speechSynthesis` en `fr-FR`, l'horloge attendant la fin de chaque phrase (garde-fou 20 s).
- **Séries** : un onglet par épisode dans le même artifact, routage `#ep1`, `#ep2`. Ajouter ou refaire un épisode = republier le même fichier pour garder l'URL.
- Sous-titres en overlay sur desktop, sous la vidéo sur mobile (largeur < 720 px).
- **Mode quiz** (désactivé par défaut) : aux moments "devinez", pause et 2 à 3 réponses ; un clic révèle la bonne avec une phrase d'explication.
- **Hotspots en pause** : 1 ou 2 par scène, avec fenêtre de validité ; ils portent le détail (sortie complète, table, source), jamais l'idée principale.
- Poster : une frame lisible de la scène 1, gros bouton play avec la durée.

## 6. Build (pipeline standard)

1. Charger le skill `artifact-design` avant d'écrire la page.
2. Recherche (§0 bis) → fiche sources ; fiche pertinence ; script (gabarit par scène) ; beat sheet et liste de plans.
3. Écrire `episode.js` (cues d'abord), puis :
```bash
python3 toolkit/tools/voice.py versions/<id> --check   # voix Piper par cue, horodatage des mots, visèmes, écoute Whisper
python3 toolkit/tools/build.py <id>                    # page autonome (timing réel intégré)
node toolkit/tools/beats.mjs versions/<id>/index.html  # trous de rythme, sans rendu
node toolkit/tools/qa.mjs versions/<id>/index.html iterations/<it>/<id> && python3 toolkit/tools/analyze.py iterations/<it>/<id>
node toolkit/tools/export.mjs versions/<id>/index.html versions/<id> 3   # images 1080p24 -> _silent.mp4 + meta.json
python3 toolkit/tools/audio.py versions/<id>           # voix + musique + bruitages -> soundtrack.mp3 + video.mp4
python3 toolkit/tools/build.py <id>                    # republie la page avec la bande son
python3 toolkit/tools/factcheck.py versions/<id> research/<sujet>/SOURCES.md
```
4. Publier avec l'outil Artifact.

## 7. Vérification

**Relecture pédagogique (avant de coder, sur le script)** :
- chaque scène de mécanisme a son pourquoi et sa conséquence pour le rôle
- au moins 2 idées reçues et 2 moments "devinez"
- chaque affirmation qui dépend d'une condition la nomme ; relire spécialement les phrases avec "part dans", "toujours", "jamais", "tout"
- le déjà-connu de l'audience ne dépasse pas 15 % du temps
- le récap contient des actions, pas des résumés
- test du praticien : un expert du métier se demande « qu'est-ce que je sais faire demain que je ne savais pas ? » ; la réponse cite les artefacts de l'inventaire, sinon l'épisode est trop superficiel
- écrire les 3 questions que le spectateur doit savoir résoudre après la vidéo, dont « où est-ce que je fais ça ? », et vérifier que la narration (pas seulement un hotspot) y répond
- chaque fait de la narration est dans la fiche sources, avec sa date ou sa version s'il peut changer ; `factcheck.py` ne signale aucun nombre orphelin

**Voix (avant tout rendu)** : `voice.py --check` fait écouter chaque partie par Whisper sans le script. Une partie à plus de 20 % de mots mal entendus est réécrite (mot plus courant, terme étranger dit par sa fonction ou ajouté au lexique) puis revérifiée. Débit parlé entre 130 et 165 mots/min.

**Contrôle de la feuille de beats (sans rendu, avant tout le reste)** : `beats.mjs` liste les trous de plus de 2,5 s hors devinez et les cues sous le quota ; corriger avant de rendre une seule image.

**Contrôles visuels (Playwright, `qa.mjs` + `analyze.py`)** :
- Pour chaque cue, rendre et capturer à 25 %, 50 % et 75 % du cue, en 1280 px, puis assembler des planches contact et les regarder.
- Contrôles automatiques, une fois par capture :
  - textes visibles : chevauchement, dépassement du cadre (sauf `data-bleed`), intrusion dans la bande sous-titres, taille à l'écran inférieure à 44 unités
  - sujet dans le cadre : l'objet du beat (`data-focus`) est visible, dans les 70 % centraux, couvre au moins 8 % de la surface (ou 25 % de la hauteur), hors bande sous-titres, non masqué par le premier plan ; idem pour chaque personnage visible
  - durée totale ≤ limite demandée ; surface vide < 40 % de pixels proches du fond
- **Image figée réelle** : rendre toutes les 0,5 s sans ambiance ni sous-titres ; signaler toute fenêtre de plus de 2,5 s sans changement, hors silences "devinez".
- **Variété de plans** : moins de 3 échelles distinctes (facteur 1,35) dans une scène = à corriger.
- **Personnage devant un texte** : signaler tout texte recouvert à plus de 25 % par un personnage.
- Une capture en 390 px de large pour la page (pas de scroll horizontal). Une passe de corrections, puis publier.

## 8. Voix, son, export MP4

- **Voix (Piper, hors ligne)** : `pip install piper-tts onnx faster-whisper num2words` (num2words avec `--no-deps`) ; voix dans `~/.local/share/piper-voices` depuis `huggingface.co/rhasspy/piper-voices` (`fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx` + `.onnx.json`). Défaut : `fr_FR-siwis-medium`, `length_scale 1.08`, pause entre phrases 0,35 s ; voix masculine : `fr_FR-tom-medium`. Les alignements de phonèmes de Piper donnent l'instant exact de chaque mot et les visèmes des bouches. Réglages par épisode dans `META.voice` (`voice`, `ls`, `pause`, `lexicon`, `cast` : une voix par personnage).
- **Replis, dans l'ordre** : alignement Whisper si le découpage des mots diffère ; répartition proportionnelle sans Whisper ; `espeak-ng` (`mbrola-fr4`) sans Piper ; sans aucune synthèse, le modèle 2,6 mots/s. Une clé d'API vocale (ElevenLabs, Google, Azure) fournie en secret d'environnement peut remplacer Piper : même sortie attendue (un WAV par partie + horodatage des mots). Une voix enregistrée : la découper par cue, aligner avec Whisper, bouches par l'enveloppe (ou `rhubarb -r phonetic`).
- **Musique** : générée par `music.py` (originale, donc libre de droits) selon `META.music.mood` (`curious`, `wonder`, `tense`, `warm`) ; elle suit les scènes, se tait pendant les devinez, baisse d'environ 12 dB sous la voix. Repli : un fichier CC0 ou CC-BY (`audio.py --music piste.mp3`), crédité dans le pied de page.
- **Bruitages sémantiques**, fixes comme le code couleur, depuis `__mx.events` : apparition = pop, trajet = whoosh, révélation d'un devinez = carillon montant, idée reçue démentie = buzzer doux et grave (`myth`), conséquence = coup sourd (`impact`), compteur = tic.
- **Export** : 1920×1080 à 24 fps, rendu image par image (`__mx.render(i/24)`) en parallèle, encodage H.264 ; `loudnorm` (-16 LUFS) sur le mix ; vérifier durée et pistes avec `ffprobe`, regarder 4 frames avant d'envoyer.
- Sans ffmpeg ni Playwright : le dire et proposer l'enregistrement d'écran (macOS `Cmd+Shift+5`, Windows Outil Capture d'écran).

## 9. Livraison

Réponse courte :
- une phrase sur ce que couvre la vidéo et sa durée
- les chapitres
- les 3 actions du récap
- ce qui a été simplifié, et tout point resté "à vérifier"
- les épisodes suivants si le sujet a été découpé
- les sources principales, avec la date de consultation
