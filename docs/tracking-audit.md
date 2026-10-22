# Tracking audit and baseline: Substack and Learning Library

What could and could not be measured on the two sites, how the newsletter looked in GA4 **before** the fix, and what was done about it. Audit date: 2026-09-20, using GA4 reports, Tag Manager Preview and Substack's settings. What was built is in [`tracking-plan.md`](tracking-plan.md).

## The main finding

GA4 on the newsletter showed **0 key events**. The cause was **configuration, not the platform**:

- Tag Manager was installed with **only the Google tag** (the one that connects the site to GA4). No trigger, no event tag and no other configuration existed, so GA4 collected only its automatic events (page views, enhanced measurement). That is the starting point, not a fault: everything beyond it was built in the fix.
- No tag, trigger or key event existed for subscriptions, so conversions were invisible. The `sign_up` event was set up in the fix (a Custom Event trigger and a GA4 Event tag); it still has to be confirmed with a real subscription, because so far it has only been tested by pushing the event name from the browser console.
- About one session in six had no known source (`(direct) / (none)`).

## What Substack allows

Tag Manager on Substack only runs **Google tags and built-in triggers** (click, scroll depth, timer, element visibility, custom event). Custom HTML, custom JavaScript variables and non-Google pixels (including Microsoft Clarity) are blocked. Custom tracking therefore had to be built around that list.

## Baseline before the fix

**Window:** 28 days, 23 Aug to 19 Sep 2026. **Source:** GA4 reports of the Substack property. Figures are rounded; shares are of total sessions.

| Metric | Value |
|---|---|
| Active users | ~1.2K |
| Sessions | ~2.2K |
| Average engagement time | ~1 min 50 s |
| Key events | **0** |

**Where sessions came from**

| Source / medium | Share of sessions | Note |
|---|---|---|
| `google / organic` | ~46% | The main channel, larger than every other source |
| `(direct) / (none)` | ~17% | Hidden sources: untagged links from apps and emails land here |
| `linkedin.com / referral` | ~14% | |
| `l.facebook.com / referral` | ~3% | |
| `multiple-personal-recommendation-email / email` | ~2% | Set by Substack |
| `activity_item` and `confirmation_email` (`(not set)`) | ~3% together | Set by Substack, cannot be renamed |
| Other sources | ~15% | |

**What GA4 recorded as events** (automatic events only)

| Event | Count (rounded) | What it can tell | What it cannot tell |
|---|---|---|---|
| `page_view` | ~3.1K | Which pages were viewed | |
| `scroll` | ~580 | That someone reached the bottom of a page | Fires once at 90%, so no view of where readers stop |
| `click` | ~140 | Outbound link clicks | Subscribe buttons and other on-site clicks |
| `form_start` | ~30 | That someone started typing in a form | Whether they actually signed up |
| `sign_up` | none | Nothing: not configured yet | No tag or trigger existed for it, so subscriptions were not recorded |

## Problems found and fixes

| Problem | Effect | Fix |
|---|---|---|
| No event for subscriptions, no key event | Subscriptions invisible in GA4 | `sign_up` tag added (to be confirmed on a real subscription); key event pending |
| `scroll` fires only at 90% | Cannot see where readers drop off | Custom `scroll_depth` at 25, 50, 75, 90% |
| `click` only covers outbound links | Subscribe buttons not measured | `subscribe_click` per placement (header, popup, inline, footer, home) |
| `form_start` is typing, not signing up | Counts intent, not conversion | `sign_up` is the conversion |
| Links from apps and emails have no source | Inflated `(direct) / (none)` | UTM rules for every link ([`utm-rules.md`](utm-rules.md)) |
| Sources set by Substack itself (`activity_item`, `confirmation_email`...) | Cannot be renamed | Read them as "Substack internal", not as marketing channels |

Supporting setup: GA4 data export to BigQuery on both properties, custom dimensions for the event parameters, and Search Console verified on both sites.

## How the "after" will be measured

Same property, a **28-day window that starts after the fix** (Substack tracking live since 2026-10-22; the window starts the day after, 23 Oct to 19 Nov), same metrics:

1. Key events: from 0 to the count of `sign_up` and `subscribe_click`, once marked as key events.
2. Share of `(direct) / (none)`: before ~17%, after = to be measured.
3. Behaviour: scroll depth at 25/50/75/90% and read time instead of a single 90% scroll.

## Limits

- Different 28-day windows differ in posting schedule and seasonality, so the comparison shows direction, not exact causal effect.
- The two properties share no user id, so the sites are linked by campaign name and by day, never by person.
- Substack's own statistics (subscribers by source and post) stay the source of truth for subscriber counts; GA4 is used for behaviour. Email opens and reading inside the Substack app are not measured by GA4.
- Ad blockers and the lack of a consent banner mean GA4 counts are a lower bound.
