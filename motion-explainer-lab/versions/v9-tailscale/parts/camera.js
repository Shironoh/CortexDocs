// s1 — the hacked workstation
cam.x = 0; cam.y = -100; cam.s = .62;
camTo(T('c1', 'tombe') - .6, .7, 760, -180, .85); camTo(T('c1', 'pendant') - .3, 1.2, -480, -80, .8);
camTo(T('c2', 'logiciel') - .3, 1.0, 0, -60, 1.05); camTo(T('c2', 'comment') - .3, 1.0, 0, -220, .72);
camTo(T('c3', 'cas') - .3, .9, 0, -260, .8);
// s2 — the tailnet and its tower
camTo(END('c3') - .4, 1.6, Z2x, -80, .55); camTo(T('c4', 'chacune') - .3, .9, Z2x - 850, -60, 1.0);
camTo(T('c5', 'tour') - .4, 1.0, Z2x + 100, -330, .9); camTo(T('c5', 'distribue') - .3, 1.0, Z2x + 60, -120, .58); camTo(T('c5', 'mais') - .3, .9, Z2x, 0, .62);
// s3 — direct or relayed
camTo(END('c5') - .4, 1.6, Z3x, -80, .62); camTo(T('c7', 'chiffre') - .3, 1.0, Z3x, -120, .8);
camTo(T('c8', 'relais') - .4, 1.0, Z3x, -400, .85); camTo(T('c8', 'transporte') - .2, 1.2, Z3x, -220, .7);
camTo(T('c9', 'devinez') - .3, 1.0, Z3x, -100, .9); camTo(REV('c9') + .6, 1.2, Z3x + 100, -330, .58);
// s4 — the workstation joins the attacker
camTo(END('c9') - .4, 1.6, Z4x - 750, -150, .8); camTo(T('c11', 'connecte') - .3, .9, Z4x - 500, -260, 1.0);
camTo(T('c11', 'rejoint') - .4, 1.2, Z4x + 200, -120, .62); camTo(CUE.c12.start, 1.0, Z4x + 600, -60, .8);
// s5 — three logs
camTo(END('c12') - .4, 1.6, Z5x, -80, .6); camTo(T('c14', 'journal') - .4, 1.0, Z5x - 700, -40, .95);
camTo(T('c15', 'flow') - .4, 1.0, Z5x, -40, .95); camTo(CUE.c16.start, 1.0, Z5x + 860, -40, .95);
camTo(T('c17', 'devinez') - .3, 1.0, Z5x - 300, -150, .62); camTo(T('c17', 'son') - .5, 1.0, Z5x + 1300, -200, .7); camTo(T('c17', 'seul') - .3, .9, Z5x + 860, -40, .95);
camTo(CUE.c18.start, 1.0, Z5x, -260, .78);
// s6 — searching the workstation
camTo(END('c18') - .4, 1.6, Z6x + 100, -200, .7); camTo(T('c20', 'commande') - .3, .9, Z6x + 380, -420, .95); camTo(T('c20', 'incident') - .3, .8, Z6x - 100, -200, .72);
camTo(CUE.c21.start, 1.4, Z6x + 1450, -100, .68);
// s7 — recap on the same workstation
camTo(END('c21') - .4, 1.8, Z7x - 150, 0, .8); camTo(T('c23', 'imposez') - .3, .9, Z7x, 0, .82); camTo(T('c23', 'obligatoire'), 1.2, Z7x - 300, -20, .7);
camTo(T('c24', 'activez') - .3, .9, Z7x + 150, 0, .8); camTo(T('c25', 'simplification') - .2, 1.6, Z7x, -60, .66);
