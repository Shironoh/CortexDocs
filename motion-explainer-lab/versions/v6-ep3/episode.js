/*META{"title":"Admin Activity, épisode 3","h1":"Épisode 3 · Effacer, exposer, exploiter","eyebrow":"Série Admin Activity · <a href='ep1.html' style='color:inherit'>Ép. 1</a> · <a href='ep2.html' style='color:inherit'>Ép. 2</a> · <b>Ép. 3</b>","footer":"<p class='footer'>v6, skill v6. Sources : documentation Google Cloud (Cloud Audit Logs, Store log entries), règles Elastic (GCP Logging Sink Deletion, GCP Logging Sink Modification, GCP Firewall Rule Creation, GCP Storage Bucket Permissions Modification), CIS Google Cloud 2.5 (auditConfigDeltas). Compte et IP fictifs.</p>"}META*/
/* ---------- FICHE (skill v6) ----------
Audience : métier = détection/réponse, praticien ; outil = Google Cloud, débutant (épisodes 1-2 vus).
Doit savoir faire après : reconnaître la neutralisation de la journalisation, l'exposition et l'abus de ressources, et la condition d'alerte de chacun.
Inventaire de valeur :
 1 google.logging.v2.ConfigServiceV2.DeleteSink / UpdateSink (T1562.008, T1537) ; les entrées restent dans le projet (_Required)
 2 SetIamPolicy + serviceData.policyDelta.auditConfigDeltas (Data Access coupé ; filtre CIS 2.5)
 3 v1.compute.firewalls.insert + sourceRanges 0.0.0.0/0
 4 storage.setIamPermissions + membre allUsers / allAuthenticatedUsers
 5 v1.compute.instances.insert : banal seul, alerte sur volume / région / GPU
Idées reçues : « l'attaquant efface les journaux » ; « une création de VM est suspecte en soi ». Devinez : ce qu'il lance en rafale.
Test du praticien : « je sais écrire 5 règles d'effacement/exposition et je sais pourquoi la coupure d'un sink ne détruit pas les preuves ».
------------------------------------ */
const EP = {
  bg: '#0B1A3A', lead: .6, tail: 2, spotDark: .25,
  zones: { bureau: [0, 0], z1: [2300, 0], z2: [4600, 0], z3: [6900, 0], z4: [9200, 0], z5: [11500, 0], fin: [13800, 0] },
  legend: [['#FFB703', 'journal activity (toujours écrit)'], ['#A78BFA', 'journal data_access (éteint par défaut)'], ['#EF476F', 'Attaquant'], ['#22D3EE', 'Défense / SIEM'], ['#06D6A0', 'Remédiation']],
  scenes: [{ id: 's1', title: 'Le SIEM se tait' }, { id: 's2', title: 'DeleteSink / UpdateSink' }, { id: 's3', title: 'auditConfigDeltas' }, { id: 's4', title: 'firewalls.insert' },
    { id: 's5', title: 'setIamPermissions' }, { id: 's6', title: 'instances.insert' }, { id: 's7', title: 'Dix règles' }],
  cues: [
    { id: 'c1', sc: 's1', sub: 'Épisode 3. 3 h 14 : votre SIEM ne reçoit plus rien du projet prod-paiements. Panne, ou attaque ?', say: 'Épisode trois. Trois heures quatorze : votre sim ne reçoit plus rien du projet prod paiements. Panne, ou attaque ?' },
    { id: 'c2', sc: 's1', sub: 'On croit que l\'attaquant efface les journaux. Impossible pour activity. Alors il coupe ce qui les copie, et il éteint ceux qui sont optionnels.', say: 'On croit que l\'attaquant efface les journaux. Impossible pour activity. Alors il coupe ce qui les copie, et il éteint ceux qui sont optionnels.' },
    { id: 'c3', sc: 's2', sub: 'Première coupure : le sink, le tuyau qui copie les journaux vers votre SIEM. Il le supprime, ou le redirige vers un projet à lui.', say: 'Première coupure : le sink, le tuyau qui copie les journaux vers votre sim. Il le supprime, ou le redirige vers un projet à lui.' },
    { id: 'c4', sc: 's2', sub: 'Méthodes : google.logging.v2.ConfigServiceV2, DeleteSink ou UpdateSink. Condition : un sink de sécurité visé. Les journaux, eux, restent dans le projet.', say: 'Méthodes : google logging v2, Config Service V2, Delete Sink, ou Update Sink. Condition : un sink de sécurité visé. Les journaux, eux, restent dans le projet.' },
    { id: 'c5', sc: 's3', sub: 'Deuxième coupure : il éteint Data Access, là où vous l\'aviez allumé. Les lectures redeviennent invisibles.', say: 'Deuxième coupure : il éteint Data Access, là où vous l\'aviez allumé. Les lectures redeviennent invisibles.' },
    { id: 'c6', sc: 's3', sub: 'Méthode : SetIamPolicy, encore. Mais cette fois, le champ à lire est auditConfigDeltas : c\'est la configuration des journaux qui change.', say: 'Méthode : Set I A M Policy, encore. Mais cette fois, le champ à lire est audit config deltas : c\'est la configuration des journaux qui change.' },
    { id: 'c7', sc: 's4', sub: 'Puis il expose. Il crée une règle de pare-feu qui ouvre un port d\'administration à tout Internet.', say: 'Puis il expose. Il crée une règle de pare-feu qui ouvre un port d\'administration à tout Internet.' },
    { id: 'c8', sc: 's4', sub: 'Méthode : v1.compute.firewalls.insert. Condition : sourceRanges vaut 0.0.0.0/0. Tout Internet.', say: 'Méthode : v1 compute firewalls insert. Condition : source ranges vaut zéro point zéro point zéro point zéro, slash zéro. Tout Internet.' },
    { id: 'c9', sc: 's5', sub: 'Il rend aussi un bucket public : n\'importe qui, sur Internet, peut alors lire les fichiers.', say: 'Il rend aussi un bucket public : n\'importe qui, sur Internet, peut alors lire les fichiers.' },
    { id: 'c10', sc: 's5', sub: 'Méthode : storage.setIamPermissions. Condition : un membre allUsers ou allAuthenticatedUsers. Une seule ligne, et vos données sont publiques.', say: 'Méthode : storage set I A M Permissions. Condition : un membre all Users, ou all Authenticated Users. Une seule ligne, et vos données sont publiques.' },
    { id: 'c11', sc: 's6', sub: 'Dernière étape, l\'argent. Devinez ce qu\'il lance en rafale, dans une région que vous n\'utilisez jamais ?|Des machines virtuelles, souvent pour miner de la cryptomonnaie.', say: 'Dernière étape, l\'argent. Devinez ce qu\'il lance en rafale, dans une région que vous n\'utilisez jamais ? | Des machines virtuelles, souvent pour miner de la cryptomonnaie.' },
    { id: 'c12', sc: 's6', sub: 'Méthode : v1.compute.instances.insert. Seule, elle est banale. Ce qui alerte : le volume, la région, et les processeurs graphiques.', say: 'Méthode : v1 compute instances insert. Seule, elle est banale. Ce qui alerte : le volume, la région, et les processeurs graphiques.' },
    { id: 'c13', sc: 's7', sub: 'Retour à 3 h 14 : le sink a été supprimé. Mais les journaux sont intacts dans le projet. On recrée le tuyau, et l\'enquête continue.', say: 'Retour à trois heures quatorze : le sink a été supprimé. Mais les journaux sont intacts dans le projet. On recrée le tuyau, et l\'enquête continue.' },
    { id: 'c14', sc: 's7', sub: 'Vos règles : DeleteSink et UpdateSink, auditConfigDeltas, firewalls.insert ouvert au monde, setIamPermissions public, et instances.insert hors normes.', say: 'Vos règles : Delete Sink et Update Sink, audit config deltas, firewalls insert ouvert au monde, set I A M Permissions public, et instances insert hors normes.' },
    { id: 'c15', sc: 's7', sub: 'Avec l\'épisode 2, cela fait dix règles. Et l\'épisode 1 donne la clé de toutes : lire une entrée, champ par champ.', say: 'Avec l\'épisode deux, cela fait dix règles. Et l\'épisode un donne la clé de toutes : lire une entrée, champ par champ.' },
  ],
  quiz: { c11: { q: 'Que lance-t-il en rafale dans une région inhabituelle ?', choices: ['Des buckets', 'Des machines virtuelles', 'Des comptes de service'], answer: 1, why: 'Des VM (v1.compute.instances.insert), souvent pour miner : l\'alerte vient du volume, de la région et des GPU, pas de la méthode seule.' } },
  poster: K => K.T('c1', 'panne'),
  build(K) {
    const kit = seriesKit(K); const { C, G, I, F, sc, FLOOR } = kit; const { S, E, Z } = K; const T = K.T, R = K.reveal;
    kit.backdrop(['bureau', 'z1', 'z2', 'z3', 'z4', 'z5', 'fin']);
    /* s1: SIEM flatline, then the "what he can / cannot touch" map */
    const H = kit.hookRoom('bureau', '#1F3B80', {});
    const clk = G(H.mon, 0, -110, { pop: .3 }); K.tx(clk, 0, 0, '03:14', { size: 60, mono: true, fill: C.rose, weight: 700 });
    const graph = S('path', { d: 'M -260 60 L -180 20 L -110 50 L -40 0 L 20 30 L 40 130 L 260 130', stroke: C.cyan, 'stroke-width': 10, fill: 'none', 'stroke-linejoin': 'round' }, H.mon); K.A(graph, { dash: [T('c1', 'recoit'), 1.6] });
    const flat = G(H.mon, 150, 80, { pop: T('c1', 'rien') }); S('rect', { x: -70, y: -24, width: 140, height: 48, rx: 24, fill: C.rose }, flat); K.tx(flat, 0, 2, '0', { size: 44, fill: C.ink, weight: 800, deco: true });
    H.an.pose(T('c1', 'recoit'), 1.0, 'point', { x: -110, y: -170 }).expr(T('c1', 'rien'), 'surprise').pose(T('c1', 'panne'), 1.4, 'shrug');
    const vil0 = kit.villain(H.g, 1100); vil0.pop(K.cue('c2').start - .2).walk(K.cue('c2').start, 1.2, 640).pose(T('c2', 'efface'), 1.4, 'point', { x: -500, y: -420 }).expr(T('c2', 'impossible'), 'angry').pose(T('c2', 'coupe'), 1.2, 'point', { x: 20, y: -420 });
    H.an.walk(K.cue('c2').start, 1.0, 330);
    const bookD = G(H.g, -500, -420, { pop: T('c2', 'journaux') }); ico('book', bookD, 0, 0, 1, C.amber).setAttribute('transform', 'scale(1.6)'); S('path', { d: 'M -150 80 L -150 -40 A 150 130 0 0 1 150 -40 L 150 80 Z', fill: '#BDEBFF', 'fill-opacity': .14, stroke: '#BDEBFF', 'stroke-width': 7 }, bookD);
    const nope = I('cross', H.g, -330, -500, .9, C.rose, { pop: T('c2', 'impossible') }); K.ev(T('c2', 'impossible'), 'myth');
    const pip = I('pipe', H.g, 20, -420, 1.4, C.cyan, { pop: T('c2', 'copie') }); const cam = I('cam', H.g, 380, -420, 1.4, C.violet, { pop: T('c2', 'eteint') }); vil0.pose(T('c2', 'optionnels'), 1.0, 'point', { x: 380, y: -420 }).walk(T('c2', 'optionnels') + 1.2, 1.4, 1300);
    F(0, 0, [H.g._room], .98, { focus: false }); K.focus(0, H.mon); F(T('c1', 'projet') - .2, .8, [flat], .4, { focus: false }); F(T('c1', 'quatorze') - .4, .9, [clk], .45); F(T('c1', 'recoit') - .4, 1.0, [H.mon], .72);
    F(K.cue('c2').start - .2, 1.0, [bookD, pip, cam, H.an, vil0], .92, { focus: false }); K.focus(T('c2', 'journaux'), bookD); K.focus(T('c2', 'copie'), pip); K.focus(T('c2', 'optionnels'), cam); F(T('c2', 'impossible') - .2, .7, [bookD, nope], .6, { focus: false }); F(T('c2', 'coupe') - .2, .8, [pip, cam, vil0], .8, { focus: false });
    /* s2..s6 */
    kit.eventRoom({ zone: 'z1', tint: '#24356F', scene: 's2', cueA: 'c3', cueB: 'c4', wAct: 'supprime', wMethod: 'google', wCond: 'condition', wRule: 'journaux', seed: 1,
      tactic: 'Effacement de traces', col: C.rose, log: 'activity', method: 'google.logging.v2.ConfigServiceV2.DeleteSink', cond: 'resourceName: …/sinks/vers-siem',
      hot: ['Les deux méthodes', '<pre>protoPayload.methodName:("google.logging.v2.ConfigServiceV2.DeleteSink"\n  OR "google.logging.v2.ConfigServiceV2.UpdateSink")</pre><p>MITRE T1562.008 (et T1537 pour une redirection). UpdateSink : vérifier la nouvelle destination. Les entrées restent dans le projet (bucket <code>_Required</code> pour activity).</p>'],
      stage: (g, k, t) => { const bk = I('book', g, -760, -120, 1.6, C.amber); const tower = G(g, -40, -60, { moves: [[T('c3', 'sim'), .4, { s: 1.12 }, E.ob]] }); S('rect', { x: -70, y: -160, width: 140, height: 320, rx: 20, fill: C.cyan }, tower);
        const p1 = G(g, -400, -120, { moves: [[T('c3', 'tuyau'), .4, { s: 1.12 }, E.ob], [T('c3', 'copie'), .4, { s: 1 }], [t.tA, .6, { y: 160, r: 25, a: .25 }]] }); S('path', { d: 'M -250 0 L 250 0', stroke: C.cyan, 'stroke-width': 26, 'stroke-linecap': 'round' }, p1);
        const evil = G(g, -400, -380, { pop: T('c3', 'redirige') }); S('rect', { x: -60, y: -110, width: 120, height: 220, rx: 18, fill: C.rose }, evil); I('cross', g, -400, -120, .9, C.rose, { pop: t.tA + .1 });
        K.ev(t.tA, 'impact'); return [bk, tower, p1, evil]; } });
    const R2 = kit.eventRoom({ zone: 'z2', tint: '#33307A', scene: 's3', cueA: 'c5', cueB: 'c6', wAct: 'eteint', wMethod: 'set', wCond: 'audit', wRule: 'configuration', seed: 2,
      tactic: 'Effacement de traces', col: C.rose, log: 'activity', method: 'SetIamPolicy', cond: 'policyDelta.auditConfigDeltas',
      hot: ['Filtre (CIS 2.5)', '<pre>protoPayload.methodName="SetIamPolicy"\nAND protoPayload.serviceData.policyDelta.auditConfigDeltas:*</pre><p>Alerte sur toute modification de la configuration d\'audit (seuil 0).</p>'],
      stage: (g, k, t) => { const cm = G(g, -420, -160); ico('cam', cm, 0, 0, 1, C.violet).setAttribute('transform', 'scale(2.4)');
        const lens = S('circle', { cx: 84, cy: 0, r: 26, fill: C.green }, cm); K.fx(tt => lens.setAttribute('fill', tt > t.tA + .2 ? '#2b2350' : C.green));
        const sw = G(g, -420, 120); S('rect', { x: -110, y: -50, width: 220, height: 100, rx: 50, fill: C.p2, stroke: C.text, 'stroke-width': 5 }, sw); const kn = S('circle', { cx: 55, cy: 0, r: 40, fill: C.green }, sw);
        K.fx(tt => { const p = E.ob(P(tt, t.tA, .5)); kn.setAttribute('cx', 55 - 110 * p); kn.setAttribute('fill', p > .5 ? '#94a3b8' : C.green); }); K.mark(t.tA);
        const dk = I('book', g, -100, -160, 1.4, C.violet, { pop: t.tA + .6, moves: [[T('c5', 'invisibles'), .6, { a: .2 }]] });
        return [cm, sw, dk]; } });
    R2.an.pose(T('c6', 'encore'), .8, 'nod');
    kit.eventRoom({ zone: 'z3', tint: '#1C4473', scene: 's4', cueA: 'c7', cueB: 'c8', wAct: 'ouvre', wMethod: 'v1', wCond: 'condition', wRule: 'internet', seed: 3,
      tactic: 'Exposition', col: C.orange, log: 'activity', method: 'v1.compute.firewalls.insert', cond: 'sourceRanges: 0.0.0.0/0',
      hot: ['Règle', '<pre>protoPayload.methodName:"compute.firewalls.insert"</pre><p>Le corps de la requête porte <code>sourceRanges</code> et les ports autorisés : alerter sur <code>0.0.0.0/0</code> vers 22, 3389 ou tous ports. Voir aussi <code>firewalls.patch</code> / <code>update</code>.</p>'],
      stage: (g, k, t) => { const wl = G(g, -420, -60); ico('wall', wl, 0, 0, 1, C.orange).setAttribute('transform', 'scale(2.4)');
        const hole = G(g, -420, -60, { pop: t.tA }); S('circle', { r: 70, fill: '#0B1A3A' }, hole);
        const gl = I('globe', g, -760, -120, 1.6, C.cyan, { pop: T('c7', 'internet') });
        const ars = [0, 1, 2].map(i => I('steps', g, -650, -60 + i * 60, .6, C.rose, { pop: T('c7', 'internet') + .3 + i * .15, moves: [[T('c7', 'internet') + .3 + i * .15, 1.0, { x: -300 }]] }));
        return [wl, hole, gl]; } });
    kit.eventRoom({ zone: 'z4', tint: '#25406E', scene: 's5', cueA: 'c9', cueB: 'c10', wAct: 'public', wMethod: 'storage', wCond: 'condition', wRule: 'seule', seed: 0,
      tactic: 'Exposition · exfiltration', col: C.orange, log: 'activity', method: 'storage.setIamPermissions', cond: 'bindingDeltas: member allUsers',
      hot: ['Règle', '<pre>protoPayload.methodName="storage.setIamPermissions"\nprotoPayload.serviceData.policyDelta.bindingDeltas.member:\n  ("allUsers" OR "allAuthenticatedUsers")</pre><p>Prévention : contrainte d\'organisation <code>storage.publicAccessPrevention</code>.</p>'],
      stage: (g, k, t) => { const v = G(g, -420, -100); S('circle', { r: 200, fill: C.p1, stroke: '#3a4f8f', 'stroke-width': 14 }, v); S('circle', { r: 155, fill: '#071028' }, v);
        for (let i = 0; i < 6; i++) ico('doc', v, 0, 0, 1, C.text).setAttribute('transform', `translate(${-80 + (i % 3) * 80} ${-45 + Math.floor(i / 3) * 90}) scale(.75)`);
        const gl = I('globe', g, -420, -360, 1.4, C.cyan, { pop: t.tA });
        const ppl = [0, 1, 2, 3].map(i => I('person', g, -760 + i * 130, 160, .8, C.text, { pop: T('c9', 'nimporte') + i * .15 }));
        for (let i = 0; i < 4; i++) I('doc', g, -420, -100, .7, C.text, { pop: T('c9', 'lire') + i * .2, moves: [[T('c9', 'lire') + i * .2, .9, { x: -760 + i * 130, y: 60 }]], out: T('c9', 'lire') + i * .2 + 1.0 });
        return [v, gl, ...ppl]; } });
    const R5 = kit.eventRoom({ zone: 'z5', tint: '#2B3478', scene: 's6', cueA: 'c11', cueB: 'c12', wAct: 'machines', wMethod: 'v1', wCond: 'alerte', wRule: 'graphiques', seed: 2,
      tactic: 'Impact · minage', col: C.orange, log: 'activity', method: 'v1.compute.instances.insert', cond: 'volume · région inhabituelle · GPU', condMono: false,
      hot: ['Corréler', '<p><code>v1.compute.instances.insert</code> (et <code>beta.</code>) : seule, banale. Compter par principal et par zone sur une fenêtre courte ; signaler les zones jamais utilisées et les types de machines avec accélérateurs. Coupler avec les quotas GPU.</p>'],
      stage: (g, k, t) => { const coin = G(g, -200, -320, { pop: T('c11', 'largent'), out: T('c11', 'devinez') }); S('circle', { r: 50, fill: C.amber }, coin); K.tx(coin, 0, 4, '€', { size: 64, fill: C.ink, weight: 800, deco: true });
        const pin = G(g, -760, -300, { pop: T('c11', 'region'), moves: [[T('c11', 'vous'), .4, { y: -340 }, E.ob], [T('c11', 'jamais'), .4, { s: 1.3 }, E.ob]] }); ico('pin', pin, 0, 0, 1, C.rose).setAttribute('transform', 'scale(1.3)'); K.tx(pin, 70, -10, '?', { size: 80, fill: C.rose, weight: 800, deco: true });
        const vms = []; for (let i = 0; i < 8; i++) vms.push(I('server', g, -640 + (i % 4) * 150, -60 + Math.floor(i / 4) * 140, .9, C.orange, { pop: t.tA + i * .18 }));
        const box = S('rect', { x: -760, y: -160, width: 640, height: 320, fill: 'none' }, g);
        return [box, ...vms, pin]; } });
    if (R5.vil) R5.vil.pose(T('c11', 'rafale'), 1.0, 'cheer');
    F(T('c11', 'region') - .3, .7, [R5.stage[R5.stage.length - 1]], .4, { focus: false });
    /* s7: back to 03:14 — sink recreated ; rules lit one at a time */
    const g7 = kit.zg('fin', '#1F3B80', 3); const s7 = sc('s7');
    const bk7 = I('book', g7, -720, -260, 1.8, C.amber, { pop: s7 }); const tw7 = G(g7, 680, -260, { pop: s7 + .2, moves: [[T('c13', 'sink'), .4, { s: 1.15 }, E.ob]] }); S('rect', { x: -80, y: -170, width: 160, height: 340, rx: 20, fill: C.cyan }, tw7);
    const np = G(g7, -20, -260, { fin: [T('c13', 'recree'), .3] }); S('path', { d: 'M -600 0 L 600 0', stroke: C.green, 'stroke-width': 30, 'stroke-linecap': 'round' }, np);
    const np2 = S('path', { d: 'M -600 -260 L 600 -260', stroke: C.green, 'stroke-width': 30, 'stroke-linecap': 'round', fill: 'none' }, g7);
    const gone = I('cross', g7, -20, -260, 1.2, C.rose, { pop: T('c13', 'supprime'), out: T('c13', 'recree') });
    const intact = I('check', g7, -720, -420, 1.1, C.green, { pop: T('c13', 'intacts') }); const ck7 = I('clock', g7, 680, -470, 1, C.text, { pop: T('c13', 'trois'), out: T('c14', 'vos') - .1 });
    const icons7 = [['pipe', C.cyan], ['cam', C.violet], ['wall', C.orange], ['globe', C.cyan], ['server', C.orange]];
    const tiles = icons7.map(([n, c], i) => { const d = G(g7, -720 + i * 360, -230, { pop: T('c14', 'vos') + i * .1 }); S('rect', { x: -130, y: -150, width: 260, height: 300, rx: 24, fill: C.p1, stroke: c, 'stroke-width': 7 }, d);
      ico(n, d, 0, 0, 1, c).setAttribute('transform', 'scale(1.4)'); return d; });
    [bk7, tw7, np, intact].forEach(e => { e._a.o.out = T('c14', 'vos') - .1; }); K.A(np2, { out: T('c14', 'vos') - .1, dash: [T('c13', 'recree'), 1.0] });
    const rules = ['DeleteSink · UpdateSink', 'policyDelta.auditConfigDeltas', 'v1.compute.firewalls.insert', 'storage.setIamPermissions', 'v1.compute.instances.insert'];
    const rw = ['delete', 'audit', 'firewalls', 'set', 'instances'];
    rules.forEach((r, i) => { const t0 = T('c14', rw[i]); const t1 = i < 4 ? T('c14', rw[i + 1]) : K.cue('c15').start + .4;
      const rg = G(g7, 0, 110, { pop: t0, out: t1 }); K.tx(rg, 0, 0, r, { size: kit.mono(r.length, 1500, 56, 40), mono: true, fill: icons7[i][1], weight: 700 });
      const hl = S('rect', { x: -720 + i * 360 - 140, y: -390, width: 280, height: 320, rx: 28, fill: 'none', stroke: C.text, 'stroke-width': 8 }, g7); K.A(hl, { fin: [t0, .2], out: t1 }); });
    const ten = G(g7, 0, 100, { pop: T('c15', 'dix'), moves: [[T('c15', 'lepisode', 1), .5, { y: 260 }]] }); const key15 = I('key', g7, 520, 260, 1.4, C.amber, { pop: T('c15', 'cle') }); K.tx(ten, 0, 0, '10 règles', { size: 90, fill: C.amber, weight: 800 });
    const tape = G(g7, 0, -230, { pop: T('c15', 'lire'), moves: [[T('c15', 'champ'), .6, { s: 1.1 }]] }); S('rect', { x: -520, y: -120, width: 1040, height: 240, rx: 26, fill: C.paper }, tape);
    K.tx(tape, -480, -50, 'methodName · principalEmail', { size: 44, mono: true, fill: C.ink, weight: 700, anchor: 'start' }); K.tx(tape, -480, 40, 'callerIp · serviceData', { size: 44, mono: true, fill: C.ink, weight: 700, anchor: 'start' });
    tiles.forEach(d => { d._a.o.out = T('c15', 'lire') - .2; });
    const an7 = kit.analyst(g7, -1050); an7.pop(s7 - .5).walk(s7 - .2, 1.2, -880).pose(T('c13', 'recree'), 1.2, 'point', { x: -20, y: -260 }).expr(T('c13', 'intacts'), 'happy')
      .pose(T('c13', 'continue'), 1.0, 'cheer').pose(T('c14', 'vos'), 1.0, 'nod').pose(T('c14', 'public'), .8, 'nod').pose(T('c14', 'normes'), .9, 'point', { x: 720, y: -230 }).expr(T('c15', 'dix'), 'happy').pose(T('c15', 'dix'), 1.4, 'cheer').pose(T('c15', 'champ', 1), 1.2, 'nod');
    F(s7 - 1.3, 1.5, [bk7, tw7, an7], .92, { focus: false }); K.focus(s7, bk7); K.focus(T('c13', 'supprime'), gone); K.focus(T('c13', 'intacts'), bk7); K.focus(T('c13', 'recree'), np);
    F(T('c14', 'vos') - .3, .9, tiles, .92, { focus: false }); F(T('c15', 'dix') - .3, .7, [ten], .5); F(T('c15', 'lire') - .3, .8, [tape], .72); F(T('c15', 'champ', 1) + .3, 2.0, [g7._room], .99, { focus: false });
    K.hot({ x: Z.fin[0], y: Z.fin[1] + 110, at: s7, until: 9999, title: 'Les 10 règles de la série', html: '<p><b>Persistance (ép. 2)</b> : SetIamPolicy owner/editor externe · CreateServiceAccount · CreateServiceAccountKey · setCommonInstanceMetadata/setMetadata ssh-keys · rôle serviceAccountTokenCreator (+ GenerateAccessToken si Data Access).</p><p><b>Effacement / exposition (ép. 3)</b> : DeleteSink/UpdateSink · auditConfigDeltas · firewalls.insert 0.0.0.0/0 · storage.setIamPermissions allUsers · instances.insert anormal.</p>' });
  },
};
