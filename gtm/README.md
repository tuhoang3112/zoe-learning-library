# GTM containers

Exports of the two Google Tag Manager containers. The repository matches what is live; changes are made in Tag Manager and re-exported here.

| File | Container | What it holds |
|---|---|---|
| [`library-container.json`](library-container.json) | Learning Library | 8 GA4 event tags, 8 Custom Event triggers, 17 variables |
| [`substack-container.json`](substack-container.json) | ZoeDataLens on Substack | 12 GA4 event tags and the Google tag, 12 triggers |

## Naming

| Prefix | Type |
|---|---|
| `GA4 Event \| <event>` | GA4 event tag |
| `CE -` | Custom Event trigger (fires on a Data Layer event) |
| `CLK -` | Click trigger |
| `SD -` | Scroll Depth trigger |
| `TM -` | Timer trigger |
| `EV -` | Element Visibility trigger |
| `dlv -` | Data Layer Variable |

## Why the two containers differ

- **Library:** the site pushes events and parameters to the Data Layer itself, so each event is one Custom Event trigger, one GA4 Event tag and Data Layer Variables for the parameters. See [`../docs/tracking-plan.md`](../docs/tracking-plan.md).
- **Substack:** the platform only runs Google tags and built-in triggers (click, scroll depth, timer, element visibility, custom event). Custom HTML, custom JavaScript variables and non-Google pixels are blocked, so every event here is built from those triggers. See [`../docs/tracking-audit.md`](../docs/tracking-audit.md).

## Import

Tag Manager → Admin → Import Container → choose the file → **Merge** (not Overwrite) into a workspace, then check in Preview before publishing. Measurement IDs in the files are public identifiers.
