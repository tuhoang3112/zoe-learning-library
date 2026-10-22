# Zoe's Learning Library

A curated learning library (courses, ebooks, tools and templates for data, marketing and AI) and the measurement system behind it. I built it to see what visitors actually do across a small content ecosystem: a static site, a Substack newsletter and a Buy Me a Coffee shop.

**Live site:** <https://tuhoang3112.github.io/zoe-learning-library/>

*Solo project: analyst and builder (tracking design, front end, tag management, documentation).*

> **Status: phase 1 of 2.** Phase 1 (this repository) is the **tracking set-up**: audit, fix, tag management and UTM rules. Phase 2 is the **analysis** on the data these systems collect (funnels, content and source performance, SEO and AI-search visibility, audience survey). Tracking went live on the Library on 2026-09-20 and on Substack on 2026-10-22, so phase 2 starts once enough data has accumulated.

## The problem (baseline before the fix)

The ZoeDataLens newsletter on Substack has real traffic (about 2.2K sessions and 1.2K users in the 28 days before the fix, 23 Aug to 19 Sep 2026) but GA4 could not say what that traffic achieved:

| Baseline (28 days before the fix) | Value |
|---|---|
| Key events in GA4 | **0** |
| `(direct) / (none)` share of sessions | **about 17%**, more than LinkedIn (about 14%): real sources were hidden |
| Sources set by Substack itself (`activity_item`, `confirmation_email`...) | Not UTM-compliant, mixed in with marketing channels |

What readers do (GA4) and what they achieve (new subscribers, in Substack's own statistics) lived in two places and could not be joined. A closer look showed this was a configuration gap, not a platform limit: Substack already pushes a `sign_up` event, but no tag sent it to GA4. Traffic from apps and emails arrived without a source because links carried no UTM.

## What I did

**1. A site I control** (`landing-page/`): a searchable library of 55 resources with filters, a highlight band for my own products and a row of popular newsletter posts. Plain HTML, CSS and vanilla JS, deployed to GitHub Pages by GitHub Actions. The catalogue is one JSON file.

**2. A tracking system** (Google Tag Manager and GA4)
- **Library:** 8 events pushed through the Data Layer, all defined in one file ([`analytics.js`](landing-page/js/analytics.js)): resource impressions and clicks, search, filters, topic clicks, product banner clicks, and clicks toward Substack and Buy Me a Coffee.
- **Substack:** 12 GA4 event tags built with Google tags and built-in triggers only, because Substack blocks custom code: `sign_up`, Subscribe clicks by placement, popup views and dismissals, scroll depth and read time. `sign_up` now reaches GA4; marking it as a key event is the next step (see Status below).
- **Buy Me a Coffee:** a GA4 stream inside the Library property, connected through the platform's Google Analytics ID field.
- Both Tag Manager containers are exported to [`gtm/`](gtm/) so the repository matches what is live.

**3. UTM governance:** one rule set for every link published on Substack, the Library, Buy Me a Coffee, LinkedIn, YouTube and Facebook, links from the Library tagged automatically by code, and a small local tool ([`tools/utm-builder.html`](tools/utm-builder.html), open it in a browser) that builds compliant links.

## Skills shown

Google Tag Manager (triggers, tags, Data Layer, container import and export) · GA4 (events, key events, custom dimensions, data streams) · UTM taxonomy and channel attribution · JavaScript · HTML and CSS · GitHub Pages and Actions · documentation.

## Documentation

| File | What it covers |
|---|---|
| [`docs/tracking-audit.md`](docs/tracking-audit.md) | What the audit of Substack and the Library found, and what was fixed |
| [`docs/tracking-plan.md`](docs/tracking-plan.md) | The Library events, when they fire and what they measure |
| [`docs/utm-rules.md`](docs/utm-rules.md) | UTM format, vocabulary, automatic links and examples |

## Repository

```text
.
├── landing-page/      The site (deployed to GitHub Pages by GitHub Actions)
│   ├── js/            analytics.js is the single place where events are defined
│   └── data/          resources.json (catalogue) and posts.json (popular posts)
├── gtm/               GTM container exports (import into Tag Manager)
├── docs/              Audit, tracking plan and UTM rules
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

## Status and next steps

| Item | State |
|---|---|
| Library tracking (8 events), GTM + GA4 | Live since 2026-09-20 |
| Substack tracking (12 event tags), GTM + GA4 | Live since 2026-10-22 |
| UTM rules and builder | Done, applied to new links |
| Mark `sign_up` as a GA4 key event | Pending: it must appear in GA4 first |
| Results: key events and `(direct) / (none)` share, before vs after | Pending: data is accumulating, the same 28-day comparison will be added here |
| Phase 2: analysis, dashboard, SEO / AI-search check, audience survey | Not started |

## Limits to keep in mind

- Attribution between the sites is aggregate (by day and campaign), never by person: the properties share no user id.
- Email opens and reading inside the Substack app are not measured by GA4.
- Ad blockers and the lack of a consent banner mean counts are a lower bound.
- Buy Me a Coffee only exposes the Google Analytics ID field: page views and sources are measured, purchases are not.
