// QA: per-cue captures (25/50/75 %), automatic layout checks, frozen-frame frames, mobile page shot.
// Usage: node tools/qa.mjs versions/vN/index.html iterations/vN
import { createRequire } from 'module'; const require = createRequire(import.meta.url); const { chromium } = require('playwright');
import fs from 'fs'; import path from 'path'; import { pathToFileURL } from 'url';

const [page_, out] = process.argv.slice(2);
fs.mkdirSync(path.join(out, 'caps'), { recursive: true }); fs.mkdirSync(path.join(out, 'frozen'), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(pathToFileURL(path.resolve(page_)).href, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => window.__mx, null, { timeout: 15000 });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => __mx.exportMode(1280));
const meta = await page.evaluate(() => ({ duration: __mx.duration, cues: __mx.cues.map(c => ({ id: c.id, sc: c.sc, start: c.start, end: c.end, dur: c.dur, words: c.wAll, sub: c.sub, guess: c.guess })),
  scenes: __mx.scenes.map(s => ({ id: s.id, title: s.title, start: s.start, end: s.end })), guess: __mx.guessWindows, events: __mx.events.length, marks: __mx.marks,
  cams: __mx.R.camMoves.map(m => ({ t: m.t, d: m.d, z: m.z })), chars: __mx.R.chars.map(c => ({ name: c.o.name, pop: c.popT, poses: c.poses.map(p => [p.t, p.name]), walks: c.moves.map(m => m.t), exprs: c.exprs.map(e => e[0]) })),
  says: __mx.cues.map(c => c.say) }));

const analyze = (t) => {
  __mx.render(t, { ambient: false });
  const svg = document.getElementById('svg'); const sr = svg.getBoundingClientRect(); const k = 1600 / sr.width;
  const toVB = r => ({ x1: (r.left - sr.left) * k, y1: (r.top - sr.top) * k, x2: (r.right - sr.left) * k, y2: (r.bottom - sr.top) * k });
  const effOpacity = el => { let a = 1; for (let e = el; e && e !== svg; e = e.parentNode) { if (e.getAttribute) { if (e.getAttribute('visibility') === 'hidden' || e.getAttribute('display') === 'none') return 0; const o = e.getAttribute('opacity'); if (o != null) a *= +o; } } return a; };
  const scaleOf = el => { const m = el.getScreenCTM(), b = svg.getScreenCTM(); return Math.hypot(m.a, m.b) / Math.hypot(b.a, b.b); };
  const txts = [...svg.querySelectorAll('text[data-txt]')].map(el => { const r = toVB(el.getBoundingClientRect()); return { el, r, a: effOpacity(el), code: el.dataset.txt === 'code', axis: el.hasAttribute('data-axis'), block: el.getAttribute('data-block'), bleed: el.hasAttribute('data-bleed'),
    size: (+el.getAttribute('font-size')) * scaleOf(el), s: el.textContent.slice(0, 40) }; })
    .filter(o => o.a > .3 && o.r.x2 > 0 && o.r.x1 < 1600 && o.r.y2 > 0 && o.r.y1 < 900 && (o.r.x2 - o.r.x1) > 2);
  const issues = [];
  for (const o of txts) {
    const inside = o.r.x1 >= 0 && o.r.x2 <= 1600 && o.r.y1 >= 0 && o.r.y2 <= 900;
    if (!inside && !o.bleed) issues.push({ k: 'cut', s: o.s });
    if (o.r.y2 > 760 && o.r.y1 < 900) issues.push({ k: 'subband', s: o.s });
    const min = o.code ? 36 : 44; if (o.size < min - .5) issues.push({ k: 'small', s: o.s, v: +o.size.toFixed(1) });
  }
  for (let i = 0; i < txts.length; i++) for (let j = i + 1; j < txts.length; j++) { const a = txts[i].r, b = txts[j].r;
    const ix = Math.max(0, Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1)), iy = Math.max(0, Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1));
    const ar = Math.min((a.x2 - a.x1) * (a.y2 - a.y1), (b.x2 - b.x1) * (b.y2 - b.y1)); if (ix * iy > .12 * ar) issues.push({ k: 'overlap', s: txts[i].s + ' / ' + txts[j].s }); }
  const blocks = new Set(txts.filter(o => !o.axis).map((o, i) => o.block || 'i' + i)).size + (txts.some(o => o.axis) ? 1 : 0); // a chart's axis/tick labels read as one block
  if (blocks > 3) issues.push({ k: 'toomanytext', v: blocks, s: txts.map(o => o.s).join(' | ') });
  let focus = null; const f = __mx.focusAt(t);
  if (f && effOpacity(f) < .3) issues.push({ k: 'focus_hidden' });
  if (f) { const r = toVB(f.getBoundingClientRect()); const cx = (r.x1 + r.x2) / 2, cy = (r.y1 + r.y2) / 2;
    const cl = { x1: Math.max(0, r.x1), y1: Math.max(0, r.y1), x2: Math.min(1600, r.x2), y2: Math.min(900, r.y2) };
    const area = Math.max(0, cl.x2 - cl.x1) * Math.max(0, cl.y2 - cl.y1) / (1600 * 900);
    focus = { cx: Math.round(cx), cy: Math.round(cy), area: +area.toFixed(3) };
    if (cx < 240 || cx > 1360 || cy < 135 || cy > 765) issues.push({ k: 'focus_offcenter', v: [Math.round(cx), Math.round(cy)] });
    const hfrac = Math.max(0, cl.y2 - cl.y1) / 900; // skill : sujet >= 8 % de la surface OU personnage/sujet >= 25 % de la hauteur
    const wfrac = Math.max(0, cl.x2 - cl.x1) / 1600; // une ligne d'artefact qui remplit la moitié de la largeur est un gros plan valide
    if (area < .08 && hfrac < .25 && wfrac < .5) issues.push({ k: 'focus_small', v: +area.toFixed(3) }); }
  // characters + focus: subtitle band and foreground occlusion
  const frontRects = [...document.getElementById('L-front').children].map(e => toVB(e.getBoundingClientRect())).filter(r => r.x2 > 0 && r.x1 < 1600 && r.y2 > 0 && r.y1 < 900);
  const inter = (a, b) => Math.max(0, Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1)) * Math.max(0, Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1));
  const subj = [...document.querySelectorAll('g[data-char]')].filter(e => effOpacity(e) > .3).map(e => ({ el: e, r: toVB(e.getBoundingClientRect()), s: 'perso:' + (e.dataset.char || '?') }));
  if (f) subj.push({ r: toVB(f.getBoundingClientRect()), s: 'focus' });
  for (const o of subj) { const r = o.r; const h = r.y2 - r.y1, w = r.x2 - r.x1; if (w <= 0 || h <= 0 || r.x2 < 0 || r.x1 > 1600 || r.y1 > 900 || r.y2 < 0) continue;
    const vis = { x1: Math.max(0, r.x1), y1: Math.max(0, r.y1), x2: Math.min(1600, r.x2), y2: Math.min(900, r.y2) };
    if (vis.y2 > 760 && (vis.y2 - Math.max(760, vis.y1)) > .2 * (vis.y2 - vis.y1)) issues.push({ k: 'subj_in_band', s: o.s });
    const occ = frontRects.reduce((n, fr) => n + inter(fr, vis), 0); if (occ > .2 * (vis.x2 - vis.x1) * (vis.y2 - vis.y1)) issues.push({ k: 'subj_occluded', s: o.s });
    if (o.s.startsWith('perso') && (vis.x2 - vis.x1) < .6 * w) issues.push({ k: 'subj_cut', s: o.s });
    if (o.s.startsWith('perso')) for (const tx of txts) { if (tx.el.closest('g[data-char]')) continue; const ar = (tx.r.x2 - tx.r.x1) * (tx.r.y2 - tx.r.y1);
      // le texte est-il DERRIÈRE le personnage (ordre du document) et recouvert à plus de 25 % ?
      const behind = tx.el.compareDocumentPosition(o.el) & Node.DOCUMENT_POSITION_FOLLOWING;
      if (behind && inter(tx.r, r) > .25 * ar) issues.push({ k: 'subj_covers_text', s: o.s + ' > ' + tx.s }); } }
  const words = txts.reduce((n, o) => n + o.el.textContent.trim().split(/\s+/).length, 0);
  const c0 = camAt(__mx.R, t - .15), c1 = camAt(__mx.R, t + .15);
  const moving = Math.hypot(c1.x - c0.x, c1.y - c0.y) * c0.z > 12 || Math.abs(Math.log(c1.z / c0.z)) > .02;
  return { t, ntext: txts.length, words, focus, issues, moving };
};

const caps = [];
for (const c of meta.cues) {
  for (const q of [.25, .5, .75]) {
    const t = c.start + c.dur * q;
    const r = await page.evaluate(analyze, t);
    const file = path.join(out, 'caps', `${c.id}_${Math.round(q * 100)}.jpg`);
    await page.locator('#stage').screenshot({ path: file, type: 'jpeg', quality: 80 });
    caps.push({ cue: c.id, sc: c.sc, q, file: path.relative(out, file), ...r });
  }
}
// frozen-frame frames (ambient off, no subtitles), every 0.5 s
await page.evaluate(() => __mx.exportMode(320, false));
const frozen = [];
for (let t = 0; t <= meta.duration; t += .5) {
  await page.evaluate(t => __mx.render(t, { ambient: false }), t);
  const file = path.join(out, 'frozen', `f${String(Math.round(t * 2)).padStart(4, '0')}.png`);
  await page.locator('#stage').screenshot({ path: file }); frozen.push({ t, file: path.relative(out, file) });
}
// mobile page shot (390 px) and desktop page shot
const m = await browser.newPage({ viewport: { width: 390, height: 844 } }); await m.goto(pathToFileURL(path.resolve(page_)).href, { waitUntil: 'domcontentloaded' }); await m.waitForFunction(() => window.__mx);
const hscroll = await m.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
await m.screenshot({ path: path.join(out, 'mobile.png'), fullPage: true });
const d = await browser.newPage({ viewport: { width: 1280, height: 900 } }); await d.goto(pathToFileURL(path.resolve(page_)).href, { waitUntil: 'domcontentloaded' }); await d.waitForFunction(() => window.__mx);
await d.screenshot({ path: path.join(out, 'desktop.png') });
await browser.close();
fs.writeFileSync(path.join(out, 'qa_raw.json'), JSON.stringify({ meta, caps, frozen, errors, mobileHScroll: hscroll }, null, 1));
console.log(`captures ${caps.length}, frozen frames ${frozen.length}, errors ${errors.length}, duration ${meta.duration.toFixed(1)} s`);
