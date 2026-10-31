---
name: "motion-explainer"
description: "Use when the user wants to understand a topic through an animated motion-design explainer (flat vector, Kurzgesagt-like style) built as an interactive HTML artifact."
---

# Motion Explainer

Objectif : transformer un sujet complexe en une courte "vidéo" animée de 2 à 3 minutes, style motion design flat vector, jouable dans un artifact HTML (play, pause, scène par scène) et exportable en MP4 avec bande son. La compréhension prime, l'animation sert l'explication.
- **On montre, on n'écrit pas** : si une scène ressemble à une diapositive, elle est ratée.
- **On filme, on ne pose pas** : si chaque plan est un plan large fixe, la scène est ratée.
- **On explique, on ne décrit pas** : si le spectateur sait quoi mais pas pourquoi, ni quoi en faire, la scène est ratée.

## 0. Cadrer

- **Niveau d'audience** : déduire du contexte (rôle de l'utilisateur, mémoire, vocabulaire de la demande) entre débutant, praticien, expert. Ne demander que si c'est vraiment ambigu.
- **Fiche pertinence** (écrite avant le script, non publiée) :
  - ce que l'audience sait déjà : à réduire à une ligne de rappel, 15 % du temps au maximum
  - ce qu'elle ignore ou croit à tort : c'est le cœur de l'épisode
  - les 3 choses qu'elle fera différemment après (un geste, un réglage, un réflexe). Si l'épisode ne change aucune action, revoir le sujet ou l'angle.
- **Tri des faits** : (a) non évidents et lourds de conséquences (pièges, valeurs par défaut trompeuses, angles morts), (b) actionnables, (c) contexte. La narration porte (a) et (b) ; (c) seulement si nécessaire à la compréhension. Pour un praticien, le contenu de valeur ne doit jamais être relégué dans les hotspots : les hotspots portent le détail (code, chiffres complets), pas l'idée.
- **Question centrale** : une seule, écrite en une phrase.
- **Budget d'idées** : 3 à 5 idées clés maximum. Au-delà, découper en épisodes : produire l'épisode 1 et lister les suivants dans la réponse finale.
- Repérer le prérequis que le spectateur risque de ne pas avoir et prévoir une scène pour lui (débutant) ou une phrase (praticien).
- Si le sujet touche à l'état actuel du monde (versions, produits, valeurs par défaut, rétentions, chiffres, CVE), faire des recherches web et vérifier chaque fait.
- **Faits non confirmés** : une affirmation qu'aucune source consultée ne confirme ne va jamais dans la narration ni à l'écran. Elle peut apparaître seulement dans un hotspot, marquée "à vérifier", et elle est signalée dans la réponse finale.
- Si la demande est ambiguë sur le style (ex : "stop motion" peut vouloir dire "refais l'animation" ou un vrai rendu image par image), dire en une ligne l'interprétation retenue.

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
- **Devinez** : au moins 2 moments où la narration pose une question, laisse 1,5 s de silence visuel (l'objet en suspens), puis révèle.
- **Ancrage concret** : chaque règle est illustrée par une valeur réelle du cas (une IP, une date, un nom de méthode), jamais par une abstraction seule.
- **Rappels** : dans une série, rappeler en une phrase un élément d'un épisode précédent quand il sert.

**Précision** :
- **Précision conditionnelle** : chaque affirmation porte sa condition quand elle en a une ("par défaut", "si l'option est activée", "à partir de la version N", "pour les écritures"). Exemple de faute à éviter : "le cache évite la requête" alors qu'il ne l'évite que si l'entrée n'a pas expiré.
- **Un seul terme nouveau par scène**, défini par son rôle à sa première apparition ("hash, l'empreinte d'un fichier"). Dans la fiche, lister les termes nouveaux scène par scène ; si une scène en a deux, dire le second par sa fonction (« un changement de droits ») et laisser son nom exact à l'écran ou au hotspot, ou l'introduire dans une scène précédente.

**Récap actionnable** :
- 3 actions concrètes au maximum (un geste, un réglage, un réflexe), formulées comme des actions ; à l'écran, chaque action est un objet manipulé avec son déclencheur (« quand… → … »), pas une étiquette ; son détail exécutable va dans un hotspot de la scène
- une phrase "vous savez maintenant répondre à..." qui reprend la question centrale
- les simplifications, dites dans la narration ("en réalité, c'est un peu plus subtil : ...")

Règles générales :
- **Fil rouge obligatoire** : le cas du hook réapparaît dans au moins la moitié des scènes et se conclut à la fin. Dans une série, chaque épisode résout une partie et ouvre la suivante.
- **Une seule métaphore système** déclinée partout. Si un concept ne rentre pas dedans, l'adapter plutôt qu'en introduire une seconde.
- Narration en français, termes techniques en anglais non francisés.
- Pour chaque cue : `sub` (sous-titre) et `say` (texte prononcé, phonétique si besoin : "x²" se dit "x au carré", "48 Mo" se dit "48 méga-octets").
- **Pas de doublon** : le sous-titre ne répète jamais mot pour mot un texte affiché. À l'écran, un mot-clé ; en sous-titre, la phrase.
- Durée cible 2 à 3 minutes (une limite donnée par l'utilisateur ne se dépasse jamais), 25 cues maximum. Durée d'un cue : `max(3.6, mots/2.6 + 1.0)` secondes, plus 1,5 s pour un moment "devinez". Ancre d'un mot : `debutCue + indexMot / 2.6`. Un mot = un token qui contient une lettre ou un chiffre (un « : » ou « ? » isolé n'en est pas un).
- **Budget avant d'écrire** : mots disponibles ≈ (durée cible − 1,0 × cues − 1,5 × devinez − 2) × 2,6. Compter dès le premier jet. Si ça déborde, **supprimer une idée ou une scène entière** plutôt que de comprimer toutes les phrases : une scène de mécanisme garde au moins 2 cues (une seule ne laisse de place ni aux trois plans ni au pourquoi).

## 2. Storyboard : un monde, une caméra, des beats

- **Un monde unique** : poser toutes les scènes d'un épisode sur un grand canevas (ex : 8000x3000) découpé en zones (bureau du protagoniste, usine, archives...). La caméra voyage de zone en zone : c'est la transition par défaut. Au moins 70 % des changements de scène sont des transitions de continuité (travelling, zoom à travers un objet, smart cut sur une mise en page identique). Le fondu est l'exception.
- **Trajets habités** : le chemin entre deux zones porte du décor (couloir, câbles, panneaux, objets du fil rouge qui passent). Un trajet dure 1,2 à 1,8 s ; la narration peut commencer pendant le trajet, mais le premier beat important tombe après l'arrivée de la caméra.
- **Liste de plans par scène** : au moins trois valeurs de plan, définies par la taille du sujet dans le cadre, pas par un zoom :
  - plan d'ensemble pour situer : la zone entière, le sujet repérable
  - plan de travail sur l'action : le sujet (personnage + objet manipulé) occupe 45 à 60 % de la hauteur du cadre
  - gros plan sur l'artefact clé : il occupe 60 à 80 % de la largeur ou de la hauteur, calé sur le mot qui le nomme
  Calculer chaque cadrage depuis la boîte englobante du sujet (`frame(el, part)`), jamais avec un zoom choisi au jugé. Dans un plan de travail, un personnage mesure au moins 25 % de la hauteur du cadre. Aucun plan ne laisse plus de 40 % de surface vide.
- **Profondeur** : 3 plans de parallaxe minimum : fond lent (facteur 0,4 à 0,7), plan principal (1), premier plan rapide (1,2 à 1,4, silhouettes sombres partielles : câbles, rebords, plantes, racks) qui passe devant pendant les mouvements de caméra. Le premier plan ne recouvre jamais l'objet du beat ni un personnage qui agit : il traverse pendant les trajets et se range sur les bords du cadre.
- **Lumière** : un spotlight radial suit le point d'attention ; le reste du décor est assombri de 20 à 30 % (au-delà, les bords virent au noir et le plan paraît vide). Le sujet est l'élément le plus lumineux du cadre.
- **Décor qui remplit** : chaque zone a un sol et des murs habités (2 ou 3 objets de contexte, texture, teinte de zone) pour que le plan d'ensemble ne soit pas un aplat sombre.
- **Beat sheet** : pour chaque cue, des beats visuels ancrés sur des mots de la phrase ("« clé » : la clé tombe dans la main du blob"), au moins ⌈durée du cue / 2⌉. Un beat est un changement visible à l'échelle du cadre (au moins 5 % de la surface : un objet qui entre, se déplace ou change d'état, un geste, un mouvement de caméra), pas un détail. Jamais plus de 2,5 s sans beat (l'ambiance ne compte pas), sauf le silence voulu d'un moment "devinez". Un gros plan qui dure s'anime lui-même (segment qui s'allume, valeur qui s'écrit, icône qui change d'état). Le beat du "pourquoi" et celui de la "conséquence" sont visuels aussi (ex : une balance coût/volume qui penche, un trou dans une frise).
- **Mise en place** : ce qui doit être vu ensemble dans un plan est posé à moins d'une demi-largeur de cadre l'un de l'autre ; sinon le cadrage qui les réunit les rend minuscules. Un personnage ne se tient jamais devant un texte ou l'objet du beat.
- **Nettoyage** : chaque élément a une entrée et une sortie. Quand le beat qui l'utilisait est fini, il sort du cadre ou s'efface, sauf s'il porte le fil rouge. Une scène de récap part d'un décor vidé.
- **Personnages qui jouent** : un protagoniste (celui qui enquête ou apprend) et un antagoniste (la menace, le problème, la force contraire).
  - le protagoniste fait une action dans au moins la moitié des scènes, l'antagoniste apparaît dans au moins un tiers
  - bibliothèque de gestes : marcher (bras qui balancent, pas seulement un rebond), pointer une cible, lever la loupe à l'œil, hocher la tête, hausser les épaules, sursauter, se pencher
  - anticipation avant chaque geste (petit recul de 0,15 s), regard qui suit la cible du beat courant
  - expressions : neutre, surprise, satisfait, contrarié ; le protagoniste incarne l'idée reçue puis la correction (sûr de lui, puis surpris)
- **Montrer plutôt qu'écrire** : une liste devient des objets qui arrivent, une table devient un tri d'objets dans des bacs, l'anatomie d'un message devient une cassette qui se déroule et dont chaque segment s'allume. Une carte de plus de 3 lignes ou une table va dans un hotspot, pas dans la scène.
- **Le visuel n'en sait pas plus que la narration** : ce que la narration déclare inconnu, improuvable ou hypothétique est montré comme incertain (silhouette en pointillés, ombre, point d'interrogation), jamais joué comme un fait.

## 3. Direction artistique

- Flat vector 100 % original : formes simples, coins arrondis, peu de contours, ombres plates décalées. Personnages : créatures simples (blobs, robots géométriques). Ne jamais reproduire personnage, mascotte, logo ou nom d'une chaîne existante.
- Fond sombre profond, accents saturés. Palette de départ : fond `#0B1A3A`, plans `#14295C` et `#1E3A8A`, accents `#FFB703` `#FB8500` `#22D3EE` `#EF476F` `#06D6A0` `#A78BFA`, texte `#F8FAFC`. Chaque zone a une teinte d'ambiance légèrement différente pour qu'on sache où on est.
- Code couleur sémantique fixe, légende HTML sous la vidéo.
- **Typo identique dans l'artifact et le MP4** : avant de choisir, lancer `fc-list` dans l'environnement de rendu. Par défaut Poppins (titres et texte, sur Google Fonts) et JetBrains Mono avec repli `DejaVu Sans Mono` pour le code. Si une police manque localement, l'installer avant tout rendu (paquet npm `@fontsource/<nom>`, fichiers woff dans `~/.local/share/fonts`, puis `fc-cache -f`).
- **Lisibilité mobile** (viewBox 1600x900, affichée vers 360 px de large) : texte 44 unités minimum à l'écran après zoom caméra, 36 pour du code ; 3 éléments textuels simultanés maximum ; 12 mots par carton.
- **Zones de sécurité** : la bande sous-titres (y > 760) ne contient rien d'important (ni texte, ni personnage, ni objet du beat) : poser le sol des personnages au-dessus de y = 700 à l'écran. Marges de 60 unités sur les côtés et en haut.
- Animation : easing systématique (`easeOutCubic`, `easeOutBack` pour les apparitions), stagger 0.05 à 0.15 s, squash and stretch léger, un seul point d'attention, 1 à 2 s de respiration après chaque idée clé.

## 4. Moteur d'animation : maison, sans librairie

Pas de CDN pour l'animation. Tout est une **fonction pure du temps** : seek, test et export marchent sans effort.

Squelette de référence (à adapter) :

```js
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)), lerp=(a,b,p)=>a+(b-a)*p;
const P=(t,a,d)=>d<=0?(t>=a?1:0):clamp((t-a)/d);
const E={oc:p=>1-(1-p)**3, ic:p=>p**3, ioc:p=>p<.5?4*p**3:1-(-2*p+2)**3/2,
  ob:p=>1+2.6*(p-1)**3+1.6*(p-1)**2};
class Actor{ // el = <g> dessiné autour de (0,0)
  constructor(el,x,y,s,o){Object.assign(this,{el,bx:x,by:y,bs:s,o:o||{}});}
  update(t){const o=this.o;let x=this.bx,y=this.by,s=this.bs,r=0,a=1;
    if(o.pop!=null){const p=P(t,o.pop,.6);s*=p<=0?.4:.4+.6*E.ob(p);a*=Math.min(1,p*3);}
    for(const m of o.moves||[]){const p=(m[3]||E.ioc)(P(t,m[0],m[1]));
      if('x'in m[2])x=lerp(x,m[2].x,p);if('y'in m[2])y=lerp(y,m[2].y,p);if('s'in m[2])s=lerp(s,m[2].s,p);}
    if(o.out!=null)a*=1-P(t,o.out,.4);
    const st={x,y,s,r,a};if(o.fn)o.fn(st,t);   // hook pour poses, regards, idle
    this.el.setAttribute('opacity',st.a);this.el.setAttribute('visibility',st.a>0?'visible':'hidden');
    this.el.setAttribute('transform',`translate(${st.x} ${st.y}) rotate(${st.r}) scale(${st.s})`);}}
// Caméra : par scène, une liste de keyframes [t, x, y, zoom] ; la scène N démarre depuis la dernière
// keyframe de N-1 (trajet). Interpolation ioc sur x,y et log-lerp sur le zoom.
// Calques : far (parallaxe 0,5), main (1), front (1,3) :
//   translate(800 450) scale(z) translate(-x*f -y*f)
// Pendant le trajet, la scène précédente reste affichée dans son état final.
```

- **Coordonnées relatives** : chaque zone a une origine en constante (`const Z={bureau:[0,0],usine:[1800,0],...}`) et tout ce qui la compose est placé relativement à cette origine, caméra et hotspots compris. Déplacer une zone = changer une seule valeur.
- Les éléments sont créés une fois ; `render(t)` ne fait que muter des attributs.
- **Ambiance séparable** : idle, particules, tapis, bobines lisent un drapeau global `AMBIENT`. `render(t,{ambient:false})` les fige, pour les tests.
- Exposer `window.__mx = { setEp(i), render(t,opts), duration, cues, scenes, events }`, où `events` liste les temps des pops, trajets et impacts (pour la bande son).
- **Pièges connus** :
  - masquer une scène avec `display="none"`, jamais `visibility` : un enfant en `visibility="visible"` reste affiché sous un parent caché
  - ne pas stocker les keyframes de caméra dans une propriété écrasée plus tard (ex : `scene.cam` réutilisé pour le groupe SVG)
  - texte monospace : `white-space: pre`
  - `getTotalLength()` des tracés : le mesurer à la construction, scène dans le DOM
  - ne rien appeler qui dépend de l'épisode courant avant qu'il soit initialisé
  - modifications par remplacement de chaînes : faire échouer tout le lot si une seule chaîne manque, et ne jamais mettre d'entrée vide

## 5. Player

- Une page HTML autonome, SVG inline `viewBox="0 0 1600 900"`, letterbox 16:9 qui tient sur mobile.
- Contrôles : play/pause, scène précédente/suivante, barre de progression, vitesse (0.75x, 1x, 1.25x), sous-titres on/off, voix on/off, chapitres cliquables, raccourcis (espace, flèches, Échap).
- **Séries** : un onglet par épisode dans le même artifact, routage `#ep1`, `#ep2`. Ajouter ou refaire un épisode = republier le même fichier pour garder l'URL.
- Sous-titres en overlay sur desktop, sous la vidéo sur mobile (largeur < 720 px).
- **La voix pilote la timeline** : chaque cue lance `speechSynthesis` sur `say` en `fr-FR` ; si la phrase n'est pas finie à la fin du cue, l'horloge attend `onend` (garde-fou 20 s). Voix off par défaut, tout en try/catch.
- **Mode quiz** (bouton, désactivé par défaut) : aux moments "devinez", la lecture se met en pause et propose 2 à 3 réponses ; un clic révèle la bonne avec une phrase d'explication, puis la lecture reprend. Sans le mode quiz, la vidéo se joue normalement.
- **Hotspots en pause** : 1 ou 2 par scène, en coordonnées monde converties via la caméra, avec une fenêtre de validité (`at`, `until`). Ils portent le détail (JSON, requête complète, table), jamais l'idée principale.
- Poster : la page s'ouvre sur une frame lisible de la scène 1, gros bouton play avec la durée.

## 6. Build

1. Charger le skill `artifact-design` avant d'écrire la page.
2. Écrire la fiche pertinence, le script (gabarit par scène), puis la beat sheet et la liste de plans.
3. Écrire les origines de zones, le décor (3 calques), le moteur et le player, puis une scène à la fois.
4. Publier avec l'outil Artifact.

## 7. Vérification

**Relecture pédagogique (avant de coder, sur le script)** :
- chaque scène de mécanisme a son pourquoi et sa conséquence pour le rôle
- au moins 2 idées reçues et 2 moments "devinez"
- chaque affirmation qui dépend d'une condition la nomme ; relire spécialement les phrases avec "part dans", "toujours", "jamais", "tout"
- le déjà-connu de l'audience ne dépasse pas 15 % du temps
- le récap contient des actions, pas des résumés
- chaque fait de la narration est confirmé par une source consultée

**Contrôles visuels (Playwright)** :
- Pour chaque cue, rendre et capturer à 25 %, 50 % et 75 % du cue, en 1280 px, puis assembler des planches contact (PIL) et les regarder.
- Contrôles automatiques, une fois par capture :
  - textes visibles : chevauchement, dépassement du cadre (sauf éléments marqués `data-bleed`), intrusion dans la bande sous-titres, taille à l'écran inférieure à 44 unités
  - sujet dans le cadre : l'objet du beat courant (marqué `data-focus`) est dans les 70 % centraux, couvre au moins 8 % de la surface, n'entre pas dans la bande sous-titres et n'est pas masqué par le premier plan ; idem pour chaque personnage visible
  - durée totale ≤ limite demandée
  - surface vide : moins de 40 % de pixels proches du fond
- **Image figée réelle** : rendre toutes les 0,5 s avec `ambient:false` et **sans sous-titres**, comparer les frames ; signaler toute fenêtre de plus de 2,5 s sans changement, hors silences "devinez" déclarés, avec le cue concerné.
- **Variété de plans** : compter par scène les échelles distinctes (zooms séparés d'un facteur 1,35 au moins) ; moins de 3 = à corriger.
- **Personnage devant un texte** : signaler tout texte recouvert à plus de 25 % par un personnage.
- Une capture en 390 px de large pour la page (pas de scroll horizontal).
- Une passe de corrections, puis publier.

## 8. Export MP4

Quand l'utilisateur veut un fichier, ou qu'il demande comment télécharger :
- Injecter une CSS d'export : scène en plein écran 1920x1080, hotspots, quiz, bouton et panneau masqués, sous-titres à 34 px.
- Rendu à 24 fps : `__mx.render(i/24)` puis capture JPEG (qualité 90) envoyée en pipe à ffmpeg : `ffmpeg -f image2pipe -framerate 24 -c:v mjpeg -i - -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -movflags +faststart video.mp4`. Lancer en arrière-plan ; environ 5 minutes de rendu pour 2:50 de vidéo.
- **Bande son, toujours** :
  - bruitages synthétisés hors ligne depuis `__mx.events` : pop = `sine` court (600 à 900 Hz, 80 ms, `afade`), whoosh de trajet = `anoisesrc` filtré en `lowpass` avec fondu (0,6 s), impact ou tampon = `sine` grave 120 Hz, 120 ms ; chaque son placé avec `adelay`, puis `amix`
  - une nappe d'ambiance douce (deux `sine` graves légèrement désaccordés, `lowpass`, volume bas) sur toute la durée, coupée pendant les silences "devinez"
  - voix : si `espeak-ng` ou `piper` manque, tenter l'installation (`apt-get update && apt-get install -y espeak-ng mbrola mbrola-fr4`) avant d'y renoncer ; un WAV par cue depuis `say`, accéléré (`-s`) jusqu'à tenir dans son cue, dépassements listés ; baisser la nappe pendant la parole
  - `loudnorm` sur le mix, puis multiplexer avec la vidéo (`-c:v copy -c:a aac`)
- Vérifier durée et pistes avec `ffprobe`, regarder 4 frames extraites avant d'envoyer avec SendUserFile.
- Sans ffmpeg ni Playwright : le dire et proposer l'enregistrement d'écran (macOS `Cmd+Shift+5`, Windows Outil Capture d'écran).

## 9. Livraison

Réponse courte :
- une phrase sur ce que couvre la vidéo et sa durée
- les chapitres
- les 3 actions du récap
- ce qui a été simplifié, et tout point resté "à vérifier"
- les épisodes suivants si le sujet a été découpé
- les sources