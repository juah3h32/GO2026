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
    social: '社会影响',
    distributor: '经销商',
    careers: '招聘',
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
    // ── 通用消息 ──
    greeting:            '您好！我是 BotGo 🤖。今天有什么可以帮助您的吗？',
    placeholder:         '请输入消息...',
    listeningState:      '正在聆听...',
    thinking:            '正在思考...',
    errorMsg:            '连接错误。',
    voiceAssistantTitle: '虚拟助手',
    voiceCode:           'zh-CN',

    // ── 操作按钮 ──
    salesBtn:   '通过 WhatsApp 报价',
    pdfBtn:     '查看 PDF 目录',
    waStart:    '您好 Grupo Ortiz，我想获取报价',

    // ── 桌面端工具提示（卡片） ──
    tooltipTitle:  '今天有什么',
    tooltipAccent: '可以帮助您？',
    tooltipCta:    '立即开始聊天！',
    tooltipItems: [
      { text: '申请我们的', bold: '职位空缺'          },
      { text: '请求',       bold: '产品信息'          },
      { text: '直接',       bold: '下单'              },
      { text: '联系',       bold: '客户服务'          },
      { text: '下载',       bold: '目录和技术规格表'  },
    ],

    // ── 移动端提示条 ──
    pillLabelSmall: '有什么',
    pillLabelBig:   '可以帮助您？',
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
      subtitle: "把握我们的限时优惠",
      validity: "有效期至库存售完为止*"
    },
    discount_badge: "最高",
    off_text: "折扣",
    original_price: "原价",
    promo_price: "特惠价",
    buy_button: "申请报价",
    contact_cta: "联系顾问获取更多信息",
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
          "彩色拉伸膜",
          "按公斤计算的特惠价格",
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
          "优质绳索",
          "按公斤计算的特惠价格",
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
      label: "文档资料",
      title: "综合目录",
      description: "将质量与综合解决方案汇聚于一份文件。请选择您偏好的语言以获取我们的企业介绍。",
      scrollText: "查看部门"
    },
    carousel: {
      label: "可下载内容",
      title: "按部门下载目录",
    },
    languageLabel: "Language / 语言",
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
        desc: "用于工业和渔业捆扎的高强度耐用绳索。采用高质量材料制造，适用于高强度使用。",
        image: "/images/catalogo/img2.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/14GrV9P1ViQKvFp3BucYjgmryRgWKLEZh/view?usp=sharing",
          en: "https://drive.google.com/file/d/19Tvd_VHjogSE7y7cLZYr4ra__4vB4nOm/view?usp=sharing",
        }
      },
      {
        id: "3",
        name: "拉菲草",
        desc: "农业和工业捆扎的标准选择。坚韧灵活的材料，适用于多种用途。",
        image: "/images/catalogo/img3.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1uAiR4uxO2iX_LsNFul6kXeb7jnnCEV_J/view?usp=sharing",
          en: "https://drive.google.com/file/d/10PV-sxexE8UkFSOhdTJBe1xWCy_tdFib/view?usp=sharing",
        }
      },
      {
        id: "4",
        name: "网袋",
        desc: "最大通风性的开孔网状织物，适用于农业。适用于农产品包装和运输的多功能解决方案。",
        image: "/images/catalogo/img4.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1OQKGpnRCfA2yFdAlT6q7GczYua2FFFVU/view?usp=sharing",
          en: "https://drive.google.com/file/d/1wldGL6XuqH-Ruth9Y01-hkNnPlbg9SW5/view?usp=sharing",
        }
      },
      {
        id: "5",
        name: "编织袋",
        desc: "用于大批量包装的平织聚丙烯。对散装产品具有卓越的承重能力。",
        image: "/images/catalogo/img5.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/16S43-PUrQECO9q2J1fOgbN-YeIxQ2GhP/view?usp=sharing",
          en: "https://drive.google.com/file/d/1fkZvAWTT3mnBkxQ0Gbb2kRgOoN2dJZiK/view?usp=sharing",
        }
      },
      {
        id: "6",
        name: "护角",
        desc: "托盘的结构保护和稳定性。物流和货物存储中不可或缺的加固工具。",
        image: "/images/catalogo/img6.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/181Hvr0HQffLU3rmcXkccYoqj-Y_A-gxr/view?usp=sharing",
          en: "https://drive.google.com/file/d/1DdcEavACvuY00oyMyC9rOWRybi9jnQrD/view?usp=sharing",
        }
      },
      {
        id: "7",
        name: "软包装",
        desc: "高阻隔薄膜和专业复合膜。为食品和工业产品提供最佳保护。",
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
      division: "缠绕膜",
      descripcion: "高光学清晰度和质量标准的拉伸薄膜。确保货物完整性和成本效益。我们的产品线包括生物降解选项，配方可加快 90% 的降解速度。",
      slug: "stretch-film",
      video: "carrusel/stretch-film.mp4"
    },
    {
      img: "carrusel/img4.webp",
      division: "网袋",
      descripcion: "高强度耐用圆织聚丙烯拉菲草网袋。透气设计，非常适合水果和蔬菜。",
      slug: "arpillas",
      video: "carrusel/arpillas.mp4"
    },
    {
      img: "carrusel/img2.webp",
      division: "绳索",
      descripcion: "高性能聚丙烯长丝绳索（PP）。完美平衡：极轻而不牺牲断裂强度。",
      slug: "cuerdas",
      video: "carrusel/cuerdas.mp4"
    },
    {
      img: "carrusel/img3.webp",
      division: "拉菲草",
      descripcion: "高性能聚丙烯薄膜拉菲草（PP）。重量轻，断裂强度高。柔韧多用途。",
      slug: "rafias",
      video: "carrusel/rafia.mp4"
    },
    {
      img: "carrusel/img5.webp",
      division: "编织袋",
      descripcion: "优质拉菲草编织袋。适用于食品、化工品和肥料的坚固包装解决方案。",
      slug: "sacos",
      video: "carrusel/sacos.mp4"
    },
    {
      img: "carrusel/img6.webp",
      division: "护角",
      descripcion: "优化物流的纸板护角。结构强度更高，货物稳定性更好。",
      slug: "esquineros",
      video: "carrusel/esquineros.mp4"
    },
    {
      img: "carrusel/img7.webp",
      division: "软包装",
      descripcion: "Neo Empaques International 专注于先进的软包装解决方案，旨在优化多个行业产品的保存和展示。",
      slug: "empaques-flexibles",
      video: "carrusel/bobina-impresa.mp4"
    }
  ],

  // =================================================
  // 页面：缠绕膜（拉伸薄膜）
  // =================================================
  stretch_film: {
    meta_title: "拉伸薄膜 | Grupo Ortiz",
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
        name: '高级缠绕膜',
        img: '/images/stretch/premium.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "专为高要求机械设计，这款中等拉伸的缠绕膜为自动化流程中的货物固定提供高效可靠的解决方案。其配方保证了在要求苛刻的包装应用中的高强度和卓越性能。",
        specs_values: { width: "19-30 英寸", length: "1000-15000 英尺", gauge: "40-110", weight: "10-40 公斤", type: "手动" },
        gallery: [
          '/images/stretch/premium2.png',
          '/images/stretch/premium.png',
          '/images/stretch/premium3.png'
        ]
      },
      {
        name: '自动缠绕膜',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "专为传统裹包机设计，这款缠绕膜在自动托盘包装流程中提供高性能和卓越表现。其配方保证货物固定的强度和稳定性。",
        specs_values: { width: "18-30 英寸", length: "2000-15000 英尺", gauge: "50-110", weight: "10-49 公斤", type: "自动" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      },
      {
        name: '手动预拉伸膜',
        img: '/images/stretch/prestirado.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "专为高性能手动应用设计，这款预拉伸膜以市场上最薄的厚度之一著称。其技术消除了包裹时施加额外力量的需要，便于即时使用并提高托盘包装流程的效率。",
        specs_values: { width: "16-17 英寸", length: "7000-25000 英尺", gauge: "40-120", weight: "10-40 公斤", type: "手动" },
        gallery: [
          '/images/stretch/prestirado2.png',
          '/images/stretch/prestirado.png',
          '/images/stretch/prestirado3.png'
        ]
      },
      {
        name: '手动捆扎膜',
        img: '/images/stretch/banding.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "专为中等拉伸手动包裹应用设计，这款传统缠绕膜在包装和货物固定流程中表现出色。其配方保证在一般应用中的强度和稳定性。",
        specs_values: { width: "3-12 英寸", length: "7000-25000 英尺", gauge: "40-120", weight: "10-40 公斤", type: "手动" },
        gallery: [
          '/images/stretch/banding3.png',
          '/images/stretch/banding.png',
          '/images/stretch/banding2.png'
        ]
      },
      {
        name: '无芯缠绕膜',
        img: '/images/stretch/coreles.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "无纸芯缠绕膜，旨在最大限度地利用材料并减少托盘包装过程中的废料。其多层结构提供高抗撕裂性、良好延伸性和牢固的货物固定，适用于手动和半自动应用。",
        specs_values: {
          width: "18-20 英寸",
          length: "1000-2000 英尺",
          gauge: "60-80",
          weight: "3-10 公斤",
          type: "手动 / 半自动"
        },
        gallery: [
          '/images/stretch/coreles2.png',
          '/images/stretch/coreles.png',
          '/images/stretch/coreles3.png'
        ]
      },
      {
        name: '手动硬质缠绕膜',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "专为有限拉伸手动包裹应用设计，这款缠绕膜在包装流程中提供高性能和极高可靠性。其配方保证货物固定的稳定性和效率。",
        specs_values: { width: "17-30 英寸", length: "1000-15000 英尺", gauge: "40-90", weight: "10-40 公斤", type: "手动", color: "黑色/彩色" },
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
      mat: "材料",
      weight: "重量",
      resist: "强度",
      charge: "规格"
    },

    products: [
      {
        name: '五金绳',
        img: '/images/cuerdas/CuerdaT1.webp',
        video: "/videos/cuerdas/cuerda-1.mp4",
        link: '#',
        description: "采用聚丙烯和先进紫外线过滤器制成，这款绳索非常适合高阳光暴露的活动。其专业配方延缓自然磨损并延长使用寿命，在户外环境中保证更强的耐久性。是五金绳的完美选择，在一般应用和要求苛刻的工作中提供稳固、安全和可靠的性能。",
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
        description: "采用聚丙烯（PP）和紫外线稳定剂制成，这款绳索非常适合海洋行业和高阳光暴露的活动。其专业配方延缓紫外线辐射造成的磨损，延长使用寿命并保证更强的耐候性。是为农业大棚提供稳固性和稳定性的完美解决方案。",
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
        description: "采用优质聚丙烯（PP）制造，这款绳索提供多种规格、粗细和颜色，有光面或组合版本，带加强或带标记版本。其多功能性和耐久性使其成为多种应用的可靠选择，适用于工业、工厂、仓库、批发市场、五金店和加工区域。",
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
      yield: "米数",
      resist: "强度（公斤）",
      usage: "材料"
    },

    products: [
      {
        name: "捆扎拉菲草",
        description: "采用 100% 原生聚丙烯制造，这款拉菲草提供高强度和出色性能，即使在户外条件下也能保持其物理特性。其质量保证了在要求苛刻的应用中的耐久性和可靠性。广泛应用于农业、禽类养殖和园艺行业。",
        img: "/images/rafias/atar.png",
        video: "/videos/rafia/fondoN.mp4",
        specs_values: {
          cal: "2-8 毫米",
          yield: "90 公斤",
          resist: "60-320 磅",
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
        description: "采用优质聚丙烯制造，这款拉菲草提供出色的强度，即使在户外条件下也能保持其物理特性。其可靠的性能使其成为农业、禽类养殖和园艺应用的理想选择。",
        img: "/images/rafias/Eco.png",
        video: "/videos/rafia/fondoE.mp4",
        specs_values: {
          cal: "2-8",
          yield: "90-500 公斤",
          resist: "59-255 磅",
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
        description: "采用优质聚丙烯制造，这款拉菲草提供高强度，即使在户外条件下也能保持其物理特性。其出色的性能使其非常适合工业、五金和包装应用，以及农业、禽类养殖和园艺行业。",
        img: "/images/rafias/negra.png",
        video: "/videos/rafia/fondoR.mp4",
        specs_values: {
          cal: "2-8",
          yield: "90-500 公斤",
          resist: "59-255 磅",
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
        description: "采用 100% 原生聚丙烯和拉菲草结构制造，这款网袋在包装和存储应用中提供高强度和出色性能。其质量保证了处理各种产品时的耐久性和可靠性。",
        specs_values: {
          sizes: "23-70 厘米",
          colors: "4 种",
          features: "束口"
        },
        gallery: [
          '/images/arpillas/circular2.png',
          '/images/arpillas/arpilla.webp',
          '/images/arpillas/circular3.png'
        ]
      },
      {
        name: '圆织单丝网袋',
        img: '/images/arpillas/arpilla2.webp',
        video: "/videos/arpilla/mono.mp4",
        link: '#',
        description: "采用 100% 原生聚丙烯和拉菲草/单丝结构制造，这款网袋在包装和存储应用中提供高强度和出色性能。其结构为各种产品的处理和保护提供耐久性和可靠性。",
        specs_values: {
          construction: "单丝",
          sizes: "23-70 厘米",
          colors: "2 种",
          features: "束口"
        },
        gallery: [
          '/images/arpillas/mono2.png',
          '/images/arpillas/arpilla2.webp',
          '/images/arpillas/mono3.png'
        ]
      },
      {
        name: '侧缝网袋',
        img: '/images/arpillas/arpilla3.webp',
        video: "/videos/arpilla/costura.mp4",
        link: '#',
        description: "采用 100% 原生聚丙烯和拉菲草/单丝结构制造，这款网袋在包装和存储应用中提供高强度和卓越性能。其结构保证了处理不同产品时的耐久性和可靠性。",
        specs_values: {
          type: "侧面",
          construction: "单丝",
          sizes: "23-60 厘米",
          colors: "4 种",
          features: "加固"
        },
        gallery: [
          '/images/arpillas/lateral1.png',
          '/images/arpillas/arpilla3.webp',
          '/images/arpillas/lateral3.png'
        ]
      },
      {
        name: '覆膜标签网袋',
        img: '/images/arpillas/arpilla4.webp',
        video: "/videos/arpilla/etiqueta.mp4",
        link: '#',
        description: "采用 100% 原生聚丙烯和拉菲草/拉菲草结构制造，这款网袋在包装和存储过程中提供高强度和卓越性能。其编织保证了国内外市场苛刻应用的耐久性和可靠性。",
        specs_values: {
          type: "覆膜",
          construction: "拉菲草",
          sizes: "23-70 厘米",
          colors: "4 种",
          features: "束口"
        },
        gallery: [
          '/images/arpillas/laminado1.png',
          '/images/arpillas/arpilla4.webp',
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
        name: '非覆膜拉菲草编织袋',
        img: '/images/sacos/saco2.png',
        model: '/models/saco_blanco.glb',
        video: "/videos/saco/slaminar.mp4",
        link: '#',
        description: "由交织聚丙烯纱线制成，非覆膜拉菲草编织袋在包装和存储应用中提供高强度和出色耐久性。其结构能够承受重载而不会破裂，在繁重工作中保证可靠性能。",
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
        description: "由聚丙烯纱线制成并具有透明外观，这些袋子提供高强度并可清晰看到装袋产品。其结构保证了在存储和运输应用中的耐久性和可靠性。",
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
        description: "由生产过程中的边角料回收材料制成，这些袋子以更实惠的成本提供强度和良好的耐久性。其制造允许在一般包装和存储应用中实现可靠性能。",
        specs_values: {
          load: "45-80 公斤",
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
        name: "牛皮纸护角",
        description: "专为在运输和存储过程中保护边缘和角落而设计，这款护角均匀分配压力，防止货物变形和损坏。其结构在要求苛刻的包装应用中提供强度和稳定性。",
        img: "/images/esquinero/esquinero.png",
        video: "/videos/esquinero/esquinero.mp4",
        link: "#",
        specs_values: {
          tab:    "1.5 英寸",
          thick:  "0.08 毫米",
          length: "11.81 厘米"
        },
        gallery: [
          '/images/esquinero/esquinero2.png',
          '/images/esquinero/esquinero.png',
          '/images/esquinero/esquinero3.png'
        ]
      },
      {
        name: "白色牛皮纸护角",
        description: "专为在运输和存储过程中保护边缘和角落而设计，这款护角均匀分配压力，防止货物变形和损坏。其结构在要求苛刻的包装应用中提供强度和稳定性。",
        img: "/images/esquinero/esquinerob.png",
        video: "/videos/esquinero/esquinero.mp4",
        link: "#",
        specs_values: {
          tab:    "1.5 英寸",
          thick:  "0.08 毫米",
          length: "11.81 厘米"
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
      lamination: "复合",
      finish:     "表面处理",
      size:       "最大尺寸",
      zipper:     "拉链",
      type:       "类型"
    },

    products: [
      {
        name: "印刷卷材",
        description: "我们的卷材提供多种复合方式、厚度和表面处理。可选择最多 10 色印刷，133 线/英寸。最大展开：1,140 毫米。最大印刷宽度：1,450 毫米。与自动包装机械兼容，优化生产效率。",
        img: "/images/flexible/bobina-impresa.png",
        video: "/videos/flexible/bobinaf.mp4",
        gallery: [
          "/images/flexible/bobina-impresa-1.png",
          "/images/flexible/bobina-impresa.png",
          "/images/flexible/bobina-impresa-3.png"
        ],
        specs_values: {
          lamination: "3 种类型",
          finish:     "多样",
          size:       "1,450 毫米",
          zipper:     "不适用",
          type:       "卷材"
        }
      },
      {
        name: "自立袋",
        description: "多功能自立袋，具有复合结构和高阻湿氧性能。适用于干湿食品、粉末、液体、化妆品和化工品。提供天然、哑光和镀铝表面处理，尺寸从 150 克至 1 公斤，可选拉链封口和视窗。",
        img: "/images/flexible/standup-generica.png",
        video: "/videos/flexible/standup.mp4",
        gallery: [
          "/images/flexible/standup-generica-2.png",
          "/images/flexible/standup-generica.png",
          "/images/flexible/standup-generica-3.png"
        ],
        specs_values: {
          lamination: "复合",
          finish:     "3 种类型",
          size:       "1 公斤",
          zipper:     "有 / 无",
          type:       "袋子"
        }
      },
      {
        name: "印花自立袋",
        description: "具有吸引人装饰图案的袋子系列：红果、花卉、水果、麦穗、蓝色礼品和粉色礼品。拉链封口、坚固结构和天然或镀铝表面处理。尺寸从 150 克至 1 公斤。适合寻求高质量和视觉吸引力包装的用户。",
        img: "/images/flexible/standup-origanics.png",
        video: "/videos/flexible/standup-origanics.mp4",
        gallery: [
          "/images/flexible/standup-origanics-2.png",
          "/images/flexible/standup-origanics.png",
          "/images/flexible/standup-origanics-3.png"
        ],
        specs_values: {
          lamination: "2 种类型",
          finish:     "礼品",
          size:       "1 公斤",
          zipper:     "有",
          type:       "印花袋"
        }
      },
      {
        name: "高真空袋",
        description: "专为最大限度保持肉类、奶酪、熟食和新鲜产品的新鲜度和保质期而设计。其密封排除空气，保留产品的天然特性，防止风味、口感和质量损失。由高强度阻隔材料制成。",
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
    meta_title: "经销商 Grupo Ortiz | 官方合作伙伴",
    hero: {
      subtitle: "批发商门户",
      title: "倍增 <br>您的<span>利润</span>",
      desc: "在领先制造商的支持下分销高需求产品。有保障的库存、无中间商和 24 小时物流。",
      cta: "立即开始"
    },
    cards: [
      { icon: "ri-stack-line",        title: "全量库存",   desc: "即时满足大订单的能力。让您的仓库始终充足。" },
      { icon: "ri-truck-line",        title: "24小时配送", desc: "自有物流。您的客户无需等待，我们以创纪录的时间交付。" },
      { icon: "ri-shield-check-line", title: "质量保证",   desc: "无繁文缛节的实物退换。全方位品牌支持。" },
      { icon: "ri-line-chart-line",   title: "最佳利润",   desc: "直接出厂价格，旨在最大化您的净利润。" }
    ],
    stats: [
      { val: 25, symbol: "千", label: "月产量（吨）" },
      { val: 35, symbol: "+", label: "年历史"       },
      { val: 15, symbol: "百万", label: "总销售额"  }
    ],
    form: {
      title: "注册 <br>申请",
      desc: "加入网络。填写您的资料，以分配区域和优惠价格列表。",
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
      title_white:   "我们的",
      title_orange:  "发展历程",
      nav_prev:      "上一个",
      nav_next:      "下一个",
      video_bg:      "/videos/background.mp4",
      video_bg_webm: "",
      video_poster:  "",
      events: [
        { year: "1959", title: "初创",         short: "在莫雷利亚创立", img: "/images/tiempo/timeline-1959.webp", description: "自 1959 年起，Grupo Ortiz 参与了墨西哥的工业发展。由 Nicandro Ortiz 在莫雷利亚创立，集团秉持坚定愿景：将尖端技术与员工的才华和奉献精神相结合，打造一家稳固、创新且致力于质量的企业。" },
        { year: "1970", title: "工业扩张",     short: "编织袋和网袋",   img: "/images/tiempo/timeline-1970.webp", description: "1970 年，我们开始生产聚丙烯编织袋和网袋，标志着我们工业增长的关键阶段。这一战略步骤增强了我们的运营能力，扩大了我们的商业参与，并巩固了我们在国内市场的地位。" },
        { year: "1985", title: "技术创新",     short: "欧洲机械",       img: "/images/tiempo/timeline-1985.webp", description: "1985 年，我们引进最先进的欧洲机械，强化了我们的工业基础设施，优化了生产流程。这一战略投资提高了我们的质量标准，提升了运营效率，并重申了我们对技术创新的承诺。" },
        { year: "1995", title: "多元化",       short: "新产品线",       img: "/images/tiempo/timeline-1995.webp", description: "1995 年，我们通过引入缠绕膜、软包装和工业专用产品扩大了生产线。这一战略扩张使我们的产品组合多元化，增强了我们在行业中的竞争力，并使我们能够满足国内市场的新需求。" },
        { year: "2005", title: "国际扩张",     short: "美洲和欧洲",     img: "/images/tiempo/timeline-2005.webp", description: "2005 年，我们开始向美洲和欧洲出口，标志着我们国际扩张迈出了决定性的一步。这一成就将公司定位为塑料聚合物行业的标杆，加强了我们的全球存在，并巩固了我们在国际市场的竞争力。" },
        { year: "2015", title: "可持续发展",   short: "回收工厂",       img: "/images/tiempo/timeline-2015.webp", description: "2015 年，我们建立了回收工厂并加强了可持续发展项目，重申了我们对环境的承诺。这一战略举措优化了资源利用，推动了负责任的做法，并巩固了我们的可持续增长愿景。" },
        { year: "2026", title: "现在",         short: "工业领袖",       img: "/images/tiempo/timeline-2026.webp", description: "2026 年，我们拥有 17 个生产工厂、4,000 多名员工和 220,000 吨的年产能。这种持续增长巩固了我们作为塑料行业领袖的地位，得益于坚实的基础设施、专业的人才和面向未来的战略愿景。" }
      ]
    },

    filosofia: {
      label: "我们的原则",
      title: "GO 理念",
      img:   "/images/about/GO.webp",
      items: [
        "对客户满意度的执着，而非对竞争的执着。",
        "对持续发明和创新的热情。",
        "每个流程的卓越运营。",
        "以即时成果为导向的长远思考。",
        "成为全球最佳雇主和最安全的工作场所。"
      ]
    },

    vision: {
      label: "我们的方向",
      title: "愿景",
      img:   "/images/about/GO2.webp",
      items: [
        "成为全球最以客户为中心的公司。",
        "为任何业务提供全面的综合解决方案。",
        "成为全球任何企业的唯一包装解决方案。",
        "在保持人文关怀的同时实现全球扩张。"
      ]
    },

    infraestructura: {
      title_white:  "强大的",
      title_orange: "基础设施支撑",
      stats: [
        { number: "13",     label: "生产工厂",   desc: "战略性布局的设施，服务国内外市场。", icon: "number" },
        { number: "+3,000", label: "员工",       desc: "推动每个生产流程的专业团队。", icon: "number" },
        { number: "260",    label: "物流车辆",   desc: "自有车队，保证高效配送和安全交付，覆盖国内外。", icon: "number" },
        { number: "全球",   label: "国际影响力", desc: "在美洲和欧洲进行出口和分销。", icon: "globe" }
      ]
    },

    plantas: {
      title:           "我们的工厂",
      subtitle:        "13 个生产工厂",
      map_img:         "/images/about/mexico_map.png",
      layer_michoacan: "/images/about/michoacan_layer.png",
      layer_monterrey: "/images/about/monterrey_layer.png",
      layer_both:      "/images/about/both_states_layer.png",
      locations: [
        { key: "monterrey", number: "1 个工厂",  badge: "新莱昂州蒙特雷" },
        { key: "michoacan", number: "12 个工厂", badge: "米却肯州莫雷利亚" }
      ]
    },

    instalaciones: {
      title_white:  "我们的",
      title_orange: "设施",
      subtitle:     "360° 虚拟参观",
      badge_soon:   "即将推出",
      badge_tour:   "查看参观",
      btn_tour:     "查看3D参观",
      btn_soon:     "即将推出",
      items: [
        { id: "extrusoras", num: "01", title: "缠绕膜",     tag: "米却肯州莫雷利亚", desc: "高产能挤出线，聚丙烯在此被转化为精密扁丝。",                     thumb: "/images/virtual/RT.webp", link: "https://my.matterport.com/show/?m=YoM2tyXMeyb&ss=2&sr=2.97,.12&play=1&qs=1&ts=1", soon: true  },
        { id: "telares",    num: "02", title: "网袋",       tag: "米却肯州莫雷利亚", desc: "最新一代织机，以最高均匀性将丝线编织成聚丙烯布。",               thumb: "/images/virtual/RA.webp", link: "https://my.matterport.com/show/?m=2xCe1VajMjj&ss=1&sr=2.28,-1.47&play=1&qs=1&ts=1", soon: false },
        { id: "laminado",   num: "03", title: "覆膜和印刷", tag: "米却肯州莫雷利亚", desc: "覆膜和柔版印刷区，编织袋在此接受表面处理、印刷和最终质量处理。", thumb: "/images/virtual/RS.webp", link: "", soon: true  },
        { id: "reciclado",  num: "04", title: "回收工厂",   tag: "米却肯州莫雷利亚", desc: "我们的聚丙烯回收中心，致力于循环经济和环境保护。",               link: "", soon: true  }
      ]
    },

    capacidad: {
      title:         "装机容量",
      subtitle:      "高性能基础设施",
      planta_label:  "工厂",
      plantas_label: "工厂",
      items: [
        { num: "04", label: "编织袋",   width: 100, delay: 0   },
        { num: "02", label: "网袋",     width: 50,  delay: 100 },
        { num: "01", label: "绳索",     width: 25,  delay: 200 },
        { num: "03", label: "缠绕膜",   width: 50,  delay: 300 },
        { num: "01", label: "软包装",   width: 25,  delay: 400 },
        { num: "01", label: "回收",     width: 25,  delay: 500 },
        { num: "03", label: "护角",     width: 75,  delay: 600 },
        { num: "01", label: "货运",     width: 25,  delay: 700 },
        { num: "01", label: "一次性用品", width: 25, delay: 800 },
        { num: "01", label: "袋子",     width: 25,  delay: 900 }
      ]
    },

    valores: {
      title:    "我们的价值观",
      subtitle: "我们文化的支柱",
      items: [
        { title: "责任",   description: "我们以道德和专业精神履行承诺，意识到我们的行动对客户、员工和社区的影响。" },
        { title: "信任",   description: "我们建立基于透明、诚信和履行承诺的坚固关系，在每次互动中产生安全感。"     },
        { title: "热情",   description: "我们热爱我们所做的事，并在每个产品、流程和创新中体现这一点，以真诚的热情推动卓越。" },
        { title: "坚韧",   description: "我们以决心和恒心面对挑战，坚定不移地朝着目标前进，直到取得卓越成果。"     },
        { title: "纪律",   description: "我们遵循严格的流程和有序方法的质量标准，保证每次交付的一致性和卓越性。"   },
        { title: "主动性", description: "我们预见需求并在问题出现之前采取行动，创造持续创造价值的创新解决方案。"   },
        { title: "尊重",   description: "我们重视每个人的多样性、尊严和贡献，促进合作、包容和公平待遇的环境。"     }
      ]
    }
  },

// =================================================
// FOOTER
// =================================================
footer: {
  about_us:         "關於我們",
  about:            "公司簡介",
  social_impact:    "社會影響",
  customer_service: "客戶服務",
  be_distributor:   "成為經銷商",
  catalog:          "產品目錄",
  cta_button:       "我想成為經銷商",
  rights:           "版權所有。",

  // 聯絡資訊 — 墨西哥
  region_mexico:    "墨西哥",
  email:            "atencionacliente@grupo-ortiz.com",
  phone_mx:         "+52 (443) 207-2593",

  // 聯絡資訊 — 美國
  region_usa:       "美國",
  phone_us:         "+1 (210) 429-3789",

  // 美國地址
  label_warehouse:  "倉庫",
  address_warehouse: "20915 Wilderness Oak, San Antonio TX 78258",

  label_office:     "辦公室",
  address_office:   "San Antonio, TX 78258",
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
      subtitle:         "我们支持家庭、赋权女性、给予第二次机会并爱护地球。我们迈出的每一步都旨在改变生活，构建充满希望的未来。",
      stat_female:      "% 女性员工",
      stat_recycled:    "回收吨数",
      stat_initiatives: "活跃举措",
      video:            "/videos/waves2.mp4",
    },
    ods: {
      title:       "我们的指引",
      subtitle:    "2030 年议程",
      description: "我们以联合国可持续发展目标为指导，共同构建一个更公正、更繁荣、更可持续的世界。",
      cards: [
        { n: 1,  title: "消除贫困",       link: "https://sdgs.un.org/es/goals/goal1",  img: "/images/odc/1.png"  },
        { n: 2,  title: "零饥饿",         link: "https://sdgs.un.org/es/goals/goal2",  img: "/images/odc/2.png"  },
        { n: 3,  title: "良好健康与福祉", link: "https://sdgs.un.org/es/goals/goal3",  img: "/images/odc/3.png"  },
        { n: 4,  title: "优质教育",       link: "https://sdgs.un.org/es/goals/goal4",  img: "/images/odc/4.png"  },
        { n: 5,  title: "性别平等",       link: "https://sdgs.un.org/es/goals/goal5",  img: "/images/odc/5.png"  },
        { n: 6,  title: "清洁饮水",       link: "https://sdgs.un.org/es/goals/goal6",  img: "/images/odc/6.png"  },
        { n: 7,  title: "廉价清洁能源",   link: "https://sdgs.un.org/es/goals/goal7",  img: "/images/odc/7.png"  },
        { n: 8,  title: "体面工作",       link: "https://sdgs.un.org/es/goals/goal8",  img: "/images/odc/8.png"  },
        { n: 9,  title: "产业创新与基础设施", link: "https://sdgs.un.org/es/goals/goal9", img: "/images/odc/9.png" },
        { n: 10, title: "减少不平等",     link: "https://sdgs.un.org/es/goals/goal10", img: "/images/odc/10.png" },
        { n: 11, title: "可持续城市",     link: "https://sdgs.un.org/es/goals/goal11", img: "/images/odc/11.png" },
        { n: 12, title: "负责任的消费",   link: "https://sdgs.un.org/es/goals/goal12", img: "/images/odc/12.png" },
        { n: 13, title: "气候行动",       link: "https://sdgs.un.org/es/goals/goal13", img: "/images/odc/13.png" },
        { n: 14, title: "水下生命",       link: "https://sdgs.un.org/es/goals/goal14", img: "/images/odc/14.png" },
        { n: 15, title: "陆地生命",       link: "https://sdgs.un.org/es/goals/goal15", img: "/images/odc/15.png" },
        { n: 16, title: "和平、正义与强大机构", link: "https://sdgs.un.org/es/goals/goal16", img: "/images/odc/16.png" },
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
          title: "大地之产",
          desc:  "开发创新环保材料用于软包装，尊重环境并减少碳足迹。",
          img:   "/images/impacto/products.webp"
        },
        {
          label: "支柱 02",
          title: "大地之践",
          desc:  "在所有生产流程中实现清洁制造和循环经济，关闭循环并消除废料。",
          img:   "/images/impacto/practices.webp"
        },
        {
          label: "支柱 03",
          title: "社会大地",
          desc:  "对客户、员工和社区的全面承诺，创造积极的社会影响和实际机会。",
          img:   "/images/impacto/social.webp"
        }
      ]
    },

    oceanos: {
      hero_title:           "致力于为我们的海洋",
      hero_title_highlight: "创造更清洁的未来",
      hero_video:           "/videos/waves.mp4",
      intro: "在 Grupo Ortiz，我们相信一个海洋再次闪耀的世界。通过支持 The Ocean Cleanup 和由 Lonely Whale 支持的 Tom Ford 塑料创新奖等全球倡议，我们致力于减少海洋中的塑料。您对我们的每一次购买都是迈向更清洁星球和所有人可持续未来的一步。让我们共同拯救海洋！",
      features: [
        { title: "支持全球清洁",     desc: "与 The Ocean Cleanup 等倡议合作。"           },
        { title: "促进可持续创新",   desc: "通过 Tom Ford 塑料创新奖等项目。"             },
        { title: "推动负责任产品",   desc: "减少对海洋的环境影响。"                       },
        { title: "激励集体行动",     desc: "邀请客户和合作伙伴成为变革的一部分。"         }
      ],
      partners: [
        {
          title:  "Tom Ford 创新",
          desc:   "这一全球倡议旨在通过奖励和推广创新解决方案来替代一次性塑料，从而彻底改变塑料行业。其重点是可持续和可扩展的替代品，以减少环境影响、保护海洋并推动向对地球更负责任的材料转变。",
          btn:    "了解更多",
          link:   "https://unwrapthefuture.org/",
          video:  "/videos/impacto/oceancleanup.mp4",
          poster: "/images/impacto/cultura-calidad.jpg"
        },
        {
          title:  "海洋清洁",
          desc:   "致力于清洁世界海洋，这个组织开发先进技术，清除海洋中积累的塑料，并通过干预主要污染来源——河流——防止其进入。其使命是恢复海洋生态系统的健康，保护生物多样性并为后代确保清洁的未来。",
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
      title:    "改变生活的举措",
      subtitle: "持久积极的影响",
      items: [
        {
          num: "01", title: "希望之家",
          desc:       "支持米却肯州塔坎巴罗的儿童之家。每个孩子都值得拥有一个充满爱的家园。",
          desc_short: "支持米却肯州塔坎巴罗的儿童之家。",
          img:        "/images/impacto/hogar.mp4",
          isVideo:    true,
          poster:     "/images/impacto/hogar.mp4"
        },
        {
          num: "02", title: "GO 食品篮",
          desc:       "团结社区。带着爱心发放食品篮。",
          desc_short: "带着爱心向社区发放食品篮。",
          img:        "/images/impacto/despensas.webp",
          isVideo:    false
        },
        {
          num: "03", title: "零足迹",
          desc:       "零废料政策。将废物转化为机遇。",
          desc_short: "零废料政策。转化废物。",
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
          num: "05", title: "GO 闪耀",
          desc:       "为 GO 团队提供绩效奖励。表彰努力。",
          desc_short: "表彰 GO 团队的绩效。",
          img:        "/images/impacto/woman.webp",
          isVideo:    false
        },
        {
          num: "06", title: "领袖之手",
          desc:       "84% 女性员工队伍。赋权女性领袖。",
          desc_short: "56.82% 女性员工。赋权领袖。",
          img:        "/images/impacto/bio.webp",
          isVideo:    false
        }
      ]
    },

    cta: {
      title:        "携手",
      title_orange: "共同转变",
      desc:         "我们是您的企业实现技术、经验和成果驱动增长所需的战略合作伙伴。",
      contact:      "联系我们",
      products:     "查看产品"
    }
  },

  // =================================================
  // 页面：首页
  // =================================================
  home: {
    meta_title: "Grupo Ortiz | 墨西哥聚合物与包装制造商",
    meta_description: "65 年以上生产缠绕膜、编织袋、绳索、拉菲草、网袋和软包装。墨西哥和拉丁美洲塑料聚合物领导者。",
    hero: {
      eyebrow:      "自 1959 年",
      title_top:    "我们是拉丁美洲",
      title_bot:    "主要制造商",
      video: "home_zv3jjz",
      subtitle:     "65 年以上为五大洲的行业制造高工程解决方案。",
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
        { title: "网袋",       tag: "部门 01", description: "平织和圆织聚丙烯拉菲草网袋。透气设计，非常适合水果、蔬菜和农产品。",               img: "/images/divisiones/arpilla.webp",        color: "#2d8a4e", slug: "arpillas",           soon: false },
        { title: "绳索",       tag: "部门 02", description: "用于农业、工业和海洋的高韧度聚丙烯绳索。高耐候性和内置紫外线过滤器。",             img: "/images/divisiones/cuerdas.webp",        color: "#1a5f8a", slug: "cuerdas",            soon: false },
        { title: "拉菲草",     tag: "部门 03", description: "高性能聚丙烯拉菲草。重量轻、高断裂强度，适用于农业、禽类养殖和园艺的多用途。",     img: "/images/divisiones/rafia.webp",          color: "#8a6d2d", slug: "rafias",             soon: false },
        { title: "软包装",     tag: "部门 04", description: "高阻隔薄膜和专业复合膜。采用前沿技术为食品和工业产品提供最佳保护。",               img: "/images/divisiones/bolsa.webp",          color: "#0d7377", slug: "empaques-flexibles", soon: false },
        { title: "编织袋",     tag: "部门 05", description: "优质拉菲草编织袋。适用于食品、化工品、化肥和散装产品的坚固包装解决方案。",         img: "/images/divisiones/sacos.webp",          color: "#3a7d44", slug: "sacos",              soon: false },
        { title: "缠绕膜",     tag: "部门 06", description: "高光学清晰度的拉伸薄膜。以成本效益确保货物完整性。包含生物降解选项。",             img: "/images/divisiones/film-estirable.webp", color: "#2c5f8a", slug: "stretch-film",       soon: false },
        { title: "护角",       tag: "部门 07", description: "牛皮卡纸护角，保护存储和运输过程中的边缘。均匀分压，最大化货物稳定性。",           img: "/images/divisiones/esquineros.webp",     color: "#7b3fa0", slug: "esquineros",         soon: false },
        { title: "一次性用品", tag: "部门 10", description: "用于工业、食品和医疗的聚丙烯一次性产品。卫生、经济且高强度的解决方案。",           img: "/images/divisiones/desechables.webp",    color: "#e05500", slug: "desechables",        soon: true  }
      ]
    },

    porque: {
      tag:           "为何选择我们",
      title:         "65 年以上",
      title_em:      "的领导地位",
      body:          "我们是墨西哥和拉丁美洲塑料聚合物行业的标杆，拥有认证流程和全球响应能力。",
      btn:           "我们的历史",
      badge1_label:  "业务单元",
      badge1_number: 13,
      badge2_label:  "部门",
      badge2_number: 6,
      img:           "/images/home/planta-produccion.webp",
      features: [
        { title: "认证质量", description: "符合最高国际制造标准的产品。"     },
        { title: "持续创新", description: "持续投资研发，保持行业技术领先地位。" },
        { title: "全球覆盖", description: "在 5 大洲积极布局，拥有高效的配送网络。" }
      ]
    },

    certs: {
      tag:      "质量保证",
      title:    "我们的",
      title_em: "认证",
      items: [
        { code: "Kosher Pareve",     name: "KMD 墨西哥",     img: "/images/certificaciones/KOSHER.jpeg"   },
        { code: "FSSC 22000",        name: "LRQA 认证",      img: "/images/certificaciones/LRQA.png"      },
        { code: "AIB International", name: "自 1919 年起",   img: "/images/certificaciones/AIB.png"       },
        { code: "ISO 9001",          name: "必维国际检验局", img: "/images/certificaciones/CERTIFIED.png" }
      ]
    },

    compromiso: {
      card1: {
        eyebrow: "我们的方向",
        title:   "创新",
        text:    "我们投资于研发，以提供超越全球市场期望的前沿技术产品。"
      },
      card2: {
        eyebrow: "我们的承诺",
        title:   "可持续性",
        text:    "全链条负责任的环保流程、积极的回收计划和减少碳足迹。"
      }
    },

    global: {
      tag:      "全球影响力",
      title:    "我们向",
      title_em: "世界出口",
      desc:     "我们的产品远销 30 多个国家的客户，巩固了我们作为塑料聚合物领袖的地位。",
      video: "camion_n1nitn",
      stats: [
        { number: 65,   label: "年"   },
        { number: 30,   prefix: "+", label: "国家" },
        { number: 3000, prefix: "+", label: "员工" },
        { number: 5,    prefix: "",  label: "大洲" }
      ]
    },

    cta: {
      tag:      "准备好开始了吗？",
      title:    "携手",
      title_em: "合作",
      sub:      "探索我们的解决方案如何改变您的运营",
      btn:      "联系我们"
    }
  }

};