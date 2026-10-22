# Tracking rules

The master rules for measuring every channel in Zoe's Data & AI Lens. Detail lives in the files linked below; this page decides **what is measured where, who owns the numbers, and what to do when a channel is added**.

## 1. Channel map

| Channel | Role | Measured by | Tag manager | Key events | Source of truth for outcomes |
|---|---|---|---|---|---|
| **Learning Library** (own site) | Discovery, owns the full tracking plan | GA4 property "Zoe Learning Library" | GTM `GTM-M8CHLXMT`, you control everything | `cta_substack_click`, `resource_click` | GA4 / BigQuery |
| **Substack** (newsletter) | Subscriber conversion | GA4 property "Zoe Substack" | GTM `GTM-WNCRKDD8`, Google tags and built-in triggers only | `sign_up` | Substack's own statistics for subscribers; GA4 for behaviour |
| **Buy Me a Coffee** (shop, `/zoedatalensai` and `/extras`) | Sales of paid products | A web data stream named "Buy Me a Coffee" inside the **Library** GA4 property, connected through the Google Analytics ID field in page settings (stream created 2026-10-22) | None: no GTM or custom tags on the platform | None until a stream exists | Buy Me a Coffee dashboard for sales and revenue |
| **LinkedIn, Facebook, Zalo, Threads, YouTube, email** | Traffic sources | UTM on every published link | n/a | n/a | The platform's own analytics for reach |

Rule: **each platform's own dashboard is the source of truth for what happens inside it** (subscribers, sales, reach). GA4 explains behaviour and attribution. Never reconcile the two per person, only by day and source.

## 2. Principles

1. **Every link I publish carries UTM** ([`utm-rules.md`](utm-rules.md)). No tagged link, no attribution.
2. **Own sites go through the Data Layer.** Events are defined once, in `analytics.js`, and sent by GTM. Nothing is hard-coded in GA4 tags per resource.
3. **Closed platforms get the minimum they allow.** Substack: Google tags and built-in triggers. Buy Me a Coffee: only the GA ID field.
4. **Measure outbound clicks at the source**, because the destination may not be measurable. A click from the Library to a Buy Me a Coffee product is recorded as `resource_click` on the Library.
5. **No personal data in any event parameter** ([`tracking-plan.md`](tracking-plan.md), Privacy).
6. **Name before you build.** A new event or UTM value is added to the tables here first.

## 3. Event naming

### 3.1 Format

An event name is **`<object>_<action>`**, lowercase `snake_case`, in English.

| Part | Meaning | Allowed values |
|---|---|---|
| `<object>` | What the visitor interacts with: a content type or a named part of the page | `resource`, `category`, `library`, `filter`, `tool_banner`, `subscribe`, `scroll`, `read` ... |
| `<action>` | What happens. Pick one from the list, do not invent new verbs | `click`, `impression`, `search`, `apply`, `view`, `dismiss`, `depth`, `time` |

### 3.2 Link out of the site: `cta_<destination>_click`

A call-to-action that leads to another place uses **`cta_<destination>_click`**. The destination is in the name, the placement is in the parameter `cta_location`.

| Event | Destination | Placement in `cta_location` |
|---|---|---|
| `cta_substack_click` | Zoe's Substack | `header`, `banner`, `resource_card`, `blog_card`, `about_link`, `footer` |
| `cta_buymeacoffee_click` | Buy Me a Coffee (the donate button) | `footer` |

### 3.3 Rules

1. **One action, one event.** Details go in parameters, not in the name (`resource_click` with `resource_id`, never `resource_zoe_click`).
2. **Placement goes in a parameter** (`cta_location`), not in the name. The one exception is a **named component** that has its own behaviour and shows content that also appears elsewhere: it may be the `<object>` (`tool_banner_click`, to tell it from `resource_click` on the same product in the library).
3. **Reuse before you create.** Check [`tracking-plan.md`](tracking-plan.md) first. A new link to Substack is a new `cta_location` value, not a new event.
4. **Never reuse names GA4 already owns:** `click`, `scroll`, `page_view`, `session_start`, `first_visit`, `form_start`, `user_engagement`, `purchase`...
5. **Conversion names follow GA4 where one exists** (`sign_up`). `form_start` is intent, not conversion.
6. **Parameters** are `snake_case` and mean the same everywhere (`resource_id`, `topic`, `cta_location`). A parameter you want in reports is registered as a custom dimension (Event scope).
7. **No personal data** in any name or parameter.
8. **Tag Manager names mirror the event:** trigger `CE - <event>`, tag `GA4 Event | <event>`, variable `dlv - <parameter>`. When several tags send the same event (one per placement), a suffix is allowed (`GA4 Event | subscribe_click header`).
9. **Write it down before you code it:** add the event to [`tracking-plan.md`](tracking-plan.md) (and to the table below when it belongs to a new pattern).

### 3.4 Current events

| Event | Object and action | Property |
|---|---|---|
| `resource_impression`, `resource_click` | resource: impression, click | Library |
| `category_click` | category: click | Library |
| `library_search` | library: search | Library |
| `filter_apply` | filter: apply | Library |
| `tool_banner_click` | tool banner: click | Library |
| `cta_substack_click`, `cta_buymeacoffee_click` | CTA out of the site (3.2) | Library |
| `sign_up` | GA4 conversion name | Substack |
| `subscribe_click`, `subscribe_popup_view`, `subscribe_popup_dismiss` | subscribe button / popup: click, view, dismiss | Substack |
| `scroll_depth`, `read_time` | scroll: depth, read: time | Substack |

Known deviations (kept on purpose, they already hold data):
- Substack uses `subscribe_location` for the placement of `subscribe_click`; the Library uses `cta_location`.

Events per property: Library in [`tracking-plan.md`](tracking-plan.md); Substack in [`tracking-audit.md`](tracking-audit.md) (§ tag plan).

## 4. Key events

A key event marks an outcome that matters, not an interaction:

| Property | Mark as key event | Do not mark |
|---|---|---|
| Library | `cta_substack_click`, `resource_click` | `resource_impression` (it is a denominator), `filter_apply`, `category_click` |
| Substack | `sign_up` | `form_start` (typing an email is not signing up) |
| Buy Me a Coffee | none until a real conversion signal exists | |

## 5. UTM for Buy Me a Coffee links

Links to `buymeacoffee.com/zoedatalensai` follow the same rules as every other link. The vocabulary, formats and examples live in [`utm-rules.md`](utm-rules.md) (campaign `bmc-shop` for product links placed on Substack and social media, `resource_card` for Library cards).

## 6. Adding a new channel (checklist)

- [ ] Add a row to §1 (role, measured by, source of truth).
- [ ] Decide what the platform allows: tag manager, GA ID field, or nothing.
- [ ] If it only offers a GA ID: create a **new web data stream**, paste its Measurement ID, test in Realtime.
- [ ] Add the `utm_source` and `utm_medium` rows to [`utm-rules.md`](utm-rules.md) §3 first.
- [ ] Add the destination type to [`tools/utm-builder.html`](../tools/utm-builder.html) if links to it are published often.
- [ ] Tag existing links that point to it (code in `analytics.js` for own sites, the builder for posts).
- [ ] Mark key events (§4) only after the events appear in GA4.
- [ ] Record the date in the change log below and in the README checklist.

## 7. Release rule for tag containers

1. Change in the workspace, never edit the live version.
2. Preview on the real site, read **Tags Fired** and **Tags Not Fired**.
3. Submit with a clear version name, then publish.
4. Check GA4 **Realtime** the same day, **Events** the next day.
5. Export the container into `gtm/` so the repository matches what is live.

GTM does not load on `localhost`, so local testing never sends data to GA4. To test tracking from a local run on purpose, add `?gtm=on` to the local URL.

## 8. Known gaps

- Buy Me a Coffee stream is live (data confirmed in Realtime on 2026-10-22, pages: profile, shop and product pages). It shares the Library property. Reports (and any BigQuery query on the raw export) must filter by data stream or hostname to separate the two sites. If the shop later moves onto the Library site, retire the stream and add purchase events to the tracking plan.
- Buy Me a Coffee only exposes the GA ID field: no custom events and no purchase data. Revenue comes from the Buy Me a Coffee dashboard.
- Substack tags were published on 2026-10-22; counts start from that date.
- Library `resource_impression` and `list_position` start on 2026-10-22; earlier rows have no position data.
- `gtm/*.json` exports in this repository must be refreshed to match the live containers.

## 9. Change log

| Date | Change |
|---|---|
| 2026-10-22 | File created. Substack container published (12 event tags); Library container gained `resource_impression` and `list_position`; `list_position` registered as a custom dimension |
