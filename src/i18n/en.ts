// src/i18n/en.js

export const en = {
  // =================================================
  // NAVIGATION BAR
  // =================================================
  nav: {
    home: 'Home',
    products: 'Products',
    catalog: 'Catalog',
    promos: 'Promotions',
    about: 'About',
    company: 'The Company',
    social: 'Social Impact',
    distributor: 'Distributor',
    contact: 'Contact'
  },

  // =================================================
  // HERO / GENERAL COVER
  // =================================================
  hero: {
    title: "Welcome",
    subtitle: "Quality that lasts"
  },

  // =================================================
  // COMMON TEXTS
  // =================================================
  common: {
    seeMore: "See more",
    division: "Division",
    buy: "Buy",
    redirecting: "Redirecting...",
    download: "Download",
    language: "Language",
    scrollDown: "Scroll down",
    previous: "Previous",
    next: "Next"
  },

  // =================================================
  // CHATBOT (BotGo)
  // =================================================
  chatbot: {
    greeting: 'Hi! I\'m BotGo 🤖. How can I help you today?',
    placeholder: 'Type a message...',
    listeningState: 'Listening...',
    thinking: 'Thinking...',
    errorMsg: 'Connection error.',
    salesBtn: 'Quote via WhatsApp',
    voiceAssistantTitle: 'Virtual Assistant',
    voiceCode: 'en-US',
    waStart: 'Hello Grupo Ortiz, I would like a quote',
    pdfBtn: 'View PDF catalog',
  },

  pwa: {
    appName: "Grupo Ortiz",
    title: "Install GO App",
    description: "Quick access from your home screen",
    install: "Install",
    notNow: "Not now",
    timeLabel: "now"
  },

  // =================================================
  // PROMOTIONS PAGE
  // =================================================
  promociones: {
    meta_title: "Promotions | Grupo Ortiz",
    hero: {
      label: "SPECIAL OFFERS",
      title: "PROMOTIONS",
      subtitle: "Take advantage of our limited-time offers",
      validity: "Valid while supplies last*"
    },
    discount_badge: "UP TO",
    off_text: "OFF",
    original_price: "Before",
    promo_price: "Special Price",
    buy_button: "Request Quote",
    contact_cta: "Contact an advisor for more information",
    valid_until: "Valid while supplies last*",

    products: [
      {
        id: "promo-stretch",
        name: "Stretch Film",
        subtitle: "$33 PER KG ON COLORED STRETCH",
        image: "/images/stretch/manual.webp",
        discount: 35,
        originalPrice: "",
        promoPrice: "$33/KG",
        features: [
          "Colored stretch film",
          "Special price per kilogram",
          "Limited stock",
          "Available in various colors"
        ],
        validUntil: "Valid while supplies last*"
      },
      {
        id: "promo-cuerda",
        name: "Rope",
        subtitle: "$33 PER KG",
        image: "/images/cuerdas/CuerdaT1.webp",
        discount: 25,
        originalPrice: "",
        promoPrice: "$33/KG",
        features: [
          "High-quality rope",
          "Special price per kilogram",
          "Limited-time offer",
          "Availability subject to stock"
        ],
        validUntil: "Valid while supplies last*"
      }
    ]
  },

  // =================================================
  // CATALOG PAGE
  // =================================================
  catalog: {
    hero: {
      label: "DOCUMENTATION",
      title: "GENERAL CATALOG",
      description: "Quality and integrated solutions in a single document. Select your preferred language to access our corporate presentation.",
      scrollText: "VIEW DIVISIONS"
    },
    carousel: {
      label: "AVAILABLE DOWNLOADS",
      title: "CATALOG BY DIVISION",
    },
    languageLabel: "Language / Idioma",
    downloadButton: "DOWNLOAD PDF",
    divisions: [
      {
        id: "1",
        name: "STRETCH FILM",
        desc: "Stretch film to secure and protect loads. Efficient solution for palletizing and safe transport.",
        image: "/images/catalogo/img1.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1HYGcpgkRO_7OX22IcWvRpzpLZKgpYV3A/view?usp=sharing",
          en: "https://drive.google.com/file/d/1QZ6jmKyc-CGLwh9brbeZSQ5OOzkKdBCQ/view?usp=sharing",
        }
      },
      {
        id: "2",
        name: "ROPE",
        desc: "Strength and durability for industrial and fishing lashing. Made with high-quality materials for intensive use.",
        image: "/images/catalogo/img2.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/14GrV9P1ViQKvFp3BucYjgmryRgWKLEZh/view?usp=sharing",
          en: "https://drive.google.com/file/d/19Tvd_VHjogSE7y7cLZYr4ra__4vB4nOm/view?usp=sharing",
        }
      },
      {
        id: "3",
        name: "RAFFIA",
        desc: "The standard in fastening for agriculture and industry. Resistant and flexible material for multiple applications.",
        image: "/images/catalogo/img3.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1uAiR4uxO2iX_LsNFul6kXeb7jnnCEV_J/view?usp=sharing",
          en: "https://drive.google.com/file/d/10PV-sxexE8UkFSOhdTJBe1xWCy_tdFib/view?usp=sharing",
        }
      },
      {
        id: "4",
        name: "MESH BAG",
        desc: "Open mesh fabric for maximum agricultural ventilation. Versatile solutions for packaging and transporting field products.",
        image: "/images/catalogo/img4.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1OQKGpnRCfA2yFdAlT6q7GczYua2FFFVU/view?usp=sharing",
          en: "https://drive.google.com/file/d/1wldGL6XuqH-Ruth9Y01-hkNnPlbg9SW5/view?usp=sharing",
        }
      },
      {
        id: "5",
        name: "SACK",
        desc: "Flat woven polypropylene for bulk packaging. Superior strength for bulk products.",
        image: "/images/catalogo/img5.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/16S43-PUrQECO9q2J1fOgbN-YeIxQ2GhP/view?usp=sharing",
          en: "https://drive.google.com/file/d/1fkZvAWTT3mnBkxQ0Gbb2kRgOoN2dJZiK/view?usp=sharing",
        }
      },
      {
        id: "6",
        name: "CORNER BOARD",
        desc: "Structural protection and stability for pallets. Essential reinforcement in logistics and cargo storage.",
        image: "/images/catalogo/img6.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/181Hvr0HQffLU3rmcXkccYoqj-Y_A-gxr/view?usp=sharing",
          en: "https://drive.google.com/file/d/1DdcEavACvuY00oyMyC9rOWRybi9jnQrD/view?usp=sharing",
        }
      },
      {
        id: "7",
        name: "FLEXIBLE",
        desc: "High-barrier films and specialized lamination. Optimal protection for food and industrial products.",
        image: "/images/catalogo/img7.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1TGxUcGHjW1NHF8K8YkRisbRE8uAuTnPO/view?usp=sharing",
          en: "https://drive.google.com/file/d/126eYsoqq9WI1SR-zoMdQJE7HS8cJR48m/view?usp=sharing",
        }
      }
    ]
  },

  // =================================================
  // MAIN LIST (Carousel /products)
  // =================================================
  products_list: [
    {
      img: "carrusel/img1.webp",
      division: "STRETCH FILM",
      descripcion: "High optical clarity stretch film meeting quality standards. Ensures load integrity and cost efficiency. Our line includes a Biodegradable option, formulated to degrade 90% faster.",
      slug: "stretch-film",
      video: "carrusel/stretch-film.mp4"
    },
    {
      img: "carrusel/img2.webp",
      division: "ROPE",
      descripcion: "High-performance Polypropylene (PP) filament rope. The perfect balance: extreme lightness without sacrificing break resistance.",
      slug: "cuerdas",
      video: "carrusel/cuerdas.mp4"
    },
    {
      img: "carrusel/img3.webp",
      division: "RAFFIA",
      descripcion: "High-performance Polypropylene (PP) film raffia. Very lightweight and highly break-resistant. Flexible and versatile.",
      slug: "rafias",
      video: "carrusel/rafia.mp4"
    },
    {
      img: "carrusel/img4.webp",
      division: "MESH BAG",
      descripcion: "Polypropylene raffia mesh sacks in flat weave with reinforced 'L'-type stitching. Ventilated design ideal for fruits and vegetables.",
      slug: "arpillas",
      video: "carrusel/arpillas.mp4"
    },
    {
      img: "carrusel/img5.webp",
      division: "SACK",
      descripcion: "Premium quality raffia sacks. Robust packaging solution for food, chemicals and fertilizers.",
      slug: "sacos",
      video: "carrusel/sacos.mp4"
    },
    {
      img: "carrusel/img6.webp",
      division: "CORNER BOARD",
      descripcion: "Cardboard corner boards to optimize logistics. Structural strength and greater load stability.",
      slug: "esquineros",
      video: "carrusel/esquineros.mp4"
    },
    {
      img: "carrusel/img7.webp",
      division: "FLEXIBLE",
      descripcion: "Neo Empaques International specializes in advanced flexible packaging solutions, designed to optimize the preservation and presentation of products across multiple industries.",
      slug: "empaques-flexibles",
      video: "carrusel/bobina-impresa.mp4"
    }
  ],

  // =================================================
  // PAGE: STRETCH FILM
  // =================================================
  stretch_film: {
    meta_title: "Stretch Film | Grupo Ortiz",
    back_aria: "Back to products",
    specs_title: "TECHNICAL SPECIFICATIONS",

    specs_labels: {
      width: "Width",
      length: "Length",
      gauge: "Gauge/Microns",
      weight: "Roll Weight",
      type: "Usage"
    },

    products: [
      {
        name: 'PREMIUM STRETCH',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "Designed for manual palletizing, this moderate-stretch film offers a practical and efficient solution for securing loads without the need for automatic machinery. Its composition guarantees good resistance and reliable performance in packaging processes.",
        specs_values: { width: "19-30 cm", length: "1000-15000", gauge: "40-110", weight: "10-40 kg", type: "Manual" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      },
      {
        name: 'AUTOMATIC',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "Designed for use with low- and medium-speed wrapping machines, this stretch film offers high performance and excellent results in automated palletizing processes. Its formulation guarantees resistance and stability in load securing.",
        specs_values: { width: "18-30 cm", length: "2000-15000", gauge: "50-110", weight: "10-49 kg", type: "Automatic" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      },
      {
        name: 'PRE-STRETCHED MANUAL',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "Designed for high-performance manual application, this pre-stretched film stands out for offering one of the thinnest gauges on the market. Its technology eliminates the need to apply extra force when wrapping, enabling immediate use and improving efficiency in the palletizing process.",
        specs_values: { width: "16-17 cm", length: "7000-25000", gauge: "40-120", weight: "10-40 kg", type: "Manual" },
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
        description: "Designed for manual wrapping with moderate stretch, this traditional stretch film offers excellent performance in packaging and load securing processes. Its composition guarantees resistance and stability in general applications.",
        specs_values: { width: "3-12 cm", length: "7000-25000", gauge: "40-120", weight: "10-40 kg", type: "Manual" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/manual.png',
          '/images/stretch/rigido3.png'
        ]
      },
      {
        name: 'RIGID MANUAL',
        img: '/images/stretch/rigido.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "Specially formulated for manual wrapping applications with limited stretch, this stretch film offers high performance and great reliability in packaging processes. Its composition guarantees stability and efficiency in load securing.",
        specs_values: { width: "17-30 cm", length: "1000-15000", gauge: "40-90", weight: "10-40 kg", type: "Manual", color: "Black/Color" },
        gallery: [
          '/images/stretch/rigido2.png',
          '/images/stretch/rigido.png',
          '/images/stretch/rigido3.png'
        ]
      }
    ]
  },

  // =================================================
  // PAGE: ROPES
  // =================================================
  cuerdas: {
    meta_title: "Ropes | Grupo Ortiz",
    back_aria: "Back",
    loading: "Loading...",
    specs_title: "TECHNICAL SPECIFICATIONS",

    specs_labels: {
      load: "Yield",
      mat: "Material",
      weight: "Weight",
      resist: "Resistance",
      charge: "Presentation"
    },

    products: [
      {
        name: 'HARDWARE ROPE',
        img: '/images/cuerdas/CuerdaT1.webp',
        video: "/videos/cuerdas/cuerda-1.mp4",
        link: '#',
        description: "Made with polypropylene and an advanced UV filter, this rope is ideal for activities with high sun exposure. Its specialized formulation slows natural wear and extends its service life, guaranteeing greater resistance and durability against the elements. It is the perfect hardware rope for providing firmness, safety and reliable performance in general applications and demanding tasks.",
        specs_values: { load: "1,980 m", mat: "PP-UV", weight: "18 kg", resist: "175 kg", charge: "4-19 mm" },
        gallery: [
          '/images/cuerdas/CuerdaT1-2.png',
          '/images/cuerdas/CuerdaT1.webp',
          '/images/cuerdas/CuerdaT1-1.png'
        ]
      },
      {
        name: 'GREENHOUSE ROPE',
        img: '/images/cuerdas/CuerdaNegra.webp',
        video: "/videos/cuerdas/CuerdaI.mp4",
        link: '#',
        description: "Made with polypropylene (PP) and a UV stabilizer, this rope is ideal for the maritime sector and activities with high sun exposure. Its specialized formulation slows degradation caused by ultraviolet radiation, extending its service life and guaranteeing greater weather resistance. It is the perfect solution for providing firmness and stability in agricultural macrotunnels.",
        specs_values: { load: "3,240 m", mat: "PP-UV", weight: "18 kg", resist: "105 kg", charge: "3-8 mm" },
        gallery: [
          '/images/cuerdas/CuerdaNegra6-1.png',
          '/images/cuerdas/CuerdaNegra.webp',
          '/images/cuerdas/CuerdaNegra6-3.png'
        ]
      },
      {
        name: 'ECO ROPE',
        img: '/images/cuerdas/CuerdaEco.png',
        video: "/videos/cuerdas/CuerdaE.mp4",
        link: '#',
        description: "Made from high-quality polypropylene (PP), this rope offers a wide variety of presentations, gauges and colors, available in plain or combined versions, reinforced or branded. Its versatility and resistance make it a reliable option for multiple applications, for use in industries, factories, warehouses, wholesale markets, hardware stores, workshops and machining areas.",
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
  // PAGE: RAFFIA
  // =================================================
  rafias: {
    meta_title: "Raffia | Grupo Ortiz",
    back_aria: "Back",
    specs_title: "TECHNICAL SPECIFICATIONS",

    specs_labels: {
      cal: "Gauge",
      yield: "Yield m",
      resist: "Resistance kg",
      usage: "Material"
    },

    products: [
      {
        name: "TYING RAFFIA",
        description: "Made from 100% virgin polypropylene, this raffia offers high resistance and excellent yield, maintaining its physical properties even in outdoor conditions. Its quality guarantees durability and reliable performance in demanding applications. It is widely used in the agricultural, poultry and horticulture sectors.",
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
        name: "ECO RAFFIA",
        description: "Made from high-quality polypropylene, this raffia offers excellent resistance and maintains its physical properties even in outdoor conditions. Its reliable yield makes it an ideal option for agricultural, poultry and horticulture applications.",
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
        name: "BLACK FIBRILLATED RAFFIA",
        description: "Made from high-quality polypropylene, this raffia offers great resistance and maintains its physical properties even in outdoor conditions. Its excellent yield makes it ideal for industrial, hardware and packaging applications, as well as for the agricultural, poultry and horticulture sectors.",
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
  // PAGE: MESH BAGS (ARPILLAS)
  // =================================================
  arpillas: {
    meta_title: "Mesh Bags | Grupo Ortiz",
    back_aria: "Back",
    specs_title: "TECHNICAL SPECIFICATIONS",

    specs_labels: {
      construction: "Construction",
      sizes: "Width",
      colors: "Colors",
      features: "Closure type"
    },

    products: [
      {
        name: 'CIRCULAR MESH BAG',
        img: '/images/arpillas/arpilla.png',
        video: "/videos/arpilla/circular.mp4",
        link: '#',
        description: "Made from 100% virgin polypropylene with raffia construction, this mesh bag offers high resistance and excellent yield in packaging and storage applications. Its quality guarantees durability and reliable performance in handling various products.",
        specs_values: {
          sizes: "23-70 cm",
          colors: "4",
          features: "Drawstring"
        },
        gallery: [
          '/images/arpillas/circular2.png',
          '/images/arpillas/arpilla.png',
          '/images/arpillas/circular3.png'
        ]
      },
      {
        name: 'MONOFILAMENT MESH BAG',
        img: '/images/arpillas/arpilla2.png',
        video: "/videos/arpilla/mono.mp4",
        link: '#',
        description: "Made from 100% virgin polypropylene with raffia/monofilament construction, this mesh bag offers high resistance and excellent yield in packaging and storage applications. Its structure provides durability and reliable performance in handling and protecting various products.",
        specs_values: {
          construction: "Monofilament",
          sizes: "23-70 cm",
          colors: "2",
          features: "Drawstring"
        },
        gallery: [
          '/images/arpillas/mono2.png',
          '/images/arpillas/arpilla2.png',
          '/images/arpillas/mono3.png'
        ]
      },
      {
        name: 'SIDE-SEWN MESH BAG',
        img: '/images/arpillas/arpilla3.png',
        video: "/videos/arpilla/costura.mp4",
        link: '#',
        description: "Made from 100% virgin polypropylene with raffia/monofilament construction, this mesh bag offers high resistance and excellent performance in packaging and storage applications. Its structure guarantees durability and reliability in handling different products.",
        specs_values: {
          type: "Lateral",
          construction: "Monofilament",
          sizes: "23-60 cm",
          colors: "4",
          features: "Reinforced"
        },
        gallery: [
          '/images/arpillas/lateral1.png',
          '/images/arpillas/arpilla3.png',
          '/images/arpillas/lateral3.png'
        ]
      },
      {
        name: 'LAMINATED LABEL MESH BAG',
        img: '/images/arpillas/arpilla4.png',
        video: "/videos/arpilla/etiqueta.mp4",
        link: '#',
        description: "Made from 100% virgin polypropylene with raffia/raffia construction, this mesh bag offers high resistance and excellent performance in packaging and storage processes. Its weave guarantees durability and reliability for demanding applications in both domestic and export markets.",
        specs_values: {
          type: "Laminated",
          construction: "Raffia",
          sizes: "23-70 cm",
          colors: "4",
          features: "Drawstring"
        },
        gallery: [
          '/images/arpillas/laminado1.png',
          '/images/arpillas/arpilla4.png',
          '/images/arpillas/laminado3.png'
        ]
      }
    ]
  },

  // =================================================
  // PAGE: SACKS
  // =================================================
  sacos: {
    meta_title: "Sacks | Grupo Ortiz",
    back_aria: "Back to products",
    specs_title: "TECHNICAL SPECIFICATIONS",

    specs_labels: {
      load: "Width",
      unit: "Length",
      mat: "Material",
      weight: "Resistance"
    },

    products: [
      {
        name: 'UNLAMINATED RAFFIA SACK',
        img: '/images/sacos/saco2.png',
        model: '/models/saco_blanco.glb',
        video: "/videos/saco/slaminar.mp4",
        link: '#',
        description: "Made with interlaced polypropylene tapes, unlaminated raffia sacks offer great strength and excellent durability in packaging and storage applications. Their structure can withstand heavy loads without breaking, guaranteeing reliable performance in demanding tasks.",
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
        name: 'TRANSPARENT SACK',
        img: '/images/sacos/saco.png',
        video: "/videos/saco/transp.mp4",
        link: '#',
        description: "Made with polypropylene tapes and a transparent finish, these sacks offer high resistance and allow excellent visibility of the packaged product. Their structure guarantees durability and reliable performance in storage and transport applications.",
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
        name: 'ECO RAFFIA SACK',
        img: '/images/sacos/saco3.png',
        video: "/videos/saco/eco.mp4",
        link: '#',
        description: "Made from recycled material sourced from the waste of the same production process, these sacks offer strength and good durability at a more accessible cost. Their manufacture allows reliable performance in general packaging and storage applications.",
        specs_values: {
          load: "30-80 kg",
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
  // PAGE: CORNER BOARDS
  // =================================================
  esquineros: {
    meta_title: "Corner Boards | Grupo Ortiz",
    back_aria: "Back",
    specs_title: "TECHNICAL SPECIFICATIONS",

    specs_labels: {
      tab:      "Flange",
      thick:    "Thickness",
      length:   "Length",
      tabyd:    "Flange (yd)",
      thickyd:  "Thickness (yd)",
      lengthyd: "Length (yd)"
    },

    products: [
      {
        name: "BROWN KRAFT CORNER BOARD",
        description: "Manufactured to protect edges and corners during transport and storage, this corner board distributes pressure evenly, preventing deformation and damage to goods. Its structure offers resistance and stability in demanding packaging applications.",
        img: "/images/esquinero/esquinero.png",
        video: "/videos/esquinero/esquinero.mp4",
        link: "#",
        specs_values: {
          tab:    "1.5",
          thick:  "0.08",
          length: "11.81"
        },
        gallery: [
          '/images/esquinero/esquinero2.png',
          '/images/esquinero/esquinero.png',
          '/images/esquinero/esquinero3.png'
        ]
      },
      {
        name: "WHITE KRAFT CORNER BOARD",
        description: "Manufactured to protect edges and corners during transport and storage, this corner board distributes pressure evenly, preventing deformation and damage to goods. Its structure offers resistance and stability in demanding packaging applications.",
        img: "/images/esquinero/esquinerob.png",
        video: "/videos/esquinero/esquinero.mp4",
        link: "#",
        specs_values: {
          tab:    "1.5",
          thick:  "0.08",
          length: "11.81"
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
  // PAGE: FLEXIBLE PACKAGING
  // =================================================
  flexible_packaging: {
    meta_title: "Flexible Packaging | Grupo Ortiz",
    back_aria: "Back to products",
    specs_title: "TECHNICAL SPECIFICATIONS",

    specs_labels: {
      lamination: "Lamination",
      finish:     "Finish",
      size:       "Size up to",
      zipper:     "Zipper",
      type:       "Type"
    },

    products: [
      {
        name: "PRINTED ROLL",
        description: "Our rolls feature a wide variety of laminations, gauges and finishes. With printing options up to 10 inks and 133 lines per inch. Maximum development: 1,140 mm. Maximum print width: 1,450 mm. Compatible with automatic packaging machinery to optimize production efficiency.",
        img: "/images/flexible/bobina-impresa.png",
        video: "/videos/flexible/bobinaf.mp4",
        gallery: [
          "/images/flexible/bobina-impresa-1.png",
          "/images/flexible/bobina-impresa.png",
          "/images/flexible/bobina-impresa-3.png"
        ],
        specs_values: {
          lamination: "3 Types",
          finish:     "Varied",
          size:       "1,450 mm",
          zipper:     "N/A",
          type:       "Roll"
        }
      },
      {
        name: "STAND UP POUCH BAG",
        description: "Versatile stand-up pouch bags with laminated structure and high barrier against moisture and oxygen. Ideal for dry or wet food, powders, liquids, cosmetics and chemicals. Available in Natural, Matte and Metallic finishes, in sizes from 150 g to 1 kg, with optional zipper closure and window.",
        img: "/images/flexible/standup-generica.png",
        video: "/videos/flexible/standup.mp4",
        gallery: [
          "/images/flexible/standup-generica-2.png",
          "/images/flexible/standup-generica.png",
          "/images/flexible/standup-generica-3.png"
        ],
        specs_values: {
          lamination: "Laminated",
          finish:     "3 Types",
          size:       "1 kg",
          zipper:     "Yes / No",
          type:       "Bag"
        }
      },
      {
        name: "STAND UP POUCH",
        description: "Line of bags with attractive decorative designs: Red Fruits, Flowers, Fruits, Wheat, Blue Gift and Pink Gift. Zipper closure, resistant structure and Natural or Metallic finishes. Available in sizes from 150 g to 1 kg. Ideal for those seeking high-quality, visually appealing packaging.",
        img: "/images/flexible/standup-origanics.png",
        video: "/videos/flexible/standup-origanics.mp4",
        gallery: [
          "/images/flexible/standup-origanics-2.png",
          "/images/flexible/standup-origanics.png",
          "/images/flexible/standup-origanics-3.png"
        ],
        specs_values: {
          lamination: "2 Types",
          finish:     "Gift",
          size:       "1 kg",
          zipper:     "Yes",
          type:       "Printed bag"
        }
      },
      {
        name: "HIGH VACUUM BAG",
        description: "Designed to maximize freshness and shelf life of meats, cheeses, cold cuts and fresh products. Its hermetic seal eliminates air, retains the product's natural properties and prevents loss of flavor, texture and quality. Made with high-resistance, high-barrier materials.",
        img: "/images/flexible/bolsa-alto-vacio.png",
        video: "/videos/flexible/bolsa-alto-vacio.mp4",
        gallery: [
          "/images/flexible/bolsa-alto-vacio-1.png",
          "/images/flexible/bolsa-alto-vacio.png",
          "/images/flexible/bolsa-alto-vacio-3.png"
        ],
        specs_values: {
          lamination: "Multilayer",
          finish:     "Clear",
          size:       "Product",
          zipper:     "No",
          type:       "Bag"
        }
      }
    ]
  },

  // =================================================
  // PAGE: DISTRIBUTOR (Full Landing)
  // =================================================
  distribuidor: {
    meta_title: "Grupo Ortiz Distributor | Official Partner",
    hero: {
      subtitle: "Wholesale Portal",
      title: "Multiply <br>your <span>Profits</span>",
      desc: "Distribute high-demand products backed by the leading manufacturer. Guaranteed stock, no middlemen and 24h logistics.",
      cta: "Get Started"
    },
    cards: [
      { icon: "ri-stack-line",        title: "Full Stock",    desc: "Capacity to fulfill large orders instantly. Your warehouse always full." },
      { icon: "ri-truck-line",        title: "24h Shipping",  desc: "Our own logistics. Your customers don't wait — we deliver in record time." },
      { icon: "ri-shield-check-line", title: "Guarantee",     desc: "Physical exchanges without bureaucracy or questions. Full brand support." },
      { icon: "ri-line-chart-line",   title: "Better Margin", desc: "Factory-direct prices designed to maximize your net profit." }
    ],
    stats: [
      { val: 25, symbol: "k", label: "Monthly Tons"   },
      { val: 35, symbol: "+", label: "Years of History" },
      { val: 15, symbol: "M", label: "Total Sales"     }
    ],
    form: {
      title: "Registration <br>Request",
      desc: "Join the network. Complete your profile to be assigned a territory and preferential price list.",
      support_label: "DIRECT SUPPORT",
      labels: {
        name:     "Contact Name",
        business: "Company Name",
        whatsapp: "WhatsApp",
        email:    "Email Address",
        products: "PRODUCTS OF INTEREST"
      },
      products_list: ["Sacks", "Flexible", "Raffia", "Corner Board", "Ropes", "Stretch", "Other", "All"],
      btn:         "SUBMIT REQUEST",
      success_msg: "Request Sent"
    }
  },

  // =================================================
  // PAGE: ABOUT US
  // =================================================
  quienes_somos: {
    meta_title: "About Us | Grupo Ortiz",

    timeline: {
      title_white:   "OUR",
      title_orange:  "HISTORY",
      nav_prev:      "Previous",
      nav_next:      "Next",
      video_bg:      "/videos/background.mp4",
      video_bg_webm: "",
      video_poster:  "",
      events: [
        { year: "1959", title: "The Beginning",           short: "Founded in Morelia",      img: "/images/tiempo/timeline-1959.webp",  description: "Since 1959, Grupo Ortiz has been part of Mexico's industrial development. Founded in Morelia by Nicandro Ortiz, the group was born with a clear vision: to combine cutting-edge technology with the talent and dedication of its people to build a solid, innovative company committed to quality." },
        { year: "1970", title: "Industrial Expansion",   short: "Sacks and mesh bags",     img: "/images/tiempo/timeline-1970.webp",  description: "In 1970, we began production of polypropylene sacks and mesh bags, marking a key stage in our industrial growth. This strategic step strengthened our operational capacity, expanded our commercial reach and consolidated our presence in the domestic market." },
        { year: "1985", title: "Technological Innovation", short: "European machinery",    img: "/images/tiempo/timeline-1985.webp",  description: "In 1985, we incorporated state-of-the-art European machinery, strengthening our industrial infrastructure and optimizing our production processes. This strategic investment raised our quality standards, increased operational efficiency and reaffirmed our commitment to technological innovation." },
        { year: "1995", title: "Diversification",        short: "New product lines",       img: "/images/tiempo/timeline-1995.webp",  description: "In 1995, we expanded our production lines by incorporating stretch film, flexible packaging and specialized products for the industry. This strategic expansion diversified our portfolio, strengthened our competitiveness in the sector and allowed us to meet new demands in the domestic market." },
        { year: "2005", title: "International Expansion", short: "Americas and Europe",    img: "/images/tiempo/timeline-2005.webp",  description: "In 2005, we began exports to the Americas and Europe, marking a decisive step in our international expansion. This achievement positioned the company as a benchmark in the plastics polymers industry, strengthening our global presence and consolidating our competitiveness in international markets." },
        { year: "2015", title: "Sustainability",         short: "Recycling plant",         img: "/images/tiempo/timeline-2015.webp",  description: "In 2015, we implemented a recycling plant and strengthened our sustainability programs, reaffirming our commitment to the environment. This strategic initiative optimized resource utilization, promoted responsible practices and consolidated our vision of sustainable growth." },
        { year: "2026", title: "Present",                short: "Industrial leader",        img: "/images/tiempo/timeline-2026.webp",  description: "In 2026, we have 17 production plants, more than 4,000 employees and an annual capacity of 220,000 tons. This sustained growth consolidates us as leaders in the plastics industry, backed by solid infrastructure, specialized human talent and a strategic vision oriented toward the future." }
      ]
    },

    filosofia: {
      label: "Our Principles",
      title: "GO Philosophy",
      img:   "/images/about/GO.webp",
      items: [
        "Obsession with customer satisfaction, not competition.",
        "Passion for constant invention and innovation.",
        "Operational excellence in every process.",
        "Long-term thinking with immediate results.",
        "Being the best employer and the safest workplace on the planet."
      ]
    },

    vision: {
      label: "Where we are headed",
      title: "Vision",
      img:   "/images/about/GO2.webp",
      items: [
        "To be the most customer-oriented company on the planet.",
        "To offer a complete integrated solution for any business.",
        "To be the sole packaging solution for any business on the planet.",
        "To grow with a global presence without losing the human focus."
      ]
    },

    infraestructura: {
      title_white:  "Infrastructure",
      title_orange: "that supports",
      stats: [
        { number: "10",     label: "Production Plants",        desc: "Strategically located facilities serving domestic and international markets.", icon: "number" },
        { number: "+3,000", label: "Employees",                desc: "Specialized team driving every production process.", icon: "number" },
        { number: "260",    label: "Logistics Units",          desc: "Our own fleet guaranteeing efficient distribution and safe deliveries nationwide and internationally.", icon: "number" },
        { number: "Global", label: "International Presence",   desc: "Export and distribution in the Americas and Europe.", icon: "globe" }
      ]
    },

    plantas: {
      title:           "Our Plants",
      subtitle:        "17 Production Plants",
      map_img:         "/images/about/mexico_map.png",
      layer_michoacan: "/images/about/michoacan_layer.png",
      layer_monterrey: "/images/about/monterrey_layer.png",
      layer_both:      "/images/about/both_states_layer.png",
      locations: [
        { key: "monterrey", number: "1 PLANT",   badge: "Monterrey, Nuevo León" },
        { key: "michoacan", number: "16 PLANTS", badge: "Morelia, Michoacán"    }
      ]
    },

    instalaciones: {
      title_white:  "OUR",
      title_orange: "FACILITIES",
      subtitle:     "360° Virtual Tours",
      badge_soon:   "Coming Soon",
      badge_tour:   "View tour",
      btn_tour:     "View 3D Tour",
      btn_soon:     "Coming Soon",
      items: [
        { id: "extrusoras", num: "01", title: "Stretch Film",          tag: "Morelia, Mich.", desc: "High-capacity extrusion lines where polypropylene is transformed into precision flat yarn.",                         thumb: "/images/virtual/RT.webp", link: "https://my.matterport.com/show/?m=YoM2tyXMeyb&ss=2&sr=2.97,.12&play=1&qs=1&ts=1", soon: true  },
        { id: "telares",    num: "02", title: "Mesh Bags",             tag: "Morelia, Mich.", desc: "State-of-the-art looms that weave yarn to produce polypropylene fabric with maximum uniformity.",                   thumb: "/images/virtual/RA.webp", link: "https://my.matterport.com/show/?m=2xCe1VajMjj&ss=1&sr=2.28,-1.47&play=1&qs=1&ts=1", soon: false },
        { id: "laminado",   num: "03", title: "Laminating & Printing", tag: "Morelia, Mich.", desc: "Laminating and flexography area where sacks receive finishing, printing and final quality treatment.",               thumb: "/images/virtual/RS.webp", link: "", soon: true  },
        { id: "reciclado",  num: "04", title: "Recycling Plant",       tag: "Morelia, Mich.", desc: "Our polypropylene recycling center, committed to the circular economy and the environment.",                         link: "", soon: true  }
      ]
    },

    capacidad: {
      title:         "Installed Capacity",
      subtitle:      "High-Performance Infrastructure",
      planta_label:  "PLANT",
      plantas_label: "PLANTS",
      items: [
        { num: "04", label: "Sack Production",        width: 100, delay: 0   },
        { num: "02", label: "Mesh Bag Production",    width: 50,  delay: 100 },
        { num: "01", label: "Rope and Raffia",        width: 25,  delay: 200 },
        { num: "02", label: "Stretch Film",           width: 50,  delay: 300 },
        { num: "01", label: "Flexible Packaging",     width: 25,  delay: 400 },
        { num: "01", label: "Recycling",              width: 25,  delay: 500 },
        { num: "03", label: "Corner Boards",          width: 75,  delay: 600 },
        { num: "01", label: "Strapping",              width: 25,  delay: 700 },
        { num: "01", label: "Disposables",            width: 25,  delay: 800 },
        { num: "01", label: "Bags",                   width: 25,  delay: 900 }
      ]
    },

    valores: {
      title:    "Our Values",
      subtitle: "The pillars of our culture",
      items: [
        { title: "Responsibility",  description: "We fulfill our commitments with ethics and professionalism, being aware of the impact of our actions on clients, employees and communities." },
        { title: "Trust",           description: "We build solid relationships based on transparency, honesty and keeping promises, generating confidence in every interaction."                 },
        { title: "Passion",         description: "We love what we do and reflect it in every product, process and innovation, driving excellence with enthusiasm and genuine dedication."       },
        { title: "Perseverance",    description: "We face challenges with determination and consistency, staying firm in our objectives until we achieve extraordinary results."                },
        { title: "Discipline",      description: "We follow rigorous processes and quality standards with order and method, guaranteeing consistency and excellence in every delivery."         },
        { title: "Proactivity",     description: "We anticipate needs and take action before problems arise, creating innovative solutions that generate continuous value."                     },
        { title: "Respect",         description: "We value the diversity, dignity and contribution of each person, fostering an environment of collaboration, inclusion and fair treatment."    }
      ]
    }
  },

  // =================================================
  // FOOTER
  // =================================================
  footer: {
    about_us:         "About us",
    about:            "About",
    social_impact:    "Social Impact",
    customer_service: "Customer Service",
    be_distributor:   "Become a distributor",
    catalog:          "Catalog",
    cta_button:       "Become a Distributor",
    rights:           "All rights reserved."
  },

  // =================================================
  // PAGE: SOCIAL IMPACT
  // =================================================
  impacto_social: {
    page_title: "Social Impact | Grupo Ortiz",

    hero: {
      eyebrow:          "SOCIAL IMPACT",
      title_top:        "We Build Together",
      title_bottom:     "A BETTER WORLD",
      subtitle:         "We support households, empower women, provide second chances and care for the planet. Every step we take aims to transform lives and build a future full of hope.",
      stat_female:      "% Female Workforce",
      stat_recycled:    "Tons Recycled",
      stat_initiatives: "Active Initiatives",
      video:            "/videos/waves2.mp4",
    },

    ods: {
      title:       "OUR NORTH STAR",
      subtitle:    "Agenda 2030",
      description: "We are guided by the UN Sustainable Development Goals to build a more just, prosperous and sustainable world.",
      cards: [
        { n: 1,  title: "No Poverty",                  link: "https://sdgs.un.org/goals/goal1",  img: "/images/odc/1.png"  },
        { n: 2,  title: "Zero Hunger",                 link: "https://sdgs.un.org/goals/goal2",  img: "/images/odc/2.png"  },
        { n: 3,  title: "Good Health and Well-Being",  link: "https://sdgs.un.org/goals/goal3",  img: "/images/odc/3.png"  },
        { n: 4,  title: "Quality Education",           link: "https://sdgs.un.org/goals/goal4",  img: "/images/odc/4.png"  },
        { n: 5,  title: "Gender Equality",             link: "https://sdgs.un.org/goals/goal5",  img: "/images/odc/5.png"  },
        { n: 6,  title: "Clean Water",                 link: "https://sdgs.un.org/goals/goal6",  img: "/images/odc/6.png"  },
        { n: 7,  title: "Affordable Energy",           link: "https://sdgs.un.org/goals/goal7",  img: "/images/odc/7.png"  },
        { n: 8,  title: "Decent Work",                 link: "https://sdgs.un.org/goals/goal8",  img: "/images/odc/8.png"  },
        { n: 9,  title: "Industry and Innovation",     link: "https://sdgs.un.org/goals/goal9",  img: "/images/odc/9.png"  },
        { n: 10, title: "Reduced Inequalities",        link: "https://sdgs.un.org/goals/goal10", img: "/images/odc/10.png" },
        { n: 11, title: "Sustainable Cities",          link: "https://sdgs.un.org/goals/goal11", img: "/images/odc/11.png" },
        { n: 12, title: "Responsible Production",      link: "https://sdgs.un.org/goals/goal12", img: "/images/odc/12.png" },
        { n: 13, title: "Climate Action",              link: "https://sdgs.un.org/goals/goal13", img: "/images/odc/13.png" },
        { n: 14, title: "Life Below Water",            link: "https://sdgs.un.org/goals/goal14", img: "/images/odc/14.png" },
        { n: 15, title: "Life on Land",                link: "https://sdgs.un.org/goals/goal15", img: "/images/odc/15.png" },
        { n: 16, title: "Peace and Justice",           link: "https://sdgs.un.org/goals/goal16", img: "/images/odc/16.png" },
        { n: 17, title: "Partnerships for the Goals", link: "https://sdgs.un.org/goals/goal17", img: "/images/odc/17.png" },
      ]
    },

    vision: {
      title:        "OUR POSITIVE",
      title_orange: "IMPACT",
      subtitle:     "Transforming the industry",
      pilars: [
        {
          label: "PILLAR 01",
          title: "PRODUCTS OF THE EARTH",
          desc:  "Development of innovative and ecological materials for flexible packaging that respect the environment and reduce the carbon footprint.",
          img:   "/images/impacto/products.webp"
        },
        {
          label: "PILLAR 02",
          title: "PRACTICES OF THE EARTH",
          desc:  "Clean manufacturing and circular economy across all our production processes, closing cycles and eliminating waste.",
          img:   "/images/impacto/practices.webp"
        },
        {
          label: "PILLAR 03",
          title: "SOCIAL EARTH",
          desc:  "Comprehensive commitment to clients, employees and communities, generating positive social impact and real opportunities.",
          img:   "/images/impacto/social.webp"
        }
      ]
    },

    oceanos: {
      hero_title:           "Committed to a",
      hero_title_highlight: "cleaner future for our oceans",
      hero_video:           "/videos/waves.mp4",
      intro: "At Grupo Ortiz, we believe in a world where the oceans shine again. By supporting global initiatives such as The Ocean Cleanup and the Tom Ford Plastic Innovation Prize powered by Lonely Whale, we work to reduce plastic in our seas. Every purchase you make with us is a step toward a cleaner planet and a sustainable future for all. Together we save the oceans!",
      features: [
        { title: "We support global cleanup",         desc: "Collaborating with initiatives like The Ocean Cleanup."                        },
        { title: "We promote sustainable innovation", desc: "Through programs like the Tom Ford Plastic Innovation Prize."                  },
        { title: "We foster responsible products",    desc: "that reduce environmental impact on the oceans."                              },
        { title: "We inspire collective action",      desc: "inviting clients and partners to be part of the change."                      }
      ],
      partners: [
        {
          title:  "Tom Ford Innovation",
          desc:   "This global initiative seeks to revolutionize the plastics industry by rewarding and promoting innovative solutions that replace single-use plastics. Its focus is on sustainable, scalable alternatives that reduce environmental impact, protect the oceans and drive a shift toward more responsible materials for the planet.",
          btn:    "LEARN MORE",
          link:   "https://unwrapthefuture.org/",
          video:  "/videos/impacto/oceancleanup.mp4",
          poster: "/images/impacto/cultura-calidad.jpg"
        },
        {
          title:  "Ocean Cleanup",
          desc:   "Dedicated to cleaning the world's oceans, this organization develops advanced technology to remove accumulated plastics from the seas and prevent their arrival by intervening in rivers, the main sources of pollution. Its mission is to restore the health of marine ecosystems, protecting biodiversity and ensuring a clean future for coming generations.",
          btn:    "LEARN MORE",
          link:   "https://theoceancleanup.com/",
          video:  "/videos/impacto/tomford.mp4",
          poster: "/images/impacto/tomford.webp"
        }
      ]
    },

    stats: {
      recycled: "Tons Recycled",
      female:   "% Female Workforce",
      families: "Families Benefited"
    },

    timeline: {
      title:    "INITIATIVES THAT TRANSFORM",
      subtitle: "Lasting positive impact",
      items: [
        {
          num: "01", title: "HOPE HOME",
          desc:       "Support for Casa Hogar in Tacámbaro, Michoacán. Every child deserves a home full of love.",
          desc_short: "Support for Casa Hogar in Tacámbaro, Michoacán.",
          img:        "/images/impacto/hogar.mp4",
          isVideo:    true,
          poster:     "/images/impacto/hogar.mp4"
        },
        {
          num: "02", title: "GO FOOD BASKET",
          desc:       "United for the community. Delivering food baskets with love.",
          desc_short: "Delivering food baskets with love to the community.",
          img:        "/images/impacto/despensas.webp",
          isVideo:    false
        },
        {
          num: "03", title: "ZERO FOOTPRINT",
          desc:       "Zero waste policy. Transforming waste into opportunities.",
          desc_short: "Zero waste policy. Transforming waste.",
          img:        "/images/impacto/composta.webp",
          isVideo:    false
        },
        {
          num: "04", title: "LIVING COMPOST",
          desc:       "Manufacturing of compostable products. Innovation that respects nature.",
          desc_short: "Compostable products. Sustainable innovation.",
          img:        "/images/impacto/GO.webp",
          isVideo:    false
        },
        {
          num: "05", title: "SHINE GO",
          desc:       "Performance gifts for the GO team. Recognizing effort.",
          desc_short: "Recognition for the GO team for their performance.",
          img:        "/images/impacto/woman.webp",
          isVideo:    false
        },
        {
          num: "06", title: "HANDS THAT LEAD",
          desc:       "84% female workforce. Empowering women leaders.",
          desc_short: "56.82% female workforce. Empowering leaders.",
          img:        "/images/impacto/bio.webp",
          isVideo:    false
        }
      ]
    },

    cta: {
      title:        "Together",
      title_orange: "We Transform",
      desc:         "We are the strategic partner your company needs to grow with technology, experience and results.",
      contact:      "Contact Us",
      products:     "View Products"
    }
  },

  // =================================================
  // PAGE: HOME (Index)
  // =================================================
  home: {
    meta_title: "Home | Grupo Ortiz",

    hero: {
      eyebrow:      "Since 1959",
      title_top:    "WE ARE THE LEADING",
      title_bot:    "MANUFACTURER IN LATIN AMERICA",
      video:        "background.mp4",
      subtitle:     "Over 65 years manufacturing high-engineering solutions for industries on five continents.",
      btn_products: "Our Products",
      btn_about:    "Learn More",
      stats: [
        { number: 65,   label: "Years of Experience" },
        { number: 3000, prefix: "+", label: "Employees"   },
        { number: 5,    prefix: "",  label: "Continents"  }
      ]
    },

    divisiones: {
      tag:       "Our Divisions",
      title:     "areas of",
      title_em:  "specialization",
      link_text: "View products",
      items: [
        { title: "Mesh Bag",          tag: "Division 01", description: "Polypropylene raffia mesh sacks in flat and circular weave. Ventilated design ideal for fruits, vegetables and agricultural products.",                             img: "/images/divisiones/arpilla.webp",        color: "#2d8a4e", slug: "arpillas",           soon: false },
        { title: "Rope",              tag: "Division 02", description: "High-tenacity polypropylene ropes for agricultural, industrial and marine use. Great weather resistance and built-in UV filter.",                                    img: "/images/divisiones/cuerdas.webp",        color: "#1a5f8a", slug: "cuerdas",            soon: false },
        { title: "Raffia",            tag: "Division 03", description: "High-performance polypropylene raffia. Very lightweight, highly break-resistant and versatile for agriculture, poultry and horticulture.",                          img: "/images/divisiones/rafia.webp",          color: "#8a6d2d", slug: "rafias",             soon: false },
        { title: "Flexible Packaging", tag: "Division 04", description: "High-barrier films and specialized lamination. Optimal protection for food and industrial products with cutting-edge technology.",                                img: "/images/divisiones/bolsa.webp",          color: "#0d7377", slug: "empaques-flexibles", soon: false },
        { title: "Sack",              tag: "Division 05", description: "Premium quality raffia sacks. Robust packaging solution for food, chemicals, fertilizers and bulk products.",                                                       img: "/images/divisiones/sacos.webp",          color: "#3a7d44", slug: "sacos",              soon: false },
        { title: "Stretch Film",      tag: "Division 06", description: "High optical clarity stretch film. Ensures load integrity with cost efficiency. Includes biodegradable option.",                                                    img: "/images/divisiones/film-estirable.webp", color: "#2c5f8a", slug: "stretch-film",       soon: false },
        { title: "Corner Board",      tag: "Division 07", description: "Kraft cardboard corner boards for edge protection during storage and transport. Even pressure distribution and maximum load stability.",                             img: "/images/divisiones/esquineros.webp",     color: "#7b3fa0", slug: "esquineros",         soon: false },
        { title: "Disposable",        tag: "Division 10", description: "Polypropylene disposable products for industrial, food and hospital use. Hygienic, economical and high-resistance solutions.",                                      img: "/images/divisiones/desechables.webp",    color: "#e05500", slug: "desechables",        soon: true  }
      ]
    },

    porque: {
      tag:           "Why choose us",
      title:         "Over 65 years",
      title_em:      "of leadership",
      body:          "We are a benchmark in the plastics polymers industry in Mexico and Latin America, with certified processes and global response capacity.",
      btn:           "Our Story",
      badge1_label:  "Business Units",
      badge1_number: 13,
      badge2_label:  "Divisions",
      badge2_number: 6,
      img:           "/images/home/planta-produccion.webp",
      features: [
        { title: "Certified Quality",       description: "Products that meet the highest international manufacturing standards."          },
        { title: "Constant Innovation",     description: "Permanent investment in R&D to maintain technological leadership in the sector." },
        { title: "Global Reach",            description: "Active presence on 5 continents with an efficient distribution network."        }
      ]
    },

    certs: {
      tag:      "Guaranteed Quality",
      title:    "Our",
      title_em: "Certifications",
      items: [
        { code: "Kosher Pareve",     name: "KMD México",     img: "/images/certificaciones/KOSHER.jpeg"   },
        { code: "FSSC 22000",        name: "LRQA Certified", img: "/images/certificaciones/LRQA.png"      },
        { code: "AIB International", name: "Since 1919",     img: "/images/certificaciones/AIB.png"       },
        { code: "ISO 9001",          name: "Bureau Veritas", img: "/images/certificaciones/CERTIFIED.png" }
      ]
    },

    compromiso: {
      card1: {
        eyebrow: "Our Approach",
        title:   "Innovation",
        text:    "We invest in R&D to offer products that exceed the expectations of the global market with cutting-edge technology."
      },
      card2: {
        eyebrow: "Our Commitment",
        title:   "Sustainability",
        text:    "Environmentally responsible processes, active recycling programs and carbon footprint reduction throughout the chain."
      }
    },

    global: {
      tag:      "Global Presence",
      title:    "We export to the",
      title_em: "world",
      desc:     "Our products reach clients in more than 30 countries, consolidating our position as leaders in plastics polymers.",
      video:    "/videos/camion.mp4",
      stats: [
        { number: 65,   label: "Years"       },
        { number: 30,   prefix: "+", label: "Countries"  },
        { number: 3000, prefix: "+", label: "People"     },
        { number: 5,    prefix: "",  label: "Continents" }
      ]
    },

    cta: {
      tag:      "Ready to get started?",
      title:    "Let's work",
      title_em: "together",
      sub:      "Discover how our solutions can transform your operation",
      btn:      "Contact Us"
    }
  }

};