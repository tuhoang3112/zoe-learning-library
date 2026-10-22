# Tracking audit: Substack and Learning Library

What can and cannot be measured on the two sites, and what I did about it. Audit date: 2026-09-20, using GA4 reports, Tag Manager Preview and Substack's settings.

## The main finding

GA4 on the newsletter showed **0 key events**. The cause was **configuration, not the platform**:

- Tag Manager was installed with only the default Google tag (page views and GA4's automatic events). No custom event had been designed.
- No tag, trigger or key event existed for subscriptions, so conversions were invisible. The `sign_up` event was set up in the fix (a Custom Event trigger and a GA4 Event tag); it still has to be confirmed with a real subscription, because so far it has only been tested by pushing the event name from the browser console.

## What Substack allows

Tag Manager on Substack only runs **Google tags and built-in triggers** (click, scroll depth, timer, element visibility, custom event). Custom HTML, custom JavaScript variables and non-Google pixels (including Microsoft Clarity) are blocked. Custom tracking therefore had to be built around that list.

## Problems found and fixes

| Problem | Effect | Fix |
|---|---|---|
| No event for subscriptions, no key event | Subscriptions invisible in GA4 | `sign_up` tag added (to be confirmed on a real subscription); key event pending |
| `scroll` fires only at 90% | Cannot see where readers drop off | Custom `scroll_depth` at 25, 50, 75, 90% |
| `click` only covers outbound links | Subscribe buttons not measured | `subscribe_click` per placement (header, popup, inline, footer, home) |
| `form_start` is typing, not signing up | Counts intent, not conversion | `sign_up` is the conversion |
| Links from apps and emails have no source | Inflated `(direct) / (none)` | UTM rules for every link ([`utm-rules.md`](utm-rules.md)) |
| Sources set by Substack itself (`activity_item`, `confirmation_email`...) | Cannot be renamed | Read them as "Substack internal", not as marketing channels |

## What was built

**Substack** (12 GA4 event tags, Google tags only): `sign_up`, `subscribe_click` (5 placements), `subscribe_popup_view`, `subscribe_popup_dismiss`, `scroll_depth` (25/50/75/90%), `read_time` (30/60/120 s on posts).

**Learning Library** (own code, no restriction): 8 events pushed to the Data Layer and sent by Tag Manager: resource impressions and clicks, search, filters, topic clicks, product banner clicks, and clicks toward Substack and Buy Me a Coffee. Details in [`tracking-plan.md`](tracking-plan.md).

**Buy Me a Coffee:** a GA4 stream inside the Library property, connected through the platform's Google Analytics field (the only option it offers).

Supporting setup: GA4 data export to BigQuery on both properties, custom dimensions for the event parameters, and Search Console verified on both sites.

## Status

All of the above is live (Library since 2026-09-20, Substack since 2026-10-22). Still to do: confirm that `sign_up` fires on a real subscription, then mark it as a key event once it appears in GA4.

## Limits

- The two properties share no user id, so the sites are linked by campaign name, never by person.
- Email opens and reading inside the Substack app are not measured by GA4.
- Ad blockers and the lack of a consent banner mean counts are a lower bound.
- Substack's own statistics (subscribers by source and post) stay the source of truth for subscriber counts; GA4 is used for behaviour.
