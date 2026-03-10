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
  // 主视觉 / 封面
  // =================================================
  hero: {
    title: "欢迎",
    subtitle: "经久耐用的品质"
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
    previous: "上一页",
    next: "下一页"
  },

  // =================================================
  // 聊天机器人 (BotGo)
  // =================================================
  chatbot: {
    greeting: '您好！我是 BotGo 🤖，请问有什么可以帮您？',
    placeholder: '请输入消息...',
    listeningState: '正在聆听...',
    thinking: '思考中...',
    errorMsg: '连接错误。',
    salesBtn: '通过 WhatsApp 询价',
    voiceAssistantTitle: '虚拟助手',
    voiceCode: 'zh-CN',
    waStart: '您好，Grupo Ortiz，我想获取报价',
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
    meta_title: "促销活动 | Grupo Ortiz",
    hero: {
      label: "特别优惠",
      title: "促销活动",
      subtitle: "抓住我们的限时优惠",
      validity: "有效期至库存售罄*"
    },
    discount_badge: "高达",
    off_text: "折扣",
    original_price: "原价",
    promo_price: "优惠价",
    buy_button: "申请报价",
    contact_cta: "联系顾问获取更多信息",
    valid_until: "有效期至库存售罄*",

    products: [
      {
        id: "promo-stretch",
        name: "拉伸膜",
        subtitle: "彩色拉伸膜每公斤 ¥33",
        image: "/images/stretch/manual.webp",
        discount: 35,
        originalPrice: "",
        promoPrice: "¥33/千克",
        features: [
          "彩色拉伸薄膜",
          "按公斤计算的特惠价格",
          "库存有限",
          "多种颜色可选"
        ],
        validUntil: "有效期至库存售罄*"
      },
      {
        id: "promo-cuerda",
        name: "绳索",
        subtitle: "每公斤 ¥33",
        image: "/images/cuerdas/CuerdaT1.webp",
        discount: 25,
        originalPrice: "",
        promoPrice: "¥33/千克",
        features: [
          "高品质绳索",
          "按公斤计算的特惠价格",
          "限时优惠",
          "供货视库存而定"
        ],
        validUntil: "有效期至库存售罄*"
      }
    ]
  },

  // =================================================
  // 目录页面
  // =================================================
  catalog: {
    hero: {
      label: "文档资料",
      title: "综合产品目录",
      description: "将品质与一体化解决方案汇聚于单一文件中。请选择您偏好的语言以获取我们的企业简介。",
      scrollText: "查看各部门"
    },
    carousel: {
      label: "可下载资料",
      title: "按部门分类目录",
    },
    languageLabel: "Language / 语言",
    downloadButton: "下载 PDF",
    divisions: [
      {
        id: "1",
        name: "拉伸膜",
        desc: "用于固定和保护货物的拉伸薄膜。适用于托盘包装与安全运输的高效解决方案。",
        image: "/images/catalogo/img1.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1HYGcpgkRO_7OX22IcWvRpzpLZKgpYV3A/view?usp=sharing",
          en: "https://drive.google.com/file/d/1QZ6jmKyc-CGLwh9brbeZSQ5OOzkKdBCQ/view?usp=sharing",
        }
      },
      {
        id: "2",
        name: "绳索",
        desc: "适用于工业及渔业捆扎的高强度耐用绳索。采用高质量材料制造，适合高强度使用。",
        image: "/images/catalogo/img2.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/14GrV9P1ViQKvFp3BucYjgmryRgWKLEZh/view?usp=sharing",
          en: "https://drive.google.com/file/d/19Tvd_VHjogSE7y7cLZYr4ra__4vB4nOm/view?usp=sharing",
        }
      },
      {
        id: "3",
        name: "拉菲草",
        desc: "农业与工业捆扎的行业标准。耐用灵活的材料，适用于多种场合。",
        image: "/images/catalogo/img3.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1uAiR4uxO2iX_LsNFul6kXeb7jnnCEV_J/view?usp=sharing",
          en: "https://drive.google.com/file/d/10PV-sxexE8UkFSOhdTJBe1xWCy_tdFib/view?usp=sharing",
        }
      },
      {
        id: "4",
        name: "网袋",
        desc: "开孔网布，提供最大农业通风效果。适用于田间产品包装与运输的多功能解决方案。",
        image: "/images/catalogo/img4.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1OQKGpnRCfA2yFdAlT6q7GczYua2FFFVU/view?usp=sharing",
          en: "https://drive.google.com/file/d/1wldGL6XuqH-Ruth9Y01-hkNnPlbg9SW5/view?usp=sharing",
        }
      },
      {
        id: "5",
        name: "编织袋",
        desc: "平织聚丙烯，适用于大批量包装。优越的强度，适合散装产品。",
        image: "/images/catalogo/img5.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/16S43-PUrQECO9q2J1fOgbN-YeIxQ2GhP/view?usp=sharing",
          en: "https://drive.google.com/file/d/1fkZvAWTT3mnBkxQ0Gbb2kRgOoN2dJZiK/view?usp=sharing",
        }
      },
      {
        id: "6",
        name: "护角条",
        desc: "托盘的结构保护与稳定性。物流与货物储存中不可或缺的加固产品。",
        image: "/images/catalogo/img6.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/181Hvr0HQffLU3rmcXkccYoqj-Y_A-gxr/view?usp=sharing",
          en: "https://drive.google.com/file/d/1DdcEavACvuY00oyMyC9rOWRybi9jnQrD/view?usp=sharing",
        }
      },
      {
        id: "7",
        name: "软包装",
        desc: "高阻隔薄膜与专业复合材料。为食品和工业产品提供最佳保护。",
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
      division: "拉伸膜",
      descripcion: "高光学透明度拉伸薄膜，符合严格质量标准。确保货物完整性并提高成本效率。我们的产品线包括可生物降解选项，降解速度比普通产品快 90%。",
      slug: "stretch-film",
      video: "carrusel/stretch-film.mp4"
    },
    {
      img: "carrusel/img4.webp",
      division: "网袋",
      descripcion: "高强度、耐用圆编聚丙烯拉菲草网袋。透气设计，非常适合水果和蔬菜。",
      slug: "arpillas",
      video: "carrusel/arpillas.mp4"
    },
    {
      img: "carrusel/img2.webp",
      division: "绳索",
      descripcion: "高性能聚丙烯（PP）丝状绳索。极致轻盈与断裂强度的完美平衡。",
      slug: "cuerdas",
      video: "carrusel/cuerdas.mp4"
    },
    {
      img: "carrusel/img3.webp",
      division: "拉菲草",
      descripcion: "高性能聚丙烯（PP）薄膜拉菲草。重量轻，断裂强度高，灵活多用。",
      slug: "rafias",
      video: "carrusel/rafia.mp4"
    },
    {
      img: "carrusel/img5.webp",
      division: "编织袋",
      descripcion: "优质拉菲草编织袋。适用于食品、化工品及肥料的坚固包装解决方案。",
      slug: "sacos",
      video: "carrusel/sacos.mp4"
    },
    {
      img: "carrusel/img6.webp",
      division: "护角条",
      descripcion: "纸板护角条，优化物流管理。提供结构强度与更高货物稳定性。",
      slug: "esquineros",
      video: "carrusel/esquineros.mp4"
    },
    {
      img: "carrusel/img7.webp",
      division: "软包装",
      descripcion: "Neo Empaques International 专注于先进的软包装解决方案，旨在为多个行业优化产品保存与展示效果。",
      slug: "empaques-flexibles",
      video: "carrusel/bobina-impresa.mp4"
    }
  ],

  // =================================================
  // 页面：拉伸膜
  // =================================================
  stretch_film: {
    meta_title: "拉伸膜 | Grupo Ortiz",
    back_aria: "返回产品列表",
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
        description: "专为高要求机械设计，这款中等拉伸率的拉伸膜为自动化流程中的货物固定提供高效可靠的解决方案。其配方确保了高强度和卓越性能，适用于严苛的包装应用。",
        specs_values: { width: "480–760 毫米", length: "300–4,570 米", gauge: "40–110", weight: "10–40 千克", type: "手动" },
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
        description: "专为传统缠绕机设计，这款拉伸膜在自动化托盘包装流程中表现出色。其配方确保了货物固定的强度和稳定性。",
        specs_values: { width: "460–760 毫米", length: "600–4,570 米", gauge: "50–110", weight: "10–22 千克", type: "自动" },
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
        description: "专为高性能手动应用设计，这款预拉伸膜以市场上最薄的规格之一著称。其技术消除了缠绕时施加额外力的需要，方便即时使用，提高了托盘包装流程的效率。",
        specs_values: { width: "405–430 毫米", length: "2,135–7,620 米", gauge: "40–120", weight: "10–40 千克", type: "手动" },
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
        description: "专为中等拉伸率的手动缠绕应用设计，这款传统拉伸膜在包装和货物固定流程中表现优异。其配方确保了一般应用中的强度和稳定性。",
        specs_values: { width: "75–305 毫米", length: "2,135–7,620 米", gauge: "40–120", weight: "10–40 千克", type: "手动" },
        gallery: [
          '/images/stretch/rigido2.png',
          '/images/stretch/manual.png',
          '/images/stretch/rigido3.png'
        ]
      },
      {
        name: '手动硬质拉伸膜',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "专为有限拉伸率的手动缠绕应用特别配制，这款拉伸膜在包装流程中提供高性能和卓越可靠性。其配方确保了货物固定的稳定性和效率。",
        specs_values: { width: "430–760 毫米", length: "300–4,570 米", gauge: "40–90", weight: "10–40 千克", type: "手动", color: "黑色 / 彩色" },
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
      load: "出线率",
      mat: "材料",
      weight: "重量",
      resist: "断裂强度",
      charge: "规格"
    },

    products: [
      {
        name: '五金绳',
        img: '/images/cuerdas/CuerdaT1.webp',
        video: "/videos/cuerdas/cuerda-1.mp4",
        link: '#',
        description: "采用聚丙烯与先进紫外线过滤器制造，这款绳索非常适合高日照强度的作业环境。其专业配方延缓自然磨损，延长使用寿命，在户外条件下保证更强的耐久性。是为苛刻的一般应用和工作提供稳固、安全和可靠性能的理想五金绳。",
        specs_values: { load: "1,980 米", mat: "PP-UV", weight: "18 千克", resist: "79 千克力", charge: "4–19 毫米" },
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
        description: "采用聚丙烯（PP）与紫外线稳定剂制造，这款绳索非常适合海洋领域及高日照强度的作业环境。其专业配方延缓紫外线辐射造成的降解，延长使用寿命，增强耐候性。是为农业大型隧道提供稳固性和稳定性的完美解决方案。",
        specs_values: { load: "3,240 米", mat: "PP-UV", weight: "18 千克", resist: "48 千克力", charge: "3–8 毫米" },
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
        description: "采用高质量聚丙烯（PP）制造，这款绳索提供多种规格、粗细和颜色选择，有素色或组合色、加强或带标识版本可供选择。其多功能性和耐久性使其成为工业、工厂、仓库、批发市场、五金店和机加工领域多种应用的可靠选择。",
        specs_values: { load: "3,240 米", mat: "PP-UV", weight: "18 千克", resist: "48 千克力", charge: "3–8 毫米" },
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
      yield: "出线率（米）",
      resist: "断裂强度（千克）",
      usage: "材料"
    },

    products: [
      {
        name: "捆扎拉菲草",
        description: "采用 100% 原生聚丙烯制造，这款拉菲草强度高、出线率优异，即使在户外条件下也能保持其物理性能。其品质保证了在严苛应用中的耐久性和可靠性能。广泛应用于农业、家禽和园艺行业。",
        img: "/images/rafias/atar.png",
        video: "/videos/rafia/fondoN.mp4",
        specs_values: {
          cal: "2–8 毫米",
          yield: "90 千克",
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
        name: "环保拉菲草",
        description: "采用高质量聚丙烯制造，这款拉菲草强度优异，即使在户外条件下也能保持其物理性能。其可靠的出线率使其成为农业、家禽和园艺应用的理想选择。",
        img: "/images/rafias/Eco.png",
        video: "/videos/rafia/fondoE.mp4",
        specs_values: {
          cal: "2–8 毫米",
          yield: "90–500 千克",
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
        name: "黑色原纤化拉菲草",
        description: "采用高质量聚丙烯制造，这款拉菲草强度出色，即使在户外条件下也能保持其物理性能。其优异的出线率使其非常适合工业、五金和包装应用，以及农业、家禽和园艺行业。",
        img: "/images/rafias/negra.png",
        video: "/videos/rafia/fondoR.mp4",
        specs_values: {
          cal: "2–8 毫米",
          yield: "90–500 千克",
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
  // 页面：网袋
  // =================================================
  arpillas: {
    meta_title: "网袋 | Grupo Ortiz",
    back_aria: "返回",
    specs_title: "技术规格",

    specs_labels: {
      construction: "编织结构",
      sizes: "宽度",
      colors: "颜色",
      features: "封口方式"
    },

    products: [
      {
        name: '圆编网袋',
        img: '/images/arpillas/arpilla.webp',
        video: "/videos/arpilla/circular.mp4",
        link: '#',
        description: "采用 100% 原生聚丙烯与拉菲草编织结构制造，这款网袋在包装和储存应用中具有高强度和优异性能。其品质保证了耐久性和在各类产品处理中的可靠性能。",
        specs_values: {
          sizes: "23–70 厘米",
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
        name: '单丝网袋',
        img: '/images/arpillas/arpilla2.webp',
        video: "/videos/arpilla/mono.mp4",
        link: '#',
        description: "采用 100% 原生聚丙烯与拉菲草/单丝编织结构制造，这款网袋在包装和储存应用中具有高强度和优异性能。其结构为各类产品的处理和保护提供耐久性和可靠性能。",
        specs_values: {
          construction: "单丝",
          sizes: "23–70 厘米",
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
        description: "采用 100% 原生聚丙烯与拉菲草/单丝编织结构制造，这款网袋在包装和储存应用中具有高强度和优异性能。其结构保证了在不同产品处理中的耐久性和可靠性。",
        specs_values: {
          type: "侧面",
          construction: "单丝",
          sizes: "23–60 厘米",
          colors: "4",
          features: "加强型"
        },
        gallery: [
          '/images/arpillas/lateral1.webp',
          '/images/arpillas/arpilla3.webp',
          '/images/arpillas/lateral3.webp'
        ]
      },
      {
        name: '覆膜标签网袋',
        img: '/images/arpillas/arpilla4.webp',
        video: "/videos/arpilla/etiqueta.mp4",
        link: '#',
        description: "采用 100% 原生聚丙烯与拉菲草/拉菲草编织结构制造，这款网袋在包装和储存流程中具有高强度和优异性能。其编织结构保证了国内外出口市场苛刻应用的耐久性和可靠性。",
        specs_values: {
          type: "覆膜",
          construction: "拉菲草",
          sizes: "23–70 厘米",
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
    back_aria: "返回产品列表",
    specs_title: "技术规格",

    specs_labels: {
      load: "宽度",
      unit: "长度",
      mat: "材料",
      weight: "断裂强度"
    },

    products: [
      {
        name: '未覆膜拉菲草编织袋',
        img: '/images/sacos/saco2.png',
        model: '/models/saco_blanco.glb',
        video: "/videos/saco/slaminar.mp4",
        link: '#',
        description: "采用交织聚丙烯扁丝制造，未覆膜拉菲草编织袋在包装和储存应用中具有高强度和优异耐久性。其结构可承受重型负载而不破裂，在严苛工作中保证可靠性能。",
        specs_values: {
          load: "35–80 厘米",
          unit: "49–115 厘米",
          mat: "PP",
          weight: "120–200 千克力"
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
        description: "采用聚丙烯扁丝和透明外观制造，这款编织袋强度高，可出色地展示包装内的产品。其结构保证了储存和运输应用中的耐久性和可靠性能。",
        specs_values: {
          load: "35–80 厘米",
          unit: "49–115 厘米",
          mat: "PP",
          weight: "120–200 千克力"
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
        description: "采用同一生产流程产生的废料中回收的再生材料制造，这款编织袋以更实惠的成本提供强度和良好耐久性。其制造工艺确保了一般包装和储存应用中的可靠性能。",
        specs_values: {
          load: "45–80 厘米",
          unit: "49–115 厘米",
          mat: "PP",
          weight: "120–200 千克力"
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
  // 页面：护角条
  // =================================================
  esquineros: {
    meta_title: "护角条 | Grupo Ortiz",
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
        name: "棕色牛皮纸护角条",
        description: "专为在运输和储存过程中保护边缘和角落而制造，这款护角条均匀分配压力，防止货物变形和损坏。其结构为严苛包装应用提供强度和稳定性。",
        img: "/images/esquinero/esquinero.png",
        video: "/videos/esquinero/esquinero.mp4",
        link: "#",
        specs_values: {
          tab:    "38 毫米",
          thick:  "0.08 毫米",
          length: "30 厘米"
        },
        gallery: [
          '/images/esquinero/esquinero2.png',
          '/images/esquinero/esquinero.png',
          '/images/esquinero/esquinero3.png'
        ]
      },
      {
        name: "白色牛皮纸护角条",
        description: "专为在运输和储存过程中保护边缘和角落而制造，这款护角条均匀分配压力，防止货物变形和损坏。其结构为严苛包装应用提供强度和稳定性。",
        img: "/images/esquinero/esquinerob.png",
        video: "/videos/esquinero/esquinero.mp4",
        link: "#",
        specs_values: {
          tab:    "38 毫米",
          thick:  "0.08 毫米",
          length: "30 厘米"
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
        description: "我们的卷膜提供多种复合方式、厚度和表面处理选择。可印刷最多 10 色，分辨率达每厘米 52 线。最大展开尺寸：1,140 毫米，最大印刷宽度：1,450 毫米。兼容自动包装机械，优化生产效率。",
        img: "/images/flexible/bobina-impresa.png",
        video: "/videos/flexible/bobinaf.mp4",
        gallery: [
          "/images/flexible/bobina-impresa-1.png",
          "/images/flexible/bobina-impresa.png",
          "/images/flexible/bobina-impresa-3.png"
        ],
        specs_values: {
          lamination: "3 种",
          finish:     "多种",
          size:       "1,450 毫米",
          zipper:     "无",
          type:       "卷膜"
        }
      },
      {
        name: "自立袋",
        description: "多功能复合结构自立袋，具有高水分和氧气阻隔性。适用于干湿食品、粉末、液体、化妆品和化工品。提供天然、哑光和镀铝三种表面处理，容量从 150 克至 1 千克，可选拉链封口和透明窗。",
        img: "/images/flexible/standup-generica.png",
        video: "/videos/flexible/standup.mp4",
        gallery: [
          "/images/flexible/standup-generica-2.png",
          "/images/flexible/standup-generica.png",
          "/images/flexible/standup-generica-3.png"
        ],
        specs_values: {
          lamination: "复合",
          finish:     "3 种",
          size:       "1 千克",
          zipper:     "有 / 无",
          type:       "袋"
        }
      },
      {
        name: "印花自立袋",
        description: "具有吸引人装饰图案的袋型系列：红浆果、花卉、水果、麦穗、蓝礼品和粉礼品。拉链封口，坚固结构，天然或镀铝表面处理。容量从 150 克至 1 千克。非常适合追求高品质视觉效果包装的客户。",
        img: "/images/flexible/standup-origanics.png",
        video: "/videos/flexible/standup-origanics.mp4",
        gallery: [
          "/images/flexible/standup-origanics-2.png",
          "/images/flexible/standup-origanics.png",
          "/images/flexible/standup-origanics-3.png"
        ],
        specs_values: {
          lamination: "2 种",
          finish:     "礼品",
          size:       "1 千克",
          zipper:     "有",
          type:       "印花袋"
        }
      },
      {
        name: "高真空袋",
        description: "专为最大化肉类、奶酪、熟食和新鲜产品的新鲜度和货架期而设计。其密封性消除空气，保留产品的天然特性，防止风味、质地和品质流失。采用高阻力、高阻隔材料制造。",
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
          type:       "袋"
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
      title: "倍增<br>您的<span>利润</span>",
      desc: "在领先制造商的支持下销售高需求产品。库存有保障，无中间商，24 小时物流配送。",
      cta: "立即开始"
    },
    cards: [
      { icon: "ri-stack-line",        title: "充足库存",    desc: "具备即时满足大订单的能力，让您的仓库始终充足。" },
      { icon: "ri-truck-line",        title: "24 小时发货", desc: "自有物流。您的客户无需等待，我们以创纪录的速度交货。" },
      { icon: "ri-shield-check-line", title: "质量保证",    desc: "无繁琐手续，无需质疑的实物换货。品牌全力背书。" },
      { icon: "ri-line-chart-line",   title: "更高利润",    desc: "出厂直销价格，专为最大化您的净利润而设计。" }
    ],
    stats: [
      { val: 25, symbol: "k", label: "月产量（吨）"  },
      { val: 35, symbol: "+", label: "年创业历史"    },
      { val: 15, symbol: "M", label: "总销售额"      }
    ],
    form: {
      title: "注册<br>申请",
      desc: "加入我们的网络。填写您的资料，我们将为您分配区域和优惠价格清单。",
      support_label: "直接支持",
      labels: {
        name:     "联系人姓名",
        business: "公司名称",
        whatsapp: "WhatsApp",
        email:    "电子邮箱",
        products: "感兴趣的产品"
      },
      products_list: ["编织袋", "软包装", "拉菲草", "护角条", "绳索", "拉伸膜", "其他", "全部"],
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
      nav_prev:      "上一项",
      nav_next:      "下一项",
      video_bg:      "/videos/background.mp4",
      video_bg_webm: "",
      video_poster:  "",
      events: [
        { year: "1959", title: "创业之始",     short: "在莫雷利亚创立",      img: "/images/tiempo/timeline-1959.webp",  description: "自 1959 年起，Grupo Ortiz 便参与了墨西哥的工业发展。由 Nicandro Ortiz 在莫雷利亚创立，集团以坚定的愿景诞生：将尖端技术与员工的才能和奉献精神相结合，打造一家稳健、创新、致力于品质的企业。" },
        { year: "1970", title: "工业扩张",     short: "编织袋与网袋",        img: "/images/tiempo/timeline-1970.webp",  description: "1970 年，我们开始生产聚丙烯编织袋和网袋，标志着工业增长的关键阶段。这一战略举措增强了我们的运营能力，扩大了商业参与，并巩固了我们在国内市场的地位。" },
        { year: "1985", title: "技术创新",     short: "欧洲机械设备",        img: "/images/tiempo/timeline-1985.webp",  description: "1985 年，我们引进最先进的欧洲机械设备，强化了工业基础设施，优化了生产流程。这一战略投资提升了质量标准，提高了运营效率，重申了我们对技术创新的承诺。" },
        { year: "1995", title: "多元化发展",   short: "新产品线",            img: "/images/tiempo/timeline-1995.webp",  description: "1995 年，我们通过引入拉伸膜、软包装和工业专用产品扩展了生产线。这一战略扩张使我们的产品组合多元化，增强了行业竞争力，让我们能够满足国内市场的新需求。" },
        { year: "2005", title: "国际扩张",     short: "美洲与欧洲",          img: "/images/tiempo/timeline-2005.webp",  description: "2005 年，我们开始向美洲和欧洲出口，迈出了国际扩张的决定性一步。这一成就将公司定位为塑料聚合物行业的标杆，增强了我们的全球影响力，巩固了我们在国际市场的竞争力。" },
        { year: "2015", title: "可持续发展",   short: "回收工厂",            img: "/images/tiempo/timeline-2015.webp",  description: "2015 年，我们建立了回收工厂，强化了可持续发展项目，重申了对环境的承诺。这一战略举措优化了资源利用，推动了负责任的实践，巩固了我们可持续增长的愿景。" },
        { year: "2026", title: "当下",         short: "行业领导者",          img: "/images/tiempo/timeline-2026.webp",  description: "2026 年，我们拥有 17 座生产工厂、4,000 余名员工，年产能达 22 万吨。这种持续增长使我们稳固了在塑料行业的领导地位，得益于坚实的基础设施、专业人才和面向未来的战略愿景。" }
      ]
    },

    filosofia: {
      label: "我们的理念",
      title: "GO 企业哲学",
      img:   "/images/about/GO.webp",
      items: [
        "专注于客户满意度，而非竞争对手。",
        "对持续发明与创新充满热情。",
        "每个流程追求卓越运营。",
        "长远思考，立即见效。",
        "成为全球最佳雇主和最安全的工作场所。"
      ]
    },

    vision: {
      label: "我们的方向",
      title: "愿景",
      img:   "/images/about/GO2.webp",
      items: [
        "成为全球最以客户为中心的公司。",
        "为任何企业提供全面的一体化解决方案。",
        "成为全球任何企业的唯一包装解决方案。",
        "在保持人文关怀的同时实现全球化增长。"
      ]
    },

    infraestructura: {
      title_white:  "支撑我们的",
      title_orange: "基础设施",
      stats: [
        { number: "13",     label: "生产工厂",     desc: "战略布局的设施，服务国内外市场。", icon: "number" },
        { number: "+3,000", label: "员工",          desc: "推动每个生产流程的专业团队。", icon: "number" },
        { number: "260",    label: "物流单元",      desc: "自有车队，保证全国及国际高效配送与安全交付。", icon: "number" },
        { number: "全球",   label: "国际化布局",    desc: "在美洲和欧洲的出口与分销。", icon: "globe" }
      ]
    },

    plantas: {
      title:           "我们的工厂",
      subtitle:        "13 座生产工厂",
      map_img:         "/images/about/mexico_map.png",
      layer_michoacan: "/images/about/michoacan_layer.png",
      layer_monterrey: "/images/about/monterrey_layer.png",
      layer_both:      "/images/about/both_states_layer.png",
      locations: [
        { key: "monterrey", number: "1 座工厂",  badge: "新莱昂州蒙特雷" },
        { key: "michoacan", number: "12 座工厂", badge: "米却肯州莫雷利亚" }
      ]
    },

    instalaciones: {
      title_white:  "我们的",
      title_orange: "生产设施",
      subtitle:     "360° 虚拟参观",
      badge_soon:   "即将上线",
      badge_tour:   "查看参观",
      btn_tour:     "查看 3D 参观",
      btn_soon:     "即将上线",
      items: [
        { id: "extrusoras", num: "01", title: "拉伸膜",      tag: "米却肯州莫雷利亚", desc: "高产能挤出生产线，将聚丙烯转化为精密扁丝。",                         thumb: "/images/virtual/RT.webp", link: "https://my.matterport.com/show/?m=YoM2tyXMeyb&ss=2&sr=2.97,.12&play=1&qs=1&ts=1", soon: true  },
        { id: "telares",    num: "02", title: "网袋",        tag: "米却肯州莫雷利亚", desc: "最先进的织机，将纱线编织成均匀度极高的聚丙烯布料。",                   thumb: "/images/virtual/RA.webp", link: "https://my.matterport.com/show/?m=2xCe1VajMjj&ss=1&sr=2.28,-1.47&play=1&qs=1&ts=1", soon: false },
        { id: "laminado",   num: "03", title: "复合与印刷", tag: "米却肯州莫雷利亚", desc: "复合和柔版印刷区域，对编织袋进行表面处理、印刷和最终质量处理。",       thumb: "/images/virtual/RS.webp", link: "", soon: true  },
        { id: "reciclado",  num: "04", title: "回收工厂",   tag: "米却肯州莫雷利亚", desc: "我们的聚丙烯回收中心，致力于循环经济与环境保护。",                       link: "", soon: true  }
      ]
    },

    capacidad: {
      title:         "已安装产能",
      subtitle:      "高性能基础设施",
      planta_label:  "工厂",
      plantas_label: "座工厂",
      items: [
        { num: "04", label: "编织袋生产",   width: 100, delay: 0   },
        { num: "02", label: "网袋生产",     width: 50,  delay: 100 },
        { num: "01", label: "绳索与拉菲草", width: 25,  delay: 200 },
        { num: "02", label: "拉伸膜",       width: 50,  delay: 300 },
        { num: "01", label: "软包装",       width: 25,  delay: 400 },
        { num: "01", label: "回收",         width: 25,  delay: 500 },
        { num: "03", label: "护角条",       width: 75,  delay: 600 },
        { num: "01", label: "打包带",       width: 25,  delay: 700 },
        { num: "01", label: "一次性用品",   width: 25,  delay: 800 },
        { num: "01", label: "袋类",         width: 25,  delay: 900 }
      ]
    },

    valores: {
      title:    "我们的价值观",
      subtitle: "我们文化的支柱",
      items: [
        { title: "责任",   description: "我们以道德和专业精神履行承诺，意识到我们的行动对客户、员工和社区的影响。" },
        { title: "信任",   description: "我们建立基于透明、诚信和信守承诺的稳固关系，在每次互动中创造安全感。"    },
        { title: "热情",   description: "我们热爱自己的工作，并将其体现在每件产品、每个流程和每项创新中，以真诚的热情和奉献推动卓越。" },
        { title: "坚韧",   description: "我们以决心和坚持面对挑战，坚定地追求目标，直到取得非凡成果。"            },
        { title: "纪律",   description: "我们以有序、有方法地遵循严格的流程和质量标准，确保每次交付的一致性和卓越性。" },
        { title: "主动",   description: "我们预见需求，在问题出现前采取行动，创造持续产生价值的创新解决方案。"    },
        { title: "尊重",   description: "我们重视每个人的多样性、尊严和贡献，营造协作、包容和公平对待的环境。"    }
      ]
    }
  },

  // =================================================
  // 页脚
  // =================================================
  footer: {
    about_us:         "关于我们",
    about:            "公司介绍",
    social_impact:    "社会责任",
    customer_service: "客户服务",
    be_distributor:   "成为经销商",
    catalog:          "产品目录",
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
      title_top:        "携手共建",
      title_bottom:     "更美好的世界",
      subtitle:         "我们支持家庭、赋权女性、给予第二次机会并关爱地球。我们迈出的每一步都致力于改变生活，构建充满希望的未来。",
      stat_female:      "% 女性员工占比",
      stat_recycled:    "回收吨数",
      stat_initiatives: "活跃项目",
      video:            "/videos/waves2.mp4",
    },

    ods: {
      title:       "我们的北极星",
      subtitle:    "2030 议程",
      description: "我们以联合国可持续发展目标为指引，共建更公正、更繁荣、更可持续的世界。",
      cards: [
        { n: 1,  title: "无贫穷",       link: "https://sdgs.un.org/goals/goal1",  img: "/images/odc/1.png"  },
        { n: 2,  title: "零饥饿",       link: "https://sdgs.un.org/goals/goal2",  img: "/images/odc/2.png"  },
        { n: 3,  title: "良好健康与福祉", link: "https://sdgs.un.org/goals/goal3",  img: "/images/odc/3.png"  },
        { n: 4,  title: "优质教育",     link: "https://sdgs.un.org/goals/goal4",  img: "/images/odc/4.png"  },
        { n: 5,  title: "性别平等",     link: "https://sdgs.un.org/goals/goal5",  img: "/images/odc/5.png"  },
        { n: 6,  title: "清洁饮水",     link: "https://sdgs.un.org/goals/goal6",  img: "/images/odc/6.png"  },
        { n: 7,  title: "经济适用的清洁能源", link: "https://sdgs.un.org/goals/goal7",  img: "/images/odc/7.png"  },
        { n: 8,  title: "体面工作",     link: "https://sdgs.un.org/goals/goal8",  img: "/images/odc/8.png"  },
        { n: 9,  title: "工业、创新和基础设施", link: "https://sdgs.un.org/goals/goal9",  img: "/images/odc/9.png"  },
        { n: 10, title: "减少不平等",   link: "https://sdgs.un.org/goals/goal10", img: "/images/odc/10.png" },
        { n: 11, title: "可持续城市",   link: "https://sdgs.un.org/goals/goal11", img: "/images/odc/11.png" },
        { n: 12, title: "负责任消费和生产", link: "https://sdgs.un.org/goals/goal12", img: "/images/odc/12.png" },
        { n: 13, title: "气候行动",     link: "https://sdgs.un.org/goals/goal13", img: "/images/odc/13.png" },
        { n: 14, title: "水下生物",     link: "https://sdgs.un.org/goals/goal14", img: "/images/odc/14.png" },
        { n: 15, title: "陆地生物",     link: "https://sdgs.un.org/goals/goal15", img: "/images/odc/15.png" },
        { n: 16, title: "和平、正义与强大机构", link: "https://sdgs.un.org/goals/goal16", img: "/images/odc/16.png" },
        { n: 17, title: "促进目标实现的伙伴关系", link: "https://sdgs.un.org/goals/goal17", img: "/images/odc/17.png" },
      ]
    },

    vision: {
      title:        "我们的积极",
      title_orange: "影响力",
      subtitle:     "我们正在改变行业",
      pilars: [
        {
          label: "支柱 01",
          title: "大地的产品",
          desc:  "开发创新环保材料用于软包装，尊重环境，减少碳足迹。",
          img:   "/images/impacto/products.webp"
        },
        {
          label: "支柱 02",
          title: "大地的实践",
          desc:  "在所有生产流程中实施清洁制造和循环经济，封闭循环，消除浪费。",
          img:   "/images/impacto/practices.webp"
        },
        {
          label: "支柱 03",
          title: "社会大地",
          desc:  "对客户、员工和社区的全面承诺，创造积极的社会影响和实实在在的机会。",
          img:   "/images/impacto/social.webp"
        }
      ]
    },

    oceanos: {
      hero_title:           "致力于为我们的海洋",
      hero_title_highlight: "创造更洁净的未来",
      hero_video:           "/videos/waves.mp4",
      intro: "在 Grupo Ortiz，我们相信一个海洋重焕光彩的世界。通过支持海洋清洁（The Ocean Cleanup）和由 Lonely Whale 发起的 Tom Ford 塑料创新奖等全球倡议，我们致力于减少海洋中的塑料。您与我们的每一次合作，都是迈向更洁净星球和可持续未来的一步。让我们共同守护海洋！",
      features: [
        { title: "支持全球清洁行动",   desc: "与海洋清洁等倡议合作"                              },
        { title: "推动可持续创新",     desc: "通过 Tom Ford 塑料创新奖等项目。"                       },
        { title: "鼓励负责任产品",     desc: "减少对海洋的环境影响。"                                 },
        { title: "激励集体行动",       desc: "邀请客户和合作伙伴共同参与变革。"                       }
      ],
      partners: [
        {
          title:  "Tom Ford 创新奖",
          desc:   "这项全球倡议旨在通过奖励和推广取代一次性塑料的创新解决方案，革命性地改变塑料行业。其重点在于减少环境影响、保护海洋并推动向更负责任材料转型的可持续、可扩展替代方案。",
          btn:    "了解更多",
          link:   "https://unwrapthefuture.org/",
          video:  "/videos/impacto/oceancleanup.mp4",
          poster: "/images/impacto/cultura-calidad.jpg"
        },
        {
          title:  "海洋清洁",
          desc:   "该组织致力于清洁世界海洋，开发先进技术清除海洋中积累的塑料，并通过干预主要污染源——河流——阻止新塑料进入。其使命是恢复海洋生态系统健康，保护生物多样性，为子孙后代确保清洁的未来。",
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
      families: "受益家庭"
    },

    timeline: {
      title:    "改变世界的举措",
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
          num: "02", title: "GO 爱心物资",
          desc:       "团结社区，用爱心发放生活物资。",
          desc_short: "用爱心向社区发放生活物资。",
          img:        "/images/impacto/despensas.webp",
          isVideo:    false
        },
        {
          num: "03", title: "零碳足迹",
          desc:       "零废弃物政策。将废料转化为机遇。",
          desc_short: "零废弃物政策。转化废料。",
          img:        "/images/impacto/composta.webp",
          isVideo:    false
        },
        {
          num: "04", title: "活性堆肥",
          desc:       "生产可堆肥产品。尊重自然的创新。",
          desc_short: "可堆肥产品。可持续创新。",
          img:        "/images/impacto/GO.webp",
          isVideo:    false
        },
        {
          num: "05", title: "闪耀 GO",
          desc:       "为 GO 团队提供绩效奖励，表彰每一份努力。",
          desc_short: "表彰 GO 团队的出色绩效。",
          img:        "/images/impacto/woman.webp",
          isVideo:    false
        },
        {
          num: "06", title: "引领者之手",
          desc:       "84% 女性员工占比，赋权女性领导者。",
          desc_short: "56.82% 女性员工占比，赋权领导者。",
          img:        "/images/impacto/bio.webp",
          isVideo:    false
        }
      ]
    },

    cta: {
      title:        "携手",
      title_orange: "共同转变",
      desc:         "我们是您的企业实现技术、经验和业绩增长所需的战略合作伙伴。",
      contact:      "联系我们",
      products:     "查看产品"
    }
  },

  // =================================================
  // 页面：首页
  // =================================================
  home: {
    meta_title: "Grupo Ortiz | 墨西哥聚合物与包装制造商",
    meta_description: "超过 65 年制造拉伸膜、编织袋、绳索、拉菲草、网袋和软包装。墨西哥及拉丁美洲塑料聚合物行业领导者。",
    hero: {
      eyebrow:      "自 1959 年起",
      title_top:    "我们是拉丁美洲",
      title_bot:    "领先的制造商",
      video:        "background.mp4",
      subtitle:     "超过 65 年为五大洲的工业企业提供高工程水准的解决方案。",
      btn_products: "我们的产品",
      btn_about:    "了解更多",
      stats: [
        { number: 65,   label: "年经验"    },
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
        { title: "网袋",     tag: "部门 01", description: "平编和圆编聚丙烯拉菲草网袋。透气设计，非常适合水果、蔬菜和农产品。",                     img: "/images/divisiones/arpilla.webp",           color: "#2d8a4e", slug: "arpillas",           soon: false },
        { title: "绳索",     tag: "部门 02", description: "高强度聚丙烯绳索，适用于农业、工业和海洋用途。具有内置紫外线过滤器，耐候性强。",           img: "/images/divisiones/cuerdas.webp",           color: "#1a5f8a", slug: "cuerdas",            soon: false },
        { title: "拉菲草",   tag: "部门 03", description: "高性能聚丙烯拉菲草。重量轻，断裂强度高，适用于农业、家禽和园艺等多种场合。",               img: "/images/divisiones/rafia.webp",             color: "#8a6d2d", slug: "rafias",             soon: false },
        { title: "软包装",   tag: "部门 04", description: "高阻隔薄膜与专业复合材料。采用前沿技术为食品和工业产品提供最佳保护。",                     img: "/images/divisiones/bolsa.webp",             color: "#0d7377", slug: "empaques-flexibles", soon: false },
        { title: "编织袋",   tag: "部门 05", description: "优质拉菲草编织袋。适用于食品、化工品、化肥和散装产品的坚固包装解决方案。",                 img: "/images/divisiones/sacos.webp",             color: "#3a7d44", slug: "sacos",              soon: false },
        { title: "拉伸膜",   tag: "部门 06", description: "高光学透明度拉伸薄膜。以低成本确保货物完整性，含可生物降解选项。",                         img: "/images/divisiones/film-estirable.webp",    color: "#2c5f8a", slug: "stretch-film",       soon: false },
        { title: "护角条",   tag: "部门 07", description: "牛皮纸护角条，保护储存和运输过程中的边缘。均匀分配压力，最大化货物稳定性。",               img: "/images/divisiones/esquineros.webp",        color: "#7b3fa0", slug: "esquineros",         soon: false },
        { title: "一次性用品", tag: "部门 10", description: "适用于工业、食品和医疗的聚丙烯一次性产品。卫生、经济且高强度的解决方案。",             img: "/images/divisiones/desechables.webp",       color: "#e05500", slug: "desechables",        soon: true  }
      ]
    },

    porque: {
      tag:           "为什么选择我们",
      title:         "超过 65 年",
      title_em:      "行业领先",
      body:          "我们是墨西哥和拉丁美洲塑料聚合物行业的标杆企业，拥有认证流程和全球响应能力。",
      btn:           "我们的历史",
      badge1_label:  "业务单元",
      badge1_number: 13,
      badge2_label:  "部门",
      badge2_number: 6,
      img:           "/images/home/planta-produccion.webp",
      features: [
        { title: "认证品质",   description: "产品符合最高国际制造标准。"                 },
        { title: "持续创新",   description: "持续投入研发，保持行业技术领先地位。"       },
        { title: "全球覆盖",   description: "活跃于五大洲，拥有高效的分销网络。"         }
      ]
    },

    certs: {
      tag:      "品质有保障",
      title:    "我们的",
      title_em: "认证资质",
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
        text:    "我们投入研发，以前沿技术提供超越全球市场预期的产品。"
      },
      card2: {
        eyebrow: "我们的承诺",
        title:   "可持续发展",
        text:    "环境负责任的生产流程，积极的回收计划，以及全链条碳足迹减少。"
      }
    },

    global: {
      tag:      "全球布局",
      title:    "我们向",
      title_em: "全世界出口",
      desc:     "我们的产品销往 30 多个国家的客户，巩固了我们在塑料聚合物领域的领导地位。",
      video:    "/videos/camion.mp4",
      stats: [
        { number: 65,   label: "年历史"     },
        { number: 30,   prefix: "+", label: "覆盖国家" },
        { number: 3000, prefix: "+", label: "员工人数" },
        { number: 5,    prefix: "",  label: "大洲"     }
      ]
    },

    cta: {
      tag:      "准备好开始了吗？",
      title:    "携手",
      title_em: "共创未来",
      sub:      "探索我们的解决方案如何改变您的运营",
      btn:      "联系我们"
    }
  }

};