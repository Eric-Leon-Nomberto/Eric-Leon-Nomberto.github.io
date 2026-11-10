/* ==========================================================================
   MÓDULO: effects
   Microinteracciones ligadas al scroll y al cursor:
   - Línea de progreso del proceso (--progress en .steps)
   - Desplazamiento del nombre gigante (--shift en .signature__line)
   - Luz que sigue al cursor en las tarjetas de servicio (--mx / --my)
   ========================================================================== */

window.ELN = window.ELN || {};

window.ELN.effects = (function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Progreso 0→1 de un elemento mientras cruza la pantalla */
  function progressOf(el, startAt, endAt) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * startAt - r.top) / (r.height + vh * (startAt - endAt));
    return Math.max(0, Math.min(1, p));
  }

  function initScroll() {
    var steps = document.querySelector("[data-steps]");
    var signature = document.querySelector("[data-signature]");
    var lines = signature ? signature.querySelectorAll(".signature__line") : [];
    var ticking = false;

    function update() {
      if (steps) steps.style.setProperty("--progress", progressOf(steps, 0.75, 0.35).toFixed(3));

      if (signature && !reduceMotion) {
        // Cada línea se mueve en sentido distinto: el nombre "respira" al pasar
        var p = progressOf(signature, 1, 0) - 0.5;
        var amp = Math.min(window.innerWidth * 0.08, 120);
        lines.forEach(function (line, i) {
          var dir = i % 2 === 0 ? 1 : -1;
          line.style.setProperty("--shift", (p * amp * dir).toFixed(1));
        });
      }
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  function initSpotlight() {
    // Delegación: funciona también con tarjetas generadas desde config.js
    document.addEventListener("pointermove", function (e) {
      var card = e.target.closest && e.target.closest(".service");
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  }

  function init() {
    initScroll();
    initSpotlight();
  }

  return { init: init };
})();
