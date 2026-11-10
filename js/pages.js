/* ==========================================================================
   PUNTO DE ENTRADA · PÁGINAS INTERIORES
   (proyectos, proyecto, sobre-mi, contacto)
   La landing (index.html) usa js/main.js y no comparte este archivo.
   ========================================================================== */

(function () {
  "use strict";

  var ELN = window.ELN || {};

  /* Botón "copiar email" de la página de contacto */
  function initCopy() {
    document.querySelectorAll("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy");
        var label = btn.querySelector("[data-copy-label]") || btn;
        var original = label.textContent;
        var done = function () {
          label.textContent = "¡Copiado!";
          setTimeout(function () { label.textContent = original; }, 1800);
        };
        if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
      });
    });
  }

  /* Botones de redes en la página de contacto ([data-social-links]) */
  function renderSocial(social) {
    var el = document.querySelector("[data-social-links]");
    if (!el) return;
    el.innerHTML = social.map(function (s) {
      return '<a class="btn btn--ghost btn--lg" href="' + s.url + '" target="_blank" rel="noopener">' +
        s.label + ' <span aria-hidden="true">↗</span></a>';
    }).join("");
  }

  function start() {
    var config = ELN.config || {};
    if (ELN.layout) ELN.layout.init(config);
    renderSocial(config.social || []);
    if (ELN.projectsView) ELN.projectsView.init(ELN.projects);
    initCopy();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
