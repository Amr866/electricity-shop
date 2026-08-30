const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sampleImages = [
  '/images/products/wal_172619-fans-7995865_1920.jpg',
  '/images/products/AIromax-polymer-water-cooler-8000.webp',
  '/images/products/موتور-کولر-موتوژن-3-4.jpg',
  '/images/products/Electric-heater-element.jpg',
  '/images/products/7500-general.jpg',
  '/images/products/skdunning-wire-962753_1920.jpg',
  '/images/products/کابل-افشان-دو-رشته-سایز-15-استاندارد.jpeg',
  '/images/products/کابل-آنتن-08_48-تمام-مس-1-600x600.jpeg',
  '/images/products/parto-electric-stranded-wire-1-15.png',
  '/images/products/corrugated-pipe.webp',
  '/images/products/inspiredimages-light-bulb-1138047_1920.jpg',
  '/images/products/پنل-24-وات-سنسوردار-شاهچراغ-روکار.webp',
  '/images/products/لامپ-50-وات-ایرانی-افراتاب-استوانه-.jpeg',
  '/images/products/6653167-flashlight-6786569_1920.jpg',
  '/images/products/pexels-light-1283795_1920.jpg',
  '/images/products/close-up-circuit-reparing-tool.jpg',
  '/images/products/old-digital-multimeter-isolated-white-background.jpg',
  '/images/products/باتری-لیتیوم-یون-36v-سایز-18650-2200mah-سرتخت-inr-صبا.jpg',
  '/images/products/باتری-لیتیوم-یون-37v-سایز-18650-سرتخت-1500mah-ضریب-جریان-15c-مارک-hi.jpg',
  '/images/products/maxis_pictures-the-main-processor-3334336_1920.jpg',
  '/images/products/ds_30-measurement-4850058_1920.jpg',
];

async function main() {
  console.log('⚡ Generating full catalog (~65 products per category for 3-4 pages pagination)...');

  const categories = await prisma.category.findMany();
  const catMap = {};
  for (const c of categories) {
    catMap[c.slug] = c.id;
  }

  // 1. Home Appliances (Cooling & Heating) Templates
  const appliancesTemplates = [
    { name: 'موتور کولر آبی موتوژن ۳/۴ اسب بخار دو خازنه اصل تبریز', brand: 'موتوژن تبریز (Motogen)', price: 4150000, img: '/images/products/موتور-کولر-موتوژن-3-4.jpg' },
    { name: 'موتور کولر آبی ۱/۲ اسب بخار موتوژن تبریز سیم‌پیچی تمام مس', brand: 'موتوژن تبریز (Motogen)', price: 3680000, img: '/images/products/موتور-کولر-موتوژن-3-4.jpg' },
    { name: 'موتور کولر آبی ۱/۳ اسب بخار موتوژن مناسب کولر ۳۵۰۰', brand: 'موتوژن تبریز (Motogen)', price: 3200000, img: '/images/products/موتور-کولر-موتوژن-3-4.jpg' },
    { name: 'پمپ آب کولر الکتروژن مدل البرز ضدآب و کم‌مصرف', brand: 'الکتروژن (Electrogen)', price: 420000, img: '/images/products/7500-general.jpg' },
    { name: 'پمپ آب کولر موتوژن تبریز پرقدرت با عایق‌بندی کلاس B', brand: 'موتوژن تبریز (Motogen)', price: 540000, img: '/images/products/موتور-کولر-موتوژن-3-4.jpg' },
    { name: 'کولر آبی پلیمری سلولزی ۸۰۰۰ اینورتر ایرومکس با پد ضدشوره', brand: 'ایرومکس (Airomax)', price: 18900000, img: '/images/products/AIromax-polymer-water-cooler-8000.webp' },
    { name: 'کولر آبی ۶۰۰۰ پلیمری اینورتر هوشمند ایرومکس مجهز به ترموستات', brand: 'ایرومکس (Airomax)', price: 16200000, img: '/images/products/AIromax-polymer-water-cooler-8000.webp' },
    { name: 'پنکه ایستاده ۵ پره ریموت‌دار پارس خزر مدل FSR-SHIBA', brand: 'پارس خزر (Pars Khazar)', price: 3450000, img: '/images/products/wal_172619-fans-7995865_1920.jpg' },
    { name: 'پنکه رومیزی ۴ پره پرقدرت پارس خزر مدل RIMA', brand: 'پارس خزر (Pars Khazar)', price: 2150000, img: '/images/products/wal_172619-fans-7995865_1920.jpg' },
    { name: 'پنکه سقفی ۴ پره صنعتی البرز با کلید چرخشی ۵ سرعته', brand: 'البرز الکتریک نور (Alborz)', price: 2950000, img: '/images/products/wal_172619-fans-7995865_1920.jpg' },
    { name: 'المنت شیشه‌ای کوارتز بخاری برقی طول ۲۵ سانتی‌متر ۵۰۰ وات', brand: 'اخوان (Akhavan Element)', price: 65000, img: '/images/products/Electric-heater-element.jpg' },
    { name: 'المنت سرامیکی فن هیتر حرارتی ۱۰۰۰ وات کم‌مصرف', brand: 'اخوان (Akhavan Element)', price: 185000, img: '/images/products/Electric-heater-element.jpg' },
    { name: 'بخاری برقی تابشی هالوژنی ۴ لامپه پارس خزر مدل زاگرس', brand: 'پارس خزر (Pars Khazar)', price: 1980000, img: '/images/products/Electric-heater-element.jpg' },
    { name: 'فن هیتر رومیزی اتوماتیک پارس خزر مدل ۲۰۰۰ وات FH2000P', brand: 'پارس خزر (Pars Khazar)', price: 1450000, img: '/images/products/Electric-heater-element.jpg' },
    { name: 'ترموستات دیجیتال کنترل دمای کولر و فن شیاسی مدل هوشمند', brand: 'شیوا امواج (Shiva Amvaj)', price: 480000, img: '/images/products/7500-general.jpg' },
    { name: 'کلید کولر آبی هوشمند لمسی مجهز به ریموت کنترل رادیویی', brand: 'پارت الکتریک (Part Electric)', price: 620000, img: '/images/products/7500-general.jpg' },
    { name: 'یاتاقان بلبرینگی کولر آبی سایز ۳/۴ صنعتی ضدزنگ', brand: 'موتوژن تبریز (Motogen)', price: 125000, img: '/images/products/موتور-کولر-موتوژن-3-4.jpg' },
    { name: 'تسمه کولر آبی سایز A68 استاندارد کره‌ای ضدسایش', brand: 'دانگیل (Dongil)', price: 95000, img: '/images/products/7500-general.jpg' },
    { name: 'شناور کولر آبی برنجی ضدچکه و ضدزنگ شیاسی', brand: 'شیاسی (Shiasi)', price: 75000, img: '/images/products/7500-general.jpg' },
    { name: 'پروانه فن کولر آبی ۴۵۰۰ گالوانیزه بالانس شده بدون لرزش', brand: 'ایران بالانس (Iran Balance)', price: 650000, img: '/images/products/wal_172619-fans-7995865_1920.jpg' },
  ];

  // 2. Wiring & Antennas Templates
  const wiringTemplates = [
    { name: 'سیم افشان تمام مس نمره ۱.۵ البرز الکتریک نور کلاف ۱۰۰ متری', brand: 'البرز الکتریک نور (Alborz)', price: 850000, img: '/images/products/skdunning-wire-962753_1920.jpg' },
    { name: 'سیم افشان تمام مس نمره ۲.۵ البرز الکتریک نور استاندارد', brand: 'البرز الکتریک نور (Alborz)', price: 1380000, img: '/images/products/کابل-افشان-دو-رشته-سایز-15-استاندارد.jpeg' },
    { name: 'سیم افشان نمره ۴ البرز الکتریک نور مخصوص کولر گازی و کنتور', brand: 'البرز الکتریک نور (Alborz)', price: 2150000, img: '/images/products/parto-electric-stranded-wire-1-15.png' },
    { name: 'کابل مفتولی خشک ۲ در ۲.۵ صادراتی مس کاشان کلاف ۱۰۰ متری', brand: 'کابل صادراتی مس (Copper Cable)', price: 2950000, img: '/images/products/کابل-افشان-دو-رشته-سایز-15-استاندارد.jpeg' },
    { name: 'کابل کواکسیال آنتن 4.5C-2V صادراتی مس با فویل دوبل و شیلد ۹۶ رشته', brand: 'کابل صادراتی مس (Copper Cable)', price: 920000, img: '/images/products/کابل-آنتن-08_48-تمام-مس-1-600x600.jpeg' },
    { name: 'آنتن دیجیتال برقی گردان هانی مدل 2001 با تقویت‌کننده سیگنال 4K', brand: 'هانی (Hani Antenna)', price: 460000, img: '/images/products/کابل-آنتن-08_48-تمام-مس-1-600x600.jpeg' },
    { name: 'آنتن رومیزی دیجیتال بوستردار هانی مدل 107 مناسب تلویزیون 4K', brand: 'هانی (Hani Antenna)', price: 285000, img: '/images/products/کابل-آنتن-08_48-تمام-مس-1-600x600.jpeg' },
    { name: 'بوستر تقویت‌کننده سیگنال آنتن مرکزی سیماران ۲ خروجی', brand: 'سیماران (Simaran)', price: 380000, img: '/images/products/کابل-آنتن-08_48-تمام-مس-1-600x600.jpeg' },
    { name: 'لوله خرطومی نسوز سایز ۱۱ صنایع پلاستیک کلاف ۲۵ متری', brand: 'صنایع پلاستیک تهران', price: 165000, img: '/images/products/corrugated-pipe.webp' },
    { name: 'لوله خرطومی نسوز سایز ۱۳ ساختمانی ضدحرارت و استاندارد', brand: 'صنایع پلاستیک تهران', price: 195000, img: '/images/products/خرطومی11صنایع-پلاستیک-تهران.jpg' },
    { name: 'محافظ ولتاژ ۶ خانه پارت الکتریک با کابل ۳ متری و کلید چراغ‌دار', brand: 'پارت الکتریک (Part Electric)', price: 420000, img: '/images/products/skdunning-wire-962753_1920.jpg' },
    { name: 'محافظ ولتاژ پکیج و یخچال دیجیتال نمودار کنترل با نمایشگر ولتاژ', brand: 'نمودار کنترل (Nemoodar)', price: 350000, img: '/images/products/skdunning-wire-962753_1920.jpg' },
    { name: 'کلید مینیاتوری تک‌پل ۱۶ آمپر تیپ C هیوندای اصل کره', brand: 'هیوندای (Hyundai Electric)', price: 145000, img: '/images/products/skdunning-wire-962753_1920.jpg' },
    { name: 'کلید مینیاتوری دوپل ۲۵ آمپر شیوا امواج مدل صنعتی', brand: 'شیوا امواج (Shiva Amvaj)', price: 280000, img: '/images/products/skdunning-wire-962753_1920.jpg' },
    { name: 'کلید پریز توکار مدل الماس پارت الکتریک رنگ بژ متالیک', brand: 'پارت الکتریک (Part Electric)', price: 78000, img: '/images/products/skdunning-wire-962753_1920.jpg' },
    { name: 'پریز برق ارت‌دار بارانی صنعتی مدل کرال پارت الکتریک', brand: 'پارت الکتریک (Part Electric)', price: 95000, img: '/images/products/skdunning-wire-962753_1920.jpg' },
    { name: 'چسب برق PVC ضدحرارت الماس نسوز بسته ۱۰ عددی', brand: 'الماس (Almas)', price: 120000, img: '/images/products/skdunning-wire-962753_1920.jpg' },
    { name: 'ترمینال شاخه‌ای ۱۲ خانه نمره ۱۰ نسوز پلی‌آمید', brand: 'شیاسی (Shiasi)', price: 65000, img: '/images/products/skdunning-wire-962753_1920.jpg' },
    { name: 'کابل شبکه Cat6 SFTP تمام مس لگراند کلاف ۳۰۵ متری', brand: 'لگراند (Legrand)', price: 4850000, img: '/images/products/skdunning-wire-962753_1920.jpg' },
    { name: 'داکت چسب‌دار سایز ۲.۵ در ۲.۵ دانوب شاخه ۲ متری', brand: 'دانوب (Danub)', price: 65000, img: '/images/products/corrugated-pipe.webp' },
  ];

  // 3. Lighting Fixtures Templates
  const lightingTemplates = [
    { name: 'لامپ LED حبابی ۵۰ وات استوانه‌ای افراتاب سرپیچ E27 نور مهتابی', brand: 'افراتاب (Afratab)', price: 295000, img: '/images/products/لامپ-50-وات-ایرانی-افراتاب-استوانه-.jpeg' },
    { name: 'لامپ LED حبابی ۳۰ وات افراتاب کم‌مصرف با ضمانت ۲ ساله', brand: 'افراتاب (Afratab)', price: 165000, img: '/images/products/لامپ-50-وات-ایرانی-افراتاب-استوانه-.jpeg' },
    { name: 'پنل سقفی روکار ۲۴ وات سنسوردار هوشمند شاهچراغ با چیپ SMD', brand: 'صنایع روشنایی شاهچراغ', price: 340000, img: '/images/products/پنل-24-وات-سنسوردار-شاهچراغ-روکار.webp' },
    { name: 'پنل ۶۰ در ۶۰ روکار و توکار ۵۰ وات شاهچراغ بدون فلیکر و خیرگی', brand: 'صنایع روشنایی شاهچراغ', price: 780000, img: '/images/products/پنل-24-وات-سنسوردار-شاهچراغ-روکار.webp' },
    { name: 'پروژکتور خورشیدی ۱۰۰ وات سولار ویمکس با ریموت و پنل جداگانه', brand: 'ویمکس (V-MAX)', price: 1850000, img: '/images/products/pexels-light-1283795_1920.jpg' },
    { name: 'پروژکتور خورشیدی ۲۰۰ وات پرقدرت ضدآب IP66 سنسوردار ویمکس', brand: 'ویمکس (V-MAX)', price: 2650000, img: '/images/products/pexels-light-1283795_1920.jpg' },
    { name: 'پروژکتور ال‌ای‌دی ۱۰۰ وات COB روشنایی صبا نور جهت محوطه و باغ', brand: 'صبا نور (Saba Noor)', price: 620000, img: '/images/products/pexels-light-1283795_1920.jpg' },
    { name: 'پروژکتور ال‌ای‌دی ۵۰ وات SMD مازی‌نور ضدضربه و ضدباران', brand: 'مازی‌نور (Mazinoor)', price: 890000, img: '/images/products/pexels-light-1283795_1920.jpg' },
    { name: 'ریسه نواری شلنگی ۲۲۰ ولت SMD تراکم ۱۲۰ ال‌ای‌دی کلاف ۱۰۰ متری', brand: 'افراتاب (Afratab)', price: 3200000, img: '/images/products/inspiredimages-light-bulb-1138047_1920.jpg' },
    { name: 'چراغ دیواری حیاطی ضدآب آلومینیومی مدل ونیز با رنگ کوره‌ای', brand: 'شاهچراغ (Shahcheragh)', price: 420000, img: '/images/products/inspiredimages-light-bulb-1138047_1920.jpg' },
    { name: 'چراغ سنسوردار راه‌پله و پارکینگ تایمردار دو سرپیچه شیوا امواج', brand: 'شیوا امواج (Shiva Amvaj)', price: 245000, img: '/images/products/پنل-24-وات-سنسوردار-شاهچراغ-روکار.webp' },
    { name: 'لامپ ادیسونی فیلامنتی ۶ وات مدل اشکی نور آفتابی دکوراتیو', brand: 'افراتاب (Afratab)', price: 95000, img: '/images/products/inspiredimages-light-bulb-1138047_1920.jpg' },
    { name: 'چراغ اضطراری هوشمند شارژی ۳۰ ال‌ای‌دی دیواری و پرتابل DP', brand: 'دی‌پی (DP Light)', price: 380000, img: '/images/products/6653167-flashlight-6786569_1920.jpg' },
    { name: 'چراغ قوه پلیسی زوم‌دار شارژی پرقدرت با برد ۵۰۰ متر و بدنه فلزی', brand: 'اسمولایت (Small Sun)', price: 650000, img: '/images/products/6653167-flashlight-6786569_1920.jpg' },
    { name: 'فتوسل روشنایی خودکار ۱۰ آمپر شیوا امواج مناسب باغ و معابر', brand: 'شیوا امواج (Shiva Amvaj)', price: 165000, img: '/images/products/inspiredimages-light-bulb-1138047_1920.jpg' },
    { name: 'سنسور حرکتی ۳۶۰ درجه سقفی توکار هانی با برد ۱۰ متر', brand: 'هانی (Hani)', price: 185000, img: '/images/products/پنل-24-وات-سنسوردار-شاهچراغ-روکار.webp' },
    { name: 'لامپ مهتابی ال‌ای‌دی T8 طول ۱۲۰ سانتی‌متر ۱۸ وات شاهچراغ', brand: 'صنایع روشنایی شاهچراغ', price: 92000, img: '/images/products/inspiredimages-light-bulb-1138047_1920.jpg' },
    { name: 'چراغ خطی لاینر توکار ۲۰ وات دکوراتیو بدنه آلومینیوم آنادایز', brand: 'مازی‌نور (Mazinoor)', price: 540000, img: '/images/products/inspiredimages-light-bulb-1138047_1920.jpg' },
    { name: 'قاب هالوژن آلومینیومی توکار مدل گرد ضدزنگ با سوکت GU10', brand: 'شاهچراغ (Shahcheragh)', price: 45000, img: '/images/products/inspiredimages-light-bulb-1138047_1920.jpg' },
    { name: 'لامپ هالوژنی ۷ وات COB پایه سوزنی نور طبیعی افراتاب', brand: 'افراتاب (Afratab)', price: 68000, img: '/images/products/لامپ-50-وات-ایرانی-افراتاب-استوانه-.jpeg' },
  ];

  // 4. Maker, Arduino & Electronics Templates
  const electronicsTemplates = [
    { name: 'باتری لیتیوم یون ۱۸۶۵۰ سرتخت صبا باتری ظرفیت ۲۲۰۰ میلی‌آمپر', brand: 'صبا باتری (Saba Battery)', price: 110000, img: '/images/products/باتری-لیتیوم-یون-36v-سایز-18650-2200mah-سرتخت-inr-صبا.jpg' },
    { name: 'باتری لیتیوم یون ۱۸۶۵۰ تخلیه بالا ۱۵C مارک های‌استار ۱۵۰۰ میلی‌آمپر', brand: 'های‌استار (HighStar)', price: 145000, img: '/images/products/باتری-لیتیوم-یون-37v-سایز-18650-سرتخت-1500mah-ضریب-جریان-15c-مارک-hi.jpg' },
    { name: 'مولتی‌متر دیجیتال اتورنج حرفه‌ای ویکتور مدل VC97 اورجینال با پراب دما', brand: 'ویکتور (Victor)', price: 2150000, img: '/images/products/old-digital-multimeter-isolated-white-background.jpg' },
    { name: 'مولتی‌متر کلمپی دیجیتال یونیتی مدل UT202A+ اندازه‌گیری جریان AC تا ۴۰۰ آمپر', brand: 'یونیتی (UNI-T)', price: 1850000, img: '/images/products/ds_30-measurement-4850058_1920.jpg' },
    { name: 'هویه برقی سرامیکی ۶۰ وات دیمردار رونیکس مدل RH-4416 با نوک نسوز', brand: 'رونیکس (Ronix)', price: 420000, img: '/images/products/close-up-circuit-reparing-tool.jpg' },
    { name: 'پایه هویه چدنی سنگین با اسفنج نسوز و گیره مونتاژ شیاسی', brand: 'رونیکس (Ronix)', price: 195000, img: '/images/products/close-up-circuit-reparing-tool.jpg' },
    { name: 'روغن لحیم ۶۰ گرمی آلمانی لوتفیت اصل ضدخوردگی', brand: 'لوتفیت (Lotfett)', price: 75000, img: '/images/products/close-up-circuit-reparing-tool.jpg' },
    { name: 'سیم لحیم ۱۰۰ گرمی آساهی ۶۳/۳۷ قلع سرب ژاپن با روغن مرکزی', brand: 'آساهی (Asahi)', price: 340000, img: '/images/products/close-up-circuit-reparing-tool.jpg' },
    { name: 'برد توسعه آردوینو Uno R3 با کابل USB و چیپ ATmega328P اورجینال', brand: 'آردوینو (Arduino)', price: 295000, img: '/images/products/maxis_pictures-the-main-processor-3334336_1920.jpg' },
    { name: 'برد توسعه وایفای و بلوتوث ESP32 مدل NodeMCU 30 پین', brand: 'اسپرسف (Espressif)', price: 245000, img: '/images/products/maxis_pictures-the-main-processor-3334336_1920.jpg' },
    { name: 'ماژول رله ۴ کاناله ۵ ولت ایزوله با اپتوکوپلر مناسب هوشمندسازی', brand: 'الکترونیک شیاسی (Shiasi)', price: 125000, img: '/images/products/maxis_pictures-the-main-processor-3334336_1920.jpg' },
    { name: 'ماژول سنسور تشخیص حرکت مادون قرمز PIR مدل HC-SR501', brand: 'الکترونیک شیاسی (Shiasi)', price: 65000, img: '/images/products/maxis_pictures-the-main-processor-3334336_1920.jpg' },
    { name: 'منبع تغذیه متغیر سوئیچینگ ۰ تا ۳۰ ولت ۵ آمپر داژنگ مدل PS-305D', brand: 'داژنگ (Dazheng)', price: 3200000, img: '/images/products/old-digital-multimeter-isolated-white-background.jpg' },
    { name: 'تستر قطعات الکترونیک دیجیتال و خازن‌سنج LCR-T4 با نمایشگر گرافیکی', brand: 'مگا ۳۲۸ (Mega328)', price: 580000, img: '/images/products/old-digital-multimeter-isolated-white-background.jpg' },
    { name: 'بردبورد بزرگ ۸۳۰ سوراخ شفاف مناسب پروژه‌های الکترونیک', brand: 'الکترونیک شیاسی (Shiasi)', price: 85000, img: '/images/products/maxis_pictures-the-main-processor-3334336_1920.jpg' },
    { name: 'کابل جامپر نری به مادگی بسته ۴۰ عددی طول ۲۰ سانتی‌متر', brand: 'الکترونیک شیاسی (Shiasi)', price: 48000, img: '/images/products/skdunning-wire-962753_1920.jpg' },
    { name: 'ماژول شارژر باتری لیتیومی TP4056 مجهز به محافظ دشارژ Type-C', brand: 'الکترونیک شیاسی (Shiasi)', price: 28000, img: '/images/products/maxis_pictures-the-main-processor-3334336_1920.jpg' },
    { name: 'ماژول رگولاتور کاهنده ولتاژ LM2596 مجهز به نمایشگر ولت‌متر', brand: 'الکترونیک شیاسی (Shiasi)', price: 95000, img: '/images/products/maxis_pictures-the-main-processor-3334336_1920.jpg' },
    { name: 'فن حلزونی توربو بلبرینگی ۱۲ ولت ضدغبار با پرتاب باد پرقدرت', brand: 'دلتا (Delta)', price: 220000, img: '/images/products/wal_172619-fans-7995865_1920.jpg' },
    { name: 'باکس قطعات پلاستیکی ۲۴ خانه‌ای تفکیک مقاومت و پیچ و مهره', brand: 'صنایع پلاستیک تهران', price: 145000, img: '/images/products/close-up-circuit-reparing-tool.jpg' },
  ];

  const categoryConfigs = [
    { slug: 'home-appliances-cooling-heating', templates: appliancesTemplates, prefix: 'APP' },
    { slug: 'wiring-building', templates: wiringTemplates, prefix: 'WIR' },
    { slug: 'lighting-fixtures', templates: lightingTemplates, prefix: 'LGT' },
    { slug: 'maker-diy-electronics', templates: electronicsTemplates, prefix: 'MDR' },
  ];

  const variations = [
    { suffix: '', priceFactor: 1, stockMod: 15, rating: 4.9 },
    { suffix: ' - مدل ارتقایافته سری پلاس (Plus Series)', priceFactor: 1.15, stockMod: 22, rating: 5.0 },
    { suffix: ' - نسخه بهینه‌شده فوق کم‌مصرف رده انرژی +A', priceFactor: 1.08, stockMod: 18, rating: 4.8 },
    { suffix: ' - بسته ویژه با گارانتی تعویض طلایی کارگاه شیاسی', priceFactor: 1.05, stockMod: 30, rating: 4.9 },
  ];

  let totalInserted = 0;

  for (const config of categoryConfigs) {
    const catId = catMap[config.slug];
    if (!catId) continue;

    console.log(`\n📦 Populating category: ${config.slug}...`);
    let catProductIndex = 0;

    for (let varIdx = 0; varIdx < variations.length; varIdx++) {
      const v = variations[varIdx];

      for (let tIdx = 0; tIdx < config.templates.length; tIdx++) {
        const t = config.templates[tIdx];
        catProductIndex++;

        const name = `${t.name}${v.suffix ? ` ${v.suffix}` : ''}`;
        const slug = `${config.prefix.toLowerCase()}-${tIdx + 1}-var-${varIdx + 1}-${Math.random().toString(36).substring(2, 7)}`;
        const sku = `${config.prefix}-${String(catProductIndex).padStart(3, '0')}`;
        const price = Math.round((t.price * v.priceFactor) / 5000) * 5000;
        const hasDiscount = (catProductIndex % 3 === 0);
        const discountPercent = hasDiscount ? (10 + (catProductIndex % 4) * 3) : 0;
        const originalPrice = hasDiscount ? Math.round((price * (1 + discountPercent / 100)) / 1000) * 1000 : null;

        const product = await prisma.product.create({
          data: {
            categoryId: catId,
            name,
            slug,
            sku,
            shortDesc: `تجهیزات استاندارد با ضمانت اصالت و سلامت فیزیکی فروشگاه شیاسی نجف‌آباد. برند معتبر ${t.brand}.`,
            description: `${name} با بهترین متریال اولیه، تست کنترل کیفیت کارگاهی و ضمانت اصالت. مناسب برای استفاده خانگی، صنعتی و ساختمانی با قیمت رقابتی و تحویل فوری در نجف‌آباد و اصفهان.`,
            price,
            originalPrice,
            discountPercent,
            stock: v.stockMod + (tIdx % 10),
            isFeatured: catProductIndex <= 4,
            isBestSeller: (catProductIndex % 5 === 0),
            isNewArrival: (catProductIndex % 4 === 0),
            isIsfahanFast: true,
            brand: t.brand,
            warranty: 'ضمانت اصالت و تست سلامت کارگاه شیاسی',
            madeIn: 'ایران',
            rating: v.rating,
            reviewCount: 5 + (catProductIndex * 2) % 40,
            images: {
              create: [
                {
                  url: t.img,
                  isPrimary: true,
                  alt: name,
                },
              ],
            },
          },
        });

        totalInserted++;
      }
    }
  }

  console.log(`\n🎉 Successfully inserted ${totalInserted} new products across all 4 categories!`);
}

main()
  .catch((e) => {
    console.error('Error seeding products:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
