-- 09 Share of sessions with no source (direct / none), per week (Substack property)
-- Definition used here: the session_start event has no UTM source and an empty referrer.
-- This is an approximation of GA4's (direct) / (none); check it against the GA4 Traffic acquisition report.
-- Sources that Substack sets itself are counted apart, because they cannot be tagged.
DECLARE start_date STRING DEFAULT '20260921';
DECLARE end_date   STRING DEFAULT FORMAT_DATE('%Y%m%d', CURRENT_DATE());

CREATE TEMP FUNCTION param_str(
  params ARRAY<STRUCT<key STRING, value STRUCT<string_value STRING, int_value INT64, float_value FLOAT64, double_value FLOAT64>>>,
  k STRING
) AS ((SELECT p.value.string_value FROM UNNEST(params) AS p WHERE p.key = k LIMIT 1));

WITH s AS (
  SELECT
    DATE_TRUNC(PARSE_DATE('%Y%m%d', event_date), WEEK(MONDAY)) AS week,
    collected_traffic_source.manual_source AS utm_source,
    COALESCE(param_str(event_params, 'page_referrer'), '')      AS referrer
  FROM `PROJECT.SUBSTACK_DATASET.events_*`
  WHERE _TABLE_SUFFIX BETWEEN start_date AND end_date
    AND event_name = 'session_start'
)
SELECT
  week,
  COUNT(*) AS sessions,
  COUNTIF(utm_source IS NULL AND referrer = '') AS direct_none,
  ROUND(SAFE_DIVIDE(COUNTIF(utm_source IS NULL AND referrer = ''), COUNT(*)), 4) AS direct_none_share,
  COUNTIF(utm_source IN ('activity_item', 'cover_page', 'confirmation_email')
          OR STARTS_WITH(COALESCE(utm_source, ''), 'multiple-personal-recommendation')) AS substack_internal,
  COUNTIF(utm_source = 'learning-library') AS from_learning_library
FROM s
GROUP BY week
ORDER BY week;
