/**
 * Static Fallback Dataset for Official Manufacturer Price Lists.
 * Guarantees zero-crash uptime (Constitution Principle II) and offline resilience.
 */

export interface CatalogItem {
  code: string;
  name: string;
  officialPrice: number;
  contractorPrice: number;
  unit: string;
}

export interface PriceList {
  id: string;
  brand: string;
  category: string;
  title: string;
  description: string;
  date: string;
  isWeeklyUpdated?: boolean;
  contractorDiscount: string;
  fileSize: string;
  badgeColor: string;
  items: CatalogItem[];
}

export const FACTORY_PRICE_LISTS: PriceList[] = [
  {
    id: "motogen-1403",
    brand: "موتوژن تبریز (Motogen)",
    category: "موتور کولر",
    title: "لیست قیمت رسمی انواع موتور کولر آبی و صنعتی موتوژن تبریز",
    description: "شامل کدهای ۱/۳، ۱/۲ و ۳/۴ اسب بخار با خازن راه‌انداز و سیم‌پیچی ۱۰۰٪ مس",
    date: "شهریور ۱۴۰۳",
    isWeeklyUpdated: false,
    contractorDiscount: "۸٪ الی ۱۲٪ تخفیف همکاری",
    fileSize: "۱.۴ مگابایت",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    items: [
      { code: "MOT-34-CRS", name: "موتور کولر آبی ۳/۴ اسب موتوژن تبریز (CRS)", officialPrice: 4850000, contractorPrice: 4365000, unit: "دستگاه" },
      { code: "MOT-12-CSIR", name: "موتور کولر آبی ۱/۲ اسب موتوژن تبریز (CSIR)", officialPrice: 4200000, contractorPrice: 3820000, unit: "دستگاه" },
      { code: "MOT-13-SPL", name: "موتور کولر آبی ۱/۳ اسب موتوژن تبریز", officialPrice: 3750000, contractorPrice: 3410000, unit: "دستگاه" },
      { code: "MOT-PUMP-01", name: "الکتروپمپ آب کولر موتوژن دوار تمام مس", officialPrice: 680000, contractorPrice: 598000, unit: "عدد" },
    ],
  },
  {
    id: "parskhazar-1403",
    brand: "پارس خزر (Pars Khazar)",
    category: "پنکه و لوازم خانگی",
    title: "کاتالوگ و لیست قیمت مصوب پنکه‌های ایستاده، رومیزی و دیواری",
    description: "قیمت‌های مصوب شرکتی مدل‌های شیبا، آدو، ریمو و اتو بخار با گارانتی ۲۴ ماهه",
    date: "مرداد ۱۴۰۳",
    isWeeklyUpdated: false,
    contractorDiscount: "۵٪ الی ۹٪ تخفیف نقدی",
    fileSize: "۲.۸ مگابایت",
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
    items: [
      { code: "PK-FAN-SHIBA", name: "پنکه ایستاده پارس خزر مدل شیبا با ریموت کنترل", officialPrice: 3450000, contractorPrice: 3174000, unit: "دستگاه" },
      { code: "PK-FAN-ADO", name: "پنکه رومیزی ۴ پره پارس خزر مدل آدو", officialPrice: 2280000, contractorPrice: 2097000, unit: "دستگاه" },
      { code: "PK-FAN-RIMO", name: "پنکه دیواری صنعتی پارس خزر مدل ریمو تایمردار", officialPrice: 3100000, contractorPrice: 2852000, unit: "دستگاه" },
      { code: "PK-BLADE-5B", name: "پره یدکی ۵ شاخه پنکه پارس خزر شفاف نشکن", officialPrice: 195000, contractorPrice: 175000, unit: "عدد" },
    ],
  },
  {
    id: "alborz-wire-1403",
    brand: "البرز الکتریک نور (Alborz)",
    category: "سیم و کابل",
    title: "لیست قیمت رسمی سیم‌های افشان ساختمانی و کابل‌های مفتولی",
    description: "سایزهای ۱.۵، ۲.۵، ۴، ۶ و ۱۰ میلیمتر تمام مس آنیل شده کلاف ۱۰۰ متری",
    date: "شهریور ۱۴۰۳",
    isWeeklyUpdated: true,
    contractorDiscount: "تخفیف نقدی پای فاکتور بر اساس متراژ",
    fileSize: "۹۵۰ کیلوبایت",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    items: [
      { code: "ALB-WIRE-15", name: "سیم افشان ۱.۵ تمام مس البرز الکتریک نور (کلاف ۱۰۰متر)", officialPrice: 1250000, contractorPrice: 1087000, unit: "کلاف" },
      { code: "ALB-WIRE-25", name: "سیم افشان ۲.۵ تمام مس البرز الکتریک نور (کلاف ۱۰۰متر)", officialPrice: 1980000, contractorPrice: 1722000, unit: "کلاف" },
      { code: "ALB-WIRE-40", name: "سیم افشان ۴ تمام مس البرز الکتریک نور", officialPrice: 3150000, contractorPrice: 2740000, unit: "کلاف" },
      { code: "ALB-CAB-2X15", name: "کابل افشان ۲ در ۱.۵ مس استاندارد البرز", officialPrice: 2850000, contractorPrice: 2479000, unit: "کلاف" },
    ],
  },
  {
    id: "shahcheragh-1403",
    brand: "صنایع روشنایی شاهچراغ",
    category: "روشنایی",
    title: "لیست قیمت انواع پنل‌های سنسوردار هوشمند، پروژکتور و SMD",
    description: "مدل‌های روکار و توکار روژان، پرتو و پروژکتورهای خورشیدی با ضمانت تعویض",
    date: "مرداد ۱۴۰۳",
    isWeeklyUpdated: false,
    contractorDiscount: "۱۵٪ تخفیف تابلوساز و پیمانکار",
    fileSize: "۳.۲ مگابایت",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    items: [
      { code: "SHC-PNL-6060", name: "پنل سقفی ۶۰ در ۶۰ شاهچراغ ۶۰ وات توکار SMD", officialPrice: 790000, contractorPrice: 671500, unit: "عدد" },
      { code: "SHC-PRJ-100", name: "پروژکتور ۱۰۰ وات ال‌ای‌دی ضدآب شاهچراغ (IP66)", officialPrice: 1150000, contractorPrice: 977500, unit: "عدد" },
      { code: "SHC-SNS-RAD", name: "چراغ سنسوردار سقفی هوشمند راداری شاهچراغ", officialPrice: 340000, contractorPrice: 289000, unit: "عدد" },
    ],
  },
  {
    id: "afratab-1403",
    brand: "صنایع روشنایی افراتاب (Afratab)",
    category: "روشنایی",
    title: "لیست قیمت انواع لامپ‌های حبابی، استوانه‌ای و هالوژنی افراتاب",
    description: "شامل توان‌های ۹ تا ۸۰ وات E27 و E40 با هیت‌سینک آلومینیومی و ۱۸ ماه گارانتی",
    date: "شهریور ۱۴۰۳",
    isWeeklyUpdated: false,
    contractorDiscount: "۱۲٪ تخفیف کارتنی و خرید عمده",
    fileSize: "۱.۱ مگابایت",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
    items: [
      { code: "AFR-LED-20W", name: "لامپ ال‌ای‌دی ۲۰ وات حبابی افراتاب پایه E27", officialPrice: 145000, contractorPrice: 127600, unit: "عدد" },
      { code: "AFR-LED-50W", name: "لامپ ال‌ای‌دی ۵۰ وات استوانه‌ای سالنی افراتاب", officialPrice: 395000, contractorPrice: 347600, unit: "عدد" },
      { code: "AFR-HLG-7W", name: "لامپ هالوژنی ۷ وات SMD افراتاب پایه سوزنی", officialPrice: 58000, contractorPrice: 51000, unit: "عدد" },
    ],
  },
  {
    id: "hani-antenna-1403",
    brand: "آنتن هانی (Hani)",
    category: "آنتن و تصویر",
    title: "لیست قیمت رسمی آنتن‌های هوایی چرخشی، برقی و کابل‌های کواکسیال هانی",
    description: "به همراه راهنمای تنظیم گیرندگی و مشخصات تقویت‌کننده‌های نویز پایین (LNA)",
    date: "تیر ۱۴۰۳",
    isWeeklyUpdated: false,
    contractorDiscount: "۱۰٪ تخفیف الکتریکی و همکار",
    fileSize: "۱.۸ مگابایت",
    badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
    items: [
      { code: "HNI-ANT-2020", name: "آنتن برقی گردان هانی مدل 2020 همراه با بوستر تقویت‌کننده", officialPrice: 650000, contractorPrice: 585000, unit: "دستگاه" },
      { code: "HNI-ANT-4K", name: "آنتن دیجیتال هوایی ثابت هانی مناسب گیرنده 4K", officialPrice: 420000, contractorPrice: 378000, unit: "دستگاه" },
      { code: "HNI-CAB-RG6", name: "کابل کواکسیال صادراتی RG6 تمام مس هانی (حلقه ۱۰۰متری)", officialPrice: 1350000, contractorPrice: 1215000, unit: "حلقه" },
    ],
  },
];
