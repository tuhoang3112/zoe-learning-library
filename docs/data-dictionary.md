# Data dictionary: Learning Library events

Parameters sent with each event, as pushed by [`analytics.js`](../landing-page/js/analytics.js) into the Data Layer. Event definitions and when each fires are in [`tracking-plan.md`](tracking-plan.md).

## Resource parameters

Sent with `resource_impression`, `resource_click` and `tool_banner_click`. Values come from the catalogue ([`resources.json`](../landing-page/data/resources.json)) and the allowed values from [`config.js`](../landing-page/js/config.js).

| Parameter | Meaning | Values |
|---|---|---|
| `resource_id` | Stable ID of the resource in the catalogue (`shop` for the "Visit the shop" link) | text |
| `resource_name` | Title of the resource | text |
| `resource_type` | Kind of resource | `Course`, `Dataset`, `Tools & Templates`, `Resource` |
| `topic` | Topic the resource belongs to | the 6 topics in `config.js` |
| `level` | Difficulty | `Beginner`, `Intermediate`, `Advanced` |
| `access` | Price model | `Free`, `Paid` |
| `provider` | Who publishes it | text |
| `position` | Fixed rank in the catalogue | number |
| `list_position` | Rank in the list the visitor is looking at, after search and filters (not sent by `tool_banner_click`) | number |
| `result_count` | Number of results in the list at that moment (`resource_impression`) | number |

## Search, filter and navigation parameters

| Parameter | Sent with | Meaning |
|---|---|---|
| `search_term` | `library_search` | What the visitor typed (free text, after a 1 s pause or on submit, minimum 2 characters) |
| `result_count` | `library_search`, `filter_apply` | Number of results. `0` means the visitor found nothing |
| `filter_topic`, `filter_type`, `filter_level`, `filter_access` | `filter_apply` | The filter values active after the change |
| `category_name` | `category_click` | Topic card that was clicked |
| `cta_location` | `cta_substack_click`, `cta_buymeacoffee_click` | Where the link sits (header, banner, resource card, post card, About, footer) |

## Substack events

Sent by the Substack container, which can only use Google tags and built-in triggers (no custom parameters from page code). See [`tracking-audit.md`](tracking-audit.md) for the list.

## Privacy

No emails, names or other personal data in any event. Search terms are free text, so no field that collects personal data is ever added.
