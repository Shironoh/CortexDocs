/*META{"title":"Le registre qui n'oublie rien","h1":"Le registre qui n'oublie rien : Admin Activity, côté détection et réponse","eyebrow":"Google Cloud · Audit logs · v3","footer":"<p class='footer'>Itération v3, générée avec le skill v2. Sources : documentation Google Cloud (Cloud Audit Logs, Store log entries, AuditLog reference, Cloud Storage audit logging), règle Elastic « GCP Service Account Key Creation ». IP 203.0.113.47 = plage de documentation, compte Gmail fictif. Épisode suivant : centraliser les journaux de tous les projets (sink agrégé).</p>"}META*/
/* ---------- FICHE PERTINENCE (skill v2 §0) ----------
Termes nouveaux par scène : s1 projet (nommé) · s2 API (projet défini par son rôle, « organisation » dite « votre entreprise », nom à l'écran) · s3 Admin Activity ·
 s4 compte de service (SetIamPolicy dit « un changement de droits », nom à l'écran) · s5 Data Access · s6 aucun (CreateServiceAccountKey dit « il crée une nouvelle clé », nom à l'écran) · s7 aucun.
Beats : quota ⌈durée/2⌉ par cue, trous > 2,5 s audités par tools/beats.mjs.
Audience : analyste détection/réponse, ne connaît pas Google Cloud. Praticien sécu, débutant GCP.
Déjà su : log, alerte, timeline -> aucun rappel.
Ignore / croit à tort : structure organisation > projets + API ; "il faut activer les logs" ; "les logs diront ce qui a été volé" ; "retirer le rôle suffit".
3 actions : alerte sur ajout d'Owner + création de clé ; Data Access sur les données sensibles ; pivot sur l'identité + suppression de toutes les clés.
Question centrale : « Cette nuit, quelqu'un est devenu propriétaire de notre projet : que peut-on prouver, et comment le chasser ? »
Idées (4) : registre toujours écrit et inviolable ; anatomie d'une entrée ; angle mort des lectures ; persistance par clé -> pivot.
Coupé (budget, règle « supprimer une idée plutôt que comprimer ») : la centralisation multi-projets -> épisode 2.
Budget : 19 cues, 3 devinez, cible 177 s -> (177 - 19 - 4.5 - 2) x 2.6 ≈ 394 mots. Script : 394 mots.
Pourquoi sourcés : _Required = « entrées requises pour la conformité ou l'audit » (doc Store log entries) ; Data Access = volume (compromis observable).
Incertain (montré comme tel) : l'exfiltration des fichiers ; la fuite de la clé (« sans doute »).
---------------------------------------------------- */
const EP = {
  bg: '#0B1A3A', lead: .6, tail: 2, spotDark: .25,
  zones: { bureau: [0, 0], immeuble: [2300, 0], greffe: [4600, 0], atelier: [6900, 0], coffres: [6900, 1900], frise: [4600, 1900] },
  legend: [['#FFB703', 'Admin Activity (registre)'], ['#A78BFA', 'Data Access (lectures)'], ['#EF476F', 'Attaquant'], ['#FB8500', 'Compte de service / clé'], ['#22D3EE', 'Défense'], ['#06D6A0', 'Remédiation']],
  scenes: [
    { id: 's1', title: '3 h 12, l\'alerte' }, { id: 's2', title: 'Google Cloud en 20 s' }, { id: 's3', title: 'Le registre Admin Activity' },
    { id: 's4', title: 'Anatomie d\'une entrée' }, { id: 's5', title: 'L\'angle mort : les lectures' }, { id: 's6', title: 'La clé de secours' },
    { id: 's7', title: 'Verdict et réflexes' }],
  cues: [
    { id: 'c1', sc: 's1', sub: '3 h 12. Alerte : un compte Gmail inconnu vient de devenir propriétaire du projet prod-paiements.', say: 'Trois heures douze. Alerte : un compte Gmail inconnu vient de devenir propriétaire du projet prod paiements.' },
    { id: 'c2', sc: 's1', sub: 'Vous ne connaissez pas Google Cloud, mais c\'est à vous d\'enquêter. Seule piste : ses journaux. Qui ? Quand ? D\'où ? Et ensuite ?', say: 'Vous ne connaissez pas Google Cloud, mais c\'est à vous d\'enquêter. Seule piste : ses journaux. Qui ? Quand ? D\'où ? Et ensuite ?' },
    { id: 'c3', sc: 's2', sub: 'Imaginez un immeuble : le bâtiment, c\'est votre entreprise ; chaque projet, un étage, avec ses machines et ses données.', say: 'Imaginez un immeuble : le bâtiment, c\'est votre entreprise ; chaque projet, un étage, avec ses machines et ses données.' },
    { id: 'c4', sc: 's2', sub: 'Personne n\'entre par la fenêtre : console, ligne de commande ou script, tout passe par le guichet, l\'API. Chaque geste y laisse une trace.', say: 'Personne n\'entre par la fenêtre : console, ligne de commande ou script, tout passe par le guichet, l\'API. Chaque geste y laisse une trace.' },
    { id: 'c5', sc: 's3', sub: 'Sans rien configurer, a-t-on cette trace ? Oui : toute action qui modifie un réglage est écrite dans le registre Admin Activity.', say: 'Sans rien configurer, a-t-on cette trace ? Oui : toute action qui modifie un réglage est écrite dans le registre Admin Activity.' },
    { id: 'c6', sc: 's3', sub: 'On croit qu\'il faut l\'activer. Faux : il est toujours écrit, impossible à couper, gardé 400 jours. Google le juge indispensable à l\'audit.', say: 'On croit qu\'il faut l\'activer. Faux : il est toujours écrit, impossible à couper, gardé quatre cents jours. Google le juge indispensable à l\'audit.' },
    { id: 'c7', sc: 's3', sub: 'Devinez : devenu propriétaire, l\'attaquant peut-il effacer ce registre ?|Non : son coffre, _Required, ne se supprime pas. L\'historique est intact.', say: 'Devinez : devenu propriétaire, l\'attaquant peut-il effacer ce registre ? | Non : son coffre, Required, ne se supprime pas. L\'historique est intact.' },
    { id: 'c8', sc: 's4', sub: 'Ouvrons l\'entrée de 3 h 07. Quoi ? Un changement de droits : le rôle Owner, donné au compte Gmail.', say: 'Ouvrons l\'entrée de trois heures sept. Quoi ? Un changement de droits : le rôle Owner, donné au compte Gmail.' },
    { id: 'c9', sc: 's4', sub: 'Et qui a signé ?|Pas un humain : ci-deployer, un compte de service, l\'identité du robot de déploiement. Sa clé a sans doute fuité.', say: 'Et qui a signé ? | Pas un humain : ci déployeur, un compte de service, l\'identité du robot de déploiement. Sa clé a sans doute fuité.' },
    { id: 'c10', sc: 's4', sub: 'D\'où ? Une IP inconnue, et un outil déclaré par l\'appelant : un indice, pas une preuve. Ces quatre champs font une règle.', say: 'D\'où ? Une IP inconnue, et un outil déclaré par l\'appelant : un indice, pas une preuve. Ces quatre champs font une règle.' },
    { id: 'c11', sc: 's5', sub: 'A-t-il lu les fichiers clients ? Admin Activity note les modifications. Or une lecture ne modifie rien.', say: 'A-t-il lu les fichiers clients ? Admin Activity note les modifications. Or une lecture ne modifie rien.' },
    { id: 'c12', sc: 's5', sub: 'Ces lectures sont-elles notées ailleurs ?|Par défaut, non : elles relèvent d\'un autre registre, Data Access, éteint par défaut.', say: 'Ces lectures sont-elles notées ailleurs ? | Par défaut, non : elles relèvent d\'un autre registre, Data Access, éteint par défaut.' },
    { id: 'c13', sc: 's5', sub: 'Pourquoi ? Des millions de lectures : trop de volume, donc de coût. Résultat : impossible de prouver le vol, ou son absence.', say: 'Pourquoi ? Des millions de lectures : trop de volume, donc de coût. Résultat : impossible de prouver le vol, ou son absence.' },
    { id: 'c14', sc: 's6', sub: 'Et ensuite ? Réflexe d\'enquête : pivoter sur l\'identité, et filtrer tout ce qu\'a fait ce compte Gmail depuis 3 h 07.', say: 'Et ensuite ? Réflexe d\'enquête : pivoter sur l\'identité, et filtrer tout ce qu\'a fait ce compte Gmail depuis trois heures sept.' },
    { id: 'c15', sc: 's6', sub: '3 h 09 : il crée une nouvelle clé pour ci-deployer. Sa clé de secours, rien qu\'à lui.', say: 'Trois heures neuf : il crée une nouvelle clé pour ci déployeur. Sa clé de secours, rien qu\'à lui.' },
    { id: 'c16', sc: 's6', sub: 'On croit que retirer le rôle suffit. Faux : avec cette clé, il redevient ci-deployer, et peut se redonner le rôle.', say: 'On croit que retirer le rôle suffit. Faux : avec cette clé, il redevient ci déployeur, et peut se redonner le rôle.' },
    { id: 'c17', sc: 's7', sub: 'Verdict : clé volée utilisée à 3 h 07, clé de secours à 3 h 09. On retire Owner, on supprime toutes les clés du robot.', say: 'Verdict : clé volée utilisée à trois heures sept, clé de secours à trois heures neuf. On retire Owner, on supprime toutes les clés du robot.' },
    { id: 'c18', sc: 's7', sub: 'Vos trois réflexes : une alerte sur l\'ajout d\'Owner et la création de clé ; Data Access sur vos données sensibles ; le pivot sur l\'identité.', say: 'Vos trois réflexes : une alerte sur l\'ajout d\'Owner et la création de clé ; Data Access sur vos données sensibles ; le pivot sur l\'identité.' },
    { id: 'c19', sc: 's7', sub: 'Vous savez maintenant dire qui, quand, d\'où, et la suite. Nuance : l\'IP ou l\'e-mail sont parfois masqués.', say: 'Vous savez maintenant dire qui, quand, d\'où, et la suite. Nuance : l\'IP ou l\'e-mail sont parfois masqués.' },
  ],
  quiz: {
    c7: { q: 'Devenu Owner du projet, l\'attaquant peut-il effacer le registre Admin Activity ?', choices: ['Oui, Owner peut tout', 'Non, le bucket _Required ne se supprime pas', 'Seulement s\'il coupe l\'API Logging'], answer: 1, why: 'Le bucket _Required ne peut être ni supprimé ni modifié, sa rétention de 400 jours est fixe, et Admin Activity est écrit même si l\'API Cloud Logging est désactivée.' },
    c9: { q: 'Qui a signé la modification de 3 h 07 ?', choices: ['Le compte Gmail inconnu', 'Un administrateur interne', 'Le compte de service ci-deployer'], answer: 2, why: 'principalEmail = ci-deployer@prod-paiements.iam.gserviceaccount.com : le robot de déploiement.' },
    c12: { q: 'Les téléchargements de fichiers dans un bucket sont-ils journalisés ?', choices: ['Oui, dans Admin Activity', 'Non par défaut : Data Access est désactivé', 'Oui, dans System Event'], answer: 1, why: 'Lire des objets relève de Data Access (DATA_READ), désactivé par défaut pour Cloud Storage.' },
  },
  poster: K => K.T('c1', 'compte') + .8,
  build(K) {
    const { S, E, Z } = K; const T = K.T, R = K.reveal;
    const main = K.layers.main, far = K.layers.far, front = K.layers.front;
    const C = { amber: '#FFB703', orange: '#FB8500', cyan: '#22D3EE', rose: '#EF476F', green: '#06D6A0', violet: '#A78BFA', text: '#F8FAFC', ink: '#0B1A3A', p1: '#14295C', p2: '#1E3A8A' };
    const FLOOR = 250; // characters stand on y=250 (zone coords)
    const zg = (name, tint) => { const g = K.g(main, { transform: `translate(${Z[name][0]} ${Z[name][1]})` });
      const room = S('rect', { x: -1000, y: -560, width: 2000, height: 1120, rx: 80, fill: tint, opacity: .8 }, g);
      S('rect', { x: -1000, y: FLOOR, width: 2000, height: 560 - FLOOR, rx: 40, fill: '#081330', opacity: .75 }, g);
      S('rect', { x: -1000, y: FLOOR - 6, width: 2000, height: 12, fill: '#26407e', opacity: .8 }, g); g._room = room; return g; };
    // décor de zone (skill v2 « décor qui remplit ») : murs et sol habités, à l'écart des sujets
    const decor = (g, o = {}) => { const wall = o.wall || '#1E3A8A';
      for (const sx of [-1, 1]) { const x = sx * 820; S('rect', { x: x - 90, y: -420, width: 180, height: 240, rx: 14, fill: wall, opacity: .55 }, g);
        for (let k = 0; k < 3; k++) S('rect', { x: x - 70, y: -400 + k * 74, width: 140, height: 56, rx: 8, fill: o.acc || '#FFB703', opacity: .14 + .06 * k }, g);
        S('rect', { x: x - 110, y: -120, width: 220, height: 18, rx: 9, fill: wall, opacity: .8 }, g);
        for (let k = 0; k < 4; k++) S('rect', { x: x - 96 + k * 50, y: -168, width: 38, height: 48, rx: 6, fill: ['#22D3EE', '#FFB703', '#EF476F', '#A78BFA'][(k + (o.seed || 0)) % 4], opacity: .35 }, g); }
      for (let k = 0; k < 9; k++) S('rect', { x: -1000 + k * 230, y: 300 + (k % 2) * 60, width: 150, height: 10, rx: 5, fill: '#26407e', opacity: .55 }, g);
      S('path', { d: 'M -1000 -500 L 1000 -500', stroke: '#26407e', 'stroke-width': 16, opacity: .6 }, g); for (let k = 0; k < 6; k++) S('circle', { cx: -900 + k * 360, cy: -500, r: 14, fill: '#26407e' }, g); };
    const I = (name, parent, x, y, s, c, o = {}) => { const g = ico(name, parent, 0, 0, 1, c); g._a = K.A(g, { x, y, s, ...o }); return g; };
    const G = (parent, x, y, o = {}) => { const g = K.g(parent); g._a = K.A(g, { x, y, ...o }); return g; };
    const sc = id => K.sc(id).start;
    const F = (t, d, tg, part, o) => K.frame(t, d, tg, part, o);
    // ---------- FAR layer
    for (let i = 0; i < 160; i++) { const x = -800 + (i * 977) % 6200, y = -700 + (i * 613) % 2400;
      const st = S('circle', { cx: x, cy: y, r: 2 + (i % 3), fill: '#cfe3ff', opacity: .25 + (i % 5) * .08 }, far);
      if (i % 7 === 0) K.fx(t => st.setAttribute('opacity', AMBIENT ? (.2 + .3 * Math.abs(Math.sin(t * .8 + i))).toFixed(2) : .35)); }
    for (let i = 0; i < 16; i++) { const x = -600 + i * 380, y = (i % 2 ? -260 : 900) + (i % 3) * 120;
      S('path', { d: 'M 0 -120 L 104 -60 L 104 60 L 0 120 L -104 60 L -104 -60 Z', fill: '#1E3A8A', opacity: .22, transform: `translate(${x} ${y}) scale(${1 + (i % 3) * .4})` }, far); }
    // ---------- FRONT layer: silhouettes only on travel paths (midpoints) and at far edges
    const fr = (wx, wy, name, s, rot = 0) => { const g = ico(name, front, 0, 0, 1, '#040916'); g.setAttribute('transform', `translate(${wx * 1.3} ${wy * 1.3}) scale(${s}) rotate(${rot})`); };
    [[1150, 0], [3450, 0], [5750, 0], [7700, 950], [5750, 1900]].forEach(([x, y], i) => { fr(x, y + 380, 'plant', 3.2, i % 2 ? 8 : -6); });
    for (const [zx, zy] of Object.values(Z)) { fr(zx - 1080, zy + 520, 'plant', 2.6, -4); fr(zx + 1080, zy + 520, 'plant', 2.4, 6); }
    S('path', { d: 'M -1600 -900 Q 3000 -640 9800 -880', stroke: '#040916', 'stroke-width': 30, fill: 'none' }, front);
    // ---------- inhabited travel corridors (main layer)
    const corridor = (x0, y0, x1, y1) => { S('path', { d: `M ${x0} ${y0} L ${x1} ${y1}`, stroke: '#14295C', 'stroke-width': 70, 'stroke-linecap': 'round' }, main);
      S('path', { d: `M ${x0} ${y0} L ${x1} ${y1}`, stroke: C.amber, 'stroke-width': 6, 'stroke-dasharray': '18 26', opacity: .4 }, main); };
    corridor(1000, 320, 1300, 320); corridor(3300, 320, 3600, 320); corridor(5600, 320, 5900, 320); corridor(6900, 560, 6900, 1340); corridor(5600, 2220, 5900, 2220); corridor(3600, 1700, 1000, 300);

    /* ================= S1 BUREAU ================= */
    const B = {};
    { const g = zg('bureau', '#13285e'); decor(g, { seed: 0 }); B.g = g;
      const win = G(g, -620, -330); S('rect', { x: -150, y: -115, width: 300, height: 230, rx: 20, fill: '#081330', stroke: C.p2, 'stroke-width': 10 }, win);
      S('circle', { cx: 40, cy: -40, r: 38, fill: '#F8FAFC', opacity: .9 }, win); S('circle', { cx: 56, cy: -52, r: 34, fill: '#081330' }, win);
      const clock = G(g, 640, -360, { out: T('c2', 'vous') }); S('rect', { x: -110, y: -48, width: 220, height: 96, rx: 18, fill: '#081330', stroke: C.p2, 'stroke-width': 6 }, clock);
      K.tx(clock, 0, 2, '03:12', { size: 62, fill: C.rose, mono: true, weight: 700 });
      const desk = K.g(g); S('rect', { x: -560, y: 60, width: 900, height: 44, rx: 14, fill: C.p2 }, desk); S('rect', { x: -520, y: 104, width: 28, height: 146, fill: C.p1 }, desk); S('rect', { x: 280, y: 104, width: 28, height: 146, fill: C.p1 }, desk);
      const mon = G(g, -110, -170); S('rect', { x: -330, y: -190, width: 660, height: 380, rx: 24, fill: C.p1, stroke: '#26407e', 'stroke-width': 6 }, mon);
      S('rect', { x: -305, y: -168, width: 610, height: 334, rx: 14, fill: '#071028' }, mon); S('rect', { x: -40, y: 190, width: 80, height: 40, fill: C.p1 }, mon);
      const alertG = G(mon, 0, -126, { pop: T('c1', 'alerte'), fn: (s, t) => { if (AMBIENT && t < sc('s2')) s.a *= .75 + .25 * Math.abs(Math.sin(t * 5)); } });
      S('rect', { x: -305, y: -42, width: 610, height: 84, rx: 14, fill: C.rose }, alertG); K.tx(alertG, 0, 2, 'ALERTE', { size: 56, fill: C.ink, weight: 800, ls: 4 });
      K.ev(T('c1', 'alerte'), 'impact');
      const mail = G(mon, 0, -10, { pop: T('c1', 'gmail') }); K.tx(mail, 0, 0, 'nuitblanche42@gmail.com', { size: 44, mono: true, fill: C.rose, weight: 700 });
      const owner = G(mon, 0, 100, { pop: T('c1', 'proprietaire') }); ico('crown', owner, 0, 0, 1, C.amber).setAttribute('transform', 'translate(-120 0)'); K.tx(owner, 50, 6, 'Owner', { size: 56, fill: C.amber, weight: 800 });
      const an = K.char(g, { name: 'analyste', color: C.cyan, x: 520, y: FLOOR, s: 1.5, dir: -1, headset: true });
      an.pose(0, T('c1', 'alerte') - .1, 'type').pose(T('c1', 'alerte'), .8, 'jump').expr(T('c1', 'alerte'), 'surprise').look(T('c1', 'alerte'), -110, -170)
        .expr(T('c2', 'vous'), 'worried').pose(T('c2', 'connaissez'), 1.4, 'shrug').expr(T('c2', 'denqueter'), 'neutral').walk(T('c2', 'denqueter'), 1.0, 420)
        .pose(T('c2', 'journaux'), 6.5, 'loupe').look(T('c2', 'qui'), -110, -480);
      const cq = G(g, 420, -170, { pop: T('c2', 'google'), out: T('c2', 'denqueter') }); S('ellipse', { rx: 120, ry: 70, fill: C.text }, cq); S('circle', { cx: -70, cy: 20, r: 55, fill: C.text }, cq); S('circle', { cx: 70, cy: 25, r: 50, fill: C.text }, cq); K.tx(cq, 0, 6, '?', { size: 80, fill: C.ink, weight: 800, deco: true });
      const bub = (name, i, word) => { const b = G(g, -365 + i * 170, -470, { pop: T('c2', word), out: sc('s2') - .4 }); S('circle', { r: 66, fill: C.p2, stroke: C.cyan, 'stroke-width': 6 }, b); ico(name, b, 0, 0, 1, C.text).setAttribute('transform', 'scale(.9)'); return b; };
      const Bs = [bub('person', 0, 'qui'), bub('clock', 1, 'quand'), bub('pin', 2, 'dou'), bub('steps', 3, 'ensuite')];
      Object.assign(B, { mon, alertG, mail, owner, an, Bs, desk, clock });
      // shots: ensemble -> gros plan monitor -> travail analyst+monitor -> bubbles
      F(0, 0, [g._room], .98, { focus: false }); K.focus(0, mon);
      F(T('c1', 'alerte') - .3, 1.0, [mon], .72);
      F(T('c1', 'projet') - .2, 1.2, [mail, owner], .8, { focus: false }); K.focus(T('c1', 'projet'), owner);
      F(T('c2', 'vous') - .3, 1.0, [mon, an], .8);
      F(T('c2', 'qui') - .5, .9, [...Bs, mon], .78, { focus: false }); K.focus(T('c2', 'qui'), Bs[0]); K.focus(T('c2', 'quand'), Bs[1]); K.focus(T('c2', 'dou'), Bs[2]); K.focus(T('c2', 'ensuite'), Bs[3]);
      K.hot({ x: Z.bureau[0] - 110, y: Z.bureau[1] - 170, at: 0, until: sc('s2'), title: 'D\'où vient cette alerte ?', html: '<p>Une alerte basée sur les journaux (Cloud Monitoring) ou une règle SIEM qui surveille <code>protoPayload.methodName="SetIamPolicy"</code> avec un ajout de <code>roles/owner</code>.</p><p>Compte Gmail et IP fictifs (203.0.113.0/24 = plage de documentation).</p>' });
    }

    /* ================= S2 IMMEUBLE ================= */
    { const g = zg('immeuble', '#16224f'); decor(g, { seed: 1 }); const s2 = sc('s2');
      const bld = G(g, 0, -170, { pop: T('c3', 'immeuble') }); S('rect', { x: -330, y: -370, width: 660, height: 790, rx: 26, fill: C.p2 }, bld); S('rect', { x: -360, y: -420, width: 720, height: 70, rx: 20, fill: C.p1 }, bld);
      const roof = G(g, 0, -555, { pop: T('c3', 'entreprise') }); K.tx(roof, 0, 0, 'Organisation', { size: 54, fill: C.amber, weight: 800 });
      const floors = [-430, -220, -10].map((y, i) => { const f = G(g, 0, y, { pop: T('c3', 'immeuble') + .15 * (i + 1) }); S('rect', { x: -300, y: -90, width: 600, height: 180, rx: 16, fill: '#0F2350' }, f);
        for (let k = 0; k < 4; k++) S('rect', { x: -270 + k * 140, y: -60, width: 110, height: 50, rx: 8, fill: '#FFF2C4', opacity: .12 }, f); return f; });
      const prod = floors[1]; const glow = S('rect', { x: -300, y: -310, width: 600, height: 180, rx: 16, fill: 'none', stroke: C.amber, 'stroke-width': 8 }, g); K.A(glow, { fin: [T('c3', 'projet'), .4] });
      const plab = G(g, 0, -270, { pop: T('c3', 'projet') + .1 }); K.tx(plab, 0, 0, 'prod-paiements', { size: 50, fill: C.amber, weight: 700, mono: true });
      I('server', g, -190, -185, .8, C.cyan, { pop: T('c3', 'machines') }); I('server', g, -80, -185, .8, C.cyan, { pop: T('c3', 'machines') + .1 });
      I('barrel', g, 90, -185, .7, C.text, { pop: T('c3', 'donnees') }); I('barrel', g, 190, -185, .7, C.text, { pop: T('c3', 'donnees') + .1 });
      const door = G(g, 0, 160, { pop: T('c3', 'immeuble') + .5 }); S('rect', { x: -80, y: -60, width: 160, height: 120, rx: 10, fill: '#071028' }, door);
      const desk = G(g, 0, 205, { pop: T('c4', 'guichet'), fn: (s, t) => { s.s *= 1 + .14 * Math.sin(Math.PI * P(t, T('c4', 'lapi'), .5)); } });
      S('rect', { x: -170, y: -42, width: 340, height: 84, rx: 16, fill: C.amber }, desk); K.tx(desk, 0, 2, 'API', { size: 58, fill: C.ink, weight: 800 });
      const xw = I('cross', g, 230, -10, .9, C.rose, { pop: T('c4', 'fenetre') }); K.ev(T('c4', 'fenetre'), 'impact');
      const toks = [['laptop', C.cyan, 'console'], ['terminal', C.green, 'ligne'], ['gear', C.violet, 'script']].map(([n, col, w], i) => { const tt = T('c4', w);
        return I(n, g, -900, 120, 1.3, col, { pop: tt, moves: [[tt + .2, 1.0, { x: -280 - i * 150, y: 120 }], [T('c4', 'lapi') + .2 + i * .15, .6, { x: 0, y: 160, s: .2, a: 0 }]] }); });
      const slips = []; for (let i = 0; i < 4; i++) { const t0 = T('c4', 'trace') + i * .18; slips.push(I('slip', g, 0, 170, 1.2, C.amber, { pop: t0, moves: [[t0 + .2, 1.6, { x: 950 + i * 40, y: 40 - i * 50 }, E.ic]], out: t0 + 1.6 })); }
      const an = K.char(g, { name: 'analyste', color: C.cyan, x: -1000, y: FLOOR, s: 1.4, headset: true });
      an.pop(s2 - .5).walk(s2 - .2, 1.4, -640).pose(T('c3', 'immeuble'), 1.2, 'point', { x: -100, y: -300 }).look(T('c3', 'projet'), 0, -270)
        .pose(T('c4', 'fenetre'), 1.0, 'point', { x: 230, y: -10 }).look(T('c4', 'console'), -800, 120).look(T('c4', 'guichet'), 0, 200).pose(T('c4', 'trace'), .9, 'nod').expr(T('c4', 'trace'), 'happy');
      F(s2 - 1.3, 1.5, [bld, roof, an], .9, { focus: false }); K.focus(s2, bld);
      F(T('c3', 'projet') - .3, .9, [prod], .72);
      F(T('c4', 'personne') - .3, 1.0, [an, desk, xw], .8);
      F(T('c4', 'lapi') - .4, .8, [desk, ...toks], .62, { focus: false }); K.focus(T('c4', 'lapi'), desk);
      K.hot({ x: Z.immeuble[0], y: Z.immeuble[1] - 555, at: s2, until: sc('s3'), title: 'Hiérarchie réelle', html: '<p>Simplifié : <b>Organisation → Dossiers → Projets → ressources</b>. Les droits (IAM) se posent à chaque niveau et s\'héritent vers le bas.</p>' });
    }

    /* ================= S3 GREFFE (registre) ================= */
    { const g = zg('greffe', '#221f55'); decor(g, { seed: 2 }); const s3 = sc('s3');
      const lect = G(g, 0, 160); S('path', { d: 'M -130 90 L -70 -150 L 70 -150 L 130 90 Z', fill: C.p2 }, lect);
      const glow = S('ellipse', { cx: 0, cy: -120, rx: 300, ry: 170, fill: C.amber, opacity: .18 }, g); K.A(glow, { fin: [T('c5', 'admin'), .5] });
      const book = G(g, 0, -130, { fn: (s, t) => { s.s *= 1 + .08 * Math.sin(Math.PI * P(t, T('c5', 'admin'), .6)); } }); ico('book', book, 0, 0, 1, C.amber).setAttribute('transform', 'scale(3.4)');
      for (let i = 0; i < 5; i++) K.A(S('rect', { x: -180, y: -70 + i * 34, width: 140, height: 12, rx: 6, fill: C.ink, opacity: .35 }, book), { fin: [T('c5', 'ecrite') + i * .3, .2] });
      const ban = G(g, 0, -420, { pop: T('c5', 'admin') }); S('rect', { x: -300, y: -46, width: 600, height: 92, rx: 46, fill: C.amber }, ban); K.tx(ban, 0, 2, 'Admin Activity', { size: 58, fill: C.ink, weight: 800 });
      for (let i = 0; i < 3; i++) { const t0 = T('c5', 'modifie') + i * .25; I('slip', g, -950, -300 + i * 40, 1.2, C.amber, { pop: t0, moves: [[t0, 1.1, { x: 0, y: -130, s: .4 }, E.ioc]], out: t0 + 1.1 }); }
      const nog = G(g, -800, -190, { pop: T('c5', 'configurer'), out: T('c5', 'oui') }); ico('gear', nog, 0, 0, 1, C.violet); ico('cross', nog, 0, 0, 1, C.rose).setAttribute('transform', 'scale(.9)');
      const qb = G(g, -700, -230, { pop: T('c5', 'trace'), out: T('c5', 'oui') + .3 }); S('circle', { r: 56, fill: C.text }, qb); K.tx(qb, 0, 4, '?', { size: 70, fill: C.ink, weight: 800, deco: true });
      const sw = G(g, -560, -60, { pop: T('c6', 'croit') }); S('rect', { x: -70, y: -130, width: 140, height: 260, rx: 34, fill: C.p1, stroke: C.text, 'stroke-width': 6 }, sw); S('rect', { x: -48, y: -106, width: 96, height: 104, rx: 22, fill: C.green }, sw);
      const ring = G(g, -560, -60, { fin: [T('c6', 'toujours'), .3], out: T('c6', 'quatre') }); S('rect', { x: -110, y: -170, width: 220, height: 340, rx: 50, fill: 'none', stroke: C.green, 'stroke-width': 10 }, ring);
      const lock = I('padlock', g, -560, 10, 1.3, C.text, { pop: T('c6', 'faux'), moves: [[T('c6', 'faux'), .3, { y: 40 }, E.ob], [T('c6', 'couper'), .5, { s: 1.7 }, E.ob]] }); K.ev(T('c6', 'faux'), 'impact');
      const cal = G(g, 560, -130, { pop: T('c6', 'quatre'), out: T('c7', 'devinez') }); S('rect', { x: -120, y: -110, width: 240, height: 220, rx: 18, fill: C.text }, cal); S('rect', { x: -120, y: -110, width: 240, height: 60, rx: 18, fill: C.rose }, cal);
      K.tx(cal, 0, 4, '400', { size: 80, fill: C.ink, weight: 800 }); K.tx(cal, 0, 82, 'jours', { size: 44, fill: C.ink, weight: 600 });
      // why: stamp "audit" on the book
      const stamp = G(g, 560, 90, { pop: T('c6', 'indispensable'), out: T('c7', 'devinez'), r: -10 }); S('rect', { x: -150, y: -46, width: 300, height: 92, rx: 14, fill: 'none', stroke: C.rose, 'stroke-width': 8 }, stamp);
      K.tx(stamp, 0, 2, 'AUDIT', { size: 58, fill: C.rose, weight: 800, ls: 6 }); K.ev(T('c6', 'indispensable'), 'impact');
      const vil = K.char(g, { name: 'attaquant', color: C.rose, x: 900, y: FLOOR, s: 1.4, dir: -1, mask: true, expr: 'smug' });
      vil.pop(T('c7', 'devinez')).walk(T('c7', 'devinez') + .2, 1.4, 420).pose(T('c7', 'effacer'), R('c7') - T('c7', 'effacer'), 'point', { x: 0, y: -130 })
        .expr(R('c7'), 'angry').pose(R('c7') + .05, .7, 'jump').slide(R('c7') + .1, .5, 640);
      const eraser = G(g, 300, -60, { pop: T('c7', 'registre'), out: R('c7') + .1, moves: [[R('c7') + .1, .5, { x: 700, y: -300, r: 90 }]] }); S('rect', { x: -60, y: -26, width: 120, height: 52, rx: 12, fill: '#f9a8d4' }, eraser); S('rect', { x: 10, y: -26, width: 50, height: 52, rx: 12, fill: C.violet }, eraser);
      const dome = G(g, 0, -190, { fin: [R('c7'), .1], moves: [[R('c7'), .35, { y: -130 }, E.ob]] }); S('path', { d: 'M -310 160 L -310 -40 A 310 270 0 0 1 310 -40 L 310 160 Z', fill: '#BDEBFF', 'fill-opacity': .14, stroke: '#BDEBFF', 'stroke-width': 8 }, dome);
      const req = G(dome, 0, 210, { pop: T('c7', 'required') }); I('cross', g, 260, -220, .9, C.rose, { pop: T('c7', 'supprime'), out: T('c7', 'intact'), moves: [[T('c7', 'supprime') + .2, .6, { x: 420, y: -320, r: 40 }]] });
      S('rect', { x: -160, y: -36, width: 320, height: 72, rx: 36, fill: C.text }, req); K.tx(req, 0, 2, '_Required', { size: 50, fill: C.ink, weight: 800, mono: true });
      K.ev(R('c7'), 'impact'); K.mark(R('c7'));
      const an = K.char(g, { name: 'analyste', color: C.cyan, x: -1050, y: FLOOR, s: 1.4, headset: true });
      an.pop(s3 - .5).walk(s3 - .2, 1.3, -800).look(T('c5', 'trace'), 0, -130).pose(T('c5', 'oui'), .8, 'nod').expr(T('c5', 'oui'), 'happy')
        .expr(T('c6', 'croit'), 'smug').walk(T('c6', 'croit'), .9, -760).pose(T('c6', 'lactiver'), 1.2, 'point', { x: -560, y: -60 }).expr(T('c6', 'faux'), 'surprise').pose(T('c6', 'faux'), .6, 'jump')
        .expr(T('c6', 'quatre'), 'neutral').look(T('c6', 'quatre'), 560, -130).expr(T('c7', 'devinez'), 'worried').look(T('c7', 'devinez'), 420, -40)
        .expr(R('c7') + .3, 'happy').pose(T('c7', 'intact'), 1.4, 'cheer');
      F(s3 - 1.3, 1.5, [book, lect, an], .9, { focus: false }); K.focus(s3, book);
      F(T('c5', 'admin') - .5, .9, [book, ban], .72);
      F(T('c6', 'croit') - .3, .9, [an, sw], .6);
      F(T('c6', 'quatre') - .4, .9, [cal], .5); F(T('c6', 'indispensable') - .4, .8, [cal, stamp, book], .75, { focus: false }); K.focus(T('c6', 'indispensable'), stamp);
      F(T('c7', 'devinez') - .3, 1.0, [book, vil, an], .92, { focus: false }); K.focus(T('c7', 'devinez'), vil);
      F(R('c7') - .1, .6, [dome], .72);
      K.hot({ x: Z.greffe[0] - 200, y: Z.greffe[1] - 420, at: s3, until: sc('s4'), title: 'Les 4 journaux d\'audit', html: '<p><b>Admin Activity</b> : modifications de configuration/métadonnées. Toujours écrit, non désactivable → bucket <code>_Required</code>, 400 jours fixes.</p><p><b>Data Access</b> : lectures de config et lectures/écritures de données. Désactivé par défaut (sauf certains services BigQuery) → <code>_Default</code>, 30 jours par défaut.</p><p><b>System Event</b> : actions de Google (toujours écrit). <b>Policy Denied</b> : accès refusés par une politique de sécurité.</p>' });
    }

    /* ================= S4 ATELIER (anatomie) ================= */
    { const g = zg('atelier', '#123257'); decor(g, { seed: 3 }); const s4 = sc('s4');
      const card = G(g, 0, -150, { fin: [T('c8', 'ouvrons') - .3, .3], moves: [[T('c8', 'ouvrons') - .3, .9, { y: -150 }, E.oc]], out: T('c10', 'champs') });
      card._a.by = 700; S('rect', { x: -540, y: -330, width: 1080, height: 640, rx: 36, fill: '#E8EEF9' }, card); S('rect', { x: -540, y: -330, width: 1080, height: 120, rx: 36, fill: C.amber }, card);
      S('rect', { x: -540, y: -250, width: 1080, height: 40, fill: C.amber }, card); K.tx(card, 0, -268, 'Entrée de 03:07', { size: 58, fill: C.ink, weight: 800 });
      const slotDef = [['wrench', -255, -60], ['plusminus', 255, -60], ['person', 255, 170], ['pin', -255, 170]];
      const slots = slotDef.map(([icn, x, y], i) => { const sg = G(card, x, y, { pop: T('c8', 'ouvrons') + .4 + i * .12 }); S('rect', { x: -235, y: -95, width: 470, height: 190, rx: 24, fill: '#CBD5E8' }, sg);
        ico(icn, sg, 0, 0, 1, C.ink).setAttribute('transform', 'translate(-165 0) scale(.85)'); return { sg, x, y }; });
      const val = (i, str, word, cue, until, o = {}) => { const vg = G(card, slots[i].x, slots[i].y, { pop: T(cue, word), out: until }); K.tx(vg, 50, 0, str, { size: o.size || 44, fill: o.fill || C.ink, weight: 700, mono: !!o.mono });
        const hl = S('rect', { x: slots[i].x - 241, y: slots[i].y - 101, width: 482, height: 202, rx: 28, fill: 'none', stroke: o.stroke || C.cyan, 'stroke-width': 8 }, card); K.A(hl, { fin: [T(cue, word), .3], out: until }); return vg; };
      const v0 = val(0, 'SetIamPolicy', 'changement', 'c8', T('c9', 'et'), { mono: true, size: 44 });
      const v1 = val(1, '+ Owner', 'owner', 'c8', T('c10', 'dou'), { fill: '#b45309', size: 60, stroke: C.amber });
      const v2 = val(2, 'ci-deployer', 'ci', 'c9', T('c10', 'champs'), { mono: true, size: 44, fill: '#c2410c', stroke: C.orange });
      const v3 = val(3, '203.0.113.47', 'ip', 'c10', T('c10', 'champs'), { mono: true, size: 40 });
      const unl = I('padlock', card, -60, -60, .55, C.cyan, { pop: T('c8', 'droits'), out: T('c9', 'et'), moves: [[T('c8', 'droits') + .3, .4, { y: -80 }, E.ob]] });
      const hop = I('crown', card, 120, -60, .5, C.amber, { pop: T('c8', 'gmail'), out: T('c10', 'dou'), moves: [[T('c8', 'gmail') + .1, .5, { y: -110 }, E.ob]] });
      const ua = G(g, -255, 150, { pop: T('c10', 'outil'), out: T('c10', 'champs'), fn: (s, t) => { const ti = T('c10', 'indice'); if (t > ti) s.r = 5 * Math.sin((t - ti) * 12) * (1 - P(t, ti, 1.2)); } });
      S('rect', { x: -160, y: -38, width: 320, height: 76, rx: 38, fill: C.ink, stroke: C.rose, 'stroke-width': 5, 'stroke-dasharray': '14 10' }, ua); K.tx(ua, 0, 2, 'gcloud ?', { size: 46, fill: C.rose, weight: 700, mono: true });
      const qq = G(card, 255 + 50, 170, { pop: T('c9', 'signe'), out: R('c9') }); K.tx(qq, 0, 0, '?', { size: 90, fill: C.orange, weight: 800, deco: true });
      const robot = K.char(g, { name: 'ci-deployer', color: C.orange, shape: 'robot', x: 1100, y: FLOOR, s: 1.5, dir: -1 });
      robot.pop(T('c9', 'et') - .4).slide(T('c9', 'et'), .9, 700).expr(R('c9'), 'worried').pose(R('c9'), 1.6, 'hold').pose(T('c9', 'robot'), 1.2, 'cheer');
      const badge = G(g, 700, 30, { pop: T('c9', 'compte') }); S('rect', { x: -70, y: -46, width: 140, height: 92, rx: 12, fill: C.text }, badge); ico('person', badge, 0, 0, 1, C.orange).setAttribute('transform', 'scale(.75)');
      const belt = G(g, 700, 190, { fin: [T('c9', 'deploiement') - .2, .3] }); S('rect', { x: -260, y: -14, width: 520, height: 28, rx: 14, fill: C.p2 }, belt);
      for (let i = 0; i < 3; i++) I('barrel', g, 470, 140, .55, C.orange, { pop: T('c9', 'deploiement') + i * .3, moves: [[T('c9', 'deploiement') + i * .3, 1.6, { x: 930 }]], out: T('c9', 'deploiement') + i * .3 + 1.5 });
      const key = ico('key', g, 0, 0, 1, C.orange); robot.hold(key); K.A(key, { pop: R('c9') });
      // uncertain leak: dashed ghost key drifting away with "?"
      const leak = G(g, 700, -160, { pop: T('c9', 'fuite'), moves: [[T('c9', 'fuite') + .2, 1.4, { x: 1000, y: -380 }]], out: T('c9', 'fuite') + 2.2 });
      const lk = ico('key', leak, 0, 0, 1, C.rose); lk.setAttribute('opacity', .55); K.tx(leak, 0, -70, '?', { size: 70, fill: C.rose, weight: 800, deco: true });
      const code = G(g, 0, -150, { pop: T('c10', 'champs'), out: sc('s5') - .3 }); S('rect', { x: -660, y: -230, width: 1320, height: 400, rx: 26, fill: '#071028', stroke: C.cyan, 'stroke-width': 5 }, code);
      const ct = K.tx(code, -620, -140, '', { size: 40, mono: true, anchor: 'start' });
      [['methodName', ' = "SetIamPolicy"'], ['principalEmail', ' = "ci-deployer@…"'], ['callerIp', ' = "203.0.113.47"'], ['bindingDeltas', ' : ADD roles/owner']].forEach(([k, v], i) => {
        const a = S('tspan', { x: -620, dy: i ? 88 : 0, fill: C.cyan }, ct); a.textContent = k; const b = S('tspan', { fill: C.text }, ct); b.textContent = v; });
      const an = K.char(g, { name: 'analyste', color: C.cyan, x: -1050, y: FLOOR, s: 1.4, headset: true });
      an.pop(s4 - .5).walk(s4 - .2, 1.3, -780).pose(T('c8', 'ouvrons'), 2.2, 'loupe').pose(T('c8', 'quoi'), 1.0, 'point', { x: -255, y: -210 }).pose(T('c8', 'owner'), 1.0, 'point', { x: 255, y: -210 })
        .expr(R('c9'), 'surprise').look(R('c9'), 820, 60).expr(T('c10', 'dou'), 'neutral').pose(T('c10', 'dou'), 1.2, 'point', { x: -255, y: 20 }).pose(T('c10', 'indice'), 1.2, 'shrug').expr(T('c10', 'champs'), 'happy');
      const cardArea = S('rect', { x: -540, y: -480, width: 1080, height: 640, fill: 'none' }, g);
      F(s4 - 1.3, 1.5, [cardArea, an], .92, { focus: false }); K.focus(s4, cardArea);
      F(T('c8', 'quoi') - .4, .8, [slots[0].sg], .62);
      F(T('c8', 'owner') - .4, .8, [slots[1].sg], .62);
      F(T('c9', 'et') - .3, .9, [robot, slots[2].sg], .8, { focus: false }); K.focus(T('c9', 'et'), robot);
      F(R('c9') - .1, .6, [robot, slots[2].sg, badge], .8, { focus: false }); K.focus(R('c9'), v2);
      F(T('c10', 'dou') - .4, .8, [slots[3].sg, ua], .6);
      F(T('c10', 'champs') - .3, .9, [code], .82);
      K.hot({ x: Z.atelier[0] + 300, y: Z.atelier[1] - 400, at: s4, until: sc('s5'), title: 'L\'entrée complète (extrait)', html: '<pre>{\n "logName": "projects/prod-paiements/logs/\n   cloudaudit.googleapis.com%2Factivity",\n "protoPayload": {\n  "methodName": "SetIamPolicy",\n  "authenticationInfo": {"principalEmail":\n   "ci-deployer@prod-paiements.iam.gserviceaccount.com"},\n  "requestMetadata": {"callerIp": "203.0.113.47",\n   "callerSuppliedUserAgent": "google-cloud-sdk gcloud/…"},\n  "serviceData": {"policyDelta": {"bindingDeltas": [\n   {"action":"ADD","role":"roles/owner",\n    "member":"user:nuitblanche42@gmail.com"}]}}\n }\n}</pre><p><code>callerIp</code> vaut <code>gce-internal-ip</code> ou <code>private</code> pour certains appels internes. <code>callerSuppliedUserAgent</code> n\'est pas authentifié.</p>' });
    }

    /* ================= S5 COFFRES (angle mort) ================= */
    { const g = zg('coffres', '#211d4f'); decor(g, { seed: 0 }); const s5 = sc('s5');
      const vault = G(g, -420, -120); S('circle', { r: 240, fill: C.p1, stroke: '#3a4f8f', 'stroke-width': 16 }, vault); S('circle', { r: 190, fill: '#071028' }, vault);
      for (let i = 0; i < 6; i++) ico('doc', vault, 0, 0, 1, C.text).setAttribute('transform', `translate(${-95 + (i % 3) * 95} ${-55 + Math.floor(i / 3) * 110}) scale(.9)`);
      const lift = I('doc', g, -420, -120, 1.2, C.text, { pop: s5 + .2, moves: [[s5 + .3, 1.0, { y: -330 }], [T('c11', 'admin'), .6, { y: -120, a: 0 }]] });
      const vlab = G(g, -420, -470, { pop: T('c11', 'fichiers') }); K.tx(vlab, 0, 0, 'factures-clients', { size: 50, mono: true, fill: C.text, weight: 700 });
      const sb = I('book', g, 520, -120, 2, C.amber, { out: T('c13', 'millions'), fn: (s, t) => { const p = P(t, T('c11', 'rien'), .8); s.r = 6 * Math.sin(p * Math.PI * 4) * (1 - p); } });
      const wline = G(g, 450, -150, { fin: [T('c11', 'modifications'), .3], out: T('c11', 'lecture') }); S('rect', { x: -60, y: -6, width: 120, height: 12, rx: 6, fill: C.ink, opacity: .5 }, wline);
      I('doc', g, -420, -120, 1, C.text, { pop: T('c11', 'lecture'), moves: [[T('c11', 'lecture'), 1.2, { x: 520, y: -260 }]], out: T('c11', 'rien') + .4 });
      const blank = I('cross', g, 520, -120, .9, C.rose, { pop: T('c11', 'rien') + .1, out: T('c12', 'ces') });
      // uncertain intruder: ghost silhouette with question mark
      const ghost = K.char(g, { name: 'inconnu', color: C.rose, x: -60, y: FLOOR, s: 1.4, ghost: true, mask: true });
      ghost.pop(T('c11', 'fichiers')).look(T('c11', 'fichiers'), -420, -120).out(T('c12', 'ces'));
      const qm = G(g, -60, -40, { pop: T('c11', 'fichiers') + .3, out: T('c12', 'ces') }); K.tx(qm, 0, 0, '?', { size: 110, fill: C.rose, weight: 800, deco: true });
      const camG = G(g, 140, -380, { fn: (s, t) => { s.r = AMBIENT ? 4 * Math.sin(t * .7) : 0; } }); ico('cam', camG, 0, 0, 1, C.violet).setAttribute('transform', 'scale(1.8)'); S('circle', { cx: 70, cy: 0, r: 18, fill: '#2b2350' }, camG);
      const dabook = I('book', g, 140, -40, 1.5, C.violet, { pop: T('c12', 'relevent'), out: T('c13', 'millions') }); K.A(S('rect', { x: -70, y: -50, width: 140, height: 100, rx: 10, fill: '#0B1A3A', opacity: .5 }, dabook), { fin: [T('c12', 'eteint'), .3] });
      const dalab = G(g, 140, -200, { pop: T('c12', 'data'), out: T('c13', 'millions') }); S('rect', { x: -200, y: -46, width: 400, height: 92, rx: 46, fill: C.violet }, dalab); K.tx(dalab, 0, 2, 'Data Access', { size: 54, fill: C.ink, weight: 800 });
      const off = G(g, 400, -380, { pop: T('c12', 'eteint'), out: T('c13', 'millions') }); S('rect', { x: -80, y: -44, width: 160, height: 88, rx: 44, fill: '#2b2350', stroke: C.violet, 'stroke-width': 5 }, off); K.tx(off, 0, 2, 'OFF', { size: 50, fill: C.violet, weight: 800 });
      const tor = G(g, 0, 0, { fin: [T('c13', 'millions'), .2], out: T('c13', 'resultat') }); const torSlips = []; for (let i = 0; i < 30; i++) torSlips.push(ico('slip', tor, 0, 0, 1, C.violet));
      K.fx(t => { const t0 = T('c13', 'millions'); torSlips.forEach((s, i) => { const ph = ((t - t0) * .9 + i / 30) % 1; const x = -650 + ph * 1300, y = -60 + Math.sin(i * 7.3) * 110 - ph * 40;
        s.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(1.1)`); }); });
      const meter = G(g, 720, -60, { pop: T('c13', 'volume'), out: T('c13', 'resultat') }); S('rect', { x: -50, y: -220, width: 100, height: 260, rx: 24, fill: C.p1, stroke: C.text, 'stroke-width': 5 }, meter);
      const fill = S('rect', { x: -36, y: 28, width: 72, height: 0, rx: 14, fill: C.rose }, meter); K.tx(meter, 0, 100, '€', { size: 72, fill: C.text, weight: 800, deco: true });
      K.fx(t => { const p = E.oc(P(t, T('c13', 'cout'), 1.2)); fill.setAttribute('height', 236 * p); fill.setAttribute('y', 28 - 236 * p); });
      const tl = G(g, 0, -60, { pop: T('c13', 'resultat') + .3 }); S('rect', { x: -560, y: -12, width: 360, height: 24, rx: 12, fill: C.text }, tl); S('rect', { x: 200, y: -12, width: 360, height: 24, rx: 12, fill: C.text }, tl);
      S('rect', { x: -200, y: -12, width: 400, height: 24, fill: 'none', stroke: C.text, 'stroke-width': 4, 'stroke-dasharray': '12 12' }, tl); K.tx(tl, 0, -100, '?', { size: 120, fill: C.violet, weight: 800, deco: true });
      K.tx(tl, -380, 70, '03:07', { size: 46, mono: true, fill: C.text, weight: 700 }); K.tx(tl, 380, 70, '03:12', { size: 46, mono: true, fill: C.text, weight: 700 });
      const ghost2 = K.char(g, { name: 'inconnu2', color: C.rose, x: 0, y: -90, s: .8, ghost: true, mask: true }); ghost2.pop(T('c13', 'vol', 1));
      const ddoc = G(g, 180, -230, { pop: T('c13', 'absence') }); S('path', { d: 'M -30 -40 L 14 -40 L 30 -24 L 30 40 L -30 40 Z', fill: 'none', stroke: C.text, 'stroke-width': 5, 'stroke-dasharray': '10 8' }, ddoc);
      const an = K.char(g, { name: 'analyste', color: C.cyan, x: -1050, y: FLOOR, s: 1.4, headset: true });
      an.pop(s5 - .5).walk(s5 - .2, 1.3, -760).look(T('c11', 'admin'), 520, -120).pose(T('c11', 'rien'), 1.2, 'point', { x: 520, y: -120 }).expr(T('c11', 'rien'), 'worried').look(T('c12', 'ces'), 140, -380)
        .pose(T('c12', 'notees'), 1.4, 'point', { x: 140, y: -380 }).expr(R('c12'), 'angry').walk(T('c13', 'pourquoi'), 1.0, -560).expr(T('c13', 'resultat'), 'worried').pose(T('c13', 'vol', 1), 1.6, 'shrug');
      F(s5 - 1.3, 1.5, [vault, sb, an], .92, { focus: false }); K.focus(s5, vault);
      F(T('c11', 'fichiers') - .3, .9, [vault, ghost, vlab], .82, { focus: false }); K.focus(T('c11', 'fichiers'), ghost);
      F(T('c11', 'admin') - .3, .8, [sb, an], .82, { focus: false }); K.focus(T('c11', 'admin'), sb);
      F(T('c12', 'ces') - .3, .9, [camG, off, sb], .75, { focus: false }); K.focus(T('c12', 'ces'), camG);
      F(R('c12') - .1, .7, [camG, dalab, off], .62, { focus: false }); K.focus(R('c12'), dalab);
      F(T('c13', 'millions') - .4, .9, [tor, meter, an], .92, { focus: false }); K.focus(T('c13', 'millions'), tor); K.focus(T('c13', 'cout'), meter);
      F(T('c13', 'resultat') - .3, .8, [tl, an], .8, { focus: false }); K.focus(T('c13', 'resultat'), tl);
      K.hot({ x: Z.coffres[0] + 140, y: Z.coffres[1] - 200, at: s5, until: sc('s6'), title: 'Activer Data Access', html: '<p>Console : <b>IAM et administration → Journaux d\'audit</b>, choisir le service (ex. Cloud Storage) et cocher <code>DATA_READ</code>. Ou bloc <code>auditConfigs</code> de la stratégie IAM.</p><p>Ces journaux vont dans <code>_Default</code> (30 jours par défaut) et leur volume a un coût : ciblez les données sensibles.</p>' });
    }

    /* ================= S6 FRISE (clé de secours) ================= */
    { const g = zg('frise', '#11304a'); decor(g, { seed: 1 }); const s6 = sc('s6');
      const rail = G(g, 0, 60); S('rect', { x: -780, y: -14, width: 1560, height: 28, rx: 14, fill: C.p2 }, rail);
      const dots = G(g, 0, 60, { moves: [[T('c14', 'filtrer'), .8, { a: .08 }]] }); for (let i = 0; i < 22; i++) S('circle', { cx: -740 + i * 70, cy: (i % 2 ? -60 : 60), r: 15, fill: '#6b7fae' }, dots);
      const mark = (x, label, word, cue, col) => { const m = G(g, x, 60, { pop: T(cue, word) }); S('rect', { x: -7, y: -60, width: 14, height: 120, rx: 7, fill: col }, m); K.tx(m, 0, 110, label, { size: 50, mono: true, fill: col, weight: 700 }); return m; };
      const m7 = mark(-420, '03:07', 'trois', 'c14', C.rose); const m9 = mark(0, '03:09', 'trois', 'c15', C.rose); const m12 = mark(660, '03:12', 'on', 'c16', C.text);
      const steps = []; for (let i = 0; i < 8; i++) steps.push(I('steps', g, -580 + i * 120, -40, .75, C.rose, { pop: T('c14', 'filtrer') + .4 + i * .1 }));
      const tag = G(g, -260, -330, { pop: T('c14', 'lidentite'), out: T('c15', 'trois') }); S('rect', { x: -320, y: -52, width: 640, height: 104, rx: 52, fill: C.cyan }, tag); K.tx(tag, 0, 2, 'nuitblanche42@…', { size: 48, mono: true, fill: C.ink, weight: 700 });
      const crown = I('crown', g, -420, -170, 1, C.amber, { pop: T('c14', 'trois') + .4, moves: [[T('c16', 'retirer'), .8, { x: -1000, y: -600, r: -60 }], [T('c16', 'redonner'), .8, { x: 330, y: -10, r: 0 }]] });
      const ktx = G(g, 0, -420, { pop: T('c15', 'cree'), out: T('c16', 'on') }); const ktt = K.tx(ktx, 0, 0, 'CreateServiceAccountKey', { size: 50, mono: true, fill: C.orange, weight: 700 });
      K.fx(t => { const n = Math.round(23 * K.clamp((t - T('c15', 'cree')) / 1.6)); ktt.textContent = 'CreateServiceAccountKey'.slice(0, Math.max(1, n)); });
      const nk = I('key', g, 0, -220, 1.7, C.orange, { pop: T('c15', 'nouvelle'), moves: [[T('c15', 'secours'), .8, { x: 330, y: -220, s: 1.2 }]] });
      const rb = G(g, -40, -90, { pop: T('c15', 'ci'), out: T('c16', 'on') }); S('rect', { x: -60, y: -40, width: 120, height: 80, rx: 12, fill: C.text }, rb); ico('person', rb, 0, 0, 1, C.orange).setAttribute('transform', 'scale(.65)');
      const door = I('door', g, 420, -220, 1.8, C.rose, { pop: T('c15', 'secours') });
      const an = K.char(g, { name: 'analyste', color: C.cyan, x: -1050, y: FLOOR, s: 1.4, headset: true });
      an.pop(s6 - .5).walk(s6 - .2, 1.3, -680).pose(T('c14', 'pivoter'), 2.2, 'loupe').walk(T('c14', 'filtrer'), 2.0, -640).walk(T('c15', 'trois'), 1.2, -200).look(T('c15', 'trois'), 0, -220)
        .expr(T('c15', 'secours'), 'angry').expr(T('c16', 'on'), 'smug').walk(T('c16', 'on'), .8, -620).pose(T('c16', 'retirer'), 1.0, 'point', { x: -420, y: -170 }).expr(T('c16', 'faux'), 'surprise').pose(T('c16', 'faux'), .7, 'jump');
      const vil = K.char(g, { name: 'attaquant', color: C.rose, x: 1000, y: FLOOR, s: 1.4, dir: -1, mask: true, expr: 'smug' });
      vil.pop(T('c16', 'cle')).walk(T('c16', 'cle'), 1.0, 330).pose(T('c16', 'redevient'), 1.4, 'point', { x: 420, y: -220 }).pose(T('c16', 'redonner'), 1.8, 'cheer');
      F(s6 - 1.3, 1.5, [rail, an], .92, { focus: false }); K.focus(s6, rail);
      F(T('c14', 'filtrer') - .3, 1.6, [tag, ...steps, m7, an], .85, { focus: false }); K.focus(T('c14', 'filtrer'), tag); K.focus(T('c14', 'trois'), m7);
      F(T('c15', 'cree') - .4, .9, [ktx], .7, { focus: false }); K.focus(T('c15', 'cree'), ktx); F(T('c15', 'nouvelle') - .2, .8, [ktx, nk, m9], .72, { focus: false }); K.focus(T('c15', 'nouvelle'), nk); K.focus(T('c15', 'secours'), door);
      F(T('c16', 'on') - .3, .9, [an, crown, m7], .7, { focus: false }); K.focus(T('c16', 'on'), crown);
      F(T('c16', 'faux') - .3, .9, [vil, door, an], .9, { focus: false }); K.focus(T('c16', 'faux'), vil);
      K.hot({ x: Z.frise[0] - 260, y: Z.frise[1] - 330, at: s6, until: sc('s7'), title: 'Requête de pivot (Logs Explorer)', html: '<pre>logName:"cloudaudit.googleapis.com%2Factivity"\nprotoPayload.authenticationInfo.principalEmail=\n  "nuitblanche42@gmail.com"\ntimestamp>="2026-10-31T03:00:00Z"</pre><p>Puis la même chose sur <code>ci-deployer@…</code> : l\'attaquant agit sous les deux identités.</p>' });
      K.hot({ x: Z.frise[0], y: Z.frise[1] - 220, at: T('c15', 'trois'), until: sc('s7'), title: 'Méthode exacte', html: '<p><code>google.iam.admin.v1.CreateServiceAccountKey</code> (MITRE ATT&CK T1098.001, Additional Cloud Credentials).</p>' });
    }

    /* ================= S7 VERDICT + RÉFLEXES (retour au bureau) ================= */
    { const g = B.g, s7 = sc('s7');
      const board = G(g, 640, -330, { pop: T('c17', 'verdict'), out: T('c18', 'vos') }); S('rect', { x: -290, y: -180, width: 580, height: 360, rx: 24, fill: '#5b3a1e' }, board); S('rect', { x: -270, y: -160, width: 540, height: 320, rx: 18, fill: '#8a5a2b' }, board);
      const pinA = G(board, -130, -10, { pop: T('c17', 'utilisee') }); ico('key', pinA, 0, 0, 1, C.orange).setAttribute('transform', 'translate(0 -40) scale(1.1)'); K.tx(pinA, 0, 70, '03:07', { size: 50, mono: true, fill: C.text, weight: 700 });
      const pinB = G(board, 130, -10, { pop: T('c17', 'secours') }); ico('door', pinB, 0, 0, 1, C.rose).setAttribute('transform', 'translate(0 -40) scale(.9)'); K.tx(pinB, 0, 70, '03:09', { size: 50, mono: true, fill: C.text, weight: 700 });
      const thread = S('path', { d: 'M -130 -40 C -300 80, -500 120, -730 160', stroke: C.rose, 'stroke-width': 6, fill: 'none', 'stroke-dasharray': '1' }, board); K.A(thread, { dash: [T('c17', 'sept'), .8] });
      const rk = I('check', board, 0, 120, .8, C.green, { pop: T('c17', 'robot') });
      B.owner._a.o.moves = [[T('c17', 'retire'), .7, { x: -500, y: -300, s: .3, a: 0 }]];
      const x1 = I('cross', board, -130, -50, 1.1, C.green, { pop: T('c17', 'supprime') }), x2 = I('cross', board, 130, -50, 1.1, C.green, { pop: T('c17', 'supprime') + .2 }); K.ev(T('c17', 'supprime'), 'impact');
      const okG = G(B.mon, 0, -126, { pop: T('c17', 'supprime') + .5, out: T('c18', 'vos') }); S('rect', { x: -305, y: -42, width: 610, height: 84, rx: 14, fill: C.green }, okG); K.tx(okG, 0, 2, 'CONTENU', { size: 56, fill: C.ink, weight: 800, ls: 4 });
      B.mail._a.o.out = T('c17', 'verdict'); B.alertG._a.o.out = T('c17', 'supprime') + .5; B.mon._a.o.out = T('c18', 'vos'); B.mon._a.o.outd = .5;
      // three reflexes as manipulated objects (trigger -> action)
      const R1 = G(g, -560, -200, { pop: T('c18', 'alerte'), out: T('c19', 'vous') }); S('rect', { x: -230, y: -110, width: 460, height: 220, rx: 26, fill: C.p1, stroke: C.amber, 'stroke-width': 6 }, R1);
      ico('crown', R1, 0, 0, 1, C.amber).setAttribute('transform', 'translate(-150 -30) scale(.7)'); ico('key', R1, 0, 0, 1, C.orange).setAttribute('transform', 'translate(-150 40) scale(.7)');
      S('path', { d: 'M -70 0 L 20 0 M 0 -18 L 22 0 L 0 18', stroke: C.text, 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, R1);
      const bell = G(R1, 120, 0, { fn: (s, t) => { s.r = 14 * Math.sin((t - T('c18', 'alerte')) * 14) * (1 - P(t, T('c18', 'alerte') + .3, 1.2)); } }); ico('bell', bell, 0, 0, 1, C.amber).setAttribute('transform', 'scale(1.3)');
      K.mark(T('c18', 'creation')); const kfl = I('key', R1, -150, 40, .7, C.orange, { pop: T('c18', 'creation'), moves: [[T('c18', 'creation') + .1, .6, { x: -60 }, E.ob]] });
      const R2 = G(g, -60, -200, { pop: T('c18', 'data'), out: T('c19', 'vous') }); S('rect', { x: -170, y: -110, width: 340, height: 220, rx: 26, fill: C.p1, stroke: C.violet, 'stroke-width': 6 }, R2);
      ico('cam', R2, 0, 0, 1, C.violet).setAttribute('transform', 'translate(-20 0) scale(1.3)');
      const lens = S('circle', { cx: 50, cy: 0, r: 16, fill: '#2b2350' }, R2); K.fx(t => lens.setAttribute('fill', t > T('c18', 'data') + .6 ? C.green : '#2b2350'));
      const onr = G(R2, 50, 0, { pop: T('c18', 'sensibles') }); S('circle', { r: 34, fill: 'none', stroke: C.green, 'stroke-width': 8 }, onr);
      const R3 = G(g, 340, -200, { pop: T('c18', 'pivot'), out: T('c19', 'vous') }); S('rect', { x: -170, y: -110, width: 340, height: 220, rx: 26, fill: C.p1, stroke: C.cyan, 'stroke-width': 6 }, R3);
      ico('steps', R3, 0, 0, 1, C.rose).setAttribute('transform', 'translate(-30 10) scale(1.1)');
      const lp = G(R3, 40, -20, { moves: [[T('c18', 'pivot') + .3, 1.2, { x: -40, y: 10 }]] }); S('circle', { r: 46, fill: '#bfefff', 'fill-opacity': .25, stroke: C.text, 'stroke-width': 8 }, lp); S('line', { x1: 32, y1: 32, x2: 70, y2: 70, stroke: '#7c5a3a', 'stroke-width': 14, 'stroke-linecap': 'round' }, lp);
      // recap: the four questions of the hook come back, checked
      const chk = B.Bs.map((b, i) => I('check', g, -460 + i * 210 + 62, -110, .9, C.green, { pop: T('c19', 'qui') + i * .3 }));
      B.Bs.forEach((b, i) => { const o = b._a.o, t1 = o.out, t2 = T('c19', 'vous'); o.out = null; o.moves = [[t2 - .4, .01, { x: -460 + i * 210, y: -170, s: 1.25 }]]; o.fn = (s, t) => { if (t >= t2) s.a *= P(t, t2, .4); else s.a *= 1 - P(t, t1, .4); }; });
      const msk = I('mask', g, -40, -170, 1.6, '#2A0F2E', { pop: T('c19', 'masques') });
      B.an.walk(s7 - .2, 1.0, 560).pose(T('c17', 'verdict'), 1.2, 'point', { x: 640, y: -330 }).expr(T('c17', 'retire'), 'happy').pose(T('c17', 'retire'), 1.0, 'nod')
        .walk(T('c18', 'vos'), 1.0, 680).pose(T('c18', 'alerte'), 1.0, 'point', { x: -560, y: -200 }).pose(T('c18', 'data'), 1.0, 'point', { x: -60, y: -200 }).pose(T('c18', 'pivot'), 1.0, 'point', { x: 340, y: -200 })
        .pose(T('c19', 'maintenant'), 1.8, 'cheer').expr(T('c19', 'nuance'), 'neutral').pose(T('c19', 'nuance'), 1.6, 'shrug').pose(T('c19', 'masques') + .8, 1.4, 'nod');
      F(s7 - 1.6, 1.9, [board, B.mon, B.an], .9, { focus: false }); K.focus(s7, board);
      F(T('c17', 'utilisee') - .3, .8, [board], .62);
      F(T('c17', 'retire') - .4, .9, [B.mon, B.an], .8, { focus: false }); K.focus(T('c17', 'retire'), B.owner);
      F(T('c18', 'vos') - .3, 1.0, [R1, R2, R3, B.an], .9, { focus: false }); K.focus(T('c18', 'alerte'), R1); K.focus(T('c18', 'data'), R2); K.focus(T('c18', 'pivot'), R3);
      F(T('c19', 'vous') - .3, 1.0, [...B.Bs, B.an], .85, { focus: false }); K.focus(T('c19', 'qui'), B.Bs[1]);
      F(T('c19', 'nuance'), 2.4, [g._room], .98, { focus: false });
      K.hot({ x: Z.bureau[0] - 420, y: Z.bureau[1] - 420, at: T('c18', 'vos'), until: 9999, title: 'Les 3 réflexes, exécutables', html: '<ol><li><b>Alerte</b> : <code>protoPayload.methodName="SetIamPolicy"</code> + <code>bindingDeltas.action="ADD"</code> + <code>role="roles/owner"</code> ; et <code>methodName="google.iam.admin.v1.CreateServiceAccountKey"</code>.</li><li><b>Data Access</b> : <code>DATA_READ</code> sur les services qui portent vos données sensibles (ex. Cloud Storage).</li><li><b>Pivot</b> : filtrer <code>principalEmail</code> sur chaque identité trouvée, puis supprimer <b>toutes</b> les clés du compte de service.</li></ol>' });
    }
  },
};
