# Matching Algorithm

This document describes only the matching behavior implemented in `backend/main.py`.

## Summary

The current MVP creates a group immediately when a user submits the questionnaire. It does not wait for a batch job or AI model. It selects up to seven users using destination preference first, then compatibility and small demographic diversity bonuses.

## Supported Destinations

Canonical destination keys:

| Key | Destination name | Cohort name |
| --- | --- | --- |
| `birbhum` | Birbhum, West Bengal | Coastline Table Cohort |
| `dooars` | Jalpaiguri, North Bengal | Forest Silence Cohort |
| `kandhamal` | Kandhamal, Odisha | Mountain Stillness Cohort |
| `satkosia` | Angul, Odisha | River Wilderness Cohort |
| `open` | Open landscape | Open Horizon Cohort |

Aliases are normalized before scoring. Unsupported values become `open`.

## Compatibility Calculation

For two users:

1. Read both `answers` arrays.
2. Pair answers by position with `zip`; extra answers in a longer array are ignored.
3. Sum absolute differences across paired answers.
4. Compute maximum possible distance as `number_of_pairs * 4`.
5. Compute raw score as `100 - (distance / max_distance) * 100`.
6. Clamp to `0..100`.
7. Convert to integer.

If either answer list is empty, score is `0`.

## Adjusted Match Score

The adjusted score keeps questionnaire compatibility as the base and adds demographic bonuses:

| Condition | Bonus |
| --- | --- |
| Same `age_group` | `+10` |
| Same `gender` | `+5` |

Final adjusted score is capped at `100`.

## Destination Grouping

The submitted user becomes the anchor member.

- If the current user selected a specific destination, that destination is the anchor destination.
- If the current user selected `open`, the backend looks at all non-open users and sums adjusted scores by destination. The destination with the highest summed score becomes the anchor destination.
- If no non-open destination scores exist, the anchor remains `open`.

## Candidate Ranking

Candidate ranking starts with adjusted match score, then adds small diversity bonuses relative to already selected users:

| Diversity condition | Bonus |
| --- | --- |
| Candidate age group is not yet represented in selected members | `+4` |
| Candidate gender is not yet represented in selected members | `+3` |

The highest-scoring remaining candidate is selected repeatedly until the target size is reached or candidates are exhausted.

## Group Creation

Target cohort size is `7`.

Selection order:

1. Start with the current user.
2. Add candidates whose normalized destination equals the anchor destination.
3. If the anchor destination is not `open`, add `open` candidates as fallback.
4. Do not randomly mix unrelated destination groups in the MVP fallback.
5. Insert one `groups` row with the selected member IDs.

The group can be smaller than seven people when insufficient candidates are available.

## Tie-Breaking Logic

Tie-breaking is not custom-coded. Candidate choice uses Python's `max` over the remaining candidate list. When multiple candidates have the same score, Python returns the first candidate encountered in that list. Since users are fetched from Supabase without an explicit order, practical tie order depends on Supabase's returned row order.

## Result Scoring

The result endpoint treats the first member in `groups.members` as the current user. It computes average adjusted score between that user and every other member.

- If there are comparisons, result score is the integer average.
- If the group has no other members, score defaults to `50`.

Labels:

| Score range | Label |
| --- | --- |
| `>= 80` | unusually strong alignment |
| `>= 60` | strong alignment |
| `>= 40` | moderate alignment |
| `< 40` | early-stage compatibility |

## Personality and Activity Plan

Personality type is inferred from average answer value:

| Average answer | Type |
| --- | --- |
| `<= 2.3` | `deep` |
| `<= 3.0` | `calm` |
| `<= 3.7` | `reflective` |
| `> 3.7` | `explore` |

Each type maps to static personality summary and activity-plan copy.

## Known Limitations

- No ML or AI inference.
- No batch optimization across all users.
- Existing groups are not updated when new users arrive.
- A new group is created for every submission.
- No prevention of users appearing in multiple groups.
- No explicit Supabase ordering for deterministic ties across environments.
