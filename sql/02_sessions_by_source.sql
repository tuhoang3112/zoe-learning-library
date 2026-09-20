-- 02 Sessions by UTM source / medium / campaign (run once per property)
-- collected_traffic_source holds the UTM values seen on the event; it is empty when the visit had no UTM.
DECLARE start_date STRING DEFAULT '20260921';
DECLARE end_date   STRING DEFAULT FORMAT_DATE('%Y%m%d', CURRENT_DATE());

CREATE TEMP FUNCTION param_int(
  params ARRAY<STRUCT<key STRING, value STRUCT<string_value STRING, int_value INT64, float_value FLOAT64, double_value FLOAT64>>>,
  k STRING
) AS ((
  SELECT COALESCE(p.value.int_value, CAST(p.value.double_value AS INT64), SAFE_CAST(p.value.string_value AS INT64))
  FROM UNNEST(params) AS p WHERE p.key = k LIMIT 1
));

SELECT
  COALESCE(collected_traffic_source.manual_source,        '(none)') AS utm_source,
  COALESCE(collected_traffic_source.manual_medium,        '(none)') AS utm_medium,
  COALESCE(collected_traffic_source.manual_campaign_name, '(none)') AS utm_campaign,
  COUNT(DISTINCT CONCAT(user_pseudo_id, '.', CAST(param_int(event_params, 'ga_session_id') AS STRING))) AS sessions
FROM `PROJECT.LIBRARY_DATASET.events_*`   -- swap for SUBSTACK_DATASET to analyse the Substack property
WHERE _TABLE_SUFFIX BETWEEN start_date AND end_date
  AND event_name = 'session_start'
GROUP BY utm_source, utm_medium, utm_campaign
ORDER BY sessions DESC;
