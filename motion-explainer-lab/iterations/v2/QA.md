# QA automatique — v2

```json
{
 "beat_gaps_gt2_5s": [
  [
   4.83,
   7.45,
   "c1"
  ],
  [
   8.52,
   13.02,
   "c2"
  ],
  [
   29.75,
   32.45,
   "c4"
  ],
  [
   44.45,
   47.51,
   "c6"
  ],
  [
   54.29,
   56.85,
   "c7"
  ],
  [
   57.0,
   60.79,
   "c7"
  ],
  [
   64.87,
   68.7,
   "c8"
  ],
  [
   69.1,
   71.72,
   "c8"
  ],
  [
   71.72,
   74.96,
   "c8"
  ],
  [
   94.45,
   98.6,
   "c11"
  ],
  [
   103.31,
   106.48,
   "c12"
  ],
  [
   107.25,
   109.78,
   "c12"
  ],
  [
   113.64,
   116.8,
   "c13"
  ],
  [
   116.8,
   119.64,
   "c13"
  ],
  [
   129.87,
   133.72,
   "c15"
  ],
  [
   145.33,
   148.02,
   "c17"
  ],
  [
   156.33,
   159.79,
   "c18"
  ],
  [
   159.79,
   162.49,
   "c18"
  ]
 ],
 "cues_under_beat_quota": [
  [
   "c18",
   4,
   5
  ]
 ],
 "moving_captures": 8,
 "duration_s": 174.2,
 "cues": 19,
 "scenes": 7,
 "say_words": 421,
 "words_per_min": 145.0,
 "captures": 57,
 "captures_with_issue": 53,
 "issues": {
  "empty": 44,
  "focus_small": 28,
  "subj_in_band": 4,
  "cut": 7,
  "overlap": 2,
  "subj_cut": 2,
  "subband": 1,
  "toomanytext": 5,
  "focus_offcenter": 8
 },
 "frozen_windows_gt2_5s": [
  [
   65.5,
   68.5,
   "c8"
  ],
  [
   95.5,
   98.5,
   "c11"
  ],
  [
   130.5,
   133.5,
   "c15"
  ]
 ],
 "avg_text_blocks": 1.53,
 "avg_onscreen_words": 1.96,
 "avg_empty": 0.484,
 "shot_values_per_scene": {
  "s1": [
   0.61,
   1.07,
   1.54
  ],
  "s2": [
   0.82,
   1.2,
   1.92
  ],
  "s3": [
   0.82,
   1.17
  ],
  "s4": [
   0.89,
   1.51,
   2.04
  ],
  "s5": [
   0.83,
   1.48,
   2.04
  ],
  "s6": [
   0.78,
   1.3
  ],
  "s7": [
   0.61,
   0.84,
   1.55
  ]
 },
 "scenes_lt3_shot_values": [
  "s3",
  "s6"
 ],
 "analyst_acting_scenes": "7/7",
 "villain_scenes": "2/7",
 "js_errors": [],
 "mobile_hscroll": false,
 "sound_events": 120
}
```

## Captures signalées

- `c1` 25 % : empty(0.469)
- `c1` 50 % : empty(0.413)
- `c2` 25 % : empty(0.45)
- `c2` 50 % : empty(0.448)
- `c2` 75 % : focus_small(0.017); subj_in_band « perso:analyste »; empty(0.441)
- `c3` 25 % : empty(0.498)
- `c3` 50 % : empty(0.458)
- `c3` 75 % : empty(0.422)
- `c4` 25 % : empty(0.46)
- `c4` 50 % : focus_small(0.056); empty(0.451)
- `c4` 75 % : focus_small(0.029); empty(0.547)
- `c5` 25 % : empty(0.526)
- `c5` 50 % : empty(0.542)
- `c5` 75 % : empty(0.557)
- `c6` 25 % : focus_small(0.076); empty(0.486)
- `c6` 50 % : focus_small(0.044); empty(0.49)
- `c6` 75 % : cut « Admin Activity »; overlap « 400 / jours »; focus_small(0.057); empty(0.462)
- `c7` 25 % : focus_small(0.031); empty(0.512)
- `c7` 75 % : subj_in_band « perso:attaquant »; subj_in_band « perso:analyste »; subj_cut « perso:analyste »
- `c8` 50 % : cut « Entrée de 03:07 »
- `c8` 75 % : cut « Entrée de 03:07 »; cut « SetIamPolicy »
- `c9` 25 % : empty(0.467)
- `c9` 50 % : focus_small(0.033)
- `c9` 75 % : focus_small(0.033)
- `c10` 50 % : subj_in_band « perso:analyste »; subj_cut « perso:analyste »
- `c10` 75 % : subband « gcloud ? »
- `c11` 25 % : empty(0.582)
- `c11` 50 % : focus_small(0.024); empty(0.611)
- `c11` 75 % : focus_small(0.024); empty(0.611)
- `c12` 25 % : cut « factures-clients »; focus_small(0.038); empty(0.797)
- `c12` 50 % : focus_small(0); empty(0.753)
- `c12` 75 % : empty(0.651)
- `c13` 25 % : empty(0.495)
- `c13` 50 % : toomanytext(4) « € | ? | 03:07 | 03:12 »; empty(0.493)
- `c13` 75 % : empty(0.524)
- `c14` 25 % : focus_small(0.018); empty(0.72)
- `c14` 50 % : focus_offcenter([773, 114]); focus_small(0.051); empty(0.658)
- `c14` 75 % : focus_offcenter([773, 114]); focus_small(0.051); empty(0.66)
- `c15` 25 % : toomanytext(4) « 03:07 | 03:09 | 03:12 | CreateServiceAccountKey »; focus_small(0); empty(0.601)
- `c15` 50 % : toomanytext(4) « 03:07 | 03:09 | 03:12 | CreateServiceAccountKey »; focus_small(0.012); empty(0.582)
- `c15` 75 % : toomanytext(4) « 03:07 | 03:09 | 03:12 | CreateServiceAccountKey »; focus_small(0.012); empty(0.582)
- `c16` 25 % : focus_offcenter([171, -419]); focus_small(0); empty(0.611)
- `c16` 50 % : focus_small(0.019); empty(0.641)
- `c16` 75 % : focus_small(0.019); empty(0.632)
- `c17` 25 % : cut « nuitblanche42@gmail.com »
- `c17` 50 % : cut « nuitblanche42@gmail.com »
- `c17` 75 % : overlap « ALERTE / CONTENU »; toomanytext(5) « ALERTE | nuitblanche42@gmail.com | CONTENU | 03:07 | 03:09 »; focus_offcenter([207, 40]); focus_small(0.002); empty(0.451)
- `c18` 25 % : focus_offcenter([80, 146]); focus_small(0.054); empty(0.63)
- `c18` 50 % : focus_offcenter([80, 146]); focus_small(0.054); empty(0.639)
- `c18` 75 % : focus_small(0.061); empty(0.547)
- `c19` 25 % : focus_offcenter([487, 115]); focus_small(0.009); empty(0.564)
- `c19` 50 % : focus_offcenter([487, 115]); focus_small(0.009); empty(0.585)
- `c19` 75 % : empty(0.578)