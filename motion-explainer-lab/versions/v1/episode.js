/*META{"title":"Le registre qui n'oublie rien","h1":"Le registre qui n'oublie rien : Admin Activity, côté détection et réponse","eyebrow":"Google Cloud · Audit logs · v1","footer":"<p class='footer'>Itération v1, générée avec le skill v0. Sources : documentation Google Cloud (Cloud Audit Logs, Store log entries, Aggregated sinks, AuditLog reference), règles Elastic « GCP Service Account Key Creation ». IP 203.0.113.47 = plage de documentation, compte Gmail fictif.</p>"}META*/
/* ---------- FICHE PERTINENCE (skill §0) ----------
Audience : analyste détection/réponse (sait ce qu'est un log, une alerte, un SIEM) qui ne connaît PAS Google Cloud. Niveau : praticien sécu, débutant GCP.
Déjà su (≤15 %) : log, alerte, timeline d'enquête -> 0 rappel, on s'appuie dessus.
Ignore / croit à tort : (1) structure GCP organisation > projets, tout est un appel d'API ; (2) "il faut activer les logs" -> Admin Activity est toujours écrit ;
 (3) "les logs diront ce qui a été volé" -> lectures = Data Access, désactivé par défaut ; (4) "retirer le rôle suffit" -> persistance par clé de compte de service ;
 (5) "les logs sont centralisés" -> un registre par projet, sink agrégé nécessaire.
3 actions : alerte sur SetIamPolicy + CreateServiceAccountKey ; sink agrégé org -> SIEM ; Data Access (DATA_READ) sur les données sensibles.
Question centrale : « Cette nuit, quelqu'un est devenu propriétaire de notre projet : que peut-on prouver, et comment le chasser ? »
Idées (4) : registre toujours écrit et inviolable ; anatomie d'une entrée ; angle mort des lectures ; pivot identité + centralisation.
Métaphore système : Google Cloud = un immeuble ; l'API = le guichet d'entrée ; Admin Activity = le registre du gardien ; Data Access = la caméra des coffres (éteinte).
Faits vérifiés : Admin Activity toujours écrit, non désactivable ; _Required = 400 j non modifiable, bucket non supprimable ; Data Access désactivé par défaut (sauf
 certains services BigQuery), dans _Default (30 j par défaut) ; lectures de données = DATA_READ ; callerIp peut valoir gce-internal-ip / private ; user agent non authentifié ;
 principalEmail peut être masqué ; sinks agrégés org/dossier avec includeChildren ; méthode google.iam.admin.v1.CreateServiceAccountKey.
----------------------------------------------- */
const EP = {
  bg: '#0B1A3A', lead: .6, tail: 2,
  zones: { bureau: [0, 0], immeuble: [2300, 0], greffe: [4600, 0], atelier: [6900, 0], coffres: [6900, 1900], frise: [4600, 1900], carte: [2300, 1900] },
  legend: [['#FFB703', 'Admin Activity (registre)'], ['#A78BFA', 'Data Access (lectures)'], ['#EF476F', 'Attaquant'], ['#FB8500', 'Compte de service / clé'], ['#22D3EE', 'Défense'], ['#06D6A0', 'Remédiation']],
  scenes: [
    { id: 's1', title: '3 h 12, l\'alerte' }, { id: 's2', title: 'Google Cloud en 30 s' }, { id: 's3', title: 'Le registre Admin Activity' },
    { id: 's4', title: 'Anatomie d\'une entrée' }, { id: 's5', title: 'L\'angle mort : les lectures' }, { id: 's6', title: 'Suivre la piste' },
    { id: 's7', title: 'Tout centraliser' }, { id: 's8', title: 'Verdict et actions' }],
  cues: [
    { id: 'c1', sc: 's1', sub: '3 h 12. Alerte : un compte Gmail inconnu est devenu propriétaire du projet prod-paiements.', say: 'Trois heures douze. Alerte : un compte Gmail inconnu est devenu propriétaire du projet prod paiements.' },
    { id: 'c2', sc: 's1', sub: 'Vous ne connaissez pas Google Cloud. Seule piste : ses journaux d\'audit. Qui ? Quand ? D\'où ? Et ensuite ?', say: 'Vous ne connaissez pas Google Cloud. Seule piste : ses journaux d\'audit. Qui ? Quand ? D\'où ? Et ensuite ?' },
    { id: 'c3', sc: 's2', sub: 'Google Cloud, c\'est un immeuble : l\'organisation est le bâtiment, chaque projet un étage, avec machines et données.', say: 'Google Cloud, c\'est un immeuble : l\'organisation est le bâtiment, chaque projet un étage, avec machines et données.' },
    { id: 'c4', sc: 's2', sub: 'Personne n\'entre par la fenêtre : console, ligne de commande ou script, tout passe par le guichet : l\'API.', say: 'Personne n\'entre par la fenêtre : console, ligne de commande ou script, tout passe par le guichet : l\'API.' },
    { id: 'c5', sc: 's3', sub: 'Sans rien configurer, a-t-on une trace ? Oui : tout appel qui modifie un réglage est écrit dans le registre Admin Activity.', say: 'Sans rien configurer, a-t-on une trace ? Oui : tout appel qui modifie un réglage est écrit dans le registre Admin Activity.' },
    { id: 'c6', sc: 's3', sub: 'On croit qu\'il fallait l\'activer. Faux : toujours écrit, impossible à couper, gardé 400 jours. Les modifications sont rares : ça coûte peu.', say: 'On croit qu\'il fallait l\'activer. Faux : toujours écrit, impossible à couper, gardé quatre cents jours. Les modifications sont rares : ça coûte peu.' },
    { id: 'c7', sc: 's3', sub: 'Devinez : devenu propriétaire, l\'attaquant peut-il effacer ce registre ?|Non : son coffre, _Required, ne se supprime pas. L\'historique est intact.', say: 'Devinez : devenu propriétaire, l\'attaquant peut-il effacer ce registre ? | Non : son coffre, Required, ne se supprime pas. L\'historique est intact.' },
    { id: 'c9', sc: 's4', sub: 'Ouvrons l\'entrée de 3 h 07. Quoi ? SetIamPolicy, un changement de droits : le rôle Owner, donné au compte Gmail.', say: 'Ouvrons l\'entrée de trois heures sept. Quoi ? Set I A M Policy, un changement de droits : le rôle Owner, donné au compte Gmail.' },
    { id: 'c10', sc: 's4', sub: 'Et qui a signé ?|Pas un humain : ci-deployer, un compte de service, l\'identité d\'un robot. Sa clé a fuité.', say: 'Et qui a signé ? | Pas un humain : ci déployeur, un compte de service, l\'identité d\'un robot. Sa clé a fuité.' },
    { id: 'c11', sc: 's4', sub: 'D\'où ? Une IP externe, et un nom d\'outil déclaré par l\'appelant lui-même : un indice, pas une preuve.', say: 'D\'où ? Une IP externe, et un nom d\'outil déclaré par l\'appelant lui-même : un indice, pas une preuve.' },
    { id: 'c12', sc: 's4', sub: 'Côté SIEM, une règle tient en quatre champs : méthode, signataire, adresse, rôle ajouté.', say: 'Côté sim, une règle tient en quatre champs : méthode, signataire, adresse, rôle ajouté.' },
    { id: 'c13', sc: 's5', sub: 'A-t-il lu les fichiers clients ? Admin Activity note les modifications, pas les lectures.', say: 'A-t-il lu les fichiers clients ? Admin Activity note les modifications, pas les lectures.' },
    { id: 'c14', sc: 's5', sub: 'Ces téléchargements sont-ils notés ailleurs ?|Par défaut, non. Les lectures relèvent d\'un second registre, Data Access, éteint par défaut.', say: 'Ces téléchargements sont-ils notés ailleurs ? | Par défaut, non. Les lectures relèvent d\'un second registre, Data Access, éteint par défaut.' },
    { id: 'c15', sc: 's5', sub: 'Pourquoi ? Des millions de lectures : trop de volume, trop de coût. Résultat : impossible de prouver le vol, ni son absence.', say: 'Pourquoi ? Des millions de lectures : trop de volume, trop de coût. Résultat : impossible de prouver le vol, ni son absence.' },
    { id: 'c16', sc: 's6', sub: 'Réflexe d\'enquête : pivoter sur l\'identité, et filtrer tout ce qu\'a fait ce compte Gmail.', say: 'Réflexe d\'enquête : pivoter sur l\'identité, et filtrer tout ce qu\'a fait ce compte Gmail.' },
    { id: 'c17', sc: 's6', sub: '3 h 09 : CreateServiceAccountKey. Il se fabrique une clé de secours pour ci-deployer.', say: 'Trois heures neuf : Create Service Account Key. Il se fabrique une clé de secours pour ci déployeur.' },
    { id: 'c18', sc: 's6', sub: 'On croit que retirer le rôle suffit. Faux : avec cette clé, il redevient ci-deployer, et se refait propriétaire.', say: 'On croit que retirer le rôle suffit. Faux : avec cette clé, il redevient ci déployeur, et se refait propriétaire.' },
    { id: 'c20', sc: 's7', sub: 'Recul : chaque projet a son propre registre. Un sink agrégé sur l\'organisation les copie tous vers votre SIEM, au-delà de 400 jours.', say: 'Recul : chaque projet a son propre registre. Un sink agrégé sur l\'organisation les copie tous vers votre sim, au-delà de quatre cents jours.' },
    { id: 'c21', sc: 's8', sub: 'Verdict : clé volée utilisée à 3 h 07, clé de secours à 3 h 09. On retire Owner, on supprime les deux clés.', say: 'Verdict : clé volée utilisée à trois heures sept, clé de secours à trois heures neuf. On retire Owner, on supprime les deux clés.' },
    { id: 'c22', sc: 's8', sub: 'Vos trois actions : alerter sur ces deux méthodes, un sink vers le SIEM, Data Access sur les données sensibles.', say: 'Vos trois actions : alerter sur ces deux méthodes, un sink vers le sim, Data Access sur les données sensibles.' },
    { id: 'c23', sc: 's8', sub: 'Vous savez maintenant dire qui, quand, d\'où, et la suite. Nuance : une IP ou un e-mail peuvent être masqués.', say: 'Vous savez maintenant dire qui, quand, d\'où, et la suite. Nuance : une IP ou un e-mail peuvent être masqués.' },
  ],
  quiz: {
    c7: { q: 'Devenu Owner du projet, l\'attaquant peut-il effacer le registre Admin Activity ?', choices: ['Oui, Owner peut tout', 'Non, le bucket _Required ne se supprime pas', 'Seulement s\'il coupe l\'API Logging'], answer: 1, why: 'Le bucket _Required ne peut être ni supprimé ni modifié, sa rétention de 400 jours est fixe, et Admin Activity est écrit même si l\'API Cloud Logging est désactivée.' },
    c10: { q: 'Qui a signé la modification de 3 h 07 ?', choices: ['Le compte Gmail inconnu', 'Un administrateur interne', 'Le compte de service ci-deployer'], answer: 2, why: 'principalEmail = ci-deployer@prod-paiements.iam.gserviceaccount.com : le robot du pipeline, dont la clé a fuité.' },
    c14: { q: 'Les téléchargements de fichiers dans un bucket sont-ils journalisés ?', choices: ['Oui, dans Admin Activity', 'Non par défaut : Data Access est désactivé', 'Oui, dans System Event'], answer: 1, why: 'Lire des objets relève de Data Access (DATA_READ), désactivé par défaut pour Cloud Storage.' },
  },
  poster: K => K.T('c1', 'compte'),
  build(K) {
    const { S, E, Z } = K; const T = K.T, R = K.reveal;
    const main = K.layers.main, far = K.layers.far, front = K.layers.front;
    const C = { amber: '#FFB703', orange: '#FB8500', cyan: '#22D3EE', rose: '#EF476F', green: '#06D6A0', violet: '#A78BFA', text: '#F8FAFC', ink: '#0B1A3A', p1: '#14295C', p2: '#1E3A8A' };
    const zg = (name, tint) => { const g = K.g(main, { transform: `translate(${Z[name][0]} ${Z[name][1]})` });
      S('rect', { x: -1000, y: -560, width: 2000, height: 1120, rx: 80, fill: tint, opacity: .55 }, g);
      S('rect', { x: -1000, y: 330, width: 2000, height: 230, rx: 40, fill: '#081330', opacity: .7 }, g); return g; };
    const cam = (t, d, zn, x, y, z) => K.cam(t, d, Z[zn][0] + x, Z[zn][1] + y, z);
    const I = (name, parent, x, y, s, c, o = {}) => { const g = ico(name, parent, 0, 0, 1, c); g._a = K.A(g, { x, y, s, ...o }); return g; };
    const sc = id => K.sc(id).start;
    const travel = (id, zn, x, y, z) => cam(sc(id) - 1.2, 1.5, zn, x, y, z);
    // ---------- FAR layer: stars + soft hex shapes (parallax .5)
    for (let i = 0; i < 160; i++) { const x = -800 + (i * 977) % 6200, y = -700 + (i * 613) % 2400;
      const st = S('circle', { cx: x, cy: y, r: 2 + (i % 3), fill: '#cfe3ff', opacity: .25 + (i % 5) * .08 }, far);
      if (i % 7 === 0) K.fx(t => st.setAttribute('opacity', AMBIENT ? (.2 + .3 * Math.abs(Math.sin(t * .8 + i))).toFixed(2) : .35)); }
    for (let i = 0; i < 16; i++) { const x = -600 + i * 380, y = (i % 2 ? -260 : 900) + (i % 3) * 120;
      S('path', { d: 'M 0 -120 L 104 -60 L 104 60 L 0 120 L -104 60 L -104 -60 Z', fill: '#1E3A8A', opacity: .18, transform: `translate(${x} ${y}) scale(${1 + (i % 3) * .4})` }, far); }
    // ---------- FRONT layer: dark silhouettes (parallax 1.3)
    const fr = (zn, dx, dy, name, s, rot = 0) => { const g = ico(name, front, 0, 0, 1, '#050B1E'); g.setAttribute('transform', `translate(${Z[zn][0] * 1.3 + dx} ${Z[zn][1] * 1.3 + dy}) scale(${s}) rotate(${rot})`); };
    const cable = (x0, y0, x1, y1, sag) => S('path', { d: `M ${x0} ${y0} Q ${(x0 + x1) / 2} ${Math.max(y0, y1) + sag} ${x1} ${y1}`, stroke: '#050B1E', 'stroke-width': 26, fill: 'none' }, front);
    fr('bureau', -820, 420, 'plant', 2.4); fr('immeuble', 860, 430, 'plant', 2.2, 8); fr('greffe', -900, 470, 'plant', 2.6, -6);
    fr('atelier', 900, 440, 'plant', 2.3); fr('coffres', -880, 450, 'plant', 2.5); fr('frise', 880, 450, 'plant', 2.2); fr('carte', -860, 440, 'plant', 2.4);
    cable(-600, -620, 3600, -640, 160); cable(3600, -640, 9400, -620, 200); cable(-600, 1900, 9400, 1880, 260);
    // ---------- connectors between zones (inhabited travels)
    const corridor = (x0, y0, x1, y1) => { S('path', { d: `M ${x0} ${y0} L ${x1} ${y1}`, stroke: '#14295C', 'stroke-width': 60, 'stroke-linecap': 'round', opacity: .8 }, main);
      S('path', { d: `M ${x0} ${y0} L ${x1} ${y1}`, stroke: C.amber, 'stroke-width': 6, 'stroke-dasharray': '18 26', opacity: .35 }, main); };
    corridor(950, 380, 1350, 380); corridor(3250, 380, 3650, 380); corridor(5550, 380, 5950, 380); corridor(6900, 560, 6900, 1340);
    corridor(5550, 2280, 5950, 2280); corridor(3250, 2280, 3650, 2280); corridor(1100, 1500, 1500, 1700);

    /* ================= S1 BUREAU ================= */
    { const g = zg('bureau', '#0F2350');
      const win = K.g(g); S('rect', { x: -720, y: -400, width: 300, height: 230, rx: 20, fill: '#081330', stroke: C.p2, 'stroke-width': 10 }, win);
      S('circle', { cx: -520, cy: -330, r: 34, fill: '#F8FAFC', opacity: .9 }, win); S('circle', { cx: -506, cy: -340, r: 30, fill: '#081330' }, win);
      const clock = K.g(g); S('rect', { x: -320, y: -30, width: 210, height: 90, rx: 18, fill: '#081330', stroke: C.p2, 'stroke-width': 6 }, clock);
      const clockTx = K.tx(clock, -215, 16, '03:12', { size: 58, fill: C.rose, mono: true, weight: 700 });
      K.A(clock, { x: -100, y: -400, fin: [0, .1], out: T('c2', 'vous') });
      // desk + monitor
      S('rect', { x: -520, y: 120, width: 860, height: 40, rx: 12, fill: C.p2 }, g); S('rect', { x: -480, y: 160, width: 26, height: 170, fill: C.p1 }, g); S('rect', { x: 280, y: 160, width: 26, height: 170, fill: C.p1 }, g);
      const mon = K.g(g); S('rect', { x: -330, y: -190, width: 620, height: 360, rx: 24, fill: C.p1, stroke: '#26407e', 'stroke-width': 6 }, mon);
      S('rect', { x: -305, y: -168, width: 570, height: 314, rx: 14, fill: '#071028' }, mon); S('rect', { x: -40, y: 170, width: 60, height: 50, fill: C.p1 }, mon); S('rect', { x: -110, y: 112 + 104, width: 200, height: 14, rx: 6, fill: C.p1 }, mon);
      const alertG = K.g(mon); const ah = S('rect', { x: -305, y: -168, width: 570, height: 74, rx: 14, fill: C.rose }, alertG);
      K.tx(alertG, -20, -131, 'ALERTE', { size: 50, fill: C.ink, weight: 800, ls: 4 });
      const aAlert = K.A(alertG, { pop: T('c1', 'alerte'), fn: (s, t) => { if (AMBIENT && t < sc('s2')) s.a *= .75 + .25 * Math.abs(Math.sin(t * 5)); } });
      K.ev(T('c1', 'alerte'), 'impact');
      const mail = K.g(mon); K.tx(mail, -20, -20, 'nuitblanche42@gmail.com', { size: 40, mono: true, fill: C.rose, weight: 700 }); const aMail = K.A(mail, { pop: T('c1', 'gmail') });
      const crown = I('crown', mon, -20, 80, .95, C.amber, { pop: T('c1', 'proprietaire') });
      const ownerTx = K.g(mon); K.tx(ownerTx, 130, 92, 'Owner', { size: 46, fill: C.amber, weight: 800 }); const aOwner = K.A(ownerTx, { pop: T('c1', 'proprietaire') + .2 });
      // analyst
      const an = K.char(g, { name: 'analyste', color: C.cyan, x: 470, y: 330, s: 1.25, dir: -1, headset: true });
      an.pose(0, T('c1', 'alerte') - .1, 'type').pose(T('c1', 'alerte'), .8, 'jump').expr(T('c1', 'alerte'), 'surprise').look(T('c1', 'alerte'), -80, -100)
        .expr(T('c2', 'vous'), 'worried').pose(T('c2', 'connaissez'), 1.4, 'shrug').expr(T('c2', 'piste'), 'neutral').pose(T('c2', 'journaux'), 6, 'loupe').look(T('c2', 'qui'), -80, -330);
      // question bubbles (icons only)
      const bub = (name, i, word) => { const b = K.g(g); S('circle', { r: 62, fill: C.p2, stroke: C.cyan, 'stroke-width': 6 }, b); const ic = ico(name, b, 0, 0, 1, C.text); ic.setAttribute('transform', 'scale(.85)');
        b._a = K.A(b, { x: -350 + i * 170, y: -360, pop: T('c2', word), out: sc('s2') - .5 }); return b; };
      const B = [bub('person', 0, 'qui'), bub('clock', 1, 'quand'), bub('pin', 2, 'dou'), bub('steps', 3, 'ensuite')];
      K.A(mon, { x: -80, y: -110 });
      // camera + focus
      cam(0, 0, 'bureau', 60, -40, .85); K.focus(0, mon, 520);
      cam(T('c1', 'alerte') - .2, 1.0, 'bureau', -100, -130, 1.45); K.focus(T('c1', 'alerte'), alertG, 380);
      K.focus(T('c1', 'gmail'), mail, 360);
      cam(T('c2', 'vous') - .2, 1.0, 'bureau', 120, -40, 1.1); K.focus(T('c2', 'vous'), an.root, 300);
      cam(T('c2', 'qui') - .4, .9, 'bureau', -80, -250, 1.25); K.focus(T('c2', 'qui'), B[1], 520);
      K.hot({ x: Z.bureau[0] - 100, y: Z.bureau[1] - 140, at: 0, until: sc('s2'), title: 'D\'où vient cette alerte ?', html: '<p>Exemple : une <b>alerte basée sur les journaux</b> (Cloud Monitoring) ou une règle SIEM qui surveille <code>protoPayload.methodName="SetIamPolicy"</code> avec un ajout de <code>roles/owner</code>.</p><p>Le compte Gmail et l\'IP sont fictifs (203.0.113.0/24 = plage de documentation).</p>' });
      // S8 reuses this zone (resolution) — declared later
      EP._bureau = { g, mon, alertG, ah, mail, crown, ownerTx, an, B, clock, aAlert, aMail, aOwner };
    }

    /* ================= S2 IMMEUBLE ================= */
    { const g = zg('immeuble', '#13204A'); const s2 = sc('s2');
      const bld = K.g(g); S('rect', { x: -330, y: -370, width: 660, height: 740, rx: 26, fill: C.p2 }, bld);
      S('rect', { x: -360, y: -420, width: 720, height: 70, rx: 20, fill: C.p1 }, bld);
      K.A(bld, { x: 0, y: -50, pop: T('c3', 'immeuble') });
      const roof = K.g(g); K.tx(roof, 0, -436, 'Organisation', { size: 50, fill: C.amber, weight: 800 }); K.A(roof, { pop: T('c3', 'lorganisation') });
      const floors = []; [-380, -170, 40].forEach((y, i) => { const f = K.g(g); S('rect', { x: -300, y: -90, width: 600, height: 180, rx: 16, fill: '#0F2350' }, f);
        for (let k = 0; k < 4; k++) S('rect', { x: -270 + k * 140, y: -60, width: 110, height: 50, rx: 8, fill: '#FFF2C4', opacity: .12 }, f);
        K.A(f, { x: 0, y: y + 90, pop: T('c3', 'immeuble') + .15 * (i + 1) }); floors.push(f); });
      const prod = floors[1]; const glow = S('rect', { x: -300, y: -170, width: 600, height: 180, rx: 16, fill: 'none', stroke: C.amber, 'stroke-width': 8 }, g); K.A(glow, { fin: [T('c3', 'projet'), .4] });
      const plab = K.g(g); K.tx(plab, 0, -120, 'prod-paiements', { size: 48, fill: C.amber, weight: 700, mono: true }); K.A(plab, { pop: T('c3', 'projet') + .1 });
      const sv = I('server', g, -170, -50, .8, C.cyan, { pop: T('c3', 'machines') }); const sv2 = I('server', g, -60, -50, .8, C.cyan, { pop: T('c3', 'machines') + .1 });
      const br = I('barrel', g, 80, -50, .7, C.text, { pop: T('c3', 'donnees') }); const br2 = I('barrel', g, 180, -50, .7, C.text, { pop: T('c3', 'donnees') + .1 });
      // guichet API at the door
      const door = K.g(g); S('rect', { x: -80, y: 230, width: 160, height: 100, rx: 10, fill: '#071028' }, door); K.A(door, { pop: T('c3', 'immeuble') + .5 });
      const desk = K.g(g); S('rect', { x: -150, y: 270, width: 300, height: 70, rx: 14, fill: C.amber }, desk);
      const apiTx = K.tx(desk, 0, 306, 'API', { size: 52, fill: C.ink, weight: 800 });
      K.A(desk, { pop: T('c4', 'guichet'), fn: (s, t) => { const p = P(t, T('c4', 'lapi'), .5); s.s *= 1 + .12 * Math.sin(Math.PI * p); } });
      // window with a cross
      const xw = I('cross', g, 230, 140, .9, C.rose, { pop: T('c4', 'fenetre') }); K.ev(T('c4', 'fenetre'), 'impact');
      // three tokens -> guichet
      const tok = (name, col, word, i) => { const tt = T('c4', word); I(name, g, -760, 290, 1, col, { pop: tt, moves: [[tt + .5, 1.2, { x: -250 - i * 130, y: 280 }], [T('c4', 'lapi') + .2 + i * .15, .6, { x: 0, y: 240, s: .2, a: 0 }]] }); };
      tok('laptop', C.cyan, 'console', 0); tok('terminal', C.green, 'ligne', 1); tok('gear', C.violet, 'script', 2);
      // slips fly right (to the registry)
      for (let i = 0; i < 4; i++) { const t0 = T('c4', 'lapi') + i * .18; I('slip', g, 0, 250, .9, C.amber, { pop: t0, moves: [[t0 + .2, 1.6, { x: 900 + i * 40, y: 120 - i * 50 }, E.ic]], out: t0 + 1.6 }); }
      const an = K.char(g, { name: 'analyste', color: C.cyan, x: -900, y: 330, s: 1.1, headset: true });
      an.pop(s2 - .3).walk(s2, 1.4, -560).pose(T('c3', 'immeuble'), 1.2, 'point', { x: -100, y: -100 }).look(T('c3', 'projet'), 0, -100)
        .pose(T('c4', 'fenetre'), 1.0, 'point', { x: 230, y: 140 }).look(T('c4', 'console'), -700, 290).look(T('c4', 'guichet'), 0, 300).pose(T('c4', 'lapi'), .9, 'nod').expr(T('c4', 'lapi'), 'happy');
      travel('s2', 'immeuble', 0, -40, .78); K.focus(s2, bld, 520);
      cam(T('c3', 'projet') - .3, .9, 'immeuble', 0, -90, 1.3); K.focus(T('c3', 'projet'), prod, 420);
      cam(T('c4', 'personne') - .2, 1.0, 'immeuble', -260, 160, 1.05); K.focus(T('c4', 'console'), desk, 420);
      cam(T('c4', 'lapi') - .2, .8, 'immeuble', -60, 220, 1.35); K.focus(T('c4', 'lapi'), desk, 300);
      K.hot({ x: Z.immeuble[0], y: Z.immeuble[1] - 430, at: s2, until: sc('s3'), title: 'Hiérarchie réelle', html: '<p>Simplifié dans la vidéo : <b>Organisation → Dossiers → Projets → ressources</b>. Les droits (IAM) se posent à chaque niveau et s\'héritent vers le bas.</p>' });
    }

    /* ================= S3 GREFFE (registre) ================= */
    { const g = zg('greffe', '#1C1A48'); const s3 = sc('s3');
      const lect = K.g(g); S('path', { d: 'M -120 330 L -60 90 L 60 90 L 120 330 Z', fill: C.p2 }, lect); K.A(lect, { fin: [s3 - 1.5, .1] });
      const book = K.g(g); const bk = ico('book', book, 0, 0, 1, C.amber); bk.setAttribute('transform', 'scale(3.4)');
      const lines = []; for (let i = 0; i < 5; i++) { const l = S('rect', { x: -180, y: -70 + i * 34, width: 140, height: 12, rx: 6, fill: C.ink, opacity: .35 }, book); lines.push(l); }
      K.A(book, { x: 0, y: 0, fin: [s3 - 1.5, .1], fn: (s, t) => { const p = P(t, T('c5', 'admin'), .6); s.s *= 1 + .08 * Math.sin(Math.PI * p); } });
      lines.forEach((l, i) => K.A(l, { fin: [T('c5', 'ecrit') + i * .3, .2] }));
      const glow = S('ellipse', { cx: 0, cy: 10, rx: 280, ry: 160, fill: C.amber, opacity: .18 }, g); g.insertBefore(glow, book); K.A(glow, { fin: [T('c5', 'admin'), .5] });
      const ban = K.g(g); S('rect', { x: -290, y: -330, width: 580, height: 90, rx: 45, fill: C.amber }, ban); K.tx(ban, 0, -284, 'Admin Activity', { size: 56, fill: C.ink, weight: 800 }); K.A(ban, { pop: T('c5', 'admin') });
      // slip arriving into the book
      for (let i = 0; i < 3; i++) { const t0 = T('c5', 'modifie') + i * .25; I('slip', g, -900, -200 + i * 40, 1, C.amber, { pop: t0, moves: [[t0, 1.1, { x: 0, y: 0, s: .4 }, E.ioc]], out: t0 + 1.1 }); }
      // switch welded ON
      const sw = K.g(g); S('rect', { x: -60, y: -110, width: 120, height: 220, rx: 30, fill: C.p1, stroke: C.text, 'stroke-width': 6 }, sw); S('rect', { x: -40, y: -90, width: 80, height: 90, rx: 20, fill: C.green }, sw);
      K.A(sw, { x: -560, y: -20, pop: T('c6', 'croit') });
      const lock = I('padlock', g, -560, 40, 1.1, C.text, { pop: T('c6', 'faux'), moves: [[T('c6', 'faux'), .3, { y: 70 }, E.ob]] }); K.ev(T('c6', 'faux'), 'impact');
      // calendar 400
      const cal = K.g(g); S('rect', { x: -110, y: -100, width: 220, height: 200, rx: 18, fill: C.text }, cal); S('rect', { x: -110, y: -100, width: 220, height: 56, rx: 18, fill: C.rose }, cal);
      K.tx(cal, 0, 22, '400', { size: 78, fill: C.ink, weight: 800 }); K.tx(cal, 0, 76, 'jours', { size: 44, fill: C.ink, weight: 600 });
      K.A(cal, { x: 520, y: -40, pop: T('c6', 'quatre'), out: T('c7', 'devinez') });
      // why: balance few modifications vs huge pile of reads
      const bal = K.g(g); S('path', { d: 'M 0 0 L 0 -150', stroke: C.text, 'stroke-width': 10 }, bal); S('path', { d: 'M -40 0 L 40 0', stroke: C.text, 'stroke-width': 12, 'stroke-linecap': 'round' }, bal);
      const beam = K.g(bal); S('rect', { x: -200, y: -160, width: 400, height: 14, rx: 7, fill: C.text }, beam);
      const pL = K.g(beam); S('path', { d: 'M -250 -150 L -150 -150 L -170 -110 L -230 -110 Z', fill: C.p1 }, pL); ico('slip', pL, 0, 0, 1, C.amber).setAttribute('transform', 'translate(-200 -140) scale(.8)');
      const pR = K.g(beam); S('path', { d: 'M 150 -150 L 250 -150 L 230 -110 L 170 -110 Z', fill: C.p1 }, pR);
      for (let i = 0; i < 12; i++) ico('slip', pR, 0, 0, 1, C.violet).setAttribute('transform', `translate(${180 + (i % 3) * 20} ${-150 - Math.floor(i / 3) * 26}) scale(.7)`);
      K.A(beam, { fn: (s, t) => { s.r = 12 * E.ob(P(t, T('c6', 'rares'), .8)); } });
      K.A(bal, { x: 520, y: 310, pop: T('c6', 'rares') - .2, out: T('c7', 'devinez') });
      // guess: villain + eraser, glass dome
      const vil = K.char(g, { name: 'attaquant', color: C.rose, x: 780, y: 330, s: 1.1, dir: -1, mask: true, expr: 'smug' });
      vil.pop(T('c7', 'devinez')).walk(T('c7', 'devinez') + .3, 1.4, 330).pose(T('c7', 'effacer'), 2.6, 'point', { x: 0, y: 0 })
        .expr(R('c7'), 'angry').slide(R('c7') + .1, .5, 560).pose(R('c7') + .1, .6, 'jump');
      const dome = K.g(g); S('path', { d: 'M -300 140 L -300 -60 A 300 260 0 0 1 300 -60 L 300 140 Z', fill: '#BDEBFF', 'fill-opacity': .14, stroke: '#BDEBFF', 'stroke-width': 8 }, dome);
      const req = K.g(dome); S('rect', { x: -150, y: 150, width: 300, height: 66, rx: 33, fill: C.text }, req); K.tx(req, 0, 184, '_Required', { size: 46, fill: C.ink, weight: 800, mono: true });
      K.A(dome, { x: 0, y: -40, fin: [R('c7'), .1], moves: [[R('c7'), .35, { y: 0 }, E.ob]] }); K.ev(R('c7'), 'impact'); K.mark(R('c7'));
      const an = K.char(g, { name: 'analyste', color: C.cyan, x: -980, y: 330, s: 1.1, headset: true });
      an.pop(s3 - .3).walk(s3, 1.2, -760).look(T('c5', 'trace'), 0, 0).pose(T('c5', 'oui'), .8, 'nod').expr(T('c5', 'oui'), 'happy')
        .expr(T('c6', 'croit'), 'smug').walk(T('c6', 'croit'), 1.0, -700).pose(T('c6', 'lactiver'), 1.2, 'point', { x: -560, y: -20 }).expr(T('c6', 'faux'), 'surprise').pose(T('c6', 'faux'), .6, 'jump')
        .expr(T('c6', 'quatre'), 'neutral').look(T('c6', 'quatre'), 520, -40).expr(T('c7', 'devinez'), 'worried').look(T('c7', 'devinez'), 330, -80)
        .expr(R('c7') + .3, 'happy').pose(T('c7', 'intact'), 1.4, 'cheer');
      travel('s3', 'greffe', -100, -40, .8); K.focus(s3, book, 480);
      cam(T('c5', 'admin') - .4, .9, 'greffe', 0, -100, 1.5); K.focus(T('c5', 'admin'), ban, 360);
      cam(T('c6', 'croit') - .2, .9, 'greffe', -480, 40, 1.25); K.focus(T('c6', 'croit'), sw, 360);
      cam(T('c6', 'quatre') - .3, .9, 'greffe', 300, -20, 1.15); K.focus(T('c6', 'quatre'), cal, 340); K.focus(T('c6', 'rares'), bal, 360);
      cam(T('c7', 'devinez') - .2, 1.0, 'greffe', 160, 0, 0.95); K.focus(T('c7', 'devinez'), book, 520);
      cam(R('c7') - .1, .6, 'greffe', 0, -10, 1.15); K.focus(R('c7'), dome, 460);
      K.hot({ x: Z.greffe[0] - 200, y: Z.greffe[1] - 300, at: s3, until: sc('s4'), title: 'Les 4 journaux d\'audit', html: '<p><b>Admin Activity</b> : modifications de configuration/métadonnées. Toujours écrit, non désactivable → bucket <code>_Required</code>, 400 jours fixes.</p><p><b>Data Access</b> : lectures de config et lectures/écritures de données. Désactivé par défaut (sauf certains services BigQuery) → <code>_Default</code>, 30 jours par défaut.</p><p><b>System Event</b> : actions de Google sur vos ressources (toujours écrit). <b>Policy Denied</b> : accès refusés par une politique de sécurité.</p>' });
    }

    /* ================= S4 ATELIER (anatomie) ================= */
    { const g = zg('atelier', '#102B4A'); const s4 = sc('s4');
      const card = K.g(g); S('rect', { x: -520, y: -360, width: 1040, height: 620, rx: 36, fill: '#E8EEF9' }, card); S('rect', { x: -520, y: -360, width: 1040, height: 110, rx: 36, fill: C.amber }, card);
      S('rect', { x: -520, y: -290, width: 1040, height: 40, fill: C.amber }, card);
      K.tx(card, 0, -302, 'Entrée de 03:07', { size: 54, fill: C.ink, weight: 800 });
      K.A(card, { pop: T('c9', 'ouvrons') });
      // 4 slots (2x2): quoi, changement, qui, d'où
      const slotDef = [['wrench', 'Quoi', -250, -100], ['plusminus', 'Changement', 250, -100], ['person', 'Qui', -250, 120], ['pin', 'D\'où', 250, 120]];
      const slots = slotDef.map(([icn, lab, x, y], i) => { const sg = K.g(card); const bg = S('rect', { x: -230, y: -90, width: 460, height: 180, rx: 24, fill: '#CBD5E8' }, sg);
        const ic = ico(icn, sg, 0, 0, 1, C.ink); ic.setAttribute('transform', 'translate(-160 0) scale(.8)');
        K.A(sg, { x, y, pop: T('c9', 'ouvrons') + .4 + i * .12 }); return { sg, bg, x, y }; });
      const val = (i, str, word, cue, until, o = {}) => { const vg = K.g(card); K.tx(vg, 50, 0, str, { size: o.size || 40, fill: o.fill || C.ink, weight: 700, mono: !!o.mono });
        K.A(vg, { x: slots[i].x, y: slots[i].y, pop: T(cue, word), out: until }); const hl = S('rect', { x: slots[i].x - 236, y: slots[i].y - 96, width: 472, height: 192, rx: 28, fill: 'none', stroke: o.stroke || C.cyan, 'stroke-width': 8 }, card);
        K.A(hl, { fin: [T(cue, word), .3], out: until }); return vg; };
      val(0, 'SetIamPolicy', 'set', 'c9', T('c10', 'et'), { mono: true, size: 42 });
      val(1, '+ Owner', 'owner', 'c9', T('c11', 'dou'), { fill: '#b45309', size: 54, stroke: C.amber });
      val(2, 'ci-deployer', 'ci', 'c10', T('c12', 'cote'), { mono: true, size: 42, fill: '#c2410c', stroke: C.orange });
      val(3, '203.0.113.47', 'ip', 'c11', T('c12', 'cote'), { mono: true, size: 40 });
      const ua = K.g(card); S('rect', { x: 330, y: 230, width: 300, height: 70, rx: 35, fill: 'none', stroke: C.rose, 'stroke-width': 5, 'stroke-dasharray': '14 10' }, ua);
      K.tx(ua, 480, 266, 'gcloud ?', { size: 42, fill: C.rose, weight: 700, mono: true });
      K.A(ua, { pop: T('c11', 'doutil'), out: T('c12', 'cote'), fn: (s, t) => { if (t > T('c11', 'indice')) s.r = 4 * Math.sin((t - T('c11', 'indice')) * 12) * (1 - P(t, T('c11', 'indice'), 1.2)); } });
      // robot ci-deployer with leaking key
      const robot = K.char(g, { name: 'ci-deployer', color: C.orange, shape: 'robot', x: 820, y: 330, s: 1.1, dir: -1 });
      robot.pop(T('c10', 'et')).expr(R('c10'), 'worried').pose(R('c10'), 4, 'hold');
      const key = ico('key', g, 0, 0, 1, C.orange); robot.hold(key); K.A(key, { pop: R('c10') });
      const leak = I('key', g, 820, 120, .9, C.rose, { pop: T('c10', 'fuite'), moves: [[T('c10', 'fuite') + .2, 1.0, { x: 1100, y: -200 }]], out: T('c10', 'fuite') + 1.4 });
      // code panel (zoom technique)
      const code = K.g(g); S('rect', { x: -640, y: -250, width: 1280, height: 420, rx: 26, fill: '#071028', stroke: C.cyan, 'stroke-width': 5 }, code);
      const ct = K.tx(code, -600, -170, '', { size: 38, mono: true, anchor: 'start', fill: C.text });
      [['methodName', ' = "SetIamPolicy"'], ['principalEmail', ' = "ci-deployer@…"'], ['callerIp', ' = "203.0.113.47"'], ['bindingDeltas', ' : ADD roles/owner']].forEach(([k, v], i) => {
        const a = S('tspan', { x: -600, dy: i ? 92 : 0, fill: C.cyan }, ct); a.textContent = k; const b = S('tspan', { fill: C.text }, ct); b.textContent = v; });
      K.A(code, { x: 0, y: 40, pop: T('c12', 'cote'), out: sc('s5') - .3 });
      const an = K.char(g, { name: 'analyste', color: C.cyan, x: -1000, y: 330, s: 1.1, headset: true });
      an.pop(s4 - .3).walk(s4, 1.2, -700).pose(T('c9', 'ouvrons'), 3, 'loupe').pose(T('c9', 'quoi'), 1.0, 'point', { x: -250, y: -100 }).pose(T('c9', 'owner'), 1.0, 'point', { x: 250, y: -100 })
        .expr(R('c10'), 'surprise').look(R('c10'), 820, 200).expr(T('c11', 'dou'), 'neutral').pose(T('c11', 'dou'), 1.2, 'point', { x: 250, y: 120 }).pose(T('c11', 'indice'), 1.2, 'shrug');
      travel('s4', 'atelier', 0, -40, .82); K.focus(s4, card, 600);
      cam(T('c9', 'quoi') - .3, .8, 'atelier', -250, -100, 1.6); K.focus(T('c9', 'quoi'), slots[0].sg, 300);
      cam(T('c9', 'owner') - .3, .8, 'atelier', 250, -100, 1.6); K.focus(T('c9', 'owner'), slots[1].sg, 300);
      cam(T('c10', 'et') - .2, .9, 'atelier', 380, 40, 1.0); K.focus(T('c10', 'et'), robot.root, 360);
      cam(R('c10') - .1, .6, 'atelier', 560, 30, 1.35); K.focus(R('c10'), slots[2].sg, 380);
      cam(T('c11', 'dou') - .3, .8, 'atelier', 330, 150, 1.45); K.focus(T('c11', 'dou'), slots[3].sg, 340);
      cam(T('c12', 'cote') - .2, .9, 'atelier', 0, 40, 1.15); K.focus(T('c12', 'cote'), code, 620);
      K.hot({ x: Z.atelier[0] + 300, y: Z.atelier[1] - 200, at: s4, until: sc('s5'), title: 'L\'entrée complète (extrait)', html: '<pre>{\n "logName": "projects/prod-paiements/logs/\n   cloudaudit.googleapis.com%2Factivity",\n "protoPayload": {\n  "methodName": "SetIamPolicy",\n  "authenticationInfo": {"principalEmail":\n   "ci-deployer@prod-paiements.iam.gserviceaccount.com"},\n  "requestMetadata": {"callerIp": "203.0.113.47",\n   "callerSuppliedUserAgent": "google-cloud-sdk gcloud/…"},\n  "serviceData": {"policyDelta": {"bindingDeltas": [\n   {"action":"ADD","role":"roles/owner",\n    "member":"user:nuitblanche42@gmail.com"}]}}\n }\n}</pre><p><code>callerIp</code> vaut <code>gce-internal-ip</code> ou <code>private</code> pour certains appels internes. <code>callerSuppliedUserAgent</code> n\'est pas authentifié.</p>' });
    }

    /* ================= S5 COFFRES (angle mort) ================= */
    { const g = zg('coffres', '#1A1640'); const s5 = sc('s5');
      const vault = K.g(g); S('circle', { cx: 0, cy: 0, r: 230, fill: C.p1, stroke: '#3a4f8f', 'stroke-width': 16 }, vault); S('circle', { cx: 0, cy: 0, r: 180, fill: '#071028' }, vault);
      for (let i = 0; i < 6; i++) ico('doc', vault, 0, 0, 1, C.text).setAttribute('transform', `translate(${-90 + (i % 3) * 90} ${-50 + Math.floor(i / 3) * 100}) scale(.8)`);
      K.A(vault, { x: -380, y: -20, fin: [s5 - 1.5, .1] });
      const vlab = K.g(g); K.tx(vlab, -380, -300, 'factures-clients', { size: 46, mono: true, fill: C.text, weight: 700 }); K.A(vlab, { pop: T('c13', 'fichiers') });
      // small Admin Activity book on the wall (stays blank)
      const sb = I('book', g, 470, -60, 1.6, C.amber, { fin: [s5 - 1.5, .1], fn: (s, t) => { const p = P(t, T('c13', 'lectures'), .8); s.r = 6 * Math.sin(p * Math.PI * 4) * (1 - p); } });
      const empty = I('cross', g, 470, -60, .7, C.rose, { pop: T('c13', 'lectures') + .2, out: T('c14', 'ces') });
      // villain stealing docs
      const vil = K.char(g, { name: 'attaquant', color: C.rose, x: 0, y: 330, s: 1.1, mask: true, expr: 'smug' });
      vil.pop(s5 - .2).pose(T('c13', 'fichiers'), 4.0, 'hold').look(T('c13', 'fichiers'), -380, -20).walk(T('c14', 'ces'), 1.6, 1200).out(T('c14', 'ces') + 1.4);
      for (let i = 0; i < 5; i++) { const t0 = T('c13', 'fichiers') + .2 + i * .35; I('doc', g, -380, -20, .8, C.text, { pop: t0, moves: [[t0, .9, { x: 20, y: 160, s: .5 }]], out: t0 + .9 }); }
      // ceiling camera Data Access (off)
      const camG = K.g(g); const cc = ico('cam', camG, 0, 0, 1, C.violet); cc.setAttribute('transform', 'scale(1.6)');
      const lens = S('circle', { cx: 62, cy: 0, r: 16, fill: '#2b2350' }, camG);
      K.A(camG, { x: 180, y: -330, fin: [s5 - 1.5, .1], fn: (s, t) => { s.r = AMBIENT ? 4 * Math.sin(t * .7) : 0; } });
      const dalab = K.g(g); S('rect', { x: -190, y: -50, width: 380, height: 84, rx: 42, fill: C.violet }, dalab); K.tx(dalab, 0, -8, 'Data Access', { size: 50, fill: C.ink, weight: 800 });
      K.A(dalab, { x: 180, y: -170, pop: T('c14', 'data') });
      const off = K.g(g); S('rect', { x: -70, y: -40, width: 140, height: 80, rx: 40, fill: '#2b2350', stroke: C.violet, 'stroke-width': 5 }, off); K.tx(off, 0, 2, 'OFF', { size: 46, fill: C.violet, weight: 800 });
      K.A(off, { x: 420, y: -330, pop: T('c14', 'eteint') });
      const zz = K.g(g); K.A(zz, { x: 290, y: -420, pop: T('c14', 'eteint') + .3 }); for (let i = 0; i < 3; i++) S('path', { d: `M ${i * 26} ${-i * 26} l 18 0 l -18 18 l 18 0`, stroke: C.violet, 'stroke-width': 5, fill: 'none' }, zz);
      // why: torrent of reads -> cost meter
      const tor = K.g(g); K.A(tor, { x: 0, y: 0, fin: [T('c15', 'millions'), .2], out: T('c15', 'resultat') });
      const torSlips = []; for (let i = 0; i < 26; i++) { const s = ico('slip', tor, 0, 0, 1, C.violet); torSlips.push(s); }
      K.fx(t => { const t0 = T('c15', 'millions'); torSlips.forEach((s, i) => { const ph = ((t - t0) * .9 + i / 26) % 1; const x = -600 + ph * 1200, y = 120 + Math.sin(i * 7.3) * 80 - ph * 30;
        s.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(.8)`); }); });
      const meter = K.g(g); S('rect', { x: -40, y: -200, width: 80, height: 220, rx: 20, fill: C.p1, stroke: C.text, 'stroke-width': 5 }, meter);
      const fill = S('rect', { x: -28, y: 8, width: 56, height: 0, rx: 12, fill: C.rose }, meter); K.tx(meter, 0, 70, '€', { size: 64, fill: C.text, weight: 800 });
      K.A(meter, { x: 650, y: 140, pop: T('c15', 'cout'), out: T('c15', 'resultat') });
      K.fx(t => { const p = E.oc(P(t, T('c15', 'cout'), 1.2)); fill.setAttribute('height', 196 * p); fill.setAttribute('y', 8 - 196 * p); });
      // consequence: timeline with a gap
      const tl = K.g(g); S('rect', { x: -520, y: -10, width: 340, height: 20, rx: 10, fill: C.text }, tl); S('rect', { x: 180, y: -10, width: 340, height: 20, rx: 10, fill: C.text }, tl);
      S('rect', { x: -180, y: -10, width: 360, height: 20, fill: 'none', stroke: C.text, 'stroke-width': 4, 'stroke-dasharray': '12 12' }, tl);
      K.tx(tl, 0, -80, '?', { size: 110, fill: C.violet, weight: 800 });
      K.A(tl, { x: 0, y: 200, pop: T('c15', 'resultat') });
      const an = K.char(g, { name: 'analyste', color: C.cyan, x: -980, y: 330, s: 1.1, headset: true });
      an.pop(s5 - .3).walk(s5, 1.2, -700).look(T('c13', 'admin'), 470, -60).expr(T('c13', 'lectures'), 'worried').look(T('c14', 'ces'), 180, -330)
        .pose(T('c14', 'notes'), 1.4, 'point', { x: 180, y: -330 }).expr(R('c14'), 'angry').expr(T('c15', 'resultat'), 'worried').pose(T('c15', 'vol'), 1.6, 'shrug');
      travel('s5', 'coffres', -100, -40, .82); K.focus(s5, vault, 520);
      cam(T('c13', 'fichiers') - .2, .9, 'coffres', -200, 60, 1.15); K.focus(T('c13', 'fichiers'), vil.root, 380);
      cam(T('c13', 'admin') - .2, .8, 'coffres', 380, -60, 1.3); K.focus(T('c13', 'admin'), sb, 320);
      cam(T('c14', 'ces') - .2, .9, 'coffres', 220, -260, 1.6); K.focus(T('c14', 'ces'), camG, 300);
      K.focus(R('c14') + .6, dalab, 360);
      cam(T('c15', 'millions') - .4, .9, 'coffres', 60, 60, .95); K.focus(T('c15', 'millions'), tor, 560);
      cam(T('c15', 'resultat') - .2, .8, 'coffres', 0, 120, 1.25); K.focus(T('c15', 'resultat'), tl, 420);
      K.hot({ x: Z.coffres[0] + 180, y: Z.coffres[1] - 200, at: s5, until: sc('s6'), title: 'Activer Data Access', html: '<p>Console : <b>IAM et administration → Journaux d\'audit</b>, choisir le service (ex. Cloud Storage) et cocher <code>DATA_READ</code> / <code>DATA_WRITE</code>. Ou dans la stratégie IAM : bloc <code>auditConfigs</code>.</p><p>Ces journaux vont dans <code>_Default</code> (30 jours par défaut) et sont facturés à l\'ingestion : ciblez les données sensibles.</p>' });
    }

    /* ================= S6 FRISE (pivot) ================= */
    { const g = zg('frise', '#0E2A3E'); const s6 = sc('s6');
      const rail = K.g(g); S('rect', { x: -760, y: 60, width: 1520, height: 24, rx: 12, fill: C.p2 }, rail); K.A(rail, { fin: [s6 - 1.5, .1] });
      // background events (grey dots) that fade when filtered
      const dots = K.g(g); for (let i = 0; i < 22; i++) S('circle', { cx: -720 + i * 68, cy: 72 + (i % 2 ? -60 : 60), r: 14, fill: '#6b7fae' }, dots);
      K.A(dots, { fin: [s6 - 1.5, .1], moves: [[T('c16', 'filtre'), .8, { a: .08 }]] });
      const mark = (x, label, word, cue, col) => { const m = K.g(g); S('rect', { x: -6, y: -40, width: 12, height: 120, rx: 6, fill: col }, m); K.tx(m, 0, 140, label, { size: 46, mono: true, fill: col, weight: 700 }); K.A(m, { x, y: 30, pop: T(cue, word) }); return m; };
      const m7 = mark(-400, '03:07', 'filtrer', 'c16', C.rose); const m9 = mark(0, '03:09', 'trois', 'c17', C.rose); mark(420, '03:12', 'filtrer', 'c16', C.text);
      const steps = []; for (let i = 0; i < 8; i++) { const x = -560 + i * 120; steps.push(I('steps', g, x, -40, .6, C.rose, { pop: T('c16', 'filtre') + .4 + i * .1 })); }
      // filter lens with identity tag
      const tag = K.g(g); S('rect', { x: -300, y: -50, width: 600, height: 100, rx: 50, fill: C.cyan }, tag); K.tx(tag, 0, 2, 'nuitblanche42@…', { size: 44, mono: true, fill: C.ink, weight: 700 });
      K.A(tag, { x: -200, y: -330, pop: T('c16', 'lidentite'), out: T('c17', 'trois') });
      const crown = I('crown', g, -400, -150, .8, C.amber, { pop: T('c16', 'gmail') + .4, moves: [[T('c18', 'retirer'), .8, { x: -900, y: -500, r: -60 }], [T('c18', 'proprietaire'), .8, { x: 300, y: 150, r: 0 }]] });
      // new key + backdoor
      const ktx = K.g(g); K.tx(ktx, 0, -330, 'CreateServiceAccountKey', { size: 46, mono: true, fill: C.orange, weight: 700 }); K.A(ktx, { pop: T('c17', 'create'), out: T('c18', 'on') });
      const nk = I('key', g, 0, -170, 1.4, C.orange, { pop: T('c17', 'fabrique'), moves: [[T('c17', 'secours'), .8, { x: 300, y: -160, s: 1 }]] });
      const door = I('door', g, 380, -170, 1.5, C.rose, { pop: T('c17', 'secours') });
      const an = K.char(g, { name: 'analyste', color: C.cyan, x: -980, y: 330, s: 1.1, headset: true });
      an.pop(s6 - .3).walk(s6, 1.2, -640).pose(T('c16', 'pivoter'), 2.4, 'loupe').walk(T('c16', 'filtre'), 2.0, -260).look(T('c17', 'trois'), 0, -170)
        .expr(T('c17', 'secours'), 'angry').expr(T('c18', 'on'), 'smug').pose(T('c18', 'retirer'), 1.0, 'point', { x: -400, y: -150 })
        .expr(T('c18', 'faux'), 'surprise').pose(T('c18', 'faux'), .7, 'jump');
      const vil = K.char(g, { name: 'attaquant', color: C.rose, x: 640, y: 330, s: 1.1, dir: -1, mask: true, expr: 'smug' });
      vil.pop(T('c18', 'cle')).walk(T('c18', 'cle'), 1.0, 300).pose(T('c18', 'redevient'), 1.5, 'point', { x: 380, y: -170 }).pose(T('c18', 'proprietaire'), 1.6, 'cheer');
      travel('s6', 'frise', -300, -40, .85); K.focus(s6, rail, 560);
      cam(T('c16', 'filtre') - .2, 2.0, 'frise', -150, -60, 1.0); K.focus(T('c16', 'filtre'), m7, 420);
      cam(T('c17', 'create') - .3, .9, 'frise', 120, -230, 1.45); K.focus(T('c17', 'create'), nk, 360);
      cam(T('c18', 'on') - .2, .9, 'frise', 0, -40, 1.0); K.focus(T('c18', 'faux'), vil.root, 420);
      K.hot({ x: Z.frise[0] - 200, y: Z.frise[1] - 330, at: s6, until: sc('s7'), title: 'Requête de pivot (Logs Explorer)', html: '<pre>logName:"cloudaudit.googleapis.com%2Factivity"\nprotoPayload.authenticationInfo.principalEmail=\n  "nuitblanche42@gmail.com"\ntimestamp>="2026-10-31T03:00:00Z"</pre><p>Puis la même chose sur <code>ci-deployer@…</code> : l\'attaquant agit sous les deux identités.</p>' });
      K.hot({ x: Z.frise[0], y: Z.frise[1] - 170, at: T('c17', 'trois'), until: sc('s7'), title: 'Méthode exacte', html: '<p><code>google.iam.admin.v1.CreateServiceAccountKey</code> (MITRE ATT&CK T1098.001, Additional Cloud Credentials). Lors des appels faits ensuite avec cette clé, <code>authenticationInfo</code> contient <code>serviceAccountKeyName</code>.</p><p class="tbd">À vérifier dans votre environnement : présence de serviceAccountKeyName selon le service appelé.</p>' });
    }

    /* ================= S7 CARTE (centraliser) ================= */
    { const g = zg('carte', '#0B1A3A'); const s7 = sc('s7');
      const org = K.g(g); S('rect', { x: -620, y: -360, width: 1000, height: 700, rx: 30, fill: C.p2 }, org); S('rect', { x: -660, y: -420, width: 1080, height: 80, rx: 24, fill: C.p1 }, org);
      K.A(org, { fin: [s7 - 1.5, .1] });
      const boxes = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const b = K.g(g); const x = -540 + c * 230, y = -300 + r * 160;
        S('rect', { x: -100, y: -65, width: 200, height: 130, rx: 14, fill: '#0F2350' }, b); const bk = ico('book', b, 0, 0, 1, C.amber); bk.setAttribute('transform', 'translate(0 5) scale(.6)');
        K.A(b, { x: x + 100, y: y + 65, pop: T('c20', r < 2 && c < 2 ? 'recul' : 'chaque') + (r * 4 + c) * .05 }); boxes.push({ b, x: x + 100, y: y + 70 }); }
      const hl = S('rect', { x: -540, y: -300, width: 200, height: 130, rx: 14, fill: 'none', stroke: C.rose, 'stroke-width': 8 }, g); K.A(hl, { fin: [T('c20', 'registre'), .3] });
      // sink on the roof + pipes
      const fun = K.g(g); const fi = ico('funnel', fun, 0, 0, 1, C.cyan); fi.setAttribute('transform', 'scale(1.6)'); K.A(fun, { x: -120, y: -560, pop: T('c20', 'sink') });
      const sinkTx = K.g(g); K.tx(sinkTx, 240, -580, 'sink agrégé', { size: 52, fill: C.cyan, weight: 800, anchor: 'start' }); K.A(sinkTx, { pop: T('c20', 'sink') + .2 });
      boxes.forEach((bx, i) => { const p = S('path', { d: `M ${bx.x} ${bx.y - 30} C ${bx.x} -420, -120 -380, -120 -500`, stroke: C.cyan, 'stroke-width': 5, fill: 'none', opacity: .8 }, g); K.A(p, { dash: [T('c20', 'copie') + i * .04, .9] }); });
      const pipe = S('path', { d: 'M -60 -560 L 560 -560 L 560 -200', stroke: C.cyan, 'stroke-width': 14, fill: 'none', 'stroke-linecap': 'round' }, g); K.A(pipe, { dash: [T('c20', 'sim') - .4, .7] });
      const siem = K.g(g); S('rect', { x: -110, y: -170, width: 220, height: 360, rx: 26, fill: C.cyan }, siem); for (let i = 0; i < 4; i++) S('rect', { x: -80, y: -130 + i * 70, width: 160, height: 36, rx: 10, fill: C.ink, opacity: .4 }, siem);
      K.tx(siem, 0, 240, 'SIEM', { size: 60, fill: C.cyan, weight: 800 }); K.A(siem, { x: 600, y: 60, pop: T('c20', 'sim') });
      const arch = K.g(g); for (let i = 0; i < 3; i++) S('rect', { x: -60, y: -40 - i * 56, width: 120, height: 50, rx: 10, fill: C.amber, opacity: 1 - i * .2 }, arch);
      K.tx(arch, 0, 60, '> 400 j', { size: 46, fill: C.amber, weight: 800 }); K.A(arch, { x: 820, y: 180, pop: T('c20', 'quatre') });
      travel('s7', 'carte', -100, -60, .62); K.focus(s7, org, 700);
      cam(T('c20', 'sink') - .5, .9, 'carte', 0, -460, 1.0); K.focus(T('c20', 'sink'), fun, 360);
      cam(T('c20', 'sim') - .5, 1.0, 'carte', 520, -40, 1.0); K.focus(T('c20', 'sim'), siem, 420);
      K.hot({ x: Z.carte[0] - 120, y: Z.carte[1] - 560, at: T('c20', 'sink'), until: sc('s8'), title: 'Créer le sink agrégé', html: '<pre>gcloud logging sinks create audit-vers-siem \\\n  pubsub.googleapis.com/projects/secops/topics/audit \\\n  --organization=ORG_ID --include-children \\\n  --log-filter=\'logName:"cloudaudit.googleapis.com"\'</pre><p>Puis donner au compte du sink le droit de publier sur la destination. Non intercepteur par défaut : les projets gardent leur copie.</p>' });
    }

    /* ================= S8 RÉSOLUTION (retour au bureau) ================= */
    { const B = EP._bureau, g = B.g, s8 = sc('s8');
      // remove the clock: keep. Verdict pins on a board
      const board = K.g(g); S('rect', { x: -260, y: -170, width: 520, height: 340, rx: 24, fill: '#5b3a1e' }, board); S('rect', { x: -240, y: -150, width: 480, height: 300, rx: 18, fill: '#8a5a2b' }, board);
      K.A(board, { x: 620, y: -260, pop: T('c21', 'verdict') });
      const pinA = K.g(g); ico('key', pinA, 0, 0, 1, C.orange).setAttribute('transform', 'translate(-110 -40)'); K.tx(pinA, -110, 60, '03:07', { size: 44, mono: true, fill: C.text, weight: 700 }); K.A(pinA, { x: 620, y: -260, pop: T('c21', 'utilisee') });
      const pinB = K.g(g); ico('door', pinB, 0, 0, 1, C.rose).setAttribute('transform', 'translate(110 -40) scale(.8)'); K.tx(pinB, 110, 60, '03:09', { size: 44, mono: true, fill: C.text, weight: 700 }); K.A(pinB, { x: 620, y: -260, pop: T('c21', 'secours') });
      // remediation: crown flies off, keys crossed, alert -> green
      B.crown._a.o.moves = [[T('c21', 'retire'), .7, { x: -500, y: -300, s: .3, a: 0 }]];
      B.aOwner.o.out = T('c21', 'retire');
      const x1 = I('cross', g, 510, -300, .9, C.green, { pop: T('c21', 'supprime') }); const x2 = I('cross', g, 730, -300, .9, C.green, { pop: T('c21', 'supprime') + .2 }); K.ev(T('c21', 'supprime'), 'impact');
      const okG = K.g(B.mon); S('rect', { x: -305, y: -168, width: 570, height: 74, rx: 14, fill: C.green }, okG); K.tx(okG, -20, -131, 'CONTENU', { size: 50, fill: C.ink, weight: 800, ls: 4 });
      K.A(okG, { pop: T('c21', 'supprime') + .5, out: T('c22', 'vos') });
      B.aMail.o.out = T('c22', 'vos'); B.aAlert.o.out = T('c21', 'supprime') + .5;
      // 3 actions on the desk
      const act = (name, col, label, word, i) => { const a = K.g(g); S('rect', { x: -150, y: -120, width: 300, height: 240, rx: 26, fill: C.p1, stroke: col, 'stroke-width': 6 }, a);
        ico(name, a, 0, 0, 1, col).setAttribute('transform', 'translate(0 -30) scale(1.1)'); K.tx(a, 0, 72, label, { size: 44, fill: col, weight: 800 });
        K.A(a, { x: -420 + i * 340, y: -60, pop: T('c22', word), out: T('c23', 'maintenant') }); return a; };
      const A1 = act('bell', C.amber, 'Alerte', 'alerte', 0), A2 = act('funnel', C.cyan, 'Sink', 'sink', 1), A3 = act('cam', C.violet, 'Data Access', 'data', 2);
      // recap bubbles return with checks
      const chk = []; B.B.forEach((b, i) => { const c = I('check', g, -350 + i * 170 + 50, -320, .7, C.green, { pop: T('c23', 'qui') + i * .25 }); chk.push(c); });
      B.B.forEach(b => { const o = b._a.o, t1 = o.out, t2 = T('c23', 'maintenant'); o.out = null; o.fn = (s, t) => { if (t >= t2) s.a *= P(t, t2, .4); else s.a *= 1 - P(t, t1, .4); }; });
      const msk = I('mask', g, -10, -360, 1.2, '#2A0F2E', { pop: T('c23', 'masques') });
      B.an.pose(T('c21', 'verdict'), 1.2, 'point', { x: 620, y: -260 }).expr(T('c21', 'retire'), 'happy').pose(T('c21', 'retire'), 1.0, 'nod')
        .pose(T('c22', 'vos'), 1.0, 'point', { x: -80, y: -60 }).pose(T('c23', 'maintenant'), 1.8, 'cheer').expr(T('c23', 'nuance'), 'neutral').pose(T('c23', 'nuance'), 1.6, 'shrug');
      cam(s8 - 1.4, 1.8, 'bureau', 200, -160, .9); K.focus(s8, board, 400);
      cam(T('c21', 'retire') - .3, .9, 'bureau', 100, -120, 1.15); K.focus(T('c21', 'retire'), B.mon, 420);
      cam(T('c22', 'vos') - .3, 1.0, 'bureau', -80, -60, 1.0); K.focus(T('c22', 'alerte'), A1, 300); K.focus(T('c22', 'sink'), A2, 300); K.focus(T('c22', 'data'), A3, 300);
      cam(T('c23', 'vous') - .2, 1.0, 'bureau', -60, -200, 1.15); K.focus(T('c23', 'qui'), chk[0], 520);
      cam(T('c23', 'nuance'), 2.5, 'bureau', 0, -60, .85);
      K.hot({ x: Z.bureau[0] - 80, y: Z.bureau[1] - 60, at: s8, until: 9999, title: 'Check-list de réponse', html: '<ol><li>Retirer le binding <code>roles/owner</code> du compte Gmail.</li><li>Supprimer/désactiver <b>toutes</b> les clés de <code>ci-deployer</code> (l\'ancienne fuitée et celle de 03:09).</li><li>Chercher d\'autres persistances : nouveaux comptes de service, autres bindings, clés SSH, ressources créées.</li><li>Étendre la recherche à tous les projets via le sink.</li></ol>' });
    }
  },
};
