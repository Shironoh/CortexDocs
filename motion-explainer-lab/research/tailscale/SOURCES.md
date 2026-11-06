# Fiche sources — « Tailscale : comment ça marche, à quoi ressemblent les incidents, quels journaux » (épisode 1)

Consultées le 6 novembre 2026. Niveau : **P** primaire · **R** recoupé (deux sources indépendantes) · **D** déduit des sources primaires (raisonnement dit comme tel) · **?** à vérifier (hors narration).
Textes bruts conservés dans `raw/` (documentation Tailscale en Markdown, bulletins, rapports) ; toutes les citations ci-dessous ont été relues dans ces textes, pas dans des résumés.

## Sources

| Clé | Source | URL | Date / version |
|---|---|---|---|
| CDP | Tailscale docs, *Control and data planes* | https://tailscale.com/docs/concepts/control-data-planes | validée le 5 janv. 2026 |
| CON | Tailscale docs, *Connection types* | https://tailscale.com/docs/reference/connection-types | validée le 1er juin 2026 |
| DERP | Tailscale docs, *DERP servers* | https://tailscale.com/docs/reference/derp-servers | validée le 21 janv. 2026 |
| FW | Tailscale docs, *What firewall ports should I open to use Tailscale?* | https://tailscale.com/docs/reference/faq/firewall-ports | validée le 2 févr. 2026 |
| IP | Tailscale docs, *What are these 100.x.y.z addresses?* | https://tailscale.com/docs/concepts/tailscale-ip-addresses | validée le 12 janv. 2026 |
| NK | Tailscale docs, *Node keys* | https://tailscale.com/docs/concepts/node-keys | validée le 5 janv. 2026 |
| AK | Tailscale docs, *Auth keys* | https://tailscale.com/docs/features/access-control/auth-keys | validée le 30 juin 2026 |
| AUD | Tailscale docs, *Configuration audit logging* | https://tailscale.com/docs/features/logging/audit-logging | validée le 5 janv. 2026 |
| NFL | Tailscale docs, *Network flow logs* | https://tailscale.com/docs/features/logging/network-flow-logs | validée le 23 janv. 2026 |
| LOG | Tailscale docs, *Logging overview* | https://tailscale.com/docs/features/logging | validée le 5 janv. 2026 |
| TSD | Tailscale docs, *tailscaled daemon* | https://tailscale.com/docs/reference/tailscaled | validée le 5 janv. 2026 |
| STR | Tailscale docs, *Log streaming* | https://tailscale.com/docs/features/logging/log-streaming | validée le 2 févr. 2026 |
| POL | Tailscale docs, *Customize Tailscale using system policies* | https://tailscale.com/docs/features/tailscale-system-policies | consultée le 6 nov. 2026 |
| CODE | Code source Tailscale, `ipn/ipnstate/ipnstate.go` (branche main) | https://github.com/tailscale/tailscale/blob/main/ipn/ipnstate/ipnstate.go | main au 6 nov. 2026 |
| SB | Tailscale, *Security Bulletins* | https://tailscale.com/security-bulletins | dernier bulletin TS-2026-017, 26 oct. 2026 |
| CYB | Cyble Research & Intelligence Labs, *New Malware Campaign Abusing RDPWrapper and Tailscale to Target Cryptocurrency Users* | https://cyble.com/blog/new-malware-campaign-abusing-rdpwrapper-and-tailscale-to-target-cryptocurrency-users/ | 17 juill. 2024 |
| THN | The Hacker News, *Junior Hacker Used Tailscale and OpenSSH to Keep Access After His C2 Went Offline* (résume Cato CTRL, *Operation Poisson*) | https://thehackernews.com/2026/06/junior-hacker-used-tailscale-and.html | juin 2026 |
| SOCP | SOC Prime, *Operation Poisson: Breaking Down an Entire Cybercriminal Operation* (résume le même rapport) | https://socprime.com/active-threats/operation-poisson-breaking-down-an-entire-cybercriminal-operation/ | juin 2026 |
| CATO | Cato CTRL, *Operation Poisson* (source primaire du cas, page rendue en JavaScript, non lisible ici) | https://www.catonetworks.com/blog/cato-ctrl-operation-poisson-analyzing-a-cybercriminals-entire-operation/ | juin 2026 |
| CISA | CISA, avis AA23-320A *Scattered Spider*, table 1 « Legitimate Tools Used by Scattered Spider » | https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-320a | publié le 16 nov. 2023, révisé le 29 juill. 2025 |

## Faits

| # | Fait | Valeurs | Source (citation exacte) | Niveau |
|---|---|---|---|---|
| 1 | Le plan de contrôle passe par le service de coordination ; le plan de données tourne sur chaque appareil | — | CDP : « the control plane operates through the Tailscale coordination service, while the data plane runs on each tailnet device » | P |
| 2 | Le service de coordination distribue clés publiques et politiques d'accès ; aucun trafic ne passe par lui | — | CDP : « It handles essential functions including device discovery, authentication, key distribution, and policy enforcement » ; « Tailscale doesn't route any traffic through the coordination service, device keys are stored locally » | P |
| 3 | Un appareil ne connaît que les clés publiques des appareils qu'il a le droit d'atteindre | — | CDP : « The coordination service only permits devices to access the public keys of devices and resources they're allowed to access » | P |
| 4 | Adresses Tailscale dans la plage CGNAT 100.x.y.z | 100 | IP (titre et résumé) : « Tailscale uses 100.x.y.z IP addresses from the Carrier-Grade NAT (CGNAT) range » | P |
| 5 | Trois types de connexion (directe UDP, relais DERP, Peer Relay), tous chiffrés de bout en bout par WireGuard ; toute connexion commence relayée par DERP puis tente de passer en direct | — | CON : « All three options are end-to-end encrypted with WireGuard » ; « All connections start as relayed through a DERP server, and Tailscale then tries to upgrade them to a direct connection » | P |
| 6 | Un serveur DERP ne peut pas déchiffrer le trafic : les clés privées ne quittent jamais l'appareil | — | DERP : « Because Tailscale private keys never leave the local device that generated them, it's impossible for a DERP server to decrypt your traffic » | P |
| 7 | En général, aucun port à ouvrir ; connexions sortantes TCP 443 (coordination, DERP), UDP depuis le port source 41641 (WireGuard direct), UDP 3478 (STUN), TCP 80 (coordination, préféré) | 443 ; 41641 ; 3478 ; 80 | FW : « Most of the time, you don't need to open any firewall ports for Tailscale » ; « Direct WireGuard tunnels use UDP with a source port that defaults to 41641 » | P |
| 8 | Domaines du plan de contrôle : `login.tailscale.com`, `controlplane.tailscale.com` ; plage fixe depuis juillet 2025 | 2025 ; 192.200.0.0/24 | FW : « In July of 2025, the domains login.tailscale.com and controlplane.tailscale.com began resolving to static IP address ranges registered to Tailscale » ; « IPv4: 192.200.0.0/24 » | P |
| 9 | Clés de nœud : générées sur l'appareil, partie publique envoyée au serveur de coordination ; expirent par défaut tous les 180 jours | 180 | NK (étapes 1-6) ; AK : « By default, node keys automatically expire every 180 days » | P |
| 10 | Clé d'authentification (auth key) : enregistre un appareil sans navigateur, avec l'identité de l'utilisateur qui l'a générée ; une-fois ou réutilisable ; expiration 1 à 90 jours | 1 ; 90 | AK : « Pre-authentication keys (called auth keys) let you register new nodes without needing to sign in using a web browser » ; « Be very careful with reusable keys! These can be very dangerous if stolen. » ; « between 1 and 90 inclusive » | P |
| 11 | Enregistrement par `tailscale up --auth-key=…` | — | AK : `sudo tailscale up --auth-key=tskey-abcdef1432341818` | P |
| 12 | Journal d'audit de configuration : qui, quoi, quand ; toujours actif, impossible à désactiver ; 90 derniers jours | 90 | AUD : « Configuration audit logs let you identify who did what, and when, in your tailnet » ; « Configuration audit logs are always enabled for all tailnets and cannot be disabled » ; « available for the most recent 90 days » | P |
| 13 | Champs d'un événement d'audit : `action`, `actor` (`loginName`, `type`), `origin` (`ADMIN_UI`, `NODE`…), `target` (`type`, `name`, `property`), `old`/`new`, `eventGroupID` ; API `/api/v2/tailnet/{tailnet}/logging/configuration`, portée `logs:configuration:read` | — | AUD (exemple JSON publié) | P |
| 14 | Ajout d'un nœud au tailnet = « Update name for node », « Create node », « Update key expiry time for node », « Log in node » (puis « Approve node » si l'approbation est active) ; création de clé = « Create API key » (cible « Auth key ») | — | AUD, tables « Events » et « Multiple events for a single operation » | P |
| 15 | Flow logs : « qui a parlé à qui » ; désactivés par défaut ; offres Premium et Enterprise ; 30 derniers jours ; fenêtres de 5 s ; champs `virtualTraffic`, `subnetTraffic`, `exitTraffic`, `physicalTraffic` (`proto`, `src`, `dst`, `txBytes`, `rxBytes`…) | 30 ; 5 | NFL : « Network flow logs are disabled by default » ; « available for the Premium and Enterprise plans » ; « available for the most recent 30 days » ; « Network logs are gathered in 5 second windows » | P |
| 16 | Flow logs : seules les connexions réussies sont journalisées (pas les refus) ; jamais le contenu ; pas l'utilisateur ; journalisation côté client, sans garantie d'intégrité ni de temps réel | — | NFL : « Tailscale only logs successful connects. If a connection attempt results in denied access, the attempt isn't logged » ; « Tailscale does not log the actual contents or data of the network traffic » ; « Network logging is performed client-side » | P |
| 17 | Flow logs uniquement par API (`logs:network:read`) ou streaming : pas de vue dans la console | — | NFL, Limitations : « There is no network logs viewing functionality in the Tailscale admin console » | P |
| 18 | Journaux du client : Windows `C:\ProgramData\Tailscale` ; Linux `journalctl -u tailscaled` ; macOS Console, recherche `IPN` ; Android `com.tailscale.ipn` | — | LOG, section Client logs ; TSD : « On Windows, refer to C:\ProgramData\Tailscale\Logs » | P |
| 19 | Le client peut couper sa télémétrie (`--no-logs-no-support`, `TS_NO_LOGS_NO_SUPPORT`) ; les flow logs ne sont alors plus envoyés | — | LOG ; NFL : « When network flow logs are enabled (and not using --no-logs-no-support) » | P |
| 20 | Streaming des journaux (audit et flow logs) vers un SIEM : offres Premium et Enterprise | — | STR : « Log streaming is available for the Premium and Enterprise plans » | P |
| 21 | `tailscale status --json` expose `CurrentTailnet` (`Name`, `StableID`, `MagicDNSSuffix`) : le tailnet auquel le nœud est connecté | — | CODE : `CurrentTailnet *TailnetStatus` ; « Name is the name of the network that's currently in use » | P |
| 22 | Politique système `Tailnet` : avec le préfixe `required:`, l'appareil ne peut être enregistré dans aucun autre tailnet ; Windows (registre, déployable par MDM) depuis 1.52 ; politiques système réservées aux offres Standard, Premium et Enterprise | 1.52 | POL : « If the policy value is prefixed with required:, Tailscale requires one of those values and won't allow devices to be registered in any other tailnet » ; « System policies are available for the Standard, Premium, and Enterprise plans » | P |
| 23 | Cas Cyble (2024) : script qui crée un compte administrateur local, installe Tailscale par Chocolatey avec une clé d'authentification écrite en dur ; le poste rejoint le réseau privé de l'attaquant (connexion inverse initiée par la victime) ; suppression de clés de registre de Tailscale dont l'entrée de désinstallation ; installation et démarrage d'un serveur OpenSSH | 2024 | CYB : « uses Chocolatey to install Tailscale » ; « The script includes a hardcoded Tailscale authentication key. The victim's machine is added to the attacker's private network using this key. » ; « reg delete … to eliminate traces of the Tailscale installation » ; « it installs the OpenSSH server, starts the SSH service » ; « the victim's system initiates the reverse connection » | P |
| 24 | Cas Poisson (Cato CTRL, 2026) : le 7 avril, installation d'OpenSSH Server et de Tailscale, poste joint au réseau Tailscale privé de l'opérateur ; le C2 Havoc tombe le lendemain ; l'accès survit ; retour du C2 le 26 avril, soit 18 jours | 7 ; 26 ; 18 ; 2026 | THN : « he installed OpenSSH Server and Tailscale, joined the victim's machine to his private Tailscale network » ; « Eighteen days later, the C2 came back » ; SOCP (même récit) | R (deux secondaires concordantes ; primaire non lisible ici) |
| 25 | Recommandations Cato (via THN) : surveiller `tailscale.exe` sur des machines sans raison d'avoir un VPN ; alerter sur l'installation d'OpenSSH Server sur un poste Windows ; chercher les tunnels `ssh -R` | — | THN : « Watch for tailscale.exe on machines that have no reason to run a VPN. » | R |
| 26 | Tailscale cité parmi les outils légitimes utilisés par Scattered Spider | 2023 | CISA, table 1 : « Tailscale — Provides virtual private networks (VPNs) to secure network communications » | P (vérifié via une extraction de la page, la page est bloquée en accès direct) |
| 27 | Failles du produit publiées dans des bulletins : 17 bulletins en 2026 (TS-2026-001 à 017), ex. TS-2026-014 (transfert de sockets Unix de Tailscale SSH vers des sockets root, corrigé en 1.104.4) ; TS-2025-008 (Tailnet Lock non appliqué sans répertoire d'état, corrigé en 1.90.8) | 17 ; 2026 ; 1.104.4 ; 1.90.8 | SB | P |
| 28 | Le journal d'audit est celui du tailnet dont on modifie la configuration : un poste qui rejoint le tailnet d'un tiers apparaît dans le journal de ce tiers, pas dans le vôtre | — | déduit de AUD (« actions that modify a tailnet's configuration ») et de CYB/THN (poste joint au réseau de l'attaquant) | D |
| 29 | Les deux cas suivent le même schéma : Tailscale + serveur OpenSSH, poste joint au tailnet de l'attaquant | — | CYB + THN | R |
| 30 | TS-2025-007 : une clé d'authentification à usage unique pouvait enregistrer plusieurs nœuds si les requêtes arrivaient en même temps (TOCTOU) ; corrigé côté serveur | 2025 | SB : « A one-off auth key could be reused from multiple devices » ; « These registration attempts would have to happen at approximately the same time to succeed » (7 nov. 2025) | P |

## Artefacts montrés à l'écran (vrais noms, vraies valeurs)

`tailscale up --auth-key=tskey-…` · `100.x.y.z` · `controlplane.tailscale.com` · `UDP 41641` · `Create node` / `Log in node` / `Create API key` (journal d'audit) ·
`virtualTraffic`, `txBytes` (flow logs) · `C:\ProgramData\Tailscale` · `journalctl -u tailscaled` · `tailscale status --json` → `CurrentTailnet.Name` ·
politique système `Tailnet` = `required:T…CNTRL`.

Aucun tailnet réel n'est disponible ici : les exemples d'événements sont ceux publiés par Tailscale dans sa documentation, montrés comme tels.

## À vérifier (hors narration)

- Détails propres au rapport primaire de Cato CTRL (commandes exactes, mode d'enregistrement du poste) : non lus, page rendue en JavaScript.
- Rapports de presse mentionnant APT31 et Tailscale (cités par THN) : non recoupés, non utilisés.
