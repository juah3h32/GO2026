// src/i18n/pt.js

export const pt = {
  // =================================================
  // BARRA DE NAVEGAÇÃO
  // =================================================
  nav: {
    home: 'Início',
    products: 'Produtos',
    catalog: 'Catálogo',
    promos: 'Promoções',
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
    salesBtn: 'Cotar pelo WhatsApp',
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
      validity: "Válido enquanto durar o estoque*"
    },
    discount_badge: "ATÉ",
    off_text: "DE DESCONTO",
    original_price: "Antes",
    promo_price: "Preço Especial",
    buy_button: "Solicitar Cotação",
    contact_cta: "Entre em contato com um consultor para mais informações",
    valid_until: "Válido enquanto durar o estoque*",

    products: [
      {
        id: "promo-stretch",
        name: "Stretch Film",
        subtitle: "$33 POR KG EM STRETCH COLORIDO",
        image: "/images/stretch/manual.webp",
        discount: 35,
        originalPrice: "",
        promoPrice: "$33/KG",
        features: [
          "Filme stretch colorido",
          "Preço especial por quilograma",
          "Estoque limitado",
          "Disponível em várias cores"
        ],
        validUntil: "Válido enquanto durar o estoque*"
      },
      {
        id: "promo-cuerda",
        name: "Corda",
        subtitle: "$33 POR KG",
        image: "/images/cuerdas/CuerdaT1.webp",
        discount: 25,
        originalPrice: "",
        promoPrice: "$33/KG",
        features: [
          "Corda de alta qualidade",
          "Preço especial por quilograma",
          "Oferta por tempo limitado",
          "Disponibilidade sujeita ao estoque"
        ],
        validUntil: "Válido enquanto durar o estoque*"
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
        name: "STRETCH FILM",
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
        name: "REDE / SACO DE TELA",
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
      division: "STRETCH FILM",
      descripcion: "Filme stretch de alta claridade óptica e padrões de qualidade. Garante a integridade da carga e eficiência em custos. Nossa linha inclui opção Biodegradável, formulada para se degradar 90% mais rápido.",
      slug: "stretch-film",
      video: "carrusel/stretch-film.mp4"
    },
    {
      img: "carrusel/img2.webp",
      division: "CORDA",
      descripcion: "Corda de Filamento de Polipropileno (PP) de alto desempenho. Equilíbrio perfeito: leveza extrema sem sacrificar a resistência à ruptura.",
      slug: "cuerdas",
      video: "carrusel/cuerdas.mp4"
    },
    {
      img: "carrusel/img3.webp",
      division: "RAFIA",
      descripcion: "Rafia de Filme de Polipropileno (PP) de alto desempenho. Grande leveza e alta resistência à ruptura. Flexível e versátil.",
      slug: "rafias",
      video: "carrusel/rafia.mp4"
    },
    {
      img: "carrusel/img4.webp",
      division: "REDE / SACO DE TELA",
      descripcion: "Sacos de malha de Rafia de Polipropileno em tecido plano com costura reforçada tipo 'L'. Design ventilado ideal para frutas e verduras.",
      slug: "arpillas",
      video: "carrusel/arpillas.mp4"
    },
    {
      img: "carrusel/img5.webp",
      division: "SACO",
      descripcion: "Sacos de Rafia de qualidade superior. Solução de embalagem robusta para alimentos, produtos químicos e fertilizantes.",
      slug: "sacos",
      video: "carrusel/sacos.mp4"
    },
    {
      img: "carrusel/img6.webp",
      division: "CANTONEIRA",
      descripcion: "Cantoneiras de papelão para otimizar a logística. Maior resistência estrutural e estabilidade de carga.",
      slug: "esquineros",
      video: "carrusel/esquineros.mp4"
    },
    {
      img: "carrusel/img7.webp",
      division: "EMBALAGEM FLEXÍVEL",
      descripcion: "A Neo Empaques International é especializada em soluções avançadas de embalagem flexível, projetadas para otimizar a conservação e apresentação de produtos em múltiplas indústrias.",
      slug: "empaques-flexibles",
      video: "carrusel/bobina-impresa.mp4"
    }
  ],

  // =================================================
  // PÁGINA: STRETCH FILM
  // =================================================
  stretch_film: {
    meta_title: "Stretch Film | Grupo Ortiz",
    back_aria: "Voltar aos produtos",
    specs_title: "ESPECIFICAÇÕES TÉCNICAS",

    specs_labels: {
      width: "Largura",
      length: "Comprimento",
      gauge: "Calibre/Mícrons",
      weight: "Peso do Rolo",
      type: "Uso"
    },

    products: [
      {
        name: 'STRETCH PREMIUM',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "Projetado para paletização manual, este filme stretch de estiramento moderado oferece uma solução prática e eficiente para fixar cargas sem necessidade de maquinário automático. Sua composição garante boa resistência e desempenho confiável nos processos de embalagem.",
        specs_values: { width: "19-30 cm", length: "1000-15000", gauge: "40-110", weight: "10-40 kg", type: "Manual" },
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
        description: "Projetado para uso com máquinas envolvedoras de baixa e média velocidade, este filme stretch oferece alto desempenho e excelentes resultados em processos automatizados de paletização. Sua formulação garante resistência e estabilidade na fixação de cargas.",
        specs_values: { width: "18-30 cm", length: "2000-15000", gauge: "50-110", weight: "10-49 kg", type: "Automático" },
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
        description: "Projetado para aplicação manual de alto desempenho, este filme pré-esticado destaca-se por oferecer uma das menores espessuras do mercado. Sua tecnologia elimina a necessidade de exercer força adicional ao envolver, facilitando seu uso imediato e melhorando a eficiência no processo de paletização.",
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
        description: "Projetado para aplicação em embrulho manual com estiramento moderado, este filme stretch tradicional oferece excelente desempenho em processos de embalagem e fixação de cargas. Sua composição garante resistência e estabilidade em aplicações gerais.",
        specs_values: { width: "3-12 cm", length: "7000-25000", gauge: "40-120", weight: "10-40 kg", type: "Manual" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/manual.png',
          '/images/stretch/rigido3.png'
        ]
      },
      {
        name: 'MANUAL RÍGIDO',
        img: '/images/stretch/rigido.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "Formulado especialmente para aplicações em embrulho manual com estiramento limitado, este filme stretch oferece alto desempenho e grande confiabilidade nos processos de embalagem. Sua composição garante estabilidade e eficiência na fixação de cargas.",
        specs_values: { width: "17-30 cm", length: "1000-15000", gauge: "40-90", weight: "10-40 kg", type: "Manual", color: "Preto/Colorido" },
        gallery: [
          '/images/stretch/rigido2.png',
          '/images/stretch/rigido.png',
          '/images/stretch/rigido3.png'
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
      resist: "Resistência",
      charge: "Apresentação"
    },

    products: [
      {
        name: 'CORDA DE FERRAGEM',
        img: '/images/cuerdas/CuerdaT1.webp',
        video: "/videos/cuerdas/cuerda-1.mp4",
        link: '#',
        description: "Fabricado com polipropileno e um filtro UV avançado, este cabo é ideal para atividades com alta exposição solar. Sua formulação especializada retarda o desgaste natural e prolonga sua vida útil, garantindo maior resistência e durabilidade contra as intempéries. É a corda de ferragem perfeita para proporcionar firmeza, segurança e desempenho confiável em aplicações gerais e trabalhos exigentes.",
        specs_values: { load: "1.980 m", mat: "PP-UV", weight: "18 kg", resist: "175 kg", charge: "4-19 mm" },
        gallery: [
          '/images/cuerdas/CuerdaT1-2.png',
          '/images/cuerdas/CuerdaT1.webp',
          '/images/cuerdas/CuerdaT1-1.png'
        ]
      },
      {
        name: 'CORDA PARA ESTUFA',
        img: '/images/cuerdas/CuerdaNegra.webp',
        video: "/videos/cuerdas/CuerdaI.mp4",
        link: '#',
        description: "Fabricado com polipropileno (PP) e estabilizador UV, este cabo é ideal para o setor marítimo e atividades com alta exposição solar. Sua formulação especializada retarda a degradação causada pela radiação ultravioleta, prolongando sua vida útil e garantindo maior resistência às intempéries. É a solução perfeita para proporcionar firmeza e estabilidade em macrotúneis agrícolas.",
        specs_values: { load: "3.240 m", mat: "PP-UV", weight: "18 kg", resist: "105 kg", charge: "3-8 mm" },
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
        description: "Fabricada com polipropileno (PP) de alta qualidade, esta corda oferece ampla variedade de apresentações, calibres e cores, disponíveis em versões lisas ou combinadas, com reforço ou com marca. Sua versatilidade e resistência a tornam uma opção confiável para múltiplas aplicações em indústrias, fábricas, armazéns, mercados de atacado, ferragens, oficinas e áreas de usinagem.",
        specs_values: { load: "3.240 m", mat: "PP-UV", weight: "18 kg", resist: "105 kg", charge: "3-8 mm" },
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
      cal: "Calibre",
      yield: "Rendimento m",
      resist: "Resistência kg",
      usage: "Material"
    },

    products: [
      {
        name: "RAFIA PARA AMARRAR",
        description: "Fabricada com polipropileno 100% virgem, esta rafia oferece alta resistência e excelente rendimento, mantendo suas propriedades físicas mesmo em condições de intempérie. Sua qualidade garante durabilidade e desempenho confiável em aplicações exigentes. É amplamente utilizada nos setores agrícola, avícola e de horticultura.",
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
        description: "Fabricada com polipropileno de alta qualidade, esta rafia oferece excelente resistência e mantém suas propriedades físicas mesmo em condições de intempérie. Seu rendimento confiável a torna uma opção ideal para aplicações agrícolas, avícolas e de horticultura.",
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
        name: "RAFIA FIBRILADA PRETA",
        description: "Fabricada com polipropileno de alta qualidade, esta rafia oferece grande resistência e mantém suas propriedades físicas mesmo em condições de intempérie. Seu excelente rendimento a torna ideal para aplicações industriais, de ferragem e embalagem, bem como para os setores agrícola, avícola e de horticultura.",
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
  // PÁGINA: REDES / SACOS DE TELA
  // =================================================
  arpillas: {
    meta_title: "Redes / Sacos de Tela | Grupo Ortiz",
    back_aria: "Voltar",
    specs_title: "ESPECIFICAÇÕES TÉCNICAS",

    specs_labels: {
      construction: "Construção",
      sizes: "Largura",
      colors: "Cores",
      features: "Tipo de fechamento"
    },

    products: [
      {
        name: 'REDE CIRCULAR',
        img: '/images/arpillas/arpilla.webp',
        video: "/videos/arpilla/circular.mp4",
        link: '#',
        description: "Fabricada com polipropileno 100% virgem e construção em rafia, esta rede oferece alta resistência e excelente rendimento em aplicações de embalagem e armazenamento. Sua qualidade garante durabilidade e desempenho confiável no manuseio de diversos produtos.",
        specs_values: {
          sizes: "23-70 cm",
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
        name: 'REDE MONOFILAMENTO',
        img: '/images/arpillas/arpilla2.webp',
        video: "/videos/arpilla/mono.mp4",
        link: '#',
        description: "Fabricada com polipropileno 100% virgem e construção rafia/monofilamento, esta rede oferece alta resistência e excelente rendimento em aplicações de embalagem e armazenamento. Sua estrutura proporciona durabilidade e desempenho confiável no manuseio e proteção de diversos produtos.",
        specs_values: {
          construction: "Monofilamento",
          sizes: "23-70 cm",
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
        name: 'REDE COM COSTURA LATERAL',
        img: '/images/arpillas/arpilla3.webp',
        video: "/videos/arpilla/costura.mp4",
        link: '#',
        description: "Fabricada com polipropileno 100% virgem e construção rafia/monofilamento, esta rede oferece alta resistência e excelente desempenho em aplicações de embalagem e armazenamento. Sua estrutura garante durabilidade e confiabilidade no manuseio de diferentes produtos.",
        specs_values: {
          type: "Lateral",
          construction: "Monofilamento",
          sizes: "23-60 cm",
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
        name: 'REDE COM ETIQUETA LAMINADA',
        img: '/images/arpillas/arpilla4.webp',
        video: "/videos/arpilla/etiqueta.mp4",
        link: '#',
        description: "Fabricada com polipropileno 100% virgem e construção rafia/rafia, esta rede oferece alta resistência e excelente desempenho em processos de embalagem e armazenamento. Sua trama garante durabilidade e confiabilidade para aplicações exigentes tanto no mercado doméstico quanto de exportação.",
        specs_values: {
          type: "Laminado",
          construction: "Rafia",
          sizes: "23-70 cm",
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
      weight: "Resistência"
    },

    products: [
      {
        name: 'SACO DE RAFIA SEM LAMINAÇÃO',
        img: '/images/sacos/saco2.png',
        model: '/models/saco_blanco.glb',
        video: "/videos/saco/slaminar.mp4",
        link: '#',
        description: "Fabricados com fitas de polipropileno entrelaçadas, os sacos de rafia sem laminação oferecem grande resistência e excelente durabilidade em aplicações de embalagem e armazenamento. Sua estrutura suporta cargas pesadas sem romper, garantindo desempenho confiável em trabalhos exigentes.",
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
        description: "Fabricados com fitas de polipropileno e acabamento transparente, estes sacos oferecem alta resistência e permitem excelente visualização do produto embalado. Sua estrutura garante durabilidade e desempenho confiável em aplicações de armazenamento e transporte.",
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
        description: "Fabricados com material reciclado proveniente dos resíduos do próprio processo de produção, estes sacos oferecem resistência e boa durabilidade a um custo mais acessível. Sua fabricação permite desempenho confiável em aplicações gerais de embalagem e armazenamento.",
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
      tabyd:    "Aba (jarda)",
      thickyd:  "Espessura (jarda)",
      lengthyd: "Comprimento (jarda)"
    },

    products: [
      {
        name: "CANTONEIRA KRAFT MARROM",
        description: "Fabricada para proteger bordas e cantos durante o transporte e armazenamento, esta cantoneira distribui a pressão de forma uniforme, evitando deformações e danos nas mercadorias. Sua estrutura oferece resistência e estabilidade em aplicações de embalagem exigentes.",
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
        name: "CANTONEIRA KRAFT BRANCA",
        description: "Fabricada para proteger bordas e cantos durante o transporte e armazenamento, esta cantoneira distribui a pressão de forma uniforme, evitando deformações e danos nas mercadorias. Sua estrutura oferece resistência e estabilidade em aplicações de embalagem exigentes.",
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
  // PÁGINA: EMBALAGENS FLEXÍVEIS
  // =================================================
  flexible_packaging: {
    meta_title: "Embalagens Flexíveis | Grupo Ortiz",
    back_aria: "Voltar aos produtos",
    specs_title: "ESPECIFICAÇÕES TÉCNICAS",

    specs_labels: {
      lamination: "Laminação",
      finish:     "Acabamento",
      size:       "Medidas até",
      zipper:     "Zipper",
      type:       "Tipo"
    },

    products: [
      {
        name: "BOBINA IMPRESSA",
        description: "Nossas bobinas contam com grande variedade de laminações, calibres e acabamentos. Com opção de impressão em até 10 tintas e 133 linhas por polegada. Desenvolvimento máximo: 1.140 mm. Largura máxima de impressão: 1.450 mm. Compatíveis com maquinário de envase automático para otimizar a eficiência de produção.",
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
        name: "BOLSA STAND UP",
        description: "Bolsas stand-up pouch versáteis com estrutura laminada e alta barreira contra umidade e oxigênio. Ideais para alimentos secos ou úmidos, pós, líquidos, cosméticos e químicos. Disponíveis em acabamentos Natural, Fosco e Metalizado, em tamanhos de 150 g até 1 kg, com opção de fechamento zipper e janela.",
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
          type:       "Bolsa"
        }
      },
      {
        name: "STAND UP POUCH",
        description: "Linha de bolsas com designs decorativos atraentes: Frutas Vermelhas, Flores, Frutas, Espigas, Presente Azul e Presente Rosa. Fechamento tipo zipper, estrutura resistente e acabamentos Natural ou Metalizado. Disponíveis em tamanhos de 150 g até 1 kg. Ideais para quem busca uma embalagem de alta qualidade e apelo visual.",
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
          type:       "Bolsa impressa"
        }
      },
      {
        name: "BOLSA DE ALTO VÁCUO",
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
          type:       "Bolsa"
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
      { icon: "ri-stack-line",        title: "Estoque Total",   desc: "Capacidade para atender grandes pedidos instantaneamente. Seu armazém sempre abastecido." },
      { icon: "ri-truck-line",        title: "Envios em 24h",   desc: "Logística própria. Seus clientes não esperam, entregamos em tempo recorde." },
      { icon: "ri-shield-check-line", title: "Garantia",        desc: "Trocas físicas sem burocracia nem perguntas. Total respaldo da marca." },
      { icon: "ri-line-chart-line",   title: "Melhor Margem",   desc: "Preços diretos de fábrica projetados para maximizar seu lucro líquido." }
    ],
    stats: [
      { val: 25, symbol: "k", label: "Toneladas Mensais"  },
      { val: 35, symbol: "+", label: "Anos de História"   },
      { val: 15, symbol: "M", label: "Vendas Totais"      }
    ],
    form: {
      title: "Solicitação <br>de Cadastro",
      desc: "Junte-se à rede. Complete seu perfil para receber sua zona e lista de preços preferencial.",
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
        { year: "1959", title: "O Começo",                short: "Fundação em Morelia",      img: "/images/tiempo/timeline-1959.webp",  description: "Desde 1959, o Grupo Ortiz faz parte do desenvolvimento industrial do México. Fundado em Morelia por Nicandro Ortiz, o grupo nasceu com uma visão firme: combinar tecnologia de ponta com o talento e a dedicação de sua equipe para construir uma empresa sólida, inovadora e comprometida com a qualidade." },
        { year: "1970", title: "Expansão Industrial",     short: "Sacos e redes",            img: "/images/tiempo/timeline-1970.webp",  description: "Em 1970, iniciamos a produção de sacos e redes de polipropileno, marcando uma etapa-chave em nosso crescimento industrial. Este passo estratégico fortaleceu nossa capacidade operacional, ampliou nossa participação comercial e consolidou nossa presença no mercado nacional." },
        { year: "1985", title: "Inovação Tecnológica",    short: "Maquinário europeu",       img: "/images/tiempo/timeline-1985.webp",  description: "Em 1985, incorporamos maquinário europeu de última geração, fortalecendo nossa infraestrutura industrial e otimizando nossos processos produtivos. Este investimento estratégico elevou nossos padrões de qualidade, aumentou a eficiência operacional e reafirmou nosso compromisso com a inovação tecnológica." },
        { year: "1995", title: "Diversificação",          short: "Novas linhas",             img: "/images/tiempo/timeline-1995.webp",  description: "Em 1995, ampliamos nossas linhas de produção incorporando stretch film, embalagens flexíveis e produtos especializados para a indústria. Esta expansão estratégica diversificou nosso portfólio, fortaleceu nossa competitividade no setor e nos permitiu atender novas demandas do mercado nacional." },
        { year: "2005", title: "Expansão Internacional",  short: "Américas e Europa",        img: "/images/tiempo/timeline-2005.webp",  description: "Em 2005, iniciamos exportações para as Américas e a Europa, marcando um passo decisivo em nossa expansão internacional. Esta conquista posicionou a empresa como referência na indústria de polímeros plásticos, fortalecendo nossa presença global e consolidando nossa competitividade em mercados internacionais." },
        { year: "2015", title: "Sustentabilidade",        short: "Planta de reciclagem",     img: "/images/tiempo/timeline-2015.webp",  description: "Em 2015, implementamos uma planta de reciclagem e fortalecemos nossos programas de sustentabilidade, reafirmando nosso compromisso com o meio ambiente. Esta iniciativa estratégica otimizou o aproveitamento de recursos, impulsionou práticas responsáveis e consolidou nossa visão de crescimento sustentável." },
        { year: "2026", title: "Presente",                short: "Líder industrial",         img: "/images/tiempo/timeline-2026.webp",  description: "Em 2026, contamos com 17 plantas de produção, mais de 4.000 colaboradores e uma capacidade anual de 220.000 toneladas. Este crescimento sustentado nos consolida como líderes na indústria do plástico, respaldados por uma infraestrutura sólida, talento humano especializado e uma visão estratégica orientada ao futuro." }
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
        "Oferecer toda solução integrada para qualquer negócio.",
        "Ser a única solução em embalagens para qualquer negócio do planeta.",
        "Crescer com presença global sem perder o foco humano."
      ]
    },

    infraestructura: {
      title_white:  "Infraestrutura",
      title_orange: "que nos sustenta",
      stats: [
        { number: "10",     label: "Plantas de Produção",    desc: "Instalações estrategicamente localizadas para atender mercados nacionais e internacionais.", icon: "number" },
        { number: "+3.000", label: "Colaboradores",          desc: "Equipe especializada que impulsiona cada processo produtivo.", icon: "number" },
        { number: "260",    label: "Unidades Logísticas",    desc: "Frota própria que garante distribuição eficiente e entregas seguras em todo o país e no exterior.", icon: "number" },
        { number: "Global", label: "Presença Internacional", desc: "Exportação e distribuição nas Américas e na Europa.", icon: "globe" }
      ]
    },

    plantas: {
      title:           "Nossas Plantas",
      subtitle:        "17 Plantas de Produção",
      map_img:         "/images/about/mexico_map.png",
      layer_michoacan: "/images/about/michoacan_layer.png",
      layer_monterrey: "/images/about/monterrey_layer.png",
      layer_both:      "/images/about/both_states_layer.png",
      locations: [
        { key: "monterrey", number: "1 PLANTA",   badge: "Monterrey, Nuevo León" },
        { key: "michoacan", number: "16 PLANTAS", badge: "Morelia, Michoacán"    }
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
        { id: "extrusoras", num: "01", title: "Stretch Film",         tag: "Morelia, Mich.", desc: "Linhas de extrusão de alta capacidade onde o polipropileno é transformado em fio plano de precisão.",                           thumb: "/images/virtual/RT.webp", link: "https://my.matterport.com/show/?m=YoM2tyXMeyb&ss=2&sr=2.97,.12&play=1&qs=1&ts=1", soon: true  },
        { id: "telares",    num: "02", title: "Redes",                tag: "Morelia, Mich.", desc: "Teares de última geração que tecem o fio para produzir tecido de polipropileno com máxima uniformidade.",                       thumb: "/images/virtual/RA.webp", link: "https://my.matterport.com/show/?m=2xCe1VajMjj&ss=1&sr=2.28,-1.47&play=1&qs=1&ts=1", soon: false },
        { id: "laminado",   num: "03", title: "Laminação e Impressão", tag: "Morelia, Mich.", desc: "Área de laminação e flexografia onde os sacos recebem acabamentos, impressão e tratamento final de qualidade.",               thumb: "/images/virtual/RS.webp", link: "", soon: true  },
        { id: "reciclado",  num: "04", title: "Planta de Reciclagem", tag: "Morelia, Mich.", desc: "Nosso centro de reciclagem de polipropileno, comprometido com a economia circular e o meio ambiente.",                         link: "", soon: true  }
      ]
    },

    capacidad: {
      title:         "Capacidade Instalada",
      subtitle:      "Infraestrutura de Alto Desempenho",
      planta_label:  "PLANTA",
      plantas_label: "PLANTAS",
      items: [
        { num: "04", label: "Produção de Sacos",     width: 100, delay: 0   },
        { num: "02", label: "Produção de Redes",     width: 50,  delay: 100 },
        { num: "01", label: "Corda e Rafia",         width: 25,  delay: 200 },
        { num: "02", label: "Stretch Film",          width: 50,  delay: 300 },
        { num: "01", label: "Embalagens Flexíveis",  width: 25,  delay: 400 },
        { num: "01", label: "Reciclagem",            width: 25,  delay: 500 },
        { num: "03", label: "Cantoneiras",           width: 75,  delay: 600 },
        { num: "01", label: "Fita de Arquear",       width: 25,  delay: 700 },
        { num: "01", label: "Descartáveis",          width: 25,  delay: 800 },
        { num: "01", label: "Bolsas",                width: 25,  delay: 900 }
      ]
    },

    valores: {
      title:    "Nossos Valores",
      subtitle: "Os pilares da nossa cultura",
      items: [
        { title: "Responsabilidade", description: "Cumprimos nossos compromissos com ética e profissionalismo, conscientes do impacto de nossas ações em clientes, colaboradores e comunidades." },
        { title: "Confiança",        description: "Construímos relacionamentos sólidos baseados em transparência, honestidade e cumprimento de promessas, gerando segurança em cada interação."   },
        { title: "Paixão",           description: "Amamos o que fazemos e refletimos isso em cada produto, processo e inovação, impulsionando a excelência com entusiasmo e dedicação genuína."   },
        { title: "Perseverança",     description: "Enfrentamos desafios com determinação e constância, mantendo-nos firmes em nossos objetivos até alcançar resultados extraordinários."            },
        { title: "Disciplina",       description: "Seguimos processos rigorosos e padrões de qualidade com ordem e método, garantindo consistência e excelência em cada entrega."                  },
        { title: "Proatividade",     description: "Antecipamos necessidades e agimos antes que os problemas surjam, criando soluções inovadoras que geram valor contínuo."                        },
        { title: "Respeito",         description: "Valorizamos a diversidade, a dignidade e a contribuição de cada pessoa, fomentando um ambiente de colaboração, inclusão e tratamento justo."    }
      ]
    }
  },

  // =================================================
  // RODAPÉ
  // =================================================
  footer: {
    about_us:         "Quem somos",
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
      subtitle:         "Apoiamos lares, empoderamos mulheres, damos segundas chances e cuidamos do planeta. Cada passo que damos busca transformar vidas e construir um futuro cheio de esperança.",
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
        { n: 1,  title: "Erradicação da Pobreza",          link: "https://sdgs.un.org/goals/goal1",  img: "/images/odc/1.png"  },
        { n: 2,  title: "Fome Zero",                       link: "https://sdgs.un.org/goals/goal2",  img: "/images/odc/2.png"  },
        { n: 3,  title: "Saúde e Bem-Estar",               link: "https://sdgs.un.org/goals/goal3",  img: "/images/odc/3.png"  },
        { n: 4,  title: "Educação de Qualidade",           link: "https://sdgs.un.org/goals/goal4",  img: "/images/odc/4.png"  },
        { n: 5,  title: "Igualdade de Gênero",             link: "https://sdgs.un.org/goals/goal5",  img: "/images/odc/5.png"  },
        { n: 6,  title: "Água Potável e Saneamento",       link: "https://sdgs.un.org/goals/goal6",  img: "/images/odc/6.png"  },
        { n: 7,  title: "Energia Limpa e Acessível",       link: "https://sdgs.un.org/goals/goal7",  img: "/images/odc/7.png"  },
        { n: 8,  title: "Trabalho Decente",                link: "https://sdgs.un.org/goals/goal8",  img: "/images/odc/8.png"  },
        { n: 9,  title: "Indústria, Inovação e Infraestrutura", link: "https://sdgs.un.org/goals/goal9", img: "/images/odc/9.png" },
        { n: 10, title: "Redução das Desigualdades",       link: "https://sdgs.un.org/goals/goal10", img: "/images/odc/10.png" },
        { n: 11, title: "Cidades Sustentáveis",            link: "https://sdgs.un.org/goals/goal11", img: "/images/odc/11.png" },
        { n: 12, title: "Consumo e Produção Responsáveis", link: "https://sdgs.un.org/goals/goal12", img: "/images/odc/12.png" },
        { n: 13, title: "Ação Climática",                  link: "https://sdgs.un.org/goals/goal13", img: "/images/odc/13.png" },
        { n: 14, title: "Vida na Água",                    link: "https://sdgs.un.org/goals/goal14", img: "/images/odc/14.png" },
        { n: 15, title: "Vida Terrestre",                  link: "https://sdgs.un.org/goals/goal15", img: "/images/odc/15.png" },
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
      intro: "No Grupo Ortiz, acreditamos em um mundo onde os oceanos voltem a brilhar. Ao apoiar iniciativas globais como The Ocean Cleanup e o Tom Ford Plastic Innovation Prize powered by Lonely Whale, trabalhamos para reduzir o plástico em nossos mares. Cada compra que você faz conosco é um passo em direção a um planeta mais limpo e um futuro sustentável para todos. Juntos salvamos os oceanos!",
      features: [
        { title: "Apoiamos a limpeza global",           desc: "Colaborando com iniciativas como The Ocean Cleanup."                          },
        { title: "Promovemos a inovação sustentável",   desc: "Por meio de programas como o Tom Ford Plastic Innovation Prize."              },
        { title: "Incentivamos produtos responsáveis",  desc: "que reduzem o impacto ambiental nos oceanos."                                },
        { title: "Inspiramos ação coletiva",            desc: "convidando clientes e parceiros a serem parte da mudança."                    }
      ],
      partners: [
        {
          title:  "Inovação Tom Ford",
          desc:   "Esta iniciativa global busca revolucionar a indústria do plástico ao premiar e promover soluções inovadoras que substituam os plásticos descartáveis. Seu foco está em alternativas sustentáveis e escaláveis que reduzam o impacto ambiental, protejam os oceanos e fomentem uma mudança para materiais mais responsáveis para o planeta.",
          btn:    "SAIBA MAIS",
          link:   "https://unwrapthefuture.org/",
          video:  "/videos/impacto/oceancleanup.mp4",
          poster: "/images/impacto/cultura-calidad.jpg"
        },
        {
          title:  "Limpeza dos oceanos",
          desc:   "Dedicada à limpeza dos oceanos do mundo, esta organização desenvolve tecnologia avançada para eliminar plásticos acumulados nos mares e prevenir sua chegada por meio da intervenção nos rios, principais fontes de contaminação. Sua missão é restaurar a saúde dos ecossistemas marinhos, protegendo a biodiversidade e assegurando um futuro limpo para as próximas gerações.",
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
          num: "01", title: "LAR DE ESPERANÇA",
          desc:       "Apoio à Casa Lar em Tacámbaro, Michoacán. Cada criança merece um lar cheio de amor.",
          desc_short: "Apoio à Casa Lar em Tacámbaro, Michoacán.",
          img:        "/images/impacto/hogar.mp4",
          isVideo:    true,
          poster:     "/images/impacto/hogar.mp4"
        },
        {
          num: "02", title: "CESTA BÁSICA GO",
          desc:       "Unidos pela comunidade. Entrega de cestas básicas com amor.",
          desc_short: "Entrega de cestas básicas com amor à comunidade.",
          img:        "/images/impacto/despensas.webp",
          isVideo:    false
        },
        {
          num: "03", title: "PEGADA ZERO",
          desc:       "Política de zero desperdícios. Transformando resíduos em oportunidades.",
          desc_short: "Política de zero desperdícios. Transformando resíduos.",
          img:        "/images/impacto/composta.webp",
          isVideo:    false
        },
        {
          num: "04", title: "COMPOSTO VIVO",
          desc:       "Fabricação de produtos compostáveis. Inovação que respeita a natureza.",
          desc_short: "Produtos compostáveis. Inovação sustentável.",
          img:        "/images/impacto/GO.webp",
          isVideo:    false
        },
        {
          num: "05", title: "BRILHA GO",
          desc:       "Presentes por desempenho para a equipe GO. Reconhecendo o esforço.",
          desc_short: "Reconhecimento à equipe GO pelo seu desempenho.",
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
  // PÁGINA: HOME (Início)
  // =================================================
  home: {
    meta_title: "Início | Grupo Ortiz",

    hero: {
      eyebrow:      "Desde 1959",
      title_top:    "SOMOS O PRINCIPAL",
      title_bot:    "FABRICANTE DA AMÉRICA LATINA",
      video:        "background.mp4",
      subtitle:     "Mais de 65 anos fabricando soluções de alta engenharia para indústrias nos cinco continentes.",
      btn_products: "Nossos Produtos",
      btn_about:    "Conhecer Mais",
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
        { title: "Rede / Saco de Tela", tag: "Divisão 01", description: "Sacos de malha de rafia de polipropileno em tecido plano e circular. Design ventilado ideal para frutas, verduras e produtos agrícolas.",                      img: "/images/divisiones/arpilla.webp",        color: "#2d8a4e", slug: "arpillas",           soon: false },
        { title: "Corda",               tag: "Divisão 02", description: "Cordas de polipropileno de alta tenacidade para usos agrícolas, industriais e marinhos. Grande resistência às intempéries e filtro UV incorporado.",            img: "/images/divisiones/cuerdas.webp",        color: "#1a5f8a", slug: "cuerdas",            soon: false },
        { title: "Rafia",               tag: "Divisão 03", description: "Rafia de polipropileno de alto desempenho. Grande leveza, alta resistência à ruptura e versatilidade para agricultura, avicultura e horticultura.",             img: "/images/divisiones/rafia.webp",          color: "#8a6d2d", slug: "rafias",             soon: false },
        { title: "Embalagem Flexível",  tag: "Divisão 04", description: "Filmes de alta barreira e laminação especializada. Proteção ideal para alimentos e produtos industriais com tecnologia de vanguarda.",                          img: "/images/divisiones/bolsa.webp",          color: "#0d7377", slug: "empaques-flexibles", soon: false },
        { title: "Saco",                tag: "Divisão 05", description: "Sacos de rafia de qualidade superior. Solução de embalagem robusta para alimentos, produtos químicos, fertilizantes e produtos a granel.",                      img: "/images/divisiones/sacos.webp",          color: "#3a7d44", slug: "sacos",              soon: false },
        { title: "Stretch Film",        tag: "Divisão 06", description: "Filme stretch de alta claridade óptica. Garante a integridade da carga com eficiência em custos. Inclui opção biodegradável.",                                  img: "/images/divisiones/film-estirable.webp", color: "#2c5f8a", slug: "stretch-film",       soon: false },
        { title: "Cantoneira",          tag: "Divisão 07", description: "Cantoneiras de papelão kraft para proteção de bordas durante o armazenamento e transporte. Distribuição uniforme de pressão e máxima estabilidade de carga.",   img: "/images/divisiones/esquineros.webp",     color: "#7b3fa0", slug: "esquineros",         soon: false },
        { title: "Descartável",         tag: "Divisão 10", description: "Produtos descartáveis de polipropileno para uso industrial, alimentício e hospitalar. Soluções higiênicas, econômicas e de alta resistência.",                  img: "/images/divisiones/desechables.webp",    color: "#e05500", slug: "desechables",        soon: true  }
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
        { title: "Qualidade Certificada",  description: "Produtos que atendem aos mais altos padrões internacionais de fabricação."         },
        { title: "Inovação Constante",     description: "Investimento permanente em P&D para manter a liderança tecnológica do setor."      },
        { title: "Alcance Global",         description: "Presença ativa em 5 continentes com uma rede de distribuição eficiente."           }
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
        { number: 30,   prefix: "+", label: "Países"      },
        { number: 3000, prefix: "+", label: "Pessoas"     },
        { number: 5,    prefix: "",  label: "Continentes" }
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