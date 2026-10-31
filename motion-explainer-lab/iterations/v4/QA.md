# QA automatique — v4

```json
{
 "beat_gaps_gt2_5s": [],
 "cues_under_beat_quota": [],
 "moving_captures": 13,
 "duration_s": 175.7,
 "cues": 19,
 "scenes": 7,
 "say_words": 425,
 "words_per_min": 145.1,
 "captures": 57,
 "captures_with_issue": 28,
 "issues": {
  "focus_small": 21,
  "subj_in_band": 5,
  "subj_cut": 2,
  "cut": 7,
  "focus_offcenter": 4,
  "toomanytext": 2,
  "overlap": 1
 },
 "frozen_windows_gt2_5s": [],
 "avg_text_blocks": 1.37,
 "avg_onscreen_words": 1.84,
 "avg_empty": 0.071,
 "shot_values_per_scene": {
  "s1": [
   0.61,
   1.07,
   1.54,
   2.1
  ],
  "s2": [
   0.79,
   1.2,
   1.92
  ],
  "s3": [
   0.82,
   1.17,
   2.05
  ],
  "s4": [
   0.89,
   1.51,
   2.04
  ],
  "s5": [
   0.83,
   1.39
  ],
  "s6": [
   0.78,
   1.3,
   3
  ],
  "s7": [
   0.61,
   0.87,
   1.43
  ]
 },
 "scenes_lt3_shot_values": [
  "s5"
 ],
 "analyst_acting_scenes": "7/7",
 "villain_scenes": "2/7",
 "js_errors": [],
 "mobile_hscroll": false,
 "sound_events": 140
}
```

## Captures signalées

- `c2` 75 % : focus_small(0.017); subj_in_band « perso:analyste »
- `c4` 75 % : focus_small(0.029)
- `c7` 25 % : focus_small(0.031)
- `c7` 75 % : subj_in_band « perso:attaquant »; subj_in_band « perso:analyste »; subj_cut « perso:analyste »
- `c8` 50 % : cut « Entrée de 03:07 »
- `c8` 75 % : cut « Entrée de 03:07 »; cut « SetIamPolicy »
- `c9` 50 % : focus_small(0.033)
- `c9` 75 % : focus_small(0.033)
- `c10` 50 % : subj_cut « perso:analyste »
- `c11` 50 % : focus_small(0.024)
- `c11` 75 % : focus_small(0.024)
- `c12` 25 % : cut « factures-clients »; focus_small(0.038)
- `c12` 50 % : cut « factures-clients »; focus_small(0)
- `c12` 75 % : cut « factures-clients »; focus_small(0.078)
- `c14` 25 % : focus_small(0.018)
- `c14` 50 % : focus_offcenter([773, 114]); focus_small(0.051)
- `c14` 75 % : focus_offcenter([773, 114]); focus_small(0.051)
- `c15` 50 % : focus_small(0.012)
- `c15` 75 % : focus_small(0.015)
- `c16` 25 % : focus_offcenter([171, -419]); focus_small(0)
- `c16` 50 % : focus_small(0.017)
- `c16` 75 % : focus_small(0.017)
- `c17` 25 % : subj_in_band « perso:analyste »
- `c17` 50 % : toomanytext(4) « ALERTE | Owner | 03:07 | 03:09 »; subj_in_band « perso:analyste »
- `c17` 75 % : overlap « ALERTE / CONTENU »; toomanytext(4) « ALERTE | CONTENU | 03:07 | 03:09 »; focus_offcenter([226, 40]); focus_small(0.002)
- `c18` 50 % : cut « Logs Explorer »
- `c19` 25 % : focus_small(0.019)
- `c19` 50 % : focus_small(0.019)