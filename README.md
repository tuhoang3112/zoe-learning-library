# Marketing Tracking & Behavioral Analytics — Zoe's Data & AI Lens

> Connecting three things that lived apart for a newsletter on Substack (what readers do, whether they subscribe, what they say they want), fixing what Google Analytics could not see, and building a site I control ([Zoe's Learning Library](https://tuhoang3112.github.io/zoe-learning-library/)) to collect clean behavioral data for analysis in GA4 and BigQuery.

**Status: measurement implemented on 2026-09-20; analysis in progress while data accumulates.** Numbers marked *to be measured* are filled in from real data as it arrives (see [Results](#results)).

## The 30-second version

| | |
|---|---|
| **Problem** | The newsletter had about 18K users and 35K sessions (Jan 2025 – Sep 2026, GA4). Substack's built-in statistics already show subscribers by date, source and post, but as a closed dashboard: totals only, no raw events, nothing about what readers do on the page. Google Analytics, which records behavior and can feed BigQuery, showed **0 key events** (Tag Manager was installed with default settings only). So behavior and outcome sat in two places that could not be joined. About a quarter of sessions (~9.5K) had no source (`direct / none`), and content choices rested on feel rather than on what the audience says versus does. |
| **Data** | Substack GA4 property (history since 2025) and Substack's own analytics (subscribers by date, source and post) + a new GA4 property for the Learning Library (since 2026-09-20), both GA4 properties exported daily to BigQuery (raw events, from 2026-09-20). Audience survey (Google Forms, planned). Search Console on both sites. |
| **Tools** | Google Tag Manager, Data Layer, GA4, BigQuery (SQL), Looker Studio, Google Search Console, Google Forms, vanilla JavaScript on GitHub Pages |
| **Result** | Tracking rebuilt on both sites: a documented audit, 6 Library events and 12 Substack tags, a UTM convention. Conversion tracking on Substack goes from **0 to `sign_up`, Subscribe clicks by placement, scroll depth and read time**. Effect numbers: see [Results](#results). |
| **Demo** | Live site: <https://tuhoang3112.github.io/zoe-learning-library/> · Case study: [`docs/case-study.md`](docs/case-study.md) · Dashboard: *to be published* |

## What the audit found

Tag Manager was already installed on the newsletter, but with default settings only: a single Google tag (page views and GA4's automatic events). No custom event had been designed. Reading the Data Layer and testing the platform showed:

- Substack pushes its own `sign_up` event into the Data Layer, but no tag forwarded it to GA4 and no event was marked as a key event. **The "0 key events" was a configuration gap, not a platform limit.**
- Custom GA4 events can be built with Google tags and Tag Manager's built-in triggers (click, scroll depth, timer, element visibility).
- The real limit is an allowlist: inside Tag Manager only Google tags and built-in triggers run on Substack (custom HTML, custom JavaScript variables and non-Google pixels such as Clarity are blocked). Substack's own settings add fields for GA4, Tag Manager, Facebook, X and Parse.ly pixels, but nothing for Clarity.

Knowing exactly what the platform allows, instead of living with the defaults, defined what could be fixed there and what had to move to a site I control. The evidence is in [`docs/tracking-audit.md`](docs/tracking-audit.md).

## What was built

```text
Reader ─► Learning Library / Substack ─► Data Layer ─► GTM ─► GA4 ─► BigQuery ─► SQL ─► Looker Studio
                     ▲                                        │
        UTM links (LinkedIn, email, cross-links)        Search Console
```

**1. Substack (closed platform): tracking fix with Google tags only.**
`sign_up` forwarded to GA4, Subscribe clicks by placement (header, popup, in-post, footer, home), popup views and dismissals, scroll depth (25/50/75/90%) and read time (30/60/120 s) on posts.

**2. Learning Library (own code): full tracking plan.**
A static site (HTML, CSS, vanilla JS, JSON) listing 44 courses, datasets and resources, with search and filters. Every interaction is pushed to the Data Layer with structured parameters (type, topic, level, free/paid, provider, catalogue position, position in the list shown):

| Event | Question it serves |
|---|---|
| `resource_impression` / `resource_click` | Click-through rate per resource, topic, level, price and list position |
| `library_search` (with `result_count`) | What people look for, and what they do not find (unmet demand) |
| `filter_apply`, `category_click` | How visitors explore |
| `cta_substack_click` (4 placements) | The main conversion: from library to newsletter |

**3. UTM convention and builder.**
A controlled vocabulary for source / medium / campaign, automatic UTM on every library → Substack link, and a small tool that builds compliant links ([`docs/utm-convention.md`](docs/utm-convention.md), [`tools/utm-builder.html`](tools/utm-builder.html)).

**4. SQL on raw GA4 data.**
Ten BigQuery scripts (funnels, CTR by position, zero-result searches, subscribe funnel, direct/none share, cross-site bridge) in [`sql/`](sql/).

## Results

| Measure | Before | After |
|---|---|---|
| Key events on Substack (GA4) | **0** | `sign_up` and Subscribe clicks tracked from 2026-09-20; counts *to be measured* |
| Behavior linked to subscribers | Substack statistics (totals) and GA4 (behavior) not joined | Joined by day and source, with the limit stated: *to be measured* |
| Events available on Substack | 7 automatic events (page view, scroll at 90%, outbound click…) | + custom events for Subscribe, scroll depth, read time |
| Share of sessions with no source (`direct / none`) | ~17% (28-day window to 2026-09-19); ~27% over the whole history | *to be measured* over 4 weeks of UTM-tagged links |
| Library conversion (`cta_substack_click` per session) | not tracked | *to be measured* |
| Biggest drop-off in the Library funnel | not tracked | *to be measured* |
| Searches with zero results | not tracked | *to be measured* |
| Stated vs. actual interest (survey vs. reading behavior) | no data | *to be measured* |

## Repository

```text
.
├── landing-page/      The site (deployed to GitHub Pages by GitHub Actions)
│   ├── js/            analytics.js is the single place where events are defined
│   └── data/          resources.json: the catalogue rendered by the page
├── gtm/               GTM container exports (import into Tag Manager)
├── sql/               BigQuery scripts on the raw GA4 export, numbered
├── notebooks/         Survey and "say vs. do" analysis (planned)
├── data/              Where data lives and how to reproduce it (no real data committed)
├── docs/              Tracking plan and audit, UTM convention, SEO/GEO check, survey design, case study
├── tools/             UTM builder
└── scripts/           build-seo.mjs: sitemap, canonical, structured data
```

## Project checklist

| Requirement | Status |
|---|---|
| Tracking audit on Substack | Done — [`docs/tracking-audit.md`](docs/tracking-audit.md) |
| Tracking fix on Substack (GTM, Google tags only) | Deployed 2026-09-20; key events to be marked once events appear in GA4; before/after counts pending |
| UTM governance | Convention and builder done; before/after `direct / none` measurement pending |
| Conversion before key events (aggregate by day) | Substack analytics reviewed ([`docs/substack-analytics.md`](docs/substack-analytics.md)); snapshots of subscribers by source and post to be saved on a schedule, then joined with GA4 by day and source |
| Tracking plan and Data Layer on the Learning Library | Done — [`docs/tracking-plan.md`](docs/tracking-plan.md) |
| Search behavior (zero-result searches) | Implemented; analysis pending data |
| Tracking validation | GTM Preview and GA4 Realtime done for the main events; DebugView and evidence screenshots to add |
| Search performance (Search Console) | Connected on both sites; analysis pending data |
| SEO tool and GEO / AI search check | Protocol written — [`docs/seo-geo-check.md`](docs/seo-geo-check.md); SEMrush and AI citation checks pending; Clarity not installed (see that file) |
| Funnel and user journey | SQL written; pending data |
| Segment analysis, diagnostic | Pending data |
| Audience survey and "say vs. do" | Design done — [`docs/survey-design.md`](docs/survey-design.md); survey not launched |
| Insight, recommendations, dashboard | Pending data |

## Run it locally

```bash
cd landing-page
python -m http.server 8000      # or: npx serve .
```

Open <http://localhost:8000>. The page loads `data/resources.json` with `fetch`, so it cannot be opened from the file system directly.

To regenerate the sitemap, canonical tags and structured data after changing the URL or the catalogue: `node scripts/build-seo.mjs`.

## Deployment

Pushing to `main` deploys the `landing-page/` folder with GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)). The public address does not depend on the folder layout.

## Limits to keep in mind

- Attribution between the two sites is aggregate (by day and campaign), never by person: the properties share no user id.
- Email opens and reading inside the Substack app are not measured by GA4.
- Ad blockers and the lack of a consent banner mean counts are a lower bound.
- The survey reaches people who already read the newsletter: results describe engaged readers, not the market.

## Tech notes

Stack and design decisions: [`docs/tech-stack.md`](docs/tech-stack.md). Data model and event parameters: [`docs/data-dictionary.md`](docs/data-dictionary.md).
