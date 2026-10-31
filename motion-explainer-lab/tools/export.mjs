// Export: 1920x1080 @24fps, frames rendered by W parallel pages, each piped to its own ffmpeg, then concatenated.
// Writes meta.json for the audio track. Usage: node tools/export.mjs versions/vN/index.html versions/vN [workers]
import { createRequire } from 'module'; const require = createRequire(import.meta.url); const { chromium } = require('playwright');
import { spawn, spawnSync } from 'child_process'; import fs from 'fs'; import path from 'path'; import { pathToFileURL } from 'url';
const [page_, out, wArg] = process.argv.slice(2); const FPS = 24; const W = +(wArg || 3);
const browser = await chromium.launch();
async function open() {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(pathToFileURL(path.resolve(page_)).href, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__mx); await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => __mx.exportMode(1920)); return page;
}
const p0 = await open();
const meta = await p0.evaluate(() => ({ duration: __mx.duration, events: __mx.events, guess: __mx.guessWindows,
  cues: __mx.cues.map(c => ({ id: c.id, start: c.start, end: c.end, say: c.say, guess: c.guess, pauseAt: c.pauseAt })) }));
fs.writeFileSync(path.join(out, 'meta.json'), JSON.stringify(meta, null, 1));
const N = Math.ceil(meta.duration * FPS), chunk = Math.ceil(N / W);
async function worker(k, page) {
  const seg = path.join(out, `_seg${k}.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21', '-pix_fmt', 'yuv420p', seg], { stdio: ['pipe', 'inherit', 'inherit'] });
  const stage = page.locator('#stage');
  for (let i = k * chunk; i < Math.min(N, (k + 1) * chunk); i++) {
    await page.evaluate(t => __mx.render(t), i / FPS);
    const buf = await stage.screenshot({ type: 'jpeg', quality: 90 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((i - k * chunk) % 480 === 0) console.log(`w${k} frame ${i - k * chunk}/${chunk}`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); return seg;
}
const pages = [p0]; for (let k = 1; k < W; k++) pages.push(await open());
const segs = await Promise.all(pages.map((p, k) => worker(k, p)));
await browser.close();
fs.writeFileSync(path.join(out, '_segs.txt'), segs.map(s => `file '${path.resolve(s)}'`).join('\n'));
const silent = path.join(out, '_silent.mp4');
spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(out, '_segs.txt'), '-c', 'copy', '-movflags', '+faststart', silent], { stdio: 'inherit' });
segs.forEach(s => fs.unlinkSync(s)); fs.unlinkSync(path.join(out, '_segs.txt'));
console.log('silent video ->', silent);
