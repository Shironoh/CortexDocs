// s1 — an insider in the tower
cam.x = 0; cam.y = -350; cam.s = .68;
camTo(T('c1', 'travaille') - .4, 1.0, 300, -450, 1.1); camTo(CUE.c2.start, 1.2, 0, -350, .68);
// s2 — the ghost node
camTo(END('c3') - .4, 1.6, Z2x, -150, .62); camTo(T('c4', 'privees') - .4, .9, Z2x - 950, -100, 1.0); camTo(CUE.c5.start, 1.0, Z2x, -50, .6);
camTo(T('c5', 'diffuser') - .3, 1.0, Z2x, 150, .62); camTo(CUE.c6.start, 1.0, Z2x, 300, .95); camTo(CUE.c7.start, 1.0, Z2x, 150, .62);
// s3 — what you would see
camTo(END('c7') - .4, 1.6, Z3x - 200, -200, .62); camTo(T('c8', 'journal') - .4, 1.0, Z3x - 950, -150, .85);
camTo(CUE.c9.start, 1.0, Z3x + 450, -150, .8); camTo(CUE.c10.start, 1.0, Z3x + 450, -200, .8);
// s4 — Tailnet Lock
camTo(END('c10') - .4, 1.6, Z4x, -200, .6); camTo(T('c11', 'signent') - .5, 1.0, Z4x - 700, -300, .8);
camTo(T('c12', 'machine') - .3, 1.0, Z4x + 700, -250, .8); camTo(T('c12', 'tour') - .4, .9, Z4x - 500, -300, .75);
camTo(CUE.c13.start, 1.0, Z4x + 300, 60, .62); camTo(T('c13', 'desactiver') - .3, .9, Z4x - 300, -300, .8);
// s5 — the lock's limits
camTo(END('c13') - .4, 1.6, Z5x, -150, .62); camTo(CUE.c15.start, 1.0, Z5x + 300, -400, .85);
// s6 — recap
camTo(END('c15') - .4, 1.6, Z6x + 100, -60, .7); camTo(T('c19', 'propre') - .4, 1.0, Z6x + 700, -60, .6); camTo(CUE.c20.start, 1.4, Z6x + 350, -60, .58);
