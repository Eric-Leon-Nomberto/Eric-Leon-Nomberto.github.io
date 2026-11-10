/* ==========================================================================
   MÓDULO: projects
   Pinta los proyectos a partir de js/data/projects.js
   - renderList()   → listado en proyectos.html   ([data-project-list])
   - renderDetail() → ficha en proyecto.html?id=… ([data-project-detail])
   No hay que tocar este archivo para añadir proyectos: solo los datos.
   ========================================================================== */

window.ELN = window.ELN || {};

window.ELN.projectsView = (function () {
  "use strict";

  /* Escapa texto para insertarlo como HTML de forma segura */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function tags(list, cls) {
    if (!list || !list.length) return "";
    return '<ul class="' + (cls || "tags") + '">' +
      list.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>";
  }

  /* ---------------------------- LISTADO ---------------------------- */
  function card(p, i) {
    var num = String(i + 1).padStart(2, "0");
    var done = p.status !== "en-curso";
    var status = done
      ? '<span class="status status--done">Terminado</span>'
      : '<span class="status status--wip">En curso</span>';

    var inner =
      '<div class="pcard__top">' +
        '<span class="pcard__num mono">' + num + "</span>" +
        '<span class="pcard__cat mono">' + esc(p.category) + "</span>" +
        status +
      "</div>" +
      '<h2 class="pcard__title">' + esc(p.title) + "</h2>" +
      '<p class="pcard__summary">' + esc(p.summary) + "</p>" +
      '<div class="pcard__bottom">' +
        tags(p.tools, "tags tags--small") +
        (done ? '<span class="pcard__go">Ver proyecto <span aria-hidden="true">→</span></span>' : "") +
      "</div>";

    return done
      ? '<a class="pcard" href="proyecto.html?id=' + encodeURIComponent(p.id) + '">' + inner + "</a>"
      : '<div class="pcard pcard--wip" aria-disabled="true">' + inner + "</div>";
  }

  function renderList(projects) {
    var el = document.querySelector("[data-project-list]");
    if (!el) return;
    el.innerHTML = projects.map(card).join("");
  }

  /* ---------------------------- DETALLE ---------------------------- */
  function section(s, i) {
    var html = '<section class="block" id="s' + (i + 1) + '">';
    html += '<h2 class="block__title"><span class="mono">' + String(i + 1).padStart(2, "0") + "</span>" + esc(s.title) + "</h2>";
    if (s.text) html += "<p>" + esc(s.text) + "</p>";
    if (s.bullets) html += '<ul class="bullets">' + s.bullets.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>";
    if (s.formula) html += '<p class="formula mono">' + esc(s.formula) + "</p>";
    if (s.code) html += '<pre class="code"><code>' + esc(s.code) + "</code></pre>";
    if (s.tags) html += tags(s.tags);
    return html + "</section>";
  }

  /* Si la imagen no existe todavía, se muestra un hueco con la ruta esperada */
  function figure(f) {
    return (
      '<figure class="figure">' +
        '<img src="' + esc(f.src) + '" alt="' + esc(f.caption) + '" ' +
          'onerror="this.parentNode.classList.add(\'figure--empty\');this.remove();" />' +
        '<div class="figure__placeholder mono">Imagen pendiente<br /><small>' + esc(f.src) + "</small></div>" +
        "<figcaption>" + esc(f.caption) + "</figcaption>" +
      "</figure>"
    );
  }

  /* Dashboard de Tableau Public incrustado + enlace para abrirlo a pantalla completa */
  function dashboard(d) {
    var src = d.embed + "?:showVizHome=no&:embed=true&:tabs=no&:toolbar=yes&:language=es-ES";
    return (
      (d.text ? "<p>" + esc(d.text) + "</p>" : "") +
      '<div class="viz">' +
        '<iframe class="viz__frame" src="' + esc(src) + '" title="' + esc(d.title) + '" loading="lazy" allowfullscreen></iframe>' +
      "</div>" +
      '<a class="viz__open" href="' + esc(d.url) + '" target="_blank" rel="noopener">Abrir en Tableau Public ↗</a>'
    );
  }

  /* Bloque numerado genérico (título con número + contenido HTML) */
  function block(id, n, title, inner) {
    return (
      '<section class="block" id="' + id + '">' +
        '<h2 class="block__title"><span class="mono">' + String(n).padStart(2, "0") + "</span>" + esc(title) + "</h2>" +
        inner +
      "</section>"
    );
  }

  function renderDetail(projects) {
    var el = document.querySelector("[data-project-detail]");
    if (!el) return;

    var id = new URLSearchParams(window.location.search).get("id");
    var done = projects.filter(function (p) { return p.status !== "en-curso"; });
    var p = done.filter(function (x) { return x.id === id; })[0];

    if (!p) {
      el.innerHTML =
        '<div class="container narrow empty">' +
          "<h1>Proyecto no encontrado</h1>" +
          '<p>Puede que el enlace haya cambiado. <a class="link" href="proyectos.html">Ver todos los proyectos</a></p>' +
        "</div>";
      return;
    }

    document.title = p.title + " · Eric Leon Nomberto";

    var idx = done.indexOf(p);
    var next = done[(idx + 1) % done.length];

    var kpis = (p.kpis || []).map(function (k) {
      return '<div class="kpi"><span class="kpi__value mono">' + esc(k.value) + '</span><span class="kpi__label">' + esc(k.label) + "</span></div>";
    }).join("");

    var meta = (p.meta || []).map(function (m) {
      return "<div><dt>" + esc(m.label) + "</dt><dd>" + esc(m.value) + "</dd></div>";
    }).join("") + '<div><dt>Herramientas</dt><dd>' + esc((p.tools || []).join(" · ")) + "</dd></div>";

    /* Bloques finales: solo se muestran si el proyecto tiene esos datos */
    var n = (p.sections || []).length;
    var extra = [];
    if (p.dashboard) extra.push({ id: "dashboard", title: "Dashboard", html: dashboard(p.dashboard) });
    if (p.figures && p.figures.length) extra.push({ id: "resultados", title: "Resultados", html: '<div class="figures">' + p.figures.map(figure).join("") + "</div>" });
    if (p.recommendations && p.recommendations.length) {
      extra.push({
        id: "recomendaciones",
        title: "Recomendaciones",
        html: '<ol class="recs">' + p.recommendations.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ol>",
      });
    }
    var extraHtml = extra.map(function (b, i) { return block(b.id, n + i + 1, b.title, b.html); }).join("");

    var toc = (p.sections || []).map(function (s, i) {
      return '<li><a href="#s' + (i + 1) + '">' + esc(s.title) + "</a></li>";
    }).concat(extra.map(function (b) {
      return '<li><a href="#' + b.id + '">' + b.title + "</a></li>";
    })).join("") + '<li><a href="#conclusion">Conclusión</a></li>';

    var links = (p.links || []).map(function (l) {
      return '<a class="link" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + " ↗</a>";
    }).join("");

    el.innerHTML =
      '<header class="container project-head">' +
        '<a class="back mono" href="proyectos.html">← Proyectos</a>' +
        '<p class="eyebrow">' + esc(p.category) + "</p>" +
        '<h1 class="page-title">' + esc(p.title) + "</h1>" +
        '<p class="page-lead">' + esc(p.question) + "</p>" +
        '<div class="kpis">' + kpis + "</div>" +
      "</header>" +

      '<div class="container project-body">' +
        '<aside class="project-aside">' +
          '<dl class="meta">' + meta + "</dl>" +
          '<nav class="toc" aria-label="Contenido"><p class="toc__title mono">Contenido</p><ol>' + toc + "</ol></nav>" +
          (links ? '<div class="aside-links">' + links + "</div>" : "") +
        "</aside>" +

        '<article class="project-article">' +
          (p.sections || []).map(section).join("") +
          extraHtml +
          '<section class="conclusion" id="conclusion">' +
            '<p class="eyebrow">Conclusión</p>' +
            "<p>" + esc(p.conclusion) + "</p>" +
          "</section>" +
        "</article>" +
      "</div>" +

      '<nav class="container project-nav" aria-label="Más proyectos">' +
        '<a class="project-nav__item" href="proyectos.html"><span class="mono">←</span> Todos los proyectos</a>' +
        (next && next !== p
          ? '<a class="project-nav__item project-nav__item--next" href="proyecto.html?id=' + encodeURIComponent(next.id) + '">' +
              '<span class="mono">Siguiente</span>' + esc(next.title) + " →</a>"
          : "") +
      "</nav>";
  }

  function init(projects) {
    renderList(projects || []);
    renderDetail(projects || []);

    // El contenido se genera después de cargar: si la URL trae #seccion, saltamos ahora
    if (window.location.hash) {
      var target = document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView();
    }
  }

  return { init: init };
})();
