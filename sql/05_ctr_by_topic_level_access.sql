-- 05 Click-through rate by topic, level, free / paid and resource type
-- Per exposure (clicks divided by impressions), so a topic is not favoured just because it has more items.
DECLARE start_date STRING DEFAULT '20260921';
DECLARE end_date   STRING DEFAULT FORMAT_DATE('%Y%m%d', CURRENT_DATE());

CREATE TEMP FUNCTION param_str(
  params ARRAY<STRUCT<key STRING, value STRUCT<string_value STRING, int_value INT64, float_value FLOAT64, double_value FLOAT64>>>,
  k STRING
) AS ((SELECT p.value.string_value FROM UNNEST(params) AS p WHERE p.key = k LIMIT 1));

WITH e AS (
  SELECT
    event_name,
    param_str(event_params, 'topic')         AS topic,
    param_str(event_params, 'level')         AS level,
    param_str(event_params, 'access')        AS access,
    param_str(event_params, 'resource_type') AS resource_type
  FROM `PROJECT.LIBRARY_DATASET.events_*`
  WHERE _TABLE_SUFFIX BETWEEN start_date AND end_date
    AND event_name IN ('resource_impression', 'resource_click')
),
long AS (
  SELECT 'topic' AS dimension, topic AS value, event_name FROM e
  UNION ALL SELECT 'level',         level,         event_name FROM e
  UNION ALL SELECT 'access',        access,        event_name FROM e
  UNION ALL SELECT 'resource_type', resource_type, event_name FROM e
)
SELECT
  dimension,
  value,
  COUNTIF(event_name = 'resource_impression') AS impressions,
  COUNTIF(event_name = 'resource_click')      AS clicks,
  ROUND(SAFE_DIVIDE(COUNTIF(event_name = 'resource_click'), COUNTIF(event_name = 'resource_impression')), 4) AS ctr
FROM long
WHERE value IS NOT NULL
GROUP BY dimension, value
ORDER BY dimension, impressions DESC;
