# QA automatique — reg-gcp-ep2

```json
{
 "beat_gaps_gt2_5s": [
  [
   134.88,
   137.78,
   "c14"
  ]
 ],
 "cues_under_beat_quota": [],
 "moving_captures": 14,
 "duration_s": 158.9,
 "cues": 15,
 "scenes": 7,
 "say_words": 352,
 "words_per_min": 132.9,
 "captures": 45,
 "captures_with_issue": 18,
 "issues": {
  "subj_in_band": 12,
  "subj_cut": 6,
  "focus_offcenter": 7,
  "focus_small": 5,
  "toomanytext": 1,
  "cut": 1,
  "focus_hidden": 4
 },
 "frozen_windows_gt2_5s": [],
 "avg_text_blocks": 1.36,
 "avg_onscreen_words": 2.29,
 "avg_empty": 0.073,
 "shot_values_per_scene": {
  "s1": [
   0.61,
   1.07,
   1.5
  ],
  "s2": [
   0.61,
   0.91,
   1.25,
   1.69,
   2.4
  ],
  "s3": [
   0.61,
   0.94,
   1.3
  ],
  "s4": [
   0.61,
   0.89,
   1.25
  ],
  "s5": [
   0.61,
   0.84,
   1.25
  ],
  "s6": [
   0.61,
   0.87,
   1.25,
   2.4
  ],
  "s7": [
   0.61,
   0.85
  ]
 },
 "scenes_lt3_shot_values": [
  "s7"
 ],
 "analyst_acting_scenes": "7/7",
 "villain_scenes": "6/7",
 "js_errors": [],
 "mobile_hscroll": false,
 "sound_events": 92
}
```

## Captures signalées

- `c1` 25 % : subj_in_band « perso:analyste »; subj_cut « perso:analyste »
- `c1` 75 % : focus_offcenter([1364, 92]); focus_small(0.013)
- `c2` 25 % : subj_in_band « perso:analyste »; subj_cut « perso:analyste »
- `c2` 50 % : subj_in_band « perso:analyste »; subj_cut « perso:analyste »
- `c2` 75 % : toomanytext(4) « 03:07 | Tactique | methodName | condition qui alerte »; subj_in_band « perso:analyste »; subj_cut « perso:analyste »
- `c4` 25 % : cut « Persistance · élévation »
- `c6` 25 % : focus_small(0.023); subj_in_band « perso:robot »; subj_cut « perso:robot »
- `c6` 50 % : subj_in_band « perso:robot »; subj_cut « perso:robot »
- `c6` 75 % : focus_small(0.043)
- `c9` 50 % : subj_in_band « perso:attaquant »
- `c13` 25 % : focus_hidden
- `c13` 50 % : focus_hidden
- `c14` 25 % : focus_hidden; focus_offcenter([-323, 365]); focus_small(0)
- `c14` 50 % : focus_hidden; focus_offcenter([-767, 538]); focus_small(0); subj_in_band « perso:analyste »
- `c14` 75 % : focus_offcenter([190, 400]); subj_in_band « perso:analyste »
- `c15` 25 % : focus_offcenter([1423, 400]); subj_in_band « perso:analyste »
- `c15` 50 % : focus_offcenter([1423, 400]); subj_in_band « perso:analyste »
- `c15` 75 % : focus_offcenter([1423, 400]); subj_in_band « perso:analyste »