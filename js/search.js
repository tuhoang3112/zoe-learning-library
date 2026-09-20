/* Client-side search. Every whitespace-separated term must match somewhere (AND). */
function resourceHaystack(r) {
  return [r.title, r.description, r.provider, r.topic, r.type, r.level]
    .concat(r.secondary_topics || [])
    .concat(r.tags || [])
    .join(" ")
    .toLowerCase();
}

function matchesQuery(resource, query) {
  var terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  var hay = resourceHaystack(resource);
  return terms.every(function (t) { return hay.indexOf(t) !== -1; });
}
