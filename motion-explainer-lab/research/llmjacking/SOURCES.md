# Fiche sources — « LLMjacking : comprendre et détecter » (épisode 1)

Consultées le 2 novembre 2026. Niveau : **P** primaire · **R** recoupé · **?** à vérifier (hors narration).
Source principale : GTIG / Mandiant, *The Rise of LLMJacking: How Threat Actors Monetize Compromised Cloud and Model Resources*,
Google Cloud Blog, 2 novembre 2026 — https://cloud.google.com/blog/topics/threat-intelligence/llmjacking-monetizing-compromised-cloud-models
(texte brut extrait et vérifié mot à mot : `article.txt`). Aucun environnement cloud réel disponible ici : les artefacts montrés sont
les noms exacts de méthodes tirés de l'article et de la documentation, et l'exemple d'événement CloudTrail publié par AWS.

| # | Fait | Valeurs | Source (citation) | Niveau |
|---|---|---|---|---|
| 1 | Plusieurs incidents traités par Mandiant en 2026 : accès d'entreprise aux LLM détourné | 2026 | article : « Mandiant responded to multiple incidents in 2026 in which threat actors hijacked enterprise access to Large Language Models (LLMs), a tactic known as "LLMJacking." » | P |
| 2 | Plus de 100 000 $ de frais frauduleux en une journée ; jusqu'à 1 million $ cumulés | 100 000 ; 1 | article : « exceeding $100,000 USD in a single day, with cumulative charges at some organizations reaching $1 million USD before access was revoked » | P |
| 3 | Accès initial dominant : jetons d'identité cloud exposés ou volés (clés de comptes de service, PAT GitHub, jetons de session) | — | article : « the dominant initial access vector has been exposed or stolen cloud identity tokens—including IAM credentials, Service Account keys, GitHub Personal Access Tokens (PATs), and active session tokens » | P |
| 4 | Validation discrète des clés volées par requêtes d'un seul token (`max_tokens=1`), sous les seuils d'alerte de volume | 1 | article : « automated credential validation sweeps using minimal single-token requests (max_tokens=1) … remaining undetected by the victim's endpoint detection and response (EDR) and SIEM volume anomaly alerts » | P |
| 5 | Dans plusieurs incidents, les services LLM n'étaient pas activés : l'attaquant les active ; toute activation non autorisée = événement critique | — | article : « treat any unauthorized enablement as a critical security event. In multiple incidents that Mandiant investigated, LLM services were not enabled at the time of compromise » | P |
| 6 | Google Cloud : activation via `google.api.serviceusage.v1.ServiceUsage.EnableService` ; journal Admin Activity, toujours écrit | — | article (méthode) ; docs Service Usage (EnableService = « Admin activity ») ; docs Cloud Audit Logs : « Admin Activity audit logs are always written; you can't configure, exclude, or disable them » | R |
| 7 | AWS : déblocage de modèles via `PutUseCaseForModelAccess` et `CreateFoundationModelAgreement` | — | article | P |
| 8 | AWS : `GetModelInvocationLoggingConfiguration`, `Put…`, `Delete…` ; désactivation par un principal hors IaC = haute sévérité | — | article : « Any calls to disable logging by non-IaC (Infrastructure as Code) principals should be treated as high severity » | P |
| 9 | Google Cloud : `google.iam.v1.IAMPolicy.GetIamPolicy` pour vérifier si les journaux Data Access sont actifs ; `ConfigServiceV2.ListSinks` | — | article | P |
| 10 | Google Cloud : inférence (`PredictionService.Predict`, `GenerateContent`, `StreamGenerateContent`) dans les journaux Data Access, désactivés par défaut | — | article : « inference operations are contained within Data Access logs, which are disabled by default due to volume and ingestion costs » ; docs Cloud Audit Logs : « Except for BigQuery, Data Access audit logs are disabled by default » ; docs Agent Platform : `endpoints.predict` en Data Access (DATA_READ) | R |
| 11 | AWS : `InvokeModel`, `InvokeModelWithResponseStream`, `Converse`, `ConverseStream` journalisés comme événements de gestion (par défaut) | — | docs Bedrock/CloudTrail : « Amazon Bedrock logs Amazon Bedrock Runtime API operations (InvokeModel, InvokeModelWithResponseStream, Converse, and ConverseStream) as management events » ; « CloudTrail logs management event API operations by default » | P |
| 12 | AWS : événement de fin de flux (`AwsServiceEvent`) avec les tokens ; exemple publié : `inputTokens` 18694, `outputTokens` 356 | 18694 ; 356 | docs Bedrock/CloudTrail, « Stream-completion events » (exemple) | P |
| 13 | Azure : appels de complétion = plan de données, visibles via les journaux de diagnostic ; `Microsoft.CognitiveServices/accounts/deployments/write` ; `Microsoft.Insights/diagnosticSettings/delete` | — | article | P |
| 14 | Pics d'erreurs `ThrottlingException`, `ValidationException`, `ResourceNotFoundException` = « spraying » automatisé | — | article | P |
| 15 | « LLM Mixers » : passerelles illicites qui agrègent et revendent l'accès ; outils new-api et gcli2api | — | article : « illicit routing gateways that proxy, aggregate, and resell unauthorized LLM access to underground subscribers » | P |
| 16 | Jet Night : plus de 500 000 appels en moins de 8 heures ; près d'un million de dollars ; abonnement « illimité » ≈ 60 $/mois contre 100 à 250 $ | 500 000 ; 8 ; 60 ; 100 ; 250 | article : « executed more than 500,000 LLM API calls in less than eight hours » ; « passed nearly one million dollars in token costs » ; « approximately $60 USD per month … typically run between $100 and $250 per month » | P |
| 17 | Contournement des limites : « burn and rotate », comptes de service éphémères créés et supprimés | — | article | P |
| 18 | LiteLLM : CVE-2026-40217 (`/key/regenerate`, élévation en PROXY_ADMIN) | 2026 ; 40217 | article | P (hotspot seulement) |
| 19 | Mesures : quotas d'API par modèle et plafonds de dépenses ; clés segmentées par modèle et environnement ; scan de secrets dans le code | — | article (Budget Alerts, Granular API Key Scopes, Code Monitoring) | P |

**Cas du fil rouge** : composite, construit à partir d'éléments décrits par l'article (clé de compte de service exposée, activation du
service, vérification des journaux, consommation à travers un « mixer »). Dit comme tel dans la narration (« un cas type ») et le pied de page.

## Valeurs dérivées
| Valeur | Calcul |
|---|---|
| ≈ 17 appels par seconde | 500 000 / (8 × 3 600) = 17,4 (borne basse : « moins de 8 heures ») |
