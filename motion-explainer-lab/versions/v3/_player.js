/* Player: layers, render(t), controls, voice-driven clock, quiz, hotspots, export hooks. */
'use strict';
function boot(ep) {
  const svg = document.getElementById('svg');
  const $ = id => document.getElementById(id);
  const R = Runtime(ep, svg), K = R.K;
  // ---- layers
  const defs = S('defs', {}, svg);
  const grad = S('radialGradient', { id: 'spotG', gradientUnits: 'userSpaceOnUse', cx: 800, cy: 450, r: 700 }, defs);
  S('stop', { offset: 0, 'stop-color': '#050B1E', 'stop-opacity': 0 }, grad);
  S('stop', { offset: .55, 'stop-color': '#050B1E', 'stop-opacity': 0 }, grad);
  S('stop', { offset: 1, 'stop-color': '#050B1E', 'stop-opacity': ep.spotDark == null ? .42 : ep.spotDark }, grad);
  S('rect', { x: -10, y: -10, width: 1620, height: 920, fill: ep.bg || '#0B1A3A' }, svg);
  K.layers.far = S('g', { id: 'L-far' }, svg);
  K.layers.main = S('g', { id: 'L-main' }, svg);
  K.layers.front = S('g', { id: 'L-front' }, svg);
  const spot = S('rect', { x: -10, y: -10, width: 1620, height: 920, fill: 'url(#spotG)', 'pointer-events': 'none' }, svg);
  K.layers.hud = S('g', { id: 'L-hud' }, svg);
  ep.build(K);
  function layout(t) { AMBIENT = false; FRAMING = true; for (const a of R.actors) a.update(t); for (const ch of R.chars) ch.update(t); for (const fn of R.fx) fn(t); FRAMING = false; }
  for (const fr of R.frames) { layout(fr.t + fr.d); const bb = worldBBox(R, fr.targets);
    if (!bb) { console.warn('frame: cible vide', fr); continue; } const c = camFor(bb, fr.part, fr.o); R.camMoves.push({ t: fr.t, d: fr.d, x: c.x, y: c.y, z: c.z }); }
  R.camMoves.sort((a, b) => a.t - b.t); R.focusKeys.sort((a, b) => a.t - b.t);
  R.events.sort((a, b) => a.t - b.t);
  const PAR = ep.parallax || { far: .5, front: 1.3 };

  function cueAt(t) { for (const c of R.cues) if (t >= c.start && t < c.end) return c; return null; }
  function sceneAt(t) { let s = R.scenes[0]; for (const sc of R.scenes) if (t >= sc.start - 1e-6) s = sc; return s; }
  let fPrev = null, fCur = null;
  function focusPoint(t) {
    let cur = null, prev = null;
    for (const k of R.focusKeys) { if (t >= k.t) { prev = cur; cur = k; } }
    if (!cur) return null;
    const pos = k => { if (Array.isArray(k.target)) return [k.target[0], k.target[1], k.r || 420];
      const bb = worldBBox(R, [k.target]); if (!bb) return [0, 0, 420]; return [bb.x + bb.w / 2, bb.y + bb.h / 2, k.r || Math.max(260, .75 * Math.hypot(bb.w, bb.h))]; };
    const pc = pos(cur); if (!prev) return { x: pc[0], y: pc[1], r: pc[2] };
    const pp = pos(prev); const p = E.ioc(P(t, cur.t, .6));
    return { x: lerp(pp[0], pc[0], p), y: lerp(pp[1], pc[1], p), r: lerp(pp[2], pc[2], p) };
  }
  const subEls = [$('subs'), $('subsM')];
  let lastSub = null;
  function render(t, opts = {}) {
    AMBIENT = opts.ambient !== false;
    const c = camAt(R, t);
    const tf = f => `translate(800 450) scale(${c.z.toFixed(4)}) translate(${(-c.x * f).toFixed(2)} ${(-c.y * f).toFixed(2)})`;
    K.layers.far.setAttribute('transform', tf(PAR.far));
    K.layers.main.setAttribute('transform', tf(1));
    K.layers.front.setAttribute('transform', tf(PAR.front));
    for (const a of R.actors) a.update(t);
    for (const ch of R.chars) ch.update(t);
    for (const fn of R.fx) fn(t);
    const f = focusPoint(t);
    if (f) { grad.setAttribute('cx', 800 + (f.x - c.x) * c.z); grad.setAttribute('cy', 450 + (f.y - c.y) * c.z); grad.setAttribute('r', Math.max(380, f.r * c.z)); }
    else { grad.setAttribute('cx', 800); grad.setAttribute('cy', 430); grad.setAttribute('r', 760); }
    // subtitles
    const cu = cueAt(t); let sub = '';
    if (cu) { const parts = cu.sub.split('|'); sub = (cu.guess && t < cu.pauseAt + GUESS_PAUSE) ? parts[0] : parts.join(' '); }
    if (sub !== lastSub) { for (const e of subEls) { e.textContent = sub; e.classList.toggle('empty', !sub); } lastSub = sub; }
    R.t = t; R.cam = c;
    return c;
  }
  R.render = render;

  /* -------- player state -------- */
  const st = { t: 0, playing: false, speed: 1, subs: true, voice: false, quiz: false, last: 0, waitStart: null, spoken: {}, pending: false, quizDone: {} };
  const synth = (() => { try { return window.speechSynthesis || null; } catch (e) { return null; } })();
  let frVoice = null;
  function pickVoice() { try { const vs = synth.getVoices(); frVoice = vs.find(v => /fr[-_]FR/i.test(v.lang)) || vs.find(v => /^fr/i.test(v.lang)) || null; } catch (e) { } }
  if (synth) { pickVoice(); try { synth.onvoiceschanged = pickVoice; } catch (e) { } }
  function speak(text) {
    if (!synth || !st.voice) return;
    try { const u = new SpeechSynthesisUtterance(text); u.lang = 'fr-FR'; if (frVoice) u.voice = frVoice; u.rate = 1.05 * st.speed;
      st.pending = true; u.onend = u.onerror = () => { st.pending = false; }; synth.speak(u); } catch (e) { st.pending = false; }
  }
  function cancelSpeech() { try { synth && synth.cancel(); } catch (e) { } st.pending = false; }
  function sayParts(c) { return c.say.split('|').map(s => s.trim()); }
  function voiceStep(prevT, t) {
    if (!st.voice) return;
    for (const c of R.cues) {
      const parts = sayParts(c);
      if (prevT <= c.start + .02 && t >= c.start && !st.spoken[c.id + 'a']) { st.spoken[c.id + 'a'] = 1; cancelSpeech(); speak(parts[0]); }
      if (c.guess) { const tr = c.pauseAt + GUESS_PAUSE; if (prevT <= tr && t >= tr && !st.spoken[c.id + 'b']) { st.spoken[c.id + 'b'] = 1; speak(parts[1]); } }
    }
  }
  function resetSpoken(t) { st.spoken = {}; for (const c of R.cues) { if (c.start < t - .05) st.spoken[c.id + 'a'] = 1; if (c.guess && c.pauseAt + GUESS_PAUSE < t - .05) st.spoken[c.id + 'b'] = 1; } }

  function seek(t) { st.t = clamp(t, 0, R.duration); cancelSpeech(); resetSpoken(st.t); st.waitStart = null; render(st.t); ui(); }
  function play() { if (st.t >= R.duration - .05) seek(0); st.playing = true; st.last = performance.now(); $('poster').hidden = true; closeHot(); resetSpoken(st.t);
    if (st.voice) { const c = cueAt(st.t); if (c && st.t - c.start < .3) { st.spoken[c.id + 'a'] = 0; } }
    requestAnimationFrame(loop); ui(); }
  function pause() { st.playing = false; cancelSpeech(); ui(); }
  function loop(now) {
    if (!st.playing) return;
    const dt = Math.min(.1, (now - st.last) / 1000); st.last = now;
    let nt = st.t + dt * st.speed; const c = cueAt(st.t);
    if (st.voice && c && st.pending && nt >= c.end - .02) {
      if (st.waitStart == null) st.waitStart = now;
      if (now - st.waitStart < 20000) nt = c.end - .021; else st.pending = false;
    } else st.waitStart = null;
    // quiz pause
    if (st.quiz && c && c.guess && ep.quiz && ep.quiz[c.id] && !st.quizDone[c.id] && st.t < c.pauseAt + .3 && nt >= c.pauseAt + .3) {
      st.quizDone[c.id] = 1; st.t = c.pauseAt + .3; render(st.t); pause(); showQuiz(c); return;
    }
    voiceStep(st.t, nt);
    st.t = nt;
    if (st.t >= R.duration) { st.t = R.duration; render(st.t); pause(); return; }
    render(st.t); ui(); requestAnimationFrame(loop);
  }

  /* -------- UI -------- */
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const chap = $('chapters');
  R.scenes.forEach((s, i) => { const b = document.createElement('button'); b.className = 'chap'; b.type = 'button';
    b.innerHTML = `<span class="n">${i + 1}</span><span class="tt">${s.title}</span><span class="ts">${fmt(s.start)}</span>`;
    b.onclick = () => { seek(s.start - (i ? 1.4 : .6)); }; chap.appendChild(b); });
  const ticks = $('ticks');
  R.scenes.forEach(s => { const d = document.createElement('i'); d.style.left = (s.start / R.duration * 100) + '%'; ticks.appendChild(d); });
  const leg = $('legend');
  (ep.legend || []).forEach(([col, label]) => { const d = document.createElement('span'); d.className = 'lg'; d.innerHTML = `<i style="background:${col}"></i>${label}`; leg.appendChild(d); });
  function ui() {
    $('play').textContent = st.playing ? '❚❚' : '▶'; $('play').setAttribute('aria-label', st.playing ? 'Pause' : 'Lecture');
    $('time').textContent = `${fmt(st.t)} / ${fmt(R.duration)}`;
    $('bar').style.width = (st.t / R.duration * 100) + '%';
    const sc = sceneAt(st.t); [...chap.children].forEach((b, i) => b.classList.toggle('on', R.scenes[i] === sc));
    document.body.classList.toggle('paused', !st.playing);
    if (!st.playing) drawHots(); else clearHots();
  }
  $('play').onclick = () => st.playing ? pause() : play();
  $('bigplay').onclick = play;
  $('prev').onclick = () => { const i = R.scenes.indexOf(sceneAt(st.t)); const s = R.scenes[Math.max(0, st.t - sceneAt(st.t).start > 2 ? i : i - 1)]; seek(s.start - (s === R.scenes[0] ? .6 : 1.4)); };
  $('next').onclick = () => { const i = R.scenes.indexOf(sceneAt(st.t)); if (i < R.scenes.length - 1) seek(R.scenes[i + 1].start - 1.4); };
  $('track').onclick = e => { const r = e.currentTarget.getBoundingClientRect(); seek((e.clientX - r.left) / r.width * R.duration); };
  $('speed').onchange = e => { st.speed = +e.target.value; };
  const tog = (id, key, cb) => { const b = $(id); b.onclick = () => { st[key] = !st[key]; b.setAttribute('aria-pressed', st[key]); cb && cb(); }; b.setAttribute('aria-pressed', st[key]); };
  tog('cc', 'subs', () => document.body.classList.toggle('nosubs', !st.subs));
  tog('voice', 'voice', () => { if (!st.voice) cancelSpeech(); else resetSpoken(st.t); });
  tog('quizb', 'quiz', () => { st.quizDone = {}; });
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'SELECT') return;
    if (e.code === 'Space') { e.preventDefault(); st.playing ? pause() : play(); }
    if (e.code === 'ArrowRight') $('next').click(); if (e.code === 'ArrowLeft') $('prev').click();
    if (e.code === 'Escape') { closeHot(); $('quiz').hidden = true; }
  });
  // hotspots
  const hl = $('hotspots');
  function clearHots() { hl.innerHTML = ''; }
  function drawHots() {
    clearHots(); if (document.documentElement.classList.contains('export')) return;
    const c = R.cam || camAt(R, st.t);
    for (const h of R.hots) {
      if (st.t < h.at || st.t > h.until) continue;
      const sx = 800 + (h.x - c.x) * c.z, sy = 450 + (h.y - c.y) * c.z;
      if (sx < 40 || sx > 1560 || sy < 40 || sy > 740) continue;
      const b = document.createElement('button'); b.type = 'button'; b.className = 'hot';
      b.style.left = (sx / 16) + '%'; b.style.top = (sy / 9) + '%';
      b.innerHTML = `<span class="dot">+</span><span class="lbl">${h.title}</span>`;
      b.onclick = () => openHot(h); hl.appendChild(b);
    }
  }
  function openHot(h) { $('hotpanel').hidden = false; $('hottitle').textContent = h.title; $('hotbody').innerHTML = h.html; }
  function closeHot() { $('hotpanel').hidden = true; }
  $('hotclose').onclick = closeHot;
  // quiz
  function showQuiz(c) {
    const q = ep.quiz[c.id], box = $('quiz'); box.hidden = false;
    $('quizq').textContent = q.q; const ch = $('quizc'); ch.innerHTML = ''; $('quizwhy').hidden = true; $('quizgo').hidden = true;
    q.choices.forEach((txt, i) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = txt;
      b.onclick = () => { [...ch.children].forEach((x, j) => { x.disabled = true; x.classList.add(j === q.answer ? 'ok' : (j === i ? 'ko' : 'dim')); });
        $('quizwhy').textContent = q.why; $('quizwhy').hidden = false; $('quizgo').hidden = false; $('quizgo').focus(); };
      ch.appendChild(b); });
  }
  $('quizgo').onclick = () => { $('quiz').hidden = true; play(); };
  // poster
  $('dur').textContent = fmt(R.duration);
  const posterT = ep.poster != null ? (typeof ep.poster === 'function' ? ep.poster(K) : ep.poster) : 2;
  // hash routing for scenes (#s3)
  function fromHash() { const m = /^#(s\d+)$/.exec(location.hash); if (m) { const s = K.sc(m[1]); if (s) { seek(s.start - .6); $('poster').hidden = true; return true; } } return false; }
  window.addEventListener('hashchange', fromHash);
  if (!fromHash()) { st.t = posterT; render(st.t); ui(); }
  window.addEventListener('resize', () => { if (!st.playing) drawHots(); });

  /* -------- test / export hooks -------- */
  window.__mx = {
    setEp() { }, render: (t, o) => render(t, o), duration: R.duration, cues: R.cues, scenes: R.scenes, events: R.events,
    marks: R.marks, focusAt: t => { const f = focusAt(R, t); return f && !Array.isArray(f.target) ? f.target : null; },
    charRoots: () => R.chars.map(c => c.root),
    guessWindows: R.cues.filter(c => c.guess).map(c => [c.pauseAt, c.pauseAt + GUESS_PAUSE]),
    exportMode(w = 1920, subs = true) { document.documentElement.classList.add('export'); $('poster').hidden = true; clearHots();
      const stg = $('stage'); stg.style.width = w + 'px'; stg.style.height = Math.round(w * 9 / 16) + 'px';
      $('subs').style.fontSize = Math.round(34 * w / 1920) + 'px'; $('subs').style.bottom = Math.round(34 * w / 1920) + 'px';
      document.body.classList.toggle('nosubs', !subs); },
    pause, seek, R,
  };
}
