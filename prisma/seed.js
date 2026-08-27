const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Shiasi Store (Najafabad, Isfahan)...');

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
    { key: 'store_name', value: 'فروشگاه تخصصی شیاسی (نجف‌آباد اصفهان)' },
    { key: 'store_slogan', value: 'مرکز خرید و تعمیرات تخصصی لوازم برقی خانگی، پنکه، کولر، بخاری، آنتن، روشنایی و قطعات الکترونیک' },
    { key: 'store_city', value: 'نجف‌آباد' },
    { key: 'store_province', value: 'اصفهان' },
    { key: 'store_address', value: 'اصفهان، نجف‌آباد، خیابان قدس / شریعتی (فروشگاه تخصصی شیاسی)' },
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

  // 3. Seed Categories with relatable photos
  const catAppliances = await prisma.category.create({
    data: {
      name: 'لوازم برقی خانگی و سرمایش/گرمایش (پنکه، کولر، بخاری)',
      slug: 'home-appliances-cooling-heating',
      description: 'انواع پنکه ایستاده و رومیزی، موتور و پمپ کولر آبی، بخاری و هیترهای برقی، آنتن دیجیتال و اتصالات',
      icon: 'Fan',
      image: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80',
      sortOrder: 1,
    }
  });

  const catWiring = await prisma.category.create({
    data: {
      name: 'سیم، کابل و کلید پریز ساختمانی',
      slug: 'wiring-building',
      description: 'انواع سیم و کابل افشان و مفتولی تمام مس، کابل آنتن کواکسیال، کلید و پریز دلند، داکت و لوله برق',
      icon: 'Zap',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      sortOrder: 2,
    }
  });

  const catLighting = await prisma.category.create({
    data: {
      name: 'روشنایی، پنل LED و تجهیزات خورشیدی',
      slug: 'lighting-fixtures',
      description: 'پنل‌های ال‌ای‌دی، پروژکتورهای خورشیدی سولار، چراغ‌های پارکی، لامپ‌های کم‌مصرف و ریسه نئون',
      icon: 'SunMedium',
      image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=800&q=80',
      sortOrder: 3,
    }
  });

  const catMaker = await prisma.category.create({
    data: {
      name: 'قطعات الکترونیک، آردوینو و ابزار تعمیرات',
      slug: 'maker-diy-electronics',
      description: 'هویه، مولتی‌متر، المنت بخاری، بردهای آردوینو، ماژول‌های الکترونیکی و تجهیزات کارگاهی تعمیرات',
      icon: 'Cpu',
      image: 'https://images.unsplash.com/photo-1517055729441-db3aab13588f?auto=format&fit=crop&w=800&q=80',
      sortOrder: 4,
    }
  });

  // 4. Products Data with Relatable High-Quality Product Galleries
  const products = [
    // --- 1. Standing Fan ---
    {
      categoryId: catAppliances.id,
      name: 'پنکه ایستاده ۵ پره ریموت‌دار پارس خزر مدل FSR-SHIBA با گارانتی ۲۴ ماهه',
      slug: 'pars-khazar-fan-fsr-shiba-remote',
      sku: 'APP-FAN-PKFSR',
      shortDesc: 'باددهی پرقدرت، کم‌صدا، مجهز به کنترل از راه دور، تایمر هوشمند و صفحه نمایش LED.',
      description: 'پنکه ایستاده پارس خزر مدل شیبا با ۵ پره آیرودینامیک شفاف، قابلیت تنظیم زاویه عمودی و افقی خودکار، ۳ حالت وزش باد (عادی، نسیم، خواب) و موتور تمام مس مقاوم در برابر کارکرد طولانی. امکان خرید آنلاین و ارائه خدمات پس از فروش و تعمیرات تخصصی در فروشگاه شیاسی نجف‌آباد.',
      price: 3450000,
      originalPrice: 3850000,
      discountPercent: 10,
      stock: 18,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      brand: 'پارس خزر (Pars Khazar)',
      warranty: '۲۴ ماه گارانتی رسمی پارس خزر + پشتیبانی قطعات و تعمیرات شیاسی',
      madeIn: 'ایران',
      rating: 5.0,
      reviewCount: 34,
      images: [
        { url: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'پنکه ایستاده ریموت دار پارس خزر' },
        { url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80', isPrimary: false, alt: 'پره ها و موتور تمام مس پنکه' },
        { url: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?auto=format&fit=crop&w=800&q=80', isPrimary: false, alt: 'نمای کامل پنکه در منزل' }
      ],
      specs: [
        { label: 'توان مصرفی', value: '۶۰ وات' },
        { label: 'تعداد پره', value: '۵ پره شفاف با راندمان بالا' },
        { label: 'قابلیت‌ها', value: 'ریموت کنترل، تایمر تا ۷.۵ ساعت، تنظیم ارتفاع' },
        { label: 'پشتیبانی تعمیرات', value: 'تعمیر تخصصی بوش و موتور در کارگاه شیاسی نجف‌آباد' }
      ],
      reviews: [
        { authorName: 'حاج احمد امینی', city: 'نجف‌آباد', rating: 5, comment: 'پنکه عالی و بی صدا، تحویل فوری در نجف‌آباد با اخلاق عالی مدیریت شیاسی.' }
      ]
    },

    // --- 2. Water Cooler Motor Motogen ---
    {
      categoryId: catAppliances.id,
      name: 'موتور کولر آبی ۱/۲ اسب بخار موتوژن تبریز اصل (سیم‌پیچی تمام مس خازن‌دار)',
      slug: 'motogen-cooler-motor-half-hp-copper',
      sku: 'APP-CLR-MOT50',
      shortDesc: 'استانداردترین الکتروموتور کولر آبی مناسب کولرهای ۴۰۰۰ تا ۵۰۰۰ با راندمان بالا.',
      description: 'دینام کولر آبی ۱/۲ موتوژن تبریز اورجینال با درجه حفاظت رطوبتی، خازن روغنی راه‌انداز و کلید گریز از مرکز (پلاتین). فروش نقدی با ضمانت نامه اصالت کالا و امکان پذیرش تعمیر و تعویض موتور کولر سوخته با نو در شعبه نجف‌آباد.',
      price: 3680000,
      originalPrice: 3990000,
      discountPercent: 8,
      stock: 14,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      brand: 'موتوژن تبریز (Motogen)',
      warranty: '۲ سال ضمانت طلایی تعویض موتوژن',
      madeIn: 'ایران (تبریز اصل)',
      rating: 4.9,
      reviewCount: 52,
      images: [
        { url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'موتور کولر آبی موتوژن تبریز' },
        { url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', isPrimary: false, alt: 'سیم‌پیچی مس و قطعات داخلی موتور' },
        { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', isPrimary: false, alt: 'تست در کارگاه فنی شیاسی' }
      ],
      specs: [
        { label: 'قدرت موتور', value: '۱/۲ اسب بخار (1/2 HP)' },
        { label: 'جنس سیم‌پیچ', value: '۱۰۰٪ مس استاندارد' },
        { label: 'سرعت', value: 'دو دور (کند ۹۵۰ دور / تند ۱۴۲۵ دور)' },
        { label: 'خدمات تعمیر', value: 'تعمیر تخصصی و سیم‌پیچی مجدد در کارگاه شیاسی' }
      ]
    },

    // --- 3. Electric Quartz Radiant Heater ---
    {
      categoryId: catAppliances.id,
      name: 'بخاری برقی تابشی ۴ المان شیشه‌ای کوارتز اخوان مدل ۲۰۰۰ وات با ترموستات و فن',
      slug: 'akhavan-electric-heater-quartz-2000w-fan',
      sku: 'APP-HTR-AKH20',
      shortDesc: 'گرمایش مطبوع تابشی با ۴ المنت سرامیکی شیشه‌ای، فن پرتاب گرما و سنسور واژگونی ایمن.',
      description: 'هیتر و بخاری برقی اخوان ۲۰۰۰ وات دارای ۴ کلید مجزا برای کنترل المنت‌ها، فن توربو جهت گردش سریع گرما در محیط و سیستم ایمنی قطع خودکار در صورت واژگونی. در صورت نیاز به المنت یدکی یا تعمیر، کارگاه شیاسی نجف‌آباد در خدمت شماست.',
      price: 1350000,
      originalPrice: 1550000,
      discountPercent: 13,
      stock: 25,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      brand: 'اخوان (Akhavan)',
      warranty: '۱۲ ماه ضمانت شرکتی + تامین المنت و قطعات یدکی',
      madeIn: 'ایران',
      rating: 4.8,
      reviewCount: 29,
      images: [
        { url: 'https://images.unsplash.com/photo-1545259742-b43a38f38692?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'بخاری برقی فن دار تابشی اخوان' },
        { url: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80', isPrimary: false, alt: 'المنت‌های شیشه‌ای کوارتز گرمایشی' }
      ],
      specs: [
        { label: 'توان حرارتی', value: '۲۰۰۰ وات (قابل تنظیم ۵۰۰ تا ۲۰۰۰ وات)' },
        { label: 'نوع المنت', value: 'کوارتز شیشه‌ای ضدجرقه' },
        { label: 'تجهیزات جانبی', value: 'مجهز به فن حلزونی و سنسور قطع ایمنی' },
        { label: 'خدمات', value: 'فروش قطعات و تعمیر بخاری در نجف‌آباد' }
      ]
    },

    // --- 4. Rotating TV Antenna ---
    {
      categoryId: catAppliances.id,
      name: 'آنتن هوایی گردان دیجیتال تمام باند هانی مدل 201 معطوف با بوستر تقویت سیگنال',
      slug: 'hani-rotating-digital-tv-antenna-booster-201',
      sku: 'APP-ANT-HANI201',
      shortDesc: 'گیرندگی فوق‌العاده قوی شبکه‌های HD و 4K حتی در نقاط کور نجف‌آباد و باغات اطراف.',
      description: 'آنتن تلویزیون گردان هانی مجهز به موتور برقی جهت چرخش ۳۶۰ درجه از داخل منزل با کنترل منبع تغذیه، تقویت‌کننده کم‌نویز UHF/VHF و پشتیبانی کامل از سیگنال‌های دیجیتال DVB-T2.',
      price: 495000,
      originalPrice: 560000,
      discountPercent: 11,
      stock: 30,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      brand: 'هانی (Hani)',
      warranty: '۲ سال گارانتی تعویض برد بوستر هانی',
      madeIn: 'ایران',
      rating: 4.9,
      reviewCount: 41,
      images: [
        { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'آنتن هوایی گردان دیجیتال هانی' },
        { url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', isPrimary: false, alt: 'بوستر و منبع تغذیه آنتن' }
      ],
      specs: [
        { label: 'باند دریافت', value: 'UHF, VHF, FM' },
        { label: 'تقویت‌کننده', value: 'دارای بوستر نویز پایین (Low Noise Booster)' },
        { label: 'چرخش', value: 'موتور برقی ۳۶۰ درجه با کلید دوطرفه' },
        { label: 'خدمات', value: 'تعمیر بوستر و منبع تغذیه آنتن در نجف‌آباد' }
      ]
    },

    // --- 5. Water Cooler Submersible Pump ---
    {
      categoryId: catAppliances.id,
      name: 'پمپ آب کولر آبی الکتروژن مدل البرز ضدآب با فیلتر محافظ',
      slug: 'electrogen-cooler-water-pump-alborz',
      sku: 'APP-CLR-PUMP-ELC',
      shortDesc: 'موتور بی‌صدا، عایق‌بندی کامل استاندارد IP و مقاوم در برابر رسوب آب.',
      description: 'پمپ آب کولر الکتروژن مدل البرز یکی از مطمئن‌ترین پمپ‌های بازار با هد پمپاژ قوی آب و بدنه ضدخوردگی. مناسب برای کولرهای آبی ۳۵۰۰ تا ۷۰۰۰.',
      price: 340000,
      originalPrice: 380000,
      discountPercent: 10,
      stock: 45,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      brand: 'الکتروژن (Electrogen)',
      warranty: 'یک سال گارانتی معتبر شرکتی',
      madeIn: 'ایران',
      rating: 4.8,
      reviewCount: 38,
      images: [
        { url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'پمپ آب کولر الکتروژن' }
      ],
      specs: [
        { label: 'ولتاژ', value: '۲۲۰ ولت متناوب' },
        { label: 'دبی پمپاژ', value: '۱۱ الی ۱۳ لیتر در دقیقه' },
        { label: 'جنس پروانه', value: 'پلاستیک فشرده ضد رسوب' }
      ]
    },

    // --- 6. Smart Digital Cooler Switch ---
    {
      categoryId: catAppliances.id,
      name: 'کلید کولر آبی لمسی دیجیتال هوشمند مجهز به ریموت کنترل و ترموستات خودکار',
      slug: 'smart-touch-cooler-switch-remote-thermostat',
      sku: 'APP-CLR-SWI-SMART',
      shortDesc: 'خاموش و روشن خودکار کولر طبق دمای محیط نجف‌آباد، تایمر خواب و صفحه لمسی ضدآب.',
      description: 'کلید کولر هوشمند لمسی با قابلیت کنترل از راه دور توسط ریموت RF، تایمر خاموشی و روشن‌سازی متناوب پمپ جهت کاهش ۳۰ درصدی مصرف آب و برق در تابستان.',
      price: 520000,
      originalPrice: 590000,
      discountPercent: 12,
      stock: 28,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      brand: 'تکنو اسمارت',
      warranty: '۱۸ ماه ضمانت تعویض برد',
      madeIn: 'ایران',
      rating: 4.9,
      reviewCount: 26,
      images: [
        { url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'کلید کولر هوشمند لمسی ریموت دار' }
      ],
      specs: [
        { label: 'نوع پنل', value: 'لمسی خازنی با نور پس‌زمینه' },
        { label: 'سنسورها', value: 'ترموستات سنجش دمای محیط' },
        { label: 'نصب', value: 'جایگزین مستقیم کلید کولرهای قدیمی بدون تغییر سیم‌کشی' }
      ]
    },

    // --- 7. Pure Copper Electrical Wire 1.5mm ---
    {
      categoryId: catWiring.id,
      name: 'سیم افشان ۱.۵×۱ تمام مس البرز الکتریک (حلقه ۱۰۰ متری)',
      slug: 'alborz-wire-1-5-copper-100m',
      sku: 'WIR-ALB-15',
      shortDesc: 'سیم افشان انعطاف‌پذیر با هادی مس خلوص بالا و عایق استاندارد PVC مقاوم در برابر حرارت.',
      description: 'سیم افشان ۱.۵ میلی‌متر مربع البرز الکتریک نور تولید شده بر اساس استانداردهای ملی ایران. دارای خلوص مس بالای ۹۹.۹٪ مناسب پروژه‌های ساختمانی نجف‌آباد و اصفهان.',
      price: 880000,
      originalPrice: 950000,
      discountPercent: 7,
      stock: 50,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      brand: 'البرز الکتریک نور',
      warranty: 'تضمین اصالت مس و استاندارد ملی ایران',
      madeIn: 'ایران',
      rating: 4.9,
      reviewCount: 28,
      images: [
        { url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'سیم افشان ۱.۵ البرز مس' },
        { url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', isPrimary: false, alt: 'کلاف کابل برق استاندارد تمام مس' }
      ],
      specs: [
        { label: 'سطح مقطع', value: '۱.۵ میلی‌متر مربع' },
        { label: 'جنس هادی', value: 'مس آنیل شده کلاس ۵' },
        { label: 'طول حلقه', value: '۱۰۰ متر' }
      ]
    },

    // --- 8. Coaxial RG6 TV Cable ---
    {
      categoryId: catWiring.id,
      name: 'کابل آنتن کواکسیال صادراتی تمام مس RG6 کات کابل (کلاف ۱۰۰ متری)',
      slug: 'coaxial-antenna-cable-rg6-copper-100m',
      sku: 'WIR-ANT-RG6',
      shortDesc: 'شیلد و مغزی مس خالص با فویل دوبل جهت انتقال تصویر شفاف 4K بدون افت سیگنال.',
      description: 'کابل آنتن صادراتی RG6 تمام مس مناسب انواع گیرنده‌های دیجیتال و آنتن‌های مرکزی مجتمع‌های ساختمانی.',
      price: 920000,
      originalPrice: 1050000,
      discountPercent: 12,
      stock: 40,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      brand: 'کات کابل',
      warranty: 'ضمانت کیفیت مس و انتقال سیگنال',
      madeIn: 'ایران',
      rating: 4.9,
      reviewCount: 21,
      images: [
        { url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'کابل آنتن کواکسیال تمام مس' }
      ],
      specs: [
        { label: 'نوع کابل', value: 'کواکسیال RG6' },
        { label: 'جنس مغزی', value: 'مس خالص ۱.۰۲ میلی‌متر' },
        { label: 'شیلد', value: 'بافت مس ۹۶ رشته با فویل آلومینیوم' }
      ]
    },

    // --- 9. Solar LED Floodlight ---
    {
      categoryId: catLighting.id,
      name: 'پروژکتور ۲۰۰ وات خورشیدی سولار ویمکس سنسوردار با پنل مجزا و ریموت کنترل',
      slug: 'vimax-solar-floodlight-200w-remote',
      sku: 'LGT-SOL-VIM200',
      shortDesc: 'روشنایی کاملاً رایگان خورشیدی برای باغ، ویلا و حیاط‌های نجف‌آباد بدون نیاز به سیم‌کشی برق.',
      description: 'سیستم روشنایی خورشیدی ۲۰۰ وات ویمکس مجهز به پنل مونوکریستال پربازده، باتری لیتیومی بادوام با ماندگاری ۱۲ ساعته، سنسور تشخیص شب و ریموت کنترل هوشمند.',
      price: 4520000,
      originalPrice: 4780000,
      discountPercent: 5,
      stock: 15,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      brand: 'ویمکس (Vimax)',
      warranty: '۲ سال گارانتی کامل و خدمات تعویض باتری',
      madeIn: 'وارداتی درجه یک',
      rating: 5.0,
      reviewCount: 44,
      images: [
        { url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'پروژکتور خورشیدی ۲۰۰ وات ویمکس' },
        { url: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=800&q=80', isPrimary: false, alt: 'پنل سولار و چراغ LED' }
      ],
      specs: [
        { label: 'توان روشنایی', value: '۲۰۰ وات LED' },
        { label: 'باتری داخلی', value: 'لیتیوم فسفات ۲۰,۰۰۰ میلی‌آمپر' },
        { label: 'مدت شارژدهی', value: '۱۰ الی ۱۴ ساعت مداوم' },
        { label: 'ضدآب', value: 'IP66 مقاوم در برابر برف و باران' }
      ]
    },

    // --- 10. Arduino Uno R3 ---
    {
      categoryId: catMaker.id,
      name: 'برد آردوینو اونو مدل Arduino Uno R3 میکروکنترلر ATmega328P',
      slug: 'arduino-uno-r3-atmega328p',
      sku: 'MKR-ARD-UNO3',
      shortDesc: 'محبوب‌ترین برد توسعه و برنامه‌نویسی برای هوشمندسازی، رباتیک و پروژه‌های فنی.',
      description: 'برد آردوینو Uno R3 اورجینال دارای ۱۴ پین دیجیتال و ۶ ورودی آنالوگ، همراه با کابل شیلددار USB.',
      price: 295000,
      originalPrice: 340000,
      discountPercent: 13,
      stock: 50,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      brand: 'آردوینو (Arduino)',
      warranty: 'مهلت تست ۷ روزه و ضمانت اصالت چیپ',
      madeIn: 'چین درجه یک',
      rating: 4.9,
      reviewCount: 38,
      images: [
        { url: 'https://images.unsplash.com/photo-1517055729441-db3aab13588f?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'برد آردوینو Uno R3' },
        { url: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80', isPrimary: false, alt: 'مدار مجتمع و چیپست میکروکنترلر' }
      ],
      specs: [
        { label: 'میکروکنترلر', value: 'ATmega328P' },
        { label: 'ولتاژ کاری', value: '۵ ولت DC' }
      ]
    },

    // --- 11. Digital Soldering Iron & Repair Kit ---
    {
      categoryId: catMaker.id,
      name: 'هویه برقی دیجیتال ۶۰ وات با قابلیت تنظیم دقیق دما (۱۸۰ تا ۴۸۰ درجه)',
      slug: 'digital-soldering-iron-60w',
      sku: 'MKR-SLD-DIG60',
      shortDesc: 'گرمایش فوق‌سریع در ۱۰ ثانیه مناسب تعمیرات لوازم خانگی و بردهای الکترونیکی.',
      description: 'هویه حرفه‌ای قلمی ۶۰ وات با نمایشگر LCD و تنظیم دیجیتال دما، ابزار ضروری تعمیرکاران لوازم برقی و الکترونیک.',
      price: 385000,
      originalPrice: 440000,
      discountPercent: 12,
      stock: 25,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      brand: 'سومو (Somo)',
      warranty: '۶ ماه گارانتی برد و المنت',
      madeIn: 'چین درجه یک',
      rating: 4.8,
      reviewCount: 19,
      images: [
        { url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'هویه دیجیتال ۶۰ وات و ابزار لحیم‌کاری' },
        { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', isPrimary: false, alt: 'کارگاه عیب‌یابی و لحیم‌کاری برد الکترونیکی' }
      ],
      specs: [
        { label: 'توان', value: '۶۰ وات' },
        { label: 'محدوده دما', value: '۱۸۰ الی ۴۸۰ درجه سانتی‌گراد' }
      ]
    }
  ];

  for (const p of products) {
    const { specs, images, reviews, ...productData } = p;
    const createdProduct = await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: images
        },
        specs: {
          create: specs
        },
        reviews: reviews ? {
          create: reviews
        } : undefined
      }
    });
    console.log(`  ✓ Created product: ${createdProduct.name}`);
  }

  // 5. Seed Sample Completed Order
  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: 'SH-140306-089',
      customerName: 'حمیدرضا معتمدی',
      customerPhone: '09132004050',
      customerEmail: 'motamedi@example.com',
      province: 'اصفهان',
      city: 'نجف‌آباد',
      postalCode: '8514812345',
      address: 'نجف‌آباد، خیابان امام خمینی غربی، کوچه لاله، پلاک ۲۴',
      shippingMethod: 'isfahan_express',
      shippingCost: 35000,
      paymentMethod: 'zarinpal',
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED',
      subtotal: 4800000,
      discount: 0,
      totalAmount: 4835000,
      trackingCode: '14030678912345',
      items: {
        create: [
          {
            productName: 'پنکه ایستاده ۵ پره ریموت‌دار پارس خزر مدل FSR-SHIBA',
            price: 3450000,
            quantity: 1,
            total: 3450000,
            productImage: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=800&q=80'
          },
          {
            productName: 'بخاری برقی تابشی ۴ المان شیشه‌ای اخوان',
            price: 1350000,
            quantity: 1,
            total: 1350000,
            productImage: 'https://images.unsplash.com/photo-1545259742-b43a38f38692?auto=format&fit=crop&w=800&q=80'
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
      status: 'READY',
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
      status: 'IN_PROGRESS',
      estimatedCost: 450000,
      adminNotes: 'سیم‌پیچی کمکی در حال بررسی و تعویض کلاچ گریز از مرکز.',
    },
    {
      trackingCode: 'REP-1403-9934',
      customerName: 'حسین احمدی',
      customerPhone: '09132223344',
      applianceType: 'سایر: جاروبرقی فیلیپس',
      brandModel: 'فیلیپس FC9170',
      issueDesc: 'روشن نمی‌شود و بوی سوختگی دارد. زغال و بلبرینگ‌ها تعویض گردید.',
      status: 'READY',
      estimatedCost: 350000,
      adminNotes: 'زغال موتور تعویض و کلکتور تراشکاری شد. تست مکش با موفقیت انجام شد.',
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
