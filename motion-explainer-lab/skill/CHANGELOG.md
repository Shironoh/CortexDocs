# CHANGELOG du skill `motion-explainer`

Chaque entrée : la règle, l'observation qui l'a provoquée (G3), son étiquette (S lacune, C contradiction,
T outillage, G6 exemples). Le détail des tests de transfert (G2) est dans `iterations/vN/REVIEW.md`.
Taille : v0 196 lignes → v5 208 lignes (+6 %) → v7 202 lignes, sous le plafond G4. `tools/overfit_lint.py` : aucun terme du
sujet de test ajouté entre v0 et v5.

## v1 (après la vidéo v1)
- **S** Budget de mots *avant* d'écrire ; définition du mot (token avec lettre ou chiffre) ; si ça déborde,
  supprimer une idée entière plutôt que comprimer ; une scène de mécanisme garde ≥ 2 cues.
  *Obs.* : premier jet à 234 s pour 180 s ; « : » et « ? » comptés comme des mots ; scène s7 réduite à un cue.
- **C** Plans définis par la taille du sujet dans le cadre et cadrage calculé depuis sa boîte englobante
  (`frame(el, part)`), plus de zooms fixes ; personnage ≥ 25 % de la hauteur en plan de travail.
  *Obs.* : vide 53 %, sujet trop petit dans 35/63 captures.
- **S** Bande sous-titres interdite aux personnages et aux objets du beat ; sol au-dessus de y = 700.
  *Obs.* : personnage sous les sous-titres dans 33/63 captures.
- **S** Le premier plan ne passe que pendant les trajets, jamais devant le sujet. *Obs.* : 18 occultations.
- **S** Le visuel n'en sait pas plus que la narration (incertain = pointillés, ombre, « ? »).
  *Obs.* : vol montré alors que la narration le dit improuvable.
- **C** Le « pourquoi » est sourcé ou dit comme une lecture. *Obs.* : justification inventée pour remplir le gabarit.
- **S** Récap = objets manipulés avec déclencheur, détail exécutable au hotspot. *Obs.* : récap en étiquettes.
- **T** Installer police et voix avant de renoncer.
- **G6** Exemples du skill tirés du sujet de test remplacés (cache, hash, x², « protagoniste »).

## v2 (après la vidéo v2)
- **S** (E répété) Quota de beats ⌈durée/2⌉ par cue ; un beat = changement visible ≥ 5 % du cadre ;
  un gros plan qui dure s'anime. *Obs.* : fenêtres figées en v1 (5) et v2 (3).
- **S** Mise en place : ce qui est vu ensemble est posé à moins d'une demi-largeur de cadre ; un personnage
  ne se tient jamais devant un texte. *Obs.* : robot loin de sa case ; analyste devant « 03:07 ».
- **S** (E répété) Nettoyage : chaque élément a une sortie ; le récap part d'un décor vidé.
- **S** (E répété) Termes nouveaux listés par scène ; le second dit par sa fonction, nom à l'écran.
- **S** Spotlight 20-30 % ; décor qui remplit le plan d'ensemble.
- **T** Image figée testée sans sous-titres ; variété de plans = échelles distinctes ; perso devant texte.

## v3 (après la vidéo v3)
- **C** Le fond n'est pas une surface de décor (murs, sols en teintes de plan ou de zone).
  *Obs.* : la palette « fond sombre » et la règle « < 40 % de pixels proches du fond » se contredisaient (vide 42 %).
  *Effet mesuré en v4* : vide 42 % → 7 %.
- **S** Sons sémantiques fixes (révélation, idée reçue démentie, conséquence, apparition).
- **S** Chaque action du récap dit son lieu (outil, écran, commande).

## v4 (après la vidéo v4)
- **C** Le lieu d'une action est introduit dans la scène qui l'explique (il y compte comme son terme nouveau) ;
  le récap ne fait que rappeler. *Obs.* : la règle v3 faisait entrer deux noms nouveaux dans le récap (F2 −1).
- **S + T** L'objet cadré est visible à l'arrivée de la caméra ; contrôle `focus_hidden`.
- **S** Relecture pédagogique : les 3 questions que le spectateur doit savoir résoudre, dont « où ? ».
- **T** Taille du sujet : 8 % de surface **ou** 25 % de hauteur (l'ancien contrôle contredisait la règle des 25 %).

## v5 (après la vidéo v5) — version finale
- **S** Le plan du silence d'un devinez montre la question entière (objet en suspens + ce qu'il menace).
  *Obs.* : c12 en v2-v5, gros plan d'un objet seul au milieu du vide.
- **S** Un objet de beat < 8 % du cadre entre en grossissant ou la caméra s'en rapproche.
  *Obs.* : « sujet trop petit » persistant (19-35 captures selon la version).
- **T** Contrôle de la feuille de beats sans rendu, avant toute capture. *Obs.* : 13 trous trouvés en quelques secondes en v3.

## v6 (après retour de l'utilisateur sur v5 : « superficiel et abstrait »)
- **S** Audience sur deux axes : métier × outil. *Obs.* : « ne connaît pas l'outil » avait fait tout basculer en mode débutant.
- **S** Inventaire de valeur avant le script (artefacts exacts + usage) ; découpage en épisodes par famille plutôt que rester en surface.
- **C** « Un terme nouveau par scène » ne s'applique qu'aux concepts, pas aux artefacts de l'inventaire.
- **S** Icônes pour les concepts, vrais artefacts pour les artefacts ; artefact long déroulé ligne par ligne (3 lisibles).
- **S** Test du praticien dans la relecture pédagogique.
- **Protocole** : critère F8 « profondeur métier » ; le retour humain prime sur l'auto-notation (v5 auto-notée 3,71 en fond, jugée superficielle).

## v7 (demande de l'utilisateur : voix, recherche, outillage générique, sujets variés)
Itération déclenchée par la demande, pas par une vidéo : les règles suivantes sont des exigences de l'utilisateur (S),
vérifiées ensuite sur deux sujets nouveaux (`iterations/v7/REVIEW.md`). Skill 212 → 202 lignes (le squelette de code du
moteur est sorti vers `reference/TOOLKIT.md`). `overfit_lint.py` (étendu aux nouveaux sujets et aux témoins) : G1 OK.
- **S** Section « 0 bis. Rechercher » : sources primaires d'abord, produire l'artefact soi-même, recouper, dater, fiche sources,
  faits non confirmés hors narration. *Obs.* : v1-v6 n'avaient qu'une ligne « faire des recherches web » ; `factcheck.py` a
  trouvé 29 nombres affichés sans source dans le premier jet d'un épisode v7.
- **S** Audience sans métier lié au sujet : « savoir faire » = un raisonnement réutilisable. *Obs.* : la règle des 3 actions ne
  disait rien d'un public grand public (sujet témoin H1 déjà signalé « pas d'action métier »).
- **S** La voix fixe le temps (durée réelle + respiration), ancres sur les mots prononcés ; budget de mots recalibré
  (2,4 mots/s, 0,6 s par cue). *Obs.* : modèle 2,6 mots/s contre 2,3-2,5 réels avec Piper ; dépassements espeak accélérés.
- **S** Termes étrangers dits par leur fonction ou passés au lexique, contrôle d'écoute Whisper. *Obs.* : « Create Service Account Key »
  entendu « crisier de service à compte… » (WER 48 % sur la partie).
- **S** Personnages qui parlent (`who`), une voix par personnage, bouches sur les visèmes. *Obs.* : demande utilisateur
  (« personnages plus vivants, bouches synchronisées »).
- **S** Son : musique originale générée, qui suit la structure et se tait sur les devinez ; bande son embarquée dans le lecteur,
  l'audio devient l'horloge. *Obs.* : demande utilisateur ; la nappe à deux sinus de v1-v6 n'était pas une musique.
- **T** Outillage générique documenté (`toolkit/`, `reference/TOOLKIT.md`) : kit de scènes indépendant du sujet (le kit v6 portait
  des objets propres au sujet de test : cartes d'événements, salle d'attaque), `voice.py`, `music.py`, `factcheck.py`,
  `package_skill.py`. Contrôle des blocs de texte : les graduations d'un graphique et les lignes d'un même artefact comptent
  pour un bloc (**C** : la règle « 3 textes max » contredisait « vrais artefacts tels quels »).

## Rejeté ou laissé hors du skill (X : spécifique au sujet)
Prononciations (« Set I A M Policy », « ci déployeur », « sim »), choix d'un compte Gmail fictif, la plage
d'IP de documentation, les faits GCP eux-mêmes : notes de production dans les REVIEW, jamais dans le skill.
