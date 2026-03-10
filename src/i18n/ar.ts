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
    distributor: 'موزع',
    contact: 'اتصل بنا'
  },

  // =================================================
  // الصفحة الرئيسية / الغلاف
  // =================================================
  hero: {
    title: "أهلاً وسهلاً",
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
    waStart: 'مرحباً Grupo Ortiz، أودّ الحصول على عرض سعر',
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
  // صفحة العروض الترويجية
  // =================================================
  promociones: {
    meta_title: "العروض الترويجية | Grupo Ortiz",
    hero: {
      label: "عروض خاصة",
      title: "العروض الترويجية",
      subtitle: "استفد من عروضنا المحدودة",
      validity: "ساري حتى نفاد المخزون*"
    },
    discount_badge: "حتى",
    off_text: "خصم",
    original_price: "السعر الأصلي",
    promo_price: "السعر الترويجي",
    buy_button: "طلب عرض سعر",
    contact_cta: "تواصل مع مستشار للحصول على مزيد من المعلومات",
    valid_until: "ساري حتى نفاد المخزون*",

    products: [
      {
        id: "promo-stretch",
        name: "فيلم التمديد",
        subtitle: "٣٣ للكيلوغرام على فيلم التمديد الملون",
        image: "/images/stretch/manual.webp",
        discount: 35,
        originalPrice: "",
        promoPrice: "٣٣/كغ",
        features: [
          "فيلم تمديد ملوّن",
          "سعر مميز لكل كيلوغرام",
          "مخزون محدود",
          "متوفر بألوان متعددة"
        ],
        validUntil: "ساري حتى نفاد المخزون*"
      },
      {
        id: "promo-cuerda",
        name: "حبل",
        subtitle: "٣٣ للكيلوغرام",
        image: "/images/cuerdas/CuerdaT1.webp",
        discount: 25,
        originalPrice: "",
        promoPrice: "٣٣/كغ",
        features: [
          "حبل عالي الجودة",
          "سعر مميز لكل كيلوغرام",
          "عرض لفترة محدودة",
          "التوفر رهن بالمخزون"
        ],
        validUntil: "ساري حتى نفاد المخزون*"
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
      description: "جودة وحلول متكاملة في وثيقة واحدة. اختر لغتك المفضلة للاطلاع على عرضنا المؤسسي.",
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
        name: "فيلم التمديد",
        desc: "فيلم تمديد لتأمين الأحمال وحمايتها. حل فعّال لتغليف البالِتات والنقل الآمن.",
        image: "/images/catalogo/img1.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1HYGcpgkRO_7OX22IcWvRpzpLZKgpYV3A/view?usp=sharing",
          en: "https://drive.google.com/file/d/1QZ6jmKyc-CGLwh9brbeZSQ5OOzkKdBCQ/view?usp=sharing",
        }
      },
      {
        id: "2",
        name: "حبال",
        desc: "متانة وصلابة للربط الصناعي وصيد الأسماك. مصنوعة من مواد عالية الجودة للاستخدام المكثف.",
        image: "/images/catalogo/img2.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/14GrV9P1ViQKvFp3BucYjgmryRgWKLEZh/view?usp=sharing",
          en: "https://drive.google.com/file/d/19Tvd_VHjogSE7y7cLZYr4ra__4vB4nOm/view?usp=sharing",
        }
      },
      {
        id: "3",
        name: "رافيا",
        desc: "المعيار في الربط للزراعة والصناعة. مادة متينة ومرنة لتطبيقات متعددة.",
        image: "/images/catalogo/img3.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1uAiR4uxO2iX_LsNFul6kXeb7jnnCEV_J/view?usp=sharing",
          en: "https://drive.google.com/file/d/10PV-sxexE8UkFSOhdTJBe1xWCy_tdFib/view?usp=sharing",
        }
      },
      {
        id: "4",
        name: "أكياس شبكية",
        desc: "نسيج شبكي مفتوح لأقصى تهوية زراعية. حلول متعددة الاستخدام لتعبئة المنتجات الزراعية ونقلها.",
        image: "/images/catalogo/img4.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1OQKGpnRCfA2yFdAlT6q7GczYua2FFFVU/view?usp=sharing",
          en: "https://drive.google.com/file/d/1wldGL6XuqH-Ruth9Y01-hkNnPlbg9SW5/view?usp=sharing",
        }
      },
      {
        id: "5",
        name: "أكياس مضفورة",
        desc: "بولي بروبيلين منسوج مسطح للتعبئة بالجملة. متانة فائقة للمنتجات السائبة.",
        image: "/images/catalogo/img5.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/16S43-PUrQECO9q2J1fOgbN-YeIxQ2GhP/view?usp=sharing",
          en: "https://drive.google.com/file/d/1fkZvAWTT3mnBkxQ0Gbb2kRgOoN2dJZiK/view?usp=sharing",
        }
      },
      {
        id: "6",
        name: "واقيات الزوايا",
        desc: "حماية هيكلية واستقرار للبالِتات. تعزيز أساسي في لوجستيات التخزين ونقل البضائع.",
        image: "/images/catalogo/img6.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/181Hvr0HQffLU3rmcXkccYoqj-Y_A-gxr/view?usp=sharing",
          en: "https://drive.google.com/file/d/1DdcEavACvuY00oyMyC9rOWRybi9jnQrD/view?usp=sharing",
        }
      },
      {
        id: "7",
        name: "التغليف المرن",
        desc: "أفلام عازلة عالية الأداء وتصفيح متخصص. حماية مثلى للمواد الغذائية والمنتجات الصناعية.",
        image: "/images/catalogo/img7.webp",
        catalogs: {
          es: "https://drive.google.com/file/d/1TGxUcGHjW1NHF8K8YkRisbRE8uAuTnPO/view?usp=sharing",
          en: "https://drive.google.com/file/d/126eYsoqq9WI1SR-zoMdQJE7HS8cJR48m/view?usp=sharing",
        }
      }
    ]
  },

  // =================================================
  // قائمة المنتجات الرئيسية (عرض دوار /products)
  // =================================================
  products_list: [
    {
      img: "carrusel/img1.webp",
      division: "فيلم التمديد",
      descripcion: "فيلم تمديد بوضوح بصري عالٍ وفق أعلى معايير الجودة. يضمن سلامة الحمولة وكفاءة التكلفة. تشمل تشكيلتنا خياراً قابلاً للتحلل البيولوجي يتحلل بنسبة ٩٠٪ أسرع.",
      slug: "stretch-film",
      video: "carrusel/stretch-film.mp4"
    },
    {
      img: "carrusel/img4.webp",
      division: "أكياس شبكية",
      descripcion: "أكياس شبكية من رافيا البولي بروبيلين بنسيج دائري عالي المتانة والمقاومة. تصميم جيد التهوية مثالي للفواكه والخضروات.",
      slug: "arpillas",
      video: "carrusel/arpillas.mp4"
    },
    {
      img: "carrusel/img2.webp",
      division: "حبال",
      descripcion: "حبال خيطية من البولي بروبيلين (PP) عالية الأداء. توازن مثالي: خفة فائقة دون التنازل عن مقاومة الكسر.",
      slug: "cuerdas",
      video: "carrusel/cuerdas.mp4"
    },
    {
      img: "carrusel/img3.webp",
      division: "رافيا",
      descripcion: "رافيا فيلم بولي بروبيلين (PP) عالية الأداء. خفيفة جداً وعالية المقاومة للكسر. مرنة ومتعددة الاستخدامات.",
      slug: "rafias",
      video: "carrusel/rafia.mp4"
    },
    {
      img: "carrusel/img5.webp",
      division: "أكياس مضفورة",
      descripcion: "أكياس رافيا فائقة الجودة. حل تعبئة متين للمواد الغذائية والمواد الكيميائية والأسمدة.",
      slug: "sacos",
      video: "carrusel/sacos.mp4"
    },
    {
      img: "carrusel/img6.webp",
      division: "واقيات الزوايا",
      descripcion: "واقيات زوايا كرتونية لتحسين اللوجستيات. متانة هيكلية واستقرار أعلى للحمولة.",
      slug: "esquineros",
      video: "carrusel/esquineros.mp4"
    },
    {
      img: "carrusel/img7.webp",
      division: "تغليف مرن",
      descripcion: "تتخصص Neo Empaques International في حلول التغليف المرن المتقدمة، المصممة لتحسين الحفاظ على المنتجات وعرضها في صناعات متعددة.",
      slug: "empaques-flexibles",
      video: "carrusel/bobina-impresa.mp4"
    }
  ],

  // =================================================
  // صفحة: فيلم التمديد
  // =================================================
  stretch_film: {
    meta_title: "فيلم التمديد | Grupo Ortiz",
    back_aria: "العودة إلى المنتجات",
    specs_title: "المواصفات الفنية",

    specs_labels: {
      width: "العرض",
      length: "الطول",
      gauge: "السُّمك",
      weight: "الوزن",
      type: "الاستخدام"
    },

    products: [
      {
        name: 'فيلم تمديد بريميوم',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "مصمم للآلات عالية المتطلبات، يوفر فيلم التمديد هذا المتوسط التمدد حلاً فعالاً وموثوقاً لتأمين الأحمال في العمليات الآلية. يضمن تركيبته مقاومة عالية وأداءً متفوقاً في تطبيقات التغليف المتطلبة.",
        specs_values: { width: "٤٨٠–٧٦٠ مم", length: "٣٠٠–٤٬٥٧٠ م", gauge: "٤٠–١١٠", weight: "١٠–٤٠ كغ", type: "يدوي" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      },
      {
        name: 'فيلم تمديد أوتوماتيكي',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "مصمم للاستخدام مع آلات التلفيف التقليدية، يقدم فيلم التمديد هذا أداءً عالياً ونتائج ممتازة في عمليات تغليف البالِتات الآلية. يضمن تركيبته القوة والثبات عند تأمين الأحمال.",
        specs_values: { width: "٤٦٠–٧٦٠ مم", length: "٦٠٠–٤٬٥٧٠ م", gauge: "٥٠–١١٠", weight: "١٠–٢٢ كغ", type: "أوتوماتيكي" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      },
      {
        name: 'فيلم تمديد يدوي مسبق الشد',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "مصمم للتطبيق اليدوي عالي الأداء، يتميز هذا الفيلم المسبق الشد بكونه من أرق الأسماك في السوق. تلغي تقنيته الحاجة إلى بذل قوة إضافية عند التلفيف، مما يسهّل الاستخدام الفوري ويحسّن كفاءة عملية تغليف البالِتات.",
        specs_values: { width: "٤٠٥–٤٣٠ مم", length: "٢٬١٣٥–٧٬٦٢٠ م", gauge: "٤٠–١٢٠", weight: "١٠–٤٠ كغ", type: "يدوي" },
        gallery: [
          '/images/stretch/stretch2.png',
          '/images/stretch/stretch.png',
          '/images/stretch/stretch3.png'
        ]
      },
      {
        name: 'فيلم تمديد شرائط يدوي',
        img: '/images/stretch/manual.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "مصمم للتطبيق اليدوي بتمدد معتدل، يوفر فيلم التمديد التقليدي هذا أداءً ممتازاً في عمليات التغليف وتأمين الأحمال. يضمن تركيبته القوة والثبات للتطبيقات العامة.",
        specs_values: { width: "٧٥–٣٠٥ مم", length: "٢٬١٣٥–٧٬٦٢٠ م", gauge: "٤٠–١٢٠", weight: "١٠–٤٠ كغ", type: "يدوي" },
        gallery: [
          '/images/stretch/rigido2.png',
          '/images/stretch/manual.png',
          '/images/stretch/rigido3.png'
        ]
      },
      {
        name: 'فيلم تمديد يدوي صلب',
        img: '/images/stretch/stretch.png',
        video: "/videos/stretch/fondo.mp4",
        link: '#',
        description: "مُصاغ خصيصاً لتطبيقات التلفيف اليدوي ذات التمدد المحدود، يوفر فيلم التمديد هذا أداءً عالياً وموثوقية كبيرة في عمليات التغليف. يضمن تركيبته الثبات والكفاءة في تأمين الأحمال.",
        specs_values: { width: "٤٣٠–٧٦٠ مم", length: "٣٠٠–٤٬٥٧٠ م", gauge: "٤٠–٩٠", weight: "١٠–٤٠ كغ", type: "يدوي", color: "أسود / ملون" },
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
    meta_title: "حبال | Grupo Ortiz",
    back_aria: "رجوع",
    loading: "جارٍ التحميل...",
    specs_title: "المواصفات الفنية",

    specs_labels: {
      load: "الإنتاجية",
      mat: "المادة",
      weight: "الوزن",
      resist: "مقاومة الكسر",
      charge: "المقاس"
    },

    products: [
      {
        name: 'حبل الأدوات',
        img: '/images/cuerdas/CuerdaT1.webp',
        video: "/videos/cuerdas/cuerda-1.mp4",
        link: '#',
        description: "مصنوع من البولي بروبيلين مع مرشح أشعة فوق بنفسجية متقدم، هذا الحبل مثالي للأنشطة ذات التعرض العالي للشمس. تركيبته المتخصصة تبطئ التآكل الطبيعي وتطيل عمر الاستخدام، مما يضمن مقاومة ومتانة أكبر في مواجهة العوامل الجوية. إنه حبل الأدوات المثالي لتوفير الصلابة والأمان والأداء الموثوق في التطبيقات العامة والأعمال الشاقة.",
        specs_values: { load: "١٬٩٨٠ م", mat: "PP-UV", weight: "١٨ كغ", resist: "٧٩ كغق", charge: "٤–١٩ مم" },
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
        description: "مصنوع من البولي بروبيلين (PP) ومثبت أشعة فوق بنفسجية، هذا الحبل مثالي للقطاع البحري والأنشطة ذات التعرض العالي للشمس. تركيبته المتخصصة تبطئ التدهور الناجم عن الأشعة فوق البنفسجية، مما يطيل عمر الاستخدام ويضمن مقاومة جوية أكبر. إنه الحل الأمثل لتوفير الصلابة والاستقرار في الأنفاق الزراعية الكبيرة.",
        specs_values: { load: "٣٬٢٤٠ م", mat: "PP-UV", weight: "١٨ كغ", resist: "٤٨ كغق", charge: "٣–٨ مم" },
        gallery: [
          '/images/cuerdas/CuerdaNegra6-1.png',
          '/images/cuerdas/CuerdaNegra.webp',
          '/images/cuerdas/CuerdaNegra6-3.png'
        ]
      },
      {
        name: 'حبل صديق للبيئة',
        img: '/images/cuerdas/CuerdaEco.png',
        video: "/videos/cuerdas/CuerdaE.mp4",
        link: '#',
        description: "مصنوع من بولي بروبيلين (PP) عالي الجودة، يتوفر هذا الحبل بمجموعة واسعة من الأشكال والأقطار والألوان، بخيارات سادة أو مدمجة، معززة أو بعلامة تجارية. تجعله متعدديته ومتانته خياراً موثوقاً لتطبيقات متعددة في الصناعات والمصانع والمستودعات والأسواق وصالات العدد والمشاغل.",
        specs_values: { load: "٣٬٢٤٠ م", mat: "PP-UV", weight: "١٨ كغ", resist: "٤٨ كغق", charge: "٣–٨ مم" },
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
    back_aria: "رجوع",
    specs_title: "المواصفات الفنية",

    specs_labels: {
      cal: "القطر",
      yield: "الإنتاجية (م)",
      resist: "مقاومة الكسر (كغ)",
      usage: "المادة"
    },

    products: [
      {
        name: "رافيا الربط",
        description: "مصنوعة من بولي بروبيلين ١٠٠٪ بكر، تتميز هذه الرافيا بمقاومة عالية وإنتاجية ممتازة مع الحفاظ على خصائصها الفيزيائية حتى في الظروف الخارجية. تضمن جودتها المتانة والأداء الموثوق في التطبيقات المطلوبة. تُستخدم على نطاق واسع في قطاعات الزراعة والدواجن والبستنة.",
        img: "/images/rafias/atar.png",
        video: "/videos/rafia/fondoN.mp4",
        specs_values: {
          cal: "٢–٨ مم",
          yield: "٩٠ كغ",
          resist: "٦٠–٣٢٠ f",
          usage: "PP-UV"
        },
        gallery: [
          '/images/rafias/atar2.png',
          '/images/rafias/atar.png',
          '/images/rafias/atar3.png'
        ]
      },
      {
        name: "رافيا صديقة للبيئة",
        description: "مصنوعة من بولي بروبيلين عالي الجودة، تتميز هذه الرافيا بمقاومة ممتازة وتحافظ على خصائصها الفيزيائية حتى في الظروف الخارجية. إنتاجيتها الموثوقة تجعلها خياراً مثالياً لتطبيقات الزراعة والدواجن والبستنة.",
        img: "/images/rafias/Eco.png",
        video: "/videos/rafia/fondoE.mp4",
        specs_values: {
          cal: "٢–٨ مم",
          yield: "٩٠–٥٠٠ كغ",
          resist: "٥٩–٢٥٥ f",
          usage: "PP-UV"
        },
        gallery: [
          '/images/rafias/Eco2.png',
          '/images/rafias/Eco.png',
          '/images/rafias/Eco3.png'
        ]
      },
      {
        name: "رافيا مليفة سوداء",
        description: "مصنوعة من بولي بروبيلين عالي الجودة، تتميز هذه الرافيا بمقاومة كبيرة وتحافظ على خصائصها الفيزيائية حتى في الظروف الخارجية. إنتاجيتها الممتازة تجعلها مثالية للتطبيقات الصناعية والأدوات والتعبئة، فضلاً عن قطاعات الزراعة والدواجن والبستنة.",
        img: "/images/rafias/negra.png",
        video: "/videos/rafia/fondoR.mp4",
        specs_values: {
          cal: "٢–٨ مم",
          yield: "٩٠–٥٠٠ كغ",
          resist: "٥٩–٢٥٥ f",
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
  // صفحة: الأكياس الشبكية
  // =================================================
  arpillas: {
    meta_title: "أكياس شبكية | Grupo Ortiz",
    back_aria: "رجوع",
    specs_title: "المواصفات الفنية",

    specs_labels: {
      construction: "بنية النسيج",
      sizes: "العرض",
      colors: "الألوان",
      features: "نوع الإغلاق"
    },

    products: [
      {
        name: 'كيس شبكي دائري',
        img: '/images/arpillas/arpilla.webp',
        video: "/videos/arpilla/circular.mp4",
        link: '#',
        description: "مصنوع من بولي بروبيلين ١٠٠٪ بكر ببنية رافيا، يتميز هذا الكيس الشبكي بمقاومة عالية وأداء ممتاز في تطبيقات التعبئة والتخزين. تضمن جودته المتانة والأداء الموثوق في التعامل مع مختلف المنتجات.",
        specs_values: {
          sizes: "٢٣–٧٠ سم",
          colors: "٤",
          features: "خيط سحب"
        },
        gallery: [
          '/images/arpillas/circular2.webp',
          '/images/arpillas/arpilla.webp',
          '/images/arpillas/circular3.webp'
        ]
      },
      {
        name: 'كيس شبكي أحادي الخيط',
        img: '/images/arpillas/arpilla2.webp',
        video: "/videos/arpilla/mono.mp4",
        link: '#',
        description: "مصنوع من بولي بروبيلين ١٠٠٪ بكر ببنية رافيا/أحادية الخيط، يتميز هذا الكيس الشبكي بمقاومة عالية وأداء ممتاز في تطبيقات التعبئة والتخزين. توفر بنيته المتانة والأداء الموثوق في التعامل مع مختلف المنتجات وحمايتها.",
        specs_values: {
          construction: "أحادي الخيط",
          sizes: "٢٣–٧٠ سم",
          colors: "٢",
          features: "خيط سحب"
        },
        gallery: [
          '/images/arpillas/mono2.webp',
          '/images/arpillas/arpilla2.webp',
          '/images/arpillas/mono3.webp'
        ]
      },
      {
        name: 'كيس شبكي بخياطة جانبية',
        img: '/images/arpillas/arpilla3.webp',
        video: "/videos/arpilla/costura.mp4",
        link: '#',
        description: "مصنوع من بولي بروبيلين ١٠٠٪ بكر ببنية رافيا/أحادية الخيط، يتميز هذا الكيس الشبكي بمقاومة عالية وأداء ممتاز في تطبيقات التعبئة والتخزين. تضمن بنيته المتانة والموثوقية في التعامل مع مختلف المنتجات.",
        specs_values: {
          type: "جانبي",
          construction: "أحادي الخيط",
          sizes: "٢٣–٦٠ سم",
          colors: "٤",
          features: "معزز"
        },
        gallery: [
          '/images/arpillas/lateral1.webp',
          '/images/arpillas/arpilla3.webp',
          '/images/arpillas/lateral3.webp'
        ]
      },
      {
        name: 'كيس شبكي بملصق مغلّف',
        img: '/images/arpillas/arpilla4.webp',
        video: "/videos/arpilla/etiqueta.mp4",
        link: '#',
        description: "مصنوع من بولي بروبيلين ١٠٠٪ بكر ببنية رافيا/رافيا، يتميز هذا الكيس الشبكي بمقاومة عالية وأداء ممتاز في عمليات التعبئة والتخزين. يضمن نسيجه المتانة والموثوقية للتطبيقات المتطلبة في السوقين المحلي والتصدير.",
        specs_values: {
          type: "مغلّف",
          construction: "رافيا",
          sizes: "٢٣–٧٠ سم",
          colors: "٤",
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
  // صفحة: الأكياس المضفورة
  // =================================================
  sacos: {
    meta_title: "أكياس مضفورة | Grupo Ortiz",
    back_aria: "العودة إلى المنتجات",
    specs_title: "المواصفات الفنية",

    specs_labels: {
      load: "العرض",
      unit: "الطول",
      mat: "المادة",
      weight: "مقاومة الكسر"
    },

    products: [
      {
        name: 'كيس رافيا غير مغلّف',
        img: '/images/sacos/saco2.png',
        model: '/models/saco_blanco.glb',
        video: "/videos/saco/slaminar.mp4",
        link: '#',
        description: "مصنوعة من شرائط بولي بروبيلين متشابكة، توفر أكياس الرافيا غير المغلّفة مقاومة كبيرة ومتانة ممتازة في تطبيقات التعبئة والتخزين. تستطيع بنيتها تحمّل الأحمال الثقيلة دون تمزق، مما يضمن الأداء الموثوق في الأعمال الشاقة.",
        specs_values: {
          load: "٣٥–٨٠ سم",
          unit: "٤٩–١١٥ سم",
          mat: "PP",
          weight: "١٢٠–٢٠٠ كغق"
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
        description: "مصنوعة من شرائط بولي بروبيلين ذات مظهر شفاف، تتميز هذه الأكياس بمقاومة عالية وتتيح رؤية ممتازة للمنتج المعبأ. تضمن بنيتها المتانة والأداء الموثوق في تطبيقات التخزين والنقل.",
        specs_values: {
          load: "٣٥–٨٠ سم",
          unit: "٤٩–١١٥ سم",
          mat: "PP",
          weight: "١٢٠–٢٠٠ كغق"
        },
        gallery: [
          '/images/sacos/laminado2.png',
          '/images/sacos/saco.png',
          '/images/sacos/laminado3.png'
        ]
      },
      {
        name: 'كيس رافيا صديق للبيئة',
        img: '/images/sacos/saco3.png',
        video: "/videos/saco/eco.mp4",
        link: '#',
        description: "مصنوعة من مواد معاد تدويرها مصدرها الفاقد في نفس العملية الإنتاجية، توفر هذه الأكياس المقاومة والمتانة الجيدة بتكلفة أكثر اقتصاداً. يتيح تصنيعها أداءً موثوقاً في تطبيقات التعبئة والتخزين العامة.",
        specs_values: {
          load: "٤٥–٨٠ سم",
          unit: "٤٩–١١٥ سم",
          mat: "PP",
          weight: "١٢٠–٢٠٠ كغق"
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
    specs_title: "المواصفات الفنية",

    specs_labels: {
      tab:      "عرض الجناح",
      thick:    "السُّمك",
      length:   "الطول",
      tabyd:    "عرض الجناح (م)",
      thickyd:  "السُّمك (م)",
      lengthyd: "الطول (م)"
    },

    products: [
      {
        name: "واقي زاوية كرافت بني",
        description: "مصنوع لحماية الحواف والزوايا أثناء النقل والتخزين، يوزع واقي الزاوية هذا الضغط بشكل منتظم، مما يمنع تشوه البضائع وإتلافها. توفر بنيته المقاومة والثبات في تطبيقات التغليف المتطلبة.",
        img: "/images/esquinero/esquinero.png",
        video: "/videos/esquinero/esquinero.mp4",
        link: "#",
        specs_values: {
          tab:    "٣٨ مم",
          thick:  "٠٫٠٨ مم",
          length: "٣٠ سم"
        },
        gallery: [
          '/images/esquinero/esquinero2.png',
          '/images/esquinero/esquinero.png',
          '/images/esquinero/esquinero3.png'
        ]
      },
      {
        name: "واقي زاوية كرافت أبيض",
        description: "مصنوع لحماية الحواف والزوايا أثناء النقل والتخزين، يوزع واقي الزاوية هذا الضغط بشكل منتظم، مما يمنع تشوه البضائع وإتلافها. توفر بنيته المقاومة والثبات في تطبيقات التغليف المتطلبة.",
        img: "/images/esquinero/esquinerob.png",
        video: "/videos/esquinero/esquinero.mp4",
        link: "#",
        specs_values: {
          tab:    "٣٨ مم",
          thick:  "٠٫٠٨ مم",
          length: "٣٠ سم"
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
    meta_title: "تغليف مرن | Grupo Ortiz",
    back_aria: "العودة إلى المنتجات",
    specs_title: "المواصفات الفنية",

    specs_labels: {
      lamination: "التصفيح",
      finish:     "التشطيب",
      size:       "الحجم الأقصى",
      zipper:     "سحّاب",
      type:       "النوع"
    },

    products: [
      {
        name: "بكرة مطبوعة",
        description: "تتوفر بكراتنا بتشكيلة واسعة من أنواع التصفيح والسُّمك والتشطيب. طباعة تصل إلى ١٠ ألوان بدقة ٥٢ خطاً/سم. الحجم الأقصى: ١٬١٤٠ مم. عرض الطباعة الأقصى: ١٬٤٥٠ مم. متوافقة مع آلات التعبئة الأوتوماتيكية لتحسين كفاءة الإنتاج.",
        img: "/images/flexible/bobina-impresa.png",
        video: "/videos/flexible/bobinaf.mp4",
        gallery: [
          "/images/flexible/bobina-impresa-1.png",
          "/images/flexible/bobina-impresa.png",
          "/images/flexible/bobina-impresa-3.png"
        ],
        specs_values: {
          lamination: "٣ أنواع",
          finish:     "متنوعة",
          size:       "١٬٤٥٠ مم",
          zipper:     "لا ينطبق",
          type:       "بكرة"
        }
      },
      {
        name: "كيس ستاند أب باوتش",
        description: "أكياس ستاند أب متعددة الاستخدامات ببنية مصفّحة وحاجز عالٍ ضد الرطوبة والأكسجين. مثالية للأغذية الجافة أو الرطبة والمساحيق والسوائل ومستحضرات التجميل والمواد الكيميائية. متوفرة بتشطيبات طبيعية ومطفأة ومعدنية، بسعات من ١٥٠ غرام حتى ١ كغ، مع خيار سحّاب ونافذة شفافة.",
        img: "/images/flexible/standup-generica.png",
        video: "/videos/flexible/standup.mp4",
        gallery: [
          "/images/flexible/standup-generica-2.png",
          "/images/flexible/standup-generica.png",
          "/images/flexible/standup-generica-3.png"
        ],
        specs_values: {
          lamination: "مصفّح",
          finish:     "٣ أنواع",
          size:       "١ كغ",
          zipper:     "نعم / لا",
          type:       "كيس"
        }
      },
      {
        name: "ستاند أب باوتش مزخرف",
        description: "تشكيلة من الأكياس بتصاميم زخرفية جذابة: توت أحمر، أزهار، فواكه، سنابل قمح، هدية زرقاء وهدية وردية. إغلاق بسحّاب، بنية متينة وتشطيبات طبيعية أو معدنية. متوفرة بسعات من ١٥٠ غرام حتى ١ كغ. مثالية لمن يبحث عن تغليف عالي الجودة وجاذبية بصرية.",
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
          size:       "١ كغ",
          zipper:     "نعم",
          type:       "كيس مطبوع"
        }
      },
      {
        name: "كيس تفريغ الهواء العالي",
        description: "مصممة لزيادة نضارة وصلاحية اللحوم والأجبان واللحوم المعالجة والمنتجات الطازجة إلى أقصى حد. يلغي إحكام إغلاقه الهواء، مما يحافظ على الخصائص الطبيعية للمنتج ويمنع فقدان النكهة والقوام والجودة. مصنوعة من مواد عالية المقاومة والعزل.",
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
    meta_title: "موزع Grupo Ortiz | الشريك الرسمي",
    hero: {
      subtitle: "بوابة البيع بالجملة",
      title: "ضاعف<br><span>أرباحك</span>",
      desc: "وزّع منتجات عالية الطلب بدعم الشركة المصنّعة الرائدة. مخزون مضمون، بدون وسطاء ولوجستيات خلال ٢٤ ساعة.",
      cta: "ابدأ الآن"
    },
    cards: [
      { icon: "ri-stack-line",        title: "مخزون كامل",    desc: "القدرة على تلبية الطلبات الكبيرة فوراً. مستودعك دائماً ممتلئ." },
      { icon: "ri-truck-line",        title: "شحن خلال ٢٤ ساعة", desc: "لوجستيات خاصة. عملاؤك لا ينتظرون، نوصّل في وقت قياسي." },
      { icon: "ri-shield-check-line", title: "ضمان",           desc: "استبدال المنتجات دون بيروقراطية أو أسئلة. دعم كامل للعلامة التجارية." },
      { icon: "ri-line-chart-line",   title: "هوامش أفضل",    desc: "أسعار مباشرة من المصنع مصممة لتعظيم صافي أرباحك." }
    ],
    stats: [
      { val: 25, symbol: "k", label: "طن شهرياً"     },
      { val: 35, symbol: "+", label: "عاماً من التاريخ" },
      { val: 15, symbol: "M", label: "إجمالي المبيعات" }
    ],
    form: {
      title: "طلب<br>التسجيل",
      desc: "انضم إلى الشبكة. أكمل ملفك الشخصي لتعيين منطقتك وقائمة أسعارك التفضيلية.",
      support_label: "دعم مباشر",
      labels: {
        name:     "اسم جهة الاتصال",
        business: "اسم الشركة",
        whatsapp: "واتساب",
        email:    "البريد الإلكتروني",
        products: "المنتجات التي تهمك"
      },
      products_list: ["أكياس مضفورة", "تغليف مرن", "رافيا", "واقيات الزوايا", "حبال", "فيلم تمديد", "أخرى", "الكل"],
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
        { year: "١٩٥٩", title: "البداية",              short: "التأسيس في موريليا",         img: "/images/tiempo/timeline-1959.webp",  description: "منذ عام ١٩٥٩، كانت Grupo Ortiz جزءاً من التطور الصناعي للمكسيك. تأسست في موريليا على يد نيكاندرو أورتيز، وُلدت المجموعة برؤية راسخة: الجمع بين أحدث التقنيات وموهبة أفرادها وتفانيهم لبناء شركة متينة ومبتكرة وملتزمة بالجودة." },
        { year: "١٩٧٠", title: "التوسع الصناعي",        short: "أكياس وشباك",               img: "/images/tiempo/timeline-1970.webp",  description: "في عام ١٩٧٠، بدأنا إنتاج الأكياس المضفورة والشباك من البولي بروبيلين، مما شكّل مرحلة محورية في نمونا الصناعي. عزّزت هذه الخطوة الاستراتيجية طاقتنا التشغيلية، ووسّعت مشاركتنا التجارية، ورسّخت حضورنا في السوق المحلية." },
        { year: "١٩٨٥", title: "الابتكار التكنولوجي",   short: "آلات أوروبية",              img: "/images/tiempo/timeline-1985.webp",  description: "في عام ١٩٨٥، أدخلنا آلات أوروبية متطورة، مما عزّز بنيتنا التحتية الصناعية وحسّن عملياتنا الإنتاجية. رفع هذا الاستثمار الاستراتيجي معايير الجودة لدينا، وزاد الكفاءة التشغيلية، وأكّد التزامنا بالابتكار التكنولوجي." },
        { year: "١٩٩٥", title: "التنويع",               short: "خطوط إنتاج جديدة",          img: "/images/tiempo/timeline-1995.webp",  description: "في عام ١٩٩٥، وسّعنا خطوط إنتاجنا بإضافة أفلام التمديد والتغليف المرن والمنتجات الصناعية المتخصصة. نوّع هذا التوسع الاستراتيجي محفظتنا، وعزّز تنافسيتنا في القطاع، ومكّننا من تلبية متطلبات جديدة في السوق المحلية." },
        { year: "٢٠٠٥", title: "التوسع الدولي",         short: "أمريكا وأوروبا",            img: "/images/tiempo/timeline-2005.webp",  description: "في عام ٢٠٠٥، بدأنا التصدير نحو الأمريكتين وأوروبا، مما شكّل خطوة حاسمة في توسعنا الدولي. رسّخ هذا الإنجاز مكانة الشركة بوصفها مرجعاً في صناعة البوليمرات البلاستيكية، وعزّز حضورنا العالمي وترسيخ تنافسيتنا في الأسواق الدولية." },
        { year: "٢٠١٥", title: "الاستدامة",             short: "مصنع إعادة التدوير",        img: "/images/tiempo/timeline-2015.webp",  description: "في عام ٢٠١٥، أنشأنا مصنعاً لإعادة التدوير وعزّزنا برامج الاستدامة لدينا، مؤكدين التزامنا تجاه البيئة. حسّنت هذه المبادرة الاستراتيجية استغلال الموارد، وعزّزت الممارسات المسؤولة، ورسّخت رؤيتنا للنمو المستدام." },
        { year: "٢٠٢٦", title: "الحاضر",               short: "رائد صناعي",                img: "/images/tiempo/timeline-2026.webp",  description: "في عام ٢٠٢٦، نمتلك ١٧ مصنع إنتاج، وأكثر من ٤٬٠٠٠ موظف، وطاقة إنتاجية سنوية تبلغ ٢٢٠٬٠٠٠ طن. يرسّخ هذا النمو المستمر مكانتنا بوصفنا رواداً في صناعة البلاستيك، مدعومين ببنية تحتية متينة وكفاءات بشرية متخصصة ورؤية استراتيجية موجهة نحو المستقبل." }
      ]
    },

    filosofia: {
      label: "مبادئنا",
      title: "فلسفة GO",
      img:   "/images/about/GO.webp",
      items: [
        "الهوس برضا العملاء، لا بالمنافسين.",
        "الشغف بالاختراع والابتكار المستمر.",
        "التميز التشغيلي في كل عملية.",
        "التفكير بعيد المدى مع نتائج فورية.",
        "أن نكون أفضل جهة عمل وأكثر مكان عمل أماناً على وجه الأرض."
      ]
    },

    vision: {
      label: "إلى أين نتجه",
      title: "الرؤية",
      img:   "/images/about/GO2.webp",
      items: [
        "أن نكون الشركة الأكثر تركيزاً على العميل في العالم.",
        "تقديم الحل المتكامل الشامل لأي عمل تجاري.",
        "أن نكون الحل الوحيد للتغليف لأي عمل تجاري في العالم.",
        "النمو بحضور عالمي دون فقدان التركيز الإنساني."
      ]
    },

    infraestructura: {
      title_white:  "البنية التحتية",
      title_orange: "التي تدعمنا",
      stats: [
        { number: "١٣",     label: "مصانع إنتاج",      desc: "منشآت استراتيجية لخدمة الأسواق المحلية والدولية.", icon: "number" },
        { number: "+٣٬٠٠٠", label: "موظف",             desc: "فريق متخصص يقود كل عملية إنتاجية.", icon: "number" },
        { number: "٢٦٠",    label: "وحدة لوجستية",     desc: "أسطول خاص يضمن التوزيع الفعّال والتسليم الآمن على المستويين المحلي والدولي.", icon: "number" },
        { number: "عالمي",  label: "حضور دولي",        desc: "تصدير وتوزيع في الأمريكتين وأوروبا.", icon: "globe" }
      ]
    },

    plantas: {
      title:           "مصانعنا",
      subtitle: "١٣ جولات افتراضية ٣٦٠°",
      map_img:         "/images/about/mexico_map.png",
      layer_michoacan: "/images/about/michoacan_layer.png",
      layer_monterrey: "/images/about/monterrey_layer.png",
      layer_both:      "/images/about/both_states_layer.png",
      locations: [
        { key: "monterrey", number: "مصنع ١",    badge: "مونتيري، نويفو ليون" },
        { key: "michoacan", number: "١٦ مصنعاً", badge: "موريليا، ميتشواكان"  }
      ]
    },

    instalaciones: {
      title_white:  "منشآتنا",
      title_orange: "الإنتاجية",
      subtitle:     "جولات افتراضية ٣٦٠°",
      badge_soon:   "قريباً",
      badge_tour:   "مشاهدة الجولة",
      btn_tour:     "مشاهدة الجولة ثلاثية الأبعاد",
      btn_soon:     "قريباً",
      items: [
        { id: "extrusoras", num: "٠١", title: "فيلم التمديد",       tag: "موريليا، ميتشواكان", desc: "خطوط بثق عالية الطاقة حيث يتحول البولي بروبيلين إلى خيط مسطح دقيق.",                             thumb: "/images/virtual/RT.webp", link: "https://my.matterport.com/show/?m=YoM2tyXMeyb&ss=2&sr=2.97,.12&play=1&qs=1&ts=1", soon: true  },
        { id: "telares",    num: "٠٢", title: "الأكياس الشبكية",    tag: "موريليا، ميتشواكان", desc: "أنوال متطورة تنسج الخيط لإنتاج قماش بولي بروبيلين بتجانس عالٍ.",                                 thumb: "/images/virtual/RA.webp", link: "https://my.matterport.com/show/?m=2xCe1VajMjj&ss=1&sr=2.28,-1.47&play=1&qs=1&ts=1", soon: false },
        { id: "laminado",   num: "٠٣", title: "التصفيح والطباعة",   tag: "موريليا، ميتشواكان", desc: "منطقة التصفيح والطباعة الفلكسوغرافية حيث تحصل الأكياس على تشطيباتها وطباعتها ومعالجتها النهائية.", thumb: "/images/virtual/RS.webp", link: "", soon: true  },
        { id: "reciclado",  num: "٠٤", title: "مصنع إعادة التدوير", tag: "موريليا، ميتشواكان", desc: "مركز إعادة تدوير البولي بروبيلين لدينا، الملتزم بالاقتصاد الدائري والبيئة.",                        link: "", soon: true  }
      ]
    },

    capacidad: {
      title:         "الطاقة الإنتاجية المركّبة",
      subtitle:      "بنية تحتية عالية الأداء",
      planta_label:  "مصنع",
      plantas_label: "مصانع",
      items: [
        { num: "٠٤", label: "إنتاج الأكياس المضفورة",  width: 100, delay: 0   },
        { num: "٠٢", label: "إنتاج الأكياس الشبكية",   width: 50,  delay: 100 },
        { num: "٠١", label: "حبال ورافيا",              width: 25,  delay: 200 },
        { num: "٠٢", label: "فيلم التمديد",             width: 50,  delay: 300 },
        { num: "٠١", label: "تغليف مرن",                width: 25,  delay: 400 },
        { num: "٠١", label: "إعادة تدوير",              width: 25,  delay: 500 },
        { num: "٠٣", label: "واقيات الزوايا",           width: 75,  delay: 600 },
        { num: "٠١", label: "شرائط تعبئة",              width: 25,  delay: 700 },
        { num: "٠١", label: "منتجات للاستخدام مرة واحدة", width: 25,  delay: 800 },
        { num: "٠١", label: "أكياس",                    width: 25,  delay: 900 }
      ]
    },

    valores: {
      title:    "قيمنا",
      subtitle: "ركائز ثقافتنا",
      items: [
        { title: "المسؤولية", description: "نفي بالتزاماتنا بأخلاق واحترافية، مدركين تأثير أفعالنا على العملاء والموظفين والمجتمعات." },
        { title: "الثقة",     description: "نبني علاقات راسخة مبنية على الشفافية والنزاهة والوفاء بالوعود، مما يُفضي إلى الأمان في كل تفاعل." },
        { title: "الشغف",     description: "نحب ما نقوم به ونعكسه في كل منتج وعملية وابتكار، مع التحلي بالحماس والتفاني الحقيقي." },
        { title: "المثابرة",  description: "نواجه التحديات بعزم وإصرار، وثابتون في تحقيق أهدافنا حتى بلوغ نتائج استثنائية." },
        { title: "الانضباط",  description: "نتبع إجراءات صارمة ومعايير جودة بنظام ومنهجية، مما يضمن الاتساق والتميز في كل تسليم." },
        { title: "المبادرة",  description: "نستشرف الاحتياجات ونتخذ الإجراءات قبل ظهور المشكلات، مبتكرين حلولاً تُولّد قيمة مستمرة." },
        { title: "الاحترام",  description: "نُقدّر تنوع وكرامة وإسهام كل فرد، نعزز بيئة من التعاون والاندماج والمعاملة العادلة." }
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
      title_top:        "نبني معاً",
      title_bottom:     "عالماً أفضل",
      subtitle:         "ندعم الأسر ونمكّن المرأة ونمنح فرصاً ثانية ونرعى الكوكب. كل خطوة نخطوها تسعى إلى تغيير الحياة وبناء مستقبل مليء بالأمل.",
      stat_female:      "٪ نسبة الموظفات",
      stat_recycled:    "طن مُعاد تدويره",
      stat_initiatives: "مبادرة نشطة",
      video:            "/videos/waves2.mp4",
    },

    ods: {
      title:       "نجمنا القطبي",
      subtitle:    "أجندة ٢٠٣٠",
      description: "نسترشد بأهداف التنمية المستدامة للأمم المتحدة لبناء عالم أكثر عدلاً وازدهاراً واستدامة.",
      cards: [
        { n: 1,  title: "القضاء على الفقر",           link: "https://sdgs.un.org/goals/goal1",  img: "/images/odc/1.png"  },
        { n: 2,  title: "القضاء التام على الجوع",      link: "https://sdgs.un.org/goals/goal2",  img: "/images/odc/2.png"  },
        { n: 3,  title: "الصحة الجيدة والرفاه",        link: "https://sdgs.un.org/goals/goal3",  img: "/images/odc/3.png"  },
        { n: 4,  title: "التعليم الجيد",               link: "https://sdgs.un.org/goals/goal4",  img: "/images/odc/4.png"  },
        { n: 5,  title: "المساواة بين الجنسين",        link: "https://sdgs.un.org/goals/goal5",  img: "/images/odc/5.png"  },
        { n: 6,  title: "المياه النظيفة والنظافة",     link: "https://sdgs.un.org/goals/goal6",  img: "/images/odc/6.png"  },
        { n: 7,  title: "طاقة نظيفة وبأسعار معقولة",   link: "https://sdgs.un.org/goals/goal7",  img: "/images/odc/7.png"  },
        { n: 8,  title: "العمل اللائق ونمو الاقتصاد",  link: "https://sdgs.un.org/goals/goal8",  img: "/images/odc/8.png"  },
        { n: 9,  title: "الصناعة والابتكار والبنية التحتية", link: "https://sdgs.un.org/goals/goal9",  img: "/images/odc/9.png"  },
        { n: 10, title: "الحد من أوجه عدم المساواة",   link: "https://sdgs.un.org/goals/goal10", img: "/images/odc/10.png" },
        { n: 11, title: "مدن ومجتمعات مستدامة",        link: "https://sdgs.un.org/goals/goal11", img: "/images/odc/11.png" },
        { n: 12, title: "الاستهلاك والإنتاج المسؤولان", link: "https://sdgs.un.org/goals/goal12", img: "/images/odc/12.png" },
        { n: 13, title: "العمل المناخي",               link: "https://sdgs.un.org/goals/goal13", img: "/images/odc/13.png" },
        { n: 14, title: "الحياة تحت الماء",            link: "https://sdgs.un.org/goals/goal14", img: "/images/odc/14.png" },
        { n: 15, title: "الحياة في البر",              link: "https://sdgs.un.org/goals/goal15", img: "/images/odc/15.png" },
        { n: 16, title: "السلام والعدل والمؤسسات القوية", link: "https://sdgs.un.org/goals/goal16", img: "/images/odc/16.png" },
        { n: 17, title: "عقد الشراكات لتحقيق الأهداف", link: "https://sdgs.un.org/goals/goal17", img: "/images/odc/17.png" },
      ]
    },

    vision: {
      title:        "أثرنا",
      title_orange: "الإيجابي",
      subtitle:     "نحوّل الصناعة",
      pilars: [
        {
          label: "الركيزة ٠١",
          title: "منتجات الأرض",
          desc:  "تطوير مواد مبتكرة وصديقة للبيئة للتغليف المرن تحترم البيئة وتقلل البصمة الكربونية.",
          img:   "/images/impacto/products.webp"
        },
        {
          label: "الركيزة ٠٢",
          title: "ممارسات الأرض",
          desc:  "تصنيع نظيف واقتصاد دائري في جميع عملياتنا الإنتاجية، بإغلاق الدورات والقضاء على الهدر.",
          img:   "/images/impacto/practices.webp"
        },
        {
          label: "الركيزة ٠٣",
          title: "الأرض الاجتماعية",
          desc:  "التزام شامل تجاه العملاء والموظفين والمجتمعات، مع توليد أثر اجتماعي إيجابي وفرص حقيقية.",
          img:   "/images/impacto/social.webp"
        }
      ]
    },

    oceanos: {
      hero_title:           "ملتزمون بمستقبل",
      hero_title_highlight: "أنظف لمحيطاتنا",
      hero_video:           "/videos/waves.mp4",
      intro: "في Grupo Ortiz، نؤمن بعالم تتألق فيه المحيطات من جديد. من خلال دعم مبادرات عالمية كـ The Ocean Cleanup وجائزة Tom Ford للابتكار في البلاستيك بدعم من Lonely Whale، نعمل على تقليل البلاستيك في بحارنا. كل عملية شراء تقوم بها معنا هي خطوة نحو كوكب أنظف ومستقبل مستدام للجميع. معاً ننقذ المحيطات!",
      features: [
        { title: "ندعم التنظيف العالمي",      desc: "من خلال التعاون مع مبادرات كـ The Ocean Cleanup."                 },
        { title: "نعزز الابتكار المستدام",     desc: "عبر برامج كجائزة Tom Ford للابتكار في البلاستيك."                },
        { title: "نشجع المنتجات المسؤولة",     desc: "التي تقلل الأثر البيئي على المحيطات."                            },
        { title: "نُلهم العمل الجماعي",        desc: "بدعوة العملاء والشركاء ليكونوا جزءاً من التغيير."               }
      ],
      partners: [
        {
          title:  "ابتكار Tom Ford",
          desc:   "تسعى هذه المبادرة العالمية إلى إحداث ثورة في صناعة البلاستيك من خلال تكريم وتعزيز الحلول المبتكرة التي تحل محل البلاستيك أحادي الاستخدام. تركيزها على بدائل مستدامة وقابلة للتوسع تقلل الأثر البيئي وتحمي المحيطات وتشجع التحول نحو مواد أكثر مسؤولية.",
          btn:    "اعرف أكثر",
          link:   "https://unwrapthefuture.org/",
          video:  "/videos/impacto/oceancleanup.mp4",
          poster: "/images/impacto/cultura-calidad.jpg"
        },
        {
          title:  "تنظيف المحيط",
          desc:   "تكرّس هذه المنظمة نفسها لتنظيف محيطات العالم، إذ تطور تقنيات متقدمة لإزالة البلاستيك المتراكم في البحار ومنع وصوله عبر الأنهار، المصدر الرئيسي للتلوث. مهمتها استعادة صحة النظم البيئية البحرية وحماية التنوع البيولوجي وضمان مستقبل نظيف للأجيال القادمة.",
          btn:    "اعرف أكثر",
          link:   "https://theoceancleanup.com/",
          video:  "/videos/impacto/tomford.mp4",
          poster: "/images/impacto/tomford.webp"
        }
      ]
    },

    stats: {
      recycled: "طن مُعاد تدويره",
      female:   "٪ نسبة الموظفات",
      families: "أسرة مستفيدة"
    },

    timeline: {
      title:    "مبادرات تُحدث التغيير",
      subtitle: "أثر إيجابي دائم",
      items: [
        {
          num: "٠١", title: "بيت الأمل",
          desc:       "دعم دار الأيتام في تاكامبارو، ميتشواكان. كل طفل يستحق منزلاً مليئاً بالمحبة.",
          desc_short: "دعم دار الأيتام في تاكامبارو، ميتشواكان.",
          img:        "/images/impacto/hogar.mp4",
          isVideo:    true,
          poster:     "/images/impacto/hogar.mp4"
        },
        {
          num: "٠٢", title: "سلة GO الغذائية",
          desc:       "متحدون من أجل المجتمع. توزيع السلات الغذائية بمحبة.",
          desc_short: "توزيع السلات الغذائية بمحبة على المجتمع.",
          img:        "/images/impacto/despensas.webp",
          isVideo:    false
        },
        {
          num: "٠٣", title: "بصمة صفرية",
          desc:       "سياسة صفر نفايات. تحويل المخلفات إلى فرص.",
          desc_short: "سياسة صفر نفايات. تحويل المخلفات.",
          img:        "/images/impacto/composta.webp",
          isVideo:    false
        },
        {
          num: "٠٤", title: "السماد الحي",
          desc:       "تصنيع منتجات قابلة للتسميد. ابتكار يحترم الطبيعة.",
          desc_short: "منتجات قابلة للتسميد. ابتكار مستدام.",
          img:        "/images/impacto/GO.webp",
          isVideo:    false
        },
        {
          num: "٠٥", title: "تألق GO",
          desc:       "مكافآت الأداء لفريق GO. الاعتراف بالجهد.",
          desc_short: "تكريم أداء فريق GO.",
          img:        "/images/impacto/woman.webp",
          isVideo:    false
        },
        {
          num: "٠٦", title: "أيدٍ تقود",
          desc:       "٨٤٪ من الموظفين من النساء. تمكين القيادات النسائية.",
          desc_short: "٥٦٫٨٢٪ نسبة الموظفات. تمكين القيادات.",
          img:        "/images/impacto/bio.webp",
          isVideo:    false
        }
      ]
    },

    cta: {
      title:        "معاً",
      title_orange: "نُحدث التغيير",
      desc:         "نحن الشريك الاستراتيجي الذي تحتاجه شركتك للنمو بالتكنولوجيا والخبرة والنتائج.",
      contact:      "تواصل معنا",
      products:     "عرض المنتجات"
    }
  },

  // =================================================
  // صفحة: الرئيسية
  // =================================================
  home: {
    meta_title: "Grupo Ortiz | مصنّع البوليمرات والتغليف في المكسيك",
    meta_description: "أكثر من ٦٥ عاماً في تصنيع أفلام التمديد والأكياس المضفورة والحبال والرافيا والأكياس الشبكية والتغليف المرن. الشركة الرائدة في مجال البوليمرات البلاستيكية في المكسيك وأمريكا اللاتينية.",
    hero: {
      eyebrow:      "منذ عام ١٩٥٩",
      title_top:    "نحن الشركة المصنّعة",
      title_bot:    "الرائدة في أمريكا اللاتينية",
      video:        "background.mp4",
      subtitle:     "أكثر من ٦٥ عاماً في تصنيع حلول هندسية متطورة للصناعات في القارات الخمس.",
      btn_products: "منتجاتنا",
      btn_about:    "اعرف أكثر",
      stats: [
        { number: 65,   label: "عاماً من الخبرة" },
        { number: 3000, prefix: "+", label: "موظف" },
        { number: 5,    prefix: "",  label: "قارات" }
      ]
    },

    divisiones: {
      tag:       "أقسامنا",
      title:     "مجالات",
      title_em:  "التخصص",
      link_text: "عرض المنتجات",
      items: [
        { title: "أكياس شبكية",   tag: "القسم ٠١", description: "أكياس شبكية من رافيا البولي بروبيلين بنسيج مسطح ودائري. تصميم جيد التهوية مثالي للفواكه والخضروات والمنتجات الزراعية.",   img: "/images/divisiones/arpilla.webp",           color: "#2d8a4e", slug: "arpillas",           soon: false },
        { title: "حبال",           tag: "القسم ٠٢", description: "حبال بولي بروبيلين عالية المتانة للاستخدام الزراعي والصناعي والبحري. مقاومة جوية ممتازة مع مرشح أشعة فوق بنفسجية مدمج.",    img: "/images/divisiones/cuerdas.webp",           color: "#1a5f8a", slug: "cuerdas",            soon: false },
        { title: "رافيا",          tag: "القسم ٠٣", description: "رافيا بولي بروبيلين عالية الأداء. خفيفة جداً وعالية المقاومة للكسر، متعددة الاستخدامات للزراعة والدواجن والبستنة.",       img: "/images/divisiones/rafia.webp",             color: "#8a6d2d", slug: "rafias",             soon: false },
        { title: "تغليف مرن",      tag: "القسم ٠٤", description: "أفلام عازلة عالية الأداء وتصفيح متخصص. حماية مثلى للمواد الغذائية والمنتجات الصناعية بأحدث التقنيات.",                    img: "/images/divisiones/bolsa.webp",             color: "#0d7377", slug: "empaques-flexibles", soon: false },
        { title: "أكياس مضفورة",   tag: "القسم ٠٥", description: "أكياس رافيا فائقة الجودة. حل تعبئة متين للمواد الغذائية والمواد الكيميائية والأسمدة والمنتجات السائبة.",                  img: "/images/divisiones/sacos.webp",             color: "#3a7d44", slug: "sacos",              soon: false },
        { title: "فيلم التمديد",   tag: "القسم ٠٦", description: "فيلم تمديد بوضوح بصري عالٍ. يضمن سلامة الحمولة بكفاءة تكلفة. يتضمن خياراً قابلاً للتحلل البيولوجي.",                   img: "/images/divisiones/film-estirable.webp",    color: "#2c5f8a", slug: "stretch-film",       soon: false },
        { title: "واقيات الزوايا", tag: "القسم ٠٧", description: "واقيات زوايا كرافت لحماية الحواف أثناء التخزين والنقل. توزيع منتظم للضغط وأقصى استقرار للحمولة.",                        img: "/images/divisiones/esquineros.webp",        color: "#7b3fa0", slug: "esquineros",         soon: false },
        { title: "منتجات للاستخدام مرة واحدة", tag: "القسم ١٠", description: "منتجات بولي بروبيلين للاستخدام مرة واحدة للاستخدام الصناعي والغذائي والطبي. حلول صحية واقتصادية وعالية المقاومة.", img: "/images/divisiones/desechables.webp", color: "#e05500", slug: "desechables",        soon: true  }
      ]
    },

    porque: {
      tag:           "لماذا تختارنا",
      title:         "أكثر من ٦٥ عاماً",
      title_em:      "من الريادة",
      body:          "نحن مرجع في صناعة البوليمرات البلاستيكية في المكسيك وأمريكا اللاتينية، بعمليات معتمدة وقدرة استجابة عالمية.",
      btn:           "تاريخنا",
      badge1_label:  "وحدات أعمال",
      badge1_number: 13,
      badge2_label:  "أقسام",
      badge2_number: 6,
      img:           "/images/home/planta-produccion.webp",
      features: [
        { title: "جودة معتمدة",    description: "منتجات تلبي أعلى المعايير الدولية للتصنيع."                   },
        { title: "ابتكار مستمر",   description: "استثمار دائم في البحث والتطوير للحفاظ على الريادة التكنولوجية." },
        { title: "وصول عالمي",    description: "حضور فاعل في ٥ قارات بشبكة توزيع فعّالة."                     }
      ]
    },

    certs: {
      tag:      "جودة مضمونة",
      title:    "شهاداتنا",
      title_em: "الدولية",
      items: [
        { code: "Kosher Pareve",     name: "KMD México",     img: "/images/certificaciones/KOSHER.jpeg"   },
        { code: "FSSC 22000",        name: "LRQA Certified", img: "/images/certificaciones/LRQA.png"      },
        { code: "AIB International", name: "Since 1919",     img: "/images/certificaciones/AIB.png"       },
        { code: "ISO 9001",          name: "Bureau Veritas", img: "/images/certificaciones/CERTIFIED.png" }
      ]
    },

    compromiso: {
      card1: {
        eyebrow: "توجهنا",
        title:   "الابتكار",
        text:    "نستثمر في البحث والتطوير لتقديم منتجات تتجاوز توقعات السوق العالمية بأحدث التقنيات."
      },
      card2: {
        eyebrow: "التزامنا",
        title:   "الاستدامة",
        text:    "عمليات مسؤولة بيئياً، وبرامج إعادة تدوير فعّالة، وتقليص البصمة الكربونية في سلسلة التوريد بأكملها."
      }
    },

    global: {
      tag:      "حضور عالمي",
      title:    "نُصدّر إلى",
      title_em: "العالم",
      desc:     "تصل منتجاتنا إلى عملاء في أكثر من ٣٠ دولة، مما يرسّخ مكانتنا بوصفنا رواداً في مجال البوليمرات البلاستيكية.",
      video:    "/videos/camion.mp4",
      stats: [
        { number: 65,   label: "عاماً"    },
        { number: 30,   prefix: "+", label: "دولة"    },
        { number: 3000, prefix: "+", label: "موظف"   },
        { number: 5,    prefix: "",  label: "قارات"  }
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