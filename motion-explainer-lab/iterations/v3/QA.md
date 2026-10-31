# QA automatique — v3

```json
{
 "beat_gaps_gt2_5s": [],
 "cues_under_beat_quota": [],
 "moving_captures": 12,
 "duration_s": 172.3,
 "cues": 19,
 "scenes": 7,
 "say_words": 416,
 "words_per_min": 144.9,
 "captures": 57,
 "captures_with_issue": 48,
 "issues": {
  "empty": 37,
  "focus_small": 28,
  "subj_in_band": 5,
  "subj_cut": 2,
  "cut": 6,
  "focus_offcenter": 4,
  "toomanytext": 2,
  "overlap": 1
 },
 "frozen_windows_gt2_5s": [
  [
   169.0,
   172,
   "c19"
  ]
 ],
 "avg_text_blocks": 1.28,
 "avg_onscreen_words": 1.7,
 "avg_empty": 0.42,
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
   1.48
  ],
  "s6": [
   0.78,
   1.3,
   3
  ],
  "s7": [
   0.61,
   0.87
  ]
 },
 "scenes_lt3_shot_values": [
  "s5",
  "s7"
 ],
 "analyst_acting_scenes": "7/7",
 "villain_scenes": "2/7",
 "js_errors": [],
 "mobile_hscroll": false,
 "sound_events": 136
}
```

## Captures signalées

- `c1` 25 % : empty(0.457)
- `c2` 75 % : focus_small(0.017); subj_in_band « perso:analyste »
- `c3` 25 % : empty(0.486)
- `c3` 50 % : empty(0.458)
- `c3` 75 % : empty(0.422)
- `c4` 25 % : focus_small(0.076); empty(0.429)
- `c4` 50 % : focus_small(0.053); empty(0.42)
- `c4` 75 % : focus_small(0.029); empty(0.469)
- `c5` 25 % : empty(0.476)
- `c5` 50 % : empty(0.477)
- `c5` 75 % : empty(0.49)
- `c6` 25 % : focus_small(0.076); empty(0.417)
- `c6` 50 % : focus_small(0.044)
- `c6` 75 % : empty(0.411)
- `c7` 25 % : focus_small(0.031); empty(0.403)
- `c7` 75 % : subj_in_band « perso:attaquant »; subj_in_band « perso:analyste »; subj_cut « perso:analyste »
- `c8` 50 % : cut « Entrée de 03:07 »
- `c8` 75 % : cut « Entrée de 03:07 »; cut « SetIamPolicy »
- `c9` 50 % : focus_small(0.033)
- `c9` 75 % : focus_small(0.033)
- `c10` 50 % : subj_cut « perso:analyste »
- `c11` 25 % : empty(0.481)
- `c11` 50 % : focus_small(0.024); empty(0.509)
- `c11` 75 % : focus_small(0.024); empty(0.498)
- `c12` 25 % : cut « factures-clients »; focus_small(0.038); empty(0.663)
- `c12` 50 % : cut « factures-clients »; focus_small(0); empty(0.634)
- `c12` 75 % : cut « factures-clients »; focus_small(0.078); empty(0.53)
- `c13` 25 % : empty(0.441)
- `c13` 50 % : empty(0.411)
- `c13` 75 % : empty(0.464)
- `c14` 25 % : focus_small(0.018); empty(0.616)
- `c14` 50 % : focus_offcenter([773, 114]); focus_small(0.051); empty(0.561)
- `c14` 75 % : focus_offcenter([773, 114]); focus_small(0.051); empty(0.566)
- `c15` 25 % : empty(0.734)
- `c15` 50 % : focus_small(0.012); empty(0.462)
- `c15` 75 % : focus_small(0.015); empty(0.446)
- `c16` 25 % : focus_offcenter([171, -419]); focus_small(0); empty(0.538)
- `c16` 50 % : focus_small(0.017); empty(0.497)
- `c16` 75 % : focus_small(0.017); empty(0.498)
- `c17` 25 % : subj_in_band « perso:analyste »
- `c17` 50 % : toomanytext(4) « ALERTE | Owner | 03:07 | 03:09 »; subj_in_band « perso:analyste »
- `c17` 75 % : overlap « ALERTE / CONTENU »; toomanytext(4) « ALERTE | CONTENU | 03:07 | 03:09 »; focus_offcenter([207, 40]); focus_small(0.002); empty(0.408)
- `c18` 25 % : focus_small(0.06); empty(0.476)
- `c18` 50 % : focus_small(0.06); empty(0.483)
- `c18` 75 % : focus_small(0.044)
- `c19` 25 % : focus_small(0.02); empty(0.47)
- `c19` 50 % : focus_small(0.02); empty(0.472)
- `c19` 75 % : empty(0.497)