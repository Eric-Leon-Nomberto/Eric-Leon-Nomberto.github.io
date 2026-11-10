/* ==========================================================================
   MÓDULO: hero-chart
   El gancho visual del hero: una nube de puntos desordenada ("ruido")
   que se ordena hasta formar una tendencia limpia ("decisión").
   Es el slogan "Datos claros, mejores decisiones" en movimiento.

   Fases (ms):
     0     → NOISE_END    : los puntos vibran dispersos (naranja)
     NOISE_END → ALIGN_END: convergen a la curva y cambian a verde
     ALIGN_END → LINE_END : se dibuja la línea y el área
     final                : marcador + etiqueta
   ========================================================================== */

window.ELN = window.ELN || {};

window.ELN.heroChart = (function () {
  "use strict";

  var NOISE_END = 1400;
  var ALIGN_END = 3200;
  var LINE_END  = 4400;
  var POINTS    = 46;

  var COLORS = {
    noise:  [240, 168, 90],
    signal: [70, 227, 160],
    grid:   "rgba(255,255,255,0.06)",
    label:  "rgba(168,179,199,0.7)",
  };

  var canvas, ctx, stateEl, points, start, raf, w, h, dpr;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- utilidades ---------- */
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function mix(a, b, t) {
    return "rgb(" + Math.round(a[0] + (b[0] - a[0]) * t) + "," +
                    Math.round(a[1] + (b[1] - a[1]) * t) + "," +
                    Math.round(a[2] + (b[2] - a[2]) * t) + ")";
  }

  /* Área de dibujo con márgenes */
  function plot() {
    var pad = { l: w * 0.06, r: w * 0.1, t: h * 0.12, b: h * 0.12 };
    return { x: pad.l, y: pad.t, w: w - pad.l - pad.r, h: h - pad.t - pad.b };
  }

  /* Curva objetivo normalizada (0 = arriba, 1 = abajo): tendencia ascendente con un bache */
  function target(x) {
    return 0.82 - 0.62 * x + 0.07 * Math.sin(x * 8.5) - 0.05 * Math.sin(x * 3);
  }

  /* Crea los puntos con un desplazamiento aleatorio (el "ruido") */
  function createPoints() {
    points = [];
    for (var i = 0; i < POINTS; i++) {
      var x = i / (POINTS - 1);
      points.push({
        x: x,
        y: target(x),
        nx: (Math.random() - 0.5) * 0.18,
        ny: (Math.random() - 0.5) * 0.9,
        phase: Math.random() * Math.PI * 2,
        delay: x * 0.35, // la convergencia avanza de izquierda a derecha
      });
    }
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ---------- dibujo ---------- */
  function drawGrid(p) {
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.fillStyle = COLORS.label;
    for (var i = 0; i <= 4; i++) {
      var y = p.y + (p.h * i) / 4;
      ctx.beginPath();
      ctx.moveTo(p.x, y);
      ctx.lineTo(p.x + p.w, y);
      ctx.stroke();
    }
  }

  function positionOf(pt, align, elapsed, p) {
    // Mientras hay ruido, los puntos vibran ligeramente
    var wobble = (1 - align) * 0.02 * Math.sin(elapsed / 220 + pt.phase);
    var x = pt.x + pt.nx * (1 - align);
    var y = pt.y + (pt.ny + wobble) * (1 - align);
    return { x: p.x + clamp(x, -0.02, 1.02) * p.w, y: p.y + clamp(y, -0.1, 1.1) * p.h };
  }

  function draw(elapsed) {
    if (!points) return; // aún no se ha llamado a play()
    var p = plot();
    ctx.clearRect(0, 0, w, h);
    drawGrid(p);

    var alignT = clamp((elapsed - NOISE_END) / (ALIGN_END - NOISE_END), 0, 1);
    var lineT  = easeInOut(clamp((elapsed - ALIGN_END) / (LINE_END - ALIGN_END), 0, 1));

    // Posiciones actuales de cada punto
    var pos = points.map(function (pt) {
      var local = easeInOut(clamp((alignT - pt.delay) / (1 - 0.35), 0, 1));
      var xy = positionOf(pt, local, elapsed, p);
      xy.a = local;
      return xy;
    });

    // Área bajo la línea + línea (se revelan de izquierda a derecha)
    if (lineT > 0) {
      var lastIdx = Math.max(1, Math.floor(lineT * (pos.length - 1)));
      var grad = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
      grad.addColorStop(0, "rgba(70,227,160,0.22)");
      grad.addColorStop(1, "rgba(70,227,160,0)");

      ctx.beginPath();
      ctx.moveTo(pos[0].x, p.y + p.h);
      for (var i = 0; i <= lastIdx; i++) ctx.lineTo(pos[i].x, pos[i].y);
      ctx.lineTo(pos[lastIdx].x, p.y + p.h);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      for (var j = 0; j <= lastIdx; j++) {
        if (j === 0) ctx.moveTo(pos[j].x, pos[j].y);
        else ctx.lineTo(pos[j].x, pos[j].y);
      }
      ctx.strokeStyle = "rgb(70,227,160)";
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();
    }

    // Puntos
    pos.forEach(function (xy) {
      ctx.beginPath();
      ctx.fillStyle = mix(COLORS.noise, COLORS.signal, xy.a);
      ctx.globalAlpha = 1 - lineT * 0.55;
      ctx.arc(xy.x, xy.y, 2.6 + (1 - xy.a) * 0.8, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Marcador final + etiqueta
    if (lineT >= 1) {
      var end = pos[pos.length - 1];
      var pulse = (Math.sin(elapsed / 380) + 1) / 2;
      ctx.beginPath();
      ctx.fillStyle = "rgba(70,227,160," + (0.15 + pulse * 0.15) + ")";
      ctx.arc(end.x, end.y, 10 + pulse * 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "rgb(70,227,160)";
      ctx.arc(end.x, end.y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "600 12px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#EEF2F8";
      ctx.textAlign = "right";
      ctx.fillText("decisión", end.x - 14, end.y - 14);
      ctx.textAlign = "left";
    }

    updateState(elapsed);
  }

  /* Texto de estado de la cabecera del panel */
  var lastState = "";
  function updateState(elapsed) {
    if (!stateEl) return;
    var s = elapsed < NOISE_END ? "procesando…" : elapsed < LINE_END ? "limpiando…" : "claro ✓";
    if (s === lastState) return;
    lastState = s;
    stateEl.textContent = s;
    stateEl.classList.toggle("is-done", elapsed >= LINE_END);
  }

  /* ---------- bucle ---------- */
  function loop(now) {
    if (!start) start = now;
    draw(now - start);
    raf = requestAnimationFrame(loop);
  }

  function play() {
    cancelAnimationFrame(raf);
    createPoints();
    lastState = "";
    if (reduceMotion) { draw(LINE_END); return; }
    start = 0;
    raf = requestAnimationFrame(loop);
  }

  function init() {
    canvas = document.querySelector("[data-hero-chart]");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    stateEl = document.querySelector("[data-chart-state]");

    resize();
    window.addEventListener("resize", function () {
      resize();
      if (reduceMotion) draw(LINE_END);
    });

    var replay = document.querySelector("[data-chart-replay]");
    if (replay) replay.addEventListener("click", play);

    // Pausa el bucle cuando el panel no está a la vista (ahorra batería)
    if ("IntersectionObserver" in window && !reduceMotion) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !raf) raf = requestAnimationFrame(loop);
          if (!e.isIntersecting) { cancelAnimationFrame(raf); raf = null; }
        });
      }).observe(canvas);
    }

    // Pequeña espera para que el usuario vea el ruido antes de que se ordene
    setTimeout(play, 350);
  }

  return { init: init, replay: play };
})();
