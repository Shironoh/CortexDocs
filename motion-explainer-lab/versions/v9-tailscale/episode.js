/*META{"title":"Tailscale","h1":"Tailscale · fonctionnement, incidents, journaux (épisode 1)","eyebrow":"Motion explainer · skill v7 + pipeline illustré · DFIR réseau",
"voice":{"cast":{"foe":{"voice":"fr_FR-tom-medium","ls":1.0}},
"lexicon":{"tailscale":"Téïlskéïl","tailnet":"téïlnette","wireguard":"Ouaïeur-garde","derp":"deurp","openssh":"Open S S H","json":"djéïsonne","siem":"sime","edr":"E D R","flow":"flo","logs":"logues","enterprise":"Entreprïze","premium":"Primium","vpn":"V P N","https":"H T T P S","udp":"U D P","cyble":"Ciblle","cato":"Cato","status":"stétusse"}},
"music":{"mood":"curious","key":"D"},
"footer":"<p class='footer'>Sources : documentation Tailscale (plans de contrôle et de données, types de connexion, DERP, ports, clés, journal d'audit, flow logs, journaux du client, politiques système), code source tailscale (ipnstate), bulletins de sécurité Tailscale, Cyble (17 juillet 2024), Cato CTRL « Operation Poisson » (juin 2026, via The Hacker News et SOC Prime). Cas type composite. Fiche : research/tailscale/SOURCES.md. Voix Piper, musique générée.</p>"}META*/
/* ---------- FICHE (skill v7) ----------
Audience : métier = DFIR / détection, praticien ; domaine = Tailscale, novice (connaît VPN, EDR, SIEM, journaux).
Doit savoir faire après : 1. chasser Tailscale + OpenSSH serveur non prévus sur les postes (EDR), et lire le tailnet courant (tailscale status --json → CurrentTailnet) ;
 2. imposer son tailnet sur les postes gérés (politique système Tailnet, required:) ;
 3. dans son tailnet : lire l'audit (Create node, Log in node, Create API key), activer les flow logs, clés à usage unique.
Question centrale : où voir un poste que l'attaquant a relié à son propre réseau Tailscale ?
Inventaire (à l'écran tel quel) : 100.x.y.z ; tailscale up --auth-key=tskey-… ; controlplane.tailscale.com ; UDP 41641 ; TCP 443 sortant ;
 Create node / Log in node / Create API key ; virtualTraffic · txBytes ; C:\ProgramData\Tailscale ; journalctl -u tailscaled ;
 tailscale status --json → CurrentTailnet.Name ; Tailnet = required:T…CNTRL.
Métaphore système : un archipel privé ; une tour de contrôle (coordination) qui distribue les laissez-passer (clés publiques) et le règlement (ACL),
 des passerelles directes entre îles (WireGuard), un ballon-relais qui porte des colis scellés (DERP) ; trois registres (audit, flow logs, client).
Idées reçues : « Tailscale journalise tout, je le verrai dans ma console » ; « le flow log montre les tentatives refusées ».
Devinez : combien de ports à ouvrir ? (aucun, en général) ; dans lequel de vos journaux voit-on le poste rejoindre le tailnet de l'attaquant ? (aucun).
Termes nouveaux : s2 tailnet ; s3 relais DERP ; s4 clé d'authentification ; s5 flow logs ; s6 tailnet courant ; s7 politique système.
Cas type composite : Cyble 2024 (clé écrite en dur, poste joint au réseau de l'attaquant, OpenSSH) + Cato CTRL 2026 (accès qui survit 18 jours à la chute du C2).
------------------------------------ */
const EP = {
  lead: .6, tail: 2.2,
  scenes: [{ id: 's1', title: 'Le C2 tombe, l\'accès reste' }, { id: 's2', title: 'Le tailnet et sa tour' }, { id: 's3', title: 'Direct ou relayé' },
    { id: 's4', title: 'Le poste rejoint l\'attaquant' }, { id: 's5', title: 'Trois journaux' }, { id: 's6', title: 'Chercher sur le poste' }, { id: 's7', title: 'Vos trois réflexes' }],
  cues: [
    { id: 'c1', sc: 's1', sub: 'Le serveur de commande de l\'attaquant tombe. Pendant 18 jours, il garde pourtant l\'accès au poste.', say: 'Le serveur de commande de l\'attaquant tombe. Pendant dix-huit jours, il garde pourtant l\'accès au poste.' },
    { id: 'c2', sc: 's1', sub: 'Son autre chemin : un logiciel légitime, Tailscale. Comment fonctionne-t-il ? Et où voir ses traces ?', say: 'Son autre chemin : un logiciel légitime, Tailscale. Comment fonctionne-t-il ? Et où voir ses traces ?' },
    { id: 'c3', sc: 's1', sub: 'Un cas type, tiré de deux incidents publiés. Et une question : où l\'auriez-vous vu ?', say: 'Un cas type, tiré de deux incidents publiés. Et une question : où l\'auriez-vous vu ?' },
    { id: 'c4', sc: 's2', sub: 'Tailscale relie vos machines en un réseau privé, le tailnet. Chacune y reçoit une adresse en 100.x.y.z.', say: 'Tailscale relie vos machines en un réseau privé, le tailnet. Chacune y reçoit une adresse qui commence par cent.' },
    { id: 'c5', sc: 's2', sub: 'Une tour de contrôle, le serveur de coordination, distribue les clés publiques et les règles d\'accès. Mais le trafic ne passe jamais par elle.', say: 'Une tour de contrôle, le serveur de coordination, distribue les clés publiques et les règles d\'accès. Mais le trafic ne passe jamais par elle.' },
    { id: 'c7', sc: 's3', sub: 'Entre deux machines, le trafic part chiffré par WireGuard, en direct quand le réseau le permet.', say: 'Entre deux machines, le trafic part chiffré par WireGuard, en direct quand le réseau le permet.' },
    { id: 'c8', sc: 's3', sub: 'Sinon, un relais DERP transporte les paquets, sans pouvoir les ouvrir.', say: 'Sinon, un relais DERP transporte les paquets, sans pouvoir les ouvrir.' },
    { id: 'c9', sc: 's3', sub: 'Devinez : combien de ports faut-il ouvrir dans le pare-feu ?|En général, aucun : chaque machine appelle vers l\'extérieur. Pratique pour vous, et pour un attaquant.', say: 'Devinez : combien de ports faut-il ouvrir dans le pare-feu ?|En général, aucun : chaque machine appelle vers l\'extérieur. Pratique pour vous, et pour un attaquant.' },
    { id: 'c10', sc: 's4', sub: 'Dans notre cas, un script crée un compte administrateur, installe Tailscale et un serveur OpenSSH.', say: 'Dans notre cas, un script crée un compte administrateur, installe Tailscale et un serveur OpenSSH.' },
    { id: 'c11', sc: 's4', sub: 'Puis il connecte le poste avec une clé d\'authentification écrite en dur. Le poste rejoint le tailnet de l\'attaquant.', say: 'Puis il connecte le poste avec une clé d\'authentification écrite en dur. Le poste rejoint le tailnet de l\'attaquant.' },
    { id: 'c12', sc: 's4', who: 'foe', sub: 'Je n\'ouvre aucun port. C\'est ton poste qui m\'appelle.', say: 'Je n\'ouvre aucun port. C\'est ton poste qui m\'appelle.' },
    { id: 'c14', sc: 's5', sub: 'Côté défense, Tailscale tient trois journaux. Le journal d\'audit : qui a changé quoi, et quand. Toujours actif, 90 jours.', say: 'Côté défense, Tailscale tient trois journaux. Le journal d\'audit : qui a changé quoi, et quand. Toujours actif, quatre-vingt-dix jours.' },
    { id: 'c15', sc: 's5', sub: 'Les flow logs : qui a parlé à qui, par fenêtres de 5 secondes. Éteints par défaut, et réservés aux offres Premium et Enterprise.', say: 'Les flow logs : qui a parlé à qui, par fenêtres de cinq secondes. Éteints par défaut, et réservés aux offres Premium et Enterprise.' },
    { id: 'c16', sc: 's5', sub: 'Et les journaux du client, sur la machine elle-même.', say: 'Et les journaux du client, sur la machine elle-même.' },
    { id: 'c17', sc: 's5', sub: 'Devinez : dans votre console Tailscale, quel journal montre le poste qui rejoint le tailnet de l\'attaquant ?|Aucun. Ce journal d\'audit-là est celui de son tailnet, pas du vôtre. Seul le poste garde la trace.', say: 'Devinez : dans votre console Tailscale, quel journal montre le poste qui rejoint le tailnet de l\'attaquant ?|Aucun. Ce journal d\'audit-là est celui de son tailnet, pas du vôtre. Seul le poste garde la trace.' },
    { id: 'c18', sc: 's5', sub: 'Autre idée reçue : les flow logs ne montrent pas les tentatives refusées. Seulement les connexions réussies, jamais leur contenu.', say: 'Autre idée reçue : les flow logs ne montrent pas les tentatives refusées. Seulement les connexions réussies, jamais leur contenu.' },
    { id: 'c19', sc: 's6', sub: 'Alors on cherche sur le poste : Tailscale là où aucun VPN n\'est prévu, et des connexions vers son serveur de coordination.', say: 'Alors on cherche sur le poste : Tailscale là où aucun VPN n\'est prévu, et des connexions vers son serveur de coordination.' },
    { id: 'c20', sc: 's6', sub: 'La commande tailscale status, en JSON, donne le nom du tailnet courant. Si ce n\'est pas le vôtre, c\'est un incident.', say: 'La commande Tailscale status, en JSON, donne le nom du tailnet courant. Si ce n\'est pas le vôtre, c\'est un incident.' },
    { id: 'c21', sc: 's6', sub: 'Dans votre propre tailnet, le danger est une clé réutilisable volée : l\'audit montre alors un nœud créé, puis connecté.', say: 'Dans votre propre tailnet, le danger est une clé réutilisable volée : l\'audit montre alors un nœud créé, puis connecté.' },
    { id: 'c22', sc: 's7', sub: 'Un : depuis votre EDR, alertez sur Tailscale et sur un serveur OpenSSH là où ils ne sont pas prévus.', say: 'Un : depuis votre EDR, alertez sur Tailscale et sur un serveur OpenSSH là où ils ne sont pas prévus.' },
    { id: 'c23', sc: 's7', sub: 'Deux : sur vos postes gérés, imposez votre tailnet avec la politique système Tailnet, en mode obligatoire.', say: 'Deux : sur vos postes gérés, imposez votre tailnet avec la politique système Tailnet, en mode obligatoire.' },
    { id: 'c24', sc: 's7', sub: 'Trois : dans la console, activez les flow logs, envoyez l\'audit à votre SIEM, et préférez des clés à usage unique.', say: 'Trois : dans la console, activez les flow logs, envoyez l\'audit à votre SIEM, et préférez des clés à usage unique.' },
    { id: 'c25', sc: 's7', sub: 'Simplification : Tailscale a aussi ses propres failles, publiées en bulletins. Vous savez maintenant où chercher un tailnet qui n\'est pas le vôtre.', say: 'Simplification : Tailscale a aussi ses propres failles, publiées en bulletins. Vous savez maintenant où chercher un tailnet qui n\'est pas le vôtre.' },
  ],
  build(K) { /* image : index.html (composition HyperFrames illustrée) ; ce fichier porte le script, la voix et la musique */ },
};
