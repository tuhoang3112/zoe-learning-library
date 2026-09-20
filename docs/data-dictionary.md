# Data dictionary

## Resource (`data/resources.json`)

| Field | Type | Required | Example / allowed values |
|---|---|---|---|
| `id` | string (slug, unique) | yes | `microsoft-learn-power-bi` |
| `title` | string | yes | `Microsoft Learn — Power BI` |
| `type` | string | yes | Course, Dataset, Tools & Templates, Resource (books and ebooks are Resources) |
| `topic` | string | yes | Marketing & Growth, Data Analytics, Data Engineering, Product & Vibe Coding, AI Agents & Automation, Languages |
| `level` | string | yes | Beginner, Intermediate, Advanced |
| `access` | string | yes | Free, Paid |
| `provider` | string | yes | `Microsoft` |
| `description` | string | yes | Short sentence |
| `url` | string (URL) | yes | `https://learn.microsoft.com/power-bi/` |
| `tags` | string[] | yes | `["Power BI","Data Analytics"]` |
| `position` | integer (1-based, unique) | yes | `4` — display order, used for position-bias analysis |
| `secondary_topics` | string[] | no | `["Marketing & Growth"]` — extra topics the resource is also listed under (topic filter, category shortcuts, search). Events still report only the primary `topic` |
| `featured` | boolean | no | `false` |
| `image` | string | no | path under `assets/images/` |
| `date_added`, `last_updated` | string (YYYY-MM-DD) | no | `2026-09-20` |

There is deliberately no `price` field — only `access`.

## Event parameters

| Parameter | Type | Events | Example |
|---|---|---|---|
| `category_name` | string | category_click | `Data Analytics` |
| `search_term` | string (lowercased) | library_search | `power bi` |
| `result_count` | integer | library_search, filter_apply | `0` |
| `filter_topic`, `filter_type`, `filter_level`, `filter_access` | string (`All` if unset) | filter_apply | `Beginner` |
| `resource_id` | string | resource_click | `sqlbolt` |
| `resource_name` | string | same | `SQLBolt` |
| `resource_type` | string | same | `Resource` |
| `topic`, `level`, `access`, `provider` | string | same | `Data Analytics` |
| `position` | integer | same | `3` |
| `cta_location` | string | cta_substack_click | `banner` (also `header`, `resource_card`, `footer`) |

## URL parameters (library page)

`q`, `topic`, `type`, `level`, `access` — e.g. `/?topic=Data%20Analytics&level=Beginner`. Invalid values are ignored.
