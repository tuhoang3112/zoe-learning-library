# UTM rules

How every link I publish (Substack, Learning Library, Buy Me a Coffee, LinkedIn, YouTube, Facebook) is tagged, so GA4 can tell where visitors come from.

**Why:** links shared from apps often arrive with no source and land in `(direct) / (none)`, and free-typed names (`LinkedIn`, `linkedin.com`) split one source into several rows. One fixed vocabulary fixes both.

## Rules

1. Lowercase, no accents, no spaces. Join words with a hyphen (`learn-ai-from-0`).
2. Only use values from the tables below. A new value is added to the table first.
3. Never rename a value that is already in use: it breaks the history.
4. No UTM on links inside the same site.
5. Build links with the [UTM builder](https://tuhoang3112.github.io/zoe-learning-library/tools/utm-builder.html) ([source](../landing-page/tools/utm-builder.html)), a web tool that standardises the values (lowercase, no accents, hyphens) and assembles the link, not by hand.

## The four parameters

| Parameter | Meaning | Example |
|---|---|---|
| `utm_source` | The platform where the link is published | `linkedin` |
| `utm_medium` | The type of channel. Only `social`, `video`, `email` or `referral`, the values GA4 recognises. Anything else can end up in "Unassigned" | `social` |
| `utm_campaign` | A content series (optional) | `learn-ai-from-0` |
| `utm_content` | `<position>-<short title>` | `caption-claude-cowork` |

| Channel | `utm_source` | `utm_medium` |
|---|---|---|
| LinkedIn | `linkedin` | `social` |
| Facebook | `facebook` | `social` |
| YouTube | `youtube` | `video` |
| Substack | `substack` | `email` |
| Learning Library | `learning-library` | `referral` |
| Buy Me a Coffee | `buymeacoffee` | `referral` |

**Positions** for `utm_content`: `caption` (in the body of a post), `bio` (profile link), `description` (video description), `cmt` (comment), `menu` and `sidebar` (Substack navigation), `group-<name>` (a Facebook group).

**Campaigns:** `learn-ai-from-0` (the "Learn AI from 0" series), `bmc-shop` (links that sell a Buy Me a Coffee product).

## Links the website tags by itself

Links that leave the Learning Library get their UTM from code, so nothing is added by hand. The source is always `learning-library` and the medium `referral`; the campaign says where the visitor clicked.

| Click | Goes to | Campaign |
|---|---|---|
| Logo, banner button, footer icon, "About Zoe" | Substack | `header`, `banner`, `footer`, `about_link` |
| Resource card | Substack or Buy Me a Coffee | `resource_card` |
| Popular post card | Substack | `blog_card` |
| Product card or "Visit the shop" in the Tools banner | Buy Me a Coffee | `tools-banner` |
| Coffee-cup donate icon in the footer (removed 2026-10-23; the value stays in the table because earlier data uses it) | Buy Me a Coffee | `footer` |
| Floating coffee-cup button in the bottom right corner | Buy Me a Coffee | `floating-button` |

For the links to Substack the campaign equals `cta_location` of the `cta_substack_click` event, so the same placement has the same name in both GA4 properties.

## Tomorrow Marketers links

Links to `tomorrowmarketers.org` follow that partner's own rule: `utm_source=referral`, `utm_medium=service`, `utm_campaign=hct` (my referral code), and `utm_content=<channel>-<name>`, for example `substack-claude-cowork`.

## Examples

| Situation | Link |
|---|---|
| LinkedIn post that leads to a Substack post | `https://zoedatalens.substack.com/p/claude-cowork?utm_source=linkedin&utm_medium=social&utm_campaign=learn-ai-from-0&utm_content=caption-claude-cowork` |
| YouTube description that leads to a product | `https://buymeacoffee.com/zoedatalensai/e/582024?utm_source=youtube&utm_medium=video&utm_campaign=bmc-shop&utm_content=description-doodle-explainer-kit` |
| LinkedIn profile that leads to the Library | `https://tuhoang3112.github.io/zoe-learning-library/?utm_source=linkedin&utm_medium=social&utm_content=bio` |

## Before publishing

Open the link in a private window and check the UTM is still in the address bar, then check the visit in GA4 **Realtime**. A week later, the **Traffic acquisition** report should show it under Organic Social, Organic Video, Email or Referral, not "Unassigned".

## Limits

UTM only tells where a visit came from, not whether the reader liked the content. The two GA4 properties (Library, Substack) share no user id, so they are linked by campaign name, never by person.
