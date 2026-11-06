/* ================= Z1 — the hacked workstation (s1, 0.6 → 22.7) ================= */
const Z1x = 0; const Z1 = isle(Z1x, 330, 1400, 220); bob(Z1, 14, 2.4);
const pc1 = pc(Z1, 0, -120, 1.5); tl.to(pc1._scr, { opacity: .55, duration: .5 }, .8);
const mastRock = rockAt(Z1x + 1000, 300, 420, '#a0456e'); bob(mastRock, 16, 2.1);
const mast = G(mastRock, 0, 0); const mb = el('g', {}, mast);
el('path', { d: 'M -80 0 L 80 0 L 12 -620 L -12 -620 Z', fill: 'none', stroke: '#c7c3e8', 'stroke-width': 10 }, mb);
for (let i = 0; i < 6; i++) { const y0 = -i * 100, y1 = -(i + 1) * 100, w0 = 80 - i * 11.3, w1 = 80 - (i + 1) * 11.3; el('path', { d: `M ${-w0} ${y0} L ${w1} ${y1} M ${w0} ${y0} L ${-w1} ${y1}`, stroke: '#9d8cff', 'stroke-width': 5 }, mb); }
const mHalo = el('circle', { cx: 0, cy: -640, r: 130, fill: 'url(#redHalo)' }, mb); const mLed = el('circle', { cx: 0, cy: -640, r: 22, fill: C.rose }, mb);
tl.to(mHalo, { opacity: .3, duration: .5, repeat: 5, yoyo: true }, 0);
const c2Lab = plaque(mastRock, 0, -800, 'C2 · Havoc', { size: 54, col: C.rose }); pop(c2Lab, .9);
tl.to(mast, { rotation: 78, svgOrigin: '0 0', duration: .9, ease: 'power3.in' }, T('c1', 'tombe') - .2); tl.to([mHalo, mLed], { opacity: 0, duration: .3 }, T('c1', 'tombe') + .4);
tl.to(c2Lab, { opacity: 0, y: 40, duration: .5 }, T('c1', 'tombe') + .2); sfx(T('c1', 'tombe') + .6, 'impact');
for (let i = 0; i < 6; i++) { const pf = el('circle', { cx: 300 + i * 60, cy: -10, r: 30 + i * 6, fill: '#c7c3e8', opacity: 0 }, mastRock); tl.fromTo(pf, { opacity: .6, scale: .3, transformOrigin: '50% 50%' }, { opacity: 0, scale: 1.8, y: -80, duration: 1.4, immediateRender: false }, T('c1', 'tombe') + .65 + i * .05); }
const thiefRock1 = rockAt(Z1x - 1050, 300, 400); bob(thiefRock1, 18, 2.6); const thiefA1 = G(thiefRock1, 0, 0);
const tn1 = tunnel(`M ${Z1x - 160} 150 C ${Z1x - 420} 320 ${Z1x - 760} 380 ${Z1x - 1000} 250`, '#ff7aa2', 14); tn1.core.id = 'tn1'; tn1.core.setAttribute('stroke-dasharray', '28 18');
drawIn(tn1, T('c1', 'garde') - .2, 1.1); sfx(T('c1', 'garde'), 'whoosh'); flowAlong('#tn1', 0, T('c1', 'acces'), END('c3') - .5, '#ffb3c8', .7, 1.4);
const days = plaque(main, Z1x - 520, -330, '1 jour', { size: 58, col: C.rose }); pop(days, T('c1', 'pendant') - .1);
const dT = days.querySelector('text'); const dc = { v: 1 }; tl.to(dc, { v: 18, duration: T('c1', 'jours') - T('c1', 'pendant') + .3, ease: 'none', onUpdate: () => { const n = Math.round(dc.v); dT.textContent = n + (n > 1 ? ' jours' : ' jour'); } }, T('c1', 'pendant'));
for (let k = 0; k < 8; k++) sfx(T('c1', 'pendant') + k * .12, 'tick'); hide(days, T('c2', 'son') + .2);
const exe1 = plaque(Z1, 0, -560, 'tailscale.exe', { size: 58, col: C.cyan }); pop(exe1, T('c2', 'tailscale') - .15); tl.to(pc1._scr, { attr: { fill: C.rose }, duration: .3 }, T('c2', 'tailscale'));
const qGear = G(main, Z1x - 420, -560); el('circle', { r: 80, fill: '#2c2560', stroke: C.violet, 'stroke-width': 8 }, qGear); txt(qGear, 0, 34, '?', { size: 100, w: 800, fill: C.gold });
const qLoupe = G(main, Z1x + 420, -560); el('circle', { cx: -10, cy: -10, r: 62, fill: '#bfe9ff', 'fill-opacity': .2, stroke: C.text, 'stroke-width': 12 }, qLoupe); el('path', { d: 'M 34 34 L 80 80', stroke: '#c9925e', 'stroke-width': 18, 'stroke-linecap': 'round' }, qLoupe); txt(qLoupe, -10, 22, '?', { size: 84, w: 800, fill: C.gold });
pop(qGear, T('c2', 'comment')); pop(qLoupe, T('c2', 'voir')); hide([qGear, qLoupe, exe1], T('c3', 'un') + .1);
const cas = plaque(main, Z1x, -620, 'cas type · Cyble 2024 + Cato CTRL 2026', { size: 52, mono: false, col: C.violet }); pop(cas, T('c3', 'cas')); hide(cas, T('c3', 'question') - .2);
const q1 = qmark(main, Z1x, -470, 220); pop(q1, T('c3', 'ou')); hide(q1, END('c3') - .1);

/* ================= Z2 — the tailnet and its control tower (s2, 22.7 → 39.9) ================= */
const Z2x = 3300;
const isA = isle(Z2x - 950, 300, 640, 170), isB = isle(Z2x - 330, 430, 560, 160), isC = isle(Z2x + 520, 430, 560, 160), isD = isle(Z2x + 1080, 300, 520, 160);
[isA, isB, isC, isD].forEach((g, i) => bob(g, 10 + i * 2, 2.2 + i * .3, i * .4));
const mA = laptop(isA, 120, -80, 1.2), mB = rack(isB, 0, -80, 1.1), mC = pc(isC, 0, -110, 1.0), mD = phone(isD, 0, -80, 1.2);
const machines = [[isA, 120, mA], [isB, 0, mB], [isC, 0, mC], [isD, 0, mD]];
machines.forEach(([g, x, m], i) => pop(m, T('c4', 'machines') + i * .12));
const towerRock = rockAt(Z2x + 100, 240, 360); const tower = ctlTower(towerRock, 0, 0, 1.0); pop(tower, T('c5', 'tour') - .2, .6);
const tnRing = el('ellipse', { cx: Z2x + 60, cy: 220, rx: 1520, ry: 560, fill: 'none', stroke: C.cyan, 'stroke-width': 8, 'stroke-dasharray': '30 22', opacity: .8 }, main);
tl.from(tnRing, { drawSVG: 0, duration: 1.2 }, T('c4', 'reseau')); sfx(T('c4', 'reseau'), 'whoosh');
const tnLab = plaque(main, Z2x - 1150, -330, 'tailnet', { size: 64, mono: false, col: C.cyan }); pop(tnLab, T('c4', 'tailnet') - .1);
const ipTags = machines.map(([g, x, m], i) => { const tg = plaque(g, x, -470, '100.x.y.z', { size: 46, col: C.cyan }); pop(tg, T('c4', 'adresse') + i * .15); hide(tg, T('c5', 'tour') - .5); return tg; });
const coordLab = plaque(towerRock, 0, -840, 'serveur de coordination', { size: 60, mono: false, col: C.cyan }); pop(coordLab, T('c5', 'serveur'));
tl.to(tower._halo, { opacity: 1, duration: .4 }, T('c5', 'tour')); tl.to(tower._halo, { opacity: .4, duration: .6, repeat: 30, yoyo: true }, T('c5', 'tour') + .5);
const cab = [Z2x + 100, -360];
machines.forEach(([g, x, m], i) => { const gx = +g.getAttribute('transform').match(/translate\(([-\d.]+)/)[1] + x, gy = +g.getAttribute('transform').match(/ ([-\d.]+)\)/)[1] - 300;
  const k = keyCard(main, cab[0], cab[1], .9, C.amber); tl.set(k, { opacity: 0 }, 0); tl.set(k, { opacity: 1 }, T('c5', 'distribue') + i * .18); fly(k, T('c5', 'distribue') + i * .18, gx, gy, .8); tl.to(k, { opacity: 0, duration: .3 }, END('c5') - .4); sfx(T('c5', 'distribue') + i * .18, 'pop');
  const sc = scrollCard(main, cab[0], cab[1], .8); tl.set(sc, { opacity: 0 }, 0); tl.set(sc, { opacity: 1 }, T('c5', 'regles') + i * .15); fly(sc, T('c5', 'regles') + i * .15, gx + 110, gy + 10, .8); tl.to(sc, { opacity: 0, duration: .3 }, END('c5') - .4); });
const keyLab = plaque(towerRock, -560, -600, 'clés publiques', { size: 64, mono: false, col: C.amber }), aclLab = plaque(towerRock, 560, -600, 'règles d’accès', { size: 64, mono: false, col: C.violet });
pop(keyLab, T('c5', 'cles')); pop(aclLab, T('c5', 'regles')); hide([keyLab, aclLab], T('c5', 'mais') - .2);
const direct = tunnel(`M ${Z2x - 830} 200 C ${Z2x - 300} 520 ${Z2x + 500} 520 ${Z2x + 1080} 210`, C.green, 12); direct.core.id = 'dir2'; drawIn(direct, T('c5', 'trafic') - .2, .9);
flowAlong('#dir2', 0, T('c5', 'trafic'), END('c5'), C.green, .35, 1.0);
const ghost = el('path', { d: `M ${Z2x - 830} 200 Q ${Z2x - 300} -500 ${cab[0]} ${cab[1] + 40} Q ${Z2x + 600} -500 ${Z2x + 1080} 210`, stroke: C.text, 'stroke-width': 7, 'stroke-dasharray': '12 16', fill: 'none', opacity: 0 }, main);
tl.to(ghost, { opacity: .6, duration: .3 }, T('c5', 'jamais') - .3); const xMark = G(main, Z2x - 380, -150); el('path', { d: 'M -50 -50 L 50 50 M 50 -50 L -50 50', stroke: C.rose, 'stroke-width': 18, 'stroke-linecap': 'round' }, xMark);
pop(xMark, T('c5', 'jamais') + .1); sfx(T('c5', 'jamais') + .1, 'myth'); hide([ghost, xMark], END('c5') - .2);
const heroB1 = G(isA, -150, -70);

/* ================= Z3 — direct or relayed (s3, 39.9 → 64.3) ================= */
const Z3x = 6600;
const isL = isle(Z3x - 760, 330, 820, 200), isR = isle(Z3x + 760, 330, 820, 200); bob(isL, 12, 2.3); bob(isR, 12, 2.6, .5);
const pcL = pc(isL, 40, -110, 1.2), rkR = rack(isR, 0, -90, 1.2);
const wg = tunnel(`M ${Z3x - 560} 120 C ${Z3x - 200} -120 ${Z3x + 200} -120 ${Z3x + 620} 120`, C.green, 16); wg.core.id = 'wg3'; drawIn(wg, T('c7', 'entre') - .1, 1.0); sfx(T('c7', 'entre'), 'whoosh');
for (let i = 0; i < 9; i++) { const bx = sealed(main, 0, 0, .7, C.green); tl.set(bx, { opacity: 0 }, 0); const a = T('c7', 'trafic') + i * .55; if (a > T('c8', 'sinon') - .6) break;
  tl.set(bx, { opacity: 1 }, a).to(bx, { motionPath: { path: '#wg3', align: '#wg3', alignOrigin: [.5, .5] }, duration: 1.3, ease: 'none' }, a).set(bx, { opacity: 0 }, a + 1.3); }
const wgLab = plaque(main, Z3x, -330, 'WireGuard · UDP direct', { size: 54, col: C.green }); pop(wgLab, T('c7', 'wireguard') - .1); hide(wgLab, T('c8', 'sinon'));
const wall = brickWall(main, Z3x, 330, 220, 640); tl.fromTo(wall, { y: 1500 }, { y: 330, duration: .7, ease: 'back.out(1.4)', immediateRender: true }, T('c8', 'sinon') - .1); sfx(T('c8', 'sinon') + .2, 'impact');
tl.to(wg.g, { opacity: .12, duration: .3 }, T('c8', 'sinon') + .2);
const bal = balloon(main, Z3x, -480, 1.0); tl.fromTo(bal, { y: -1300 }, { y: -480, duration: 1.0, ease: 'power2.out', immediateRender: true }, T('c8', 'relais') - .3); sfx(T('c8', 'relais'), 'whoosh'); bob(bal, 20, 1.8, T('c8', 'relais') + .8);
const derpLab = plaque(main, Z3x + 430, -720, 'relais DERP', { size: 56, col: C.violet }); pop(derpLab, T('c8', 'derp'));
const box3 = sealed(main, Z3x - 560, 60, 1.0, C.amber); tl.set(box3, { opacity: 0 }, 0); tl.set(box3, { opacity: 1 }, T('c8', 'transporte') - .2);
tl.to(box3, { x: Z3x, y: -400, duration: .9, ease: 'power2.inOut' }, T('c8', 'transporte') - .2).to(box3, { x: Z3x + 560, y: 60, duration: .9, ease: 'power2.inOut' }, T('c8', 'sans') + .3).to(box3, { opacity: 0, duration: .2 }, T('c8', 'sans') + 1.3);
const noEye = G(main, Z3x - 250, -250, { opacity: 0 }); el('ellipse', { rx: 56, ry: 34, fill: '#fff', stroke: '#1a1440', 'stroke-width': 6 }, noEye); el('circle', { r: 16, fill: '#1a1440' }, noEye); el('path', { d: 'M -60 40 L 60 -40', stroke: C.rose, 'stroke-width': 12, 'stroke-linecap': 'round' }, noEye);
pop(noEye, T('c8', 'ouvrir') - .2); hide([noEye, derpLab], END('c8') - .1);
const portSign = G(main, Z3x, -60); el('rect', { x: -230, y: -80, width: 460, height: 150, rx: 18, fill: C.ink, stroke: C.gold, 'stroke-width': 7 }, portSign);
txt(portSign, 0, -20, 'ports à ouvrir', { size: 44 }); const portV = txt(portSign, 0, 50, '?', { size: 70, w: 800, fill: C.gold, mono: true }), portZ = txt(portSign, 0, 50, '0', { size: 70, w: 800, fill: C.green, mono: true, attrs: { opacity: 0 } });
pop(portSign, T('c9', 'combien') - .1); tl.set(portV, { opacity: 0 }, REV('c9')); tl.set(portZ, { opacity: 1 }, REV('c9')); bump(portSign, REV('c9')); sfx(REV('c9'), 'reveal');
const outL = el('path', { d: `M ${Z3x - 640} -40 C ${Z3x - 640} -500 ${Z3x - 900} -700 ${Z3x - 1100} -760`, stroke: C.cyan, 'stroke-width': 12, fill: 'none', 'stroke-linecap': 'round' }, main);
const outR = el('path', { d: `M ${Z3x + 760} -60 C ${Z3x + 760} -500 ${Z3x + 1000} -700 ${Z3x + 1200} -760`, stroke: C.cyan, 'stroke-width': 12, fill: 'none', 'stroke-linecap': 'round' }, main);
for (const [pth, x] of [[outL, Z3x - 1100], [outR, Z3x + 1200]]) { tl.from(pth, { drawSVG: 0, duration: .7 }, T('c9', 'appelle') - .2); const tip = el('circle', { cx: x, cy: -760, r: 20, fill: C.cyan, filter: 'url(#glow)' }, main); pop(tip, T('c9', 'appelle') + .4, .3); }
const p443 = plaque(main, Z3x - 1000, -560, 'TCP 443 sortant', { size: 62, col: C.cyan }), pUdp = plaque(main, Z3x + 1100, -560, 'UDP 41641', { size: 62, col: C.cyan });
pop(p443, T('c9', 'exterieur') - .2); pop(pUdp, T('c9', 'exterieur'));
const thiefRock2 = rockAt(Z3x + 1500, 300, 360); bob(thiefRock2, 14, 2.2); const thiefA2 = G(thiefRock2, 0, 0);

/* ================= Z4 — the workstation joins the attacker's tailnet (s4, 64.3 → 84.4) ================= */
const Z4x = 9900;
const isV = isle(Z4x - 600, 330, 1100, 220); bob(isV, 12, 2.4); const pc4 = pc(isV, 0, -120, 1.5); tl.to(pc4._scr, { attr: { fill: C.rose }, duration: .01 }, 0); tl.set(pc4._scr, { opacity: .5 }, 0);
const chips = [['+ compte admin local', 'compte'], ['Tailscale (Chocolatey)', 'installe'], ['OpenSSH Server', 'openssh']].map(([s, w], i) => {
  const c = plaque(main, Z4x - 1180, -480 + i * 130, s, { size: 46, mono: false, col: i === 0 ? C.gold : C.cyan }); pop(c, T('c10', w) - .1); hide(c, END('c10') - .2); return c; });
const scriptT = G(main, Z4x - 420, -400); const sc4 = ticket(scriptT, 0, 0, ['script PowerShell'], { size: 44, col: C.rose }); pop(scriptT, T('c10', 'script') - .15); hide(scriptT, END('c10') - .2);
const upT = ticket(main, Z4x - 560, -470, ['tailscale up', '  --auth-key=tskey-…'], { size: 50, col: C.amber }); tl.fromTo(upT, { opacity: 0, y: -400 }, { opacity: 1, y: -470, duration: .7, ease: 'power2.out', immediateRender: true }, T('c11', 'connecte') - .1); sfx(T('c11', 'connecte'), 'pop');
const hard = plaque(main, Z4x - 260, -280, 'écrite en dur', { size: 44, mono: false, col: C.rose }); pop(hard, T('c11', 'ecrite')); hide([upT, hard], END('c12') - .2);
const key4 = keyIcon(main, Z4x - 560, -200, 1.4, C.amber); tl.set(key4, { opacity: 0 }, 0); tl.set(key4, { opacity: 1 }, T('c11', 'cle')); fly(key4, T('c11', 'cle'), Z4x - 600, 0, .7); tl.to(key4, { opacity: 0, duration: .2 }, T('c11', 'cle') + .8);
const redIs = isle(Z4x + 1000, 300, 760, 180); bob(redIs, 12, 2.5, .3);
const redRing = el('ellipse', { cx: Z4x + 1000, cy: 230, rx: 520, ry: 300, fill: 'none', stroke: C.rose, 'stroke-width': 8, 'stroke-dasharray': '26 20' }, main); tl.from(redRing, { drawSVG: 0, duration: .9 }, T('c11', 'rejoint') - .3);
const redLab = plaque(main, Z4x + 1000, -380, 'tailnet de l’attaquant', { size: 52, mono: false, col: C.rose }); pop(redLab, T('c11', 'tailnet'));
const rack4 = rack(redIs, 180, -70, .9); pop(rack4, T('c11', 'rejoint'));
const tn4 = tunnel(`M ${Z4x - 420} 40 C ${Z4x - 100} -360 ${Z4x + 500} -360 ${Z4x + 820} 100`, '#ff7aa2', 14); tn4.core.id = 'tn4'; drawIn(tn4, T('c11', 'rejoint') - .1, 1.0); sfx(T('c11', 'rejoint'), 'whoosh');
flowAlong('#tn4', 0, T('c11', 'rejoint') + .9, END('c12'), '#ffb3c8', .5, 1.2);
const fw4 = brickWall(main, Z4x + 230, 330, 160, 420); pop(fw4, T('c12', 'aucun') - .2); const lock4 = G(main, Z4x + 230, -160); el('rect', { x: -50, y: -20, width: 100, height: 84, rx: 14, fill: C.green }, lock4); el('path', { d: 'M -32 -20 L -32 -50 A 32 32 0 0 1 32 -50 L 32 -20', stroke: C.green, 'stroke-width': 14, fill: 'none' }, lock4);
pop(lock4, T('c12', 'port')); const callTag = plaque(main, Z4x + 230, -620, 'connexion sortante', { size: 46, mono: false, col: '#ff7aa2' }); pop(callTag, T('c12', 'appelle') - .2); hide([callTag], END('c12'));
const thiefA3 = G(redIs, -120, -70);

/* ================= Z5 — three logs (s5, 84.4 → 132.6) ================= */
const Z5x = 13200;
const lib = isle(Z5x, 360, 2700, 220); bob(lib, 8, 3.0);
const bAud = book(main, Z5x - 860, 60, C.green), bFlow = book(main, Z5x, 60, C.cyan), bCli = book(main, Z5x + 860, 60, C.amber);
[bAud, bFlow, bCli].forEach((b, i) => pop(b, T('c14', 'trois') + i * .2, .6));
const tAud = txt(main, Z5x - 860, -260, 'journal d’audit', { size: 56, fill: C.green }), tFlow = txt(main, Z5x, -260, 'flow logs', { size: 56, fill: C.cyan }), tCli = txt(main, Z5x + 860, -260, 'journaux du client', { size: 56, fill: C.amber });
show(tAud, T('c14', 'journal')); show(tFlow, T('c15', 'flow') - .1); show(tCli, T('c16', 'client') - .2);
bookLine(bAud, 0, 'Create node', T('c14', 'qui')); bookLine(bAud, 1, 'Log in node', T('c14', 'change')); bookLine(bAud, 2, 'Update policy file', T('c14', 'quand'));
const audBadge = plaque(main, Z5x - 860, 330, 'toujours actif · 90 j', { size: 46, mono: false, col: C.green }); pop(audBadge, T('c14', 'toujours'));
const fl1 = bookLine(bFlow, 0, 'virtualTraffic', T('c15', 'qui')), fl2 = bookLine(bFlow, 1, 'src → dst', T('c15', 'parle')), fl3 = bookLine(bFlow, 2, 'txBytes rxBytes', T('c15', 'parle') + .4);
const win5 = plaque(main, Z5x + 230, -150, '5 s', { size: 50, col: C.cyan }); pop(win5, T('c15', 'fenetres')); hide(win5, T('c15', 'eteints') - .2);
const sw = G(main, Z5x - 200, -150); el('rect', { x: -70, y: -34, width: 140, height: 68, rx: 34, fill: '#3b3766' }, sw); const knob = el('circle', { cx: -34, cy: 0, r: 26, fill: '#9a96c4' }, sw);
pop(sw, T('c15', 'eteints') - .1); tl.to([fl1, fl2, fl3], { opacity: .3, duration: .3 }, T('c15', 'eteints'));
const flBadge = plaque(main, Z5x, 330, 'désactivés par défaut · Premium, Enterprise', { size: 42, mono: false, col: C.cyan }); pop(flBadge, T('c15', 'defaut') - .1);
bookLine(bCli, 0, 'C:\\ProgramData\\', T('c16', 'client'), { size: 36 }); bookLine(bCli, 1, '   Tailscale', T('c16', 'client') + .2, { size: 36 }); bookLine(bCli, 2, 'journalctl -u', T('c16', 'machine'), { size: 36 }); bookLine(bCli, 3, '   tailscaled', T('c16', 'machine') + .2, { size: 36 });
const cliBadge = plaque(main, Z5x + 860, 330, 'sur la machine', { size: 46, mono: false, col: C.amber }); pop(cliBadge, T('c16', 'machine') + .3);
hide([audBadge, flBadge, cliBadge], CUE.c17.start + .1);
const consoleBox = el('rect', { x: Z5x - 1200, y: -360, width: 1530, height: 610, rx: 40, fill: 'none', stroke: C.text, 'stroke-width': 7, 'stroke-dasharray': '22 16', opacity: 0 }, main);
const consoleLab = plaque(main, Z5x - 430, -440, 'votre console Tailscale', { size: 52, mono: false, col: C.text }); show(consoleBox, T('c17', 'console') - .1); pop(consoleLab, T('c17', 'console'));
const q5 = qmark(main, Z5x - 430, -230, 230); pop(q5, T('c17', 'journal')); hide(q5, REV('c17'));
const redRock5 = rockAt(Z5x + 1750, 300, 600, '#a0456e'); const bRed = book(redRock5, 0, -260, C.rose); const tRed = txt(redRock5, 0, -580, 'audit de son tailnet', { size: 52, fill: C.rose });
tl.set([redRock5], { opacity: 0 }, 0); show(redRock5, T('c17', 'attaquant') - .4, .5);
for (const b of [bAud, bFlow]) { const st = G(b, 0, -40); el('rect', { x: -170, y: -60, width: 340, height: 110, rx: 16, fill: 'none', stroke: C.rose, 'stroke-width': 10, transform: 'rotate(-8)' }, st); txt(st, 0, 22, 'rien', { size: 64, w: 800, fill: C.rose, attrs: { transform: 'rotate(-8)' } }); pop(st, REV('c17') + (b === bFlow ? .15 : 0)); hide(st, END('c17') - .2); }
sfx(REV('c17'), 'reveal'); sfx(REV('c17') + .3, 'myth');
bookLine(bRed, 0, 'Create node', T('c17', 'son') - .2); bookLine(bRed, 1, 'Log in node', T('c17', 'son') + .1); tl.to(consoleLab, { opacity: 0, duration: .3 }, T('c17', 'son')); tl.to(consoleBox, { opacity: 0, duration: .3 }, T('c17', 'son'));
const glowCli = el('rect', { x: Z5x + 540, y: -190, width: 640, height: 300, rx: 30, fill: C.amber, opacity: 0, filter: 'url(#soft)' }, main); main.insertBefore(glowCli, bCli);
tl.to(glowCli, { opacity: .45, duration: .5 }, T('c17', 'seul')); tl.to(glowCli, { opacity: 0, duration: .4 }, END('c17'));
const deny = el('path', { d: `M ${Z5x - 600} -560 L ${Z5x - 150} -560`, stroke: C.rose, 'stroke-width': 14, 'stroke-linecap': 'round' }, main); const bar = el('rect', { x: Z5x - 140, y: -640, width: 30, height: 160, rx: 10, fill: C.rose }, main);
const okA = el('path', { d: `M ${Z5x + 160} -560 C ${Z5x + 300} -560 ${Z5x + 200} -300 ${Z5x + 120} -130`, stroke: C.green, 'stroke-width': 14, fill: 'none', 'stroke-linecap': 'round' }, main);
tl.set([deny, bar, okA], { opacity: 0 }, 0); show(deny, T('c18', 'tentatives') - .2, .2); tl.from(deny, { drawSVG: 0, duration: .5 }, T('c18', 'tentatives') - .2); show(bar, T('c18', 'refusees') - .3, .2);
const denyLab = plaque(main, Z5x - 400, -700, 'refusée : non journalisée', { size: 44, mono: false, col: C.rose }); pop(denyLab, T('c18', 'refusees')); sfx(T('c18', 'refusees'), 'myth');
show(okA, T('c18', 'connexions') - .2, .2); tl.from(okA, { drawSVG: 0, duration: .5 }, T('c18', 'connexions') - .2); tl.to([fl1, fl2, fl3], { opacity: 1, duration: .3 }, T('c18', 'reussies'));
const noContent = plaque(main, Z5x + 520, -700, 'contenu : jamais', { size: 44, mono: false, col: C.text }); pop(noContent, T('c18', 'contenu') - .1);
hide([deny, bar, okA, denyLab, noContent], END('c18') - .1);
const heroB2 = G(main, Z5x - 1330, 300);

/* ================= Z6 — searching the workstation (s6, 132.6 → 156.1) ================= */
const Z6x = 17300;
const isW = isle(Z6x - 700, 330, 1200, 220); bob(isW, 10, 2.4); const pc6 = pc(isW, 120, -120, 1.6); tl.set(pc6._scr, { opacity: .5 }, 0); tl.set(pc6._scr, { attr: { fill: C.rose } }, 0);
const term = terminal(main, Z6x + 380, -620, 1080, 5); pop(term, T('c19', 'cherche') - .2, .5);
termLine(term, 0, 'tailscale.exe        (aucun VPN prévu)', T('c19', 'tailscale'), '#ff9fb8');
termLine(term, 1, '→ controlplane.tailscale.com:443', T('c19', 'coordination') - .3, C.cyan);
const t20 = [termLine(term, 2, '> tailscale status --json', T('c20', 'commande'), C.green), termLine(term, 3, '"CurrentTailnet": { "Name": "…" }', T('c20', 'nom'), '#e6e1ff')];
const notYours = plaque(main, Z6x + 380, -165, '≠ votre tailnet', { size: 52, mono: false, col: C.rose }); pop(notYours, T('c20', 'si')); sfx(T('c20', 'incident'), 'impact');
const siren6 = G(isW, 120, -520, { opacity: 0 }); el('circle', { r: 130, fill: 'url(#redHalo)' }, siren6); el('rect', { x: -22, y: -26, width: 44, height: 36, rx: 10, fill: C.rose }, siren6);
tl.to(siren6, { opacity: 1, duration: .2 }, T('c20', 'incident')).to(siren6, { opacity: .3, duration: .3, repeat: 5, yoyo: true }, T('c20', 'incident') + .2);
hide([term, notYours, siren6], END('c20') - .1);
const heroB3 = G(isW, -340, -70);
// your own tailnet: a stolen reusable key makes a new node appear
const isY = isle(Z6x + 1700, 330, 1300, 220); bob(isY, 10, 2.6);
const yRing = el('ellipse', { cx: Z6x + 1700, cy: 240, rx: 760, ry: 330, fill: 'none', stroke: C.cyan, 'stroke-width': 8, 'stroke-dasharray': '30 22' }, main); tl.set(yRing, { opacity: 0 }, 0); show(yRing, T('c21', 'propre') - .2);
const yLab = plaque(main, Z6x + 1700, -420, 'votre tailnet', { size: 54, mono: false, col: C.cyan }); pop(yLab, T('c21', 'tailnet'));
const yRack = rack(isY, 330, -70, .95); pop(yRack, T('c21', 'propre'));
const reuse = G(main, Z6x + 1000, -150); keyCard(reuse, 0, 0, 1.4, C.rose); const reuseLab = plaque(main, Z6x + 1000, -330, 'clé réutilisable', { size: 46, mono: false, col: C.rose });
pop(reuse, T('c21', 'cle') - .1); pop(reuseLab, T('c21', 'reutilisable')); fly(reuse, T('c21', 'volee') + .1, Z6x + 1500, 110, .8);
const newNode = laptop(isY, -80, -70, 1.1); pop(newNode, T('c21', 'noeud') - .1);
const audT = ticket(main, Z6x + 2350, -330, ['Create node', 'Log in node'], { size: 46, col: C.green }); tl.set(audT, { opacity: 0 }, 0); show(audT, T('c21', 'audit'));
tl.fromTo(audT.querySelectorAll('text')[1], { opacity: 0 }, { opacity: 1, duration: .3, immediateRender: true }, T('c21', 'connecte') - .1); sfx(T('c21', 'connecte'), 'tick');
hide([reuse, reuseLab], END('c21') - .2);
const thiefA4 = G(main, Z6x + 760, 300); const thiefRock4 = rockAt(Z6x + 760, 300, 320); main.insertBefore(thiefRock4, thiefA4);

/* ================= Z7 — recap on the same workstation (s7, 156.1 → 191.6) ================= */
const Z7x = 23000;
const isR7 = isle(Z7x, 330, 1500, 220); bob(isR7, 12, 2.4); const pc7 = pc(isR7, 0, -120, 1.5); tl.set(pc7._scr, { attr: { fill: C.rose }, opacity: .5 }, 0);
const thiefRock7 = rockAt(Z7x - 920, 300, 380); const thiefA5 = G(thiefRock7, 0, 0);
const tn7 = tunnel(`M ${Z7x - 160} 150 C ${Z7x - 380} 320 ${Z7x - 640} 380 ${Z7x - 870} 250`, '#ff7aa2', 14); tn7.core.id = 'tn7'; tn7.core.setAttribute('stroke-dasharray', '28 18');
flowAlong('#tn7', 0, CUE.c22.start, T('c23', 'obligatoire'), '#ffb3c8', .7, 1.4);
const bell7 = bell(main, Z7x - 420, -470, 1.0); pop(bell7, T('c22', 'alertez') - .2); ring(bell7, T('c22', 'alertez') + .2);
const lock7 = G(main, Z7x, -520); el('rect', { x: -60, y: -24, width: 120, height: 100, rx: 16, fill: C.green }, lock7); el('path', { d: 'M -38 -24 L -38 -60 A 38 38 0 0 1 38 -60 L 38 -24', stroke: C.green, 'stroke-width': 16, fill: 'none' }, lock7); pop(lock7, T('c23', 'imposez') - .1);
tl.to(tn7.g, { opacity: 0, duration: .4 }, T('c23', 'obligatoire') + .1); sfx(T('c23', 'obligatoire') + .1, 'impact');
tl.to(thiefRock7, { x: '-=900', y: '+=200', opacity: 0, duration: 1.6, ease: 'power2.in' }, T('c23', 'obligatoire') + .3);
tl.to(pc7._scr, { attr: { fill: C.cyan }, duration: .4 }, T('c23', 'obligatoire') + .3);
const b7w = G(main, Z7x + 480, -400); book(el('g', { transform: 'scale(.55)' }, b7w), 0, 0, C.green); pop(b7w, T('c24', 'activez') - .1);
const sw7 = G(main, Z7x + 480, -600); el('rect', { x: -70, y: -34, width: 140, height: 68, rx: 34, fill: '#3b3766' }, sw7); const knob7 = el('circle', { cx: -34, cy: 0, r: 26, fill: '#9a96c4' }, sw7);
pop(sw7, T('c24', 'activez') - .1); tl.to(knob7, { attr: { cx: 34, fill: C.green }, duration: .3 }, T('c24', 'flow')); sfx(T('c24', 'flow'), 'pop');
const rules = [['1 · EDR : tailscale.exe · OpenSSH Server', 'c22', 'alertez', C.gold], ['2 · politique Tailnet = required:T…CNTRL', 'c23', 'politique', C.green], ['3 · flow logs ON · audit → SIEM · clés à usage unique', 'c24', 'activez', C.cyan]];
rules.forEach(([s, cid, w, col]) => { const pl = plaque(main, Z7x, 430, s, { size: 46, col }); pop(pl, T(cid, w) + .1); hide(pl, END(cid) - .15); });
const bull = plaque(main, Z7x + 60, 430, 'Tailscale Security Bulletins', { size: 50, mono: false, col: C.violet }); pop(bull, T('c25', 'failles')); hide(bull, T('c25', 'vous') - .1);
const done = plaque(main, Z7x, 430, 'où chercher : le poste, puis votre console', { size: 50, mono: false, col: C.gold }); pop(done, T('c25', 'chercher') - .2);
const heroB4 = G(isR7, -430, -70);
