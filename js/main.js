/* ==========================================================================
   PUNTO DE ENTRADA
   Inicializa los módulos en orden. Para añadir uno nuevo:
     1. crea js/modules/mi-modulo.js con window.ELN.miModulo = { init }
     2. enlázalo en index.html antes de main.js
     3. añádelo a la lista de abajo
   ========================================================================== */

(function () {
  "use strict";

  // Marca que JS está activo (el CSS solo oculta .reveal si existe esta clase)
  document.documentElement.classList.add("js");

  var ELN = window.ELN || {};

  function start() {
    ELN.content.init(ELN.config); // primero: genera HTML que otros módulos usan
    ELN.reveal.init();
    ELN.nav.init();
    ELN.effects.init();
    ELN.heroChart.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
