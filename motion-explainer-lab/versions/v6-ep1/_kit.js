/* Series kit: shared world helpers + "event room" grammar (action stage -> real log card -> rule).
   Used by the v6 series episodes. Everything still a pure function of time. */
'use strict';
function seriesKit(K) {
  const { S, E, Z } = K; const T = K.T, R = K.reveal;
  const C = { amber: '#FFB703', orange: '#FB8500', cyan: '#22D3EE', rose: '#EF476F', green: '#06D6A0', violet: '#A78BFA', teal: '#2DD4BF', text: '#F8FAFC', ink: '#0B1A3A', p1: '#14295C', p2: '#1E3A8A', paper: '#E8EEF9' };
  const FLOOR = 250, main = K.layers.main, far = K.layers.far, front = K.layers.front;
  const sc = id => K.sc(id).start;
  const G = (parent, x, y, o = {}) => { const g = K.g(parent); g._a = K.A(g, { x, y, ...o }); return g; };
  const I = (name, parent, x, y, s, c, o = {}) => { const g = ico(name, parent, 0, 0, 1, c); g._a = K.A(g, { x, y, s, ...o }); return g; };
  const F = (t, d, tg, part, o) => K.frame(t, d, tg, part, o);
  const zg = (name, tint, seed = 0) => { const g = K.g(main, { transform: `translate(${Z[name][0]} ${Z[name][1]})` });
    const room = S('rect', { x: -1000, y: -560, width: 2000, height: 1120, rx: 80, fill: tint }, g);
    S('rect', { x: -1000, y: FLOOR, width: 2000, height: 560 - FLOOR, rx: 40, fill: '#1B3270' }, g);
    S('rect', { x: -1000, y: FLOOR - 6, width: 2000, height: 12, fill: '#2c4a8f' }, g);
    for (const sx of [-1, 1]) { const x = sx * 860; S('rect', { x: x - 80, y: -440, width: 160, height: 220, rx: 14, fill: '#1E3A8A', opacity: .55 }, g);
      for (let k = 0; k < 4; k++) S('rect', { x: x - 64 + (k % 2) * 68, y: -420 + Math.floor(k / 2) * 92, width: 60, height: 76, rx: 8, fill: ['#22D3EE', '#FFB703', '#EF476F', '#A78BFA'][(k + seed) % 4], opacity: .25 }, g); }
    for (let k = 0; k < 9; k++) S('rect', { x: -1000 + k * 230, y: 300 + (k % 2) * 60, width: 150, height: 10, rx: 5, fill: '#2c4a8f', opacity: .7 }, g);
    S('path', { d: 'M -1000 -500 L 1000 -500', stroke: '#2c4a8f', 'stroke-width': 16, opacity: .7 }, g);
    g._room = room; return g; };
  function backdrop(zoneNames) {
    for (let i = 0; i < 140; i++) { const x = -800 + (i * 977) % 9000, y = -700 + (i * 613) % 1600;
      const st = S('circle', { cx: x, cy: y, r: 2 + (i % 3), fill: '#cfe3ff', opacity: .3 }, far);
      if (i % 7 === 0) K.fx(t => st.setAttribute('opacity', AMBIENT ? (.2 + .3 * Math.abs(Math.sin(t * .8 + i))).toFixed(2) : .35)); }
    const zs = zoneNames.map(n => Z[n]);
    for (let i = 0; i + 1 < zs.length; i++) { const mx = (zs[i][0] + zs[i + 1][0]) / 2, my = (zs[i][1] + zs[i + 1][1]) / 2;
      const g = ico('plant', front, 0, 0, 1, '#040916'); g.setAttribute('transform', `translate(${mx * 1.3} ${(my + 380) * 1.3}) scale(3)`);
      S('path', { d: `M ${zs[i][0] + 1000} 320 L ${zs[i + 1][0] - 1000} 320`, stroke: '#14295C', 'stroke-width': 70 }, main);
      S('path', { d: `M ${zs[i][0] + 1000} 320 L ${zs[i + 1][0] - 1000} 320`, stroke: C.amber, 'stroke-width': 6, 'stroke-dasharray': '18 26', opacity: .4 }, main); }
  }
  const analyst = (g, x, o = {}) => K.char(g, { name: 'analyste', color: C.cyan, x, y: FLOOR, s: o.s || 1.4, dir: o.dir || 1, headset: true });
  const villain = (g, x, o = {}) => K.char(g, { name: 'attaquant', color: C.rose, x, y: FLOOR, s: o.s || 1.4, dir: o.dir || -1, mask: true, expr: 'smug' });
  // typewriter on a <text> (a real value "s'écrit")
  const typeIn = (el, str, t0, dur = 1.2) => K.fx(t => { const n = FRAMING ? str.length : Math.round(str.length * K.clamp((t - t0) / dur)); el.textContent = str.slice(0, Math.max(1, n)); });
  const mono = (len, maxW, base = 44, min = 36) => Math.max(min, Math.min(base, maxW / (len * .6)));
  /* Real log card: tactic band (+ colored log book: amber = activity, violet = data_access), method (typed), condition (lit). 3 texts max. */
  function logCard(g, x, y, spec, tPop, tMethod, tCond, tOut) {
    const W = spec.w || 1040, H = 400; const card = G(g, x, y, { pop: tPop, out: tOut });
    S('rect', { x: -W / 2 + 10, y: -H / 2 + 12, width: W, height: H, rx: 30, fill: '#000', opacity: .25 }, card);
    S('rect', { x: -W / 2, y: -H / 2, width: W, height: H, rx: 30, fill: C.paper }, card);
    S('rect', { x: -W / 2, y: -H / 2, width: W, height: 96, rx: 30, fill: spec.col }, card); S('rect', { x: -W / 2, y: -H / 2 + 60, width: W, height: 36, fill: spec.col }, card);
    K.tx(card, -W / 2 + 40, -H / 2 + 50, spec.tactic, { size: 46, fill: C.ink, weight: 800, anchor: 'start' });
    const bk = ico('book', card, 0, 0, 1, spec.log === 'data_access' ? C.violet : C.amber); bk.setAttribute('transform', `translate(${W / 2 - 80} ${-H / 2 + 48}) scale(.62)`);
    const mEl = K.tx(card, -W / 2 + 40, -20, spec.method, { size: mono(spec.method.length, W - 80, 52), mono: true, fill: C.ink, weight: 700, anchor: 'start' });
    typeIn(mEl, spec.method, tMethod, Math.min(1.6, .04 * spec.method.length + .4)); K.mark(tMethod); card._m = mEl;
    const hl = S('rect', { x: -W / 2 + 24, y: 50, width: W - 48, height: 92, rx: 18, fill: spec.col, 'fill-opacity': .25 }, card); K.A(hl, { fin: [tCond, .3] });
    const cg = G(card, 0, 0, { fin: [tCond, .3] });
    K.tx(cg, -W / 2 + 40, 96, spec.cond, { size: spec.condMono === false ? 46 : mono(spec.cond.length, W - 80, 46), mono: spec.condMono !== false, fill: C.ink, weight: 700, anchor: 'start' });
    card._c = cg; return card;
  }
  /* Event room: one scene = action (cue A) + detection (cue B). spec.stage(g, kit, times) builds the action and returns framing targets. */
  function eventRoom(spec) {
    const g = zg(spec.zone, spec.tint, spec.seed || 0); const s0 = sc(spec.scene);
    const tA = T(spec.cueA, spec.wAct), tB = K.cue(spec.cueB).start, tM = T(spec.cueB, spec.wMethod), tC = T(spec.cueB, spec.wCond);
    const tR = spec.wRule ? T(spec.cueB, spec.wRule) : K.cue(spec.cueB).end - 1.2;
    const vil = spec.noVillain ? null : villain(g, -980, { dir: 1 });
    if (vil) vil.pop(s0 - .4).walk(s0 - .2, 1.2, -720).expr(tA, 'smug').pose(tA, 1.2, 'point', { x: -380, y: -60 }).walk(tB - .4, 1.0, -1250).out(tB + .4);
    const stage = spec.stage(g, kit, { s0, tA, tB });
    // the call flies from the stage to the card (the entry is written)
    const slip = I('slip', g, -380, -120, 1.4, spec.log === 'data_access' ? C.violet : C.amber, { pop: K.cue(spec.cueA).end - 1.3, moves: [[K.cue(spec.cueA).end - 1.1, 1.0, { x: 450, y: -150, s: .6 }, E.ioc]], out: K.cue(spec.cueA).end - .1 });
    const card = logCard(g, 450, -150, spec, tB - .2, tM, tC, spec.tOut);
    const an = analyst(g, -1050, { s: 1.35 });
    an.pop(tB - .6).walk(tB - .4, 1.1, -600).pose(tM, 1.0, 'point', { x: 200, y: -170 }).pose(tC, 1.0, 'point', { x: 200, y: -60 }).expr(tC, 'happy');
    const bell = G(g, 830, 120, { pop: tR, fn: (s, t) => { s.r = 14 * Math.sin((t - tR) * 14) * (1 - P(t, tR + .3, 1.2)); } }); ico('bell', bell, 0, 0, 1, C.amber).setAttribute('transform', 'scale(1.2)');
    K.ev(tR, 'impact');
    // filler beats (skill: >= ceil(dur/2) visible changes per cue): reaction, push-in, pulse, nods
    const eA = K.cue(spec.cueA).end, eB = K.cue(spec.cueB).end;
    if (vil) vil.pose(tA + 1.6, 1.0, 'cheer');
    if (vil && tA - K.cue(spec.cueA).start > 2.6) vil.pose(K.cue(spec.cueA).start + 1.4, 1.0, 'point', { x: -380, y: -60 });
    an.pose((tC + tR) / 2, .8, 'nod').pose(tR + .4, 1.0, 'cheer');
    const ul = S('rect', { x: 450 - 500, y: -150 + 12, width: 1000, height: 10, rx: 5, fill: spec.col }, g); K.A(ul, { fin: [(tM + tC) / 2, .2], out: tC + .2 });
    const pulse = S('rect', { x: 450 - 540, y: -150 - 210, width: 1080, height: 420, rx: 36, fill: 'none', stroke: spec.col, 'stroke-width': 10 }, g);
    K.A(pulse, { fin: [(tC + tR) / 2, .2], out: (tC + tR) / 2 + .8 });
    F(s0 - 1.3, 1.5, [g._room], .96, { focus: false }); K.focus(s0, stage[0]);
    F((tA + eA) / 2, 1.2, [...stage, card], .9, { focus: false });
    if (tA - K.cue(spec.cueA).start > 3) F(K.cue(spec.cueA).start + 1.4, .9, stage, .8, { focus: false });
    F(tA - .5, .8, stage, .62, { focus: false }); K.focus(tA, stage[0]);
    F(tB - .4, .9, [card], .82, { focus: false }); K.focus(tB, card);
    F(tM - .4, .7, [card._m], .62, { focus: false, zmax: 2.4 }); K.focus(tM, card._m);
    F(tC - .3, .7, [card._c], .66, { focus: false, zmax: 2.4 }); K.focus(tC, card._c);
    F(tC + .9, .9, [card, bell], .86, { focus: false });
    if (spec.hot) K.hot({ x: Z[spec.zone][0] + 450, y: Z[spec.zone][1] - 330, at: s0, until: K.cue(spec.cueB).end + 1, title: spec.hot[0], html: spec.hot[1] });
    return { g, card, an, vil, stage, bell };
  }
  /* Hook room: the analyst's desk, a monitor showing a short line, used to open each episode. */
  function hookRoom(zone, tint, o) {
    const g = zg(zone, tint, 1);
    S('rect', { x: -560, y: 60, width: 900, height: 44, rx: 14, fill: C.p2 }, g); S('rect', { x: -520, y: 104, width: 28, height: 146, fill: C.p1 }, g); S('rect', { x: 280, y: 104, width: 28, height: 146, fill: C.p1 }, g);
    const mon = G(g, -110, -170); S('rect', { x: -330, y: -190, width: 660, height: 380, rx: 24, fill: C.p1, stroke: '#26407e', 'stroke-width': 6 }, mon);
    S('rect', { x: -305, y: -168, width: 610, height: 334, rx: 14, fill: '#071028' }, mon); S('rect', { x: -40, y: 190, width: 80, height: 40, fill: C.p1 }, mon);
    const an = analyst(g, 520, { s: 1.5, dir: -1 });
    return { g, mon, an };
  }
  const kit = { C, FLOOR, sc, G, I, F, zg, backdrop, analyst, villain, typeIn, mono, logCard, eventRoom, hookRoom };
  return kit;
}
