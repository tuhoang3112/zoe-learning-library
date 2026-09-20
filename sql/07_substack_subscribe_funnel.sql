-- 07 Substack subscribe funnel (Substack property)
-- Two result sets: (a) the funnel per session, (b) Subscribe clicks and popup views by placement.
-- Events come from the Substack GTM container: subscribe_popup_view, subscribe_click, sign_up.
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

-- (a) Funnel per session
WITH sessions AS (
  SELECT
    CONCAT(user_pseudo_id, '.', CAST(param_int(event_params, 'ga_session_id') AS STRING)) AS session_id,
    COUNTIF(event_name = 'page_view')             > 0 AS visited,
    COUNTIF(event_name = 'subscribe_popup_view')  > 0 AS saw_popup,
    COUNTIF(event_name = 'subscribe_click')       > 0 AS clicked_subscribe,
    COUNTIF(event_name = 'sign_up')               > 0 AS signed_up
  FROM `PROJECT.SUBSTACK_DATASET.events_*`
  WHERE _TABLE_SUFFIX BETWEEN start_date AND end_date
  GROUP BY session_id
),
steps AS (
  SELECT 1 AS step_no, '1 visit' AS step, COUNTIF(visited) AS sessions FROM sessions
  UNION ALL SELECT 2, '2 saw the subscribe popup', COUNTIF(saw_popup)         FROM sessions
  UNION ALL SELECT 3, '3 clicked Subscribe',       COUNTIF(clicked_subscribe) FROM sessions
  UNION ALL SELECT 4, '4 signed up',               COUNTIF(signed_up)         FROM sessions
)
SELECT
  step,
  sessions,
  ROUND(SAFE_DIVIDE(sessions, FIRST_VALUE(sessions) OVER (ORDER BY step_no)), 4) AS share_of_visits
FROM steps
ORDER BY step_no;

-- (b) Which placement gets the clicks (header, popup, inline, footer, home)
SELECT
  param_str(event_params, 'subscribe_location') AS subscribe_location,
  COUNTIF(event_name = 'subscribe_click')       AS subscribe_clicks,
  COUNTIF(event_name = 'subscribe_popup_view')  AS popup_views,
  COUNTIF(event_name = 'subscribe_popup_dismiss') AS popup_dismissals
FROM `PROJECT.SUBSTACK_DATASET.events_*`
WHERE _TABLE_SUFFIX BETWEEN start_date AND end_date
  AND event_name IN ('subscribe_click', 'subscribe_popup_view', 'subscribe_popup_dismiss')
GROUP BY subscribe_location
ORDER BY subscribe_clicks DESC;
