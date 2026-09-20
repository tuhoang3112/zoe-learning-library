-- 04 Click-through rate by position in the list shown to the visitor
-- CTR = resource_click / resource_impression, grouped by list_position (rank after search and filters).
-- With the default alphabetical order a resource always sits at the same rank, so rank and resource are confounded:
-- read this together with 05 and treat it as a first look, not proof of position bias.
DECLARE start_date STRING DEFAULT '20260921';
DECLARE end_date   STRING DEFAULT FORMAT_DATE('%Y%m%d', CURRENT_DATE());

CREATE TEMP FUNCTION param_int(
  params ARRAY<STRUCT<key STRING, value STRUCT<string_value STRING, int_value INT64, float_value FLOAT64, double_value FLOAT64>>>,
  k STRING
) AS ((
  SELECT COALESCE(p.value.int_value, CAST(p.value.double_value AS INT64), SAFE_CAST(p.value.string_value AS INT64))
  FROM UNNEST(params) AS p WHERE p.key = k LIMIT 1
));

WITH e AS (
  SELECT event_name, param_int(event_params, 'list_position') AS list_position
  FROM `PROJECT.LIBRARY_DATASET.events_*`
  WHERE _TABLE_SUFFIX BETWEEN start_date AND end_date
    AND event_name IN ('resource_impression', 'resource_click')
)
SELECT
  list_position,
  COUNTIF(event_name = 'resource_impression') AS impressions,
  COUNTIF(event_name = 'resource_click')      AS clicks,
  ROUND(SAFE_DIVIDE(COUNTIF(event_name = 'resource_click'), COUNTIF(event_name = 'resource_impression')), 4) AS ctr
FROM e
WHERE list_position IS NOT NULL
GROUP BY list_position
ORDER BY list_position;
