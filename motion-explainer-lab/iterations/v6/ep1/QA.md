# QA automatique — ep1

```json
{
 "beat_gaps_gt2_5s": [],
 "cues_under_beat_quota": [],
 "moving_captures": 8,
 "duration_s": 152.0,
 "cues": 16,
 "scenes": 7,
 "say_words": 365,
 "words_per_min": 144.1,
 "captures": 48,
 "captures_with_issue": 25,
 "issues": {
  "focus_small": 11,
  "focus_offcenter": 6,
  "subj_in_band": 7,
  "subj_cut": 8,
  "subband": 2,
  "cut": 1,
  "small": 3,
  "focus_hidden": 3,
  "empty": 1
 },
 "frozen_windows_gt2_5s": [
  [
   46.5,
   50.0,
   "c5"
  ]
 ],
 "avg_text_blocks": 1.25,
 "avg_onscreen_words": 2.19,
 "avg_empty": 0.092,
 "shot_values_per_scene": {
  "s1": [
   0.61,
   0.95,
   1.54,
   2.1
  ],
  "s2": [
   0.89,
   1.23,
   1.95
  ],
  "s3": [
   0.68,
   1.11,
   2.05
  ],
  "s4": [
   0.76,
   1.11,
   2.04
  ],
  "s5": [
   1.11
  ],
  "s6": [
   0.69,
   0.95
  ],
  "s7": [
   0.61
  ]
 },
 "scenes_lt3_shot_values": [
  "s5",
  "s6",
  "s7"
 ],
 "analyst_acting_scenes": "7/7",
 "villain_scenes": "1/7",
 "js_errors": [],
 "mobile_hscroll": false,
 "sound_events": 71
}
```

## Captures signalées

- `c1` 75 % : focus_small(0.042)
- `c2` 25 % : focus_offcenter([1773, 278]); subj_in_band « perso:analyste »; subj_cut « perso:analyste »
- `c2` 50 % : focus_offcenter([1773, 278]); subj_in_band « perso:analyste »; subj_cut « perso:analyste »
- `c2` 75 % : focus_small(0.043); subj_in_band « perso:analyste »; subj_cut « perso:analyste »
- `c3` 50 % : subband « 400 jours »
- `c3` 75 % : subband « 400 jours »
- `c4` 50 % : subj_cut « perso:analyste »
- `c4` 75 % : subj_cut « perso:analyste »
- `c5` 25 % : cut « system_event »
- `c6` 25 % : focus_small(0.005)
- `c6` 50 % : focus_small(0.007)
- `c6` 75 % : focus_offcenter([-413, 443])
- `c7` 25 % : small(31.6) « activity · 03:07:12 »
- `c7` 50 % : focus_small(0.033)
- `c9` 25 % : focus_small(0.039)
- `c10` 75 % : small(35.5) « principalEmail: "ci-deployer@prod-paieme »; subj_cut « perso:analyste »
- `c11` 75 % : focus_small(0.041)
- `c13` 25 % : focus_hidden
- `c14` 25 % : focus_hidden; focus_offcenter([753, 872]); subj_in_band « focus »
- `c14` 50 % : focus_hidden; focus_offcenter([753, 872]); subj_in_band « focus »
- `c14` 75 % : focus_small(0.033)
- `c15` 25 % : focus_small(0.03); subj_in_band « perso:analyste »; subj_cut « perso:analyste »; empty(0.46)
- `c15` 50 % : focus_small(0.028); subj_in_band « perso:analyste »; subj_cut « perso:analyste »
- `c15` 75 % : small(43.1) « Logs Explorer »
- `c16` 25 % : focus_offcenter([-710, 393]); focus_small(0)