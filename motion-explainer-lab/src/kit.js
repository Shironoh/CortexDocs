/* Generic scene kit (any topic). Everything stays a pure function of time.
   Usage in an episode: const k = sceneKit(K); then k.room(...), k.hero(...), k.card(...), k.doc(...), k.counter(...)...
   Conventions: zone-relative coordinates (K.Z[name]), floor at y = FLOOR (characters stand on it, above the subtitle band
   once framed), every element gets an entry (pop/fin) and an exit (out) unless it carries the case thread. */
'use strict';
function sceneKit(K) {
  const { S, E, Z } = K; const T = K.T, P = K.P;
  const C = { amber: '#FFB703', orange: '#FB8500', cyan: '#22D3EE', rose: '#EF476F', green: '#06D6A0', violet: '#A78BFA', teal: '#2DD4BF',
    text: '#F8FAFC', ink: '#0B1A3A', p1: '#14295C', p2: '#1E3A8A', paper: '#E8EEF9', muted: '#94A3B8' };
  const FLOOR = 250, main = K.layers.main, far = K.layers.far, front = K.layers.front;
  const sc = id => K.sc(id).start;
  const G = (parent, x, y, o = {}) => { const g = K.g(parent); g._a = K.A(g, { x, y, ...o }); return g; };
  const I = (name, parent, x, y, s, c, o = {}) => { const g = ico(name, parent, 0, 0, 1, c); g._a = K.A(g, { x, y, s, ...o }); return g; };
  const F = (t, d, tg, part, o) => K.frame(t, d, tg, part, o);
  const mono = (len, maxW, base = 44, min = 36) => Math.max(min, Math.min(base, maxW / (len * .6)));
  const typeIn = (el, str, t0, dur = 1.2) => { K.mark(t0); K.fx(t => { const n = FRAMING ? str.length : Math.round(str.length * K.clamp((t - t0) / dur)); el.textContent = str.slice(0, Math.max(1, n)); }); };

  /* ---- worlds: one zone = one place. decor: 'room' (walls, shelves, floor), 'outdoor' (sky, hills, sun), 'lab' (benches, screens), 'void' (platform) */
  function room(name, tint, o = {}) {
    const g = K.g(main, { transform: `translate(${Z[name][0]} ${Z[name][1]})` }); const d = o.decor || 'room', seed = o.seed || 0;
    const r = S('rect', { x: -1000, y: -560, width: 2000, height: 1120, rx: 80, fill: tint }, g);
    const acc = [C.cyan, C.amber, C.rose, C.violet, C.green];
    if (d === 'outdoor') {
      S('circle', { cx: 620 - seed * 90, cy: -330, r: 90, fill: C.amber, opacity: .85 }, g);
      for (let k = 0; k < 3; k++) S('ellipse', { cx: -700 + k * 700 + seed * 40, cy: FLOOR + 40, rx: 560, ry: 200 - k * 30, fill: ['#1E3A8A', '#24408F', '#1B3270'][k] }, g);
      for (let k = 0; k < 4; k++) S('ellipse', { cx: -760 + k * 480, cy: -420 + (k % 2) * 60, rx: 120, ry: 34, fill: '#F8FAFC', opacity: .12 }, g);
    } else {
      for (const sx of [-1, 1]) { const x = sx * 860;
        S('rect', { x: x - 80, y: -440, width: 160, height: 220, rx: 14, fill: C.p2, opacity: .55 }, g);
        for (let k = 0; k < 4; k++) S('rect', { x: x - 64 + (k % 2) * 68, y: -420 + Math.floor(k / 2) * 92, width: 60, height: 76, rx: 8, fill: acc[(k + seed) % 5], opacity: .22 }, g); }
      S('path', { d: 'M -1000 -500 L 1000 -500', stroke: '#2c4a8f', 'stroke-width': 16, opacity: .7 }, g);
      if (d === 'lab') for (const x of [-600, 600]) { S('rect', { x: x - 150, y: FLOOR - 120, width: 300, height: 26, rx: 10, fill: C.p2 }, g);
        S('rect', { x: x - 130, y: FLOOR - 94, width: 20, height: 94, fill: C.p1 }, g); S('rect', { x: x + 110, y: FLOOR - 94, width: 20, height: 94, fill: C.p1 }, g); }
    }
    if (d !== 'void') { S('rect', { x: -1000, y: FLOOR, width: 2000, height: 560 - FLOOR, rx: 40, fill: d === 'outdoor' ? '#173064' : '#1B3270' }, g);
      S('rect', { x: -1000, y: FLOOR - 6, width: 2000, height: 12, fill: '#2c4a8f' }, g);
      for (let k = 0; k < 9; k++) S('rect', { x: -1000 + k * 230, y: 300 + (k % 2) * 60, width: 150, height: 10, rx: 5, fill: '#2c4a8f', opacity: .7 }, g); }
    else S('rect', { x: -700, y: FLOOR, width: 1400, height: 40, rx: 20, fill: C.p2 }, g);
    g._room = r; return g;
  }
  /* far layer (stars / dust), inhabited paths between consecutive zones, dark foreground silhouettes crossing during travels */
  function world(zoneNames, o = {}) {
    for (let i = 0; i < (o.stars || 140); i++) { const x = -800 + (i * 977) % (zoneNames.length * 2400), y = -700 + (i * 613) % 1600;
      const st = S('circle', { cx: x, cy: y, r: 2 + (i % 3), fill: '#cfe3ff', opacity: .3 }, far);
      if (i % 7 === 0) K.fx(t => st.setAttribute('opacity', AMBIENT ? (.2 + .3 * Math.abs(Math.sin(t * .8 + i))).toFixed(2) : .35)); }
    const zs = zoneNames.map(n => Z[n]);
    for (let i = 0; i + 1 < zs.length; i++) { const mx = (zs[i][0] + zs[i + 1][0]) / 2, my = (zs[i][1] + zs[i + 1][1]) / 2;
      const g = ico(o.silhouette || 'plant', front, 0, 0, 1, '#040916'); g.setAttribute('transform', `translate(${mx * 1.3} ${(my + 380) * 1.3}) scale(3)`);
      S('path', { d: `M ${zs[i][0] + 1000} 320 L ${zs[i + 1][0] - 1000} 320`, stroke: C.p1, 'stroke-width': 70 }, main);
      S('path', { d: `M ${zs[i][0] + 1000} 320 L ${zs[i + 1][0] - 1000} 320`, stroke: C.amber, 'stroke-width': 6, 'stroke-dasharray': '18 26', opacity: .4 }, main); }
  }
  /* ---- characters: protagonist (learns / acts) and antagonist (the problem, the opposing force). name = cue.who for lip-sync */
  const hero = (g, x, o = {}) => K.char(g, { name: o.name || 'hero', color: o.color || C.cyan, x, y: o.y == null ? FLOOR : o.y, s: o.s || 1.4, dir: o.dir || 1, headset: o.headset, shape: o.shape, expr: o.expr });
  const foe = (g, x, o = {}) => K.char(g, { name: o.name || 'foe', color: o.color || C.rose, x, y: o.y == null ? FLOOR : o.y, s: o.s || 1.4, dir: o.dir || -1, mask: o.mask !== false, expr: o.expr || 'smug', shape: o.shape, ghost: o.ghost });
  /* speech bubble tied to a character (dialogue cues): one short line, visible [t0, t1] */
  function bubble(g, ch, text, t0, t1, o = {}) { const w = Math.max(220, text.length * (o.size || 44) * .55 + 70), h = (o.size || 44) + 50;
    const b = G(g, (o.x != null ? o.x : ch.x) + (o.dx || 0), (o.y != null ? o.y : ch.y - 300 * ch.s / 1.4) + (o.dy || 0), { pop: t0, out: t1 });
    S('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: C.paper }, b); S('path', { d: `M -20 ${h / 2 - 2} L 0 ${h / 2 + 30} L 22 ${h / 2 - 2} Z`, fill: C.paper }, b);
    K.tx(b, 0, 2, text, { size: o.size || 44, fill: C.ink, weight: 700 }); return b; }
  /* ---- real artifact card: header band (what it is), main value typed in, a second line lit when the narration explains it.
     spec: { head, value, note, col, w, mono (value), noteMono, icon } — 3 texts max, the real name/value as it appears in real life */
  function card(g, x, y, spec, tPop, tValue, tNote, tOut) {
    const W = spec.w || 1040, H = spec.note ? 400 : 290; const cd = G(g, x, y, { pop: tPop, out: tOut });
    S('rect', { x: -W / 2 + 10, y: -H / 2 + 12, width: W, height: H, rx: 30, fill: '#000', opacity: .25 }, cd);
    S('rect', { x: -W / 2, y: -H / 2, width: W, height: H, rx: 30, fill: C.paper }, cd);
    S('rect', { x: -W / 2, y: -H / 2, width: W, height: 96, rx: 30, fill: spec.col || C.cyan }, cd); S('rect', { x: -W / 2, y: -H / 2 + 60, width: W, height: 36, fill: spec.col || C.cyan }, cd);
    K.tx(cd, -W / 2 + 40, -H / 2 + 50, spec.head, { size: 46, fill: C.ink, weight: 800, anchor: 'start' });
    if (spec.icon) { const ic = ico(spec.icon, cd, 0, 0, 1, C.ink); ic.setAttribute('transform', `translate(${W / 2 - 80} ${-H / 2 + 48}) scale(.55)`); }
    const vy = spec.note ? -20 : 40;
    const v = K.tx(cd, -W / 2 + 40, vy, spec.value, { size: spec.mono === false ? 52 : mono(spec.value.length, W - 80, 52), mono: spec.mono !== false, fill: C.ink, weight: 700, anchor: 'start' });
    if (tValue != null) typeIn(v, spec.value, tValue, Math.min(1.6, .04 * spec.value.length + .4)); cd._v = v;
    if (spec.note) { const hl = S('rect', { x: -W / 2 + 24, y: 50, width: W - 48, height: 92, rx: 18, fill: spec.col || C.cyan, 'fill-opacity': .25 }, cd); K.A(hl, { fin: [tNote, .3] });
      const ng = G(cd, 0, 0, { fin: [tNote, .3] }); K.tx(ng, -W / 2 + 40, 96, spec.note, { size: spec.noteMono ? mono(spec.note.length, W - 80, 46) : 46, mono: !!spec.noteMono, fill: C.ink, weight: 700, anchor: 'start' }); cd._n = ng; }
    return cd;
  }
  /* ---- long artifact (output, form, label, code): unrolls line by line, 3 lines readable at a time, the rest greyed.
     lines: [str]; steps: [[t, i]] = at t, line i becomes the lit line (the window follows it). Returns g with ._line(i) */
  function doc(g, x, y, lines, steps, o = {}) {
    const W = o.w || 1200, lh = o.lh || 70, vis = o.visible || 3, size = o.size || mono(Math.max(...lines.map(l => l.length)), W - 80, 44);
    const d = G(g, x, y, { pop: o.pop, out: o.out }); const Hh = lh * (vis + 2) + 40;
    S('rect', { x: -W / 2 + 10, y: -Hh / 2 + 12, width: W, height: Hh, rx: 28, fill: '#000', opacity: .25 }, d);
    S('rect', { x: -W / 2, y: -Hh / 2, width: W, height: Hh, rx: 28, fill: o.bg || '#071028', stroke: o.col || C.cyan, 'stroke-width': 6 }, d);
    if (o.title) K.tx(d, -W / 2 + 30, -Hh / 2 - 40, o.title, { size: 40, fill: o.col || C.cyan, weight: 700, anchor: 'start' });
    const clip = 'clip' + Math.random().toString(36).slice(2, 8); const cp = S('clipPath', { id: clip }, d); S('rect', { x: -W / 2, y: -Hh / 2 + 10, width: W, height: Hh - 20 }, cp);
    const inner = K.g(d, { 'clip-path': `url(#${clip})` }); const hl = S('rect', { x: -W / 2 + 14, y: -lh / 2, width: W - 28, height: lh, rx: 14, fill: o.col || C.cyan, 'fill-opacity': .22 }, inner);
    const els = lines.map((l, i) => K.tx(inner, -W / 2 + 34, i * lh, l, { size, mono: o.mono !== false, fill: C.text, weight: 600, anchor: 'start' }));
    const st = [...steps].sort((a, b) => a[0] - b[0]); for (const s of st) K.mark(s[0]);
    K.fx(t => { let cur = 0, prev = 0, p = 1; for (const s of st) if (t >= s[0]) { prev = cur; cur = s[1]; p = E.ioc(P(t, s[0], .45)); }
      const pos = FRAMING ? (st.length ? st[0][1] : 0) : prev + (cur - prev) * p;
      inner.setAttribute('transform', `translate(0 ${(-pos * lh).toFixed(1)})`); hl.setAttribute('y', (pos * lh - lh / 2).toFixed(1));
      els.forEach((e, i) => e.setAttribute('fill-opacity', Math.abs(i - pos) <= (vis - 1) / 2 + .01 ? 1 : .28)); });
    d._lines = els; return d;
  }
  /* ---- number that counts up (a real value being computed). fmt(v) -> string. Emits ticks for the sound. */
  function counter(g, x, y, o) { const c = G(g, x, y, { pop: o.pop, out: o.out }); const el = K.tx(c, 0, 0, o.fmt(o.from), { size: o.size || 120, fill: o.fill || C.text, weight: 800, mono: o.mono });
    K.mark(o.t0); for (let k = 0; k < 8; k++) K.ev(o.t0 + k * o.dur / 8, 'tick');
    K.fx(t => { const p = FRAMING ? 1 : E.oc(P(t, o.t0, o.dur)); el.textContent = o.fmt(o.from + (o.to - o.from) * p); }); c._t = el; return c; }
  /* ---- bars growing (comparison of real values). vals: [{v, label, col}], max, w, h */
  function bars(g, x, y, o) { const b = G(g, x, y, { pop: o.pop, out: o.out }); const n = o.vals.length, bw = (o.w || 900) / n * .62, H = o.h || 420;
    S('rect', { x: -(o.w || 900) / 2 - 20, y: 0, width: (o.w || 900) + 40, height: 8, rx: 4, fill: C.muted }, b);
    o.vals.forEach((it, i) => { const cx = -(o.w || 900) / 2 + (i + .5) * (o.w || 900) / n, t0 = o.t0 + i * (o.stagger || .35);
      const r = S('rect', { x: cx - bw / 2, width: bw, rx: 12, fill: it.col || C.cyan }, b); K.mark(t0);
      K.fx(t => { const h = H * it.v / o.max * (FRAMING ? 1 : E.oc(P(t, t0, .8))); r.setAttribute('y', -h); r.setAttribute('height', Math.max(0, h)); });
      if (it.label) K.tx(b, cx, 50, it.label, { size: o.lsize || 40, fill: C.text, weight: 700 });
      if (it.top) { const tg = G(b, cx, -H * it.v / o.max - 40, { fin: [t0 + .6, .3] }); K.tx(tg, 0, 0, it.top, { size: o.lsize || 40, fill: it.col || C.cyan, weight: 800 }); } });
    return b; }
  /* ---- curve drawn over time (pts in local units, y up = negative) */
  function curve(g, pts, o) { const d = 'M ' + pts.map(p => p.join(' ')).join(' L '); const el = S('path', { d, fill: 'none', stroke: o.col || C.amber, 'stroke-width': o.sw || 10, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    el._a = K.A(el, { dash: [o.t0, o.dur || 1.5], out: o.out }); return el; }
  /* ---- arrow drawn from a to b */
  function arrow(g, x1, y1, x2, y2, o = {}) { const a = K.g(g); const ang = Math.atan2(y2 - y1, x2 - x1);
    const ln = S('path', { d: `M ${x1} ${y1} L ${x2} ${y2}`, stroke: o.col || C.text, 'stroke-width': o.sw || 10, 'stroke-linecap': 'round', fill: 'none', 'stroke-dasharray': o.dashed ? '18 16' : null }, a);
    const hd = S('path', { d: 'M 0 0 L -34 -18 L -34 18 Z', fill: o.col || C.text, transform: `translate(${x2} ${y2}) rotate(${ang * 180 / Math.PI})` }, a);
    if (!o.dashed) K.A(ln, { dash: [o.t, o.d || .6], out: o.out }); else K.A(ln, { fin: [o.t, .3], out: o.out });
    K.A(hd, { fin: [o.t + (o.d || .6) * .8, .2], out: o.out }); return a; }
  /* ---- pill label (a keyword on screen; the sentence stays in the subtitles) */
  function label(g, x, y, text, o = {}) { const l = G(g, x, y, { pop: o.pop, out: o.out, fin: o.fin }); const w = text.length * (o.size || 44) * .58 + 60, h = (o.size || 44) + 36;
    S('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: o.bg || (o.col || C.cyan), 'fill-opacity': o.bg ? 1 : .2, stroke: o.col || C.cyan, 'stroke-width': 4 }, l);
    K.tx(l, 0, 2, text, { size: o.size || 44, fill: o.fill || C.text, weight: 700, mono: o.mono }); return l; }
  /* ---- timeline (frieze): ticks [[pos 0..1, label]], a cursor that travels; returns {g, at(p)} */
  function timeline(g, x, y, o) { const tl = G(g, x, y, { pop: o.pop, out: o.out }); const W = o.w || 1300;
    S('rect', { x: -W / 2, y: -6, width: W, height: 12, rx: 6, fill: C.muted }, tl);
    (o.ticks || []).forEach(([p, lab], i) => { const tx = -W / 2 + p * W; const tk = G(tl, tx, 0, { pop: (o.t0 || 0) + i * (o.stagger || .3) });
      S('circle', { r: 16, fill: o.col || C.amber }, tk); if (lab) K.tx(tk, 0, i % 2 ? 64 : -60, lab, { size: o.lsize || 40, fill: C.text, weight: 700 }); });
    return tl; }
  /* ---- balance: a trade-off that tilts at t (tilt in degrees, + = right side heavier) */
  function balance(g, x, y, o) { const b = G(g, x, y, { pop: o.pop, out: o.out });
    S('path', { d: 'M -40 120 L 40 120 L 0 0 Z', fill: C.p2 }, b);
    const beam = K.g(b); S('rect', { x: -360, y: -10, width: 720, height: 20, rx: 10, fill: C.muted }, beam);
    for (const sx of [-1, 1]) { S('path', { d: `M ${sx * 340} 0 L ${sx * 340 - 70} 120 L ${sx * 340 + 70} 120 Z`, fill: 'none', stroke: C.muted, 'stroke-width': 5 }, beam);
      S('rect', { x: sx * 340 - 100, y: 112, width: 200, height: 18, rx: 8, fill: C.muted }, beam); }
    K.mark(o.t); K.fx(t => beam.setAttribute('transform', `rotate(${((o.tilt || 12) * (FRAMING ? 1 : E.ob(P(t, o.t, .9)))).toFixed(2)})`));
    b._beam = beam; return b; }
  /* ---- uncertainty: what the narration does not know is drawn dashed / faded, never as a fact */
  function unknown(el) { el.setAttribute('stroke-dasharray', '16 12'); el.setAttribute('fill-opacity', .15); return el; }
  /* ---- question mark suspended above an object during a "devinez" silence */
  function suspense(g, x, y, t0, t1, o = {}) { const q = G(g, x, y, { pop: t0, out: t1, fn: (s, t) => { s.y += AMBIENT ? 8 * Math.sin(t * 3) : 0; } });
    K.tx(q, 0, 0, '?', { size: o.size || 140, fill: o.col || C.amber, weight: 800, deco: true }); return q; }
  return { C, FLOOR, sc, G, I, F, mono, typeIn, room, world, hero, foe, bubble, card, doc, counter, bars, curve, arrow, label, timeline, balance, unknown, suspense };
}
