/*META{"title":"Admin Activity, épisode 1","h1":"Épisode 1 · Lire une entrée, champ par champ","eyebrow":"Série Admin Activity · <b>Ép. 1</b> · <a href='ep2.html' style='color:inherit'>Ép. 2</a> · <a href='ep3.html' style='color:inherit'>Ép. 3</a>","footer":"<p class='footer'>v6, skill v6. Sources : documentation Google Cloud (Cloud Audit Logs overview, Store log entries, AuditLog reference, Enable Data Access audit logs). IP 203.0.113.47 = plage de documentation, compte Gmail fictif.</p>"}META*/
/* ---------- FICHE (skill v6) ----------
Audience : métier = détection/réponse, praticien ; outil = Google Cloud, débutant. Contexte outil limité à 1 cue (tout est un appel d'API).
Doit savoir faire après : savoir dans quel journal chercher, et lire une entrée d'audit réelle pour en tirer qui / quoi / où / d'où / quel changement.
Inventaire de valeur (à l'écran, tel quel) :
 journaux : cloudaudit.googleapis.com/activity (toujours, 400 j) · data_access (éteint par défaut sauf certains BigQuery) · system_event · policy
 champs : serviceName · methodName · resourceName · authenticationInfo.principalEmail · requestMetadata.callerIp (gce-internal-ip / private) ·
          requestMetadata.callerSuppliedUserAgent (non authentifié) · serviceData.policyDelta.bindingDeltas (action, role, member)
 piège : principalEmail masqué pour une lecture refusée, sauf compte de service
 filtre : logName:"cloudaudit.googleapis.com%2Factivity" protoPayload.methodName="SetIamPolicy"
Idées reçues : « il faut activer les journaux » ; « principalEmail est toujours rempli ». Devinez : journal d'un téléchargement ; signataire.
------------------------------------ */
const EP = {
  bg: '#0B1A3A', lead: .6, tail: 2, spotDark: .25,
  zones: { bureau: [0, 0], z1: [2300, 0], z2: [4600, 0], z3: [6900, 0], fin: [9200, 0] },
  legend: [['#FFB703', 'activity'], ['#A78BFA', 'data_access'], ['#2DD4BF', 'system_event'], ['#EF476F', 'policy / attaquant'], ['#22D3EE', 'champ pivot']],
  scenes: [{ id: 's1', title: '3 h 12, un témoin' }, { id: 's2', title: 'Quatre journaux' }, { id: 's3', title: 'Quoi, où' }, { id: 's4', title: 'Qui, d\'où' },
    { id: 's5', title: 'Ce qui a changé' }, { id: 's6', title: 'Premier filtre' }, { id: 's7', title: 'Six champs pivots' }],
  cues: [
    { id: 'c1', sc: 's1', sub: '3 h 12. Alerte : un compte Gmail inconnu est propriétaire du projet prod-paiements. Votre seul témoin : les journaux d\'audit de Google Cloud.', say: 'Trois heures douze. Alerte : un compte Gmail inconnu est propriétaire du projet prod paiements. Votre seul témoin : les journaux d\'audit de Google Cloud.' },
    { id: 'c2', sc: 's1', sub: 'Google Cloud en une phrase : chaque action, console, ligne de commande ou script, est un appel d\'API. Et chaque appel peut laisser une entrée de journal.', say: 'Google Cloud en une phrase : chaque action, console, ligne de commande ou script, est un appel d\'API. Et chaque appel peut laisser une entrée de journal.' },
    { id: 'c3', sc: 's2', sub: 'Ces entrées tombent dans quatre journaux. Le premier, activity : toutes les modifications de configuration. On croit qu\'il faut l\'activer : non, il est toujours écrit, et gardé 400 jours.', say: 'Ces entrées tombent dans quatre journaux. Le premier, activity : toutes les modifications de configuration. On croit qu\'il faut l\'activer : non, il est toujours écrit, et gardé quatre cents jours.' },
    { id: 'c4', sc: 's2', sub: 'Le deuxième, data_access : les lectures, de configuration ou de données. Éteint par défaut, sauf pour certains services BigQuery.', say: 'Le deuxième, data access : les lectures, de configuration ou de données. Éteint par défaut, sauf pour certains services BigQuery.' },
    { id: 'c5', sc: 's2', sub: 'Le troisième, system_event : les actions de Google lui-même. Le quatrième, policy : les accès refusés par une politique de sécurité.', say: 'Le troisième, system event : les actions de Google lui-même. Le quatrième, policy : les accès refusés par une politique de sécurité.' },
    { id: 'c6', sc: 's2', sub: 'Devinez : votre attaquant télécharge un fichier client. Dans quel journal ?|Data Access, s\'il était allumé. Sinon, nulle part.', say: 'Devinez : votre attaquant télécharge un fichier client. Dans quel journal ? | Data access, s\'il était allumé. Sinon, nulle part.' },
    { id: 'c7', sc: 's3', sub: 'Ouvrons l\'entrée de 3 h 07, dans activity. Première ligne : serviceName, Cloud Resource Manager. Le service qui a reçu l\'appel.', say: 'Ouvrons l\'entrée de trois heures sept, dans activity. Première ligne : service name, cloud resource manager. Le service qui a reçu l\'appel.' },
    { id: 'c8', sc: 's3', sub: 'Deuxième ligne : methodName, SetIamPolicy. L\'action exacte. C\'est le champ sur lequel s\'écrivent la plupart des règles.', say: 'Deuxième ligne : method name, Set I A M Policy. L\'action exacte. C\'est le champ sur lequel s\'écrivent la plupart des règles.' },
    { id: 'c9', sc: 's3', sub: 'Troisième ligne : resourceName, projects/prod-paiements. La cible de l\'action.', say: 'Troisième ligne : resource name, projects slash prod paiements. La cible de l\'action.' },
    { id: 'c10', sc: 's4', sub: 'Puis le qui : authenticationInfo, principalEmail. Devinez qui a signé ?|ci-deployer, un compte de service : l\'identité d\'un robot. Pas le compte Gmail.', say: 'Puis le qui : authentication info, principal email. Devinez qui a signé ? | ci déployeur, un compte de service : l\'identité d\'un robot. Pas le compte Gmail.' },
    { id: 'c11', sc: 's4', sub: 'Le d\'où : callerIp, une adresse externe. Attention : pour certains appels internes, vous lirez gce-internal-ip, ou private.', say: 'Le d\'où : caller I P, une adresse externe. Attention : pour certains appels internes, vous lirez gce internal ip, ou private.' },
    { id: 'c12', sc: 's4', sub: 'Et callerSuppliedUserAgent : le nom de l\'outil, déclaré par l\'appelant lui-même. Un indice, jamais une preuve.', say: 'Et caller supplied user agent : le nom de l\'outil, déclaré par l\'appelant lui-même. Un indice, jamais une preuve.' },
    { id: 'c13', sc: 's5', sub: 'Enfin, ce qui a changé : serviceData, policyDelta, bindingDeltas. Action ADD, rôle roles/owner, membre : le compte Gmail.', say: 'Enfin, ce qui a changé : service data, policy delta, binding deltas. Action ADD, rôle roles slash owner, membre : le compte Gmail.' },
    { id: 'c14', sc: 's5', sub: 'On croit que principalEmail est toujours rempli. Faux : pour une lecture refusée, il peut être masqué, sauf si l\'appelant est un compte de service.', say: 'On croit que principal email est toujours rempli. Faux : pour une lecture refusée, il peut être masqué, sauf si l\'appelant est un compte de service.' },
    { id: 'c15', sc: 's6', sub: 'Votre premier filtre, dans Logs Explorer : logName contient activity, et methodName égal SetIamPolicy. Toute la série part de là.', say: 'Votre premier filtre, dans Logs Explorer : log name contient activity, et method name égal Set I A M Policy. Toute la série part de là.' },
    { id: 'c16', sc: 's7', sub: 'Retenez : quatre journaux, un seul toujours allumé ; et six champs pivots. Épisode 2 : les portes de persistance.', say: 'Retenez : quatre journaux, un seul toujours allumé ; et six champs pivots. Épisode deux : les portes de persistance.' },
  ],
  quiz: {
    c6: { q: 'L\'attaquant télécharge un fichier d\'un bucket. Dans quel journal ?', choices: ['activity', 'data_access, s\'il est activé', 'system_event'], answer: 1, why: 'Lire des données relève de Data Access (DATA_READ), éteint par défaut pour Cloud Storage : sans réglage, la lecture n\'est journalisée nulle part.' },
    c10: { q: 'Qui a signé le SetIamPolicy de 3 h 07 ?', choices: ['Le compte Gmail', 'Le compte de service ci-deployer', 'Un administrateur'], answer: 1, why: 'principalEmail = ci-deployer@prod-paiements.iam.gserviceaccount.com : le robot dont la clé a servi.' },
  },
  poster: K => K.T('c1', 'proprietaire'),
  build(K) {
    const kit = seriesKit(K); const { C, G, I, F, sc, FLOOR } = kit; const { S, E, Z } = K; const T = K.T, R = K.reveal;
    kit.backdrop(['bureau', 'z1', 'z2', 'z3', 'fin']);
    const chain = (el, f) => { if (el._a) { const prev = el._a.o.fn; el._a.o.fn = prev ? (s, t) => { prev(s, t); f(s, t); } : f; } else K.A(el, { fn: f }); };
    const lit = (el, on, off, dim = .22) => chain(el, (s, t) => { s.a *= t < on ? 0 : (off != null && t >= off ? dim : 1); });
    /* s1 hook + "everything is an API call" */
    const H = kit.hookRoom('bureau', '#1F3B80', {});
    const al = G(H.mon, 0, -126, { pop: T('c1', 'alerte') }); S('rect', { x: -305, y: -42, width: 610, height: 84, rx: 14, fill: C.rose }, al); K.tx(al, 0, 2, 'ALERTE', { size: 56, fill: C.ink, weight: 800 });
    const ml = G(H.mon, 0, 0, { pop: T('c1', 'gmail'), out: K.cue('c2').start }); K.tx(ml, 0, 0, 'nuitblanche42@gmail.com', { size: 44, mono: true, fill: C.rose, weight: 700 });
    const cw = G(H.mon, 0, 100, { pop: T('c1', 'proprietaire'), out: K.cue('c2').start }); ico('crown', cw, 0, 0, 1, C.amber); K.ev(T('c1', 'alerte'), 'impact');
    const bk0 = I('book', H.g, 640, -360, 2, C.amber, { pop: T('c1', 'temoin'), moves: [[T('c1', 'journaux'), .4, { s: 2.4 }, E.ob]] });
    H.an.pose(0, T('c1', 'alerte') - .1, 'type').pose(T('c1', 'alerte'), .8, 'jump').expr(T('c1', 'alerte'), 'surprise').pose(T('c1', 'temoin'), 1.2, 'point', { x: 640, y: -360 }).pose(T('c2', 'phrase'), 1.0, 'nod');
    const tools = [['laptop', C.cyan, 'console'], ['terminal', C.green, 'ligne'], ['gear', C.violet, 'script']].map(([n, c, w], i) => I(n, H.g, -560 + i * 220, -470, 1.3, c, { pop: T('c2', w), moves: [[T('c2', 'appel') + i * .1, .7, { x: -110, y: -170, s: .3, a: 0 }]] }));
    const api = G(H.mon, 0, 0, { pop: T('c2', 'dapi'), moves: [[T('c2', 'chaque', 1), .4, { s: 1.25 }, E.ob]] }); S('rect', { x: -170, y: -44, width: 340, height: 88, rx: 18, fill: C.amber }, api); K.tx(api, 0, 2, 'API', { size: 60, fill: C.ink, weight: 800 });
    const sl0 = I('slip', H.g, -110, -170, 1.4, C.amber, { pop: T('c2', 'entree'), moves: [[T('c2', 'entree') + .1, 1.0, { x: 640, y: -360, s: .5 }]], out: T('c2', 'entree') + 1.1 });
    F(0, 0, [H.g._room], .98, { focus: false }); K.focus(0, H.mon); F(T('c1', 'alerte') - .3, 1.0, [H.mon], .72);
    F(T('c1', 'temoin') - .3, .9, [H.mon, bk0, H.an], .9, { focus: false }); K.focus(T('c1', 'temoin'), bk0); F(T('c1', 'google') - .2, .9, [bk0], .5);
    F(K.cue('c2').start - .1, 1.0, [...tools, H.mon], .85, { focus: false }); K.focus(T('c2', 'dapi'), api);
    /* s2 four journals = four bins (labels lit one at a time) */
    const g2 = kit.zg('z1', '#24356F', 1), s2 = sc('s2');
    const LOGS = [['activity', C.amber, K.cue('c3').start, K.cue('c4').start], ['data_access', C.violet, K.cue('c4').start, K.cue('c5').start],
      ['system_event', C.teal, K.cue('c5').start, T('c5', 'quatrieme')], ['policy', C.rose, T('c5', 'quatrieme'), K.cue('c6').start]];
    const bins = LOGS.map(([name, col, on, off], i) => { const x = -660 + i * 440; const b = G(g2, x, 40, { pop: s2 + .3 + i * .15 });
      S('rect', { x: -170, y: -120, width: 340, height: 330, rx: 26, fill: C.p1, stroke: col, 'stroke-width': 8 }, b); ico('book', b, 0, 0, 1, col).setAttribute('transform', 'translate(0 20) scale(1.7)');
      const lb = G(g2, x, -170); K.tx(lb, 0, 0, name, { size: kit.mono(name.length, 400, 48, 38), mono: true, fill: col, weight: 700 }); lit(lb, on, off); return b; });
    const api2 = G(g2, 0, -420, { pop: s2 }); S('rect', { x: -150, y: -44, width: 300, height: 88, rx: 18, fill: C.amber }, api2); K.tx(api2, 0, 2, 'API', { size: 56, fill: C.ink, weight: 800 });
    const drop = (i, t, col) => I('slip', g2, 0, -380, 1.2, col, { pop: t, moves: [[t + .1, .9, { x: -660 + i * 440, y: 40, s: .5 }]], out: t + 1.0 });
    drop(0, T('c3', 'modifications'), C.amber); drop(0, T('c3', 'modifications') + .3, C.amber); drop(1, T('c4', 'lectures'), C.violet); drop(2, T('c5', 'google'), C.teal); drop(3, T('c5', 'refuses'), C.rose);
    const d400 = G(g2, -660, 300, { pop: T('c3', 'quatre'), out: K.cue('c4').start, moves: [[T('c3', 'jours'), .4, { s: 1.2 }, E.ob]] }); S('rect', { x: -130, y: -40, width: 260, height: 80, rx: 40, fill: C.text }, d400); K.tx(d400, 0, 2, '400 jours', { size: 44, fill: C.ink, weight: 800 });
    const lock = I('padlock', g2, -500, -30, .9, C.text, { pop: T('c3', 'toujours') }); K.ev(T('c3', 'non'), 'myth');
    const off = G(g2, -220, 300, { pop: T('c4', 'eteint') }); S('rect', { x: -90, y: -40, width: 180, height: 80, rx: 40, fill: '#2b2350', stroke: C.violet, 'stroke-width': 5 }, off); K.tx(off, 0, 2, 'OFF', { size: 46, fill: C.violet, weight: 800 });
    const lid = G(g2, -220, -80, { pop: T('c4', 'eteint') + .2 }); const bq = I('barrel', g2, -60, 230, .8, C.text, { pop: T('c4', 'bigquery') }); I('check', g2, -10, 190, .5, C.green, { pop: T('c4', 'sauf') + .1 }); S('rect', { x: -175, y: -14, width: 350, height: 28, rx: 12, fill: C.violet }, lid);
    const vil = kit.villain(g2, 1150); vil.pop(K.cue('c6').start - .3).walk(K.cue('c6').start, 1.2, 760).pose(T('c6', 'telecharge'), 1.4, 'hold');
    const dl = I('doc', g2, 760, -120, 1.2, C.text, { pop: T('c6', 'telecharge') });
    const dSlip = I('slip', g2, 760, -120, 1.2, C.violet, { pop: T('c6', 'journal'), moves: [[T('c6', 'journal') + .2, 1.0, { x: -150, y: -110 }], [R('c6') + .4, .5, { a: 0, s: .2 }]] });
    const nowhere = I('cross', g2, -220, -110, 1.1, C.rose, { pop: T('c6', 'nulle') }); dl._a.o.out = T('c6', 'nulle') + .5;
    const an2 = kit.analyst(g2, -1100); an2.pop(s2 - .5).walk(s2 - .2, 1.2, -960).pose(T('c3', 'premier'), 1.0, 'point', { x: -660, y: 40 }).expr(T('c3', 'croit'), 'smug').expr(T('c3', 'non'), 'surprise').pose(T('c3', 'non'), .6, 'jump')
      .expr(T('c4', 'deuxieme'), 'neutral').pose(T('c4', 'deuxieme'), 1.0, 'point', { x: -220, y: 40 }).pose(T('c5', 'troisieme'), 1.0, 'point', { x: 220, y: 40 }).pose(T('c5', 'quatrieme'), 1.0, 'point', { x: 660, y: 40 })
      .expr(T('c6', 'devinez'), 'worried').expr(T('c6', 'nulle'), 'angry').pose(T('c6', 'nulle'), 1.2, 'shrug');
    F(s2 - 1.3, 1.5, [...bins, api2], .95, { focus: false }); K.focus(s2, api2);
    F(T('c3', 'premier') - .3, .8, [bins[0], d400], .6, { focus: false }); K.focus(T('c3', 'premier'), bins[0]); F(T('c3', 'croit') - .3, .8, [bins[0], an2], .8, { focus: false }); F(T('c3', 'garde') - .2, .8, [bins[0], d400], .55, { focus: false });
    F(T('c4', 'deuxieme') - .4, .8, [bins[1], off], .6, { focus: false }); K.focus(T('c4', 'deuxieme'), bins[1]); F(T('c4', 'lectures') - .2, .8, [bins[1]], .45, { focus: false });
    F(T('c5', 'troisieme') - .4, .8, [bins[2], bins[3]], .7, { focus: false }); K.focus(T('c5', 'troisieme'), bins[2]); K.focus(T('c5', 'quatrieme'), bins[3]); F(T('c5', 'quatrieme') - .3, .8, [bins[3]], .45, { focus: false });
    F(K.cue('c6').start - .2, 1.0, [bins[1], vil, dl], .85, { focus: false }); K.focus(T('c6', 'telecharge'), dl); K.focus(R('c6'), bins[1]); F(T('c6', 'journal') - .2, .7, [dl, vil], .6, { focus: false });
    K.hot({ x: Z.z1[0], y: Z.z1[1] - 420, at: s2, until: sc('s3'), title: 'Noms complets et rétention', html: '<p><code>projects/ID/logs/cloudaudit.googleapis.com%2Factivity</code>, <code>…%2Fdata_access</code>, <code>…%2Fsystem_event</code>, <code>…%2Fpolicy</code>.</p><p>activity et system_event → bucket <code>_Required</code>, 400 jours fixes. data_access et policy → <code>_Default</code>, 30 jours par défaut (configurable).</p>' });
    /* s3-s5 the real entry, unrolled line by line (3 readable lines max, others greyed) */
    const g3 = kit.zg('z2', '#1C4473', 2), s3 = sc('s3');
    const card = G(g3, 180, -60, { pop: s3 - .2 }); S('rect', { x: -760, y: -460, width: 1520, height: 900, rx: 34, fill: C.paper }, card); S('rect', { x: -760, y: -460, width: 1520, height: 100, rx: 34, fill: C.amber }, card); S('rect', { x: -760, y: -400, width: 1520, height: 40, fill: C.amber }, card);
    const hd = G(card, 0, -410, { moves: [[T('c7', 'ouvrons'), .5, { x: 0 }]] }); K.mark(T('c7', 'ouvrons')); K.tx(hd, -720, 0, 'activity · 03:07:12', { size: 46, mono: true, fill: C.ink, weight: 700, anchor: 'start' }); lit(hd, s3 - .2, T('c7', 'premiere'));
    const LINES = [
      ['serviceName: "cloudresourcemanager.googleapis.com"', T('c7', 'service'), K.cue('c8').start, 'wrench'],
      ['methodName: "SetIamPolicy"', T('c8', 'method'), K.cue('c9').start, 'wrench'],
      ['resourceName: "projects/prod-paiements"', T('c9', 'resource'), K.cue('c10').start, 'pin'],
      ['principalEmail: "ci-deployer@prod-paiements.iam…"', R('c10'), K.cue('c11').start, 'person'],
      ['callerIp: "203.0.113.47"', T('c11', 'caller'), K.cue('c12').start, 'pin'],
      ['callerSuppliedUserAgent: "google-cloud-sdk gcloud/…"', T('c12', 'caller'), K.cue('c13').start, 'terminal'],
      ['bindingDeltas: action ADD · role roles/owner', T('c13', 'binding'), K.cue('c14').start, 'plusminus'],
      ['member: "user:nuitblanche42@gmail.com"', T('c13', 'membre'), K.cue('c14').start, 'person'],
    ];
    const lineEls = LINES.map(([txt, on, off, icn], i) => { const y = -300 + i * 96; const lg = G(card, 0, y); const piv = [1, 2, 3, 4, 6].includes(i);
      const bg = S('rect', { x: -730, y: -40, width: 1460, height: 80, rx: 14, fill: piv ? C.cyan : C.amber, opacity: .18 }, lg);
      ico(icn, lg, 0, 0, 1, C.ink).setAttribute('transform', 'translate(-680 0) scale(.5)');
      const te = K.tx(lg, -620, 2, txt, { size: kit.mono(txt.length, 1320, 46, 36), mono: true, fill: C.ink, weight: 700, anchor: 'start' });
      kit.typeIn(te, txt, on, Math.min(1.4, .03 * txt.length + .3)); lit(lg, on, off); K.mark(on); lg._t = te; return lg; });
    // guess c10: "?" in the principal line until the reveal ; robot appears ; c11 chips ; c12 dashed doubt ; c14 redaction
    const qP = G(card, 0, -300 + 3 * 96, { pop: T('c10', 'principal'), out: R('c10') }); K.tx(qP, -200, 0, 'principalEmail: ?', { size: 46, mono: true, fill: C.rose, weight: 700 });
    const rb = K.char(g3, { name: 'robot', color: C.orange, shape: 'robot', x: -880, y: FLOOR, s: 1.5, dir: 1 }); rb.pop(R('c10')).pose(T('c10', 'robot'), 1.2, 'cheer').out(K.cue('c12').start);
    const chips = G(card, 300, -300 + 4 * 96 + 70, { pop: T('c11', 'gce'), out: K.cue('c12').start }); S('rect', { x: -330, y: -34, width: 660, height: 68, rx: 34, fill: C.ink }, chips); K.tx(chips, 0, 2, 'gce-internal-ip · private', { size: 40, mono: true, fill: C.cyan, weight: 700 });
    const dbt = G(card, 0, -300 + 5 * 96, { fin: [T('c12', 'indice'), .2], out: K.cue('c13').start }); S('rect', { x: -740, y: -46, width: 1480, height: 92, rx: 18, fill: 'none', stroke: C.rose, 'stroke-width': 6, 'stroke-dasharray': '16 12' }, dbt);
    const red = G(card, 0, -300 + 3 * 96, { fin: [T('c14', 'masque'), .2] }); lit(red, T('c14', 'masque'), sc('s6')); S('rect', { x: -140, y: -30, width: 640, height: 60, rx: 10, fill: C.ink }, red);
    const ref = G(card, 420, -300 + 3 * 96 - 74, { pop: T('c14', 'refusee'), out: sc('s6') }); S('rect', { x: -230, y: -32, width: 460, height: 64, rx: 32, fill: C.rose }, ref); K.tx(ref, 0, 2, 'lecture refusée', { size: 40, fill: C.ink, weight: 800 });
    K.ev(T('c14', 'faux'), 'myth'); chain(lineEls[3], (s, t) => { if (t >= T('c14', 'principal') && t < sc('s6')) s.a = 1; });
    const flash = (i, t, col = C.cyan) => { const r = S('rect', { x: -730, y: -300 + i * 96 - 40, width: 1460, height: 80, rx: 14, fill: col, 'fill-opacity': .45 }, card); card.insertBefore(r, lineEls[i]); K.A(r, { fin: [t, .15], out: t + .8 }); };
    flash(0, T('c7', 'cloud')); flash(0, T('c7', 'lappel'), C.amber); flash(1, T('c8', 'set')); flash(1, T('c8', 'exacte'), C.amber); flash(2, T('c9', 'projects')); flash(2, T('c9', 'cible'), C.amber);
    flash(4, T('c11', 'adresse')); flash(5, T('c12', 'loutil')); flash(5, T('c12', 'preuve'), C.rose); flash(6, T('c13', 'service')); flash(6, T('c13', 'policy'), C.amber); flash(6, T('c13', 'action'));
    flash(6, T('c13', 'owner'), C.amber); flash(7, T('c13', 'gmail'), C.rose); flash(3, T('c14', 'principal'), C.rose); flash(3, T('c14', 'rempli'), C.amber);
    flash(3, T('c10', 'compte')); flash(3, T('c10', 'signe'), C.rose); flash(5, T('c12', 'agent')); flash(3, T('c14', 'peut'), C.rose); flash(3, T('c14', 'lappelant'), C.green);
    const hfl = S('rect', { x: -760, y: -460, width: 1520, height: 100, rx: 34, fill: C.text, 'fill-opacity': .4 }, card); K.A(hfl, { fin: [T('c7', 'trois'), .15], out: T('c7', 'trois') + .8 });
    const hb = I('book', card, 640, -410, .6, C.amber, { pop: T('c7', 'activity') });
    const gm = I('person', g3, -880, -260, 1.4, C.rose, { pop: T('c10', 'gmail'), out: K.cue('c11').start }); I('cross', g3, -880, -260, .9, C.rose, { pop: T('c10', 'gmail') + .2, out: K.cue('c11').start });
    const svc = I('check', g3, -880, -260, 1.1, C.green, { pop: T('c14', 'sauf'), out: sc('s6') });
    const an3 = kit.analyst(g3, -1150); an3.pop(s3 - .5).walk(s3 - .2, 1.2, -880).pose(T('c7', 'service'), 1.0, 'loupe').pose(T('c8', 'champ'), .8, 'point', { x: 0, y: -206 }).pose(T('c8', 'regles'), 1.0, 'nod').pose(T('c9', 'cible'), 1.0, 'point', { x: 0, y: -110 })
      .walk(K.cue('c10').start, .8, -1150).walk(K.cue('c12').start, 1.0, -880).pose(T('c10', 'devinez'), 1.0, 'shrug').pose(T('c11', 'attention'), .9, 'jump').pose(T('c11', 'private'), .8, 'nod').pose(T('c12', 'declare'), .8, 'point', { x: 0, y: 180 }).pose(T('c12', 'indice'), 1.2, 'shrug').pose(T('c13', 'owner'), 1.0, 'point', { x: 0, y: 270 })
      .expr(T('c14', 'croit'), 'smug').expr(T('c14', 'faux'), 'surprise').pose(T('c14', 'faux'), .6, 'jump').expr(T('c14', 'service'), 'neutral').pose(T('c14', 'service'), .8, 'nod');
    F(s3 - 1.3, 1.5, [card, an3], .94, { focus: false }); K.focus(s3, card);
    LINES.forEach(([txt, on], i) => { if (i === 7) return; F(on - .4, .7, [lineEls[i]._t], .92, { zmax: 2.2 }); });
    F(T('c8', 'regles') - .3, .8, [lineEls[1], an3], .8, { focus: false }); F(T('c9', 'cible') + .6, .9, [card], .9, { focus: false });
    F(K.cue('c10').start - .2, .8, [qP], .6, { focus: false }); K.focus(K.cue('c10').start, qP); F(R('c10') - .1, .6, [lineEls[3]._t, rb], .95, { focus: false });
    F(T('c11', 'gce') - .3, .7, [lineEls[4]._t, chips], .9, { focus: false, zmax: 2.2 }); K.focus(T('c11', 'gce'), chips);
    F(T('c13', 'membre') - .3, .7, [lineEls[6]._t, lineEls[7]._t], .92, { focus: false, zmax: 2.2 }); K.focus(T('c13', 'membre'), lineEls[7]);
    F(K.cue('c14').start - .2, .9, [lineEls[3]._t, ref], .92, { focus: false, zmax: 2.2 }); K.focus(T('c14', 'masque'), red);
    K.hot({ x: Z.z2[0] + 180, y: Z.z2[1] - 470, at: s3, until: sc('s6'), title: 'Chemins complets', html: '<pre>protoPayload.serviceName\nprotoPayload.methodName\nprotoPayload.resourceName\nprotoPayload.authenticationInfo.principalEmail\nprotoPayload.authenticationInfo.serviceAccountDelegationInfo\nprotoPayload.requestMetadata.callerIp\nprotoPayload.requestMetadata.callerSuppliedUserAgent\nprotoPayload.serviceData.policyDelta.bindingDeltas</pre><p>serviceAccountDelegationInfo : la chaîne d\'usurpation quand un compte de service agit pour un autre (ép. 2).</p>' });
    /* s6 Logs Explorer: the first filter is typed */
    const g6 = kit.zg('z3', '#25406E', 3), s6 = sc('s6');
    const win = G(g6, 120, -120, { pop: s6 - .2 }); S('rect', { x: -800, y: -380, width: 1600, height: 760, rx: 28, fill: '#0e1838', stroke: C.cyan, 'stroke-width': 7 }, win); S('rect', { x: -800, y: -380, width: 1600, height: 90, rx: 28, fill: C.cyan }, win);
    const wt = G(win, 0, -335); K.tx(wt, -760, 0, 'Logs Explorer', { size: 48, fill: C.ink, weight: 800, anchor: 'start' });
    S('rect', { x: -760, y: -260, width: 1520, height: 230, rx: 18, fill: '#071028', stroke: '#26407e', 'stroke-width': 4 }, win);
    const q1 = K.tx(win, -730, -195, '', { size: 44, mono: true, fill: C.amber, weight: 700, anchor: 'start' }); const q2 = K.tx(win, -730, -105, '', { size: 44, mono: true, fill: C.cyan, weight: 700, anchor: 'start' });
    kit.typeIn(q1, 'logName:"cloudaudit.googleapis.com%2Factivity"', T('c15', 'log'), 1.6); for (const [w, yy] of [['contient', -195], ['egal', -105]]) { const r = S('rect', { x: -750, y: yy - 40, width: 1500, height: 80, rx: 14, fill: C.cyan, 'fill-opacity': .22 }, win); K.A(r, { fin: [T('c15', w), .15], out: T('c15', w) + .9 }); } kit.typeIn(q2, 'protoPayload.methodName="SetIamPolicy"', T('c15', 'method'), 1.4);
    K.mark(T('c15', 'log')); K.mark(T('c15', 'method'));
    const rows = [0, 1, 2].map(i => { const r = G(win, 0, 60 + i * 100, { pop: T('c15', 'serie') - .6 + i * .2 }); S('rect', { x: -760, y: -38, width: 1520, height: 76, rx: 14, fill: i === 0 ? C.amber : C.p1, opacity: i === 0 ? .9 : .7 }, r);
      if (i === 0) ico('crown', r, 0, 0, 1, C.ink).setAttribute('transform', 'translate(-700 0) scale(.5)'); for (let k = 0; k < 3; k++) S('rect', { x: -620 + k * 380, y: -10, width: 300, height: 20, rx: 10, fill: i === 0 ? C.ink : '#3a4f8f', opacity: .6 }, r); return r; });
    const an6 = kit.analyst(g6, -1150); an6.pop(s6 - .5).walk(s6 - .2, 1.1, -890).pose(T('c15', 'filtre'), 1.4, 'type').pose(T('c15', 'toute'), .8, 'nod').pose(T('c15', 'serie'), 1.2, 'cheer');
    F(s6 - 1.3, 1.5, [win, an6], .92, { focus: false }); K.focus(s6, win); F(T('c15', 'log') - .4, .7, [q1, q2], .72, { zmax: 2.2 }); K.focus(T('c15', 'log'), q1); K.focus(T('c15', 'method'), q2);
    F(T('c15', 'serie') - .7, .8, [win], .9, { focus: false }); K.focus(T('c15', 'serie'), rows[0]);
    /* s7 recap: 4 journals (one lit) and the six pivot fields lit one by one */
    const g7 = kit.zg('fin', '#1F3B80', 0), s7 = sc('s7');
    const mini = LOGS.map(([n, col], i) => I('book', g7, -540 + i * 360, -330, 1.5, col, { pop: s7 + .1 * i, fn: (s, t) => { if (i > 0 && t > T('c16', 'seul')) s.a *= .3; } }));
    const allume = I('check', g7, -460, -420, .8, C.green, { pop: T('c16', 'allume') });
    const PIV = ['serviceName', 'methodName', 'resourceName', 'principalEmail', 'callerIp', 'serviceData'];
    const tP = T('c16', 'six'), dP = (T('c16', 'episode') - tP) / 6;
    PIV.forEach((p, i) => { const t0 = tP + i * dP; const pg = G(g7, 0, 30); K.tx(pg, 0, 0, p, { size: 76, mono: true, fill: C.cyan, weight: 700 }); lit(pg, t0, t0 + dP, 0); K.mark(t0);
      const dot = I('check', g7, -540 + i * 216, 200, .55, C.cyan, { pop: t0 }); });
    const door = I('door', g7, 700, 160, 1.6, C.rose, { pop: T('c16', 'portes') });
    const an7 = kit.analyst(g7, -1150); an7.pop(s7 - .5).walk(s7 - .2, 1.1, -880).pose(T('c16', 'retenez'), 1.0, 'point', { x: -540, y: -330 }).pose(T('c16', 'six'), 1.2, 'nod').pose(T('c16', 'portes'), 1.2, 'point', { x: 700, y: 160 });
    F(s7 - 1.3, 1.5, [...mini, an7], .92, { focus: false }); F(tP - .3, .7, [g7._room], .9, { focus: false }); K.focus(tP, g7._room); F(T('c16', 'portes') - .3, .8, [door, an7], .7, { focus: false }); F(T('c16', 'persistance'), 1.8, [g7._room], .99, { focus: false });
    K.hot({ x: Z.fin[0], y: Z.fin[1] + 30, at: s7, until: 9999, title: 'À retenir', html: '<p>Journaux : <code>activity</code> (toujours, 400 j) · <code>data_access</code> (éteint par défaut) · <code>system_event</code> · <code>policy</code>.</p><p>Pivots : <code>methodName</code>, <code>authenticationInfo.principalEmail</code>, <code>requestMetadata.callerIp</code>, <code>resourceName</code>, <code>serviceName</code>, <code>serviceData</code>.</p>' });
  },
};
