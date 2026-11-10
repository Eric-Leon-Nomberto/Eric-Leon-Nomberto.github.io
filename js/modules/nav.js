/* ==========================================================================
   MÓDULO: nav
   - Fondo con desenfoque al hacer scroll
   - Se oculta al bajar y reaparece al subir (deja espacio al contenido)
   ========================================================================== */

window.ELN = window.ELN || {};

window.ELN.nav = (function () {
  "use strict";

  function init() {
    var nav = document.querySelector("[data-nav]");
    if (!nav) return;

    var lastY = window.scrollY;
    var ticking = false;

    function update() {
      var y = window.scrollY;
      nav.classList.toggle("is-scrolled", y > 24);
      // Ocultar solo tras pasar el hero y si se baja con intención
      var goingDown = y > lastY + 4;
      var goingUp = y < lastY - 4;
      if (goingDown && y > window.innerHeight * 0.6) nav.classList.add("is-hidden");
      if (goingUp || y < 100) nav.classList.remove("is-hidden");
      lastY = y;
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });

    // Si se navega con teclado, la barra debe estar visible
    nav.addEventListener("focusin", function () { nav.classList.remove("is-hidden"); });

    update();
  }

  return { init: init };
})();
