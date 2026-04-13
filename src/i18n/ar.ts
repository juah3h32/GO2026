// src/i18n/ar.js

export const ar = {
  // =================================================
  // شريط التنقل
  // =================================================
  nav: {
    home: 'الرئيسية',
    products: 'المنتجات',
    catalog: 'الكتالوج',
    about: 'من نحن',
    company: 'الشركة',
    social: 'الأثر الاجتماعي',
    distributor: 'موزّع',
    careers: 'وظائف',
    contact: 'اتصل بنا'
  },

  // =================================================
  // البطل / الغلاف العام
  // =================================================
  hero: {
    title: "مرحباً بكم",
    subtitle: "جودة تدوم"
  },

  // =================================================
  // نصوص مشتركة
  // =================================================
  common: {
    seeMore: "عرض المزيد",
    division: "قسم",
    buy: "شراء",
    redirecting: "جارٍ التحويل...",
    download: "تحميل",
    language: "اللغة",
    scrollDown: "مرّر للأسفل",
    previous: "السابق",
    next: "التالي"
  },

  // =================================================
  // المساعد الآلي (BotGo)
  // =================================================
  chatbot: {
    // ── رسائل عامة ──
    greeting:            'مرحباً! أنا BotGo 🤖. كيف يمكنني مساعدتك اليوم؟',
    placeholder:         'اكتب رسالة...',
    listeningState:      'أستمع...',
    thinking:            'أفكّر...',
    errorMsg:            'خطأ في الاتصال.',
    voiceAssistantTitle: 'المساعد الافتراضي',
    voiceCode:           'ar-SA',

    // ── أزرار الإجراء ──
    salesBtn:   'طلب عرض أسعار عبر واتساب',
    pdfBtn:     'عرض كتالوج PDF',
    waStart:    'مرحباً Grupo Ortiz، أودّ الحصول على عرض أسعار',

    // ── تلميح سطح المكتب (بطاقة) ──
    tooltipTitle:  'كيف يمكنني',
    tooltipAccent: 'مساعدتك اليوم؟',
    tooltipCta:    'ابدأ المحادثة الآن!',
    tooltipItems: [
      { text: 'اطلب',              bold: 'معلومات المنتجات'             },
      { text: 'أتمّ',              bold: 'طلبك مباشرةً'                 },
      { text: 'تواصل مع',          bold: 'خدمة العملاء'                 },
      { text: 'حمّل',              bold: 'الكتالوجات والملفات التقنية'  },
    ],

    // ── شريط الجوال ──
    pillLabelSmall: 'كيف يمكنني',
    pillLabelBig:   'مساعدتك اليوم؟',
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
  // صفحة العروض والتخفيضات
  // =================================================
  promociones: {
    meta_title: "العروض | Grupo Ortiz",
    hero: {
      label: "عروض خاصة",
      title: "التخفيضات",
      subtitle: "استفد من عروضنا المحدودة",
      validity: "ساري حتى نفاد الكمية*"
    },
    discount_badge: "حتى",
    off_text: "خصم",
    original_price: "السعر قبل",
    promo_price: "السعر الخاص",
    buy_button: "طلب عرض أسعار",
    contact_cta: "تواصل مع مستشار للمزيد من المعلومات",
    valid_until: "ساري حتى نفاد الكمية*",

    products: [
      {
        id: "promo-stretch",
        name: "ستريتش فيلم",
        subtitle: "33 بيزو للكيلوغرام من الستريتش الملوّن",
        image: "/images/stretch/manual.webp",
        discount: 35,
        originalPrice: "",
        promoPrice: "33 بيزو/كجم",
        features: [
          "فيلم تمدد ملوّن",
          "سعر خاص بالكيلوغرام",
          "كمية محدودة",
          "متاح بألوان متعددة"
        ],
        validUntil: "ساري حتى نفاد الكمية*"
      },
      {
        id: "promo-cuerda",
        name: "حبل",
        subtitle: "33 بيزو للكيلوغرام",
        image: "/images/cuerdas/CuerdaT1.webp",
        discount: 25,
        originalPrice: "",
        promoPrice: "33 بيزو/كجم",
        features: [
          "حبل عالي الجودة",
          "سعر خاص بالكيلوغرام",
          "عرض لفترة محدودة",
          "التوفر مرهون بالمخزون"
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
      label: "التوثيق",
      title: "الكتالوج العام",
      description: "الجودة والحلول المتكاملة في وثيقة واحدة. اختر لغتك المفضّلة للحصول على عرضنا المؤسسي.",
      scrollText: "عرض الأقسام"
    },
    carousel: {
      label: "التنزيلات المتاحة",
      title: "الكتالوج حسب القسم",
    },
    languageLabel: "Language / اللغة",
    downloadButton: "تحميل PDF",
    divisions: [
      {
        id: "1",
        name: "ستريتش فيلم",
        desc: "فيلم تمدد لتأمين الأحمال وحمايتها. حل فعّال لتغليف المنصّات ونقلها بأمان.",
        image: "/images/catalogo/img1.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1HYGcpgkRO_7OX22IcWvRpzpLZKgpYV3A/view?usp=sharing",
          en: "https://drive.google.com/file/d/1QZ6jmKyc-CGLwh9brbeZSQ5OOzkKdBCQ/view?usp=sharing",
        }
      },
      {
        id: "2",
        name: "الحبال",
        desc: "متانة وصلابة للربط الصناعي وصيد الأسماك. مصنوعة من مواد عالية الجودة للاستخدام المكثّف.",
        image: "/images/catalogo/img2.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/14GrV9P1ViQKvFp3BucYjgmryRgWKLEZh/view?usp=sharing",
          en: "https://drive.google.com/file/d/19Tvd_VHjogSE7y7cLZYr4ra__4vB4nOm/view?usp=sharing",
        }
      },
      {
        id: "3",
        name: "الرافيا",
        desc: "المعيار في الربط للزراعة والصناعة. مادة مرنة ومتينة لتطبيقات متعددة.",
        image: "/images/catalogo/img3.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1uAiR4uxO2iX_LsNFul6kXeb7jnnCEV_J/view?usp=sharing",
          en: "https://drive.google.com/file/d/10PV-sxexE8UkFSOhdTJBe1xWCy_tdFib/view?usp=sharing",
        }
      },
      {
        id: "4",
        name: "أكياس الشبك",
        desc: "نسيج شبكي مفتوح لأقصى تهوية زراعية. حلول متعددة الاستخدام لتعبئة ونقل منتجات الحقل.",
        image: "/images/catalogo/img4.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1OQKGpnRCfA2yFdAlT6q7GczYua2FFFVU/view?usp=sharing",
          en: "https://drive.google.com/file/d/1wldGL6XuqH-Ruth9Y01-hkNnPlbg9SW5/view?usp=sharing",
        }
      },
      {
        id: "5",
        name: "الأكياس",
        desc: "بولي بروبيلين منسوج مسطح للتعبئة بالجملة. مقاومة فائقة للمنتجات السائبة.",
        image: "/images/catalogo/img5.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/16S43-PUrQECO9q2J1fOgbN-YeIxQ2GhP/view?usp=sharing",
          en: "https://drive.google.com/file/d/1fkZvAWTT3mnBkxQ0Gbb2kRgOoN2dJZiK/view?usp=sharing",
        }
      },
      {
        id: "6",
        name: "حواف الحماية",
        desc: "حماية هيكلية واستقرار للمنصّات. تعزيز أساسي في لوجستيات التخزين والشحن.",
        image: "/images/catalogo/img6.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/181Hvr0HQffLU3rmcXkccYoqj-Y_A-gxr/view?usp=sharing",
          en: "https://drive.google.com/file/d/1DdcEavACvuY00oyMyC9rOWRybi9jnQrD/view?usp=sharing",
        }
      },
      {
        id: "7",
        name: "التغليف المرن",
        desc: "أفلام عالية الحاجز ولمينيشن متخصص. حماية مثلى للأغذية والمنتجات الصناعية.",
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
      division: "ستريتش فيلم",
      descripcion: "فيلم تمدد بوضوح بصري عالٍ ومعايير جودة مميزة. يضمن سلامة الحمولة وكفاءة التكاليف. تشمل مجموعتنا خياراً قابلاً للتحلل البيولوجي، مُصمَّماً للتحلل بنسبة 90% أسرع.",
      slug: "stretch-film",
      video: "carrusel/stretch-film.mp4"
    },
    {
      img: "carrusel/img4.webp",
      division: "أكياس الشبك",
      descripcion: "أكياس شبكية من رافيا البولي بروبيلين بنسيج دائري عالي المقاومة والمتانة. تصميم مهوّى مثالي للفواكه والخضروات.",
      slug: "arpillas",
      video: "carrusel/arpillas.mp4"
    },
    {
      img: "carrusel/img2.webp",
      division: "الحبال",
      descripcion: "حبال من خيوط البولي بروبيلين عالية الأداء. توازن مثالي بين الخفة الفائقة والمقاومة العالية للكسر.",
      slug: "cuerdas",
      video: "carrusel/cuerdas.mp4"
    },
    {
      img: "carrusel/img3.webp",
      division: "الرافيا",
      descripcion: "رافيا فيلم البولي بروبيلين عالية الأداء. خفيفة جداً وعالية المقاومة للكسر. مرنة ومتعددة الاستخدامات.",
      slug: "rafias",
      video: "carrusel/rafia.mp4"
    },
    {
      img: "carrusel/img5.webp",
      division: "الأكياس",
      descripcion: "أكياس رافيا بجودة فائقة. حل تعبئة متين للأغذية والمواد الكيميائية والأسمدة.",
      slug: "sacos",
      video: "carrusel/sacos.mp4"
    },
    {
      img: "carrusel/img6.webp",
      division: "حواف الحماية",
      descripcion: "حواف كرتونية لتحسين اللوجستيات. مقاومة هيكلية واستقرار أكبر للأحمال.",
      slug: "esquineros",
      video: "carrusel/esquineros.mp4"
    },
    {
      img: "carrusel/img7.webp",
      division: "التغليف المرن",
      descripcion: "تتخصص Neo Empaques International في حلول التغليف المرن المتقدمة، المصمّمة لتحسين الحفظ وتقديم المنتجات في صناعات متعددة.",
      slug: "empaques-flexibles",
      video: "carrusel/bobina-impresa.mp4"
    }
  ],

  // =================================================
  // صفحة: ستريتش فيلم (فيلم التمدد)
  // =================================================
  stretch_film: {
    meta_title: "فيلم التمدد | Grupo Ortiz",
    back_aria: "العودة إلى المنتجات",
    specs_title: "المواصفات التقنية",

    specs_labels: {
      width: "العرض",
      length: "الطول",
      gauge: "السُّمك",
      weight: "الوزن",
      type: "الاستخدام"
    },

   products: [
      {
        name: 'تغليف ممتاز (STRETCH PREMIUM)',
        img: '/images/stretch/premium.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "مصمم للآلات ذات المتطلبات العالية، يوفر فيلم التغليف (ستريتش) متوسط التمدد هذا حلاً فعالاً وموثوقاً لتأمين الأحمال في العمليات الآلية. يضمن تركيبه مقاومة عالية وأداءً فائقاً في تطبيقات التعبئة والتغليف الشاقة.",
        specs_values: { width: "19-30 بوصة", length: "1000-15000 قدم", gauge: "40-110", weight: "10-40 كجم", type: "يدوي" },
        gallery: [
          '/images/stretch/premium2.png',
          '/images/stretch/premium.png',
          '/images/stretch/premium3.png'
        ]
      },
      {
        name: 'آلي (AUTOMÁTICO)',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "مصمم للاستخدام مع آلات التغليف التقليدية، يوفر فيلم التغليف هذا إنتاجية عالية وأداءً ممتازاً في عمليات منصات التحميل الآلية. تضمن تركيبته القوة والاستقرار في تأمين الأحمال.",
        specs_values: { width: "18-30 بوصة", length: "2000-15000 قدم", gauge: "50-110", weight: "10-49 كجم", type: "آلي" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      },
      {
        name: 'يدوي مسبق التمدد (MANUAL PREESTIRADO)',
        img: '/images/stretch/prestirado.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "مصمم للتطبيق اليدوي عالي الأداء، يتميز هذا الفيلم مسبق التمدد بتوفيره واحدة من أقل السماكات في السوق. تلغي تقنيته الحاجة إلى بذل قوة إضافية عند التغليف، مما يسهل استخدامه الفوري ويحسن الكفاءة في عملية منصات التحميل.",
        specs_values: { width: "16-17 بوصة", length: "7000-25000 قدم", gauge: "40-120", weight: "10-40 كجم", type: "يدوي" },
        gallery: [
          '/images/stretch/prestirado2.png',
          '/images/stretch/prestirado.png',
          '/images/stretch/prestirado3.png'
        ]
      },
      {
        name: 'ربط يدوي (MANUAL BANDING)',
        img: '/images/stretch/banding.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "مصمم لتطبيقات التغليف اليدوي مع تمدد معتدل، يوفر فيلم التغليف التقليدي هذا أداءً ممتازاً في عمليات التعبئة وتأمين الأحمال. يضمن تركيبه المقاومة والاستقرار في التطبيقات العامة.",
        specs_values: { width: "3-12 بوصة", length: "7000-25000 قدم", gauge: "40-120", weight: "10-40 كجم", type: "يدوي" },
        gallery: [
          '/images/stretch/banding3.png',
          '/images/stretch/banding.png',
          '/images/stretch/banding2.png'
        ]
      },
      {
        name: 'بدون قلب كرتوني (CORELESS)',
        img: '/images/stretch/coreles.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "فيلم تغليف بدون قلب كرتوني، مصمم لتحقيق أقصى استفادة من المواد وتقليل النفايات في عملية منصات التحميل. يوفر هيكله متعدد الطبقات مقاومة عالية للتمزق، واستطالة ممتازة، وتثبيتاً محكماً للحمل، وهو مثالي للتطبيقات اليدوية ونصف الآلية.",
        specs_values: {
          width: "18-20 بوصة",
          length: "1000-2000 قدم",
          gauge: "60-80",
          weight: "3-10 كجم",
          type: "يدوي / نصف آلي"
        },
        gallery: [
          '/images/stretch/coreles2.png',
          '/images/stretch/coreles.png',
          '/images/stretch/coreles3.png'
        ]
      },
      {
        name: 'يدوي صلب (MANUAL RÍGIDO)',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "تمت صياغته خصيصاً لتطبيقات التغليف اليدوي ذات التمدد المحدود، يوفر فيلم التغليف هذا أداءً عالياً وموثوقية كبيرة في عمليات التعبئة والتغليف. يضمن تركيبه الاستقرار والكفاءة في تأمين الأحمال.",
        specs_values: { width: "17-30 بوصة", length: "1000-15000 قدم", gauge: "40-90", weight: "10-40 كجم", type: "يدوي", color: "أسود/ملون" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      }
    ]
  },

  // =================================================
  // صفحة: الحبال
  // =================================================
  cuerdas: {
    meta_title: "الحبال | Grupo Ortiz",
    back_aria: "عودة",
    loading: "جارٍ التحميل...",
    specs_title: "المواصفات التقنية",

    specs_labels: {
      load: "المردود",
      mat: "المادة",
      weight: "الوزن",
      resist: "المقاومة",
      charge: "التقديم"
    },

    products: [
      {
        name: 'حبل الأدوات',
        img: '/images/cuerdas/CuerdaT1.webp',
        video: "/videos/cuerdas/cuerda-1.mp4",
        link: '#',
        description: "مصنوع من البولي بروبيلين وفلتر UV متقدم، هذا الحبل مثالي للأنشطة ذات التعرض الشمسي العالي. تركيبته المتخصصة تبطّئ التآكل الطبيعي وتطيل عمره الافتراضي، مما يضمن مقاومة ومتانة أكبر في الهواء الطلق. إنه الحبل المثالي للصلابة والأمان والأداء الموثوق في التطبيقات العامة والأعمال الشاقة.",
        specs_values: { load: "1,980 م", mat: "PP-UV", weight: "18 كجم", resist: "175 كجم", charge: "4-19 مم" },
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
        description: "مصنوع من البولي بروبيلين (PP) ومثبّت UV، هذا الحبل مثالي للقطاع البحري والأنشطة ذات التعرض الشمسي العالي. تركيبته المتخصصة تبطّئ التلف الناجم عن الأشعة فوق البنفسجية، مما يطيل عمره الافتراضي ويضمن مقاومة أكبر للعوامل الجوية. إنه الحل المثالي للصلابة والاستقرار في الأنفاق الزراعية الكبيرة.",
        specs_values: { load: "3,240 م", mat: "PP-UV", weight: "18 كجم", resist: "105 كجم", charge: "3-8 مم" },
        gallery: [
          '/images/cuerdas/CuerdaNegra6-1.png',
          '/images/cuerdas/CuerdaNegra.webp',
          '/images/cuerdas/CuerdaNegra6-3.png'
        ]
      },
      {
        name: 'الحبل البيئي',
        img: '/images/cuerdas/CuerdaEco.png',
        video: "/videos/cuerdas/CuerdaE.mp4",
        link: '#',
        description: "مصنوع من البولي بروبيلين (PP) عالي الجودة، يوفر هذا الحبل مجموعة واسعة من التقديمات والمقاسات والألوان، متاح بإصدارات ملساء أو مجمّعة، مع تعزيز أو بعلامة. تنوّعه ومقاومته يجعلانه خياراً موثوقاً للتطبيقات المتعددة في الصناعات والمصانع والمستودعات والأسواق والأعمال العامة.",
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
    meta_title: "الرافيا | Grupo Ortiz",
    back_aria: "عودة",
    specs_title: "المواصفات التقنية",

    specs_labels: {
      cal: "المعيار",
      yield: "المردود بالمتر",
      resist: "المقاومة بالكجم",
      usage: "المادة"
    },

    products: [
      {
        name: "رافيا الربط",
        description: "مصنوعة من بولي بروبيلين 100% بكر، تقدّم هذه الرافيا مقاومة عالية وأداءً ممتازاً مع الحفاظ على خصائصها الفيزيائية حتى في الظروف الجوية القاسية. جودتها تضمن المتانة والأداء الموثوق في التطبيقات الصعبة. تُستخدم على نطاق واسع في القطاعات الزراعية والدواجن والبستنة.",
        img: "/images/rafias/atar.png",
        video: "/videos/rafia/fondoN.mp4",
        specs_values: {
          cal: "2-8 مم",
          yield: "90 كجم",
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
        name: "الرافيا البيئية",
        description: "مصنوعة من بولي بروبيلين عالي الجودة، تقدّم هذه الرافيا مقاومة ممتازة وتحافظ على خصائصها الفيزيائية حتى في الظروف الجوية القاسية. أداؤها الموثوق يجعلها خياراً مثالياً للتطبيقات الزراعية والدواجن والبستنة.",
        img: "/images/rafias/Eco.png",
        video: "/videos/rafia/fondoE.mp4",
        specs_values: {
          cal: "2-8",
          yield: "90-500 كجم",
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
        name: "رافيا ليفية سوداء",
        description: "مصنوعة من بولي بروبيلين عالي الجودة، تقدّم هذه الرافيا مقاومة كبيرة وتحافظ على خصائصها الفيزيائية حتى في الظروف الجوية. أداؤها الممتاز يجعلها مثالية للتطبيقات الصناعية والأدوات والتغليف، فضلاً عن القطاعات الزراعية والدواجن والبستنة.",
        img: "/images/rafias/negra.png",
        video: "/videos/rafia/fondoR.mp4",
        specs_values: {
          cal: "2-8",
          yield: "90-500 كجم",
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
  // صفحة: أكياس الشبك
  // =================================================
  arpillas: {
    meta_title: "أكياس شبكية | Grupo Ortiz",
    back_aria: "رجوع",
    specs_title: "المواصفات الفنية",

    specs_labels: {
      construction: "البنية",
      sizes: "العرض",
      colors: "الألوان",
      features: "نوع الإغلاق"
    },

    products: [
      {
        name: 'كيس شبكي دائري (ARPILLA CIRCULAR)',
        img: '/images/arpillas/arpilla.webp',
        video: "/videos/arpilla/circular.mp4",
        link: '#',
        description: "مصنوع من البولي بروبيلين البكر بنسبة 100% وبنية من الرافيا، يوفر هذا الكيس الشبكي مقاومة عالية وأداءً ممتازاً في تطبيقات التعبئة والتخزين. تضمن جودته المتانة والأداء الموثوق في التعامل مع المنتجات المختلفة.",
        specs_values: {
          sizes: "23-70 سم",
          colors: "4",
          features: "رباط"
        },
        gallery: [
          '/images/arpillas/circular2.png',
          '/images/arpillas/arpilla.webp',
          '/images/arpillas/circular3.png'
        ]
      },
      {
        name: 'كيس شبكي دائري أحادي الخيط (ARPILLA MONOFILAMENTO CIRCULAR)',
        img: '/images/arpillas/arpilla2.webp',
        video: "/videos/arpilla/mono.mp4",
        link: '#',
        description: "مصنوع من البولي بروبيلين البكر بنسبة 100% وبنية من الرافيا/خيط أحادي، يوفر هذا الكيس الشبكي مقاومة عالية وأداءً ممتازاً في تطبيقات التعبئة والتخزين. يوفر هيكله المتانة والأداء الموثوق في التعامل مع المنتجات المختلفة وحمايتها.",
        specs_values: {
          construction: "خيط أحادي",
          sizes: "23-70 سم",
          colors: "2",
          features: "رباط"
        },
        gallery: [
          '/images/arpillas/mono2.png',
          '/images/arpillas/arpilla2.webp',
          '/images/arpillas/mono3.png'
        ]
      },
      {
        name: 'كيس شبكي بخياطة جانبية (ARPILLA COSTURA LATERAL)',
        img: '/images/arpillas/arpilla3.webp',
        video: "/videos/arpilla/costura.mp4",
        link: '#',
        description: "مصنوع من البولي بروبيلين البكر بنسبة 100% وبنية من الرافيا/خيط أحادي، يوفر هذا الكيس الشبكي مقاومة عالية وأداءً ممتازاً في تطبيقات التعبئة والتخزين. يضمن هيكله المتانة والموثوقية في التعامل مع المنتجات المختلفة.",
        specs_values: {
          type: "جانبي",
          construction: "خيط أحادي",
          sizes: "23-60 سم",
          colors: "4",
          features: "مقوى"
        },
        gallery: [
          '/images/arpillas/lateral1.png',
          '/images/arpillas/arpilla3.webp',
          '/images/arpillas/lateral3.png'
        ]
      },
      {
        name: 'كيس شبكي بملصق مصفح (ARPILLA ETIQUETA LAMINADA)',
        img: '/images/arpillas/arpilla4.webp',
        video: "/videos/arpilla/etiqueta.mp4",
        link: '#',
        description: "مصنوع من البولي بروبيلين البكر بنسبة 100% وبنية من الرافيا/الرافيا، يوفر هذا الكيس الشبكي مقاومة عالية وأداءً ممتازاً في عمليات التعبئة والتخزين. يضمن نسيجه المتانة والموثوقية للتطبيقات الصعبة في كل من الأسواق المحلية وأسواق التصدير.",
        specs_values: {
          type: "مصفح",
          construction: "رافيا",
          sizes: "23-70 سم",
          colors: "4",
          features: "رباط"
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
        name: 'كيس رافيا غير مُطلَّى',
        img: '/images/sacos/saco2.png',
        model: '/models/saco_blanco.glb',
        video: "/videos/saco/slaminar.mp4",
        link: '#',
        description: "مصنوعة من شرائط بولي بروبيلين متشابكة، توفّر أكياس الرافيا غير المُطلَّاة مقاومة كبيرة ومتانة ممتازة في تطبيقات التعبئة والتخزين. هيكلها يتحمّل الأحمال الثقيلة دون تمزق، مما يضمن أداءً موثوقاً في الأعمال الشاقة.",
        specs_values: {
          load: "35-80 سم",
          unit: "49-115 سم",
          mat: "PP",
          weight: "120-200 كجف"
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
        description: "مصنوعة من شرائط بولي بروبيلين بتشطيب شفاف، تقدّم هذه الأكياس مقاومة عالية وتتيح رؤية المنتج المعبأ بوضوح. هيكلها يضمن المتانة والأداء الموثوق في تطبيقات التخزين والنقل.",
        specs_values: {
          load: "35-80 كجم",
          unit: "49-115 سم",
          mat: "PP",
          weight: "120-200 كجف"
        },
        gallery: [
          '/images/sacos/laminado2.png',
          '/images/sacos/saco.png',
          '/images/sacos/laminado3.png'
        ]
      },
      {
        name: 'كيس رافيا بيئي',
        img: '/images/sacos/saco3.png',
        video: "/videos/saco/eco.mp4",
        link: '#',
        description: "مصنوعة من مواد معاد تدويرها من نفايات عملية الإنتاج، توفّر هذه الأكياس مقاومة ومتانة جيدة بتكلفة أكثر اقتصادية. تصنيعها يتيح أداءً موثوقاً في تطبيقات التعبئة والتخزين العامة.",
        specs_values: {
          load: "45-80 كجم",
          unit: "49-115 سم",
          mat: "PP",
          weight: "120-200 كجف"
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
  // صفحة: حواف الحماية
  // =================================================
  esquineros: {
    meta_title: "حواف الحماية | Grupo Ortiz",
    back_aria: "عودة",
    specs_title: "المواصفات التقنية",

    specs_labels: {
      tab:      "اللسان",
      thick:    "السُّمك",
      length:   "الطول",
      tabyd:    "اللسان (ياردة)",
      thickyd:  "السُّمك (ياردة)",
      lengthyd: "الطول (ياردة)"
    },

    products: [
      {
        name: "حافة كرافت بنية",
        description: "مصنوعة لحماية الحواف والزوايا أثناء النقل والتخزين، توزّع هذه الحافة الضغط بالتساوي، مما يمنع التشوه والأضرار في البضاعة. هيكلها يوفر المقاومة والاستقرار في تطبيقات التغليف الصعبة.",
        img: "/images/esquinero/esquinero.png",
        video: "/videos/esquinero/esquinero.mp4",
        link: "#",
        specs_values: {
          tab:    "1.5 بوصة",
          thick:  "0.08 مم",
          length: "11.81 سم"
        },
        gallery: [
          '/images/esquinero/esquinero2.png',
          '/images/esquinero/esquinero.png',
          '/images/esquinero/esquinero3.png'
        ]
      },
      {
        name: "حافة كرافت بيضاء",
        description: "مصنوعة لحماية الحواف والزوايا أثناء النقل والتخزين، توزّع هذه الحافة الضغط بالتساوي، مما يمنع التشوه والأضرار في البضاعة. هيكلها يوفر المقاومة والاستقرار في تطبيقات التغليف الصعبة.",
        img: "/images/esquinero/esquinerob.png",
        video: "/videos/esquinero/esquinero.mp4",
        link: "#",
        specs_values: {
          tab:    "1.5 بوصة",
          thick:  "0.08 مم",
          length: "11.81 سم"
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
      lamination: "الطلاء",
      finish:     "التشطيب",
      size:       "الأبعاد حتى",
      zipper:     "سحّاب",
      type:       "النوع"
    },

    products: [
      {
        name: "بكرة مطبوعة",
        description: "تتميّز بكراتنا بتنوع كبير في الطلاءات والسُّمك والتشطيبات. مع خيار الطباعة حتى 10 أحبار و133 خطاً في البوصة. الحد الأقصى للمحيط: 1,140 مم. الحد الأقصى لعرض الطباعة: 1,450 مم. متوافقة مع آلات التعبئة الأوتوماتيكية لتحسين كفاءة الإنتاج.",
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
        name: "كيس قائم",
        description: "أكياس قائمة متعددة الاستخدامات ببنية مُطلَّاة وحاجز عالٍ ضد الرطوبة والأكسجين. مثالية للأغذية الجافة أو الرطبة والمساحيق والسوائل ومستحضرات التجميل والمواد الكيميائية. متاحة بتشطيبات طبيعية ومطفأة ومعدنية، بأحجام من 150 جم حتى 1 كجم، مع خيار سحاب ونافذة.",
        img: "/images/flexible/standup-generica.png",
        video: "/videos/flexible/standup.mp4",
        gallery: [
          "/images/flexible/standup-generica-2.png",
          "/images/flexible/standup-generica.png",
          "/images/flexible/standup-generica-3.png"
        ],
        specs_values: {
          lamination: "مُطلَّى",
          finish:     "3 أنواع",
          size:       "1 كجم",
          zipper:     "نعم / لا",
          type:       "كيس"
        }
      },
      {
        name: "كيس ستاند أب بوتش",
        description: "سلسلة أكياس بتصاميم زخرفية جذابة: توت أحمر، أزهار، فواكه، سنابل، هدية زرقاء وهدية وردية. إغلاق بسحّاب وهيكل متين وتشطيبات طبيعية أو معدنية. متاحة بأحجام من 150 جم حتى 1 كجم. مثالية لمن يبحث عن تغليف عالي الجودة وجاذبية بصرية.",
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
        name: "كيس تفريغ عالٍ",
        description: "مصمّمة لتعظيم نضارة وعمر صلاحية اللحوم والأجبان والنقانق والمنتجات الطازجة. يزيل إغلاقها المحكم الهواء ويحافظ على الخصائص الطبيعية للمنتج ويمنع فقدان الطعم والملمس والجودة. مصنوعة من مواد عالية المقاومة والحاجز.",
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
  // صفحة: الموزّع (صفحة هبوط كاملة)
  // =================================================
  distribuidor: {
    meta_title: "موزّع Grupo Ortiz | شريك رسمي",
    hero: {
      subtitle: "بوابة الجملة",
      title: "ضاعف <br>أرباحك <span>الآن</span>",
      desc: "وزّع منتجات عالية الطلب بدعم المصنّع الرائد. مخزون مضمون، بدون وسطاء ولوجستيات خلال 24 ساعة.",
      cta: "ابدأ الآن"
    },
    cards: [
      { icon: "ri-stack-line",        title: "مخزون كامل",      desc: "قدرة على تلبية الطلبات الكبيرة فوراً. مستودعك دائماً ممتلئ." },
      { icon: "ri-truck-line",        title: "شحن خلال 24 ساعة", desc: "لوجستيات خاصة. عملاؤك لا ينتظرون، نسلّم في وقت قياسي."   },
      { icon: "ri-shield-check-line", title: "ضمان",             desc: "استبدال فيزيائي بلا بيروقراطية أو أسئلة. دعم كامل للعلامة." },
      { icon: "ri-line-chart-line",   title: "أفضل هامش",        desc: "أسعار مباشرة من المصنع مصمّمة لتعظيم صافي ربحك."          }
    ],
    stats: [
      { val: 25, symbol: "ك",  label: "طن شهرياً"       },
      { val: 35, symbol: "+",  label: "عاماً من التاريخ" },
      { val: 15, symbol: "م",  label: "إجمالي المبيعات"  }
    ],
    form: {
      title: "طلب <br>التسجيل",
      desc: "انضم إلى الشبكة. أكمل ملفك الشخصي لنخصّص لك منطقة وقائمة أسعار مفضّلة.",
      support_label: "دعم مباشر",
      labels: {
        name:     "اسم جهة الاتصال",
        business: "الاسم التجاري",
        whatsapp: "واتساب",
        email:    "البريد الإلكتروني",
        products: "المنتجات ذات الاهتمام"
      },
      products_list: ["أكياس", "مرن", "رافيا", "حافة حماية", "حبال", "ستريتش", "أخرى", "الكل"],
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
        { year: "1959", title: "البداية",               short: "التأسيس في موريليا",    img: "/images/tiempo/timeline-1959.webp",  description: "منذ عام 1959، كان Grupo Ortiz جزءاً من التطور الصناعي للمكسيك. أسسه نيكاندرو أورتيز في موريليا، ولد المجموعة برؤية راسخة: الجمع بين التكنولوجيا المتقدمة وموهبة وتفاني أفرادها لبناء شركة متينة ومبتكرة وملتزمة بالجودة." },
        { year: "1970", title: "التوسع الصناعي",        short: "أكياس وشبكات",          img: "/images/tiempo/timeline-1970.webp",  description: "في عام 1970، بدأنا إنتاج الأكياس وشبكات البولي بروبيلين، مما شكّل مرحلة محورية في نمونا الصناعي. هذه الخطوة الاستراتيجية عزّزت طاقتنا التشغيلية ووسّعت مشاركتنا التجارية ورسّخت حضورنا في السوق الوطنية." },
        { year: "1985", title: "الابتكار التكنولوجي",   short: "آلات أوروبية",           img: "/images/tiempo/timeline-1985.webp",  description: "في عام 1985، ضممنا آلات أوروبية من أحدث الأجيال، مما عزّز بنيتنا التحتية الصناعية وحسّن عملياتنا الإنتاجية. هذا الاستثمار الاستراتيجي رفع معايير جودتنا وزاد الكفاءة التشغيلية وأكّد التزامنا بالابتكار التكنولوجي." },
        { year: "1995", title: "التنويع",               short: "خطوط إنتاج جديدة",      img: "/images/tiempo/timeline-1995.webp",  description: "في عام 1995، وسّعنا خطوط إنتاجنا بإضافة فيلم التمدد والتغليف المرن ومنتجات متخصصة للصناعة. هذا التوسع الاستراتيجي نوّع محفظتنا وعزّز تنافسيتنا في القطاع ومكّننا من تلبية متطلبات السوق الوطنية الجديدة." },
        { year: "2005", title: "التوسع الدولي",         short: "أمريكا وأوروبا",         img: "/images/tiempo/timeline-2005.webp",  description: "في عام 2005، بدأنا التصدير نحو أمريكا وأوروبا، مما شكّل خطوة حاسمة في توسعنا الدولي. هذا الإنجاز وضع الشركة كمرجع في صناعة البوليمرات البلاستيكية، مما عزّز حضورنا العالمي ورسّخ تنافسيتنا في الأسواق الدولية." },
        { year: "2015", title: "الاستدامة",             short: "مصنع إعادة تدوير",      img: "/images/tiempo/timeline-2015.webp",  description: "في عام 2015، طبّقنا مصنع إعادة تدوير وعزّزنا برامج الاستدامة، مما أكّد التزامنا بالبيئة. هذه المبادرة الاستراتيجية حسّنت استخدام الموارد وعزّزت الممارسات المسؤولة ورسّخت رؤيتنا للنمو." },
        { year: "2026", title: "الحاضر",                short: "رائد صناعي",             img: "/images/tiempo/timeline-2026.webp",  description: "في عام 2026، لدينا 17 مصنعاً للإنتاج وأكثر من 4,000 موظف وطاقة إنتاجية سنوية تبلغ 220,000 طن. هذا النمو المستدام يرسّخنا كقادة في صناعة البلاستيك، مدعومين ببنية تحتية متينة وكفاءات بشرية متخصصة ورؤية استراتيجية نحو المستقبل." }
      ]
    },

    filosofia: {
      label: "مبادئنا",
      title: "فلسفة GO",
      img:   "/images/about/GO.webp",
      items: [
        "الهوس برضا العميل، لا بالمنافسة.",
        "الشغف بالاختراع والابتكار المستمر.",
        "التميّز التشغيلي في كل عملية.",
        "التفكير بعيد المدى مع نتائج فورية.",
        "أن نكون أفضل صاحب عمل وأكثر بيئة عمل أمناً على الكوكب."
      ]
    },

    vision: {
      label: "إلى أين نتجه",
      title: "الرؤية",
      img:   "/images/about/GO2.webp",
      items: [
        "أن نكون الشركة الأكثر تركيزاً على العميل على الكوكب.",
        "تقديم كل حل متكامل لأي عمل تجاري.",
        "أن نكون الحل الوحيد في التغليف لأي عمل تجاري على الكوكب.",
        "النمو بحضور عالمي دون فقدان التركيز الإنساني."
      ]
    },

    infraestructura: {
      title_white:  "بنية تحتية",
      title_orange: "تدعمنا",
      stats: [
        { number: "13",     label: "مصانع إنتاج",         desc: "منشآت استراتيجية لخدمة الأسواق الوطنية والدولية.", icon: "number" },
        { number: "+3,000", label: "موظف",                 desc: "فريق متخصص يقود كل عملية إنتاجية.", icon: "number" },
        { number: "260",    label: "وحدة لوجستية",         desc: "أسطول خاص يضمن التوزيع الفعّال والتسليم الآمن على المستوى الوطني والدولي.", icon: "number" },
        { number: "عالمي",  label: "حضور دولي",            desc: "تصدير وتوزيع في أمريكا وأوروبا.", icon: "globe" }
      ]
    },

    plantas: {
      title:           "مصانعنا",
      subtitle:        "13 مصنعاً للإنتاج",
      map_img:         "/images/about/mexico_map.png",
      layer_michoacan: "/images/about/michoacan_layer.png",
      layer_monterrey: "/images/about/monterrey_layer.png",
      layer_both:      "/images/about/both_states_layer.png",
      locations: [
        { key: "monterrey", number: "مصنع واحد",   badge: "مونتيريي، نويفو ليون" },
        { key: "michoacan", number: "12 مصنعاً",   badge: "موريليا، ميتشواكان"   }
      ]
    },

    instalaciones: {
      title_white:  "منشآتنا",
      title_orange: "",
      subtitle:     "جولات افتراضية 360°",
      badge_soon:   "قريباً",
      badge_tour:   "مشاهدة الجولة",
      btn_tour:     "مشاهدة الجولة ثلاثية الأبعاد",
      btn_soon:     "قريباً",
      items: [
        { id: "extrusoras", num: "01", title: "ستريتش فيلم",        tag: "موريليا، ميتش.", desc: "خطوط بثق عالية الطاقة حيث يتحوّل البولي بروبيلين إلى خيط مسطح دقيق.",                                            thumb: "/images/virtual/RT.webp", link: "https://my.matterport.com/show/?m=YoM2tyXMeyb&ss=2&sr=2.97,.12&play=1&qs=1&ts=1", soon: true  },
        { id: "telares",    num: "02", title: "شبكات",               tag: "موريليا، ميتش.", desc: "أنوال من أحدث الأجيال تنسج الخيط لإنتاج قماش بولي بروبيلين بأقصى انتظام.",                                      thumb: "/images/virtual/RA.webp", link: "https://my.matterport.com/show/?m=2xCe1VajMjj&ss=1&sr=2.28,-1.47&play=1&qs=1&ts=1", soon: false },
        { id: "laminado",   num: "03", title: "الطلاء والطباعة",     tag: "موريليا، ميتش.", desc: "منطقة الطلاء والطباعة الفليكسوغرافية حيث تحصل الأكياس على التشطيبات والطباعة والمعالجة النهائية بجودة عالية.",  thumb: "/images/virtual/RS.webp", link: "", soon: true  },
        { id: "reciclado",  num: "04", title: "مصنع إعادة التدوير",  tag: "موريليا، ميتش.", desc: "مركز إعادة تدوير البولي بروبيلين لدينا، ملتزم بالاقتصاد الدائري والبيئة.",                                      link: "", soon: true  }
      ]
    },

    capacidad: {
      title:         "الطاقة المركّبة",
      subtitle:      "بنية تحتية عالية الأداء",
      planta_label:  "مصنع",
      plantas_label: "مصانع",
      items: [
        { num: "04", label: "سترات", width: 100, delay: 0 },
        { num: "02", label: "شبكات",               width: 50,  delay: 100 },
        { num: "01", label: "حبل",                 width: 25,  delay: 200 },
        { num: "03", label: "ستريتش فيلم",         width: 50,  delay: 300 },
        { num: "01", label: "تغليف مرن",           width: 25,  delay: 400 },
        { num: "01", label: "إعادة تدوير",         width: 25,  delay: 500 },
        { num: "03", label: "حواف حماية",          width: 75,  delay: 600 },
        { num: "01", label: "شحن",                 width: 25,  delay: 700 },
        { num: "01", label: "مستهلكات",            width: 25,  delay: 800 },
        { num: "01", label: "أكياس",               width: 25,  delay: 900 }
      ]
    },

    valores: {
      title:    "قيمنا",
      subtitle: "ركائز ثقافتنا",
      items: [
        { title: "المسؤولية",   description: "نفي بالتزاماتنا بأخلاق واحترافية، مدركين أثر أفعالنا على العملاء والموظفين والمجتمعات." },
        { title: "الثقة",       description: "نبني علاقات متينة قائمة على الشفافية والأمانة والوفاء بالوعود، مما يخلق الطمأنينة في كل تعامل." },
        { title: "الشغف",       description: "نحب ما نفعله ونعكسه في كل منتج وعملية وابتكار، ندفع نحو التميّز بحماس وتفانٍ حقيقيين." },
        { title: "المثابرة",    description: "نواجه التحديات بعزم وثبات، ونظل راسخين في أهدافنا حتى تحقيق نتائج استثنائية." },
        { title: "الانضباط",    description: "نتبع عمليات صارمة ومعايير جودة بنظام ومنهجية، مما يضمن الاتساق والتميّز في كل تسليم." },
        { title: "المبادرة",    description: "نستشرف الاحتياجات ونتصرف قبل ظهور المشكلات، نخلق حلولاً مبتكرة تولّد قيمة مستمرة." },
        { title: "الاحترام",    description: "نُقدّر التنوع والكرامة ومساهمة كل شخص، نعزّز بيئة تعاون وشمول ومعاملة متساوية." }
      ]
    }
  },

// =================================================
// FOOTER
// =================================================
footer: {
  about_us:         "من نحن",
  about:            "عن الشركة",
  social_impact:    "الأثر الاجتماعي",
  customer_service: "خدمة العملاء",
  be_distributor:   "كن موزعاً",
  catalog:          "الكتالوج",
  cta_button:       "أريد أن أكون موزعاً",
  rights:           "جميع الحقوق محفوظة.",

  // تواصل — المكسيك
  region_mexico:    "المكسيك",
  email:            "atencionacliente@grupo-ortiz.com",
  phone_mx:         "+52 (443) 207-2593",

  // تواصل — الولايات المتحدة
  region_usa:       "الولايات المتحدة",
  phone_us:         "+1 (210) 429-3789",

  // عناوين الولايات المتحدة
  label_warehouse:  "المستودع",
  address_warehouse: "20915 Wilderness Oak, San Antonio TX 78258",

  label_office:     "المكتب",
  address_office:   "San Antonio, TX 78258",
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
      subtitle:         "ندعم الأسر، نمكّن المرأة، نمنح فرصاً ثانية ونهتم بالكوكب. كل خطوة نخطوها تسعى لتحويل الحياة وبناء مستقبل مليء بالأمل.",
      stat_female:      "% نسبة الموظفات",
      stat_recycled:    "طن مُعاد تدويره",
      stat_initiatives: "مبادرة نشطة",
      video:            "/videos/waves2.mp4",
    },

    ods: {
      title:       "شمالنا",
      subtitle:    "خطة 2030",
      description: "نسترشد بأهداف التنمية المستدامة للأمم المتحدة لبناء عالم أكثر عدلاً وازدهاراً واستدامة.",
      cards: [
        { n: 1,  title: "القضاء على الفقر",          link: "https://sdgs.un.org/es/goals/goal1",  img: "/images/odc/1.png"  },
        { n: 2,  title: "القضاء على الجوع",           link: "https://sdgs.un.org/es/goals/goal2",  img: "/images/odc/2.png"  },
        { n: 3,  title: "الصحة والرفاهية",            link: "https://sdgs.un.org/es/goals/goal3",  img: "/images/odc/3.png"  },
        { n: 4,  title: "التعليم الجيد",              link: "https://sdgs.un.org/es/goals/goal4",  img: "/images/odc/4.png"  },
        { n: 5,  title: "المساواة بين الجنسين",       link: "https://sdgs.un.org/es/goals/goal5",  img: "/images/odc/5.png"  },
        { n: 6,  title: "المياه النظيفة",             link: "https://sdgs.un.org/es/goals/goal6",  img: "/images/odc/6.png"  },
        { n: 7,  title: "طاقة نظيفة وبأسعار معقولة", link: "https://sdgs.un.org/es/goals/goal7",  img: "/images/odc/7.png"  },
        { n: 8,  title: "العمل اللائق",               link: "https://sdgs.un.org/es/goals/goal8",  img: "/images/odc/8.png"  },
        { n: 9,  title: "الصناعة والابتكار",          link: "https://sdgs.un.org/es/goals/goal9",  img: "/images/odc/9.png"  },
        { n: 10, title: "الحد من عدم المساواة",       link: "https://sdgs.un.org/es/goals/goal10", img: "/images/odc/10.png" },
        { n: 11, title: "مدن مستدامة",               link: "https://sdgs.un.org/es/goals/goal11", img: "/images/odc/11.png" },
        { n: 12, title: "الإنتاج المسؤول",            link: "https://sdgs.un.org/es/goals/goal12", img: "/images/odc/12.png" },
        { n: 13, title: "العمل المناخي",              link: "https://sdgs.un.org/es/goals/goal13", img: "/images/odc/13.png" },
        { n: 14, title: "الحياة تحت الماء",           link: "https://sdgs.un.org/es/goals/goal14", img: "/images/odc/14.png" },
        { n: 15, title: "الحياة في البر",             link: "https://sdgs.un.org/es/goals/goal15", img: "/images/odc/15.png" },
        { n: 16, title: "السلام والعدالة",            link: "https://sdgs.un.org/es/goals/goal16", img: "/images/odc/16.png" },
        { n: 17, title: "الشراكات لتحقيق الأهداف",   link: "https://sdgs.un.org/es/goals/goal17", img: "/images/odc/17.png" },
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
          desc:  "تطوير مواد مبتكرة وصديقة للبيئة للتغليف المرن يحترم البيئة ويقلل من البصمة الكربونية.",
          img:   "/images/impacto/products.webp"
        },
        {
          label: "الركيزة 02",
          title: "ممارسات الأرض",
          desc:  "تصنيع نظيف واقتصاد دائري في جميع عملياتنا الإنتاجية، نغلق الدورات ونلغي الهدر.",
          img:   "/images/impacto/practices.webp"
        },
        {
          label: "الركيزة 03",
          title: "الأرض الاجتماعية",
          desc:  "التزام شامل مع العملاء والموظفين والمجتمعات، مما يولّد أثراً اجتماعياً إيجابياً وفرصاً حقيقية.",
          img:   "/images/impacto/social.webp"
        }
      ]
    },

    oceanos: {
      hero_title:           "ملتزمون بمستقبل",
      hero_title_highlight: "أنظف لمحيطاتنا",
      hero_video:           "/videos/waves.mp4",
      intro: "في Grupo Ortiz، نؤمن بعالم تعود فيه المحيطات للتألق. من خلال دعم مبادرات عالمية كـ The Ocean Cleanup وجائزة Tom Ford للابتكار في البلاستيك بدعم من Lonely Whale، نعمل على تقليل البلاستيك في بحارنا. كل عملية شراء تقوم بها معنا هي خطوة نحو كوكب أنظف ومستقبل مستدام للجميع. معاً ننقذ المحيطات!",
      features: [
        { title: "ندعم التنظيف العالمي",               desc: "بالتعاون مع مبادرات كـ The Ocean Cleanup."                              },
        { title: "نعزّز الابتكار المستدام",            desc: "من خلال برامج كجائزة Tom Ford للابتكار في البلاستيك."                 },
        { title: "نشجّع المنتجات المسؤولة",           desc: "التي تقلّل من الأثر البيئي على المحيطات."                              },
        { title: "نُلهم العمل الجماعي",                desc: "بدعوة العملاء والشركاء ليكونوا جزءاً من التغيير."                     }
      ],
      partners: [
        {
          title:  "ابتكار Tom Ford",
          desc:   "تسعى هذه المبادرة العالمية إلى إحداث ثورة في صناعة البلاستيك من خلال تكريم وتعزيز الحلول المبتكرة التي تحلّ محل البلاستيك أحادي الاستخدام. يركّز نهجها على بدائل مستدامة وقابلة للتوسع تقلّل الأثر البيئي وتحمي المحيطات وتشجّع التحوّل نحو مواد أكثر مسؤولية.",
          btn:    "اعرف المزيد",
          link:   "https://unwrapthefuture.org/",
          video:  "/videos/impacto/oceancleanup.mp4",
          poster: "/images/impacto/cultura-calidad.jpg"
        },
        {
          title:  "تنظيف المحيط",
          desc:   "تكرّس هذه المنظمة جهودها لتنظيف محيطات العالم، وتطوّر تقنيات متقدمة لإزالة البلاستيك المتراكم في البحار ومنع وصوله عبر التدخل في الأنهار، المصادر الرئيسية للتلوث. مهمتها استعادة صحة النظم البيئية البحرية وحماية التنوع البيولوجي وضمان مستقبل نظيف للأجيال القادمة.",
          btn:    "اعرف المزيد",
          link:   "https://theoceancleanup.com/",
          video:  "/videos/impacto/tomford.mp4",
          poster: "/images/impacto/tomford.webp"
        }
      ]
    },

    stats: {
      recycled: "طن مُعاد تدويره",
      female:   "% نسبة الموظفات",
      families: "أسرة مستفيدة"
    },

    timeline: {
      title:    "مبادرات تُحدث التحوّل",
      subtitle: "أثر إيجابي دائم",
      items: [
        {
          num: "01", title: "بيت الأمل",
          desc:       "دعم دار الأيتام في تاكامبارو، ميتشواكان. كل طفل يستحق منزلاً مليئاً بالحب.",
          desc_short: "دعم دار الأيتام في تاكامبارو، ميتشواكان.",
          img:        "/images/impacto/hogar.mp4",
          isVideo:    true,
          poster:     "/images/impacto/hogar.mp4"
        },
        {
          num: "02", title: "سلة GO",
          desc:       "متحدون من أجل المجتمع. توزيع سلال غذائية بمحبة.",
          desc_short: "توزيع سلال غذائية بمحبة للمجتمع.",
          img:        "/images/impacto/despensas.webp",
          isVideo:    false
        },
        {
          num: "03", title: "صفر أثر",
          desc:       "سياسة الصفر هدر. تحويل النفايات إلى فرص.",
          desc_short: "سياسة الصفر هدر. تحويل النفايات إلى فرص.",
          img:        "/images/impacto/composta.webp",
          isVideo:    false
        },
        {
          num: "04", title: "السماد الحي",
          desc:       "تصنيع منتجات قابلة للتحلل. ابتكار يحترم الطبيعة.",
          desc_short: "منتجات قابلة للتحلل. ابتكار مستدام.",
          img:        "/images/impacto/GO.webp",
          isVideo:    false
        },
        {
          num: "05", title: "تألّق GO",
          desc:       "هدايا تقديرية للأداء لفريق GO. نقدّر الجهد.",
          desc_short: "تقدير فريق GO على أدائه.",
          img:        "/images/impacto/woman.webp",
          isVideo:    false
        },
        {
          num: "06", title: "أيادٍ تقود",
          desc:       "84% من الكوادر نساء. تمكين النساء القياديات.",
          desc_short: "56.82% من الكوادر نساء. تمكين القياديات.",
          img:        "/images/impacto/bio.webp",
          isVideo:    false
        }
      ]
    },

    cta: {
      title:        "معاً",
      title_orange: "نُحدث التغيير",
      desc:         "نحن الشريك الاستراتيجي الذي تحتاجه شركتك للنمو بالتكنولوجيا والخبرة والنتائج.",
      contact:      "اتصل بنا",
      products:     "عرض المنتجات"
    }
  },

  // =================================================
  // صفحة: الرئيسية (Index)
  // =================================================
  home: {
    meta_title: "Grupo Ortiz | مصنّع البوليمرات والتغليف في المكسيك",
    meta_description: "أكثر من 65 عاماً في تصنيع ستريتش فيلم والأكياس والحبال والرافيا وشبكات الشبك والتغليف المرن. الرائد في البوليمرات البلاستيكية في المكسيك وأمريكا اللاتينية.",
    hero: {
      eyebrow:      "منذ 1959",
      title_top:    "نحن الشركة المصنّعة",
      title_bot:    "الرائدة في أمريكا اللاتينية",
      video: "home_zv3jjz",
      subtitle:     "أكثر من 65 عاماً في تصنيع حلول هندسية متقدمة للصناعات في القارات الخمس.",
      btn_products: "منتجاتنا",
      btn_about:    "اعرف أكثر",
      stats: [
        { number: 65,   label: "عاماً من الخبرة" },
        { number: 3000, prefix: "+", label: "موظف"         },
        { number: 5,    prefix: "",  label: "قارات"         }
      ]
    },

    divisiones: {
      tag:       "أقسامنا",
      title:     "مجالات",
      title_em:  "التخصص",
      link_text: "عرض المنتجات",
      items: [
        { title: "شبكة",           tag: "القسم 01", description: "أكياس شبكية من رافيا البولي بروبيلين بنسيج مسطح ودائري. تصميم مهوّى مثالي للفواكه والخضروات والمنتجات الزراعية.",                           img: "/images/divisiones/arpilla.webp",           color: "#2d8a4e", slug: "arpillas",           soon: false },
        { title: "حبل",            tag: "القسم 02", description: "حبال بولي بروبيلين عالية المتانة للاستخدامات الزراعية والصناعية والبحرية. مقاومة كبيرة للعوامل الجوية وفلتر UV مدمج.",                    img: "/images/divisiones/cuerdas.webp",           color: "#1a5f8a", slug: "cuerdas",            soon: false },
        { title: "رافيا",          tag: "القسم 03", description: "رافيا بولي بروبيلين عالية الأداء. خفيفة جداً وعالية المقاومة للكسر ومتعددة الاستخدامات للزراعة والدواجن والبستنة.",                        img: "/images/divisiones/rafia.webp",             color: "#8a6d2d", slug: "rafias",             soon: false },
        { title: "تغليف مرن",      tag: "القسم 04", description: "أفلام عالية الحاجز ولمينيشن متخصص. حماية مثلى للأغذية والمنتجات الصناعية بتقنية متقدمة.",                                                img: "/images/divisiones/bolsa.webp",             color: "#0d7377", slug: "empaques-flexibles", soon: false },
        { title: "كيس",            tag: "القسم 05", description: "أكياس رافيا بجودة فائقة. حل تعبئة متين للأغذية والمواد الكيميائية والأسمدة والمنتجات السائبة.",                                            img: "/images/divisiones/sacos.webp",             color: "#3a7d44", slug: "sacos",              soon: false },
        { title: "ستريتش فيلم",    tag: "القسم 06", description: "فيلم تمدد بوضوح بصري عالٍ. يضمن سلامة الحمولة بكفاءة في التكاليف. يشمل خياراً قابلاً للتحلل البيولوجي.",                                  img: "/images/divisiones/film-estirable.webp",    color: "#2c5f8a", slug: "stretch-film",       soon: false },
        { title: "حافة حماية",     tag: "القسم 07", description: "حواف كرافت لحماية الحواف أثناء التخزين والنقل. توزيع متساوٍ للضغط وأقصى استقرار للأحمال.",                                                img: "/images/divisiones/esquineros.webp",        color: "#7b3fa0", slug: "esquineros",         soon: false },
        { title: "مستهلكات",       tag: "القسم 10", description: "منتجات مستهلكة من البولي بروبيلين للاستخدام الصناعي والغذائي والطبي. حلول صحية واقتصادية وعالية المقاومة.",                               img: "/images/divisiones/desechables.webp",       color: "#e05500", slug: "desechables",        soon: true  }
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
        { title: "جودة معتمدة",        description: "منتجات تستوفي أعلى المعايير الدولية للتصنيع."              },
        { title: "ابتكار مستمر",       description: "استثمار دائم في البحث والتطوير للحفاظ على الريادة التقنية." },
        { title: "انتشار عالمي",       description: "حضور فعّال في 5 قارات بشبكة توزيع فعّالة."                }
      ]
    },

    certs: {
      tag:      "جودة مضمونة",
      title:    "شهاداتنا",
      title_em: "",
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
        text:    "نستثمر في البحث والتطوير لتقديم منتجات تتجاوز توقعات السوق العالمي بتقنية متقدمة."
      },
      card2: {
        eyebrow: "التزامنا",
        title:   "الاستدامة",
        text:    "عمليات مسؤولة بيئياً وبرامج نشطة لإعادة التدوير وتقليل البصمة الكربونية في جميع مراحل السلسلة."
      }
    },

    global: {
      tag:      "حضور عالمي",
      title:    "نُصدّر إلى",
      title_em: "العالم",
      desc:     "تصل منتجاتنا إلى عملاء في أكثر من 30 دولة، مما يرسّخ موقعنا كقادة في البوليمرات البلاستيكية.",
      video: "camion_n1nitn",
      stats: [
        { number: 65,   label: "عاماً"    },
        { number: 30,   prefix: "+", label: "دولة"    },
        { number: 3000, prefix: "+", label: "شخصاً"   },
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