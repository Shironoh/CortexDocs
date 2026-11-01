# Itération 6 — série de 3 épisodes générée avec `SKILL.v6` (après retour utilisateur)

## 1. Le retour qui a déclenché l'itération

> « Au final les events et types de logs qu'on voit restent très superficiels et abstraits. » « La voix est horrible. »
> Objectif précisé : « il doit connaître les events intéressants pour le DFIR et la détection ». Format : plusieurs épisodes.

Diagnostic (voir conversation, résumé ici) :

| Cause | Étiquette | Correctif |
|---|---|---|
| Audience cadrée sur un seul axe : « ne connaît pas GCP » a fait basculer tout l'épisode en mode débutant | **S** | Audience sur deux axes : métier × outil |
| « Un terme nouveau par scène » appliqué aux artefacts (noms de méthodes, champs) | **C** | La limite vaut pour les concepts ; les artefacts de l'inventaire sont montrés tels quels |
| « Montrer plutôt qu'écrire » interprété comme « remplacer les artefacts par des icônes » | **S** | Icônes pour les concepts, vrais artefacts pour les artefacts |
| Pas d'inventaire de ce que le spectateur doit reconnaître après | **S** | Inventaire de valeur avant le script ; découpage par famille en épisodes |
| La grille ne mesurait pas la profondeur ; auto-note fond 3,71 contredite par l'utilisateur | **T** (protocole) | Critère F8, test du praticien, retour humain prioritaire sur l'auto-notation |
| Voix espeak-ng | X (environnement) | Aucune voix neuronale téléchargeable ici (réseau) : options proposées à l'utilisateur |

## 2. Ce que contient la série (inventaire, tout à l'écran tel quel)

- **Ép. 1 — Lire une entrée** (2:32) : les 4 journaux `activity`, `data_access`, `system_event`, `policy` (défaut, rétention) ;
  une vraie entrée déroulée ligne par ligne : `serviceName`, `methodName`, `resourceName`, `principalEmail`, `callerIp`
  (`gce-internal-ip`, `private`), `callerSuppliedUserAgent`, `bindingDeltas` ; piège du `principalEmail` masqué ;
  premier filtre Logs Explorer.
- **Ép. 2 — Persistance** (2:25) : `SetIamPolicy` (owner/editor, membre externe) · `google.iam.admin.v1.CreateServiceAccount` ·
  `google.iam.admin.v1.CreateServiceAccountKey` · `v1.compute.projects.setCommonInstanceMetadata` (`ssh-keys`) ·
  `GenerateAccessToken` (dans `data_access`, aveugle par défaut) + `roles/iam.serviceAccountTokenCreator`.
- **Ép. 3 — Effacer, exposer, exploiter** (2:24) : `google.logging.v2.ConfigServiceV2.DeleteSink` / `UpdateSink` ·
  `policyDelta.auditConfigDeltas` · `v1.compute.firewalls.insert` (`0.0.0.0/0`) · `storage.setIamPermissions` (`allUsers`) ·
  `v1.compute.instances.insert` (volume, région, GPU).

Chaque événement suit la même grammaire : l'attaquant agit → l'appel part au journal → fiche avec tactique,
`methodName` tapé à l'écran (gros plan), condition d'alerte (gros plan) → cloche de règle. Hotspot = requête complète.

## 3. QA (outils finaux)

| | Ép. 1 | Ép. 2 | Ép. 3 |
|---|---|---|---|
| Captures avec défaut | 25/48 | 19/45 | 19/45 |
| Fenêtres figées > 2,5 s | 1 | 0 | 0 |
| Surface vide | 9 % | 8 % | 8 % |
| Trous dans la feuille de beats | 0 | 0 | 0 |

Bugs trouvés pendant la production (outillage, corrigés) : animateur qui écrasait la position des lignes de
l'entrée (lignes superposées) ; cadrage calculé sur un texte en cours de frappe ; surbrillances rendues opaques.

## 4. Grille (avec F8)

| | Note | Preuve |
|---|---|---|
| F8 Profondeur métier | 4 (auto) | 15 méthodes/champs réels à l'écran, chacun avec sa condition d'alerte et sa requête |
| Fond (F1-F8) | à confirmer par l'utilisateur | l'auto-notation a été prise en défaut en v5 |
| V7 Voix | 2 | toujours espeak-ng |

## 5. Garde-fous pour les règles v6

Lint G1 : OK (aucun terme du sujet). Test de transfert : « deux axes métier × outil » et « inventaire de valeur »
sont utiles pour H2 (Kerberoasting : vrais Event ID 4769, types de chiffrement) et H3 (taux BCE : vrais taux,
vraie ligne TAEG), neutres pour H1 (grand public). Skill : 209 → 212 lignes.
