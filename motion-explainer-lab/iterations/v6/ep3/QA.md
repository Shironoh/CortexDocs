# QA automatique — ep3

```json
{
 "beat_gaps_gt2_5s": [],
 "cues_under_beat_quota": [],
 "moving_captures": 12,
 "duration_s": 143.7,
 "cues": 15,
 "scenes": 7,
 "say_words": 343,
 "words_per_min": 143.2,
 "captures": 45,
 "captures_with_issue": 19,
 "issues": {
  "empty": 2,
  "subj_in_band": 13,
  "subj_cut": 1,
  "focus_offcenter": 2,
  "focus_small": 8,
  "focus_hidden": 3,
  "subband": 2,
  "cut": 1
 },
 "frozen_windows_gt2_5s": [],
 "avg_text_blocks": 1.18,
 "avg_onscreen_words": 2.33,
 "avg_empty": 0.081,
 "shot_values_per_scene": {
  "s1": [
   0.61,
   0.88,
   1.54,
   2.13,
   3
  ],
  "s2": [
   0.61,
   0.92,
   1.25
  ],
  "s3": [
   0.61,
   0.95,
   1.29,
   2.4
  ],
  "s4": [
   0.61,
   1.17,
   1.66
  ],
  "s5": [
   0.61,
   0.91,
   1.25
  ],
  "s6": [
   0.61,
   0.96,
   1.3,
   3
  ],
  "s7": [
   0.61,
   0.87,
   1.7
  ]
 },
 "scenes_lt3_shot_values": [],
 "analyst_acting_scenes": "7/7",
 "villain_scenes": "6/7",
 "js_errors": [],
 "mobile_hscroll": false,
 "sound_events": 100
}
```

## Captures signalées

- `c1` 25 % : empty(0.568)
- `c1` 50 % : subj_in_band « perso:analyste »; subj_cut « perso:analyste »
- `c1` 75 % : empty(0.405)
- `c2` 75 % : focus_offcenter([505, 124]); focus_small(0.009)
- `c3` 25 % : focus_small(0.027); subj_in_band « perso:attaquant »; subj_in_band « perso:attaquant »
- `c3` 50 % : focus_small(0.027); subj_in_band « perso:attaquant »; subj_in_band « perso:attaquant »
- `c3` 75 % : focus_small(0.017); subj_in_band « perso:attaquant »; subj_in_band « perso:attaquant »
- `c5` 25 % : focus_small(0.047)
- `c5` 50 % : focus_small(0.047)
- `c7` 75 % : subj_in_band « perso:attaquant »
- `c11` 25 % : subj_in_band « perso:attaquant »
- `c11` 50 % : focus_offcenter([1687, 1308]); subj_in_band « focus »
- `c13` 25 % : focus_small(0.016)
- `c13` 50 % : focus_small(0.002)
- `c14` 25 % : focus_hidden; subj_in_band « perso:analyste »
- `c14` 50 % : focus_hidden; subj_in_band « perso:analyste »
- `c14` 75 % : focus_hidden; subj_in_band « perso:analyste »
- `c15` 50 % : subband « 10 règles »
- `c15` 75 % : cut « 10 règles »; subband « 10 règles »