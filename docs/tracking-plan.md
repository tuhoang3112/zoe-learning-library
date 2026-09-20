# Tracking plan

All events go through `pushDataLayer()` in `landing-page/js/analytics.js`. GA4 `page_view` stays enabled (automatic via the GTM Google tag).

| Event | Trigger | Parameters | Business purpose |
|---|---|---|---|
| `category_click` | Click a topic card | `category_name` | Which topics attract interest |
| `library_search` | Debounced (1 s, ≥2 chars) or on submit; an identical consecutive term is not re-sent | `search_term`, `result_count` | Search demand; `result_count = 0` = unmet demand |
| `filter_apply` | A filter dropdown changes (not on page load, not on category click; an unchanged combination is not re-sent) | `filter_topic`, `filter_type`, `filter_level`, `filter_access`, `result_count` | Filter usage and combinations. Unselected = `"All"` |
| `resource_impression` | A resource card is at least 50% visible (IntersectionObserver). Fired once per resource and list position per page view; not fired while the tab is hidden | `resource_*`, `list_position`, `result_count` | Exposure count: the denominator for click-through rate by resource and by position |
| `resource_click` | Card title or "Open resource" clicked (opens the external site in a new tab, so the event is never lost in navigation) | `resource_*` | Resource click-through |
| `cta_substack_click` | Any `[data-cta-location]` link clicked, or a resource card whose URL is on zoedatalens.substack.com (also fires `resource_click`) | `cta_location` (`header`, `banner`, `resource_card`, `footer`) | Primary conversion (click toward Substack, not a subscription) |

`resource_*` parameters: `resource_id`, `resource_name`, `resource_type`, `topic`, `level`, `access`, `provider`, `position`.

`position` is the fixed catalogue rank (alphabetical by title). `list_position` is the rank of the card in the list the visitor is actually looking at (after search and filters), so the same resource can have different `list_position` values. `resource_click` also carries `list_position`.

**CTR by position** = `resource_click` count / `resource_impression` count, grouped by `list_position`. With the default alphabetical order a resource always sits at the same position, so position and resource are confounded; search and filters change `list_position` and provide some natural variation. A clean test of position bias would need the order to be shuffled or A/B tested.

## GTM setup

1. One Custom Event trigger per event name above.
2. One GA4 Event tag per event, using Data Layer Variables for the parameters (no per-resource tags).
3. Register GA4 custom dimensions for the parameters you want in reports (`resource_id`, `topic`, `level`, `access`, `position`, `list_position`, `search_term`, `filter_*`, `category_name`, `cta_location`) and `result_count` as a custom metric.
4. Add Clarity via GTM.
5. Validate with GTM Preview and GA4 DebugView.

## Privacy

No emails, names, survey responses or other PII in event parameters. Search terms are free text: never add fields that collect personal data.

## UTM on links to Substack

Every link from the library to `zoedatalens.substack.com` (header logo, banner, footer icon and resource cards that point to Substack) gets UTM parameters added in the browser (`withSubstackUtm` in `landing-page/js/analytics.js`), so the Substack GA4 property can attribute the visit:

| Parameter | Value |
|---|---|
| `utm_source` | `learning-library` |
| `utm_medium` | `referral` |
| `utm_campaign` | the `cta_location` (`header`, `banner`, `footer`, `resource_card`) |
| `utm_content` | resource id (resource cards only) |

Links to Tomorrow Marketers pages keep their own fixed UTM (`utm_medium=service`, `utm_campaign=hct`) in `landing-page/data/resources.json`.
