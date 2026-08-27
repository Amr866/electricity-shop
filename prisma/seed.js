const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Naghsh-e Jahan Electric Shop (Isfahan)...');

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productSpec.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.storeSetting.deleteMany();

  // 1. Seed Store Settings
  const settings = [
    { key: 'store_name', value: 'کالای برق و الکترونیک نقش جهان (اصفهان)' },
    { key: 'store_slogan', value: 'تخصصی‌ترین مرجع تامین تجهیزات برقی ساختمانی، روشنایی، اتوماسیون صنعتی و قطعات الکترونیک در نصف جهان' },
    { key: 'store_city', value: 'اصفهان' },
    { key: 'store_address', value: 'اصفهان، خیابان فردوسی، نرسیده به چهارراه فلسطین، روبروی بانک ملی، پلاک ۱۲۸' },
    { key: 'store_phone', value: '031-32204567' },
    { key: 'store_mobile', value: '0913-111-2233' },
    { key: 'store_whatsapp', value: '989131112233' },
    { key: 'store_eitaa', value: 'naghshejahan_bargh' },
    { key: 'store_telegram', value: 'naghshejahan_electric' },
    { key: 'store_working_hours', value: 'شنبه تا چهارشنبه: ۸:۳۰ الی ۲۱:۰۰ | پنجشنبه‌ها: ۸:۳۰ الی ۱۸:۰۰' },
    { key: 'delivery_isfahan_note', value: 'ارسال فوری با اسنپ‌باکس و پیک اختصاصی در کمتر از ۳ ساعت در شهر اصفهان' },
    { key: 'card_number', value: '6037-9975-1234-5678' },
    { key: 'card_holder', value: 'فروشگاه الکتریک نقش جهان - رضایی' },
    { key: 'bank_name', value: 'بانک ملی ایران - شعبه فردوسی اصفهان' },
  ];

  for (const s of settings) {
    await prisma.storeSetting.create({ data: s });
  }

  // 2. Seed Coupons
  const coupons = [
    { code: 'ISFAHAN', discountPercent: 10, minOrderAmount: 200000, isActive: true },
    { code: 'BAHAR1403', discountPercent: 15, minOrderAmount: 500000, isActive: true },
    { code: 'VIP50K', discountAmount: 50000, minOrderAmount: 300000, isActive: true },
  ];

  for (const c of coupons) {
    await prisma.coupon.create({ data: c });
  }

  // 3. Seed Categories
  const catWiring = await prisma.category.create({
    data: {
      name: 'سیم، کابل و اتصالات ساختمانی',
      slug: 'wiring-building',
      description: 'انواع سیم و کابل افشان و مفتولی تمام مس، کابل شبکه، کابل شیلددار، داکت و لوله خرطومی نسوز',
      icon: 'Zap',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      sortOrder: 1,
    }
  });

  const catLighting = await prisma.category.create({
    data: {
      name: 'روشنایی و نورپردازی مدرن',
      slug: 'lighting-fixtures',
      description: 'پنل‌های ال‌ای‌دی 60x60 سقفی، پروژکتورهای SMD و COB فضای باز، لامپ‌های فوق کم‌مصرف، ریسه و نور مخفی',
      icon: 'SunMedium',
      image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=800&q=80',
      sortOrder: 2,
    }
  });

  const catIndustrial = await prisma.category.create({
    data: {
      name: 'برق صنعتی و اتوماسیون',
      slug: 'industrial-automation',
      description: 'کلیدهای مینیاتوری MCB و اتوماتیک، کنتاکتور، رله کنترل فاز، ترانس، اینورتر، شستی و تجهیزات تابلو برق',
      icon: 'Cpu',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      sortOrder: 3,
    }
  });

  const catMaker = await prisma.category.create({
    data: {
      name: 'بردهای الکترونیکی و قطعات DIY',
      slug: 'maker-diy-electronics',
      description: 'میکروکنترلرهای آردوینو، بردهای ESP32 و رزبری‌پای، سنسورها، درایور موتور، منبع تغذیه سوئیچینگ و هویه',
      icon: 'CircuitBoard',
      image: 'https://images.unsplash.com/photo-1517055729441-db3aab13588f?auto=format&fit=crop&w=800&q=80',
      sortOrder: 4,
    }
  });

  // 4. Products Data
  const products = [
    // Category 1: Wiring & Building
    {
      categoryId: catWiring.id,
      name: 'سیم افشان ۱.۵×۱ تمام مس البرز الکتریک (حلقه ۱۰۰ متری)',
      slug: 'alborz-wire-1-5-copper-100m',
      sku: 'WIR-ALB-15',
      shortDesc: 'سیم افشان انعطاف‌پذیر با هادی مس خلوص بالا و عایق استاندارد PVC مقاوم در برابر حرارت.',
      description: 'سیم افشان ۱.۵ میلی‌متر مربع البرز الکتریک نور تولید شده بر اساس استانداردهای ملی ایران (ISIRI 607) و بین‌المللی IEC. مناسب برای سیم‌کشی سیستم‌های روشنایی، پریزهای کم‌مصرف ساختمانی، داخل لوله‌های خرطومی و کانال‌های برق. دارای خلوص مس بالای ۹۹.۹٪ که افت ولتاژ را به حداقل می‌رساند.',
      price: 880000,
      originalPrice: 950000,
      discountPercent: 7,
      stock: 45,
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
        { url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', isPrimary: false, alt: 'حلقه سیم ساختمانی' }
      ],
      specs: [
        { label: 'سطح مقطع', value: '۱.۵ میلی‌متر مربع' },
        { label: 'جنس هادی', value: 'مس آنیل شده کلاس ۵ (انعطاف‌پذیر)' },
        { label: 'طول حلقه', value: '۱۰۰ متر' },
        { label: 'ولتاژ نامی', value: '450/750 ولت' },
        { label: 'استاندارد', value: 'ISIRI (607) 02' },
      ],
      reviews: [
        { authorName: 'مهندس رضایی', city: 'اصفهان (چهارباغ)', rating: 5, comment: 'کیفیت مس عالی بود و افت ولتاژ تو پروژه نداشتیم. ارسال پیک در اصفهان هم زیر ۲ ساعت انجام شد.' },
        { authorName: 'علی کاظمی', city: 'شاهین‌شهر', rating: 5, comment: 'قیمت نسبت به بازار طالقانی اصفهان مناسب‌تر بود.' }
      ]
    },
    {
      categoryId: catWiring.id,
      name: 'کابل مفتولی ۲×۲.۵ کات کابل اصفهان (کلاف ۱۰۰ متری)',
      slug: 'kat-cable-isfahan-2x2-5-100m',
      sku: 'CAB-KAT-225',
      shortDesc: 'کابل مفتولی خشک ۲ رشته با عایق تقویت‌شده مناسب برق اصلی پریزها و کولر گازی.',
      description: 'کابل ساختمانی ۲ رشته مقطع ۲.۵ تولید کارخانه معتبر کات کابل اصفهان. دارای روکش ضخیم ضدسایش و مس تمام عیار مناسب برای پروژه‌های انبوه‌سازی و صنعتی در استان اصفهان.',
      price: 1850000,
      originalPrice: 2000000,
      discountPercent: 8,
      stock: 22,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      brand: 'کات کابل اصفهان',
      warranty: 'ضمانت تاییدیه نظام مهندسی ساختمان',
      madeIn: 'ایران (اصفهان)',
      rating: 4.8,
      reviewCount: 14,
      images: [
        { url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'کابل مفتولی کات کابل اصفهان' }
      ],
      specs: [
        { label: 'تعداد و سطح مقطع', value: '۲ در ۲.۵ میلی‌متر مربع' },
        { label: 'نوع هادی', value: 'مفتول مسی کلاس ۱' },
        { label: 'تحمل جریان', value: 'تا ۲۵ آمپر' },
        { label: 'محل تولید', value: 'شهرک صنعتی مورچه‌خورت اصفهان' }
      ]
    },
    {
      categoryId: catWiring.id,
      name: 'کلید و پریز مدل آسا سفید دلند الکتریک (پک ۱۰ عددی)',
      slug: 'deland-asa-white-switch-socket-pack10',
      sku: 'SWI-DEL-ASA10',
      shortDesc: 'طراحی مدرن، مکانیزم پلی‌کربنات نسوز و ماندگاری رنگ در برابر اشعه خورشید.',
      description: 'کلید و پریز دلند مدل آسا یکی از پرفروش‌ترین و باکیفیت‌ترین مدل‌های بازار ایران است. با رویه براق سفید، اتصالات برنجی قوی با فنریت بالا که حتی پس از هزاران بار استفاده شل نمی‌شوند.',
      price: 490000,
      originalPrice: 550000,
      discountPercent: 11,
      stock: 60,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      brand: 'دلند الکتریک',
      warranty: '۵ سال گارانتی تعویض بی قید و شرط',
      madeIn: 'ایران',
      rating: 4.9,
      reviewCount: 35,
      images: [
        { url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'کلید و پریز دلند آسا' }
      ],
      specs: [
        { label: 'مدل', value: 'آسا (Asa)' },
        { label: 'رنگ', value: 'سفید صدفی' },
        { label: 'جنس بدنه', value: 'پلی‌کربنات نشکن و ضد اشتعال' },
        { label: 'جنس ترمینال', value: 'برنج و مس فسفردار' }
      ]
    },
    {
      categoryId: catWiring.id,
      name: 'داکت شیاردار صنعتی البرز سایز ۶۰×۴۰ (شاخه ۲ متری)',
      slug: 'alborz-slotted-duct-60x40',
      sku: 'DCT-ALB-6040',
      shortDesc: 'داکت تابلویی طوسی رنگ با انعطاف‌پذیری دندانه‌ها و قفل درب محکم.',
      description: 'داکت شیاردار البرز جهت مرتب‌سازی و هدایت سیم‌ها در داخل تابلو برق‌های صنعتی، جعبه فیوزها و راک‌های شبکه. مقاوم در برابر شعله و حرارت تا ۶۰ درجه سانتی‌گراد.',
      price: 125000,
      originalPrice: 140000,
      discountPercent: 10,
      stock: 120,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      brand: 'البرز',
      warranty: 'ضمانت اصالت فیزیکی',
      madeIn: 'ایران',
      rating: 4.7,
      reviewCount: 9,
      images: [
        { url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'داکت شیاردار البرز' }
      ],
      specs: [
        { label: 'ابعاد', value: 'عرض ۶۰ میلی‌متر در ارتفاع ۴۰ میلی‌متر' },
        { label: 'طول هر شاخه', value: '۲ متر' },
        { label: 'رنگ', value: 'طوسی صنعتی' },
      ]
    },

    // Category 2: Lighting & Modern Fixtures
    {
      categoryId: catLighting.id,
      name: 'پنل سقفی توکار ۶۰×۶۰ فول لایت ۵۰ وات پارس شعاع توس',
      slug: 'parsshoa-panel-60x60-50w-backlight',
      sku: 'LGT-PST-6060',
      shortDesc: 'نور کاملاً یکدست بدون فلیکر (سوسو زدن)، راندمان نوری بالا مناسب دفاتر کار و مجتمع‌ها.',
      description: 'چراغ پنلی ال ای دی توکار ۶۰ در ۶۰ مدل بک لایت پارس شعاع توس با توان ۵۰ وات و شار نوری ۵۰۰۰ لومن. تکنولوژی ضدخستگی چشم و مصرف انرژی فوق‌العاده پایین (رده انرژی A++). مناسب سقف‌های کناف و شبکه در ادارات، بیمارستان‌ها و فروشگاه‌ها.',
      price: 620000,
      originalPrice: 690000,
      discountPercent: 10,
      stock: 50,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      brand: 'پارس شعاع توس',
      warranty: '۲۴ ماه گارانتی تعویض شرکتی',
      madeIn: 'ایران',
      rating: 4.9,
      reviewCount: 42,
      images: [
        { url: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'پنل سقفی ۶۰ در ۶۰ پارس شعاع' },
        { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80', isPrimary: false, alt: 'نورپردازی اداری' }
      ],
      specs: [
        { label: 'توان مصرفی', value: '۵۰ وات' },
        { label: 'شار نوری', value: '۵۰۰۰ لومن' },
        { label: 'دمای رنگ', value: 'مهتابی (۶۵۰۰ کلوین) / آفتابی (۳۰۰۰ کلوین)' },
        { label: 'ابعاد', value: '۵۹۵ × ۵۹۵ میلی‌متر' },
        { label: 'طول عمر', value: '۳۰,۰۰۰ ساعت' }
      ],
      reviews: [
        { authorName: 'دکتر صانعی', city: 'اصفهان (مرداویج)', rating: 5, comment: 'برای کلینیک ۱۰ عدد خریدیم، نور عالی و یکدست بدون هیچگونه سوسو زدن دوربین.' }
      ]
    },
    {
      categoryId: catLighting.id,
      name: 'پروژکتور ۱۰۰ وات SMD ضدآب IP66 صبا ترانس (نور مهتابی)',
      slug: 'sabatrans-smd-floodlight-100w-ip66',
      sku: 'LGT-SAB-100W',
      shortDesc: 'بدنه آلومینیوم دایکاست با هیت‌سینک پره‌ای قدرتمند برای محیط‌های باز و نمای ساختمان.',
      description: 'پروژکتور SMD صد وات شرکت صبا ترانس با زاویه پخش نور ۱۲۰ درجه و مقاومت در برابر باران شدید، گرد و غبار با استاندارد IP66. ایده‌آل برای نورپردازی باغ، ویلاهای زاینده‌رود و اصفهان، پارکینگ‌ها و کارگاه‌های صنعتی.',
      price: 790000,
      originalPrice: 890000,
      discountPercent: 11,
      stock: 30,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      brand: 'صبا ترانس',
      warranty: '۱۲ ماه گارانتی تعویض طلایی',
      madeIn: 'ایران',
      rating: 4.8,
      reviewCount: 19,
      images: [
        { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'پروژکتور SMD صد وات' }
      ],
      specs: [
        { label: 'توان', value: '۱۰۰ وات واقعی' },
        { label: 'درجه حفاظت', value: 'IP66 ضد آب و گرد و غبار' },
        { label: 'جنس بدنه', value: 'آلومینیوم دایکاست با رنگ پودری الکترواستاتیک' },
        { label: 'شار نوری', value: '۱۰۰۰۰ لومن' }
      ]
    },
    {
      categoryId: catLighting.id,
      name: 'ریسه نواری نئون فلکس ۱۲ ولت ضدآب (حلقه ۵ متری - آبی فیروزه‌ای اصفهان)',
      slug: 'neon-flex-12v-turquoise-5m',
      sku: 'LGT-NEON-TURQ',
      shortDesc: 'نور نئونی یکپارچه بدون مشخص بودن دانه‌های ال‌ای‌دی، مناسب تابلو‌سازی و دکوراسیون خاص.',
      description: 'ریسه نئون فلکسیبل ۱۲ ولت با انعطاف‌پذیری فوق‌العاده بالا برای ساخت طرح‌های نئونی، لاین‌های نوری مخفی، ویترین فروشگاه‌ها و معماری داخلی سنتی و مدرن اصفهان.',
      price: 245000,
      originalPrice: 280000,
      discountPercent: 12,
      stock: 75,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      brand: 'اوپال لایت',
      warranty: '۶ ماه ضمانت چیپ LED',
      madeIn: 'وارداتی درجه یک',
      rating: 4.7,
      reviewCount: 11,
      images: [
        { url: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'ریسه نئون فلکس فیروزه‌ای' }
      ],
      specs: [
        { label: 'ولتاژ کاری', value: '۱۲ ولت DC' },
        { label: 'طول حلقه', value: '۵ متر' },
        { label: 'قابلیت برش', value: 'هر ۲.۵ سانتی‌متر' },
        { label: 'رنگ نور', value: 'فیروزه‌ای خاص (Turquoise)' }
      ]
    },
    {
      categoryId: catLighting.id,
      name: 'لامپ ال ای دی ۲۰ وات استوانه‌ای پارس شهاب (پایه E27)',
      slug: 'pars-shahab-led-bulb-20w-e27',
      sku: 'LGT-PSH-20W',
      shortDesc: 'روشنایی پرقدرت، بدون اشعه فرابنفش (UV)، جایگزین لامپ‌های ۱۰۰ وات رشته‌ای و کم‌مصرف.',
      description: 'لامپ ال ای دی ۲۰ وات پارس شهاب از باکیفیت‌ترین لامپ‌های استاندارد بازار با طول عمر بیش از ۲۵ هزار ساعت. فاقد جیوه و گازهای مضر، روشن شدن آنی بدون نیاز به گرم شدن.',
      price: 98000,
      originalPrice: 110000,
      discountPercent: 11,
      stock: 150,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      brand: 'پارس شهاب',
      warranty: '۱۲ ماه گارانتی تعویض پارس شهاب',
      madeIn: 'ایران',
      rating: 4.9,
      reviewCount: 56,
      images: [
        { url: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'لامپ ۲۰ وات پارس شهاب' }
      ],
      specs: [
        { label: 'توان مصرفی', value: '۲۰ وات' },
        { label: 'سرپیچ', value: 'E27 (معمولی)' },
        { label: 'شار نوری', value: '۱۹۰۰ لومن' },
        { label: 'رده انرژی', value: 'A+' }
      ]
    },

    // Category 3: Industrial & Automation
    {
      categoryId: catIndustrial.id,
      name: 'کلید مینیاتوری تک پل ۱۶ آمپر هیوندای تیپ C (اصل کره)',
      slug: 'hyundai-mcb-1p-16a-type-c',
      sku: 'IND-HYU-1P16',
      shortDesc: 'حفاظت دقیق در برابر اضافه‌بار و اتصال کوتاه با قدرت قطع ۶ کیلوآمپر (6kA).',
      description: 'فیوز مینیاتوری تیپ C (موتوری/صنعتی) هیوندای الکتریک کره، طراحی شده برای قطع سریع در اضافه جریان‌های لحظه‌ای. مناسب جهت تابلو برق‌های کارگاهی، موتورها و پمپ‌های آب خانگی و صنعتی.',
      price: 185000,
      originalPrice: 210000,
      discountPercent: 12,
      stock: 80,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      brand: 'هیوندای (Hyundai)',
      warranty: 'ضمانت اصالت و سلامت ۱۰۰٪ شرکتی',
      madeIn: 'کره جنوبی (تحت لیسانس)',
      rating: 5.0,
      reviewCount: 31,
      images: [
        { url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'کلید مینیاتوری هیوندای ۱۶ آمپر' }
      ],
      specs: [
        { label: 'جریان نامی', value: '۱۶ آمپر' },
        { label: 'تعداد پل', value: 'تک پل (1P)' },
        { label: 'تیپ منحنی قطع', value: 'تیپ C (موتوری)' },
        { label: 'قدرت قطع', value: '6kA' }
      ]
    },
    {
      categoryId: catIndustrial.id,
      name: 'کنتاکتور ۲۵ آمپر هیوندای ۲۲۰ ولت مدل HGC 25',
      slug: 'hyundai-contactor-25a-220v-hgc25',
      sku: 'IND-HYU-CON25',
      shortDesc: 'کنتاکتور پرقدرت صنعتی با بوبین ۲۲۰ ولت و تیغه‌های کمکی ۱NO + 1NC.',
      description: 'کنتاکتور سه فاز هیوندای مدل HGC25 برای راه‌اندازی و کنترل الکتروموتورهای صنعتی تا ۱۱ کیلووات در ولتاژ ۴۰۰ ولت. دارای مقاومت بالای پلاتین‌ها در برابر جرقه‌زنی مکرر.',
      price: 890000,
      originalPrice: 990000,
      discountPercent: 10,
      stock: 25,
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      brand: 'هیوندای (Hyundai)',
      warranty: '۲۴ ماه گارانتی تعویض شرکتی',
      madeIn: 'کره جنوبی',
      rating: 4.9,
      reviewCount: 16,
      images: [
        { url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'کنتاکتور ۲۵ آمپر هیوندای' }
      ],
      specs: [
        { label: 'جریان نامی (AC-3)', value: '۲۵ آمپر' },
        { label: 'ولتاژ بوبین', value: '220V AC' },
        { label: 'کنتاکت‌های کمکی', value: '1NO + 1NC' },
        { label: 'توان موتور قابل کنترل', value: 'تا 11KW' }
      ]
    },
    {
      categoryId: catIndustrial.id,
      name: 'کنترل فاز دیجیتال شیوا امواج مدل 13B2',
      slug: 'shiva-amvaj-digital-phase-control-13b2',
      sku: 'IND-SHV-PHASE',
      shortDesc: 'نمایشگر دیجیتال ولتاژ، حفاظت در برابر دوفاز شدن، نوسان شدید، عدم تقارن و جابجایی فاز.',
      description: 'دستگاه کنترل فاز میکروپروسسوری شیوا امواج اصفهان جهت حفاظت دقیق از الکتروموتورها، پمپ‌های آب کشاورزی و چاه‌های استان اصفهان و ماشین‌آلات صنعتی در برابر نوسانات برق شبکه.',
      price: 640000,
      originalPrice: 700000,
      discountPercent: 9,
      stock: 40,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      brand: 'شیوا امواج',
      warranty: '۳ سال ضمانت طلایی بدون قید و شرط شیوا امواج',
      madeIn: 'ایران',
      rating: 4.9,
      reviewCount: 27,
      images: [
        { url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'کنترل فاز دیجیتال شیوا امواج' }
      ],
      specs: [
        { label: 'ولتاژ تغذیه', value: '180 الی 250 ولت متناوب' },
        { label: 'قابلیت‌ها', value: 'تنظیم زمان وصل و قطع، نمایش ولتاژ شبکه' },
        { label: 'خروجی رله', value: 'رله ۵ آمپر' },
        { label: 'تاییدیه‌ها', value: 'دارای تاییدیه شرکت توانیر' }
      ]
    },
    {
      categoryId: catIndustrial.id,
      name: 'اینورتر و درایو ۳ اسب (۲.۲ کیلووات) تک فاز به سه فاز دلتا سری EL',
      slug: 'delta-inverter-vfd-el-2-2kw-single-to-three',
      sku: 'IND-DLT-VFD22',
      shortDesc: 'کنترل دور دقیق الکتروموتورهای سه فاز با برق ۲۲۰ ولت تک فاز خانگی.',
      description: 'اینورتر کمپکت و قدرتمند دلتا سری VFD-EL دارای فیلتر EMI داخلی، کی‌پد جداشونده و پروتکل مدباس RS485. مناسب برای انواع پمپ، فن، نوار نقاله و دستگاه‌های تراش در کارگاه‌های صنعتی.',
      price: 6850000,
      originalPrice: 7400000,
      discountPercent: 7,
      stock: 12,
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      brand: 'دلتا (Delta)',
      warranty: '۱۸ ماه گارانتی رسمی دلتا ایران',
      madeIn: 'تایوان',
      rating: 5.0,
      reviewCount: 8,
      images: [
        { url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'اینورتر دلتا ۲.۲ کیلووات' }
      ],
      specs: [
        { label: 'توان خروجی', value: '۲.۲ کیلووات (۳ اسب بخار)' },
        { label: 'ولتاژ ورودی', value: 'تک فاز ۲۲۰ ولت' },
        { label: 'ولتاژ خروجی', value: 'سه فاز ۲۲۰ ولت' },
        { label: 'پورت ارتباطی', value: 'RS-485 Modbus' }
      ]
    },

    // Category 4: Maker & DIY Electronics
    {
      categoryId: catMaker.id,
      name: 'برد آردوینو اونو مدل Arduino Uno R3 (میکروکنترلر ATmega328P SMD)',
      slug: 'arduino-uno-r3-atmega328p-smd-cable',
      sku: 'MKR-ARD-UNO3',
      shortDesc: 'محبوب‌ترین برد توسعه و برنامه‌نویسی برای پروژه‌های هوشمندسازی، رباتیک و اینترنت اشیاء (IoT).',
      description: 'برد آردوینو Uno R3 اورجینال دارای ۱۴ پین ورودی/خروجی دیجیتال (که ۶ تای آن‌ها PWM هستند)، ۶ ورودی آنالوگ، کریستال ۱۶ مگاهرتز و پورت USB Type-B به همراه کابل اتصال رایگان. کامپایل و پروگرم آنی با نرم‌افزار Arduino IDE.',
      price: 295000,
      originalPrice: 340000,
      discountPercent: 13,
      stock: 65,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      brand: 'آردوینو (Arduino)',
      warranty: 'مهلت تست ۷ روزه و ضمانت سلامت چیپ',
      madeIn: 'چین درجه یک',
      rating: 4.9,
      reviewCount: 48,
      images: [
        { url: 'https://images.unsplash.com/photo-1517055729441-db3aab13588f?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'برد آردوینو اونو Arduino Uno' }
      ],
      specs: [
        { label: 'میکروکنترلر', value: 'ATmega328P' },
        { label: 'ولتاژ کاری', value: '۵ ولت DC' },
        { label: 'فرکانس کاری', value: '۱۶ مگاهرتز' },
        { label: 'حافظه فلش', value: '۳۲ کیلوبایت' },
        { label: 'لوازم جانبی', value: 'همراه با کابل آبی شیلددار USB' }
      ],
      reviews: [
        { authorName: 'محمد مهدی', city: 'اصفهان (دانشگاه صنعتی)', rating: 5, comment: 'برای پروژه پایانی رباتیک سفارش دادم، بدون دردسر چیپ CH340 شناسایی شد.' }
      ]
    },
    {
      categoryId: catMaker.id,
      name: 'برد وای‌فای و بلوتوث ESP32 مدل NodeMCU-32S دو هسته‌ای',
      slug: 'esp32-nodemcu-32s-wifi-bluetooth-dualcore',
      sku: 'MKR-ESP-32S',
      shortDesc: 'پردازنده فوق‌سریع دو هسته‌ای ۲۴۰ مگاهرتزی با وای‌فای داخلی ۲.۴ گیگاهرتز و بلوتوث نسخه ۴.۲.',
      description: 'ماژول همه‌کاره ESP-WROOM-32 مناسب هوشمندسازی ساختمان، ارسال اطلاعات سنسورها به سرور محلی یا اینترنت، وب‌سرور داخلی و اتصال به خانه هوشمند Home Assistant.',
      price: 265000,
      originalPrice: 295000,
      discountPercent: 10,
      stock: 55,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      brand: 'Espressif',
      warranty: 'ضمانت تست قطعه و سلامت فیزیکی',
      madeIn: 'چین',
      rating: 4.9,
      reviewCount: 39,
      images: [
        { url: 'https://images.unsplash.com/photo-1517055729441-db3aab13588f?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'برد ESP32 وای‌فای و بلوتوث' }
      ],
      specs: [
        { label: 'پردازنده', value: 'Xtensa Dual-Core 32-bit LX6 @ 240MHz' },
        { label: 'ارتباط بی‌سیم', value: 'WiFi 802.11 b/g/n + Bluetooth v4.2 BR/EDR & BLE' },
        { label: 'حافظه SRAM', value: '۵۲۰ کیلوبایت' },
        { label: 'پورت', value: 'Micro USB با آی‌سی CP2102' }
      ]
    },
    {
      categoryId: catMaker.id,
      name: 'هویه برقی دیجیتال ۶۰ وات با قابلیت تنظیم دقیق دما (۱۸۰ تا ۴۸۰ درجه)',
      slug: 'digital-soldering-iron-60w-adjustable-temp',
      sku: 'MKR-SLD-DIG60',
      shortDesc: 'گرمایش فوق‌سریع در ۱۰ ثانیه، نوک سرامیکی نسوز قابل تعویض با نمایشگر LCD.',
      description: 'هویه حرفه‌ای قلمی ۶۰ وات مجهز به المنت سرامیکی ژاپنی با دکمه‌های تنظیم دما روی بدنه. مناسب تعمیرات برد الکترونیکی، لحیم‌کاری قطعات SMD و پروژه‌های دانشجویی و کارگاهی.',
      price: 385000,
      originalPrice: 440000,
      discountPercent: 12,
      stock: 35,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      brand: 'سومو (Somo)',
      warranty: '۶ ماه گارانتی برد و المنت',
      madeIn: 'چین درجه یک',
      rating: 4.8,
      reviewCount: 22,
      images: [
        { url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'هویه دیجیتال تنظیم دما ۶۰ وات' }
      ],
      specs: [
        { label: 'توان', value: '۶۰ وات' },
        { label: 'محدوده دما', value: '۱۸۰ الی ۴۸۰ درجه سانتی‌گراد' },
        { label: 'نوع نوک', value: 'نوک ۹۰۰M قابل تعویض' },
        { label: 'طول کابل', value: '۱.۴ متر سیلیکونی ضدحرارت' }
      ]
    },
    {
      categoryId: catMaker.id,
      name: 'مولتی‌متر دیجیتال اتورنج ویکتور مدل Victor VC97 (نسخه اورجینال با پراپ دما)',
      slug: 'victor-vc97-digital-multimeter-auto-range',
      sku: 'MKR-MET-VC97',
      shortDesc: 'دقیق‌ترین مولتی‌متر کارگاهی با قابلیت تست خازن، فرکانس، دما، تست دیود و ترانزیستور hFE.',
      description: 'مولتی‌متر اتورنج ویکتور ۹۷ انتخاب اول مهندسان و تعمیرکاران الکترونیک در سراسر ایران. دارای بدنه ضربه‌گیر محافظ، نور پس‌زمینه صفحه نمایش (Backlight) و خاموشی خودکار برای بهینه‌سازی مصرف باتری.',
      price: 1650000,
      originalPrice: 1850000,
      discountPercent: 11,
      stock: 18,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      brand: 'ویکتور (Victor)',
      warranty: 'یک سال گارانتی کالیبراسیون و تعویض',
      madeIn: 'چین اورجینال',
      rating: 5.0,
      reviewCount: 64,
      images: [
        { url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'مولتی‌متر اتورنج ویکتور VC97' }
      ],
      specs: [
        { label: 'نوع اندازه‌گیری', value: 'Auto-Range (تنظیم خودکار رنج)' },
        { label: 'ولتاژ DC/AC', value: 'تا ۱۰۰۰ ولت' },
        { label: 'جریان DC/AC', value: 'تا ۲۰ آمپر' },
        { label: 'تست خازن', value: 'تا ۲۰۰ میکروفاراد' },
        { label: 'اندازه‌گیری دما', value: '-۲۰ تا ۱۰۰۰ درجه سانتی‌گراد' }
      ]
    },
    {
      categoryId: catMaker.id,
      name: 'ماژول رله ۵ ولت ۴ کاناله با ایزولاسیون اپتوکوپلر',
      slug: 'relay-module-5v-4channel-optocoupler',
      sku: 'MKR-MOD-RLY4',
      shortDesc: 'کنترل بارهای ۲۲۰ ولت ساختمانی توسط بردهای آردوینو، میکروکنترلر و رزبری‌پای.',
      description: 'ماژول رله ۴ کانال مجهز به ایزولاتور نوری (Optocoupler) جهت جلوگیری از نویز و برگشت ولتاژ به پردازنده. تحمل جریان هر کانال تا ۱۰ آمپر در ۲۵۰ ولت AC.',
      price: 145000,
      originalPrice: 165000,
      discountPercent: 12,
      stock: 85,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      brand: 'الکترونیک اسمارت',
      warranty: 'مهلت تست سلامت فیزیکی',
      madeIn: 'چین',
      rating: 4.8,
      reviewCount: 15,
      images: [
        { url: 'https://images.unsplash.com/photo-1517055729441-db3aab13588f?auto=format&fit=crop&w=800&q=80', isPrimary: true, alt: 'ماژول رله ۴ کاناله ۵ ولت' }
      ],
      specs: [
        { label: 'ولتاژ تحریک بوبین', value: '۵ ولت DC' },
        { label: 'حداکثر بار خروجی', value: '10A 250VAC / 10A 30VDC' },
        { label: 'نوع سوئیچینگ', value: 'Active Low' },
        { label: 'نشانگر LED', value: 'دارای ال‌ای‌دی وضعیت برای هر کانال' }
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

  // 5. Seed a Sample Completed Order for testing Order Tracking & Invoice
  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: 'NJ-140306-089',
      customerName: 'حمیدرضا معتمدی',
      customerPhone: '09132004050',
      customerEmail: 'motamedi@example.com',
      province: 'اصفهان',
      city: 'اصفهان',
      postalCode: '8146512345',
      address: 'اصفهان، خیابان شیخ صدوق جنوبی، کوچه ارغوان، پلاک ۱۲، واحد ۳',
      shippingMethod: 'isfahan_express',
      shippingCost: 45000,
      paymentMethod: 'zarinpal',
      paymentStatus: 'PAID',
      orderStatus: 'PROCESSING',
      trackingCode: 'SNAP-ISF-98214',
      subtotal: 1395000,
      discount: 50000,
      totalAmount: 1390000,
      paymentRefId: 'ZP-982341908234',
      notes: 'لطفا قبل از تحویل هماهنگ بفرمایید. زنگ واحد ۳ خراب است.',
      items: {
        create: [
          {
            productName: 'سیم افشان ۱.۵×۱ تمام مس البرز الکتریک (حلقه ۱۰۰ متری)',
            price: 880000,
            quantity: 1,
            total: 880000,
            productImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
          },
          {
            productName: 'کلید و پریز مدل آسا سفید دلند الکتریک (پک ۱۰ عددی)',
            price: 490000,
            quantity: 1,
            total: 490000,
            productImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
          }
        ]
      }
    }
  });

  console.log(`  ✓ Created sample order for tracking: ${sampleOrder.orderNumber}`);
  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
