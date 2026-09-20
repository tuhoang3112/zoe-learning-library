/* Library page: renders categories, filters and resource cards from resources.json. */
(function () {
  var cfg = window.ZoeConfig;
  var resources = [];
  var state = readStateFromUrl();

  var els = {
    grid: document.getElementById("libraryGrid"),
    count: document.getElementById("count"),
    empty: document.getElementById("empty"),
    more: document.getElementById("seeMore"),
    search: document.getElementById("search"),
    searchForm: document.getElementById("searchForm"),
    categories: document.getElementById("categoryGrid"),
    selects: {
      topic: document.getElementById("topicFilter"),
      type: document.getElementById("typeFilter"),
      level: document.getElementById("levelFilter"),
      access: document.getElementById("accessFilter")
    }
  };

  function h(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text != null) n.textContent = text;
    return n;
  }

  function externalLink(a, r) {
    a.href = r.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    // New tab => page is not unloaded, so the synchronous dataLayer push is never lost.
    a.addEventListener("click", function () { trackResourceClick(r); });
    a.addEventListener("auxclick", function () { trackResourceClick(r); });
  }

  /* ---------- rendering ---------- */

  function renderCategories() {
    cfg.TOPICS.forEach(function (t) {
      var a = h("a", "category");
      a.href = "?topic=" + encodeURIComponent(t.name) + "#library";
      a.appendChild(h("h3", null, t.name));
      a.appendChild(h("p", null, t.blurb));
      a.appendChild(h("span", "category-link", "Explore resources"));
      a.addEventListener("click", function (e) {
        e.preventDefault();
        onCategoryClick(t.name);
      });
      els.categories.appendChild(a);
    });
  }

  function fillSelect(select, values, labels) {
    values.forEach(function (v) {
      var o = document.createElement("option");
      o.value = v;
      o.textContent = (labels && labels[v]) || v;
      select.appendChild(o);
    });
  }

  function renderCard(r) {
    var card = h("article", "item");
    var top = h("div", "item-top");
    top.appendChild(h("span", "type", r.type.toUpperCase()));
    top.appendChild(h("span", "badge badge-" + r.access.toLowerCase(), r.access));
    card.appendChild(top);

    var title = h("h3");
    var link = h("a", null, r.title);
    externalLink(link, r);
    title.appendChild(link);
    card.appendChild(title);

    if (r.provider) card.appendChild(h("div", "source", r.provider));
    r.description.split("\n\n").forEach(function (para) {
      var p = h("p", "desc");
      var m = para.match(/^(Yêu cầu đầu vào:|Phù hợp với:)\s*(.*)$/);
      if (m) {
        p.appendChild(h("strong", null, m[1]));
        p.appendChild(document.createTextNode(" " + m[2]));
      } else {
        p.textContent = para;
      }
      card.appendChild(p);
    });

    var bottom = h("div", "item-bottom");
    var meta = h("div", "item-meta");
    resourceTopics(r).forEach(function (t) { meta.appendChild(h("span", "topic", t)); });
    meta.appendChild(h("span", "topic", r.level));
    bottom.appendChild(meta);
    var open = h("a", "open", "Open resource ↗");
    externalLink(open, r);
    open.setAttribute("aria-label", "Open resource: " + r.title + " (new tab)");
    bottom.appendChild(open);
    card.appendChild(bottom);
    return card;
  }

  var ROWS_PER_PAGE = 2;
  var visibleRows = ROWS_PER_PAGE;

  function gridColumns() {
    return getComputedStyle(els.grid).gridTemplateColumns.split(" ").length || 1;
  }

  function render() {
    var results = applyFilters(resources, state);
    var limit = visibleRows * gridColumns();
    els.grid.replaceChildren.apply(els.grid, results.slice(0, limit).map(renderCard));
    els.more.style.display = results.length > limit ? "inline-flex" : "none";
    els.count.textContent = results.length + " item" + (results.length === 1 ? "" : "s");
    els.empty.style.display = results.length ? "none" : "block";
    return results.length;
  }

  function syncControls() {
    FILTER_KEYS.forEach(function (k) { els.selects[k].value = state[k]; });
    els.search.value = state.q;
  }

  /* ---------- analytics: dedupe repeated identical events ---------- */

  var lastFilterKey = null;
  var lastSearchTerm = null;
  var searchTimer = null;

  function filterKey() {
    return FILTER_KEYS.map(function (k) { return state[k]; }).join("|");
  }

  function fireFilterEvent(count) {
    var key = filterKey();
    if (key === lastFilterKey) return;
    lastFilterKey = key;
    trackFilter(state, count);
  }

  /* library_search fires once per meaningful term: after a debounce, or immediately on submit. */
  function fireSearchEvent(count) {
    clearTimeout(searchTimer);
    var term = state.q.trim().toLowerCase();
    if (term.length < cfg.SEARCH_MIN_CHARS || term === lastSearchTerm) return;
    lastSearchTerm = term;
    trackSearch(term, count);
  }

  /* ---------- events ---------- */

  function onFilterChange(key) {
    visibleRows = ROWS_PER_PAGE;
    state[key] = els.selects[key].value;
    var count = render();
    writeStateToUrl(state);
    fireFilterEvent(count);
  }

  function onSearchInput() {
    visibleRows = ROWS_PER_PAGE;
    state.q = els.search.value.trim();
    var count = render();
    writeStateToUrl(state);
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () { fireSearchEvent(count); }, cfg.SEARCH_DEBOUNCE_MS);
  }

  function onCategoryClick(name) {
    // Category shortcut = topic filter only; other filters and search are reset.
    visibleRows = ROWS_PER_PAGE;
    state = emptyFilters();
    state.topic = name;
    syncControls();
    var count = render();
    writeStateToUrl(state);
    lastFilterKey = filterKey(); // avoid a duplicate filter_apply for the same action
    lastSearchTerm = null;
    trackCategoryClick(name);
    document.getElementById("library").scrollIntoView({ behavior: "smooth" });
    return count;
  }

  function init() {
    renderCategories();
    fillSelect(els.selects.topic, cfg.TOPICS.map(function (t) { return t.name; }));
    fillSelect(els.selects.type, cfg.TYPES, cfg.TYPE_LABELS);
    fillSelect(els.selects.level, cfg.LEVELS);
    fillSelect(els.selects.access, cfg.ACCESS);
    syncControls();

    FILTER_KEYS.forEach(function (k) {
      els.selects[k].addEventListener("change", function () { onFilterChange(k); });
    });
    els.search.addEventListener("input", onSearchInput);
    els.more.addEventListener("click", function () {
      visibleRows += ROWS_PER_PAGE;
      render();
    });
    window.addEventListener("resize", function () { if (resources.length) render(); });
    function submitSearch() {
      visibleRows = ROWS_PER_PAGE;
      state.q = els.search.value.trim();
      var count = render();
      writeStateToUrl(state);
      fireSearchEvent(count);
      document.getElementById("library").scrollIntoView({ behavior: "smooth" });
    }
    els.searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      submitSearch();
    });

    fetch("data/resources.json")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        resources = data.slice().sort(function (a, b) { return a.position - b.position; });
        render();
        lastFilterKey = filterKey(); // initial/URL state is not a user action
        lastSearchTerm = state.q.toLowerCase() || null;
      })
      .catch(function () {
        els.empty.textContent = "Could not load resources.";
        els.empty.style.display = "block";
      });
  }

  init();
})();
