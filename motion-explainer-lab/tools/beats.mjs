// Fast beat-sheet audit (no rendering): duration, gaps > 2.5 s between beat marks, cues under quota ceil(dur/2).
// Usage: node tools/beats.mjs versions/vN/index.html
import { createRequire } from 'module'; const require = createRequire(import.meta.url); const { chromium } = require('playwright');
import path from 'path'; import { pathToFileURL } from 'url';
const b = await chromium.launch(); const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(pathToFileURL(path.resolve(process.argv[2])).href, { waitUntil: 'domcontentloaded' });
await p.waitForFunction(() => window.__mx || document.title === 'x', null, { timeout: 8000 }).catch(() => {});
if (errs.length) { console.log('ERREURS', errs); process.exit(1); }
const r = await p.evaluate(() => {
  const marks = [...new Set(__mx.marks.map(m => +m.toFixed(2)))].sort((a, b) => a - b), G = __mx.guessWindows, D = __mx.duration;
  const inG = (a, b) => G.some(([g0, g1]) => a >= g0 - .6 && b <= g1 + .6);
  const cueAt = t => (__mx.cues.find(c => c.start <= t && t < c.end) || {}).id;
  const gaps = []; for (let i = 1; i < marks.length; i++) if (marks[i] - marks[i - 1] > 2.5 && !inG(marks[i - 1] + .1, marks[i] - .1) && marks[i - 1] < D - 2.5) gaps.push([marks[i - 1], marks[i], cueAt(marks[i - 1] + .01)]);
  const quota = __mx.cues.map(c => [c.id, marks.filter(m => m >= c.start - .3 && m < c.end).length, Math.ceil(c.dur / 2)]).filter(x => x[1] < x[2]);
  return { duration: +D.toFixed(1), gaps, quota };
});
console.log(JSON.stringify(r)); await b.close();
