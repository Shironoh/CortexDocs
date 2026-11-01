// Dump an episode's cues (id, sc, say, who) as JSON without a browser: episode.js is evaluated with DOM-free stubs.
// Usage: node tools/cues.mjs versions/<id>/episode.js
import fs from 'fs';
const src = fs.readFileSync(process.argv[2], 'utf8');
const EP = new Function(src + '\n;return EP;')();
console.log(JSON.stringify(EP.cues.map(c => ({ id: c.id, sc: c.sc, say: c.say, who: c.who || null, breath: c.breath ?? null }))));
