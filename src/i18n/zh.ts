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
    company: '公司简介',
    social: '社会影响',
    distributor: '经销商',
    contact: '联系我们'
  },

  // =================================================
  // 主页横幅
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
    redirecting: "跳转中...",
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
    greeting: '您好！我是 BotGo 🤖。今天有什么可以帮您的？',
    placeholder: '输入消息...',
    listeningState: '正在聆听...',
    thinking: '思考中...',
    errorMsg: '连接错误。',
    salesBtn: '通过 WhatsApp 询价',
    voiceAssistantTitle: '虚拟助手',
    voiceCode: 'zh-CN',
    waStart: '您好 Grupo Ortiz，我想获取报价',
    pdfBtn: '查看 PDF 目录',
  },

  pwa: {
    appName: "Grupo Ortiz",
    title: "安装 GO 应用",
    description: "从主屏幕快速访问",
    install: "安装",
    notNow: "暂不安装",
    timeLabel: "刚刚"
  },

  // =================================================
  // 促销页面
  // =================================================
  promociones: {
    meta_title: "促销 | Grupo Ortiz",
    hero: {
      label: "特别优惠",
      title: "促销活动",
      subtitle: "抓紧我们的限时优惠",
      validity: "有效期至库存售完为止*"
    },
    discount_badge: "最高",
    off_text: "折扣",
    original_price: "原价",
    promo_price: "特惠价格",
    buy_button: "申请报价",
    contact_cta: "联系顾问了解更多信息",
    valid_until: "有效期至库存售完为止*",

    products: [
      {
        id: "promo-stretch",
        name: "拉伸膜",
        subtitle: "彩色拉伸膜每公斤 $33",
        image: "/images/stretch/manual.webp",
        discount: 35,
        originalPrice: "",
        promoPrice: "$33/公斤",
        features: [
          "彩色拉伸膜",
          "每公斤特惠价格",
          "库存有限",
          "多种颜色可选"
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
          "高质量绳索",
          "每公斤特惠价格",
          "限时优惠",
          "供货视库存而定"
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
      label: "文件资料",
      title: "综合产品目录",
      description: "一份文件涵盖质量与整合解决方案。请选择您偏好的语言获取我们的企业介绍。",
      scrollText: "查看各部门"
    },
    carousel: {
      label: "可供下载",
      title: "各部门目录",
    },
    languageLabel: "Language / Idioma",
    downloadButton: "下载 PDF",
    divisions: [
      {
        id: "1",
        name: "拉伸膜",
        desc: "用于固定和保护货物的拉伸膜。高效托盘包装和安全运输解决方案。",
        image: "/images/catalogo/img1.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1HYGcpgkRO_7OX22IcWvRpzpLZKgpYV3A/view?usp=sharing",
          en: "https://drive.google.com/file/d/1QZ6jmKyc-CGLwh9brbeZSQ5OOzkKdBCQ/view?usp=sharing",
        }
      },
      {
        id: "2",
        name: "绳索",
        desc: "工业和渔业捆绑用强力耐用绳索。采用高质量材料制造，适合高强度使用。",
        image: "/images/catalogo/img2.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/14GrV9P1ViQKvFp3BucYjgmryRgWKLEZh/view?usp=sharing",
          en: "https://drive.google.com/file/d/19Tvd_VHjogSE7y7cLZYr4ra__4vB4nOm/view?usp=sharing",
        }
      },
      {
        id: "3",
        name: "拉菲草",
        desc: "农业和工业捆扎的标准选择。耐用柔韧材料，适用于多种用途。",
        image: "/images/catalogo/img3.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1uAiR4uxO2iX_LsNFul6kXeb7jnnCEV_J/view?usp=sharing",
          en: "https://drive.google.com/file/d/10PV-sxexE8UkFSOhdTJBe1xWCy_tdFib/view?usp=sharing",
        }
      },
      {
        id: "4",
        name: "网眼袋",
        desc: "开放式网眼织物，最大化农业通风效果。用于包装和运输农产品的多功能解决方案。",
        image: "/images/catalogo/img4.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1OQKGpnRCfA2yFdAlT6q7GczYua2FFFVU/view?usp=sharing",
          en: "https://drive.google.com/file/d/1wldGL6XuqH-Ruth9Y01-hkNnPlbg9SW5/view?usp=sharing",
        }
      },
      {
        id: "5",
        name: "编织袋",
        desc: "平织聚丙烯用于大批量包装。优异强度适用于散装产品。",
        image: "/images/catalogo/img5.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/16S43-PUrQECO9q2J1fOgbN-YeIxQ2GhP/view?usp=sharing",
          en: "https://drive.google.com/file/d/1fkZvAWTT3mnBkxQ0Gbb2kRgOoN2dJZiK/view?usp=sharing",
        }
      },
      {
        id: "6",
        name: "护角板",
        desc: "托盘结构保护和稳定性。物流和货物储存中不可或缺的加固件。",
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
  // 主列表（产品轮播）
  // =================================================
  products_list: [
    {
      img: "carrusel/img1.webp",
      division: "拉伸膜",
      descripcion: "高光学透明度拉伸膜，符合质量标准。确保货物完整性，提高成本效率。我们的产品线包括可生物降解选项，降解速度比普通产品快 90%。",
      slug: "stretch-film",
      video: "carrusel/stretch-film.mp4"
    },
    {
      img: "carrusel/img2.webp",
      division: "绳索",
      descripcion: "高性能聚丙烯（PP）长丝绳索。完美平衡：极轻的重量与出色的断裂强度兼得。",
      slug: "cuerdas",
      video: "carrusel/cuerdas.mp4"
    },
    {
      img: "carrusel/img3.webp",
      division: "拉菲草",
      descripcion: "高性能聚丙烯（PP）薄膜拉菲草。重量极轻，断裂强度高。柔韧多用途。",
      slug: "rafias",
      video: "carrusel/rafia.mp4"
    },
    {
      img: "carrusel/img4.webp",
      division: "网眼袋",
      descripcion: "聚丙烯拉菲草网眼袋，平织带加强型形缝合。透气设计，非常适合水果和蔬菜。",
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
      division: "护角板",
      descripcion: "纸板护角板优化物流。结构强度更高，货物稳定性更强。",
      slug: "esquineros",
      video: "carrusel/esquineros.mp4"
    },
    {
      img: "carrusel/img7.webp",
      division: "软包装",
      descripcion: "Neo Empaques International 专注于先进的软包装解决方案，旨在优化多个行业产品的保鲜和展示效果。",
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
      gauge: "厚度/微米",
      weight: "卷重",
      type: "用途"
    },

    products: [
      {
        name: '优质拉伸膜',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "专为手工托盘包装设计，这款中等拉伸率拉伸膜提供实用高效的解决方案，无需自动机械即可固定货物。其成分保证了良好的抗性和可靠的包装过程性能。",
        specs_values: { width: "19-30 cm", length: "1000-15000", gauge: "40-110", weight: "10-40 kg", type: "手动" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      },
      {
        name: '自动拉伸膜',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "专为低速和中速缠绕机设计，这款拉伸膜在自动化托盘包装过程中提供高性能和出色效果。其配方保证了固定货物的抗性和稳定性。",
        specs_values: { width: "18-30 cm", length: "2000-15000", gauge: "50-110", weight: "10-49 kg", type: "自动" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      },
      {
        name: '预拉伸手动膜',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "专为高性能手动应用设计，这款预拉伸膜以市场上最薄的厚度之一著称。其技术消除了缠绕时施加额外力量的需要，便于立即使用，提高托盘包装过程的效率。",
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
        description: "专为中等拉伸手动缠绕应用设计，这款传统拉伸膜在包装和固定货物过程中表现出色。其成分保证了一般应用中的抗性和稳定性。",
        specs_values: { width: "3-12 cm", length: "7000-25000", gauge: "40-120", weight: "10-40 kg", type: "手动" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/manual.png',
          '/images/stretch/rigido3.png'
        ]
      },
      {
        name: '硬质手动膜',
        img: '/images/stretch/rigido.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "专为有限拉伸手动缠绕应用特别配制，这款拉伸膜在包装过程中提供高性能和极高可靠性。其成分保证了固定货物的稳定性和效率。",
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
      load: "产出率",
      mat: "材料",
      weight: "重量",
      resist: "强度",
      charge: "规格"
    },

    products: [
      {
        name: '五金绳索',
        img: '/images/cuerdas/CuerdaT1.webp',
        video: "/videos/cuerdas/cuerda-1.mp4",
        link: '#',
        description: "采用聚丙烯和先进紫外线过滤器制造，这款绳索非常适合长时间日晒环境。其专业配方减缓自然磨损，延长使用寿命，保证在户外环境中更强的抗性和耐久性。是提供稳固性、安全性和可靠性能的完美五金绳索，适用于一般用途和高要求工作。",
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
        description: "采用聚丙烯（PP）和紫外线稳定剂制造，这款绳索非常适合海洋领域和长时间日晒环境。其专业配方减缓紫外线辐射造成的降解，延长使用寿命，保证更强的耐候性。是为农业大棚提供稳固性和稳定性的完美解决方案。",
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
        description: "采用高质量聚丙烯（PP）制造，这款绳索提供多种规格、粗细和颜色，有光滑或混合版本、加强型或带标识型可选。其多功能性和抗性使其成为多种应用的可靠选择，适用于工厂、仓库、批发市场、五金店、工作室和机加工区域。",
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
  // 页面：拉菲草
  // =================================================
  rafias: {
    meta_title: "拉菲草 | Grupo Ortiz",
    back_aria: "返回",
    specs_title: "技术规格",

    specs_labels: {
      cal: "规格",
      yield: "产出率（米）",
      resist: "强度（公斤）",
      usage: "材料"
    },

    products: [
      {
        name: "捆扎拉菲草",
        description: "采用100%原生聚丙烯制造，这款拉菲草提供高强度和出色产出率，即使在户外条件下也能保持其物理特性。其质量保证了耐久性和在高要求应用中的可靠性能。广泛用于农业、家禽和园艺领域。",
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
        name: "环保拉菲草",
        description: "采用高质量聚丙烯制造，这款拉菲草提供出色的强度，即使在户外条件下也能保持其物理特性。其可靠的产出率使其成为农业、家禽和园艺应用的理想选择。",
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
        name: "黑色原纤化拉菲草",
        description: "采用高质量聚丙烯制造，这款拉菲草提供出色的强度，即使在户外条件下也能保持其物理特性。其出色的产出率使其非常适合工业、五金和包装应用，以及农业、家禽和园艺领域。",
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
        description: "采用100%原生聚丙烯和拉菲草结构制造，这款网眼袋在包装和储存应用中提供高强度和出色产出率。其质量保证了耐久性和处理各类产品时的可靠性能。",
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
        description: "采用100%原生聚丙烯和拉菲草/单丝结构制造，这款网眼袋在包装和储存应用中提供高强度和出色产出率。其结构提供耐久性和处理及保护各类产品时的可靠性能。",
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
        description: "采用100%原生聚丙烯和拉菲草/单丝结构制造，这款网眼袋在包装和储存应用中提供高强度和出色性能。其结构保证了处理不同产品时的耐久性和可靠性。",
        specs_values: {
          type: "侧面",
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
        description: "采用100%原生聚丙烯和拉菲草/拉菲草结构制造，这款网眼袋在包装和储存过程中提供高强度和出色性能。其编织结构保证了在国内外市场高要求应用中的耐久性和可靠性。",
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
    back_aria: "返回产品",
    specs_title: "技术规格",

    specs_labels: {
      load: "宽度",
      unit: "长度",
      mat: "材料",
      weight: "强度"
    },

    products: [
      {
        name: '未覆膜拉菲草袋',
        img: '/images/sacos/saco2.png',
        model: '/models/saco_blanco.glb',
        video: "/videos/saco/slaminar.mp4",
        link: '#',
        description: "采用交织聚丙烯条带制造，未覆膜拉菲草袋在包装和储存应用中提供出色的强度和耐久性。其结构可承受重载而不破裂，保证在高要求工作中的可靠性能。",
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
        description: "采用聚丙烯条带和透明外观制造，这款袋子提供高强度并可清晰查看包装产品。其结构保证在储存和运输应用中的耐久性和可靠性能。",
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
        name: '环保拉菲草袋',
        img: '/images/sacos/saco3.png',
        video: "/videos/saco/eco.mp4",
        link: '#',
        description: "采用来自同一生产过程废料的再生材料制造，这款袋子以更实惠的成本提供强度和良好的耐久性。其制造工艺允许在一般包装和储存应用中提供可靠性能。",
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
  // 页面：护角板
  // =================================================
  esquineros: {
    meta_title: "护角板 | Grupo Ortiz",
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
        name: "棕色牛皮纸护角板",
        description: "专为在运输和储存过程中保护边缘和角落而制造，这款护角板均匀分配压力，防止货物变形和损坏。其结构在高要求包装应用中提供强度和稳定性。",
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
        name: "白色牛皮纸护角板",
        description: "专为在运输和储存过程中保护边缘和角落而制造，这款护角板均匀分配压力，防止货物变形和损坏。其结构在高要求包装应用中提供强度和稳定性。",
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
        description: "我们的卷膜提供多种复合方式、厚度和表面处理。印刷选项最多10色、133线/英寸。最大展开：1,140毫米。最大印刷宽度：1,450毫米。与自动包装机械兼容，优化生产效率。",
        img: "/images/flexible/bobina-impresa.png",
        video: "/videos/flexible/bobinaf.mp4",
        gallery: [
          "/images/flexible/bobina-impresa-1.png",
          "/images/flexible/bobina-impresa.png",
          "/images/flexible/bobina-impresa-3.png"
        ],
        specs_values: {
          lamination: "3种类型",
          finish:     "多样化",
          size:       "1,450 mm",
          zipper:     "不适用",
          type:       "卷膜"
        }
      },
      {
        name: "自立袋",
        description: "多功能自立袋，具有复合结构和高阻湿阻氧性能。适用于干湿食品、粉末、液体、化妆品和化学品。提供天然、哑光和金属光泽三种表面处理，规格从150克到1千克，可选拉链封口和透明窗口。",
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
        description: "印有精美装饰图案的袋子系列：红果、花卉、水果、麦穗、蓝色礼品和粉色礼品。拉链封口，坚固结构，天然或金属光泽表面处理。规格从150克到1千克。非常适合寻求高品质、视觉吸引力包装的用户。",
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
        description: "专为最大化肉类、奶酪、熟食和新鲜产品的新鲜度和保质期而设计。其密封结构消除空气，保留产品天然特性，防止风味、质地和品质损失。采用高强度高阻隔材料制造。",
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
      subtitle: "批发商门户",
      title: "成倍增长<br>您的<span>利润</span>",
      desc: "在行业领先制造商的支持下经销高需求产品。有保障的库存，无中间商，24小时物流。",
      cta: "立即开始"
    },
    cards: [
      { icon: "ri-stack-line",        title: "充足库存",   desc: "随时满足大额订单的能力。您的仓库始终充足。" },
      { icon: "ri-truck-line",        title: "24小时配送", desc: "自有物流。您的客户无需等待，我们创纪录地准时交货。" },
      { icon: "ri-shield-check-line", title: "品质保证",   desc: "无繁琐手续、无需多问的实物换货。品牌全力支持。" },
      { icon: "ri-line-chart-line",   title: "更高利润",   desc: "工厂直供价格，专为最大化您的净利润而设计。" }
    ],
    stats: [
      { val: 25, symbol: "k", label: "月产吨数"   },
      { val: 35, symbol: "+", label: "年历史"     },
      { val: 15, symbol: "M", label: "总销售额"   }
    ],
    form: {
      title: "注册<br>申请",
      desc: "加入我们的网络。填写您的资料，我们将为您分配区域和优惠价格单。",
      support_label: "直接支持",
      labels: {
        name:     "联系人姓名",
        business: "公司名称",
        whatsapp: "WhatsApp",
        email:    "电子邮件",
        products: "感兴趣的产品"
      },
      products_list: ["编织袋", "软包装", "拉菲草", "护角板", "绳索", "拉伸膜", "其他", "全部"],
      btn:         "提交申请",
      success_msg: "申请已发送"
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
        { year: "1959", title: "创业之初",     short: "在莫雷利亚创立",   img: "/images/tiempo/timeline-1959.webp",  description: "自1959年起，Grupo Ortiz 便参与墨西哥工业发展。集团由 Nicandro Ortiz 在莫雷利亚创立，怀揣着明确愿景：将尖端技术与员工的才华和奉献精神相结合，构建一家稳固、创新、致力于品质的企业。" },
        { year: "1970", title: "工业扩张",     short: "编织袋和网眼袋",   img: "/images/tiempo/timeline-1970.webp",  description: "1970年，我们开始生产聚丙烯编织袋和网眼袋，标志着工业发展的关键阶段。这一战略步骤加强了我们的运营能力，扩大了商业版图，巩固了我们在国内市场的地位。" },
        { year: "1985", title: "技术创新",     short: "欧洲机械设备",     img: "/images/tiempo/timeline-1985.webp",  description: "1985年，我们引进了最先进的欧洲机械设备，加强了工业基础设施，优化了生产流程。这一战略投资提升了质量标准，提高了运营效率，重申了我们对技术创新的承诺。" },
        { year: "1995", title: "多元化发展",   short: "新产品线",         img: "/images/tiempo/timeline-1995.webp",  description: "1995年，我们扩展了生产线，引入拉伸膜、软包装和工业专用产品。这一战略扩张多元化了我们的产品组合，增强了在行业中的竞争力，使我们能够满足国内市场的新需求。" },
        { year: "2005", title: "国际扩张",     short: "美洲和欧洲",       img: "/images/tiempo/timeline-2005.webp",  description: "2005年，我们开始向美洲和欧洲出口，标志着国际扩张的决定性步骤。这一成就使公司成为塑料聚合物行业的标杆，加强了我们的全球存在，巩固了在国际市场的竞争力。" },
        { year: "2015", title: "可持续发展",   short: "回收工厂",         img: "/images/tiempo/timeline-2015.webp",  description: "2015年，我们建立了回收工厂并加强了可持续发展项目，重申了我们对环境的承诺。这一战略举措优化了资源利用，推动了负责任的实践，巩固了我们可持续增长的愿景。" },
        { year: "2026", title: "今日现状",     short: "工业领导者",       img: "/images/tiempo/timeline-2026.webp",  description: "2026年，我们拥有17个生产工厂、超过4,000名员工和年产能22万吨。这一持续增长巩固了我们作为塑料行业领导者的地位，得到了坚实基础设施、专业人才和面向未来战略愿景的支撑。" }
      ]
    },

    filosofia: {
      label: "我们的原则",
      title: "GO 企业理念",
      img:   "/images/about/GO.webp",
      items: [
        "专注于客户满意度，而非竞争对手。",
        "对持续发明和创新的热情。",
        "每一个流程中的卓越运营。",
        "长远思考与即时成果。",
        "成为地球上最佳雇主和最安全的工作场所。"
      ]
    },

    vision: {
      label: "我们的方向",
      title: "愿景",
      img:   "/images/about/GO2.webp",
      items: [
        "成为地球上最以客户为导向的公司。",
        "为任何企业提供完整的整合解决方案。",
        "成为地球上任何企业的唯一包装解决方案。",
        "在全球扩张的同时不失人文关怀。"
      ]
    },

    infraestructura: {
      title_white:  "强大的",
      title_orange: "基础设施",
      stats: [
        { number: "10",     label: "生产工厂",   desc: "战略性布局的设施，服务国内外市场。", icon: "number" },
        { number: "+3,000", label: "员工人数",   desc: "推动每个生产流程的专业团队。", icon: "number" },
        { number: "260",    label: "物流单元",   desc: "自有车队保证全国及国际范围内高效分配和安全交货。", icon: "number" },
        { number: "全球",   label: "国际存在",   desc: "在美洲和欧洲的出口和销售。", icon: "globe" }
      ]
    },

    plantas: {
      title:           "我们的工厂",
      subtitle:        "17个生产工厂",
      map_img:         "/images/about/mexico_map.png",
      layer_michoacan: "/images/about/michoacan_layer.png",
      layer_monterrey: "/images/about/monterrey_layer.png",
      layer_both:      "/images/about/both_states_layer.png",
      locations: [
        { key: "monterrey", number: "1座工厂",  badge: "蒙特雷，新莱昂州" },
        { key: "michoacan", number: "16座工厂", badge: "莫雷利亚，米却肯州" }
      ]
    },

    instalaciones: {
      title_white:  "我们的",
      title_orange: "生产设施",
      subtitle:     "360°虚拟参观",
      badge_soon:   "即将推出",
      badge_tour:   "查看参观",
      btn_tour:     "查看3D参观",
      btn_soon:     "即将推出",
      items: [
        { id: "extrusoras", num: "01", title: "拉伸膜",      tag: "莫雷利亚，米州", desc: "高产能挤出生产线，将聚丙烯转化为精密扁丝。",                                 thumb: "/images/virtual/RT.webp", link: "https://my.matterport.com/show/?m=YoM2tyXMeyb&ss=2&sr=2.97,.12&play=1&qs=1&ts=1", soon: true  },
        { id: "telares",    num: "02", title: "网眼袋",      tag: "莫雷利亚，米州", desc: "最先进的织机，以最大均匀度编织纱线生产聚丙烯布料。",                         thumb: "/images/virtual/RA.webp", link: "https://my.matterport.com/show/?m=2xCe1VajMjj&ss=1&sr=2.28,-1.47&play=1&qs=1&ts=1", soon: false },
        { id: "laminado",   num: "03", title: "复合与印刷",  tag: "莫雷利亚，米州", desc: "复合和柔印区域，袋子在此完成表面处理、印刷和最终质量处理。",                 thumb: "/images/virtual/RS.webp", link: "", soon: true  },
        { id: "reciclado",  num: "04", title: "回收工厂",    tag: "莫雷利亚，米州", desc: "我们的聚丙烯回收中心，致力于循环经济和环境保护。",                           link: "", soon: true  }
      ]
    },

    capacidad: {
      title:         "安装产能",
      subtitle:      "高性能基础设施",
      planta_label:  "工厂",
      plantas_label: "工厂",
      items: [
        { num: "04", label: "编织袋生产",   width: 100, delay: 0   },
        { num: "02", label: "网眼袋生产",   width: 50,  delay: 100 },
        { num: "01", label: "绳索和拉菲草", width: 25,  delay: 200 },
        { num: "02", label: "拉伸膜",       width: 50,  delay: 300 },
        { num: "01", label: "软包装",       width: 25,  delay: 400 },
        { num: "01", label: "回收",         width: 25,  delay: 500 },
        { num: "03", label: "护角板",       width: 75,  delay: 600 },
        { num: "01", label: "打包带",       width: 25,  delay: 700 },
        { num: "01", label: "一次性用品",   width: 25,  delay: 800 },
        { num: "01", label: "袋子",         width: 25,  delay: 900 }
      ]
    },

    valores: {
      title:    "我们的价值观",
      subtitle: "我们企业文化的支柱",
      items: [
        { title: "责任心",   description: "我们以道德和专业态度履行承诺，意识到我们的行动对客户、员工和社区的影响。" },
        { title: "信任",     description: "我们建立基于透明度、诚实和信守承诺的牢固关系，在每次互动中带来安全感。"   },
        { title: "热情",     description: "我们热爱所做的事情，并将其体现在每一个产品、流程和创新中，以真诚的热忱和奉献推动卓越。" },
        { title: "坚持",     description: "我们以决心和一贯性面对挑战，在目标上坚定不移，直至取得卓越成果。"         },
        { title: "纪律性",   description: "我们以秩序和方法遵循严格的流程和质量标准，保证每次交付的一致性和卓越性。" },
        { title: "主动性",   description: "我们预见需求，在问题出现之前采取行动，创造持续产生价值的创新解决方案。"   },
        { title: "尊重",     description: "我们重视每个人的多样性、尊严和贡献，营造一个协作、包容和公平对待的环境。" }
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
    catalog:          "产品目录",
    cta_button:       "成为经销商",
    rights:           "版权所有。"
  },

  // =================================================
  // 页面：社会影响
  // =================================================
  impacto_social: {
    page_title: "社会影响 | Grupo Ortiz",

    hero: {
      eyebrow:          "社会影响",
      title_top:        "携手共建",
      title_bottom:     "更美好的世界",
      subtitle:         "我们支持家庭，赋能女性，提供第二次机会，爱护地球。我们的每一步都旨在改变生命，构建充满希望的未来。",
      stat_female:      "% 女性员工比例",
      stat_recycled:    "回收吨数",
      stat_initiatives: "活跃项目",
      video:            "/videos/waves2.mp4",
    },

    ods: {
      title:       "我们的指引",
      subtitle:    "2030年议程",
      description: "我们以联合国可持续发展目标为指引，共建更公正、繁荣和可持续的世界。",
      cards: [
        { n: 1,  title: "消除贫困",         link: "https://sdgs.un.org/goals/goal1",  img: "/images/odc/1.png"  },
        { n: 2,  title: "消除饥饿",         link: "https://sdgs.un.org/goals/goal2",  img: "/images/odc/2.png"  },
        { n: 3,  title: "良好健康与福祉",   link: "https://sdgs.un.org/goals/goal3",  img: "/images/odc/3.png"  },
        { n: 4,  title: "优质教育",         link: "https://sdgs.un.org/goals/goal4",  img: "/images/odc/4.png"  },
        { n: 5,  title: "性别平等",         link: "https://sdgs.un.org/goals/goal5",  img: "/images/odc/5.png"  },
        { n: 6,  title: "清洁饮水",         link: "https://sdgs.un.org/goals/goal6",  img: "/images/odc/6.png"  },
        { n: 7,  title: "经济适用能源",     link: "https://sdgs.un.org/goals/goal7",  img: "/images/odc/7.png"  },
        { n: 8,  title: "体面工作",         link: "https://sdgs.un.org/goals/goal8",  img: "/images/odc/8.png"  },
        { n: 9,  title: "工业、创新和基础设施", link: "https://sdgs.un.org/goals/goal9", img: "/images/odc/9.png" },
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
      title_orange: "影响力",
      subtitle:     "变革行业",
      pilars: [
        {
          label: "支柱 01",
          title: "大地之产品",
          desc:  "开发创新环保材料用于软包装，尊重环境并减少碳足迹。",
          img:   "/images/impacto/products.webp"
        },
        {
          label: "支柱 02",
          title: "大地之实践",
          desc:  "在所有生产流程中实现清洁制造和循环经济，关闭循环并消除废物。",
          img:   "/images/impacto/practices.webp"
        },
        {
          label: "支柱 03",
          title: "社会之地",
          desc:  "对客户、员工和社区的全面承诺，产生积极社会影响并创造真实机会。",
          img:   "/images/impacto/social.webp"
        }
      ]
    },

    oceanos: {
      hero_title:           "致力于为我们的海洋",
      hero_title_highlight: "创造更清洁的未来",
      hero_video:           "/videos/waves.mp4",
      intro: "在 Grupo Ortiz，我们相信一个海洋重现光彩的世界。通过支持 The Ocean Cleanup 和由 Lonely Whale 支持的 Tom Ford 塑料创新奖等全球倡议，我们致力于减少海洋中的塑料。您与我们的每一次购买都是迈向更清洁星球和所有人可持续未来的一步。让我们共同守护海洋！",
      features: [
        { title: "支持全球清洁行动",   desc: "与 The Ocean Cleanup 等倡议合作。"                  },
        { title: "推动可持续创新",     desc: "通过 Tom Ford 塑料创新奖等项目。"                   },
        { title: "倡导负责任产品",     desc: "减少对海洋的环境影响。"                             },
        { title: "激励集体行动",       desc: "邀请客户和合作伙伴共同参与变革。"                   }
      ],
      partners: [
        {
          title:  "汤姆·福特创新奖",
          desc:   "这一全球倡议通过奖励和推广能够替代一次性塑料的创新解决方案来寻求革命性地改变塑料行业。其重点在于减少环境影响、保护海洋并推动向更负责任材料转变的可持续、可扩展替代方案。",
          btn:    "了解更多",
          link:   "https://unwrapthefuture.org/",
          video:  "/videos/impacto/oceancleanup.mp4",
          poster: "/images/impacto/cultura-calidad.jpg"
        },
        {
          title:  "海洋清洁",
          desc:   "这个专注于清洁世界海洋的组织开发先进技术，清除积聚在海洋中的塑料，并通过干预主要污染来源——河流来防止其到达海洋。其使命是恢复海洋生态系统的健康，保护生物多样性，确保后代的清洁未来。",
          btn:    "了解更多",
          link:   "https://theoceancleanup.com/",
          video:  "/videos/impacto/tomford.mp4",
          poster: "/images/impacto/tomford.webp"
        }
      ]
    },

    stats: {
      recycled: "回收吨数",
      female:   "% 女性员工比例",
      families: "受益家庭"
    },

    timeline: {
      title:    "改变生命的行动",
      subtitle: "持久的积极影响",
      items: [
        {
          num: "01", title: "希望之家",
          desc:       "支持米却肯州塔坎巴罗的儿童之家。每个孩子都值得拥有充满爱的家。",
          desc_short: "支持米却肯州塔坎巴罗的儿童之家。",
          img:        "/images/impacto/hogar.mp4",
          isVideo:    true,
          poster:     "/images/impacto/hogar.mp4"
        },
        {
          num: "02", title: "GO 食品篮",
          desc:       "团结社区，用爱分发食品篮。",
          desc_short: "向社区用爱分发食品篮。",
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
          num: "05", title: "闪耀 GO",
          desc:       "为 GO 团队提供绩效奖励。认可努力付出。",
          desc_short: "认可 GO 团队的绩效表现。",
          img:        "/images/impacto/woman.webp",
          isVideo:    false
        },
        {
          num: "06", title: "引领的双手",
          desc:       "84% 女性员工。赋能女性领袖。",
          desc_short: "56.82% 女性员工。赋能领袖。",
          img:        "/images/impacto/bio.webp",
          isVideo:    false
        }
      ]
    },

    cta: {
      title:        "携手",
      title_orange: "共同转型",
      desc:         "我们是您的企业实现技术、经验和成果增长所需的战略合作伙伴。",
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
      eyebrow:      "自1959年起",
      title_top:    "我们是拉丁美洲",
      title_bot:    "主要制造商",
      video:        "background.mp4",
      subtitle:     "65余年来为全球五大洲的各行各业制造高工程解决方案。",
      btn_products: "我们的产品",
      btn_about:    "了解更多",
      stats: [
        { number: 65,   label: "年经验"   },
        { number: 3000, prefix: "+", label: "员工人数" },
        { number: 5,    prefix: "",  label: "大洲"     }
      ]
    },

    divisiones: {
      tag:       "我们的部门",
      title:     "专业",
      title_em:  "领域",
      link_text: "查看产品",
      items: [
        { title: "网眼袋",   tag: "部门 01", description: "聚丙烯拉菲草网眼袋，平织和圆织结构。透气设计，非常适合水果、蔬菜和农产品。",                                   img: "/images/divisiones/arpilla.webp",        color: "#2d8a4e", slug: "arpillas",           soon: false },
        { title: "绳索",     tag: "部门 02", description: "高韧性聚丙烯绳索，适用于农业、工业和海洋用途。优异的耐候性和内置紫外线过滤器。",                               img: "/images/divisiones/cuerdas.webp",        color: "#1a5f8a", slug: "cuerdas",            soon: false },
        { title: "拉菲草",   tag: "部门 03", description: "高性能聚丙烯拉菲草。重量极轻，断裂强度高，适用于农业、家禽和园艺的多功能产品。",                               img: "/images/divisiones/rafia.webp",          color: "#8a6d2d", slug: "rafias",             soon: false },
        { title: "软包装",   tag: "部门 04", description: "高阻隔薄膜和专业复合材料。采用前沿技术为食品和工业产品提供最佳保护。",                                         img: "/images/divisiones/bolsa.webp",          color: "#0d7377", slug: "empaques-flexibles", soon: false },
        { title: "编织袋",   tag: "部门 05", description: "优质拉菲草编织袋。适用于食品、化学品、肥料和散装产品的坚固包装解决方案。",                                     img: "/images/divisiones/sacos.webp",          color: "#3a7d44", slug: "sacos",              soon: false },
        { title: "拉伸膜",   tag: "部门 06", description: "高光学透明度拉伸膜。以成本效益确保货物完整性。包含可生物降解选项。",                                           img: "/images/divisiones/film-estirable.webp", color: "#2c5f8a", slug: "stretch-film",       soon: false },
        { title: "护角板",   tag: "部门 07", description: "牛皮纸护角板，用于储存和运输过程中的边缘保护。均匀压力分配，最大化货物稳定性。",                               img: "/images/divisiones/esquineros.webp",     color: "#7b3fa0", slug: "esquineros",         soon: false },
        { title: "一次性用品", tag: "部门 10", description: "工业、食品和医院用聚丙烯一次性产品。卫生、经济且高强度的解决方案。",                                         img: "/images/divisiones/desechables.webp",    color: "#e05500", slug: "desechables",        soon: true  }
      ]
    },

    porque: {
      tag:           "为什么选择我们",
      title:         "65余年",
      title_em:      "行业领导力",
      body:          "我们是墨西哥和拉丁美洲塑料聚合物行业的标杆，拥有经认证的流程和全球响应能力。",
      btn:           "我们的历史",
      badge1_label:  "业务单元",
      badge1_number: 10,
      badge2_label:  "部门",
      badge2_number: 6,
      img:           "/images/home/planta-produccion.webp",
      features: [
        { title: "认证质量",   description: "符合最高国际制造标准的产品。"              },
        { title: "持续创新",   description: "持续投入研发，保持行业技术领先地位。"      },
        { title: "全球覆盖",   description: "活跃于五大洲，拥有高效的分销网络。"        }
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
        eyebrow: "我们的理念",
        title:   "创新",
        text:    "我们投入研发，提供以前沿技术超越全球市场期望的产品。"
      },
      card2: {
        eyebrow: "我们的承诺",
        title:   "可持续发展",
        text:    "对环境负责的流程、积极的回收项目和整个供应链的碳足迹减少。"
      }
    },

    global: {
      tag:      "全球存在",
      title:    "我们向",
      title_em: "全球出口",
      desc:     "我们的产品覆盖超过30个国家的客户，巩固了我们作为塑料聚合物领导者的地位。",
      video:    "/videos/camion.mp4",
      stats: [
        { number: 65,   label: "年历史"   },
        { number: 30,   prefix: "+", label: "国家"   },
        { number: 3000, prefix: "+", label: "员工"   },
        { number: 5,    prefix: "",  label: "大洲"   }
      ]
    },

    cta: {
      tag:      "准备好开始了吗？",
      title:    "携手",
      title_em: "合作",
      sub:      "了解我们的解决方案如何改变您的运营",
      btn:      "联系我们"
    }
  }

};