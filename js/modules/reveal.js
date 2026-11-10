/* ==========================================================================
   MÓDULO: reveal
   Añade .is-visible a los elementos .reveal cuando entran en pantalla.
   Para animar algo nuevo basta con ponerle class="reveal" (y data-delay).
   ========================================================================== */

window.ELN = window.ELN || {};

window.ELN.reveal = (function () {
  "use strict";

  function init() {
    var items = document.querySelectorAll(".reveal");

    // Sin soporte: mostramos todo directamente
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target); // solo se anima una vez
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach(function (el) { io.observe(el); });
  }

  return { init: init };
})();
