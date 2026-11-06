# Tailscale vu par la réponse à incident

Synthèse au 6 novembre 2026. Chaque affirmation renvoie à une ligne de `SOURCES.md` (numéro entre crochets), dont les citations ont été vérifiées dans le texte brut des sources (`raw/`).

## 1. Comment ça marche

- **Deux plans.** Le *plan de contrôle* est le service de coordination de Tailscale : il enregistre les appareils, distribue les clés publiques, les routes, le DNS et la politique d'accès. Le *plan de données* tourne sur chaque appareil (`tailscaled`) et transporte le trafic chiffré par WireGuard [1, 2].
- **Le trafic ne passe pas par le service de coordination** ; les clés privées restent sur l'appareil [2, 6]. Un appareil ne reçoit que les clés publiques des appareils qu'il a le droit de joindre [3].
- **Adresses** : chaque nœud reçoit une adresse dans la plage CGNAT `100.x.y.z` [4].
- **Connexions** : toute connexion commence relayée par un serveur **DERP**, puis tente de passer en direct (UDP, traversée de NAT), sinon par un *Peer Relay*, sinon reste sur DERP. Tout est chiffré de bout en bout ; un serveur DERP ne peut pas déchiffrer [5, 6].
- **Réseau** : en général aucun port entrant à ouvrir. Le client sort en TCP 443 (coordination, DERP), TCP 80 (coordination, préféré), UDP depuis le port source 41641 (WireGuard direct) et UDP 3478 (STUN). Domaines du plan de contrôle : `login.tailscale.com`, `controlplane.tailscale.com`, sur la plage fixe `192.200.0.0/24` depuis juillet 2025 [7, 8].
- **Identité** : clé de nœud générée sur l'appareil, liée à l'utilisateur après authentification auprès du fournisseur d'identité ; expiration par défaut 180 jours [9]. Une **clé d'authentification** (`tailscale up --auth-key=tskey-…`) enregistre un appareil sans navigateur, avec l'identité de celui qui l'a créée ; elle peut être à usage unique ou réutilisable (« très dangereuse si volée »), et expire entre 1 et 90 jours [10, 11].

## 2. À quoi ressemblent les incidents

| Type | Ce qui se passe | Exemples publiés |
|---|---|---|
| **Tailscale installé par l'attaquant comme accès de secours** | Un script installe Tailscale (souvent avec un serveur OpenSSH), avec une clé d'authentification écrite en dur : le poste rejoint **le tailnet de l'attaquant**. La connexion est sortante, donc aucun port n'est ouvert, et le chemin ne dépend pas du C2. | Cyble, juillet 2024 : compte admin local créé, Tailscale installé par Chocolatey, clé en dur, suppression de clés de registre pour cacher l'installation, OpenSSH Server démarré [23]. Cato CTRL, *Operation Poisson*, 2026 : Tailscale + OpenSSH installés le 7 avril, le C2 Havoc tombe le lendemain, l'accès tient jusqu'au retour du C2 le 26 avril (18 jours) [24]. CISA AA23-320A : Tailscale cité parmi les outils légitimes de Scattered Spider [26]. |
| **Clé d'authentification volée, dans votre tailnet** | Une clé réutilisable fuit (dépôt, CI, poste) : un nœud étranger rejoint votre tailnet avec l'identité du créateur de la clé, et les tags de la clé. | Risque documenté par Tailscale (« Be very careful with reusable keys ») [10] ; bulletin TS-2025-007 (une clé à usage unique pouvait enregistrer plusieurs nœuds par requêtes simultanées, corrigé côté serveur, 7 nov. 2025) [30]. |
| **Failles du produit** | Contournement de politique, élévation via Tailscale SSH, Tailnet Lock non appliqué, etc. | 17 bulletins en 2026 (TS-2026-001 à 017), ex. TS-2026-014 : transfert de sockets Unix vers des sockets root (corrigé en 1.104.4) ; TS-2025-008 : Tailnet Lock non appliqué sans répertoire d'état (corrigé en 1.90.8) [27]. |

## 3. Quels journaux, et ce qu'ils voient

| Journal | Contenu | Activation, rétention, accès | Limites utiles en enquête |
|---|---|---|---|
| **Journal d'audit de configuration** | Qui a changé quoi, quand : `action`, `actor` (`loginName`), `origin` (`ADMIN_UI`, `NODE`…), `target` (`type`, `name`, `property`), `old`/`new`, `eventGroupID`. Ajout d'un nœud = `Update name for node`, `Create node`, `Update key expiry time for node`, `Log in node` (+ `Approve node`). Création de clé : `Create API key` sur une cible *Auth key*. Politique : diff complet [12, 13, 14]. | Toujours actif, impossible à désactiver, 90 derniers jours ; console, API `/api/v2/tailnet/{tailnet}/logging/configuration` (`logs:configuration:read`) ; streaming SIEM en Premium/Enterprise [12, 20]. | Ne couvre que **votre** tailnet. Un poste joint au tailnet d'un attaquant apparaît dans le journal de l'attaquant, pas dans le vôtre [28]. |
| **Flow logs (network flow logs)** | Qui a parlé à qui : `nodeId`, `srcNode`, `dstNodes`, compteurs `virtualTraffic`, `subnetTraffic`, `exitTraffic`, `physicalTraffic` (`proto`, `src`, `dst`, `txPkts`/`txBytes`, `rxPkts`/`rxBytes`), fenêtres de 5 s [15]. | Désactivés par défaut ; Premium et Enterprise ; 30 derniers jours ; API (`logs:network:read`) ou streaming, pas de vue dans la console [15, 17]. | Seulement les connexions réussies (pas les refus) ; jamais le contenu ; pas l'utilisateur ; IP publiques derrière un exit node non journalisées sauf *Destination Logging* ; journalisation côté client, sans garantie d'intégrité ni de délai ; coupée si le client tourne avec `--no-logs-no-support` [16, 19]. |
| **Journaux du client** | Fonctionnement du client et tentatives de connexion. | Windows `C:\ProgramData\Tailscale` (sous-dossier `Logs`) ; Linux `journalctl -u tailscaled` ; macOS Console, recherche `IPN` ; Android `com.tailscale.ipn` [18]. | Sur la machine elle-même : c'est la trace qui reste quand le poste a rejoint un tailnet étranger. |
| **Sur le poste (hors Tailscale)** | Processus `tailscale.exe`, service, installation, connexions sortantes vers le plan de contrôle et UDP 41641 ; `tailscale status --json` → `CurrentTailnet.Name` donne le tailnet courant [7, 8, 21, 25]. | EDR, proxy, DNS, pare-feu. | À comparer avec la liste des machines où Tailscale est prévu, et avec le nom de votre tailnet. |

## 4. Que faire

1. **Chasser sur les postes** (EDR, proxy, DNS) : Tailscale et un serveur OpenSSH là où ils ne sont pas prévus ; connexions vers `controlplane.tailscale.com` / `login.tailscale.com` ; tunnels `ssh -R` [8, 25]. Sur un poste suspect : `tailscale status --json` et comparer `CurrentTailnet.Name` [21].
2. **Imposer votre tailnet** sur les postes gérés : politique système `Tailnet` = `required:<ID de tailnet ou d'organisation>` (registre Windows, MDM, profils macOS) ; l'appareil ne peut alors s'enregistrer dans aucun autre tailnet. Politiques système : offres Standard, Premium, Enterprise [22].
3. **Dans votre tailnet** : récupérer l'audit dans le SIEM (API ou streaming), alerter sur `Create node` / `Log in node` inattendus et sur la création de clés ; activer les flow logs si l'offre le permet ; préférer des clés à usage unique, courtes, taguées, et l'approbation des appareils [10, 12, 14, 15].

## 5. Limites de cette recherche

- Le rapport primaire de Cato CTRL n'a pas pu être lu ici (page rendue en JavaScript) : le cas Poisson repose sur deux résumés concordants (The Hacker News, SOC Prime).
- Pas de tailnet réel disponible : les événements montrés sont les exemples publiés par Tailscale.
- Les mentions d'APT31 utilisant Tailscale (presse) n'ont pas été recoupées et ne sont pas utilisées.
