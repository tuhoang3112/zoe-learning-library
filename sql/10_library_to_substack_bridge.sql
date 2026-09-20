-- 10 Library -> Substack bridge, by day and placement
-- The two properties share no user id, so the link is aggregate only:
--   Library:  cta_substack_click by cta_location (header, banner, footer, resource_card)
--   Substack: sessions whose utm_source is learning-library, by utm_campaign (the same four values)
-- Both datasets must be in the same BigQuery location to be queried together.
-- Clicks and sessions do not match one to one (ad blockers, blocked cookies, people who click and do not load the page).
DECLARE start_date STRING DEFAULT '20260921';
DECLARE end_date   STRING DEFAULT FORMAT_DATE('%Y%m%d', CURRENT_DATE());

CREATE TEMP FUNCTION param_str(
  params ARRAY<STRUCT<key STRING, value STRUCT<string_value STRING, int_value INT64, float_value FLOAT64, double_value FLOAT64>>>,
  k STRING
) AS ((SELECT p.value.string_value FROM UNNEST(params) AS p WHERE p.key = k LIMIT 1));

WITH library_clicks AS (
  SELECT
    PARSE_DATE('%Y%m%d', event_date)      AS day,
    param_str(event_params, 'cta_location') AS placement,
    COUNT(*)                                AS clicks_in_library
  FROM `PROJECT.LIBRARY_DATASET.events_*`
  WHERE _TABLE_SUFFIX BETWEEN start_date AND end_date
    AND event_name = 'cta_substack_click'
  GROUP BY day, placement
),
substack_sessions AS (
  SELECT
    PARSE_DATE('%Y%m%d', event_date)                 AS day,
    collected_traffic_source.manual_campaign_name    AS placement,
    COUNT(*)                                         AS sessions_in_substack
  FROM `PROJECT.SUBSTACK_DATASET.events_*`
  WHERE _TABLE_SUFFIX BETWEEN start_date AND end_date
    AND event_name = 'session_start'
    AND collected_traffic_source.manual_source = 'learning-library'
  GROUP BY day, placement
)
SELECT
  COALESCE(c.day, s.day)             AS day,
  COALESCE(c.placement, s.placement) AS placement,
  IFNULL(c.clicks_in_library, 0)     AS clicks_in_library,
  IFNULL(s.sessions_in_substack, 0)  AS sessions_in_substack,
  ROUND(SAFE_DIVIDE(s.sessions_in_substack, c.clicks_in_library), 3) AS arrival_ratio
FROM library_clicks AS c
FULL OUTER JOIN substack_sessions AS s
  ON c.day = s.day AND c.placement = s.placement
ORDER BY day, placement;
