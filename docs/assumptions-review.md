# Assumptions review

The project started from a set of beliefs about what was wrong with the measurement. Once Substack's own analytics and the tracking audit were read, several did not hold. This note lists each assumption, the check, the verdict and what changed in the project. It is kept in the repository on purpose: a project should say what turned out to be wrong.

Verdicts: **holds**, **partly**, **does not hold**, **untested**.

## 1. Assumption by assumption

| # | Original assumption | Check | Verdict | What changed |
|---|---|---|---|---|
| 1 | Analytics measures views but not outcomes, so nobody knows what converts | Substack reports new subscribers by source, free subscribers per post and per traffic source ([`substack-analytics.md`](substack-analytics.md)). Only **Google Analytics** had 0 key events | **Partly**: true for GA4, false for the publication as a whole | Problem restated: behavior (GA4) and outcome (Substack) sit in two places that cannot be joined |
| 2 | Substack cannot run Tag Manager or custom events | Tag Manager was already installed; Substack pushes `sign_up`; custom GA4 events work with Google tags ([`tracking-audit.md`](tracking-audit.md)) | **Does not hold** | The "0 key events" is a configuration gap, not a platform limit |
| 3 | We do not know which posts and channels bring subscribers | Posts report (free subscribers per post), Growth sources (by source), Traffic by source | **Does not hold** | Question reworded: *why* do some posts convert and what do readers of those posts do differently (Substack outcome joined with GA4 behavior) |
| 4 | Much of `direct / none` is hidden real traffic, and UTM will reveal it | GA4 already names LinkedIn and Facebook without UTM. GA4 does not see reading inside the Substack app. Substack's own tagging (`activity_item`, `cover_page`, `confirmation_email`) shows as Unassigned rather than Direct. The rest of Direct is most likely untagged shares (messaging apps, email clients, typed addresses) | **Partly, and the upside is limited** | UTM only affects links I control. Both Direct and Unassigned are tracked; the result is reported whichever way it goes, and no drop is promised |
| 5 | GA4 conversion (`sign_up`) will explain what drives subscribers | Of 266 new subscribers in 90 days, 61% came through the Substack network (recommendations, notes…) and 12% through the app, places where the web tag never runs. Web-visible sources (direct, LinkedIn, other) are at most about a quarter | **Does not hold as stated** | GA4 `sign_up` describes the **web path only**. A coverage ratio (GA4 `sign_up` ÷ Substack new subscribers, by day) is reported next to every conversion figure |
| 6 | The Learning Library will produce enough data for funnels and segments | New site, traffic comes only from my own links; the newsletter has about 285 weekly users on the web | **Untested, probably too small** | Data sufficiency rules added (§3). Early results are descriptive only |
| 7 | Position bias can be studied with the current list order | Order is alphabetical and fixed, so position and resource are perfectly confounded | **Does not hold** | Impressions and displayed position are recorded; a real test needs a shuffled or A/B order (not done) |
| 8 | Search Console needs a custom domain for Substack | Verified on the `substack.com` subdomain through the Tag Manager container | **Does not hold** | Search Console analysis includes both sites |
| 9 | UTM medium `newsletter` is a valid channel | GA4's Email channel accepts only `email`, `e-mail`, `e_mail`, `e mail` | **Does not hold** | Convention uses `email` ([`utm-convention.md`](utm-convention.md)) |
| 10 | Clarity cannot run on Substack | No Clarity field in Substack settings; Tag Manager blocks non-Google tags | **Holds** | Clarity is limited to the Library, and not installed for now (decision recorded) |
| 11 | The audience survey will show what readers want | Substack adds two more revealed signals: views and free subscribers per post, and engagement rate | **Holds, with more evidence available** | "Say vs. do" compares the survey with two behavioral signals: Substack per-post outcomes and GA4 reading depth |
| 12 | 18K users, 35K sessions, ~9.5K direct / none since Jan 2025 | Taken from project notes; GA4 28-day window shows about 2.2K sessions and 383 direct | **Untested** | Re-read from GA4 before publication; the 28-day and 7-day snapshots are used as the baseline |
| 14 | Custom tracking on Substack adds enough value over Substack's own analytics to justify itself | Native reports already give subscribers and unique visitors by source, and subscribers per post; GA4 adds diagnosis (scroll, time, Subscribe placement, campaign) for web readers only, at low volume | **Untested** | Value is judged piece by piece with a keep-or-remove rule after 4 weeks ([`ga4-vs-substack-analytics.md`](ga4-vs-substack-analytics.md)) |
| 13 | About 1K subscribers | Audience report: about 1.85K (Vietnam 1,735 = 94%) | **Does not hold** | Corrected everywhere |

## 2. What this does to the project

The strongest analyses are no longer "GA4 finally shows conversions". They are the ones that use each system for what it sees:

1. **Coverage:** how much of the newsletter's growth is visible to web analytics at all (item 5). A finding in itself.
2. **Converting posts vs. non-converting posts:** free subscribers per post (Substack) against reading depth, time on post and Subscribe clicks per post (GA4). Posts with similar views but different conversion are the interesting ones.
3. **Network effect:** the biggest source of subscribers is invisible to GA4, so content and Notes strategy cannot be judged from GA4 alone.
4. **Source-less traffic:** an experiment, not a promise (item 4).
5. **Say vs. do**, search performance and AI citation, as planned.
6. **Learning Library:** what visitors search for, click and how many go on to the newsletter, read with the volume limits of §3.

## 3. Data sufficiency rules

To avoid reading noise as insight, comparisons follow these rules of thumb (they can be tightened, not loosened):

- Report counts with every rate. Show a 95% confidence interval for proportions.
- Compare two groups (two positions, two topics, two sources) only when each has at least **100 impressions or sessions and 10 events** of the kind being compared. Below that, the numbers are listed but not ranked.
- Funnel steps are described, not tested, until the first step has a few hundred sessions.
- A change in `direct / none` share is read against week-to-week variation before and after, not against one number.
- Substack-versus-GA4 comparisons use the same days and are shown as ratios with their definitions (§3 of `substack-analytics.md`), never as equalities.

## 4. Suggested wording for the project brief

The business questions can be restated so they do not depend on beliefs that turned out to be wrong:

1. What can each data source (Substack analytics, GA4, BigQuery, Search Console) see about readers, and what does each miss? How much of the subscriber growth is visible to web analytics?
2. Which posts convert readers into subscribers, and what do readers of those posts do differently from readers of posts that do not convert?
3. Where does source-less web traffic come from, and how much of it can links I control recover?
4. Which content and keywords bring organic traffic, and which are rising or falling?
5. Is the content cited by AI search, and which posts are or are not?
6. What does the audience say it wants, and does it match what it reads and subscribes to?
7. On the Learning Library: what do visitors search for and click, what do they not find, and how many continue to the newsletter?
