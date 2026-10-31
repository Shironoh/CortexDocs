/* motion-explainer engine — pure function of time, no library.
   Everything is created once; render(t) only mutates attributes. */
'use strict';
const NS = 'http://www.w3.org/2000/svg';
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, p) => a + (b - a) * p;
const P = (t, a, d) => d <= 0 ? (t >= a ? 1 : 0) : clamp((t - a) / d);
const E = {
  lin: p => p, oc: p => 1 - (1 - p) ** 3, ic: p => p ** 3,
  ioc: p => p < .5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2,
  ob: p => 1 + 2.6 * (p - 1) ** 3 + 1.6 * (p - 1) ** 2,
};
let AMBIENT = true;
const WPS = 2.6;            // words per second (timing model)
const GUESS_PAUSE = 1.5;    // silence for "devinez"

function S(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs || {}) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
const words = s => s.replace(/\|/g, ' ').trim().split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)); // French spacing: lone ':' '?' are not words
const norm = w => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9_%@.\-]/g, '');

/* ---------------- Actor ---------------- */
class Actor {
  constructor(el, o) { this.el = el; this.o = o; this.bx = o.x || 0; this.by = o.y || 0; this.bs = o.s == null ? 1 : o.s; this.br = o.r || 0;
    if (o.dash) { this.len = o.len || (el.getTotalLength ? el.getTotalLength() : 1000); el.setAttribute('stroke-dasharray', this.len); } }
  update(t) {
    const o = this.o; let x = this.bx, y = this.by, s = this.bs, r = this.br, a = o.a == null ? 1 : o.a;
    if (o.pop != null) { const p = P(t, o.pop, .6); s *= p <= 0 ? 0.001 : .4 + .6 * E.ob(p); a *= Math.min(1, p * 3); }
    if (o.fin) { a *= E.oc(P(t, o.fin[0], o.fin[1])); }
    for (const m of o.moves || []) { const p = (m[3] || E.ioc)(P(t, m[0], m[1]));
      if (p <= 0) continue; const v = m[2];
      if ('x' in v) x = lerp(x, v.x, p); if ('y' in v) y = lerp(y, v.y, p); if ('s' in v) s = lerp(s, v.s, p);
      if ('r' in v) r = lerp(r, v.r, p); if ('a' in v) a *= lerp(1, v.a, p); }
    if (o.out != null) a *= 1 - P(t, o.out, o.outd || .4);
    const st = { x, y, s, r, a };
    if (o.fn) o.fn(st, t);
    if (o.dash) this.el.setAttribute('stroke-dashoffset', this.len * (1 - E.ioc(P(t, o.dash[0], o.dash[1]))));
    this.el.setAttribute('opacity', st.a.toFixed(3));
    this.el.setAttribute('visibility', st.a > 0.001 ? 'visible' : 'hidden');
    this.el.setAttribute('transform', `translate(${st.x.toFixed(2)} ${st.y.toFixed(2)}) rotate(${st.r.toFixed(2)}) scale(${Math.max(st.s, 0.0001).toFixed(4)})`);
  }
}

/* ---------------- Characters ---------------- */
const SHAPES = {
  blob: 'M -58 0 C -66 -44 -56 -128 0 -130 C 56 -128 66 -44 58 0 Q 0 10 -58 0 Z',
  robot: 'M -54 -8 Q -58 -120 -40 -122 L 40 -122 Q 58 -120 54 -8 Q 0 4 -54 -8 Z',
};
const MOUTH = {
  neutral: 'M -13 -50 Q 0 -46 13 -50', happy: 'M -17 -54 Q 0 -36 17 -54', smug: 'M -15 -50 Q 5 -44 17 -56',
  angry: 'M -14 -44 Q 0 -54 14 -44', surprise: 'M -8 -50 a 8 10 0 1 0 16 0 a 8 10 0 1 0 -16 0', worried: 'M -14 -46 Q -4 -52 4 -48 Q 10 -45 14 -48',
};
const BROWS = { // [left, right] as dy at inner, dy at outer
  neutral: [[0, 0], [0, 0]], happy: [[-4, -4], [-4, -4]], smug: [[2, 2], [-10, -4]], angry: [[8, -4], [8, -4]],
  surprise: [[-12, -10], [-12, -10]], worried: [[-8, 2], [-8, 2]],
};
class Char {
  constructor(K, parent, o) {
    this.K = K; this.o = o; this.x = o.x; this.y = o.y; this.s = o.s || 1; this.dir = o.dir || 1;
    this.moves = []; this.poses = []; this.exprs = [[-1, o.expr || 'neutral']]; this.looks = [];
    this.popT = o.pop; this.outT = null;
    const col = o.color, dark = o.dark || '#0B1A3A';
    this.root = S('g', { 'data-char': o.name || '' }, parent);
    S('ellipse', { cx: 0, cy: 2, rx: 60, ry: 11, fill: '#000', opacity: .28 }, this.root);
    this.body = S('g', {}, this.root);
    const shape = SHAPES[o.shape || 'blob'];
    S('path', { d: shape, fill: dark, opacity: .45, transform: 'translate(7 7)' }, this.body);
    this.armL = S('path', { fill: 'none', stroke: o.limb || col, 'stroke-width': 13, 'stroke-linecap': 'round' }, this.body);
    this.armR = S('path', { fill: 'none', stroke: o.limb || col, 'stroke-width': 13, 'stroke-linecap': 'round' }, this.body);
    if (o.ghost) S('path', { d: shape, fill: col, 'fill-opacity': .12, stroke: col, 'stroke-width': 6, 'stroke-dasharray': '16 12' }, this.body);
    else { S('path', { d: shape, fill: col }, this.body);
      S('ellipse', { cx: -18, cy: -96, rx: 16, ry: 9, fill: '#fff', opacity: .25, transform: 'rotate(-25 -18 -96)' }, this.body); }
    if (o.shape === 'robot') {
      S('line', { x1: 0, y1: -122, x2: 0, y2: -150, stroke: col, 'stroke-width': 6 }, this.body);
      this.bulb = S('circle', { cx: 0, cy: -154, r: 9, fill: '#FFB703' }, this.body);
      S('rect', { x: -40, y: -108, width: 80, height: 52, rx: 14, fill: '#0B1A3A', opacity: .55 }, this.body);
    }
    if (o.mask) { S('path', { d: 'M -50 -100 Q 0 -112 50 -100 L 48 -72 Q 0 -80 -48 -72 Z', fill: '#2A0F2E' }, this.body);
      S('path', { d: 'M -46 -118 Q 0 -150 46 -118 Q 0 -128 -46 -118 Z', fill: '#2A0F2E' }, this.body); }
    this.face = S('g', { opacity: o.ghost ? .35 : 1 }, this.body);
    this.eyes = S('g', {}, this.face);
    this.pupils = [];
    for (const ex of [-20, 20]) {
      S('ellipse', { cx: ex, cy: -86, rx: 14, ry: 16, fill: '#fff' }, this.eyes);
      this.pupils.push(S('circle', { cx: ex, cy: -86, r: 7, fill: '#0B1A3A' }, this.eyes));
    }
    this.browL = S('path', { stroke: '#0B1A3A', 'stroke-width': 5, 'stroke-linecap': 'round', fill: 'none' }, this.face);
    this.browR = S('path', { stroke: '#0B1A3A', 'stroke-width': 5, 'stroke-linecap': 'round', fill: 'none' }, this.face);
    this.mouth = S('path', { stroke: '#0B1A3A', 'stroke-width': 5, 'stroke-linecap': 'round', fill: '#0B1A3A', 'fill-opacity': 0 }, this.face);
    if (o.headset) { S('path', { d: 'M -60 -84 Q -62 -150 0 -150 Q 62 -150 60 -84', stroke: '#0B1A3A', 'stroke-width': 8, fill: 'none' }, this.body);
      S('rect', { x: -68, y: -98, width: 16, height: 30, rx: 6, fill: '#0B1A3A' }, this.body);
      S('path', { d: 'M -60 -74 Q -50 -50 -22 -50', stroke: '#0B1A3A', 'stroke-width': 5, fill: 'none' }, this.body); }
    this.handL = S('circle', { r: 10, fill: o.limb || col }, this.body);
    this.handR = S('circle', { r: 10, fill: o.limb || col }, this.body);
    this.loupe = S('g', { visibility: 'hidden' }, this.body);
    S('line', { x1: 0, y1: 0, x2: 24, y2: 30, stroke: '#7c5a3a', 'stroke-width': 10, 'stroke-linecap': 'round' }, this.loupe);
    S('circle', { cx: -14, cy: -18, r: 30, fill: '#bfefff', 'fill-opacity': .25, stroke: '#F8FAFC', 'stroke-width': 7 }, this.loupe);
    this.prop = null;
  }
  /* timeline API (times absolute, coords in parent space) */
  pop(t) { this.popT = t; this.K.ev(t, 'pop'); return this; }
  out(t) { this.outT = t; return this; }
  walk(t, d, x, y) { this.moves.push({ t, d, x, y: y == null ? null : y, walk: true }); return this; }
  slide(t, d, x, y) { this.moves.push({ t, d, x, y: y == null ? null : y, walk: false }); return this; }
  pose(t, d, name, p) { this.poses.push({ t, d, name, p: p || {} }); if (['point', 'jump', 'shrug', 'loupe', 'cheer'].includes(name)) this.K.mark(t); return this; }
  expr(t, e) { this.exprs.push([t, e]); this.exprs.sort((a, b) => a[0] - b[0]); return this; }
  look(t, x, y) { this.looks.push([t, x, y]); this.looks.sort((a, b) => a[0] - b[0]); return this; }
  hold(el) { this.prop = el; return this; }
  posAt(t) {
    let x = this.x, y = this.y, walking = 0, phase = 0;
    for (const m of this.moves) { const p = E.ioc(P(t, m.t, m.d)); if (p <= 0) continue;
      const nx = lerp(x, m.x, p), ny = m.y == null ? y : lerp(y, m.y, p);
      if (m.walk && p > 0 && p < 1) { walking = Math.sin(Math.PI * p); phase = (t - m.t) * 9; this._wd = Math.sign(m.x - x) || this._wd; }
      x = nx; y = ny; }
    return { x, y, walking, phase };
  }
  update(t) {
    const st = this.posAt(t);
    let a = 1, sc = this.s;
    if (this.popT != null) { const p = P(t, this.popT, .6); sc *= p <= 0 ? 0.001 : .4 + .6 * E.ob(p); a = Math.min(1, p * 3); }
    if (this.outT != null) a *= 1 - P(t, this.outT, .4);
    // expression
    let ex = 'neutral'; for (const e of this.exprs) if (t >= e[0]) ex = e[1];
    // pose
    let rest = { L: [-62, -22], R: [62, -22] }, H = { L: rest.L.slice(), R: rest.R.slice() };
    let bodyDy = 0, bodyRot = 0, sy = 1, sx = 1, loupe = 0, gaze = null;
    if (st.walking > 0) { const sw = Math.sin(st.phase) * 22 * st.walking; H.L = [-58 + sw, -24]; H.R = [58 - sw, -24];
      bodyDy -= Math.abs(Math.sin(st.phase)) * 10 * st.walking; bodyRot = 4 * st.walking * (this._wd || 1); }
    for (const q of this.poses) {
      const pin = P(t, q.t, .28), pout = 1 - P(t, q.t + q.d - .25, .25); let w = E.oc(Math.min(pin, pout));
      if (t < q.t - .15 || t > q.t + q.d) continue;
      if (t < q.t) { const ant = 1 - Math.abs((t - (q.t - .075)) / .075); bodyDy += 5 * ant; sy *= 1 - .04 * ant; continue; } // anticipation
      const n = q.name, p = q.p;
      if (n === 'point') { const dx = p.x - st.x, dy = p.y - (st.y - 70 * this.s); const L = Math.hypot(dx, dy) || 1;
        const side = dx < 0 ? 'L' : 'R'; const sh = side === 'L' ? [-48, -62] : [48, -62];
        const tgt = [sh[0] + dx / L * 82, sh[1] + dy / L * 82]; H[side] = [lerp(H[side][0], tgt[0], w), lerp(H[side][1], tgt[1], w)];
        bodyRot += (dx < 0 ? -5 : 5) * w; gaze = [p.x, p.y]; }
      if (n === 'loupe') { H.R = [lerp(H.R[0], 52, w), lerp(H.R[1], -50, w)]; loupe = w; }
      if (n === 'shrug') { H.L = [lerp(H.L[0], -86, w), lerp(H.L[1], -96, w)]; H.R = [lerp(H.R[0], 86, w), lerp(H.R[1], -96, w)]; bodyDy += 6 * w; }
      if (n === 'cheer') { H.L = [lerp(H.L[0], -74, w), lerp(H.L[1], -132, w)]; H.R = [lerp(H.R[0], 74, w), lerp(H.R[1], -132, w)];
        bodyDy -= 14 * Math.abs(Math.sin((t - q.t) * 7)) * w; }
      if (n === 'hold') { H.L = [lerp(H.L[0], -40, w), lerp(H.L[1], -70, w)]; H.R = [lerp(H.R[0], 40, w), lerp(H.R[1], -70, w)]; }
      if (n === 'type') { const j = Math.sin((t - q.t) * 22); H.L = [lerp(H.L[0], -34, w), lerp(H.L[1], -26 + 6 * j, w)]; H.R = [lerp(H.R[0], 34, w), lerp(H.R[1], -26 - 6 * j, w)]; }
      if (n === 'jump') { const k = P(t, q.t, Math.min(.7, q.d)); const h = Math.sin(Math.PI * k);
        bodyDy -= 48 * h; sy *= k < .12 ? 1 - .2 * Math.sin(k / .12 * Math.PI) : 1 + .1 * h; sx = 2 - sy;
        H.L = [lerp(H.L[0], -80, w), lerp(H.L[1], -118, w)]; H.R = [lerp(H.R[0], 80, w), lerp(H.R[1], -118, w)]; }
      if (n === 'nod') { bodyDy += 7 * Math.abs(Math.sin((t - q.t) * 9)) * w; }
      if (n === 'lean') { bodyRot += (p.dir || 1) * 10 * w; }
      if (n === 'walkcycle') { const sw = Math.sin((t - q.t) * 9) * 22 * w; H.L = [-58 + sw, -24]; H.R = [58 - sw, -24]; bodyDy -= Math.abs(Math.sin((t - q.t) * 9)) * 10 * w; }
    }
    // gaze
    if (!gaze) { let L = null; for (const l of this.looks) if (t >= l[0]) L = l; if (L && L[1] != null) gaze = [L[1], L[2]]; }
    let px = 0, py = 0;
    if (gaze) { const dx = gaze[0] - st.x, dy = gaze[1] - (st.y - 86 * this.s); const L = Math.hypot(dx, dy) || 1; px = dx / L * 6; py = dy / L * 6; }
    // ambient: breathing + blink
    let blink = 1;
    if (AMBIENT) { sy *= 1 + .018 * Math.sin(t * 2.3 + this.x); const bt = (t + (this.x % 3)) % 3.7; if (bt < .12) blink = .12; }
    // write
    this.root.setAttribute('opacity', a.toFixed(3));
    this.root.setAttribute('visibility', a > .001 ? 'visible' : 'hidden');
    this.root.setAttribute('transform', `translate(${st.x.toFixed(1)} ${st.y.toFixed(1)}) scale(${(sc * this.dir).toFixed(4)} ${sc.toFixed(4)})`);
    this.body.setAttribute('transform', `translate(0 ${bodyDy.toFixed(1)}) rotate(${bodyRot.toFixed(1)} 0 -40) scale(${sx.toFixed(3)} ${sy.toFixed(3)})`);
    const ddir = this.dir; px *= ddir;
    this.pupils[0].setAttribute('cx', -20 + px); this.pupils[0].setAttribute('cy', -86 + py);
    this.pupils[1].setAttribute('cx', 20 + px); this.pupils[1].setAttribute('cy', -86 + py);
    this.eyes.setAttribute('transform', `translate(0 ${-86 * (1 - blink)}) scale(1 ${blink})`);
    const b = BROWS[ex] || BROWS.neutral;
    this.browL.setAttribute('d', `M -34 ${-108 + b[0][1]} L -8 ${-108 + b[0][0]}`);
    this.browR.setAttribute('d', `M 8 ${-108 + b[1][0]} L 34 ${-108 + b[1][1]}`);
    this.mouth.setAttribute('d', MOUTH[ex] || MOUTH.neutral);
    this.mouth.setAttribute('fill-opacity', ex === 'surprise' ? 1 : 0);
    const arm = (el, sh, h) => { const mx = (sh[0] + h[0]) / 2 + (h[0] > 0 ? 8 : -8), my = (sh[1] + h[1]) / 2 + 10;
      el.setAttribute('d', `M ${sh[0]} ${sh[1]} Q ${mx} ${my} ${h[0]} ${h[1]}`); };
    arm(this.armL, [-46, -60], H.L); arm(this.armR, [46, -60], H.R);
    this.handL.setAttribute('cx', H.L[0]); this.handL.setAttribute('cy', H.L[1]);
    this.handR.setAttribute('cx', H.R[0]); this.handR.setAttribute('cy', H.R[1]);
    this.loupe.setAttribute('visibility', loupe > .02 && a > .001 ? 'visible' : 'hidden');
    this.loupe.setAttribute('transform', `translate(${H.R[0] - 26} ${H.R[1] - 26}) scale(${(.5 + .5 * loupe).toFixed(3)})`);
    if (this.bulb) this.bulb.setAttribute('opacity', AMBIENT ? (.6 + .4 * Math.sin(t * 5)).toFixed(2) : 1);
    if (this.prop) { const hx = (H.L[0] + H.R[0]) / 2, hy = Math.min(H.L[1], H.R[1]) - 20;
      this.prop.setAttribute('transform', `translate(${(st.x + hx * sc * this.dir).toFixed(1)} ${(st.y + (hy + bodyDy) * sc).toFixed(1)})`); }
  }
}

/* ---------------- Episode runtime ---------------- */
function Runtime(ep, svg) {
  const R = { ep, svg, actors: [], chars: [], camMoves: [], frames: [], focusKeys: [], hots: [], events: [], marks: [], fx: [] };
  // ---- timing
  let t0 = ep.lead || 0.6;
  const cues = ep.cues.map(c => {
    const parts = c.say.split('|'); const w1 = words(parts[0]).length, wAll = words(c.say).length;
    const guess = parts.length > 1;
    const dur = Math.max(3.6, wAll / WPS + 1.0) + (guess ? GUESS_PAUSE : 0) + (c.extra || 0);
    const o = { ...c, start: t0, dur, end: t0 + dur, guess, w1, wAll, pauseAt: guess ? t0 + w1 / WPS : null };
    t0 += dur; return o;
  });
  // scenes: start = first cue start minus travel lead
  const scenes = ep.scenes.map(s => { const cs = cues.filter(c => c.sc === s.id); return { ...s, start: cs[0].start, end: cs[cs.length - 1].end, cues: cs }; });
  R.duration = t0 + (ep.tail || 1.5);
  R.cues = cues; R.scenes = scenes;
  const cueById = Object.fromEntries(cues.map(c => [c.id, c]));
  // ---- kit
  const K = R.K = {};
  K.S = S; K.E = E; K.P = P; K.lerp = lerp; K.clamp = clamp; K.Z = ep.zones;
  K.cue = id => { const c = cueById[id]; if (!c) throw new Error('cue inconnu ' + id); return c; };
  K.T = (id, word, n = 0, after = false) => {
    const c = K.cue(id); if (word == null) return c.start; if (word === '$end') return c.end;
    const ws = words(c.say); const target = norm(word); let k = -1, seen = 0;
    for (let i = 0; i < ws.length; i++) if (norm(ws[i]).startsWith(target)) { if (seen === n) { k = i; break; } seen++; }
    if (k < 0) throw new Error(`mot "${word}" absent du cue ${id}`);
    const idx = after ? k + 1 : k;
    let t = c.start + idx / WPS; if (c.guess && idx >= c.w1) t += GUESS_PAUSE; return t;
  };
  K.reveal = id => { const c = K.cue(id); return c.pauseAt + GUESS_PAUSE; };
  K.sc = id => scenes.find(s => s.id === id);
  K.layers = {};
  K.A = (el, o) => { const a = new Actor(el, o || {}); R.actors.push(a); if (o && o.pop != null) K.ev(o.pop, 'pop'); if (o && o.pop != null) K.mark(o.pop); return a; };
  K.g = (parent, attrs) => S('g', attrs || {}, parent);
  K.tx = (parent, x, y, str, o = {}) => {
    const e = S('text', { x, y, 'font-size': o.size || 48, fill: o.fill || '#F8FAFC', 'font-weight': o.weight || 600,
      'text-anchor': o.anchor || 'middle', 'font-family': o.mono ? "'JetBrains Mono','DejaVu Sans Mono',monospace" : "Poppins,'DejaVu Sans',sans-serif",
      'data-txt': o.mono ? 'code' : 'txt', 'dominant-baseline': 'middle', 'letter-spacing': o.ls || null }, parent);
    if (o.mono) e.setAttribute('style', 'white-space:pre');
    if (o.bleed) e.setAttribute('data-bleed', '1');
    e.textContent = str; return e;
  };
  K.char = (parent, o) => { const c = new Char(K, parent, o); R.chars.push(c); return c; };
  K.cam = (t, d, x, y, z) => { R.camMoves.push({ t, d, x, y, z }); if (d > 0.9) K.ev(t, 'whoosh'); K.mark(t); };
  // frame(t, d, targets, part, o): camera computed from the subject's bounding box at arrival time.
  // part = share of the frame taken by the subject's dominant dimension (ensemble ~.9, travail ~.55, gros plan ~.7).
  // Subject is centred at screen y=400 and kept inside y 60..740 (subtitle band free). o.focus adds a spotlight key.
  K.frame = (t, d, targets, part = .55, o = {}) => { R.frames.push({ t, d, targets: [].concat(targets), part, o }); if (d > 0.9) K.ev(t, 'whoosh'); K.mark(t);
    if (o.focus !== false) K.focus(t + Math.min(d, .4), [].concat(targets)[0], o.r || null); };
  K.focus = (t, target, r) => R.focusKeys.push({ t, target: target && target.root ? target.root : target, r: r || null });
  K.hot = (h) => R.hots.push(h);
  K.ev = (t, type) => R.events.push({ t: +t.toFixed(3), type });
  K.mark = t => R.marks.push(+t.toFixed(3));
  K.fx = fn => R.fx.push(fn); // custom per-frame function (t) => void
  return R;
}
function worldBBox(R, els) {
  const main = R.K.layers.main, inv = main.getCTM().inverse(); let x1 = 1e9, y1 = 1e9, x2 = -1e9, y2 = -1e9;
  for (let el of els) { if (el && el.root) el = el.root; if (!el) continue; let bb; try { bb = el.getBBox(); } catch (e) { continue; }
    if (!bb || (bb.width === 0 && bb.height === 0)) continue; const m = inv.multiply(el.getCTM());
    for (const [px, py] of [[bb.x, bb.y], [bb.x + bb.width, bb.y], [bb.x, bb.y + bb.height], [bb.x + bb.width, bb.y + bb.height]]) {
      const p = R.svg.createSVGPoint(); p.x = px; p.y = py; const q = p.matrixTransform(m);
      x1 = Math.min(x1, q.x); y1 = Math.min(y1, q.y); x2 = Math.max(x2, q.x); y2 = Math.max(y2, q.y); } }
  return x1 > x2 ? null : { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
}
function camFor(bb, part, o = {}) {
  let z = part / Math.max(bb.w / 1600, bb.h / 900); z = Math.min(z, 680 / bb.h, 1480 / bb.w, o.zmax || 3); if (o.zmin) z = Math.max(z, o.zmin);
  return { x: bb.x + bb.w / 2 + (o.dx || 0), y: bb.y + bb.h / 2 + 50 / z + (o.dy || 0), z };
}

function camAt(R, t) {
  const m0 = R.camMoves[0]; let x = m0.x, y = m0.y, z = m0.z;
  for (const m of R.camMoves) { const p = E.ioc(P(t, m.t, m.d)); if (p <= 0) break;
    x = lerp(x, m.x, p); y = lerp(y, m.y, p); z = Math.exp(lerp(Math.log(z), Math.log(m.z), p)); }
  return { x, y, z };
}
function worldCenter(R, el) {
  const bb = el.getBBox(); const m = el.getCTM(), base = R.K.layers.main.getCTM();
  if (!m || !base) return [0, 0];
  const pt = R.svg.createSVGPoint(); pt.x = bb.x + bb.width / 2; pt.y = bb.y + bb.height / 2;
  const p = pt.matrixTransform(base.inverse().multiply(m)); return [p.x, p.y];
}
function focusAt(R, t) {
  let f = null; for (const k of R.focusKeys) if (t >= k.t) f = k; return f;
}
