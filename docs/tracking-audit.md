# Tracking audit — Substack and Learning Library

Audit of what can and cannot be measured on the two properties of the ZoeDataLens ecosystem, what the limits do to the numbers, and what was implemented in response.

- **Audit date:** 2026-09-20
- **Properties:** Substack publication (`zoedatalens.substack.com`) and the Learning Library (GitHub Pages)
- **Method:** GA4 reports, Google Tag Manager Preview (Tag Assistant) on both sites, Substack settings, inspection of the public pages
- **Numbers below** were read from GA4 screenshots taken on the audit date (window Aug 23 – Sep 19, 2026, about 28 days). They are a baseline, not final results.

## 1. Headline finding: the platform constraint is narrower than assumed

The starting assumption was that Substack only accepts a GA4 pageview tag and therefore cannot host Google Tag Manager, a Data Layer or custom events. The audit shows otherwise:

| Assumption | What was found |
|---|---|
| GTM cannot be installed | Settings → Analytics has a **Google Tag Manager ID** field. The container loads on the publication's pages (Tag Assistant: "Connected", container ID detected) |
| No Data Layer | Substack pushes its own `sign_up` event into `dataLayer` (`dataLayer.push({event: "sign_up", ...})`) with no other parameters |
| No custom events | Custom GA4 events can be created with **Google tags** and GTM's built-in triggers (click, scroll depth, timer, element visibility, custom event) |
| Zero key events because the platform is closed | Zero key events was a **configuration gap**: no event had been marked as a key event, and `sign_up` was pushed to the Data Layer but never forwarded to GA4 |

The real limit is what GTM is allowed to run. The `dataLayer` of every Substack page contains:

```text
gtm.allowlist: ["google"]
gtm.blocklist: ["customPixels", "customScripts", "html", "nonGooglePixels",
                "nonGoogleScripts", "nonGoogleIframes", "sandboxedScripts"]
```

| Allowed | Blocked |
|---|---|
| Google tag, GA4 Event tags | Custom HTML tags |
| Built-in triggers (click, scroll depth, timer, element visibility, custom event, history change) | Custom JavaScript variables |
| Constant and Data Layer variables | Non-Google pixels and scripts (this includes Microsoft Clarity) |
| Data pushed by Substack itself (`sign_up`) | Iframes from non-Google vendors |

## 2. Baseline before the changes (Substack GA4 property)

| Metric | Value |
|---|---|
| Active users / new users | 1.2K / 1.1K |
| Sessions | 2.2K |
| Average engagement time | 1 min 51 s |
| Key events | **0** |

**Events recorded** (all automatic GA4 events; total 8,559 events, 1,215 users):

| Event | Count | Users | Meaning on this site |
|---|---|---|---|
| `page_view` | 3,111 | 1,204 | Page views |
| `session_start` | 2,211 | 1,210 | Sessions |
| `user_engagement` | 1,421 | 880 | Visitor stayed engaged on the page |
| `first_visit` | 1,072 | 1,071 | New users |
| `scroll` | 580 | 356 | Scrolled to **90%** of the page (a single threshold) |
| `click` | 137 | 59 | Outbound link click (link leaves the domain) |
| `form_start` | 27 | 18 | Started typing in a form (the email box). Not a submission |

**Traffic sources** (sessions):

| Session source / medium | Sessions |
|---|---|
| google / organic | ~1,000 (1,026) |
| (direct) / (none) | 383 |
| linkedin.com / referral | 306 |
| l.facebook.com / referral | 58 |
| multiple-personal-recommendation-email / … | 47 |
| activity_item / (not set) | 36 |
| confirmation_email / (not set) | 36 |

## 3. What the constraints do to the numbers

| Issue | Effect on the data | Handling |
|---|---|---|
| No key event marked, `sign_up` not forwarded | Conversions invisible: reports show 0 although people subscribe | `sign_up` tag added in GTM; mark `sign_up` as key event |
| Traffic without UTM from apps and emails | Clicks from LinkedIn/Facebook apps, newsletter emails and the Substack app arrive without a referrer and land in `(direct) / (none)`, which is inflated | UTM convention for every link published (see `utm-tracking-rules.md`); compare the direct/none share before and after |
| Sources set by Substack itself (`activity_item`, `confirmation_email`, `multiple-personal-recommendation-email`, `cover_page`) | Not standard UTM, cannot be renamed | Group them as "Substack internal" in reports instead of treating them as marketing channels |
| `scroll` fires only at 90% | Cannot see where readers drop off | Custom `scroll_depth` at 25/50/75/90% on post pages |
| `click` is outbound only | Internal navigation and Subscribe buttons not measured | `subscribe_click` per placement (`header`, `popup`, `inline`, `footer`, `home`) |
| `form_start` is not a submission | Intent, not conversion | `sign_up` is the conversion; funnel: `subscribe_popup_view` → `subscribe_click` → `sign_up` |
| No per-person link between sites | A visitor from the library to Substack becomes a new user in the second property | Link the two by campaign (`utm_campaign` equals `cta_location`), aggregate by day and by source, and state this limit in every analysis |
| Email opens and the Substack app | Not measurable in GA4 | Use Substack's own statistics for email; state the gap |
| Ad blockers, no consent layer | Some visits not recorded in either property | Accept as an undercount; do not treat counts as exact |

## 4. What was implemented

### Substack container (Google tags only, by design)

| Event | Trigger | Parameters |
|---|---|---|
| `sign_up` | Custom Event `sign_up` (pushed by Substack) | none |
| `subscribe_click` | Click on a Subscribe button, one tag per placement | `subscribe_location` = `header`, `popup`, `inline`, `footer`, `home` |
| `subscribe_popup_view` | The "Discover more from…" dialog becomes visible | `subscribe_location` = `popup` |
| `subscribe_popup_dismiss` | Click on a non-Subscribe button inside the dialog | `subscribe_location` = `popup` |
| `scroll_depth` | Scroll depth 25/50/75/90% on post pages (`/p/`) | `percent_scrolled` |
| `read_time` | Timer 30 s, 60 s, 120 s on post pages | `read_seconds` |

Placement is recognised from the page structure (menu, dialog, subscription widget, page path), because custom JavaScript variables are blocked. This depends on Substack's markup and must be re-checked if their interface changes.

### Learning Library container (no restriction, own code)

Events pushed to the Data Layer by `landing-page/js/analytics.js` and forwarded by GTM: `category_click`, `library_search`, `filter_apply`, `resource_impression`, `resource_click`, `cta_substack_click`. Parameters, triggers and business purpose are in `docs/tracking-plan.md`. Notable design choices:

- `resource_impression` gives the denominator for click-through rate by resource and by list position.
- `position` is the fixed catalogue rank; `list_position` is the rank in the list actually shown after search and filters.
- `library_search` records the term and `result_count`, so searches with zero results (unmet demand) are visible.

### Tags and consolidation

| Site | Tags loaded | Managed in GTM |
|---|---|---|
| Learning Library | GTM container, Google tag (GA4), 6 GA4 event tags | Yes. No tag is hard-coded in the page except the GTM snippet |
| Substack | GTM container, Google tag (GA4), 10+ GA4 event tags | Yes for everything the owner controls |

Other tags detected on Substack pages that the owner does not manage: a Google Ads tag (`AW-…`) and a second GA4 tag (`G-…`) different from the owner's property. Their origin (Substack platform or a legacy setting) was not confirmed and is left unchanged.

### Supporting setup

- GA4 → BigQuery daily export enabled on both properties (event data only; no streaming, no user export). It starts from the link date and cannot backfill.
- Enhanced measurement on the library: page views (without history-based page changes, because filters and search rewrite the URL), scrolls. Outbound clicks, site search, form interactions, video and file downloads are off so they do not duplicate the custom events.
- Custom dimensions registered in both properties for the parameters above; `result_count` is a custom metric.
- Search Console: both properties verified through the GTM container (no meta tag; Substack does not need a custom domain for this).

## 5. Validation status

| Item | Status |
|---|---|
| Library GTM Preview: tags fire with parameters | Verified for `category_click` and `resource_click` |
| Library GA4 Realtime | Verified: `page_view`, `filter_apply`, `resource_click`, `category_click`, `cta_substack_click`. `library_search` to be confirmed in GA4 |
| Substack Preview: `sign_up` reaches the tag and fires | Verified (Tags Fired) |
| Substack Preview: `subscribe_click`, scroll, timer, popup tags | To be validated after publishing and checked in Realtime |
| `resource_impression` and `list_position` | Tested locally; to be validated in Preview after the GTM update is imported |
| Key events marked | Pending (events must first appear in GA4, about 24 hours) |

Validation method: GTM Preview and Tag Assistant for tag firing and parameter values; GA4 Realtime and DebugView for delivery; BigQuery export for final record-level checks.

## 6. Limits of this audit

- Numbers come from one day of screenshots, not a full series; the baseline for the direct/none share must be captured before UTM-tagged links start to circulate.
- The Substack constraint description reflects the platform as observed on the audit date and can change.
- Subscribers cannot be tied to individual visits: attribution is by day and by source, never by person.
