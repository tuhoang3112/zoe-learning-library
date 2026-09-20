/* Single analytics helper. All tracking goes through the Data Layer -> GTM -> GA4. */
window.dataLayer = window.dataLayer || [];

function pushDataLayer(eventData) {
  window.dataLayer.push(eventData);
}

function resourceParams(resource) {
  return {
    resource_id: resource.id,
    resource_name: resource.title,
    resource_type: resource.type,
    topic: resource.topic,
    level: resource.level,
    access: resource.access,
    provider: resource.provider,
    position: resource.position
  };
}

/* position = fixed catalogue rank; list_position = rank in the list the visitor is looking at (after search / filters). */
function trackResourceClick(resource, listPosition) {
  pushDataLayer(Object.assign({ event: "resource_click", list_position: listPosition }, resourceParams(resource)));
}

function trackResourceImpression(resource, listPosition, resultCount) {
  pushDataLayer(Object.assign(
    { event: "resource_impression", list_position: listPosition, result_count: resultCount },
    resourceParams(resource)
  ));
}

function trackCategoryClick(categoryName) {
  pushDataLayer({ event: "category_click", category_name: categoryName });
}

function trackSearch(searchTerm, resultCount) {
  pushDataLayer({ event: "library_search", search_term: searchTerm, result_count: resultCount });
}

function trackFilter(filters, resultCount) {
  pushDataLayer({
    event: "filter_apply",
    filter_topic: filters.topic,
    filter_type: filters.type,
    filter_level: filters.level,
    filter_access: filters.access,
    result_count: resultCount
  });
}

function trackSubstackCta(location) {
  pushDataLayer({ event: "cta_substack_click", cta_location: location });
}

/* Add UTM parameters to links that lead to Zoe's Substack, so Substack/GA4 can attribute the traffic. */
function withSubstackUtm(url, campaign, content) {
  try {
    var u = new URL(url);
    if (u.hostname !== new URL(window.ZoeConfig.SUBSTACK_URL).hostname) return url;
    u.searchParams.set("utm_source", "learning-library");
    u.searchParams.set("utm_medium", "referral");
    u.searchParams.set("utm_campaign", campaign);
    if (content) u.searchParams.set("utm_content", content);
    return u.toString();
  } catch (e) {
    return url;
  }
}

/* Static Substack CTAs: utm_campaign = their data-cta-location. */
document.querySelectorAll("a[data-cta-location]").forEach(function (a) {
  a.href = withSubstackUtm(a.href, a.getAttribute("data-cta-location"));
});

/* Any element with data-cta-location is a Substack CTA. */
document.addEventListener("click", function (e) {
  var cta = e.target.closest && e.target.closest("[data-cta-location]");
  if (cta) trackSubstackCta(cta.getAttribute("data-cta-location"));
});
