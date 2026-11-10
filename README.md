# Eric Leon Nomberto · Portfolio

**Datos claros, mejores decisiones.**

Web personal de Eric Leon Nomberto, analista de datos especializado en banca y finanzas.
Incluye una landing de presentación, los proyectos con sus dashboards de Tableau, una página "Sobre mí" y una de contacto.

🔗 **Web:** https://eric-leon-nomberto.github.io

## Proyectos

| Proyecto | Técnicas | Herramientas |
|---|---|---|
| Predicción de abandono de clientes (churn) | Clasificación supervisada, SQL analítico | Python, MySQL, Tableau |
| Segmentación de clientes | RFM, cohortes, LTV vs. CaC | Python (pandas), Tableau |
| Fraude en tarjetas de crédito *(en curso)* | — | — |

## Estructura

```
index.html          Landing
proyectos.html      Listado de proyectos
proyecto.html       Ficha de proyecto (proyecto.html?id=churn)
sobre-mi.html       Sobre mí
contacto.html       Contacto

css/
  tokens.css        Colores, tipografías, espacios (variables de diseño)
  base.css          Reset y estilos globales
  components.css    Botones, tarjetas, marca
  sections.css      Secciones de la landing
  animations.css    Animaciones de la landing
  pages.css         Páginas interiores (sin animaciones)

js/
  config.js         Enlaces, redes, textos de la landing  ← editar aquí
  data/projects.js  Contenido de los proyectos           ← editar aquí
  main.js           Arranque de la landing
  pages.js          Arranque de las páginas interiores
  modules/          Un archivo por comportamiento
```

## Añadir un proyecto

1. Abre `js/data/projects.js`.
2. Copia un bloque de proyecto completo y cambia el `id` (sin espacios ni tildes).
3. Rellena los campos. La explicación de cada uno está al principio del archivo.
4. Guarda y sube los cambios: la tarjeta y la ficha se generan solas.

## Ver en local

```bash
python3 -m http.server 5517
```

Y abre http://localhost:5517

Hecho solo con HTML, CSS y JavaScript, sin dependencias.
