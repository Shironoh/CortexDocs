/*META{"title":"Lire un EXPLAIN ANALYZE","h1":"Lire un EXPLAIN ANALYZE · PostgreSQL 18","eyebrow":"Motion explainer · skill v7 · technique, développeurs","voice":{"cast":{"foe":{"voice":"fr_FR-tom-medium","ls":1.0}},"lexicon":{"postgres":"Post-gresse","loops":"Loupse","orders":"Ordeurz","autovacuum":"auto-vakiou-eume","cost":"coste"}},"music":{"mood":"curious","key":"F"},"footer":"<p class='footer'>v7-pgexplain, skill v7. Plans réels produits sur PostgreSQL 18.6 (2 000 000 de commandes, 200 000 clients ; script dans research/pg-explain/). Sources : documentation PostgreSQL 18 (Using EXPLAIN, Indexes, Populating a Database, Routine Vacuuming), notes de version 18.0. Voix Piper (siwis, tom), musique générée.</p>"}META*/
/* ---------- FICHE (skill v7) ----------
Audience : métier = développeur back-end, praticien (écrit du SQL chaque jour) ; domaine = optimiseur PostgreSQL, novice.
Doit savoir faire après : 1. lancer EXPLAIN (ANALYZE) sur une requête lente (dans BEGIN … ROLLBACK si elle écrit) ;
 2. lire un plan de l'intérieur vers l'extérieur, trouver le nœud coûteux, repérer « Rows Removed by Filter » énorme → index ;
 3. comparer rows prévu / réel ; écart énorme → statistiques périmées → ANALYZE.
Question centrale : pourquoi cette requête est-elle lente, et que dit le plan ?
Inventaire (sorties réelles, research/pg-explain/plan*.txt) : EXPLAIN (ANALYZE) ; Parallel Seq Scan on orders (cost=0.00..25555.67 rows=5 width=20)
 (actual time=13.111..38.517 rows=2.67 loops=3) ; Rows Removed by Filter: 666664 ; Execution Time: 48.466 ms ; CREATE INDEX … (customer_id, created_at DESC) ;
 Bitmap Index Scan on orders_customer_created_idx ; 0.159 ms ; Nested Loop rows=1 / rows=300000.00 ; loops=300000 ; 1077.072 ms ; ANALYZE orders ;
 Parallel Hash Join ; 176.475 ms ; autovacuum 50 + 10 % ; BEGIN/ROLLBACK ; Buffers (PG 18).
Métaphore système : l'entrepôt (table = cartons ; Seq Scan = robots qui ouvrent tout ; index = catalogue trié ; planificateur = chef d'entrepôt et sa fiche d'inventaire).
Idées reçues : « cost = millisecondes » (antagoniste) ; « EXPLAIN ANALYZE ne fait que décrire ». Devinez : lignes lues pour 8 ; lignes trouvées pour 1 prévue.
Termes nouveaux : s2 coût estimé ; s3 nœud ; s4 index ; s5 planificateur ; s6 statistiques ; s7 transaction annulée.
------------------------------------ */
const EP = {
  bg: '#0B1A3A', lead: .6, tail: 2.2, spotDark: .25,
  zones: { bureau: [0, 0], ligne: [2300, 0], arbre: [4600, 0], index: [6900, 0], rapport: [9200, 0], stats: [11500, 0], fin: [13800, 0] },
  legend: [['#22D3EE', 'sortie réelle de PostgreSQL'], ['#FFB703', 'estimation (avant exécution)'], ['#06D6A0', 'réel (actual)'], ['#EF476F', 'idée reçue / problème'], ['#A78BFA', 'planificateur et statistiques']],
  scenes: [{ id: 's1', title: 'Une page lente' }, { id: 's2', title: 'Lire une ligne' }, { id: 's3', title: 'Lire l\'arbre' }, { id: 's4', title: 'L\'index' },
    { id: 's5', title: 'Prévu : 1 ligne' }, { id: 's6', title: 'ANALYZE' }, { id: 's7', title: 'Vos réflexes' }],
  cues: [
    { id: 'c1', sc: 's1', sub: 'La page « Mes commandes » met du temps à s\'afficher. Vous avez la requête. Mais pourquoi est-elle lente ?', say: 'La page Mes commandes met du temps à s\'afficher. Vous avez la requête. Mais pourquoi est-elle lente ?' },
    { id: 'c2', sc: 's1', sub: 'Ajoutez EXPLAIN ANALYZE devant : la base exécute la requête et raconte comment elle s\'y est prise.', say: 'Ajoutez explain analyze devant : la base exécute la requête et raconte comment elle s\'y est prise.' },
    { id: 'c3', sc: 's2', who: 'foe', sub: 'Facile : « cost », c\'est le temps en millisecondes !', say: 'Facile : le cost, c\'est le temps en millisecondes !' },
    { id: 'c4', sc: 's2', sub: 'Non. « cost » est une estimation faite avant d\'exécuter, en unités arbitraires. Le vrai temps, en millisecondes, est dans « actual time ».', say: 'Non. Le cost est une estimation faite avant d\'exécuter, en unités arbitraires. Le vrai temps, en millisecondes, est dans actual time.' },
    { id: 'c5', sc: 's2', sub: 'Sur chaque ligne, comparez « rows » : les lignes prévues, puis les lignes réelles. C\'est le premier indice.', say: 'Sur chaque ligne, comparez les rows : les lignes prévues, puis les lignes réelles. C\'est le premier indice.', breath: .8 },
    { id: 'c6', sc: 's3', sub: 'Un plan se lit de l\'intérieur vers l\'extérieur : le nœud le plus indenté travaille d\'abord et passe ses lignes à son parent.', say: 'Un plan se lit de l\'intérieur vers l\'extérieur : le nœud le plus indenté travaille d\'abord et passe ses lignes à son parent.' },
    { id: 'c7', sc: 's3', sub: 'Tout en bas : Parallel Seq Scan, la lecture de toute la table, par trois processus. « loops=3 » : les chiffres sont des moyennes par processus.', say: 'Tout en bas : une lecture de toute la table, par trois processus. Loops égale trois : les chiffres sont des moyennes par processus.' },
    { id: 'c8', sc: 's3', sub: 'Chacun écarte 666 664 lignes. Devinez : combien de lignes lues pour en garder 8 ?|2 millions. Toute la table, pour en garder 8.', say: 'Chacun écarte six cent soixante-six mille lignes. Devinez : combien de lignes lues pour en garder huit ? | Deux millions. Toute la table, pour en garder huit.' },
    { id: 'c9', sc: 's4', sub: 'Le remède : un index sur le client et la date. Comme un catalogue trié, il mène droit aux bons cartons.', say: 'Le remède : un index sur le client et la date. Comme un catalogue trié, il mène droit aux bons cartons.' },
    { id: 'c10', sc: 's4', sub: 'Nouveau plan : Bitmap Index Scan sur le nouvel index. Exécution : 0,159 ms au lieu de 48.', say: 'Nouveau plan : un parcours du nouvel index. Exécution : zéro virgule seize milliseconde au lieu de quarante-huit.' },
    { id: 'c11', sc: 's4', sub: 'Le prix : chaque écriture doit aussi mettre l\'index à jour. On n\'en crée pas un par colonne.', say: 'Le prix : chaque écriture doit aussi mettre l\'index à jour. On n\'en crée pas un par colonne.', breath: .8 },
    { id: 'c12', sc: 's5', sub: 'Deuxième requête, un rapport : plus d\'une seconde. Le planificateur avait prévu une seule ligne.', say: 'Deuxième requête, un rapport : plus d\'une seconde. Le planificateur avait prévu une seule ligne.' },
    { id: 'c13', sc: 's5', sub: 'Devinez combien il en a trouvé.|300 000. Il a choisi une boucle imbriquée, faite pour une ligne : 300 000 allers-retours.', say: 'Devinez combien il en a trouvé. | Trois cent mille. Il a choisi une boucle imbriquée, faite pour une ligne : trois cent mille allers-retours.' },
    { id: 'c14', sc: 's5', sub: 'Pourquoi ? 300 000 commandes venaient d\'être chargées, et ses statistiques n\'étaient pas à jour.', say: 'Pourquoi ? Trois cent mille commandes venaient d\'être chargées, et ses statistiques n\'étaient pas à jour.', breath: .8 },
    { id: 'c15', sc: 's6', sub: 'ANALYZE orders rafraîchit les statistiques. Nouveau plan : Hash Join, une jointure par hachage. 176 ms.', say: 'Analyze orders rafraîchit les statistiques. Nouveau plan : une jointure par hachage. Cent soixante-seize millisecondes.' },
    { id: 'c16', sc: 's6', sub: 'D\'habitude, l\'autovacuum s\'en charge, après environ 10 % de lignes modifiées. Après un gros chargement, lancez-le vous-même.', say: 'D\'habitude, l\'autovacuum s\'en charge, après environ dix pour cent de lignes modifiées. Après un gros chargement, lancez-le vous-même.', breath: .8 },
    { id: 'c17', sc: 's7', sub: 'On croit qu\'EXPLAIN ANALYZE ne fait que décrire. Faux : il exécute. Pour un UPDATE, encadrez-le : BEGIN, puis ROLLBACK.', say: 'On croit qu\'explain analyze ne fait que décrire. Faux : il exécute. Pour une mise à jour, encadrez-le dans une transaction, puis annulez-la.' },
    { id: 'c18', sc: 's7', sub: 'Vos réflexes : EXPLAIN ANALYZE sur la requête lente ; des lignes écartées par millions, il manque un index ; prévu loin du réel, lancez ANALYZE.', say: 'Vos réflexes : explain analyze sur la requête lente. Des lignes écartées par millions : il manque un index. Prévu loin du réel : lancez analyze.' },
    { id: 'c19', sc: 's7', sub: 'Vous savez lire un plan. Depuis PostgreSQL 18, il affiche aussi les Buffers : cache ou disque, ce sera l\'étape suivante.', say: 'Vous savez lire un plan. Depuis Postgres dix-huit, il affiche aussi les buffers : cache ou disque, ce sera l\'étape suivante.' },
  ],
  quiz: {
    c8: { q: 'Trois processus écartent chacun 666 664 lignes en moyenne. Combien de lignes ont été lues pour en garder 8 ?', choices: ['666 664', 'environ 2 millions', '8'], answer: 1, why: 'Les chiffres d\'un nœud sont des moyennes par boucle : 666 664 × 3 + 8 ≈ 2 000 000, toute la table.' },
    c13: { q: 'Le planificateur prévoyait 1 ligne (rows=1). Combien le nœud en a-t-il produit ?', choices: ['1', '300', '300 000'], answer: 2, why: 'actual … rows=300000.00 : 300 000 commandes insérées sans ANALYZE, les statistiques ignoraient leur statut.' },
  },
  poster: K => K.T('c2', 'analyze') + .8,
  build(K) {
    const k = sceneKit(K); const { C, G, I, F, FLOOR } = k; const { S, E, Z, P } = K; const T = K.T, R = K.reveal, cue = K.cue, pu = k.pulse;
    k.world(['bureau', 'ligne', 'arbre', 'index', 'rapport', 'stats', 'fin'], { silhouette: 'server' });
    const carton = (g, x, y, s, col, o = {}) => { const c = G(g, x, y, { s, ...o }); S('rect', { x: -40, y: -34, width: 80, height: 68, rx: 8, fill: col || '#B7854F' }, c);
      S('rect', { x: -40, y: -34, width: 80, height: 16, rx: 6, fill: '#000', opacity: .15 }, c); S('rect', { x: -6, y: -34, width: 12, height: 30, fill: '#E7DCC4', opacity: .7 }, c); return c; };
    /* ================= s1 : a slow page ================= */
    const g1 = k.room('bureau', '#1F3B80', { seed: 1 });
    S('rect', { x: -620, y: 60, width: 960, height: 44, rx: 14, fill: C.p2 }, g1); S('rect', { x: -580, y: 104, width: 28, height: 146, fill: C.p1 }, g1); S('rect', { x: 280, y: 104, width: 28, height: 146, fill: C.p1 }, g1);
    const mon = G(g1, -140, -190); S('rect', { x: -360, y: -210, width: 720, height: 420, rx: 24, fill: C.p1, stroke: '#26407e', 'stroke-width': 6 }, mon);
    S('rect', { x: -335, y: -188, width: 670, height: 376, rx: 14, fill: '#E8EEF9' }, mon); S('rect', { x: -40, y: 210, width: 80, height: 40, fill: C.p1 }, mon);
    K.tx(mon, -300, -130, 'Mes commandes', { size: 72, fill: C.ink, weight: 800, anchor: 'start' });
    for (let i = 0; i < 3; i++) S('rect', { x: -300, y: -70 + i * 70, width: 600, height: 44, rx: 10, fill: '#CBD5E1' }, mon);
    const spin = G(mon, 0, 0, { pop: T('c1', 'temps') }); const arc = S('path', { d: 'M 0 -70 A 70 70 0 1 1 -66 -24', fill: 'none', stroke: C.rose, 'stroke-width': 16, 'stroke-linecap': 'round' }, spin);
    K.fx(t => arc.setAttribute('transform', `rotate(${((t * 300) % 360).toFixed(1)})`)); spin._a.o.out = T('c2', 'ajoutez');
    const hero = k.hero(g1, 560, { s: 1.5, dir: -1 }); hero.pop(.2).pose(T('c1', 'requete'), 1.2, 'type').expr(T('c1', 'pourquoi'), 'worried').look(T('c1', 'page'), -140, -190);
    const qsql = k.panel(g1, -140, -150, ['SELECT id, total_cents, created_at', 'FROM orders WHERE customer_id = 4217', 'ORDER BY created_at DESC LIMIT 20;'], { w: 880, size: 40, pop: T('c1', 'requete'), out: T('c2', 'ajoutez'), col: C.cyan });
    const ex = k.panel(g1, -140, -150, ['EXPLAIN (ANALYZE) SELECT …'], { w: 880, size: 50, pop: T('c2', 'ajoutez') - .1, col: C.green, typeAt: T('c2', 'explain') });
    const q1 = k.suspense(g1, 300, -450, T('c1', 'pourquoi'), T('c2', 'ajoutez'));
    hero.pose(T('c2', 'explain'), 1.4, 'type').pose(T('c2', 'raconte'), 1.0, 'point', { x: -140, y: -190 }).expr(T('c2', 'raconte'), 'happy');
    K.cam(0, 0, Z.bureau[0] - 100, Z.bureau[1] - 120, 1.6); F(.4, 3.0, [g1._room], .92, { focus: false }); K.focus(0, mon);
    F(T('c1', 'requete') - .3, .9, [mon, hero], .8, { focus: false }); K.focus(T('c1', 'requete'), qsql);
    F(T('c1', 'pourquoi') - .3, .7, [mon, q1], .8, { focus: false }); K.focus(T('c1', 'pourquoi'), q1);
    F(T('c2', 'explain') - .3, .8, [ex], .6, { focus: false, zmax: 2.2 }); K.focus(T('c2', 'explain'), ex);
    F(T('c2', 'raconte') - .2, .9, [mon, hero], .86, { focus: false });
    pu(mon, T('c1', 'lente'));
    /* ================= s2 : read one line ================= */
    const g2 = k.room('ligne', '#1E3570', { seed: 2 }); const s2 = k.sc('s2');
    const L = ['Parallel Seq Scan on orders', '(cost=0.00..25555.67 rows=5 width=20)', '(actual time=13.111..38.517 rows=2.67 loops=3)'];
    const ln = k.panel(g2, 0, -170, L, { w: 1500, size: 52, pop: s2 - .3, col: C.cyan, title: 'une ligne du plan (sortie réelle)' });
    const hCost = ln._hi(1, 1, 19, T('c3', 'cost'), { col: C.amber, box: true, out: T('c4', 'actual') });
    const hAct = ln._hi(2, 1, 26, T('c4', 'actual'), { col: C.green, out: T('c5', 'comparez') });
    const hR1 = ln._hi(1, L[1].indexOf('rows=5'), 6, T('c5', 'prevues'), { col: C.amber });
    const hR2 = ln._hi(2, L[2].indexOf('rows=2.67'), 9, T('c5', 'reelles'), { col: C.green });
    const foe = k.foe(g2, -1100, { s: 1.4, dir: 1, mask: false }); foe.pop(cue('c3').start - .4).walk(cue('c3').start - .3, .9, -640).pose(T('c3', 'cost'), 1.0, 'point', { x: -300, y: -170 }).pose(T('c3', 'millisecondes') - .2, .9, 'cheer')
      .expr(T('c4', 'non'), 'worried').walk(T('c4', 'actual') - .3, .9, -1250).out(T('c4', 'actual') + .3);
    const nonms = k.label(g2, -280, 120, 'cost ≠ ms', { pop: T('c4', 'non'), out: T('c5', 'comparez'), size: 64, col: C.rose }); K.ev(T('c4', 'non'), 'myth');
    const est = k.label(g2, -280, 120, 'estimé, avant', { pop: T('c4', 'estimation') + .6, out: T('c4', 'actual'), size: 60, col: C.amber }); nonms._a.o.out = T('c4', 'estimation') + .5;
    const ms = k.label(g2, 380, 120, 'réel, en ms', { pop: T('c4', 'actual'), out: T('c5', 'comparez'), size: 60, col: C.green });
    const vs = k.label(g2, 0, 130, '5 prévues  ·  2,67 réelles', { pop: T('c5', 'reelles') + .2, size: 60, col: C.text });
    const hero2 = k.hero(g2, 1000, { s: 1.4, dir: -1 }); hero2.pop(T('c4', 'non') - .5).walk(T('c4', 'non') - .4, .9, 760).pose(T('c4', 'non'), .8, 'shrug').pose(T('c5', 'comparez'), 1.0, 'point', { x: 200, y: -110 }).expr(T('c5', 'indice'), 'happy');
    F(s2 - 1.4, 1.5, [ln], .9, { focus: false }); K.focus(s2, ln);
    F(cue('c3').start - .2, .9, [ln, foe], .95, { focus: false }); F(T('c3', 'cost') - .2, .6, [hCost], .8, { focus: false, zmax: 2.6 }); F(T('c3', 'temps') - .2, .7, [ln, foe], .95, { focus: false }); K.focus(T('c3', 'cost'), hCost);
    F(T('c4', 'estimation') - .3, .8, [ln, est], .9, { focus: false }); K.focus(T('c4', 'estimation'), est);
    F(T('c4', 'actual') - .3, .8, [ln, ms], .9, { focus: false }); F(T('c4', 'time'), .6, [ln._els[2]], .7, { focus: false, zmax: 2.4 }); K.focus(T('c4', 'actual'), hAct);
    F(T('c5', 'comparez') - .3, .9, [ln, vs], .9, { focus: false }); K.focus(T('c5', 'prevues'), hR1); K.focus(T('c5', 'reelles'), hR2);
    pu(ln, T('c4', 'arbitraires')); pu(vs, T('c5', 'indice'));
    K.hot({ x: Z.ligne[0], y: Z.ligne[1] - 330, at: s2, until: cue('c5').end, title: 'Les champs', html: '<p><code>cost=démarrage..total</code> : coût estimé, unités arbitraires (seq_page_cost = 1). <code>rows</code> : lignes <b>émises</b> estimées. <code>width</code> : octets par ligne. <code>actual time</code> : ms réelles ; <code>rows</code>, <code>loops</code> : réels, moyennes par exécution. Depuis la version 18, les lignes réelles sont fractionnaires.</p><p class="src">docs PostgreSQL 18, « Using EXPLAIN » ; notes de version 18.0.</p>' });
    /* ================= s3 : read the tree ================= */
    const g3 = k.room('arbre', '#262F72', { decor: 'lab', seed: 3 }); const s3 = k.sc('s3');
    const nodes = [['Limit', 'rows=8.00'], ['Sort', 'rows=8.00'], ['Gather', 'rows=8.00'], ['Parallel Seq Scan on orders', 'rows=2.67 loops=3']].map(([n, r], i) => {
      const nd = G(g3, -520 + i * 90, -470 + i * 120, { pop: s3 - .2 + i * .1 }); const w = 120 + n.length * 26;
      S('rect', { x: 0, y: -44, width: w, height: 88, rx: 18, fill: C.p1, stroke: i === 3 ? C.rose : C.cyan, 'stroke-width': 6 }, nd);
      K.tx(nd, 30, 0, '-> ' + n, { size: 48, fill: C.text, weight: 700, anchor: 'start', mono: true, block: 'tree' }); nd._w = w; return nd; });
    const order = [3, 2, 1, 0].map((ni, j) => { const tg = nodes[ni]; const r = S('rect', { x: -8, y: -52, width: tg._w + 16, height: 104, rx: 22, fill: 'none', stroke: C.amber, 'stroke-width': 8 }, tg);
      K.A(r, { fin: [T('c6', 'indente') + j * .5, .2], out: T('c6', 'indente') + j * .5 + .6 }); return r; });
    const up = k.arrow(g3, -620, -60, -620, -460, { t: T('c6', 'passe'), col: C.amber, sw: 12, out: T('c7', 'bas') });
    // warehouse: 3 robots sweep the cartons (one per process)
    const wh = G(g3, 260, 120); const cartons = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) { const cc = carton(wh, -440 + c * 110, -150 + r * 100, .9, '#B7854F'); cartons.push([cc, r, c]); }
    const tScan = T('c7', 'lecture');
    for (const [cc, r, c] of cartons) { const kept = (r * 9 + c) % 13 === 4; const tt = tScan + c * .35 + r * .05; const rr = cc.firstChild;
      K.fx(t => rr.setAttribute('fill', t > tt ? (kept ? C.amber : '#4B5675') : '#B7854F')); }
    K.mark(tScan); K.mark(tScan + 1.4); K.mark(tScan + 2.8);
    const bots = [0, 1, 2].map(i => { const b = K.char(wh, { name: 'robot' + i, color: C.orange, shape: 'robot', x: -540, y: -150 + i * 100 + 40, s: .55 });
      b.pop(T('c7', 'bas') + i * .15).slide(tScan, 4.2, 480); return b; });
    const lp = k.label(g3, 560, -330, 'loops=3', { pop: T('c7', 'loops'), size: 60, col: C.cyan, mono: true, out: T('c8', 'chacun') });
    const rr = k.label(g3, 560, -330, 'Rows Removed by Filter: 666664', { pop: T('c8', 'chacun'), size: 54, col: C.rose, mono: true });
    const q3 = k.suspense(g3, 260, 470 - 600, T('c8', 'devinez'), R('c8'));
    const tot = k.counter(g3, 360, -470, { pop: R('c8'), t0: R('c8'), dur: 1.2, from: 0, to: 2000000, size: 96, fill: C.amber, fmt: v => Math.round(v).toLocaleString('fr-FR') + ' lues' });
    const kept8 = k.label(g3, 900, -330, '→ 8 gardées', { pop: R('c8') + 1.2, size: 54, col: C.amber });
    const hero3 = k.hero(g3, -980, { s: 1.35 }); hero3.pop(s3 - .3).walk(s3 - .2, .9, -880).pose(T('c6', 'indente'), 1.0, 'point', { x: -260, y: -110 }).pose(T('c7', 'bas'), 1.0, 'point', { x: 0, y: 0 })
      .expr(T('c8', 'devinez'), 'worried').expr(R('c8'), 'surprise').pose(R('c8') + .2, 1.0, 'jump');
    F(s3 - 1.4, 1.5, [...nodes], .82, { focus: false }); K.focus(s3, nodes[0]);
    F(T('c6', 'indente') - .3, .8, [nodes[2], nodes[3]], .8, { focus: false }); K.focus(T('c6', 'indente'), nodes[3]);
    F(T('c6', 'passe') - .2, .9, [...nodes, up], .86, { focus: false }); F(T('c6', 'parent') - .1, .6, [...nodes], .9, { focus: false }); K.focus(T('c6', 'passe'), up);
    F(T('c7', 'bas') - .3, .9, [wh, lp], .82, { focus: false }); K.focus(T('c7', 'bas'), wh); K.focus(T('c7', 'loops'), lp);
    F(T('c8', 'chacun') - .3, .8, [wh, rr], .84, { focus: false }); K.focus(T('c8', 'chacun'), rr);
    F(R('c8') - .3, .8, [wh, tot, kept8], .9, { focus: false }); K.focus(R('c8'), tot); F(T('c6', 'noeud') - .2, .6, [nodes[3]], .62, { focus: false, zmax: 2.4 });
    pu(wh, T('c7', 'processus')); pu(nodes[3], T('c7', 'moyennes')); pu(rr, T('c8', 'lignes', 1)); pu(wh, T('c8', 'garder') + .3); F(T('c8', 'garder') - .2, .6, [cartons[4][0], cartons[17][0]], .5, { focus: false, zmax: 2.6 });
    K.hot({ x: Z.arbre[0] - 100, y: Z.arbre[1] - 470, at: s3, until: cue('c8').end, title: 'Plan complet', html: '<pre>Limit  (cost=26556.96..26556.98 rows=11 width=20) (actual time=41.693..48.426 rows=8.00 loops=1)\n  -&gt;  Sort  (…) (actual … rows=8.00 loops=1)\n        Sort Key: created_at DESC\n        -&gt;  Gather  (…) (actual … rows=8.00 loops=1)\n              Workers Launched: 2\n              -&gt;  Parallel Seq Scan on orders  (cost=0.00..25555.67 rows=5 width=20)\n                    (actual time=13.111..38.517 rows=2.67 loops=3)\n                    Filter: (customer_id = 4217)\n                    Rows Removed by Filter: 666664\nExecution Time: 48.466 ms</pre><p class="src">Sortie réelle, PostgreSQL 18.6 (research/pg-explain/plan1_before.txt).</p>' });
    /* ================= s4 : the index ================= */
    const g4 = k.room('index', '#1E3A72', { decor: 'lab', seed: 4 }); const s4 = k.sc('s4');
    const ci = k.panel(g4, -40, -420, ['CREATE INDEX ON orders (customer_id, created_at DESC);'], { w: 1500, size: 46, pop: s4 - .2, col: C.green, typeAt: T('c9', 'index'), out: cue('c11').start });
    const drawer = G(g4, -520, 0, { pop: T('c9', 'catalogue') - .2, out: cue('c10').start - .3 }); S('rect', { x: -170, y: -150, width: 340, height: 300, rx: 20, fill: C.p2, stroke: C.violet, 'stroke-width': 6 }, drawer);
    for (let i = 0; i < 6; i++) { const cd = S('rect', { x: -140, y: -120 + i * 44, width: 280, height: 34, rx: 8, fill: i === 3 ? C.amber : C.paper }, drawer); }
    K.tx(drawer, 0, 190, 'client 4217', { size: 50, fill: C.amber, weight: 800, mono: true });
    const shelf = G(g4, 360, 40, { out: cue('c10').start - .3 }); const sc8 = []; for (let i = 0; i < 12; i++) { const amb = [2, 5, 9].includes(i); sc8.push(carton(shelf, -330 + (i % 6) * 130, -60 + Math.floor(i / 6) * 110, .95, amb ? C.amber : '#B7854F')); }
    const jump = k.arrow(g4, -340, -40, 120, -60, { t: T('c9', 'droit'), col: C.amber, sw: 12, out: cue('c10').start - .3 });
    const np = k.panel(g4, -40, -80, ['Bitmap Index Scan on orders_customer_created_idx', 'Execution Time: 0.159 ms'], { w: 1500, size: 46, pop: cue('c10').start - .2, col: C.cyan, out: cue('c11').start });
    const hNP = np._hi(1, 16, 8, T('c10', 'zero'), { col: C.green });
    const cmp = k.bars(g4, 0, 300, { pop: T('c10', 'lieu') - .2, t0: T('c10', 'lieu'), max: 48.466, h: 300, w: 560, lsize: 48, out: cue('c11').start,
      vals: [{ v: 48.466, label: 'avant', col: C.rose, top: '48 ms' }, { v: .159, label: 'après', col: C.green, top: '0,16' }] });
    const bal = k.balance(g4, 120, -80, { pop: cue('c11').start, t: T('c11', 'ecriture'), tilt: -14 });
    const pen = G(bal._beam, -340, 60); K.tx(pen, 0, 0, 'écritures', { size: 56, fill: C.rose, weight: 800 }); const look = G(bal._beam, 340, 60); K.tx(look, 0, 0, 'lectures', { size: 56, fill: C.green, weight: 800 });
    const hero4 = k.hero(g4, -980, { s: 1.35 }); hero4.pop(s4 - .3).walk(s4 - .2, .9, -880).pose(T('c9', 'index'), 1.2, 'type').pose(T('c9', 'droit'), 1.0, 'point', { x: 360, y: 0 }).expr(T('c10', 'lieu'), 'happy').pose(T('c10', 'lieu') + .3, 1.0, 'cheer')
      .pose(T('c11', 'prix'), 1.0, 'shrug').expr(T('c11', 'prix'), 'neutral');
    F(s4 - 1.4, 1.5, [ci, drawer, shelf], .9, { focus: false }); K.focus(s4, ci);
    F(T('c9', 'index') - .3, .7, [ci], .8, { focus: false }); K.focus(T('c9', 'index'), ci);
    F(T('c9', 'catalogue') - .3, .9, [drawer, shelf], .86, { focus: false }); K.focus(T('c9', 'catalogue'), drawer); K.focus(T('c9', 'droit'), shelf);
    F(cue('c10').start - .2, .8, [np], .82, { focus: false }); K.focus(cue('c10').start, np);
    F(T('c10', 'zero') - .3, .6, [hNP], .7, { focus: false, zmax: 2.6 }); F(T('c10', 'lieu') - .4, .8, [np, cmp], .9, { focus: false }); K.focus(T('c10', 'lieu'), cmp);
    F(cue('c11').start - .1, .9, [bal, hero4], .8, { focus: false }); F(T('c11', 'mettre') - .2, .7, [bal], .62, { focus: false }); K.focus(T('c11', 'ecriture'), bal);
    pu(drawer, T('c9', 'trie')); pu(shelf, T('c9', 'cartons')); pu(np, T('c10', 'parcours')); pu(bal, T('c11', 'colonne'));
    K.hot({ x: Z.index[0] - 40, y: Z.index[1] - 420, at: s4, until: cue('c11').end, title: 'Plan après index', html: '<pre>Limit (…) (actual time=0.134..0.135 rows=8.00 loops=1)\n  -&gt;  Sort (…)\n        -&gt;  Bitmap Heap Scan on orders (…)\n              Recheck Cond: (customer_id = 4217)\n              -&gt;  Bitmap Index Scan on orders_customer_created_idx\n                    Index Cond: (customer_id = 4217)\nExecution Time: 0.159 ms</pre><p>Coût d\'un index : « the system has to keep it synchronized with the table. This adds overhead to data manipulation operations » (docs, Indexes).</p>' });
    /* ================= s5 : estimated 1 row ================= */
    const g5 = k.room('rapport', '#2B2D6E', { seed: 0 }); const s5 = k.sc('s5');
    const boss = K.char(g5, { name: 'planner', color: C.violet, shape: 'robot', x: -560, y: FLOOR, s: 1.4 }); boss.pop(s5 - .3);
    const clip = G(g5, -300, -60, { pop: T('c12', 'planificateur') - .2 }); S('rect', { x: -110, y: -140, width: 220, height: 280, rx: 16, fill: C.paper }, clip); S('rect', { x: -50, y: -156, width: 100, height: 34, rx: 10, fill: '#8B5E34' }, clip);
    K.tx(clip, 0, -40, 'rows=1', { size: 50, fill: C.ink, weight: 800, mono: true });
    const p2 = k.panel(g5, 330, -330, ['Nested Loop  (cost=1000.42..30784.38 rows=1 width=9)', '(actual time=61.397..920.280 rows=300000.00 loops=1)', 'Execution Time: 1077.072 ms'], { w: 1240, size: 38, pop: cue('c12').start - .2, col: C.rose, out: cue('c14').start });
    const hEst = p2._hi(0, 'Nested Loop  (cost=1000.42..30784.38 '.length, 6, T('c12', 'prevu'), { col: C.amber, box: true });
    const hAct2 = p2._hi(1, '(actual time=61.397..920.280 '.length, 16, R('c13'), { col: C.green, box: true });
    const hTime = p2._hi(2, 16, 11, T('c12', 'seconde'), { col: C.rose });
    const q5 = k.suspense(g5, 330, -80, T('c13', 'devinez'), R('c13'));
    const big = k.counter(g5, 330, -60, { pop: R('c13'), t0: R('c13'), dur: 1.0, from: 1, to: 300000, size: 110, fill: C.green, fmt: v => Math.round(v).toLocaleString('fr-FR') });
    const cart = G(g5, 100, 170, { pop: T('c13', 'boucle'), fn: (s, t) => { s.x += AMBIENT || true ? 260 * Math.abs(Math.sin((t - T('c13', 'boucle')) * 6)) : 0; } });
    S('rect', { x: -50, y: -30, width: 100, height: 60, rx: 10, fill: C.orange }, cart); S('circle', { cx: -30, cy: 34, r: 12, fill: C.ink }, cart); S('circle', { cx: 30, cy: 34, r: 12, fill: C.ink }, cart);
    for (let i = 0; i < 6; i++) K.mark(T('c13', 'boucle') + i * .5);
    const lp2 = k.label(g5, 230, 300 - 60, 'loops=300000', { pop: T('c13', 'allers'), size: 54, col: C.rose, mono: true }); big._a.o.out = T('c14', 'pourquoi');
    cart._a.o.out = T('c14', 'pourquoi'); lp2._a.o.out = T('c14', 'pourquoi');
    const truck = G(g5, 1100, 120, { pop: T('c14', 'commandes') - .4, moves: [[T('c14', 'commandes') - .4, 1.2, { x: 420 }, E.oc]] });
    S('rect', { x: -170, y: -110, width: 260, height: 160, rx: 14, fill: '#B7854F' }, truck); S('rect', { x: 90, y: -60, width: 110, height: 110, rx: 14, fill: C.cyan }, truck);
    for (const x of [-110, 0, 140]) S('circle', { cx: x, cy: 62, r: 26, fill: C.ink }, truck);
    K.tx(truck, -40, -30, '+300 000', { size: 46, fill: C.ink, weight: 800 });
    const stale = S('rect', { x: -300 - 126, y: -60 - 156, width: 252, height: 316, rx: 18, fill: 'none', stroke: C.rose, 'stroke-width': 8, 'stroke-dasharray': '18 12' }, g5); K.A(stale, { fin: [T('c14', 'statistiques'), .3], out: cue('c15').start });
    boss.pose(T('c12', 'prevu'), 1.0, 'hold').expr(R('c13'), 'surprise').pose(T('c14', 'statistiques'), 1.0, 'shrug').expr(T('c14', 'statistiques'), 'worried');
    const hero5 = k.hero(g5, -980, { s: 1.35 }); hero5.pop(s5 - .3).expr(T('c12', 'seconde'), 'worried').pose(T('c13', 'devinez'), 1.0, 'loupe').pose(T('c14', 'pourquoi'), 1.0, 'shrug');
    F(s5 - 1.4, 1.5, [g5._room], .95, { focus: false }); K.focus(s5, p2);
    F(cue('c12').start - .2, .8, [p2], .86, { focus: false }); K.focus(T('c12', 'seconde'), hTime);
    F(T('c12', 'planificateur') - .3, .9, [boss, clip], .62, { focus: false }); K.focus(T('c12', 'prevu'), clip);
    F(T('c13', 'devinez') - .3, .8, [p2, q5], .86, { focus: false }); K.focus(T('c13', 'devinez'), q5); K.focus(R('c13'), big);
    F(T('c13', 'boucle') - .3, .9, [big, cart, lp2], .82, { focus: false }); K.focus(T('c13', 'boucle'), cart);
    F(cue('c14').start - .1, .9, [boss, clip, truck], .92, { focus: false }); K.focus(T('c14', 'commandes'), truck); K.focus(T('c14', 'statistiques'), clip);
    pu(clip, T('c12', 'ligne')); pu(p2, T('c13', 'faite')); pu(truck, T('c14', 'chargees'));
    K.hot({ x: Z.rapport[0] + 330, y: Z.rapport[1] - 470, at: s5, until: cue('c14').end, title: 'Plan avec statistiques périmées', html: '<pre>GroupAggregate (…) (actual time=1032.917..1075.988 rows=5.00 loops=1)\n  -&gt;  Sort (… rows=1 …) (actual … rows=300000.00 loops=1)\n        Sort Method: external merge  Disk: 6488kB\n        -&gt;  Nested Loop (… rows=1 …) (actual … rows=300000.00 loops=1)\n              -&gt;  Gather … -&gt; Parallel Seq Scan on orders o\n                    Filter: (status = \'disputed\'::text)\n              -&gt;  Index Scan using customers_pkey on customers c\n                    (actual time=0.002..0.002 rows=1.00 loops=300000)\nExecution Time: 1077.072 ms</pre><p>Le tri, prévu pour 1 ligne, déborde sur disque (6 488 kB). 300 000 lignes insérées sans ANALYZE (autovacuum coupé pour figer la situation).</p>' });
    /* ================= s6 : ANALYZE ================= */
    const g6 = k.room('stats', '#1F3A6E', { seed: 5 }); const s6 = k.sc('s6');
    const an = k.panel(g6, -100, -430, ['ANALYZE orders;'], { w: 760, size: 60, pop: s6 - .2, col: C.green, typeAt: T('c15', 'analyze') });
    const boss6 = K.char(g6, { name: 'planner6', color: C.violet, shape: 'robot', x: -620, y: FLOOR, s: 1.3 }); boss6.pop(s6 - .3).pose(T('c15', 'rafraichit'), 1.0, 'cheer').expr(T('c15', 'rafraichit'), 'happy');
    const clip6 = G(g6, -380, -60, { pop: s6 - .2 }); S('rect', { x: -110, y: -140, width: 220, height: 280, rx: 16, fill: C.paper }, clip6); S('rect', { x: -50, y: -156, width: 100, height: 34, rx: 10, fill: '#8B5E34' }, clip6);
    const r1 = G(clip6, 0, -40, { out: T('c15', 'rafraichit') }); K.tx(r1, 0, 0, 'rows=1', { size: 50, fill: C.ink, weight: 800, mono: true });
    const r2 = G(clip6, 0, -40, { pop: T('c15', 'rafraichit') }); K.tx(r2, 0, 0, 'rows=127586', { size: 30, fill: C.ink, weight: 800, mono: true });
    const p3 = k.panel(g6, 360, -230, ['Parallel Hash Join  (… rows=127586 …)', '(actual … rows=100000.00 loops=3)', 'Execution Time: 176.475 ms'], { w: 1000, size: 40, pop: T('c15', 'plan') - .2, col: C.cyan, out: cue('c16').start + .2 });
    const hJ = p3._hi(0, 0, 18, T('c15', 'jointure'), { col: C.cyan }); const hT = p3._hi(2, 16, 10, T('c15', 'cent'), { col: C.green });
    const cmp6 = k.bars(g6, 360, 170, { pop: T('c15', 'cent') - .3, t0: T('c15', 'cent'), max: 1077, h: 200, w: 520, lsize: 46, out: cue('c16').start + .2,
      vals: [{ v: 1077, label: 'avant', col: C.rose, top: '1 077' }, { v: 176, label: 'après', col: C.green, top: '176' }] });
    const av = K.char(g6, { name: 'autovac', color: C.teal, shape: 'robot', x: 300, y: FLOOR, s: 1.3 }); av.pop(T('c16', 'autovacuum')).pose(T('c16', 'charge'), 1.0, 'nod');
    const thr = k.label(g6, 360, -300, '50 + 10 % des lignes', { pop: T('c16', 'dix'), size: 56, col: C.teal, out: T('c16', 'apres', 1) + 1.5 });
    const bulk = k.label(g6, 360, -300, 'gros chargement → ANALYZE', { pop: T('c16', 'apres', 1) + 1.5, size: 54, col: C.amber });
    const hero6 = k.hero(g6, 980, { s: 1.35, dir: -1 }); hero6.pop(s6 - .3).walk(s6 - .2, .9, 860).pose(T('c15', 'analyze'), 1.2, 'type').pose(T('c16', 'vous'), 1.0, 'point', { x: 360, y: -300 });
    F(s6 - 1.4, 1.5, [g6._room], .95, { focus: false }); F(T('c15', 'analyze') - .2, .7, [an], .8, { focus: false }); K.focus(s6, an);
    F(T('c15', 'rafraichit') - .3, .7, [clip6, boss6], .62, { focus: false }); F(T('c15', 'rafraichit') + .5, .6, [clip6], .5, { focus: false, zmax: 2.4 }); K.focus(T('c15', 'rafraichit'), clip6);
    F(T('c15', 'plan') - .3, .8, [p3, cmp6], .86, { focus: false }); K.focus(T('c15', 'jointure'), hJ); K.focus(T('c15', 'cent'), cmp6);
    F(cue('c16').start - .1, .9, [av, thr, hero6], .84, { focus: false }); K.focus(T('c16', 'dix'), thr);
    F(T('c16', 'apres', 1) + 1.2, .8, [bulk, av, hero6], .8, { focus: false }); K.focus(T('c16', 'vous'), bulk);
    pu(an, T('c15', 'statistiques')); pu(av, T('c16', 'modifiees')); pu(thr, T('c16', 'environ'));
    K.hot({ x: Z.stats[0] + 360, y: Z.stats[1] - 230, at: s6, until: cue('c16').end, title: 'Après ANALYZE', html: '<pre>Finalize GroupAggregate (…) (actual … rows=5.00 loops=1)\n  -&gt;  Gather Merge … -&gt; Sort … -&gt; Partial HashAggregate\n        -&gt;  Parallel Hash Join (… rows=127586 …)\n              (actual time=85.071..149.852 rows=100000.00 loops=3)\nExecution Time: 176.475 ms</pre><p>Seuil d\'autovacuum (analyse) : <code>autovacuum_analyze_threshold</code> (50) + <code>autovacuum_analyze_scale_factor</code> (0,1) × lignes de la table. Docs : « Whenever you have significantly altered the distribution of data within a table, running ANALYZE is strongly recommended ».</p>' });
    /* ================= s7 : reflexes ================= */
    const g7 = k.room('fin', '#1F3B80', { seed: 1 }); const s7 = k.sc('s7');
    const foe7 = k.foe(g7, -1100, { s: 1.35, dir: 1, mask: false }); foe7.pop(s7 - .3).walk(s7 - .2, .9, -820).pose(T('c17', 'decrire'), 1.0, 'cheer').expr(T('c17', 'faux'), 'surprise');
    const up7 = k.panel(g7, 0, -380, ['BEGIN;', 'EXPLAIN ANALYZE UPDATE orders SET status = \'refunded\' …;', 'ROLLBACK;'], { w: 1500, size: 44, pop: s7 - .2, col: C.amber, out: cue('c18').start });
    up7._dim(s7 - .2, [1], T('c17', 'transaction'));
    const box7 = G(g7, 0, 60, { out: cue('c18').start }); const bx = []; for (let i = 0; i < 5; i++) bx.push(carton(box7, -360 + i * 180, 0, 1.6, '#B7854F'));
    K.fx(t => bx[2].firstChild.setAttribute('fill', t > T('c17', 'execute') && t < T('c17', 'annulez') + .4 ? C.rose : '#B7854F')); K.mark(T('c17', 'execute')); K.ev(T('c17', 'faux'), 'myth');
    const recap = [['EXPLAIN (ANALYZE)', 'reflexes', C.green], ['Rows Removed by Filter', 'ecartees', C.rose], ['rows prévu ≠ réel', 'prevu', C.violet]].map(([a, w, col], i) => {
      const r = G(g7, -560 + i * 560, -120, { pop: T('c18', w) }); S('rect', { x: -270, y: -150, width: 540, height: 300, rx: 30, fill: C.p1, stroke: col, 'stroke-width': 8 }, r);
      K.tx(r, 0, -60, a, { size: a.length > 18 ? 40 : 46, fill: col, weight: 800, mono: true });
      K.tx(r, 0, 50, ['sur la requête lente', '→ index', '→ ANALYZE'][i], { size: 52, fill: C.text, weight: 700 }); return r; });
    const buf = k.panel(g7, 0, 230, ['Buffers: shared hit=14104 read=1038'], { w: 1100, size: 50, pop: T('c19', 'buffers'), col: C.cyan });
    const hero7 = k.hero(g7, 980, { s: 1.35, dir: -1 }); hero7.pop(s7 - .3).walk(s7 - .2, .9, 820).pose(T('c17', 'faux'), .9, 'shrug').pose(T('c17', 'encadrez'), 1.0, 'point', { x: 0, y: -380 })
      .pose(T('c18', 'requete'), .8, 'point', { x: -560, y: -120 }).pose(T('c18', 'ecartees'), .8, 'point', { x: 0, y: -120 }).pose(T('c18', 'prevu'), .8, 'point', { x: 540, y: -120 }).pose(T('c19', 'savez'), 1.2, 'cheer').expr(T('c19', 'savez'), 'happy');
    foe7.walk(cue('c18').start, 1.0, -1250).out(cue('c18').start + .8);
    F(s7 - 1.4, 1.5, [g7._room], .95, { focus: false }); F(T('c17', 'croit') - .2, .8, [up7], .8, { focus: false }); K.focus(s7, up7);
    F(T('c17', 'execute') - .3, .8, [box7, up7], .8, { focus: false }); K.focus(T('c17', 'execute'), box7);
    F(T('c17', 'encadrez') - .3, .8, [up7], .82, { focus: false }); F(T('c17', 'execute') + .4, .6, [bx[2]], .4, { focus: false, zmax: 2.4 }); K.focus(T('c17', 'encadrez'), up7);
    F(cue('c18').start - .1, .9, recap, .92, { focus: false }); K.focus(T('c18', 'reflexes'), recap[0]); K.focus(T('c18', 'ecartees'), recap[1]); K.focus(T('c18', 'prevu'), recap[2]);
    F(T('c19', 'buffers') - .4, .9, [...recap, buf], .94, { focus: false }); K.focus(T('c19', 'buffers'), buf);
    pu(up7, T('c17', 'decrire')); pu(recap[1], T('c18', 'millions')); pu(recap[2], T('c18', 'lancez')); pu(buf, T('c19', 'disque'));
    K.hot({ x: Z.fin[0], y: Z.fin[1] - 380, at: s7, until: cue('c19').end + 1, title: 'Sans effet de bord', html: '<pre>BEGIN;\nEXPLAIN ANALYZE UPDATE orders SET status = \'refunded\' WHERE customer_id = 4217;\nROLLBACK;</pre><p>Docs : « because EXPLAIN ANALYZE actually runs the query, any side-effects will happen as usual ». Depuis PostgreSQL 18, ANALYZE active BUFFERS par défaut (<code>BUFFERS OFF</code> pour le retirer) : <code>hit</code> = pages trouvées en cache, <code>read</code> = lues hors du cache partagé.</p>' });
    /* ---- extra beats (beats.mjs) ---- */
    pu(ex, T('c2', 'base')); hero.pose(T('c2', 'requete'), .8, 'nod');
    pu(est, T('c4', 'unites')); pu(ln, T('c4', 'millisecondes')); hero2.pose(T('c4', 'vrai'), .8, 'nod');
    pu(nodes[3], T('c6', 'interieur')); pu(nodes[0], T('c6', 'exterieur')); pu(nodes[3], T('c6', 'noeud'));
    pu(lp, T('c7', 'chiffres')); pu(rr, T('c8', 'six')); pu(rr, T('c8', 'devinez') - .3);
    pu(np, T('c10', 'execution')); hero4.pose(T('c10', 'nouveau'), .8, 'nod');
    pu(bal, T('c11', 'mettre')); hero4.pose(T('c11', 'jour'), .8, 'nod'); pu(bal, T('c11', 'cree'));
    pu(p2, T('c13', 'combien')); pu(big, T('c13', 'choisi'));
    pu(av, T('c16', 'charge')); pu(av, T('c16', 'gros') - .2); hero6.pose(T('c16', 'lancez'), .8, 'nod');
    pu(up7, T('c17', 'mise')); pu(up7, T('c17', 'puis') + .1);
    pu(ms, T('c4', 'time')); pu(p2, T('c12', 'rapport')); pu(q5, T('c13', 'trouve')); pu(up7, T('c17', 'croit')); pu(up7, T('c17', 'analyze'));
    pu(recap[0], T('c18', 'reflexes')); pu(recap[0], T('c18', 'lente'));
    pu(buf, T('c19', 'affiche')); hero7.pose(T('c19', 'depuis'), .8, 'nod'); pu(buf, T('c19', 'suivante'));
  },
};
