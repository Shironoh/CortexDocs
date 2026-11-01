# QA automatique — c14

```json
{
 "beat_gaps_gt2_5s": [],
 "cues_under_beat_quota": [],
 "moving_captures": 10,
 "duration_s": 155.6,
 "cues": 20,
 "scenes": 7,
 "say_words": 405,
 "words_per_min": 156.1,
 "captures": 60,
 "captures_with_issue": 37,
 "issues": {
  "subj_cut": 10,
  "focus_hidden": 4,
  "focus_small": 23,
  "focus_offcenter": 11,
  "subj_in_band": 11,
  "small": 13,
  "subband": 1,
  "overlap": 2,
  "cut": 1
 },
 "frozen_windows_gt2_5s": [],
 "avg_text_blocks": 1.47,
 "avg_onscreen_words": 3.83,
 "avg_empty": 0.088,
 "shot_values_per_scene": {
  "s1": [
   0.61,
   1.02,
   1.5
  ],
  "s2": [
   0.61,
   0.88,
   1.36
  ],
  "s3": [
   0.61,
   0.89,
   1.24
  ],
  "s4": [
   0.61,
   0.87,
   1.18,
   1.78,
   3
  ],
  "s5": [
   0.61,
   0.88,
   1.59
  ],
  "s6": [
   0.61,
   1.07
  ],
  "s7": [
   0.79
  ]
 },
 "scenes_lt3_shot_values": [
  "s6",
  "s7"
 ],
 "analyst_acting_scenes": "7/7",
 "villain_scenes": "4/7",
 "js_errors": [],
 "mobile_hscroll": false,
 "sound_events": 82
}
```

## Captures signalées

- `c1` 75 % : subj_cut « perso:hero »
- `c2` 25 % : focus_hidden; focus_small(0.011)
- `c2` 50 % : focus_small(0.011)
- `c2` 75 % : focus_small(0.01)
- `c3` 25 % : focus_small(0.01)
- `c3` 50 % : focus_hidden; focus_small(0.01)
- `c4` 75 % : focus_small(0.016)
- `c5` 25 % : focus_offcenter([67, 370]); focus_small(0.024)
- `c5` 75 % : focus_hidden; focus_small(0.032)
- `c6` 25 % : focus_small(0.013)
- `c6` 75 % : focus_offcenter([1004, 83]); focus_small(0.006)
- `c7` 50 % : focus_offcenter([800, 129]); subj_in_band « perso:hero »
- `c7` 75 % : focus_offcenter([800, 111]); subj_in_band « perso:hero »
- `c8` 25 % : subj_cut « perso:hero »
- `c10` 50 % : subj_in_band « perso:hero »
- `c11` 25 % : subj_cut « perso:hero »
- `c11` 50 % : subj_in_band « perso:hero »; subj_cut « perso:hero »
- `c11` 75 % : subj_in_band « perso:hero »; subj_cut « perso:hero »
- `c12` 25 % : small(40) « Rapport · ETH-8342 »; focus_small(0.036); subj_cut « perso:hero »
- `c12` 50 % : focus_small(0.028); subj_cut « perso:hero »
- `c12` 75 % : focus_small(0.028); subj_cut « perso:hero »
- `c13` 25 % : focus_hidden; focus_small(0)
- `c13` 75 % : subj_in_band « perso:hero »; subj_cut « perso:hero »
- `c14` 50 % : small(39.9) « 1 cerne = 1 année »
- `c15` 25 % : subband « année réelle (av. J.-C.) »; focus_offcenter([853, 127]); focus_small(0.007)
- `c15` 50 % : small(42.2) « année réelle (av. J.-C.) »; small(42.2) « âge BP »; focus_offcenter([853, 127]); focus_small(0.007)
- `c15` 75 % : overlap « âge BP / 3239 – 3105 av. J.-C. »; focus_offcenter([858, 98]); focus_small(0.031)
- `c16` 25 % : focus_offcenter([-801, -80]); focus_small(0)
- `c16` 50 % : focus_offcenter([-801, -80]); focus_small(0)
- `c16` 75 % : focus_small(0.029)
- `c17` 75 % : cut « ≈ 50 000 ans »; focus_offcenter([1516, 741]); subj_in_band « perso:foe »; subj_cut « perso:foe »; subj_in_band « focus »
- `c18` 25 % : small(42.6) « 3300 »; small(42.6) « 3100 av. J.-C. »; small(42.6) « aujourd'hui »; subj_in_band « perso:hero »
- `c18` 50 % : small(42.6) « 3300 »; small(42.6) « 3100 av. J.-C. »; small(42.6) « aujourd'hui »; subj_in_band « perso:hero »
- `c18` 75 % : small(42.6) « 3300 »; small(42.6) « 3100 av. J.-C. »; small(42.6) « aujourd'hui »; overlap « + de 5 000 ans / calibration 1994 »; subj_in_band « perso:hero »
- `c20` 25 % : focus_small(0.057)
- `c20` 50 % : focus_small(0.057)
- `c20` 75 % : focus_offcenter([1460, 495]); focus_small(0.028)