# Baseline: Substack tracking before the fix

How the ZoeDataLens newsletter looked in GA4 **before** the tracking fix. It is the "before" half of the before/after comparison; the "after" half is added once the same window of data exists.

**Window:** 28 days, 23 Aug to 19 Sep 2026. **Source:** GA4 reports of the Substack property. Figures are rounded; shares are of total sessions.

## Headline numbers

| Metric | Value |
|---|---|
| Active users | ~1.2K |
| Sessions | ~2.2K |
| Average engagement time | ~1 min 50 s |
| Key events | **0** |

## Where sessions came from

| Source / medium | Share of sessions | Note |
|---|---|---|
| `google / organic` | ~46% | The main channel, larger than every other source |
| `(direct) / (none)` | ~17% | Hidden sources: untagged links from apps and emails land here |
| `linkedin.com / referral` | ~14% | |
| `l.facebook.com / referral` | ~3% | |
| `multiple-personal-recommendation-email / email` | ~2% | Set by Substack |
| `activity_item` and `confirmation_email` (`(not set)`) | ~3% together | Set by Substack, cannot be renamed |
| Other sources | ~15% | |

## What GA4 recorded as events

| Event | Count (rounded) | Reading |
|---|---|---|
| `page_view` | ~3.1K | |
| `scroll` | ~580 | Fires only at 90% of the page, so it cannot show where readers drop off |
| `click` | ~140 | Outbound links only, subscribe buttons are not measured |
| `form_start` | ~30 | Counts typing in the form, not signing up |
| `sign_up` | **not present** | Pushed by Substack into the Data Layer but never sent to GA4 |

## What this baseline shows

- Conversions were invisible: 0 key events while the newsletter was gaining subscribers (Substack's own statistics, outside GA4).
- About one session in six had no known source.
- Behaviour events were too coarse to describe reading: one scroll depth, no subscribe-button clicks.

These are the gaps the fix in [`tracking-audit.md`](tracking-audit.md) addresses, and the UTM rules in [`utm-rules.md`](utm-rules.md) address the source gap.

## How the "after" will be measured

Same property, a **28-day window that starts after the fix** (Substack tracking live since 2026-10-22), same metrics:

1. Key events: from 0 to the count of `sign_up` and `subscribe_click`, once marked as key events.
2. Share of `(direct) / (none)`: before ~17%, after = to be measured.
3. Behaviour: scroll depth at 25/50/75/90% and read time instead of a single 90% scroll.

## Limits

- Different 28-day windows differ in posting schedule and seasonality, so the comparison shows direction, not exact causal effect.
- Subscriber counts come from Substack's own statistics and are not joined to GA4 sessions per person, only by day.
- Ad blockers and the lack of a consent banner mean GA4 counts are a lower bound.
