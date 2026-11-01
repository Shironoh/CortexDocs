/*META{"title":"Admin Activity, épisode 2","h1":"Épisode 2 · Les portes de persistance","eyebrow":"Série Admin Activity · <a href='ep1.html' style='color:inherit'>Ép. 1</a> · <b>Ép. 2</b> · <a href='ep3.html' style='color:inherit'>Ép. 3</a>","footer":"<p class='footer'>v6, skill v6. Sources : documentation Google Cloud (Cloud Audit Logs, journaux d'audit Service Account Credentials, audit SSH Compute Engine), règles Elastic (GCP Service Account Creation, GCP Service Account Key Creation), règles Datadog (GCE instance SSH key persistence). Compte Gmail et IP fictifs.</p>"}META*/
/* ---------- FICHE (skill v6) ----------
Audience : métier = détection/réponse, praticien ; outil = Google Cloud, débutant (épisode 1 vu).
Doit savoir faire après : reconnaître dans les journaux les 5 façons de rester dans un projet, et écrire la condition d'alerte de chacune.
Inventaire de valeur (tout à l'écran, tel quel) :
 1 SetIamPolicy + bindingDeltas ADD roles/owner|editor, membre hors domaine (activity)
 2 google.iam.admin.v1.CreateServiceAccount, créateur hors pipelines (activity)
 3 google.iam.admin.v1.CreateServiceAccountKey, hors rotation / IP inconnue ; par défaut une clé utilisateur n'expire pas (activity)
 4 v1.compute.projects.setCommonInstanceMetadata + projectMetadataDelta ssh-keys ; instance : v1.compute.instances.setMetadata (activity)
 5 GenerateAccessToken (iamcredentials.googleapis.com) : journal data_access, éteint par défaut ; trace visible : SetIamPolicy qui accorde roles/iam.serviceAccountTokenCreator
Idées reçues : « retirer Owner suffit » ; « l'usurpation se voit dans activity ». Devinez : journal de GenerateAccessToken ; nombre de portes.
Test du praticien : « demain je sais écrire 5 règles de persistance GCP et je sais laquelle est aveugle par défaut ».
------------------------------------ */
const EP = {
  bg: '#0B1A3A', lead: .6, tail: 2, spotDark: .25,
  zones: { bureau: [0, 0], z1: [2300, 0], z2: [4600, 0], z3: [6900, 0], z4: [9200, 0], z5: [11500, 0], fin: [13800, 0] },
  legend: [['#FFB703', 'journal activity (toujours écrit)'], ['#A78BFA', 'journal data_access (éteint par défaut)'], ['#EF476F', 'Attaquant'], ['#FB8500', 'Compte de service / clé'], ['#22D3EE', 'Défense']],
  scenes: [{ id: 's1', title: 'Combien de portes ?' }, { id: 's2', title: 'SetIamPolicy' }, { id: 's3', title: 'CreateServiceAccount' }, { id: 's4', title: 'CreateServiceAccountKey' },
    { id: 's5', title: 'setCommonInstanceMetadata' }, { id: 's6', title: 'GenerateAccessToken' }, { id: 's7', title: 'Fermer toutes les portes' }],
  cues: [
    { id: 'c1', sc: 's1', sub: 'Épisode 2. 3 h 07 : l\'attaquant est devenu propriétaire. Mais un attaquant prudent ne garde pas une seule porte. Il en ouvre plusieurs. Lesquelles ?', say: 'Épisode deux. Trois heures sept : l\'attaquant est devenu propriétaire. Mais un attaquant prudent ne garde pas une seule porte. Il en ouvre plusieurs. Lesquelles ?' },
    { id: 'c2', sc: 's1', sub: 'Pour chacune, une fiche : la tactique, le nom exact de la méthode, et la condition qui transforme un événement banal en alerte.', say: 'Pour chacune, une fiche : la tactique, le nom exact de la méthode, et la condition qui transforme un événement banal en alerte.' },
    { id: 'c3', sc: 's2', sub: 'Première porte, la plus directe : il se donne un rôle. Owner ou Editor, accordé à un compte extérieur à votre entreprise.', say: 'Première porte, la plus directe : il se donne un rôle. Owner ou Editor, accordé à un compte extérieur à votre entreprise.' },
    { id: 'c4', sc: 's2', sub: 'Méthode : SetIamPolicy. Condition : dans bindingDeltas, une action ADD, un rôle Owner ou Editor, et un membre hors de votre domaine.', say: 'Méthode : Set I A M Policy. Condition : dans binding deltas, une action ADD, un rôle Owner ou Editor, et un membre hors de votre domaine.' },
    { id: 'c5', sc: 's3', sub: 'Deuxième porte : il crée son propre robot. Un nouveau compte de service, plus discret qu\'un compte Gmail.', say: 'Deuxième porte : il crée son propre robot. Un nouveau compte de service, plus discret qu\'un compte Gmail.' },
    { id: 'c6', sc: 's3', sub: 'Méthode : google.iam.admin.v1.CreateServiceAccount. Condition : un créateur qui n\'est pas l\'un de vos pipelines habituels.', say: 'Méthode : google I A M admin v1, Create Service Account. Condition : un créateur qui n\'est pas l\'un de vos pipelines habituels.' },
    { id: 'c7', sc: 's4', sub: 'Troisième porte : il fabrique une clé pour ce robot. Par défaut, une clé créée ainsi n\'expire jamais.', say: 'Troisième porte : il fabrique une clé pour ce robot. Par défaut, une clé créée ainsi n\'expire jamais.' },
    { id: 'c8', sc: 's4', sub: 'Méthode : CreateServiceAccountKey. Condition : une clé créée hors rotation prévue, ou depuis une adresse inconnue. Réflexe : lister toutes les clés du robot.', say: 'Méthode : Create Service Account Key. Condition : une clé créée hors rotation prévue, ou depuis une adresse inconnue. Réflexe : lister toutes les clés du robot.' },
    { id: 'c9', sc: 's5', sub: 'Quatrième porte : une clé SSH, posée dans les métadonnées du projet. Elle ouvre les machines virtuelles qui en héritent.', say: 'Quatrième porte : une clé S S H, posée dans les métadonnées du projet. Elle ouvre les machines virtuelles qui en héritent.' },
    { id: 'c10', sc: 's5', sub: 'Méthode : v1.compute.projects.setCommonInstanceMetadata. Condition : projectMetadataDelta contient ssh-keys. Pour une seule machine : instances.setMetadata.', say: 'Méthode : v1 compute projects, set Common Instance Metadata. Condition : project metadata delta contient ssh keys. Pour une seule machine : instances set Metadata.' },
    { id: 'c11', sc: 's6', sub: 'Cinquième porte, la plus discrète : emprunter l\'identité d\'un robot existant, avec un jeton temporaire.', say: 'Cinquième porte, la plus discrète : emprunter l\'identité d\'un robot existant, avec un jeton temporaire.' },
    { id: 'c12', sc: 's6', sub: 'Méthode : GenerateAccessToken. Devinez : dans quel journal ?|Data Access. Éteint par défaut : sans réglage, cette usurpation est invisible.', say: 'Méthode : Generate Access Token. Devinez : dans quel journal ? | Data access. Éteint par défaut : sans réglage, cette usurpation est invisible.' },
    { id: 'c13', sc: 's6', sub: 'Ce qui reste dans activity : le SetIamPolicy qui a donné le rôle Service Account Token Creator. C\'est ce rôle-là qu\'il faut surveiller.', say: 'Ce qui reste dans activity : le Set I A M Policy qui a donné le rôle Service Account Token Creator. C\'est ce rôle-là qu\'il faut surveiller.' },
    { id: 'c14', sc: 's7', sub: 'On croit qu\'il suffit de retirer Owner. Faux : chaque porte se ferme séparément. Rôles, robots, clés, clés SSH, et droits d\'emprunt.', say: 'On croit qu\'il suffit de retirer Owner. Faux : chaque porte se ferme séparément. Rôles, robots, clés, clés S S H, et droits d\'emprunt.' },
    { id: 'c15', sc: 's7', sub: 'Vos règles de persistance : SetIamPolicy, CreateServiceAccount, CreateServiceAccountKey, setCommonInstanceMetadata, et le rôle Token Creator. Épisode 3 : effacer ses traces.', say: 'Vos règles de persistance : Set I A M Policy, Create Service Account, Create Service Account Key, set Common Instance Metadata, et le rôle Token Creator. Épisode trois : effacer ses traces.' },
  ],
  quiz: { c12: { q: 'Dans quel journal apparaît GenerateAccessToken (usurpation d\'un compte de service) ?', choices: ['activity (Admin Activity)', 'data_access (Data Access)', 'system_event'], answer: 1, why: 'La documentation Google classe GenerateAccessToken (iamcredentials.googleapis.com, permission iam.serviceAccounts.getAccessToken, ADMIN_READ) en Data Access : éteint par défaut.' } },
  poster: K => K.T('c1', 'plusieurs'),
  build(K) {
    const kit = seriesKit(K); const { C, G, I, F, sc, FLOOR } = kit; const { S, E, Z } = K; const T = K.T, R = K.reveal;
    kit.backdrop(['bureau', 'z1', 'z2', 'z3', 'z4', 'z5', 'fin']);
    /* s1: hook — the monitor shows the 03:07 owner, five doors appear with "?" ; then the card template */
    const H = kit.hookRoom('bureau', '#1F3B80', {});
    const own = G(H.mon, 0, -60, { pop: .3 }); ico('crown', own, 0, 0, 1, C.amber).setAttribute('transform', 'translate(-150 0)'); K.tx(own, 40, 6, '03:07', { size: 60, mono: true, fill: C.rose, weight: 700 });
    const bigc = I('crown', H.g, -110, -470, 2.2, C.amber, { pop: T('c1', 'devenu'), out: T('c1', 'mais') }); H.an.pose(T('c1', 'devenu'), 1.2, 'loupe').pose(T('c1', 'prudent'), 1.0, 'shrug');
    const one = I('door', H.g, 640, -330, 1.6, C.rose, { pop: T('c1', 'porte'), out: T('c1', 'plusieurs') }); K.focus(T('c1', 'porte'), one);
    F(T('c1', 'trois') - .2, 1.2, [H.mon], .7, { focus: false }); F(T('c1', 'prudent') - .3, 1.0, [H.mon, H.an], .9, { focus: false });
    const doors = [0, 1, 2, 3, 4].map(i => I('door', H.g, -480 + i * 190, -470, 1.3, C.rose, { pop: T('c1', 'plusieurs') + i * .25, out: T('c2', 'pour') }));
    const qd = G(H.g, 470, -470, { pop: T('c1', 'lesquelles'), out: T('c2', 'pour') }); K.tx(qd, 0, 0, '?', { size: 110, fill: C.rose, weight: 800, deco: true });
    H.an.expr(T('c1', 'prudent'), 'worried').pose(T('c1', 'plusieurs'), 1.4, 'point', { x: -100, y: -470 }).pose(T('c2', 'fiche'), 1.2, 'nod');
    const tpl = kit.logCard(H.g, -110, -170, { tactic: 'Tactique', method: 'methodName', cond: 'condition qui alerte', col: C.cyan, w: 860 }, T('c2', 'fiche'), T('c2', 'methode'), T('c2', 'condition'));
    F(0, 0, [H.g._room], .98, { focus: false }); K.focus(0, H.mon);
    F(T('c1', 'plusieurs') - .5, .9, [...doors, qd, H.mon], .8, { focus: false }); K.focus(T('c1', 'plusieurs'), doors[2]);
    F(T('c2', 'fiche') - .3, .8, [tpl], .72);
    const tb = S('rect', { x: -110 - 430, y: -170 - 200, width: 860, height: 96, rx: 30, fill: 'none', stroke: C.text, 'stroke-width': 8 }, H.g); K.A(tb, { fin: [T('c2', 'tactique'), .2], out: T('c2', 'methode') });
    const bl2 = G(H.g, 380, 80, { pop: T('c2', 'transforme'), fn: (s, t) => { s.r = 14 * Math.sin((t - T('c2', 'alerte')) * 14) * (t > T('c2', 'alerte') ? 1 - P(t, T('c2', 'alerte') + .3, 1.2) : 0); } }); ico('bell', bl2, 0, 0, 1, C.amber).setAttribute('transform', 'scale(1.2)'); K.mark(T('c2', 'alerte'));
    /* s2..s6: one room per persistence door */
    const R1 = kit.eventRoom({ zone: 'z1', tint: '#24356F', scene: 's2', cueA: 'c3', cueB: 'c4', wAct: 'donne', wMethod: 'set', wCond: 'condition', wRule: 'membre', seed: 1,
      tactic: 'Persistance · élévation', col: C.amber, log: 'activity', method: 'SetIamPolicy', cond: 'bindingDeltas: ADD roles/owner',
      hot: ['Requête complète', '<pre>logName:"cloudaudit.googleapis.com%2Factivity"\nprotoPayload.methodName="SetIamPolicy"\nprotoPayload.serviceData.policyDelta.bindingDeltas.action="ADD"\nprotoPayload.serviceData.policyDelta.bindingDeltas.role=("roles/owner" OR "roles/editor")</pre><p>Puis exclure votre domaine dans <code>bindingDeltas.member</code>. Même méthode aux niveaux dossier et organisation.</p>'],
      stage: (g, k, t) => { const ped = G(g, -520, 60); S('rect', { x: -80, y: -40, width: 160, height: 230, rx: 16, fill: C.p2 }, ped);
        const cr = I('crown', g, -520, -40, 1.3, C.amber, { moves: [[t.tA + .2, 1.0, { x: -230, y: -190 }]] });
        const ext = I('person', g, -230, -60, 2.2, C.rose, { pop: t.s0 + .6 });
        return [ped, cr, ext]; } });
    const R2 = kit.eventRoom({ zone: 'z2', tint: '#2B3478', scene: 's3', cueA: 'c5', cueB: 'c6', wAct: 'cree', wMethod: 'google', wCond: 'condition', wRule: 'pipelines', seed: 2,
      tactic: 'Persistance', col: C.amber, log: 'activity', method: 'google.iam.admin.v1.CreateServiceAccount', cond: 'créateur ≠ vos pipelines', condMono: false,
      hot: ['Règle', '<pre>protoPayload.methodName:"google.iam.admin.v1.CreateServiceAccount"</pre><p>Faux positifs : déploiements automatisés (Terraform…). Liste blanche par <code>principalEmail</code> du pipeline.</p>'],
      stage: (g, k, t) => { const rb = K.char(g, { name: 'robot', color: C.orange, shape: 'robot', x: -380, y: FLOOR, s: 1.7 }); rb.pop(t.tA).pose(t.tA + .6, 1.2, 'cheer');
        const sp = G(g, -380, -260, { pop: t.tA + .2 }); for (let i = 0; i < 6; i++) S('path', { d: `M 0 -20 L 0 -60`, stroke: C.amber, 'stroke-width': 8, 'stroke-linecap': 'round', transform: `rotate(${i * 60})` }, sp);
        return [rb, sp]; } });
    const R3 = kit.eventRoom({ zone: 'z3', tint: '#1C4473', scene: 's4', cueA: 'c7', cueB: 'c8', wAct: 'fabrique', wMethod: 'create', wCond: 'condition', wRule: 'reflexe', seed: 3,
      tactic: 'Persistance', col: C.amber, log: 'activity', method: 'google.iam.admin.v1.CreateServiceAccountKey', cond: 'callerIp inconnue · hors rotation', condMono: false,
      hot: ['Règle et réponse', '<pre>protoPayload.methodName:"google.iam.admin.v1.CreateServiceAccountKey"</pre><p>MITRE T1098.001. Réponse : lister et supprimer <b>toutes</b> les clés du compte (<code>gcloud iam service-accounts keys list --iam-account=…</code>). Expiration possible via la contrainte d\'organisation <code>iam.serviceAccountKeyExpiryHours</code>.</p>'],
      stage: (g, k, t) => { const rb = K.char(g, { name: 'robot', color: C.orange, shape: 'robot', x: -520, y: FLOOR, s: 1.6 }); rb.pop(t.s0 + .2).expr(t.tA, 'worried');
        const key = I('key', g, -520, -120, 1.6, C.orange, { pop: t.tA, moves: [[t.tA + .7, 1.0, { x: -200, y: -60 }]] });
        const inf = G(g, -200, -200, { pop: T('c7', 'jamais') }); S('path', { d: 'M -50 0 C -50 -40 0 -40 0 0 C 0 40 50 40 50 0 C 50 -40 0 -40 0 0 C 0 40 -50 40 -50 0 Z', fill: 'none', stroke: C.text, 'stroke-width': 10 }, inf);
        return [rb, key, inf]; } });
    const R4 = kit.eventRoom({ zone: 'z4', tint: '#25406E', scene: 's5', cueA: 'c9', cueB: 'c10', wAct: 'posee', wMethod: 'v1', wCond: 'condition', wRule: 'seule', seed: 0,
      tactic: 'Persistance', col: C.amber, log: 'activity', method: 'v1.compute.projects.setCommonInstanceMetadata', cond: 'projectMetadataDelta: ssh-keys',
      hot: ['Les deux niveaux', '<p>Projet : <code>v1.compute.projects.setCommonInstanceMetadata</code> (toutes les VM qui héritent des métadonnées du projet). Instance : <code>v1.compute.instances.setMetadata</code>. Regarder les clés <code>ssh-keys</code> / <code>sshKeys</code> dans le delta de métadonnées (doc Google « Auditing SSH »).</p>'],
      stage: (g, k, t) => { const roof = G(g, -400, -250); S('rect', { x: -330, y: -50, width: 660, height: 100, rx: 20, fill: C.p2, stroke: C.text, 'stroke-width': 5 }, roof);
        const vms = [0, 1, 2].map(i => { const v = G(g, -620 + i * 220, 60); ico('server', v, 0, 0, 1, C.cyan).setAttribute('transform', 'scale(1.5)');
          const lock = I('padlock', g, -620 + i * 220, -60, .7, C.rose, { pop: t.tA + .8 + i * .25 }); return v; });
        const key = I('key', g, -800, -250, 1.4, C.rose, { pop: t.s0 + .5, moves: [[t.tA - .2, .8, { x: -400, y: -250 }]] });
        return [roof, ...vms, key]; } });
    const R5 = kit.eventRoom({ zone: 'z5', tint: '#33307A', scene: 's6', cueA: 'c11', cueB: 'c12', wAct: 'emprunter', wMethod: 'generate', wCond: 'data', wRule: 'invisible', seed: 2, tOut: K.cue('c13').start + 1.2,
      tactic: 'Élévation · usurpation', col: C.violet, log: 'data_access', method: 'GenerateAccessToken', cond: 'serviceName: iamcredentials.googleapis.com',
      hot: ['Où le voir', '<p>Journal <code>data_access</code> (permission <code>iam.serviceAccounts.getAccessToken</code>, type ADMIN_READ) : à activer pour <b>IAM Service Account Credentials API</b>. Les appels faits ensuite avec le jeton portent l\'appelant d\'origine dans <code>authenticationInfo.serviceAccountDelegationInfo</code>.</p><p class="tbd">Un éditeur classe cet événement en Admin Activity : vérifiez dans votre projet.</p>'],
      stage: (g, k, t) => { const rb = K.char(g, { name: 'robot', color: C.orange, shape: 'robot', x: -560, y: FLOOR, s: 1.6 }); rb.pop(t.s0 + .2);
        const tk = I('ticket', g, -560, -140, 1.6, C.orange, { pop: t.tA, moves: [[t.tA + .6, 1.0, { x: -240, y: -120 }]] });
        const clk = I('clock', g, -240, -280, 1, C.text, { pop: T('c11', 'temporaire') });
        return [rb, tk, clk]; } });
    // s6 extras: data_access camera OFF during the guess ; then the visible trace (TokenCreator role) in activity
    const camOff = G(R5.g, -300, -420, { pop: R('c12') - .1, out: K.cue('c13').start + .3 }); ico('cam', camOff, 0, 0, 1, C.violet).setAttribute('transform', 'scale(1.5)'); S('circle', { cx: 60, cy: 0, r: 16, fill: '#2b2350' }, camOff);
    const offT = G(R5.g, -300, -300, { pop: T('c12', 'eteint'), out: K.cue('c13').start + .3 }); S('rect', { x: -80, y: -40, width: 160, height: 80, rx: 40, fill: '#2b2350', stroke: C.violet, 'stroke-width': 5 }, offT); K.tx(offT, 0, 2, 'OFF', { size: 46, fill: C.violet, weight: 800 });
    const trace = kit.logCard(R5.g, 450, -150, { tactic: 'Ce qui reste visible', method: 'SetIamPolicy', cond: 'role: roles/iam.serviceAccountTokenCreator', col: C.amber, log: 'activity' },
      K.cue('c13').start + .4, T('c13', 'set'), T('c13', 'service'), K.cue('c14').start + .5);
    F(T('c13', 'set') - .5, .8, [trace._m], .6, { zmax: 2.4 }); F(T('c13', 'role') - .3, .8, [trace._c], .7, { zmax: 2.4 }); F(T('c13', 'faut') - .2, .8, [trace, R5.an], .9, { focus: false });
    F(R('c12') - .2, .6, [R5.card, camOff], .85, { focus: false }); K.focus(R('c12'), camOff);
    R5.an.pose(T('c12', 'devinez'), 1.2, 'shrug'); const qj = G(R5.g, -300, -360, { pop: T('c12', 'journal'), out: R('c12') }); K.tx(qj, 0, 0, '?', { size: 110, fill: C.violet, weight: 800, deco: true });
    R5.an.pose(T('c13', 'policy'), .8, 'point', { x: 200, y: -170 }).pose(T('c13', 'role'), 1.0, 'point', { x: 200, y: -60 }).pose(T('c13', 'surveiller'), .8, 'nod'); const bl6 = I('bell', R5.g, 830, 120, 1.2, C.amber, { pop: T('c13', 'faut') }); K.ev(T('c13', 'faut'), 'impact');
    const rp = S('rect', { x: 450 - 520, y: -150 + 50, width: 1040, height: 92, rx: 18, fill: 'none', stroke: C.amber, 'stroke-width': 8 }, R5.g); K.A(rp, { fin: [T('c13', 'creator'), .2], out: T('c13', 'faut') });
    /* s7: close every door ; rule names lit one at a time */
    const g7 = kit.zg('fin', '#1F3B80', 3); const s7 = sc('s7');
    const dIcons = ['crown', 'person', 'key', 'server', 'ticket'], dCol = [C.amber, C.orange, C.orange, C.cyan, C.violet];
    const doors7 = dIcons.map((n, i) => { const d = G(g7, -720 + i * 360, -220, { pop: s7 + .2 + i * .15 }); S('rect', { x: -130, y: -170, width: 260, height: 340, rx: 24, fill: C.p1, stroke: dCol[i], 'stroke-width': 7 }, d);
      ico(n, d, 0, 0, 1, dCol[i]).setAttribute('transform', 'scale(1.3)'); return d; });
    const wordsClose = ['roles', 'robots', 'cles', 'cles', 'droits'];
    doors7.forEach((d, i) => I('cross', g7, -720 + i * 360, -220, 1.4, C.green, { pop: T('c14', wordsClose[i], i === 3 ? 1 : 0) + .1 }));
    K.ev(T('c14', 'faux'), 'myth');
    const rules = ['SetIamPolicy', 'CreateServiceAccount', 'CreateServiceAccountKey', 'setCommonInstanceMetadata', 'roles/iam.serviceAccountTokenCreator'];
    const rw = [['set', 0], ['create', 0], ['create', 1], ['set', 1], ['token', 0]];
    rules.forEach((r, i) => { const t0 = T('c15', rw[i][0], rw[i][1]); const t1 = i < 4 ? T('c15', rw[i + 1][0], rw[i + 1][1]) : T('c15', 'episode');
      const rg = G(g7, 0, 110, { pop: t0, out: t1 }); K.tx(rg, 0, 0, r, { size: kit.mono(r.length, 1500, 56, 40), mono: true, fill: dCol[i], weight: 700 });
      const hl = S('rect', { x: -720 + i * 360 - 140, y: -400, width: 280, height: 360, rx: 28, fill: 'none', stroke: C.text, 'stroke-width': 8 }, g7); K.A(hl, { fin: [t0, .2], out: t1 }); });
    const an7 = kit.analyst(g7, -1050); an7.pop(s7 - .5).walk(s7 - .2, 1.2, -880).expr(T('c14', 'croit'), 'smug').expr(T('c14', 'faux'), 'surprise').pose(T('c14', 'faux'), .7, 'jump').expr(T('c15', 'vos'), 'happy').pose(T('c15', 'et'), 1.0, 'nod').pose(T('c15', 'episode'), 1.5, 'cheer');
    F(s7 - 1.3, 1.5, [g7._room], .96, { focus: false }); F(T('c14', 'chaque') - .3, .9, doors7, .9, { focus: false }); K.focus(T('c14', 'roles'), doors7[0]); K.focus(T('c14', 'droits'), doors7[4]);
    F(T('c15', 'vos') - .3, .9, [...doors7], .92, { focus: false }); F(T('c15', 'traces'), 2.2, [g7._room], .99, { focus: false });
    K.hot({ x: Z.fin[0], y: Z.fin[1] + 110, at: s7, until: 9999, title: 'Les 5 règles', html: '<ol><li><code>SetIamPolicy</code> + <code>bindingDeltas.action="ADD"</code> + rôle owner/editor + membre hors domaine</li><li><code>google.iam.admin.v1.CreateServiceAccount</code> hors pipelines</li><li><code>google.iam.admin.v1.CreateServiceAccountKey</code> hors rotation / IP inconnue</li><li><code>v1.compute.projects.setCommonInstanceMetadata</code> / <code>v1.compute.instances.setMetadata</code> avec <code>ssh-keys</code></li><li><code>SetIamPolicy</code> accordant <code>roles/iam.serviceAccountTokenCreator</code> (+ <code>GenerateAccessToken</code> si Data Access IAM Credentials activé)</li></ol>' });
  },
};
