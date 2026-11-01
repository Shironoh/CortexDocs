# QA automatique — pgexplain

```json
{
 "beat_gaps_gt2_5s": [],
 "cues_under_beat_quota": [],
 "moving_captures": 12,
 "duration_s": 165.9,
 "cues": 19,
 "scenes": 7,
 "say_words": 373,
 "words_per_min": 134.9,
 "captures": 57,
 "captures_with_issue": 35,
 "issues": {
  "subj_in_band": 7,
  "focus_hidden": 4,
  "focus_small": 18,
  "focus_offcenter": 7,
  "cut": 14,
  "subj_cut": 1,
  "small": 9,
  "toomanytext": 6
 },
 "frozen_windows_gt2_5s": [
  [
   49.5,
   53.0,
   "c7"
  ]
 ],
 "avg_text_blocks": 3.28,
 "avg_onscreen_words": 11.25,
 "avg_empty": 0.078,
 "shot_values_per_scene": {
  "s1": [
   0.61,
   0.99,
   1.6
  ],
  "s2": [
   0.78,
   2.1
  ],
  "s3": [
   0.91,
   1.23
  ],
  "s4": [
   0.79,
   2.6
  ],
  "s5": [
   0.61,
   1.1,
   1.63
  ],
  "s6": [
   0.61,
   1.1,
   1.52
  ],
  "s7": [
   0.61,
   0.84,
   2.4
  ]
 },
 "scenes_lt3_shot_values": [
  "s2",
  "s3",
  "s4"
 ],
 "analyst_acting_scenes": "7/7",
 "villain_scenes": "4/7",
 "js_errors": [],
 "mobile_hscroll": false,
 "sound_events": 84
}
```

## Captures signalées

- `c2` 25 % : subj_in_band « perso:hero »
- `c2` 50 % : subj_in_band « perso:hero »
- `c4` 25 % : focus_hidden
- `c4` 50 % : focus_small(0.031)
- `c4` 75 % : focus_small(0.031)
- `c5` 25 % : focus_hidden; focus_small(0.036)
- `c5` 50 % : focus_small(0.009)
- `c5` 75 % : focus_small(0.013)
- `c6` 25 % : focus_small(0.024)
- `c7` 75 % : focus_offcenter([1202, 115]); focus_small(0.033)
- `c8` 25 % : cut « -> Limit »; cut « -> Sort »
- `c8` 50 % : cut « -> Gather »; cut « -> Parallel Seq Scan on orders »; focus_offcenter([872, -67])
- `c8` 75 % : cut « -> Limit »; focus_offcenter([725, 111]); focus_small(0.048)
- `c9` 50 % : subj_in_band « perso:hero »
- `c9` 75 % : subj_cut « perso:hero »
- `c12` 50 % : focus_small(0.011)
- `c12` 75 % : cut « (actual time=61.397..920.280 rows=300000 »; cut « Execution Time: 1077.072 ms »
- `c13` 25 % : focus_small(0.012)
- `c13` 50 % : focus_small(0.057)
- `c13` 75 % : focus_small(0.014)
- `c14` 25 % : small(25.3) « +300 000 »; focus_hidden; focus_small(0.003)
- `c14` 50 % : small(34.5) « +300 000 »; focus_small(0.029)
- `c14` 75 % : small(34.5) « +300 000 »; focus_small(0.025)
- `c15` 50 % : cut « ANALYZE orders; »; cut « rows=127586 »; small(34.4) « rows=127586 »; focus_offcenter([-54, 383])
- `c15` 75 % : cut « ANALYZE orders; »; cut « rows=127586 »; small(34.4) « rows=127586 »; toomanytext(4) « ANALYZE orders; | rows=127586 | Parallel Hash Join  (… rows=127586 …) | (actual … rows=100000.00 loops=3) | Execution Time: 176.475 ms | avant | après »; focus_offcenter([508, 129]); focus_small(0.021)
- `c16` 25 % : cut « ANALYZE orders; »; focus_hidden
- `c16` 50 % : cut « ANALYZE orders; »; focus_offcenter([666, 111]); focus_small(0.056)
- `c16` 75 % : cut « ANALYZE orders; »; focus_offcenter([666, 111]); focus_small(0.056)
- `c17` 25 % : subj_in_band « perso:foe »; subj_in_band « perso:hero »
- `c17` 75 % : subj_in_band « perso:foe »; subj_in_band « perso:hero »
- `c18` 50 % : toomanytext(4) « EXPLAIN (ANALYZE) | sur la requête lente | Rows Removed by Filter | → index »
- `c18` 75 % : small(34.2) « Rows Removed by Filter »; toomanytext(6) « EXPLAIN (ANALYZE) | sur la requête lente | Rows Removed by Filter | → index | rows prévu ≠ réel | → ANALYZE »
- `c19` 25 % : small(34.2) « Rows Removed by Filter »; toomanytext(6) « EXPLAIN (ANALYZE) | sur la requête lente | Rows Removed by Filter | → index | rows prévu ≠ réel | → ANALYZE »
- `c19` 50 % : small(34.2) « Rows Removed by Filter »; toomanytext(6) « EXPLAIN (ANALYZE) | sur la requête lente | Rows Removed by Filter | → index | rows prévu ≠ réel | → ANALYZE »
- `c19` 75 % : small(35.2) « Rows Removed by Filter »; toomanytext(7) « EXPLAIN (ANALYZE) | sur la requête lente | Rows Removed by Filter | → index | rows prévu ≠ réel | → ANALYZE | Buffers: shared hit=14104 read=1038 »