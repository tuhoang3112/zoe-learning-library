# Case study — From "views" to "outcomes": rebuilding the measurement of a newsletter

**Project:** Marketing Tracking & Behavioral Analytics · **Role:** analyst and builder (solo) · **Status:** measurement live since 2026-09-20; analysis in progress

*Written for people who do not read code. Sections that depend on data still being collected say so, and no number in them is an estimate.*

## Problem

I write a newsletter on Substack about data and AI. It has about **18,000 users and 35,000 sessions** (Jan 2025 – Sep 2026), yet I could not answer basic questions:

- **Which posts and channels bring subscribers**, not just visits? Analytics showed **0 conversions**.
- **Where do readers really come from?** About **a quarter of sessions (~9,500) had no source at all** ("direct / none"), almost as many as LinkedIn, so the real channels were hidden.
- **What does the audience actually want?** Content decisions were made by feel.

Without an outcome measure, more traffic could not be told apart from more results.

## Approach

**1. Check the constraint instead of assuming it.**
The starting belief was that Substack, a closed platform, only allows a basic page-view tag. I tested it. Substack does accept a Google Tag Manager container and it pushes its own sign-up event; nothing was sending that event to analytics. So the "0 conversions" came from a **setup gap**, not from the platform. The real limit is narrower: only Google's own tags run there. (Evidence: [tracking audit](tracking-audit.md).)

**2. Fix what can be fixed on Substack.**
Forward the sign-up event to analytics; measure Subscribe clicks by where they happen (menu, pop-up, inside the post, footer, home page); measure how far people scroll and how long they stay on a post.

**3. Build a site I fully control to collect richer data.**
A curated learning library (44 courses, datasets and resources) with search and filters. Every action a visitor takes is recorded with structured details: topic, level, free or paid, position in the list, and what was searched, including searches that returned nothing (unmet demand). The library also sends visitors to the newsletter, which is its main goal.

**4. Make traffic sources readable.**
A naming convention for the tracking tags on every link I publish (LinkedIn, Facebook, email, and links between my own sites), with a builder tool so it stays consistent. The effect is measured by comparing the share of source-less traffic before and after.

**5. Keep the raw data.**
Both sites export every event to BigQuery, so questions can be answered with SQL instead of being limited to the reports the analytics tool offers.

**6. Ask the audience, then compare with behavior.**
A short anonymous survey on what readers say they want, compared with what they actually read. The gap between the two is the most useful part.

## Tech stack

Google Tag Manager · Data Layer · Google Analytics 4 · BigQuery (SQL) · Looker Studio · Google Search Console · Google Forms · HTML, CSS and JavaScript on GitHub Pages (deployed with GitHub Actions)

## Results

| Measure | Before | After |
|---|---|---|
| Conversions measured on the newsletter | **0** | Sign-ups and Subscribe clicks tracked from 2026-09-20; counts *to be measured* |
| Signals available about readers | 7 automatic ones (views, scroll at 90%, outbound clicks…) | + Subscribe clicks by placement, scroll depth at 4 levels, time on post |
| Sessions with no source | ~17% (28 days to 2026-09-19); ~27% over the whole history | *to be measured after 4 weeks of tagged links* |
| Library visitors who click through to the newsletter | not tracked | *to be measured* |
| Largest drop-off in the library funnel | not tracked | *to be measured* |
| Searches that returned nothing | not tracked | *to be measured* |
| Topics readers want but do not read (survey vs. behavior) | no data | *to be measured* |

*This table is updated when the data exists; the "after" values are left as "to be measured" on purpose.*

## What I learned so far

- **A constraint is a hypothesis until tested.** The platform limit I had accepted turned out to be a configuration gap. Testing it changed the whole plan and is documented as evidence.
- **Attribution across two sites can only be aggregate.** The two analytics properties share no user id, so I can link them by campaign and day, not by person. Every analysis states that.
- **Some numbers will always be a lower bound.** Ad blockers, email clients and the mobile app hide part of the traffic. Measuring less is not the same as measuring wrong, as long as the gap is stated.
- **Design the measurement before the data arrives.** Position in the list, impressions and clicks are recorded together from day one; a missing denominator (how often something was shown) cannot be rebuilt later.

## Limits

- The survey reaches people who already read the newsletter and chose to answer; it describes engaged readers, not the market.
- With the default alphabetical order, an item's position and the item itself cannot be separated; the position analysis is a first look, not a proof.
- Heatmaps and session recordings were not added: traffic is still small and the recorded events already answer the main questions (recorded as a decision in [SEO/GEO check](seo-geo-check.md)).

## Links

- Live site: <https://tuhoang3112.github.io/zoe-learning-library/>
- Code and documentation: this repository ([README](../README.md))
- Newsletter: <https://zoedatalens.substack.com/>
- Dashboard: *to be published*
