# Audience survey — design

A short anonymous survey of the readers of the newsletter (Google Forms). It gives the one thing analytics cannot: what people **say** they want. The answers are then compared with what GA4 shows they actually read (the "say vs. do" analysis).

**Status: designed, not launched.** Response counts and rate are left empty until the survey has closed.

## 1. Decisions the survey supports

| Decision | Question that informs it |
|---|---|
| Which series and topics to write more of | Q4, Q5 |
| Which formats to use (long post, short post, video, template) | Q7 |
| Whether the Learning Library is useful and what is missing from it | Q8 |
| What obstacles to address in content | Q9 |
| Whether stated interest matches reading behavior | Q4, Q5 against GA4 |

## 2. Population and sampling

- **Target population:** people who read the newsletter or use the library.
- **Sampling frame available:** subscribers (~1.85K) and followers who see the LinkedIn post. There is no list of all readers and no list of non-readers.
- **Tool:** Google Forms, not Substack's built-in survey. The built-in tool only reaches people who read the post it is embedded in, while the survey also has to reach LinkedIn followers who do not subscribe; Google Forms also gives the question types below and a clean export.
- **Method:** open link, shared in one newsletter post and in one LinkedIn post, open for 14 days, one reminder. This is a **self-selected convenience sample**, not a random sample.
- **Consequence:** results describe engaged readers who chose to answer. They do not describe the market or the silent majority.

| | |
|---|---|
| People reached (estimate) | *to be filled* |
| Responses | *to be filled* |
| Response rate | *to be filled* |

## 3. Design principles

1. **Non-leading wording.** Neutral verbs, no adjectives that suggest a right answer, no "how much do you love…".
2. **Same topic list everywhere.** The topic options are the real series and themes of the newsletter, identical in Q4 and Q5, and shown in **random order** to remove position effects.
3. **Recall and preference are separate questions** (what you *read* vs. what you *want*), because they are compared later.
4. **One scale for all rating questions:** 5 points, every point labeled, neutral midpoint.
5. **Short:** target under 3 minutes, 9 questions, 2 optional open questions.
6. **Anonymous:** no name, no email. Consent line at the top explains the purpose and that answers are used in aggregate.

## 4. Questions

Asked in Vietnamese; English wording below.

| # | Question | Type | Why this way |
|---|---|---|---|
| 1 | Which of these best describes you? (student / early-career or career changer / working analyst / marketer / other) | Single choice | Segments the answers; screens whether respondents are the intended audience |
| 2 | How did you first find this newsletter? (LinkedIn / Facebook / Google search / a friend / another newsletter / other) | Single choice | Lets survey segments be compared with GA4 traffic sources |
| 3 | How often do you read a new post? (every post / most / some / rarely / first time) | Single choice, labeled | Separates regular readers from occasional ones for later weighting |
| 4 | Which of these topics did you read in the last 3 months? (list of series and themes, random order, multiple) | Multiple choice | **Stated behavior** to compare with GA4 |
| 5 | Which of these topics would you most like to read more about? Choose up to 3. (same list, random order) | Multiple choice, max 3 | **Stated preference**; the cap forces trade-offs |
| 6 | What are you trying to achieve in the next 6 months? (first data job / change career into data / grow in current role / learn AI tools for work / other) | Single choice | Explains *why* people want certain topics |
| 7 | Which formats help you most? (long guide / short post / video / template or file / email summary) Choose up to 2. | Multiple choice, max 2 | Format decisions |
| 8 | Have you used the Learning Library? If yes, what were you looking for that you could not find? | Yes/No + optional open text | Connects to zero-result searches in analytics |
| 9 | What makes it hardest to learn data or AI right now? (not knowing where to start / too many resources / no practice data / no feedback / time / other) Choose up to 2. | Multiple choice, max 2 | Obstacles to design content around |
| 10 | Anything else you would like me to write about? | Optional open text | Catches topics missing from the list |

Excluded on purpose: any question about willingness to pay (hypothetical, unreliable) and any rating of my own content (courtesy bias).

## 5. Analysis plan

- **Report every result with the number of respondents behind it** and a 95% Wilson confidence interval for proportions.
- **Compare segments** (Q1, Q2, Q3) only when each has enough answers; small segments are shown but not interpreted.
- **Say vs. do:** for each topic, compare
  - *stated share* = respondents who chose it in Q4 (and Q5) ÷ respondents, with
  - *actual share* = share of post views (GA4) and of sessions reaching 75% scroll on posts of that topic, over the same period.
  A gap index per topic (stated preference minus actual reading share) points to topics that readers want but the posts do not attract, or the reverse.
- **Free text (Q8, Q10):** grouped by theme, counts reported; quotes only if they contain nothing identifying.

## 6. Bias and limits

| Issue | Effect | What is done |
|---|---|---|
| Self-selection | Engaged readers over-represented | Say so in every chart; do not extrapolate |
| Non-response | Silent majority unknown | Report the response rate |
| Recall error (Q4) | People misremember what they read | Compare against GA4 instead of trusting Q4 alone |
| Stated vs. real preference | People say what sounds good | That is the point of comparing with behavior |
| Small sample | Wide confidence intervals | Show intervals; avoid ranking topics that overlap |
| Channel effect | The LinkedIn and newsletter audiences differ | Q2 lets the two be compared |
