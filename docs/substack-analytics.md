# Substack's own analytics — what it answers, and how it fits the project

Substack's built-in analytics is the source of truth for **subscribers**. Google Analytics is the source for **behavior**. This note records what the native reports show, what they cannot show, and how the two are joined.

- **Snapshot date:** 2026-09-21. Each report has its own window (stated per row), so figures from different reports are not directly comparable.
- **Scope:** free subscribers only. The publication has no paid tier, so paid subscribers, paid retention and earnings are out of scope (the Earnings tab is empty).
- **Public and private figures:** this repository carries only shares and rounded values, enough for the argument. The exact figures, the per-post numbers and the country breakdown are kept in a private folder outside the repository. The "Top sharers" list names individual subscribers and is not reproduced anywhere.

## 1. The reports and what they show

| Report | What it shows | Snapshot (window) |
|---|---|---|
| **Growth sources** | Two tabs, **Unique visitors** and **New subscribers**, by source, with a daily chart and post markers. Together they give a conversion rate per source without GA4. The snapshot captured only the New subscribers tab; the Unique visitors tab is still to be saved | Under 300 new subscribers in 90 days. Substack network about 61% (Recommendations about 29%, Notes about 20%, other, onboarding and search about 12%). Direct about 15%. Direct to App about 12%. LinkedIn about 5%. The remaining ~7% is in rows not captured |
| **Network effect** | How much of the growth comes from the Substack network | Substack app about 29%, other Substack network about 32%, existing Substack accounts about 32%, new accounts about 8% |
| **Audience** | Subscriber count and location | Under 2K subscribers; about 94% in Vietnam, the rest spread over 26 other countries |
| **Retention** (free) | Growth rate, new and lost subscribers | 30-day free growth rate about 1.8%. **Free retention data exists only from 2026-01-01** |
| **Sharing** | Which subscribers bring views and new subscribers | Individual-level list; not reproduced. The author's own account is the top source of new free subscribers, which is worth understanding before reading "sharing" as word of mouth |
| **Traffic** | Views, users and free subscribers by source, including email opens | About 5K views in 30 days (down about 5%). Email opens account for nearly as many views as direct visits and bring no free subscribers directly |
| **Posts** | Views, engagement rate and free subscribers per post | 30-day open rate about 27%. Engagement rate and free subscribers per post differ widely between posts, which is what makes the post comparison worth doing |
| **Surveys** | Native survey embedded in posts | One survey ("New Reader Survey") with 1 response |

## 2. Who can answer which question

| Question | Substack analytics | GA4 (after the fix) | BigQuery (raw events) |
|---|---|---|---|
| Which sources bring subscribers, and at what conversion? | **Yes**, new subscribers and unique visitors by source, incl. Substack network, app and email | Only the `sign_up` event on the web, with GA4 channels | Same as GA4, by session, from 2026-09-20 |
| Which posts bring subscribers? | **Yes**, free subscribers per post | `sign_up` by landing page, web only | Same, at event level |
| Is the Substack network (Recommendations, Notes, app) driving growth? | **Yes**, and it is the largest source (61%) | **No**: in-app and network traffic is not visible to GA4 | No |
| How far do readers scroll, how long do they stay? | Engagement rate per post only | `scroll_depth`, `read_time` per post | Yes, per session |
| Which Subscribe button is used (menu, pop-up, footer…)? | No | `subscribe_click` by placement | Yes |
| What do visitors do before subscribing? | No | Partly (events per session) | Yes, funnel per session |
| Where do web readers come from, by campaign? | Coarse categories | Source / medium / campaign (needs UTM) | Yes |
| Link from the Learning Library to the newsletter | Appears as a source only if tagged | UTM `learning-library` | Yes, joined by campaign |

The interesting point: the largest subscriber source (the Substack network) is exactly the one GA4 cannot see, so **GA4 alone would give a partial and biased view of what grows the newsletter**. That is a reason to use both, not a reason to replace one with the other.

## 3. Reconciling the two systems

Definitions differ, so the numbers will never match:

| | Substack | GA4 |
|---|---|---|
| Unit | Views (email opens counted as views) and unique visitors | Sessions and users, web only |
| Email opens and app reading | Included | Not measured |
| Sources | Substack categories (Network, Direct, Direct to App, Social, Email…) | Default channel groups (Organic Search, Direct, Organic Social, Email, Referral, Unassigned) |
| Window | Per report (30 or 90 days, custom range) | Any range, and raw events in BigQuery from 2026-09-20 |

Working mapping between the source categories, used only for aggregate comparison:

| Substack category | Closest GA4 channel | Note |
|---|---|---|
| Direct | Direct | Includes typed addresses and links without a referrer |
| Direct to App | none | Reading in the app is not visible in GA4 |
| Network (Recommendations, Notes, Onboarding) | none, or Referral / Unassigned when web links carry Substack's own tagging | Largest source; mostly invisible to GA4 |
| Social (LinkedIn…) | Organic Social, or Referral | UTM `social` makes the LinkedIn side reliable |
| Email | Email | Only with UTM `email` on links I control |

**Hypotheses to test, not findings:** GA4 does not measure reading inside the Substack app at all, so the app cannot explain GA4's `direct / none`. Substack's own tagging on web links (`activity_item`, `cover_page`, `confirmation_email`) most likely shows as Unassigned, and Direct is most likely untagged shares (messaging apps, email clients, typed addresses). The UTM experiment tests the last one; the first two need Substack's tagging to be read, not fixed.

## 4. Limits of the native reports

- **Short windows:** Growth sources and Network effect are shown for 30 to 90 days, and free retention only from 2026-01-01. Older data is not available in the interface, so **history must be captured on a schedule** (export the tables or save them monthly; see §5).
- **Data leaves only by manual export:** the reports are read in the dashboard or exported by hand. No scheduled export, API, warehouse or BI connector was found, so history, joins and dashboards depend on a routine of saving the numbers. This is a main reason to send behavior data through GA4, whose export to BigQuery and connector to Looker Studio are automatic. It does not extend to subscriber counts, which stay on the manual route.
- **Aggregates only:** no raw events, no session, no way to join with the survey or with GA4 at person level.
- **Attribution rules are Substack's:** a subscriber counted under "Recommendations" or "Notes" cannot be traced further.
- **Sharing report identifies people:** treat it as personal data; do not publish it.

## 5. How it is used in the project

1. **Conversion in the period before key events:** subscribers per day and per source come from Substack, sessions per source from GA4; they are compared **by day and by source category, never by person**, and the limit is stated with every chart.
2. **Snapshot routine:** at the start of the project and at the end of each 4-week UTM measurement window, save Growth sources (both tabs, 90 days), Traffic by source and Posts (with free subscribers per post). This builds the history the interface does not keep.
3. **Reader survey:** Substack's built-in survey tool exists (1 response so far, the onboarding survey). The project survey uses Google Forms instead (see [`survey-design.md`](survey-design.md)) because it needs to reach followers who do not subscribe (LinkedIn), allows the question types in the design and exports cleanly.
4. **Say vs. do:** free subscribers per post (Posts report) is a second behavioral signal to place beside GA4 reading depth per post.
