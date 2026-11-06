window.__CHARS = {
  thief: { canvas: 'rvThief', anchors: [[thiefA1, T('c1', 'pendant') - .3, END('c3') - .4, 1, .95], [thiefA2, T('c9', 'pratique') - .3, END('c9') - .3, -1, .9],
      [thiefA3, T('c11', 'rejoint') - .2, END('c12') - .2, -1, .95], [thiefA4, T('c21', 'danger') - .3, END('c21') - .3, 1, .9], [thiefA5, CUE.c22.start, T('c23', 'obligatoire') + 1.2, 1, .9]],
    params: t => { let mouth = .04; if (t >= CUE.c12.start && t < CUE.c12.end) mouth = mouthAt('c12', t);
      const eyes = blink(t, [5.5, 12.0, 19.4, 62.0, 78.0, 82.6, 151.0, 160.0]) * (1 - .4 * (ss(T('c12', 'cest') - .2, t) - ss(END('c12'), t)));
      const arm = ss(T('c1', 'garde') - .3, t) - ss(T('c2', 'comment'), t) + ss(T('c9', 'attaquant') - .3, t) - ss(END('c9') - .4, t)
        + ss(T('c12', 'appelle') - .4, t) - ss(END('c12') - .2, t) + ss(T('c21', 'cle') - .3, t) - ss(T('c21', 'volee') + .1, t);
      const lean = .1 + .35 * (ss(T('c1', 'garde'), t, .6) - ss(END('c3') - .5, t)) + .4 * (ss(T('c12', 'je'), t) - ss(END('c12'), t)) + .3 * (ss(T('c21', 'volee'), t) - ss(END('c21'), t));
      return { mouth, eyes, arm: Math.max(0, Math.min(1, arm)), lean }; } },
  hero: { canvas: 'rvHero', anchors: [[heroB1, T('c4', 'chacune') - .3, END('c5') - .3, 1, .95], [heroB2, CUE.c14.start, END('c18') - .3, 1, .95],
      [heroB3, CUE.c19.start - .2, END('c20') - .3, 1, 1.0], [heroB4, CUE.c22.start, 192, 1, .95]],
    params: t => { const eyes = blink(t, [28.0, 35.5, 90.0, 99.0, 106.0, 129.0, 137.0, 144.0, 160.0, 170.0, 182.0]);
      const surprised = ss(REV('c17'), t, .2) - ss(T('c17', 'seul'), t) + ss(T('c20', 'incident') - .2, t, .2) - ss(END('c20'), t);
      const arm = ss(T('c4', 'adresse') - .3, t) - ss(T('c5', 'tour'), t) + ss(T('c14', 'qui') - .3, t) - ss(T('c14', 'toujours'), t) + ss(T('c16', 'machine') - .3, t) - ss(END('c16') - .2, t)
        + ss(T('c18', 'refusees') - .3, t) - ss(END('c18') - .4, t) + ss(T('c19', 'cherche') - .3, t) - ss(T('c20', 'incident'), t)
        + ss(T('c22', 'alertez') - .3, t) - ss(END('c22') - .3, t) + ss(T('c23', 'imposez') - .3, t) - ss(END('c23') - .3, t) + ss(T('c24', 'activez') - .3, t) - ss(END('c24') - .3, t) + ss(T('c25', 'vous'), t);
      const lean = .2 * (ss(T('c5', 'distribue'), t) - ss(END('c5'), t)) - .25 * surprised + .2 * (ss(T('c19', 'cherche'), t) - ss(END('c20') - .4, t)) + .15 * ss(T('c25', 'vous'), t);
      return { mouth: .08 + .5 * surprised, eyes, arm: Math.max(0, Math.min(1, arm)), lean }; } },
};
