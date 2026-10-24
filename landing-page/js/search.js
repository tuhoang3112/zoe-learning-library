/* Client-side search. Every whitespace-separated term must match somewhere (AND).
   Matching ignores case and accents, so "tong hop" finds "Tổng hợp". */
function normalizeText(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function searchTerms(query) {
  return normalizeText(query).trim().split(/\s+/).filter(Boolean);
}

function resourceHaystack(r) {
  return normalizeText([r.title, r.description, r.provider, r.topic, r.type, r.level]
    .concat(r.secondary_topics || [])
    .concat(r.tags || [])
    .join(" "));
}

function matchesQuery(resource, query) {
  var terms = searchTerms(query);
  if (!terms.length) return true;
  var hay = resourceHaystack(resource);
  return terms.every(function (t) { return hay.indexOf(t) !== -1; });
}

/* Order search results: cards whose title has every term first, then cards whose title has some term,
   then the rest. Inside each group the existing order (position) is kept. */
function rankBySearch(list, query) {
  var terms = searchTerms(query);
  if (!terms.length) return list;
  function tier(r) {
    var title = normalizeText(r.title);
    var hits = terms.filter(function (t) { return title.indexOf(t) !== -1; }).length;
    return hits === terms.length ? 0 : hits > 0 ? 1 : 2;
  }
  return list
    .map(function (r, i) { return { r: r, t: tier(r), i: i }; })
    .sort(function (a, b) { return a.t - b.t || a.i - b.i; })
    .map(function (x) { return x.r; });
}
