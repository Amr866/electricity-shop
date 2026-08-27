const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with authentic user-provided product photos for Shiasi Store...');

  // Clean existing data
  await prisma.repairRequest.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productSpec.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.storeSetting.deleteMany();

  // 1. Seed Store Settings (Najafabad, Isfahan)
  const settings = [
    { key: 'store_name', value: 'فروشگاه شیاسی' },
    { key: 'store_slogan', value: 'مرکز خرید و تعمیرات تخصصی لوازم برقی خانگی، پنکه، کولر، بخاری، آنتن، روشنایی و قطعات الکترونیک' },
    { key: 'store_city', value: 'نجف‌آباد' },
    { key: 'store_province', value: 'اصفهان' },
    { key: 'store_address', value: 'اصفهان، نجف‌آباد، خیابان قدس / شریعتی (فروشگاه شیاسی)' },
    { key: 'store_maps_url', value: 'https://maps.app.goo.gl/u9UVuUA5cAyGQMcJ6' },
    { key: 'store_phone', value: '031-42624567' },
    { key: 'store_mobile', value: '0913-111-2233' },
    { key: 'store_repair_phone', value: '0916-266-5884' },
    { key: 'store_whatsapp', value: '989131112233' },
    { key: 'store_working_hours', value: 'شنبه تا چهارشنبه: ۸:۳۰ الی ۲۱:۰۰ | پنجشنبه‌ها: ۸:۳۰ الی ۱۸:۰۰' },
    { key: 'delivery_najafabad_note', value: 'ارسال فوری با اسنپ‌باکس و پیک اختصاصی در نجف‌آباد، ویلاشهر، گلدشت، یزدانشهر و اصفهان' },
    { key: 'card_number', value: '6037-9975-1234-5678' },
    { key: 'card_holder', value: 'فروشگاه شیاسی' },
    { key: 'bank_name', value: 'بانک ملی ایران - شعبه نجف‌آباد' },
  ];

  for (const s of settings) {
    await prisma.storeSetting.create({ data: s });
  }

  // 2. Seed Coupons
  const coupons = [
    { code: 'NAJAFABAD', discountPercent: 10, minOrderAmount: 200000, isActive: true },
    { code: 'SHIASI1403', discountPercent: 15, minOrderAmount: 500000, isActive: true },
    { code: 'REPAIR50', discountAmount: 50000, minOrderAmount: 300000, isActive: true },
  ];

  for (const c of coupons) {
    await prisma.coupon.create({ data: c });
  }

  // 3. Seed 4 Core Product Categories
  const catAppliances = await prisma.category.create({
    data: {
      name: 'پنکه، کولر و بخاری برقی',
      slug: 'home-appliances-cooling-heating',
      description: 'انواع پنکه ایستاده، دیواری و رومیزی، موتور و پمپ کولر آبی موتوژن، بخاری تابشی و ادوات سرمایش و گرمایش',
      icon: 'Fan',
      image: '/images/products/wal_172619-fans-7995865_1920.jpg',
      sortOrder: 1,
    }
  });

  const catWiring = await prisma.category.create({
    data: {
      name: 'سیم، کابل و آنتن تلویزیون',
      slug: 'wiring-building',
      description: 'سیم و کابل تمام مس استاندارد البرز، کابل کواکسیال، آنتن‌های دیجیتال گردان هانی و کلید پریز ساختمانی',
      icon: 'Zap',
      image: '/images/products/skdunning-wire-962753_1920.jpg',
      sortOrder: 2,
    }
  });

  const catLighting = await prisma.category.create({
    data: {
      name: 'روشنایی، پنل LED و پروژکتور خورشیدی',
      slug: 'lighting-fixtures',
      description: 'پنل‌های ال‌ای‌دی سقفی، پروژکتورهای خورشیدی سولار ویمکس، چراغ‌های سنسوردار و لامپ‌های کم‌مصرف استاندارد',
      icon: 'SunMedium',
      image: '/images/products/inspiredimages-light-bulb-1138047_1920.jpg',
      sortOrder: 3,
    }
  });

  const catMaker = await prisma.category.create({
    data: {
      name: 'بردهای آردوینو، ماژول و ابزار الکترونیک',
      slug: 'maker-diy-electronics',
      description: 'مولتی‌متر دیجیتال، هویه و تجهیزات لحیم‌کاری، بردهای آردوینو Uno، ماژول‌های الکترونیکی و باتری شارژی',
      icon: 'Cpu',
      image: '/images/products/close-up-circuit-reparing-tool.jpg',
      sortOrder: 4,
    }
  });

  // 4. Products Data with exact local photos
  const products = [
    // --- 1. Standing Fan Pars Khazar ---
    {
      categoryId: catAppliances.id,
      name: 'پنکه ایستاده ۵ پره ریموت‌دار پارس خزر مدل FSR-SHIBA پرقدرت و کم‌صدا',
      slug: 'pars-khazar-fan-fsr-shiba-remote',
      sku: 'APP-FAN-PKFSR',
      shortDesc: 'باددهی پرقدرت، کم‌صدا، مجهز به کنترل از راه دور، تایمر هوشمند و صفحه نمایش LED.',
      description: 'پنکه ایستاده پارس خزر مدل شیبا با ۵ پره آیرودینامیک شفاف، قابلیت تنظیم زاویه عمودی و افقی خودکار، ۳ حالت وزش باد و موتور تمام مس مقاوم در برابر کارکرد طولانی. همراه با گارانتی ۲۴ ماهه پارس خزر و پشتیبانی فنی در فروشگاه شیاسی نجف‌آباد.',
      price: 3450000,
      originalPrice: 3850000,
      discountPercent: 10,
      stock: 18,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isIsfahanFast: true,
      brand: 'پارس خزر (Pars Khazar)',
      warranty: '۲۴ ماه گارانتی رسمی پارس خزر + خدمات شیاسی',
      madeIn: 'ایران',
      rating: 5.0,
      reviewCount: 34,
      images: [
        { url: '/images/products/wal_172619-fans-7995865_1920.jpg', isPrimary: true, alt: 'پنکه ایستاده ریموت دار پارس خزر' },
      ],
      specs: [
        { label: 'توان مصرفی', value: '۶۰ وات' },
        { label: 'تعداد پره', value: '۵ پره شفاف با راندمان بالا' },
        { label: 'قابلیت‌ها', value: 'ریموت کنترل، تایمر تا ۷.۵ ساعت، تنظیم ارتفاع' },
        { label: 'پشتیبانی تعمیرات', value: 'پذیرش و عیب‌یابی در کارگاه شیاسی نجف‌آباد' }
      ],
      reviews: [
        { authorName: 'حاج احمد امینی', city: 'نجف‌آباد', rating: 5, comment: 'پنکه عالی و بی صدا، تحویل فوری در نجف‌آباد با اخلاق عالی مدیریت شیاسی.' }
      ]
    },

    // --- 2. Motogen Cooler Motor 1/2 HP ---
    {
      categoryId: catAppliances.id,
      name: 'موتور کولر آبی ۱/۲ اسب بخار موتوژن تبریز اصل (سیم‌پیچی مس خازن‌دار)',
      slug: 'motogen-cooler-motor-half-hp-copper',
      sku: 'APP-CLR-MOT50',
      shortDesc: 'استانداردترین الکتروموتور کولر آبی مناسب کولرهای ۴۰۰۰ تا ۵۰۰۰ با راندمان بالا.',
      description: 'دینام کولر آبی ۱/۲ موتوژن تبریز اورجینال با درجه حفاظت رطوبتی، خازن روغنی راه‌انداز و کلید گریز از مرکز (پلاتین). فروش با ضمانت نامه اصالت کالا و امکان پذیرش تعویض و تعمیر در کارگاه شیاسی نجف‌آباد.',
      price: 3680000,
      originalPrice: 3990000,
      discountPercent: 8,
      stock: 14,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isIsfahanFast: true,
      brand: 'موتوژن تبریز (Motogen)',
      warranty: '۲ سال ضمانت طلایی تعویض موتوژن',
      madeIn: 'ایران (تبریز اصل)',
      rating: 4.9,
      reviewCount: 52,
      images: [
        { url: '/images/products/موتور-کولر-موتوژن-3-4.jpg', isPrimary: true, alt: 'موتور کولر آبی موتوژن تبریز' },
        { url: '/images/products/adonyig-machine-3098797_1920.jpg', isPrimary: false, alt: 'الکتروموتور سیم‌پیچی مس' },
      ],
      specs: [
        { label: 'قدرت موتور', value: '۱/۲ اسب بخار (1/2 HP)' },
        { label: 'جنس سیم‌پیچ', value: '۱۰۰٪ مس استاندارد' },
        { label: 'سرعت', value: 'دو دور (کند ۹۵۰ دور / تند ۱۴۲۵ دور)' },
      ]
    },

    // --- 3. Motogen Cooler Motor 3/4 HP ---
    {
      categoryId: catAppliances.id,
      name: 'موتور کولر آبی ۳/۴ اسب بخار موتوژن تبریز (مناسب کولر ۶۰۰۰ تا ۷۰۰۰)',
      slug: 'motogen-cooler-motor-34hp-copper',
      sku: 'APP-CLR-MOT75',
      shortDesc: 'پرقدرت‌ترین دینام کولر آبی برای منازل بزرگ، سالن‌ها و کارگاه‌های صنعتی.',
      description: 'دینام کولر ۳/۴ اسب موتوژن تبریز تمام مس با بالاترین گشتاور راه‌اندازی و دوام حرارتی کلاس B. تضمین اصالت کالا همراه با فاکتور رسمی فروشگاه شیاسی.',
      price: 4150000,
      originalPrice: 4500000,
      discountPercent: 7,
      stock: 10,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isIsfahanFast: true,
      brand: 'موتوژن تبریز (Motogen)',
      warranty: '۲۴ ماه گارانتی شرکتی موتوژن',
      madeIn: 'ایران',
      rating: 5.0,
      reviewCount: 40,
      images: [
        { url: '/images/products/موتور-کولر-موتوژن-3-4.jpg', isPrimary: true, alt: 'موتور کولر ۳/۴ موتوژن' },
        { url: '/images/products/is463940-generator-5476642_1920.jpg', isPrimary: false, alt: 'دینام کولر آبی موتوژن' }
      ],
      specs: [
        { label: 'توان', value: '۳/۴ اسب بخار' },
        { label: 'مناسب کولر', value: 'کولر آبی ۶۰۰۰، ۶۵۰۰ و ۷۰۰۰' },
        { label: 'سیم‌پیچ', value: 'مس خالص' }
      ]
    },

    // --- 4. Polymer Water Cooler 8000 ---
    {
      categoryId: catAppliances.id,
      name: 'کولر آبی پلیمری سلولزی ۸۰۰۰ اینورتر ایرومکس با پد سلولزی و بدنه پلیمری ضدزنگ',
      slug: 'airomax-polymer-water-cooler-8000',
      sku: 'APP-CLR-AIR8000',
      shortDesc: 'فناوری جدید خنک‌کنندگی با پد سلولزی ضخیم، بدنه مقاوم در برابر آفتاب نجف‌آباد و مصرف بهینه برق.',
      description: 'کولر آبی پلیمری ۸۰۰۰ با موتور درایو اینورتر BLDC، فوق کم‌مصرف با راندمان خنک‌کاری ۴۰ درصد بیشتر از پوشال معمولی. بدون زنگ‌زدگی کفی کولر و طول عمر بالای ۱۵ سال.',
      price: 18900000,
      originalPrice: 20500000,
      discountPercent: 8,
      stock: 6,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      isIsfahanFast: true,
      brand: 'ایرومکس (Airomax)',
      warranty: '۲ سال ضمانت طلایی تعویض قطعات و موتور',
      madeIn: 'ایران',
      rating: 5.0,
      reviewCount: 15,
      images: [
        { url: '/images/products/AIromax-polymer-water-cooler-8000.webp', isPrimary: true, alt: 'کولر آبی پلیمری ایرومکس ۸۰۰۰' },
      ],
      specs: [
        { label: 'ظرفیت هوادهی', value: '۸۰۰۰ متر مکعب بر ساعت' },
        { label: 'نوع پد', value: 'سلولزی فنلاندی ضدقارچ و باکتری' },
        { label: 'جنس بدنه', value: 'پلیمر فشرده مقاوم در برابر اشعه UV' }
      ]
    },

    // --- 5. Electric Quartz Heater Element ---
    {
      categoryId: catAppliances.id,
      name: 'المنت شیشه‌ای کوارتز بخاری برقی طول ۲۵ سانتی‌متر ۵۰۰ وات ضدشوک حرارتی',
      slug: 'electric-heater-quartz-element-25cm',
      sku: 'APP-HTR-ELM25',
      shortDesc: 'المنت یدکی استاندارد مناسب انواع بخاری‌های برقی اخوان، مهر، ارشیا و صنام.',
      description: 'المنت کوارتز با فنر نیکل-کروم دوبل، انتقال حرارت تابشی سریع و بدون ایجاد دود و بو. آماده نصب با سرپیچ‌های استاندارد در کارگاه شیاسی نجف‌آباد.',
      price: 65000,
      originalPrice: 75000,
      discountPercent: 13,
      stock: 80,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      isIsfahanFast: true,
      brand: 'اخوان (Akhavan Element)',
      warranty: 'ضمانت سلامت فیزیکی و تست حرارت',
      madeIn: 'ایران',
      rating: 4.8,
      reviewCount: 24,
      images: [
        { url: '/images/products/Electric-heater-element.jpg', isPrimary: true, alt: 'المنت شیشه ای کوارتز بخاری برقی' },
      ],
      specs: [
        { label: 'توان حرارتی', value: '۵۰۰ وات' },
        { label: 'طول لوله', value: '۲۵ سانتی‌متر استاندارد' },
      ]
    },

    // --- 6. Copper Electrical Wire 1.5mm Alborz ---
    {
      categoryId: catWiring.id,
      name: 'سیم برق افشان سایز ۱.۵*۱ تمام مس استاندارد البرز الکتریک کلاف ۱۰۰ متری',
      slug: 'copper-wire-15-alborz-electric',
      sku: 'WIR-ALB-15',
      shortDesc: 'سیم کشی ساختمان و روشنایی، هادی مس آنیل شده کلاس ۵ با روکش PVC نسوز.',
      description: 'سیم افشان ۱.۵ میلی‌متر مربع البرز الکتریک نور با تاییدیه استاندارد ملی ایران و پژوهشگاه نیرو. مناسب سیم‌کشی سیستم‌های روشنایی، کلیدها و اتصالات ساختمانی با بالاترین خلوص مس.',
      price: 980000,
      originalPrice: 1150000,
      discountPercent: 15,
      stock: 60,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isIsfahanFast: true,
      brand: 'البرز الکتریک نور (Alborz)',
      warranty: 'ضمانت ۱۰۰٪ اصالت و خلوص مس استاندارد',
      madeIn: 'ایران',
      rating: 4.9,
      reviewCount: 68,
      images: [
        { url: '/images/products/parto-electric-stranded-wire-1-15.png', isPrimary: true, alt: 'سیم برق افشان مس البرز الکتریک' },
        { url: '/images/products/کابل-افشان-دو-رشته-سایز-15-استاندارد.jpeg', isPrimary: false, alt: 'کلاف کابل افشان مس' },
      ],
      specs: [
        { label: 'طول کلاف', value: '۱۰۰ متر بسته‌بندی کارخانه‌ای' },
        { label: 'سطح مقطع', value: '۱.۵ میلی‌متر مربع' },
        { label: 'ولتاژ نامی', value: '۴۵۰/۷۵۰ ولت' },
      ]
    },

    // --- 7. Copper Antenna Coaxial Cable RG6 ---
    {
      categoryId: catWiring.id,
      name: 'کابل آنتن کواکسیال تمام مس 4.5C صادراتی با شیلد ۹۶ رشته و فویل آلومینیوم (متری)',
      slug: 'coaxial-antenna-cable-copper-rg6',
      sku: 'WIR-ANT-COAX',
      shortDesc: 'انتقال سیگنال بدون افت کیفیت برای تلویزیون‌های 4K و گیرنده‌های دیجیتال.',
      description: 'کابل کواکسیال مغزی مس خالص با روکش محافظ ضدآفتاب و باران مناسب انتقال تصویر شفاف شبکه‌های صدا و سیما بدون پارازیت و نویز.',
      price: 18000,
      originalPrice: 22000,
      discountPercent: 18,
      stock: 500,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isIsfahanFast: true,
      brand: 'کابل صادراتی مس',
      warranty: 'ضمانت خلوص مس و عدم افت سیگنال',
      madeIn: 'ایران',
      rating: 4.9,
      reviewCount: 43,
      images: [
        { url: '/images/products/کابل-آنتن-08_48-تمام-مس-1-600x600.jpeg', isPrimary: true, alt: 'کابل آنتن کواکسیال تمام مس' },
      ],
      specs: [
        { label: 'مغزی', value: 'تمام مس ۱ میلی‌متر' },
        { label: 'شیلد', value: '۹۶ رشته بافته شده مسی' },
      ]
    },

    // --- 8. Shahcheraq 24W LED Sensor Panel ---
    {
      categoryId: catLighting.id,
      name: 'پنل سنسوردار هوشمند ۲۴ وات شاهچراغ مدل روژان روکار با ۲ سال ضمانت',
      slug: 'shahcheraq-sensor-panel-24w-led',
      sku: 'LGT-PNL-24W',
      shortDesc: 'روشن و خاموش شدن خودکار در راه پله‌ها، پارکینگ و ورودی ساختمان با راندمان بالا.',
      description: 'چراغ سقفی سنسوردار شاهچراغ با سنسور مادون قرمز ۳۶۰ درجه، نور یکنواخت بدون خیرگی و صرفه‌جویی ۹۰ درصدی در مصرف برق مشترک ساختمان.',
      price: 1039500,
      originalPrice: 1314000,
      discountPercent: 21,
      stock: 35,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      isIsfahanFast: true,
      brand: 'صنایع روشنایی شاهچراغ',
      warranty: '۲ سال ضمانت تعویض بی‌قید و شرط',
      madeIn: 'ایران',
      rating: 4.7,
      reviewCount: 26,
      images: [
        { url: '/images/products/پنل-24-وات-سنسوردار-شاهچراغ-روکار.webp', isPrimary: true, alt: 'پنل سقفی سنسوردار ۲۴ وات شاهچراغ' },
      ],
      specs: [
        { label: 'توان', value: '۲۴ وات LED SMD' },
        { label: 'برد سنسور', value: 'تا ۶ متر زاویه ۳۶۰ درجه' },
      ]
    },

    // --- 9. Afratab 50W LED Cylinder Bulb ---
    {
      categoryId: catLighting.id,
      name: 'لامپ ال‌ای‌دی ۵۰ وات استوانه‌ای افراتاب پرنور پایه E27 با ۱۸ ماه گارانتی',
      slug: 'afratab-50w-led-cylinder-bulb',
      sku: 'LGT-BLB-AFR50',
      shortDesc: 'روشنایی فوق‌العاده قوی معادل ۴۰۰ وات رشته‌ای، مناسب مغازه، کارگاه و منازل بزرگ.',
      description: 'لامپ ۵۰ وات افراتاب با بدنه آلومینیومی خنک‌کننده هیت‌سینک، زاویه تابش ۲۲۰ درجه، طول عمر ۲۵۰۰۰ ساعت و نور بدون لرزش و پرش.',
      price: 285000,
      originalPrice: 320000,
      discountPercent: 11,
      stock: 40,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isIsfahanFast: true,
      brand: 'افراتاب (Afratab)',
      warranty: '۱۸ ماه گارانتی تعویض افراتاب',
      madeIn: 'ایران',
      rating: 4.9,
      reviewCount: 37,
      images: [
        { url: '/images/products/لامپ-50-وات-ایرانی-افراتاب-استوانه-.jpeg', isPrimary: true, alt: 'لامپ ۵۰ وات استوانه ای افراتاب' },
      ],
      specs: [
        { label: 'توان نوری', value: '۴۵۰۰ لومن' },
        { label: 'سرپیچ', value: 'استاندارد E27 معمولی' },
      ]
    },

    // --- 10. Rechargeable Battery Pack 18650 Saba ---
    {
      categoryId: catMaker.id,
      name: 'باتری لیتیوم-یون سایز ۱۸۶۵۰ ظرفیت ۲۲۰۰mAh سرتخت صبا باتری اصل ۳.۷ ولت',
      slug: 'rechargeable-battery-18650-2200mah-saba',
      sku: 'ELC-BAT-SABA18',
      shortDesc: 'مناسب چراغ قوه، دریل شارژی، پروژکتورهای خورشیدی و بردهای آردوینو.',
      description: 'باتری لیتیوم یون استاندارد صبا با تخلیه جریان مداوم بالا، عمر چرخه‌ای بیش از ۱۰۰۰ بار شارژ و دشارژ و بدون افت ولتاژ ناگهانی.',
      price: 135000,
      originalPrice: 160000,
      discountPercent: 16,
      stock: 70,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: true,
      isIsfahanFast: true,
      brand: 'صبا باتری (Saba Battery)',
      warranty: 'ضمانت ظرفیت واقعی و سلامت',
      madeIn: 'ایران',
      rating: 4.8,
      reviewCount: 35,
      images: [
        { url: '/images/products/باتری-لیتیوم-یون-36v-سایز-18650-2200mah-سرتخت-inr-صبا.jpg', isPrimary: true, alt: 'باتری شارژی لیتیومی ۱۸۶۵۰ صبا' },
      ],
      specs: [
        { label: 'ولتاژ نامی', value: '۳.۷ ولت (ماکزیمم ۴.۲ ولت)' },
        { label: 'ظرفیت واقعی', value: '۲۲۰۰ میلی‌آمپر ساعت' },
      ]
    }
  ];

  // Insert all products and relations
  for (const p of products) {
    const { images, specs, reviews, ...prodData } = p;

    const createdProd = await prisma.product.create({
      data: {
        ...prodData,
        images: {
          create: images || [],
        },
        specs: {
          create: specs || [],
        },
        reviews: {
          create: reviews || [],
        }
      }
    });

    console.log(`  ✓ Created product: ${createdProd.name}`);
  }

  // 5. Seed Sample Order
  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: 'SH-140306-089',
      customerName: 'مهندس محمدرضا کاظمی',
      customerPhone: '09131112233',
      customerEmail: 'kazemi.najafabad@gmail.com',
      province: 'اصفهان',
      city: 'نجف‌آباد',
      postalCode: '8514712345',
      address: 'نجف‌آباد، خیابان شریعتی، مجتمع مهر، واحد ۴',
      isCorporate: true,
      companyName: 'شرکت مهندسی نیرو افشان نجف‌آباد',
      economicCode: '411589632145',
      nationalCode: '10260487954',
      shippingMethod: 'isfahan_express',
      shippingCost: 45000,
      paymentMethod: 'zarinpal',
      paymentStatus: 'PAID',
      orderStatus: 'PROCESSING',
      trackingCode: 'SNAP-EXP-8451',
      subtotal: 5200000,
      discount: 250000,
      totalAmount: 4995000,
      notes: 'لطفاً هماهنگی تحویل قبل از ساعت ۱۶ با اسنپ‌باکس انجام شود.',
      items: {
        create: [
          {
            productName: 'پنکه ایستاده ۵ پره ریموت‌دار پارس خزر مدل FSR-SHIBA',
            price: 3450000,
            quantity: 1,
            total: 3450000,
            productImage: '/images/products/wal_172619-fans-7995865_1920.jpg'
          },
          {
            productName: 'موتور کولر آبی ۳/۴ اسب بخار موتوژن تبریز',
            price: 4150000,
            quantity: 1,
            total: 4150000,
            productImage: '/images/products/موتور-کولر-موتوژن-3-4.jpg'
          }
        ]
      }
    }
  });
  console.log(`  ✓ Created sample order: ${sampleOrder.orderNumber}`);

  // 6. Seed Sample Repair Requests
  const repairs = [
    {
      trackingCode: 'REP-1403-8412',
      customerName: 'علی‌اکبر شریفی',
      customerPhone: '09131112233',
      applianceType: 'پنکه ایستاده پارس خزر',
      brandModel: 'پارس خزر مدل شیبا',
      issueDesc: 'موتور داغ می‌کرد و دور تند کار نمی‌کرد. بوش و خازن تعویض شد.',
      status: 'COMPLETED',
      estimatedCost: 280000,
      adminNotes: 'بوش برنجی تعویض و روغن‌کاری سیلیکونی انجام شد. آماده تحویل در نجف‌آباد.',
    },
    {
      trackingCode: 'REP-1403-9120',
      customerName: 'مهدی کریمی',
      customerPhone: '09139998877',
      applianceType: 'موتور کولر آبی ۱/۲',
      brandModel: 'موتوژن',
      issueDesc: 'پلاتین عمل نمی‌کرد و موتور صدای وزوز می‌داد.',
      status: 'REPAIRING',
      estimatedCost: 450000,
      adminNotes: 'سیم‌پیچی کمکی در حال بررسی و تعویض کلاچ گریز از مرکز.',
    }
  ];

  for (const r of repairs) {
    await prisma.repairRequest.create({ data: r });
  }
  console.log(`  ✓ Seeded sample repair requests.`);

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
