-- 08 Reading depth per post (Substack property)
-- Sessions that reached each scroll threshold (scroll_depth) and each time threshold (read_time), per post.
-- Scroll depth and time on page are proxies for reading, not proof that the post was read.
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

WITH e AS (
  SELECT
    REGEXP_EXTRACT(param_str(event_params, 'page_location'), r'https?://[^/]+(/[^?#]*)') AS page_path,
    CONCAT(user_pseudo_id, '.', CAST(param_int(event_params, 'ga_session_id') AS STRING)) AS session_id,
    event_name,
    param_int(event_params, 'percent_scrolled') AS percent_scrolled,
    param_int(event_params, 'read_seconds')     AS read_seconds
  FROM `PROJECT.SUBSTACK_DATASET.events_*`
  WHERE _TABLE_SUFFIX BETWEEN start_date AND end_date
    AND event_name IN ('page_view', 'scroll_depth', 'read_time')
)
SELECT
  page_path,
  COUNT(DISTINCT IF(event_name = 'page_view', session_id, NULL))                          AS sessions,
  COUNT(DISTINCT IF(event_name = 'scroll_depth' AND percent_scrolled >= 25, session_id, NULL)) AS reached_25,
  COUNT(DISTINCT IF(event_name = 'scroll_depth' AND percent_scrolled >= 50, session_id, NULL)) AS reached_50,
  COUNT(DISTINCT IF(event_name = 'scroll_depth' AND percent_scrolled >= 75, session_id, NULL)) AS reached_75,
  COUNT(DISTINCT IF(event_name = 'scroll_depth' AND percent_scrolled >= 90, session_id, NULL)) AS reached_90,
  COUNT(DISTINCT IF(event_name = 'read_time' AND read_seconds >= 30,  session_id, NULL))   AS stayed_30s,
  COUNT(DISTINCT IF(event_name = 'read_time' AND read_seconds >= 60,  session_id, NULL))   AS stayed_60s,
  COUNT(DISTINCT IF(event_name = 'read_time' AND read_seconds >= 120, session_id, NULL))   AS stayed_120s
FROM e
WHERE page_path LIKE '/p/%'
GROUP BY page_path
HAVING sessions > 0
ORDER BY sessions DESC;
