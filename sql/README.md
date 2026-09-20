# SQL — GA4 event data in BigQuery

Queries on the raw GA4 export of the two properties (Learning Library and Substack). They answer the business questions of the project and are the reason the export was enabled: the GA4 interface aggregates and samples, the raw tables keep one row per event.

## How to run

1. In BigQuery, replace the placeholders at the top of each file:
   - `PROJECT` — the Google Cloud project that holds the export
   - `LIBRARY_DATASET` / `SUBSTACK_DATASET` — the datasets named `analytics_<property id>`
2. Change `start_date` / `end_date` (format `YYYYMMDD`). The export only exists from the day it was linked (2026-09-20) and cannot be backfilled.
3. Run the file. Each script returns one result table.

## Files

| File | Property | Question it answers |
|---|---|---|
| `01_events_overview.sql` | Library | Which events arrive, how many users and days (sanity check of the tracking) |
| `02_sessions_by_source.sql` | both | Where sessions come from, by UTM source / medium / campaign |
| `03_library_funnel.sql` | Library | How many sessions go from visit to seeing resources, clicking one and clicking to Substack |
| `04_ctr_by_list_position.sql` | Library | Click-through rate by position in the list shown (position bias) |
| `05_ctr_by_topic_level_access.sql` | Library | Which topics, levels and free / paid items attract clicks, per exposure |
| `06_zero_result_searches.sql` | Library | What people search for, and what they search for and do not find |
| `07_substack_subscribe_funnel.sql` | Substack | Popup seen → Subscribe clicked → signed up, by placement |
| `08_substack_reading_depth.sql` | Substack | How far readers scroll and how long they stay, per post |
| `09_direct_none_share.sql` | Substack | Share of sessions with no source (direct / none) per week |
| `10_library_to_substack_bridge.sql` | both | Library clicks to Substack against Substack sessions from the library, by day and campaign |
| `11_signup_coverage.sql` | Substack | GA4 `sign_up` per day against Substack's new subscribers per day (how much of the growth GA4 can see) |

## Reading the GA4 export

- One row per event. Parameters sit in `event_params`, a repeated `key` / `value` record, so each script uses a small temporary function to read one parameter (`UNNEST` inside a function).
- A session is identified by `user_pseudo_id` plus the `ga_session_id` parameter; the tables have no session column.
- Numeric parameters normally arrive as `int_value`. The helper falls back to `double_value` and to a parsed string, so a change in how GTM types a value does not break the result.

## Status

Written for the GA4 BigQuery export schema. **Not yet run on real data** at the time of writing: the export was linked on 2026-09-20 and the first daily table appears about 24 hours later. Update this section with the run date and row counts once they have been executed.
