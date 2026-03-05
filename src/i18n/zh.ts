// src/i18n/zh.js

export const zh = {
  // =================================================
  // 导航栏
  // =================================================
  nav: {
    home: '首页',
    products: '产品',
    catalog: '产品目录',
    promos: '促销活动',
    about: '关于我们',
    company: '公司简介',
    social: '社会影响',
    distributor: '经销商',
    contact: '联系我们'
  },

  // =================================================
  // 首页横幅
  // =================================================
  hero: {
    title: "欢迎光临",
    subtitle: "经久不衰的品质"
  },

  // =================================================
  // 通用文本
  // =================================================
  common: {
    seeMore: "查看更多",
    division: "事业部",
    buy: "购买",
    redirecting: "跳转中...",
    download: "下载",
    language: "语言",
    scrollDown: "向下滑动",
    previous: "上一页",
    next: "下一页"
  },

  // =================================================
  // 聊天机器人 (BotGo)
  // =================================================
  chatbot: {
    greeting: '您好！我是BotGo 🤖。今天有什么可以帮您的？',
    placeholder: '输入消息...',
    listeningState: '正在聆听...',
    thinking: '思考中...',
    errorMsg: '连接错误。',
    salesBtn: '通过WhatsApp报价',
    voiceAssistantTitle: '虚拟助手',
    voiceCode: 'zh-CN',
    waStart: '您好Grupo Ortiz，我想获取一份报价',
    pdfBtn: '查看PDF目录',
  },

  // =================================================
  // 促销页面
  // =================================================
  promociones: {
    meta_title: "促销活动 | Grupo Ortiz",
    hero: {
      label: "特别优惠",
      title: "促销活动",
      subtitle: "把握限时优惠机会",
      validity: "售完即止*"
    },
    discount_badge: "最高",
    off_text: "折扣",
    original_price: "原价",
    promo_price: "特惠价",
    buy_button: "申请报价",
    contact_cta: "联系顾问了解更多信息",
    valid_until: "售完即止*",

    products: [
      {
        id: "promo-stretch",
        name: "缠绕膜",
        subtitle: "彩色缠绕膜每公斤$33",
        image: "/images/stretch/manual.webp",
        discount: 35,
        originalPrice: "",
        promoPrice: "$33/公斤",
        features: [
          "彩色拉伸缠绕膜",
          "每公斤特惠价",
          "库存有限",
          "多种颜色可选"
        ],
        validUntil: "售完即止*"
      },
      {
        id: "promo-cuerda",
        name: "绳索",
        subtitle: "每公斤$33",
        image: "/images/cuerdas/CuerdaT1.webp",
        discount: 25,
        originalPrice: "",
        promoPrice: "$33/公斤",
        features: [
          "高品质绳索",
          "每公斤特惠价",
          "限时优惠",
          "视库存情况而定"
        ],
        validUntil: "售完即止*"
      }
    ]
  },

  // =================================================
  // 产品目录页面
  // =================================================
  catalog: {
    hero: {
      label: "文档资料",
      title: "综合产品目录",
      description: "品质与整合解决方案汇于一册。请选择您偏好的语言获取我们的企业介绍资料。",
      scrollText: "查看各事业部"
    },
    carousel: {
      label: "可下载资料",
      title: "分部门产品目录",
    },
    languageLabel: "Language / 语言",
    downloadButton: "下载PDF",
    divisions: [
      {
        id: "1",
        name: "缠绕膜",
        desc: "用于固定和保护货物的拉伸缠绕膜。高效的托盘包装和安全运输解决方案。",
        image: "/images/catalogo/img1.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1HYGcpgkRO_7OX22IcWvRpzpLZKgpYV3A/view?usp=sharing",
          en: "https://drive.google.com/file/d/1QZ6jmKyc-CGLwh9brbeZSQ5OOzkKdBCQ/view?usp=sharing",
        }
      },
      {
        id: "2",
        name: "绳索",
        desc: "用于工业和渔业捆扎的高强度耐用绳索。采用优质材料制造，适合高强度使用。",
        image: "/images/catalogo/img2.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/14GrV9P1ViQKvFp3BucYjgmryRgWKLEZh/view?usp=sharing",
          en: "https://drive.google.com/file/d/19Tvd_VHjogSE7y7cLZYr4ra__4vB4nOm/view?usp=sharing",
        }
      },
      {
        id: "3",
        name: "拉菲草绳",
        desc: "农业和工业捆扎的标准材料。耐用柔韧，适用于多种应用场景。",
        image: "/images/catalogo/img3.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1uAiR4uxO2iX_LsNFul6kXeb7jnnCEV_J/view?usp=sharing",
          en: "https://drive.google.com/file/d/10PV-sxexE8UkFSOhdTJBe1xWCy_tdFib/view?usp=sharing",
        }
      },
      {
        id: "4",
        name: "网眼袋",
        desc: "开放式网眼编织，实现最佳农产品通风。用于田间产品包装和运输的多功能解决方案。",
        image: "/images/catalogo/img4.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1OQKGpnRCfA2yFdAlT6q7GczYua2FFFVU/view?usp=sharing",
          en: "https://drive.google.com/file/d/1wldGL6XuqH-Ruth9Y01-hkNnPlbg9SW5/view?usp=sharing",
        }
      },
      {
        id: "5",
        name: "编织袋",
        desc: "平织聚丙烯编织袋，适用于大宗包装。为散装产品提供卓越的承重能力。",
        image: "/images/catalogo/img5.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/16S43-PUrQECO9q2J1fOgbN-YeIxQ2GhP/view?usp=sharing",
          en: "https://drive.google.com/file/d/1fkZvAWTT3mnBkxQ0Gbb2kRgOoN2dJZiK/view?usp=sharing",
        }
      },
      {
        id: "6",
        name: "护角",
        desc: "为托盘提供结构保护和稳定性。物流和仓储中不可或缺的加固保护。",
        image: "/images/catalogo/img6.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/181Hvr0HQffLU3rmcXkccYoqj-Y_A-gxr/view?usp=sharing",
          en: "https://drive.google.com/file/d/1DdcEavACvuY00oyMyC9rOWRybi9jnQrD/view?usp=sharing",
        }
      },
      {
        id: "7",
        name: "软包装",
        desc: "高阻隔薄膜和专业复合材料。为食品和工业产品提供最佳保护。",
        image: "/images/catalogo/img7.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1TGxUcGHjW1NHF8K8YkRisbRE8uAuTnPO/view?usp=sharing",
          en: "https://drive.google.com/file/d/126eYsoqq9WI1SR-zoMdQJE7HS8cJR48m/view?usp=sharing",
        }
      }
    ]
  },

  // =================================================
  // 产品主列表（轮播 /products）
  // =================================================
  products_list: [
    {
      img: "carrusel/img1.webp",
      division: "缠绕膜",
      descripcion: "高光学透明度的拉伸缠绕膜，符合最高质量标准。确保货物完整性和成本效益。我们的产品线包括可生物降解选项，降解速度快90%。",
      slug: "stretch-film",
      video: "carrusel/stretch-film.mp4"
    },
    {
      img: "carrusel/img2.webp",
      division: "绳索",
      descripcion: "高性能聚丙烯（PP）单丝绳索。完美平衡：极致轻量而不牺牲断裂强度。",
      slug: "cuerdas",
      video: "carrusel/cuerdas.mp4"
    },
    {
      img: "carrusel/img3.webp",
      division: "拉菲草绳",
      descripcion: "高性能聚丙烯（PP）薄膜拉菲草绳。重量极轻，断裂强度高。柔韧多用途。",
      slug: "rafias",
      video: "carrusel/rafia.mp4"
    },
    {
      img: "carrusel/img4.webp",
      division: "网眼袋",
      descripcion: "聚丙烯拉菲草编织网眼袋，采用平织加强型 缝合。通风设计，非常适合水果和蔬菜包装。",
      slug: "arpillas",
      video: "carrusel/arpillas.mp4"
    },
    {
      img: "carrusel/img5.webp",
      division: "编织袋",
      descripcion: "优质拉菲草编织袋。适用于食品、化工产品和化肥的坚固包装解决方案。",
      slug: "sacos",
      video: "carrusel/sacos.mp4"
    },
    {
      img: "carrusel/img6.webp",
      division: "护角",
      descripcion: "纸板护角，优化物流效率。提供结构强度和更高的货物稳定性。",
      slug: "esquineros",
      video: "carrusel/esquineros.mp4"
    },
    {
      img: "carrusel/img7.webp",
      division: "软包装",
      descripcion: "Neo Empaques International专注于先进的软包装解决方案，旨在优化多个行业产品的保鲜和展示效果。",
      slug: "empaques-flexibles",
      video: "carrusel/bobina-impresa.mp4"
    }
  ],

  // =================================================
  // 页面：缠绕膜（拉伸膜）
  // =================================================
  stretch_film: {
    meta_title: "缠绕膜 | Grupo Ortiz",
    back_aria: "返回产品列表",
    specs_title: "技术规格",

    specs_labels: {
      width: "宽度",
      length: "长度",
      gauge: "厚度/微米",
      weight: "卷重",
      type: "用途"
    },

    products: [
      {
        name: '高级缠绕膜',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "专为手动托盘包装设计，这款中等拉伸率的缠绕膜无需自动化设备即可提供实用高效的货物固定方案。其配方保证了良好的强度和可靠的包装性能。",
        specs_values: { width: "19-30 cm", length: "1000-15000", gauge: "40-110", weight: "10-40 kg", type: "手动" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      },
      {
        name: '自动缠绕膜',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "专为低速和中速缠绕机设计，这款缠绕膜在自动化托盘包装过程中表现出色。其配方保证了货物固定的强度和稳定性。",
        specs_values: { width: "18-30 cm", length: "2000-15000", gauge: "50-110", weight: "10-49 kg", type: "自动" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      },
      {
        name: '手动预拉伸膜',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "专为高性能手动应用设计，这款预拉伸膜以市场上最薄的厚度之一而著称。其技术无需额外用力即可缠绕，可立即使用，提高托盘包装效率。",
        specs_values: { width: "16-17 cm", length: "7000-25000", gauge: "40-120", weight: "10-40 kg", type: "手动" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      },
      {
        name: '手动捆扎膜',
        img: '/images/stretch/manual.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "专为中等拉伸率的手动缠绕应用设计，这款传统缠绕膜在包装和货物固定过程中表现优异。其配方保证了通用应用中的强度和稳定性。",
        specs_values: { width: "3-12 cm", length: "7000-25000", gauge: "40-120", weight: "10-40 kg", type: "手动" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/manual.png',
          '/images/stretch/rigido3.png'
        ]
      },
      {
        name: '手动硬质膜',
        img: '/images/stretch/rigido.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "专为有限拉伸率的手动缠绕应用特别配制，这款缠绕膜在包装过程中提供高性能和高可靠性。其配方保证了货物固定的稳定性和效率。",
        specs_values: { width: "17-30 cm", length: "1000-15000", gauge: "40-90", weight: "10-40 kg", type: "手动", color: "黑色/彩色" },
        gallery: [
          '/images/stretch/rigido2.png',
          '/images/stretch/rigido.png',
          '/images/stretch/rigido3.png'
        ]
      }
    ]
  },

  // =================================================
  // 页面：绳索
  // =================================================
  cuerdas: {
    meta_title: "绳索 | Grupo Ortiz",
    back_aria: "返回",
    loading: "加载中...",
    specs_title: "技术规格",

    specs_labels: {
      load: "出绳率",
      mat: "材料",
      weight: "重量",
      resist: "抗拉强度",
      charge: "规格"
    },

    products: [
      {
        name: '五金绳',
        img: '/images/cuerdas/CuerdaT1.webp',
        video: "/videos/cuerda-1.mp4",
        link: '#',
        description: "采用聚丙烯和先进UV滤光材料制成，这款绳索非常适合高日照环境下的作业。其专业配方延缓自然磨损并延长使用寿命，确保在恶劣天气下具有更强的抗性和耐久性。是提供牢固、安全和可靠性能的理想五金绳。",
        specs_values: { load: "1,980 m", mat: "PP-UV", weight: "18 kg", resist: "175 kg", charge: "4-19 mm" },
        gallery: [
          '/images/cuerdas/CuerdaT1-2.png',
          '/images/cuerdas/CuerdaT1.webp',
          '/images/cuerdas/CuerdaT1-1.png'
        ]
      },
      {
        name: '温室绳',
        img: '/images/cuerdas/CuerdaNegra.webp',
        video: "/videos/CuerdaI.mp4",
        link: '#',
        description: "采用聚丙烯（PP）和UV稳定剂制成，这款绳索非常适合航海领域和高日照环境下的作业。其专业配方延缓紫外线辐射造成的磨损，延长使用寿命并确保更强的耐候性。是农业大棚中提供牢固性和稳定性的完美解决方案。",
        specs_values: { load: "3,240 m", mat: "PP-UV", weight: "18 kg", resist: "105 kg", charge: "3-8 mm" },
        gallery: [
          '/images/cuerdas/CuerdaNegra6-1.png',
          '/images/cuerdas/CuerdaNegra.webp',
          '/images/cuerdas/CuerdaNegra6-3.png'
        ]
      },
      {
        name: '环保绳',
        img: '/images/cuerdas/CuerdaEco.png',
        video: "/videos/CuerdaE.mp4",
        link: '#',
        description: "采用优质聚丙烯（PP）制成，这款绳索提供多种规格、粗细和颜色选择，有光面和混合版本，可加固或印标。其多功能性和强度使其成为工厂、仓库、批发市场、五金店、作坊和加工区等多种应用场景的可靠选择。",
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
  // 页面：拉菲草绳
  // =================================================
  rafias: {
    meta_title: "拉菲草绳 | Grupo Ortiz",
    back_aria: "返回",
    specs_title: "技术规格",

    specs_labels: {
      cal: "粗细",
      yield: "出绳率 m",
      resist: "抗拉强度 kg",
      usage: "材料"
    },

    products: [
      {
        name: "捆扎拉菲草绳",
        description: "采用100%全新聚丙烯制成，这款拉菲草绳具有高强度和优异性能，即使在户外条件下也能保持其物理特性。其品质保证了在苛刻应用中的耐久性和可靠性能。广泛用于农业、禽业和园艺领域。",
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
        name: "环保拉菲草绳",
        description: "采用优质聚丙烯制成，这款拉菲草绳具有出色的强度，即使在户外条件下也能保持其物理特性。其可靠的性能使其成为农业、禽业和园艺应用的理想选择。",
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
        name: "黑色纤化拉菲草绳",
        description: "采用优质聚丙烯制成，这款拉菲草绳具有极高的强度，即使在户外条件下也能保持其物理特性。其优异的性能使其非常适合工业、五金和包装应用，以及农业、禽业和园艺领域。",
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
  // 页面：网眼袋
  // =================================================
  arpillas: {
    meta_title: "网眼袋 | Grupo Ortiz",
    back_aria: "返回",
    specs_title: "技术规格",

    specs_labels: {
      construction: "织造方式",
      sizes: "宽度",
      colors: "颜色",
      features: "封口方式"
    },

    products: [
      {
        name: '圆织网眼袋',
        img: '/images/arpillas/arpilla.png',
        video: "/videos/arpilla/circular.mp4",
        link: '#',
        description: "采用100%全新聚丙烯和拉菲草织造，这款网眼袋在包装和仓储应用中具有高强度和优异性能。其品质保证了各种产品处理中的耐久性和可靠性。",
        specs_values: {
          sizes: "23-70 cm",
          colors: "4",
          features: "抽绳"
        },
        gallery: [
          '/images/arpillas/circular2.png',
          '/images/arpillas/arpilla.png',
          '/images/arpillas/circular3.png'
        ]
      },
      {
        name: '单丝网眼袋',
        img: '/images/arpillas/arpilla2.png',
        video: "/videos/arpilla/mono.mp4",
        link: '#',
        description: "采用100%全新聚丙烯和拉菲草/单丝织造，这款网眼袋在包装和仓储应用中具有高强度和优异性能。其结构在各种产品的处理和保护中提供耐久性和可靠性。",
        specs_values: {
          construction: "单丝",
          sizes: "23-70 cm",
          colors: "2",
          features: "抽绳"
        },
        gallery: [
          '/images/arpillas/mono2.png',
          '/images/arpillas/arpilla2.png',
          '/images/arpillas/mono3.png'
        ]
      },
      {
        name: '侧缝网眼袋',
        img: '/images/arpillas/arpilla3.png',
        video: "/videos/arpilla/costura.mp4",
        link: '#',
        description: "采用100%全新聚丙烯和拉菲草/单丝织造，这款网眼袋在包装和仓储应用中具有高强度和优异性能。其结构保证了不同产品处理中的耐久性和可靠性。",
        specs_values: {
          type: "侧缝",
          construction: "单丝",
          sizes: "23-60 cm",
          colors: "4",
          features: "加强型"
        },
        gallery: [
          '/images/arpillas/lateral1.png',
          '/images/arpillas/arpilla3.png',
          '/images/arpillas/lateral3.png'
        ]
      },
      {
        name: '覆膜标签网眼袋',
        img: '/images/arpillas/arpilla4.png',
        video: "/videos/arpilla/etiqueta.mp4",
        link: '#',
        description: "采用100%全新聚丙烯和拉菲草/拉菲草织造，这款网眼袋在包装和仓储过程中具有高强度和优异性能。其织造保证了国内外市场高要求应用中的耐久性和可靠性。",
        specs_values: {
          type: "覆膜",
          construction: "拉菲草",
          sizes: "23-70 cm",
          colors: "4",
          features: "抽绳"
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
  // 页面：编织袋
  // =================================================
  sacos: {
    meta_title: "编织袋 | Grupo Ortiz",
    back_aria: "返回产品列表",
    specs_title: "技术规格",

    specs_labels: {
      load: "宽度",
      unit: "长度",
      mat: "材料",
      weight: "强度"
    },

    products: [
      {
        name: '非覆膜拉菲草编织袋',
        img: '/images/sacos/saco2.png',
        model: '/models/saco_blanco.glb',
        video: "/videos/saco/slaminar.mp4",
        link: '#',
        description: "采用聚丙烯编织带交织而成，非覆膜拉菲草编织袋在包装和仓储应用中具有极高的强度和优异的耐久性。其结构能够承受重载而不撕裂，确保在高强度作业中的可靠性能。",
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
        name: '透明编织袋',
        img: '/images/sacos/saco.png',
        video: "/videos/saco/transp.mp4",
        link: '#',
        description: "采用聚丙烯编织带和透明表面处理，这款编织袋具有高强度，可清晰展示包装产品。其结构保证了在仓储和运输应用中的耐久性和可靠性能。",
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
        name: '环保拉菲草编织袋',
        img: '/images/sacos/saco3.png',
        video: "/videos/saco/eco.mp4",
        link: '#',
        description: "采用生产过程中的回收边角料制成，这款编织袋以更实惠的价格提供良好的强度和耐久性。其制造工艺确保了在一般包装和仓储应用中的可靠性能。",
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
  // 页面：护角
  // =================================================
  esquineros: {
    meta_title: "护角 | Grupo Ortiz",
    back_aria: "返回",
    specs_title: "技术规格",

    specs_labels: {
      tab:      "翼宽",
      thick:    "厚度",
      length:   "长度",
      tabyd:    "翼宽（码）",
      thickyd:  "厚度（码）",
      lengthyd: "长度（码）"
    },

    products: [
      {
        name: "棕色牛皮纸护角",
        description: "专为运输和仓储过程中保护边缘和棱角而制造，这款护角均匀分散压力，防止货物变形和损坏。其结构在高要求包装应用中提供强度和稳定性。",
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
        name: "白色牛皮纸护角",
        description: "专为运输和仓储过程中保护边缘和棱角而制造，这款护角均匀分散压力，防止货物变形和损坏。其结构在高要求包装应用中提供强度和稳定性。",
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
  // 页面：软包装
  // =================================================
  flexible_packaging: {
    meta_title: "软包装 | Grupo Ortiz",
    back_aria: "返回产品列表",
    specs_title: "技术规格",

    specs_labels: {
      lamination: "复合方式",
      finish:     "表面处理",
      size:       "尺寸",
      zipper:     "拉链",
      type:       "类型"
    },

    products: [
      {
        name: "印刷卷膜",
        description: "我们的卷膜提供多种复合方式、厚度和表面处理。可印刷多达10色，133线/英寸。最大展幅：1,140 mm。最大印刷宽度：1,450 mm。兼容自动包装机械，优化生产效率。",
        img: "/images/flexible/bobina-impresa.png",
        video: "/videos/flexible/bobinaf.mp4",
        gallery: [
          "/images/flexible/bobina-impresa-1.png",
          "/images/flexible/bobina-impresa.png",
          "/images/flexible/bobina-impresa-3.png"
        ],
        specs_values: {
          lamination: "BOPP/BOPP · BOPP/PE · PET/PE",
          finish:     "透明 · 镀铝 · 哑光 · 亮光",
          size:       "最大宽度1,450 mm",
          zipper:     "不适用",
          type:       "包装卷膜"
        }
      },
      {
        name: "自立袋",
        description: "多功能自立袋，采用复合结构和高阻隔防潮防氧性能。适用于干货或湿货食品、粉末、液体、化妆品和化学品。提供自然色、哑光和镀铝表面处理，规格从150克到1公斤，可选拉链封口和透明窗口。",
        img: "/images/flexible/standup-generica.png",
        video: "/videos/flexible/standup.mp4",
        gallery: [
          "/images/flexible/standup-generica-2.png",
          "/images/flexible/standup-generica.png",
          "/images/flexible/standup-generica-3.png"
        ],
        specs_values: {
          lamination: "高阻隔复合",
          finish:     "自然色 · 哑光 · 镀铝",
          size:       "150 g / 250 g / 500 g / 1 kg",
          zipper:     "有 / 无",
          type:       "自立袋"
        }
      },
      {
        name: "ORIGANICS系列自立袋",
        description: "带有精美装饰设计的袋装产品线：浆果、花卉、水果、麦穗、蓝色礼品和粉色礼品。拉链封口，结构坚固，自然色或镀铝表面处理。规格从150克到1公斤。是追求高品质和视觉吸引力包装的理想选择。",
        img: "/images/flexible/standup-origanics.png",
        video: "/videos/flexible/standup-origanics.mp4",
        gallery: [
          "/images/flexible/standup-origanics-2.png",
          "/images/flexible/standup-origanics.png",
          "/images/flexible/standup-origanics-3.png"
        ],
        specs_values: {
          lamination: "自然色 · 镀铝",
          finish:     "花卉 · 水果 · 麦穗 · 礼品",
          size:       "150 g / 250 g / 500 g / 1 kg",
          zipper:     "有",
          type:       "设计款自立袋"
        }
      },
      {
        name: "高真空袋",
        description: "专为最大限度延长肉类、奶酪、熟食和新鲜产品的保鲜期和货架寿命而设计。其气密封口去除空气，保留产品的天然特性，防止风味、口感和品质流失。采用高强度高阻隔材料制造。",
        img: "/images/flexible/bolsa-alto-vacio.png",
        video: "/videos/flexible/bolsa-alto-vacio.mp4",
        gallery: [
          "/images/flexible/bolsa-alto-vacio-1.png",
          "/images/flexible/bolsa-alto-vacio.png",
          "/images/flexible/bolsa-alto-vacio-3.png"
        ],
        specs_values: {
          lamination: "高阻隔多层复合",
          finish:     "透明",
          size:       "按产品定制",
          zipper:     "无",
          type:       "热封真空袋"
        }
      }
    ]
  },

  // =================================================
  // 页面：经销商（完整落地页）
  // =================================================
  distribuidor: {
    meta_title: "Grupo Ortiz经销商 | 官方合作伙伴",
    hero: {
      subtitle: "批发门户",
      title: "倍增 <br>您的<span>利润</span>",
      desc: "分销高需求产品，享受领先制造商的全力支持。库存保障，无中间商，24小时物流。",
      cta: "立即开始"
    },
    cards: [
      { icon: "ri-stack-line",        title: "充足库存",   desc: "即时满足大批量订单的能力。您的仓库永远充实。" },
      { icon: "ri-truck-line",        title: "24小时发货", desc: "自有物流体系。您的客户无需等待，我们以最快速度交付。" },
      { icon: "ri-shield-check-line", title: "质量保证",   desc: "无繁琐手续的实物换货。全方位品牌支持。" },
      { icon: "ri-line-chart-line",   title: "最优利润",   desc: "工厂直销价格，旨在最大化您的净利润。" }
    ],
    stats: [
      { val: 25, symbol: "k", label: "月产量（吨）" },
      { val: 35, symbol: "+", label: "年历史" },
      { val: 15, symbol: "M", label: "总销售额" }
    ],
    form: {
      title: "注册 <br>申请",
      desc: "加入我们的网络。填写您的资料以分配区域和优惠价格表。",
      support_label: "直接支持",
      labels: {
        name:     "联系人姓名",
        business: "公司名称",
        whatsapp: "WhatsApp",
        email:    "电子邮箱",
        products: "感兴趣的产品"
      },
      products_list: ["编织袋", "软包装", "拉菲草绳", "护角", "绳索", "缠绕膜", "其他", "全部"],
      btn:         "提交申请",
      success_msg: "申请已提交"
    }
  },

  // =================================================
  // 页面：关于我们
  // =================================================
  quienes_somos: {
    meta_title: "关于我们 | Grupo Ortiz",

    timeline: {
      title_white: "我们的",
      title_orange: "发展历程",
      nav_prev: "上一页",
      nav_next: "下一页",
      events: [
        {
          year: "1959",
          title: "创业起步",
          short: "创立于莫雷利亚",
          img: "tiempo/timeline-1959.webp",
          description: "自1959年起，Grupo Ortiz参与了墨西哥的工业发展。由Nicandro Ortiz在莫雷利亚创立，集团秉持坚定的愿景：将尖端技术与员工的才华和奉献精神相结合，打造一家稳固、创新且专注于品质的企业。"
        },
        {
          year: "1970",
          title: "工业扩张",
          short: "编织袋和网眼袋",
          img: "tiempo/timeline-1970.webp",
          description: "1970年，我们开始生产聚丙烯编织袋和网眼袋，标志着工业增长的关键阶段。这一战略举措增强了我们的运营能力，扩大了商业参与度，巩固了我们在国内市场的地位。"
        },
        {
          year: "1985",
          title: "技术创新",
          short: "欧洲机械设备",
          img: "tiempo/timeline-1985.webp",
          description: "1985年，我们引进了最先进的欧洲机械设备，加强了工业基础设施并优化了生产流程。这项战略投资提升了质量标准，提高了运营效率，重申了我们对技术创新的承诺。"
        },
        {
          year: "1995",
          title: "多元化发展",
          short: "新产品线",
          img: "tiempo/timeline-1995.webp",
          description: "1995年，我们扩展了生产线，增加了缠绕膜、软包装和工业专用产品。这一战略扩张丰富了我们的产品组合，增强了行业竞争力，使我们能够满足国内市场的新需求。"
        },
        {
          year: "2005",
          title: "国际化扩张",
          short: "美洲和欧洲",
          img: "tiempo/timeline-2005.webp",
          description: "2005年，我们开始向美洲和欧洲出口，迈出了国际扩张的决定性一步。这一成就使公司成为塑料聚合物行业的标杆，加强了全球影响力，巩固了在国际市场的竞争力。"
        },
        {
          year: "2015",
          title: "可持续发展",
          short: "回收工厂",
          img: "tiempo/timeline-2015.webp",
          description: "2015年，我们建立了回收工厂并加强了可持续发展项目，重申了对环境保护的承诺。这一战略举措优化了资源利用，推动了负责任的实践，巩固了我们的发展愿景。"
        },
        {
          year: "2026",
          title: "当下",
          short: "行业领导者",
          img: "tiempo/timeline-2026.webp",
          description: "2026年，我们拥有17家生产工厂、超过4,000名员工和22万吨的年产能。这一持续增长巩固了我们在塑料行业的领导地位，依托坚实的基础设施、专业的人才团队和面向未来的战略愿景。"
        }
      ]
    },

    filosofia: {
      label: "我们的原则",
      title: "GO理念",
      items: [
        "专注于客户满意度，而非竞争对手。",
        "热衷于发明和持续创新。",
        "每个环节追求卓越运营。",
        "长远思维，即时见效。",
        "成为最佳雇主和地球上最安全的工作场所。"
      ]
    },

    vision: {
      label: "我们的方向",
      title: "愿景",
      items: [
        "成为地球上最以客户为导向的公司。",
        "为任何企业提供全方位综合解决方案。",
        "成为地球上任何企业唯一的包装解决方案。",
        "在不失人文关怀的前提下实现全球化发展。"
      ]
    },

    infraestructura: {
      title_white:  "实力",
      title_orange: "基础设施",
      stats: [
        { number: "10",      label: "生产工厂",     desc: "战略布局的生产设施，服务国内外市场。", icon: "number" },
        { number: "+3,000",  label: "员工",         desc: "推动每一个生产环节的专业团队。", icon: "number" },
        { number: "260",     label: "物流车辆",     desc: "自有车队确保国内外高效配送和安全交付。", icon: "number" },
        { number: "Global",  label: "国际影响力",   desc: "向美洲和欧洲出口和分销。", icon: "globe" }
      ]
    },

    plantas: {
      title:    "我们的工厂",
      subtitle: "17家生产工厂",
      locations: [
        { key: "monterrey", number: "1 家工厂",  badge: "蒙特雷，新莱昂州" },
        { key: "michoacan", number: "16 家工厂", badge: "莫雷利亚，米却肯州" }
      ]
    },

    instalaciones: {
      title_white:  "我们的",
      title_orange: "设施",
      subtitle:     "360°虚拟参观",
      badge_soon:   "即将推出",
      badge_tour:   "查看参观",
      btn_tour:     "查看3D参观",
      btn_soon:     "即将推出",
      items: [
        {
          id: "extrusoras", num: "01",
          title: "缠绕膜",
          tag:   "莫雷利亚，米却肯州",
          desc:  "高产能挤出生产线，将聚丙烯转化为精密扁丝。",
          thumb: "/images/virtual/RT.webp",
          link:  "https://my.matterport.com/show/?m=YoM2tyXMeyb&ss=2&sr=2.97,.12&play=1&qs=1&ts=1",
          soon:  true
        },
        {
          id: "telares", num: "02",
          title: "网眼袋",
          tag:   "莫雷利亚，米却肯州",
          desc:  "最先进的织机编织纱线，生产最大均匀度的聚丙烯织物。",
          link:  "https://my.matterport.com/show/?m=2xCe1VajMjj&ss=1&sr=2.28,-1.47&play=1&qs=1&ts=1",
          thumb: "/images/virtual/RA.webp",
          soon:  false
        },
        {
          id: "laminado", num: "03",
          title: "覆膜与印刷",
          tag:   "莫雷利亚，米却肯州",
          desc:  "覆膜和柔版印刷区域，编织袋在此接受表面处理、印刷和最终品质加工。",
          link:  "",
          thumb: "/images/virtual/RS.webp",
          soon:  true
        },
        {
          id: "reciclado", num: "04",
          title: "回收工厂",
          tag:   "莫雷利亚，米却肯州",
          desc:  "我们的聚丙烯回收中心，致力于循环经济和环境保护。",
          link:  "",
          soon:  true
        }
      ]
    },

    capacidad: {
      title:         "装机产能",
      subtitle:      "高性能基础设施",
      planta_label:  "工厂",
      plantas_label: "工厂",
      items: [
        { num: "04", label: "编织袋生产",     width: 100, delay: 0   },
        { num: "02", label: "网眼袋生产",     width: 50,  delay: 100 },
        { num: "01", label: "绳索和拉菲草绳", width: 25,  delay: 200 },
        { num: "02", label: "缠绕膜",         width: 50,  delay: 300 },
        { num: "01", label: "软包装",         width: 25,  delay: 400 },
        { num: "01", label: "回收",           width: 25,  delay: 500 },
        { num: "03", label: "护角",           width: 75,  delay: 600 },
        { num: "01", label: "打包带",         width: 25,  delay: 700 },
        { num: "01", label: "一次性用品",     width: 25,  delay: 800 },
        { num: "01", label: "塑料袋",         width: 25,  delay: 900 }
      ]
    },

    valores: {
      title:    "我们的价值观",
      subtitle: "企业文化的支柱",
      items: [
        { title: "责任",   description: "我们以道德和专业精神履行承诺，充分认识到我们的行为对客户、员工和社区的影响。" },
        { title: "信任",   description: "我们以透明、诚实和信守承诺为基础建立稳固的关系，在每一次互动中创造安全感。" },
        { title: "热情",   description: "我们热爱我们所做的一切，并将其体现在每一个产品、流程和创新中，以热忱和奉献推动卓越。" },
        { title: "坚韧",   description: "我们以决心和毅力面对挑战，坚定目标直至取得非凡成果。" },
        { title: "纪律",   description: "我们以严谨有序的方式遵循流程和质量标准，确保每次交付的一致性和卓越性。" },
        { title: "主动",   description: "我们预见需求并在问题出现之前采取行动，创造持续产生价值的创新解决方案。" },
        { title: "尊重",   description: "我们尊重每个人的多样性、尊严和贡献，营造协作、包容和公平对待的环境。" }
      ]
    }
  },

  // =================================================
  // 页脚
  // =================================================
  footer: {
    about_us:         "关于我们",
    about:            "公司简介",
    social_impact:    "社会影响",
    customer_service: "客户服务",
    be_distributor:   "成为经销商",
    catalog:          "产品目录",
    cta_button:       "我想成为经销商",
    rights:           "版权所有。"
  },

  // =================================================
  // 页面：社会影响
  // =================================================
  impacto_social: {
    page_title: "社会影响 | Grupo Ortiz",

    hero: {
      eyebrow:          "社会影响",
      title_top:    "携手共建",
      title_bottom: "更美好的世界",
      subtitle:         "我们支持家庭，赋能女性，给予第二次机会，关爱地球。我们迈出的每一步都致力于改变生活，构建充满希望的未来。",
      stat_female:      "% 女性员工",
      stat_recycled:    "吨回收量",
      stat_initiatives: "项活跃举措"
    },

    ods: {
      title:       "我们的指引",
      subtitle:    "2030年议程",
      description: "我们以联合国可持续发展目标为指引，共建更公正、繁荣和可持续的世界。",
      cards: [
        { n: 1,  title: "消除贫困",         link: "https://sdgs.un.org/es/goals/goal1",  img: "/images/odc/1.png"  },
        { n: 2,  title: "零饥饿",           link: "https://sdgs.un.org/es/goals/goal2",  img: "/images/odc/2.png"  },
        { n: 3,  title: "良好健康与福祉",   link: "https://sdgs.un.org/es/goals/goal3",  img: "/images/odc/3.png"  },
        { n: 4,  title: "优质教育",         link: "https://sdgs.un.org/es/goals/goal4",  img: "/images/odc/4.png"  },
        { n: 5,  title: "性别平等",         link: "https://sdgs.un.org/es/goals/goal5",  img: "/images/odc/5.png"  },
        { n: 6,  title: "清洁饮水",         link: "https://sdgs.un.org/es/goals/goal6",  img: "/images/odc/6.png"  },
        { n: 7,  title: "经济适用的清洁能源", link: "https://sdgs.un.org/es/goals/goal7",  img: "/images/odc/7.png"  },
        { n: 8,  title: "体面工作",         link: "https://sdgs.un.org/es/goals/goal8",  img: "/images/odc/8.png"  },
        { n: 9,  title: "产业创新和基础设施", link: "https://sdgs.un.org/es/goals/goal9",  img: "/images/odc/9.png"  },
        { n: 10, title: "减少不平等",       link: "https://sdgs.un.org/es/goals/goal10", img: "/images/odc/10.png" },
        { n: 11, title: "可持续城市",       link: "https://sdgs.un.org/es/goals/goal11", img: "/images/odc/11.png" },
        { n: 12, title: "负责任消费和生产", link: "https://sdgs.un.org/es/goals/goal12", img: "/images/odc/12.png" },
        { n: 13, title: "气候行动",         link: "https://sdgs.un.org/es/goals/goal13", img: "/images/odc/13.png" },
        { n: 14, title: "水下生物",         link: "https://sdgs.un.org/es/goals/goal14", img: "/images/odc/14.png" },
        { n: 15, title: "陆地生物",         link: "https://sdgs.un.org/es/goals/goal15", img: "/images/odc/15.png" },
        { n: 16, title: "和平与正义",       link: "https://sdgs.un.org/es/goals/goal16", img: "/images/odc/16.png" },
        { n: 17, title: "促进目标实现的伙伴关系", link: "https://sdgs.un.org/es/goals/goal17", img: "/images/odc/17.png" },
      ]
    },

    vision: {
      title:        "我们的积极",
      title_orange: "影响",
      subtitle:     "变革行业",
      pilars: [
        {
          label: "支柱 01",
          title: "大地的产品",
          desc:  "开发创新环保材料用于软包装，尊重环境并减少碳足迹。",
          img:   "/images/impacto/products.webp"
        },
        {
          label: "支柱 02",
          title: "大地的实践",
          desc:  "在所有生产流程中实施清洁制造和循环经济，闭合循环并消除浪费。",
          img:   "/images/impacto/practices.webp"
        },
        {
          label: "支柱 03",
          title: "社会大地",
          desc:  "对客户、员工和社区的全面承诺，创造积极的社会影响和真实的机会。",
          img:   "/images/impacto/social.webp"
        }
      ]
    },

    oceanos: {
      hero_title:           "致力于为我们的海洋",
      hero_title_highlight: "创造更清洁的未来",
      intro: "在Grupo Ortiz，我们相信一个海洋重新闪耀的世界。通过支持The Ocean Cleanup和Lonely Whale发起的Tom Ford塑料创新奖等全球倡议，我们努力减少海洋中的塑料。您每一次的购买都是迈向更清洁星球和可持续未来的一步。让我们携手拯救海洋！",
      features: [
        { title: "支持全球清洁行动",     desc: "与The Ocean Cleanup等倡议合作。" },
        { title: "推动可持续创新",       desc: "通过Tom Ford塑料创新奖等项目。" },
        { title: "倡导负责任的产品",     desc: "减少对海洋的环境影响。" },
        { title: "激励集体行动",         desc: "邀请客户和合作伙伴成为变革的一部分。" }
      ],
      partners: [
        {
          title:  "Tom Ford创新",
          desc:   "这项全球倡议旨在通过奖励和推广替代一次性塑料的创新解决方案来革新塑料行业。其重点在于可持续且可扩展的替代方案，以减少环境影响、保护海洋，并推动向更负责任的材料转变。",
          btn:    "了解更多",
          link:   "https://unwrapthefuture.org/",
          video:  "/videos/impacto/oceancleanup.mp4",
          poster: "/images/impacto/cultura-calidad.jpg"
        },
        {
          title:  "海洋清洁",
          desc:   "致力于清洁世界海洋，该组织开发先进技术清除海洋中积累的塑料，并通过干预河流——主要污染源——防止塑料流入海洋。其使命是恢复海洋生态系统的健康，保护生物多样性，为后代确保一个清洁的未来。",
          btn:    "了解更多",
          link:   "https://theoceancleanup.com/",
          video:  "/videos/impacto/tomford.mp4",
          poster: "/images/impacto/tomford.webp"
        }
      ]
    },

    stats: {
      recycled: "吨回收量",
      female:   "% 女性员工",
      families: "受益家庭"
    },

    timeline: {
      title:    "变革性举措",
      subtitle: "持久的积极影响",
      items: [
        {
          num: "01", title: "希望之家",
          desc:       "支持米却肯州塔坎巴罗的儿童之家。每个孩子都值得拥有一个充满爱的家。",
          desc_short: "支持米却肯州塔坎巴罗的儿童之家。",
          img:        "/images/impacto/hogar.mp4",
          isVideo:    true,
          poster:     "/images/impacto/hogar.webp"
        },
        {
          num: "02", title: "GO爱心食品",
          desc:       "团结社区。用爱心递送食品篮。",
          desc_short: "用爱心向社区递送食品篮。",
          img:        "/images/impacto/despensas.webp",
          isVideo:    false
        },
        {
          num: "03", title: "零足迹",
          desc:       "零废弃政策。将废物转化为机遇。",
          desc_short: "零废弃政策。转化废物。",
          img:        "/images/impacto/composta.webp",
          isVideo:    false
        },
        {
          num: "04", title: "活力堆肥",
          desc:       "生产可堆肥产品。尊重自然的创新。",
          desc_short: "可堆肥产品。可持续创新。",
          img:        "/images/impacto/GO.webp",
          isVideo:    false
        },
        {
          num: "05", title: "GO之光",
          desc:       "GO团队绩效奖励。认可每一份努力。",
          desc_short: "认可GO团队的卓越表现。",
          img:        "/images/impacto/woman.webp",
          isVideo:    false
        },
        {
          num: "06", title: "引领的双手",
          desc:       "84%女性员工。赋能女性领导者。",
          desc_short: "56.82%女性员工。赋能领导者。",
          img:        "/images/impacto/bio.webp",
          isVideo:    false
        }
      ]
    },

    cta: {
      title:        "携手",
      title_orange: "共创变革",
      desc:         "我们是您的企业以技术、经验和成果实现增长所需的战略合作伙伴。",
      contact:      "联系我们",
      products:     "查看产品"
    }
  },

  // =================================================
  // 页面：首页
  // =================================================
  home: {
    meta_title: "首页 | Grupo Ortiz",

    hero: {
      eyebrow:      "始于1959年",
      title_top:    "我们是拉丁美洲",
      title_bot:    "领先的制造商",
      video:        "home/maquina.mp4",
      subtitle:     "超过65年为五大洲的工业客户制造高工程解决方案。",
      btn_products: "我们的产品",
      btn_about:    "了解更多",
      stats: [
        { number: 65,   label: "年经验" },
        { number: 3000, prefix: "+", label: "名员工" },
        { number: 5,    prefix: "", label: "大洲" }
      ]
    },

    divisiones: {
      tag:       "我们的事业部",
      title:     "专业",
      title_em:  "领域",
      link_text: "查看产品",
      items: [
        {
          title: "网眼袋",        tag: "事业部 01",
          description: "平织和圆织聚丙烯拉菲草网眼袋。通风设计，非常适合水果、蔬菜和农产品。",
          img: "/images/divisiones/arpilla.webp",           color: "#2d8a4e",  slug: "arpillas",           soon: false
        },
        {
          title: "绳索",          tag: "事业部 02",
          description: "高韧性聚丙烯绳索，用于农业、工业和航海用途。优异的耐候性，内置UV滤光保护。",
          img: "/images/divisiones/cuerdas.webp",           color: "#1a5f8a",  slug: "cuerdas",            soon: false
        },
        {
          title: "拉菲草绳",      tag: "事业部 03",
          description: "高性能聚丙烯拉菲草绳。重量极轻，断裂强度高，适用于农业、禽业和园艺的多功能材料。",
          img: "/images/divisiones/rafia.webp",             color: "#8a6d2d",  slug: "rafias",             soon: false
        },
        {
          title: "软包装",        tag: "事业部 04",
          description: "高阻隔薄膜和专业复合材料。采用尖端技术为食品和工业产品提供最佳保护。",
          img: "/images/divisiones/bolsa.webp",             color: "#0d7377",  slug: "empaques-flexibles", soon: false
        },
        {
          title: "编织袋",        tag: "事业部 05",
          description: "优质拉菲草编织袋。适用于食品、化工产品、化肥和散装产品的坚固包装解决方案。",
          img: "/images/divisiones/sacos.webp",             color: "#3a7d44",  slug: "sacos",              soon: false
        },
        {
          title: "缠绕膜",        tag: "事业部 06",
          description: "高光学透明度的拉伸缠绕膜。以高性价比确保货物完整性。包括可生物降解选项。",
          img: "/images/divisiones/film-estirable.webp",    color: "#2c5f8a",  slug: "stretch-film",       soon: false
        },
        {
          title: "护角",          tag: "事业部 07",
          description: "牛皮纸纸板护角，在仓储和运输过程中保护边缘。均匀分散压力，最大化货物稳定性。",
          img: "/images/divisiones/esquineros.webp",        color: "#7b3fa0",  slug: "esquineros",         soon: false
        },
        {
          title: "一次性用品",    tag: "事业部 10",
          description: "聚丙烯一次性用品，适用于工业、食品服务和医疗用途。卫生、经济且高强度的解决方案。",
          img: "/images/divisiones/desechables.webp",       color: "#e05500",  slug: "desechables",        soon: true
        }
      ]
    },

    porque: {
      tag:           "为什么选择我们",
      title:         "超过65年",
      title_em:      "的行业领导力",
      body:          "我们是墨西哥和拉丁美洲塑料聚合物行业的标杆，拥有认证流程和全球响应能力。",
      btn:           "我们的历史",
      badge1_label:  "业务单元",
      badge1_number: 10,
      badge2_label:  "事业部",
      badge2_number: 6,
      img:           "/images/planta-produccion.webp",
      features: [
        { title: "认证品质",   description: "产品符合最高国际制造标准。" },
        { title: "持续创新",   description: "持续投资研发以保持行业技术领先地位。" },
        { title: "全球覆盖",   description: "活跃于五大洲，拥有高效的分销网络。" }
      ]
    },

    certs: {
      tag:      "品质保障",
      title:    "我们的",
      title_em: "资质认证",
      items: [
        { code: "Kosher Pareve", name: "KMD México",     img: "/images/certificaciones/KOSHER.jpeg"   },
        { code: "FSSC 22000",    name: "LRQA Certified", img: "/images/certificaciones/LRQA.png"      },
        { code: "AIB International", name: "Since 1919", img: "/images/certificaciones/AIB.png"       },
        { code: "ISO 9001",      name: "Bureau Veritas", img: "/images/certificaciones/CERTIFIED.png" }
      ]
    },

    compromiso: {
      card1: {
        eyebrow: "我们的理念",
        title:   "创新",
        text:    "我们投资于研发，以尖端技术提供超越全球市场期望的产品。"
      },
      card2: {
        eyebrow: "我们的承诺",
        title:   "可持续发展",
        text:    "对环境负责的生产流程，积极的回收计划，以及贯穿整个供应链的碳足迹减排。"
      }
    },

    global: {
      tag:      "全球影响力",
      title:    "出口",
      title_em: "全球",
      desc:     "我们的产品销往30多个国家的客户，巩固了我们在塑料聚合物领域的领导地位。",
      video:    "/camion.mp4",
      stats: [
        { number: 65,   label: "年" },
        { number: 30,   prefix: "+", label: "个国家" },
        { number: 3000, prefix: "+", label: "名员工" },
        { number: 5,    prefix: "",  label: "大洲" }
      ]
    },

    cta: {
      tag:      "准备好开始了吗？",
      title:    "让我们",
      title_em: "携手合作",
      sub:      "了解我们的解决方案如何提升您的运营效率",
      btn:      "联系我们"
    }
  }

};