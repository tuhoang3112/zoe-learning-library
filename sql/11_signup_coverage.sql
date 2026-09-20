-- 11 Sign-ups seen by GA4, per day (Substack property)
-- Use it beside Substack's own "new subscribers per day" (Growth sources report, entered by hand or exported).
-- coverage = GA4 sign_up / Substack new subscribers, by day. GA4 only sees sign-ups that happen on the web pages of the
-- publication; subscribers who join through the Substack app or network never load the tag, so coverage is expected to be low.
DECLARE start_date STRING DEFAULT '20260921';
DECLARE end_date   STRING DEFAULT FORMAT_DATE('%Y%m%d', CURRENT_DATE());

-- Replace with the daily numbers copied from Substack (Growth sources -> New subscribers).
WITH substack_new_subscribers AS (
  SELECT DATE '2026-09-21' AS day, 0 AS new_subscribers
  -- UNION ALL SELECT DATE '2026-09-22', 0
),
ga4_signups AS (
  SELECT
    PARSE_DATE('%Y%m%d', event_date)  AS day,
    COUNT(*)                          AS ga4_sign_ups,
    COUNT(DISTINCT user_pseudo_id)    AS ga4_users
  FROM `PROJECT.SUBSTACK_DATASET.events_*`
  WHERE _TABLE_SUFFIX BETWEEN start_date AND end_date
    AND event_name = 'sign_up'
  GROUP BY day
)
SELECT
  COALESCE(g.day, s.day)          AS day,
  IFNULL(g.ga4_sign_ups, 0)       AS ga4_sign_ups,
  s.new_subscribers               AS substack_new_subscribers,
  ROUND(SAFE_DIVIDE(g.ga4_sign_ups, s.new_subscribers), 3) AS coverage
FROM ga4_signups AS g
FULL OUTER JOIN substack_new_subscribers AS s ON g.day = s.day
ORDER BY day;
