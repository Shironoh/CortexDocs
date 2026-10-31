/* Flat vector icon kit: each icon drawn around (0,0), ~100 units, returns <g>. Shared by episodes. */
'use strict';
const ICO = {
  crown(g, c = '#FFB703') { S('path', { d: 'M -46 22 L -52 -26 L -22 2 L 0 -36 L 22 2 L 52 -26 L 46 22 Z', fill: c }, g); S('rect', { x: -48, y: 22, width: 96, height: 16, rx: 5, fill: c }, g);
    S('path', { d: 'M -46 22 L -52 -26 L -22 2 Z', fill: '#000', opacity: .12 }, g); for (const x of [-52, 0, 52]) S('circle', { cx: x, cy: x ? -28 : -38, r: 7, fill: '#fff', opacity: .9 }, g); },
  key(g, c = '#FB8500') { S('circle', { cx: -34, cy: 0, r: 26, fill: c }, g); S('circle', { cx: -34, cy: 0, r: 10, fill: '#0B1A3A' }, g);
    S('rect', { x: -12, y: -8, width: 66, height: 16, rx: 6, fill: c }, g); S('rect', { x: 30, y: 4, width: 10, height: 18, rx: 3, fill: c }, g); S('rect', { x: 44, y: 4, width: 10, height: 13, rx: 3, fill: c }, g); },
  laptop(g, c = '#22D3EE') { S('rect', { x: -44, y: -40, width: 88, height: 58, rx: 8, fill: '#0B1A3A', stroke: c, 'stroke-width': 7 }, g); S('path', { d: 'M -58 22 L 58 22 L 50 36 L -50 36 Z', fill: c }, g);
    S('rect', { x: -30, y: -26, width: 40, height: 7, rx: 3, fill: c, opacity: .7 }, g); S('rect', { x: -30, y: -12, width: 56, height: 7, rx: 3, fill: c, opacity: .4 }, g); },
  terminal(g, c = '#06D6A0') { S('rect', { x: -48, y: -38, width: 96, height: 76, rx: 10, fill: '#0B1A3A', stroke: c, 'stroke-width': 7 }, g);
    S('path', { d: 'M -30 -14 L -14 0 L -30 14', fill: 'none', stroke: c, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g); S('rect', { x: -6, y: 12, width: 28, height: 7, rx: 3, fill: c }, g); },
  gear(g, c = '#A78BFA') { for (let i = 0; i < 8; i++) S('rect', { x: -9, y: -48, width: 18, height: 22, rx: 4, fill: c, transform: `rotate(${i * 45})` }, g);
    S('circle', { r: 32, fill: c }, g); S('circle', { r: 13, fill: '#0B1A3A' }, g); },
  person(g, c = '#F8FAFC') { S('circle', { cx: 0, cy: -22, r: 20, fill: c }, g); S('path', { d: 'M -34 34 Q -34 2 0 2 Q 34 2 34 34 Z', fill: c }, g); },
  clock(g, c = '#F8FAFC') { S('circle', { r: 38, fill: 'none', stroke: c, 'stroke-width': 8 }, g); S('path', { d: 'M 0 -22 L 0 0 L 16 10', fill: 'none', stroke: c, 'stroke-width': 7, 'stroke-linecap': 'round' }, g); },
  pin(g, c = '#F8FAFC') { S('path', { d: 'M 0 44 C -10 22 -34 4 -34 -14 A 34 34 0 1 1 34 -14 C 34 4 10 22 0 44 Z', fill: c }, g); S('circle', { cx: 0, cy: -14, r: 12, fill: '#0B1A3A' }, g); },
  steps(g, c = '#EF476F') { for (const [x, y, r] of [[-26, 18, -12], [8, -2, 10], [-10, -30, -12], [26, -42, 10]]) { S('ellipse', { cx: x, cy: y, rx: 10, ry: 15, fill: c, transform: `rotate(${r} ${x} ${y})` }, g); } },
  wrench(g, c = '#F8FAFC') { S('path', { d: 'M -36 30 L 8 -14 A 22 22 0 1 1 22 0 L -22 44 Z', fill: c }, g); S('circle', { cx: 24, cy: -20, r: 8, fill: '#0B1A3A' }, g); },
  plusminus(g, c = '#06D6A0') { S('rect', { x: -40, y: -10, width: 80, height: 20, rx: 6, fill: c }, g); S('rect', { x: -10, y: -40, width: 20, height: 80, rx: 6, fill: c }, g); },
  doc(g, c = '#F8FAFC') { S('path', { d: 'M -30 -40 L 14 -40 L 30 -24 L 30 40 L -30 40 Z', fill: c }, g); for (const y of [-16, 0, 16]) S('rect', { x: -18, y, width: 36, height: 6, rx: 3, fill: '#0B1A3A', opacity: .35 }, g); },
  slip(g, c = '#FFB703') { S('rect', { x: -26, y: -18, width: 52, height: 36, rx: 5, fill: c }, g); S('rect', { x: -16, y: -8, width: 32, height: 5, rx: 2, fill: '#0B1A3A', opacity: .4 }, g); S('rect', { x: -16, y: 3, width: 22, height: 5, rx: 2, fill: '#0B1A3A', opacity: .4 }, g); },
  padlock(g, c = '#F8FAFC') { S('path', { d: 'M -22 -6 L -22 -26 A 22 22 0 0 1 22 -26 L 22 -6', fill: 'none', stroke: c, 'stroke-width': 10 }, g); S('rect', { x: -34, y: -8, width: 68, height: 52, rx: 10, fill: c }, g); S('circle', { cx: 0, cy: 14, r: 7, fill: '#0B1A3A' }, g); },
  bell(g, c = '#FFB703') { S('path', { d: 'M -36 24 Q -30 18 -30 -4 Q -30 -36 0 -38 Q 30 -36 30 -4 Q 30 18 36 24 Z', fill: c }, g); S('circle', { cx: 0, cy: 32, r: 9, fill: c }, g); S('rect', { x: -4, y: -48, width: 8, height: 12, rx: 3, fill: c }, g); },
  funnel(g, c = '#22D3EE') { S('path', { d: 'M -50 -36 L 50 -36 L 12 6 L 12 40 L -12 48 L -12 6 Z', fill: c }, g); S('rect', { x: -50, y: -44, width: 100, height: 12, rx: 5, fill: c }, g); },
  cam(g, c = '#A78BFA', on = false) { S('rect', { x: -46, y: -22, width: 80, height: 44, rx: 10, fill: c }, g); S('path', { d: 'M 34 -12 L 56 -24 L 56 24 L 34 12 Z', fill: c }, g);
    S('rect', { x: -10, y: -52, width: 10, height: 32, fill: c }, g); },
  door(g, c = '#EF476F') { S('rect', { x: -32, y: -50, width: 64, height: 100, rx: 8, fill: '#0B1A3A', stroke: c, 'stroke-width': 7 }, g); S('circle', { cx: 16, cy: 4, r: 6, fill: c }, g); },
  book(g, c = '#FFB703') { S('path', { d: 'M 0 -30 Q -30 -42 -60 -34 L -60 36 Q -30 28 0 40 Q 30 28 60 36 L 60 -34 Q 30 -42 0 -30 Z', fill: '#F8FAFC' }, g); S('path', { d: 'M 0 -30 L 0 40', stroke: c, 'stroke-width': 6 }, g);
    S('path', { d: 'M -64 36 Q -30 30 0 44 Q 30 30 64 36 L 64 44 Q 30 38 0 52 Q -30 38 -64 44 Z', fill: c }, g); },
  server(g, c = '#22D3EE') { for (const y of [-30, 0, 30]) { S('rect', { x: -40, y: y - 12, width: 80, height: 24, rx: 6, fill: '#14295C', stroke: c, 'stroke-width': 4 }, g); S('circle', { cx: 26, cy: y, r: 4, fill: c }, g); } },
  barrel(g, c = '#F8FAFC') { S('rect', { x: -34, y: -38, width: 68, height: 76, rx: 14, fill: c }, g); for (const y of [-16, 12]) S('rect', { x: -34, y, width: 68, height: 6, fill: '#0B1A3A', opacity: .3 }, g); },
  check(g, c = '#06D6A0') { S('circle', { r: 30, fill: c }, g); S('path', { d: 'M -14 0 L -4 12 L 16 -12', fill: 'none', stroke: '#0B1A3A', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g); },
  cross(g, c = '#EF476F') { S('path', { d: 'M -30 -30 L 30 30 M 30 -30 L -30 30', stroke: c, 'stroke-width': 16, 'stroke-linecap': 'round' }, g); },
  mask(g, c = '#2A0F2E') { S('path', { d: 'M -40 -10 Q 0 -24 40 -10 L 36 14 Q 0 6 -36 14 Z', fill: c }, g); for (const x of [-16, 16]) S('ellipse', { cx: x, cy: 0, rx: 8, ry: 6, fill: '#F8FAFC' }, g); },
  plant(g, c = '#06121f') { S('path', { d: 'M -30 60 L 30 60 L 22 100 L -22 100 Z', fill: c }, g); for (const [r, l] of [[-40, 120], [-10, 150], [20, 130], [45, 100]]) S('ellipse', { cx: 0, cy: -l / 2 + 60, rx: 22, ry: l / 2, fill: c, transform: `rotate(${r} 0 60)` }, g); },
};
function ico(name, parent, x, y, s, c, extra) { const g = S('g', {}, parent); const inner = S('g', {}, g); ICO[name](inner, c, extra); g._x = x; g._y = y; g._s = s; return g; }
