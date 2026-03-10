// src/i18n/pt.js

export const pt = {
  // =================================================
  // BARRA DE NAVEGAÇÃO
  // =================================================
  nav: {
    home: 'Início',
    products: 'Produtos',
    catalog: 'Catálogo',
    about: 'Sobre Nós',
    company: 'A Empresa',
    social: 'Impacto Social',
    distributor: 'Distribuidor',
    contact: 'Contato'
  },

  // =================================================
  // HERO / CAPA GERAL
  // =================================================
  hero: {
    title: "Bem-vindos",
    subtitle: "Qualidade que perdura"
  },

  // =================================================
  // TEXTOS COMUNS
  // =================================================
  common: {
    seeMore: "Ver mais",
    division: "Divisão",
    buy: "Comprar",
    redirecting: "Redirecionando...",
    download: "Baixar",
    language: "Idioma",
    scrollDown: "Role para baixo",
    previous: "Anterior",
    next: "Próximo"
  },

  // =================================================
  // CHATBOT (BotGo)
  // =================================================
  chatbot: {
    greeting: 'Olá! Sou o BotGo 🤖. Como posso ajudá-lo hoje?',
    placeholder: 'Digite uma mensagem...',
    listeningState: 'Ouvindo...',
    thinking: 'Pensando...',
    errorMsg: 'Erro de conexão.',
    salesBtn: 'Solicitar cotação pelo WhatsApp',
    voiceAssistantTitle: 'Assistente Virtual',
    voiceCode: 'pt-BR',
    waStart: 'Olá Grupo Ortiz, gostaria de uma cotação',
    pdfBtn: 'Ver catálogo PDF',
  },

  pwa: {
    appName: "Grupo Ortiz",
    title: "Instalar App GO",
    description: "Acesso rápido pela sua tela inicial",
    install: "Instalar",
    notNow: "Agora não",
    timeLabel: "agora"
  },

  // =================================================
  // PÁGINA DE PROMOÇÕES
  // =================================================
  promociones: {
    meta_title: "Promoções | Grupo Ortiz",
    hero: {
      label: "OFERTAS ESPECIAIS",
      title: "PROMOÇÕES",
      subtitle: "Aproveite nossas ofertas por tempo limitado",
      validity: "Válido enquanto durarem os estoques*"
    },
    discount_badge: "ATÉ",
    off_text: "DE DESCONTO",
    original_price: "Antes",
    promo_price: "Preço Especial",
    buy_button: "Solicitar Cotação",
    contact_cta: "Entre em contato com um consultor para mais informações",
    valid_until: "Válido enquanto durarem os estoques*",

    products: [
      {
        id: "promo-stretch",
        name: "Filme Stretch",
        subtitle: "R$33 POR KG NO STRETCH COLORIDO",
        image: "/images/stretch/manual.webp",
        discount: 35,
        originalPrice: "",
        promoPrice: "R$33/KG",
        features: [
          "Filme stretch colorido",
          "Preço especial por quilograma",
          "Estoque limitado",
          "Disponível em várias cores"
        ],
        validUntil: "Válido enquanto durarem os estoques*"
      },
      {
        id: "promo-cuerda",
        name: "Corda",
        subtitle: "R$33 POR KG",
        image: "/images/cuerdas/CuerdaT1.webp",
        discount: 25,
        originalPrice: "",
        promoPrice: "R$33/KG",
        features: [
          "Corda de alta qualidade",
          "Preço especial por quilograma",
          "Oferta por tempo limitado",
          "Disponibilidade sujeita ao estoque"
        ],
        validUntil: "Válido enquanto durarem os estoques*"
      }
    ]
  },

  // =================================================
  // PÁGINA DE CATÁLOGO
  // =================================================
  catalog: {
    hero: {
      label: "DOCUMENTAÇÃO",
      title: "CATÁLOGO GERAL",
      description: "Qualidade e soluções integradas em um único documento. Selecione seu idioma preferido para acessar nossa apresentação corporativa.",
      scrollText: "VER DIVISÕES"
    },
    carousel: {
      label: "DOWNLOADS DISPONÍVEIS",
      title: "CATÁLOGO POR DIVISÃO",
    },
    languageLabel: "Language / Idioma",
    downloadButton: "BAIXAR PDF",
    divisions: [
      {
        id: "1",
        name: "FILME STRETCH",
        desc: "Filme stretch para fixar e proteger cargas. Solução eficiente para paletização e transporte seguro.",
        image: "/images/catalogo/img1.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1HYGcpgkRO_7OX22IcWvRpzpLZKgpYV3A/view?usp=sharing",
          en: "https://drive.google.com/file/d/1QZ6jmKyc-CGLwh9brbeZSQ5OOzkKdBCQ/view?usp=sharing",
        }
      },
      {
        id: "2",
        name: "CORDA",
        desc: "Resistência e durabilidade para amarração industrial e pesqueira. Fabricadas com materiais de alta qualidade para uso intensivo.",
        image: "/images/catalogo/img2.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/14GrV9P1ViQKvFp3BucYjgmryRgWKLEZh/view?usp=sharing",
          en: "https://drive.google.com/file/d/19Tvd_VHjogSE7y7cLZYr4ra__4vB4nOm/view?usp=sharing",
        }
      },
      {
        id: "3",
        name: "RAFIA",
        desc: "O padrão em fixação para agricultura e indústria. Material resistente e flexível para múltiplas aplicações.",
        image: "/images/catalogo/img3.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1uAiR4uxO2iX_LsNFul6kXeb7jnnCEV_J/view?usp=sharing",
          en: "https://drive.google.com/file/d/10PV-sxexE8UkFSOhdTJBe1xWCy_tdFib/view?usp=sharing",
        }
      },
      {
        id: "4",
        name: "SACO DE TELA",
        desc: "Tecido de malha aberta para máxima ventilação agrícola. Soluções versáteis para embalagem e transporte de produtos do campo.",
        image: "/images/catalogo/img4.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1OQKGpnRCfA2yFdAlT6q7GczYua2FFFVU/view?usp=sharing",
          en: "https://drive.google.com/file/d/1wldGL6XuqH-Ruth9Y01-hkNnPlbg9SW5/view?usp=sharing",
        }
      },
      {
        id: "5",
        name: "SACO",
        desc: "Polipropileno tecido plano para embalagem em grande escala. Resistência superior para produtos a granel.",
        image: "/images/catalogo/img5.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/16S43-PUrQECO9q2J1fOgbN-YeIxQ2GhP/view?usp=sharing",
          en: "https://drive.google.com/file/d/1fkZvAWTT3mnBkxQ0Gbb2kRgOoN2dJZiK/view?usp=sharing",
        }
      },
      {
        id: "6",
        name: "CANTONEIRA",
        desc: "Proteção estrutural e estabilidade para paletes. Reforço essencial em logística e armazenamento de cargas.",
        image: "/images/catalogo/img6.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/181Hvr0HQffLU3rmcXkccYoqj-Y_A-gxr/view?usp=sharing",
          en: "https://drive.google.com/file/d/1DdcEavACvuY00oyMyC9rOWRybi9jnQrD/view?usp=sharing",
        }
      },
      {
        id: "7",
        name: "EMBALAGEM FLEXÍVEL",
        desc: "Filmes de alta barreira e laminação especializada. Proteção ideal para alimentos e produtos industriais.",
        image: "/images/catalogo/img7.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1TGxUcGHjW1NHF8K8YkRisbRE8uAuTnPO/view?usp=sharing",
          en: "https://drive.google.com/file/d/126eYsoqq9WI1SR-zoMdQJE7HS8cJR48m/view?usp=sharing",
        }
      }
    ]
  },

  // =================================================
  // LISTA PRINCIPAL (Carrossel /products)
  // =================================================
  products_list: [
    {
      img: "carrusel/img1.webp",
      division: "FILME STRETCH",
      descripcion: "Filme stretch de alta clareza óptica e padrões rigorosos de qualidade. Garante a integridade da carga e eficiência de custos. Nossa linha inclui opção Biodegradável, formulada para se degradar 90% mais rápido.",
      slug: "stretch-film",
      video: "carrusel/stretch-film.mp4"
    },
    {
      img: "carrusel/img4.webp",
      division: "SACO DE TELA",
      descripcion: "Sacos de tela de rafia de polipropileno em tecido circular de alta resistência e durabilidade. Design ventilado ideal para frutas e verduras.",
      slug: "arpillas",
      video: "carrusel/arpillas.mp4"
    },
    {
      img: "carrusel/img2.webp",
      division: "CORDA",
      descripcion: "Corda de filamento de polipropileno (PP) de alto desempenho. Equilíbrio perfeito: leveza extrema sem sacrificar a resistência à ruptura.",
      slug: "cuerdas",
      video: "carrusel/cuerdas.mp4"
    },
    {
      img: "carrusel/img3.webp",
      division: "RAFIA",
      descripcion: "Rafia de filme de polipropileno (PP) de alto desempenho. Grande leveza e alta resistência à ruptura. Flexível e versátil.",
      slug: "rafias",
      video: "carrusel/rafia.mp4"
    },
    {
      img: "carrusel/img5.webp",
      division: "SACO",
      descripcion: "Sacos de rafia de qualidade superior. Solução de embalagem robusta para alimentos, produtos químicos e fertilizantes.",
      slug: "sacos",
      video: "carrusel/sacos.mp4"
    },
    {
      img: "carrusel/img6.webp",
      division: "CANTONEIRA",
      descripcion: "Cantoneiras de papelão para otimizar a logística. Resistência estrutural e maior estabilidade de carga.",
      slug: "esquineros",
      video: "carrusel/esquineros.mp4"
    },
    {
      img: "carrusel/img7.webp",
      division: "EMBALAGEM FLEXÍVEL",
      descripcion: "A Neo Empaques International é especializada em soluções avançadas de embalagem flexível, projetadas para otimizar a conservação e apresentação de produtos em múltiplos setores.",
      slug: "empaques-flexibles",
      video: "carrusel/bobina-impresa.mp4"
    }
  ],

  // =================================================
  // PÁGINA: FILME STRETCH
  // =================================================
  stretch_film: {
    meta_title: "Filme Stretch | Grupo Ortiz",
    back_aria: "Voltar aos produtos",
    specs_title: "ESPECIFICAÇÕES TÉCNICAS",

    specs_labels: {
      width: "Largura",
      length: "Comprimento",
      gauge: "Espessura",
      weight: "Peso",
      type: "Uso"
    },

    products: [
      {
        name: 'STRETCH PREMIUM',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "Projetado para máquinas de alta exigência, este filme stretch de alongamento moderado oferece uma solução eficiente e confiável para fixar cargas em processos automatizados. Sua composição garante alta resistência e desempenho superior em aplicações de embalagem exigentes.",
        specs_values: { width: "480–760 mm", length: "300–4.570 m", gauge: "40–110", weight: "10–40 kg", type: "Manual" },
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
        description: "Projetado para uso com máquinas envolvedoras tradicionais, este filme stretch oferece alto desempenho e excelentes resultados em processos automatizados de paletização. Sua formulação garante resistência e estabilidade na fixação de cargas.",
        specs_values: { width: "460–760 mm", length: "600–4.570 m", gauge: "50–110", weight: "10–22 kg", type: "Automático" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      },
      {
        name: 'MANUAL PRÉ-ESTICADO',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "Projetado para aplicação manual de alto desempenho, este filme pré-esticado destaca-se por oferecer uma das menores espessuras do mercado. Sua tecnologia elimina a necessidade de aplicar força extra ao envolver, facilitando o uso imediato e melhorando a eficiência no processo de paletização.",
        specs_values: { width: "405–430 mm", length: "2.135–7.620 m", gauge: "40–120", weight: "10–40 kg", type: "Manual" },
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
        description: "Projetado para aplicação manual com alongamento moderado, este filme stretch tradicional oferece excelente desempenho em processos de embalagem e fixação de cargas. Sua composição garante resistência e estabilidade em aplicações gerais.",
        specs_values: { width: "75–305 mm", length: "2.135–7.620 m", gauge: "40–120", weight: "10–40 kg", type: "Manual" },
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
        description: "Formulado especialmente para aplicações de envoltura manual com alongamento limitado, este filme stretch oferece alto desempenho e grande confiabilidade em processos de embalagem. Sua composição garante estabilidade e eficiência na fixação de cargas.",
        specs_values: { width: "430–760 mm", length: "300–4.570 m", gauge: "40–90", weight: "10–40 kg", type: "Manual", color: "Preto / Colorido" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      }
    ]
  },

  // =================================================
  // PÁGINA: CORDAS
  // =================================================
  cuerdas: {
    meta_title: "Cordas | Grupo Ortiz",
    back_aria: "Voltar",
    loading: "Carregando...",
    specs_title: "ESPECIFICAÇÕES TÉCNICAS",

    specs_labels: {
      load: "Rendimento",
      mat: "Material",
      weight: "Peso",
      resist: "Resistência à Ruptura",
      charge: "Apresentação"
    },

    products: [
      {
        name: 'CORDA FERRAGISTA',
        img: '/images/cuerdas/CuerdaT1.webp',
        video: "/videos/cuerdas/cuerda-1.mp4",
        link: '#',
        description: "Fabricada com polipropileno e filtro UV avançado, esta corda é ideal para atividades com alta exposição solar. Sua formulação especializada retarda o desgaste natural e prolonga sua vida útil, garantindo maior resistência e durabilidade às intempéries. É a corda de ferragem ideal para oferecer firmeza, segurança e desempenho confiável em aplicações gerais e trabalhos exigentes.",
        specs_values: { load: "1.980 m", mat: "PP-UV", weight: "18 kg", resist: "79 kgf", charge: "4–19 mm" },
        gallery: [
          '/images/cuerdas/CuerdaT1-2.png',
          '/images/cuerdas/CuerdaT1.webp',
          '/images/cuerdas/CuerdaT1-1.png'
        ]
      },
      {
        name: 'CORDA ESTUFA',
        img: '/images/cuerdas/CuerdaNegra.webp',
        video: "/videos/cuerdas/CuerdaI.mp4",
        link: '#',
        description: "Fabricada com polipropileno (PP) e estabilizador UV, esta corda é ideal para o setor marítimo e atividades com alta exposição solar. Sua formulação especializada retarda a degradação causada pela radiação ultravioleta, prolongando sua vida útil e garantindo maior resistência às intempéries. É a solução perfeita para fornecer firmeza e estabilidade em macrotúneis agrícolas.",
        specs_values: { load: "3.240 m", mat: "PP-UV", weight: "18 kg", resist: "48 kgf", charge: "3–8 mm" },
        gallery: [
          '/images/cuerdas/CuerdaNegra6-1.png',
          '/images/cuerdas/CuerdaNegra.webp',
          '/images/cuerdas/CuerdaNegra6-3.png'
        ]
      },
      {
        name: 'CORDA ECOLÓGICA',
        img: '/images/cuerdas/CuerdaEco.png',
        video: "/videos/cuerdas/CuerdaE.mp4",
        link: '#',
        description: "Fabricada com polipropileno (PP) de alta qualidade, esta corda oferece ampla variedade de apresentações, bitolas e cores, disponíveis em versões lisas ou combinadas, com reforço ou com marca. Sua versatilidade e resistência a tornam uma opção confiável para múltiplas aplicações em indústrias, fábricas, armazéns, mercados atacadistas, ferragens e áreas de usinagem.",
        specs_values: { load: "3.240 m", mat: "PP-UV", weight: "18 kg", resist: "48 kgf", charge: "3–8 mm" },
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
    back_aria: "Voltar",
    specs_title: "ESPECIFICAÇÕES TÉCNICAS",

    specs_labels: {
      cal: "Bitola",
      yield: "Rendimento (m)",
      resist: "Resistência (kg)",
      usage: "Material"
    },

    products: [
      {
        name: "RAFIA DE AMARRAÇÃO",
        description: "Fabricada com polipropileno 100% virgem, esta rafia oferece alta resistência e excelente rendimento, mantendo suas propriedades físicas mesmo em condições de intempérie. Sua qualidade garante durabilidade e desempenho confiável em aplicações exigentes. É amplamente utilizada nos setores agrícola, avícola e de horticultura.",
        img: "/images/rafias/atar.png",
        video: "/videos/rafia/fondoN.mp4",
        specs_values: {
          cal: "2–8 mm",
          yield: "90 kg",
          resist: "60–320 f",
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
        description: "Fabricada com polipropileno de alta qualidade, esta rafia oferece excelente resistência e mantém suas propriedades físicas mesmo em condições de intempérie. Seu rendimento confiável a torna uma opção ideal para aplicações agrícolas, avícolas e de horticultura.",
        img: "/images/rafias/Eco.png",
        video: "/videos/rafia/fondoE.mp4",
        specs_values: {
          cal: "2–8 mm",
          yield: "90–500 kg",
          resist: "59–255 f",
          usage: "PP-UV"
        },
        gallery: [
          '/images/rafias/Eco2.png',
          '/images/rafias/Eco.png',
          '/images/rafias/Eco3.png'
        ]
      },
      {
        name: "RAFIA FIBRILADA PRETA",
        description: "Fabricada com polipropileno de alta qualidade, esta rafia oferece grande resistência e mantém suas propriedades físicas mesmo em condições de intempérie. Seu excelente rendimento a torna ideal para aplicações industriais, de ferragem e embalagem, bem como para os setores agrícola, avícola e de horticultura.",
        img: "/images/rafias/negra.png",
        video: "/videos/rafia/fondoR.mp4",
        specs_values: {
          cal: "2–8 mm",
          yield: "90–500 kg",
          resist: "59–255 f",
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
  // PÁGINA: SACOS DE TELA
  // =================================================
  arpillas: {
    meta_title: "Sacos de Tela | Grupo Ortiz",
    back_aria: "Voltar",
    specs_title: "ESPECIFICAÇÕES TÉCNICAS",

    specs_labels: {
      construction: "Construção",
      sizes: "Largura",
      colors: "Cores",
      features: "Tipo de Fechamento"
    },

    products: [
      {
        name: 'SACO DE TELA CIRCULAR',
        img: '/images/arpillas/arpilla.webp',
        video: "/videos/arpilla/circular.mp4",
        link: '#',
        description: "Fabricado com polipropileno 100% virgem e construção em rafia, este saco de tela oferece alta resistência e excelente desempenho em aplicações de embalagem e armazenamento. Sua qualidade garante durabilidade e desempenho confiável no manuseio de diversos produtos.",
        specs_values: {
          sizes: "23–70 cm",
          colors: "4",
          features: "Cordão"
        },
        gallery: [
          '/images/arpillas/circular2.webp',
          '/images/arpillas/arpilla.webp',
          '/images/arpillas/circular3.webp'
        ]
      },
      {
        name: 'SACO DE TELA MONOFILAMENTO',
        img: '/images/arpillas/arpilla2.webp',
        video: "/videos/arpilla/mono.mp4",
        link: '#',
        description: "Fabricado com polipropileno 100% virgem e construção em rafia/monofilamento, este saco de tela oferece alta resistência e excelente desempenho em aplicações de embalagem e armazenamento. Sua estrutura proporciona durabilidade e desempenho confiável no manuseio e proteção de diversos produtos.",
        specs_values: {
          construction: "Monofilamento",
          sizes: "23–70 cm",
          colors: "2",
          features: "Cordão"
        },
        gallery: [
          '/images/arpillas/mono2.webp',
          '/images/arpillas/arpilla2.webp',
          '/images/arpillas/mono3.webp'
        ]
      },
      {
        name: 'SACO DE TELA COSTURA LATERAL',
        img: '/images/arpillas/arpilla3.webp',
        video: "/videos/arpilla/costura.mp4",
        link: '#',
        description: "Fabricado com polipropileno 100% virgem e construção em rafia/monofilamento, este saco de tela oferece alta resistência e excelente desempenho em aplicações de embalagem e armazenamento. Sua estrutura garante durabilidade e confiabilidade no manuseio de diferentes produtos.",
        specs_values: {
          type: "Lateral",
          construction: "Monofilamento",
          sizes: "23–60 cm",
          colors: "4",
          features: "Reforçado"
        },
        gallery: [
          '/images/arpillas/lateral1.webp',
          '/images/arpillas/arpilla3.webp',
          '/images/arpillas/lateral3.webp'
        ]
      },
      {
        name: 'SACO DE TELA COM ETIQUETA LAMINADA',
        img: '/images/arpillas/arpilla4.webp',
        video: "/videos/arpilla/etiqueta.mp4",
        link: '#',
        description: "Fabricado com polipropileno 100% virgem e construção em rafia/rafia, este saco de tela oferece alta resistência e excelente desempenho em processos de embalagem e armazenamento. Seu tecido garante durabilidade e confiabilidade para aplicações exigentes tanto no mercado nacional quanto de exportação.",
        specs_values: {
          type: "Laminado",
          construction: "Rafia",
          sizes: "23–70 cm",
          colors: "4",
          features: "Cordão"
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
    back_aria: "Voltar aos produtos",
    specs_title: "ESPECIFICAÇÕES TÉCNICAS",

    specs_labels: {
      load: "Largura",
      unit: "Comprimento",
      mat: "Material",
      weight: "Resistência à Ruptura"
    },

    products: [
      {
        name: 'SACO DE RAFIA SEM LAMINAÇÃO',
        img: '/images/sacos/saco2.png',
        model: '/models/saco_blanco.glb',
        video: "/videos/saco/slaminar.mp4",
        link: '#',
        description: "Fabricados com tiras de polipropileno entrelaçadas, os sacos de rafia sem laminação oferecem grande resistência e excelente durabilidade em aplicações de embalagem e armazenamento. Sua estrutura suporta cargas pesadas sem rasgar, garantindo desempenho confiável em trabalhos exigentes.",
        specs_values: {
          load: "35–80 cm",
          unit: "49–115 cm",
          mat: "PP",
          weight: "120–200 kgf"
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
        description: "Fabricados com tiras de polipropileno e acabamento transparente, estes sacos oferecem alta resistência e permitem excelente visualização do produto embalado. Sua estrutura garante durabilidade e desempenho confiável em aplicações de armazenamento e transporte.",
        specs_values: {
          load: "35–80 cm",
          unit: "49–115 cm",
          mat: "PP",
          weight: "120–200 kgf"
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
        description: "Fabricados com material reciclado proveniente das sobras do próprio processo de produção, estes sacos oferecem resistência e boa durabilidade a um custo mais acessível. Sua fabricação permite desempenho confiável em aplicações gerais de embalagem e armazenamento.",
        specs_values: {
          load: "45–80 cm",
          unit: "49–115 cm",
          mat: "PP",
          weight: "120–200 kgf"
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
  // PÁGINA: CANTONEIRAS
  // =================================================
  esquineros: {
    meta_title: "Cantoneiras | Grupo Ortiz",
    back_aria: "Voltar",
    specs_title: "ESPECIFICAÇÕES TÉCNICAS",

    specs_labels: {
      tab:      "Aba",
      thick:    "Espessura",
      length:   "Comprimento",
      tabyd:    "Aba (m)",
      thickyd:  "Espessura (m)",
      lengthyd: "Comprimento (m)"
    },

    products: [
      {
        name: "CANTONEIRA KRAFT MARROM",
        description: "Fabricada para proteger arestas e cantos durante o transporte e armazenamento, esta cantoneira distribui a pressão de forma uniforme, evitando deformações e danos na mercadoria. Sua estrutura oferece resistência e estabilidade em aplicações de embalagem exigentes.",
        img: "/images/esquinero/esquinero.png",
        video: "/videos/esquinero/esquinero.mp4",
        link: "#",
        specs_values: {
          tab:    "38 mm",
          thick:  "0,08 mm",
          length: "30 cm"
        },
        gallery: [
          '/images/esquinero/esquinero2.png',
          '/images/esquinero/esquinero.png',
          '/images/esquinero/esquinero3.png'
        ]
      },
      {
        name: "CANTONEIRA KRAFT BRANCA",
        description: "Fabricada para proteger arestas e cantos durante o transporte e armazenamento, esta cantoneira distribui a pressão de forma uniforme, evitando deformações e danos na mercadoria. Sua estrutura oferece resistência e estabilidade em aplicações de embalagem exigentes.",
        img: "/images/esquinero/esquinerob.png",
        video: "/videos/esquinero/esquinero.mp4",
        link: "#",
        specs_values: {
          tab:    "38 mm",
          thick:  "0,08 mm",
          length: "30 cm"
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
  // PÁGINA: EMBALAGENS FLEXÍVEIS
  // =================================================
  flexible_packaging: {
    meta_title: "Embalagens Flexíveis | Grupo Ortiz",
    back_aria: "Voltar aos produtos",
    specs_title: "ESPECIFICAÇÕES TÉCNICAS",

    specs_labels: {
      lamination: "Laminação",
      finish:     "Acabamento",
      size:       "Medida máxima",
      zipper:     "Zipper",
      type:       "Tipo"
    },

    products: [
      {
        name: "BOBINA IMPRESSA",
        description: "Nossas bobinas oferecem grande variedade de laminações, espessuras e acabamentos. Com opção de impressão em até 10 cores e resolução de 52 linhas/cm. Desenvolvimento máximo: 1.140 mm. Largura máxima de impressão: 1.450 mm. Compatíveis com máquinas de embalagem automática para otimizar a eficiência da produção.",
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
          size:       "1.450 mm",
          zipper:     "N/A",
          type:       "Bobina"
        }
      },
      {
        name: "EMBALAGEM STAND UP POUCH",
        description: "Embalagens stand-up pouch versáteis com estrutura laminada e alta barreira contra umidade e oxigênio. Ideais para alimentos secos ou úmidos, pós, líquidos, cosméticos e produtos químicos. Disponíveis em acabamentos Natural, Fosco e Metalizado, em tamanhos de 150 g até 1 kg, com opção de fechamento zipper e janela.",
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
          zipper:     "Sim / Não",
          type:       "Embalagem"
        }
      },
      {
        name: "STAND UP POUCH DECORADO",
        description: "Linha de embalagens com designs decorativos atraentes: Frutas Vermelhas, Flores, Frutas, Espigas, Presente Azul e Presente Rosa. Fechamento tipo zipper, estrutura resistente e acabamentos Natural ou Metalizado. Disponíveis em tamanhos de 150 g até 1 kg. Ideais para quem busca uma embalagem de alta qualidade e apelo visual.",
        img: "/images/flexible/standup-origanics.png",
        video: "/videos/flexible/standup-origanics.mp4",
        gallery: [
          "/images/flexible/standup-origanics-2.png",
          "/images/flexible/standup-origanics.png",
          "/images/flexible/standup-origanics-3.png"
        ],
        specs_values: {
          lamination: "2 Tipos",
          finish:     "Presente",
          size:       "1 kg",
          zipper:     "Sim",
          type:       "Embalagem impressa"
        }
      },
      {
        name: "EMBALAGEM A VÁCUO",
        description: "Projetadas para maximizar a frescura e a vida útil de carnes, queijos, embutidos e produtos frescos. Seu fechamento hermético elimina o ar, retém as propriedades naturais do produto e evita a perda de sabor, textura e qualidade. Fabricadas com materiais de alta resistência e barreira.",
        img: "/images/flexible/bolsa-alto-vacio.png",
        video: "/videos/flexible/bolsa-alto-vacio.mp4",
        gallery: [
          "/images/flexible/bolsa-alto-vacio-1.png",
          "/images/flexible/bolsa-alto-vacio.png",
          "/images/flexible/bolsa-alto-vacio-3.png"
        ],
        specs_values: {
          lamination: "Multicamada",
          finish:     "Transparente",
          size:       "Produto",
          zipper:     "Não",
          type:       "Embalagem"
        }
      }
    ]
  },

  // =================================================
  // PÁGINA: DISTRIBUIDOR (Landing Completa)
  // =================================================
  distribuidor: {
    meta_title: "Distribuidor Grupo Ortiz | Parceiro Oficial",
    hero: {
      subtitle: "Portal Atacadista",
      title: "Multiplique <br>seus <span>Lucros</span>",
      desc: "Distribua produtos de alta demanda com o respaldo do fabricante líder. Estoque garantido, sem intermediários e logística em 24h.",
      cta: "Começar Agora"
    },
    cards: [
      { icon: "ri-stack-line",        title: "Estoque Total",    desc: "Capacidade para atender grandes pedidos imediatamente. Seu armazém sempre cheio." },
      { icon: "ri-truck-line",        title: "Envios em 24h",    desc: "Logística própria. Seus clientes não esperam, entregamos em tempo recorde." },
      { icon: "ri-shield-check-line", title: "Garantia",         desc: "Trocas físicas sem burocracia nem perguntas. Respaldo total da marca." },
      { icon: "ri-line-chart-line",   title: "Melhor Margem",    desc: "Preços diretos de fábrica projetados para maximizar seu lucro líquido." }
    ],
    stats: [
      { val: 25, symbol: "k", label: "Toneladas Mensais"  },
      { val: 35, symbol: "+", label: "Anos de História"   },
      { val: 15, symbol: "M", label: "Vendas Totais"      }
    ],
    form: {
      title: "Solicitação <br>de Cadastro",
      desc: "Junte-se à rede. Preencha seu perfil para atribuirmos sua região e lista de preços preferencial.",
      support_label: "SUPORTE DIRETO",
      labels: {
        name:     "Nome do Contato",
        business: "Razão Social",
        whatsapp: "WhatsApp",
        email:    "E-mail",
        products: "PRODUTOS DE INTERESSE"
      },
      products_list: ["Sacos", "Flexíveis", "Rafia", "Cantoneira", "Cordas", "Stretch", "Outro", "Todos"],
      btn:         "ENVIAR SOLICITAÇÃO",
      success_msg: "Solicitação Enviada"
    }
  },

  // =================================================
  // PÁGINA: QUEM SOMOS
  // =================================================
  quienes_somos: {
    meta_title: "Quem Somos | Grupo Ortiz",

    timeline: {
      title_white:   "NOSSA",
      title_orange:  "TRAJETÓRIA",
      nav_prev:      "Anterior",
      nav_next:      "Próximo",
      video_bg:      "/videos/background.mp4",
      video_bg_webm: "",
      video_poster:  "",
      events: [
        { year: "1959", title: "O Começo",               short: "Fundação em Morelia",      img: "/images/tiempo/timeline-1959.webp",  description: "Desde 1959, o Grupo Ortiz faz parte do desenvolvimento industrial do México. Fundado em Morelia por Nicandro Ortiz, o grupo nasceu com uma visão firme: combinar tecnologia de ponta com o talento e a dedicação de sua equipe para construir uma empresa sólida, inovadora e comprometida com a qualidade." },
        { year: "1970", title: "Expansão Industrial",    short: "Sacos e telas",            img: "/images/tiempo/timeline-1970.webp",  description: "Em 1970, iniciamos a produção de sacos e telas de polipropileno, marcando uma etapa fundamental em nosso crescimento industrial. Esse passo estratégico fortaleceu nossa capacidade operacional, ampliou nossa participação comercial e consolidou nossa presença no mercado nacional." },
        { year: "1985", title: "Inovação Tecnológica",   short: "Maquinário europeu",       img: "/images/tiempo/timeline-1985.webp",  description: "Em 1985, incorporamos maquinário europeu de última geração, fortalecendo nossa infraestrutura industrial e otimizando nossos processos produtivos. Esse investimento estratégico elevou nossos padrões de qualidade, aumentou a eficiência operacional e reafirmou nosso compromisso com a inovação tecnológica." },
        { year: "1995", title: "Diversificação",         short: "Novas linhas",             img: "/images/tiempo/timeline-1995.webp",  description: "Em 1995, expandimos nossas linhas de produção incorporando filme stretch, embalagens flexíveis e produtos especializados para a indústria. Essa expansão estratégica diversificou nosso portfólio, fortaleceu nossa competitividade no setor e nos permitiu atender a novas demandas do mercado nacional." },
        { year: "2005", title: "Expansão Internacional", short: "Américas e Europa",        img: "/images/tiempo/timeline-2005.webp",  description: "Em 2005, iniciamos exportações para as Américas e a Europa, dando um passo decisivo em nossa expansão internacional. Essa conquista posicionou a empresa como referência na indústria de polímeros plásticos, fortalecendo nossa presença global e consolidando nossa competitividade nos mercados internacionais." },
        { year: "2015", title: "Sustentabilidade",       short: "Planta de reciclagem",     img: "/images/tiempo/timeline-2015.webp",  description: "Em 2015, implantamos uma planta de reciclagem e fortalecemos nossos programas de sustentabilidade, reafirmando nosso compromisso com o meio ambiente. Essa iniciativa estratégica otimizou o aproveitamento de recursos, impulsionou práticas responsáveis e consolidou nossa visão de crescimento sustentável." },
        { year: "2026", title: "Presente",               short: "Líder industrial",         img: "/images/tiempo/timeline-2026.webp",  description: "Em 2026, contamos com 17 plantas de produção, mais de 4.000 colaboradores e capacidade anual de 220.000 toneladas. Esse crescimento sustentado nos consolida como líderes na indústria do plástico, respaldados por uma infraestrutura sólida, talentos especializados e uma visão estratégica voltada para o futuro." }
      ]
    },

    filosofia: {
      label: "Nossos Princípios",
      title: "Filosofia GO",
      img:   "/images/about/GO.webp",
      items: [
        "Obsessão pela satisfação do cliente, não pela concorrência.",
        "Paixão pela invenção e inovação constantes.",
        "Excelência operacional em cada processo.",
        "Pensamento de longo prazo com resultados imediatos.",
        "Ser o melhor empregador e o local de trabalho mais seguro do planeta."
      ]
    },

    vision: {
      label: "Para onde vamos",
      title: "Visão",
      img:   "/images/about/GO2.webp",
      items: [
        "Ser a empresa mais orientada ao cliente do planeta.",
        "Oferecer solução integrada completa para qualquer negócio.",
        "Ser a única solução em embalagens para qualquer negócio do planeta.",
        "Crescer com presença global sem perder o foco humano."
      ]
    },

    infraestructura: {
      title_white:  "Infraestrutura",
      title_orange: "que nos sustenta",
      stats: [
        { number: "13",     label: "Plantas de Produção",   desc: "Instalações estrategicamente localizadas para atender mercados nacionais e internacionais.", icon: "number" },
        { number: "+3.000", label: "Colaboradores",         desc: "Equipe especializada que impulsiona cada processo produtivo.", icon: "number" },
        { number: "260",    label: "Unidades Logísticas",   desc: "Frota própria que garante distribuição eficiente e entregas seguras em âmbito nacional e internacional.", icon: "number" },
        { number: "Global", label: "Presença Internacional",desc: "Exportação e distribuição nas Américas e na Europa.", icon: "globe" }
      ]
    },

    plantas: {
      title:           "Nossas Plantas",
      subtitle:        "13 Plantas de Produção",
      map_img:         "/images/about/mexico_map.png",
      layer_michoacan: "/images/about/michoacan_layer.png",
      layer_monterrey: "/images/about/monterrey_layer.png",
      layer_both:      "/images/about/both_states_layer.png",
      locations: [
        { key: "monterrey", number: "1 PLANTA",    badge: "Monterrey, Nuevo León" },
        { key: "michoacan", number: "16 PLANTAS",  badge: "Morelia, Michoacán"    }
      ]
    },

    instalaciones: {
      title_white:  "NOSSAS",
      title_orange: "INSTALAÇÕES",
      subtitle:     "Tours Virtuais 360°",
      badge_soon:   "Em Breve",
      badge_tour:   "Ver tour",
      btn_tour:     "Ver Tour 3D",
      btn_soon:     "Em Breve",
      items: [
        { id: "extrusoras", num: "01", title: "Filme Stretch",          tag: "Morelia, Mich.", desc: "Linhas de extrusão de alta capacidade onde o polipropileno é transformado em fio plano de precisão.",                          thumb: "/images/virtual/RT.webp", link: "https://my.matterport.com/show/?m=YoM2tyXMeyb&ss=2&sr=2.97,.12&play=1&qs=1&ts=1", soon: true  },
        { id: "telares",    num: "02", title: "Sacos de Tela",          tag: "Morelia, Mich.", desc: "Teares de última geração que tecem o fio para produzir tecido de polipropileno com máxima uniformidade.",                     thumb: "/images/virtual/RA.webp", link: "https://my.matterport.com/show/?m=2xCe1VajMjj&ss=1&sr=2.28,-1.47&play=1&qs=1&ts=1", soon: false },
        { id: "laminado",   num: "03", title: "Laminação e Impressão",  tag: "Morelia, Mich.", desc: "Área de laminação e flexografia onde os sacos recebem acabamentos, impressão e tratamento final de qualidade.",               thumb: "/images/virtual/RS.webp", link: "", soon: true  },
        { id: "reciclado",  num: "04", title: "Planta de Reciclagem",   tag: "Morelia, Mich.", desc: "Nosso centro de reciclagem de polipropileno, comprometido com a economia circular e o meio ambiente.",                        link: "", soon: true  }
      ]
    },

    capacidad: {
      title:         "Capacidade Instalada",
      subtitle:      "Infraestrutura de Alto Desempenho",
      planta_label:  "PLANTA",
      plantas_label: "PLANTAS",
      items: [
        { num: "04", label: "Produção de Sacos",        width: 100, delay: 0   },
        { num: "02", label: "Produção de Sacos de Tela",width: 50,  delay: 100 },
        { num: "01", label: "Corda e Rafia",            width: 25,  delay: 200 },
        { num: "02", label: "Filme Stretch",            width: 50,  delay: 300 },
        { num: "01", label: "Embalagens Flexíveis",     width: 25,  delay: 400 },
        { num: "01", label: "Reciclagem",               width: 25,  delay: 500 },
        { num: "03", label: "Cantoneiras",              width: 75,  delay: 600 },
        { num: "01", label: "Fita de Aço",              width: 25,  delay: 700 },
        { num: "01", label: "Descartáveis",             width: 25,  delay: 800 },
        { num: "01", label: "Embalagens",               width: 25,  delay: 900 }
      ]
    },

    valores: {
      title:    "Nossos Valores",
      subtitle: "Os pilares da nossa cultura",
      items: [
        { title: "Responsabilidade", description: "Cumprimos nossos compromissos com ética e profissionalismo, conscientes do impacto de nossas ações sobre clientes, colaboradores e comunidades." },
        { title: "Confiança",        description: "Construímos relacionamentos sólidos baseados em transparência, honestidade e cumprimento de promessas, gerando segurança em cada interação."     },
        { title: "Paixão",           description: "Amamos o que fazemos e isso se reflete em cada produto, processo e inovação, impulsionando a excelência com entusiasmo e dedicação genuína."    },
        { title: "Perseverança",     description: "Enfrentamos desafios com determinação e constância, mantendo-nos firmes em nossos objetivos até alcançar resultados extraordinários."             },
        { title: "Disciplina",       description: "Seguimos processos rigorosos e padrões de qualidade com ordem e método, garantindo consistência e excelência em cada entrega."                   },
        { title: "Proatividade",     description: "Antecipamos necessidades e agimos antes que surjam problemas, criando soluções inovadoras que geram valor contínuo."                             },
        { title: "Respeito",         description: "Valorizamos a diversidade, a dignidade e a contribuição de cada pessoa, fomentando um ambiente de colaboração, inclusão e tratamento justo."     }
      ]
    }
  },

  // =================================================
  // RODAPÉ
  // =================================================
  footer: {
    about_us:         "Quem Somos",
    about:            "Sobre",
    social_impact:    "Impacto Social",
    customer_service: "Atendimento ao Cliente",
    be_distributor:   "Ser distribuidor",
    catalog:          "Catálogo",
    cta_button:       "Quero ser Distribuidor",
    rights:           "Todos os direitos reservados."
  },

  // =================================================
  // PÁGINA: IMPACTO SOCIAL
  // =================================================
  impacto_social: {
    page_title: "Impacto Social | Grupo Ortiz",

    hero: {
      eyebrow:          "IMPACTO SOCIAL",
      title_top:        "Construímos Juntos",
      title_bottom:     "UM MUNDO MELHOR",
      subtitle:         "Apoiamos famílias, empoderamos mulheres, damos segundas chances e cuidamos do planeta. Cada passo que damos busca transformar vidas e construir um futuro cheio de esperança.",
      stat_female:      "% Quadro Feminino",
      stat_recycled:    "Toneladas Recicladas",
      stat_initiatives: "Iniciativas Ativas",
      video:            "/videos/waves2.mp4",
    },

    ods: {
      title:       "NOSSO NORTE",
      subtitle:    "Agenda 2030",
      description: "Nos guiamos pelos Objetivos de Desenvolvimento Sustentável da ONU para construir um mundo mais justo, próspero e sustentável.",
      cards: [
        { n: 1,  title: "Erradicação da Pobreza",        link: "https://sdgs.un.org/goals/goal1",  img: "/images/odc/1.png"  },
        { n: 2,  title: "Fome Zero",                     link: "https://sdgs.un.org/goals/goal2",  img: "/images/odc/2.png"  },
        { n: 3,  title: "Saúde e Bem-Estar",             link: "https://sdgs.un.org/goals/goal3",  img: "/images/odc/3.png"  },
        { n: 4,  title: "Educação de Qualidade",         link: "https://sdgs.un.org/goals/goal4",  img: "/images/odc/4.png"  },
        { n: 5,  title: "Igualdade de Gênero",           link: "https://sdgs.un.org/goals/goal5",  img: "/images/odc/5.png"  },
        { n: 6,  title: "Água Potável e Saneamento",     link: "https://sdgs.un.org/goals/goal6",  img: "/images/odc/6.png"  },
        { n: 7,  title: "Energia Limpa e Acessível",     link: "https://sdgs.un.org/goals/goal7",  img: "/images/odc/7.png"  },
        { n: 8,  title: "Trabalho Decente e Crescimento",link: "https://sdgs.un.org/goals/goal8",  img: "/images/odc/8.png"  },
        { n: 9,  title: "Indústria, Inovação e Infraestrutura", link: "https://sdgs.un.org/goals/goal9", img: "/images/odc/9.png" },
        { n: 10, title: "Redução das Desigualdades",     link: "https://sdgs.un.org/goals/goal10", img: "/images/odc/10.png" },
        { n: 11, title: "Cidades e Comunidades Sustentáveis", link: "https://sdgs.un.org/goals/goal11", img: "/images/odc/11.png" },
        { n: 12, title: "Consumo e Produção Responsáveis", link: "https://sdgs.un.org/goals/goal12", img: "/images/odc/12.png" },
        { n: 13, title: "Ação Contra a Mudança Global do Clima", link: "https://sdgs.un.org/goals/goal13", img: "/images/odc/13.png" },
        { n: 14, title: "Vida na Água",                  link: "https://sdgs.un.org/goals/goal14", img: "/images/odc/14.png" },
        { n: 15, title: "Vida Terrestre",                link: "https://sdgs.un.org/goals/goal15", img: "/images/odc/15.png" },
        { n: 16, title: "Paz, Justiça e Instituições Eficazes", link: "https://sdgs.un.org/goals/goal16", img: "/images/odc/16.png" },
        { n: 17, title: "Parcerias e Meios de Implementação", link: "https://sdgs.un.org/goals/goal17", img: "/images/odc/17.png" },
      ]
    },

    vision: {
      title:        "NOSSO IMPACTO",
      title_orange: "POSITIVO",
      subtitle:     "Transformamos a indústria",
      pilars: [
        {
          label: "PILAR 01",
          title: "PRODUTOS DA TERRA",
          desc:  "Desenvolvimento de materiais inovadores e ecológicos para embalagens flexíveis que respeitam o meio ambiente e reduzem a pegada de carbono.",
          img:   "/images/impacto/products.webp"
        },
        {
          label: "PILAR 02",
          title: "PRÁTICAS DA TERRA",
          desc:  "Manufatura limpa e economia circular em todos os nossos processos produtivos, fechando ciclos e eliminando desperdícios.",
          img:   "/images/impacto/practices.webp"
        },
        {
          label: "PILAR 03",
          title: "TERRA SOCIAL",
          desc:  "Compromisso integral com clientes, funcionários e comunidades, gerando impacto social positivo e oportunidades reais.",
          img:   "/images/impacto/social.webp"
        }
      ]
    },

    oceanos: {
      hero_title:           "Comprometidos com um futuro",
      hero_title_highlight: "mais limpo para nossos oceanos",
      hero_video:           "/videos/waves.mp4",
      intro: "No Grupo Ortiz, acreditamos em um mundo onde os oceanos voltem a brilhar. Ao apoiar iniciativas globais como The Ocean Cleanup e o Tom Ford Plastic Innovation Prize powered by Lonely Whale, trabalhamos para reduzir o plástico em nossos mares. Cada compra que você faz conosco é um passo rumo a um planeta mais limpo e um futuro sustentável para todos. Juntos salvamos os oceanos!",
      features: [
        { title: "Apoiamos a limpeza global",          desc: "Colaborando com iniciativas como The Ocean Cleanup."                       },
        { title: "Promovemos a inovação sustentável",  desc: "Por meio de programas como o Tom Ford Plastic Innovation Prize."           },
        { title: "Incentivamos produtos responsáveis", desc: "que reduzem o impacto ambiental nos oceanos."                             },
        { title: "Inspiramos ação coletiva",           desc: "convidando clientes e parceiros a fazerem parte da mudança."               }
      ],
      partners: [
        {
          title:  "Inovação Tom Ford",
          desc:   "Essa iniciativa global busca revolucionar a indústria do plástico premiando e promovendo soluções inovadoras que substituam os plásticos descartáveis. Seu foco está em alternativas sustentáveis e escaláveis que reduzam o impacto ambiental, protejam os oceanos e incentivem uma mudança para materiais mais responsáveis para o planeta.",
          btn:    "SAIBA MAIS",
          link:   "https://unwrapthefuture.org/",
          video:  "/videos/impacto/oceancleanup.mp4",
          poster: "/images/impacto/cultura-calidad.jpg"
        },
        {
          title:  "Limpeza do Oceano",
          desc:   "Dedicada a limpar os oceanos do mundo, essa organização desenvolve tecnologia avançada para eliminar plásticos acumulados nos mares e impedir sua chegada por meio da intervenção nos rios, principais fontes de poluição. Sua missão é restaurar a saúde dos ecossistemas marinhos, proteger a biodiversidade e garantir um futuro limpo para as próximas gerações.",
          btn:    "SAIBA MAIS",
          link:   "https://theoceancleanup.com/",
          video:  "/videos/impacto/tomford.mp4",
          poster: "/images/impacto/tomford.webp"
        }
      ]
    },

    stats: {
      recycled: "Toneladas Recicladas",
      female:   "% Quadro Feminino",
      families: "Famílias Beneficiadas"
    },

    timeline: {
      title:    "INICIATIVAS QUE TRANSFORMAM",
      subtitle: "Impacto positivo duradouro",
      items: [
        {
          num: "01", title: "LAR DA ESPERANÇA",
          desc:       "Apoio à Casa de Acolhimento em Tacámbaro, Michoacán. Toda criança merece um lar cheio de amor.",
          desc_short: "Apoio à Casa de Acolhimento em Tacámbaro, Michoacán.",
          img:        "/images/impacto/hogar.mp4",
          isVideo:    true,
          poster:     "/images/impacto/hogar.mp4"
        },
        {
          num: "02", title: "CESTA BÁSICA GO",
          desc:       "Unidos pela comunidade. Distribuição de cestas básicas com amor.",
          desc_short: "Distribuição de cestas básicas com amor à comunidade.",
          img:        "/images/impacto/despensas.webp",
          isVideo:    false
        },
        {
          num: "03", title: "PEGADA ZERO",
          desc:       "Política de zero desperdício. Transformando resíduos em oportunidades.",
          desc_short: "Política de zero desperdício. Transformando resíduos.",
          img:        "/images/impacto/composta.webp",
          isVideo:    false
        },
        {
          num: "04", title: "COMPOSTAGEM VIVA",
          desc:       "Fabricação de produtos compostáveis. Inovação que respeita a natureza.",
          desc_short: "Produtos compostáveis. Inovação sustentável.",
          img:        "/images/impacto/GO.webp",
          isVideo:    false
        },
        {
          num: "05", title: "BRILHA GO",
          desc:       "Premiações por desempenho para a equipe GO. Reconhecendo o esforço.",
          desc_short: "Reconhecimento da equipe GO pelo seu desempenho.",
          img:        "/images/impacto/woman.webp",
          isVideo:    false
        },
        {
          num: "06", title: "MÃOS QUE LIDERAM",
          desc:       "84% de quadro feminino. Empoderando mulheres líderes.",
          desc_short: "56,82% de quadro feminino. Empoderando líderes.",
          img:        "/images/impacto/bio.webp",
          isVideo:    false
        }
      ]
    },

    cta: {
      title:        "Juntos",
      title_orange: "Transformamos",
      desc:         "Somos o parceiro estratégico que sua empresa precisa para crescer com tecnologia, experiência e resultados.",
      contact:      "Fale Conosco",
      products:     "Ver Produtos"
    }
  },

  // =================================================
  // PÁGINA: HOME (Inicial)
  // =================================================
  home: {
    meta_title: "Grupo Ortiz | Fabricante de Polímeros e Embalagens no México",
    meta_description: "Mais de 65 anos fabricando filme stretch, sacos, cordas, rafia, sacos de tela e embalagens flexíveis. Líder em polímeros plásticos no México e na América Latina.",
    hero: {
      eyebrow:      "Desde 1959",
      title_top:    "SOMOS O PRINCIPAL",
      title_bot:    "FABRICANTE DA AMÉRICA LATINA",
      video:        "background.mp4",
      subtitle:     "Mais de 65 anos fabricando soluções de alta engenharia para indústrias nos cinco continentes.",
      btn_products: "Nossos Produtos",
      btn_about:    "Saiba Mais",
      stats: [
        { number: 65,   label: "Anos de Experiência" },
        { number: 3000, prefix: "+", label: "Colaboradores" },
        { number: 5,    prefix: "",  label: "Continentes"   }
      ]
    },

    divisiones: {
      tag:       "Nossas Divisões",
      title:     "áreas de",
      title_em:  "especialização",
      link_text: "Ver produtos",
      items: [
        { title: "Saco de Tela",       tag: "Divisão 01", description: "Sacos de tela de rafia de polipropileno em tecido plano e circular. Design ventilado ideal para frutas, verduras e produtos agrícolas.",                    img: "/images/divisiones/arpilla.webp",           color: "#2d8a4e", slug: "arpillas",           soon: false },
        { title: "Corda",              tag: "Divisão 02", description: "Cordas de polipropileno de alta tenacidade para uso agrícola, industrial e marítimo. Excelente resistência às intempéries com filtro UV incorporado.",    img: "/images/divisiones/cuerdas.webp",           color: "#1a5f8a", slug: "cuerdas",            soon: false },
        { title: "Rafia",              tag: "Divisão 03", description: "Rafia de polipropileno de alto desempenho. Grande leveza e alta resistência à ruptura, versátil para agricultura, avicultura e horticultura.",            img: "/images/divisiones/rafia.webp",             color: "#8a6d2d", slug: "rafias",             soon: false },
        { title: "Embalagem Flexível", tag: "Divisão 04", description: "Filmes de alta barreira e laminação especializada. Proteção ideal para alimentos e produtos industriais com tecnologia de vanguarda.",                    img: "/images/divisiones/bolsa.webp",             color: "#0d7377", slug: "empaques-flexibles", soon: false },
        { title: "Saco",               tag: "Divisão 05", description: "Sacos de rafia de qualidade superior. Solução de embalagem robusta para alimentos, produtos químicos, fertilizantes e produtos a granel.",               img: "/images/divisiones/sacos.webp",             color: "#3a7d44", slug: "sacos",              soon: false },
        { title: "Filme Stretch",      tag: "Divisão 06", description: "Filme stretch de alta clareza óptica. Garante a integridade da carga com eficiência de custos. Inclui opção biodegradável.",                             img: "/images/divisiones/film-estirable.webp",    color: "#2c5f8a", slug: "stretch-film",       soon: false },
        { title: "Cantoneira",         tag: "Divisão 07", description: "Cantoneiras de papelão kraft para proteção de arestas durante o armazenamento e transporte. Distribuição uniforme de pressão e máxima estabilidade de carga.", img: "/images/divisiones/esquineros.webp",   color: "#7b3fa0", slug: "esquineros",         soon: false },
        { title: "Descartável",        tag: "Divisão 10", description: "Produtos descartáveis de polipropileno para uso industrial, alimentar e hospitalar. Soluções higiênicas, econômicas e de alta resistência.",             img: "/images/divisiones/desechables.webp",       color: "#e05500", slug: "desechables",        soon: true  }
      ]
    },

    porque: {
      tag:           "Por que nos escolher",
      title:         "Mais de 65 anos",
      title_em:      "de liderança",
      body:          "Somos referência na indústria de polímeros plásticos no México e na América Latina, com processos certificados e capacidade de resposta global.",
      btn:           "Nossa História",
      badge1_label:  "Unidades de Negócio",
      badge1_number: 13,
      badge2_label:  "Divisões",
      badge2_number: 6,
      img:           "/images/home/planta-produccion.webp",
      features: [
        { title: "Qualidade Certificada",  description: "Produtos que atendem aos mais altos padrões internacionais de fabricação."      },
        { title: "Inovação Constante",     description: "Investimento permanente em P&D para manter a liderança tecnológica do setor."   },
        { title: "Alcance Global",         description: "Presença ativa em 5 continentes com uma rede de distribuição eficiente."        }
      ]
    },

    certs: {
      tag:      "Qualidade Garantida",
      title:    "Nossas",
      title_em: "Certificações",
      items: [
        { code: "Kosher Pareve",     name: "KMD México",     img: "/images/certificaciones/KOSHER.jpeg"   },
        { code: "FSSC 22000",        name: "LRQA Certified", img: "/images/certificaciones/LRQA.png"      },
        { code: "AIB International", name: "Since 1919",     img: "/images/certificaciones/AIB.png"       },
        { code: "ISO 9001",          name: "Bureau Veritas", img: "/images/certificaciones/CERTIFIED.png" }
      ]
    },

    compromiso: {
      card1: {
        eyebrow: "Nossa Abordagem",
        title:   "Inovação",
        text:    "Investimos em P&D para oferecer produtos que superem as expectativas do mercado global com tecnologia de vanguarda."
      },
      card2: {
        eyebrow: "Nosso Compromisso",
        title:   "Sustentabilidade",
        text:    "Processos responsáveis com o meio ambiente, programas ativos de reciclagem e redução da pegada de carbono em toda a cadeia."
      }
    },

    global: {
      tag:      "Presença Global",
      title:    "Exportamos para o",
      title_em: "mundo",
      desc:     "Nossos produtos chegam a clientes em mais de 30 países, consolidando nossa posição como líderes em polímeros plásticos.",
      video:    "/videos/camion.mp4",
      stats: [
        { number: 65,   label: "Anos"        },
        { number: 30,   prefix: "+", label: "Países"     },
        { number: 3000, prefix: "+", label: "Pessoas"    },
        { number: 5,    prefix: "",  label: "Continentes"}
      ]
    },

    cta: {
      tag:      "Pronto para começar?",
      title:    "Vamos trabalhar",
      title_em: "juntos",
      sub:      "Descubra como nossas soluções podem transformar sua operação",
      btn:      "Fale Conosco"
    }
  }

};