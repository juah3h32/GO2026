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
    distributor: 'موزع',
    contact: 'اتصل بنا'
  },

  // =================================================
  // البانر الرئيسي
  // =================================================
  hero: {
    title: "مرحباً بكم",
    subtitle: "جودة تدوم"
  },

  // =================================================
  // النصوص المشتركة
  // =================================================
  common: {
    seeMore: "عرض المزيد",
    division: "قسم",
    buy: "شراء",
    redirecting: "جارٍ التحويل...",
    download: "تحميل",
    language: "اللغة",
    scrollDown: "اسحب للأسفل",
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

  pwa: {
    appName: "Grupo Ortiz",
    title: "تثبيت تطبيق GO",
    description: "وصول سريع من شاشتك الرئيسية",
    install: "تثبيت",
    notNow: "ليس الآن",
    timeLabel: "الآن"
  },

  // =================================================
  // صفحة العروض
  // =================================================
  promociones: {
    meta_title: "العروض | Grupo Ortiz",
    hero: {
      label: "عروض خاصة",
      title: "العروض والتخفيضات",
      subtitle: "استفد من عروضنا المحدودة",
      validity: "صالح حتى نفاد المخزون*"
    },
    discount_badge: "حتى",
    off_text: "خصم",
    original_price: "السعر الأصلي",
    promo_price: "السعر الخاص",
    buy_button: "طلب عرض سعر",
    contact_cta: "تواصل مع مستشار للمزيد من المعلومات",
    valid_until: "صالح حتى نفاد المخزون*",

    products: [
      {
        id: "promo-stretch",
        name: "فيلم التغليف المطاطي",
        subtitle: "33$ للكيلوغرام على فيلم التغليف الملون",
        image: "/images/stretch/manual.webp",
        discount: 35,
        originalPrice: "",
        promoPrice: "33$/كغ",
        features: [
          "فيلم تغليف مطاطي ملون",
          "سعر خاص لكل كيلوغرام",
          "مخزون محدود",
          "متوفر بألوان متعددة"
        ],
        validUntil: "صالح حتى نفاد المخزون*"
      },
      {
        id: "promo-cuerda",
        name: "حبل",
        subtitle: "33$ للكيلوغرام",
        image: "/images/cuerdas/CuerdaT1.webp",
        discount: 25,
        originalPrice: "",
        promoPrice: "33$/كغ",
        features: [
          "حبل عالي الجودة",
          "سعر خاص لكل كيلوغرام",
          "عرض لفترة محدودة",
          "التوفر رهن المخزون"
        ],
        validUntil: "صالح حتى نفاد المخزون*"
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
      description: "الجودة والحلول المتكاملة في وثيقة واحدة. اختر لغتك المفضلة للاطلاع على عرضنا المؤسسي.",
      scrollText: "عرض الأقسام"
    },
    carousel: {
      label: "التنزيلات المتاحة",
      title: "الكتالوج حسب القسم",
    },
    languageLabel: "Language / Idioma",
    downloadButton: "تحميل PDF",
    divisions: [
      {
        id: "1",
        name: "فيلم التغليف المطاطي",
        desc: "فيلم مطاطي لتثبيت البضائع وحمايتها. حل فعّال للتلبيس على المنصات والنقل الآمن.",
        image: "/images/catalogo/img1.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1HYGcpgkRO_7OX22IcWvRpzpLZKgpYV3A/view?usp=sharing",
          en: "https://drive.google.com/file/d/1QZ6jmKyc-CGLwh9brbeZSQ5OOzkKdBCQ/view?usp=sharing",
        }
      },
      {
        id: "2",
        name: "الحبال",
        desc: "متانة وصلابة للربط الصناعي وصناعة الصيد. مصنوعة من مواد عالية الجودة للاستخدام المكثف.",
        image: "/images/catalogo/img2.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/14GrV9P1ViQKvFp3BucYjgmryRgWKLEZh/view?usp=sharing",
          en: "https://drive.google.com/file/d/19Tvd_VHjogSE7y7cLZYr4ra__4vB4nOm/view?usp=sharing",
        }
      },
      {
        id: "3",
        name: "خيوط الرافيا",
        desc: "المعيار في التثبيت للزراعة والصناعة. مادة متينة ومرنة لتطبيقات متعددة.",
        image: "/images/catalogo/img3.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1uAiR4uxO2iX_LsNFul6kXeb7jnnCEV_J/view?usp=sharing",
          en: "https://drive.google.com/file/d/10PV-sxexE8UkFSOhdTJBe1xWCy_tdFib/view?usp=sharing",
        }
      },
      {
        id: "4",
        name: "أكياس الشبك",
        desc: "نسيج شبكي مفتوح لتهوية زراعية مثلى. حلول متعددة الاستخدام لتعبئة ونقل منتجات الحقل.",
        image: "/images/catalogo/img4.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1OQKGpnRCfA2yFdAlT6q7GczYua2FFFVU/view?usp=sharing",
          en: "https://drive.google.com/file/d/1wldGL6XuqH-Ruth9Y01-hkNnPlbg9SW5/view?usp=sharing",
        }
      },
      {
        id: "5",
        name: "أكياس البولي بروبيلين",
        desc: "بولي بروبيلين منسوج مسطح للتعبئة بالجملة. متانة عالية للمنتجات السائبة.",
        image: "/images/catalogo/img5.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/16S43-PUrQECO9q2J1fOgbN-YeIxQ2GhP/view?usp=sharing",
          en: "https://drive.google.com/file/d/1fkZvAWTT3mnBkxQ0Gbb2kRgOoN2dJZiK/view?usp=sharing",
        }
      },
      {
        id: "6",
        name: "واقي الزوايا",
        desc: "حماية هيكلية واستقرار للمنصات. تعزيز أساسي في الخدمات اللوجستية وتخزين البضائع.",
        image: "/images/catalogo/img6.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/181Hvr0HQffLU3rmcXkccYoqj-Y_A-gxr/view?usp=sharing",
          en: "https://drive.google.com/file/d/1DdcEavACvuY00oyMyC9rOWRybi9jnQrD/view?usp=sharing",
        }
      },
      {
        id: "7",
        name: "التغليف المرن",
        desc: "أفلام عالية الحاجز وتصفيح متخصص. حماية مثلى للمواد الغذائية والمنتجات الصناعية.",
        image: "/images/catalogo/img7.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1TGxUcGHjW1NHF8K8YkRisbRE8uAuTnPO/view?usp=sharing",
          en: "https://drive.google.com/file/d/126eYsoqq9WI1SR-zoMdQJE7HS8cJR48m/view?usp=sharing",
        }
      }
    ]
  },

  // =================================================
  // القائمة الرئيسية (كاروسيل المنتجات)
  // =================================================
  products_list: [
    {
      img: "carrusel/img1.webp",
      division: "فيلم التغليف المطاطي",
      descripcion: "فيلم تغليف مطاطي عالي الشفافية البصرية ومعايير الجودة. يضمن سلامة البضائع وكفاءة التكاليف. تتضمن تشكيلتنا خيار قابل للتحلل البيولوجي، مصمم للتحلل بسرعة أكبر بنسبة 90٪.",
      slug: "stretch-film",
      video: "carrusel/stretch-film.mp4"
    },
    {
      img: "carrusel/img2.webp",
      division: "الحبال",
      descripcion: "حبل خيوط بولي بروبيلين (PP) عالي الأداء. توازن مثالي: خفة فائقة دون التضحية بمقاومة الكسر.",
      slug: "cuerdas",
      video: "carrusel/cuerdas.mp4"
    },
    {
      img: "carrusel/img3.webp",
      division: "خيوط الرافيا",
      descripcion: "خيوط رافيا من فيلم البولي بروبيلين (PP) عالية الأداء. خفيفة الوزن جداً وعالية مقاومة الكسر. مرنة ومتعددة الاستخدامات.",
      slug: "rafias",
      video: "carrusel/rafia.mp4"
    },
    {
      img: "carrusel/img4.webp",
      division: "أكياس الشبك",
      descripcion: "أكياس شبك رافيا البولي بروبيلين بنسيج مسطح وخياطة معززة من نوع 'L'. تصميم مهوى مثالي للفواكه والخضروات.",
      slug: "arpillas",
      video: "carrusel/arpillas.mp4"
    },
    {
      img: "carrusel/img5.webp",
      division: "أكياس البولي بروبيلين",
      descripcion: "أكياس رافيا عالية الجودة. حل تعبئة متين للمواد الغذائية والمواد الكيميائية والأسمدة.",
      slug: "sacos",
      video: "carrusel/sacos.mp4"
    },
    {
      img: "carrusel/img6.webp",
      division: "واقي الزوايا",
      descripcion: "واقيات زوايا كرتونية لتحسين الخدمات اللوجستية. متانة هيكلية أكبر واستقرار محسّن للبضائع.",
      slug: "esquineros",
      video: "carrusel/esquineros.mp4"
    },
    {
      img: "carrusel/img7.webp",
      division: "التغليف المرن",
      descripcion: "تتخصص Neo Empaques International في حلول التغليف المرن المتقدمة، المصممة لتحسين الحفظ وتقديم المنتجات في صناعات متعددة.",
      slug: "empaques-flexibles",
      video: "carrusel/bobina-impresa.mp4"
    }
  ],

  // =================================================
  // صفحة: فيلم التغليف المطاطي
  // =================================================
  stretch_film: {
    meta_title: "فيلم التغليف المطاطي | Grupo Ortiz",
    back_aria: "العودة إلى المنتجات",
    specs_title: "المواصفات التقنية",

    specs_labels: {
      width: "العرض",
      length: "الطول",
      gauge: "السماكة/الميكرون",
      weight: "وزن اللفة",
      type: "الاستخدام"
    },

    products: [
      {
        name: 'فيلم تغليف ممتاز',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "مصمم للتلبيس اليدوي على المنصات، يوفر هذا الفيلم المطاطي متوسط الإطالة حلاً عملياً وفعّالاً لتثبيت البضائع دون الحاجة إلى آلات أوتوماتيكية. تضمن تركيبته مقاومة جيدة وأداءً موثوقاً في عمليات التعبئة.",
        specs_values: { width: "19-30 سم", length: "1000-15000", gauge: "40-110", weight: "10-40 كغ", type: "يدوي" },
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
        description: "مصمم للاستخدام مع آلات التلبيف منخفضة ومتوسطة السرعة، يوفر هذا الفيلم المطاطي أداءً عالياً ونتائج ممتازة في عمليات التلبيس الآلي على المنصات. تضمن تركيبته المقاومة والاستقرار في تثبيت البضائع.",
        specs_values: { width: "18-30 سم", length: "2000-15000", gauge: "50-110", weight: "10-49 كغ", type: "أوتوماتيكي" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      },
      {
        name: 'يدوي مسبق الشد',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "مصمم للتطبيق اليدوي عالي الأداء، يتميز هذا الفيلم المسبق الشد بكونه من أرق الأفلام في السوق. تقنيته تلغي الحاجة لبذل قوة إضافية عند التلبيف، مما يسهّل استخدامه الفوري ويحسّن الكفاءة في عملية التلبيس على المنصات.",
        specs_values: { width: "16-17 سم", length: "7000-25000", gauge: "40-120", weight: "10-40 كغ", type: "يدوي" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      },
      {
        name: 'شريط تغليف يدوي',
        img: '/images/stretch/manual.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "مصمم للتطبيق اليدوي بإطالة معتدلة، يوفر هذا الفيلم المطاطي التقليدي أداءً ممتازاً في عمليات التعبئة وتثبيت البضائع. تضمن تركيبته المقاومة والاستقرار في التطبيقات العامة.",
        specs_values: { width: "3-12 سم", length: "7000-25000", gauge: "40-120", weight: "10-40 كغ", type: "يدوي" },
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
        description: "مُركَّب خصيصاً لتطبيقات التلبيف اليدوي بإطالة محدودة، يوفر هذا الفيلم المطاطي أداءً عالياً وموثوقية كبيرة في عمليات التعبئة. تضمن تركيبته الاستقرار والكفاءة في تثبيت البضائع.",
        specs_values: { width: "17-30 سم", length: "1000-15000", gauge: "40-90", weight: "10-40 كغ", type: "يدوي", color: "أسود/ملون" },
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
    meta_title: "الحبال | Grupo Ortiz",
    back_aria: "رجوع",
    loading: "جارٍ التحميل...",
    specs_title: "المواصفات التقنية",

    specs_labels: {
      load: "الإنتاجية",
      mat: "المادة",
      weight: "الوزن",
      resist: "المقاومة",
      charge: "المواصفة"
    },

    products: [
      {
        name: 'حبل الأعمال الشاقة',
        img: '/images/cuerdas/CuerdaT1.webp',
        video: "/videos/cuerdas/cuerda-1.mp4",
        link: '#',
        description: "مصنوع من البولي بروبيلين مع فلتر UV متطور، هذا الحبل مثالي للأنشطة ذات التعرض العالي للشمس. تركيبته المتخصصة تُبطئ التآكل الطبيعي وتطيل عمره الافتراضي، مضمونةً مقاومة أكبر ومتانة في مواجهة العوامل الجوية. إنه الحبل المثالي للأعمال الشاقة لتوفير الصلابة والأمان والأداء الموثوق في التطبيقات العامة.",
        specs_values: { load: "1,980 م", mat: "PP-UV", weight: "18 كغ", resist: "175 كغ", charge: "4-19 مم" },
        gallery: [
          '/images/cuerdas/CuerdaT1-2.png',
          '/images/cuerdas/CuerdaT1.webp',
          '/images/cuerdas/CuerdaT1-1.png'
        ]
      },
      {
        name: 'حبل البيوت المحمية',
        img: '/images/cuerdas/CuerdaNegra.webp',
        video: "/videos/cuerdas/CuerdaI.mp4",
        link: '#',
        description: "مصنوع من البولي بروبيلين (PP) ومثبت UV، هذا الحبل مثالي لقطاع الملاحة والأنشطة ذات التعرض العالي للشمس. تركيبته المتخصصة تُبطئ التدهور الناجم عن الأشعة فوق البنفسجية وتطيل عمره الافتراضي وتضمن مقاومة أكبر للعوامل الجوية. إنه الحل المثالي لتوفير الصلابة والاستقرار في الأنفاق الزراعية الكبيرة.",
        specs_values: { load: "3,240 م", mat: "PP-UV", weight: "18 كغ", resist: "105 كغ", charge: "3-8 مم" },
        gallery: [
          '/images/cuerdas/CuerdaNegra6-1.png',
          '/images/cuerdas/CuerdaNegra.webp',
          '/images/cuerdas/CuerdaNegra6-3.png'
        ]
      },
      {
        name: 'حبل إيكولوجي',
        img: '/images/cuerdas/CuerdaEco.png',
        video: "/videos/cuerdas/CuerdaE.mp4",
        link: '#',
        description: "مصنوع من البولي بروبيلين (PP) عالي الجودة، يوفر هذا الحبل مجموعة واسعة من المواصفات والأحجام والألوان، متوفر بإصدارات سادة أو مركبة، معززة أو بعلامة. تجعله مرونته ومتانته خياراً موثوقاً لتطبيقات متعددة في المصانع والمستودعات والأسواق وورش الصيانة.",
        specs_values: { load: "3,240 م", mat: "PP-UV", weight: "18 كغ", resist: "105 كغ", charge: "3-8 مم" },
        gallery: [
          '/images/cuerdas/CuerdaEco1.png',
          '/images/cuerdas/CuerdaEco.png',
          '/images/cuerdas/CuerdaEco3.png'
        ]
      }
    ]
  },

  // =================================================
  // صفحة: خيوط الرافيا
  // =================================================
  rafias: {
    meta_title: "خيوط الرافيا | Grupo Ortiz",
    back_aria: "رجوع",
    specs_title: "المواصفات التقنية",

    specs_labels: {
      cal: "الحجم",
      yield: "الإنتاجية (م)",
      resist: "المقاومة (كغ)",
      usage: "المادة"
    },

    products: [
      {
        name: "رافيا للربط",
        description: "مصنوعة من بولي بروبيلين بكر 100٪، توفر هذه الرافيا مقاومة عالية وإنتاجية ممتازة مع الحفاظ على خصائصها الفيزيائية حتى في الظروف الجوية القاسية. جودتها تضمن المتانة والأداء الموثوق في التطبيقات المتطلبة. تُستخدم على نطاق واسع في قطاعات الزراعة وتربية الدواجن والبستنة.",
        img: "/images/rafias/atar.png",
        video: "/videos/rafia/fondoN.mp4",
        specs_values: {
          cal: "2-8 مم",
          yield: "90 كغ",
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
        name: "رافيا إيكولوجية",
        description: "مصنوعة من بولي بروبيلين عالي الجودة، توفر هذه الرافيا مقاومة ممتازة وتحافظ على خصائصها الفيزيائية حتى في الظروف الجوية القاسية. إنتاجيتها الموثوقة تجعلها خياراً مثالياً لتطبيقات الزراعة وتربية الدواجن والبستنة.",
        img: "/images/rafias/Eco.png",
        video: "/videos/rafia/fondoE.mp4",
        specs_values: {
          cal: "2-8",
          yield: "90-500 كغ",
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
        name: "رافيا مشققة سوداء",
        description: "مصنوعة من بولي بروبيلين عالي الجودة، توفر هذه الرافيا مقاومة كبيرة وتحافظ على خصائصها الفيزيائية حتى في الظروف الجوية القاسية. إنتاجيتها الممتازة تجعلها مثالية للتطبيقات الصناعية والتغليف، وكذلك لقطاعات الزراعة وتربية الدواجن والبستنة.",
        img: "/images/rafias/negra.png",
        video: "/videos/rafia/fondoR.mp4",
        specs_values: {
          cal: "2-8",
          yield: "90-500 كغ",
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
  // صفحة: أكياس الشبك
  // =================================================
  arpillas: {
    meta_title: "أكياس الشبك | Grupo Ortiz",
    back_aria: "رجوع",
    specs_title: "المواصفات التقنية",

    specs_labels: {
      construction: "البنية",
      sizes: "العرض",
      colors: "الألوان",
      features: "نوع الإغلاق"
    },

    products: [
      {
        name: 'كيس شبك دائري',
        img: '/images/arpillas/arpilla.webp',
        video: "/videos/arpilla/circular.mp4",
        link: '#',
        description: "مصنوع من بولي بروبيلين بكر 100٪ بتركيبة رافيا، يوفر هذا الكيس الشبكي مقاومة عالية وإنتاجية ممتازة في تطبيقات التعبئة والتخزين. جودته تضمن المتانة والأداء الموثوق في التعامل مع المنتجات المختلفة.",
        specs_values: {
          sizes: "23-70 سم",
          colors: "4",
          features: "خيط سحب"
        },
        gallery: [
          '/images/arpillas/circular2.webp',
          '/images/arpillas/arpilla.webp',
          '/images/arpillas/circular3.webp'
        ]
      },
      {
        name: 'كيس شبك أحادي الخيط',
        img: '/images/arpillas/arpilla2.webp',
        video: "/videos/arpilla/mono.mp4",
        link: '#',
        description: "مصنوع من بولي بروبيلين بكر 100٪ بتركيبة رافيا/خيط أحادي، يوفر هذا الكيس الشبكي مقاومة عالية وإنتاجية ممتازة في تطبيقات التعبئة والتخزين. هيكله يوفر المتانة والأداء الموثوق في التعامل وحماية المنتجات المختلفة.",
        specs_values: {
          construction: "خيط أحادي",
          sizes: "23-70 سم",
          colors: "2",
          features: "خيط سحب"
        },
        gallery: [
          '/images/arpillas/mono2.webp',
          '/images/arpillas/arpilla2.webp',
          '/images/arpillas/mono3.webp'
        ]
      },
      {
        name: 'كيس شبك بخياطة جانبية',
        img: '/images/arpillas/arpilla3.webp',
        video: "/videos/arpilla/costura.mp4",
        link: '#',
        description: "مصنوع من بولي بروبيلين بكر 100٪ بتركيبة رافيا/خيط أحادي، يوفر هذا الكيس الشبكي مقاومة عالية وأداءً ممتازاً في تطبيقات التعبئة والتخزين. هيكله يضمن المتانة والموثوقية في التعامل مع المنتجات المختلفة.",
        specs_values: {
          type: "جانبي",
          construction: "خيط أحادي",
          sizes: "23-60 سم",
          colors: "4",
          features: "معزز"
        },
        gallery: [
          '/images/arpillas/lateral1.webp',
          '/images/arpillas/arpilla3.webp',
          '/images/arpillas/lateral3.webp'
        ]
      },
      {
        name: 'كيس شبك بطاقة مصفّحة',
        img: '/images/arpillas/arpilla4.webp',
        video: "/videos/arpilla/etiqueta.mp4",
        link: '#',
        description: "مصنوع من بولي بروبيلين بكر 100٪ بتركيبة رافيا/رافيا، يوفر هذا الكيس الشبكي مقاومة عالية وأداءً ممتازاً في عمليات التعبئة والتخزين. نسيجه يضمن المتانة والموثوقية للتطبيقات المتطلبة في السوقين المحلي والتصديري.",
        specs_values: {
          type: "مصفّح",
          construction: "رافيا",
          sizes: "23-70 سم",
          colors: "4",
          features: "خيط سحب"
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
  // صفحة: الأكياس
  // =================================================
  sacos: {
    meta_title: "الأكياس | Grupo Ortiz",
    back_aria: "العودة إلى المنتجات",
    specs_title: "المواصفات التقنية",

    specs_labels: {
      load: "العرض",
      unit: "الطول",
      mat: "المادة",
      weight: "المقاومة"
    },

    products: [
      {
        name: 'كيس رافيا غير مصفّح',
        img: '/images/sacos/saco2.png',
        model: '/models/saco_blanco.glb',
        video: "/videos/saco/slaminar.mp4",
        link: '#',
        description: "مصنوعة من شرائط بولي بروبيلين متشابكة، توفر أكياس الرافيا غير المصفّحة مقاومة كبيرة ومتانة ممتازة في تطبيقات التعبئة والتخزين. هيكلها يتحمل الأحمال الثقيلة دون تمزق، مضموناً أداءً موثوقاً في الأعمال المتطلبة.",
        specs_values: {
          load: "35-80 سم",
          unit: "49-115 سم",
          mat: "PP",
          weight: "120-200 كغق"
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
        description: "مصنوعة من شرائط بولي بروبيلين بتشطيب شفاف، توفر هذه الأكياس مقاومة عالية وتتيح رؤية ممتازة للمنتج المعبأ. هيكلها يضمن المتانة والأداء الموثوق في تطبيقات التخزين والنقل.",
        specs_values: {
          load: "35-80 كغ",
          unit: "49-115 سم",
          mat: "PP",
          weight: "120-200 كغق"
        },
        gallery: [
          '/images/sacos/laminado2.png',
          '/images/sacos/saco.png',
          '/images/sacos/laminado3.png'
        ]
      },
      {
        name: 'كيس رافيا إيكولوجي',
        img: '/images/sacos/saco3.png',
        video: "/videos/saco/eco.mp4",
        link: '#',
        description: "مصنوعة من مواد معاد تدويرها من نفايات نفس عملية الإنتاج، توفر هذه الأكياس مقاومة ومتانة جيدة بتكلفة أكثر اقتصادية. تصنيعها يتيح أداءً موثوقاً في تطبيقات التعبئة والتخزين العامة.",
        specs_values: {
          load: "30-80 كغ",
          unit: "49-115 سم",
          mat: "PP",
          weight: "120-200 كغق"
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
    back_aria: "رجوع",
    specs_title: "المواصفات التقنية",

    specs_labels: {
      tab:      "الجناح",
      thick:    "السماكة",
      length:   "الطول",
      tabyd:    "الجناح (ياردة)",
      thickyd:  "السماكة (ياردة)",
      lengthyd: "الطول (ياردة)"
    },

    products: [
      {
        name: "واقي زاوية كرافت بني",
        description: "مصنوع لحماية الحواف والزوايا أثناء النقل والتخزين، يوزع هذا الواقي الضغط بشكل منتظم، مانعاً التشوه والأضرار في البضائع. هيكله يوفر المقاومة والاستقرار في تطبيقات التعبئة المتطلبة.",
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
        name: "واقي زاوية كرافت أبيض",
        description: "مصنوع لحماية الحواف والزوايا أثناء النقل والتخزين، يوزع هذا الواقي الضغط بشكل منتظم، مانعاً التشوه والأضرار في البضائع. هيكله يوفر المقاومة والاستقرار في تطبيقات التعبئة المتطلبة.",
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
    specs_title: "المواصفات التقنية",

    specs_labels: {
      lamination: "التصفيح",
      finish:     "التشطيب",
      size:       "الأبعاد حتى",
      zipper:     "سحّاب",
      type:       "النوع"
    },

    products: [
      {
        name: "بكرة مطبوعة",
        description: "تتميز بكراتنا بمجموعة واسعة من طبقات التصفيح والسماكات والتشطيبات. مع خيار طباعة يصل إلى 10 ألوان و133 خطاً في البوصة. أقصى تطوير: 1,140 مم. أقصى عرض طباعة: 1,450 مم. متوافقة مع آلات التعبئة الأوتوماتيكية لتحسين كفاءة الإنتاج.",
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
          zipper:     "غير متاح",
          type:       "بكرة"
        }
      },
      {
        name: "كيس ستاند آب",
        description: "أكياس ستاند آب متعددة الاستخدامات بهيكل مصفّح وحاجز عالٍ ضد الرطوبة والأكسجين. مثالية للأغذية الجافة أو الرطبة والمساحيق والسوائل ومستحضرات التجميل والمواد الكيميائية. متوفرة بتشطيبات طبيعية وغير لامعة وميتاليك، بأحجام من 150 غ حتى 1 كغ، مع خيار إغلاق بسحّاب ونافذة شفافة.",
        img: "/images/flexible/standup-generica.png",
        video: "/videos/flexible/standup.mp4",
        gallery: [
          "/images/flexible/standup-generica-2.png",
          "/images/flexible/standup-generica.png",
          "/images/flexible/standup-generica-3.png"
        ],
        specs_values: {
          lamination: "مصفّح",
          finish:     "3 أنواع",
          size:       "1 كغ",
          zipper:     "نعم / لا",
          type:       "كيس"
        }
      },
      {
        name: "ستاند آب بوتش",
        description: "تشكيلة أكياس بتصاميم زخرفية جذابة: توت أحمر، وزهور، وفواكه، وسنابل، وهدية زرقاء وهدية وردية. إغلاق بسحّاب، هيكل متين، وتشطيبات طبيعية أو ميتاليك. متوفرة بأحجام من 150 غ حتى 1 كغ. مثالية لمن يبحث عن تغليف عالي الجودة وجذاب بصرياً.",
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
          size:       "1 كغ",
          zipper:     "نعم",
          type:       "كيس مطبوع"
        }
      },
      {
        name: "كيس تفريغ عالٍ",
        description: "مصممة لتعظيم نضارة وعمر صلاحية اللحوم والأجبان والمنتجات المدخنة والطازجة. إحكام إغلاقها يزيل الهواء ويحافظ على الخصائص الطبيعية للمنتج ويمنع فقدان النكهة والقوام والجودة. مصنوعة من مواد عالية المقاومة والحاجز.",
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
  // صفحة: الموزع
  // =================================================
  distribuidor: {
    meta_title: "موزع Grupo Ortiz | الشريك الرسمي",
    hero: {
      subtitle: "بوابة تجار الجملة",
      title: "ضاعف<br><span>أرباحك</span>",
      desc: "وزّع منتجات عالية الطلب بدعم من الشركة المصنّعة الرائدة. مخزون مضمون، بدون وسطاء ولوجستيات خلال 24 ساعة.",
      cta: "ابدأ الآن"
    },
    cards: [
      { icon: "ri-stack-line",        title: "مخزون كامل",    desc: "قدرة على تلبية الطلبات الكبيرة فوراً. مستودعك دائماً ممتلئ." },
      { icon: "ri-truck-line",        title: "شحن في 24 ساعة", desc: "لوجستيات خاصة. عملاؤك لا ينتظرون، نسلّم في وقت قياسي." },
      { icon: "ri-shield-check-line", title: "ضمان الجودة",    desc: "استبدال فوري دون بيروقراطية أو أسئلة. دعم كامل للعلامة التجارية." },
      { icon: "ri-line-chart-line",   title: "هامش أفضل",     desc: "أسعار مباشرة من المصنع مصممة لتعظيم صافي ربحك." }
    ],
    stats: [
      { val: 25, symbol: "k", label: "طن شهرياً"      },
      { val: 35, symbol: "+", label: "عاماً من التاريخ" },
      { val: 15, symbol: "M", label: "إجمالي المبيعات"  }
    ],
    form: {
      title: "طلب<br>التسجيل",
      desc: "انضم إلى الشبكة. أكمل ملفك الشخصي لتحديد منطقتك وقائمة أسعارك التفضيلية.",
      support_label: "دعم مباشر",
      labels: {
        name:     "اسم جهة الاتصال",
        business: "اسم الشركة",
        whatsapp: "واتساب",
        email:    "البريد الإلكتروني",
        products: "المنتجات المطلوبة"
      },
      products_list: ["أكياس", "تغليف مرن", "رافيا", "واقي زاوية", "حبال", "فيلم مطاطي", "أخرى", "الكل"],
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
      title_white:   "مسيرتنا",
      title_orange:  "عبر الزمن",
      nav_prev:      "السابق",
      nav_next:      "التالي",
      video_bg:      "/videos/background.mp4",
      video_bg_webm: "",
      video_poster:  "",
      events: [
        { year: "1959", title: "البداية",               short: "التأسيس في موريليا",        img: "/images/tiempo/timeline-1959.webp",  description: "منذ عام 1959، كان Grupo Ortiz جزءاً من التطور الصناعي في المكسيك. تأسست المجموعة في موريليا على يد نيكاندرو أورتيز، وولدت برؤية راسخة: الجمع بين أحدث التقنيات وموهبة وتفاني موظفيها لبناء شركة صلبة ومبتكرة وملتزمة بالجودة." },
        { year: "1970", title: "التوسع الصناعي",        short: "الأكياس وأكياس الشبك",     img: "/images/tiempo/timeline-1970.webp",  description: "في عام 1970، بدأنا إنتاج الأكياس وأكياس الشبك من البولي بروبيلين، مما شكّل مرحلة محورية في نمونا الصناعي. عزّزت هذه الخطوة الاستراتيجية قدرتنا التشغيلية ووسّعت حضورنا التجاري ورسّخت مكانتنا في السوق المحلية." },
        { year: "1985", title: "الابتكار التكنولوجي",   short: "آلات أوروبية",             img: "/images/tiempo/timeline-1985.webp",  description: "في عام 1985، أدخلنا آلات أوروبية متطورة، مما عزّز بنيتنا التحتية الصناعية وحسّن عملياتنا الإنتاجية. هذا الاستثمار الاستراتيجي رفع معايير جودتنا وزاد الكفاءة التشغيلية وأكد التزامنا بالابتكار التكنولوجي." },
        { year: "1995", title: "التنويع",               short: "خطوط إنتاج جديدة",        img: "/images/tiempo/timeline-1995.webp",  description: "في عام 1995، وسّعنا خطوط إنتاجنا بإضافة فيلم التغليف المطاطي والتغليف المرن والمنتجات الصناعية المتخصصة. وسّع هذا التوسع الاستراتيجي محفظتنا وعزّز تنافسيتنا في القطاع وأتاح لنا تلبية متطلبات السوق المحلية الجديدة." },
        { year: "2005", title: "التوسع الدولي",         short: "الأمريكتان وأوروبا",       img: "/images/tiempo/timeline-2005.webp",  description: "في عام 2005، بدأنا التصدير إلى الأمريكتين وأوروبا، مما شكّل خطوة حاسمة في توسعنا الدولي. أهّلت هذه الإنجاز الشركة لتكون مرجعاً في صناعة البوليمرات البلاستيكية وعزّز حضورنا العالمي ورسّخ تنافسيتنا في الأسواق الدولية." },
        { year: "2015", title: "الاستدامة",             short: "مصنع إعادة التدوير",       img: "/images/tiempo/timeline-2015.webp",  description: "في عام 2015، أنشأنا مصنعاً لإعادة التدوير وعزّزنا برامج الاستدامة لدينا، مؤكدين التزامنا بالبيئة. هذه المبادرة الاستراتيجية حسّنت استخدام الموارد ودفعت نحو ممارسات مسؤولة ورسّخت رؤيتنا للنمو المستدام." },
        { year: "2026", title: "الحاضر",                short: "رائد صناعي",               img: "/images/tiempo/timeline-2026.webp",  description: "في عام 2026، نمتلك 17 مصنعاً للإنتاج وأكثر من 4,000 موظف وطاقة إنتاجية سنوية تبلغ 220,000 طن. يرسّخ هذا النمو المستدام مكانتنا كرواد في صناعة البلاستيك، مدعومين ببنية تحتية صلبة وكفاءات بشرية متخصصة ورؤية استراتيجية مستقبلية." }
      ]
    },

    filosofia: {
      label: "مبادئنا",
      title: "فلسفة GO",
      img:   "/images/about/GO.webp",
      items: [
        "الهوس برضا العميل لا بالمنافسة.",
        "الشغف بالاختراع والابتكار المستمر.",
        "التميز التشغيلي في كل عملية.",
        "التفكير بعيد المدى مع نتائج فورية.",
        "أن نكون أفضل صاحب عمل وأكثر بيئة عمل أماناً على الكوكب."
      ]
    },

    vision: {
      label: "إلى أين نتجه",
      title: "الرؤية",
      img:   "/images/about/GO2.webp",
      items: [
        "أن نكون الشركة الأكثر توجهاً نحو العميل على الكوكب.",
        "تقديم حلول متكاملة شاملة لأي عمل تجاري.",
        "أن نكون الحل الوحيد في التغليف لأي عمل تجاري على الكوكب.",
        "النمو بحضور عالمي دون فقدان التركيز الإنساني."
      ]
    },

    infraestructura: {
      title_white:  "بنية تحتية",
      title_orange: "تسندنا",
      stats: [
        { number: "10",      label: "مصانع الإنتاج",      desc: "منشآت موزعة استراتيجياً لخدمة الأسواق المحلية والدولية.", icon: "number" },
        { number: "+3,000",  label: "موظف",               desc: "فريق متخصص يقود كل عملية إنتاجية.", icon: "number" },
        { number: "260",     label: "وحدة لوجستية",       desc: "أسطولنا الخاص يضمن توزيعاً فعّالاً وتسليماً آمناً محلياً ودولياً.", icon: "number" },
        { number: "عالمي",   label: "حضور دولي",          desc: "تصدير وتوزيع في الأمريكتين وأوروبا.", icon: "globe" }
      ]
    },

    plantas: {
      title:           "مصانعنا",
      subtitle:        "17 مصنعاً للإنتاج",
      map_img:         "/images/about/mexico_map.png",
      layer_michoacan: "/images/about/michoacan_layer.png",
      layer_monterrey: "/images/about/monterrey_layer.png",
      layer_both:      "/images/about/both_states_layer.png",
      locations: [
        { key: "monterrey", number: "مصنع واحد",    badge: "مونتيري، نويفو ليون" },
        { key: "michoacan", number: "16 مصنعاً",    badge: "موريليا، ميتشواكان"  }
      ]
    },

    instalaciones: {
      title_white:  "منشآتنا",
      title_orange: "الإنتاجية",
      subtitle:     "جولات افتراضية 360°",
      badge_soon:   "قريباً",
      badge_tour:   "مشاهدة الجولة",
      btn_tour:     "مشاهدة الجولة ثلاثية الأبعاد",
      btn_soon:     "قريباً",
      items: [
        { id: "extrusoras", num: "01", title: "فيلم التغليف المطاطي", tag: "موريليا، ميتش.", desc: "خطوط بثق عالية الطاقة تحوّل البولي بروبيلين إلى خيط مسطح دقيق.",                        thumb: "/images/virtual/RT.webp", link: "https://my.matterport.com/show/?m=YoM2tyXMeyb&ss=2&sr=2.97,.12&play=1&qs=1&ts=1", soon: true  },
        { id: "telares",    num: "02", title: "أكياس الشبك",          tag: "موريليا، ميتش.", desc: "أنوال متطورة تنسج الخيط لإنتاج قماش بولي بروبيلين بأعلى درجات التجانس.",               thumb: "/images/virtual/RA.webp", link: "https://my.matterport.com/show/?m=2xCe1VajMjj&ss=1&sr=2.28,-1.47&play=1&qs=1&ts=1", soon: false },
        { id: "laminado",   num: "03", title: "التصفيح والطباعة",     tag: "موريليا، ميتش.", desc: "منطقة التصفيح والطباعة الفلكسوغرافية حيث تتلقى الأكياس التشطيبات والطباعة والمعالجة النهائية للجودة.", thumb: "/images/virtual/RS.webp", link: "", soon: true  },
        { id: "reciclado",  num: "04", title: "مصنع إعادة التدوير",   tag: "موريليا، ميتش.", desc: "مركزنا لإعادة تدوير البولي بروبيلين، الملتزم بالاقتصاد الدائري والبيئة.",                link: "", soon: true  }
      ]
    },

    capacidad: {
      title:         "الطاقة الإنتاجية المركّبة",
      subtitle:      "بنية تحتية عالية الأداء",
      planta_label:  "مصنع",
      plantas_label: "مصانع",
      items: [
        { num: "04", label: "إنتاج الأكياس",           width: 100, delay: 0   },
        { num: "02", label: "إنتاج أكياس الشبك",       width: 50,  delay: 100 },
        { num: "01", label: "الحبال والرافيا",          width: 25,  delay: 200 },
        { num: "02", label: "فيلم التغليف المطاطي",    width: 50,  delay: 300 },
        { num: "01", label: "التغليف المرن",            width: 25,  delay: 400 },
        { num: "01", label: "إعادة التدوير",           width: 25,  delay: 500 },
        { num: "03", label: "واقيات الزوايا",          width: 75,  delay: 600 },
        { num: "01", label: "شريط التغليف",            width: 25,  delay: 700 },
        { num: "01", label: "المنتجات المستهلكة",      width: 25,  delay: 800 },
        { num: "01", label: "الأكياس",                 width: 25,  delay: 900 }
      ]
    },

    valores: {
      title:    "قيمنا",
      subtitle: "ركائز ثقافتنا المؤسسية",
      items: [
        { title: "المسؤولية",  description: "نفي بالتزاماتنا بأخلاقية ومهنية، مدركين أثر أفعالنا على العملاء والموظفين والمجتمعات." },
        { title: "الثقة",      description: "نبني علاقات متينة قائمة على الشفافية والصدق والوفاء بالوعود، مولّدين الأمان في كل تفاعل." },
        { title: "الشغف",      description: "نحب ما نفعله ونعكسه في كل منتج وعملية وابتكار، ندفع التميز بحماس وتفانٍ حقيقي."       },
        { title: "المثابرة",   description: "نواجه التحديات بعزم وثبات، ونبقى راسخين في أهدافنا حتى نحقق نتائج استثنائية."          },
        { title: "الانضباط",   description: "نتبع عمليات صارمة ومعايير جودة بنظام ومنهجية، ضامنين الاتساق والتميز في كل تسليم."    },
        { title: "الاستباقية", description: "نستشرف الاحتياجات ونتخذ الإجراءات قبل ظهور المشكلات، خالقين حلولاً مبتكرة تولّد قيمة مستمرة." },
        { title: "الاحترام",   description: "نقدّر تنوع وكرامة ومساهمة كل شخص، نعزّز بيئة من التعاون والشمول والمعاملة العادلة."   }
      ]
    }
  },

  // =================================================
  // التذييل
  // =================================================
  footer: {
    about_us:         "من نحن",
    about:            "عن الشركة",
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
      title_top:        "نبني معاً",
      title_bottom:     "عالماً أفضل",
      subtitle:         "ندعم الأسر، نمكّن المرأة، نمنح فرصاً ثانية، ونهتم بكوكبنا. كل خطوة نخطوها تسعى إلى تحويل الحياة وبناء مستقبل مليء بالأمل.",
      stat_female:      "% الموظفات",
      stat_recycled:    "طن تم تدويره",
      stat_initiatives: "مبادرات نشطة",
      video:            "/videos/waves2.mp4",
    },

    ods: {
      title:       "بوصلتنا",
      subtitle:    "أجندة 2030",
      description: "نسترشد بأهداف الأمم المتحدة للتنمية المستدامة لبناء عالم أكثر عدلاً وازدهاراً واستدامة.",
      cards: [
        { n: 1,  title: "القضاء على الفقر",                    link: "https://sdgs.un.org/goals/goal1",  img: "/images/odc/1.png"  },
        { n: 2,  title: "القضاء التام على الجوع",              link: "https://sdgs.un.org/goals/goal2",  img: "/images/odc/2.png"  },
        { n: 3,  title: "الصحة الجيدة والرفاه",               link: "https://sdgs.un.org/goals/goal3",  img: "/images/odc/3.png"  },
        { n: 4,  title: "التعليم الجيد",                       link: "https://sdgs.un.org/goals/goal4",  img: "/images/odc/4.png"  },
        { n: 5,  title: "المساواة بين الجنسين",               link: "https://sdgs.un.org/goals/goal5",  img: "/images/odc/5.png"  },
        { n: 6,  title: "المياه النظيفة والصرف الصحي",        link: "https://sdgs.un.org/goals/goal6",  img: "/images/odc/6.png"  },
        { n: 7,  title: "طاقة نظيفة وبأسعار معقولة",         link: "https://sdgs.un.org/goals/goal7",  img: "/images/odc/7.png"  },
        { n: 8,  title: "العمل اللائق ونمو الاقتصاد",        link: "https://sdgs.un.org/goals/goal8",  img: "/images/odc/8.png"  },
        { n: 9,  title: "الصناعة والابتكار والبنية التحتية",  link: "https://sdgs.un.org/goals/goal9",  img: "/images/odc/9.png"  },
        { n: 10, title: "الحد من أوجه عدم المساواة",         link: "https://sdgs.un.org/goals/goal10", img: "/images/odc/10.png" },
        { n: 11, title: "مدن ومجتمعات مستدامة",              link: "https://sdgs.un.org/goals/goal11", img: "/images/odc/11.png" },
        { n: 12, title: "الاستهلاك والإنتاج المسؤولان",      link: "https://sdgs.un.org/goals/goal12", img: "/images/odc/12.png" },
        { n: 13, title: "العمل المناخي",                      link: "https://sdgs.un.org/goals/goal13", img: "/images/odc/13.png" },
        { n: 14, title: "الحياة تحت الماء",                  link: "https://sdgs.un.org/goals/goal14", img: "/images/odc/14.png" },
        { n: 15, title: "الحياة في البر",                    link: "https://sdgs.un.org/goals/goal15", img: "/images/odc/15.png" },
        { n: 16, title: "السلام والعدل والمؤسسات القوية",    link: "https://sdgs.un.org/goals/goal16", img: "/images/odc/16.png" },
        { n: 17, title: "عقد الشراكات لتحقيق الأهداف",      link: "https://sdgs.un.org/goals/goal17", img: "/images/odc/17.png" },
      ]
    },

    vision: {
      title:        "أثرنا",
      title_orange: "الإيجابي",
      subtitle:     "نحوّل الصناعة",
      pilars: [
        {
          label: "الركيزة 01",
          title: "منتجات الأرض",
          desc:  "تطوير مواد مبتكرة وصديقة للبيئة للتغليف المرن تحترم البيئة وتقلل البصمة الكربونية.",
          img:   "/images/impacto/products.webp"
        },
        {
          label: "الركيزة 02",
          title: "ممارسات الأرض",
          desc:  "تصنيع نظيف واقتصاد دائري في جميع عملياتنا الإنتاجية، إغلاق الدورات والقضاء على الهدر.",
          img:   "/images/impacto/practices.webp"
        },
        {
          label: "الركيزة 03",
          title: "الأرض الاجتماعية",
          desc:  "التزام شامل مع العملاء والموظفين والمجتمعات، توليد أثر اجتماعي إيجابي وفرص حقيقية.",
          img:   "/images/impacto/social.webp"
        }
      ]
    },

    oceanos: {
      hero_title:           "ملتزمون بمستقبل",
      hero_title_highlight: "أنظف لمحيطاتنا",
      hero_video:           "/videos/waves.mp4",
      intro: "في Grupo Ortiz، نؤمن بعالم تعود فيه المحيطات إلى تألقها. من خلال دعم مبادرات عالمية مثل The Ocean Cleanup وجائزة Tom Ford للابتكار البلاستيكي بدعم من Lonely Whale، نعمل على تقليل البلاستيك في بحارنا. كل عملية شراء تقوم بها معنا هي خطوة نحو كوكب أنظف ومستقبل مستدام للجميع. معاً ننقذ المحيطات!",
      features: [
        { title: "ندعم التنظيف العالمي",         desc: "بالتعاون مع مبادرات مثل The Ocean Cleanup."                   },
        { title: "نعزز الابتكار المستدام",        desc: "من خلال برامج مثل جائزة Tom Ford للابتكار البلاستيكي."        },
        { title: "نشجع على المنتجات المسؤولة",   desc: "التي تقلل الأثر البيئي على المحيطات."                        },
        { title: "نلهم العمل الجماعي",           desc: "بدعوة العملاء والشركاء ليكونوا جزءاً من التغيير."            }
      ],
      partners: [
        {
          title:  "ابتكار توم فورد",
          desc:   "تسعى هذه المبادرة العالمية إلى إحداث ثورة في صناعة البلاستيك عبر تكريم وترويج الحلول المبتكرة التي تحل محل البلاستيك أحادي الاستخدام. تركيزها على البدائل المستدامة والقابلة للتوسع التي تقلل الأثر البيئي وتحمي المحيطات وتعزز التحول نحو مواد أكثر مسؤولية.",
          btn:    "اعرف أكثر",
          link:   "https://unwrapthefuture.org/",
          video:  "/videos/impacto/oceancleanup.mp4",
          poster: "/images/impacto/cultura-calidad.jpg"
        },
        {
          title:  "تنظيف المحيطات",
          desc:   "مكرّسة لتنظيف محيطات العالم، تطور هذه المنظمة تقنيات متقدمة لإزالة البلاستيك المتراكم في البحار ومنع وصوله عبر التدخل في الأنهار، المصادر الرئيسية للتلوث. مهمتها استعادة صحة النظم البيئية البحرية وحماية التنوع البيولوجي وضمان مستقبل نظيف للأجيال القادمة.",
          btn:    "اعرف أكثر",
          link:   "https://theoceancleanup.com/",
          video:  "/videos/impacto/tomford.mp4",
          poster: "/images/impacto/tomford.webp"
        }
      ]
    },

    stats: {
      recycled: "طن تم تدويره",
      female:   "% الموظفات",
      families: "أسرة مستفيدة"
    },

    timeline: {
      title:    "مبادرات تُحدث التغيير",
      subtitle: "أثر إيجابي دائم",
      items: [
        {
          num: "01", title: "بيت الأمل",
          desc:       "دعم دور الأيتام في تاكامبارو، ميتشواكان. كل طفل يستحق بيتاً مليئاً بالحب.",
          desc_short: "دعم دور الأيتام في تاكامبارو، ميتشواكان.",
          img:        "/images/impacto/hogar.mp4",
          isVideo:    true,
          poster:     "/images/impacto/hogar.mp4"
        },
        {
          num: "02", title: "سلة GO الغذائية",
          desc:       "متحدون من أجل المجتمع. توزيع سلات غذائية بمحبة.",
          desc_short: "توزيع سلات غذائية بمحبة على المجتمع.",
          img:        "/images/impacto/despensas.webp",
          isVideo:    false
        },
        {
          num: "03", title: "بصمة صفرية",
          desc:       "سياسة صفر هدر. تحويل النفايات إلى فرص.",
          desc_short: "سياسة صفر هدر. تحويل النفايات.",
          img:        "/images/impacto/composta.webp",
          isVideo:    false
        },
        {
          num: "04", title: "سماد حي",
          desc:       "تصنيع منتجات قابلة للسماد. ابتكار يحترم الطبيعة.",
          desc_short: "منتجات قابلة للسماد. ابتكار مستدام.",
          img:        "/images/impacto/GO.webp",
          isVideo:    false
        },
        {
          num: "05", title: "تألق GO",
          desc:       "جوائز أداء لفريق GO. تقدير للجهد والعطاء.",
          desc_short: "تقدير لفريق GO على أدائهم المتميز.",
          img:        "/images/impacto/woman.webp",
          isVideo:    false
        },
        {
          num: "06", title: "أيدٍ تقود",
          desc:       "84٪ من الموظفين من النساء. تمكين قيادات نسائية.",
          desc_short: "56.82٪ موظفات. تمكين القيادات.",
          img:        "/images/impacto/bio.webp",
          isVideo:    false
        }
      ]
    },

    cta: {
      title:        "معاً",
      title_orange: "نُحدث التحول",
      desc:         "نحن الشريك الاستراتيجي الذي تحتاجه شركتك للنمو بالتكنولوجيا والخبرة والنتائج.",
      contact:      "تواصل معنا",
      products:     "عرض المنتجات"
    }
  },

  // =================================================
  // صفحة: الرئيسية
  // =================================================
  home: {
    meta_title: "الرئيسية | Grupo Ortiz",

    hero: {
      eyebrow:      "منذ عام 1959",
      title_top:    "نحن الشركة المصنّعة الرائدة",
      title_bot:    "في أمريكا اللاتينية",
      video:        "background.mp4",
      subtitle:     "أكثر من 65 عاماً في تصنيع حلول هندسية متطورة للصناعات في القارات الخمس.",
      btn_products: "منتجاتنا",
      btn_about:    "اعرف أكثر",
      stats: [
        { number: 65,   label: "عاماً من الخبرة"  },
        { number: 3000, prefix: "+", label: "موظف"           },
        { number: 5,    prefix: "",  label: "قارات"          }
      ]
    },

    divisiones: {
      tag:       "أقسامنا",
      title:     "مجالات",
      title_em:  "التخصص",
      link_text: "عرض المنتجات",
      items: [
        { title: "أكياس الشبك",      tag: "القسم 01", description: "أكياس شبك رافيا البولي بروبيلين بنسيج مسطح ودائري. تصميم مهوى مثالي للفواكه والخضروات والمنتجات الزراعية.",                        img: "/images/divisiones/arpilla.webp",        color: "#2d8a4e", slug: "arpillas",           soon: false },
        { title: "الحبال",           tag: "القسم 02", description: "حبال بولي بروبيلين عالية المتانة للاستخدام الزراعي والصناعي والبحري. مقاومة رائعة للعوامل الجوية مع فلتر UV مدمج.",                 img: "/images/divisiones/cuerdas.webp",        color: "#1a5f8a", slug: "cuerdas",            soon: false },
        { title: "الرافيا",          tag: "القسم 03", description: "خيوط رافيا بولي بروبيلين عالية الأداء. خفيفة الوزن للغاية وعالية مقاومة الكسر ومتعددة الاستخدامات في الزراعة وتربية الدواجن والبستنة.", img: "/images/divisiones/rafia.webp",          color: "#8a6d2d", slug: "rafias",             soon: false },
        { title: "التغليف المرن",    tag: "القسم 04", description: "أفلام عالية الحاجز وتصفيح متخصص. حماية مثلى للمواد الغذائية والمنتجات الصناعية بتقنية متطورة.",                                     img: "/images/divisiones/bolsa.webp",          color: "#0d7377", slug: "empaques-flexibles", soon: false },
        { title: "الأكياس",          tag: "القسم 05", description: "أكياس رافيا عالية الجودة. حل تعبئة متين للمواد الغذائية والمواد الكيميائية والأسمدة والمنتجات السائبة.",                               img: "/images/divisiones/sacos.webp",          color: "#3a7d44", slug: "sacos",              soon: false },
        { title: "فيلم التغليف المطاطي", tag: "القسم 06", description: "فيلم تغليف مطاطي عالي الشفافية البصرية. يضمن سلامة البضائع بكفاءة في التكاليف. يشمل خياراً قابلاً للتحلل البيولوجي.",         img: "/images/divisiones/film-estirable.webp", color: "#2c5f8a", slug: "stretch-film",       soon: false },
        { title: "واقي الزوايا",     tag: "القسم 07", description: "واقيات زوايا كرافت لحماية الحواف أثناء التخزين والنقل. توزيع منتظم للضغط وأقصى استقرار للبضائع.",                                   img: "/images/divisiones/esquineros.webp",     color: "#7b3fa0", slug: "esquineros",         soon: false },
        { title: "المستهلكات",       tag: "القسم 10", description: "منتجات مستهلكة من البولي بروبيلين للاستخدام الصناعي والغذائي والطبي. حلول صحية واقتصادية وعالية المقاومة.",                           img: "/images/divisiones/desechables.webp",    color: "#e05500", slug: "desechables",        soon: true  }
      ]
    },

    porque: {
      tag:           "لماذا تختارنا",
      title:         "أكثر من 65 عاماً",
      title_em:      "من الريادة",
      body:          "نحن مرجع في صناعة البوليمرات البلاستيكية في المكسيك وأمريكا اللاتينية، بعمليات معتمدة وقدرة استجابة عالمية.",
      btn:           "تاريخنا",
      badge1_label:  "وحدات الأعمال",
      badge1_number: 13,
      badge2_label:  "أقسام",
      badge2_number: 6,
      img:           "/images/home/planta-produccion.webp",
      features: [
        { title: "جودة معتمدة",       description: "منتجات تستوفي أعلى المعايير الدولية في التصنيع."              },
        { title: "ابتكار مستمر",      description: "استثمار دائم في البحث والتطوير للحفاظ على الريادة التكنولوجية في القطاع." },
        { title: "امتداد عالمي",      description: "حضور فاعل في 5 قارات مع شبكة توزيع فعّالة."                  }
      ]
    },

    certs: {
      tag:      "جودة مضمونة",
      title:    "شهاداتنا",
      title_em: "ومعتمداتنا",
      items: [
        { code: "Kosher Pareve",     name: "KMD México",     img: "/images/certificaciones/KOSHER.jpeg"   },
        { code: "FSSC 22000",        name: "LRQA Certified", img: "/images/certificaciones/LRQA.png"      },
        { code: "AIB International", name: "Since 1919",     img: "/images/certificaciones/AIB.png"       },
        { code: "ISO 9001",          name: "Bureau Veritas", img: "/images/certificaciones/CERTIFIED.png" }
      ]
    },

    compromiso: {
      card1: {
        eyebrow: "نهجنا",
        title:   "الابتكار",
        text:    "نستثمر في البحث والتطوير لتقديم منتجات تتجاوز توقعات السوق العالمي بتقنية متطورة."
      },
      card2: {
        eyebrow: "التزامنا",
        title:   "الاستدامة",
        text:    "عمليات مسؤولة بيئياً وبرامج تدوير نشطة وتقليص للبصمة الكربونية في كامل سلسلة القيمة."
      }
    },

    global: {
      tag:      "حضور عالمي",
      title:    "نصدّر إلى",
      title_em: "العالم",
      desc:     "تصل منتجاتنا إلى عملاء في أكثر من 30 دولة، مرسّخةً مكانتنا كرواد في مجال البوليمرات البلاستيكية.",
      video:    "/videos/camion.mp4",
      stats: [
        { number: 65,   label: "عاماً"    },
        { number: 30,   prefix: "+", label: "دولة"     },
        { number: 3000, prefix: "+", label: "موظف"     },
        { number: 5,    prefix: "",  label: "قارات"    }
      ]
    },

    cta: {
      tag:      "هل أنت مستعد للبدء؟",
      title:    "لنعمل",
      title_em: "معاً",
      sub:      "اكتشف كيف يمكن لحلولنا أن تحوّل عملياتك",
      btn:      "تواصل معنا"
    }
  }

};