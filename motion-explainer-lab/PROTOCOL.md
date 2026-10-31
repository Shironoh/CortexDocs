# Protocole d'amélioration continue du skill `motion-explainer`

But : améliorer le **skill** (les règles), pas seulement la vidéo. La vidéo GCP n'est
qu'un banc d'essai ; chaque modification du skill doit rester vraie pour n'importe quel
sujet, n'importe quelle audience.

## 1. La boucle (une itération = 7 étapes)

| # | Étape | Entrée | Sortie (versionnée) |
|---|-------|--------|---------------------|
| 1 | **Générer** | `skill/SKILL.v{N-1}.md`, sujet | `versions/v{N}/` (épisode + page HTML autonome) |
| 2 | **Mesurer** | page HTML | `iterations/v{N}/qa.json` (métriques automatiques, `tools/qa.mjs`) |
| 3 | **Regarder** | planches contact, MP4 | `iterations/v{N}/sheets/*.jpg`, `versions/v{N}/video.mp4` |
| 4 | **Noter** | grille §2 | `iterations/v{N}/REVIEW.md` (score + preuves) |
| 5 | **Diagnostiquer** | observations | chaque observation classée E / S / C / T (§3) |
| 6 | **Généraliser** | observations S, C, T | propositions de règles passées aux garde-fous §4 |
| 7 | **Patcher** | règles acceptées | `skill/SKILL.v{N}.md` + `skill/CHANGELOG.md` |

La vidéo N+1 est **régénérée** à partir de `SKILL.v{N}` : on repart de la fiche
pertinence et du script, on ne se contente pas de retoucher les défauts listés (sinon
on optimise la vidéo, pas le skill).

## 2. Grille de notation (0 à 4 par critère, ancrages observables)

Chaque note cite une preuve : un cue, un timecode, une métrique ou une planche.

### Fond (F) — compréhension et utilité
| Code | Critère | 0 | 2 | 4 |
|------|---------|---|---|---|
| F1 | Question centrale + fil rouge | pas de cas | cas posé, pas résolu | cas posé, présent dans ≥ 50 % des scènes, résolu |
| F2 | Accessibilité (audience réelle) | jargon non défini | prérequis cités | prérequis montrés, 1 terme nouveau max par scène, défini par son rôle |
| F3 | Pourquoi + conséquence | description seule | pourquoi OU conséquence | les deux, pour chaque mécanisme, et visuels |
| F4 | Actionnabilité | résumé | actions vagues | ≤ 3 actions exécutables demain (requête, réglage, réflexe) |
| F5 | Exactitude conditionnelle | erreur factuelle | fait juste sans sa condition | chaque fait sourcé et conditionné |
| F6 | Engagement (idées reçues, devinez) | aucun | présents mais artificiels | ≥ 2 + ≥ 2, ancrés dans le cas, silence réel |
| F7 | Charge cognitive | > 5 idées ou débit > 170 mots/min | limite | 3-5 idées, ≤ 160 mots/min, respirations après idées clés |

### Forme (V) — film, pas diapo
| Code | Critère | Métrique automatique (si dispo) |
|------|---------|--------------------------------|
| V1 | Montrer > écrire | mots affichés / cue, part du temps avec > 3 blocs de texte |
| V2 | Caméra & continuité | nb de valeurs de plan par scène, part des transitions de continuité |
| V3 | Lisibilité mobile | textes < 44 u, chevauchements, intrusions bande sous-titres |
| V4 | Rythme visuel | fenêtres figées > 2,5 s (hors silences déclarés) |
| V5 | Personnages qui jouent | part des scènes où l'analyste agit / l'antagoniste apparaît |
| V6 | Cadrage & lumière | sujet hors des 70 % centraux, surface vide > 40 % |
| V7 | Son & voix | voix calée sur les cues (dépassements), bruitages synchronisés |

Score itération = moyenne F (sur 4) et moyenne V (sur 4), plus le nombre d'alertes QA.

## 3. Diagnostic : à qui appartient le défaut ?

Toute observation reçoit **une** étiquette :

- **E — Exécution** : le skill disait la bonne chose, la vidéo ne l'a pas appliquée.
  → correction dans la vidéo suivante seulement. *Le skill ne change pas.*
  Exception : une erreur E qui revient deux itérations de suite devient S (la règle
  n'est pas assez opérationnelle : il lui manque un contrôle ou un exemple).
- **S — Lacune du skill** : aucune règle ne couvrait le problème, ou la règle est vague.
- **C — Contradiction** : deux règles du skill se gênent (ex : budget de durée vs nombre de beats).
- **T — Outillage** : un défaut visible à l'œil que la vérification automatique n'a pas vu.
  → ajouter ou durcir un contrôle de la section Vérification.
- **X — Spécifique au sujet** : vrai seulement pour ce sujet (un fait GCP, une métaphore
  propre aux journaux). → `iterations/v{N}/REVIEW.md`, section « notes de production ».
  **Jamais dans le skill.**

## 4. Garde-fous anti-surapprentissage (chaque règle proposée passe les 6)

- **G1 Langage neutre** : la règle ne contient aucun terme du sujet de test (GCP, log,
  audit, IAM, SOC, bucket...). Contrôle : `tools/overfit_lint.py` (liste noire + rapport).
- **G2 Test de transfert** : la règle est appliquée par écrit aux 3 sujets témoins
  (`holdout/HOLDOUT.md`). Elle doit être utile ou neutre pour les 3. Nuisible pour un
  seul : la reformuler avec sa condition (« pour un sujet technique... ») ou la rejeter.
- **G3 Preuve** : la règle répond à un défaut observé et mesuré (cue, métrique). Pas
  de règle « au cas où ».
- **G4 Budget** : le skill ne grossit pas de plus de ~10 % par itération et reste sous
  ~260 lignes. Toute ajout examine d'abord : *peut-on reformuler une règle existante ?
  en supprimer une devenue inutile ?*
- **G5 Non-régression** : après régénération, aucun critère ne perd plus d'1 point. Sinon,
  la règle responsable est revue ou annulée à l'itération suivante (et notée dans le CHANGELOG).
- **G6 Exemples variés** : les exemples du skill viennent de domaines différents ; on n'y
  ajoute jamais d'exemple tiré du sujet de test, et on remplace ceux qui y ressemblent.

## 5. Ce qui est versionné (pour visionnage)

```
versions/v{N}/index.html   page autonome jouable (artifact)
versions/v{N}/video.mp4    export 1080p avec voix + bande son
versions/v{N}/episode.js   source de l'épisode (script, storyboard, scènes)
iterations/v{N}/REVIEW.md  grille, preuves, diagnostic, règles proposées et verdict des garde-fous
iterations/v{N}/qa.json    métriques automatiques
skill/SKILL.v{N}.md        skill après l'itération N ; CHANGELOG.md = diff raisonné
```

## 6. Critère d'arrêt

Au moins 5 itérations complètes. Au-delà : arrêt quand deux itérations successives
n'apportent plus de règle de type S/C/T (seulement du E/X), ou quand un critère
régresse deux fois de suite (signe de surapprentissage ou de règles contradictoires).

## 7. Validation finale hors sujet

Le skill final est appliqué, au niveau fiche pertinence + script + beat sheet, à un
sujet témoin jamais utilisé pendant la boucle (`holdout/VALIDATION.md`). On vérifie que
les nouvelles règles produisent un meilleur plan sans référence au sujet GCP.
