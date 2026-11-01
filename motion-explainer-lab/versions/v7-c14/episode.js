/*META{"title":"L'horloge d'Ötzi","h1":"L'horloge d'Ötzi · la datation au carbone 14","eyebrow":"Motion explainer · skill v7 · sciences, grand public","voice":{"cast":{"foe":{"voice":"fr_FR-tom-medium","ls":1.0}}},"music":{"mood":"wonder","key":"D"},"footer":"<p class='footer'>v7-c14, skill v7. Sources : Bonani et al. 1994, <i>Radiocarbon</i> 36(2) (mesures et calibration d'Ötzi) ; LNHB/CEA, table du C-14 (demi-vie 5 700 ± 30 ans) ; Reimer et al. 2020, IntCal20 ; Renne et al. 2013, <i>Science</i> 339 ; Stuiver &amp; Polach 1977. Fiche complète : research/c14/SOURCES.md. Voix Piper (siwis, tom), musique générée.</p>"}META*/
/* ---------- FICHE (skill v7) ----------
Audience : métier = aucun lien (adulte curieux) ; domaine = novice. Savoir faire après (raisonnement réutilisable) :
 1. lire « 4560 ± 65 BP » : âge radiocarbone, années avant 1950, marge de mesure ; 2. savoir qu'il faut calibrer et qu'on obtient
 des intervalles avec probabilités ; 3. reconnaître ce que le C14 ne date pas (ce qui n'a pas vécu, > ~50 000 ans).
Question centrale : comment sait-on qu'Ötzi est mort il y a plus de 5 000 ans ?
Inventaire (tel quel à l'écran) : ETH-8342 · os · 4560 ± 65 BP · ~1 mg ; moyenne 4550 ± 27 BP ; BP = avant 1950 ; demi-vie 5 700 ans ;
 1 atome sur mille milliards ; 3239–3105 av. J.-C. (66 %), 3359–3294 (33 %) ; ~50 000 ans ; 66 millions d'années.
Métaphore système : le sablier (rempli tant qu'on vit, se vide à la mort à rythme fixe).
Idées reçues : « le C14 date tout » (antagoniste) ; « BP = avant aujourd'hui » ; « une datation = une date ».
Devinez : après 2 demi-vies ? ; 4550 BP = une seule date ?
Termes nouveaux par scène : s2 carbone 14 ; s3 demi-vie (dite « en 5 700 ans, la moitié ») ; s4 BP ; s5 calibration ; s6 bruit de mesure.
Pourquoi : s2 les plantes absorbent le CO2 ; s3 chaque atome a la même chance (rythme fixe) ; s4 momie précieuse → accélérateur (1 mg) ;
 s5 l'air a varié → l'hypothèse « niveau constant » est fausse ; s6 trop peu d'atomes face au bruit.
3 questions : que veut dire 4560 ± 65 BP ? pourquoi faut-il calibrer, et qu'obtient-on ? peut-on dater un dinosaure / une pierre ?
------------------------------------ */
const EP = {
  bg: '#0B1A3A', lead: .6, tail: 2.2, spotDark: .25,
  zones: { glacier: [0, 0], ciel: [2300, 0], temps: [4600, 0], labo: [6900, 0], arbres: [9200, 0], limites: [11500, 0], fin: [13800, 0] },
  legend: [['#FFB703', 'carbone 14'], ['#22D3EE', 'azote, carbone ordinaire'], ['#06D6A0', 'le vivant'], ['#EF476F', 'idée reçue'], ['#A78BFA', 'calibration']],
  scenes: [{ id: 's1', title: 'Un homme dans la glace' }, { id: 's2', title: 'D\'où vient le carbone 14' }, { id: 's3', title: 'Le sablier se vide' },
    { id: 's4', title: 'Le rapport du labo' }, { id: 's5', title: 'Calibrer' }, { id: 's6', title: 'Les limites' }, { id: 's7', title: 'Lire une datation' }],
  cues: [
    { id: 'c1', sc: 's1', sub: 'Septembre 1991, dans un glacier des Alpes : un homme, mort depuis très longtemps. Depuis combien de temps ?', say: 'Septembre mille neuf cent quatre-vingt-onze, dans un glacier des Alpes : un homme, mort depuis très longtemps. Depuis combien de temps ?' },
    { id: 'c2', sc: 's1', who: 'foe', sub: 'Facile : le carbone 14 date tout !', say: 'Facile : le carbone quatorze date tout !' },
    { id: 'c3', sc: 's1', sub: 'Pas tout. Mais pour lui, oui : son corps contient une horloge.', say: 'Pas tout. Mais pour lui, oui : son corps contient une horloge.' },
    { id: 'c4', sc: 's2', sub: 'Très haut, les rayons cosmiques frappent l\'azote de l\'air et le changent en carbone 14.', say: 'Très haut, les rayons cosmiques frappent l\'azote de l\'air et le changent en carbone quatorze.' },
    { id: 'c5', sc: 's2', sub: 'Il est rare : environ un atome de carbone sur mille milliards. Les plantes l\'absorbent, puis ceux qui les mangent.', say: 'Il est rare : environ un atome de carbone sur mille milliards. Les plantes l\'absorbent, puis ceux qui les mangent.' },
    { id: 'c6', sc: 's2', sub: 'Tant qu\'on vit, on en reprend : le sablier reste plein. À la mort, plus rien n\'entre.', say: 'Tant qu\'on vit, on en reprend : le sablier reste plein. À la mort, plus rien n\'entre.', breath: .9 },
    { id: 'c7', sc: 's3', sub: 'Puis il redevient lentement de l\'azote, à un rythme fixe : chaque atome a la même chance de changer chaque année.', say: 'Puis il redevient lentement de l\'azote, à un rythme fixe : chaque atome a la même chance de changer chaque année.' },
    { id: 'c8', sc: 's3', sub: 'En 5 700 ans, la moitié disparaît. Devinez : après deux fois 5 700 ans, que reste-t-il ?|Un quart. Puis un huitième, un seizième…', say: 'En cinq mille sept cents ans, la moitié disparaît. Devinez : après deux fois cinq mille sept cents ans, que reste-t-il ? | Un quart. Puis un huitième, un seizième.' },
    { id: 'c9', sc: 's3', sub: 'Compter ce qui reste, c\'est donc lire depuis quand le sablier se vide.', say: 'Compter ce qui reste, c\'est donc lire depuis quand le sablier se vide.', breath: .9 },
    { id: 'c10', sc: 's4', sub: 'Zurich et Oxford ont compté les atomes un par un, avec un accélérateur, sur environ un milligramme : la momie est précieuse.', say: 'Zurich et Oxford ont compté les atomes un par un, avec un accélérateur, sur environ un milligramme : la momie est précieuse.' },
    { id: 'c11', sc: 's4', sub: 'Une vraie ligne du rapport : l\'os, 4 560 ± 65 BP.', say: 'Une vraie ligne du rapport : l\'os, quatre mille cinq cent soixante, plus ou moins soixante-cinq, B P.' },
    { id: 'c12', sc: 's4', sub: 'On croit que BP veut dire « avant aujourd\'hui ». Faux : avant 1950. Et le « ± », c\'est la marge de mesure.', say: 'On croit que B P veut dire avant aujourd\'hui. Faux : avant mille neuf cent cinquante. Et le plus ou moins, c\'est la marge de mesure.' },
    { id: 'c13', sc: 's5', sub: 'Ce n\'est pas encore une date : le carbone 14 de l\'air a varié au fil des siècles.', say: 'Ce n\'est pas encore une date : le carbone quatorze de l\'air a varié au fil des siècles.' },
    { id: 'c14', sc: 's5', sub: 'On corrige avec des cernes d\'arbres, dont on connaît l\'année exacte : c\'est la courbe de calibration.', say: 'On corrige avec des cernes d\'arbres, dont on connaît l\'année exacte : c\'est la courbe de calibration.' },
    { id: 'c15', sc: 's5', sub: 'Devinez : 4 550 BP, la moyenne d\'Ötzi, est-ce une seule date ?|Non : deux chances sur trois entre 3239 et 3105 avant notre ère.', say: 'Devinez : quatre mille cinq cent cinquante B P, la moyenne d\'Ötzi, est-ce une seule date ? | Non : deux chances sur trois entre trois mille deux cent trente-neuf et trois mille cent cinq avant notre ère.' },
    { id: 'c16', sc: 's6', who: 'foe', sub: 'Alors datons un dinosaure !', say: 'Alors datons un dinosaure !' },
    { id: 'c17', sc: 's6', sub: 'Impossible : au-delà de 50 000 ans environ, il reste trop peu de carbone 14 à compter. Les dinosaures, 66 millions d\'années, se datent avec d\'autres horloges.', say: 'Impossible : au-delà de cinquante mille ans environ, il reste trop peu de carbone quatorze à compter. Les dinosaures, soixante-six millions d\'années, se datent avec d\'autres horloges.', breath: .9 },
    { id: 'c18', sc: 's7', sub: 'Ötzi est donc mort vers 3300 à 3100 avant notre ère, selon la calibration de 1994 : il y a plus de 5 000 ans.', say: 'Ötzi est donc mort vers trois mille trois cents à trois mille cent avant notre ère, selon la calibration de mille neuf cent quatre-vingt-quatorze : il y a plus de cinq mille ans.' },
    { id: 'c19', sc: 's7', sub: 'Devant une datation : lisez le BP et sa marge, demandez si elle est calibrée, vérifiez que l\'objet a vécu il y a moins de 50 000 ans.', say: 'Devant une datation : lisez le B P et sa marge, demandez si elle est calibrée, vérifiez que l\'objet a vécu il y a moins de cinquante mille ans.' },
    { id: 'c20', sc: 's7', sub: 'En réalité, les labos corrigent aussi la composition de l\'échantillon. Mais vous savez lire l\'horloge d\'Ötzi.', say: 'En réalité, les labos corrigent aussi la composition de l\'échantillon. Mais vous savez lire l\'horloge d\'Ötzi.' },
  ],
  quiz: {
    c8: { q: 'Après deux fois 5 700 ans, quelle part du carbone 14 reste-t-il ?', choices: ['Rien', 'Un quart', 'Un tiers'], answer: 1, why: 'La moitié de la moitié : chaque période de 5 700 ans divise ce qui reste par deux.' },
    c15: { q: 'Calibrée, la moyenne 4550 ± 27 BP donne…', choices: ['une date exacte', 'des intervalles avec leur probabilité', 'l\'âge à 27 ans près'], answer: 1, why: 'La courbe ondule : une même valeur BP tombe sur plusieurs périodes. Bonani et al. 1994 : 66 % entre 3239 et 3105 av. J.-C., 33 % entre 3359 et 3294, 1 % entre 3277 et 3268.' },
  },
  poster: K => K.T('c1', 'homme') + .8,
  build(K) {
    const k = sceneKit(K); const { C, G, I, F, FLOOR } = k; const { S, E, Z, P } = K; const T = K.T, R = K.reveal, cue = K.cue;
    k.world(['glacier', 'ciel', 'temps', 'labo', 'arbres', 'limites', 'fin']);
    /* ---- shared drawings ---- */
    const atom = (g, x, y, col, lab, o = {}) => { const a = G(g, x, y, { s: 1.6, ...o }); S('circle', { r: 34, fill: col }, a); S('circle', { cx: -10, cy: -10, r: 9, fill: '#fff', opacity: .35 }, a);
      if (lab) K.tx(a, 0, 3, lab, { size: 30, fill: C.ink, weight: 800, deco: true }); return a; };
    function hourglass(g, x, y, s, level, o = {}) { // level(t) in 0..1 = share of carbon 14 still there (top bulb)
      const h = G(g, x, y, { s, ...o });
      S('rect', { x: -130, y: -190, width: 260, height: 30, rx: 12, fill: '#8B5E34' }, h); S('rect', { x: -130, y: 160, width: 260, height: 30, rx: 12, fill: '#8B5E34' }, h);
      S('path', { d: 'M -110 -160 L 110 -160 Q 110 -60 14 -6 L 14 6 Q 110 60 110 160 L -110 160 Q -110 60 -14 6 L -14 -6 Q -110 -60 -110 -160 Z', fill: '#bfefff', 'fill-opacity': .14, stroke: '#e8f6ff', 'stroke-width': 8 }, h);
      const top = S('path', { fill: C.amber }, h), bot = S('path', { fill: C.amber, 'fill-opacity': .35 }, h), stream = S('rect', { x: -4, y: 0, width: 8, height: 150, fill: C.amber }, h);
      K.fx(t => { const f = FRAMING ? 1 : K.clamp(level(t)); const yy = -150 * Math.sqrt(f), w = 200 * Math.sqrt(f) * .92;
        top.setAttribute('d', f > .01 ? `M ${-w / 2} ${yy} L ${w / 2} ${yy} Q ${w / 3} ${yy / 3} 6 -4 L -6 -4 Q ${-w / 3} ${yy / 3} ${-w / 2} ${yy} Z` : 'M 0 0');
        const hb = 120 * Math.sqrt(1 - f); bot.setAttribute('d', `M -96 156 L 96 156 L ${hb * .45} ${156 - hb} L ${-hb * .45} ${156 - hb} Z`);
        const flowing = o.drain && t > o.drain && f > .02; stream.setAttribute('visibility', flowing ? 'visible' : 'hidden'); });
      return h; }
    const bone = (g, x, y, s, o = {}) => { const b = G(g, x, y, { s, ...o }); S('path', { d: 'M -150 -18 L 150 -18 L 150 18 L -150 18 Z', fill: '#E7DCC4' }, b);
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) S('circle', { cx: sx * 160, cy: sy * 26, r: 32, fill: '#E7DCC4' }, b); return b; };
    const rock = (g, x, y, s, o = {}) => { const r = G(g, x, y, { s, ...o }); S('path', { d: 'M -70 40 L -80 -10 L -30 -50 L 40 -44 L 80 0 L 60 40 Z', fill: '#7C8AA5' }, r);
      S('path', { d: 'M -30 -50 L 40 -44 L 10 -10 Z', fill: '#fff', opacity: .15 }, r); return r; };
    /* ================= s1 : a man in the ice ================= */
    const g1 = k.room('glacier', '#1D3D6E', { decor: 'outdoor', seed: 1 });
    for (const [x, w, hh] of [[-620, 520, 420], [-150, 640, 560], [420, 560, 460]]) { S('path', { d: `M ${x - w / 2} ${FLOOR} L ${x} ${FLOOR - hh} L ${x + w / 2} ${FLOOR} Z`, fill: '#2B4C8C' }, g1);
      S('path', { d: `M ${x - w * .16} ${FLOOR - hh * .68} L ${x} ${FLOOR - hh} L ${x + w * .16} ${FLOOR - hh * .68} L ${x + w * .05} ${FLOOR - hh * .6} L ${x - w * .06} ${FLOOR - hh * .66} Z`, fill: '#E8F4FF' }, g1); }
    const ice = G(g1, -120, 120); S('rect', { x: -330, y: -110, width: 660, height: 230, rx: 40, fill: '#bfefff', 'fill-opacity': .35, stroke: '#e8f6ff', 'stroke-width': 8 }, ice);
    const sil = G(ice, 0, 0, { fin: [T('c1', 'homme'), .8] }); // dashed silhouette: a real person, drawn with restraint
    S('path', { d: 'M -230 10 Q -250 -30 -205 -40 Q -160 -46 -150 -10 L 160 -30 Q 230 -32 240 0 Q 235 30 160 26 L -150 34 Q -200 50 -230 10 Z', fill: '#0B1A3A', 'fill-opacity': .35, stroke: '#0B1A3A', 'stroke-width': 6, 'stroke-dasharray': '18 12' }, sil);
    const axe = G(ice, 150, -70, { fin: [T('c1', 'longtemps'), .5] }); S('rect', { x: -6, y: -40, width: 12, height: 80, rx: 5, fill: '#8B5E34', transform: 'rotate(-30)' }, axe); S('path', { d: 'M 6 -44 L 40 -54 L 40 -24 Z', fill: '#C77D3A', transform: 'rotate(-30)' }, axe);
    const yr = k.label(g1, -560, -300, '1991', { pop: T('c1', 'septembre'), out: T('c3', 'pas'), size: 76, col: C.cyan });
    const hero = k.hero(g1, 980, { s: 1.45, dir: -1 }); hero.pop(T('c1', 'homme') - .2).walk(T('c1', 'homme'), 1.3, 470).pose(T('c1', 'combien'), 1.6, 'loupe').expr(T('c1', 'combien'), 'worried').look(T('c1', 'homme'), -120, 100);
    const q1 = k.suspense(g1, -120, -150, T('c1', 'combien'), T('c2', null) + .4);
    const foe = k.foe(g1, -1100, { s: 1.4, dir: 1, mask: false }); foe.pop(cue('c2').start - .3).walk(cue('c2').start - .3, .9, -760).pose(T('c2', 'tout') - .3, 1.0, 'cheer');
    const tout = [bone(g1, -540, -200, .55, { pop: T('c2', 'carbone') }), rock(g1, -330, -260, .9, { pop: T('c2', 'date') }), G(g1, -740, -280, { pop: T('c2', 'tout') - .1 })];
    S('path', { d: 'M -40 50 L 40 50 L 30 -30 Q 50 -60 0 -60 Q -50 -60 -30 -30 Z', fill: '#C77D3A' }, tout[2]);
    for (const o of tout) o._a.o.out = T('c3', 'mais');
    const xs = tout.slice(0, 2).map((o, i) => { const c = G(g1, [-540, -330][i], [-200, -260][i], { pop: T('c3', 'pas') + i * .15, out: T('c3', 'mais') }); ico('cross', c, 0, 0, 1, C.rose).setAttribute('transform', 'scale(1.1)'); return c; });
    K.ev(T('c3', 'pas'), 'myth');
    hero.pose(T('c3', 'pas'), 1.0, 'shrug').expr(T('c3', 'pas'), 'neutral').pose(T('c3', 'lui'), 1.0, 'point', { x: -120, y: 100 }).expr(T('c3', 'horloge'), 'happy');
    foe.expr(T('c3', 'pas'), 'worried').walk(T('c3', 'lui'), 1.0, -1250).out(T('c3', 'horloge'));
    const hg1 = hourglass(g1, -120, -230, .75, () => 1, { pop: T('c3', 'corps') });
    K.cam(0, 0, Z.glacier[0] + 200, Z.glacier[1] - 760, 1.15); F(.3, 3.6, [g1._room], .9, { focus: false }); // opening tilt down from the sky K.focus(0, ice); // slow opening drift
    F(T('c1', 'homme') - .4, 1.1, [ice], .62, { focus: false }); K.focus(T('c1', 'homme'), ice);
    F(T('c1', 'combien') - .3, .8, [ice, hero], .78, { focus: false }); K.focus(T('c1', 'combien'), q1);
    F(cue('c2').start - .2, .9, [foe, ...tout], .7, { focus: false }); K.focus(T('c2', 'carbone'), tout[0]);
    F(T('c3', 'lui') - .3, .9, [ice, hg1], .7, { focus: false }); K.focus(T('c3', 'corps'), hg1);
    K.hot({ x: Z.glacier[0] - 120, y: Z.glacier[1] - 20, at: cue('c1').start, until: cue('c3').end, title: 'Ötzi', html: '<p>Momie découverte en septembre 1991 sur le Hauslabjoch (Alpes de l\'Ötztal). Datée par spectrométrie de masse par accélérateur (AMS) à Zurich (ETH) et à Oxford.</p><p class="src">Bonani et al. 1994, <i>Radiocarbon</i> 36(2), 247-250.</p>' });
    /* ================= s2 : where carbon 14 comes from ================= */
    const g2 = k.room('ciel', '#16306B', { decor: 'outdoor', seed: 2 }); const s2 = k.sc('s2');
    const rays = [0, 1, 2].map(i => k.arrow(g2, -820 + i * 120, -560, -470 + i * 60, -260 + i * 20, { t: T('c4', 'rayons') + i * .2, col: C.violet, sw: 12, out: T('c5', 'plantes') }));
    const N = [0, 1, 2].map(i => atom(g2, -460 + i * 140, -230 + (i % 2) * 90, C.cyan, 'N', { pop: T('c4', 'azote') + i * .12, out: T('c5', 'plantes') }));
    const c14 = atom(g2, -180, -140, C.amber, '14', { pop: T('c4', 'changent'), moves: [[T('c4', 'changent'), .01, { s: 2.2 }]], out: T('c5', 'plantes') }); K.ev(T('c4', 'changent'), 'impact');
    N[2]._a.o.out = T('c4', 'changent');
    const rare = G(g2, 360, -230, { pop: T('c5', 'rare'), out: T('c5', 'plantes') + .4 });
    for (let i = 0; i < 40; i++) { const col = i === 27 ? C.amber : '#5B6B8C'; S('circle', { cx: (i % 10) * 64 - 290, cy: Math.floor(i / 10) * 64 - 96, r: 24, fill: col }, rare); }
    const lab1 = k.label(g2, 360, 70, '1 sur 1 000 000 000 000', { pop: T('c5', 'mille'), out: T('c5', 'plantes') + .4, size: 52, col: C.amber, mono: true });
    const plant = I('plant', g2, -420, FLOOR - 70, 2.4, C.green, { pop: T('c5', 'plantes') });
    const co2 = k.arrow(g2, -420, -320, -420, -170, { t: T('c5', 'absorbent') - .2, col: C.amber, sw: 10, out: T('c6', 'mort') });
    const eater = I('person', g2, 80, FLOOR - 90, 2.2, C.green, { pop: T('c5', 'mangent') - .2 });
    const eat = k.arrow(g2, -300, FLOOR - 120, -40, FLOOR - 120, { t: T('c5', 'mangent'), col: C.green, sw: 10, out: T('c6', 'mort') });
    const hg2 = hourglass(g2, 470, -110, .85, () => 1, { pop: T('c6', 'sablier') - .3 });
    const refill = G(g2, 470, -330, { pop: T('c6', 'reprend'), fn: (s, t) => { s.y += AMBIENT ? 10 * Math.sin(t * 6) : 0; } });
    for (let i = 0; i < 3; i++) S('circle', { cx: -40 + i * 40, cy: 0, r: 14, fill: C.amber }, refill);
    const stop = G(g2, 470, -330, { pop: T('c6', 'mort') }); ico('cross', stop, 0, 0, 1, C.rose).setAttribute('transform', 'scale(1.3)'); refill._a.o.out = T('c6', 'mort');
    I('person', g2, 80, FLOOR - 90, 2.2, '#5B6B8C', { fin: [T('c6', 'mort'), .6] }); eater._a.o.out = T('c6', 'mort');
    const hero2 = k.hero(g2, -820, { s: 1.35 }); hero2.pop(T('c5', 'plantes') - .5).walk(T('c5', 'plantes') - .3, 1.0, -720).pose(T('c6', 'vit'), 1.0, 'point', { x: 470, y: -110 }).pose(T('c6', 'mort') + .3, 1.0, 'nod').look(T('c5', 'mangent'), 80, 0);
    F(s2 - 1.4, 1.5, [g2._room], .95, { focus: false }); K.focus(s2, rays[1]);
    F(T('c4', 'azote') - .4, .9, [...N, c14, rays[2]], .66, { focus: false }); K.focus(T('c4', 'changent'), c14);
    F(T('c5', 'rare') - .3, .8, [rare, lab1], .7, { focus: false }); K.focus(T('c5', 'mille'), lab1);
    F(T('c5', 'plantes') - .2, .9, [plant, eater, co2], .72, { focus: false }); K.focus(T('c5', 'mangent'), eater);
    F(T('c6', 'sablier') - .4, .9, [hg2, eater, refill], .74, { focus: false }); K.focus(T('c6', 'sablier'), hg2); K.focus(T('c6', 'mort'), stop);
    K.hot({ x: Z.ciel[0] - 260, y: Z.ciel[1] - 160, at: s2, until: cue('c6').end, title: 'Formation', html: '<p>Réaction : azote 14 + neutron → carbone 14 + proton, dans la haute atmosphère (neutrons produits par les rayons cosmiques). Abondance : ~1,2 atome de carbone 14 pour 10<sup>12</sup> atomes de carbone.</p><p class="src">LNHB/CEA, table C-14 ; cours WHOI.</p>' });
    /* ================= s3 : the hourglass empties ================= */
    const g3 = k.room('temps', '#2A2F6E', { decor: 'void', seed: 3 }); const s3 = k.sc('s3');
    const tH = [T('c8', 'moitie'), R('c8'), T('c8', 'huitieme'), T('c8', 'seizieme')];
    const lvl = t => { let f = 1; const steps = [[tH[0], .5], [tH[1], .25], [tH[2], .125], [tH[3], .0625]]; for (const [a, v] of steps) f = Math.min(f, K.lerp(f, v, E.ioc(P(t, a, .9)))); return f; };
    const hg3 = hourglass(g3, -470, -60, 1.25, lvl, { drain: T('c7', 'puis') });
    const flips = G(g3, -470, -60, { s: 1.25, pop: T('c7', 'azote'), out: tH[0] });
    for (let i = 0; i < 6; i++) { const d = S('circle', { cx: -60 + i * 24, cy: -110 + (i % 2) * 22, r: 10, fill: C.amber }, flips);
      K.fx(t => d.setAttribute('fill', t > T('c7', 'chance') + i * .45 && i % 2 === 0 ? C.cyan : C.amber)); K.mark(T('c7', 'chance') + i * .45); }
    const nlab = k.label(g3, -470, -400, '14C → 14N', { pop: T('c7', 'azote'), out: T('c7', 'rythme'), size: 56, col: C.cyan, mono: true });
    const fixe = k.label(g3, -470, -400, 'même chance, chaque année', { pop: T('c7', 'rythme') + .1, out: tH[0], size: 50, col: C.amber });
    const bars = k.bars(g3, 420, 150, { pop: tH[0] - .6, t0: tH[0] - .4, stagger: .01, max: 1, h: 380, w: 860, lsize: 40,
      lsize: 52, vals: [{ v: 1, label: '0', col: C.amber }, { v: .5, label: '5 700', col: C.amber, top: '½' }, { v: .25, label: '11 400', col: C.amber, top: '¼' }, { v: .125, label: '', col: C.amber, top: '⅛' }, { v: .0625, label: '', col: C.amber, top: '1/16' }] });
    // reveal bars one by one: hide the later ones until their word (bars() grows all from t0; mask with covers that fade)
    const covers = [2, 3, 4].map((i, j) => { const cv = S('rect', { x: 420 - 430 + i * 172 + 4, y: 150 - 470, width: 164, height: 470, fill: '#2A2F6E' }, g3); K.A(cv, { out: [R('c8'), tH[2], tH[3]][j], outd: .3 }); return cv; });
    const ans = G(g3, 420 + 2 * 172 + 40, 200, { pop: tH[0], out: cue('c9').end }); K.tx(ans, 0, 0, 'ans →', { size: 52, fill: C.muted, weight: 700, axis: true });
    const q3 = k.suspense(g3, 420 - 430 + 2.5 * 172, -40, T('c8', 'devinez'), R('c8'));
    const hero3 = k.hero(g3, -980, { s: 1.35 }); hero3.pop(s3 - .4).walk(s3 - .3, 1.0, -880).pose(tH[0], 1.0, 'point', { x: 0, y: 0 }).expr(T('c8', 'devinez'), 'worried').expr(R('c8'), 'surprise')
      .pose(T('c9', 'compter'), 1.4, 'loupe').expr(T('c9', 'vide'), 'happy').walk(T('c9', 'compter') - .6, .8, -760);
    F(s3 - 1.4, 1.5, [g3._room], .95, { focus: false }); K.focus(s3, hg3);
    F(T('c7', 'azote') - .3, .9, [hg3, nlab], .62, { focus: false }); K.focus(T('c7', 'azote'), flips);
    F(T('c7', 'rythme') - .3, .8, [hg3, fixe], .7, { focus: false }); F(T('c7', 'rythme') + .6, 2.6, [hg3, fixe], .84, { focus: false }); K.focus(T('c7', 'rythme'), fixe);
    F(tH[0] - .5, .9, [hg3, bars], .86, { focus: false }); K.focus(tH[0], bars);
    F(T('c8', 'devinez') - .2, .7, [bars, q3], .7, { focus: false }); K.focus(T('c8', 'devinez'), q3); K.focus(R('c8'), bars);
    F(T('c9', 'compter') - .3, .9, [hg3, hero3], .7, { focus: false }); K.focus(T('c9', 'compter'), hg3);
    K.hot({ x: Z.temps[0] + 420, y: Z.temps[1] - 330, at: s3, until: cue('c9').end, title: 'Demi-vie', html: '<p>Carbone 14 → azote 14 par désintégration bêta moins. Demi-vie évaluée : 5 700 ± 30 ans (LNHB/CEA). Les âges « conventionnels » publiés utilisent encore par convention la demi-vie de Libby, 5 568 ans (Stuiver &amp; Polach 1977) ; la calibration absorbe l\'écart.</p>' });
    /* ================= s4 : the lab report ================= */
    const g4 = k.room('labo', '#1F3A6E', { decor: 'lab', seed: 4 }); const s4 = k.sc('s4');
    const tube = G(g4, -150, -260); S('rect', { x: -620, y: -50, width: 1240, height: 100, rx: 50, fill: C.p2, stroke: C.cyan, 'stroke-width': 8 }, tube);
    S('circle', { cx: 640, cy: 0, r: 80, fill: C.p1, stroke: C.cyan, 'stroke-width': 8 }, tube);
    for (let i = 0; i < 7; i++) { const d = S('circle', { r: 16, fill: i === 3 ? C.amber : C.cyan }, tube); const t0 = T('c10', 'compte') + i * .25;
      K.fx(t => { const p = FRAMING ? .5 : ((t - t0) / 1.6) % 1; d.setAttribute('cx', -580 + 1220 * Math.max(0, p)); d.setAttribute('cy', 0); d.setAttribute('visibility', t > t0 && t < cue('c10').end + .5 ? 'visible' : 'hidden'); }); }
    K.mark(T('c10', 'compte'));
    const zh = k.label(g4, -600, -460, 'ETH Zurich', { pop: T('c10', 'zurich'), out: cue('c10').end, size: 50, col: C.cyan });
    const ox = k.label(g4, 250, -460, 'Oxford', { pop: T('c10', 'oxford'), out: cue('c10').end, size: 50, col: C.cyan });
    const mg = G(g4, 600, 40, { pop: T('c10', 'milligramme'), out: cue('c10').end + .3 }); S('rect', { x: -110, y: 40, width: 220, height: 24, rx: 10, fill: C.muted }, mg); S('circle', { cx: 0, cy: 28, r: 9, fill: '#E7DCC4' }, mg);
    K.tx(mg, 0, -40, '≈ 1 mg', { size: 60, fill: C.text, weight: 800 });
    const rep = k.card(g4, -150, -40, { head: 'Rapport · ETH-8342', value: 'os     4560 ± 65 BP', note: 'BP = avant 1950', col: C.amber, w: 1100 }, cue('c11').start - .2, T('c11', 'os'), T('c12', 'mille'));
    const today = k.label(g4, 520, -400, 'avant aujourd\'hui ?', { pop: T('c12', 'aujourdhui') - .3, out: T('c12', 'faux') + .4, size: 60, col: C.rose });
    const strike = S('rect', { x: 520 - 320, y: -404, width: 640, height: 10, rx: 5, fill: C.rose }, g4); K.A(strike, { fin: [T('c12', 'faux'), .2], out: T('c12', 'faux') + .4 }); K.ev(T('c12', 'faux'), 'myth');
    const marge = S('rect', { x: -150 - 550 + 330, y: -40 - 20 - 42, width: 230, height: 84, rx: 16, fill: 'none', stroke: C.rose, 'stroke-width': 8 }, g4); K.A(marge, { fin: [T('c12', 'marge'), .3] });
    const hero4 = k.hero(g4, -980, { s: 1.35 }); hero4.pop(s4 - .2).walk(s4, 1.0, -840).pose(T('c11', 'ligne'), 1.0, 'point', { x: -150, y: -40 }).pose(T('c12', 'faux'), .9, 'shrug').pose(T('c12', 'marge'), 1.0, 'point', { x: -200, y: -60 }).expr(T('c12', 'mille'), 'happy');
    F(s4 - 1.4, 1.5, [g4._room], .95, { focus: false }); K.focus(s4, tube);
    F(T('c10', 'compte') - .4, .9, [tube, zh, ox], .78, { focus: false }); K.focus(T('c10', 'compte'), tube);
    F(T('c10', 'milligramme') - .4, .8, [mg], .5, { focus: false }); K.focus(T('c10', 'milligramme'), mg);
    F(cue('c11').start - .1, .9, [rep], .82, { focus: false }); K.focus(cue('c11').start, rep);
    F(T('c11', 'os') - .2, .7, [rep._v], .66, { focus: false, zmax: 2.2 }); K.focus(T('c11', 'os'), rep._v);
    F(T('c12', 'aujourdhui') - .5, .8, [rep, today], .86, { focus: false }); K.focus(T('c12', 'aujourdhui'), today);
    F(T('c12', 'mille') - .3, .7, [rep], .9, { focus: false }); K.focus(T('c12', 'mille'), rep._n);
    F(T('c12', 'marge') - .3, .8, [rep], .8, { focus: false }); K.focus(T('c12', 'marge'), marge);
    K.hot({ x: Z.labo[0] - 150, y: Z.labo[1] - 260, at: s4, until: cue('c12').end, title: 'Toutes les mesures', html: '<pre>ETH-8345.1a  tissu  4605 ± 65 BP  1,0 mg\nETH-8345.1b  tissu  4500 ± 70 BP  1,3 mg\nETH-8345.1   tissu  4585 ± 70 BP  1,2 mg\nETH-8345.2   tissu  4515 ± 70 BP  1,6 mg\nETH-8342     os     4560 ± 65 BP  1,0 mg\nETH-8345.3   herbe  4535 ± 60 BP  0,9 mg\nmoyenne pondérée     4550 ± 27 BP</pre><p>Marges à 1 σ (≈ 68 %). Âges normalisés à δ13C = −25 ‰.</p><p class="src">Bonani et al. 1994, tables 1 et 2.</p>' });
    /* ================= s5 : calibrate ================= */
    const g5 = k.room('arbres', '#183A5E', { decor: 'outdoor', seed: 0 }); const s5 = k.sc('s5');
    const lv = [.75, 1, .85]; const hgs = lv.map((v, i) => hourglass(g5, -560 + i * 260, -120, .55, () => v, { pop: cue('c13').start + i * .3, out: T('c14', 'corrige') }));
    const trunk = G(g5, -560, -100, { pop: T('c14', 'cernes') - .2 });
    for (let r = 9; r >= 1; r--) { const c = S('circle', { r: r * 26, fill: r % 2 ? '#B7854F' : '#9C6B3C' }, trunk); K.A(c, { fin: [T('c14', 'cernes') + (9 - r) * .08, .2] }); }
    const ring = S('circle', { cx: 0, cy: 0, r: 182, fill: 'none', stroke: C.amber, 'stroke-width': 10 }, trunk); K.A(ring, { fin: [T('c14', 'annee'), .3] });
    const yrl = k.label(g5, -560, 220, '1 cerne = 1 année', { pop: T('c14', 'annee'), size: 60, col: C.amber, out: cue('c15').start + .2 });
    const ch = G(g5, 330, -60, { pop: T('c14', 'courbe') - .4 });
    S('path', { d: 'M -420 260 L 420 260 M -420 260 L -420 -300', stroke: C.muted, 'stroke-width': 6, fill: 'none' }, ch);
    K.tx(ch, 0, 320, 'année réelle (av. J.-C.)', { size: 52, fill: C.muted, weight: 600, axis: true }); K.tx(ch, -440, -340, 'âge BP', { size: 52, fill: C.muted, weight: 600, anchor: 'start', axis: true });
    const pts = []; for (let i = 0; i <= 60; i++) { const x = -400 + i * 13.33; const y = 180 - i * 6.5 + 60 * Math.sin(i / 3.2) * (i > 15 && i < 50 ? 1 : .4); pts.push([x.toFixed(1), y.toFixed(1)]); }
    k.curve(ch, pts, { t0: T('c14', 'courbe'), dur: 1.4, col: C.violet, sw: 10 });
    const band = S('rect', { x: -420, y: -32, width: 840, height: 34, fill: C.amber, 'fill-opacity': .35 }, ch); K.A(band, { fin: [T('c15', 'quatre'), .4] });
    const bl = G(ch, -420, -15, { pop: T('c15', 'quatre'), out: R('c15') }); K.tx(bl, -20, 0, '4550', { size: 46, fill: C.amber, weight: 800, anchor: 'end', mono: true });
    const ivA = G(ch, 150, 220, { fin: [R('c15'), .4] }); S('rect', { x: -150, y: -16, width: 300, height: 32, rx: 12, fill: C.violet }, ivA); K.tx(ivA, 0, -60, '66 %', { size: 54, fill: C.text, weight: 800 });
    const ivB = G(ch, -150, 220, { fin: [R('c15') + .5, .4] }); S('rect', { x: -60, y: -16, width: 120, height: 32, rx: 12, fill: C.violet, 'fill-opacity': .6 }, ivB); 
    for (const x of [150, -150]) { const dl = S('path', { d: `M ${x} -15 L ${x} 205`, stroke: C.amber, 'stroke-width': 5, 'stroke-dasharray': '12 10' }, ch); K.A(dl, { fin: [R('c15') - .1, .3] }); }
    const q5 = k.suspense(g5, 330, -460, T('c15', 'devinez'), R('c15'));
    const dates = k.label(g5, 330, -440, '3239 – 3105 av. J.-C.', { pop: T('c15', 'trois', 1), size: 50, col: C.violet, mono: true });
    const hero5 = k.hero(g5, -980, { s: 1.35 }); hero5.pop(s5 - .3).walk(s5 - .2, 1.0, -880).pose(T('c13', 'varie'), 1.0, 'shrug').expr(T('c13', 'varie'), 'worried').pose(T('c14', 'cernes'), 1.2, 'loupe').expr(T('c14', 'cernes'), 'neutral').pose(R('c15'), 1.0, 'point', { x: 330, y: 160 }).expr(R('c15'), 'surprise');
    F(s5 - 1.4, 1.5, [g5._room], .95, { focus: false }); K.focus(s5, hgs[1]);
    F(T('c13', 'carbone') - .2, .9, hgs, .66, { focus: false }); K.focus(T('c13', 'varie'), hgs[1]);
    F(T('c14', 'cernes') - .4, .9, [trunk, yrl], .62, { focus: false }); K.focus(T('c14', 'cernes'), trunk);
    F(T('c14', 'courbe') - .4, .9, [trunk, yrl, ch], .92, { focus: false }); K.focus(T('c14', 'courbe'), ch);
    F(T('c15', 'devinez') - .3, .8, [ch, q5], .82, { focus: false }); K.focus(T('c15', 'devinez'), q5); K.focus(R('c15'), ivA);
    F(T('c15', 'trois', 1) - .3, .8, [ch, dates], .86, { focus: false }); K.focus(T('c15', 'trois', 1), dates);
    K.hot({ x: Z.arbres[0] + 330, y: Z.arbres[1] - 360, at: s5, until: cue('c15').end + 1, title: 'Calibration', html: '<p>Calibration publiée en 1994 (courbe de 1993) pour 4550 ± 27 BP, à 95 % : 3359–3294 av. J.-C. (33 %), 3277–3268 (1 %), 3239–3105 (66 %). La courbe actuelle s\'appelle IntCal20 (Reimer et al. 2020) : cernes d\'arbres jusqu\'à ~13 900 ans, puis sédiments, spéléothèmes, coraux, jusqu\'à 55 000 ans. La courbe dessinée ici est schématique.</p>' });
    /* ================= s6 : limits ================= */
    const g6 = k.room('limites', '#2B2A5E', { decor: 'void', seed: 5 }); const s6 = k.sc('s6');
    const foe6 = k.foe(g6, -1100, { s: 1.4, dir: 1, mask: false }); foe6.pop(s6 - .4).walk(s6 - .3, 1.0, -700).pose(T('c16', 'dinosaure') - .3, 1.0, 'cheer').expr(T('c17', 'impossible'), 'worried');
    const dbone = bone(g6, -330, -200, .9, { pop: T('c16', 'datons') });
    const ax = G(g6, 360, 40, { pop: T('c17', 'impossible') - .2 });
    S('path', { d: 'M -380 200 L 420 200 M -380 200 L -380 -260', stroke: C.muted, 'stroke-width': 6, fill: 'none' }, ax);
    const noise = S('rect', { x: -380, y: 150, width: 800, height: 50, fill: C.muted, 'fill-opacity': .35 }, ax); K.A(noise, { fin: [T('c17', 'trop'), .4] });
    K.fx(t => noise.setAttribute('y', (150 + (AMBIENT ? 4 * Math.sin(t * 13) : 0)).toFixed(1)));
    const dpts = []; for (let i = 0; i <= 40; i++) { const x = -380 + i * 20; dpts.push([x, (200 - 440 * Math.pow(.5, i / 4.6)).toFixed(1)]); }
    k.curve(ax, dpts, { t0: T('c17', 'cinquante') - .8, dur: 1.4, col: C.amber, sw: 10 });
    const lim = G(ax, 300, 0, { pop: T('c17', 'cinquante') }); S('path', { d: 'M 0 200 L 0 -240', stroke: C.rose, 'stroke-width': 6, 'stroke-dasharray': '14 10' }, lim); K.tx(lim, 0, -280, '≈ 50 000 ans', { size: 54, fill: C.rose, weight: 800 });
    const nl = k.label(g6, 260, -430, 'bruit de mesure', { pop: T('c17', 'trop'), size: 46, col: C.muted, out: T('c17', 'dinosaures') });
    const far66 = k.label(g6, 260, -430, '66 millions d\'années →', { pop: T('c17', 'dinosaures'), size: 50, col: C.rose });
    const clocks = [0, 1].map(i => I('clock', g6, -330 + i * 200, -390, 1.3, C.green, { pop: T('c17', 'horloges') + i * .2 }));
    K.ev(T('c17', 'impossible'), 'myth');
    const hero6 = k.hero(g6, 980, { s: 1.35, dir: -1 }); hero6.pop(T('c17', 'impossible') - .6).walk(T('c17', 'impossible') - .5, .9, 860).pose(T('c17', 'impossible'), .9, 'shrug').pose(T('c17', 'horloges'), 1.0, 'point', { x: -230, y: -390 }).expr(T('c17', 'horloges'), 'happy');
    foe6.pose(T('c17', 'horloges') + .4, .8, 'nod');
    F(s6 - 1.4, 1.5, [g6._room], .95, { focus: false });
    F(cue('c16').start - .2, .8, [foe6, dbone], .62, { focus: false }); K.focus(T('c16', 'dinosaure'), dbone);
    F(T('c17', 'impossible') - .3, .9, [ax, lim], .8, { focus: false }); K.focus(T('c17', 'cinquante'), lim);
    F(T('c17', 'dinosaures') - .3, .9, [dbone, ...clocks, far66], .82, { focus: false }); K.focus(T('c17', 'horloges'), clocks[0]);
    K.hot({ x: Z.limites[0] + 360, y: Z.limites[1] - 100, at: s6, until: cue('c17').end, title: 'Pourquoi 50 000 ans', html: '<p>Après ~9 demi-vies, il reste moins de 1/500 du carbone 14 de départ : le signal rejoint le bruit de fond (contamination, machine). Limite pratique selon les labos : environ 40 000 à 60 000 ans. Les dinosaures non aviens (~66 Ma, Renne et al. 2013) sont datés par 40Ar/39Ar dans des roches volcaniques.</p>' });
    /* ================= s7 : read a date ================= */
    const g7 = k.room('fin', '#1D3D6E', { decor: 'outdoor', seed: 2 }); const s7 = k.sc('s7');
    const ice7 = G(g7, -380, 120, { pop: s7 - .6, out: T('c19', 'devant') }); S('rect', { x: -260, y: -90, width: 520, height: 180, rx: 34, fill: '#bfefff', 'fill-opacity': .35, stroke: '#e8f6ff', 'stroke-width': 7 }, ice7);
    S('path', { d: 'M -180 8 Q -196 -24 -160 -32 Q -126 -36 -118 -8 L 126 -24 Q 180 -26 188 0 Q 184 24 126 20 L -118 26 Q -158 40 -180 8 Z', fill: '#0B1A3A', 'fill-opacity': .35, stroke: '#0B1A3A', 'stroke-width': 5, 'stroke-dasharray': '14 10' }, ice7);
    const tl = k.timeline(g7, 120, -280, { w: 1300, pop: s7 - .3, t0: T('c18', 'mort'), out: T('c19', 'devant'), lsize: 50, ticks: [[.02, '3300'], [.12, '3100 av. J.-C.'], [1, 'aujourd\'hui']] });
    const span = G(g7, 120, -280, { fin: [T('c18', 'vers'), .4], out: T('c19', 'devant') }); S('path', { d: 'M -610 -120 L 650 -120', stroke: C.amber, 'stroke-width': 8 }, span);
    K.tx(span, 20, -170, '+ de 5 000 ans', { size: 58, fill: C.amber, weight: 800 });
    const recap = [['4560 ± 65 BP', 'lisez', C.amber], ['calibrée ?', 'calibree', C.violet], ['< 50 000 ans', 'vecu', C.green]].map(([a, w, col], i) => {
      const r = G(g7, -560 + i * 560, -120, { pop: T('c19', w) }); S('rect', { x: -260, y: -160, width: 520, height: 320, rx: 30, fill: C.p1, stroke: col, 'stroke-width': 8 }, r);
      if (i === 0) { S('rect', { x: -200, y: -90, width: 400, height: 80, rx: 14, fill: C.paper }, r); S('rect', { x: -200, y: -90, width: 400, height: 24, rx: 10, fill: col }, r); }
      if (i === 1) S('path', { d: 'M -180 -20 C -120 -110 -80 0 -20 -70 S 80 -150 180 -110', fill: 'none', stroke: col, 'stroke-width': 12, 'stroke-linecap': 'round' }, r);
      if (i === 2) { const ic = ico('plant', r, 0, 0, 1, col); ic.setAttribute('transform', 'translate(0 -60) scale(1.3)'); }
      K.tx(r, 0, 90, a, { size: i === 0 ? 54 : 62, fill: col, weight: 800, mono: i === 0 }); return r; });
    const hero7 = k.hero(g7, 760, { s: 1.4, dir: -1 }); hero7.pop(s7 - .4).pose(T('c18', 'mort'), 1.0, 'point', { x: -380, y: 100 }).pose(T('c19', 'lisez'), .9, 'point', { x: -560, y: -120 })
      .pose(T('c19', 'calibree'), .9, 'point', { x: 0, y: -120 }).pose(T('c19', 'vecu'), .9, 'point', { x: 560, y: -120 }).pose(T('c20', 'savez'), 1.4, 'cheer').expr(T('c20', 'savez'), 'happy');
    const foe7 = k.foe(g7, -1100, { s: 1.3, dir: 1, mask: false, expr: 'neutral' }); foe7.pop(T('c20', 'realite') - .3).walk(T('c20', 'realite') - .2, 1.0, -900).pose(T('c20', 'savez'), 1.0, 'nod').expr(T('c20', 'savez'), 'happy');
    F(s7 - 1.4, 1.5, [ice7, tl], .9, { focus: false }); K.focus(s7, ice7);
    F(T('c18', 'vers') - .4, .8, [tl, span], .8, { focus: false }); K.focus(T('c18', 'vers'), span);
    F(cue('c19').start - .2, .9, [...recap], .9, { focus: false }); K.focus(T('c19', 'lisez'), recap[0]); K.focus(T('c19', 'calibree'), recap[1]); K.focus(T('c19', 'vecu'), recap[2]);
    F(cue('c20').start, 1.0, [...recap, hero7, foe7], .95, { focus: false }); K.focus(T('c20', 'savez'), hero7);
    /* ---- extra beats (beats.mjs: no window > 2.5 s without a visible change) ---- */
    const pu = k.pulse;
    F(T('c1', 'glacier') - .2, 1.0, [g1._room], .8, { focus: false }); pu(yr, T('c1', 'mort')); pu(yr, T('c1', 'quatre'));
    pu(ice, T('c3', 'oui')); pu(hg1, cue('c3').end - .3);
    pu(bars, T('c8', 'deux')); pu(bars, T('c8', 'fois') + .4); pu(q3, T('c8', 'reste'));
    pu(hg3, T('c9', 'reste')); hero3.pose(T('c9', 'lire'), .8, 'nod');
    pu(zh, T('c10', 'atomes')); pu(ox, T('c10', 'accelerateur')); hero4.pose(T('c10', 'precieuse'), .9, 'nod'); pu(mg, T('c10', 'precieuse') + .3);
    pu(rep, T('c11', 'quatre')); pu(rep, T('c11', 'plus') + .2); hero4.pose(T('c11', 'b'), .8, 'nod');
    hero4.pose(T('c12', 'croit'), .8, 'lean', { dir: 1 }); pu(rep, T('c12', 'cinquante'));
    pu(hgs[2], T('c13', 'siecles')); hero5.pose(T('c13', 'fil'), .8, 'nod'); pu(ch, T('c15', 'moyenne')); pu(ch, T('c15', 'seule')); pu(ivA, T('c15', 'trente')); pu(dates, T('c15', 'avant'));
    pu(ax, T('c17', 'reste')); pu(lim, T('c17', 'compter')); pu(far66, T('c17', 'millions')); pu(dbone, T('c17', 'datent'));
    const cal94 = k.label(g7, -300, -130, 'calibration 1994', { pop: T('c18', 'calibration'), out: T('c19', 'devant'), size: 58, col: C.violet }); pu(tl, T('c18', 'avant')); pu(cal94, T('c18', 'quatre')); pu(ice7, T('c18', 'plus'));
    pu(recap[0], T('c19', 'marge')); pu(recap[2], T('c19', 'objet'));
    pu(recap[0], T('c20', 'composition')); pu(recap[1], T('c20', 'labos'));
  },
};
