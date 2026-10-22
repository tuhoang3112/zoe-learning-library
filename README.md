# Zoe's Learning Library

A curated learning library (courses, ebooks, tools and templates for data, marketing and AI), plus the tracking system behind it. Built to measure what visitors do across a small content ecosystem: a static site, a Substack newsletter and a Buy Me a Coffee shop.

Live site: <https://tuhoang3112.github.io/zoe-learning-library/>

## What is live

**1. The site** (`landing-page/`, plain HTML, CSS and vanilla JS, deployed to GitHub Pages)
- 55 resources with search and filters (topic, type, level, free or paid), grouped into six topics.
- "Tools made by Zoe" highlight band for Zoe's own paid products, and a row of popular newsletter posts.
- Cover image for every resource (hotlinked or illustrated) with a gradient fallback.
- The catalogue is one JSON file: [`landing-page/data/resources.json`](landing-page/data/resources.json).

**2. Tracking** (Google Tag Manager and GA4)
- Library container: 8 events pushed through the Data Layer (`resource_impression`, `resource_click`, `library_search`, `filter_apply`, `category_click`, `tool_banner_click`, `cta_substack_click`, `cta_buymeacoffee_click`). Every event is defined in one file, [`landing-page/js/analytics.js`](landing-page/js/analytics.js).
- Substack container: 12 GA4 event tags using Google tags and built-in triggers only (`sign_up`, Subscribe clicks by placement, popup views and dismissals, scroll depth, read time). Substack does not allow custom code, so this was built around its allowlist.
- Buy Me a Coffee: a GA4 stream inside the Library property, connected through the platform's Google Analytics ID field.
- Both containers are exported to [`gtm/`](gtm/) so the repository matches what is live.

**3. UTM governance**
- One rule set for every link published on Substack, the Library, Buy Me a Coffee, LinkedIn, YouTube and Facebook: [`docs/utm-rules.md`](docs/utm-rules.md).
- Links from the Library are tagged automatically by code; a local builder ([`tools/utm-builder.html`](tools/utm-builder.html), open it in a browser) creates compliant links for posts.

## Documentation

| File | What it covers |
|---|---|
| [`docs/tracking-rules.md`](docs/tracking-rules.md) | Channel map, event naming rules, key events, release rule for containers |
| [`docs/tracking-plan.md`](docs/tracking-plan.md) | Library events, triggers and parameters |
| [`docs/tracking-audit.md`](docs/tracking-audit.md) | What the Substack and Library audit found, and what was fixed |
| [`docs/utm-rules.md`](docs/utm-rules.md) | UTM format, vocabulary, automatic links and examples |
| [`docs/data-dictionary.md`](docs/data-dictionary.md) | Resource fields and event parameters |

## Repository

```text
.
├── landing-page/      The site (deployed to GitHub Pages by GitHub Actions)
│   ├── js/            analytics.js is the single place where events are defined
│   └── data/          resources.json (catalogue) and posts.json (popular posts)
├── gtm/               GTM container exports (import into Tag Manager)
├── docs/              Tracking and UTM documentation
├── tools/             UTM builder
└── scripts/           build-seo.mjs: sitemap, canonical, structured data
```

## Run it locally

```bash
cd landing-page
python -m http.server 8000      # or: npx serve .
```

Open <http://localhost:8000>. The page loads `data/resources.json` with `fetch`, so it cannot be opened from the file system directly. Tag Manager does not load on `localhost`; add `?gtm=on` to the URL to test tracking on purpose.

To regenerate the sitemap, canonical tags and structured data after changing the URL or the catalogue: `node scripts/build-seo.mjs`.

## Deployment

Pushing to `main` deploys the `landing-page/` folder with GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)). Changes to the Tag Manager containers are published from Tag Manager itself, not from this repository.

## Limits to keep in mind

- Attribution between the sites is aggregate (by day and campaign), never by person: the properties share no user id.
- Email opens and reading inside the Substack app are not measured by GA4.
- Ad blockers and the lack of a consent banner mean counts are a lower bound.
- Buy Me a Coffee only exposes the Google Analytics ID field: page views and sources are measured, purchases are not.
