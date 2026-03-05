// src/i18n/ar.js

export const ar = {
  // =================================================
  // شريط التنقل
  // =================================================
  nav: {
    home: 'الرئيسية',
    products: 'المنتجات',
    catalog: 'الكتالوج',
    promos: 'العروض',
    about: 'من نحن',
    company: 'الشركة',
    social: 'الأثر الاجتماعي',
    distributor: 'الموزع',
    contact: 'اتصل بنا'
  },

  // =================================================
  // الصفحة الرئيسية / البطل
  // =================================================
  hero: {
    title: "مرحباً بكم",
    subtitle: "جودة تدوم"
  },

  // =================================================
  // نصوص عامة
  // =================================================
  common: {
    seeMore: "عرض المزيد",
    division: "قسم",
    buy: "شراء",
    redirecting: "جارٍ إعادة التوجيه...",
    download: "تحميل",
    language: "اللغة",
    scrollDown: "مرر للأسفل",
    previous: "السابق",
    next: "التالي"
  },

  // =================================================
  // روبوت المحادثة (BotGo)
  // =================================================
  chatbot: {
    greeting: 'مرحباً! أنا BotGo 🤖. كيف يمكنني مساعدتك اليوم؟',
    placeholder: 'اكتب رسالة...',
    listeningState: 'جارٍ الاستماع...',
    thinking: 'جارٍ التفكير...',
    errorMsg: 'خطأ في الاتصال.',
    salesBtn: 'طلب عرض سعر عبر واتساب',
    voiceAssistantTitle: 'المساعد الافتراضي',
    voiceCode: 'ar-SA',
    waStart: 'مرحباً Grupo Ortiz، أود الحصول على عرض سعر',
    pdfBtn: 'عرض كتالوج PDF',
  },

  // =================================================
  // صفحة العروض الترويجية
  // =================================================
  promociones: {
    meta_title: "العروض | Grupo Ortiz",
    hero: {
      label: "عروض خاصة",
      title: "العروض الترويجية",
      subtitle: "استفد من عروضنا المحدودة",
      validity: "ساري حتى نفاد الكمية*"
    },
    discount_badge: "حتى",
    off_text: "خصم",
    original_price: "السعر السابق",
    promo_price: "السعر الخاص",
    buy_button: "طلب عرض سعر",
    contact_cta: "تواصل مع مستشار للمزيد من المعلومات",
    valid_until: "ساري حتى نفاد الكمية*",

    products: [
      {
        id: "promo-stretch",
        name: "فيلم التغليف المطاط",
        subtitle: "$33 للكيلو في فيلم التغليف الملون",
        image: "/images/stretch/manual.webp",
        discount: 35,
        originalPrice: "",
        promoPrice: "$33/كجم",
        features: [
          "فيلم قابل للتمدد ملون",
          "سعر خاص للكيلوغرام",
          "كمية محدودة",
          "متوفر بعدة ألوان"
        ],
        validUntil: "ساري حتى نفاد الكمية*"
      },
      {
        id: "promo-cuerda",
        name: "حبل",
        subtitle: "$33 للكيلو",
        image: "/images/cuerdas/CuerdaT1.webp",
        discount: 25,
        originalPrice: "",
        promoPrice: "$33/كجم",
        features: [
          "حبل عالي الجودة",
          "سعر خاص للكيلوغرام",
          "عرض لفترة محدودة",
          "التوفر حسب المخزون"
        ],
        validUntil: "ساري حتى نفاد الكمية*"
      }
    ]
  },

  // =================================================
  // صفحة الكتالوج
  // =================================================
  catalog: {
    hero: {
      label: "الوثائق",
      title: "الكتالوج العام",
      description: "الجودة والحلول المتكاملة في وثيقة واحدة. اختر لغتك المفضلة للحصول على عرضنا المؤسسي.",
      scrollText: "عرض الأقسام"
    },
    carousel: {
      label: "التحميلات المتاحة",
      title: "الكتالوج حسب القسم",
    },
    languageLabel: "Language / اللغة",
    downloadButton: "تحميل PDF",
    divisions: [
      {
        id: "1",
        name: "فيلم التغليف المطاط",
        desc: "فيلم مطاط لتأمين وحماية الأحمال. حل فعال للتغليف على المنصات والنقل الآمن.",
        image: "/images/catalogo/img1.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1HYGcpgkRO_7OX22IcWvRpzpLZKgpYV3A/view?usp=sharing",
          en: "https://drive.google.com/file/d/1QZ6jmKyc-CGLwh9brbeZSQ5OOzkKdBCQ/view?usp=sharing",
        }
      },
      {
        id: "2",
        name: "حبل",
        desc: "مقاومة ومتانة للربط الصناعي والبحري. مصنوعة من مواد عالية الجودة للاستخدام المكثف.",
        image: "/images/catalogo/img2.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/14GrV9P1ViQKvFp3BucYjgmryRgWKLEZh/view?usp=sharing",
          en: "https://drive.google.com/file/d/19Tvd_VHjogSE7y7cLZYr4ra__4vB4nOm/view?usp=sharing",
        }
      },
      {
        id: "3",
        name: "رافيا",
        desc: "المعيار في الربط للزراعة والصناعة. مادة مقاومة ومرنة لتطبيقات متعددة.",
        image: "/images/catalogo/img3.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1uAiR4uxO2iX_LsNFul6kXeb7jnnCEV_J/view?usp=sharing",
          en: "https://drive.google.com/file/d/10PV-sxexE8UkFSOhdTJBe1xWCy_tdFib/view?usp=sharing",
        }
      },
      {
        id: "4",
        name: "شبكة تعبئة",
        desc: "نسيج شبكي مفتوح لتهوية زراعية مثلى. حلول متعددة الاستخدامات لتعبئة ونقل المنتجات الزراعية.",
        image: "/images/catalogo/img4.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1OQKGpnRCfA2yFdAlT6q7GczYua2FFFVU/view?usp=sharing",
          en: "https://drive.google.com/file/d/1wldGL6XuqH-Ruth9Y01-hkNnPlbg9SW5/view?usp=sharing",
        }
      },
      {
        id: "5",
        name: "أكياس",
        desc: "بولي بروبيلين منسوج مسطح للتعبئة بالجملة. مقاومة فائقة للمنتجات السائبة.",
        image: "/images/catalogo/img5.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/16S43-PUrQECO9q2J1fOgbN-YeIxQ2GhP/view?usp=sharing",
          en: "https://drive.google.com/file/d/1fkZvAWTT3mnBkxQ0Gbb2kRgOoN2dJZiK/view?usp=sharing",
        }
      },
      {
        id: "6",
        name: "واقي الزوايا",
        desc: "حماية هيكلية واستقرار للمنصات. تعزيز أساسي في اللوجستيات وتخزين البضائع.",
        image: "/images/catalogo/img6.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/181Hvr0HQffLU3rmcXkccYoqj-Y_A-gxr/view?usp=sharing",
          en: "https://drive.google.com/file/d/1DdcEavACvuY00oyMyC9rOWRybi9jnQrD/view?usp=sharing",
        }
      },
      {
        id: "7",
        name: "تغليف مرن",
        desc: "أفلام عالية الحاجز وتصفيح متخصص. حماية مثلى للأغذية والمنتجات الصناعية.",
        image: "/images/catalogo/img7.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1TGxUcGHjW1NHF8K8YkRisbRE8uAuTnPO/view?usp=sharing",
          en: "https://drive.google.com/file/d/126eYsoqq9WI1SR-zoMdQJE7HS8cJR48m/view?usp=sharing",
        }
      }
    ]
  },

  // =================================================
  // القائمة الرئيسية (كاروسيل /products)
  // =================================================
  products_list: [
    {
      img: "carrusel/img1.webp",
      division: "فيلم التغليف المطاط",
      descripcion: "فيلم قابل للتمدد بوضوح بصري عالٍ ومعايير جودة عالية. يضمن سلامة الحمولة وكفاءة التكاليف. يشمل خطنا خيار قابل للتحلل الحيوي، مُصمم للتحلل بنسبة 90% أسرع.",
      slug: "stretch-film",
      video: "carrusel/stretch-film.mp4"
    },
    {
      img: "carrusel/img2.webp",
      division: "حبل",
      descripcion: "حبل من خيوط البولي بروبيلين عالي الأداء. توازن مثالي: خفة فائقة دون التضحية بمقاومة الكسر.",
      slug: "cuerdas",
      video: "carrusel/cuerdas.mp4"
    },
    {
      img: "carrusel/img3.webp",
      division: "رافيا",
      descripcion: "رافيا من فيلم البولي بروبيلين عالي الأداء. خفة كبيرة ومقاومة عالية للكسر. مرنة ومتعددة الاستخدامات.",
      slug: "rafias",
      video: "carrusel/rafia.mp4"
    },
    {
      img: "carrusel/img4.webp",
      division: "شبكة تعبئة",
      descripcion: "أكياس شبكية من رافيا البولي بروبيلين بنسيج مسطح وخياطة معززة من النوع 'L'. تصميم مهوى مثالي للفواكه والخضروات.",
      slug: "arpillas",
      video: "carrusel/arpillas.mp4"
    },
    {
      img: "carrusel/img5.webp",
      division: "أكياس",
      descripcion: "أكياس رافيا بجودة فائقة. حل تعبئة متين للأغذية والمنتجات الكيميائية والأسمدة.",
      slug: "sacos",
      video: "carrusel/sacos.mp4"
    },
    {
      img: "carrusel/img6.webp",
      division: "واقي الزوايا",
      descripcion: "واقيات زوايا من الكرتون لتحسين اللوجستيات. مقاومة هيكلية واستقرار أكبر للأحمال.",
      slug: "esquineros",
      video: "carrusel/esquineros.mp4"
    },
    {
      img: "carrusel/img7.webp",
      division: "تغليف مرن",
      descripcion: "تتخصص Neo Empaques International في حلول التغليف المرن المتقدمة، المصممة لتحسين حفظ وعرض المنتجات في صناعات متعددة.",
      slug: "empaques-flexibles",
      video: "carrusel/bobina-impresa.mp4"
    }
  ],

  // =================================================
  // صفحة: فيلم التغليف المطاط
  // =================================================
  stretch_film: {
    meta_title: "فيلم التغليف المطاط | Grupo Ortiz",
    back_aria: "العودة إلى المنتجات",
    specs_title: "المواصفات الفنية",

    specs_labels: {
      width: "العرض",
      length: "الطول",
      gauge: "السُمك/ميكرون",
      weight: "وزن اللفة",
      type: "الاستخدام"
    },

    products: [
      {
        name: 'ستريتش بريميوم',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "مُصمم للتغليف اليدوي على المنصات، يوفر هذا الفيلم المطاط متوسط التمدد حلاً عملياً وفعالاً لتأمين الأحمال دون الحاجة إلى معدات آلية. تضمن تركيبته مقاومة جيدة وأداءً موثوقاً في عمليات التغليف.",
        specs_values: { width: "19-30 سم", length: "1000-15000", gauge: "40-110", weight: "10-40 كجم", type: "يدوي" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      },
      {
        name: 'أوتوماتيكي',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "مُصمم للاستخدام مع آلات التغليف منخفضة ومتوسطة السرعة، يوفر هذا الفيلم المطاط أداءً عالياً وتميزاً في عمليات التغليف الآلي على المنصات. تضمن تركيبته المقاومة والاستقرار في تثبيت الأحمال.",
        specs_values: { width: "18-30 سم", length: "2000-15000", gauge: "50-110", weight: "10-49 كجم", type: "أوتوماتيكي" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      },
      {
        name: 'يدوي مسبق التمدد',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "مُصمم للتطبيق اليدوي عالي الأداء، يتميز هذا الفيلم مسبق التمدد بتقديم أحد أقل السماكات في السوق. تلغي تقنيته الحاجة لبذل قوة إضافية عند اللف، مما يسهل استخدامه الفوري ويحسن الكفاءة في عملية التغليف على المنصات.",
        specs_values: { width: "16-17 سم", length: "7000-25000", gauge: "40-120", weight: "10-40 كجم", type: "يدوي" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      },
      {
        name: 'يدوي باندينج',
        img: '/images/stretch/manual.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "مُصمم للتطبيق في التغليف اليدوي مع تمدد متوسط، يوفر هذا الفيلم المطاط التقليدي أداءً ممتازاً في عمليات التغليف وتأمين الأحمال. تضمن تركيبته المقاومة والاستقرار في التطبيقات العامة.",
        specs_values: { width: "3-12 سم", length: "7000-25000", gauge: "40-120", weight: "10-40 كجم", type: "يدوي" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/manual.png',
          '/images/stretch/rigido3.png'
        ]
      },
      {
        name: 'يدوي صلب',
        img: '/images/stretch/rigido.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "مُصمم خصيصاً للتطبيقات في التغليف اليدوي مع تمدد محدود، يوفر هذا الفيلم المطاط أداءً عالياً وموثوقية كبيرة في عمليات التغليف. تضمن تركيبته الاستقرار والكفاءة في تثبيت الأحمال.",
        specs_values: { width: "17-30 سم", length: "1000-15000", gauge: "40-90", weight: "10-40 كجم", type: "يدوي", color: "أسود/ملون" },
        gallery: [
          '/images/stretch/rigido2.png',
          '/images/stretch/rigido.png',
          '/images/stretch/rigido3.png'
        ]
      }
    ]
  },

  // =================================================
  // صفحة: الحبال
  // =================================================
  cuerdas: {
    meta_title: "حبال | Grupo Ortiz",
    back_aria: "العودة",
    loading: "جارٍ التحميل...",
    specs_title: "المواصفات الفنية",

    specs_labels: {
      load: "الإنتاجية",
      mat: "المادة",
      weight: "الوزن",
      resist: "المقاومة",
      charge: "العرض"
    },

    products: [
      {
        name: 'حبل للاستخدام العام',
        img: '/images/cuerdas/CuerdaT1.webp',
        video: "/videos/cuerdas/cuerda-1.mp4",
        link: '#',
        description: "مُصنع من البولي بروبيلين مع فلتر أشعة فوق البنفسجية متقدم، هذا الحبل مثالي للأنشطة ذات التعرض العالي للشمس. تركيبته المتخصصة تبطئ التآكل الطبيعي وتطيل عمره الافتراضي، مما يضمن مقاومة ومتانة أكبر في مواجهة العوامل الجوية. إنه الحبل المثالي لتوفير الثبات والأمان والأداء الموثوق في التطبيقات العامة والأعمال الشاقة.",
        specs_values: { load: "1,980 م", mat: "PP-UV", weight: "18 كجم", resist: "175 كجم", charge: "4-19 مم" },
        gallery: [
          '/images/cuerdas/CuerdaT1-2.png',
          '/images/cuerdas/CuerdaT1.webp',
          '/images/cuerdas/CuerdaT1-1.png'
        ]
      },
      {
        name: 'حبل البيوت البلاستيكية',
        img: '/images/cuerdas/CuerdaNegra.webp',
        video: "/videos/cuerdas/CuerdaI.mp4",
        link: '#',
        description: "مُصنع من البولي بروبيلين مع مثبت أشعة فوق البنفسجية، هذا الحبل مثالي للقطاع البحري والأنشطة ذات التعرض العالي للشمس. تركيبته المتخصصة تبطئ التلف الناتج عن الأشعة فوق البنفسجية، مما يطيل عمره الافتراضي ويضمن مقاومة أكبر للعوامل الجوية. إنه الحل المثالي لتوفير الثبات والاستقرار في الأنفاق الزراعية الكبيرة.",
        specs_values: { load: "3,240 م", mat: "PP-UV", weight: "18 كجم", resist: "105 كجم", charge: "3-8 مم" },
        gallery: [
          '/images/cuerdas/CuerdaNegra6-1.png',
          '/images/cuerdas/CuerdaNegra.webp',
          '/images/cuerdas/CuerdaNegra6-3.png'
        ]
      },
      {
        name: 'حبل اقتصادي',
        img: '/images/cuerdas/CuerdaEco.png',
        video: "/videos/cuerdas/CuerdaE.mp4",
        link: '#',
        description: "مُصنع من بولي بروبيلين عالي الجودة، يوفر هذا الحبل تشكيلة واسعة من العروض والأقطار والألوان، متوفرة بإصدارات ملساء أو مجمعة، مع تعزيز أو علامة تجارية. تنوعه ومقاومته يجعلانه خياراً موثوقاً لتطبيقات متعددة، للاستخدام في الصناعات والمصانع والمستودعات والأسواق والمتاجر وورش العمل.",
        specs_values: { load: "3,240 م", mat: "PP-UV", weight: "18 كجم", resist: "105 كجم", charge: "3-8 مم" },
        gallery: [
          '/images/cuerdas/CuerdaEco1.png',
          '/images/cuerdas/CuerdaEco.png',
          '/images/cuerdas/CuerdaEco3.png'
        ]
      }
    ]
  },

  // =================================================
  // صفحة: الرافيا
  // =================================================
  rafias: {
    meta_title: "رافيا | Grupo Ortiz",
    back_aria: "العودة",
    specs_title: "المواصفات الفنية",

    specs_labels: {
      cal: "القطر",
      yield: "الإنتاجية م",
      resist: "المقاومة كجم",
      usage: "المادة"
    },

    products: [
      {
        name: "رافيا للربط",
        description: "مُصنعة من بولي بروبيلين 100% خام، توفر هذه الرافيا مقاومة عالية وأداءً ممتازاً، مع الحفاظ على خصائصها الفيزيائية حتى في ظروف العراء. تضمن جودتها المتانة والأداء الموثوق في التطبيقات الشاقة. تُستخدم على نطاق واسع في القطاعات الزراعية والدواجن والبستنة.",
        img: "/images/rafias/atar.png",
        video: "/videos/rafia/fondoN.mp4",
        specs_values: {
          cal: "2-8 مم",
          yield: "90 كجم",
          resist: "60-320 ف",
          usage: "PP-UV"
        },
        gallery: [
          '/images/rafias/atar2.png',
          '/images/rafias/atar.png',
          '/images/rafias/atar3.png'
        ]
      },
      {
        name: "رافيا اقتصادية",
        description: "مُصنعة من بولي بروبيلين عالي الجودة، توفر هذه الرافيا مقاومة ممتازة وتحافظ على خصائصها الفيزيائية حتى في ظروف العراء. أداؤها الموثوق يجعلها خياراً مثالياً للتطبيقات الزراعية والدواجن والبستنة.",
        img: "/images/rafias/Eco.png",
        video: "/videos/rafia/fondoE.mp4",
        specs_values: {
          cal: "2-8",
          yield: "90-500 كجم",
          resist: "59-255 ف",
          usage: "PP-UV"
        },
        gallery: [
          '/images/rafias/Eco2.png',
          '/images/rafias/Eco.png',
          '/images/rafias/Eco3.png'
        ]
      },
      {
        name: "رافيا مفتلة سوداء",
        description: "مُصنعة من بولي بروبيلين عالي الجودة، توفر هذه الرافيا مقاومة كبيرة وتحافظ على خصائصها الفيزيائية حتى في ظروف العراء. أداؤها الممتاز يجعلها مثالية للتطبيقات الصناعية والتعبئة، وكذلك للقطاعات الزراعية والدواجن والبستنة.",
        img: "/images/rafias/negra.png",
        video: "/videos/rafia/fondoR.mp4",
        specs_values: {
          cal: "2-8",
          yield: "90-500 كجم",
          resist: "59-255 ف",
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
  // صفحة: شبكات التعبئة
  // =================================================
  arpillas: {
    meta_title: "شبكات التعبئة | Grupo Ortiz",
    back_aria: "العودة",
    specs_title: "المواصفات الفنية",

    specs_labels: {
      construction: "البناء",
      sizes: "العرض",
      colors: "الألوان",
      features: "نوع الإغلاق"
    },

    products: [
      {
        name: 'شبكة دائرية',
        img: '/images/arpillas/arpilla.png',
        video: "/videos/arpilla/circular.mp4",
        link: '#',
        description: "مُصنعة من بولي بروبيلين 100% خام وبناء رافيا، توفر هذه الشبكة مقاومة عالية وأداءً ممتازاً في تطبيقات التعبئة والتخزين. تضمن جودتها المتانة والأداء الموثوق في التعامل مع المنتجات المتنوعة.",
        specs_values: {
          sizes: "23-70 سم",
          colors: "4",
          features: "رباط"
        },
        gallery: [
          '/images/arpillas/circular2.png',
          '/images/arpillas/arpilla.png',
          '/images/arpillas/circular3.png'
        ]
      },
      {
        name: 'شبكة أحادية الخيط',
        img: '/images/arpillas/arpilla2.png',
        video: "/videos/arpilla/mono.mp4",
        link: '#',
        description: "مُصنعة من بولي بروبيلين 100% خام وبناء رافيا/أحادي الخيط، توفر هذه الشبكة مقاومة عالية وأداءً ممتازاً في تطبيقات التعبئة والتخزين. يوفر هيكلها المتانة والأداء الموثوق في التعامل وحماية المنتجات المتنوعة.",
        specs_values: {
          construction: "أحادي الخيط",
          sizes: "23-70 سم",
          colors: "2",
          features: "رباط"
        },
        gallery: [
          '/images/arpillas/mono2.png',
          '/images/arpillas/arpilla2.png',
          '/images/arpillas/mono3.png'
        ]
      },
      {
        name: 'شبكة بخياطة جانبية',
        img: '/images/arpillas/arpilla3.png',
        video: "/videos/arpilla/costura.mp4",
        link: '#',
        description: "مُصنعة من بولي بروبيلين 100% خام وبناء رافيا/أحادي الخيط، توفر هذه الشبكة مقاومة عالية وأداءً ممتازاً في تطبيقات التعبئة والتخزين. يضمن هيكلها المتانة والموثوقية في التعامل مع المنتجات المختلفة.",
        specs_values: {
          type: "جانبي",
          construction: "أحادي الخيط",
          sizes: "23-60 سم",
          colors: "4",
          features: "معزز"
        },
        gallery: [
          '/images/arpillas/lateral1.png',
          '/images/arpillas/arpilla3.png',
          '/images/arpillas/lateral3.png'
        ]
      },
      {
        name: 'شبكة بملصق مغلف',
        img: '/images/arpillas/arpilla4.png',
        video: "/videos/arpilla/etiqueta.mp4",
        link: '#',
        description: "مُصنعة من بولي بروبيلين 100% خام وبناء رافيا/رافيا، توفر هذه الشبكة مقاومة عالية وأداءً ممتازاً في عمليات التعبئة والتخزين. يضمن نسيجها المتانة والموثوقية للتطبيقات الشاقة في السوق المحلي والتصدير.",
        specs_values: {
          type: "مغلف",
          construction: "رافيا",
          sizes: "23-70 سم",
          colors: "4",
          features: "رباط"
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
  // صفحة: الأكياس
  // =================================================
  sacos: {
    meta_title: "أكياس | Grupo Ortiz",
    back_aria: "العودة إلى المنتجات",
    specs_title: "المواصفات الفنية",

    specs_labels: {
      load: "العرض",
      unit: "الطول",
      mat: "المادة",
      weight: "المقاومة"
    },

    products: [
      {
        name: 'كيس رافيا بدون تغليف',
        img: '/images/sacos/saco2.png',
        model: '/models/saco_blanco.glb',
        video: "/videos/saco/slaminar.mp4",
        link: '#',
        description: "مُصنعة من شرائط بولي بروبيلين متشابكة، توفر أكياس الرافيا بدون تغليف مقاومة كبيرة ومتانة ممتازة في تطبيقات التعبئة والتخزين. يسمح هيكلها بتحمل الأحمال الثقيلة دون تمزق، مما يضمن أداءً موثوقاً في الأعمال الشاقة.",
        specs_values: {
          load: "35-80 سم",
          unit: "49-115 سم",
          mat: "PP",
          weight: "120-200 كجم/قوة"
        },
        gallery: [
          '/images/sacos/slaminado1.png',
          '/images/sacos/saco2.png',
          '/images/sacos/slaminado3.png'
        ]
      },
      {
        name: 'كيس شفاف',
        img: '/images/sacos/saco.png',
        video: "/videos/saco/transp.mp4",
        link: '#',
        description: "مُصنعة من شرائط بولي بروبيلين بتشطيب شفاف، توفر هذه الأكياس مقاومة عالية وتسمح برؤية ممتازة للمنتج المعبأ. يضمن هيكلها المتانة والأداء الموثوق في تطبيقات التخزين والنقل.",
        specs_values: {
          load: "35-80 كجم",
          unit: "49-115 سم",
          mat: "PP",
          weight: "120-200 كجم/قوة"
        },
        gallery: [
          '/images/sacos/laminado2.png',
          '/images/sacos/saco.png',
          '/images/sacos/laminado3.png'
        ]
      },
      {
        name: 'كيس رافيا اقتصادي',
        img: '/images/sacos/saco3.png',
        video: "/videos/saco/eco.mp4",
        link: '#',
        description: "مُصنعة من مواد مُعاد تدويرها ناتجة عن فائض عملية الإنتاج ذاتها، توفر هذه الأكياس مقاومة ومتانة جيدة بتكلفة أقل. يسمح تصنيعها بأداء موثوق في تطبيقات التعبئة والتخزين العامة.",
        specs_values: {
          load: "30-80 كجم",
          unit: "49-115 سم",
          mat: "PP",
          weight: "120-200 كجم/قوة"
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
  // صفحة: واقيات الزوايا
  // =================================================
  esquineros: {
    meta_title: "واقيات الزوايا | Grupo Ortiz",
    back_aria: "العودة",
    specs_title: "المواصفات الفنية",

    specs_labels: {
      tab:      "الجناح",
      thick:    "السُمك",
      length:   "الطول",
      tabyd:    "الجناح (يارد)",
      thickyd:  "السُمك (يارد)",
      lengthyd: "الطول (يارد)"
    },

    products: [
      {
        name: "واقي زوايا كرافت بني",
        description: "مُصمم لحماية الحواف والزوايا أثناء النقل والتخزين، يوزع واقي الزوايا هذا الضغط بشكل متساوٍ، مما يمنع التشوهات والأضرار في البضائع. يوفر هيكله المقاومة والاستقرار في تطبيقات التغليف الشاقة.",
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
        name: "واقي زوايا كرافت أبيض",
        description: "مُصمم لحماية الحواف والزوايا أثناء النقل والتخزين، يوزع واقي الزوايا هذا الضغط بشكل متساوٍ، مما يمنع التشوهات والأضرار في البضائع. يوفر هيكله المقاومة والاستقرار في تطبيقات التغليف الشاقة.",
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
  // صفحة: التغليف المرن
  // =================================================
  flexible_packaging: {
    meta_title: "التغليف المرن | Grupo Ortiz",
    back_aria: "العودة إلى المنتجات",
    specs_title: "المواصفات الفنية",

    specs_labels: {
      lamination: "التصفيح",
      finish:     "التشطيب",
      size:       "المقاسات حتى",
      zipper:     "سحاب",
      type:       "النوع"
    },

    products: [
      {
        name: "بكرة مطبوعة",
        description: "تتوفر بكراتنا بتنوع كبير في التصفيح والسماكات والتشطيبات. مع خيار طباعة حتى 10 أحبار و133 خطاً لكل بوصة. التطوير الأقصى: 1,140 مم. العرض الأقصى للطباعة: 1,450 مم. متوافقة مع آلات التعبئة الآلية لتحسين كفاءة الإنتاج.",
        img: "/images/flexible/bobina-impresa.png",
        video: "/videos/flexible/bobinaf.mp4",
        gallery: [
          "/images/flexible/bobina-impresa-1.png",
          "/images/flexible/bobina-impresa.png",
          "/images/flexible/bobina-impresa-3.png"
        ],
        specs_values: {
          lamination: "3 أنواع",
          finish:     "متنوعة",
          size:       "1,450 مم",
          zipper:     "غير متوفر",
          type:       "بكرة"
        }
      },
      {
        name: "كيس قائم",
        description: "أكياس قائمة متعددة الاستخدامات بهيكل مصفح وحاجز عالٍ ضد الرطوبة والأكسجين. مثالية للأغذية الجافة أو الرطبة والمساحيق والسوائل ومستحضرات التجميل والكيماويات. متوفرة بتشطيبات طبيعي ومطفي ومعدني، بأحجام من 150 جم إلى 1 كجم، مع خيار إغلاق بسحاب ونافذة.",
        img: "/images/flexible/standup-generica.png",
        video: "/videos/flexible/standup.mp4",
        gallery: [
          "/images/flexible/standup-generica-2.png",
          "/images/flexible/standup-generica.png",
          "/images/flexible/standup-generica-3.png"
        ],
        specs_values: {
          lamination: "مصفح",
          finish:     "3 أنواع",
          size:       "1 كجم",
          zipper:     "نعم / لا",
          type:       "كيس"
        }
      },
      {
        name: "كيس قائم X ORIGANICS",
        description: "مجموعة أكياس بتصاميم زخرفية جذابة: فواكه حمراء، زهور، فواكه، سنابل، هدية زرقاء وهدية وردية. إغلاق بسحاب، هيكل متين وتشطيبات طبيعي أو معدني. متوفرة بأحجام من 150 جم إلى 1 كجم. مثالية لمن يبحث عن تغليف عالي الجودة وجذاب بصرياً.",
        img: "/images/flexible/standup-origanics.png",
        video: "/videos/flexible/standup-origanics.mp4",
        gallery: [
          "/images/flexible/standup-origanics-2.png",
          "/images/flexible/standup-origanics.png",
          "/images/flexible/standup-origanics-3.png"
        ],
        specs_values: {
          lamination: "نوعان",
          finish:     "هدية",
          size:       "1 كجم",
          zipper:     "نعم",
          type:       "كيس مطبوع"
        }
      },
      {
        name: "كيس تفريغ هواء عالي",
        description: "مُصممة لتعظيم النضارة والعمر الافتراضي للحوم والأجبان والمقانق والمنتجات الطازجة. يزيل إغلاقها المحكم الهواء، ويحافظ على الخصائص الطبيعية للمنتج ويمنع فقدان النكهة والملمس والجودة. مُصنعة من مواد عالية المقاومة والحاجز.",
        img: "/images/flexible/bolsa-alto-vacio.png",
        video: "/videos/flexible/bolsa-alto-vacio.mp4",
        gallery: [
          "/images/flexible/bolsa-alto-vacio-1.png",
          "/images/flexible/bolsa-alto-vacio.png",
          "/images/flexible/bolsa-alto-vacio-3.png"
        ],
        specs_values: {
          lamination: "متعدد الطبقات",
          finish:     "شفاف",
          size:       "حسب المنتج",
          zipper:     "لا",
          type:       "كيس"
        }
      }
    ]
  },

  // =================================================
  // صفحة: الموزع (صفحة هبوط كاملة)
  // =================================================
  distribuidor: {
    meta_title: "موزع Grupo Ortiz | شريك رسمي",
    hero: {
      subtitle: "بوابة الجملة",
      title: "ضاعف <br>أرباحك <span>معنا</span>",
      desc: "وزّع منتجات عالية الطلب بدعم المُصنّع الرائد. مخزون مضمون، بدون وسطاء ولوجستيات خلال 24 ساعة.",
      cta: "ابدأ الآن"
    },
    cards: [
      { icon: "ri-stack-line",        title: "مخزون كامل",    desc: "قدرة على تلبية الطلبات الكبيرة فوراً. مستودعك ممتلئ دائماً." },
      { icon: "ri-truck-line",        title: "شحن خلال 24س",  desc: "لوجستيات خاصة. عملاؤك لا ينتظرون، نُسلّم في وقت قياسي." },
      { icon: "ri-shield-check-line", title: "ضمان",          desc: "استبدال فوري بدون بيروقراطية أو أسئلة. دعم كامل من العلامة التجارية." },
      { icon: "ri-line-chart-line",   title: "هامش ربح أفضل", desc: "أسعار مباشرة من المصنع مُصممة لتعظيم صافي أرباحك." }
    ],
    stats: [
      { val: 25, symbol: "k", label: "طن شهرياً" },
      { val: 35, symbol: "+", label: "سنة من التاريخ" },
      { val: 15, symbol: "M", label: "إجمالي المبيعات" }
    ],
    form: {
      title: "طلب <br>التسجيل",
      desc: "انضم إلى الشبكة. أكمل ملفك لتعيين المنطقة وقائمة الأسعار التفضيلية.",
      support_label: "دعم مباشر",
      labels: {
        name:     "اسم جهة الاتصال",
        business: "الاسم التجاري",
        whatsapp: "واتساب",
        email:    "البريد الإلكتروني",
        products: "المنتجات المطلوبة"
      },
      products_list: ["أكياس", "تغليف مرن", "رافيا", "واقي زوايا", "حبال", "ستريتش", "أخرى", "الكل"],
      btn:         "إرسال الطلب",
      success_msg: "تم إرسال الطلب"
    }
  },

  // =================================================
  // صفحة: من نحن
  // =================================================
  quienes_somos: {
    meta_title: "من نحن | Grupo Ortiz",

    timeline: {
      title_white: "مسيرتنا",
      title_orange: "التاريخية",
      nav_prev: "السابق",
      nav_next: "التالي",
      events: [
        {
          year: "1959",
          title: "البداية",
          short: "التأسيس في موريليا",
          img: "tiempo/timeline-1959.webp",
          description: "منذ عام 1959، كان Grupo Ortiz جزءاً من التطور الصناعي في المكسيك. أسسها نيكاندرو أورتيز في موريليا، وُلدت المجموعة برؤية ثابتة: الجمع بين أحدث التقنيات وموهبة وتفاني فريقها لبناء شركة راسخة ومبتكرة وملتزمة بالجودة."
        },
        {
          year: "1970",
          title: "التوسع الصناعي",
          short: "أكياس وشبكات",
          img: "tiempo/timeline-1970.webp",
          description: "في عام 1970، بدأنا إنتاج الأكياس وشبكات التعبئة من البولي بروبيلين، مما شكّل مرحلة رئيسية في نمونا الصناعي. عزّزت هذه الخطوة الاستراتيجية قدرتنا التشغيلية، ووسّعت مشاركتنا التجارية، ورسّخت وجودنا في السوق الوطني."
        },
        {
          year: "1985",
          title: "الابتكار التقني",
          short: "آلات أوروبية",
          img: "tiempo/timeline-1985.webp",
          description: "في عام 1985، أدرجنا آلات أوروبية من أحدث جيل، مما عزّز بنيتنا التحتية الصناعية وحسّن عملياتنا الإنتاجية. رفع هذا الاستثمار الاستراتيجي معاييرنا في الجودة، وزاد الكفاءة التشغيلية، وأكد التزامنا بالابتكار التقني."
        },
        {
          year: "1995",
          title: "التنويع",
          short: "خطوط جديدة",
          img: "tiempo/timeline-1995.webp",
          description: "في عام 1995، وسّعنا خطوط إنتاجنا لتشمل فيلم التغليف المطاط والتغليف المرن والمنتجات المتخصصة للصناعة. نوّع هذا التوسع الاستراتيجي محفظتنا، وعزّز قدرتنا التنافسية، وسمح لنا بتلبية متطلبات جديدة في السوق الوطني."
        },
        {
          year: "2005",
          title: "التوسع الدولي",
          short: "أمريكا وأوروبا",
          img: "tiempo/timeline-2005.webp",
          description: "في عام 2005، بدأنا التصدير إلى أمريكا وأوروبا، مما شكّل خطوة حاسمة في توسعنا الدولي. وضع هذا الإنجاز الشركة كمرجع في صناعة البوليمرات البلاستيكية، وعزّز وجودنا العالمي ورسّخ قدرتنا التنافسية في الأسواق الدولية."
        },
        {
          year: "2015",
          title: "الاستدامة",
          short: "مصنع إعادة التدوير",
          img: "tiempo/timeline-2015.webp",
          description: "في عام 2015، أنشأنا مصنعاً لإعادة التدوير وعززنا برامج الاستدامة لدينا، مؤكدين التزامنا بالبيئة. حسّنت هذه المبادرة الاستراتيجية استغلال الموارد، ودفعت الممارسات المسؤولة، ورسّخت رؤيتنا للنمو."
        },
        {
          year: "2026",
          title: "الحاضر",
          short: "رائد صناعي",
          img: "tiempo/timeline-2026.webp",
          description: "في عام 2026، نمتلك 17 مصنع إنتاج، وأكثر من 4,000 موظف، وقدرة سنوية تبلغ 220,000 طن. يرسّخنا هذا النمو المستدام كرواد في صناعة البلاستيك، مدعومين ببنية تحتية متينة وكوادر بشرية متخصصة ورؤية استراتيجية موجهة نحو المستقبل."
        }
      ]
    },

    filosofia: {
      label: "مبادئنا",
      title: "فلسفة GO",
      items: [
        "الهوس برضا العميل، وليس بالمنافسة.",
        "الشغف بالاختراع والابتكار المستمر.",
        "التميز التشغيلي في كل عملية.",
        "التفكير طويل المدى مع نتائج فورية.",
        "أن نكون أفضل صاحب عمل وأكثر مكان عمل أماناً على وجه الأرض."
      ]
    },

    vision: {
      label: "إلى أين نتجه",
      title: "الرؤية",
      items: [
        "أن نكون الشركة الأكثر توجهاً نحو العميل على وجه الأرض.",
        "تقديم كل حل متكامل لأي عمل تجاري.",
        "أن نكون الحل الوحيد في التغليف لأي عمل تجاري على وجه الأرض.",
        "النمو بحضور عالمي دون فقدان التركيز الإنساني."
      ]
    },

    infraestructura: {
      title_white:  "بنية تحتية",
      title_orange: "تدعمنا",
      stats: [
        { number: "10",      label: "مصانع إنتاج",        desc: "منشآت موزعة استراتيجياً لخدمة الأسواق المحلية والدولية.", icon: "number" },
        { number: "+3,000",  label: "موظف",               desc: "فريق متخصص يدفع كل عملية إنتاجية.", icon: "number" },
        { number: "260",     label: "وحدة لوجستية",       desc: "أسطول خاص يضمن توزيعاً فعالاً وتسليمات آمنة محلياً ودولياً.", icon: "number" },
        { number: "عالمي",   label: "حضور دولي",          desc: "تصدير وتوزيع في أمريكا وأوروبا.", icon: "globe" }
      ]
    },

    plantas: {
      title:    "مصانعنا",
      subtitle: "17 مصنع إنتاج",
      locations: [
        { key: "monterrey", number: "مصنع واحد",   badge: "مونتيري، نويفو ليون" },
        { key: "michoacan", number: "16 مصنعاً",   badge: "موريليا، ميتشواكان" }
      ]
    },

    instalaciones: {
      title_white:  "منشآتنا",
      title_orange: "",
      subtitle:     "جولات افتراضية 360°",
      badge_soon:   "قريباً",
      badge_tour:   "عرض الجولة",
      btn_tour:     "عرض الجولة ثلاثية الأبعاد",
      btn_soon:     "قريباً",
      items: [
        {
          id: "extrusoras", num: "01",
          title: "فيلم التغليف المطاط",
          tag:   "موريليا، ميتش.",
          desc:  "خطوط بثق عالية السعة حيث يتحول البولي بروبيلين إلى خيط مسطح دقيق.",
          thumb: "/images/virtual/RT.webp",
          link:  "https://my.matterport.com/show/?m=YoM2tyXMeyb&ss=2&sr=2.97,.12&play=1&qs=1&ts=1",
          soon:  true
        },
        {
          id: "telares", num: "02",
          title: "شبكات التعبئة",
          tag:   "موريليا، ميتش.",
          desc:  "أنوال من أحدث جيل تنسج الخيط لإنتاج قماش بولي بروبيلين بأقصى انتظام.",
          link:  "https://my.matterport.com/show/?m=2xCe1VajMjj&ss=1&sr=2.28,-1.47&play=1&qs=1&ts=1",
          thumb: "/images/virtual/RA.webp",
          soon:  false
        },
        {
          id: "laminado", num: "03",
          title: "التصفيح والطباعة",
          tag:   "موريليا، ميتش.",
          desc:  "منطقة التصفيح والطباعة الفلكسوغرافية حيث تحصل الأكياس على تشطيبات وطباعة ومعالجة نهائية عالية الجودة.",
          link:  "",
          thumb: "/images/virtual/RS.webp",
          soon:  true
        },
        {
          id: "reciclado", num: "04",
          title: "مصنع إعادة التدوير",
          tag:   "موريليا، ميتش.",
          desc:  "مركزنا لإعادة تدوير البولي بروبيلين، الملتزم بالاقتصاد الدائري والبيئة.",
          link:  "",
          soon:  true
        }
      ]
    },

    capacidad: {
      title:         "القدرة الإنتاجية المُركّبة",
      subtitle:      "بنية تحتية عالية الأداء",
      planta_label:  "مصنع",
      plantas_label: "مصانع",
      items: [
        { num: "04", label: "إنتاج الأكياس",        width: 100, delay: 0   },
        { num: "02", label: "إنتاج شبكات التعبئة",  width: 50,  delay: 100 },
        { num: "01", label: "الحبال والرافيا",       width: 25,  delay: 200 },
        { num: "02", label: "فيلم التغليف المطاط",   width: 50,  delay: 300 },
        { num: "01", label: "التغليف المرن",         width: 25,  delay: 400 },
        { num: "01", label: "إعادة التدوير",         width: 25,  delay: 500 },
        { num: "03", label: "واقيات الزوايا",        width: 75,  delay: 600 },
        { num: "01", label: "شريط الربط",            width: 25,  delay: 700 },
        { num: "01", label: "منتجات قابلة للاستهلاك", width: 25,  delay: 800 },
        { num: "01", label: "أكياس",                 width: 25,  delay: 900 }
      ]
    },

    valores: {
      title:    "قيمنا",
      subtitle: "ركائز ثقافتنا",
      items: [
        { title: "المسؤولية",  description: "نفي بالتزاماتنا بأخلاقية واحترافية، مدركين تأثير أفعالنا على العملاء والموظفين والمجتمعات." },
        { title: "الثقة",      description: "نبني علاقات متينة قائمة على الشفافية والصدق والوفاء بالوعود، مما يولّد الأمان في كل تفاعل." },
        { title: "الشغف",      description: "نحب ما نقوم به ونعكسه في كل منتج وعملية وابتكار، ندفع التميز بحماس وتفانٍ حقيقي." },
        { title: "المثابرة",   description: "نواجه التحديات بعزيمة وثبات، ونبقى صامدين في أهدافنا حتى نحقق نتائج استثنائية." },
        { title: "الانضباط",   description: "نتبع عمليات صارمة ومعايير جودة بنظام ومنهجية، مما يضمن الاتساق والتميز في كل تسليم." },
        { title: "المبادرة",   description: "نستبق الاحتياجات ونتخذ إجراءات قبل ظهور المشكلات، ونبتكر حلولاً تولّد قيمة مستمرة." },
        { title: "الاحترام",   description: "نقدّر التنوع وكرامة ومساهمة كل شخص، ونعزز بيئة تعاون وشمول ومعاملة عادلة." }
      ]
    }
  },

  // =================================================
  // التذييل
  // =================================================
  footer: {
    about_us:         "من نحن",
    about:            "حول الشركة",
    social_impact:    "الأثر الاجتماعي",
    customer_service: "خدمة العملاء",
    be_distributor:   "كن موزعاً",
    catalog:          "الكتالوج",
    cta_button:       "أريد أن أكون موزعاً",
    rights:           "جميع الحقوق محفوظة."
  },

  // =================================================
  // صفحة: الأثر الاجتماعي
  // =================================================
  impacto_social: {
    page_title: "الأثر الاجتماعي | Grupo Ortiz",

    hero: {
      eyebrow:          "الأثر الاجتماعي",
      title_top:    "نبني معاً",
      title_bottom: "عالماً أفضل",
      subtitle:         "ندعم المنازل، نُمكّن المرأة، نمنح فرصاً ثانية ونعتني بالكوكب. كل خطوة نخطوها تسعى لتحويل الحياة وبناء مستقبل مليء بالأمل.",
      stat_female:      "% قوة عاملة نسائية",
      stat_recycled:    "أطنان مُعاد تدويرها",
      stat_initiatives: "مبادرات نشطة"
    },

    ods: {
      title:       "بوصلتنا",
      subtitle:    "أجندة 2030",
      description: "نسترشد بأهداف التنمية المستدامة للأمم المتحدة لبناء عالم أكثر عدالة وازدهاراً واستدامة.",
      cards: [
        { n: 1,  title: "القضاء على الفقر",           link: "https://sdgs.un.org/es/goals/goal1",  img: "/images/odc/1.png"  },
        { n: 2,  title: "القضاء على الجوع",           link: "https://sdgs.un.org/es/goals/goal2",  img: "/images/odc/2.png"  },
        { n: 3,  title: "الصحة والرفاهية",            link: "https://sdgs.un.org/es/goals/goal3",  img: "/images/odc/3.png"  },
        { n: 4,  title: "التعليم الجيد",              link: "https://sdgs.un.org/es/goals/goal4",  img: "/images/odc/4.png"  },
        { n: 5,  title: "المساواة بين الجنسين",       link: "https://sdgs.un.org/es/goals/goal5",  img: "/images/odc/5.png"  },
        { n: 6,  title: "المياه النظيفة",             link: "https://sdgs.un.org/es/goals/goal6",  img: "/images/odc/6.png"  },
        { n: 7,  title: "طاقة نظيفة وبأسعار معقولة", link: "https://sdgs.un.org/es/goals/goal7",  img: "/images/odc/7.png"  },
        { n: 8,  title: "العمل اللائق",               link: "https://sdgs.un.org/es/goals/goal8",  img: "/images/odc/8.png"  },
        { n: 9,  title: "الصناعة والابتكار",          link: "https://sdgs.un.org/es/goals/goal9",  img: "/images/odc/9.png"  },
        { n: 10, title: "الحد من التفاوت",            link: "https://sdgs.un.org/es/goals/goal10", img: "/images/odc/10.png" },
        { n: 11, title: "مدن مستدامة",                link: "https://sdgs.un.org/es/goals/goal11", img: "/images/odc/11.png" },
        { n: 12, title: "الإنتاج المسؤول",            link: "https://sdgs.un.org/es/goals/goal12", img: "/images/odc/12.png" },
        { n: 13, title: "العمل المناخي",              link: "https://sdgs.un.org/es/goals/goal13", img: "/images/odc/13.png" },
        { n: 14, title: "الحياة البحرية",             link: "https://sdgs.un.org/es/goals/goal14", img: "/images/odc/14.png" },
        { n: 15, title: "الحياة البرية",              link: "https://sdgs.un.org/es/goals/goal15", img: "/images/odc/15.png" },
        { n: 16, title: "السلام والعدالة",            link: "https://sdgs.un.org/es/goals/goal16", img: "/images/odc/16.png" },
        { n: 17, title: "شراكات لتحقيق الأهداف",     link: "https://sdgs.un.org/es/goals/goal17", img: "/images/odc/17.png" },
      ]
    },

    vision: {
      title:        "أثرنا",
      title_orange: "الإيجابي",
      subtitle:     "نحوّل الصناعة",
      pilars: [
        {
          label: "الركيزة 01",
          title: "منتجات من الأرض",
          desc:  "تطوير مواد مبتكرة وصديقة للبيئة للتغليف المرن تحترم البيئة وتقلل البصمة الكربونية.",
          img:   "/images/impacto/products.webp"
        },
        {
          label: "الركيزة 02",
          title: "ممارسات من الأرض",
          desc:  "تصنيع نظيف واقتصاد دائري في جميع عملياتنا الإنتاجية، بإغلاق الدورات والقضاء على الهدر.",
          img:   "/images/impacto/practices.webp"
        },
        {
          label: "الركيزة 03",
          title: "الأرض الاجتماعية",
          desc:  "التزام شامل تجاه العملاء والموظفين والمجتمعات، بتوليد أثر اجتماعي إيجابي وفرص حقيقية.",
          img:   "/images/impacto/social.webp"
        }
      ]
    },

    oceanos: {
      hero_title:           "ملتزمون بمستقبل",
      hero_title_highlight: "أنظف لمحيطاتنا",
      intro: "في Grupo Ortiz، نؤمن بعالم تعود فيه المحيطات للتألق. من خلال دعم مبادرات عالمية مثل The Ocean Cleanup وجائزة Tom Ford للابتكار البلاستيكي بالتعاون مع Lonely Whale، نعمل على تقليل البلاستيك في بحارنا. كل عملية شراء تقوم بها معنا هي خطوة نحو كوكب أنظف ومستقبل مستدام للجميع. معاً ننقذ المحيطات!",
      features: [
        { title: "ندعم التنظيف العالمي",            desc: "بالتعاون مع مبادرات مثل The Ocean Cleanup." },
        { title: "نشجع الابتكار المستدام",           desc: "من خلال برامج مثل جائزة Tom Ford للابتكار البلاستيكي." },
        { title: "نروّج لمنتجات مسؤولة",            desc: "تقلل الأثر البيئي على المحيطات." },
        { title: "نلهم العمل الجماعي",               desc: "بدعوة العملاء والشركاء ليكونوا جزءاً من التغيير." }
      ],
      partners: [
        {
          title:  "ابتكار Tom Ford",
          desc:   "تسعى هذه المبادرة العالمية لإحداث ثورة في صناعة البلاستيك من خلال مكافأة وتعزيز حلول مبتكرة تحل محل البلاستيك الذي يُستخدم لمرة واحدة. تركز على بدائل مستدامة وقابلة للتوسع تقلل الأثر البيئي وتحمي المحيطات وتشجع التحول نحو مواد أكثر مسؤولية للكوكب.",
          btn:    "اعرف المزيد",
          link:   "https://unwrapthefuture.org/",
          video:  "/videos/impacto/oceancleanup.mp4",
          poster: "/images/impacto/cultura-calidad.jpg"
        },
        {
          title:  "تنظيف المحيط",
          desc:   "مكرسة لتنظيف محيطات العالم، تطوّر هذه المنظمة تقنيات متقدمة لإزالة البلاستيك المتراكم في البحار ومنع وصوله عبر التدخل في الأنهار، المصادر الرئيسية للتلوث. مهمتها استعادة صحة النظم البيئية البحرية، وحماية التنوع البيولوجي وضمان مستقبل نظيف للأجيال القادمة.",
          btn:    "اعرف المزيد",
          link:   "https://theoceancleanup.com/",
          video:  "/videos/impacto/tomford.mp4",
          poster: "/images/impacto/tomford.webp"
        }
      ]
    },

    stats: {
      recycled: "أطنان مُعاد تدويرها",
      female:   "% قوة عاملة نسائية",
      families: "عائلات مستفيدة"
    },

    timeline: {
      title:    "مبادرات تُحدث التحول",
      subtitle: "أثر إيجابي دائم",
      items: [
        {
          num: "01", title: "دار الأمل",
          desc:       "دعم دار أيتام في تاكامبارو، ميتشواكان. كل طفل يستحق منزلاً مليئاً بالحب.",
          desc_short: "دعم دار أيتام في تاكامبارو، ميتشواكان.",
          img:        "/images/impacto/hogar.mp4",
          isVideo:    true,
          poster:     "/images/impacto/hogar.webp"
        },
        {
          num: "02", title: "سلة GO الغذائية",
          desc:       "متحدون من أجل المجتمع. توزيع السلال الغذائية بحب.",
          desc_short: "توزيع السلال الغذائية بحب للمجتمع.",
          img:        "/images/impacto/despensas.webp",
          isVideo:    false
        },
        {
          num: "03", title: "صفر أثر",
          desc:       "سياسة صفر نفايات. تحويل المخلفات إلى فرص.",
          desc_short: "سياسة صفر نفايات. تحويل المخلفات.",
          img:        "/images/impacto/composta.webp",
          isVideo:    false
        },
        {
          num: "04", title: "سماد حي",
          desc:       "تصنيع منتجات قابلة للتحلل. ابتكار يحترم الطبيعة.",
          desc_short: "منتجات قابلة للتحلل. ابتكار مستدام.",
          img:        "/images/impacto/GO.webp",
          isVideo:    false
        },
        {
          num: "05", title: "تألق GO",
          desc:       "مكافآت الأداء لفريق GO. تقدير الجهد.",
          desc_short: "تقدير فريق GO على أدائهم.",
          img:        "/images/impacto/woman.webp",
          isVideo:    false
        },
        {
          num: "06", title: "أيادٍ تقود",
          desc:       "84% من القوة العاملة نسائية. تمكين النساء القياديات.",
          desc_short: "56.82% قوة عاملة نسائية. تمكين القيادات.",
          img:        "/images/impacto/bio.webp",
          isVideo:    false
        }
      ]
    },

    cta: {
      title:        "معاً",
      title_orange: "نحوّل",
      desc:         "نحن الشريك الاستراتيجي الذي تحتاجه شركتك للنمو بالتقنية والخبرة والنتائج.",
      contact:      "اتصل بنا",
      products:     "عرض المنتجات"
    }
  },

  // =================================================
  // صفحة: الرئيسية
  // =================================================
  home: {
    meta_title: "الرئيسية | Grupo Ortiz",

    hero: {
      eyebrow:      "منذ 1959",
      title_top:    "نحن المُصنّع الرئيسي",
      title_bot:    "في أمريكا اللاتينية",
      video:        "background.mp4",
      subtitle:     "أكثر من 65 عاماً في تصنيع حلول هندسية متقدمة للصناعات في القارات الخمس.",
      btn_products: "منتجاتنا",
      btn_about:    "اعرف المزيد",
      stats: [
        { number: 65,   label: "سنة خبرة" },
        { number: 3000, prefix: "+", label: "موظف" },
        { number: 5,    prefix: "", label: "قارات" }
      ]
    },

    divisiones: {
      tag:       "أقسامنا",
      title:     "مجالات",
      title_em:  "التخصص",
      link_text: "عرض المنتجات",
      items: [
        {
          title: "شبكة تعبئة",    tag: "القسم 01",
          description: "أكياس شبكية من رافيا البولي بروبيلين بنسيج مسطح ودائري. تصميم مهوى مثالي للفواكه والخضروات والمنتجات الزراعية.",
          img: "/images/divisiones/arpilla.webp",           color: "#2d8a4e",  slug: "arpillas",           soon: false
        },
        {
          title: "حبل",           tag: "القسم 02",
          description: "حبال بولي بروبيلين عالية المتانة للاستخدامات الزراعية والصناعية والبحرية. مقاومة كبيرة للعوامل الجوية مع فلتر أشعة فوق بنفسجية مدمج.",
          img: "/images/divisiones/cuerdas.webp",           color: "#1a5f8a",  slug: "cuerdas",            soon: false
        },
        {
          title: "رافيا",          tag: "القسم 03",
          description: "رافيا بولي بروبيلين عالية الأداء. خفة كبيرة ومقاومة عالية للكسر وتنوع في الزراعة والدواجن والبستنة.",
          img: "/images/divisiones/rafia.webp",             color: "#8a6d2d",  slug: "rafias",             soon: false
        },
        {
          title: "تغليف مرن",     tag: "القسم 04",
          description: "أفلام عالية الحاجز وتصفيح متخصص. حماية مثلى للأغذية والمنتجات الصناعية بتقنية متطورة.",
          img: "/images/divisiones/bolsa.webp",             color: "#0d7377",  slug: "empaques-flexibles", soon: false
        },
        {
          title: "أكياس",          tag: "القسم 05",
          description: "أكياس رافيا بجودة فائقة. حل تعبئة متين للأغذية والمنتجات الكيميائية والأسمدة والمنتجات السائبة.",
          img: "/images/divisiones/sacos.webp",             color: "#3a7d44",  slug: "sacos",              soon: false
        },
        {
          title: "فيلم التغليف",   tag: "القسم 06",
          description: "فيلم قابل للتمدد بوضوح بصري عالٍ. يضمن سلامة الحمولة بكفاءة في التكاليف. يشمل خيار قابل للتحلل الحيوي.",
          img: "/images/divisiones/film-estirable.webp",    color: "#2c5f8a",  slug: "stretch-film",       soon: false
        },
        {
          title: "واقي زوايا",     tag: "القسم 07",
          description: "واقيات زوايا من كرتون كرافت لحماية الحواف أثناء التخزين والنقل. توزيع متساوٍ للضغط واستقرار أقصى للأحمال.",
          img: "/images/divisiones/esquineros.webp",        color: "#7b3fa0",  slug: "esquineros",         soon: false
        },
        {
          title: "منتجات قابلة للاستهلاك", tag: "القسم 10",
          description: "منتجات قابلة للاستهلاك من البولي بروبيلين للاستخدام الصناعي والغذائي والمستشفيات. حلول صحية واقتصادية وعالية المقاومة.",
          img: "/images/divisiones/desechables.webp",       color: "#e05500",  slug: "desechables",        soon: true
        }
      ]
    },

    porque: {
      tag:           "لماذا تختارنا",
      title:         "أكثر من 65 عاماً",
      title_em:      "من الريادة",
      body:          "نحن مرجع في صناعة البوليمرات البلاستيكية في المكسيك وأمريكا اللاتينية، مع عمليات معتمدة وقدرة استجابة عالمية.",
      btn:           "تاريخنا",
      badge1_label:  "وحدات أعمال",
      badge1_number: 10,
      badge2_label:  "أقسام",
      badge2_number: 6,
      img:           "/images/planta-produccion.webp",
      features: [
        { title: "جودة معتمدة",     description: "منتجات تلبي أعلى المعايير الدولية في التصنيع." },
        { title: "ابتكار مستمر",    description: "استثمار دائم في البحث والتطوير للحفاظ على الريادة التقنية في القطاع." },
        { title: "انتشار عالمي",    description: "حضور نشط في 5 قارات مع شبكة توزيع فعالة." }
      ]
    },

    certs: {
      tag:      "جودة مضمونة",
      title:    "شهاداتنا",
      title_em: "المعتمدة",
      items: [
        { code: "Kosher Pareve", name: "KMD México",     img: "/images/certificaciones/KOSHER.jpeg"   },
        { code: "FSSC 22000",    name: "LRQA Certified", img: "/images/certificaciones/LRQA.png"      },
        { code: "AIB International", name: "Since 1919", img: "/images/certificaciones/AIB.png"       },
        { code: "ISO 9001",      name: "Bureau Veritas", img: "/images/certificaciones/CERTIFIED.png" }
      ]
    },

    compromiso: {
      card1: {
        eyebrow: "تركيزنا",
        title:   "الابتكار",
        text:    "نستثمر في البحث والتطوير لتقديم منتجات تتجاوز توقعات السوق العالمي بتقنية متطورة."
      },
      card2: {
        eyebrow: "التزامنا",
        title:   "الاستدامة",
        text:    "عمليات مسؤولة تجاه البيئة، برامج نشطة لإعادة التدوير وتقليل البصمة الكربونية في كامل سلسلة القيمة."
      }
    },

    global: {
      tag:      "حضور عالمي",
      title:    "نُصدّر إلى",
      title_em: "العالم",
      desc:     "تصل منتجاتنا إلى عملاء في أكثر من 30 دولة، مما يرسّخ مكانتنا كرواد في البوليمرات البلاستيكية.",
      video:    "/camion.mp4",
      stats: [
        { number: 65,   label: "سنة"      },
        { number: 30,   prefix: "+", label: "دولة"    },
        { number: 3000, prefix: "+", label: "شخص"     },
        { number: 5,    prefix: "",  label: "قارات"   }
      ]
    },

    cta: {
      tag:      "هل أنت مستعد للبدء؟",
      title:    "لنعمل",
      title_em: "معاً",
      sub:      "اكتشف كيف يمكن لحلولنا أن تحوّل عملياتك",
      btn:      "اتصل بنا"
    }
  }

};