import { createRequire } from 'module'; const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 800, height: 450 } });
await p.goto('file://' + process.argv[2]); await p.waitForFunction(() => window.render);
const out = [];
for (const t of [0, 1, 2.5, 1, 0.3, 2.5]) { const d = await p.evaluate(t => render(t), t); const png = await p.screenshot(); out.push([t, d, require('crypto').createHash('md5').update(png).digest('hex').slice(0, 8)]); }
console.log(JSON.stringify(out, null, 0));
await p.evaluate(() => render(1.2)); await p.screenshot({ path: process.argv[3] });
const t0 = Date.now(); for (let i = 0; i < 240; i++) await p.evaluate(t => render(t), i / 24 % 3); console.log('240 seeks', Date.now() - t0, 'ms');
await b.close();
