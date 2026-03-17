// src/i18n/es.js

export const es = {
  // =================================================
  // BARRA DE NAVEGACIÓN
  // =================================================
  nav: {
    home: 'Inicio',
    products: 'Productos',
    catalog: 'Catálogo',
    about: 'Nosotros',
    company: 'La Empresa',
    social: 'Impacto Social',
    distributor: 'Distribuidor',
    contact: 'Contacto'
  },

  // =================================================
  // HERO / PORTADA GENERAL
  // =================================================
  hero: {
    title: "Bienvenidos",
    subtitle: "Calidad que perdura"
  },

  // =================================================
  // TEXTOS COMUNES
  // =================================================
  common: {
    seeMore: "Ver más",
    division: "División",
    buy: "Comprar",
    redirecting: "Redirigiendo...",
    download: "Descargar",
    language: "Idioma",
    scrollDown: "Desliza hacia abajo",
    previous: "Anterior",
    next: "Siguiente"
  },

  // =================================================
  // CHATBOT (BotGo)
  // =================================================
chatbot: {
  // ── Mensajes generales ──
  greeting:            '¡Hola! Soy BotGo 🤖. ¿En qué puedo ayudarte hoy?',
  placeholder:         'Escribe un mensaje...',
  listeningState:      'Escuchando...',
  thinking:            'Pensando...',
  errorMsg:            'Error de conexión.',
  voiceAssistantTitle: 'Asistente Virtual',
  voiceCode:           'es-MX',

  // ── Botones de acción ──
  salesBtn:   'Cotizar por WhatsApp',
  pdfBtn:     'Ver catálogo PDF',
  waStart:    'Hola Grupo Ortiz, me gustaría una cotización',

  // ── Tooltip desktop (tarjeta) ──
  tooltipTitle:  '¿En qué puedo',
  tooltipAccent: 'ayudarte hoy?',
  tooltipCta:    '¡Iniciar chat ahora!',
  tooltipItems: [
    { text: 'Postúlate a nuestras', bold: 'vacantes'                  },
    { text: 'Solicita',             bold: 'información de productos'  },
    { text: 'Realiza tu',           bold: 'pedido directamente'       },
    { text: 'Contacta',             bold: 'atención al cliente'       },
    { text: 'Descarga',             bold: 'catálogos y fichas técnicas'},
  ],

  // ── Pill móvil ──
  pillLabelSmall: '¿En qué puedo',
  pillLabelBig:   'AYUDARTE HOY?',
},

  pwa: {
  appName: "Grupo Ortiz",
  title: "Instalar GO App",
  description: "Acceso rápido desde tu pantalla de inicio",
  install: "Instalar",
  notNow: "Ahora no",
  timeLabel: "ahora"
},

  // =================================================
  // PÁGINA DE PROMOCIONES
  // =================================================
  promociones: {
    meta_title: "Promociones | Grupo Ortiz",
    hero: {
      label: "OFERTAS ESPECIALES",
      title: "PROMOCIONES",
      subtitle: "Aprovecha nuestras ofertas limitadas",
      validity: "Válido hasta agotar existencias*"
    },
    discount_badge: "HASTA",
    off_text: "DE DESCUENTO",
    original_price: "Antes",
    promo_price: "Precio Especial",
    buy_button: "Solicitar Cotización",
    contact_cta: "Contacta a un asesor para más información",
    valid_until: "Válido hasta agotar existencias*",

    products: [
      {
        id: "promo-stretch",
        name: "Stretch Film",
        subtitle: "$33 POR KG EN STRETCH DE COLOR",
        image: "/images/stretch/manual.webp",
        discount: 35,
        originalPrice: "",
        promoPrice: "$33/KG",
        features: [
          "Película estirable de color",
          "Precio especial por kilogramo",
          "Stock limitado",
          "Disponible en varios colores"
        ],
        validUntil: "Válido hasta agotar existencias*"
      },
      {
        id: "promo-cuerda",
        name: "Cuerda",
        subtitle: "$33 POR KG",
        image: "/images/cuerdas/CuerdaT1.webp",
        discount: 25,
        originalPrice: "",
        promoPrice: "$33/KG",
        features: [
          "Cuerda de alta calidad",
          "Precio especial por kilogramo",
          "Oferta por tiempo limitado",
          "Disponibilidad sujeta a stock"
        ],
        validUntil: "Válido hasta agotar existencias*"
      }
    ]
  },

  // =================================================
  // PÁGINA DE CATÁLOGO
  // =================================================
  catalog: {
    hero: {
      label: "DOCUMENTACIÓN",
      title: "CATÁLOGO GENERAL",
      description: "Calidad y soluciones integradas en un solo documento. Seleccione su idioma preferido para obtener nuestra presentación corporativa.",
      scrollText: "VER DIVISIONES"
    },
    carousel: {
      label: "DESCARGAS DISPONIBLES",
      title: "CATÁLOGO POR DIVISIÓN",
    },
    languageLabel: "Language / Idioma",
    downloadButton: "DESCARGAR PDF",
    divisions: [
      {
        id: "1",
        name: "STRETCH FILM",
        desc: "Película stretch para asegurar y proteger cargas. Solución eficiente para paletizado y transporte seguro.",
        image: "/images/catalogo/img1.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1HYGcpgkRO_7OX22IcWvRpzpLZKgpYV3A/view?usp=sharing",
          en: "https://drive.google.com/file/d/1QZ6jmKyc-CGLwh9brbeZSQ5OOzkKdBCQ/view?usp=sharing",
        }
      },
      {
        id: "2",
        name: "CUERDA",
        desc: "Resistencia y durabilidad para amarre industrial y pesquero. Fabricadas con materiales de alta calidad para uso intensivo.",
        image: "/images/catalogo/img2.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/14GrV9P1ViQKvFp3BucYjgmryRgWKLEZh/view?usp=sharing",
          en: "https://drive.google.com/file/d/19Tvd_VHjogSE7y7cLZYr4ra__4vB4nOm/view?usp=sharing",
        }
      },
      {
        id: "3",
        name: "RAFIA",
        desc: "El estándar en sujeción para agricultura e industria. Material resistente y flexible para múltiples aplicaciones.",
        image: "/images/catalogo/img3.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1uAiR4uxO2iX_LsNFul6kXeb7jnnCEV_J/view?usp=sharing",
          en: "https://drive.google.com/file/d/10PV-sxexE8UkFSOhdTJBe1xWCy_tdFib/view?usp=sharing",
        }
      },
      {
        id: "4",
        name: "ARPILLA",
        desc: "Tejido de malla abierta para máxima ventilación agrícola. Soluciones versátiles para envasado y transporte de productos del campo.",
        image: "/images/catalogo/img4.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1OQKGpnRCfA2yFdAlT6q7GczYua2FFFVU/view?usp=sharing",
          en: "https://drive.google.com/file/d/1wldGL6XuqH-Ruth9Y01-hkNnPlbg9SW5/view?usp=sharing",
        }
      },
      {
        id: "5",
        name: "SACO",
        desc: "Polipropileno tejido plano para envasado masivo. Resistencia superior para productos a granel.",
        image: "/images/catalogo/img5.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/16S43-PUrQECO9q2J1fOgbN-YeIxQ2GhP/view?usp=sharing",
          en: "https://drive.google.com/file/d/1fkZvAWTT3mnBkxQ0Gbb2kRgOoN2dJZiK/view?usp=sharing",
        }
      },
      {
        id: "6",
        name: "ESQUINERO",
        desc: "Protección estructural y estabilidad para tarimas. Refuerzo esencial en logística y almacenamiento de carga.",
        image: "/images/catalogo/img6.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/181Hvr0HQffLU3rmcXkccYoqj-Y_A-gxr/view?usp=sharing",
          en: "https://drive.google.com/file/d/1DdcEavACvuY00oyMyC9rOWRybi9jnQrD/view?usp=sharing",
        }
      },
      {
        id: "7",
        name: "FLEXIBLE",
        desc: "Películas de alta barrera y laminación especializada. Protección óptima para alimentos y productos industriales.",
        image: "/images/catalogo/img7.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1TGxUcGHjW1NHF8K8YkRisbRE8uAuTnPO/view?usp=sharing",
          en: "https://drive.google.com/file/d/126eYsoqq9WI1SR-zoMdQJE7HS8cJR48m/view?usp=sharing",
        }
      }
    ]
  },

  // =================================================
  // LISTA PRINCIPAL (Carrusel /products)
  // =================================================
  products_list: [
    {
      img: "carrusel/img1.webp",
      division: "STRETCH FILM",
      descripcion: "Película estirable de alta claridad óptica y estándares de calidad. Asegura la integridad de la carga y eficiencia en costos. Nuestra línea incluye opción Biodegradable, formulada para degradarse 90% más rápido.",
      slug: "stretch-film",
      video: "carrusel/stretch-film.mp4"
    },
      {
      img: "carrusel/img4.webp",
      division: "ARPILLA",
      descripcion: "Sacos de malla de Rafia de Polipropileno en tejido circular de alta resistencia y durabilidad. Diseño ventilado ideal para frutas y verduras.",
      slug: "arpillas",
      video: "carrusel/arpillas.mp4"
    },
    {
      img: "carrusel/img2.webp",
      division: "CUERDA",
      descripcion: "Cuerda de Filamento de Polipropileno (PP) de alto rendimiento. Equilibrio perfecto: extrema ligereza sin sacrificar resistencia a la rotura.",
      slug: "cuerdas",
      video: "carrusel/cuerdas.mp4"
    },
    {
      img: "carrusel/img3.webp",
      division: "RAFIA",
      descripcion: "Rafia de Película de Polipropileno (PP) de alto rendimiento. Gran ligereza y alta resistencia a la rotura. Flexible y versátil.",
      slug: "rafias",
      video: "carrusel/rafia.mp4"
    },

    {
      img: "carrusel/img5.webp",
      division: "SACO",
      descripcion: "Sacos de Rafia de calidad superior. Solución de envasado robusta para alimentos, productos químicos y fertilizantes.",
      slug: "sacos",
      video: "carrusel/sacos.mp4"
    },
    {
      img: "carrusel/img6.webp",
      division: "ESQUINERO",
      descripcion: "Esquineros de cartón para optimizar la logística. Resistencia estructural y mayor estabilidad de carga.",
      slug: "esquineros",
      video: "carrusel/esquineros.mp4"
    },
    {
      img: "carrusel/img7.webp",
      division: "FLEXIBLE",
      descripcion: "Neo Empaques International se especializa en soluciones avanzadas de empaque flexible, diseñadas para optimizar la conservación y presentación de productos en múltiples industrias.",
      slug: "empaques-flexibles",
      video: "carrusel/bobina-impresa.mp4"
    }
  ],

  // =================================================
  // PÁGINA: STRETCH FILM (Película Estirable)
  // =================================================
  stretch_film: {
    meta_title: "Película Estirable | Grupo Ortiz",
    back_aria: "Volver a productos",
    specs_title: "ESPECIFICACIONES TÉCNICAS",

    specs_labels: {
      width: "Ancho",
      length: "Largo",
      gauge: "Gauge",
      weight: "Peso",
      type: "Uso"
    },

    products: [
      {
        name: 'STRETCH PREMIUM',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "Diseñada para maquinaria de alta exigencia, esta película stretch de estiramiento moderado ofrece una solución eficiente y confiable para asegurar cargas en procesos automatizados. Su composición garantiza alta resistencia y desempeño superior en aplicaciones de embalaje exigente.",
        specs_values: { width: "19-30 pulg", length: "1000-15000 fit", gauge: "40-110", weight: "10-40 kg", type: "Manual" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      },
      {
        name: 'AUTOMÁTICO',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "Diseñada para aplicarse con máquinas envolvedoras tradicionales, esta película stretch ofrece alto rendimiento y excelente desempeño en procesos automatizados de paletizado. Su formulación garantiza resistencia y estabilidad en la sujeción de cargas.",
        specs_values: { width: "18-30 pulg", length: "2000-15000 fit", gauge: "50-110", weight: "10-49 kg", type: "Automático" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      },
      {
        name: 'MANUAL PREESTIRADO',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "Diseñada para aplicación manual de alto desempeño, esta película preestirada destaca por ofrecer uno de los menores espesores del mercado. Su tecnología elimina la necesidad de ejercer fuerza adicional al envolver, facilitando su uso inmediato y mejorando la eficiencia en el proceso de paletizado.",
        specs_values: { width: "16-17 pulg", length: "7000-25000 fit", gauge: "40-120", weight: "10-40 kg", type: "Manual" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      },
      {
        name: 'MANUAL BANDING',
        img: '/images/stretch/manual.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "Diseñada para su aplicación en envoltura manual con estiramiento moderado, esta película stretch tradicional ofrece excelente desempeño en procesos de embalaje y aseguramiento de carga. Su composición garantiza resistencia y estabilidad en aplicaciones generales.",
        specs_values: { width: "3-12 pulg", length: "7000-25000 fit", gauge: "40-120", weight: "10-40 kg", type: "Manual" },
        gallery: [
          '/images/stretch/rigido2.png',
          '/images/stretch/manual.png',
          '/images/stretch/rigido3.png'
        ]
      },
      {
        name: 'MANUAL RÍGIDO',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "Formulada especialmente para aplicaciones en envoltura manual con estiramiento limitado, esta película stretch ofrece alto desempeño y gran confiabilidad en procesos de embalaje. Su composición garantiza estabilidad y eficiencia en la sujeción de cargas.",
        specs_values: { width: "17-30 pulg", length: "1000-15000 fit", gauge: "40-90", weight: "10-40 kg", type: "Manual", color: "Negro/Color" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      }
    ]
  },

  // =================================================
  // PÁGINA: CUERDAS
  // =================================================
  cuerdas: {
    meta_title: "Cuerdas | Grupo Ortiz",
    back_aria: "Volver",
    loading: "Cargando...",
    specs_title: "ESPECIFICACIONES TÉCNICAS",

    specs_labels: {
      load: "Rendimiento",
      mat: "Material",
      weight: "Peso",
      resist: "Resistencia",
      charge: "Presentación"
    },

    products: [
      {
        name: 'CUERDA FERRETERA',
        img: '/images/cuerdas/CuerdaT1.webp',
        video: "/videos/cuerdas/cuerda-1.mp4",
        link: '#',
        description: "Diseñado con polipropileno y un avanzado filtro UV, este cable es ideal para actividades con alta exposición solar. Su formulación especializada retarda el desgaste natural y prolonga su vida útil, garantizando mayor resistencia y durabilidad frente a la intemperie. Es la cuerda ferretera perfecta para brindar firmeza, seguridad y rendimiento confiable en aplicaciones generales y trabajos exigentes.",
        specs_values: { load: "1,980 m", mat: "PP-UV", weight: "18 kg", resist: "175 kg", charge: "4-19 mm" },
        gallery: [
          '/images/cuerdas/CuerdaT1-2.png',
          '/images/cuerdas/CuerdaT1.webp',
          '/images/cuerdas/CuerdaT1-1.png'
        ]
      },
      {
        name: 'CUERDA INVERNADERO',
        img: '/images/cuerdas/CuerdaNegra.webp',
        video: "/videos/cuerdas/CuerdaI.mp4",
        link: '#',
        description: "Diseñado con polipropileno (PP) y estabilizador UV, este cable es ideal para el sector marítimo y actividades con alta exposición solar. Su formulación especializada retarda el desgaste provocado por la radiación ultravioleta, prolongando su vida útil y garantizando mayor resistencia a la intemperie. Es la solución perfecta para brindar firmeza y estabilidad en macrotúneles agrícolas.",
        specs_values: { load: "3,240 m", mat: "PP-UV", weight: "18 kg", resist: "105 kg", charge: "3-8 mm" },
        gallery: [
          '/images/cuerdas/CuerdaNegra6-1.png',
          '/images/cuerdas/CuerdaNegra.webp',
          '/images/cuerdas/CuerdaNegra6-3.png'
        ]
      },
      {
        name: 'CUERDA ECOLÓGICA',
        img: '/images/cuerdas/CuerdaEco.png',
        video: "/videos/cuerdas/CuerdaE.mp4",
        link: '#',
        description: "Fabricada con polipropileno (PP) de alta calidad, esta cuerda ofrece una amplia variedad de presentaciones, calibres y colores, disponibles en versiones lisas o combinadas, con refuerzo o con marca. Su versatilidad y resistencia la convierten en una opción confiable para múltiples aplicaciones, para uso en industrias, fábricas, bodegas, mercados de abasto, ferreterías, tlapalerías, talleres y áreas de maquinado.",
        specs_values: { load: "3,240 m", mat: "PP-UV", weight: "18 kg", resist: "105 kg", charge: "3-8 mm" },
        gallery: [
          '/images/cuerdas/CuerdaEco1.png',
          '/images/cuerdas/CuerdaEco.png',
          '/images/cuerdas/CuerdaEco3.png'
        ]
      }
    ]
  },

  // =================================================
  // PÁGINA: RAFIAS
  // =================================================
  rafias: {
    meta_title: "Rafias | Grupo Ortiz",
    back_aria: "Volver",
    specs_title: "ESPECIFICACIONES TÉCNICAS",

    specs_labels: {
      cal: "Calibre",
      yield: "Rendimiento m",
      resist: "Resistencia kg",
      usage: "Material"
    },

    products: [
      {
        name: "RAFIA DE ATAR",
        description: "Fabricada con polipropileno 100% virgen, esta rafia ofrece alta resistencia y excelente rendimiento, manteniendo sus propiedades físicas aun en condiciones de intemperie. Su calidad garantiza durabilidad y desempeño confiable en aplicaciones exigentes. Es ampliamente utilizada en los sectores agrícola, avícola y de horticultura.",
        img: "/images/rafias/atar.png",
        video: "/videos/rafia/fondoN.mp4",
        specs_values: {
          cal: "2-8 mm",
          yield: "90 kg",
          resist: "60-320 f",
          usage: "PP-UV"
        },
        gallery: [
          '/images/rafias/atar2.png',
          '/images/rafias/atar.png',
          '/images/rafias/atar3.png'
        ]
      },
      {
        name: "RAFIA ECOLÓGICA",
        description: "Fabricada con polipropileno de alta calidad, esta rafia ofrece excelente resistencia y mantiene sus propiedades físicas aun en condiciones de intemperie. Su rendimiento confiable la convierte en una opción ideal para aplicaciones agrícolas, avícolas y de horticultura.",
        img: "/images/rafias/Eco.png",
        video: "/videos/rafia/fondoE.mp4",
        specs_values: {
          cal: "2-8",
          yield: "90-500 kg",
          resist: "59-255 f",
          usage: "PP-UV"
        },
        gallery: [
          '/images/rafias/Eco2.png',
          '/images/rafias/Eco.png',
          '/images/rafias/Eco3.png'
        ]
      },
      {
        name: "RAFIA FIBRILADA NEGRA",
        description: "Fabricada con polipropileno de alta calidad, esta rafia ofrece gran resistencia y mantiene sus propiedades físicas aun en condiciones de intemperie. Su excelente rendimiento la hace ideal para aplicaciones industriales, ferreteras y de empaque, así como para los sectores agrícola, avícola y de horticultura.",
        img: "/images/rafias/negra.png",
        video: "/videos/rafia/fondoR.mp4",
        specs_values: {
          cal: "2-8",
          yield: "90-500 kg",
          resist: "59-255 f",
          usage: "PP-UV"
        },
        gallery: [
          '/images/rafias/negra2.png',
          '/images/rafias/negra.png',
          '/images/rafias/negra3.png'
        ]
      }
    ]
  },

  // =================================================
  // PÁGINA: ARPILLAS
  // =================================================
  arpillas: {
    meta_title: "Arpillas | Grupo Ortiz",
    back_aria: "Volver",
    specs_title: "ESPECIFICACIONES TÉCNICAS",

    specs_labels: {
      construction: "Construcción",
      sizes: "Ancho",
      colors: "Colores",
      features: "Tipo de cierre"
    },

    products: [
      {
        name: 'ARPILLA CIRCULAR',
        img: '/images/arpillas/arpilla.webp',
        video: "/videos/arpilla/circular.mp4",
        link: '#',
        description: "Fabricada con polipropileno 100% virgen y construcción rafia, esta arpilla ofrece alta resistencia y excelente rendimiento en aplicaciones de empaque y almacenamiento. Su calidad garantiza durabilidad y un desempeño confiable en el manejo de diversos productos.",
        specs_values: {
          sizes: "23-70 cm",
          colors: "4",
          features: "Jareta"
        },
        gallery: [
          '/images/arpillas/circular2.webp',
          '/images/arpillas/arpilla.webp',
          '/images/arpillas/circular3.webp'
        ]
      },
      {
        name: 'ARPILLA MONOFILAMENTO CIRCULAR',
        img: '/images/arpillas/arpilla2.webp',
        video: "/videos/arpilla/mono.mp4",
        link: '#',
        description: "Fabricada con polipropileno 100% virgen y construcción rafia/monofilamento, esta arpilla ofrece alta resistencia y excelente rendimiento en aplicaciones de empaque y almacenamiento. Su estructura proporciona durabilidad y desempeño confiable en el manejo y protección de diversos productos.",
        specs_values: {
          construction: "Monofilamento",
          sizes: "23-70 cm",
          colors: "2",
          features: "Jareta"
        },
        gallery: [
          '/images/arpillas/mono2.webp',
          '/images/arpillas/arpilla2.webp',
          '/images/arpillas/mono3.webp'
        ]
      },
      {
        name: 'ARPILLA COSTURA LATERAL',
        img: '/images/arpillas/arpilla3.webp',
        video: "/videos/arpilla/costura.mp4",
        link: '#',
        description: "Fabricada con polipropileno 100% virgen y construcción rafia/monofilamento, esta arpilla ofrece alta resistencia y excelente desempeño en aplicaciones de empaque y almacenamiento. Su estructura garantiza durabilidad y confiabilidad en el manejo de distintos productos.",
        specs_values: {
          type: "Lateral",
          construction: "Monofilamento",
          sizes: "23-60 cm",
          colors: "4",
          features: "Reforzado"
        },
        gallery: [
          '/images/arpillas/lateral1.webp',
          '/images/arpillas/arpilla3.webp',
          '/images/arpillas/lateral3.webp'
        ]
      },
      {
        name: 'ARPILLA ETIQUETA LAMINADA',
        img: '/images/arpillas/arpilla4.webp',
        video: "/videos/arpilla/etiqueta.mp4",
        link: '#',
        description: "Fabricada con polipropileno 100% virgen y construcción rafia/rafia, esta arpilla ofrece alta resistencia y excelente desempeño en procesos de empaque y almacenamiento. Su tejido garantiza durabilidad y confiabilidad para aplicaciones exigentes tanto en el mercado nacional como de exportación.",
        specs_values: {
          type: "Laminado",
          construction: "Rafia",
          sizes: "23-70 cm",
          colors: "4",
          features: "Jareta"
        },
        gallery: [
          '/images/arpillas/laminado1.webp',
          '/images/arpillas/arpilla4.webp',
          '/images/arpillas/laminado3.webp'
        ]
      }
    ]
  },

  // =================================================
  // PÁGINA: SACOS
  // =================================================
  sacos: {
    meta_title: "Sacos | Grupo Ortiz",
    back_aria: "Volver a productos",
    specs_title: "ESPECIFICACIONES TÉCNICAS",

    specs_labels: {
      load: "Ancho",
      unit: "Largo",
      mat: "Material",
      weight: "Resistencia"
    },

    products: [
      {
        name: 'SACO DE RAFIA SIN LAMINAR',
        img: '/images/sacos/saco2.png',
        model: '/models/saco_blanco.glb',
        video: "/videos/saco/slaminar.mp4",
        link: '#',
        description: "Fabricados con cintas de polipropileno entrelazadas, los sacos de rafia sin laminar ofrecen gran resistencia y excelente durabilidad en aplicaciones de empaque y almacenamiento. Su estructura permite soportar cargas pesadas sin romperse, garantizando un desempeño confiable en trabajos exigentes.",
        specs_values: {
          load: "35-80 cm",
          unit: "49-115 cm",
          mat: "PP",
          weight: "120-200 kgf"
        },
        gallery: [
          '/images/sacos/slaminado1.png',
          '/images/sacos/saco2.png',
          '/images/sacos/slaminado3.png'
        ]
      },
      {
        name: 'SACO TRANSPARENTE',
        img: '/images/sacos/saco.png',
        video: "/videos/saco/transp.mp4",
        link: '#',
        description: "Fabricados con cintas de polipropileno y acabado transparente, estos sacos ofrecen alta resistencia y permiten una excelente visualización del producto envasado. Su estructura garantiza durabilidad y un desempeño confiable en aplicaciones de almacenamiento y transporte.",
        specs_values: {
          load: "35-80 kg",
          unit: "49-115 cm",
          mat: "PP",
          weight: "120-200 kgf"
        },
        gallery: [
          '/images/sacos/laminado2.png',
          '/images/sacos/saco.png',
          '/images/sacos/laminado3.png'
        ]
      },
      {
        name: 'SACO DE RAFIA ECOLÓGICO',
        img: '/images/sacos/saco3.png',
        video: "/videos/saco/eco.mp4",
        link: '#',
        description: "Fabricados con material reciclado proveniente de la merma del mismo proceso de producción, estos sacos ofrecen resistencia y buena durabilidad a un costo más accesible. Su fabricación permite un desempeño confiable en aplicaciones generales de empaque y almacenamiento.",
        specs_values: {
          load: "45-80 kg",
          unit: "49-115 cm",
          mat: "PP",
          weight: "120-200 kgf"
        },
        gallery: [
          '/images/sacos/eco2.png',
          '/images/sacos/saco3.png',
          '/images/sacos/eco3.png'
        ]
      }
    ]
  },

  // =================================================
  // PÁGINA: ESQUINEROS
  // =================================================
  esquineros: {
    meta_title: "Esquineros | Grupo Ortiz",
    back_aria: "Volver",
    specs_title: "ESPECIFICACIONES TÉCNICAS",

    specs_labels: {
      tab:      "Pestaña",
      thick:    "Espesor",
      length:   "Longitud",
      tabyd:    "Pestaña (yd)",
      thickyd:  "Espesor (yd)",
      lengthyd: "Longitud (yd)"
    },

    products: [
      {
        name: "ESQUINERO KRAFT CAFÉ",
        description: "Fabricado para proteger bordes y esquinas durante el transporte y almacenamiento, este esquinero distribuye la presión de manera uniforme, evitando deformaciones y daños en la mercancía. Su estructura ofrece resistencia y estabilidad en aplicaciones de embalaje exigentes.",
        img: "/images/esquinero/esquinero.png",
        video: "/videos/esquinero/esquinero.mp4",
        link: "#",
        specs_values: {
          tab:    "1.5 pulg",
          thick:  "0.08 mm",
          length: "11.81 cm"
        },
        gallery: [
          '/images/esquinero/esquinero2.png',
          '/images/esquinero/esquinero.png',
          '/images/esquinero/esquinero3.png'
        ]
      },
      {
        name: "ESQUINERO KRAFT BLANCO",
        description: "Fabricado para proteger bordes y esquinas durante el transporte y almacenamiento, este esquinero distribuye la presión de manera uniforme, evitando deformaciones y daños en la mercancía. Su estructura ofrece resistencia y estabilidad en aplicaciones de embalaje exigentes.",
        img: "/images/esquinero/esquinerob.png",
        video: "/videos/esquinero/esquinero.mp4",
        link: "#",
        specs_values: {
          tab:    "1.5 pulg",
          thick:  "0.08 mm",
          length: "11.81 cm"
        },
        gallery: [
          '/images/esquinero/esquinerob2.png',
          '/images/esquinero/esquinerob.png',
          '/images/esquinero/esquinerob3.png'
        ]
      }
    ]
  },

  // =================================================
  // PÁGINA: EMPAQUES FLEXIBLES
  // =================================================
  flexible_packaging: {
    meta_title: "Empaques Flexibles | Grupo Ortiz",
    back_aria: "Volver a productos",
    specs_title: "ESPECIFICACIONES TÉCNICAS",

    specs_labels: {
      lamination: "Laminación",
      finish:     "Acabado",
      size:       "Medidas hasta",
      zipper:     "Zipper",
      type:       "Tipo"
    },

    products: [
      {
        name: "BOBINA IMPRESA",
        description: "Nuestras bobinas cuentan con gran variedad en laminaciones, calibres y acabados. Con opción de impresión hasta 10 tintas y 133 líneas por pulgada. Desarrollo máximo: 1,140 mm. Ancho máximo de impresión: 1,450 mm. Compatibles con maquinaria de envasado automático para optimizar la eficiencia de producción.",
        img: "/images/flexible/bobina-impresa.png",
        video: "/videos/flexible/bobinaf.mp4",
        gallery: [
          "/images/flexible/bobina-impresa-1.png",
          "/images/flexible/bobina-impresa.png",
          "/images/flexible/bobina-impresa-3.png"
        ],
        specs_values: {
          lamination: "3 Tipos",
          finish:     "Variados",
          size:       "1,450 mm",
          zipper:     "N/A",
          type:       "Bobina"
        }
      },
      {
        name: "BOLSA STAND UP",
        description: "Bolsas stand-up pouch versátiles con estructura laminada y alta barrera contra humedad y oxígeno. Ideales para alimentos secos o húmedos, polvos, líquidos, cosméticos y químicos. Disponibles en acabados Natural, Mate y Metalizado, en tamaños de 150 g hasta 1 kg, con opción de cierre zipper y ventana.",
        img: "/images/flexible/standup-generica.png",
        video: "/videos/flexible/standup.mp4",
        gallery: [
          "/images/flexible/standup-generica-2.png",
          "/images/flexible/standup-generica.png",
          "/images/flexible/standup-generica-3.png"
        ],
        specs_values: {
          lamination: "Laminado",
          finish:     "3 Tipos",
          size:       "1 kg",
          zipper:     "Sí / No",
          type:       "Bolsa"
        }
      },
      {
        name: "STAND UP POUCH",
        description: "Línea de bolsas con diseños decorativos atractivos: Frutos Rojos, Flores, Frutas, Espigas, Regalo Azul y Regalo Rosa. Cierre tipo zipper, estructura resistente y acabados Natural o Metalizado. Disponibles en tamaños de 150 g hasta 1 kg. Ideales para quienes buscan un empaque de alta calidad y atractivo visual.",
        img: "/images/flexible/standup-origanics.png",
        video: "/videos/flexible/standup-origanics.mp4",
        gallery: [
          "/images/flexible/standup-origanics-2.png",
          "/images/flexible/standup-origanics.png",
          "/images/flexible/standup-origanics-3.png"
        ],
        specs_values: {
          lamination: "2 Tipos",
          finish:     "Regalo",
          size:       "1 kg",
          zipper:     "Sí",
          type:       "Bolsa impresa"
        }
      },
      {
        name: "BOLSA ALTO VACÍO",
        description: "Diseñadas para maximizar la frescura y vida útil de carnes, quesos, embutidos y productos frescos. Su sellado hermético elimina el aire, retiene las propiedades naturales del producto y evita la pérdida de sabor, textura y calidad. Fabricadas con materiales de alta resistencia y barrera.",
        img: "/images/flexible/bolsa-alto-vacio.png",
        video: "/videos/flexible/bolsa-alto-vacio.mp4",
        gallery: [
          "/images/flexible/bolsa-alto-vacio-1.png",
          "/images/flexible/bolsa-alto-vacio.png",
          "/images/flexible/bolsa-alto-vacio-3.png"
        ],
        specs_values: {
          lamination: "Multicapa",
          finish:     "Clara",
          size:       "Producto",
          zipper:     "No",
          type:       "Bolsa"
        }
      }
    ]
  },

  // =================================================
  // PÁGINA: DISTRIBUIDOR (Landing Completa)
  // =================================================
  distribuidor: {
    meta_title: "Distribuidor Grupo Ortiz | Socio Oficial",
    hero: {
      subtitle: "Portal Mayorista",
      title: "Multiplica <br>tus <span>Ganancias</span>",
      desc: "Distribuye productos de alta demanda con el respaldo del fabricante líder. Stock garantizado, sin intermediarios y logística 24h.",
      cta: "Empezar Ahora"
    },
    cards: [
      { icon: "ri-stack-line",        title: "Stock Total",   desc: "Capacidad para surtir grandes pedidos al instante. Tu bodega siempre llena." },
      { icon: "ri-truck-line",        title: "Envíos 24h",    desc: "Logística propia. Tus clientes no esperan, entregamos en tiempo récord." },
      { icon: "ri-shield-check-line", title: "Garantía",      desc: "Cambios físicos sin burocracia ni preguntas. Respaldo total de marca." },
      { icon: "ri-line-chart-line",   title: "Mejor Margen",  desc: "Precios directos de fábrica diseñados para maximizar tu utilidad neta." }
    ],
    stats: [
      { val: 25, symbol: "k", label: "Toneladas Mensuales" },
      { val: 35, symbol: "+", label: "Años de Historia"    },
      { val: 15, symbol: "M", label: "Ventas Totales"      }
    ],
    form: {
      title: "Solicitud <br>de Alta",
      desc: "Únete a la red. Completa tu perfil para asignarte zona y lista de precios preferencial.",
      support_label: "SOPORTE DIRECTO",
      labels: {
        name:     "Nombre de Contacto",
        business: "Razón Social",
        whatsapp: "WhatsApp",
        email:    "Correo Electrónico",
        products: "PRODUCTOS DE INTERÉS"
      },
      products_list: ["Sacos", "Flexibles", "Rafia", "Esquinero", "Cuerdas", "Stretch", "Otro", "Todos"],
      btn:         "ENVIAR SOLICITUD",
      success_msg: "Solicitud Enviada"
    }
  },

  // =================================================
  // PÁGINA: QUIÉNES SOMOS
  // =================================================
  quienes_somos: {
    meta_title: "Quiénes Somos | Grupo Ortiz",

    timeline: {
      title_white:   "NUESTRA",
      title_orange:  "TRAYECTORIA",
      nav_prev:      "Anterior",
      nav_next:      "Siguiente",
      video_bg:      "/videos/background.mp4",
      video_bg_webm: "",
      video_poster:  "",
      events: [
        { year: "1959", title: "El Comienzo",             short: "Fundación en Morelia",  img: "/images/tiempo/timeline-1959.webp",  description: "Desde 1959, Grupo Ortiz formó parte del desarrollo industrial de México. Fundado en Morelia por Nicandro Ortiz, el grupo nació con una visión firme: combinar tecnología de punta con el talento y la dedicación de su gente para construir una empresa sólida, innovadora y comprometida con la calidad." },
        { year: "1970", title: "Expansión Industrial",    short: "Sacos y arpillas",      img: "/images/tiempo/timeline-1970.webp",  description: "En 1970, iniciamos la producción de sacos y arpillas de polipropileno, marcando una etapa clave en nuestro crecimiento industrial. Este paso estratégico fortaleció nuestra capacidad operativa, amplió nuestra participación comercial y consolidó nuestra presencia dentro del mercado nacional." },
        { year: "1985", title: "Innovación Tecnológica",  short: "Maquinaria europea",    img: "/images/tiempo/timeline-1985.webp",  description: "En 1985, incorporamos maquinaria europea de última generación, fortaleciendo nuestra infraestructura industrial y optimizando nuestros procesos productivos. Esta inversión estratégica elevó nuestros estándares de calidad, incrementó la eficiencia operativa y reafirmó nuestro compromiso con la innovación tecnológica." },
        { year: "1995", title: "Diversificación",         short: "Nuevas líneas",         img: "/images/tiempo/timeline-1995.webp",  description: "En 1995, ampliamos nuestras líneas de producción incorporando stretch film, empaques flexibles y productos especializados para la industria. Esta expansión estratégica diversificó nuestro portafolio, fortaleció nuestra competitividad en el sector y nos permitió atender nuevas demandas del mercado nacional." },
        { year: "2005", title: "Expansión Internacional", short: "América y Europa",      img: "/images/tiempo/timeline-2005.webp",  description: "En 2005, iniciamos exportaciones hacia América y Europa, marcando un paso decisivo en nuestra expansión internacional. Este logro posicionó a la empresa como un referente en la industria de polímeros plásticos, fortaleciendo nuestra presencia global y consolidando nuestra competitividad en mercados internacionales." },
        { year: "2015", title: "Sostenibilidad",          short: "Planta de reciclado",   img: "/images/tiempo/timeline-2015.webp",  description: "En 2015, implementamos una planta de reciclado y fortalecimos nuestros programas de sustentabilidad, reafirmando nuestro compromiso con el medio ambiente. Esta iniciativa estratégica optimizó el aprovechamiento de recursos, impulsó prácticas responsables y consolidó nuestra visión de crecimiento." },
        { year: "2026", title: "Presente",                short: "Líder industrial",      img: "/images/tiempo/timeline-2026.webp",  description: "En 2026, contamos con 17 plantas de producción, más de 4,000 colaboradores y una capacidad anual de 220,000 toneladas. Este crecimiento sostenido nos consolida como líderes en la industria del plástico, respaldados por una infraestructura sólida, talento humano especializado y una visión estratégica orientada al futuro." }
      ]
    },

    filosofia: {
      label: "Nuestros Principios",
      title: "Filosofía GO",
      img:   "/images/about/GO.webp",
      items: [
        "Obsesión por la satisfacción del cliente, no por la competencia.",
        "Pasión por la invención e innovación constante.",
        "Excelencia operativa en cada proceso.",
        "Pensamiento a largo plazo con resultados inmediatos.",
        "Ser el mejor empleador y el lugar de trabajo más seguro del planeta."
      ]
    },

    vision: {
      label: "Hacia dónde vamos",
      title: "Visión",
      img:   "/images/about/GO2.webp",
      items: [
        "Ser la compañía del planeta más orientada al cliente.",
        "Ofrecer toda solución integral para cualquier negocio.",
        "Ser la única solución en empaques para cualquier negocio del planeta.",
        "Crecer con presencia global sin perder el enfoque humano."
      ]
    },

    infraestructura: {
      title_white:  "Infraestructura",
      title_orange: "que respalda",
      stats: [
        { number: "13",     label: "Plantas de Producción",   desc: "Instalaciones estratégicamente ubicadas para atender mercados nacionales e internacionales.", icon: "number" },
        { number: "+3,000", label: "Colaboradores",           desc: "Equipo especializado que impulsa cada proceso productivo.", icon: "number" },
        { number: "260",    label: "Unidades Logísticas",     desc: "Flota propia que garantiza distribución eficiente y entregas seguras a nivel nacional e internacional.", icon: "number" },
        { number: "Global", label: "Presencia Internacional", desc: "Exportación y distribución en América y Europa.", icon: "globe" }
      ]
    },

    plantas: {
      title:           "Nuestras Plantas",
      subtitle:        "13 Plantas de Producción",
      map_img:         "/images/about/mexico_map.png",
      layer_michoacan: "/images/about/michoacan_layer.png",
      layer_monterrey: "/images/about/monterrey_layer.png",
      layer_both:      "/images/about/both_states_layer.png",
      locations: [
        { key: "monterrey", number: "1 PLANTA",   badge: "Monterrey, Nuevo León" },
        { key: "michoacan", number: "12 PLANTAS", badge: "Morelia, Michoacán"    }
      ]
    },

    instalaciones: {
      title_white:  "NUESTRAS",
      title_orange: "INSTALACIONES",
      subtitle:     "Recorridos Virtuales 360°",
      badge_soon:   "Próximamente",
      badge_tour:   "Ver recorrido",
      btn_tour:     "Ver Recorrido 3D",
      btn_soon:     "Próximamente",
      items: [
        { id: "extrusoras", num: "01", title: "Stretch Film",         tag: "Morelia, Mich.", desc: "Líneas de extrusión de alta capacidad donde el polipropileno se transforma en hilo plano de precisión.",                   thumb: "/images/virtual/RT.webp", link: "https://my.matterport.com/show/?m=YoM2tyXMeyb&ss=2&sr=2.97,.12&play=1&qs=1&ts=1", soon: true  },
        { id: "telares",    num: "02", title: "Arpillas",             tag: "Morelia, Mich.", desc: "Telares de última generación que tejen el hilo para producir tela de polipropileno con máxima uniformidad.",               thumb: "/images/virtual/RA.webp", link: "https://my.matterport.com/show/?m=2xCe1VajMjj&ss=1&sr=2.28,-1.47&play=1&qs=1&ts=1", soon: false },
        { id: "laminado",   num: "03", title: "Laminado e Impresión", tag: "Morelia, Mich.", desc: "Área de laminado y flexografía donde los sacos reciben acabados, impresión y tratamiento final de calidad.",               thumb: "/images/virtual/RS.webp", link: "", soon: true  },
        { id: "reciclado",  num: "04", title: "Planta de Reciclado",  tag: "Morelia, Mich.", desc: "Nuestro centro de reciclado de polipropileno, comprometido con la economía circular y el medio ambiente.",                 link: "", soon: true  }
      ]
    },

    capacidad: {
      title:         "Capacidad Instalada",
      subtitle:      "Infraestructura de Alto Rendimiento",
      planta_label:  "PLANTA",
      plantas_label: "PLANTAS",
      items: [
        { num: "04", label: "Bolsas",                  width: 100, delay: 0   },
        { num: "02", label: "Arpillas",               width: 50,  delay: 100 },
        { num: "01", label: "Cuerda",                  width: 25,  delay: 200 },
        { num: "03", label: "Stretch Film",          width: 50,  delay: 300 },
        { num: "01", label: "Embalaje Flexible",       width: 25,  delay: 400 },
        { num: "01", label: "Reciclaje",               width: 25,  delay: 500 },
        { num: "03", label: "Esquineros",  width: 75,  delay: 600 },
        { num: "01", label: "Flete",                   width: 25,  delay: 700 },
        { num: "01", label: "Desechables",             width: 25,  delay: 800 },
        { num: "01", label: "Bolsas",                  width: 25,  delay: 900 }
      ]
    },

    valores: {
      title:    "Nuestros Valores",
      subtitle: "Los pilares de nuestra cultura",
      items: [
        { title: "Responsabilidad", description: "Cumplimos nuestros compromisos con ética y profesionalismo, siendo conscientes del impacto de nuestras acciones en clientes, colaboradores y comunidades." },
        { title: "Confianza",       description: "Construimos relaciones sólidas basadas en la transparencia, honestidad y cumplimiento de promesas, generando seguridad en cada interacción."              },
        { title: "Pasión",          description: "Amamos lo que hacemos y lo reflejamos en cada producto, proceso e innovación, impulsando la excelencia con entusiasmo y dedicación genuina."              },
        { title: "Perseverancia",   description: "Enfrentamos desafíos con determinación y constancia, manteniéndonos firmes en nuestros objetivos hasta alcanzar resultados extraordinarios."               },
        { title: "Disciplina",      description: "Seguimos procesos rigurosos y estándares de calidad con orden y método, garantizando consistencia y excelencia en cada entrega."                          },
        { title: "Proactividad",    description: "Anticipamos necesidades y tomamos acción antes de que surjan problemas, creando soluciones innovadoras que generan valor continuo."                        },
        { title: "Respeto",         description: "Valoramos la diversidad, dignidad y contribución de cada persona, fomentando un ambiente de colaboración, inclusión y trato equitativo."                  }
      ]
    }
  },

  // =================================================
  // FOOTER
  // =================================================
  footer: {
    about_us:         "Quiénes somos",
    about:            "Acerca de",
    social_impact:    "Impacto Social",
    customer_service: "Atención Cliente",
    be_distributor:   "Ser distribuidor",
    catalog:          "Catálogo",
    cta_button:       "Quiero ser Distribuidor",
    rights:           "Todos los derechos reservados."
  },

  // =================================================
  // PÁGINA: IMPACTO SOCIAL
  // =================================================
  impacto_social: {
    page_title: "Impacto Social | Grupo Ortiz",

    hero: {
      eyebrow:          "IMPACTO SOCIAL",
      title_top:        "Construimos Juntos",
      title_bottom:     "UN MUNDO MEJOR",
      subtitle:         "Apoyamos hogares, empoderamos mujeres, damos segundas oportunidades y cuidamos el planeta. Cada paso que damos busca transformar vidas y construir un futuro lleno de esperanza.",
      stat_female:      "% Plantilla Femenina",
      stat_recycled:    "Toneladas Recicladas",
      stat_initiatives: "Iniciativas Activas",
      video:            "/videos/waves2.mp4",
    },

    ods: {
      title:       "NUESTRO NORTE",
      subtitle:    "Agenda 2030",
      description: "Nos guiamos por los Objetivos de Desarrollo Sostenible de la ONU para construir un mundo más justo, próspero y sostenible.",
      cards: [
        { n: 1,  title: "Fin de la Pobreza",          link: "https://sdgs.un.org/es/goals/goal1",  img: "/images/odc/1.png"  },
        { n: 2,  title: "Hambre Cero",                link: "https://sdgs.un.org/es/goals/goal2",  img: "/images/odc/2.png"  },
        { n: 3,  title: "Salud y Bienestar",          link: "https://sdgs.un.org/es/goals/goal3",  img: "/images/odc/3.png"  },
        { n: 4,  title: "Educación de Calidad",       link: "https://sdgs.un.org/es/goals/goal4",  img: "/images/odc/4.png"  },
        { n: 5,  title: "Igualdad de Género",         link: "https://sdgs.un.org/es/goals/goal5",  img: "/images/odc/5.png"  },
        { n: 6,  title: "Agua Limpia",                link: "https://sdgs.un.org/es/goals/goal6",  img: "/images/odc/6.png"  },
        { n: 7,  title: "Energía Asequible",          link: "https://sdgs.un.org/es/goals/goal7",  img: "/images/odc/7.png"  },
        { n: 8,  title: "Trabajo Decente",            link: "https://sdgs.un.org/es/goals/goal8",  img: "/images/odc/8.png"  },
        { n: 9,  title: "Industria e Innovación",     link: "https://sdgs.un.org/es/goals/goal9",  img: "/images/odc/9.png"  },
        { n: 10, title: "Reducción de Desigualdades", link: "https://sdgs.un.org/es/goals/goal10", img: "/images/odc/10.png" },
        { n: 11, title: "Ciudades Sostenibles",       link: "https://sdgs.un.org/es/goals/goal11", img: "/images/odc/11.png" },
        { n: 12, title: "Producción Responsable",     link: "https://sdgs.un.org/es/goals/goal12", img: "/images/odc/12.png" },
        { n: 13, title: "Acción por el Clima",        link: "https://sdgs.un.org/es/goals/goal13", img: "/images/odc/13.png" },
        { n: 14, title: "Vida Submarina",             link: "https://sdgs.un.org/es/goals/goal14", img: "/images/odc/14.png" },
        { n: 15, title: "Vida de Ecosistemas",        link: "https://sdgs.un.org/es/goals/goal15", img: "/images/odc/15.png" },
        { n: 16, title: "Paz y Justicia",             link: "https://sdgs.un.org/es/goals/goal16", img: "/images/odc/16.png" },
        { n: 17, title: "Alianzas para Lograrlos",    link: "https://sdgs.un.org/es/goals/goal17", img: "/images/odc/17.png" },
      ]
    },

    vision: {
      title:        "NUESTRO IMPACTO",
      title_orange: "POSITIVO",
      subtitle:     "Transformamos la industria",
      pilars: [
        {
          label: "PILAR 01",
          title: "PRODUCTOS DE LA TIERRA",
          desc:  "Desarrollo de materiales innovadores y ecológicos para empaques flexibles que respetan el medio ambiente y reducen la huella de carbono.",
          img:   "/images/impacto/products.webp"
        },
        {
          label: "PILAR 02",
          title: "PRÁCTICAS DE LA TIERRA",
          desc:  "Manufactura limpia y economía circular en todos nuestros procesos productivos, cerrando ciclos y eliminando desperdicios.",
          img:   "/images/impacto/practices.webp"
        },
        {
          label: "PILAR 03",
          title: "TIERRA SOCIAL",
          desc:  "Compromiso integral con clientes, empleados y comunidades, generando impacto social positivo y oportunidades reales.",
          img:   "/images/impacto/social.webp"
        }
      ]
    },

    oceanos: {
      hero_title:           "Comprometidos con un futuro",
      hero_title_highlight: "más limpio para nuestros océanos",
      hero_video:           "/videos/waves.mp4",
      intro: "En Grupo Ortiz, creemos en un mundo donde los océanos vuelvan a brillar. Al apoyar iniciativas globales como The Ocean Cleanup y el Tom Ford Plastic Innovation Prize powered by Lonely Whale, trabajamos para reducir el plástico en nuestros mares. Cada compra que haces con nosotros es un paso hacia un planeta más limpio y un futuro sostenible para todos. ¡Juntos salvamos los océanos!",
      features: [
        { title: "Apoyamos la limpieza global",         desc: "Colaborando con iniciativas como The Ocean Cleanup."                         },
        { title: "Promovemos la innovación sostenible", desc: "A través de programas como el Tom Ford Plastic Innovation Prize."            },
        { title: "Fomentamos productos responsables",   desc: "que reducen el impacto ambiental en los océanos."                           },
        { title: "Inspiramos acción colectiva",         desc: "invitando a clientes y socios a ser parte del cambio."                      }
      ],
      partners: [
        {
          title:  "Innovación Tom Ford",
          desc:   "Esta iniciativa global busca revolucionar la industria del plástico al premiar y promover soluciones innovadoras que reemplacen los plásticos desechables. Su enfoque está en alternativas sostenibles y escalables que reduzcan el impacto ambiental, protejan los océanos y fomenten un cambio hacia materiales más responsables para el planeta.",
          btn:    "CONOCE MÁS",
          link:   "https://unwrapthefuture.org/",
          video:  "/videos/impacto/oceancleanup.mp4",
          poster: "/images/impacto/cultura-calidad.jpg"
        },
        {
          title:  "Limpieza del océano",
          desc:   "Dedicada a limpiar los océanos del mundo, esta organización desarrolla tecnología avanzada para eliminar plásticos acumulados en los mares y prevenir su llegada mediante la intervención en los ríos, principales fuentes de contaminación. Su misión es restaurar la salud de los ecosistemas marinos, protegiendo la biodiversidad y asegurando un futuro limpio para las próximas generaciones.",
          btn:    "CONOCE MÁS",
          link:   "https://theoceancleanup.com/",
          video:  "/videos/impacto/tomford.mp4",
          poster: "/images/impacto/tomford.webp"
        }
      ]
    },

    stats: {
      recycled: "Toneladas Recicladas",
      female:   "% Plantilla Femenina",
      families: "Familias Beneficiadas"
    },

    timeline: {
      title:    "INICIATIVAS QUE TRANSFORMAN",
      subtitle: "Impacto positivo duradero",
      items: [
        {
          num: "01", title: "HOGAR DE ESPERANZA",
          desc:       "Apoyo a Casa Hogar en Tacámbaro, Michoacán. Cada niño merece un hogar lleno de amor.",
          desc_short: "Apoyo a Casa Hogar en Tacámbaro, Michoacán.",
          img:        "/images/impacto/hogar.mp4",
          isVideo:    true,
          poster:     "/images/impacto/hogar.mp4"
        },
        {
          num: "02", title: "DESPENSA GO",
          desc:       "Unidos por la comunidad. Entrega de despensas con amor.",
          desc_short: "Entrega de despensas con amor a la comunidad.",
          img:        "/images/impacto/despensas.webp",
          isVideo:    false
        },
        {
          num: "03", title: "CERO HUELLA",
          desc:       "Política de cero desperdicios. Transformando residuos en oportunidades.",
          desc_short: "Política de cero desperdicios. Transformando residuos.",
          img:        "/images/impacto/composta.webp",
          isVideo:    false
        },
        {
          num: "04", title: "COMPOSTA VIVA",
          desc:       "Fabricación de productos compostables. Innovación que respeta la naturaleza.",
          desc_short: "Productos compostables. Innovación sustentable.",
          img:        "/images/impacto/GO.webp",
          isVideo:    false
        },
        {
          num: "05", title: "BRILLA GO",
          desc:       "Regalos por desempeño al equipo GO. Reconociendo el esfuerzo.",
          desc_short: "Reconocimiento al equipo GO por su desempeño.",
          img:        "/images/impacto/woman.webp",
          isVideo:    false
        },
        {
          num: "06", title: "MANOS QUE LIDERAN",
          desc:       "Plantilla 84% femenina. Empoderando mujeres líderes.",
          desc_short: "56.82% plantilla femenina. Empoderando líderes.",
          img:        "/images/impacto/bio.webp",
          isVideo:    false
        }
      ]
    },

    cta: {
      title:        "Juntos",
      title_orange: "Transformamos",
      desc:         "Somos el socio estratégico que tu empresa necesita para crecer con tecnología, experiencia y resultados.",
      contact:      "Contáctanos",
      products:     "Ver Productos"
    }
  },

  // =================================================
  // PÁGINA: HOME (Index)
  // =================================================
  home: {
    meta_title: "Grupo Ortiz | Fabricante de Polímeros y Empaques en México",
    meta_description: "Más de 65 años fabricando stretch film, sacos, cuerdas, rafia, arpillas y empaques flexibles. Líder en polímeros plásticos en México y Latinoamérica.",
    hero: {
      eyebrow:      "Desde 1959",
      title_top:    "SOMOS EL PRINCIPAL",
      title_bot:    "FABRICANTE DE LATINOAMÉRICA",
      video: "home_zv3jjz",
      subtitle:     "Más de 65 años fabricando soluciones de alta ingeniería para industrias en los cinco continentes.",
      btn_products: "Nuestros Productos",
      btn_about:    "Conocer Más",
      stats: [
        { number: 65,   label: "Años de Experiencia" },
        { number: 3000, prefix: "+", label: "Colaboradores" },
        { number: 5,    prefix: "",  label: "Continentes"   }
      ]
    },

    divisiones: {
      tag:       "Nuestras Divisiones",
      title:     "áreas de",
      title_em:  "especialización",
      link_text: "Ver productos",
      items: [
        { title: "Arpilla",          tag: "División 01", description: "Sacos de malla de rafia de polipropileno en tejido plano y circular. Diseño ventilado ideal para frutas, verduras y productos agrícolas.",                     img: "/images/divisiones/arpilla.webp",           color: "#2d8a4e", slug: "arpillas",           soon: false },
        { title: "Cuerda",           tag: "División 02", description: "Cuerdas de polipropileno de alta tenacidad para usos agrícolas, industriales y marinos. Gran resistencia a la intemperie y filtro UV incorporado.",            img: "/images/divisiones/cuerdas.webp",           color: "#1a5f8a", slug: "cuerdas",            soon: false },
        { title: "Rafia",            tag: "División 03", description: "Rafia de polipropileno de alto rendimiento. Gran ligereza, alta resistencia a la rotura y versatilidad para agricultura, avicultura y horticultura.",          img: "/images/divisiones/rafia.webp",             color: "#8a6d2d", slug: "rafias",             soon: false },
        { title: "Empaque Flexible", tag: "División 04", description: "Películas de alta barrera y laminación especializada. Protección óptima para alimentos y productos industriales con tecnología de vanguardia.",               img: "/images/divisiones/bolsa.webp",             color: "#0d7377", slug: "empaques-flexibles", soon: false },
        { title: "Saco",             tag: "División 05", description: "Sacos de rafia de calidad superior. Solución de envasado robusta para alimentos, productos químicos, fertilizantes y productos a granel.",                    img: "/images/divisiones/sacos.webp",             color: "#3a7d44", slug: "sacos",              soon: false },
        { title: "Stretch film",     tag: "División 06", description: "Película estirable de alta claridad óptica. Asegura la integridad de la carga con eficiencia en costos. Incluye opción biodegradable.",                       img: "/images/divisiones/film-estirable.webp",    color: "#2c5f8a", slug: "stretch-film",       soon: false },
        { title: "Esquinero",        tag: "División 07", description: "Esquineros de cartón kraft para protección de bordes durante el almacenamiento y transporte. Distribución uniforme de presión y máxima estabilidad de carga.", img: "/images/divisiones/esquineros.webp",        color: "#7b3fa0", slug: "esquineros",         soon: false },
        { title: "Desechable",       tag: "División 10", description: "Productos desechables de polipropileno para uso industrial, alimentario y hospitalario. Soluciones higiénicas, económicas y de alta resistencia.",            img: "/images/divisiones/desechables.webp",       color: "#e05500", slug: "desechables",        soon: true  }
      ]
    },

    porque: {
      tag:           "Por qué elegirnos",
      title:         "Más de 65 años",
      title_em:      "de liderazgo",
      body:          "Somos referente en la industria de polímeros plásticos en México y Latinoamérica, con procesos certificados y capacidad de respuesta global.",
      btn:           "Nuestra Historia",
      badge1_label:  "Unidades de Negocio",
      badge1_number: 13,
      badge2_label:  "Divisiones",
      badge2_number: 6,
      img:           "/images/home/planta-produccion.webp",
      features: [
        { title: "Calidad Certificada",  description: "Productos que cumplen con los más altos estándares internacionales de manufactura."  },
        { title: "Innovación Constante", description: "Inversión permanente en I+D para mantener el liderazgo tecnológico del sector."       },
        { title: "Alcance Global",       description: "Presencia activa en 5 continentes con una red de distribución eficiente."            }
      ]
    },

    certs: {
      tag:      "Calidad Garantizada",
      title:    "Nuestras",
      title_em: "Certificaciones",
      items: [
        { code: "Kosher Pareve",     name: "KMD México",     img: "/images/certificaciones/KOSHER.jpeg"   },
        { code: "FSSC 22000",        name: "LRQA Certified", img: "/images/certificaciones/LRQA.png"      },
        { code: "AIB International", name: "Since 1919",     img: "/images/certificaciones/AIB.png"       },
        { code: "ISO 9001",          name: "Bureau Veritas", img: "/images/certificaciones/CERTIFIED.png" }
      ]
    },

    compromiso: {
      card1: {
        eyebrow: "Nuestro Enfoque",
        title:   "Innovación",
        text:    "Invertimos en I+D para ofrecer productos que superen las expectativas del mercado global con tecnología de vanguardia."
      },
      card2: {
        eyebrow: "Nuestro Compromiso",
        title:   "Sustentabilidad",
        text:    "Procesos responsables con el medio ambiente, programas activos de reciclaje y reducción de huella de carbono en toda la cadena."
      }
    },

    global: {
      tag:      "Presencia Global",
      title:    "Exportamos al",
      title_em: "mundo",
      desc:     "Nuestros productos llegan a clientes en más de 30 países, consolidando nuestra posición como líderes en polímeros plásticos.",
      video: "camion_n1nitn",
      stats: [
        { number: 65,   label: "Años"        },
        { number: 30,   prefix: "+", label: "Países"      },
        { number: 3000, prefix: "+", label: "Personas"    },
        { number: 5,    prefix: "",  label: "Continentes" }
      ]
    },

    cta: {
      tag:      "¿Listo para comenzar?",
      title:    "Trabajemos",
      title_em: "juntos",
      sub:      "Descubre cómo nuestras soluciones pueden transformar tu operación",
      btn:      "Contáctanos"
    }
  }

};