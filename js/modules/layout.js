/* ==========================================================================
   MÓDULO: layout (solo páginas interiores)
   Inserta la cabecera y el pie comunes en [data-site-header] y [data-site-footer].
   Los enlaces salen de js/config.js (pages y social): se editan en un único sitio.
   La página activa se marca con <body data-page="proyectos|sobre-mi|contacto">.
   ========================================================================== */

window.ELN = window.ELN || {};

window.ELN.layout = (function () {
  "use strict";

  var BRAND_SVG =
    '<svg viewBox="0 0 32 32"><path d="M5 24 L13 16 L19 20 L27 8" /><circle cx="27" cy="8" r="2.6" /></svg>';

  function header(pages, active) {
    var links = pages.map(function (l) {
      var current = l.id === active ? ' aria-current="page"' : "";
      return '<a href="' + l.href + '"' + current + ">" + l.label + "</a>";
    }).join("");

    return (
      '<div class="container site-header__inner">' +
        '<a class="brand" href="index.html" aria-label="Eric Leon Nomberto, inicio">' +
          '<span class="brand__mark" aria-hidden="true">' + BRAND_SVG + "</span>" +
          '<span class="brand__name">Eric Leon Nomberto</span>' +
        "</a>" +
        '<nav class="site-header__links" aria-label="Principal">' + links + "</nav>" +
      "</div>"
    );
  }

  /* Enlaces del pie: páginas + redes (las redes se abren en otra pestaña).
     Se exporta porque la landing también la usa (js/modules/content.js). */
  function footerLinks(pages, social) {
    var p = pages.map(function (l) { return '<a href="' + l.href + '">' + l.label + "</a>"; });
    var s = social.map(function (l) {
      return '<a href="' + l.url + '" target="_blank" rel="noopener">' + l.label + " ↗</a>";
    });
    return p.concat(s).join("");
  }

  function footer(pages, social) {
    return (
      '<div class="container footer__inner">' +
        '<span class="footer__name">Eric Leon Nomberto</span>' +
        '<nav class="footer__links" aria-label="Pie">' + footerLinks(pages, social) + "</nav>" +
        '<span class="footer__year mono">© ' + new Date().getFullYear() + "</span>" +
      "</div>"
    );
  }

  function init(config) {
    var pages = config.pages || [];
    var social = config.social || [];
    var active = document.body.getAttribute("data-page");
    var h = document.querySelector("[data-site-header]");
    var f = document.querySelector("[data-site-footer]");
    if (h) h.innerHTML = header(pages, active);
    if (f) f.innerHTML = footer(pages, social);
  }

  return { init: init, footerLinks: footerLinks };
})();
