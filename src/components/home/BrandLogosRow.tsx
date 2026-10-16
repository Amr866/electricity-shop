"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Award } from "lucide-react";

interface BrandItem {
  name: string;
  slug: string;
  logoUrl: string;
}

const OFFICIAL_BRANDS: BrandItem[] = [
  // روشنایی و نورپردازی
  { name: "صنایع روشنایی گلنور", slug: "golnoor", logoUrl: "/images/brands/golnoor.svg" },
  { name: "شیوا امواج اصفهان", slug: "shiva-amvaj", logoUrl: "/images/brands/shivaamvaj.svg" },
  { name: "موتوژن تبریز", slug: "motogen", logoUrl: "/images/brands/motogen.svg" },
  { name: "صنایع مازی‌نور", slug: "mazinoor", logoUrl: "/images/brands/mazinoor.svg" },
  { name: "صنایع روشنایی افراتاب", slug: "afratab", logoUrl: "/images/brands/afratab.svg" },
  { name: "لگراند (Legrand)", slug: "legrand", logoUrl: "/images/brands/legrand.svg" },
  { name: "پارس شعاع توس", slug: "pars-shoa", logoUrl: "/images/brands/pars-shoa.png" },
  { name: "لامپ پارس شهاب", slug: "pars-shahab", logoUrl: "/images/brands/pars-shahab.png" },
  { name: "نمانور آسیا", slug: "namanoor", logoUrl: "/images/brands/namanoor.png" },
  { name: "صبا ترانس", slug: "saba-trans", logoUrl: "/images/brands/saba-trans.png" },

  // سیم و کابل ساختمانی و صنعتی
  { name: "خراسان افشارنژاد", slug: "khorasan-cable", logoUrl: "/images/brands/khorasan-cable.png" },
  { name: "سیم و کابل اصفهان", slug: "isfahan-cable", logoUrl: "/images/brands/isfahan-cable.png" },
  { name: "صنایع کابل همدان", slug: "hamedan-cable", logoUrl: "/images/brands/hamedan-cable.png" },
  { name: "البرز الکتریک نور (لینکو)", slug: "alborz", logoUrl: "/images/brands/alborz-electric.png" },
  { name: "صنایع کابل کمان", slug: "kaman-cable", logoUrl: "/images/brands/kaman-cable.png" },
  { name: "سیلیکون کابل یاقوت البرز", slug: "yaghout-cable", logoUrl: "/images/brands/yaghout-cable.png" },
  { name: "سیم و کابل سیمیا", slug: "simia", logoUrl: "/images/brands/simia.png" },

  // کلید، پریز و رابط‌های الکتریکی
  { name: "دلند الکتریک", slug: "deland", logoUrl: "/images/brands/deland.png" },
  { name: "پارت الکتریک", slug: "part-electric", logoUrl: "/images/brands/partelectric.png" },
  { name: "ایران الکتریک", slug: "iran-electric", logoUrl: "/images/brands/iran-electric.png" },
  { name: "خیام الکتریک", slug: "khayam-electric", logoUrl: "/images/brands/khayam-electric.png" },
  { name: "ویرا الکتریک", slug: "viera-electric", logoUrl: "/images/brands/viera-electric.png" },

  // الکتروموتور، تهویه و سرمایش
  { name: "شرکت دمنده", slug: "damandeh", logoUrl: "/images/brands/damandeh.png" },
  { name: "شرکت الکتروژن", slug: "electrogen", logoUrl: "/images/brands/electrogen.png" },
  { name: "پارس خزر", slug: "pars-khazar", logoUrl: "/images/brands/pars-khazar.png" },

  // آیفون، آنتن و سیستم‌های صوتی/تصویری
  { name: "تابا الکترونیک", slug: "taba", logoUrl: "/images/brands/taba.png" },
  { name: "الکتروپیک", slug: "electropeyk", logoUrl: "/images/brands/electropeyk.png" },
  { name: "صنایع الکترونیک سیماران", slug: "simaran", logoUrl: "/images/brands/simaran.png" },
  { name: "آنتن هانی", slug: "hani", logoUrl: "/images/brands/hani.png" },

  // برق صنعتی، حرارتی و حفاظتی
  { name: "صنایع اخوان", slug: "akhavan", logoUrl: "/images/brands/akhavan.png" },
  { name: "پارس فانال", slug: "pars-fanal", logoUrl: "/images/brands/pars-fanal.png" },
  { name: "میکرومکس الکترونیک", slug: "micromax", logoUrl: "/images/brands/micromax.png" },
];

export function BrandLogosRow() {
  // Duplicate array for smooth infinite marquee looping
  const marqueeBrands = [...OFFICIAL_BRANDS, ...OFFICIAL_BRANDS];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs dark:shadow-xl space-y-4 relative overflow-hidden transition-colors duration-200">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          <span>عاملیت رسمی و برندهای همکار کارگاه شیاسی</span>
        </h3>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>تضمین ۱۰۰٪ اصالت کالا و گارانتی معتبر</span>
        </div>
      </div>

      {/* Infinite Auto-scrolling Marquee Container with Edge Fades */}
      <div className="relative w-full overflow-hidden py-3">
        
        {/* Right and Left Edge Gradient Masks for Smooth In/Out Fading */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />

        {/* 60fps Scrolling Track with Pure Floating Logos */}
        <div 
          className="animate-marquee-rtl flex items-center gap-8 sm:gap-12 select-none cursor-pointer hover:[animation-play-state:paused]"
          style={{ animationDuration: "90s" }}
        >
          {marqueeBrands.map((b, idx) => (
            <Link
              key={`${b.slug}-${idx}`}
              href={`/products?brand=${encodeURIComponent(b.slug)}`}
              title={b.name}
              className="group shrink-0 flex items-center justify-center p-2 transition-transform duration-300 hover:scale-110 focus:outline-hidden"
            >
              <div className="relative h-10 sm:h-12 w-28 sm:w-36 flex items-center justify-center">
                <Image
                  src={b.logoUrl}
                  alt={b.name}
                  width={140}
                  height={56}
                  className="max-h-full max-w-full w-auto h-auto object-contain transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:brightness-105 dark:brightness-110 drop-shadow-2xs"
                  unoptimized={b.logoUrl.endsWith(".svg")}
                />
              </div>
            </Link>
          ))}
        </div>

      </div>

    </div>
  );
}
