/* ================= helpers for this episode ================= */
const ghostIsle = (x, y, w) => { const g = isle(x, y, w, 150); g.setAttribute('opacity', 0); const o = el('ellipse', { cx: 0, cy: -10, rx: w / 2 + 40, ry: 150, fill: 'none', stroke: C.rose, 'stroke-width': 7, 'stroke-dasharray': '18 14' }, g); return g; };
const check = (p, x, y, col = C.green) => { const g = G(p, x, y); el('circle', { r: 44, fill: col }, g); el('path', { d: 'M -20 2 L -5 17 L 22 -14', stroke: '#fff', 'stroke-width': 11, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g); return g; };
const cross = (p, x, y, s = 1) => { const g = G(p, x, y); el('path', { d: `M ${-50 * s} ${-50 * s} L ${50 * s} ${50 * s} M ${50 * s} ${-50 * s} L ${-50 * s} ${50 * s}`, stroke: C.rose, 'stroke-width': 18 * s, 'stroke-linecap': 'round' }, g); return g; };
const seal = (p, x, y, s = 1) => { const g = G(p, x, y); const b = el('g', { transform: `scale(${s})` }, g); for (let i = 0; i < 12; i++) el('circle', { cx: 34 * Math.cos(i * Math.PI / 6), cy: 34 * Math.sin(i * Math.PI / 6), r: 12, fill: C.gold }, b);
  el('circle', { r: 34, fill: C.gold }, b); el('circle', { r: 22, fill: 'none', stroke: '#c98a00', 'stroke-width': 5 }, b); return g; };
const padKey = (p, x, y, s = 1) => { const g = G(p, x, y); const b = el('g', { transform: `scale(${s})` }, g); el('rect', { x: -40, y: -10, width: 80, height: 64, rx: 12, fill: C.green }, b);
  el('path', { d: 'M -24 -10 L -24 -34 A 24 24 0 0 1 24 -34 L 24 -10', stroke: C.green, 'stroke-width': 11, fill: 'none' }, b); keyIcon(b, -2, 22, .45, '#0d3b2c'); return g; };
const towerAt = (x, y, s, col = C.cyan) => { const r = rockAt(x, y, 360 * s); const t = ctlTower(r, 0, 0, s, col); return { rock: r, tower: t, cabY: y - 530 * s }; };

/* ================= Z1 — an insider in the tower (s1, 0.6 → 19.2) ================= */
const Z1x = 0;
const T1 = towerAt(Z1x, 300, 1.4); bob(T1.rock, 10, 2.8);
const balc = el('g', {}, T1.rock); el('rect', { x: 150, y: -670, width: 300, height: 22, rx: 10, fill: '#4a43a3' }, balc); el('path', { d: 'M 150 -670 L 150 -760 M 450 -670 L 450 -760 M 150 -760 L 450 -760', stroke: '#b9b2e3', 'stroke-width': 7, fill: 'none' }, balc);
tl.to(T1.tower._halo, { opacity: 1, duration: .5 }, .5); tl.to(T1.tower._halo, { opacity: .4, duration: .7, repeat: 20, yoyo: true }, 1.2);
const iL1 = isle(Z1x - 1150, 380, 640, 170), iR1 = isle(Z1x + 1150, 380, 640, 170); bob(iL1, 12, 2.3); bob(iR1, 12, 2.6, .4);
laptop(iL1, 0, -80, 1.2); rack(iR1, 0, -80, 1.1);
const thiefA1 = G(T1.rock, 300, -670);
const hypo = plaque(main, Z1x - 760, -830, 'scénario hypothétique', { size: 58, mono: false, col: C.violet }); pop(hypo, T('c1', 'scenario'));
const insLab = plaque(main, Z1x + 760, -760, 'insider', { size: 56, mono: false, col: C.rose }); pop(insLab, T('c1', 'travaille')); hide(insLab, END('c1') - .1);
const noInc = plaque(main, Z1x - 760, -680, 'aucun incident public connu', { size: 50, mono: false, col: C.text }); pop(noInc, T('c2', 'aucun') - .1);
const parade = G(main, Z1x + 760, -720); padKey(parade, 0, 0, 1.4); txt(parade, 0, 130, 'une parade existe', { size: 46, fill: C.green }); pop(parade, T('c2', 'parade') - .1);
hide([noInc, parade], END('c2') - .1);
const qs = [['que peut-il faire ?', 'faire', C.rose], ['que verriez-vous ?', 'verriez', C.cyan], ['comment s’en protéger ?', 'proteger', C.green]].map(([s, w, col], i) => { const q = plaque(main, Z1x + 760, -840 + i * 130, s, { size: 48, mono: false, col }); pop(q, T('c3', w) - .1); hide(q, END('c3') - .1); return q; });

/* ================= Z2 — the ghost node (s2, 19.2 → 46.9) ================= */
const Z2x = 3300;
const T2 = towerAt(Z2x, 250, 1.0); const iA = isle(Z2x - 1000, 330, 640, 170), iB = isle(Z2x + 1000, 330, 640, 170); bob(iA, 10, 2.4); bob(iB, 10, 2.7, .5);
const lapA = laptop(iA, 60, -80, 1.2), rkB = rack(iB, 0, -80, 1.1);
const privA = padKey(iA, -170, -120, .9), privB = padKey(iB, 170, -120, .9); pop(privA, T('c4', 'privees') - .1); pop(privB, T('c4', 'privees') + .05);
const privLab = plaque(main, Z2x - 1000, -360, 'clé privée : reste ici', { size: 46, mono: false, col: C.green }); pop(privLab, T('c4', 'quittent') - .1); hide(privLab, END('c4') - .1);
const cab2 = [Z2x, T2.cabY];
[[Z2x - 940, -40], [Z2x + 1000, -60]].forEach(([x, y], i) => { const k = keyCard(main, cab2[0], cab2[1], .9, C.amber); tl.set(k, { opacity: 0 }, 0); tl.set(k, { opacity: 1 }, T('c4', 'distribue') + i * .2);
  fly(k, T('c4', 'distribue') + i * .2, x, y, .9); sfx(T('c4', 'distribue') + i * .2, 'pop'); tl.to(k, { opacity: 0, duration: .3 }, CUE.c5.start); });
const pubLab = plaque(main, Z2x, -620, 'clés publiques', { size: 50, mono: false, col: C.amber }); pop(pubLab, T('c4', 'publiques') - .1); hide(pubLab, END('c4') - .1);
const ab = tunnel(`M ${Z2x - 780} 230 C ${Z2x - 400} 520 ${Z2x + 400} 520 ${Z2x + 800} 230`, C.green, 12); ab.core.id = 'ab2'; drawIn(ab, CUE.c5.start - .3, .8);
for (let i = 0; i < 7; i++) { const bx = sealed(main, 0, 0, .65, C.green); tl.set(bx, { opacity: 0 }, 0); const a = T('c5', 'devinez') + i * .55; tl.set(bx, { opacity: 1 }, a).to(bx, { motionPath: { path: '#ab2', align: '#ab2', alignOrigin: [.5, .5] }, duration: 1.3, ease: 'none' }, a).set(bx, { opacity: 0 }, a + 1.3); }
const q2 = qmark(main, Z2x - 520, -220, 200); pop(q2, T('c5', 'lire')); hide(q2, REV('c5'));
const ghost = ghostIsle(Z2x, 780, 620); const ghostPc = laptop(ghost, 120, -60, 1.1); tl.to(ghost, { opacity: .85, duration: .8 }, T('c5', 'diffuser') - .2); sfx(T('c5', 'diffuser'), 'myth');
const ghostLab = plaque(main, Z2x + 560, 520, 'nœud fantôme', { size: 52, mono: false, col: C.rose }); pop(ghostLab, T('c5', 'fantome') - .1);
[[Z2x - 1000, -60], [Z2x + 1000, -80]].forEach(([x, y], i) => { const k = keyCard(main, cab2[0], cab2[1], .95, C.rose); tl.set(k, { opacity: 0 }, 0); tl.set(k, { opacity: 1 }, T('c5', 'cle') + i * .25);
  fly(k, T('c5', 'cle') + i * .25, x, y, .9); sfx(T('c5', 'cle') + i * .25, 'pop'); tl.to(k, { opacity: 0, duration: .3 }, END('c7') - .2); });
const okA = check(main, Z2x - 860, -200), okB = check(main, Z2x + 1140, -220); pop(okA, T('c5', 'legitime') - .2); pop(okB, T('c5', 'legitime')); hide([okA, okB], END('c6'));
const thiefA2 = G(ghost, -150, -60);
const g1 = tunnel(`M ${Z2x - 760} 260 C ${Z2x - 600} 700 ${Z2x - 300} 760 ${Z2x - 140} 700`, '#ff7aa2', 11); g1.core.id = 'g1'; const g2 = tunnel(`M ${Z2x + 140} 700 C ${Z2x + 300} 760 ${Z2x + 600} 700 ${Z2x + 800} 260`, '#ff7aa2', 11); g2.core.id = 'g2';
drawIn(g1, T('c7', 'echanger') - .2, .8); drawIn(g2, T('c7', 'echanger'), .8); tl.to(ab.g, { opacity: .15, duration: .4 }, T('c7', 'echanger'));
flowAlong('#g1', 0, T('c7', 'trafic'), END('c7'), '#ffb3c8', .4, 1.0); flowAlong('#g2', 0, T('c7', 'trafic') + .2, END('c7'), '#ffb3c8', .4, 1.0);
const readLab = plaque(main, Z2x, 440, 'trafic lisible', { size: 50, mono: false, col: C.rose }); pop(readLab, T('c7', 'lire') - .2); sfx(T('c7', 'lire'), 'impact');

/* ================= Z3 — what you would see (s3, 46.9 → 70.6) ================= */
const Z3x = 6600;
const lib3 = isle(Z3x - 900, 360, 1100, 200); bob(lib3, 8, 3.0);
const bAud3 = book(main, Z3x - 820, 60, C.green); pop(bAud3, T('c8', 'journal') - .1); const t3a = txt(main, Z3x - 820, -250, 'journal d’audit', { size: 54, fill: C.green });
show(t3a, T('c8', 'journal')); bookLine(bAud3, 0, 'Create node', T('c8', 'audit') + .2); bookLine(bAud3, 1, 'Log in node', T('c8', 'audit') + .5);
const miniT = towerAt(Z3x - 1400, 300, .55); tl.set(miniT.rock, { opacity: 0 }, 0); show(miniT.rock, T('c8', 'tenu') - .3);
const pen = el('path', { d: `M ${Z3x - 1350} -80 C ${Z3x - 1250} -260 ${Z3x - 1100} -230 ${Z3x - 1000} -120`, stroke: C.text, 'stroke-width': 8, 'stroke-dasharray': '16 12', fill: 'none' }, main); tl.set(pen, { opacity: 0 }, 0);
show(pen, T('c8', 'tenu'), .2); tl.from(pen, { drawSVG: 0, duration: .6 }, T('c8', 'tenu'));
const tenu = plaque(main, Z3x - 820, -400, 'tenu par Tailscale', { size: 48, mono: false, col: C.cyan }); pop(tenu, T('c8', 'tenu'));
const notInd = G(bAud3, 0, -30); el('rect', { x: -230, y: -60, width: 460, height: 110, rx: 16, fill: 'none', stroke: C.rose, 'stroke-width': 10, transform: 'rotate(-7)' }, notInd);
txt(notInd, 0, 18, 'pas indépendant', { size: 52, w: 800, fill: C.rose, attrs: { transform: 'rotate(-7)' } }); pop(notInd, T('c8', 'temoin') - .1); sfx(T('c8', 'temoin'), 'myth');
const isP3 = isle(Z3x + 350, 360, 900, 200); bob(isP3, 10, 2.5); const pc3 = pc(isP3, 0, -120, 1.3);
const term3 = terminal(main, Z3x + 520, -560, 940, 5); pop(term3, T('c9', 'connaissent') - .3, .5);
termLine(term3, 0, '> tailscale status --json', T('c9', 'tailscale'), C.green);
termLine(term3, 1, '"Peer": {', T('c9', 'liste') - .1); termLine(term3, 2, '  "nodekey:…": laptop', T('c9', 'chaque') - .1); termLine(term3, 3, '  "nodekey:…": rack', T('c9', 'pair') - .1);
const ghostLine = termLine(term3, 4, '  "nodekey:…": ???', T('c9', 'cle'), '#ff9fb8'); const hl = el('rect', { x: Z3x + 70, y: -560 + 96 + 4 * 62 - 42, width: 600, height: 56, rx: 10, fill: C.rose, opacity: 0 }, main); main.insertBefore(hl, term3.nextSibling);
tl.to(hl, { opacity: .25, duration: .3 }, T('c9', 'poste')); const onPost = plaque(main, Z3x + 1300, -300, 'sur le poste', { size: 48, mono: false, col: C.cyan }); pop(onPost, T('c9', 'poste'));
hide([term3, hl, onPost], END('c9') - .1);
const tkL = ticket(main, Z3x + 120, -480, ['journal du poste', '→ pair fantôme'], { size: 46, col: C.cyan }), tkR = ticket(main, Z3x + 900, -480, ['journal central', '(ligne absente)'], { size: 46, col: C.amber });
tl.set([tkL, tkR], { opacity: 0 }, 0); show(tkL, T('c10', 'deux') - .1); show(tkR, T('c10', 'bouts'));
const neq = txt(main, Z3x + 520, -390, '≠', { size: 130, w: 800, fill: C.rose, attrs: { opacity: 0 } }); show(neq, T('c10', 'manquant') - .1); bump(neq, T('c10', 'modifie')); sfx(T('c10', 'manquant'), 'reveal');
const heroB1 = G(isP3, -330, -70);

/* ================= Z4 — Tailnet Lock (s4, 70.6 → 95.5) ================= */
const Z4x = 9900;
const T4 = towerAt(Z4x, 250, 1.0); const iS = isle(Z4x - 1050, 330, 760, 180), iM = isle(Z4x + 1050, 330, 760, 180); bob(iS, 10, 2.5); bob(iM, 10, 2.8, .3);
const sg1 = rack(iS, -150, -80, 1.0), sg2 = rack(iS, 150, -80, 1.0); const s1 = seal(iS, -150, -390, .9), s2 = seal(iS, 150, -390, .9); pop(s1, T('c11', 'signature') - .2); pop(s2, T('c11', 'signature'));
const sigLab = plaque(main, Z4x - 1050, -330, 'nœuds de signature', { size: 48, mono: false, col: C.gold }); pop(sigLab, T('c11', 'noeuds') - .1); tl.to(sigLab, { y: -470, duration: .4 }, T('c11', 'signature') - .3);
const lockTitle = plaque(main, Z4x, -820, 'Tailnet Lock', { size: 64, mono: false, col: C.gold }); pop(lockTitle, T('c11', 'tailnet') - .1);
const mA = laptop(iM, -150, -80, 1.1), mB = rack(iM, 170, -80, 1.0);
const card4 = keyCard(main, Z4x, T4.cabY, 1.0, C.amber); tl.set(card4, { opacity: 0 }, 0); tl.set(card4, { opacity: 1 }, T('c11', 'signent') - .4);
fly(card4, T('c11', 'signent') - .4, Z4x - 1050, -560, .8); const cs = seal(card4, 46, 30, .55); tl.set(cs, { opacity: 0 }, 0); pop(cs, T('c11', 'chaque')); sfx(T('c11', 'chaque'), 'impact');
fly(card4, T('c12', 'chaque') - .2, Z4x, T4.cabY, .8); fly(card4, T('c12', 'machine'), Z4x + 900, -330, .8);
const loupe4 = G(main, Z4x + 1080, -330); el('circle', { cx: -10, cy: -10, r: 56, fill: '#bfe9ff', 'fill-opacity': .2, stroke: C.text, 'stroke-width': 11 }, loupe4); el('path', { d: 'M 30 30 L 72 72', stroke: '#c9925e', 'stroke-width': 16, 'stroke-linecap': 'round' }, loupe4);
pop(loupe4, T('c12', 'verifie') - .1); const ok4 = check(main, Z4x + 1180, -470); pop(ok4, T('c12', 'accepter') - .1); hide([loupe4, ok4, card4], T('c12', 'et') - .1);
const box4 = G(iS, 0, -560); el('rect', { x: -110, y: -60, width: 220, height: 120, rx: 18, fill: '#2c2560', stroke: C.gold, 'stroke-width': 7 }, box4); keyIcon(box4, -30, 0, .9, C.gold); keyIcon(box4, 40, 6, .7, C.gold);
tl.set(box4, { opacity: 0 }, 0); show(box4, T('c12', 'cles') - .4);
const beam4 = el('path', { d: `M ${Z4x - 80} ${T4.cabY + 20} L ${Z4x - 700} -260`, stroke: C.cyan, 'stroke-width': 10, 'stroke-dasharray': '18 14', opacity: 0 }, main); show(beam4, T('c12', 'tour') - .2, .2);
const x4 = cross(main, Z4x - 720, -250, .8); pop(x4, T('c12', 'jamais')); hide([beam4, x4], END('c12') - .1);
const ghost4 = ghostIsle(Z4x + 120, 760, 560); laptop(ghost4, 110, -60, 1.0); tl.to(ghost4, { opacity: .85, duration: .6 }, CUE.c13.start); const thiefA3 = G(ghost4, -140, -60);
const gcard = keyCard(main, Z4x, T4.cabY, 1.0, C.rose); tl.set(gcard, { opacity: 0 }, 0); tl.set(gcard, { opacity: 1 }, T('c13', 'noeud') - .2); fly(gcard, T('c13', 'noeud') - .2, Z4x + 780, -320, 1.0);
const q4 = qmark(main, Z4x + 560, -560, 170); pop(q4, T('c13', 'passe')); hide(q4, REV('c13'));
const x4b = cross(main, Z4x + 780, -320, 1.1); pop(x4b, REV('c13')); sfx(REV('c13'), 'reveal'); tl.to(gcard, { opacity: 0, y: -120, duration: .5 }, T('c13', 'refuse')); hide(x4b, T('c13', 'et') + .2);
const refLab = plaque(main, Z4x + 1050, -560, 'refusé : non signé', { size: 50, mono: false, col: C.rose }); pop(refLab, T('c13', 'refuse') - .1); hide(refLab, END('c13') - .1);
tl.to(ghost4, { opacity: 0, duration: .8 }, T('c13', 'refuse') + .3);
const safe4 = G(main, Z4x - 420, -380); el('rect', { x: -110, y: -100, width: 220, height: 200, rx: 18, fill: '#3b3766', stroke: C.green, 'stroke-width': 8 }, safe4); el('circle', { r: 40, fill: 'none', stroke: C.green, 'stroke-width': 9 }, safe4); el('path', { d: 'M 0 -40 L 0 0 L 28 0', stroke: C.green, 'stroke-width': 9 }, safe4);
pop(safe4, T('c13', 'desactiver') - .1); const secLab = plaque(main, Z4x - 420, -560, 'secret de désactivation', { size: 46, mono: false, col: C.green }); pop(secLab, T('c13', 'secret') - .1);
const tryArm = el('path', { d: `M ${Z4x - 70} ${T4.cabY + 60} L ${Z4x - 280} -380`, stroke: C.rose, 'stroke-width': 10, 'stroke-linecap': 'round', opacity: 0 }, main); show(tryArm, T('c13', 'tour') - .3, .2);
const x4c = cross(main, Z4x - 260, -420, .6); pop(x4c, T('c13', 'pas', 1) - .1); hide([tryArm, x4c], END('c13'));
const heroB2 = G(iM, -400, -70);

/* ================= Z5 — the lock's limits (s5, 95.5 → 114.1) ================= */
const Z5x = 13200;
const T5 = towerAt(Z5x, 250, 1.0); const iA5 = isle(Z5x - 1000, 330, 640, 170), iB5 = isle(Z5x + 1000, 330, 640, 170); laptop(iA5, 60, -80, 1.2); rack(iB5, 0, -80, 1.1); bob(iA5, 10, 2.4); bob(iB5, 10, 2.6);
const l5 = tunnel(`M ${Z5x - 780} 230 C ${Z5x - 400} 520 ${Z5x + 400} 520 ${Z5x + 800} 230`, C.green, 12); l5.core.id = 'l5';
flowAlong('#l5', 0, CUE.c14.start, T('c14', 'couper') + .2, C.green, .45, 1.2);
tl.to(l5.core, { attr: { stroke: '#5a5680' }, duration: .3 }, T('c14', 'couper') + .1); const cut5 = cross(main, Z5x, 470, .8); pop(cut5, T('c14', 'couper') + .1); sfx(T('c14', 'couper') + .1, 'impact');
const cutLab = plaque(main, Z5x, -650, 'coupure du réseau : possible', { size: 50, mono: false, col: C.rose }); pop(cutLab, T('c14', 'reseau') - .2); hide([cutLab], T('c14', 'et') - .1);
const first = keyCard(main, Z5x, T5.cabY, 1.0, C.violet); tl.set(first, { opacity: 0 }, 0); tl.set(first, { opacity: 1 }, T('c14', 'confiance') - .3); fly(first, T('c14', 'confiance') - .3, Z5x - 1000, -120, .9);
const firstLab = plaque(main, Z5x - 1000, -340, 'premier état reçu', { size: 48, mono: false, col: C.violet }); pop(firstLab, T('c14', 'premier') - .2); const q5 = qmark(main, Z5x - 760, -150, 120); pop(q5, T('c14', 'etat'));
hide([firstLab, q5], CUE.c15.start + .2);
const term5 = terminal(main, Z5x + 430, -760, 820, 2); pop(term5, T('c15', 'verifiez') - .2, .5); termLine(term5, 0, '> tailscale lock status', T('c15', 'tailscale'), C.green);
const dir5 = G(main, Z5x + 430, -280); el('path', { d: 'M -180 -60 L -90 -60 L -70 -84 L 180 -84 L 180 70 L -180 70 Z', fill: C.amber }, dir5); txt(dir5, 0, 30, '--statedir', { size: 44, mono: true, fill: '#1a1440' }); pop(dir5, T('c15', 'repertoire') - .1);
const verLab = plaque(main, Z5x + 430, -60, 'TS-2025-008 · corrigé en 1.90.8', { size: 46, col: C.amber }); pop(verLab, T('c15', 'version') - .1);
hide([term5, dir5, verLab], END('c15') - .1); const heroB3 = G(iA5, -170, -70);

/* ================= Z6 — recap (s6, 114.1 → 155.9) ================= */
const Z6x = 16500;
const T6 = towerAt(Z6x + 150, 250, .9); const iS6 = isle(Z6x - 900, 330, 760, 180), iM6 = isle(Z6x + 1150, 330, 700, 170); bob(iS6, 10, 2.5); bob(iM6, 10, 2.7, .3);
rack(iS6, -150, -80, 1.0); rack(iS6, 150, -80, 1.0); seal(iS6, -150, -380, .8); seal(iS6, 150, -380, .8); laptop(iM6, -120, -80, 1.1); rack(iM6, 160, -80, 1.0);
const lock6 = padKey(main, Z6x - 900, -560, 1.3); pop(lock6, T('c16', 'activez') - .1);
const radar = G(main, Z6x + 1150, -480); el('circle', { r: 90, fill: '#0d0a26', stroke: C.cyan, 'stroke-width': 7 }, radar); el('circle', { r: 50, fill: 'none', stroke: C.cyan, 'stroke-width': 4, opacity: .6 }, radar);
const sweep = el('path', { d: 'M 0 0 L 0 -86', stroke: C.cyan, 'stroke-width': 8, 'stroke-linecap': 'round' }, radar); pop(radar, T('c17', 'edr') - .1); tl.to(sweep, { rotation: 360 * 4, svgOrigin: '0 0', duration: 8, ease: 'none' }, T('c17', 'edr'));
const siem = G(main, Z6x + 150, -650); const sb = book(el('g', { transform: 'scale(.5)' }, siem), 0, 0, C.cyan); pop(siem, T('c18', 'gardez') - .1);
const rules6 = [['1 · tailscale lock init · ≥ 2 nœuds de signature · secrets en lieu sûr', 'c16', 'activez', C.gold], ['2 · EDR : Peer + tailscale lock status vs inventaire', 'c17', 'relevez', C.cyan], ['3 · journaux des postes → votre SIEM', 'c18', 'gardez', C.green]];
rules6.forEach(([s, cid, w, col]) => { const pl = plaque(main, Z6x + 100, 440, s, { size: 50, col }); pop(pl, T(cid, w) + .1); hide(pl, END(cid) - .15); });
const plans = plaque(main, Z6x + 100, 440, 'inactif par défaut · Personal, Enterprise', { size: 48, mono: false, col: C.violet }); pop(plans, T('c19', 'inactif') - .2); hide(plans, T('c19', 'solution') - .2);
const hs = towerAt(Z6x + 1550, 300, .6, C.green); tl.set(hs.rock, { opacity: 0 }, 0); show(hs.rock, T('c19', 'propre') - .2, .5);
const hsLab = plaque(main, Z6x + 1450, -320, 'Headscale · votre tour', { size: 48, mono: false, col: C.green }); pop(hsLab, T('c19', 'headscale') - .2);
const fin = plaque(main, Z6x + 100, 440, 'ce que vos machines voient : les pairs, le verrou, leurs journaux', { size: 50, mono: false, col: C.gold }); pop(fin, T('c20', 'machines') - .2);
const heroB4 = G(iM6, -400, -70);
