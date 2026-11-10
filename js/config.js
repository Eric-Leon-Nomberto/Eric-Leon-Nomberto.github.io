/* ==========================================================================
   CONFIGURACIÓN EDITABLE
   Todo el contenido que cambia con frecuencia vive aquí.
   Para añadir un servicio o un término del ticker, edita estos arrays:
   no hace falta tocar el HTML.
   ========================================================================== */

window.ELN = window.ELN || {};

window.ELN.config = {
  /* Enlace principal: todos los botones "Ver mis proyectos" apuntan aquí.
     Antes: https://sites.google.com/view/miportfolio-ericleon/inicio */
  portfolioUrl: "proyectos.html",

  /* Páginas del sitio: menú de las páginas interiores y pie de todas las páginas */
  pages: [
    { id: "proyectos", label: "Proyectos", href: "proyectos.html" },
    { id: "sobre-mi", label: "Sobre mí", href: "sobre-mi.html" },
    { id: "contacto", label: "Contacto", href: "contacto.html" },
  ],

  /* Contacto y redes: se usan en el pie y en la página de contacto */
  email: "ericleonnomberto@gmail.com",
  social: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/eric-leon-nomberto-3a954631a" },
    { label: "GitHub", url: "https://github.com/Eric-Leon-Nomberto" },
  ],

  /* Términos de la cinta en movimiento (vocabulario del sector) */
  ticker: [
    "Riesgo crediticio",
    "Morosidad",
    "Scoring de clientes",
    "Detección de fraude",
    "Rentabilidad por cliente",
    "Fuga de clientes",
    "Previsión de liquidez",
    "KPIs financieros",
    "Segmentación de cartera",
  ],

  /* Servicios: cada objeto genera una tarjeta.
     icon: SVG en línea (viewBox 0 0 56 40). Clases útiles: .fill, .muted */
  services: [
    {
      tag: "Riesgo",
      title: "Riesgo crediticio y morosidad",
      text: "Identifico qué perfiles y qué productos concentran el impago antes de que aparezca en el balance.",
      icon: '<svg class="service__icon" viewBox="0 0 56 40" aria-hidden="true"><polyline class="muted" points="2,30 14,26 26,28 38,18 54,8"/><polyline points="2,34 14,32 26,22 38,24 54,12"/><circle class="fill" cx="54" cy="12" r="3"/></svg>',
    },
    {
      tag: "Fraude",
      title: "Detección de anomalías y fraude",
      text: "Señalo las transacciones que no encajan con el patrón, con reglas que un equipo de operaciones entiende.",
      icon: '<svg class="service__icon" viewBox="0 0 56 40" aria-hidden="true"><circle class="fill" cx="8" cy="28" r="2"/><circle class="fill" cx="16" cy="24" r="2"/><circle class="fill" cx="22" cy="30" r="2"/><circle class="fill" cx="30" cy="26" r="2"/><circle class="fill" cx="38" cy="29" r="2"/><circle class="fill" cx="46" cy="25" r="2"/><circle cx="34" cy="9" r="5"/><line x1="34" y1="14" x2="34" y2="20" class="muted"/></svg>',
    },
    {
      tag: "Clientes",
      title: "Segmentación y rentabilidad",
      text: "Agrupo la cartera por valor real: quién aporta margen, quién está en riesgo de irse y a quién conviene retener.",
      icon: '<svg class="service__icon" viewBox="0 0 56 40" aria-hidden="true"><rect x="4" y="22" width="9" height="14" rx="2" class="muted"/><rect x="18" y="14" width="9" height="22" rx="2" class="muted"/><rect x="32" y="6" width="9" height="30" rx="2"/><rect x="46" y="18" width="6" height="18" rx="2" class="muted"/></svg>',
    },
    {
      tag: "Reporting",
      title: "Dashboards y KPIs financieros",
      text: "Cuadros de mando con pocas métricas y bien elegidas, pensados para leerse en un minuto y decidir en cinco.",
      icon: '<svg class="service__icon" viewBox="0 0 56 40" aria-hidden="true"><rect x="2" y="4" width="52" height="32" rx="4" class="muted"/><polyline points="8,28 18,20 26,24 36,14 48,18"/><line x1="8" y1="10" x2="20" y2="10"/></svg>',
    },
  ],
};
