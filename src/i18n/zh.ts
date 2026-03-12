// src/i18n/zh.js

export const zh = {
  // =================================================
  // 导航栏
  // =================================================
  nav: {
    home: '首页',
    products: '产品',
    catalog: '目录',
    about: '关于我们',
    company: '公司介绍',
    social: '社会责任',
    distributor: '经销商',
    contact: '联系我们'
  },

  // =================================================
  // 主页英雄区 / 封面
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
    // ── 通用消息 ──
    greeting:            '您好！我是 BotGo 🤖，今天有什么可以帮助您的吗？',
    placeholder:         '输入消息...',
    listeningState:      '正在聆听...',
    thinking:            '思考中...',
    errorMsg:            '连接错误。',
    voiceAssistantTitle: '虚拟助手',
    voiceCode:           'zh-CN',

    // ── 操作按钮 ──
    salesBtn:   '通过 WhatsApp 报价',
    pdfBtn:     '查看 PDF 目录',
    waStart:    '您好，Grupo Ortiz，我想了解报价',

    // ── 桌面端提示卡片 ──
    tooltipTitle:  '今天有什么',
    tooltipAccent: '可以帮助您？',
    tooltipCta:    '立即开始聊天！',
    tooltipItems: [
      { text: '请求',     bold: '产品信息'         },
      { text: '直接',     bold: '下订单'           },
      { text: '联系',     bold: '客户服务'         },
      { text: '下载',     bold: '目录和技术资料'   },
    ],

    // ── 移动端胶囊按钮 ──
    pillLabelSmall: '有什么可以',
    pillLabelBig:   '帮助您的吗？',
  },

  pwa: {
    appName: "Grupo Ortiz",
    title: "安装 GO App",
    description: "从主屏幕快速访问",
    install: "安装",
    notNow: "暂不安装",
    timeLabel: "刚刚"
  },

  // =================================================
  // 促销页面
  // =================================================
  promociones: {
    meta_title: "促销活动 | Grupo Ortiz",
    hero: {
      label: "特别优惠",
      title: "促销活动",
      subtitle: "把握我们的限时优惠",
      validity: "售完即止*"
    },
    discount_badge: "高达",
    off_text: "折扣",
    original_price: "原价",
    promo_price: "优惠价",
    buy_button: "申请报价",
    contact_cta: "联系顾问了解更多信息",
    valid_until: "售完即止*",

    products: [
      {
        id: "promo-stretch",
        name: "拉伸膜",
        subtitle: "彩色拉伸膜每公斤 $33",
        image: "/images/stretch/manual.webp",
        discount: 35,
        originalPrice: "",
        promoPrice: "$33/KG",
        features: [
          "彩色拉伸膜",
          "按公斤计算的特价",
          "库存有限",
          "多种颜色可选"
        ],
        validUntil: "售完即止*"
      },
      {
        id: "promo-cuerda",
        name: "绳索",
        subtitle: "每公斤 $33",
        image: "/images/cuerdas/CuerdaT1.webp",
        discount: 25,
        originalPrice: "",
        promoPrice: "$33/KG",
        features: [
          "高品质绳索",
          "按公斤计算的特价",
          "限时优惠",
          "供应视库存而定"
        ],
        validUntil: "售完即止*"
      }
    ]
  },

  // =================================================
  // 目录页面
  // =================================================
  catalog: {
    hero: {
      label: "文件资料",
      title: "综合目录",
      description: "一份文件，涵盖品质与综合解决方案。请选择您的首选语言获取我们的企业介绍。",
      scrollText: "查看各部门"
    },
    carousel: {
      label: "可用下载",
      title: "各部门目录",
    },
    languageLabel: "Language / 语言",
    downloadButton: "下载 PDF",
    divisions: [
      {
        id: "1",
        name: "拉伸膜",
        desc: "用于固定和保护货物的拉伸膜。高效的托盘包装和安全运输解决方案。",
        image: "/images/catalogo/img1.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1HYGcpgkRO_7OX22IcWvRpzpLZKgpYV3A/view?usp=sharing",
          en: "https://drive.google.com/file/d/1QZ6jmKyc-CGLwh9brbeZSQ5OOzkKdBCQ/view?usp=sharing",
        }
      },
      {
        id: "2",
        name: "绳索",
        desc: "用于工业和渔业捆扎的强度与耐久性。采用高品质材料制造，适用于高强度使用。",
        image: "/images/catalogo/img2.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/14GrV9P1ViQKvFp3BucYjgmryRgWKLEZh/view?usp=sharing",
          en: "https://drive.google.com/file/d/19Tvd_VHjogSE7y7cLZYr4ra__4vB4nOm/view?usp=sharing",
        }
      },
      {
        id: "3",
        name: "拉菲草绳",
        desc: "农业和工业捆绑的标准选择。坚韧灵活的材料，适用于多种应用场景。",
        image: "/images/catalogo/img3.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1uAiR4uxO2iX_LsNFul6kXeb7jnnCEV_J/view?usp=sharing",
          en: "https://drive.google.com/file/d/10PV-sxexE8UkFSOhdTJBe1xWCy_tdFib/view?usp=sharing",
        }
      },
      {
        id: "4",
        name: "网袋",
        desc: "最大透气性的开孔编织网布。用于农产品包装和运输的多功能解决方案。",
        image: "/images/catalogo/img4.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1OQKGpnRCfA2yFdAlT6q7GczYua2FFFVU/view?usp=sharing",
          en: "https://drive.google.com/file/d/1wldGL6XuqH-Ruth9Y01-hkNnPlbg9SW5/view?usp=sharing",
        }
      },
      {
        id: "5",
        name: "编织袋",
        desc: "用于大批量包装的平织聚丙烯。卓越的散装产品承载能力。",
        image: "/images/catalogo/img5.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/16S43-PUrQECO9q2J1fOgbN-YeIxQ2GhP/view?usp=sharing",
          en: "https://drive.google.com/file/d/1fkZvAWTT3mnBkxQ0Gbb2kRgOoN2dJZiK/view?usp=sharing",
        }
      },
      {
        id: "6",
        name: "护角",
        desc: "为托盘提供结构保护和稳定性。物流和货物存储中不可或缺的加固部件。",
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
  // 主产品列表（/products 轮播）
  // =================================================
  products_list: [
    {
      img: "carrusel/img1.webp",
      division: "拉伸膜",
      descripcion: "高光学透明度及品质标准的拉伸膜。确保货物完整性，节约成本。我们的产品线包括可生物降解选项，降解速度比普通产品快90%。",
      slug: "stretch-film",
      video: "carrusel/stretch-film.mp4"
    },
    {
      img: "carrusel/img4.webp",
      division: "网袋",
      descripcion: "高强度耐久圆织聚丙烯拉菲网袋。透气设计，非常适合水果和蔬菜。",
      slug: "arpillas",
      video: "carrusel/arpillas.mp4"
    },
    {
      img: "carrusel/img2.webp",
      division: "绳索",
      descripcion: "高性能聚丙烯（PP）单丝绳索。完美平衡：极轻重量，不牺牲断裂强度。",
      slug: "cuerdas",
      video: "carrusel/cuerdas.mp4"
    },
    {
      img: "carrusel/img3.webp",
      division: "拉菲草绳",
      descripcion: "高性能聚丙烯（PP）薄膜拉菲草绳。重量轻，断裂强度高。灵活多用。",
      slug: "rafias",
      video: "carrusel/rafia.mp4"
    },
    {
      img: "carrusel/img5.webp",
      division: "编织袋",
      descripcion: "优质拉菲编织袋。适用于食品、化学品和肥料的坚固包装解决方案。",
      slug: "sacos",
      video: "carrusel/sacos.mp4"
    },
    {
      img: "carrusel/img6.webp",
      division: "护角",
      descripcion: "优化物流的纸板护角。结构强度更高，货物稳定性更强。",
      slug: "esquineros",
      video: "carrusel/esquineros.mp4"
    },
    {
      img: "carrusel/img7.webp",
      division: "软包装",
      descripcion: "Neo Empaques International 专注于先进软包装解决方案，旨在优化多行业产品的保存和展示效果。",
      slug: "empaques-flexibles",
      video: "carrusel/bobina-impresa.mp4"
    }
  ],

  // =================================================
  // 页面：拉伸膜
  // =================================================
  stretch_film: {
    meta_title: "拉伸膜 | Grupo Ortiz",
    back_aria: "返回产品",
    specs_title: "技术规格",

    specs_labels: {
      width: "宽度",
      length: "长度",
      gauge: "厚度",
      weight: "重量",
      type: "用途"
    },

    products: [
      {
        name: '高级拉伸膜',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "专为高要求机械设计，这款中等拉伸率的拉伸膜为自动化流程中的货物固定提供高效可靠的解决方案。其配方保证了在要求严格的包装应用中具有高强度和卓越性能。",
        specs_values: { width: "19-30 英寸", length: "1000-15000 英尺", gauge: "40-110", weight: "10-40 kg", type: "手动" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      },
      {
        name: '机用拉伸膜',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "专为传统缠绕机械设计，这款拉伸膜在自动托盘包装流程中提供高性能和卓越表现。其配方保证了货物固定时的强度和稳定性。",
        specs_values: { width: "18-30 英寸", length: "2000-15000 英尺", gauge: "50-110", weight: "10-49 kg", type: "机用" },
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
        description: "专为高性能手动应用设计，这款预拉伸膜以市场上最薄的厚度之一著称。其技术消除了缠绕时施加额外力的需求，便于即时使用并提高托盘包装效率。",
        specs_values: { width: "16-17 英寸", length: "7000-25000 英尺", gauge: "40-120", weight: "10-40 kg", type: "手动" },
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
        description: "专为中等拉伸手动缠绕设计，这款传统拉伸膜在包装和货物固定流程中表现出色。其配方在常规应用中保证了强度和稳定性。",
        specs_values: { width: "3-12 英寸", length: "7000-25000 英尺", gauge: "40-120", weight: "10-40 kg", type: "手动" },
        gallery: [
          '/images/stretch/rigido2.png',
          '/images/stretch/manual.png',
          '/images/stretch/rigido3.png'
        ]
      },
      {
        name: '手动硬质膜',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "专为有限拉伸手动缠绕应用特殊配制，这款拉伸膜在包装流程中提供高性能和高可靠性。其配方保证了货物固定时的稳定性和效率。",
        specs_values: { width: "17-30 英寸", length: "1000-15000 英尺", gauge: "40-90", weight: "10-40 kg", type: "手动", color: "黑色/彩色" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
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
      load: "米数",
      mat: "材质",
      weight: "重量",
      resist: "承重",
      charge: "规格"
    },

    products: [
      {
        name: '五金店绳索',
        img: '/images/cuerdas/CuerdaT1.webp',
        video: "/videos/cuerdas/cuerda-1.mp4",
        link: '#',
        description: "采用聚丙烯和先进UV滤光剂制成，这款绳索非常适合长时间暴露在阳光下的活动。其专业配方延缓自然老化，延长使用寿命，保证在户外使用时具有更强的耐久性。是在普通和高强度工作应用中提供坚固、安全和可靠性能的理想五金店绳索。",
        specs_values: { load: "1,980 m", mat: "PP-UV", weight: "18 kg", resist: "175 kg", charge: "4-19 mm" },
        gallery: [
          '/images/cuerdas/CuerdaT1-2.png',
          '/images/cuerdas/CuerdaT1.webp',
          '/images/cuerdas/CuerdaT1-1.png'
        ]
      },
      {
        name: '温室绳索',
        img: '/images/cuerdas/CuerdaNegra.webp',
        video: "/videos/cuerdas/CuerdaI.mp4",
        link: '#',
        description: "采用聚丙烯（PP）和UV稳定剂制成，这款绳索非常适合海洋行业和长时间暴露在阳光下的活动。其专业配方延缓紫外线辐射造成的老化，延长使用寿命，保证在户外使用时具有更强的耐久性。是为大型农业温室提供坚固和稳定性的完美解决方案。",
        specs_values: { load: "3,240 m", mat: "PP-UV", weight: "18 kg", resist: "105 kg", charge: "3-8 mm" },
        gallery: [
          '/images/cuerdas/CuerdaNegra6-1.png',
          '/images/cuerdas/CuerdaNegra.webp',
          '/images/cuerdas/CuerdaNegra6-3.png'
        ]
      },
      {
        name: '环保绳索',
        img: '/images/cuerdas/CuerdaEco.png',
        video: "/videos/cuerdas/CuerdaE.mp4",
        link: '#',
        description: "采用高品质聚丙烯（PP）制造，这款绳索提供多种规格、型号和颜色，有光滑或组合版本，带或不带加强筋，有或没有品牌标识。其多功能性和耐用性使其成为多种应用的可靠选择，适用于工业、工厂、仓库、批发市场、五金店、建材店、加工车间等场所。",
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
      cal: "型号",
      yield: "米数",
      resist: "承重 kg",
      usage: "材质"
    },

    products: [
      {
        name: "捆绑拉菲绳",
        description: "采用100%纯聚丙烯制造，这款拉菲绳提供高强度和出色性能，即使在户外条件下也能保持其物理特性。其品质保证在严苛应用中的耐用性和可靠性能。广泛用于农业、禽类养殖和园艺行业。",
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
        name: "环保拉菲绳",
        description: "采用高品质聚丙烯制造，这款拉菲绳提供出色的耐久性，即使在户外条件下也能保持其物理特性。其可靠性能使其成为农业、禽类养殖和园艺应用的理想选择。",
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
        name: "黑色原纤化拉菲绳",
        description: "采用高品质聚丙烯制造，这款拉菲绳提供强大耐久性，即使在户外条件下也能保持其物理特性。其出色性能使其非常适合工业、五金和包装应用，以及农业、禽类养殖和园艺行业。",
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
  // 页面：网袋
  // =================================================
  arpillas: {
    meta_title: "网袋 | Grupo Ortiz",
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
        name: '圆织网袋',
        img: '/images/arpillas/arpilla.webp',
        video: "/videos/arpilla/circular.mp4",
        link: '#',
        description: "采用100%纯聚丙烯和拉菲结构制造，这款网袋在包装和储存应用中提供高强度和出色性能。其品质保证在处理各类产品时的耐用性和可靠性能。",
        specs_values: {
          sizes: "23-70 cm",
          colors: "4",
          features: "抽绳"
        },
        gallery: [
          '/images/arpillas/circular2.webp',
          '/images/arpillas/arpilla.webp',
          '/images/arpillas/circular3.webp'
        ]
      },
      {
        name: '圓形單絲粗麻布',
        img: '/images/arpillas/arpilla2.webp',
        video: "/videos/arpilla/mono.mp4",
        link: '#',
        description: "采用100%纯聚丙烯和拉菲/单丝结构制造，这款网袋在包装和储存应用中提供高强度和出色性能。其结构为各类产品的处理和保护提供耐用性和可靠性能。",
        specs_values: {
          construction: "单丝",
          sizes: "23-70 cm",
          colors: "2",
          features: "抽绳"
        },
        gallery: [
          '/images/arpillas/mono2.webp',
          '/images/arpillas/arpilla2.webp',
          '/images/arpillas/mono3.webp'
        ]
      },
      {
        name: '侧缝网袋',
        img: '/images/arpillas/arpilla3.webp',
        video: "/videos/arpilla/costura.mp4",
        link: '#',
        description: "采用100%纯聚丙烯和拉菲/单丝结构制造，这款网袋在包装和储存应用中提供高强度和出色性能。其结构保证在处理不同产品时的耐用性和可靠性。",
        specs_values: {
          type: "侧面",
          construction: "单丝",
          sizes: "23-60 cm",
          colors: "4",
          features: "加固"
        },
        gallery: [
          '/images/arpillas/lateral1.webp',
          '/images/arpillas/arpilla3.webp',
          '/images/arpillas/lateral3.webp'
        ]
      },
      {
        name: '贴标覆膜网袋',
        img: '/images/arpillas/arpilla4.webp',
        video: "/videos/arpilla/etiqueta.mp4",
        link: '#',
        description: "采用100%纯聚丙烯和拉菲/拉菲结构制造，这款网袋在包装和储存过程中提供高强度和出色性能。其编织结构保证在国内外市场高要求应用中的耐用性和可靠性。",
        specs_values: {
          type: "覆膜",
          construction: "拉菲",
          sizes: "23-70 cm",
          colors: "4",
          features: "抽绳"
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
  // 页面：编织袋
  // =================================================
  sacos: {
    meta_title: "编织袋 | Grupo Ortiz",
    back_aria: "返回产品",
    specs_title: "技术规格",

    specs_labels: {
      load: "宽度",
      unit: "长度",
      mat: "材质",
      weight: "强度"
    },

    products: [
      {
        name: '无覆膜拉菲编织袋',
        img: '/images/sacos/saco2.png',
        model: '/models/saco_blanco.glb',
        video: "/videos/saco/slaminar.mp4",
        link: '#',
        description: "由交织聚丙烯条制造，无覆膜拉菲编织袋在包装和储存应用中提供强大的耐用性。其结构可承受重载而不破损，保证在高强度工作中的可靠性能。",
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
        description: "采用聚丙烯条和透明饰面制造，这些袋子提供高强度，并可出色地展示袋内产品。其结构保证在储存和运输应用中的耐用性和可靠性能。",
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
        name: '环保拉菲编织袋',
        img: '/images/sacos/saco3.png',
        video: "/videos/saco/eco.mp4",
        link: '#',
        description: "采用生产过程中产生的边角料回收材料制造，这些袋子以更实惠的价格提供耐用性和良好的持久性。其制造工艺可在普通包装和储存应用中提供可靠性能。",
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
        name: "牛皮纸护角（棕色）",
        description: "专为保护运输和储存过程中的边缘和角落而制造，这款护角均匀分配压力，防止货物变形和损坏。其结构在严苛包装应用中提供强度和稳定性。",
        img: "/images/esquinero/esquinero.png",
        video: "/videos/esquinero/esquinero.mp4",
        link: "#",
        specs_values: {
          tab:    "1.5 英寸",
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
        name: "牛皮纸护角（白色）",
        description: "专为保护运输和储存过程中的边缘和角落而制造，这款护角均匀分配压力，防止货物变形和损坏。其结构在严苛包装应用中提供强度和稳定性。",
        img: "/images/esquinero/esquinerob.png",
        video: "/videos/esquinero/esquinero.mp4",
        link: "#",
        specs_values: {
          tab:    "1.5 英寸",
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
  // 页面：软包装
  // =================================================
  flexible_packaging: {
    meta_title: "软包装 | Grupo Ortiz",
    back_aria: "返回产品",
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
        description: "我们的卷膜提供多种复合方式、厚度和表面处理。支持最多10色印刷，133线/英寸。最大展开：1,140 mm。最大印刷宽度：1,450 mm。兼容自动包装机械，优化生产效率。",
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
          size:       "1,450 mm",
          zipper:     "不适用",
          type:       "卷膜"
        }
      },
      {
        name: "自立袋",
        description: "多功能自立袋，具有复合结构和高防潮防氧气屏障。适用于干湿食品、粉末、液体、化妆品和化学品。提供天然、哑光和金属光泽三种表面处理，尺寸从150g到1kg，可选拉链和透明窗。",
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
          size:       "1 kg",
          zipper:     "有/无",
          type:       "袋子"
        }
      },
      {
        name: "印花自立袋",
        description: "具有精美装饰图案的袋子系列：红果、花卉、水果、麦穗、蓝色礼品和粉色礼品。拉链式封口，坚固结构，天然或金属光泽表面处理。尺寸从150g到1kg。适合追求高品质、视觉吸引力包装的客户。",
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
          size:       "1 kg",
          zipper:     "有",
          type:       "印花袋"
        }
      },
      {
        name: "高真空袋",
        description: "专为最大程度保持肉类、奶酪、熟食和鲜产品的新鲜度和保质期而设计。其密封性消除空气，保留产品天然特性，防止风味、质地和品质流失。采用高强度高阻隔材料制造。",
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
          size:       "产品尺寸",
          zipper:     "无",
          type:       "袋子"
        }
      }
    ]
  },

  // =================================================
  // 页面：经销商（完整着陆页）
  // =================================================
  distribuidor: {
    meta_title: "Grupo Ortiz 经销商 | 官方合作伙伴",
    hero: {
      subtitle: "批发门户",
      title: "倍增<br>您的<span>利润</span>",
      desc: "在领先制造商的支持下分销高需求产品。有保障的库存、无中间商和24小时物流。",
      cta: "立即开始"
    },
    cards: [
      { icon: "ri-stack-line",        title: "充足库存",   desc: "可即时满足大批量订单。您的仓库始终充足。" },
      { icon: "ri-truck-line",        title: "24小时配送", desc: "自有物流。您的客户无需等待，我们以创纪录的速度交付。" },
      { icon: "ri-shield-check-line", title: "品质保证",   desc: "无繁文缛节的实物退换。完整的品牌支持。" },
      { icon: "ri-line-chart-line",   title: "更高利润",   desc: "工厂直供价格，旨在最大化您的净利润。" }
    ],
    stats: [
      { val: 25, symbol: "k", label: "月产量（吨）" },
      { val: 35, symbol: "+", label: "年发展历史"   },
      { val: 15, symbol: "M", label: "总销售额"     }
    ],
    form: {
      title: "注册<br>申请",
      desc: "加入网络。填写您的资料，以便为您分配区域和优惠价格单。",
      support_label: "直接支持",
      labels: {
        name:     "联系人姓名",
        business: "公司名称",
        whatsapp: "WhatsApp",
        email:    "电子邮件",
        products: "感兴趣的产品"
      },
      products_list: ["编织袋", "软包装", "拉菲绳", "护角", "绳索", "拉伸膜", "其他", "全部"],
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
      title_white:   "我们的",
      title_orange:  "发展历程",
      nav_prev:      "上一个",
      nav_next:      "下一个",
      video_bg:      "/videos/background.mp4",
      video_bg_webm: "",
      video_poster:  "",
      events: [
        { year: "1959", title: "起点",         short: "在莫雷利亚创立",     img: "/images/tiempo/timeline-1959.webp",  description: "自1959年起，Grupo Ortiz 便参与了墨西哥的工业发展。由 Nicandro Ortiz 在莫雷利亚创立，集团诞生时怀有坚定的愿景：将尖端技术与员工的才华和奉献精神相结合，打造一家扎实、创新、致力于品质的企业。" },
        { year: "1970", title: "工业扩张",     short: "编织袋和网袋",       img: "/images/tiempo/timeline-1970.webp",  description: "1970年，我们开始生产聚丙烯编织袋和网袋，标志着我们工业增长的关键阶段。这一战略步骤加强了我们的运营能力，扩大了我们的商业参与，并巩固了我们在国内市场的地位。" },
        { year: "1985", title: "技术创新",     short: "欧洲机械设备",       img: "/images/tiempo/timeline-1985.webp",  description: "1985年，我们引进了最新一代欧洲机械设备，强化了我们的工业基础设施，优化了生产流程。这项战略投资提升了我们的质量标准，增加了运营效率，重申了我们对技术创新的承诺。" },
        { year: "1995", title: "多元化",       short: "新产品线",           img: "/images/tiempo/timeline-1995.webp",  description: "1995年，我们增加了拉伸膜、软包装和工业专用产品，扩大了我们的生产线。这一战略扩张使我们的产品组合多元化，加强了我们在行业中的竞争力，并使我们能够满足国内市场的新需求。" },
        { year: "2005", title: "国际化扩张",   short: "美洲和欧洲",         img: "/images/tiempo/timeline-2005.webp",  description: "2005年，我们开始向美洲和欧洲出口，标志着我们国际化扩张的决定性一步。这一成就使公司成为塑料聚合物行业的标杆，加强了我们的全球存在，并巩固了我们在国际市场的竞争力。" },
        { year: "2015", title: "可持续发展",   short: "回收工厂",           img: "/images/tiempo/timeline-2015.webp",  description: "2015年，我们建立了一座回收工厂，并加强了可持续发展项目，重申了我们对环境的承诺。这一战略举措优化了资源利用，推动了负责任的做法，并巩固了我们的可持续增长愿景。" },
        { year: "2026", title: "现在",         short: "工业领导者",         img: "/images/tiempo/timeline-2026.webp",  description: "2026年，我们拥有17个生产工厂、4,000多名员工，年产能22万吨。这一持续增长使我们成为塑料行业的领导者，得益于坚实的基础设施、专业的人才和面向未来的战略愿景。" }
      ]
    },

    filosofia: {
      label: "我们的原则",
      title: "GO 理念",
      img:   "/images/about/GO.webp",
      items: [
        "对客户满意度的执着追求，而非盯着竞争对手。",
        "对持续发明和创新的热情。",
        "每个流程中追求卓越运营。",
        "长远思考，立竿见影。",
        "成为地球上最好的雇主和最安全的工作场所。"
      ]
    },

    vision: {
      label: "我们的方向",
      title: "愿景",
      img:   "/images/about/GO2.webp",
      items: [
        "成为地球上最以客户为中心的公司。",
        "为任何业务提供完整的综合解决方案。",
        "成为地球上任何业务包装的唯一解决方案。",
        "在全球扩张的同时不失人文关怀。"
      ]
    },

    infraestructura: {
      title_white:  "支撑我们的",
      title_orange: "基础设施",
      stats: [
        { number: "13",     label: "生产工厂",     desc: "战略性布局的设施，服务国内外市场。",                        icon: "number" },
        { number: "+3,000", label: "员工",         desc: "推动每个生产流程的专业团队。",                              icon: "number" },
        { number: "260",    label: "物流运输单位", desc: "自有车队保证全国及国际高效分销和安全配送。",               icon: "number" },
        { number: "全球",   label: "国际存在",     desc: "在美洲和欧洲的出口与分销。",                               icon: "globe"  }
      ]
    },

    plantas: {
      title:           "我们的工厂",
      subtitle:        "13个生产工厂",
      map_img:         "/images/about/mexico_map.png",
      layer_michoacan: "/images/about/michoacan_layer.png",
      layer_monterrey: "/images/about/monterrey_layer.png",
      layer_both:      "/images/about/both_states_layer.png",
      locations: [
        { key: "monterrey", number: "1座工厂",   badge: "新莱昂州蒙特雷" },
        { key: "michoacan", number: "12座工厂",  badge: "米却肯州莫雷利亚" }
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
        { id: "extrusoras", num: "01", title: "拉伸膜",      tag: "米却肯州莫雷利亚", desc: "大型挤出生产线，将聚丙烯转化为精密扁丝。",                         thumb: "/images/virtual/RT.webp", link: "https://my.matterport.com/show/?m=YoM2tyXMeyb&ss=2&sr=2.97,.12&play=1&qs=1&ts=1", soon: true  },
        { id: "telares",    num: "02", title: "网袋",        tag: "米却肯州莫雷利亚", desc: "最先进的织机，将纱线编织成具有最大均匀性的聚丙烯布。",               thumb: "/images/virtual/RA.webp", link: "https://my.matterport.com/show/?m=2xCe1VajMjj&ss=1&sr=2.28,-1.47&play=1&qs=1&ts=1", soon: false },
        { id: "laminado",   num: "03", title: "覆膜与印刷",  tag: "米却肯州莫雷利亚", desc: "覆膜和柔版印刷区域，编织袋在此进行饰面、印刷和最终质量处理。",       thumb: "/images/virtual/RS.webp", link: "", soon: true  },
        { id: "reciclado",  num: "04", title: "回收工厂",    tag: "米却肯州莫雷利亚", desc: "我们的聚丙烯回收中心，致力于循环经济和环境保护。",                   link: "", soon: true  }
      ]
    },

    capacidad: {
      title:         "装机容量",
      subtitle:      "高性能基础设施",
      planta_label:  "工厂",
      plantas_label: "工厂",
      items: [
        { num: "04", label: "袋子",         width: 100, delay: 0   },
        { num: "02", label: "网袋",         width: 50,  delay: 100 },
        { num: "01", label: "绳索",         width: 25,  delay: 200 },
        { num: "03", label: "拉伸膜",       width: 50,  delay: 300 },
        { num: "01", label: "软包装",       width: 25,  delay: 400 },
        { num: "01", label: "回收",         width: 25,  delay: 500 },
        { num: "03", label: "护角",         width: 75,  delay: 600 },
        { num: "01", label: "货运",         width: 25,  delay: 700 },
        { num: "01", label: "一次性用品",   width: 25,  delay: 800 },
        { num: "01", label: "袋子",         width: 25,  delay: 900 }
      ]
    },

    valores: {
      title:    "我们的价值观",
      subtitle: "我们文化的支柱",
      items: [
        { title: "责任",   description: "我们以道德和专业精神履行承诺，意识到我们的行动对客户、员工和社区的影响。" },
        { title: "信任",   description: "我们以透明、诚实和信守承诺为基础建立牢固的关系，在每次互动中创造安全感。" },
        { title: "热情",   description: "我们热爱我们所做的一切，并将其体现在每一件产品、流程和创新中，以真诚的热情和奉献精神推动卓越。" },
        { title: "坚持",   description: "我们以决心和毅力面对挑战，坚定地追求我们的目标，直到取得非凡成果。" },
        { title: "纪律",   description: "我们遵循严格的流程和质量标准，有秩序有方法，保证每次交付的一致性和卓越性。" },
        { title: "主动性", description: "我们预测需求并在问题出现之前采取行动，创造持续创造价值的创新解决方案。" },
        { title: "尊重",   description: "我们重视每个人的多样性、尊严和贡献，营造合作、包容和公平对待的环境。" }
      ]
    }
  },

  // =================================================
  // 页脚
  // =================================================
  footer: {
    about_us:         "关于我们",
    about:            "关于",
    social_impact:    "社会责任",
    customer_service: "客户服务",
    be_distributor:   "成为经销商",
    catalog:          "目录",
    cta_button:       "我要成为经销商",
    rights:           "版权所有。"
  },

  // =================================================
  // 页面：社会责任
  // =================================================
  impacto_social: {
    page_title: "社会责任 | Grupo Ortiz",

    hero: {
      eyebrow:          "社会责任",
      title_top:        "共同建设",
      title_bottom:     "更美好的世界",
      subtitle:         "我们支持家庭，赋权女性，给予第二次机会，并爱护地球。我们迈出的每一步都致力于改变生命，建设充满希望的未来。",
      stat_female:      "% 女性员工",
      stat_recycled:    "回收吨数",
      stat_initiatives: "活跃项目",
      video:            "/videos/waves2.mp4",
    },

    ods: {
      title:       "我们的方向",
      subtitle:    "2030年议程",
      description: "我们以联合国可持续发展目标为指导，共同建设一个更公正、繁荣和可持续的世界。",
      cards: [
        { n: 1,  title: "消除贫困",       link: "https://sdgs.un.org/es/goals/goal1",  img: "/images/odc/1.png"  },
        { n: 2,  title: "零饥饿",         link: "https://sdgs.un.org/es/goals/goal2",  img: "/images/odc/2.png"  },
        { n: 3,  title: "健康与福祉",     link: "https://sdgs.un.org/es/goals/goal3",  img: "/images/odc/3.png"  },
        { n: 4,  title: "优质教育",       link: "https://sdgs.un.org/es/goals/goal4",  img: "/images/odc/4.png"  },
        { n: 5,  title: "性别平等",       link: "https://sdgs.un.org/es/goals/goal5",  img: "/images/odc/5.png"  },
        { n: 6,  title: "清洁水源",       link: "https://sdgs.un.org/es/goals/goal6",  img: "/images/odc/6.png"  },
        { n: 7,  title: "经济适用的清洁能源", link: "https://sdgs.un.org/es/goals/goal7", img: "/images/odc/7.png" },
        { n: 8,  title: "体面工作",       link: "https://sdgs.un.org/es/goals/goal8",  img: "/images/odc/8.png"  },
        { n: 9,  title: "工业、创新和基础设施", link: "https://sdgs.un.org/es/goals/goal9", img: "/images/odc/9.png" },
        { n: 10, title: "减少不平等",     link: "https://sdgs.un.org/es/goals/goal10", img: "/images/odc/10.png" },
        { n: 11, title: "可持续城市",     link: "https://sdgs.un.org/es/goals/goal11", img: "/images/odc/11.png" },
        { n: 12, title: "负责任消费和生产", link: "https://sdgs.un.org/es/goals/goal12", img: "/images/odc/12.png" },
        { n: 13, title: "气候行动",       link: "https://sdgs.un.org/es/goals/goal13", img: "/images/odc/13.png" },
        { n: 14, title: "水下生命",       link: "https://sdgs.un.org/es/goals/goal14", img: "/images/odc/14.png" },
        { n: 15, title: "陆地生命",       link: "https://sdgs.un.org/es/goals/goal15", img: "/images/odc/15.png" },
        { n: 16, title: "和平与正义",     link: "https://sdgs.un.org/es/goals/goal16", img: "/images/odc/16.png" },
        { n: 17, title: "促进目标实现的伙伴关系", link: "https://sdgs.un.org/es/goals/goal17", img: "/images/odc/17.png" },
      ]
    },

    vision: {
      title:        "我们的",
      title_orange: "积极影响",
      subtitle:     "改变行业",
      pilars: [
        {
          label: "支柱 01",
          title: "大地的产品",
          desc:  "开发创新环保材料，用于软包装，尊重环境，减少碳足迹。",
          img:   "/images/impacto/products.webp"
        },
        {
          label: "支柱 02",
          title: "大地的做法",
          desc:  "在所有生产流程中实现清洁制造和循环经济，封闭循环，消除废物。",
          img:   "/images/impacto/practices.webp"
        },
        {
          label: "支柱 03",
          title: "社会大地",
          desc:  "对客户、员工和社区的全面承诺，创造积极的社会影响和真正的机会。",
          img:   "/images/impacto/social.webp"
        }
      ]
    },

    oceanos: {
      hero_title:           "致力于为我们的海洋",
      hero_title_highlight: "创造更清洁的未来",
      hero_video:           "/videos/waves.mp4",
      intro: "在 Grupo Ortiz，我们相信海洋能够重新焕发光彩的世界。通过支持全球倡议，如 The Ocean Cleanup 和由 Lonely Whale 支持的 Tom Ford Plastic Innovation Prize，我们致力于减少海洋中的塑料污染。您与我们的每一次合作都是迈向更清洁星球和所有人可持续未来的一步。让我们共同拯救海洋！",
      features: [
        { title: "支持全球清洁工作",     desc: "与 The Ocean Cleanup 等倡议合作。"                       },
        { title: "推动可持续创新",       desc: "通过 Tom Ford Plastic Innovation Prize 等项目。"         },
        { title: "推广负责任产品",       desc: "减少对海洋的环境影响。"                                  },
        { title: "激发集体行动",         desc: "邀请客户和合作伙伴成为变革的一部分。"                    }
      ],
      partners: [
        {
          title:  "Tom Ford 创新",
          desc:   "这一全球倡议旨在通过奖励和推广能够替代一次性塑料的创新解决方案来彻底改变塑料行业。其重点是可持续和可扩展的替代方案，以减少环境影响，保护海洋，推动向更负责任的地球材料转变。",
          btn:    "了解更多",
          link:   "https://unwrapthefuture.org/",
          video:  "/videos/impacto/oceancleanup.mp4",
          poster: "/images/impacto/cultura-calidad.jpg"
        },
        {
          title:  "海洋清洁",
          desc:   "致力于清洁世界海洋，该组织开发先进技术，清除海洋中积累的塑料，并通过干预河流（主要污染源）来防止其到达海洋。其使命是恢复海洋生态系统健康，保护生物多样性，确保下一代的清洁未来。",
          btn:    "了解更多",
          link:   "https://theoceancleanup.com/",
          video:  "/videos/impacto/tomford.mp4",
          poster: "/images/impacto/tomford.webp"
        }
      ]
    },

    stats: {
      recycled: "回收吨数",
      female:   "% 女性员工",
      families: "受益家庭"
    },

    timeline: {
      title:    "改变生活的项目",
      subtitle: "持久的积极影响",
      items: [
        {
          num: "01", title: "希望之家",
          desc:       "支持米却肯州塔坎巴罗的儿童之家。每个孩子都值得拥有一个充满爱的家。",
          desc_short: "支持米却肯州塔坎巴罗的儿童之家。",
          img:        "/images/impacto/hogar.mp4",
          isVideo:    true,
          poster:     "/images/impacto/hogar.mp4"
        },
        {
          num: "02", title: "GO 食品篮",
          desc:       "团结社区。带着爱心分发食品篮。",
          desc_short: "带着爱心向社区分发食品篮。",
          img:        "/images/impacto/despensas.webp",
          isVideo:    false
        },
        {
          num: "03", title: "零碳足迹",
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
          num: "05", title: "GO 闪光",
          desc:       "为GO团队的绩效颁发奖励。认可努力。",
          desc_short: "认可GO团队的绩效。",
          img:        "/images/impacto/woman.webp",
          isVideo:    false
        },
        {
          num: "06", title: "领导之手",
          desc:       "84%女性员工比例。赋权女性领导者。",
          desc_short: "56.82%女性员工比例。赋权领导者。",
          img:        "/images/impacto/bio.webp",
          isVideo:    false
        }
      ]
    },

    cta: {
      title:        "共同",
      title_orange: "转变",
      desc:         "我们是您企业以技术、经验和成果实现增长所需的战略合作伙伴。",
      contact:      "联系我们",
      products:     "查看产品"
    }
  },

  // =================================================
  // 页面：首页
  // =================================================
  home: {
    meta_title: "Grupo Ortiz | 墨西哥聚合物和包装制造商",
    meta_description: "超过65年的拉伸膜、编织袋、绳索、拉菲绳、网袋和软包装制造经验。墨西哥和拉丁美洲塑料聚合物领导者。",
    hero: {
      eyebrow:      "始于1959年",
      title_top:    "我们是拉丁美洲",
      title_bot:    "主要制造商",
      video:        "background.mp4",
      subtitle:     "超过65年为五大洲的工业提供高工程水平的解决方案。",
      btn_products: "我们的产品",
      btn_about:    "了解更多",
      stats: [
        { number: 65,   label: "年经验" },
        { number: 3000, prefix: "+", label: "员工" },
        { number: 5,    prefix: "",  label: "大洲"  }
      ]
    },

    divisiones: {
      tag:       "我们的部门",
      title:     "专业",
      title_em:  "领域",
      link_text: "查看产品",
      items: [
        { title: "网袋",     tag: "部门 01", description: "平织和圆织聚丙烯拉菲网袋。透气设计，非常适合水果、蔬菜和农产品。",                              img: "/images/divisiones/arpilla.webp",           color: "#2d8a4e", slug: "arpillas",           soon: false },
        { title: "绳索",     tag: "部门 02", description: "高韧度聚丙烯绳索，适用于农业、工业和海洋用途。优良的耐候性和内置UV滤光器。",                  img: "/images/divisiones/cuerdas.webp",           color: "#1a5f8a", slug: "cuerdas",            soon: false },
        { title: "拉菲绳",   tag: "部门 03", description: "高性能聚丙烯拉菲绳。重量轻，断裂强度高，适用于农业、禽类养殖和园艺的多功能应用。",             img: "/images/divisiones/rafia.webp",             color: "#8a6d2d", slug: "rafias",             soon: false },
        { title: "软包装",   tag: "部门 04", description: "高阻隔薄膜和专业复合材料。采用先进技术为食品和工业产品提供最佳保护。",                       img: "/images/divisiones/bolsa.webp",             color: "#0d7377", slug: "empaques-flexibles", soon: false },
        { title: "编织袋",   tag: "部门 05", description: "优质拉菲编织袋。适用于食品、化学品、肥料和散装产品的坚固包装解决方案。",                     img: "/images/divisiones/sacos.webp",             color: "#3a7d44", slug: "sacos",              soon: false },
        { title: "拉伸膜",   tag: "部门 06", description: "高光学透明度拉伸膜。以高效率确保货物完整性。包括可生物降解选项。",                           img: "/images/divisiones/film-estirable.webp",    color: "#2c5f8a", slug: "stretch-film",       soon: false },
        { title: "护角",     tag: "部门 07", description: "牛皮纸板护角，保护储存和运输过程中的边缘。均匀分配压力，最大化货物稳定性。",                  img: "/images/divisiones/esquineros.webp",        color: "#7b3fa0", slug: "esquineros",         soon: false },
        { title: "一次性用品", tag: "部门 10", description: "用于工业、食品和医疗用途的聚丙烯一次性产品。卫生、经济、高强度解决方案。",               img: "/images/divisiones/desechables.webp",       color: "#e05500", slug: "desechables",        soon: true  }
      ]
    },

    porque: {
      tag:           "为什么选择我们",
      title:         "超过65年",
      title_em:      "的领导地位",
      body:          "我们是墨西哥和拉丁美洲塑料聚合物行业的标杆，拥有经认证的流程和全球响应能力。",
      btn:           "我们的历史",
      badge1_label:  "业务单元",
      badge1_number: 13,
      badge2_label:  "部门",
      badge2_number: 6,
      img:           "/images/home/planta-produccion.webp",
      features: [
        { title: "认证品质",   description: "产品符合最高国际制造标准。"              },
        { title: "持续创新",   description: "持续投资研发，保持行业技术领先地位。"    },
        { title: "全球覆盖",   description: "在五大洲积极存在，拥有高效的分销网络。" }
      ]
    },

    certs: {
      tag:      "品质保证",
      title:    "我们的",
      title_em: "认证",
      items: [
        { code: "Kosher Pareve",     name: "KMD México",     img: "/images/certificaciones/KOSHER.jpeg"   },
        { code: "FSSC 22000",        name: "LRQA Certified", img: "/images/certificaciones/LRQA.png"      },
        { code: "AIB International", name: "Since 1919",     img: "/images/certificaciones/AIB.png"       },
        { code: "ISO 9001",          name: "Bureau Veritas", img: "/images/certificaciones/CERTIFIED.png" }
      ]
    },

    compromiso: {
      card1: {
        eyebrow: "我们的方向",
        title:   "创新",
        text:    "我们投资研发，以提供超越全球市场期望的产品，采用前沿技术。"
      },
      card2: {
        eyebrow: "我们的承诺",
        title:   "可持续发展",
        text:    "对环境负责的流程，活跃的回收计划，以及整个供应链的碳足迹减少。"
      }
    },

    global: {
      tag:      "全球存在",
      title:    "我们向",
      title_em: "全球出口",
      desc:     "我们的产品销往30多个国家的客户，巩固了我们作为塑料聚合物领导者的地位。",
      video:    "/videos/camion.mp4",
      stats: [
        { number: 65,   label: "年"    },
        { number: 30,   prefix: "+", label: "国家"  },
        { number: 3000, prefix: "+", label: "员工"  },
        { number: 5,    prefix: "",  label: "大洲"  }
      ]
    },

    cta: {
      tag:      "准备好开始了吗？",
      title:    "让我们",
      title_em: "合作",
      sub:      "了解我们的解决方案如何改变您的业务",
      btn:      "联系我们"
    }
  }

};