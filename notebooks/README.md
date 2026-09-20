# Notebooks

Planned analyses that need a statistical or plotting environment rather than SQL alone. **Not started**: they depend on survey responses and on a few weeks of event data.

| Notebook | Purpose | Needs |
|---|---|---|
| `01_survey_analysis.ipynb` | Response rate, who answered, proportions with confidence intervals (Wilson) and the limits of generalising | Closed survey |
| `02_say_vs_do.ipynb` | Compare topics the audience says they want with what GA4 shows they read (share of views, share of sessions reaching 75% scroll); gap index per topic | Survey + `sql/08` and `sql/05` results |
| `03_position_bias.ipynb` | CTR by list position with confidence intervals; test of whether position explains clicks after controlling for the resource | `sql/04` results over enough impressions |
| `04_funnel_segments.ipynb` | Funnel and drop-off by traffic source and device; significance of differences | `sql/03`, `sql/07` results |

Each notebook will read exported query results (CSV, not committed if they contain anything user-level) and state its assumptions and limits at the top. A `requirements.txt` will be added with the first notebook.
