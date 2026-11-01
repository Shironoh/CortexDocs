# Fiche sources — « Lire un EXPLAIN ANALYZE » (PostgreSQL 18)

Consultées le 1er novembre 2026. Niveau : **P** primaire (documentation officielle de la version courante, sortie réelle
produite ici) · **R** recoupé (deux sources indépendantes) · **?** à vérifier (jamais dans la narration).
Artefacts : produits sur un vrai serveur **PostgreSQL 18.6** (`setup.sql`, 2 000 000 de commandes, 200 000 clients, graine fixe) ;
les sorties sont copiées telles quelles dans `plan*.txt`.

| # | Fait (tel que dit ou montré) | Valeurs | Source (citation) | Niveau |
|---|---|---|---|---|
| 1 | `cost` = coût estimé de démarrage..coût total, en unités arbitraires (pas des ms) | — | docs 18 *Using EXPLAIN* : « The costs are measured in arbitrary units determined by the planner's cost parameters » ; « actual time values are in milliseconds of real time, whereas the cost estimates are expressed in arbitrary units » — https://www.postgresql.org/docs/current/using-explain.html | P |
| 2 | `rows` = lignes **émises** estimées ; `actual … rows` = réelles | — | idem : « it is not the number of rows processed or scanned by the plan node, but rather the number emitted by the node » | P |
| 3 | `loops` : temps et lignes réels sont des moyennes **par exécution** ; multiplier par `loops` | 3 | idem : « the actual time and rows values shown are averages per-execution. Multiply by the loops value… » | P |
| 4 | EXPLAIN ANALYZE **exécute** la requête ; pour UPDATE/DELETE : `BEGIN; … ROLLBACK;` | — | idem : « because EXPLAIN ANALYZE actually runs the query, any side-effects will happen as usual » + exemple BEGIN/ROLLBACK ; vérifié ici `plan3_update_rollback.txt` | P |
| 5 | Depuis PostgreSQL 18 : BUFFERS inclus par défaut avec ANALYZE ; nombres de lignes fractionnaires | 18 | notes de version 18.0 (25/09/2025) : « Automatically include BUFFERS output in EXPLAIN ANALYZE » ; « Modify EXPLAIN to output fractional row counts » — https://www.postgresql.org/docs/release/18.0/ | P |
| 6 | Le plus important : l'estimation de lignes est-elle proche de la réalité ? | — | *Using EXPLAIN* : « The thing that's usually most important to look for is whether the estimated row counts are reasonably close to reality » | P |
| 7 | Sans index : lire toute la table ligne par ligne | — | docs *Indexes — Introduction* : « the system would have to scan the entire test1 table, row by row » — https://www.postgresql.org/docs/current/indexes-intro.html | P |
| 8 | Compromis : un index doit être tenu à jour à chaque écriture | — | idem : « the system has to keep it synchronized with the table. This adds overhead to data manipulation operations » | P |
| 9 | Après un gros chargement, lancer ANALYZE ; stats périmées → mauvais plans | — | docs *Populating a Database* §14.4.8 : « With no statistics or obsolete statistics, the planner might make poor decisions » — https://www.postgresql.org/docs/current/populate.html | P |
| 10 | Autovacuum analyse quand les lignes modifiées dépassent 50 + 10 % de la table | 50 ; 10 % | docs *Routine Vacuuming* §24.1.6 (formule) + valeurs lues sur le serveur : `autovacuum_analyze_threshold=50`, `autovacuum_analyze_scale_factor=0.1` | R |
| 11 | Plan 1 avant index : `Parallel Seq Scan on orders … rows=5 … actual … rows=2.67 loops=3`, `Rows Removed by Filter: 666664`, `Execution Time: 48.466 ms` | 2,67 ; 3 ; 666 664 ; 48,466 | `plan1_before.txt` (sortie réelle) | P |
| 12 | Plan 1 après `CREATE INDEX … (customer_id, created_at DESC)` : `Bitmap Index Scan on orders_customer_created_idx`, `Execution Time: 0.159 ms` | 0,159 | `plan1_after.txt` | P |
| 13 | Plan 2, statistiques périmées : `Nested Loop (… rows=1 …) (actual … rows=300000.00 loops=1)`, index scan `loops=300000`, `Sort Method: external merge Disk: 6488kB`, `Execution Time: 1077.072 ms` | 1 ; 300 000 ; 6 488 ; 1 077 | `plan2_stale.txt` (300 000 lignes insérées, autovacuum coupé pour figer la fenêtre où les stats sont périmées) | P |
| 14 | Après `ANALYZE orders` : `Parallel Hash Join (… rows=127586 …) (actual … rows=100000.00 loops=3)`, `Execution Time: 176.475 ms` | 176 | `plan2_analyzed.txt` | P |

**Simplifications assumées** (dites dans la narration ou au hotspot) : les temps varient d'une machine et d'une exécution à
l'autre (cache) ; le plan après index choisit ici un Bitmap Index Scan (il pourrait choisir un Index Scan avec d'autres données).
