# Tech stack

## Architecture

```text
resources.json → static frontend → user interactions → dataLayer → GTM → GA4 → BigQuery → Looker Studio
```

## Technologies and why

| Tech | Why |
|---|---|
| HTML/CSS/vanilla JS | Static, tiny, no build step; V1 does not need React/Next.js |
| JSON (`landing-page/data/resources.json`) | The catalogue is static; no database needed. Metadata is defined once, not repeated in HTML |
| Client-side search | Dataset is small; AND-term matching over title, description, provider, tags, topic, type, level. Fuse.js only if the dataset grows enough to need fuzzy search |
| GTM | Central tag layer; app code only pushes to `dataLayer` |
| GA4 → BigQuery | Raw event export for SQL analysis. BigQuery is for analytics, not for serving the app |
| Clarity (via GTM) | Heatmaps and session recordings |
| Google Search Console | Indexing and search-query visibility |
| GitHub Pages | Free static hosting, portable to any static host |

## Code layout

| File | Role |
|---|---|
| `landing-page/js/config.js` | Site URL + taxonomy (topics, types, levels, access) — single source |
| `landing-page/js/analytics.js` | `pushDataLayer` and all event helpers |
| `landing-page/js/search.js` | Query matching |
| `landing-page/js/filters.js` | Filter state, URL sync, combined filtering |
| `landing-page/js/app.js` | Library rendering, events, resource click tracking (cards link straight to the external site) |
| `scripts/build-seo.mjs` | Generates sitemap.xml, robots.txt, canonical tags from `SITE_URL` |

## Not in V1

Accounts, backend, database, CMS, admin, ratings, bookmarks, recommendations, chatbot, payments, price tracking, server-side analytics.
