// src/i18n/zh.js

export const zh = {
  // =================================================
  // 导航栏
  // =================================================
  nav: {
    home: '首页',
    products: '产品',
    catalog: '目录',
    promos: '促销',
    about: '关于我们',
    company: '公司介绍',
    social: '社会影响',
    distributor: '经销商',
    contact: '联系我们'
  },

  // =================================================
  // 主视觉 / 封面
  // =================================================
  hero: {
    title: "欢迎",
    subtitle: "经久不衰的品质"
  },

  // =================================================
  // 通用文本
  // =================================================
  common: {
    seeMore: "查看更多",
    division: "部门",
    buy: "购买",
    redirecting: "正在跳转...",
    download: "下载",
    language: "语言",
    scrollDown: "向下滑动",
    previous: "上一个",
    next: "下一个"
  },

  // =================================================
  // 聊天机器人 (BotGo)
  // =================================================
  chatbot: {
    greeting: '您好！我是 BotGo 🤖，有什么可以帮助您的吗？',
    placeholder: '输入消息...',
    listeningState: '正在聆听...',
    thinking: '思考中...',
    errorMsg: '连接错误。',
    salesBtn: '通过 WhatsApp 询价',
    voiceAssistantTitle: '虚拟助手',
    voiceCode: 'zh-CN',
    waStart: '您好，Grupo Ortiz，我想获取一份报价',
    pdfBtn: '查看 PDF 目录',
  },

  // =================================================
  // 促销页面
  // =================================================
  promociones: {
    meta_title: "促销 | Grupo Ortiz",
    hero: {
      label: "特别优惠",
      title: "促销活动",
      subtitle: "把握我们的限时优惠",
      validity: "有效期至库存售完为止*"
    },
    discount_badge: "最高",
    off_text: "折扣",
    original_price: "原价",
    promo_price: "特惠价",
    buy_button: "申请报价",
    contact_cta: "联系顾问了解更多信息",
    valid_until: "有效期至库存售完为止*",

    products: [
      {
        id: "promo-stretch",
        name: "缠绕膜",
        subtitle: "彩色缠绕膜每公斤 $33",
        image: "/images/stretch/manual.webp",
        discount: 35,
        originalPrice: "",
        promoPrice: "$33/公斤",
        features: [
          "彩色拉伸薄膜",
          "每公斤特惠价格",
          "库存有限",
          "提供多种颜色"
        ],
        validUntil: "有效期至库存售完为止*"
      },
      {
        id: "promo-cuerda",
        name: "绳索",
        subtitle: "每公斤 $33",
        image: "/images/cuerdas/CuerdaT1.webp",
        discount: 25,
        originalPrice: "",
        promoPrice: "$33/公斤",
        features: [
          "高品质绳索",
          "每公斤特惠价格",
          "限时优惠",
          "库存数量有限"
        ],
        validUntil: "有效期至库存售完为止*"
      }
    ]
  },

  // =================================================
  // 目录页面
  // =================================================
  catalog: {
    hero: {
      label: "文档资料",
      title: "综合目录",
      description: "将品质与整合解决方案融于一份文档。请选择您偏好的语言以获取我们的企业介绍。",
      scrollText: "查看各部门"
    },
    carousel: {
      label: "可下载资料",
      title: "各部门目录",
    },
    languageLabel: "Language / Idioma",
    downloadButton: "下载 PDF",
    divisions: [
      {
        id: "1",
        name: "缠绕膜",
        desc: "用于固定和保护货物的拉伸薄膜。高效的托盘包装和安全运输解决方案。",
        image: "/images/catalogo/img1.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1HYGcpgkRO_7OX22IcWvRpzpLZKgpYV3A/view?usp=sharing",
          en: "https://drive.google.com/file/d/1QZ6jmKyc-CGLwh9brbeZSQ5OOzkKdBCQ/view?usp=sharing",
        }
      },
      {
        id: "2",
        name: "绳索",
        desc: "适用于工业和渔业捆绑的高强度耐用绳索。采用优质材料制造，适合高强度使用。",
        image: "/images/catalogo/img2.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/14GrV9P1ViQKvFp3BucYjgmryRgWKLEZh/view?usp=sharing",
          en: "https://drive.google.com/file/d/19Tvd_VHjogSE7y7cLZYr4ra__4vB4nOm/view?usp=sharing",
        }
      },
      {
        id: "3",
        name: "拉菲草",
        desc: "农业和工业捆扎的标准之选。适用于多种场合的耐用柔性材料。",
        image: "/images/catalogo/img3.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1uAiR4uxO2iX_LsNFul6kXeb7jnnCEV_J/view?usp=sharing",
          en: "https://drive.google.com/file/d/10PV-sxexE8UkFSOhdTJBe1xWCy_tdFib/view?usp=sharing",
        }
      },
      {
        id: "4",
        name: "网眼袋",
        desc: "开放网眼织物，实现最大通风效果。适用于农产品包装和运输的多功能解决方案。",
        image: "/images/catalogo/img4.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1OQKGpnRCfA2yFdAlT6q7GczYua2FFFVU/view?usp=sharing",
          en: "https://drive.google.com/file/d/1wldGL6XuqH-Ruth9Y01-hkNnPlbg9SW5/view?usp=sharing",
        }
      },
      {
        id: "5",
        name: "编织袋",
        desc: "平织聚丙烯散装包装袋。超强承重能力，适用于散装产品。",
        image: "/images/catalogo/img5.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/16S43-PUrQECO9q2J1fOgbN-YeIxQ2GhP/view?usp=sharing",
          en: "https://drive.google.com/file/d/1fkZvAWTT3mnBkxQ0Gbb2kRgOoN2dJZiK/view?usp=sharing",
        }
      },
      {
        id: "6",
        name: "护角",
        desc: "托盘结构保护和稳定性。物流和货物储存中不可缺少的加固配件。",
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
  // 主产品列表（轮播 /products）
  // =================================================
  products_list: [
    {
      img: "carrusel/img1.webp",
      division: "缠绕膜",
      descripcion: "高光学透明度缠绕膜，符合质量标准。保障货物完整性并降低成本。我们的产品线包括可生物降解选项，降解速度比普通产品快90%。",
      slug: "stretch-film",
      video: "carrusel/stretch-film.mp4"
    },
    {
      img: "carrusel/img2.webp",
      division: "绳索",
      descripcion: "高性能聚丙烯（PP）长丝绳索。完美平衡：极轻的重量，同时不牺牲断裂强度。",
      slug: "cuerdas",
      video: "carrusel/cuerdas.mp4"
    },
    {
      img: "carrusel/img3.webp",
      division: "拉菲草",
      descripcion: "高性能聚丙烯（PP）薄膜拉菲草。重量极轻，断裂强度高，柔性强，用途广泛。",
      slug: "rafias",
      video: "carrusel/rafia.mp4"
    },
    {
      img: "carrusel/img4.webp",
      division: "网眼袋",
      descripcion: "采用增强型「L」形缝合的平织聚丙烯拉菲草网眼袋。通风设计，非常适合水果和蔬菜。",
      slug: "arpillas",
      video: "carrusel/arpillas.mp4"
    },
    {
      img: "carrusel/img5.webp",
      division: "编织袋",
      descripcion: "优质拉菲草编织袋。适用于食品、化学品和肥料的坚固包装解决方案。",
      slug: "sacos",
      video: "carrusel/sacos.mp4"
    },
    {
      img: "carrusel/img6.webp",
      division: "护角",
      descripcion: "瓦楞纸板护角，优化物流效率。提供结构强度和更高的货物稳定性。",
      slug: "esquineros",
      video: "carrusel/esquineros.mp4"
    },
    {
      img: "carrusel/img7.webp",
      division: "软包装",
      descripcion: "Neo Empaques International 专注于先进的软包装解决方案，旨在优化多个行业产品的保存和展示效果。",
      slug: "empaques-flexibles",
      video: "carrusel/bobina-impresa.mp4"
    }
  ],

  // =================================================
  // 页面：缠绕膜
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
        name: '优质缠绕膜',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "专为手动托盘包装设计，这款中等拉伸率缠绕膜无需自动化机械即可高效固定货物，提供实用便捷的包装解决方案。其成分确保了良好的抗拉强度和可靠的包装性能。",
        specs_values: { width: "19-30 厘米", length: "1000-15000", gauge: "40-110", weight: "10-40 公斤", type: "手动" },
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
        description: "专为低速和中速缠绕机设计，这款缠绕膜在自动化托盘包装流程中提供高性能和出色效果。其配方确保了货物固定的抗拉强度和稳定性。",
        specs_values: { width: "18-30 厘米", length: "2000-15000", gauge: "50-110", weight: "10-49 公斤", type: "自动" },
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
        description: "专为高性能手动应用设计，这款预拉伸膜以市场上最薄的规格之一著称。其技术消除了缠绕时施加额外力的需要，可立即使用，提高托盘包装效率。",
        specs_values: { width: "16-17 厘米", length: "7000-25000", gauge: "40-120", weight: "10-40 公斤", type: "手动" },
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
        description: "专为中等拉伸率的手动缠绕应用设计，这款传统缠绕膜在包装和货物固定流程中表现出色。其成分确保了通用应用的抗拉强度和稳定性。",
        specs_values: { width: "3-12 厘米", length: "7000-25000", gauge: "40-120", weight: "10-40 公斤", type: "手动" },
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
        description: "专为有限拉伸率手动缠绕应用特别配制，这款缠绕膜在包装流程中提供高性能和高可靠性。其成分确保货物固定的稳定性和效率。",
        specs_values: { width: "17-30 厘米", length: "1000-15000", gauge: "40-90", weight: "10-40 公斤", type: "手动", color: "黑色/彩色" },
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
      load: "产率",
      mat: "材料",
      weight: "重量",
      resist: "抗拉强度",
      charge: "规格"
    },

    products: [
      {
        name: '五金绳',
        img: '/images/cuerdas/CuerdaT1.webp',
        video: "/videos/cuerdas/cuerda-1.mp4",
        link: '#',
        description: "采用聚丙烯和先进紫外线过滤器制成，这款绳索非常适合高日照环境下的作业。其专业配方可延缓自然磨损，延长使用寿命，确保更强的耐候性和耐久性。是适合一般性和高强度应用的理想五金绳索。",
        specs_values: { load: "1,980 米", mat: "PP-UV", weight: "18 公斤", resist: "175 公斤", charge: "4-19 毫米" },
        gallery: [
          '/images/cuerdas/CuerdaT1-2.png',
          '/images/cuerdas/CuerdaT1.webp',
          '/images/cuerdas/CuerdaT1-1.png'
        ]
      },
      {
        name: '温室绳',
        img: '/images/cuerdas/CuerdaNegra.webp',
        video: "/videos/cuerdas/CuerdaI.mp4",
        link: '#',
        description: "采用聚丙烯（PP）和紫外线稳定剂制成，这款绳索非常适合海洋领域和高日照作业。其专业配方可延缓紫外线辐射造成的降解，延长使用寿命并确保更强的耐候性。是农业大棚中提供牢固性和稳定性的完美解决方案。",
        specs_values: { load: "3,240 米", mat: "PP-UV", weight: "18 公斤", resist: "105 公斤", charge: "3-8 毫米" },
        gallery: [
          '/images/cuerdas/CuerdaNegra6-1.png',
          '/images/cuerdas/CuerdaNegra.webp',
          '/images/cuerdas/CuerdaNegra6-3.png'
        ]
      },
      {
        name: '环保绳',
        img: '/images/cuerdas/CuerdaEco.png',
        video: "/videos/cuerdas/CuerdaE.mp4",
        link: '#',
        description: "采用优质聚丙烯（PP）制成，这款绳索提供多种规格、粗细和颜色，有素色或拼色版本，可带加固或品牌标识。其多功能性和耐久性使其成为工厂、仓库、批发市场、五金店和机械加工区域多种应用的可靠选择。",
        specs_values: { load: "3,240 米", mat: "PP-UV", weight: "18 公斤", resist: "105 公斤", charge: "3-8 毫米" },
        gallery: [
          '/images/cuerdas/CuerdaEco1.png',
          '/images/cuerdas/CuerdaEco.png',
          '/images/cuerdas/CuerdaEco3.png'
        ]
      }
    ]
  },

  // =================================================
  // 页面：拉菲草
  // =================================================
  rafias: {
    meta_title: "拉菲草 | Grupo Ortiz",
    back_aria: "返回",
    specs_title: "技术规格",

    specs_labels: {
      cal: "规格",
      yield: "产率（米）",
      resist: "抗拉强度（公斤）",
      usage: "材料"
    },

    products: [
      {
        name: "捆扎拉菲草",
        description: "采用100%原生聚丙烯制成，这款拉菲草具有高抗拉强度和出色产率，即使在户外条件下也能保持其物理性能。其质量确保了在高要求应用中的耐久性和可靠性。广泛应用于农业、家禽和园艺领域。",
        img: "/images/rafias/atar.png",
        video: "/videos/rafia/fondoN.mp4",
        specs_values: {
          cal: "2-8 毫米",
          yield: "90 公斤",
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
        name: "环保拉菲草",
        description: "采用优质聚丙烯制成，这款拉菲草具有出色的抗拉强度，即使在户外条件下也能保持其物理性能。其可靠的性能使其成为农业、家禽和园艺应用的理想选择。",
        img: "/images/rafias/Eco.png",
        video: "/videos/rafia/fondoE.mp4",
        specs_values: {
          cal: "2-8",
          yield: "90-500 公斤",
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
        name: "黑色原纤化拉菲草",
        description: "采用优质聚丙烯制成，这款拉菲草具有极强的抗拉能力，即使在户外条件下也能保持其物理性能。其出色的性能使其非常适合工业、五金和包装应用，以及农业、家禽和园艺领域。",
        img: "/images/rafias/negra.png",
        video: "/videos/rafia/fondoR.mp4",
        specs_values: {
          cal: "2-8",
          yield: "90-500 公斤",
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
      construction: "结构",
      sizes: "宽度",
      colors: "颜色",
      features: "封口类型"
    },

    products: [
      {
        name: '圆织网眼袋',
        img: '/images/arpillas/arpilla.png',
        video: "/videos/arpilla/circular.mp4",
        link: '#',
        description: "采用100%原生聚丙烯和拉菲草结构制成，这款网眼袋在包装和储存应用中提供高抗拉强度和出色性能。其质量确保了在处理各种产品时的耐久性和可靠性。",
        specs_values: {
          sizes: "23-70 厘米",
          colors: "4",
          features: "束口"
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
        description: "采用100%原生聚丙烯和拉菲草/单丝结构制成，这款网眼袋在包装和储存应用中提供高抗拉强度和出色性能。其结构在处理和保护各种产品时具有耐久性和可靠性。",
        specs_values: {
          construction: "单丝",
          sizes: "23-70 厘米",
          colors: "2",
          features: "束口"
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
        description: "采用100%原生聚丙烯和拉菲草/单丝结构制成，这款网眼袋在包装和储存应用中提供高抗拉强度和出色性能。其结构确保在处理各种产品时的耐久性和可靠性。",
        specs_values: {
          type: "侧面",
          construction: "单丝",
          sizes: "23-60 厘米",
          colors: "4",
          features: "加固"
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
        description: "采用100%原生聚丙烯和拉菲草/拉菲草结构制成，这款网眼袋在包装和储存流程中提供高抗拉强度和出色性能。其编织结构确保了在国内外出口市场高要求应用中的耐久性和可靠性。",
        specs_values: {
          type: "覆膜",
          construction: "拉菲草",
          sizes: "23-70 厘米",
          colors: "4",
          features: "束口"
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
      weight: "抗拉强度"
    },

    products: [
      {
        name: '普通拉菲草编织袋',
        img: '/images/sacos/saco2.png',
        model: '/models/saco_blanco.glb',
        video: "/videos/saco/slaminar.mp4",
        link: '#',
        description: "由交织的聚丙烯扁丝制成，普通拉菲草编织袋在包装和储存应用中提供极强的抗拉强度和出色的耐久性。其结构可承受重载而不破裂，确保在高强度工作中的可靠性能。",
        specs_values: {
          load: "35-80 厘米",
          unit: "49-115 厘米",
          mat: "PP",
          weight: "120-200 公斤力"
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
        description: "由聚丙烯扁丝制成，具有透明外观，这款袋子提供高抗拉强度，并能清晰展示内装产品。其结构确保在储存和运输应用中的耐久性和可靠性能。",
        specs_values: {
          load: "35-80 公斤",
          unit: "49-115 厘米",
          mat: "PP",
          weight: "120-200 公斤力"
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
        description: "由生产过程中产生的废料回收材料制成，这款袋子以更实惠的价格提供抗拉强度和良好的耐久性。其制造工艺确保在一般包装和储存应用中的可靠性能。",
        specs_values: {
          load: "30-80 公斤",
          unit: "49-115 厘米",
          mat: "PP",
          weight: "120-200 公斤力"
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
        description: "专为在运输和储存过程中保护边缘和棱角而设计，这款护角能均匀分散压力，防止货物变形和损坏。其结构在高要求的包装应用中提供抗拉强度和稳定性。",
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
        description: "专为在运输和储存过程中保护边缘和棱角而设计，这款护角能均匀分散压力，防止货物变形和损坏。其结构在高要求的包装应用中提供抗拉强度和稳定性。",
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
      size:       "最大尺寸",
      zipper:     "拉链",
      type:       "类型"
    },

    products: [
      {
        name: "印刷卷膜",
        description: "我们的卷膜提供多种复合方式、厚度和表面处理选择。印刷选项最多10色、每英寸133线。最大展开长度：1,140毫米。最大印刷宽度：1,450毫米。兼容自动包装机械，优化生产效率。",
        img: "/images/flexible/bobina-impresa.png",
        video: "/videos/flexible/bobinaf.mp4",
        gallery: [
          "/images/flexible/bobina-impresa-1.png",
          "/images/flexible/bobina-impresa.png",
          "/images/flexible/bobina-impresa-3.png"
        ],
        specs_values: {
          lamination: "3种类型",
          finish:     "多种",
          size:       "1,450 毫米",
          zipper:     "无",
          type:       "卷膜"
        }
      },
      {
        name: "自立袋",
        description: "多功能自立袋，采用复合结构，对水分和氧气具有高阻隔性。适用于干性或湿性食品、粉末、液体、化妆品和化工产品。提供天然、哑光和镀铝三种表面处理，规格从150克至1公斤，可选拉链封口和透明窗。",
        img: "/images/flexible/standup-generica.png",
        video: "/videos/flexible/standup.mp4",
        gallery: [
          "/images/flexible/standup-generica-2.png",
          "/images/flexible/standup-generica.png",
          "/images/flexible/standup-generica-3.png"
        ],
        specs_values: {
          lamination: "复合",
          finish:     "3种类型",
          size:       "1 公斤",
          zipper:     "有/无",
          type:       "袋子"
        }
      },
      {
        name: "ORIGANICS 自立袋",
        description: "具有吸引力装饰设计的袋子系列：红果、花卉、水果、麦穗、蓝色礼品和粉色礼品。拉链封口，坚固结构，天然或镀铝表面处理。规格从150克至1公斤。适合追求高品质视觉效果包装的客户。",
        img: "/images/flexible/standup-origanics.png",
        video: "/videos/flexible/standup-origanics.mp4",
        gallery: [
          "/images/flexible/standup-origanics-2.png",
          "/images/flexible/standup-origanics.png",
          "/images/flexible/standup-origanics-3.png"
        ],
        specs_values: {
          lamination: "2种类型",
          finish:     "礼品",
          size:       "1 公斤",
          zipper:     "有",
          type:       "印刷袋"
        }
      },
      {
        name: "高真空袋",
        description: "专为最大限度保持肉类、奶酪、熟食和新鲜产品的新鲜度和保质期而设计。密封排气，保留产品天然特性，防止风味、口感和质量流失。采用高强度高阻隔材料制成。",
        img: "/images/flexible/bolsa-alto-vacio.png",
        video: "/videos/flexible/bolsa-alto-vacio.mp4",
        gallery: [
          "/images/flexible/bolsa-alto-vacio-1.png",
          "/images/flexible/bolsa-alto-vacio.png",
          "/images/flexible/bolsa-alto-vacio-3.png"
        ],
        specs_values: {
          lamination: "多层",
          finish:     "透明",
          size:       "按产品",
          zipper:     "无",
          type:       "袋子"
        }
      }
    ]
  },

  // =================================================
  // 页面：经销商（完整落地页）
  // =================================================
  distribuidor: {
    meta_title: "Grupo Ortiz 经销商 | 官方合作伙伴",
    hero: {
      subtitle: "批发门户",
      title: "倍增您的<br><span>利润</span>",
      desc: "依托行业领先制造商的支持，分销高需求产品。库存有保障，无中间商，24小时物流配送。",
      cta: "立即开始"
    },
    cards: [
      { icon: "ri-stack-line",        title: "充足库存",   desc: "能够即时满足大量订单。您的仓库永远充足。" },
      { icon: "ri-truck-line",        title: "24小时配送", desc: "自有物流体系。您的客户无需等待，我们创纪录速度交付。" },
      { icon: "ri-shield-check-line", title: "质量保障",   desc: "无繁琐手续，无需解释，直接实物换货。品牌全力背书。" },
      { icon: "ri-line-chart-line",   title: "更高利润",   desc: "直接出厂价格，专为最大化您的净利润而设计。" }
    ],
    stats: [
      { val: 25, symbol: "k", label: "月产量（吨）" },
      { val: 35, symbol: "+", label: "年历史"       },
      { val: 15, symbol: "M", label: "总销售额"     }
    ],
    form: {
      title: "注册<br>申请",
      desc: "加入我们的网络。填写您的资料以获取专属区域和优惠价格表。",
      support_label: "直接支持",
      labels: {
        name:     "联系人姓名",
        business: "公司名称",
        whatsapp: "WhatsApp",
        email:    "电子邮件",
        products: "感兴趣的产品"
      },
      products_list: ["编织袋", "软包装", "拉菲草", "护角", "绳索", "缠绕膜", "其他", "全部"],
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
      nav_prev: "上一个",
      nav_next: "下一个",
      events: [
        {
          year: "1959",
          title: "创业之初",
          short: "创立于莫雷利亚",
          img: "tiempo/timeline-1959.webp",
          description: "自1959年起，Grupo Ortiz 便参与到墨西哥的工业发展进程中。集团由 Nicandro Ortiz 在莫雷利亚创立，以坚定的愿景起步：将尖端技术与员工的才华和奉献精神相结合，打造一个稳健、创新、致力于品质的企业。"
        },
        {
          year: "1970",
          title: "工业扩张",
          short: "编织袋与网眼袋",
          img: "tiempo/timeline-1970.webp",
          description: "1970年，我们开始生产聚丙烯编织袋和网眼袋，标志着工业增长的关键阶段。这一战略举措增强了我们的运营能力，扩大了商业参与度，巩固了我们在国内市场的地位。"
        },
        {
          year: "1985",
          title: "技术创新",
          short: "引进欧洲设备",
          img: "tiempo/timeline-1985.webp",
          description: "1985年，我们引进了最先进的欧洲设备，强化了工业基础设施，优化了生产流程。这一战略投资提升了我们的质量标准，提高了运营效率，重申了我们对技术创新的承诺。"
        },
        {
          year: "1995",
          title: "多元化发展",
          short: "新产品线",
          img: "tiempo/timeline-1995.webp",
          description: "1995年，我们扩大生产线，增加了缠绕膜、软包装和工业专用产品。这一战略扩张使产品组合多元化，增强了行业竞争力，让我们能够满足国内市场的新需求。"
        },
        {
          year: "2005",
          title: "国际扩张",
          short: "美洲与欧洲",
          img: "tiempo/timeline-2005.webp",
          description: "2005年，我们开始向美洲和欧洲出口，迈出了国际扩张的决定性一步。这一成就使公司成为塑料聚合物行业的标杆，扩大了全球影响力，巩固了在国际市场的竞争力。"
        },
        {
          year: "2015",
          title: "可持续发展",
          short: "回收工厂",
          img: "tiempo/timeline-2015.webp",
          description: "2015年，我们建立了回收工厂并强化了可持续发展计划，重申了对环境的承诺。这一战略举措优化了资源利用，推动了负责任的生产实践，巩固了我们负责任增长的愿景。"
        },
        {
          year: "2026",
          title: "现在",
          short: "行业领导者",
          img: "tiempo/timeline-2026.webp",
          description: "2026年，我们拥有17座生产工厂、4,000多名员工，年产能达22万吨。持续的增长巩固了我们作为塑料行业领导者的地位，背后是坚实的基础设施、专业的人才队伍和面向未来的战略愿景。"
        }
      ]
    },

    filosofia: {
      label: "我们的原则",
      title: "GO 企业理念",
      items: [
        "执着于客户满意，而非关注竞争对手。",
        "热衷于不断发明与创新。",
        "每个流程追求卓越运营。",
        "长远眼光，追求即时成果。",
        "成为地球上最好的雇主和最安全的工作场所。"
      ]
    },

    vision: {
      label: "我们的方向",
      title: "愿景",
      items: [
        "成为地球上最以客户为中心的公司。",
        "为任何企业提供全面整合解决方案。",
        "成为地球上任何企业的唯一包装解决方案。",
        "在全球扩张的同时保持人文关怀。"
      ]
    },

    infraestructura: {
      title_white:  "强大的",
      title_orange: "基础设施支撑",
      stats: [
        { number: "10",      label: "生产工厂",     desc: "战略布局的设施，服务国内外市场。", icon: "number" },
        { number: "+3,000",  label: "员工",         desc: "推动每个生产流程的专业团队。", icon: "number" },
        { number: "260",     label: "物流单元",     desc: "自有车队，确保高效配送，国内外安全准时交付。", icon: "number" },
        { number: "全球",    label: "国际影响力",   desc: "在美洲和欧洲进行出口与分销。", icon: "globe" }
      ]
    },

    plantas: {
      title:    "我们的工厂",
      subtitle: "17座生产工厂",
      locations: [
        { key: "monterrey", number: "1座工厂",  badge: "新莱昂州蒙特雷" },
        { key: "michoacan", number: "16座工厂", badge: "米却肯州莫雷利亚" }
      ]
    },

    instalaciones: {
      title_white:  "我们的",
      title_orange: "生产设施",
      subtitle:     "360° 虚拟参观",
      badge_soon:   "即将推出",
      badge_tour:   "查看参观",
      btn_tour:     "查看3D参观",
      btn_soon:     "即将推出",
      items: [
        {
          id: "extrusoras", num: "01",
          title: "缠绕膜",
          tag:   "米却肯州莫雷利亚",
          desc:  "大容量挤出生产线，将聚丙烯转化为精密扁丝。",
          thumb: "/images/virtual/RT.webp",
          link:  "https://my.matterport.com/show/?m=YoM2tyXMeyb&ss=2&sr=2.97,.12&play=1&qs=1&ts=1",
          soon:  true
        },
        {
          id: "telares", num: "02",
          title: "网眼袋",
          tag:   "米却肯州莫雷利亚",
          desc:  "最先进的织机，将纱线编织成具有最大均匀性的聚丙烯织物。",
          link:  "https://my.matterport.com/show/?m=2xCe1VajMjj&ss=1&sr=2.28,-1.47&play=1&qs=1&ts=1",
          thumb: "/images/virtual/RA.webp",
          soon:  false
        },
        {
          id: "laminado", num: "03",
          title: "复合与印刷",
          tag:   "米却肯州莫雷利亚",
          desc:  "复合和柔版印刷区域，编织袋在此接受表面处理、印刷和最终质量检验。",
          link:  "",
          thumb: "/images/virtual/RS.webp",
          soon:  true
        },
        {
          id: "reciclado", num: "04",
          title: "回收工厂",
          tag:   "米却肯州莫雷利亚",
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
        { num: "04", label: "编织袋生产",   width: 100, delay: 0   },
        { num: "02", label: "网眼袋生产",   width: 50,  delay: 100 },
        { num: "01", label: "绳索与拉菲草", width: 25,  delay: 200 },
        { num: "02", label: "缠绕膜",       width: 50,  delay: 300 },
        { num: "01", label: "软包装",       width: 25,  delay: 400 },
        { num: "01", label: "回收",         width: 25,  delay: 500 },
        { num: "03", label: "护角",         width: 75,  delay: 600 },
        { num: "01", label: "打包带",       width: 25,  delay: 700 },
        { num: "01", label: "一次性用品",   width: 25,  delay: 800 },
        { num: "01", label: "袋子",         width: 25,  delay: 900 }
      ]
    },

    valores: {
      title:    "我们的价值观",
      subtitle: "我们文化的支柱",
      items: [
        { title: "责任感",  description: "我们以职业道德履行承诺，充分意识到我们的行动对客户、员工和社区的影响。" },
        { title: "信任",    description: "我们以透明、诚实和信守承诺为基础建立稳固关系，在每次互动中创造安全感。" },
        { title: "激情",    description: "我们热爱我们所做的事，并将这份热情体现在每一个产品、流程和创新中，以真诚的热情和奉献精神推动卓越。" },
        { title: "坚韧",    description: "我们以坚定和毅力面对挑战，坚守目标，直到取得卓越成果。" },
        { title: "纪律",    description: "我们以有序的方法遵循严格的流程和质量标准，确保每次交付的一致性和卓越性。" },
        { title: "主动性",  description: "我们预见需求，在问题出现之前采取行动，创造持续创造价值的创新解决方案。" },
        { title: "尊重",    description: "我们重视每个人的多样性、尊严和贡献，营造协作、包容和平等对待的环境。" }
      ]
    }
  },

  // =================================================
  // 页脚
  // =================================================
  footer: {
    about_us:         "关于我们",
    about:            "关于",
    social_impact:    "社会影响",
    customer_service: "客户服务",
    be_distributor:   "成为经销商",
    catalog:          "目录",
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
      title_top:    "我们共同建设",
      title_bottom: "更美好的世界",
      subtitle:         "我们支持家庭、赋能女性、给予第二次机会、守护地球。我们的每一步都旨在改变生命，构建充满希望的未来。",
      stat_female:      "% 女性员工占比",
      stat_recycled:    "回收吨数",
      stat_initiatives: "活跃举措"
    },

    ods: {
      title:       "我们的指引",
      subtitle:    "2030议程",
      description: "我们以联合国可持续发展目标为指引，共同构建一个更公平、更繁荣、更可持续的世界。",
      cards: [
        { n: 1,  title: "消除贫困",         link: "https://sdgs.un.org/goals/goal1",  img: "/images/odc/1.png"  },
        { n: 2,  title: "零饥饿",           link: "https://sdgs.un.org/goals/goal2",  img: "/images/odc/2.png"  },
        { n: 3,  title: "良好健康与福祉",   link: "https://sdgs.un.org/goals/goal3",  img: "/images/odc/3.png"  },
        { n: 4,  title: "优质教育",         link: "https://sdgs.un.org/goals/goal4",  img: "/images/odc/4.png"  },
        { n: 5,  title: "性别平等",         link: "https://sdgs.un.org/goals/goal5",  img: "/images/odc/5.png"  },
        { n: 6,  title: "清洁饮水",         link: "https://sdgs.un.org/goals/goal6",  img: "/images/odc/6.png"  },
        { n: 7,  title: "经济适用的清洁能源", link: "https://sdgs.un.org/goals/goal7", img: "/images/odc/7.png" },
        { n: 8,  title: "体面工作和经济增长", link: "https://sdgs.un.org/goals/goal8", img: "/images/odc/8.png" },
        { n: 9,  title: "产业、创新和基础设施", link: "https://sdgs.un.org/goals/goal9", img: "/images/odc/9.png" },
        { n: 10, title: "减少不平等",       link: "https://sdgs.un.org/goals/goal10", img: "/images/odc/10.png" },
        { n: 11, title: "可持续城市",       link: "https://sdgs.un.org/goals/goal11", img: "/images/odc/11.png" },
        { n: 12, title: "负责任消费和生产", link: "https://sdgs.un.org/goals/goal12", img: "/images/odc/12.png" },
        { n: 13, title: "气候行动",         link: "https://sdgs.un.org/goals/goal13", img: "/images/odc/13.png" },
        { n: 14, title: "水下生物",         link: "https://sdgs.un.org/goals/goal14", img: "/images/odc/14.png" },
        { n: 15, title: "陆地生物",         link: "https://sdgs.un.org/goals/goal15", img: "/images/odc/15.png" },
        { n: 16, title: "和平、正义与强大机构", link: "https://sdgs.un.org/goals/goal16", img: "/images/odc/16.png" },
        { n: 17, title: "促进目标实现的伙伴关系", link: "https://sdgs.un.org/goals/goal17", img: "/images/odc/17.png" },
      ]
    },

    vision: {
      title:        "我们的积极",
      title_orange: "影响",
      subtitle:     "我们推动行业变革",
      pilars: [
        {
          label: "支柱 01",
          title: "大地之产品",
          desc:  "开发创新环保材料，用于软包装，尊重环境并减少碳足迹。",
          img:   "/images/impacto/products.webp"
        },
        {
          label: "支柱 02",
          title: "大地之实践",
          desc:  "在所有生产流程中推行清洁制造和循环经济，闭合循环，消除浪费。",
          img:   "/images/impacto/practices.webp"
        },
        {
          label: "支柱 03",
          title: "社会之地",
          desc:  "对客户、员工和社区的全面承诺，创造积极的社会影响和真实的发展机遇。",
          img:   "/images/impacto/social.webp"
        }
      ]
    },

    oceanos: {
      hero_title:           "致力于为我们的海洋",
      hero_title_highlight: "创造更清洁的未来",
      intro: "在 Grupo Ortiz，我们相信海洋终将再度焕发光彩。通过支持「海洋清洁」和由 Lonely Whale 支持的「汤姆·福特塑料创新奖」等全球倡议，我们致力于减少海洋中的塑料污染。您每一次选择我们的产品，都是迈向更清洁星球和可持续未来的一步。让我们携手守护海洋！",
      features: [
        { title: "支持全球清洁行动",   desc: "与「海洋清洁」等倡议合作。"                          },
        { title: "推动可持续创新",     desc: "通过「汤姆·福特塑料创新奖」等项目。"                 },
        { title: "倡导负责任产品",     desc: "减少对海洋的环境影响。"                             },
        { title: "激励集体行动",       desc: "邀请客户和合作伙伴共同参与变革。"                   }
      ],
      partners: [
        {
          title:  "汤姆·福特创新奖",
          desc:   "这一全球倡议旨在通过奖励和推广替代一次性塑料的创新解决方案来推动塑料行业革新。其重点在于能够减少环境影响、保护海洋并推动向更负责任材料转变的可持续且可扩展的替代方案。",
          btn:    "了解更多",
          link:   "https://unwrapthefuture.org/",
          video:  "/videos/impacto/oceancleanup.mp4",
          poster: "/images/impacto/cultura-calidad.jpg"
        },
        {
          title:  "海洋清洁",
          desc:   "这一组织致力于清洁全球海洋，开发先进技术清除海洋中积累的塑料，并通过对河流（主要污染源）的干预防止更多塑料进入大海。其使命是恢复海洋生态系统的健康，保护生物多样性，为后代确保一个清洁的未来。",
          btn:    "了解更多",
          link:   "https://theoceancleanup.com/",
          video:  "/videos/impacto/tomford.mp4",
          poster: "/images/impacto/tomford.webp"
        }
      ]
    },

    stats: {
      recycled: "回收吨数",
      female:   "% 女性员工占比",
      families: "受益家庭数"
    },

    timeline: {
      title:    "改变生命的倡议",
      subtitle: "持久积极的影响",
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
          num: "02", title: "GO 爱心食篮",
          desc:       "团结社区，用爱心分发食品篮。",
          desc_short: "用爱心向社区分发食品篮。",
          img:        "/images/impacto/despensas.webp",
          isVideo:    false
        },
        {
          num: "03", title: "零碳足迹",
          desc:       "零废弃政策，将废料转化为机遇。",
          desc_short: "零废弃政策，转化废料。",
          img:        "/images/impacto/composta.webp",
          isVideo:    false
        },
        {
          num: "04", title: "活力堆肥",
          desc:       "生产可堆肥产品，尊重自然的创新。",
          desc_short: "可堆肥产品，可持续创新。",
          img:        "/images/impacto/GO.webp",
          isVideo:    false
        },
        {
          num: "05", title: "GO 之光",
          desc:       "为 GO 团队提供绩效奖励，认可每一份努力。",
          desc_short: "认可 GO 团队的出色表现。",
          img:        "/images/impacto/woman.webp",
          isVideo:    false
        },
        {
          num: "06", title: "领导之手",
          desc:       "84%女性员工占比，赋能女性领导者。",
          desc_short: "56.82%女性员工占比，赋能领导者。",
          img:        "/images/impacto/bio.webp",
          isVideo:    false
        }
      ]
    },

    cta: {
      title:        "携手",
      title_orange: "共同变革",
      desc:         "我们是您企业以技术、经验和成果实现增长所需的战略合作伙伴。",
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
      eyebrow:      "自1959年",
      title_top:    "我们是拉丁美洲",
      title_bot:    "领先的制造商",
      video:        "background.mp4",
      subtitle:     "65年来，为全球五大洲的产业制造高工程标准的解决方案。",
      btn_products: "我们的产品",
      btn_about:    "了解更多",
      stats: [
        { number: 65,   label: "年经验"    },
        { number: 3000, prefix: "+", label: "员工"      },
        { number: 5,    prefix: "",  label: "大洲"      }
      ]
    },

    divisiones: {
      tag:       "我们的部门",
      title:     "专业",
      title_em:  "领域",
      link_text: "查看产品",
      items: [
        {
          title: "网眼袋",    tag: "部门 01",
          description: "平织和圆织聚丙烯拉菲草网眼袋。通风设计，非常适合水果、蔬菜和农产品。",
          img: "/images/divisiones/arpilla.webp",           color: "#2d8a4e",  slug: "arpillas",           soon: false
        },
        {
          title: "绳索",      tag: "部门 02",
          description: "适用于农业、工业和海洋用途的高强度聚丙烯绳索。高耐候性，内置紫外线过滤器。",
          img: "/images/divisiones/cuerdas.webp",           color: "#1a5f8a",  slug: "cuerdas",            soon: false
        },
        {
          title: "拉菲草",    tag: "部门 03",
          description: "高性能聚丙烯拉菲草。重量极轻，断裂强度高，适用于农业、家禽养殖和园艺的多功能选择。",
          img: "/images/divisiones/rafia.webp",             color: "#8a6d2d",  slug: "rafias",             soon: false
        },
        {
          title: "软包装",    tag: "部门 04",
          description: "高阻隔薄膜和专业复合材料。采用前沿技术为食品和工业产品提供最佳保护。",
          img: "/images/divisiones/bolsa.webp",             color: "#0d7377",  slug: "empaques-flexibles", soon: false
        },
        {
          title: "编织袋",    tag: "部门 05",
          description: "优质拉菲草编织袋。适用于食品、化学品、肥料和散装产品的坚固包装解决方案。",
          img: "/images/divisiones/sacos.webp",             color: "#3a7d44",  slug: "sacos",              soon: false
        },
        {
          title: "缠绕膜",    tag: "部门 06",
          description: "高光学透明度缠绕膜。以较低成本确保货物完整性。包含可生物降解选项。",
          img: "/images/divisiones/film-estirable.webp",    color: "#2c5f8a",  slug: "stretch-film",       soon: false
        },
        {
          title: "护角",      tag: "部门 07",
          description: "牛皮纸护角，在储存和运输过程中保护边缘。均匀分散压力，实现最大货物稳定性。",
          img: "/images/divisiones/esquineros.webp",        color: "#7b3fa0",  slug: "esquineros",         soon: false
        },
        {
          title: "一次性用品", tag: "部门 10",
          description: "适用于工业、食品和医疗领域的聚丙烯一次性产品。卫生、经济、高强度解决方案。",
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
      badge2_label:  "部门",
      badge2_number: 6,
      img:           "/images/planta-produccion.webp",
      features: [
        { title: "认证质量",   description: "符合最高国际制造标准的产品。"        },
        { title: "持续创新",   description: "持续投资研发，保持行业技术领导地位。" },
        { title: "全球布局",   description: "在五大洲积极运营，拥有高效的分销网络。" }
      ]
    },

    certs: {
      tag:      "品质保证",
      title:    "我们的",
      title_em: "认证",
      items: [
        { code: "Kosher Pareve", name: "KMD México",     img: "/images/certificaciones/KOSHER.jpeg"   },
        { code: "FSSC 22000",    name: "LRQA Certified", img: "/images/certificaciones/LRQA.png"      },
        { code: "AIB International", name: "Since 1919", img: "/images/certificaciones/AIB.png"       },
        { code: "ISO 9001",      name: "Bureau Veritas", img: "/images/certificaciones/CERTIFIED.png" }
      ]
    },

    compromiso: {
      card1: {
        eyebrow: "我们的方向",
        title:   "创新",
        text:    "我们投资研发，以前沿技术提供超越全球市场预期的产品。"
      },
      card2: {
        eyebrow: "我们的承诺",
        title:   "可持续发展",
        text:    "对环境负责的生产流程、积极的回收计划以及整个供应链的碳足迹减少。"
      }
    },

    global: {
      tag:      "全球影响力",
      title:    "我们出口到",
      title_em: "全世界",
      desc:     "我们的产品远销30多个国家的客户，巩固了我们作为塑料聚合物领域领导者的地位。",
      video:    "/camion.mp4",
      stats: [
        { number: 65,   label: "年"    },
        { number: 30,   prefix: "+", label: "个国家" },
        { number: 3000, prefix: "+", label: "名员工" },
        { number: 5,    prefix: "",  label: "大洲"   }
      ]
    },

    cta: {
      tag:      "准备好了吗？",
      title:    "携手",
      title_em: "共创未来",
      sub:      "了解我们的解决方案如何变革您的运营",
      btn:      "联系我们"
    }
  }

};