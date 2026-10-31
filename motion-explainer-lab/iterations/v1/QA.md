# QA automatique — v1

```json
{
 "beat_gaps_gt2_5s": [
  [
   4.65,
   7.17,
   "c1"
  ],
  [
   8.14,
   10.83,
   "c2"
  ],
  [
   13.32,
   16.06,
   "c2"
  ],
  [
   28.75,
   33.45,
   "c4"
  ],
  [
   45.02,
   47.55,
   "c6"
  ],
  [
   49.68,
   52.23,
   "c7"
  ],
  [
   52.43,
   56.18,
   "c7"
  ],
  [
   60.25,
   64.19,
   "c9"
  ],
  [
   64.48,
   67.21,
   "c9"
  ],
  [
   67.21,
   70.35,
   "c9"
  ],
  [
   71.6,
   76.22,
   "c10"
  ],
  [
   85.14,
   89.94,
   "c12"
  ],
  [
   98.29,
   104.02,
   "c14"
  ],
  [
   111.18,
   114.44,
   "c15"
  ],
  [
   141.15,
   143.91,
   "c20"
  ],
  [
   148.87,
   151.56,
   "c21"
  ],
  [
   162.56,
   165.67,
   "c22"
  ],
  [
   169.72,
   172.79,
   "c23"
  ]
 ],
 "cues_under_beat_quota": [],
 "moving_captures": 9,
 "duration_s": 176.2,
 "cues": 21,
 "scenes": 8,
 "say_words": 420,
 "words_per_min": 143.0,
 "captures": 63,
 "captures_with_issue": 61,
 "issues": {
  "empty": 53,
  "focus_small": 35,
  "subj_in_band": 33,
  "subj_cut": 8,
  "toomanytext": 7,
  "focus_offcenter": 4,
  "subband": 2,
  "small": 4,
  "cut": 16,
  "subj_occluded": 18,
  "overlap": 2
 },
 "frozen_windows_gt2_5s": [
  [
   30.5,
   36.0,
   "c5"
  ],
  [
   61.0,
   64.0,
   "c9"
  ],
  [
   71.0,
   76.5,
   "c10"
  ],
  [
   86.0,
   89.5,
   "c12"
  ],
  [
   148.5,
   153.5,
   "c21"
  ]
 ],
 "avg_text_blocks": 2.03,
 "avg_onscreen_words": 3.03,
 "avg_empty": 0.53,
 "shot_values_per_scene": {
  "s1": [
   0.85,
   1.25
  ],
  "s2": [
   0.78,
   1.3
  ],
  "s3": [
   0.8,
   1.15
  ],
  "s4": [
   0.82,
   1.15,
   1.6
  ],
  "s5": [
   0.82,
   1.15,
   1.6
  ],
  "s6": [
   0.85,
   1.45
  ],
  "s7": [
   0.62,
   1
  ],
  "s8": [
   0.85,
   1.15
  ]
 },
 "scenes_lt3_shot_values": [
  "s1",
  "s2",
  "s3",
  "s6",
  "s7",
  "s8"
 ],
 "analyst_acting_scenes": "8/8",
 "villain_scenes": "4/8",
 "js_errors": [],
 "mobile_hscroll": false,
 "sound_events": 141
}
```

## Captures signalées

- `c1` 25 % : empty(0.583)
- `c1` 50 % : focus_small(0.042); subj_in_band « perso:analyste »; subj_cut « perso:analyste »; empty(0.523)
- `c1` 75 % : toomanytext(4) « 03:12 | ALERTE | nuitblanche42@gmail.com | Owner »; focus_small(0.042); subj_in_band « perso:analyste »; subj_cut « perso:analyste »; empty(0.484)
- `c2` 25 % : focus_offcenter([1185, 770]); focus_small(0.041); subj_in_band « perso:analyste »; subj_in_band « focus »; empty(0.545)
- `c2` 50 % : focus_small(0.03); subj_in_band « perso:analyste »; subj_in_band « focus »; empty(0.549)
- `c2` 75 % : subband « Owner »; focus_small(0.017); empty(0.493)
- `c3` 25 % : empty(0.562)
- `c3` 50 % : small(40.2) « Organisation »; empty(0.585)
- `c3` 75 % : cut « Organisation »; subj_in_band « perso:analyste »; empty(0.498)
- `c4` 25 % : empty(0.573)
- `c4` 50 % : focus_small(0); empty(0.561)
- `c4` 75 % : focus_small(0); empty(0.559)
- `c5` 25 % : focus_small(0.059); subj_occluded « perso:analyste »; empty(0.696)
- `c5` 50 % : focus_small(0.059); subj_occluded « perso:analyste »; empty(0.689)
- `c5` 75 % : focus_small(0.059); subj_occluded « perso:analyste »; empty(0.698)
- `c6` 25 % : cut « Admin Activity »; focus_small(0.029); subj_in_band « perso:analyste »; subj_occluded « perso:analyste »; empty(0.554)
- `c6` 50 % : small(42.8) « jours »; overlap « 400 / jours »; subj_occluded « perso:analyste »; empty(0.524)
- `c6` 75 % : overlap « 400 / jours »; subj_in_band « focus »; empty(0.549)
- `c7` 25 % : subj_cut « perso:analyste »; empty(0.655)
- `c7` 50 % : subj_occluded « perso:analyste »; empty(0.488)
- `c7` 75 % : subj_in_band « perso:attaquant »; subj_in_band « perso:analyste »; subj_occluded « perso:analyste »; subj_cut « perso:analyste »; empty(0.503)
- `c9` 50 % : subj_in_band « perso:analyste »
- `c10` 25 % : focus_small(0.021); subj_occluded « perso:ci-deployer »; subj_occluded « focus »; empty(0.488)
- `c10` 50 % : cut « Entrée de 03:07 »; focus_offcenter([-293, 572]); focus_small(0.003); subj_in_band « perso:ci-deployer »; subj_occluded « perso:ci-deployer »; empty(0.486)
- `c10` 75 % : cut « Entrée de 03:07 »; focus_offcenter([-293, 572]); focus_small(0.003); subj_in_band « perso:ci-deployer »; subj_occluded « perso:ci-deployer »; empty(0.484)
- `c11` 25 % : cut « ci-deployer »; subj_occluded « perso:ci-deployer »
- `c11` 50 % : cut « ci-deployer »; subj_occluded « perso:ci-deployer »
- `c11` 75 % : cut « ci-deployer »; subj_occluded « perso:ci-deployer »
- `c12` 25 % : subj_cut « perso:analyste »
- `c12` 50 % : subj_cut « perso:analyste »
- `c12` 75 % : subj_cut « perso:analyste »
- `c13` 25 % : subj_occluded « perso:analyste »; empty(0.635)
- `c13` 50 % : cut « factures-clients »; focus_small(0.034); subj_in_band « perso:attaquant »; empty(0.776)
- `c13` 75 % : cut « factures-clients »; focus_small(0.034); subj_in_band « perso:attaquant »; empty(0.786)
- `c14` 25 % : cut « factures-clients »; focus_small(0.035); subj_occluded « focus »; empty(0.734)
- `c14` 50 % : cut « factures-clients »; focus_small(0); empty(0.693)
- `c14` 75 % : cut « factures-clients »; focus_small(0.06); empty(0.608)
- `c15` 25 % : subj_occluded « perso:analyste »; empty(0.524)
- `c15` 50 % : toomanytext(5) « factures-clients | Data Access | OFF | € | ? »; subj_occluded « perso:analyste »; empty(0.505)
- `c15` 75 % : subj_cut « perso:analyste »; empty(0.512)
- `c16` 25 % : focus_small(0.017); empty(0.644)
- `c16` 50 % : empty(0.674)
- `c16` 75 % : focus_small(0.02); subj_in_band « perso:analyste »; empty(0.66)
- `c17` 25 % : focus_small(0); empty(0.651)
- `c17` 50 % : focus_small(0.019); empty(0.628)
- `c17` 75 % : focus_small(0.009); empty(0.608)
- `c18` 25 % : focus_small(0.004); subj_in_band « perso:analyste »; empty(0.62)
- `c18` 50 % : focus_offcenter([1400, 749]); focus_small(0.019); subj_in_band « perso:analyste »; subj_in_band « perso:attaquant »; subj_in_band « focus »; empty(0.592)
- `c18` 75 % : focus_small(0.018); subj_in_band « perso:analyste »; subj_in_band « perso:attaquant »; subj_in_band « focus »; empty(0.604)
- `c20` 25 % : empty(0.585)
- `c20` 50 % : focus_small(0.016); empty(0.625)
- `c20` 75 % : subband « SIEM »; focus_small(0.068)
- `c21` 25 % : small(41.4) « Owner »; toomanytext(4) « ALERTE | nuitblanche42@gmail.com | Owner | 03:07 »; subj_in_band « perso:analyste »; empty(0.483)
- `c21` 50 % : small(41.4) « Owner »; toomanytext(5) « ALERTE | nuitblanche42@gmail.com | Owner | 03:07 | 03:09 »; subj_in_band « perso:analyste »; empty(0.483)
- `c21` 75 % : cut « 03:09 »; toomanytext(4) « ALERTE | nuitblanche42@gmail.com | 03:07 | 03:09 »; subj_in_band « perso:analyste »; empty(0.432)
- `c22` 25 % : cut « 03:09 »; focus_small(0.05); subj_in_band « perso:analyste »; empty(0.509)
- `c22` 50 % : cut « 03:09 »; toomanytext(4) « 03:07 | 03:09 | Alerte | Sink »; focus_small(0.05); subj_in_band « perso:analyste »; empty(0.479)
- `c22` 75 % : cut « 03:09 »; toomanytext(5) « 03:07 | 03:09 | Alerte | Sink | Data Access »; focus_small(0.05); subj_in_band « perso:analyste »; empty(0.451)
- `c23` 25 % : focus_small(0.002); subj_in_band « perso:analyste »; empty(0.448)
- `c23` 50 % : focus_small(0.002); subj_in_band « perso:analyste »; empty(0.451)
- `c23` 75 % : focus_small(0.001); subj_in_band « perso:analyste »; empty(0.49)