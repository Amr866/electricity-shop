/**
 * Zero-Crash Static Fallback Dataset: Repair Service & Technical Workshop
 * In compliance with Constitution Principle II (Zero-Crash Fallback Architecture & Resilient Uptime).
 * Provides static appliance repair definitions, service guarantees, and workshop telemetry.
 */

export interface ApplianceCategoryFallback {
  id: string;
  name: string;
  icon: string;
  description: string;
  typicalTurnaroundHours: number;
  warrantyMonths: number;
}

export const APPLIANCE_FALLBACK_CATEGORIES: ApplianceCategoryFallback[] = [
  {
    id: "cooler-motor",
    name: "موتور کولر آبی و الکتروموتورهای تک‌فاز",
    icon: "Fan",
    description: "سیم‌پیچی فابریک با مس خالص، تعویض بوش، پلاتین و بلبرینگ موتوژن و الکتروژن",
    typicalTurnaroundHours: 24,
    warrantyMonths: 6,
  },
  {
    id: "water-pump",
    name: "پمپ آب خانگی و شناور",
    icon: "Activity",
    description: "سیم‌پیچی، تعویض سیل مکانیکی و پروانه انواع پمپ‌های بشقابی و جتی",
    typicalTurnaroundHours: 48,
    warrantyMonths: 6,
  },
  {
    id: "fan",
    name: "پنکه و هواکش صنعتی",
    icon: "Wind",
    description: "سرویس دوره‌ای، رفع جامپ بوش، تعویض خازن راه‌انداز و کلید دور",
    typicalTurnaroundHours: 24,
    warrantyMonths: 3,
  },
  {
    id: "heater",
    name: "بخاری برقی و هیتر تابشی",
    icon: "Flame",
    description: "تعویض المنت شیشه‌ای و سرامیکی، عایق‌کاری نسوز و کلید قطع اضطراری",
    typicalTurnaroundHours: 12,
    warrantyMonths: 3,
  },
  {
    id: "antenna",
    name: "آنتن و گیرنده دیجیتال",
    icon: "Tv",
    description: "تعمیر منبع تغذیه، تقویت‌کننده سیگنال بوستر و فیش‌های ضد نویز",
    typicalTurnaroundHours: 24,
    warrantyMonths: 6,
  },
  {
    id: "electronic-board",
    name: "برد الکترونیکی و اینورتر",
    icon: "Cpu",
    description: "عیب‌یابی مدار فرمان، تعویض ترایاک، رله و خازن‌های صافی تغذیه",
    typicalTurnaroundHours: 72,
    warrantyMonths: 3,
  },
];

export const WORKSHOP_TELEMETRY_FALLBACK = {
  commercialName: "کارگاه خدمات فنی و سیم‌پیچی شیاسی",
  address: "اصفهان، نجف‌آباد، خیابان ۱۵ خرداد مرکزی، نبش بن‌بست نرگس",
  coordinates: {
    lat: 32.6365457,
    lng: 51.3551911,
  },
  landlines: ["03142626116", "03142626107"],
  mobileWhatsApp: "09136260072",
  schedule: {
    weekdays: "شنبه تا چهارشنبه: ۰۸:۳۰ الی ۱۳:۰۰ و ۱۶:۳۰ الی ۲۱:۰۰",
    thursday: "پنجشنبه‌ها: ۰۸:۳۰ الی ۱۳:۰۰",
    friday: "جمعه‌ها تعطیل",
  },
};
