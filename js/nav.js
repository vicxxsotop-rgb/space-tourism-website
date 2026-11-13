/* Mobile navigation panel.
   The panel's open state lives entirely in the button's `aria-expanded`
   attribute; the stylesheet reads that attribute to slide the panel in, so the
   visual state and the ARIA state can never disagree. */
(function () {
  "use strict";

  const toggle = document.querySelector(".header__toggle");
  const nav = document.querySelector(".header__nav");

  if (!toggle || !nav) {
    return;
  }

  const desktopQuery = window.matchMedia("(min-width: 48em)");

  function isOpen() {
    return toggle.getAttribute("aria-expanded") === "true";
  }

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    document.documentElement.classList.toggle("has-nav-open", open);
  }

  function close(returnFocus) {
    if (!isOpen()) {
      return;
    }
    setOpen(false);
    if (returnFocus) {
      toggle.focus();
    }
  }

  toggle.addEventListener("click", function () {
    setOpen(!isOpen());
  });

  /* Escape closes the panel and hands focus back to the button that opened it. */
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) {
      close(true);
    }
  });

  /* Clicking anywhere outside the panel dismisses it. */
  document.addEventListener("click", function (event) {
    if (!isOpen()) {
      return;
    }
    if (nav.contains(event.target) || toggle.contains(event.target)) {
      return;
    }
    close(false);
  });

  /* Resizing into the desktop layout must not leave a stale open state behind. */
  desktopQuery.addEventListener("change", function (event) {
    if (event.matches) {
      close(false);
    }
  });
})();
