-- 01 Events overview (Library property)
-- Sanity check of the tracking: which events arrive, how often, from how many users.
DECLARE start_date STRING DEFAULT '20260921';
DECLARE end_date   STRING DEFAULT FORMAT_DATE('%Y%m%d', CURRENT_DATE());

SELECT
  event_name,
  COUNT(*)                        AS events,
  COUNT(DISTINCT user_pseudo_id)  AS users,
  COUNT(DISTINCT event_date)      AS active_days,
  MIN(event_date)                 AS first_day,
  MAX(event_date)                 AS last_day
FROM `PROJECT.LIBRARY_DATASET.events_*`
WHERE _TABLE_SUFFIX BETWEEN start_date AND end_date
GROUP BY event_name
ORDER BY events DESC;
