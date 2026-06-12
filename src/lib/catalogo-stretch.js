// src/lib/catalogo-stretch.js
// Fuente unica de datos del catalogo digital — division STRETCH FILM.
// Datos espejo de las laminas oficiales (ficha tecnica detallada de 8 filas).
// La usan la pagina /[lang]/catalogo-digital.astro y el endpoint /api/catalogo-pdf.

export const intro = {
  p1: "La película de Grupo Ortiz® cumple con nuestros altos estándares de calidad y cuenta con una claridad óptica excepcional y características superiores. Independientemente de la aplicación, nuestros productos ofrecen una excelente integridad de carga y una mayor eficiencia en costos.",
  bioTitle: "Película Biodegradable",
  p2: "A través de una formulación especial, se logra la biodegradación de la película stretch. Esta formulación permite que el proceso de degradación sea un 90% más rápido en comparación con los materiales estándar.",
};

export const productos = [
  "Stretch Premium",
  "Automático",
  "Manual Preestirado",
  "Manual Banding",
  "Coreles",
  "Manual Rígido",
];

export const fichas = [
  {
    nombre: "STRETCH PREMIUM",
    img: "premium.png",
    lado: "left",
    desc: "Film estirable automático diseñado para máquinas de envoltura de baja y media velocidad, con elongaciones que no exceden el 280%. Ideal para su uso con equipos de brazo giratorio y plato giratorio.",
    specs: [
      { c: "Amplitud",                 min: "19",   max: "30",    tol: "±1/8",   uni: "In",       met: "—",         hl: false },
      { c: "Grosor",                   min: "50",   max: "90",    tol: "±5",     uni: "Gauges",   met: "—",         hl: false },
      { c: "Largo",                    min: "3000", max: "15000", tol: "±50",    uni: "Ft",       met: "—",         hl: false },
      { c: "Peso neto",                min: "5.18", max: "39.2",  tol: "± 2%",   uni: "Lb",       met: "—",         hl: false },
      { c: "Elongación",               min: "270",  max: "280",   tol: "Mínimo", uni: "%",        met: "NOM-002",   hl: true },
      { c: "Adherencia",               min: "12",   max: "60",    tol: "Mínimo", uni: "Gfr",      met: "NMX-E-003", hl: true },
      { c: "Resistencia de carga",     min: "3.45", max: "4.73",  tol: "Mínimo", uni: "Lbf",      met: "NMX-E-002", hl: true },
      { c: "Resistencia",              min: "3",    max: "4.49",  tol: "Mínimo", uni: "Lbf",      met: "NMX-E-002", hl: true },
    ],
  },
  {
    nombre: "AUTOMÁTICO",
    img: "stretch2.png",
    lado: "right",
    desc: "Está diseñada para su uso en máquinas de envoltura de baja y media velocidad. Esta formulación ofrece una capacidad de estiramiento de hasta un 250%, lo que se traduce en mayor eficiencia y un menor costo por pallet. Esta formulación está garantizada para elongaciones que no excedan el 250%.",
    specs: [
      { c: "Amplitud",                 min: "18",   max: "30",    tol: "±1/8",   uni: "In",       met: "—",         hl: false },
      { c: "Grosor",                   min: "50",   max: "110",   tol: "±5",     uni: "Gauges",   met: "—",         hl: false },
      { c: "Largo",                    min: "2000", max: "15000", tol: "±50",    uni: "Ft",       met: "—",         hl: false },
      { c: "Peso neto",                min: "3.27", max: "39.2",  tol: "± 2%",   uni: "Lb",       met: "—",         hl: false },
      { c: "Elongación",               min: "230",  max: "250",   tol: "Mínimo", uni: "%",        met: "NOM-002",   hl: true },
      { c: "Adherencia",               min: "12",   max: "60",    tol: "Mínimo", uni: "Gfr",      met: "NMX-E-003", hl: true },
      { c: "Resistencia de carga",     min: "3.4",  max: "5.95",  tol: "Mínimo", uni: "Lbf",      met: "NMX-E-002", hl: true },
      { c: "Resistencia",              min: "2.5",  max: "5.35",  tol: "Mínimo", uni: "Lbf",      met: "NMX-E-002", hl: true },
    ],
  },
  {
    nombre: "MANUAL PREESTIRADO",
    img: "prestirado.png",
    lado: "right",
    desc: "Película para aplicación manual que ofrece alto rendimiento y el menor calibre (espesor) del mercado. A diferencia de la película stretch manual tradicional, este producto no requiere que el usuario aplique fuerza, ya que viene preestirada y lista para su uso, garantizando mayor eficiencia y desempeño.",
    specs: [
      { c: "Amplitud",                 min: "16",   max: "17",    tol: "±1/4",   uni: "In",       met: "—",         hl: false },
      { c: "Grosor",                   min: "25",   max: "35",    tol: "±5",     uni: "Gauges",   met: "—",         hl: false },
      { c: "Largo",                    min: "1000", max: "5000",  tol: "±66",    uni: "Ft",       met: "—",         hl: false },
      { c: "Peso neto",                min: "0.73", max: "4.3",   tol: "± 2%",   uni: "Lb",       met: "—",         hl: false },
      { c: "Elongación",               min: "10",   max: "20",    tol: "Mínimo", uni: "%",        met: "NOM-002",   hl: true },
      { c: "Adherencia",               min: "12",   max: "20",    tol: "Mínimo", uni: "Gfr",      met: "NMX-E-003", hl: true },
      { c: "Resistencia de carga",     min: "1.2",  max: "2.2",   tol: "Mínimo", uni: "Lbf",      met: "NMX-E-002", hl: true },
      { c: "Resistencia",              min: "1",    max: "1.7",   tol: "Mínimo", uni: "Lbf",      met: "NMX-E-002", hl: true },
    ],
  },
  {
    nombre: "MANUAL BANDING",
    img: "banding.png",
    lado: "left",
    desc: "Película stretch de alto rendimiento diseñada para aplicaciones manuales. Su formato en rollos de 3\" a 12\" permite un manejo ágil y preciso, convirtiéndose en la alternativa técnica superior a los sistemas de amarre tradicionales. Ofrece una sujeción segura, excelente estiramiento y protección total contra el polvo y la humedad.",
    specs: [
      { c: "Amplitud",                 min: "3",    max: "12",    tol: "±1/4",   uni: "In",       met: "—",         hl: false },
      { c: "Grosor",                   min: "40",   max: "120",   tol: "±5",     uni: "Gauges",   met: "—",         hl: false },
      { c: "Largo",                    min: "700",  max: "2500",  tol: "±50",    uni: "Ft",       met: "—",         hl: false },
      { c: "Peso neto",                min: "0.45", max: "4.9",   tol: "± 2%",   uni: "Lb",       met: "—",         hl: false },
      { c: "Elongación",               min: "180",  max: "200",   tol: "Mínimo", uni: "%",        met: "NOM-002",   hl: true },
      { c: "Adherencia",               min: "12",   max: "60",    tol: "Mínimo", uni: "Gfr",      met: "NMX-E-003", hl: true },
      { c: "Resistencia de carga",     min: "3.39", max: "4.54",  tol: "Mínimo", uni: "Lbf",      met: "NOM-002",   hl: true },
      { c: "Resistencia",              min: "1.85", max: "4.28",  tol: "Mínimo", uni: "Lbf",      met: "NMX-E-002", hl: true },
    ],
  },
  {
    nombre: "CORELES",
    img: "coreles.png",
    lado: "right",
    desc: "Película stretch sin núcleo de cartón, diseñada para maximizar el aprovechamiento del material y reducir residuos en el proceso de paletizado. Su construcción multicapa ofrece alta resistencia al rasgado, excelente elongación y una sujeción firme de la carga, ideal para aplicaciones manuales y semiautomáticas.",
    specs: [
      { c: "Amplitud",                 min: "18",   max: "20",    tol: "±1/8",   uni: "In",       met: "—",         hl: false },
      { c: "Grosor",                   min: "60",   max: "80",    tol: "±2%",    uni: "Gauges",   met: "—",         hl: false },
      { c: "Largo",                    min: "1000", max: "2000",  tol: "±5",     uni: "Ft",       met: "—",         hl: false },
      { c: "Peso neto",                min: "3",    max: "10",    tol: "±19",    uni: "Lb",       met: "—",         hl: false },
      { c: "Elongación",               min: "160",  max: "200",   tol: "Mínimo", uni: "%",        met: "NOM-002",   hl: true },
      { c: "Adherencia",               min: "12",   max: "50",    tol: "Mínimo", uni: "Gfr",      met: "NMX-E-003", hl: true },
      { c: "Resistencia de carga",     min: "3.39", max: "4.54",  tol: "Mínimo", uni: "Lbf",      met: "NMX-E-002", hl: true },
      { c: "Resistencia",              min: "1.85", max: "4.28",  tol: "Mínimo", uni: "Lbf",      met: "NMX-E-002", hl: true },
    ],
  },
  {
    nombre: "MANUAL RÍGIDO",
    img: "rigido.png",
    lado: "right",
    desc: "Formulado especialmente para aplicaciones de envoltura manual con estiramiento limitado. Este film ofrece una capacidad excepcional de retención de carga y resistencia a perforaciones, convirtiéndolo en una solución de empaque innovadora en el mercado.",
    specs: [
      { c: "Amplitud",                 min: "17",   max: "30",    tol: "±1/4",   uni: "In",       met: "NMX-E-002", hl: false },
      { c: "Grosor",                   min: "40",   max: "90",    tol: "±5",     uni: "Gauges",   met: "NMX-E-003", hl: false },
      { c: "Largo",                    min: "1000", max: "1500",  tol: "±66",    uni: "Ft",       met: "HIGHLIGHT", hl: false },
      { c: "Peso neto",                min: "1.54", max: "4.9",   tol: "± 2%",   uni: "Lb",       met: "NOM-002",   hl: false },
      { c: "Elongación",               min: "160",  max: "260",   tol: "Mínimo", uni: "%",        met: "HIGHLIGHT", hl: true },
      { c: "Adherencia",               min: "12",   max: "60",    tol: "Mínimo", uni: "Gfr",      met: "HIGHLIGHT", hl: true },
      { c: "Resistencia de carga",     min: "3.85", max: "4.95",  tol: "Mínimo", uni: "Lbf",      met: "HIGHLIGHT", hl: true },
      { c: "Resistencia",              min: "1.85", max: "4.28",  tol: "Mínimo", uni: "Lbf",      met: "HIGHLIGHT", hl: true },
    ],
  },
];

export const coverImg = "stretch-portada.png";
