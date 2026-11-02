# QA automatique — llmjacking

```json
{
 "beat_gaps_gt2_5s": [],
 "cues_under_beat_quota": [],
 "moving_captures": 9,
 "duration_s": 171.7,
 "cues": 22,
 "scenes": 7,
 "say_words": 405,
 "words_per_min": 141.5,
 "captures": 66,
 "captures_with_issue": 47,
 "issues": {
  "small": 40,
  "toomanytext": 15,
  "focus_small": 23,
  "focus_offcenter": 10,
  "focus_hidden": 9,
  "cut": 17,
  "subj_in_band": 5,
  "subband": 7,
  "subj_cut": 7
 },
 "frozen_windows_gt2_5s": [],
 "avg_text_blocks": 3.61,
 "avg_onscreen_words": 8.15,
 "avg_empty": 0.081,
 "shot_values_per_scene": {
  "s1": [
   0.85,
   1.41,
   2.2
  ],
  "s2": [
   0.87,
   1.36
  ],
  "s3": [
   0.89,
   1.31
  ],
  "s4": [
   0.96,
   2.4
  ],
  "s5": [
   0.79,
   1.2,
   2.4
  ],
  "s6": [
   0.88,
   1.26
  ],
  "s7": [
   0.78,
   1.06
  ]
 },
 "scenes_lt3_shot_values": [
  "s2",
  "s3",
  "s4",
  "s6",
  "s7"
 ],
 "analyst_acting_scenes": "7/7",
 "villain_scenes": "3/7",
 "js_errors": [],
 "mobile_hscroll": false,
 "sound_events": 100
}
```

## Captures signalées

- `c2` 25 % : small(39.3) « Facture cloud · projet IA »; small(39.3) « cumul observé : jusqu'à 1 M$ »; toomanytext(5) « Facture cloud · projet IA | + 100 000 $ / jour | cumul observé : jusqu'à 1 M$ | LLMjacking | pas du minage »; focus_small(0.022)
- `c2` 50 % : small(39.3) « Facture cloud · projet IA »; small(39.3) « cumul observé : jusqu'à 1 M$ »; toomanytext(4) « Facture cloud · projet IA | + 100 000 $ / jour | cumul observé : jusqu'à 1 M$ | LLMjacking »; focus_small(0.022)
- `c2` 75 % : small(39.8) « Facture cloud · projet IA »; small(39.8) « cumul observé : jusqu'à 1 M$ »; toomanytext(4) « Facture cloud · projet IA | + 100 000 $ / jour | cumul observé : jusqu'à 1 M$ | LLMjacking »; focus_offcenter([223, 384])
- `c3` 25 % : focus_hidden; focus_offcenter([1533, 601]); focus_small(0.004)
- `c3` 50 % : focus_hidden; focus_offcenter([1533, 601]); focus_small(0.004)
- `c3` 75 % : small(39.5) « caméras »
- `c4` 25 % : focus_hidden; focus_small(0)
- `c4` 75 % : focus_small(0.067)
- `c5` 25 % : toomanytext(4) « compte de service | jeton GitHub | session | {"max_tokens »; focus_small(0.054)
- `c5` 75 % : cut « jeton GitHub »
- `c6` 25 % : subj_in_band « perso:hero »
- `c8` 25 % : subj_in_band « perso:hero »
- `c8` 50 % : small(40) « toujours écrit »; subj_in_band « perso:hero »
- `c8` 75 % : cut « google.api.serviceusage.v1.ServiceUsage. »
- `c9` 25 % : toomanytext(4) « Google Cloud · journal Admin Activity | google.api.serviceusage.v1.ServiceUsage. | AWS · CloudTrail | PutUseCaseForModelAccess | CreateFoundationModelAgreement »; subj_in_band « perso:hero »
- `c9` 50 % : toomanytext(4) « Google Cloud · journal Admin Activity | google.api.serviceusage.v1.ServiceUsage. | AWS · CloudTrail | PutUseCaseForModelAccess | CreateFoundationModelAgreement »
- `c9` 75 % : cut « Google Cloud · journal Admin Activity »; cut « google.api.serviceusage.v1.ServiceUsage. »; cut « AWS · CloudTrail »; cut « PutUseCaseForModelAccess »; cut « CreateFoundationModelAgreement »; toomanytext(4) « Google Cloud · journal Admin Activity | google.api.serviceusage.v1.ServiceUsage. | AWS · CloudTrail | PutUseCaseForModelAccess | CreateFoundationModelAgreement »; focus_hidden; focus_small(0.016); subj_in_band « perso:foe »
- `c10` 25 % : cut « google.api.serviceusage.v1.ServiceUsage. »; focus_offcenter([858, 115]); focus_small(0.016)
- `c10` 50 % : cut « google.api.serviceusage.v1.ServiceUsage. »; focus_offcenter([857, 118]); focus_small(0.013)
- `c10` 75 % : cut « google.api.serviceusage.v1.ServiceUsage. »; focus_offcenter([857, 118]); focus_small(0.013)
- `c11` 75 % : subband « DeleteModelInvocationLoggingConfiguratio »
- `c12` 50 % : small(38.5) « compte ≠ pipeline IaC → haute sévérité »
- `c13` 25 % : focus_offcenter([800, 135]); focus_small(0.009)
- `c13` 50 % : cut « Google Cloud »; cut « GenerateContent »; cut « Data Access : off »; toomanytext(4) « AWS | InvokeModel | par défaut : oui | Google Cloud | GenerateContent | Data Access : off »; focus_hidden; focus_offcenter([1485, -136]); focus_small(0)
- `c13` 75 % : cut « InvokeModel »; cut « par défaut : oui »; cut « Completions »; cut « diagnostic : off »; toomanytext(6) « AWS | InvokeModel | par défaut : oui | Google Cloud | GenerateContent | Data Access : off | Azure | Completions | diagnostic : off »; focus_small(0.008)
- `c14` 25 % : small(41.2) « AWS »; small(39.6) « par défaut : oui »; small(41.2) « Google Cloud »; small(39.6) « Data Access : off »; small(41.2) « Azure »; small(39.6) « diagnostic : off »; small(41.2) « CloudTrail · exemple publié par AWS »; small(34.9) « "eventName": "ConverseStream", »; small(34.9) « "eventType": "AwsServiceEvent", »; small(34.9) « "inputTokens": 18694, "outputTokens": 35 »; toomanytext(8) « AWS | InvokeModel | par défaut : oui | Google Cloud | GenerateContent | Data Access : off | Azure | Completions | diagnostic : off | CloudTrail · exemple publié par AWS | "eventName": "ConverseStream", | "eventType": "AwsServiceEvent", | "inputTokens": 18694, "outputTokens": 35 »
- `c14` 50 % : small(41.2) « AWS »; small(39.6) « par défaut : oui »; small(41.2) « Google Cloud »; small(39.6) « Data Access : off »; small(41.2) « Azure »; small(39.6) « diagnostic : off »; small(41.2) « CloudTrail · exemple publié par AWS »; small(34.9) « "eventName": "ConverseStream", »; small(34.9) « "eventType": "AwsServiceEvent", »; small(34.9) « "inputTokens": 18694, "outputTokens": 35 »; toomanytext(8) « AWS | InvokeModel | par défaut : oui | Google Cloud | GenerateContent | Data Access : off | Azure | Completions | diagnostic : off | CloudTrail · exemple publié par AWS | "eventName": "ConverseStream", | "eventType": "AwsServiceEvent", | "inputTokens": 18694, "outputTokens": 35 »
- `c14` 75 % : toomanytext(5) « Google Cloud | GenerateContent | Data Access : off | Azure | Completions | diagnostic : off | Azure : Diagnostic Logs »; focus_small(0.04)
- `c15` 25 % : toomanytext(6) « AWS | InvokeModel | par défaut : oui | Google Cloud | GenerateContent | Data Access : off | Azure | Completions | diagnostic : off »; focus_hidden; focus_small(0.034)
- `c15` 50 % : toomanytext(6) « AWS | InvokeModel | par défaut : oui | Google Cloud | GenerateContent | Data Access : off | Azure | Completions | diagnostic : off »; focus_hidden; focus_small(0.034)
- `c15` 75 % : toomanytext(6) « AWS | InvokeModel | par défaut : oui | Google Cloud | GenerateContent | Data Access : off | Azure | Completions | diagnostic : off »; focus_hidden; focus_small(0.034)
- `c16` 25 % : focus_offcenter([-1277, 82]); focus_small(0)
- `c17` 50 % : subband « < 8 h »
- `c17` 75 % : focus_offcenter([838, 132])
- `c18` 50 % : subband « mixer »
- `c19` 25 % : focus_hidden; focus_small(0); subj_cut « perso:hero »
- `c19` 50 % : subj_cut « perso:hero »
- `c19` 75 % : subj_cut « perso:hero »
- `c20` 25 % : small(34.7) « 2 · Data Access : ON · coupure → alerte »; subj_cut « perso:hero »
- `c20` 50 % : subj_cut « perso:hero »
- `c20` 75 % : subj_cut « perso:hero »
- `c21` 25 % : subj_cut « perso:hero »
- `c21` 50 % : subband « activation »; subband « consommation »
- `c21` 75 % : subband « activation »; subband « consommation »
- `c22` 25 % : small(43.5) « clé »; small(43.5) « activation »; small(43.5) « caméras »; small(43.5) « consommation »; small(43.5) « facture »; focus_small(0.003)
- `c22` 50 % : focus_small(0.003)
- `c22` 75 % : small(43.5) « clé »; small(43.5) « activation »; small(43.5) « caméras »; small(43.5) « consommation »; small(43.5) « facture »; focus_small(0.003)