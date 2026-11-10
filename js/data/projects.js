/* ==========================================================================
   DATOS DE PROYECTOS
   Un objeto por proyecto. Para añadir uno nuevo, copia un bloque completo,
   cambia el "id" (se usa en la URL: proyecto.html?id=...) y rellena los campos.

   Campos:
     id          → identificador único, sin espacios ni tildes
     status      → "terminado" | "en-curso"  (en curso: tarjeta sin enlace)
     title       → título del proyecto
     category    → etiqueta corta (Retención, Marketing, Riesgo…)
     summary     → 1-2 frases para la tarjeta del listado
     question    → la pregunta de negocio que responde (entradilla del detalle)
     tools       → herramientas usadas
     kpis        → cifras clave [{ value, label }]
     meta        → filas de ficha técnica [{ label, value }]
     sections    → bloques del detalle. Cada uno admite:
                     title, text, bullets[], code, formula, tags[]
     dashboard   → { title, text, url (página pública), embed (URL /views/… de Tableau Public) }
                   Para sacar "embed" de un enlace de Tableau Public:
                   .../viz/LIBRO/HOJA  →  https://public.tableau.com/views/LIBRO/HOJA
     figures     → imágenes opcionales [{ src, caption }] (deja [] si no hay)
                   (si el archivo no existe, se muestra un hueco indicando la ruta)
     recommendations → acciones concretas que se derivan del análisis
     conclusion  → texto destacado final
     links       → enlaces externos [{ label, url }]
   ========================================================================== */

window.ELN = window.ELN || {};

window.ELN.projects = [
  /* ------------------------------------------------------------------ */
  {
    id: "churn",
    status: "terminado",
    title: "Predicción de abandono de clientes",
    category: "Retención · Banca",
    summary:
      "Qué clientes de un banco tienen más probabilidad de irse, por qué, y cuánto dinero hay en juego en cada grupo de riesgo.",
    question:
      "¿Qué clientes van a abandonar el banco y en cuáles merece la pena invertir para retenerlos antes de que lo hagan?",
    tools: ["Python", "MySQL", "Tableau"],
    kpis: [
      { value: "10.000", label: "clientes en el dataset" },
      { value: "4", label: "modelos comparados" },
      { value: "≈ 0,94", label: "ROC-AUC (Random Forest)" },
      { value: "4", label: "grupos de riesgo" },
    ],
    meta: [
      { label: "Dataset", value: "Churn for Bank Customers (Kaggle)" },
      { label: "Variable objetivo", value: "Exited · 1 = abandona, 0 = activo" },
      { label: "Técnicas", value: "EDA, clasificación supervisada, SQL analítico" },
    ],
    sections: [
      {
        title: "El problema de negocio",
        text:
          "Retener a un cliente cuesta menos que captar uno nuevo. El objetivo es anticiparse a la fuga: detectar qué clientes tienen más probabilidad de abandonar y diseñar acciones de retención antes de que ocurra.",
      },
      {
        title: "Los datos",
        text:
          "10.000 clientes con variables demográficas y de relación con el banco. Tras la limpieza (registros no válidos, estandarización de variables categóricas y numéricas) se trabajó con 9.265 clientes.",
        tags: ["CreditScore", "Geography", "Gender", "Age", "Balance", "Tenure", "NumOfProducts", "IsActiveMember"],
      },
      {
        title: "Lo que mostró la exploración",
        bullets: [
          "Francia concentra más clientes y, junto con España, la menor tasa de abandono.",
          "El abandono es mayor entre clientes con tarjeta de crédito, que son la mayoría.",
          "Las mujeres abandonan en mayor proporción que los hombres.",
          "El pico de abandono está entre los 37 y los 50 años (media 38, moda 35): una franja clara para acciones preventivas.",
        ],
      },
      {
        title: "Modelado",
        text:
          "Se compararon Regresión Logística, SVC, KNN y Random Forest sobre datos preprocesados y escalados, evaluando accuracy, recall, F1-score y ROC-AUC. Random Forest obtuvo el mejor resultado (ROC-AUC ≈ 0,94).",
        bullets: [
          "Factores principales: edad, inactividad y número de productos contratados.",
          "Factores secundarios: CreditScore, balance y antigüedad.",
          "Perfil de mayor riesgo: cliente de más edad, inactivo y con pocos productos.",
        ],
      },
      {
        title: "Del modelo a la operativa: SQL",
        text:
          "Los resultados se cargaron en MySQL: datos finales, probabilidad de abandono por cliente y segmentación en 4 grupos de riesgo. Con funciones de ventana, agregaciones y vistas se construyeron rankings y una métrica de riesgo monetario, base del dashboard de retención en Tableau.",
        formula: "Riesgo monetario = Balance × Probabilidad de churn",
      },
    ],
    dashboard: {
      title: "Dashboard de retención",
      text: "KPIs de retención, segmentación por grupo de riesgo y pérdida potencial. Es interactivo: puedes filtrar directamente.",
      url: "https://public.tableau.com/app/profile/eric.leon.nomberto/viz/Churn_17605539422140/Completo",
      embed: "https://public.tableau.com/views/Churn_17605539422140/Completo",
    },
    figures: [],
    recommendations: [
      "Priorizar la retención por riesgo monetario (balance × probabilidad de abandono), no solo por probabilidad: empezar por los clientes del grupo de mayor riesgo con más saldo.",
      "Lanzar una campaña de reactivación para clientes inactivos, el factor de abandono más accionable.",
      "Ofrecer venta cruzada a clientes con un solo producto: cada producto adicional aumenta la vinculación con el banco.",
      "Diseñar acciones preventivas para la franja de 37 a 50 años antes de que llegue el pico de abandono.",
      "Recalcular la probabilidad cada mes y comparar la retención de los clientes contactados con un grupo de control para medir el impacto real.",
    ],
    conclusion:
      "En la exploración parecía que el género, la tarjeta de crédito o el país explicaban el abandono. Los modelos mostraron otra cosa: lo que de verdad pesa es la edad, la actividad y el número de productos. El modelo permite señalar los segmentos de riesgo y cuantificar cuánto dinero se perdería en cada uno.",
    links: [],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "segmentacion",
    status: "terminado",
    title: "Segmentación de clientes",
    category: "Valor de cliente · RFM",
    summary:
      "RFM, cohortes y LTV para saber quién aporta valor, cuándo se pierde al cliente y cuánto se puede invertir en captarlo. Datos de un comercio, método aplicable a cualquier cartera bancaria.",
    question:
      "¿Qué tipos de cliente tiene el negocio, en qué momento dejan de volver y cuándo empieza a ser rentable haberlos captado?",
    tools: ["Python", "pandas", "Tableau"],
    kpis: [
      { value: "9", label: "segmentos RFM" },
      { value: "6", label: "cohortes analizadas" },
      { value: "Mes 1", label: "punto crítico de abandono" },
      { value: "Mes 2", label: "se supera el CaC medio" },
    ],
    meta: [
      { label: "Ámbito", value: "Comercio · histórico de transacciones de un año natural" },
      { label: "Técnicas", value: "RFM, análisis de cohortes, LTV vs. CaC" },
      { label: "Entrega", value: "Dashboard en Tableau" },
      { label: "Aplicación en banca", value: "Segmentar la cartera, medir la vinculación de nuevos clientes y valorar el coste de captación por producto" },
    ],
    sections: [
      {
        title: "El problema de negocio",
        text:
          "Entender la retención: qué patrones de comportamiento tienen los clientes, cuándo se pierden y dónde conviene concentrar los recursos de captación y fidelización. Todo el análisis exploratorio se hizo en Python (pandas) y los resultados se prepararon para Tableau.",
      },
      {
        title: "Análisis RFM",
        text:
          "Cada cliente se describe con tres medidas: Recency (días desde la última compra), Frequency (transacciones distintas) y Monetary (gasto total).",
        code:
          "fecha_max = productos['Fecha'].max()\n" +
          "rfm = productos.groupby('ID_Cliente').agg(\n" +
          "    Recency=('Fecha', lambda x: (fecha_max - x.max()).days)\n" +
          ")\n" +
          "rfm['Frequency'] = productos.groupby('ID_Cliente')['ID_Transaccion'].nunique()\n" +
          "rfm['Monetary']  = productos.groupby('ID_Cliente')['Total_Venta'].sum()",
      },
      {
        title: "Los 9 segmentos",
        text:
          "Según la combinación alta o baja de R, F y M, cada cliente cae en uno de nueve grupos, cada uno con una acción comercial distinta.",
        tags: [
          "Campeones", "Grandes gastadores", "Leales potenciales", "Prometedores", "Clientes leales",
          "Clientes rentables", "Clientes recientes", "En riesgo", "Dudosos",
        ],
      },
      {
        title: "Cohortes",
        text:
          "Los clientes se agrupan por su mes de primera compra. Con un año natural de datos se siguieron 6 cohortes durante 6 meses para comparar cuántos repiten y cuántos se pierden, y localizar el punto de inflexión.",
      },
      {
        title: "Valor del cliente (LTV) frente al coste de captarlo",
        text:
          "El LTV se calculó acumulado mes a mes para cada cohorte (no proyectado a toda la vida del cliente) y se comparó con el coste medio de adquisición (CaC) por perfil demográfico, como nivel de estudios u ocupación.",
        formula: "LTV = Frecuencia de compra × Ticket medio × Vida media",
      },
    ],
    dashboard: {
      title: "Customer Analytics: RFM, cohortes y LTV",
      text: "Historia interactiva con una parte operativa por tipo de cliente, la visión general del negocio y el perfil de cliente ideal.",
      url: "https://public.tableau.com/app/profile/eric.leon.nomberto/viz/CostumerAnalytics-FRMCohortesLTV/Historia1",
      embed: "https://public.tableau.com/views/CostumerAnalytics-FRMCohortesLTV/Historia1",
    },
    figures: [],
    recommendations: [
      "Concentrar las acciones de bienvenida y permanencia en los primeros 60 días: es donde se pierde al cliente y donde se recupera el coste de captarlo.",
      "Ajustar el presupuesto de captación por perfil demográfico según su relación LTV / CaC, priorizando los perfiles que recuperan antes la inversión.",
      "Personalizar campañas por segmento RFM: fidelizar y pedir recomendaciones a los Campeones, reactivar a los clientes En riesgo y limitar la inversión en los Dudosos.",
      "Seguir las cohortes cada mes en el dashboard para detectar a tiempo si cambia el punto de abandono.",
      "En banca, el mismo enfoque sirve para el onboarding de nuevos clientes: los primeros meses tras abrir la cuenta deciden si el cliente se vincula o se va.",
    ],
    conclusion:
      "Tras el primer mes el cliente tiende a no volver; a partir de ahí la pérdida se frena mucho. Las acciones de permanencia deben concentrarse en los dos primeros meses, porque es en el segundo cuando cada cohorte supera el coste medio de captación. La segmentación RFM permite personalizar campañas y el LTV orienta la captación hacia el cliente de mayor valor.",
    links: [],
  },

  /* ------------------------------------------------------------------ */
  {
    id: "fraude",
    status: "en-curso",
    title: "Fraude en tarjetas de crédito y monitorización",
    category: "Riesgo · Fraude",
    summary: "Detección de transacciones anómalas y un sistema de seguimiento para el equipo de operaciones.",
    tools: [],
  },
];
