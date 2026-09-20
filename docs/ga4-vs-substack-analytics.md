# Is GA4 worth it? What it adds over Substack's own analytics

Substack already reports a lot about the newsletter. Custom tracking has a cost (setup, maintenance, noise, a partial view), so it should only stay where it answers something the native reports cannot. This note states the test, compares the two, and gives the rule for keeping or dropping each piece.

**Provisional verdict (to be reviewed after 4 weeks of data):**
- **Substack: a small, targeted increment.** Keep `sign_up` (it gives the coverage ratio) and the Subscribe placement funnel; treat scroll depth and read time as optional until they show they can change a decision.
- **Learning Library: essential.** There is no native analytics for a site I host, so GA4 is the only source.

## 1. The test

An event or report earns its place if it meets all three:

1. **It answers a question the native reports cannot.**
2. **The answer could change a decision** (where to put a Subscribe button, what to write, what to keep in the library).
3. **There is enough volume** to read a difference (rule of thumb from [`assumptions-review.md`](assumptions-review.md): at least 100 impressions or sessions and 10 events per compared group).

## 2. What Substack already answers

- **Growth sources** has two tabs, *Unique visitors* and *New subscribers*, by source. Conversion per source (new subscribers ÷ unique visitors) can therefore be computed **without GA4**.
- **Posts:** views, engagement rate and free subscribers per post; open rate.
- **Traffic:** views, users and free subscribers by source, including email opens and app reading.
- **Network effect, audience location, retention (free, since 2026-01-01), sharing.**

For "how many" and "from where", the native reports are more complete than GA4: they include the Substack network, the app and email, which GA4 cannot see (see [`substack-analytics.md`](substack-analytics.md)).

## 3. What GA4 adds

| Need | Native | GA4 | Increment |
|---|---|---|---|
| Number of subscribers, by source and by post | Yes, complete | Web sign-ups only, a minority of growth | **None**: native is better |
| Conversion rate per source | Yes (unique visitors and new subscribers) | Web only | **None** |
| How far readers scroll on a post | Engagement rate only (definition not shown) | Scroll depth at 25/50/75/90% | **Yes**, web readers only |
| How long readers stay | Not per post | Time thresholds | **Yes**, web readers only |
| Which Subscribe button or pop-up gets used | No | Click by placement, pop-up views and dismissals | **Yes**: the clearest gain |
| Traffic by campaign and by individual link I publish | Coarse categories | UTM source, medium, campaign, content | **Yes**, for links I control |
| Path from Learning Library to newsletter | Not visible | UTM plus `cta_substack_click` | **Yes** (no alternative) |
| Raw events, SQL, joins, history beyond the interface windows | No | BigQuery export | **Yes** |
| Behavior of visitors on the Learning Library | Not applicable | Everything | **Yes** (no alternative) |

So GA4 adds **diagnosis** (where in the page, which button, which link), not **counts**. It cannot beat the native reports on how many people subscribe.

## 4. Value by piece, and how each will be judged

| Piece | Question | Decision it could change | Volume check | Keep if… |
|---|---|---|---|---|
| `sign_up` | How much of the growth does web analytics see (coverage)? | How much weight to give any GA4 conversion figure | Needs only a few weeks | Coverage is measured and reported |
| `subscribe_click` by placement, pop-up view and dismissal | Which placement and which pop-up behavior produce Subscribe clicks | Keep, move or remove a placement or the pop-up | Uncertain: web-visible new subscribers are at most about two dozen a month, so clicks per placement may be only around ten to twenty; at the edge of the rule | Every placement reaches the volume rule after 4–6 weeks, or a clear zero shows which placements are dead |
| `scroll_depth`, `read_time` | Do readers of posts that convert read further? | Post structure and length | Depends on views per post; recent posts have hundreds to about a thousand | The gap between converting and non-converting posts is larger than the noise |
| UTM on published links | Which link and post bring readers and subscribers | What to post where | Grows with posting | At least one comparison between channels reaches the volume rule |
| BigQuery export | Joins and history the interface cannot give | Enables the funnel and coverage analyses | Low cost | The SQL scripts are actually used |
| Library events | What visitors search, click and skip; how many continue to the newsletter | What to add to or remove from the library | Small at first; grows with traffic | Descriptive results are stable; ranking only above the rule |

The volumes in the table are **assumptions** drawn from the source mix in the native reports and from recent GA4 traffic; they are replaced by measured counts as they come in.

## 5. Costs and risks

- **Partial view:** a conversion rate measured on the web describes a minority of the growth, and can mislead if presented as the newsletter's conversion rate.
- **Maintenance:** triggers on Substack depend on its page markup and must be rechecked when the interface changes.
- **Noise:** more events, more dimensions and more numbers than the volume can support.
- **Undercount:** ad blockers and no consent layer; email clients and the app are outside GA4.
- **Time:** the setup and the reading of results compete with writing.

## 6. Review rule

After 4 weeks of data (from 2026-09-21):

1. For each piece in §4, record the measured volume and whether the *keep if…* condition holds.
2. **Remove** the Substack tags that do not (fewer tags is also less to maintain). Keep `sign_up` for the coverage ratio unless it turns out to be near zero and adds nothing.
3. Write the result here, with the counts, whichever way it goes. A finding that most of the custom tracking on Substack was not worth its cost is as valid a result as the opposite.
4. The Learning Library tracking stays: it is the only source of data for that site.

## 7. What would change the verdict

- **Web signups turn out to be a larger share than the source mix suggests** (coverage well above a quarter): GA4 conversion becomes more representative.
- **Traffic to Substack grows or posts are shared more on the web:** placement and reading-depth analysis reach usable volume.
- **Native reports change** (for example scroll depth or button-level data appears): the increment shrinks.
