/* ==========================================================================
   MÓDULO: content
   Pinta en el HTML el contenido definido en js/config.js:
   - enlaces al portfolio ([data-portfolio-link])
   - cinta de términos ([data-ticker])
   - tarjetas de servicios ([data-services])
   - año del footer ([data-year])
   ========================================================================== */

window.ELN = window.ELN || {};

window.ELN.content = (function () {
  "use strict";

  /** Apunta todos los CTA al portfolio.
      Si el enlace es interno (p. ej. "proyectos.html"), se abre en la misma pestaña. */
  function bindPortfolioLinks(url) {
    var external = /^https?:\/\//.test(url);
    document.querySelectorAll("[data-portfolio-link]").forEach(function (a) {
      a.setAttribute("href", url);
      if (!external) { a.removeAttribute("target"); a.removeAttribute("rel"); }
    });
  }

  /** Genera la cinta. Se duplica la lista para que el bucle sea continuo */
  function renderTicker(terms) {
    var track = document.querySelector("[data-ticker]");
    if (!track || !terms.length) return;
    var items = terms.concat(terms).map(function (t) {
      return '<span class="ticker__item">' + t + "</span>";
    });
    track.innerHTML = items.join("");
  }

  /** Genera las tarjetas de servicios */
  function renderServices(services) {
    var grid = document.querySelector("[data-services]");
    if (!grid) return;
    grid.innerHTML = services
      .map(function (s, i) {
        return (
          '<article class="service card reveal" data-delay="' + ((i % 2) + 1) + '">' +
            '<div class="service__top">' +
              '<span class="service__tag mono">' + String(i + 1).padStart(2, "0") + " · " + s.tag + "</span>" +
              s.icon +
            "</div>" +
            "<h3>" + s.title + "</h3>" +
            "<p>" + s.text + "</p>" +
          "</article>"
        );
      })
      .join("");
  }

  /** Enlaces del pie: páginas del sitio + redes (en otra pestaña) */
  function renderFooterLinks(pages, social) {
    var el = document.querySelector("[data-footer-links]");
    if (!el) return;
    var p = pages.map(function (l) { return '<a href="' + l.href + '">' + l.label + "</a>"; });
    var s = social.map(function (l) {
      return '<a href="' + l.url + '" target="_blank" rel="noopener">' + l.label + " ↗</a>";
    });
    el.innerHTML = p.concat(s).join("");
  }

  function renderYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  function init(config) {
    bindPortfolioLinks(config.portfolioUrl);
    renderTicker(config.ticker || []);
    renderServices(config.services || []);
    renderFooterLinks(config.pages || [], config.social || []);
    renderYear();
  }

  return { init: init };
})();
