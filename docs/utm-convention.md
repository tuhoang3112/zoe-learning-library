# UTM convention

A naming convention and governance note for tracking traffic between a static learning library (GitHub Pages) and a Substack newsletter, measured in two GA4 properties through Google Tag Manager.

## 1. Why this exists

Two sites, two analytics properties, one audience:

```text
LinkedIn / Facebook / email
        │  (UTM)
        ▼
Learning Library ───(UTM)───► Substack
   GA4 property A               GA4 property B
        │                            │
        └──────► BigQuery ◄──────────┘
```

Without a shared convention:

- Mobile apps (LinkedIn, Substack, email clients) often send no referrer, so clicks land in `(direct) / (none)`.
- Every post looks the same in reports ("came from LinkedIn"), so no post can be compared with another.
- Free-typed values (`LinkedIn`, `linkedin.com`, `Linkedin`) split one source into several rows.

The goal of these rules: **every link I publish says where it was published, in what format, for which campaign, and which specific post** — with values that never vary.

## 2. Parameters

| Parameter | Required | Meaning | Example |
|---|---|---|---|
| `utm_source` | yes | Where the link is published | `linkedin` |
| `utm_medium` | yes | Type of channel | `social` |
| `utm_campaign` | yes | Topic, series or initiative | `learn-ai-from-0` |
| `utm_content` | no | The specific post, or the placement of the link | `2026-09-25` |

`utm_term` is not used (no paid search).

## 3. Formatting rules

1. **Lowercase only.** GA4 is case-sensitive: `LinkedIn` and `linkedin` are different sources.
2. **No spaces, no accents.** Use hyphens: `learn-ai-tu-0`, not `Learn AI từ 0`.
3. **Fixed vocabulary for source and medium** (table below). New values need a new row in the table first.
4. **Campaign = a topic or series, not a date.** Dates belong in `utm_content`.
5. **Never put UTM on internal links** (a link from the library to another library page). It would start a new session and overwrite the real source.
6. **One link, one destination.** Do not reuse the same tagged link on different channels.

## 4. Controlled vocabulary

| `utm_source` | `utm_medium` | When to use |
|---|---|---|
| `linkedin` | `social` | LinkedIn posts, comments, profile links |
| `facebook` | `social` | Facebook posts and groups |
| `zalo` | `social` | Zalo groups and messages |
| `threads` | `social` | Threads posts |
| `youtube` | `video` | Links in video descriptions |
| `substack` | `email` | Links inside a Substack email or post that lead to the library |
| `learning-library` | `referral` | Links from the library to Substack (added automatically, see §5) |
| `email` | `email` | Other email campaigns |
| any source above | `service` | Links to partner course pages (Tomorrow Marketers). Medium is always `service` and campaign is always `hct` |

Why these mediums: GA4 assigns a default channel from the medium (or the source), and only certain values are recognised. `social` (also `social-network`, `social-media`, `sm`) counts as *Organic Social*; `email` (also `e-mail`, `e_mail`, `e mail`) as *Email*; `referral` as *Referral*; a medium that contains `video` as *Video*. **Anything else falls into *Unassigned*** and is lost in channel reports. That is why the newsletter uses `email`, not `newsletter`, and why the rule is checked against Google's channel definitions rather than invented. (`service`, used for partner course links, is not recognised either; that is acceptable only because those links leave for a site I do not measure.)

## 5. Links tagged automatically

Some UTMs are added by code so I never have to remember them.

| Link | `utm_source` | `utm_medium` | `utm_campaign` | `utm_content` |
|---|---|---|---|---|
| Library → Substack, header logo | `learning-library` | `referral` | `header` | — |
| Library → Substack, banner button | `learning-library` | `referral` | `banner` | — |
| Library → Substack, footer icon | `learning-library` | `referral` | `footer` | — |
| Library card that points to a Substack page | `learning-library` | `referral` | `resource_card` | resource id |
| Library → partner course pages (Tomorrow Marketers) | `learning-library` | `service` | `hct` | — |

The campaign value of the Substack links mirrors the `cta_location` parameter of the `cta_substack_click` event. That means the same location appears in both properties under the same name, so the two datasets can be joined by location.

## 6. Building links

Three kinds of destination need tagged links: **Learning Library**, **Substack** and **Tomorrow Marketers** pages. In each case the target can be any page, not only the home page (a Substack post, a library URL with filters, a specific course page).

A small local tool ([`tools/utm-builder.html`](../tools/utm-builder.html), open it in a browser, no server needed) applies the rules for me: choose the destination type, paste the URL, fill source / medium / campaign. It lowercases and strips accents, warns if the URL does not match the chosen destination, keeps existing query parameters (for example library filters), locks `medium = service` and `campaign = hct` for Tomorrow Marketers links, remembers the last values and keeps a history of the last ten links.

Example output (Substack post shared on LinkedIn):

```text
https://zoedatalens.substack.com/p/claude-cowork
  ?utm_source=linkedin
  &utm_medium=social
  &utm_campaign=learn-ai-from-0
  &utm_content=2026-09-25
```

## 7. Effect on direct / none traffic (before and after)

The reason for the convention is the size of the `(direct) / (none)` bucket in the Substack property. It is measured with the same report before and after the convention is applied to every link I publish.

| | Window | Sessions | (direct) / (none) | Share |
|---|---|---|---|---|
| **Before** (28-day window, GA4 Traffic acquisition) | Aug 23 – Sep 19, 2026 | ~2,200 | 383 | ~17% |
| **Before** (whole history, from the project notes) | Jan 2025 – Sep 2026 | ~35,000 | ~9,500 | ~27% |
| **After** | first 4 weeks starting 2026-09-21 | to be measured | to be measured | to be measured |

Direct / none is not the only opaque bucket. In the last-7-days snapshot (Sep 14–20, 2026) the Substack property also shows **Unassigned** sessions (67, about 13% of the sessions in the six channels shown, against 81 for Direct, about 15%): traffic that carries a medium GA4 does not recognise, or Substack's own tagging (see [`tracking-audit.md`](tracking-audit.md)). The comparison therefore tracks both buckets.

How the comparison will be made: same property, same report, same window length; sources set by Substack itself (`activity_item`, `confirmation_email`, `multiple-personal-recommendation-email`, `cover_page`) are reported apart because they cannot be tagged. The share will not drop for traffic that has no link I control (bookmarks, typed addresses, some apps), so the expected result is a **smaller** direct share, not a zero one.

## 8. Quality checks before publishing a link

- [ ] Opened in a private window: the page loads and the URL still contains the UTM.
- [ ] In GA4 **Realtime**, the visit appears with the expected source / medium.
- [ ] The value is in the vocabulary of §4.
- [ ] The link is not shortened in a way that strips the query string.

## 9. Where the data ends up

| Question | Where to look |
|---|---|
| Which channel sends the most visitors? | GA4 → Reports → Acquisition → Traffic acquisition |
| Which post drives the most visits? | Same report, add `Session manual ad content` |
| Which library placement sends people to Substack? | Substack property: `utm_campaign = header / banner / footer / resource_card` |
| Which channel produces subscribers? | Substack property: key event `sign_up` by source / medium |

Raw event-level analysis (BigQuery export, one dataset per property):

```sql
-- Sessions by UTM values (GA4 BigQuery export)
SELECT
  collected_traffic_source.manual_source        AS utm_source,
  collected_traffic_source.manual_medium        AS utm_medium,
  collected_traffic_source.manual_campaign_name AS utm_campaign,
  COUNT(DISTINCT CONCAT(
    user_pseudo_id, '-',
    CAST((SELECT value.int_value FROM UNNEST(event_params)
          WHERE key = 'ga_session_id') AS STRING)
  )) AS sessions
FROM `PROJECT.analytics_XXXXXXXXX.events_*`
WHERE event_name = 'session_start'
  AND collected_traffic_source.manual_source IS NOT NULL
GROUP BY 1, 2, 3
ORDER BY sessions DESC;
```

## 10. Known limitations

- **Email clients and apps.** Without UTM, clicks from newsletter emails and mobile apps are recorded as direct traffic. UTM is the only reliable way to attribute them.
- **Two properties, no shared user ID.** A visitor who goes from the library to Substack is a new user in the second property. The link between the two is the campaign name, not a person.
- **Substack restricts GTM.** Only Google tags and built-in triggers run there (custom HTML, custom JavaScript variables and non-Google pixels are blocked), so on-site events are limited to what native triggers can capture.
- **Sampling of behaviour.** UTM tells where a visit came from, not whether the reader liked the content; scroll depth and time-on-page events are used as proxies.

## 11. Change log

| Date | Change |
|---|---|
| 2026-09-20 | Convention defined; automatic UTM added to library → Substack links; UTM builder created |
| 2026-09-20 | Builder extended to three destination types; Tomorrow Marketers links use fixed `service` / `hct` |
| 2026-09-21 | Added the direct / none before-and-after measurement plan |
