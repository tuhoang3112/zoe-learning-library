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
    tools: document.getElementById("tools"),
    toolsStrip: document.getElementById("toolsStrip"),
    toolsShop: document.getElementById("toolsShop"),
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

  function hostOf(url) {
    try { return new URL(url).hostname; } catch (e) { return ""; }
  }

  var substackHost = hostOf(cfg.SUBSTACK_URL);

  function onResourceOpen(r, listPos) {
    trackResourceClick(r, listPos);
    // Resources hosted on Zoe's Substack also count as a Substack CTA.
    if (hostOf(r.url) === substackHost) trackSubstackCta("resource_card");
  }

  function externalLink(a, r, listPos) {
    a.href = withBmcUtm(withSubstackUtm(r.url, "resource_card", r.id), "resource_card", r.id);
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    // New tab => page is not unloaded, so the synchronous dataLayer push is never lost.
    a.addEventListener("click", function () { onResourceOpen(r, listPos); });
    a.addEventListener("auxclick", function () { onResourceOpen(r, listPos); });
  }

  /* "12 resources" under each topic (counts resources listed under it, including secondary topics). */
  function renderCategoryCounts(list) {
    cfg.TOPICS.forEach(function (t) {
      var n = list.filter(function (r) { return resourceTopics(r).indexOf(t.name) !== -1; }).length;
      if (categoryLinks[t.name]) categoryLinks[t.name].textContent = "Browse " + n + (n === 1 ? " resource" : " resources") + " ↓";
    });
  }

  /* ---------- tools made by Zoe ---------- */

  /* Banner = Zoe's own paid products marked "featured": true in resources.json.
     They are shown here AND stay in the library list below (filter Type = Tools & Templates). */
  function isTool(r) {
    return r.featured === true && r.provider === "Zoe" && r.access === "Paid" && r.type === "Tools & Templates";
  }

  /* Card name without the long subtitle: "Name | extra", "Name: extra", "Name (extra)". */
  function shortTitle(t) {
    return t.split(" | ")[0].replace(/:.*$/, "").replace(/\s*\(.*\)\s*$/, "").trim();
  }

  function toolCoverDefault(r) {
    var g = COVER_GRADIENTS[r.topic] || ["#E4E7EC", "#667085"];
    var d = h("div", "tool-cover tool-cover-default", r.topic);
    d.setAttribute("aria-hidden", "true");
    d.style.background = "linear-gradient(135deg," + g[0] + "," + g[1] + ")";
    return d;
  }

  function toolCover(r) {
    if (r.image) {
      var img = h("img", "tool-cover");
      img.src = r.image;
      img.alt = r.title;
      img.loading = "lazy";
      img.referrerPolicy = "no-referrer";
      img.addEventListener("error", function () {
        if (img.parentNode) img.parentNode.replaceChild(toolCoverDefault(r), img);
      });
      return img;
    }
    return toolCoverDefault(r);
  }

  function renderTools(list) {
    if (!list.length) return;
    list.slice().sort(function (a, b) {
      return (b.date_added || "").localeCompare(a.date_added || "") || b.position - a.position;
    }).forEach(function (r) {
      var a = h("a", "tool");
      a.href = withBmcUtm(r.url, "tools-banner", r.id);
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.appendChild(toolCover(r));
      var body = h("div", "tool-body");
      body.appendChild(h("div", "tool-name", shortTitle(r.title)));
      body.appendChild(h("span", "tool-link", "View product ↗"));
      a.appendChild(body);
      a.addEventListener("click", function () { trackToolClick(r); });
      a.addEventListener("auxclick", function () { trackToolClick(r); });
      els.toolsStrip.appendChild(a);
    });
    els.toolsShop.href = withBmcUtm(els.toolsShop.href, "tools-banner", "shop-button");
    els.toolsShop.addEventListener("click", trackToolsShopClick);
    els.toolsShop.addEventListener("auxclick", trackToolsShopClick);
    els.tools.hidden = false;
  }

  /* ---------- newsletter posts ---------- */

  function renderPosts(list) {
    var grid = document.getElementById("postsGrid");
    if (!grid || !list.length) return;
    list.forEach(function (p) {
      var a = h("a", "post");
      a.href = withSubstackUtm(p.url, "blog_card", p.id);
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("data-cta-location", "blog_card"); // counted by the Substack CTA click handler
      if (p.image) {
        var img = h("img", "post-cover");
        img.src = p.image;
        img.alt = p.title;
        img.loading = "lazy";
        img.referrerPolicy = "no-referrer";
        img.addEventListener("error", function () { img.remove(); });
        a.appendChild(img);
      }
      var body = h("div", "post-body");
      body.appendChild(h("div", "post-name", p.title));
      body.appendChild(h("p", "post-desc", p.description));
      body.appendChild(h("span", "post-link", "Read on Substack ↗"));
      a.appendChild(body);
      grid.appendChild(a);
    });
    document.getElementById("posts").hidden = false;
  }

  /* ---------- rendering ---------- */

  var categoryLinks = {}; // topic name -> the "N resources" label, filled in once the data is loaded

  function renderCategories() {
    cfg.TOPICS.forEach(function (t) {
      var a = h("a", "category");
      a.href = "?topic=" + encodeURIComponent(t.name) + "#library";
      a.appendChild(h("h3", null, t.name));
      a.appendChild(h("p", null, t.blurb));
      var label = h("span", "category-link", "Browse resources ↓");
      categoryLinks[t.name] = label;
      a.appendChild(label);
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

  /* Cover: r.image if set, otherwise a gradient banner keyed to the primary topic. */
  var COVER_GRADIENTS = {
    "Data Analytics": ["#BAD2FF", "#5D79A8"],
    "Data Engineering": ["#C7D7FE", "#3E4C8A"],
    "AI Agents & Automation": ["#D9C9FF", "#6B4FB3"],
    "Marketing & Growth": ["#FFD6C2", "#C4673F"],
    "Product & Vibe Coding": ["#BDEBDD", "#2F8A6E"],
    "Personal Finance & Investing": ["#CFE8C8", "#4C7F3F"]
  };

  function renderDefaultCover(r) {
    var g = COVER_GRADIENTS[r.topic] || ["#E4E7EC", "#667085"];
    var d = h("div", "cover cover-default", r.topic);
    d.setAttribute("aria-hidden", "true");
    d.style.background = "linear-gradient(135deg," + g[0] + "," + g[1] + ")";
    return d;
  }

  function renderCover(r) {
    if (r.image) {
      var img = h("img", "cover");
      img.src = r.image;
      img.alt = r.title;
      img.loading = "lazy";
      img.referrerPolicy = "no-referrer";
      // Hotlinked image may disappear or be blocked: fall back to the gradient banner.
      img.addEventListener("error", function () {
        if (img.parentNode) img.parentNode.replaceChild(renderDefaultCover(r), img);
      });
      return img;
    }
    return renderDefaultCover(r);
  }

  function renderCard(r, listPos) {
    var card = h("article", "item");
    card.dataset.listPosition = String(listPos);
    card.appendChild(renderCover(r));
    var top = h("div", "item-top");
    top.appendChild(h("span", "type", r.type.toUpperCase()));
    top.appendChild(h("span", "badge badge-" + r.access.toLowerCase(), r.access));
    card.appendChild(top);

    var title = h("h3");
    var link = h("a", null, r.title);
    externalLink(link, r, listPos);
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
    externalLink(open, r, listPos);
    open.setAttribute("aria-label", "Open resource: " + r.title + " (new tab)");
    bottom.appendChild(open);
    card.appendChild(bottom);
    return card;
  }

  /* resource_impression: fired once per resource + list position when a card is at least half visible. */
  var impressionSeen = {};
  var impressionObserver = null;

  function observeImpressions(shown, total) {
    if (impressionObserver) impressionObserver.disconnect();
    if (!("IntersectionObserver" in window)) return;
    impressionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || document.visibilityState === "hidden") return;
        var pos = Number(entry.target.dataset.listPosition);
        var r = shown[pos - 1];
        var key = r.id + "|" + pos;
        if (impressionSeen[key]) return;
        impressionSeen[key] = true;
        impressionObserver.unobserve(entry.target);
        trackResourceImpression(r, pos, total);
      });
    }, { threshold: 0.5 });
    els.grid.querySelectorAll(".item").forEach(function (card) { impressionObserver.observe(card); });
  }

  /* Rows shown per page: 3 rows on wider screens; on phones (one column) 6 cards so the list is not just 2 cards long. */
  function rowsPerPage() { return gridColumns() === 1 ? 6 : 3; }
  var visibleRows = rowsPerPage();

  function gridColumns() {
    return getComputedStyle(els.grid).gridTemplateColumns.split(" ").length || 1;
  }

  function render() {
    var results = applyFilters(resources, state);
    if (isDefaultView(state)) results = interleaveByType(results);
    var limit = visibleRows * gridColumns();
    var shown = results.slice(0, limit);
    els.grid.replaceChildren.apply(els.grid, shown.map(function (r, i) { return renderCard(r, i + 1); }));
    observeImpressions(shown, results.length);
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
    visibleRows = rowsPerPage();
    state[key] = els.selects[key].value;
    var count = render();
    writeStateToUrl(state);
    fireFilterEvent(count);
  }

  function onSearchInput() {
    visibleRows = rowsPerPage();
    state.q = els.search.value.trim();
    var count = render();
    writeStateToUrl(state);
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () { fireSearchEvent(count); }, cfg.SEARCH_DEBOUNCE_MS);
  }

  function onCategoryClick(name) {
    // Category shortcut = topic filter only; other filters and search are reset.
    visibleRows = rowsPerPage();
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
      visibleRows += rowsPerPage();
      render();
    });
    window.addEventListener("resize", function () { if (resources.length) render(); });
    function submitSearch() {
      visibleRows = rowsPerPage();
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

    fetch("data/posts.json")
      .then(function (res) { return res.json(); })
      .then(renderPosts)
      .catch(function () { /* the section simply stays hidden */ });

    fetch("data/resources.json")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var all = data.slice().sort(function (a, b) { return a.position - b.position; });
        renderCategoryCounts(all);
        renderTools(all.filter(isTool));
        resources = all;
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
