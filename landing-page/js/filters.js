/* Filter state, URL sync and combined filtering. */
var FILTER_KEYS = ["topic", "type", "level", "access"];

function emptyFilters() {
  return { q: "", topic: "All", type: "All", level: "All", access: "All" };
}

function readStateFromUrl() {
  var cfg = window.ZoeConfig;
  var params = new URLSearchParams(window.location.search);
  var allowed = { topic: cfg.TOPICS.map(function (t) { return t.name; }), type: cfg.TYPES, level: cfg.LEVELS, access: cfg.ACCESS };
  var state = emptyFilters();
  state.q = (params.get("q") || "").trim();
  FILTER_KEYS.forEach(function (k) {
    var v = params.get(k);
    if (v && allowed[k].indexOf(v) !== -1) state[k] = v;
  });
  return state;
}

function writeStateToUrl(state) {
  var params = new URLSearchParams();
  if (state.q) params.set("q", state.q);
  FILTER_KEYS.forEach(function (k) {
    if (state[k] !== "All") params.set(k, state[k]);
  });
  var qs = params.toString();
  history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : "") + window.location.hash);
}

/* A resource has one primary topic and may also be listed under secondary_topics. */
function resourceTopics(r) {
  return [r.topic].concat(r.secondary_topics || []);
}

function matchesFilter(r, key, value) {
  if (value === "All") return true;
  return key === "topic" ? resourceTopics(r).indexOf(value) !== -1 : r[key] === value;
}

function applyFilters(resources, state) {
  return resources.filter(function (r) {
    return FILTER_KEYS.every(function (k) { return matchesFilter(r, k, state[k]); }) &&
      matchesQuery(r, state.q);
  });
}

/* Default view (no search, no filter): type "Resource" cards come first, then the rest; inside each group the
   providers are dealt out in turns (Zoe, Tomorrow Marketers, Thầy Long, ...) so one author can't fill a page.
   Each provider keeps its position order. */
function isDefaultView(state) {
  return !state.q && FILTER_KEYS.every(function (k) { return state[k] === "All"; });
}

function interleaveByProvider(list) {
  var queues = {}, order = [];
  list.forEach(function (r) {
    var key = r.provider || "(none)";
    if (!queues[key]) { queues[key] = []; order.push(key); }
    queues[key].push(r);
  });
  var out = [];
  while (out.length < list.length) {
    order.forEach(function (k) { if (queues[k].length) out.push(queues[k].shift()); });
  }
  return out;
}

/* Cards with a "home_rank" in resources.json are pinned to the top of the default view, in rank order. */
function defaultViewOrder(list) {
  var pinned = list.filter(function (r) { return r.home_rank; })
    .sort(function (a, b) { return a.home_rank - b.home_rank; });
  var rest = list.filter(function (r) { return !r.home_rank; });
  var isResource = function (r) { return r.type === "Resource"; };
  return pinned
    .concat(interleaveByProvider(rest.filter(isResource)))
    .concat(interleaveByProvider(rest.filter(function (r) { return !isResource(r); })));
}
