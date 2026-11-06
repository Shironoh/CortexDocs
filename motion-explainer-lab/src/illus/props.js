/* ================= props shared by every zone ================= */
const SANS = "Poppins,'DejaVu Sans',sans-serif";
const txt = (p, x, y, s, o = {}) => { const t = el('text', { x, y, 'text-anchor': o.anchor || 'middle', 'font-family': o.mono ? MONO : SANS, 'font-weight': o.w || 700, 'font-size': o.size || 50, fill: o.fill || C.text, ...(o.attrs || {}) }, p); t.textContent = s; return t; };
const isle = (x, y, w, h = 200) => { const g = G(main, x, y); cloudIsland(g, 0, 0, w, h); return g; };
function pc(p, x, y, s = 1) { const g = G(p, x, y); const b = el('g', { transform: `scale(${s})` }, g);
  el('rect', { x: -170, y: -8, width: 340, height: 22, rx: 8, fill: '#6a55b8' }, b); el('rect', { x: -150, y: 14, width: 18, height: 70, fill: '#4a3d8a' }, b); el('rect', { x: 132, y: 14, width: 18, height: 70, fill: '#4a3d8a' }, b);
  el('rect', { x: -14, y: -52, width: 28, height: 46, fill: '#3b2f7a' }, b); el('rect', { x: -60, y: -14, width: 120, height: 10, rx: 4, fill: '#3b2f7a' }, b);
  el('rect', { x: -130, y: -210, width: 260, height: 162, rx: 16, fill: '#1b1546', stroke: '#8f86ff', 'stroke-width': 8 }, b);
  const scr = el('rect', { x: -116, y: -196, width: 232, height: 134, rx: 8, fill: '#22d3ee', opacity: .25 }, b);
  el('rect', { x: 160, y: -120, width: 70, height: 112, rx: 10, fill: '#2c2560', stroke: '#6c63d9', 'stroke-width': 5 }, b); const led = el('circle', { cx: 195, cy: -92, r: 7, fill: C.green }, b);
  g._scr = scr; g._led = led; return g; }
function rack(p, x, y, s = 1) { const g = G(p, x, y); const b = el('g', { transform: `scale(${s})` }, g);
  el('rect', { x: -80, y: -230, width: 160, height: 230, rx: 14, fill: '#2c2560', stroke: '#8f86ff', 'stroke-width': 6 }, b);
  for (let i = 0; i < 4; i++) { el('rect', { x: -62, y: -212 + i * 52, width: 124, height: 38, rx: 6, fill: '#1b1546' }, b); const l = el('circle', { cx: 44, cy: -193 + i * 52, r: 7, fill: C.green }, b); tl.to(l, { opacity: .2, duration: .3 + i * .07, repeat: 300, yoyo: true }, i * .2); }
  return g; }
function laptop(p, x, y, s = 1) { const g = G(p, x, y); const b = el('g', { transform: `scale(${s})` }, g);
  el('path', { d: 'M -130 0 L 130 0 L 150 18 L -150 18 Z', fill: '#6a55b8' }, b); el('rect', { x: -110, y: -150, width: 220, height: 145, rx: 12, fill: '#1b1546', stroke: '#8f86ff', 'stroke-width': 7 }, b);
  el('rect', { x: -96, y: -136, width: 192, height: 118, rx: 6, fill: '#9d8cff', opacity: .3 }, b); return g; }
function phone(p, x, y, s = 1) { const g = G(p, x, y); const b = el('g', { transform: `scale(${s})` }, g);
  el('rect', { x: -48, y: -170, width: 96, height: 170, rx: 18, fill: '#1b1546', stroke: '#8f86ff', 'stroke-width': 7 }, b); el('rect', { x: -36, y: -150, width: 72, height: 124, rx: 8, fill: '#2ee6a0', opacity: .3 }, b); return g; }
function ctlTower(p, x, y, s = 1, col = C.cyan) { const g = G(p, x, y); const b = el('g', { transform: `scale(${s})` }, g);
  el('path', { d: 'M -70 0 L 70 0 L 40 -460 L -40 -460 Z', fill: 'url(#wall)' }, b); el('path', { d: 'M 40 -460 L 70 0 L 90 -20 L 56 -470 Z', fill: 'url(#wallSide)' }, b);
  for (let i = 0; i < 4; i++) el('rect', { x: -14, y: -400 + i * 90, width: 28, height: 40, rx: 6, fill: '#ffd36b', opacity: .8 }, b);
  el('rect', { x: -130, y: -600, width: 260, height: 140, rx: 30, fill: '#2c2560', stroke: col, 'stroke-width': 8 }, b);
  el('rect', { x: -110, y: -580, width: 220, height: 70, rx: 18, fill: col, opacity: .35 }, b); el('rect', { x: -150, y: -470, width: 300, height: 18, rx: 9, fill: '#4a43a3' }, b);
  const halo = el('circle', { cx: 0, cy: -650, r: 110, fill: col === C.rose ? 'url(#redHalo)' : 'url(#cyanHalo)', opacity: 0 }, b);
  el('rect', { x: -6, y: -660, width: 12, height: 60, fill: '#b9b2e3' }, b); const bea = el('circle', { cx: 0, cy: -664, r: 16, fill: col }, b);
  g._halo = halo; g._bea = bea; return g; }
function brickWall(p, x, y, w, h) { const g = G(p, x, y); el('rect', { x: -w / 2, y: -h, width: w, height: h, rx: 10, fill: '#5b2a4a', stroke: '#ff7aa2', 'stroke-width': 6 }, g);
  for (let r = 0; r < Math.floor(h / 60); r++) for (let c = 0; c < Math.ceil(w / 90) + 1; c++) { const bx = -w / 2 + c * 90 - (r % 2) * 45; if (bx < -w / 2 - 40 || bx > w / 2 - 50) continue;
    el('rect', { x: Math.max(-w / 2 + 6, bx + 4), y: -h + 6 + r * 60, width: Math.min(82, w / 2 - 6 - Math.max(-w / 2 + 6, bx + 4)), height: 50, rx: 6, fill: '#7a3560', opacity: .9 }, g); }
  return g; }
function balloon(p, x, y, s = 1) { const g = G(p, x, y); const b = el('g', { transform: `scale(${s})` }, g);
  el('path', { d: 'M 0 -330 C 170 -330 200 -150 120 -60 L 50 10 L -50 10 L -120 -60 C -200 -150 -170 -330 0 -330 Z', fill: C.violet }, b);
  el('path', { d: 'M 0 -330 C 60 -320 70 -150 40 -60 L 20 10 L -20 10 L -40 -60 C -70 -150 -60 -320 0 -330 Z', fill: '#c4b8ff' }, b);
  el('path', { d: 'M -46 10 L -40 70 M 46 10 L 40 70', stroke: '#c7c3e8', 'stroke-width': 5 }, b); el('rect', { x: -56, y: 66, width: 112, height: 70, rx: 12, fill: '#8a5a2b' }, b); return g; }
function sealed(p, x, y, s = 1, col = C.amber) { const g = G(p, x, y); const b = el('g', { transform: `scale(${s})` }, g);
  el('rect', { x: -34, y: -34, width: 68, height: 68, rx: 12, fill: col }, b); el('rect', { x: -12, y: -6, width: 24, height: 20, rx: 4, fill: '#120f33' }, b);
  el('path', { d: 'M -8 -6 L -8 -16 A 8 8 0 0 1 8 -16 L 8 -6', stroke: '#120f33', 'stroke-width': 5, fill: 'none' }, b); return g; }
function keyCard(p, x, y, s = 1, col = C.amber) { const g = G(p, x, y); const b = el('g', { transform: `scale(${s})` }, g);
  el('rect', { x: -60, y: -40, width: 120, height: 80, rx: 12, fill: C.paper }, b); el('rect', { x: -60, y: -40, width: 120, height: 14, rx: 6, fill: col }, b);
  keyIcon(b, 6, 8, .62, '#1a1440'); return g; }
function scrollCard(p, x, y, s = 1) { const g = G(p, x, y); const b = el('g', { transform: `scale(${s})` }, g);
  el('rect', { x: -50, y: -60, width: 100, height: 120, rx: 10, fill: C.paper }, b); for (let i = 0; i < 4; i++) el('rect', { x: -34, y: -40 + i * 24, width: i === 3 ? 40 : 68, height: 9, rx: 4, fill: C.violet }, b); return g; }
function book(p, x, y, col) { const g = G(p, x, y);
  el('path', { d: 'M -60 170 L 60 170 L 30 40 L -30 40 Z', fill: '#2c2560' }, g); el('rect', { x: -110, y: 160, width: 220, height: 24, rx: 10, fill: '#3b2f86' }, g);
  el('path', { d: 'M -300 -170 L 0 -150 L 300 -170 L 300 70 L 0 90 L -300 70 Z', fill: '#2a1f5e' }, g);
  el('path', { d: 'M -284 -160 L -6 -142 L -6 76 L -284 60 Z', fill: C.paper }, g); el('path', { d: 'M 6 -142 L 284 -160 L 284 60 L 6 76 Z', fill: '#e9e2d0' }, g);
  el('rect', { x: -300, y: -178, width: 600, height: 14, rx: 7, fill: col }, g); g._lines = el('g', {}, g); return g; }
const bookLine = (b, i, s, t, o = {}) => { const ln = txt(b._lines, o.x ?? -270, -105 + i * 52, s, { anchor: 'start', mono: true, size: o.size || 40, fill: o.fill || '#1a1440' }); tl.fromTo(ln, { opacity: 0 }, { opacity: 1, duration: .3, immediateRender: true }, t); sfx(t, 'tick'); return ln; };
function terminal(p, x, y, w, rows) { const g = G(p, x, y); el('rect', { x: -w / 2 + 8, y: 10, width: w, height: rows * 62 + 70, rx: 18, fill: '#000', opacity: .35 }, g);
  el('rect', { x: -w / 2, y: 0, width: w, height: rows * 62 + 70, rx: 18, fill: '#0d0a26', stroke: '#6c63d9', 'stroke-width': 6 }, g);
  for (let i = 0; i < 3; i++) el('circle', { cx: -w / 2 + 34 + i * 30, cy: 26, r: 9, fill: ['#ff4d6d', C.amber, C.green][i] }, g); g._w = w; return g; }
const termLine = (term, i, s, t, fill = '#e6e1ff', size = 42) => { const ln = txt(term, -term._w / 2 + 36, 96 + i * 62, s, { anchor: 'start', mono: true, size, fill, attrs: { style: 'white-space:pre' } }); tl.fromTo(ln, { opacity: 0 }, { opacity: 1, duration: .25, immediateRender: true }, t); sfx(t, 'tick'); return ln; };
function rockAt(x, y, w = 380, col = '#7b64c2') { const g = G(main, x, y); el('path', { d: `M ${-w / 2} 0 L ${w / 2} 0 L ${w * .3} 130 L ${w * .08} 240 L ${-w * .18} 170 L ${-w * .4} 100 Z`, fill: 'url(#rock)' }, g);
  el('path', { d: `M ${-w / 2} 0 L ${w / 2} 0 L ${w / 2 - 24} 24 L ${-w / 2 + 24} 24 Z`, fill: col }, g); return g; }
const qmark = (p, x, y, size = 190, col = C.gold) => { const g = G(p, x, y); txt(g, 0, size * .35, '?', { size, w: 800, fill: col }); return g; };
const bob = (g, amp, d, t0 = 0) => tl.to(g, { y: `-=${amp}`, duration: d, repeat: Math.ceil(200 / d), yoyo: true, ease: 'sine.inOut' }, t0);
const tunnel = (d, col, w = 18) => { const g = el('g', {}, main); el('path', { d, stroke: '#0f0a24', 'stroke-width': w + 16, fill: 'none', 'stroke-linecap': 'round', opacity: .8 }, g);
  const core = el('path', { d, stroke: col, 'stroke-width': w, fill: 'none', 'stroke-linecap': 'round', filter: 'url(#glow)' }, g); return { g, core, parts: [...g.children] }; };
const drawIn = (tn, t, d = 1) => { for (const p of tn.parts) tl.from(p, { drawSVG: 0, duration: d, ease: 'power2.inOut' }, t); };
const flowAlong = (id, n, t0, t1, col = C.amber, gap = .45, dur = 1.2) => { for (let i = 0; t0 + i * gap < t1; i++) { const d = el('circle', { r: 13, fill: col, filter: 'url(#glow)', opacity: 0 }, main); const a = t0 + i * gap;
  tl.set(d, { opacity: 1 }, a).to(d, { motionPath: { path: id, align: id, alignOrigin: [.5, .5] }, duration: dur, ease: 'none' }, a).set(d, { opacity: 0 }, a + dur); } };
const fly = (e, t, x, y, d = .9) => tl.to(e, { x, y, duration: d, ease: 'power2.inOut' }, t);
