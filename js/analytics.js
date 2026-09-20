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

function trackResourceClick(resource) {
  pushDataLayer(Object.assign({ event: "resource_click" }, resourceParams(resource)));
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

/* Any element with data-cta-location is a Substack CTA. */
document.addEventListener("click", function (e) {
  var cta = e.target.closest && e.target.closest("[data-cta-location]");
  if (cta) trackSubstackCta(cta.getAttribute("data-cta-location"));
});
