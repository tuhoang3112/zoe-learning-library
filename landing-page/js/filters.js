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

/* Default view order:
   1. cards with a "home_rank" in resources.json, in rank order;
   2. then "Resource" cards with one of Zoe's other "Tools & Templates" cards
      after every 3 of them. Resources go in three groups: data non-blog (topic Data Analytics or "dashboard" in the title), other non-blog, then blog series (tag "Series");
   providers are dealt out in turns inside each group (tools already shown in the banner, passed in as isBannerTool, are left out here);
   3. then whatever is left (Course, Dataset, banner tools, ...), providers dealt out in turns. */
var TOOLS_EVERY = 3;

function defaultViewOrder(list, isBannerTool) {
  var pinned = list.filter(function (r) { return r.home_rank; })
    .sort(function (a, b) { return a.home_rank - b.home_rank; });
  var rest = list.filter(function (r) { return !r.home_rank; });
  var isSprinkled = function (r) { return r.type === "Tools & Templates" && !isBannerTool(r); };
  var isBlog = function (r) { return (r.tags || []).indexOf("Series") !== -1; };
  var onlyResources = rest.filter(function (r) { return r.type === "Resource"; });
  var isData = function (r) { return r.topic === "Data Analytics" || /dashboard/i.test(r.title); };
  var resources = interleaveByProvider(onlyResources.filter(function (r) { return !isBlog(r) && isData(r); }))
    .concat(interleaveByProvider(onlyResources.filter(function (r) { return !isBlog(r) && !isData(r); })))
    .concat(interleaveByProvider(onlyResources.filter(isBlog)));
  var tools = rest.filter(isSprinkled).sort(function (a, b) { return a.position - b.position; });
  var others = interleaveByProvider(rest.filter(function (r) { return r.type !== "Resource" && !isSprinkled(r); }));
  var mixed = [];
  while (resources.length || tools.length) {
    for (var n = 0; n < TOOLS_EVERY && resources.length; n++) mixed.push(resources.shift());
    if (tools.length) mixed.push(tools.shift());
  }
  return pinned.concat(mixed, others);
}
