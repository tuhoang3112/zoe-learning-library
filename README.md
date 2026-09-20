# Zoe's Learning Library

A lightweight, public Learning Library for **Zoe's Data & AI Lens** — courses, datasets, books, tools and resources, browsable by topic, type, level and access.

## Purpose

The site is a real-world **behavioral analytics playground** for Project 5 (Marketing Tracking & Behavioral Analytics). It generates clean behavioral data (searches, filters, resource views/clicks, Substack CTA clicks) for later analysis in BigQuery and Looker Studio.

Primary conversion: `cta_substack_click` (a click toward Substack — **not** a Substack subscription).

## Tech stack

```text
HTML · CSS · JavaScript · JSON
GTM · GA4 · Clarity · GSC
BigQuery · Looker Studio
GitHub Pages
```

## Architecture

```text
Frontend → Data Layer → GTM → GA4 → BigQuery → SQL → Looker Studio
```

No backend, no database, no framework. Resource data lives in `data/resources.json`.

## Local development

`fetch()` does not work from `file://`, so serve the folder:

```bash
cd zoe-learning-library
python -m http.server 8000     # or: npx serve .
```

Open <http://localhost:8000>.

## Deployment (GitHub Pages)

1. Push this folder to a GitHub repository.
2. Settings → Pages → Deploy from branch → `main` / root.
3. Set `SITE_URL` in `js/config.js` to the final URL, then run `node scripts/build-seo.mjs` (regenerates `sitemap.xml`, `robots.txt`, canonical tags). Commit.

## Analytics setup

| What | Where |
|---|---|
| GTM container ID | Replace `GTM-XXXXXXX` in the snippet in `index.html` (head + noscript) |
| GA4 | Configure in GTM (Google tag + one GA4 event tag per custom event) — no ID in the code |
| Clarity | Install via GTM (Custom HTML / Clarity template) — no script in the code |
| Search Console token | Replace `GOOGLE_VERIFICATION_TOKEN` in `index.html` (see `docs/seo.md`) |

Never commit real secrets. Keep placeholders until the real IDs exist.

## Adding a resource

Append an object to `data/resources.json` (schema in `docs/data-dictionary.md`), give it the next `position`.

## Docs

- [Tech stack](docs/tech-stack.md)
- [Tracking plan](docs/tracking-plan.md)
- [Data dictionary](docs/data-dictionary.md)
- [SEO](docs/seo.md)
