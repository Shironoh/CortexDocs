/*META{"title":"Tailscale · insider","h1":"Tailscale · et si l'attaquant était dans la tour ? (épisode 1 bis)","eyebrow":"Motion explainer · variante · scénario hypothétique",
"voice":{"cast":{"foe":{"voice":"fr_FR-tom-medium","ls":1.0}},
"lexicon":{"tailscale":"Téïlskéïl","tailnet":"téïlnette","wireguard":"Ouaïeur-garde","edr":"E D R","siem":"sime","status":"stétusse","lock":"loque","headscale":"Hèdskéïl","personal":"Peursonal","enterprise":"Entreprïze","insider":"innsaïdeur"}},
"music":{"mood":"tense","key":"A"},
"footer":"<p class='footer'>Scénario hypothétique : aucun incident public de ce type trouvé au 6 novembre 2026. Sources : documentation Tailscale (Tailnet Lock, livre blanc Tailnet Lock, plans de contrôle et de données, journaux), code source tailscale (ipnstate), bulletin TS-2025-008. Fiche : research/tailscale/SOURCES.md, lignes 31 à 45. Voix Piper, musique générée.</p>"}META*/
/* ---------- FICHE (skill v7) ----------
Audience : métier = DFIR / sécurité, praticien ; domaine = Tailscale, a vu l'épisode 1 (tour de contrôle, clés publiques, journaux).
Doit savoir faire après : 1. activer Tailnet Lock (tailscale lock init, ≥ 2 nœuds de signature) et ranger les secrets de désactivation ;
 2. relever sur les postes la liste des pairs (tailscale status --json → Peer) et l'état du verrou (tailscale lock status), les comparer à l'inventaire ;
 3. garder les journaux des postes chez soi (SIEM), indépendants de Tailscale.
Question centrale : que peut faire un insider de Tailscale, que verriez-vous, comment s'en protéger ?
Idées reçues : « chiffré de bout en bout, donc l'éditeur ne peut rien » ; « la console me dira tout ».
Devinez : l'insider peut-il lire votre trafic ? ; un nœud fantôme non signé passe-t-il le verrou ?
Hypothétique, dit comme tel au début et à l'écran.
------------------------------------ */
const EP = {
  lead: .6, tail: 2.2,
  scenes: [{ id: 's1', title: 'Un insider dans la tour' }, { id: 's2', title: 'Le nœud fantôme' }, { id: 's3', title: 'Ce que vous verriez' },
    { id: 's4', title: 'Tailnet Lock' }, { id: 's5', title: 'Les limites du verrou' }, { id: 's6', title: 'Vos trois réflexes' }],
  cues: [
    { id: 'c1', sc: 's1', sub: 'Scénario hypothétique : l\'attaquant travaille chez Tailscale, dans la tour de contrôle.', say: 'Scénario hypothétique : l\'attaquant travaille chez Tailscale, dans la tour de contrôle.' },
    { id: 'c2', sc: 's1', sub: 'Nous n\'avons trouvé aucun incident public de ce type. Mais Tailscale a conçu une parade contre ce risque précis.', say: 'Nous n\'avons trouvé aucun incident public de ce type. Mais Tailscale a conçu une parade contre ce risque précis.' },
    { id: 'c3', sc: 's1', sub: 'Que peut faire cet insider, que verriez-vous, et comment vous en protéger ?', say: 'Que peut faire cet insider, que verriez-vous, et comment vous en protéger ?' },
    { id: 'c4', sc: 's2', sub: 'Rappel : la tour distribue les clés publiques, mais vos clés privées ne quittent jamais vos machines.', say: 'Rappel : la tour distribue les clés publiques, mais vos clés privées ne quittent jamais vos machines.' },
    { id: 'c5', sc: 's2', sub: 'Devinez : l\'insider peut-il lire votre trafic ?|Pas directement. Mais il peut diffuser la clé d\'un nœud fantôme, que vos machines prendront pour un pair légitime.', say: 'Devinez : l\'insider peut-il lire votre trafic ?|Pas directement. Mais il peut diffuser la clé d\'un nœud fantôme, que vos machines prendront pour un pair légitime.' },
    { id: 'c6', sc: 's2', who: 'foe', sub: 'Je ne casse rien. J\'ajoute juste un pair.', say: 'Je ne casse rien. J\'ajoute juste un pair.' },
    { id: 'c7', sc: 's2', sub: 'Ce nœud peut alors échanger du trafic avec vos machines, et le lire.', say: 'Ce nœud peut alors échanger du trafic avec vos machines, et le lire.' },
    { id: 'c8', sc: 's3', sub: 'Le verriez-vous ? Le journal d\'audit est tenu par Tailscale : face à un insider, ce n\'est plus un témoin indépendant.', say: 'Le verriez-vous ? Le journal d\'audit est tenu par Tailscale : face à un insider, ce n\'est plus un témoin indépendant.' },
    { id: 'c9', sc: 's3', sub: 'Vos machines, elles, connaissent leurs pairs : tailscale status liste chaque pair et sa clé, sur le poste lui-même.', say: 'Vos machines, elles, connaissent leurs pairs : Tailscale status liste chaque pair et sa clé, sur le poste lui-même.' },
    { id: 'c10', sc: 's3', sub: 'Et chaque connexion est journalisée aux deux bouts : en les comparant, on repère un journal manquant ou modifié.', say: 'Et chaque connexion est journalisée aux deux bouts : en les comparant, on repère un journal manquant ou modifié.' },
    { id: 'c11', sc: 's4', sub: 'La parade s\'appelle Tailnet Lock : vos propres nœuds de signature signent chaque clé de nœud.', say: 'La parade s\'appelle Tailnet Lock : vos propres nœuds de signature signent chaque clé de nœud.' },
    { id: 'c12', sc: 's4', sub: 'Chaque machine vérifie la signature avant d\'accepter un pair. Et la tour ne voit jamais les clés de signature.', say: 'Chaque machine vérifie la signature avant d\'accepter un pair. Et la tour ne voit jamais les clés de signature.' },
    { id: 'c13', sc: 's4', sub: 'Devinez : le nœud fantôme passe-t-il ?|Non. Sans signature, il est refusé. Et pour désactiver le verrou, il faut un secret que la tour n\'a pas.', say: 'Devinez : le nœud fantôme passe-t-il ?|Non. Sans signature, il est refusé. Et pour désactiver le verrou, il faut un secret que la tour n\'a pas.' },
    { id: 'c14', sc: 's5', sub: 'Limites : le verrou n\'empêche pas la tour de couper le réseau. Et il fait confiance à son tout premier état.', say: 'Limites : le verrou n\'empêche pas la tour de couper le réseau. Et il fait confiance à son tout premier état.' },
    { id: 'c15', sc: 's5', sub: 'Vérifiez cet état avec tailscale lock status, et donnez un répertoire d\'état à chaque nœud : sans lui, avant la version 1.90.8, le verrou pouvait ne pas s\'appliquer.', say: 'Vérifiez cet état avec Tailscale lock status, et donnez un répertoire d\'état à chaque nœud : sans lui, avant la version un point quatre-vingt-dix point huit, le verrou pouvait ne pas s\'appliquer.' },
    { id: 'c16', sc: 's6', sub: 'Un : activez Tailnet Lock avec au moins deux nœuds de signature, et rangez les secrets de désactivation en lieu sûr.', say: 'Un : activez Tailnet Lock avec au moins deux nœuds de signature, et rangez les secrets de désactivation en lieu sûr.' },
    { id: 'c17', sc: 's6', sub: 'Deux : depuis votre EDR, relevez la liste des pairs et l\'état du verrou sur chaque poste, et comparez-les à votre inventaire.', say: 'Deux : depuis votre EDR, relevez la liste des pairs et l\'état du verrou sur chaque poste, et comparez-les à votre inventaire.' },
    { id: 'c18', sc: 's6', sub: 'Trois : gardez les journaux des postes dans votre SIEM, indépendants de Tailscale.', say: 'Trois : gardez les journaux des postes dans votre SIEM, indépendants de Tailscale.' },
    { id: 'c19', sc: 's6', sub: 'Simplification : Tailnet Lock est inactif par défaut, et réservé aux offres Personal et Enterprise. Solution radicale : votre propre tour, avec Headscale.', say: 'Simplification : Tailnet Lock est inactif par défaut, et réservé aux offres Personal et Enterprise. Solution radicale : votre propre tour, avec Headscale.' },
    { id: 'c20', sc: 's6', sub: 'Vous savez maintenant ce qu\'un insider pourrait faire, et ce que vos machines, elles, verraient.', say: 'Vous savez maintenant ce qu\'un insider pourrait faire, et ce que vos machines, elles, verraient.' },
  ],
  build(K) { /* image : index.html (composition HyperFrames illustrée, parts/) */ },
};
