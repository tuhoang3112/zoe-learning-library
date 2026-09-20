-- 06 Searches, and searches that find nothing
-- A search with result_count = 0 is demand the library does not meet: a candidate for new content.
DECLARE start_date STRING DEFAULT '20260921';
DECLARE end_date   STRING DEFAULT FORMAT_DATE('%Y%m%d', CURRENT_DATE());

CREATE TEMP FUNCTION param_str(
  params ARRAY<STRUCT<key STRING, value STRUCT<string_value STRING, int_value INT64, float_value FLOAT64, double_value FLOAT64>>>,
  k STRING
) AS ((SELECT p.value.string_value FROM UNNEST(params) AS p WHERE p.key = k LIMIT 1));

CREATE TEMP FUNCTION param_int(
  params ARRAY<STRUCT<key STRING, value STRUCT<string_value STRING, int_value INT64, float_value FLOAT64, double_value FLOAT64>>>,
  k STRING
) AS ((
  SELECT COALESCE(p.value.int_value, CAST(p.value.double_value AS INT64), SAFE_CAST(p.value.string_value AS INT64))
  FROM UNNEST(params) AS p WHERE p.key = k LIMIT 1
));

SELECT
  param_str(event_params, 'search_term')                AS search_term,
  COUNT(*)                                              AS searches,
  COUNT(DISTINCT user_pseudo_id)                        AS users,
  COUNTIF(param_int(event_params, 'result_count') = 0)  AS zero_result_searches,
  ROUND(SAFE_DIVIDE(COUNTIF(param_int(event_params, 'result_count') = 0), COUNT(*)), 4) AS zero_result_rate,
  ROUND(AVG(param_int(event_params, 'result_count')), 1) AS avg_results
FROM `PROJECT.LIBRARY_DATASET.events_*`
WHERE _TABLE_SUFFIX BETWEEN start_date AND end_date
  AND event_name = 'library_search'
GROUP BY search_term
ORDER BY zero_result_searches DESC, searches DESC;
