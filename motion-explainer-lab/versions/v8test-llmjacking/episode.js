/*META{"title":"LLMjacking","h1":"LLMjacking · comprendre et détecter (épisode 1)","eyebrow":"Motion explainer · test en conditions réelles · skill v7 · détection cloud","voice":{"cast":{"foe":{"voice":"fr_FR-tom-medium","ls":1.0}},"lexicon":{"token":"tôken","mandiant":"Mandiante","github":"Guite-heub","cloud":"claoude","trail":"tréil","azure":"Azur","access":"akssèsse","data":"déta","admin":"admine","activity":"aktiviti"}},"music":{"mood":"tense","key":"E"},"footer":"<p class='footer'>Test en conditions réelles du skill v7. Source principale : GTIG / Mandiant, <i>The Rise of LLMJacking</i>, Google Cloud Blog, 2 novembre 2026. Recoupé avec la documentation AWS (Bedrock et CloudTrail) et Google Cloud (Cloud Audit Logs, Service Usage, Agent Platform). Cas type composite construit à partir des incidents décrits. Fiche : research/llmjacking/SOURCES.md. Voix Piper, musique générée.</p>"}META*/
/* ---------- FICHE (skill v7) ----------
Audience : métier = détection / réponse à incident, praticien ; domaine = services LLM du cloud, novice (connaît les journaux cloud).
Doit savoir faire après : 1. alerter sur l'activation d'un service d'IA (EnableService ; PutUseCaseForModelAccess, CreateFoundationModelAgreement) ;
 2. savoir quel journal voit l'inférence selon le cloud et l'allumer (Data Access chez Google Cloud) + alerter sur la coupure de journalisation ;
 3. chasser les validations à 1 token et les pics d'erreurs de quota ; poser des plafonds.
Question centrale : à quel moment pouvait-on voir un LLMjacking, avant la facture ?
Inventaire (à l'écran tel quel) : google.api.serviceusage.v1.ServiceUsage.EnableService (Admin Activity) ; PutUseCaseForModelAccess ;
 CreateFoundationModelAgreement ; google.iam.v1.IAMPolicy.GetIamPolicy ; DeleteModelInvocationLoggingConfiguration ;
 google.cloud.aiplatform.v1.PredictionService.GenerateContent (Data Access, off) ; InvokeModel · Converse (CloudTrail, gestion) ;
 inputTokens / outputTokens ; max_tokens=1 ; ThrottlingException ; 100 000 $/jour ; 500 000 appels < 8 h ; ≈ 60 $/mois.
Métaphore système : l'usine à modèles, son compteur et ses caméras (les journaux) ; certaines caméras sont éteintes par défaut.
Idées reçues : « une clé volée se voit à son volume » (antagoniste) ; « on verra l'attaque dans les journaux ».
Devinez : les journaux voient-ils chaque appel ? ; combien d'appels en moins de 8 h ?
Termes nouveaux : s2 token ; s3 activation de service ; s4 journalisation des appels ; s5 Data Access ; s6 LLM Mixer.
------------------------------------ */
const EP = {
  bg: '#0B1A3A', lead: .6, tail: 2.2, spotDark: .25,
  zones: { facture: [0, 0], cle: [2300, 0], activation: [4600, 0], yeux: [6900, 0], visibilite: [9200, 0], mixer: [11500, 0], fin: [13800, 0] },
  legend: [['#FFB703', 'votre facture, vos ressources'], ['#EF476F', 'attaquant'], ['#22D3EE', 'détection'], ['#06D6A0', 'journal actif'], ['#94A3B8', 'journal éteint']],
  scenes: [{ id: 's1', title: '100 000 $ en un jour' }, { id: 's2', title: 'La clé et le test à 1 token' }, { id: 's3', title: 'L\'activation' },
    { id: 's4', title: 'Couper les caméras' }, { id: 's5', title: 'Qui voit l\'inférence ?' }, { id: 's6', title: 'Les LLM Mixers' }, { id: 's7', title: 'Vos trois réflexes' }],
  cues: [
    { id: 'c1', sc: 's1', sub: 'Lundi matin, la facture cloud du projet d\'IA affiche plus de 100 000 dollars. En une seule journée.', say: 'Lundi matin, la facture cloud du projet d\'IA affiche plus de cent mille dollars. En une seule journée.' },
    { id: 'c2', sc: 's1', sub: 'Pas du minage : du LLMjacking. Quelqu\'un consomme vos modèles de langage, et revend l\'accès.', say: 'Pas du minage : du L L M djaking. Quelqu\'un consomme vos modèles de langage, et revend l\'accès.' },
    { id: 'c3', sc: 's1', sub: 'Un cas type, tiré des incidents décrits par Mandiant. À quel moment pouvait-on le voir ?', say: 'Un cas type, tiré des incidents décrits par Mandiant. À quel moment pouvait-on le voir ?' },
    { id: 'c4', sc: 's2', sub: 'Tout commence par une clé : un compte de service exposé, un jeton GitHub, une session volée.', say: 'Tout commence par une clé : un compte de service exposé, un jeton GitHub, une session volée.' },
    { id: 'c5', sc: 's2', who: 'foe', sub: 'Une requête, un seul token. Personne ne verra rien.', say: 'Une requête, un seul token. Personne ne verra rien.' },
    { id: 'c6', sc: 's2', sub: 'Il valide les clés volées par des requêtes d\'un seul token, sous les seuils d\'alerte. Le volume ne vous préviendra pas.', say: 'Il valide les clés volées par des requêtes d\'un seul token, sous les seuils d\'alerte. Le volume ne vous préviendra pas.', breath: .8 },
    { id: 'c7', sc: 's3', sub: 'Souvent, le service d\'IA n\'était même pas activé. Alors il l\'active.', say: 'Souvent, le service d\'IA n\'était même pas activé. Alors il l\'active.' },
    { id: 'c8', sc: 's3', sub: 'Google Cloud : EnableService, dans le journal Admin Activity, toujours écrit. AWS : la demande d\'accès à un modèle.', say: 'Chez Google Cloud, l\'activation du service tombe dans le journal admin activity, toujours écrit. Chez A W S, c\'est la demande d\'accès à un modèle.' },
    { id: 'c9', sc: 's3', sub: 'Toute activation non prévue est un événement critique : votre meilleure alerte, car elle arrive avant la facture.', say: 'Toute activation non prévue est un événement critique : votre meilleure alerte, car elle arrive avant la facture.', breath: .8 },
    { id: 'c10', sc: 's4', who: 'foe', sub: 'Avant de consommer, je regarde si on m\'observe.', say: 'Avant de consommer, je regarde si on m\'observe.' },
    { id: 'c11', sc: 's4', sub: 'Il lit la politique d\'audit pour savoir si les journaux Data Access sont actifs, ou coupe la journalisation des appels au modèle.', say: 'Il lit la politique d\'audit pour savoir si les journaux data access sont actifs, ou coupe la journalisation des appels au modèle.' },
    { id: 'c12', sc: 's4', sub: 'Une coupure de journalisation par un compte qui n\'est pas votre pipeline d\'infrastructure : haute sévérité.', say: 'Une coupure de journalisation par un compte qui n\'est pas votre pipeline d\'infrastructure : haute sévérité.', breath: .8 },
    { id: 'c13', sc: 's5', sub: 'Devinez : vos journaux voient-ils chaque appel au modèle ?|Ça dépend. AWS : oui, par défaut. Google Cloud : non, l\'inférence est dans Data Access, éteint par défaut.', say: 'Devinez : vos journaux voient-ils chaque appel au modèle ? | Ça dépend. A W S : oui, par défaut. Google Cloud : non, l\'inférence est dans data access, éteint par défaut.' },
    { id: 'c14', sc: 's5', sub: 'Chez AWS, la fin de chaque flux note même les tokens consommés. Chez Azure, il faut les journaux de diagnostic.', say: 'Chez A W S, la fin de chaque flux note même les tokens consommés. Chez Azure, il faut les journaux de diagnostic.' },
    { id: 'c15', sc: 's5', sub: 'On croit voir l\'attaque dans les journaux. Sans réglage, sur Google Cloud, on ne voit que l\'activation.', say: 'On croit voir l\'attaque dans les journaux. Sans réglage, sur Google Cloud, on ne voit que l\'activation.', breath: .8 },
    { id: 'c16', sc: 's6', sub: 'Pourquoi un tel volume ? L\'accès est revendu : des passerelles, les « LLM Mixers », agrègent les clés volées.', say: 'Pourquoi un tel volume ? L\'accès est revendu : des passerelles, les L L M mixeurs, agrègent les clés volées.' },
    { id: 'c17', sc: 's6', sub: 'Devinez combien d\'appels l\'une d\'elles a passés en moins de 8 heures.|Plus de 500 000. Près d\'un million de dollars, pour la victime.', say: 'Devinez combien d\'appels l\'une d\'elles a passés en moins de huit heures. | Plus de cinq cent mille. Près d\'un million de dollars, pour la victime.' },
    { id: 'c18', sc: 's6', sub: 'Ses clients paient environ 60 dollars par mois. Pour vous, la facture arrive trop tard : il faut détecter avant.', say: 'Ses clients paient environ soixante dollars par mois. Pour vous, la facture arrive trop tard : il faut détecter avant.', breath: .8 },
    { id: 'c19', sc: 's7', sub: 'Un : alertez sur toute activation d\'un service d\'IA, dans Admin Activity ou CloudTrail.', say: 'Un : alertez sur toute activation d\'un service d\'IA, dans admin activity ou cloud trail.' },
    { id: 'c20', sc: 's7', sub: 'Deux : allumez les yeux. Data Access sur les projets d\'IA, et une alerte sur toute coupure de journalisation.', say: 'Deux : allumez les yeux. Data access sur les projets d\'IA, et une alerte sur toute coupure de journalisation.' },
    { id: 'c21', sc: 's7', sub: 'Trois : chassez les requêtes d\'un token et les pics d\'erreurs de quota. Et posez des plafonds de dépense.', say: 'Trois : chassez les requêtes d\'un token et les pics d\'erreurs de quota. Et posez des plafonds de dépense.' },
    { id: 'c22', sc: 's7', sub: 'Simplification : la vraie chaîne passe aussi par l\'escalade de droits et la persistance. Ce sera l\'épisode 2.', say: 'Simplification : la vraie chaîne passe aussi par l\'escalade de droits et la persistance. Ce sera l\'épisode deux.' },
  ],
  quiz: {
    c13: { q: 'Par défaut, vos journaux enregistrent-ils chaque appel au modèle ?', choices: ['Oui, partout', 'AWS oui, Google Cloud non', 'Non, nulle part'], answer: 1, why: 'Bedrock journalise InvokeModel et Converse comme événements de gestion (CloudTrail, par défaut). Chez Google Cloud, GenerateContent est en Data Access, désactivé par défaut. Azure : journaux de diagnostic à activer.' },
    c17: { q: 'Combien d\'appels le service Jet Night a-t-il passés en moins de 8 heures avec des clés volées ?', choices: ['5 000', '50 000', 'plus de 500 000'], answer: 2, why: 'GTIG : « more than 500,000 LLM API calls in less than eight hours », près d\'un million de dollars de tokens pour la victime.' },
  },
  poster: K => K.T('c1', 'dollars') + .8,
  build(K) {
    const k = sceneKit(K); const { C, G, I, F, FLOOR } = k; const { S, E, Z, P } = K; const T = K.T, R = K.reveal, cue = K.cue, pu = k.pulse;
    k.world(['facture', 'cle', 'activation', 'yeux', 'visibilite', 'mixer', 'fin'], { silhouette: 'server' });
    /* ---- shared drawings: the model engine (a glowing core in a frame), a camera with its LED, the meter ---- */
    const engine = (g, x, y, s, o = {}) => { const e = G(g, x, y, { s, ...o }); S('rect', { x: -150, y: -170, width: 300, height: 340, rx: 34, fill: C.p2, stroke: '#2c4a8f', 'stroke-width': 8 }, e);
      const core = S('circle', { cx: 0, cy: -20, r: 90, fill: o.off ? '#3B4766' : C.amber }, e); e._core = core;
      for (let i = 0; i < 3; i++) S('rect', { x: -110, y: 100 + i * 20, width: 220, height: 10, rx: 5, fill: '#2c4a8f' }, e);
      K.tx(e, 0, -20, 'LLM', { size: 54, fill: C.ink, weight: 800, deco: true });
      if (o.spin !== false) K.fx(t => core.setAttribute('r', (90 + (AMBIENT ? 6 * Math.sin(t * 4) : 0)).toFixed(1))); return e; };
    const camera = (g, x, y, s, on, o = {}) => { const c = G(g, x, y, { s, ...o }); ico('cam', c, 0, 0, 1, '#5B6B8C');
      const led = S('circle', { cx: -26, cy: -8, r: 9, fill: on === true ? C.green : '#2A3552' }, c); c._led = led; return c; };
    const ledAt = (cam, t, col) => K.fx(tt => cam._led.setAttribute('fill', tt >= t ? col : cam._led.getAttribute('data-c0') || cam._led.getAttribute('fill')));
    const setLed = (cam, steps) => { const c0 = cam._led.getAttribute('fill'); K.fx(t => { let c = c0; for (const [a, col] of steps) if (t >= a) c = col; cam._led.setAttribute('fill', c); }); for (const [a] of steps) K.mark(a); };
    /* ================= s1 : 100 000 $ in a day ================= */
    const g1 = k.room('facture', '#1F3B80', { seed: 1 });
    const eng1 = engine(g1, -520, -60, 1.1, { out: cue('c3').start - .2 });
    const bill = k.card(g1, 330, -230, { head: 'Facture cloud · projet IA', value: '+ 100 000 $ / jour', note: 'cumul observé : jusqu\'à 1 M$', col: C.amber, w: 900, mono: false }, .4, T('c1', 'cent'), T('c1', 'journee'), cue('c3').start - .2);
    const hero = k.hero(g1, 940, { s: 1.45, dir: -1 }); hero.pop(cue('c2').start - .4).walk(cue('c2').start - .3, 1.0, 760).expr(cue('c2').start, 'surprise').pose(T('c2', 'minage'), 1.0, 'jump').pose(T('c2', 'consomme'), 1.0, 'point', { x: -520, y: -60 });
    const pipe = S('path', { d: 'M -380 -60 C -200 -60 -150 160 300 160 L 980 160', stroke: C.rose, 'stroke-width': 26, fill: 'none', 'stroke-linecap': 'round' }, g1); K.A(pipe, { dash: [T('c2', 'consomme'), 1.4], out: cue('c3').start - .2 });
    const coins = G(g1, 860, 60, { pop: T('c2', 'revend'), out: cue('c3').start - .2 }); for (let i = 0; i < 3; i++) S('circle', { cx: i * 50 - 50, cy: 0, r: 26, fill: C.amber, stroke: '#8B5E34', 'stroke-width': 5 }, coins);
    const llmj = k.label(g1, 330, 110, 'LLMjacking', { pop: T('c2', 'l'), size: 70, col: C.rose, out: cue('c3').start + .3 });
    const notMine = k.label(g1, -520, -330, 'pas du minage', { pop: T('c2', 'minage'), out: T('c2', 'l') + .6, size: 54, col: C.muted });
    const cas = k.label(g1, 0, -330, 'cas type · incidents décrits par Mandiant (2026)', { pop: cue('c3').start, size: 58, col: C.cyan, out: cue('c3').end });
    const tlStages = [['clé', 'cle'], ['activation', 'activ'], ['caméras', 'yeux'], ['consommation', 'conso'], ['facture', 'fact']];
    const tl1 = k.timeline(g1, 0, -60, { w: 1500, pop: T('c3', 'moment') - .3, t0: T('c3', 'moment'), stagger: .15, lsize: 56, col: C.cyan, ticks: tlStages.map((s, i) => [i / 4, s[0]]) });
    const q1 = k.suspense(g1, 0, -200, T('c3', 'voir'), cue('c3').end + .5);
    K.cam(0, 0, Z.facture[0] + 330, Z.facture[1] - 230, 2.2); F(.4, 1.4, [bill], .8, { focus: false }); K.focus(0, bill);
    F(T('c1', 'journee') - .2, 1.0, [bill, eng1, hero], .92, { focus: false }); K.focus(T('c1', 'journee'), bill._n);
    F(T('c2', 'consomme') - .3, 1.0, [eng1, pipe, coins, llmj], .9, { focus: false }); K.focus(T('c2', 'consomme'), eng1); K.focus(T('c2', 'revend'), coins);
    F(cue('c3').start - .1, 1.0, [tl1, cas], .92, { focus: false }); K.focus(T('c3', 'moment'), tl1);
    pu(bill, T('c1', 'seule')); pu(eng1, T('c2', 'modeles')); pu(llmj, T('c2', 'acces')); pu(tl1, T('c3', 'voir'));
    K.hot({ x: Z.facture[0] + 330, y: Z.facture[1] - 430, at: 0, until: cue('c3').end, title: 'Source', html: '<p>« we observed fraudulent charges associated with resource consumption exceeding $100,000 USD in a single day, with cumulative charges at some organizations reaching $1 million USD before access was revoked. » GTIG / Mandiant, 2 novembre 2026. Victimes en Amérique du Nord, Amérique du Sud et Asie-Pacifique : finance, distribution, technologie, transport.</p>' });
    /* ================= s2 : the key and the 1-token test ================= */
    const g2 = k.room('cle', '#24356F', { seed: 2 }); const s2 = k.sc('s2');
    const keys = [['compte de service', C.orange], ['jeton GitHub', C.violet], ['session', C.cyan]].map(([lab, col], i) => {
      const kg = G(g2, -700 + i * 460, -360, { pop: T('c4', ['compte', 'jeton', 'session'][i]), out: cue('c6').start }); ico('key', kg, 0, 0, 1, col).setAttribute('transform', 'scale(1.6)');
      K.tx(kg, 0, 96, lab, { size: 54, fill: C.text, weight: 700 }); return kg; });
    const foe = k.foe(g2, -1100, { s: 1.4, dir: 1 }); foe.pop(cue('c5').start - .5).walk(cue('c5').start - .4, .9, -700).pose(T('c5', 'token'), 1.0, 'point', { x: 300, y: -60 }).expr(T('c5', 'personne'), 'smug');
    const req = k.panel(g2, 330, -120, ['{"max_tokens": 1}'], { w: 620, size: 60, pop: T('c5', 'requete'), col: C.rose, typeAt: T('c5', 'requete') });
    const vol = G(g2, 330, 230, { pop: T('c6', 'seuils') - .3 }); req._a.o.out = T('c6', 'seuils') - .4; S('rect', { x: -420, y: 0, width: 840, height: 8, rx: 4, fill: C.muted }, vol);
    const thr = S('path', { d: 'M -420 -200 L 420 -200', stroke: C.cyan, 'stroke-width': 8, 'stroke-dasharray': '22 14' }, vol);
    K.tx(vol, 0, -240, 'seuil d\'alerte de volume', { size: 46, fill: C.cyan, weight: 700 });
    for (let i = 0; i < 14; i++) { const b = S('rect', { x: -400 + i * 58, y: -24, width: 30, height: 24, rx: 5, fill: C.rose }, vol); K.A(b, { fin: [T('c6', 'seuils') + i * .08, .2] }); }
    const hero2 = k.hero(g2, 1000, { s: 1.35, dir: -1 }); hero2.pop(T('c6', 'valide') - .5).walk(T('c6', 'valide') - .4, .9, 820).expr(T('c6', 'volume'), 'worried').pose(T('c6', 'volume'), 1.0, 'shrug');
    K.ev(T('c6', 'volume'), 'myth');
    F(s2 - 1.4, 1.5, [...keys], .86, { focus: false }); K.focus(s2, keys[0]);
    F(cue('c5').start - .2, .9, [foe, req], .8, { focus: false }); K.focus(T('c5', 'requete'), req);
    F(T('c5', 'token') - .1, .6, [req], .55, { focus: false, zmax: 2.6 });
    F(T('c6', 'seuils') - .4, .9, [vol, hero2], .86, { focus: false }); K.focus(T('c6', 'seuils'), vol);
    pu(keys[0], T('c4', 'expose')); pu(keys[1], T('c4', 'github')); pu(keys[2], T('c4', 'volee')); pu(req, T('c5', 'verra')); pu(vol, T('c6', 'cles')); pu(vol, T('c6', 'previendra'));
    K.hot({ x: Z.cle[0] + 330, y: Z.cle[1] - 200, at: s2, until: cue('c6').end, title: 'Accès initial', html: '<p>« the dominant initial access vector has been exposed or stolen cloud identity tokens—including IAM credentials, Service Account keys, GitHub Personal Access Tokens (PATs), and active session tokens. » Clés d\'API LLM récoltées dans des dépôts GitHub publics, validées par « minimal single-token requests (max_tokens=1) », sous les alertes EDR et SIEM de volume.</p>' });
    /* ================= s3 : enablement ================= */
    const g3 = k.room('activation', '#1E3A72', { decor: 'lab', seed: 3 }); const s3 = k.sc('s3');
    const eng3 = engine(g3, -560, -80, 1.0, { off: true, spin: false }); const coreOn = S('circle', { cx: 0, cy: -20, r: 90, fill: C.amber }, eng3); K.A(coreOn, { fin: [T('c7', 'active', 1), .5] });
    const lever = G(g3, -330, 40, { pop: s3 - .2 }); S('rect', { x: -14, y: -10, width: 28, height: 120, rx: 10, fill: '#2c4a8f' }, lever);
    const arm = G(lever, 0, 0, { fn: (st, t) => { st.r = -40 + 80 * E.ob(P(t, T('c7', 'active', 1), .5)); } }); S('rect', { x: -10, y: -110, width: 20, height: 110, rx: 8, fill: C.muted }, arm); S('circle', { cx: 0, cy: -110, r: 26, fill: C.rose }, arm); K.mark(T('c7', 'active', 1));
    const foe3 = k.foe(g3, -1100, { s: 1.35, dir: 1 }); foe3.pop(s3 - .4).walk(s3 - .3, .9, -840).pose(T('c7', 'active', 1) - .2, 1.0, 'point', { x: -330, y: -60 }).expr(T('c7', 'active', 1), 'smug');
    const p3 = k.panel(g3, 330, -300, ['google.api.serviceusage.v1.ServiceUsage.EnableService'], { w: 1240, size: 40, pop: cue('c8').start - .2, col: C.cyan, title: 'Google Cloud · journal Admin Activity' });
    const camA = camera(g3, 330, -120, 1.5, true, { pop: T('c8', 'journal'), out: T('c8', 'chez', 1) - .2 }); const always = k.label(g3, 560, -120, 'toujours écrit', { pop: T('c8', 'toujours'), size: 56, col: C.green, out: T('c8', 'chez', 1) - .2 });
    const p3b = k.panel(g3, 330, 90, ['PutUseCaseForModelAccess', 'CreateFoundationModelAgreement'], { w: 1000, size: 46, pop: T('c8', 'chez', 1) - .1, col: C.cyan, title: 'AWS · CloudTrail' });
    const bell = G(g3, 330, -470, { pop: T('c9', 'critique'), fn: (st, t) => { st.r = 14 * Math.sin((t - T('c9', 'critique')) * 14) * (1 - P(t, T('c9', 'critique') + .3, 1.2)); } }); ico('bell', bell, 0, 0, 1, C.amber).setAttribute('transform', 'scale(1.3)'); K.ev(T('c9', 'critique'), 'impact');
    const before = k.label(g3, -560, -380, 'avant la facture', { pop: T('c9', 'avant'), size: 56, col: C.amber });
    const hero3 = k.hero(g3, 1000, { s: 1.35, dir: -1 }); hero3.pop(cue('c8').start - .4).walk(cue('c8').start - .3, .9, 1020).pose(T('c8', 'journal'), 1.0, 'point', { x: 330, y: -120 }).pose(T('c9', 'meilleure'), 1.2, 'cheer').expr(T('c9', 'meilleure'), 'happy');
    F(s3 - 1.4, 1.5, [eng3, lever, foe3], .8, { focus: false }); K.focus(s3, eng3);
    F(T('c7', 'active', 1) - .3, .6, [lever, eng3], .6, { focus: false }); K.focus(T('c7', 'active', 1), lever);
    F(cue('c8').start - .1, .9, [p3, camA, always], .82, { focus: false }); K.focus(cue('c8').start, p3);
    F(T('c8', 'chez', 1) - .2, .8, [p3b], .7, { focus: false }); K.focus(T('c8', 'chez', 1), p3b);
    F(cue('c9').start - .1, .9, [p3, p3b, bell], .9, { focus: false }); F(T('c9', 'meilleure') - .2, .8, [eng3, before, lever], .7, { focus: false }); K.focus(T('c9', 'critique'), bell); K.focus(T('c9', 'avant'), before);
    pu(eng3, T('c7', 'souvent')); pu(eng3, T('c7', 'meme')); pu(p3, T('c8', 'service')); pu(camA, T('c8', 'ecrit')); pu(p3b, T('c8', 'modele')); pu(bell, T('c9', 'alerte'));
    K.hot({ x: Z.activation[0] + 330, y: Z.activation[1] - 420, at: s3, until: cue('c9').end, title: 'Règles', html: '<pre>-- Google Cloud (Admin Activity)\nprotoPayload.methodName="google.api.serviceusage.v1.ServiceUsage.EnableService"\nprotoPayload.request.name:"aiplatform.googleapis.com"\n-- AWS CloudTrail\neventSource="bedrock.amazonaws.com"\neventName IN ("PutUseCaseForModelAccess","CreateFoundationModelAgreement")\n-- Azure (Activity Log)\nMicrosoft.CognitiveServices/accounts/deployments/write</pre><p>Exclure les principaux de votre IaC. Article : « treat any unauthorized enablement as a critical security event ». Le champ <code>request.name</code> est donné à titre indicatif : à valider sur vos journaux.</p>' });
    /* ================= s4 : cutting the cameras ================= */
    const g4 = k.room('yeux', '#2B2D6E', { seed: 4 }); const s4 = k.sc('s4');
    const cams = [-560, -220].map((x, i) => camera(g4, x, -360, 1.6, true, { pop: s4 - .2 + i * .2 }));
    const foe4 = k.foe(g4, -1100, { s: 1.4, dir: 1 }); foe4.pop(s4 - .4).walk(s4 - .3, .9, -760).pose(T('c10', 'regarde'), 1.4, 'loupe').expr(T('c10', 'observe'), 'smug');
    const p4 = k.panel(g4, 360, -120, ['google.iam.v1.IAMPolicy.GetIamPolicy', 'DeleteModelInvocationLoggingConfiguration'], { w: 1180, size: 42, pop: cue('c11').start - .1, col: C.rose });
    const h4a = p4._hi(0, 0, 37, T('c11', 'politique'), { col: C.amber }); const h4b = p4._hi(1, 0, 41, T('c11', 'coupe'), { col: C.rose });
    setLed(cams[1], [[T('c11', 'coupe'), '#2A3552']]); const cutX = G(g4, -220, -360, { pop: T('c11', 'coupe') }); ico('cross', cutX, 0, 0, 1, C.rose).setAttribute('transform', 'scale(1.2)');
    const sev = k.label(g4, 360, 200, 'compte ≠ pipeline IaC → haute sévérité', { pop: T('c12', 'pipeline'), size: 50, col: C.rose }); K.ev(T('c12', 'haute'), 'impact');
    const hero4 = k.hero(g4, 1000, { s: 1.35, dir: -1 }); hero4.pop(cue('c12').start - .5).walk(cue('c12').start - .4, .9, 880).pose(T('c12', 'haute'), 1.0, 'point', { x: 360, y: 200 });
    F(s4 - 1.4, 1.5, [...cams, foe4], .8, { focus: false }); K.focus(s4, cams[0]);
    F(cue('c11').start - .2, .9, [p4], .86, { focus: false }); K.focus(T('c11', 'politique'), h4a); K.focus(T('c11', 'coupe'), h4b);
    F(T('c11', 'coupe') + .5, .7, [cams[1], cutX], .4, { focus: false, zmax: 2.4 });
    F(cue('c12').start - .1, .9, [p4, sev, hero4], .9, { focus: false }); K.focus(T('c12', 'pipeline'), sev);
    pu(cams[0], T('c10', 'consommer')); pu(p4, T('c11', 'data')); pu(p4, T('c12', 'journalisation')); pu(sev, T('c12', 'severite'));
    K.hot({ x: Z.yeux[0] + 360, y: Z.yeux[1] - 260, at: s4, until: cue('c12').end, title: 'Évasion', html: '<p>AWS : GetModelInvocationLoggingConfiguration, PutModelInvocationLoggingConfiguration, DeleteModelInvocationLoggingConfiguration — « Any calls to disable logging by non-IaC (Infrastructure as Code) principals should be treated as high severity ». Google Cloud : GetIamPolicy (les journaux Data Access sont-ils actifs ?), ConfigServiceV2.ListSinks / GetSink. Azure : Microsoft.Insights/diagnosticSettings/read, write, delete.</p>' });
    /* ================= s5 : who sees inference? ================= */
    const g5 = k.room('visibilite', '#183A5E', { seed: 0 }); const s5 = k.sc('s5');
    const clouds = [['AWS', 'InvokeModel', 'par défaut : oui', C.green, true], ['Google Cloud', 'GenerateContent', 'Data Access : off', '#2A3552', false], ['Azure', 'Completions', 'diagnostic : off', '#2A3552', false]];
    const blds = clouds.map(([n, m, l, col, on], i) => { const b = G(g5, -560 + i * 560, -60, { pop: cue('c13').start + i * .2 });
      S('rect', { x: -250, y: -220, width: 500, height: 440, rx: 28, fill: C.p1, stroke: '#2c4a8f', 'stroke-width': 6 }, b);
      K.tx(b, 0, -175, n, { size: 52, fill: C.text, weight: 800 }); const e = engine(b, 0, 40, .6, { spin: false }); const cam = camera(b, 150, -90, 1.0, false); b._cam = cam;
      const lab = G(b, 0, 150, { fin: [R('c13') + i * .5, .3] }); S('rect', { x: -245, y: -64, width: 490, height: 150, rx: 16, fill: C.ink, 'fill-opacity': .85 }, lab); K.tx(lab, 0, -22, m, { size: 50, fill: C.text, weight: 700, mono: true, block: 'b' + i }); K.tx(lab, 0, 44, l, { size: 50, fill: on ? C.green : C.amber, weight: 700, block: 'b' + i });
      return b; });
    setLed(blds[0]._cam, [[R('c13'), C.green]]); setLed(blds[1]._cam, [[R('c13') + .5, C.rose]]); setLed(blds[2]._cam, [[R('c13') + 1.0, C.amber]]);
    const q5 = k.suspense(g5, 0, -480, T('c13', 'devinez'), R('c13'));
    const ev = k.panel(g5, -60, -470, ['"eventName": "ConverseStream",', '"eventType": "AwsServiceEvent",', '"inputTokens": 18694, "outputTokens": 356'], { w: 1300, size: 44, pop: cue('c14').start - .1, col: C.green, title: 'CloudTrail · exemple publié par AWS', out: T('c14', 'azure') - .2 });
    const diag = k.label(g5, 560, -400, 'Azure : Diagnostic Logs', { pop: T('c14', 'azure'), size: 50, col: C.amber, out: cue('c15').start });
    const doorCam = camera(g5, -560 + 560 - 200, -300, 1.2, true, { pop: T('c15', 'activation') }); const onlyAct = k.label(g5, 0, -470, 'seule l\'activation est visible', { pop: T('c15', 'activation'), size: 50, col: C.amber });
    K.ev(T('c15', 'reglage'), 'myth');
    const hero5 = k.hero(g5, 1000, { s: 1.3, dir: -1 }); hero5.pop(s5 - .3).expr(T('c13', 'devinez'), 'worried').expr(R('c13'), 'surprise').pose(R('c13') + .5, 1.0, 'point', { x: 0, y: -120 }).pose(T('c15', 'croit'), .9, 'shrug');
    F(s5 - 1.4, 1.5, [...blds], .92, { focus: false }); K.focus(s5, blds[1]);
    F(T('c13', 'devinez') - .2, .6, [...blds, q5], .95, { focus: false }); K.focus(T('c13', 'devinez'), q5);
    F(R('c13') - .2, .7, [blds[0]], .62, { focus: false }); F(T('c13', 'oui') - .1, .6, [blds[0]._cam], .3, { focus: false, zmax: 2.4 }); F(T('c13', 'google') - .3, .7, [blds[1]], .62, { focus: false }); F(T('c13', 'inference') - .1, .6, [blds[1]], .48, { focus: false }); K.focus(T('c13', 'google'), blds[1]._cam); F(T('c13', 'eteint') - .2, .6, [blds[1]._cam], .3, { focus: false, zmax: 2.4 });
    F(cue('c14').start - .1, .9, [ev], .92, { focus: false }); K.focus(cue('c14').start, ev);
    F(T('c14', 'azure') - .2, .7, [blds[2], diag], .66, { focus: false }); K.focus(T('c14', 'azure'), diag);
    F(cue('c15').start - .1, .9, [...blds, onlyAct], .95, { focus: false }); K.focus(T('c15', 'activation'), onlyAct);
    pu(blds[0], T('c13', 'oui') > 0 ? T('c13', 'oui') : R('c13')); pu(blds[1], T('c13', 'non', 0)); pu(ev, T('c14', 'tokens')); pu(blds[1], T('c15', 'google'));
    K.hot({ x: Z.visibilite[0], y: Z.visibilite[1] - 380, at: s5, until: cue('c15').end, title: 'Ce que dit la doc', html: '<p><b>AWS</b> : « Amazon Bedrock logs Amazon Bedrock Runtime API operations (InvokeModel, InvokeModelWithResponseStream, Converse, and ConverseStream) as management events » ; les flux produisent un événement <code>AwsServiceEvent</code> avec les tokens (compter les invocations sur <code>eventType = AwsApiCall</code>). <b>Google Cloud</b> : « Except for BigQuery, Data Access audit logs are disabled by default » ; l\'inférence est en Data Access (DATA_READ). <b>Azure</b> : le plan de données (complétions) n\'apparaît qu\'avec les journaux de diagnostic.</p>' });
    /* ================= s6 : LLM Mixers ================= */
    const g6 = k.room('mixer', '#2A2F6E', { seed: 5 }); const s6 = k.sc('s6');
    const hub = G(g6, 0, -120, { pop: T('c16', 'passerelles') }); S('circle', { r: 150, fill: C.p2, stroke: C.rose, 'stroke-width': 10 }, hub); K.tx(hub, 0, 0, 'mixer', { size: 50, fill: C.rose, weight: 800 });
    const ins = [0, 1, 2, 3].map(i => { const y = -380 + i * 170; const kk = G(g6, -760, y, { pop: T('c16', 'agregent') + i * .15 }); ico('key', kk, 0, 0, 1, [C.orange, C.violet, C.cyan, C.amber][i]);
      const ln = S('path', { d: `M -690 ${y} C -400 ${y} -300 -120 -150 -120`, stroke: '#5B6B8C', 'stroke-width': 8, fill: 'none' }, g6); K.A(ln, { dash: [T('c16', 'agregent') + i * .15, .6] }); return kk; });
    const outs = [0, 1, 2, 3, 4].map(i => { const y = -420 + i * 150; const pp = I('person', g6, 720, y, .9, C.text, { pop: T('c16', 'revendu') + i * .1 });
      const ln = S('path', { d: `M 150 -120 C 300 -120 450 ${y} 640 ${y}`, stroke: C.rose, 'stroke-width': 8, fill: 'none' }, g6); K.A(ln, { dash: [T('c16', 'revendu') + i * .1, .5] }); return pp; });
    const q6 = k.suspense(g6, 0, -380, T('c17', 'devinez'), R('c17'));
    const calls = k.counter(g6, 0, 80 - 300, { pop: R('c17'), t0: R('c17'), dur: 1.4, from: 0, to: 500000, size: 100, fill: C.rose, out: cue('c18').start - .2, fmt: v => '+ ' + Math.round(v).toLocaleString('fr-FR') + ' appels' });
    const h8 = k.label(g6, -420, 80, '< 8 h', { pop: T('c17', 'huit'), size: 64, col: C.amber, out: cue('c18').start - .2 }); const m1 = k.label(g6, 0, 330 - 120, '≈ 1 M$ pour la victime', { pop: T('c17', 'million'), size: 56, col: C.amber, out: cue('c18').start - .2 });
    const price = k.label(g6, 720, -520, '≈ 60 $ / mois', { pop: T('c18', 'soixante'), size: 56, col: C.green });
    const hero6 = k.hero(g6, -1000, { s: 1.3 }); hero6.pop(cue('c18').start - .4).walk(cue('c18').start - .3, .9, -880).pose(T('c18', 'tard'), 1.0, 'shrug').expr(T('c18', 'tard'), 'worried').pose(T('c18', 'detecter'), 1.0, 'point', { x: 0, y: -120 });
    F(s6 - 1.4, 1.5, [hub, ...ins, ...outs], .9, { focus: false }); K.focus(T('c16', 'passerelles'), hub);
    F(T('c17', 'devinez') - .2, .7, [hub, q6], .7, { focus: false }); K.focus(T('c17', 'devinez'), q6);
    F(R('c17') - .2, .8, [hub, calls, h8, m1], .82, { focus: false }); K.focus(R('c17'), calls);
    F(cue('c18').start - .1, .9, [hub, ...outs, price], .9, { focus: false }); F(T('c18', 'clients') - .1, .6, [outs[0], price], .5, { focus: false }); F(T('c18', 'tard') - .2, .8, [hub, hero6], .8, { focus: false }); F(T('c18', 'vous') - .1, .6, [hub], .45, { focus: false }); K.focus(T('c18', 'soixante'), price);
    pu(hub, T('c16', 'volume')); pu(hub, T('c16', 'volees')); pu(calls, T('c17', 'victime')); pu(price, T('c18', 'mois')); pu(hub, T('c18', 'facture'));
    K.hot({ x: Z.mixer[0], y: Z.mixer[1] - 300, at: s6, until: cue('c18').end, title: 'Écosystème', html: '<p>« LLM Mixers function as illicit routing gateways that proxy, aggregate, and resell unauthorized LLM access to underground subscribers. » Outils observés : new-api, gcli2api. Jet Night (jet-night.com) : « more than 500,000 LLM API calls in less than eight hours », « nearly one million dollars in token costs », abonnement « illimité » ≈ 60 $/mois contre 100 à 250 $ pour un abonnement normal. Autre cas : relais <code>ai-relay</code> vers newapi[.]pro ; LiteLLM CVE-2026-40217.</p>' });
    /* ================= s7 : three reflexes on the case timeline ================= */
    const g7 = k.room('fin', '#1F3B80', { seed: 1 }); const s7 = k.sc('s7');
    const tl7 = k.timeline(g7, 0, -20, { w: 1500, pop: s7 - .4, t0: s7 - .3, stagger: .1, lsize: 56, col: C.cyan, ticks: tlStages.map((s, i) => [i / 4, s[0]]) });
    const rules = [['EnableService · PutUseCaseForModelAccess', 'c19', 'activation', 1 / 4], ['Data Access : ON · coupure → alerte', 'c20', 'yeux', 2 / 4], ['max_tokens=1 · ThrottlingException', 'c21', 'chassez', 0]];
    const bells = rules.map(([txt, c, w, p], i) => { const x = -750 + p * 1500; const b = G(g7, x, -190, { pop: T(c, w) }); ico('bell', b, 0, 0, 1, C.amber).setAttribute('transform', 'scale(1.1)');
      const lab = G(g7, Math.max(-380, Math.min(380, x)), -380, { pop: T(c, w) + .1, out: [cue('c20').start, cue('c21').start, cue('c22').start][i] - .1 }); K.tx(lab, 0, 0, `${i + 1} · ${txt}`, { size: 46, fill: C.text, weight: 700, mono: true }); return [b, lab]; });
    const cap = G(g7, 750, -190, { pop: T('c21', 'plafonds') }); ico('padlock', cap, 0, 0, 1, C.green).setAttribute('transform', 'scale(1.1)');
    const ep2 = k.label(g7, 0, -400, 'épisode 2 : escalade de droits et persistance', { pop: T('c22', 'episode'), size: 50, col: C.violet });
    const hero7 = k.hero(g7, 980, { s: 1.35, dir: -1 }); hero7.pop(s7 - .4).pose(T('c19', 'alertez'), 1.0, 'point', { x: -375, y: -60 }).pose(T('c20', 'allumez'), 1.0, 'point', { x: 0, y: -60 }).pose(T('c21', 'chassez'), 1.0, 'point', { x: -750, y: -60 }).pose(T('c21', 'plafonds'), .9, 'nod').pose(T('c22', 'episode'), 1.2, 'cheer').expr(T('c22', 'episode'), 'happy');
    F(s7 - 1.4, 1.5, [tl7, hero7], .92, { focus: false }); K.focus(s7, tl7);
    F(T('c19', 'alertez') - .2, .8, [...bells[0], tl7], .9, { focus: false }); K.focus(T('c19', 'alertez'), bells[0][1]);
    F(T('c20', 'allumez') - .2, .8, [...bells[1], tl7], .9, { focus: false }); K.focus(T('c20', 'allumez'), bells[1][1]);
    F(T('c21', 'chassez') - .2, .8, [...bells[2], tl7], .9, { focus: false }); F(T('c21', 'erreurs') - .2, .6, [...bells[2]], .7, { focus: false }); F(T('c21', 'plafonds') - .2, .8, [tl7, cap], .92, { focus: false }); K.focus(T('c21', 'chassez'), bells[2][1]); K.focus(T('c21', 'plafonds'), cap);
    F(cue('c22').start - .1, .9, [tl7, ep2, hero7], .92, { focus: false }); K.focus(T('c22', 'episode'), ep2);
    pu(tl7, T('c19', 'service')); pu(bells[0][0], T('c19', 'cloud')); pu(bells[1][0], T('c20', 'projets')); pu(bells[1][0], T('c20', 'coupure')); pu(bells[2][0], T('c21', 'pics')); pu(tl7, T('c22', 'persistance'));
    K.hot({ x: Z.fin[0], y: Z.fin[1] - 260, at: s7, until: cue('c22').end + 1, title: 'Réglages', html: '<p>Google Cloud : activer les journaux Data Access (DATA_READ) pour <code>aiplatform.googleapis.com</code> sur les projets qui utilisent des modèles. AWS : garder la journalisation des invocations et alerter sur Put/DeleteModelInvocationLoggingConfiguration hors IaC. Partout : quotas par modèle, plafonds de dépense, clés segmentées par modèle et environnement, scan de secrets dans le code.</p>' });
    /* ---- extra beats (beats.mjs) ---- */
    pu(bill, T('c1', 'facture')); pu(eng1, T('c1', 'projet'));
    pu(cas, T('c3', 'incidents')); pu(tl1, T('c3', 'mandiant'));
    pu(req, T('c6', 'requetes')); hero2.pose(T('c6', 'valide'), 1.0, 'loupe');
    pu(p3, T('c8', 'google')); pu(p3, T('c8', 'activation')); pu(p3b, T('c8', 'demande')); pu(p3b, T('c9', 'toute'));
    pu(blds[1], T('c13', 'journaux')); pu(blds[0], T('c13', 'chaque')); pu(blds[1], T('c13', 'google')); pu(blds[1]._cam, T('c13', 'access')); pu(blds[1]._cam, T('c13', 'eteint'));
    pu(ev, T('c14', 'flux')); pu(diag, T('c14', 'diagnostic')); pu(blds[2], T('c15', 'sans')); pu(blds[1], T('c15', 'reglage'));
    pu(hub, T('c16', 'mixeurs')); pu(q6, T('c17', 'appels'));
    pu(bells[0][1], T('c19', 'admin')); pu(bells[1][1], T('c20', 'journalisation'));
    pu(blds[2], T('c13', 'modele')); pu(ev, T('c14', 'fin')); pu(ep2, T('c22', 'chaine'));
    pu(tl7, T('c22', 'simplification')); pu(tl7, T('c22', 'droits')); pu(ep2, T('c22', 'deux'));
  },
};
