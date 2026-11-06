window.__CHARS = {
  thief: { canvas: 'rvThief', anchors: [[thiefA1, T('c1', 'travaille') - .4, END('c3') - .4, -1, .85], [thiefA2, T('c5', 'fantome'), END('c7') - .3, 1, .9], [thiefA3, CUE.c13.start + .2, T('c13', 'refuse') + .6, 1, .85]],
    params: t => { let mouth = .04; if (t >= CUE.c6.start && t < CUE.c6.end) mouth = mouthAt('c6', t);
      const eyes = blink(t, [4.2, 9.5, 15.8, 33.0, 44.5, 86.0]) * (1 - .4 * (ss(T('c13', 'non') - .1, t) - ss(T('c13', 'refuse') + .6, t)));
      const arm = ss(T('c1', 'travaille') - .2, t) - ss(T('c2', 'mais'), t) + ss(T('c6', 'jajoute') - .3, t) - ss(END('c7') - .4, t) + ss(T('c13', 'noeud') - .3, t) - ss(T('c13', 'non'), t);
      const lean = .1 + .35 * (ss(T('c1', 'travaille'), t, .6) - ss(END('c3') - .5, t)) + .4 * (ss(T('c6', 'je'), t) - ss(END('c6'), t)) - .3 * (ss(T('c13', 'non'), t) - ss(T('c13', 'refuse') + .6, t));
      return { mouth, eyes, arm: Math.max(0, Math.min(1, arm)), lean }; } },
  hero: { canvas: 'rvHero', anchors: [[heroB1, CUE.c9.start - .2, END('c10') - .3, 1, .95], [heroB2, CUE.c11.start, END('c13') - .3, 1, .95], [heroB3, CUE.c14.start, END('c15') - .3, 1, .95], [heroB4, CUE.c16.start, 157, 1, .95]],
    params: t => { const eyes = blink(t, [58.0, 66.0, 74.0, 81.0, 92.0, 99.0, 110.0, 118.0, 127.0, 140.0, 150.0]);
      const surprised = ss(T('c9', 'cle'), t, .2) - ss(END('c9') - .5, t) + ss(T('c14', 'couper'), t, .2) - ss(T('c14', 'et'), t);
      const arm = ss(T('c9', 'liste') - .3, t) - ss(T('c9', 'poste'), t) + ss(T('c10', 'comparant') - .3, t) - ss(END('c10') - .4, t) + ss(T('c12', 'verifie') - .3, t) - ss(T('c12', 'et'), t)
        + ss(T('c15', 'verifiez') - .3, t) - ss(END('c15') - .4, t) + ss(T('c16', 'activez') - .3, t) - ss(END('c16') - .3, t) + ss(T('c17', 'relevez') - .3, t) - ss(END('c17') - .3, t) + ss(T('c18', 'gardez') - .3, t) - ss(END('c18') - .3, t) + ss(T('c20', 'vous'), t);
      const lean = -.25 * surprised + .2 * (ss(T('c12', 'verifie'), t) - ss(T('c12', 'et'), t)) + .15 * ss(T('c20', 'vous'), t);
      return { mouth: .08 + .5 * surprised, eyes, arm: Math.max(0, Math.min(1, arm)), lean }; } },
};
