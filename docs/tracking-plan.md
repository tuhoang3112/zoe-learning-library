# Tracking plan: Learning Library

What the Library measures, when each event fires and why it matters. Every event is pushed to the Data Layer by [`landing-page/js/analytics.js`](../landing-page/js/analytics.js) and sent to GA4 by Tag Manager. GA4's automatic `page_view` stays on.

| Event | Fires when | What it tells me |
|---|---|---|
| `resource_impression` | A resource card is at least 50% visible (once per card and position, never while the tab is hidden) | How many people saw each resource: the base for click-through rate |
| `resource_click` | A resource title or "Open resource" is clicked | Which resources people open |
| `library_search` | Someone searches (after a pause, or on submit) | What people look for, and what they do not find (`result_count = 0`) |
| `filter_apply` | A filter changes | Which filters and combinations are used |
| `category_click` | A topic card is clicked | Which topics attract interest |
| `tool_banner_click` | A product or "Visit the shop" is clicked in the "Tools made by Zoe" banner | Interest in my own products, apart from the library list |
| `cta_substack_click` | Any link toward Substack is clicked (header, banner, resource card, post card, About, footer) | The main goal: visitors moving to the newsletter |
| `cta_buymeacoffee_click` | The coffee-cup donate button is clicked | Interest in supporting the project |

**Parameters.** Resource events carry `resource_id`, `resource_name`, `resource_type`, `topic`, `level`, `access`, `provider` and `position`. `cta_*` events carry `cta_location` (where the link was). Search and filter events carry the term or filters plus `result_count`.

**Two position fields.** `position` is a resource's fixed place in the catalogue. `list_position` is its place in the list the visitor is actually looking at (after search and filters). Click-through rate by position = `resource_click` ÷ `resource_impression`, grouped by `list_position`. The catalogue order is fixed, so position and resource are partly mixed up; search and filters add some natural variation, and a clean test would need shuffled order.

**Set-up in Tag Manager.** One Custom Event trigger and one GA4 Event tag per event, with Data Layer Variables for the parameters (no tag per resource). The parameters used in reports are registered as GA4 custom dimensions, and `result_count` as a custom metric.

**Privacy.** No emails, names or other personal data in any event. Search terms are free text, so no field that collects personal data is ever added.

Links the site sends to Substack and Buy Me a Coffee carry UTM parameters, see [`utm-rules.md`](utm-rules.md).
