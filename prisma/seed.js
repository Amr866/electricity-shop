const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding with local high-res product photos for Shiasi Store...');

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

  // 3. Seed 4 Core Product Categories with Local Crisp Images
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

  // 4. Products Data with Authentic Iranian Product Galleries using local images
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
        { url: '/images/products/adonyig-machine-3098797_1920.jpg', isPrimary: true, alt: 'موتور کولر آبی موتوژن تبریز' },
        { url: '/images/products/is463940-generator-5476642_1920.jpg', isPrimary: false, alt: 'الکتروموتور سیم‌پیچی مس' },
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
        { url: '/images/products/is463940-generator-5476642_1920.jpg', isPrimary: true, alt: 'موتور کولر ۳/۴ موتوژن' },
      ],
      specs: [
        { label: 'توان', value: '۳/۴ اسب بخار' },
        { label: 'مناسب کولر', value: 'کولر آبی ۶۰۰۰، ۶۵۰۰ و ۷۰۰۰' },
        { label: 'سیم‌پیچ', value: 'مس خالص' }
      ]
    },

    // --- 4. Electrogen Cooler Pump ---
    {
      categoryId: catAppliances.id,
      name: 'پمپ آب کولر آبی الکتروژن مدل البرز ضدآب با فیلتر محافظ رسوب',
      slug: 'electrogen-cooler-water-pump-alborz',
      sku: 'APP-CLR-PUMP-ELC',
      shortDesc: 'موتور بی‌صدا، عایق‌بندی کامل استاندارد IP و مقاوم در برابر املاح و رسوب آب.',
      description: 'پمپ آب کولر الکتروژن مدل البرز یکی از مطمئن‌ترین پمپ‌های بازار با هد پمپاژ قوی آب و بدنه ضدخوردگی. مناسب برای تمامی کولرهای آبی از ۳۵۰۰ تا ۷۵۰۰.',
      price: 340000,
      originalPrice: 380000,
      discountPercent: 10,
      stock: 45,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      isIsfahanFast: true,
      brand: 'الکتروژن (Electrogen)',
      warranty: 'یک سال گارانتی معتبر شرکتی',
      madeIn: 'ایران',
      rating: 4.8,
      reviewCount: 22,
      images: [
        { url: '/images/products/adonyig-machine-3098797_1920.jpg', isPrimary: true, alt: 'پمپ آب کولر الکتروژن' },
      ],
      specs: [
        { label: 'جنس بدنه', value: 'پلیمر فشرده ضدخوردگی' },
        { label: 'دبی پمپاژ', value: '۱۲ لیتر بر دقیقه' },
      ]
    },

    // --- 5. Copper Electrical Wire 1.5mm Alborz ---
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
        { url: '/images/products/skdunning-wire-962753_1920.jpg', isPrimary: true, alt: 'سیم برق افشان مس البرز الکتریک' },
        { url: '/images/products/republica-wire-732209_1920.jpg', isPrimary: false, alt: 'رشته های مس افشان' },
      ],
      specs: [
        { label: 'طول کلاف', value: '۱۰۰ متر بسته‌بندی کارخانه‌ای' },
        { label: 'سطح مقطع', value: '۱.۵ میلی‌متر مربع' },
        { label: 'ولتاژ نامی', value: '۴۵۰/۷۵۰ ولت' },
      ]
    },

    // --- 6. Copper Electrical Wire 2.5mm Alborz ---
    {
      categoryId: catWiring.id,
      name: 'سیم برق افشان سایز ۲.۵*۱ تمام مس استاندارد البرز الکتریک کلاف ۱۰۰ متری',
      slug: 'copper-wire-25-alborz-electric',
      sku: 'WIR-ALB-25',
      shortDesc: 'مناسب سیم‌کشی پریزهای برق، کولر آبی و گازی و مصارف ساختمانی با دوام بالا.',
      description: 'سیم افشان ۲.۵ میلی‌متر مربع با قابلیت تحمل جریان تا ۲۵ آمپر، عایق مستحکم در برابر حرارت و خلوص مس ۹۹.۹٪ جهت جلوگیری از افت ولتاژ و آتش‌سوزی.',
      price: 1580000,
      originalPrice: 1780000,
      discountPercent: 11,
      stock: 45,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isIsfahanFast: true,
      brand: 'البرز الکتریک نور (Alborz)',
      warranty: 'ضمانت استاندارد و خلوص مس',
      madeIn: 'ایران',
      rating: 5.0,
      reviewCount: 55,
      images: [
        { url: '/images/products/republica-wire-732209_1920.jpg', isPrimary: true, alt: 'سیم افشان ۲.۵ البرز' },
        { url: '/images/products/ds_30-cable-4875319_1920.jpg', isPrimary: false, alt: 'کلاف سیم و کابل' },
      ],
      specs: [
        { label: 'سطح مقطع', value: '۲.۵ میلی‌متر مربع' },
        { label: 'جریان مجاز', value: 'تا ۲۵ آمپر در لوله برق' },
      ]
    },

    // --- 7. Digital Multimeter DT9205A ---
    {
      categoryId: catMaker.id,
      name: 'مولتی‌متر دیجیتال اتورنج حرفه‌ای مدل DT-9205A همراه با پراب تست و باتری',
      slug: 'digital-multimeter-dt9205a-autoranging',
      sku: 'ELC-TOOL-MULTI92',
      shortDesc: 'ابزار دقیق تست ولتاژ AC/DC، جریان، خازن‌سنج، تست بوق اتصال کوتاه و دیود.',
      description: 'مولتی‌متر دیجیتال DT-9205A یکی از دقیق‌ترین و اقتصادی‌ترین ابزارهای تعمیرکاران الکترونیک و برق‌کاران ساختمان. دارای پایه رومیزی، محافظ ضدضربه سیلیکونی و خاموشی خودکار.',
      price: 495000,
      originalPrice: 580000,
      discountPercent: 14,
      stock: 24,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      isIsfahanFast: true,
      brand: 'ویکتور (Victor Series)',
      warranty: 'مهلت تست سلامت فیزیکی و کالیبراسیون',
      madeIn: 'وارداتی درجه ۱',
      rating: 4.9,
      reviewCount: 38,
      images: [
        { url: '/images/products/old-digital-multimeter-isolated-white-background.jpg', isPrimary: true, alt: 'مولتی متر دیجیتال' },
        { url: '/images/products/ds_30-measurement-4850058_1920.jpg', isPrimary: false, alt: 'تست با مولتی متر' },
      ],
      specs: [
        { label: 'سنجش ولتاژ', value: 'تا ۱۰۰۰ ولت DC و ۷۵۰ ولت AC' },
        { label: 'تست بوق بازر', value: 'کمتر از ۵۰ اهم' },
        { label: 'اقلام همراه', value: 'پراب تست نسوز، باتری ۹ ولت کتابی' },
      ]
    },

    // --- 8. Miniature Circuit Breaker Schneider ---
    {
      categoryId: catWiring.id,
      name: 'فیوز مینیاتوری تک پل ۱۶ آمپر اشنایدر الکتریک مدل Acti9 تیپ C (تیپ موتوری)',
      slug: 'miniature-circuit-breaker-16a-schneider',
      sku: 'WIR-MCB-SCH16',
      shortDesc: 'حفاظت مطمئن از مدارات روشنایی و پریز در برابر اتصال کوتاه و اضافه بار.',
      description: 'کلید مینیاتوری تکفاز ۱۶ آمپر اشنایدر اصل با قدرت قطع ۶ کیلوآمپر، بدنه نسوز و ترمینال‌های ضدلرزش. انتخابی بی‌رقیب برای تابلو برق منازل و کارگاه‌های نجف‌آباد.',
      price: 185000,
      originalPrice: 220000,
      discountPercent: 15,
      stock: 50,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      isIsfahanFast: true,
      brand: 'اشنایدر الکتریک (Schneider)',
      warranty: 'ضمانت ۱۰۰٪ اصالت اشنایدر',
      madeIn: 'تحت لیسانس فرانسه',
      rating: 4.9,
      reviewCount: 29,
      images: [
        { url: '/images/products/paulbr75-electricity-3038497_1920.jpg', isPrimary: true, alt: 'فیوز مینیاتوری اشنایدر' },
        { url: '/images/products/richard_ssmid-equipment-3111880_1920.jpg', isPrimary: false, alt: 'تابلو برق و مینیاتوری' },
      ],
      specs: [
        { label: 'جریان نامی', value: '۱۶ آمپر' },
        { label: 'قدرت قطع', value: '۶ کیلو آمپر (6kA)' },
        { label: 'تیپ منحنی', value: 'C (موتوری و عمومی)' },
      ]
    },

    // --- 9. Vimax 200W Solar Street Light ---
    {
      categoryId: catLighting.id,
      name: 'پروژکتور خورشیدی سرلوله ۲۰۰ وات ویمکس سنسوردار با پنل خورشیدی و ریموت',
      slug: 'solar-street-light-200w-vimax',
      sku: 'LGT-SLR-200W',
      shortDesc: 'روشنایی رایگان بدون نیاز به سیم‌کشی برق، مناسب باغات، معابر و کارگاه‌های نجف‌آباد.',
      description: 'پروژکتور خورشیدی خیابانی ۲۰۰ وات برند معتبر ویمکس با باتری لیتیومی باکیفیت LiFePO4، روشنایی خودکار از غروب تا طلوع آفتاب و سنسور حرکتی هوشمند رادار.',
      price: 4250000,
      originalPrice: 4780000,
      discountPercent: 11,
      stock: 15,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isIsfahanFast: true,
      brand: 'ویمکس (Vimax)',
      warranty: '۲ سال ضمانت رسمی شرکتی',
      madeIn: 'وارداتی درجه ۱',
      rating: 4.9,
      reviewCount: 38,
      images: [
        { url: '/images/products/hans-westbeek-7Oqc89s3VI8-unsplash.jpg', isPrimary: true, alt: 'پروژکتور خورشیدی خیابانی ۲۰۰ وات' },
        { url: '/images/products/6653167-flashlight-6786569_1920.jpg', isPrimary: false, alt: 'چراغ پروژکتور پرقدرت' },
      ],
      specs: [
        { label: 'توان', value: '۲۰۰ وات LED فوق کم‌مصرف' },
        { label: 'باتری', value: 'لیتیومی ظرفیت بالا با شارژدهی تا ۱۲ ساعت' },
        { label: 'ضدآب', value: 'استاندارد IP65 مقاوم در برابر باران و گرد و غبار' },
      ]
    },

    // --- 10. Shahcheraq 24W LED Sensor Panel ---
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
        { url: '/images/products/inspiredimages-light-bulb-1138047_1920.jpg', isPrimary: true, alt: 'پنل سقفی سنسوردار ۲۴ وات' },
        { url: '/images/products/pexels-light-1283795_1920.jpg', isPrimary: false, alt: 'نورپردازی ال ای دی' },
      ],
      specs: [
        { label: 'توان', value: '۲۴ وات LED SMD' },
        { label: 'برد سنسور', value: 'تا ۶ متر زاویه ۳۶۰ درجه' },
      ]
    },

    // --- 11. Arduino Uno R3 DIP ---
    {
      categoryId: catMaker.id,
      name: 'برد توسعه آردوینو اونو مدل Arduino Uno R3 چیپ DIP با کابل اتصال USB',
      slug: 'arduino-uno-r3-dip-board',
      sku: 'ELC-ARD-UNO-R3',
      shortDesc: 'محبوب‌ترین برد کنترلر میکرو برای پروژه‌های هوشمندسازی، رباتیک و الکترونیک.',
      description: 'برد آردوینو Uno R3 مجهز به میکروکنترلر ATmega328P، پشتیبانی از محیط آردوینو IDE، ۱۴ پین ورودی/خروجی دیجیتال و ۶ ورودی آنالوگ همراه با کابل اتصال USB استاندارد.',
      price: 365000,
      originalPrice: 420000,
      discountPercent: 13,
      stock: 28,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isIsfahanFast: true,
      brand: 'آردوینو (Arduino)',
      warranty: 'مهلت تست سلامت و اصالت قطعه الکترونیک',
      madeIn: 'وارداتی گرید A',
      rating: 4.9,
      reviewCount: 45,
      images: [
        { url: '/images/products/maxis_pictures-the-main-processor-3334336_1920.jpg', isPrimary: true, alt: 'برد آردوینو Uno R3' },
        { url: '/images/products/kouji-tsuru-wQuGKXfAcGQ-unsplash.jpg', isPrimary: false, alt: 'چیپست پردازنده' },
      ],
      specs: [
        { label: 'میکروکنترلر', value: 'ATmega328P با بوت‌لودر فابریک' },
        { label: 'ولتاژ ورودی', value: '۷ تا ۱۲ ولت DC' },
      ]
    },

    // --- 12. Soldering Station 60W Adjustable ---
    {
      categoryId: catMaker.id,
      name: 'هویه لحیم‌کاری ۶۰ وات دیمردار با قابلیت تنظیم دما همراه با نوک نسوز',
      slug: 'soldering-iron-60w-adjustable-temperature',
      sku: 'ELC-TOOL-SOLD60',
      shortDesc: 'ابزار ضروری تعمیرکاران برای لحیم‌کاری بردهای الکترونیکی، پنکه و وسایل برقی.',
      description: 'هویه قلمی ۶۰ وات با ولوم تنظیم دما از ۲۰۰ تا ۴۵۰ درجه سانتی‌گراد، المنت سرامیکی سریع‌گرم‌شونده و نوک با روکش نیکل ضدزنگ.',
      price: 245000,
      originalPrice: 290000,
      discountPercent: 15,
      stock: 35,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      isIsfahanFast: true,
      brand: 'گوت (Goot Style)',
      warranty: 'مهلت تست در کارگاه شیاسی',
      madeIn: 'وارداتی',
      rating: 4.8,
      reviewCount: 28,
      images: [
        { url: '/images/products/close-up-circuit-reparing-tool.jpg', isPrimary: true, alt: 'هویه ۶۰ وات دیمردار' },
        { url: '/images/products/gosiak1980-technique-4909953_1920.jpg', isPrimary: false, alt: 'لحیم کاری برد' },
      ],
      specs: [
        { label: 'توان', value: '۶۰ وات' },
        { label: 'محدوده دما', value: '۲۰۰ الی ۴۵۰ درجه سانتی‌گراد' },
      ]
    },

    // --- 13. Rechargeable Battery Pack 18650 ---
    {
      categoryId: catMaker.id,
      name: 'باتری لیتیومی شارژی ۱۸۶۵۰ ظرفیت ۲۶۰۰mAh سرتخت صنعتی ۳.۷ ولت',
      slug: 'rechargeable-battery-18650-2600mah',
      sku: 'ELC-BAT-18650',
      shortDesc: 'مناسب چراغ قوه، دریل شارژی، پروژکتورهای خورشیدی و بردهای آردوینو.',
      description: 'باتری لیتیوم یون با تخلیه جریان مداوم بالا، عمر چرخه‌ای بیش از ۱۰۰۰ بار شارژ و دشارژ و بدون اثر حافظه.',
      price: 145000,
      originalPrice: 175000,
      discountPercent: 17,
      stock: 70,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: true,
      isIsfahanFast: true,
      brand: 'سامسونگ سل (Samsung Grade)',
      warranty: 'ضمانت ظرفیت واقعی و سلامت',
      madeIn: 'وارداتی',
      rating: 4.8,
      reviewCount: 35,
      images: [
        { url: '/images/products/jeanvdmeulen-battery-4628419_1920.jpg', isPrimary: true, alt: 'باتری شارژی لیتیومی' },
        { url: '/images/products/publicdomainpictures-battery-19983_1920.jpg', isPrimary: false, alt: 'پک باتری های صنعتی' },
      ],
      specs: [
        { label: 'ولتاژ نامی', value: '۳.۷ ولت (ماکزیمم ۴.۲ ولت)' },
        { label: 'ظرفیت واقعی', value: '۲۶۰۰ میلی‌آمپر ساعت' },
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
            productName: 'سیم برق افشان سایز ۱.۵*۱ تمام مس استاندارد البرز الکتریک کلاف ۱۰۰ متری',
            price: 980000,
            quantity: 1,
            total: 980000,
            productImage: '/images/products/skdunning-wire-962753_1920.jpg'
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
