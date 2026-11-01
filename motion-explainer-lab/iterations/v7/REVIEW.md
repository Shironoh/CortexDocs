# Itération 7 — skill v7, deux sujets nouveaux + non-régression

## 1. Ce qui a déclenché l'itération

Demande de l'utilisateur (1er novembre 2026) : remplacer espeak par une voix neuronale calée au mot, rendre la recherche
fiable pour n'importe quel sujet, rendre l'outillage générique, tester sur des sujets variés pour éviter le surapprentissage.
Les règles v7 sont donc des exigences (S), écrites **avant** les vidéos ; les vidéos v7 sont générées avec `SKILL.v7.md`.

## 2. Bancs d'essai

| Version | Sujet | Domaine | Audience (métier × domaine) | Nature du savoir | Durée |
|---|---|---|---|---|---|
| `versions/v7-c14` | L'horloge d'Ötzi : la datation au carbone 14 | sciences | aucun métier lié × novice | mécanisme + lecture d'une valeur | 2:36 |
| `versions/v7-pgexplain` | Lire un EXPLAIN ANALYZE (PostgreSQL 18) | logiciel | développeur praticien × novice de l'optimiseur | artefacts réels, gestes | 2:46 |
| `versions/v7-reg-gcp-ep2` | Série GCP, épisode 2 (scènes v6 inchangées) | sécurité | praticien DFIR × novice GCP | non-régression du pipeline | 2:39 |

Sujets témoins jamais produits (G2) : H1 DNS, H2 Kerberoasting, H3 taux BCE. Validation finale réservée : H4 vaccin ARNm.

## 3. Recherche (nouvelle section 0 bis appliquée)

- **C14** : 12 faits, dont 6 primaires (Bonani et al. 1994 lu dans le PDF : lignes de labo, moyenne, calibration ; table LNHB
  du C-14 ; IntCal20 ; Renne 2013), le reste recoupé à deux sources. Un fait écarté faute de source primaire (facteur exact de
  la hausse du C14 due aux essais nucléaires). Fait daté : « calibration de 1994 » (courbe de 1993, IntCal20 depuis).
- **PostgreSQL** : documentation de la version courante (18.6) et notes de version 18.0 ; **tous les plans montrés ont été
  produits** sur un vrai serveur PostgreSQL 18.6 installé pour l'occasion (2 M de lignes, graine fixe, `research/pg-explain/`).
  Faits datés : BUFFERS par défaut et lignes fractionnaires « depuis la version 18 ».
- `factcheck.py` : premier jet C14, 29 nombres affichés sans source (valeurs du tableau en hotspot, arrondis) → fiche complétée,
  0 orphelin ; PostgreSQL, 31 → 0 en déclarant les sorties réelles comme sources.

## 4. Voix (nouveau pipeline)

| | C14 | PostgreSQL | GCP ép. 2 |
|---|---|---|---|
| Alignement des mots | 20 parties par phonèmes Piper, 2 par Whisper | 21/21 phonèmes | 16/16 phonèmes |
| Débit (mots du sous-titre / durée des voix) | 152 mots/min | 139 | 115 (noms de méthodes longs comptés comme 1 mot) |
| Écoute Whisper, WER moyen | 5,0 % | 6,7 % | 21 % avant lexique |
| Parties réécrites après écoute | 1 (« sablier coule » → « sablie est cool ») | 2 (« Postgres exécute » mal entendu ; « huit » → « lui ») | — |

## 5. Grille (auto-notation, à confirmer par l'utilisateur)

| Code | C14 | Preuve | PG | Preuve |
|---|---|---|---|---|
| F1 fil rouge | 4 | Ötzi : hook, s4 (rapport), s5 (sa calibration), s7 (résolution) | 3 | « Mes commandes » s1-s4, puis un second cas (rapport) s5-s6 : deux fils |
| F2 accessibilité | 3 | 1 terme/scène ; « accélérateur » non expliqué (seulement ce qu'il fait) | 3 | noms anglais à l'écran, dits par leur fonction ; « Bitmap Index Scan » non expliqué |
| F3 pourquoi + conséquence | 3 | pourquoi présent partout, conséquence de s2 implicite | 4 | coût estimé avant exécution ; prix de l'index (écritures) ; stats périmées → mauvais choix |
| F4 actionnabilité | 3 | 3 réflexes, lieu vague (« devant une datation ») | 4 | 3 gestes avec leur lieu (la requête lente, ANALYZE, BEGIN/ROLLBACK) |
| F5 exactitude conditionnelle | 4 | « environ », « calibration de 1994 », BP = 1950, 0 nombre orphelin | 4 | « depuis la version 18 », « d'habitude l'autovacuum… » ; plans réels |
| F6 engagement | 4 | 3 idées reçues dont 1 jouée par l'antagoniste, 2 devinez | 4 | 2 idées reçues, 2 devinez |
| F7 charge | 3 | 5 idées, 152 mots/min | 2 | 7 idées (cost/actual, rows, arbre, loops, index, stats, rollback, buffers) : au-dessus du budget 3-5 |
| F8 profondeur | 3 | vraie ligne de labo, vraies probabilités ; profondeur adaptée au grand public | 4 | sorties réelles à chaque scène, segments éclairés |
| V1 montrer > écrire | 3 | sablier, cernes, barres de demi-vie ; quelques étiquettes | 3 | entrepôt et robots, mais panneaux de texte nombreux (artefacts) |
| V2 caméra | 3 | 5/7 scènes à 3 échelles | 3 | 4/7 (scènes de panneaux à échelle uniforme) |
| V3 lisibilité | 3 | voir QA | 3 | voir QA |
| V4 rythme | 4 | 0 trou, 0 fenêtre figée | 4 | 0 trou ; 1 fenêtre figée (balayage des robots) |
| V5 personnages | 3 | héros actif 7/7, antagoniste 4/7 avec répliques et bouche synchronisée | 3 | idem + chef d'entrepôt (planificateur), robots |
| V6 cadrage | 3 | alertes `focus_small` résiduelles | 3 | idem |
| V7 son & voix | 3 | Piper siwis + tom, musique « wonder », 0 dépassement (la voix fixe le temps) | 3 | idem, musique « curious » |

## 6. Diagnostic

| Observation | Étiquette | Suite |
|---|---|---|
| Le contrôle « 3 textes max » comptait chaque graduation d'axe et chaque ligne d'un même artefact | **C** (contredit « vrais artefacts tels quels ») | corrigé dans l'outil v7 (`axis`, `block`) |
| Termes anglais écorchés par la voix française | **S** | règle v7 (dire par la fonction / lexique) + `voice.py --check` |
| Ancres de mots ratées sur « l'azote », « nœud » | **T** | moteur : élision et ligatures normalisées |
| Soleil décoratif du décor extérieur posé sur les objets du beat | **T** (kit) | soleil désormais optionnel |
| Plan d'ouverture fixe 5 s (C14) ; métaphore système qui n'apparaît qu'au dernier mot du hook | **E** | corrigé dans la vidéo |
| PG : objets de la scène précédente laissés sous le beat suivant (index + balance superposés) | **E** (règle « nettoyage » existante) | corrigé ; à surveiller : 2ᵉ occurrence → S |
| PG : 7 idées pour un budget de 3-5 | **E** (règle « budget d'idées » existante) | candidat S si l'avis utilisateur confirme : l'inventaire d'un praticien pousse à déborder |
| Variété de plans mesurée par le zoom absolu : un panneau de 1 500 unités et une pièce de 2 000 donnent le même zoom | **T** | candidat v8 : mesurer la part du cadre occupée par le sujet |
| Carton recoloré sur la mauvaise forme (ombre au lieu du corps) | **X** (code de l'épisode) | corrigé |
| Faits C14 et PostgreSQL | **X** | fiches `research/*/SOURCES.md`, jamais dans le skill |

## 7. Garde-fous pour les règles v7

- **G1** : `overfit_lint.py` étendu (termes GCP, C14, PostgreSQL et témoins H1-H4, `tools/overfit_terms.json`) : OK sur les ajouts
  et sur le fichier entier.
- **G2** (transfert écrit sur les témoins) :
  - *Recherche 0 bis* — H1 DNS : sources primaires = RFC 1034/1035, artefact produit = sortie de `dig` ; H2 Kerberoasting : docs
    Microsoft de l'événement 4769, artefact produit en labo AD ; H3 BCE : communiqué de la BCE daté, taux du jour. Utile pour les 3.
  - *Savoir-faire = raisonnement pour un public sans métier* — H1 : « lire la réponse d'un `dig` », H3 : « relier une hausse de taux
    à sa mensualité ». Utile pour H1 et H3, neutre pour H2.
  - *La voix fixe le temps, termes étrangers par leur fonction* — H2 (beaucoup de termes anglais) : utile ; H1, H3 : neutre.
  - *Personnages qui parlent* — utile pour les 3 si l'antagoniste porte l'idée reçue ; règle conditionnée (« bon usage »).
- **G3** : chaque règle cite son observation (CHANGELOG v7).
- **G4** : 212 → 202 lignes (le squelette de code est sorti dans `reference/TOOLKIT.md`).
- **G5** : non-régression GCP ép. 2 (§8).
- **G6** : exemples du skill : aucun tiré des sujets v7.

## 8. Non-régression (série GCP, épisode 2)

Même script et mêmes scènes qu'en v6, nouveau pipeline voix/son. Durée 2:25 → 2:39 (la voix Piper, plus posée, fixe le temps).
Feuille de beats : 1 trou de 2,9 s (c14) que le modèle 2,6 mots/s masquait. Voir `iterations/v7/reg-gcp-ep2/QA.md`.

| QA automatique | v6 ép. 2 (espeak) | v7 ép. 2 (Piper, même script) |
|---|---|---|
| Durée | 2:25 | 2:39 |
| Captures avec alerte | 19/45 | 18/45 |
| Fenêtres figées > 2,5 s | 0 | 0 |
| Surface vide | 8 % | 7 % |
| Scènes sous 3 échelles de plan | 1/7 | 1/7 |

Aucun critère ne recule (G5 respecté). QA des deux sujets nouveaux, pour comparaison : C14 37/60 captures avec alerte,
PostgreSQL 35/57 (surtout `focus_small` et `subj_in_band` : sujets jamais encore travaillés par la boucle, alors que l'épisode
GCP a bénéficié de six itérations de corrections).

## 9. En attente

**Ton avis sur les trois vidéos** (voix, musique, bouches, fond, forme) avant d'écrire la v8. Candidats déjà identifiés,
non appliqués : mesurer la variété de plans par la part du cadre ; budget d'idées pour un praticien (découper plutôt que
d'empiler) ; ouverture animée par défaut.
