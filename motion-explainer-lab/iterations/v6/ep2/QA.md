# QA automatique — ep2

```json
{
 "beat_gaps_gt2_5s": [],
 "cues_under_beat_quota": [],
 "moving_captures": 11,
 "duration_s": 144.5,
 "cues": 15,
 "scenes": 7,
 "say_words": 352,
 "words_per_min": 146.2,
 "captures": 45,
 "captures_with_issue": 19,
 "issues": {
  "subj_in_band": 11,
  "subj_cut": 6,
  "focus_offcenter": 10,
  "focus_small": 6,
  "toomanytext": 1,
  "cut": 2,
  "focus_hidden": 2,
  "overlap": 1
 },
 "frozen_windows_gt2_5s": [],
 "avg_text_blocks": 1.47,
 "avg_onscreen_words": 2.62,
 "avg_empty": 0.079,
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
   2.4
  ],
  "s3": [
   0.61,
   0.94,
   1.29
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
- `c5` 75 % : focus_offcenter([199, 557])
- `c6` 25 % : subj_in_band « perso:robot »; subj_cut « perso:robot »
- `c6` 50 % : cut « Persistance »; cut « google.iam.admin.v1.CreateServiceAccount »
- `c6` 75 % : focus_small(0.043)
- `c7` 75 % : focus_offcenter([183, 551]); subj_cut « perso:attaquant »
- `c9` 50 % : subj_in_band « perso:attaquant »
- `c12` 75 % : focus_offcenter([-172, -58]); focus_small(0)
- `c13` 25 % : focus_small(0.051)
- `c14` 25 % : focus_hidden; focus_offcenter([-323, 365]); focus_small(0)
- `c14` 50 % : focus_hidden; focus_offcenter([-767, 538]); focus_small(0); subj_in_band « perso:analyste »
- `c14` 75 % : focus_offcenter([190, 400]); subj_in_band « perso:analyste »
- `c15` 25 % : focus_offcenter([1423, 400]); subj_in_band « perso:analyste »
- `c15` 50 % : overlap « CreateServiceAccountKey / setCommonInstanceMetadata »; focus_offcenter([1423, 400]); subj_in_band « perso:analyste »
- `c15` 75 % : focus_offcenter([1423, 400]); subj_in_band « perso:analyste »