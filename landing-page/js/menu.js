/* Mobile menu: the nav links are hidden on small screens, so a toggle opens them as a drop-down. */
(function () {
  var header = document.querySelector("header");
  var toggle = header && header.querySelector(".menu-toggle");
  var nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  function setOpen(open) {
    header.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Menu");
  }

  toggle.addEventListener("click", function () {
    setOpen(!header.classList.contains("menu-open"));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });
  document.addEventListener("click", function (e) {
    if (!header.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 650) setOpen(false);
  });
})();
