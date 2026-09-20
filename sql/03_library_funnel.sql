-- 03 Library funnel per session
-- visit -> saw resources -> explored (search / filter / topic) -> clicked a resource -> clicked through to Substack.
-- A session counts once per step if the event happened in that session.
DECLARE start_date STRING DEFAULT '20260921';
DECLARE end_date   STRING DEFAULT FORMAT_DATE('%Y%m%d', CURRENT_DATE());

CREATE TEMP FUNCTION param_int(
  params ARRAY<STRUCT<key STRING, value STRUCT<string_value STRING, int_value INT64, float_value FLOAT64, double_value FLOAT64>>>,
  k STRING
) AS ((
  SELECT COALESCE(p.value.int_value, CAST(p.value.double_value AS INT64), SAFE_CAST(p.value.string_value AS INT64))
  FROM UNNEST(params) AS p WHERE p.key = k LIMIT 1
));

WITH sessions AS (
  SELECT
    CONCAT(user_pseudo_id, '.', CAST(param_int(event_params, 'ga_session_id') AS STRING)) AS session_id,
    COUNTIF(event_name = 'page_view')           > 0 AS visited,
    COUNTIF(event_name = 'resource_impression') > 0 AS saw_resources,
    COUNTIF(event_name IN ('filter_apply', 'library_search', 'category_click')) > 0 AS explored,
    COUNTIF(event_name = 'resource_click')      > 0 AS clicked_resource,
    COUNTIF(event_name = 'cta_substack_click')  > 0 AS clicked_substack
  FROM `PROJECT.LIBRARY_DATASET.events_*`
  WHERE _TABLE_SUFFIX BETWEEN start_date AND end_date
  GROUP BY session_id
),
steps AS (
  SELECT 1 AS step_no, '1 visit' AS step, COUNTIF(visited) AS sessions FROM sessions
  UNION ALL SELECT 2, '2 saw at least one resource',            COUNTIF(saw_resources)    FROM sessions
  UNION ALL SELECT 3, '3 searched, filtered or picked a topic', COUNTIF(explored)         FROM sessions
  UNION ALL SELECT 4, '4 clicked a resource',                   COUNTIF(clicked_resource) FROM sessions
  UNION ALL SELECT 5, '5 clicked through to Substack',          COUNTIF(clicked_substack) FROM sessions
)
SELECT
  step,
  sessions,
  ROUND(SAFE_DIVIDE(sessions, FIRST_VALUE(sessions) OVER (ORDER BY step_no)), 4) AS share_of_visits
FROM steps
ORDER BY step_no;
