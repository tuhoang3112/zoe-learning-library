# Data

**No real user data is committed to this repository.** Behavioral data lives in Google Analytics 4 and in BigQuery; the survey responses stay in Google Forms. Only aggregated results (tables, charts, screenshots) are published, in `docs/`.

## Sources

| Source | What it holds | Scale | Available from |
|---|---|---|---|
| GA4 property — Substack | Page views, sessions and traffic sources of the newsletter, plus the custom events added on 2026-09-20 (`sign_up`, `subscribe_click`, `scroll_depth`, `read_time`…) | ~18K users, ~35K sessions (Jan 2025 – Sep 2026, from the project notes) | Jan 2025 in GA4; raw events in BigQuery from 2026-09-20 |
| GA4 property — Learning Library | The 6 library events (`resource_impression`, `resource_click`, `library_search`, `filter_apply`, `category_click`, `cta_substack_click`) | grows from zero | 2026-09-20 |
| BigQuery export (both properties) | One row per event, daily tables `events_YYYYMMDD` | see above | 2026-09-20, not backfilled |
| Google Search Console (both sites) | Queries, impressions, clicks, position | grows over time | site verified 2026-09 |
| Substack subscriber export and stats | Subscription date and source (aggregate by day) | ~1K subscribers | to be exported |
| Audience survey (Google Forms) | Stated interests, goals, formats ([design](../docs/survey-design.md)) | *not launched* | — |
| `landing-page/data/resources.json` | The catalogue shown on the Learning Library: 44 items with type, topic, level, free/paid, provider, description, link | 44 rows | in this repo (public, curated by hand) |

## Reproducing the analysis

1. Link GA4 to BigQuery (Admin → Product links → BigQuery links, daily export of events only).
2. Put the project and dataset names in the placeholders of [`sql/`](../sql/) and run the scripts.
3. For practice on the table structure before your own data accumulates, Google publishes a sample GA4 export: `bigquery-public-data.ga4_obfuscated_sample_ecommerce`. It is an e-commerce site with different events, so only the schema (nested `event_params`, `UNNEST`) carries over.

## Privacy

Event parameters describe resources and interface state (topic, level, position). They never contain names, emails or survey answers. Search terms are free text typed by visitors and are treated as behavioral data; the survey is anonymous.
