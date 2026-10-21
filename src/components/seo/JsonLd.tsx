import React from "react";

export interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Builds Schema.org ElectronicsStore & LocalBusiness structured data with verified Najafabad NAP.
 */
export function buildElectronicsStoreSchema(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    "@id": `${baseUrl}/#store`,
    name: "فروشگاه و کارگاه تخصصی برق شیاسی",
    alternateName: "کالای برق و خدمات فنی شیاسی نجف‌آباد",
    description:
      "مرکز پخش، خرید آنلاین و کارگاه تعمیرات تخصصی انواع پنکه، موتور کولر آبی موتوژن، سیم و کابل استاندارد مس، روشنایی و اتوماسیون صنعتی در نجف‌آباد و اصفهان.",
    url: baseUrl,
    inLanguage: "fa-IR",
    telephone: "03142626116",
    priceRange: "IRR",
    currenciesAccepted: "IRR",
    paymentAccepted: "Cash, Credit Card, Online Payment",
    sameAs: [
      "https://t.me/shiasi_electric",
      "https://eitaa.com/shiasi_electric",
    ],
    knowsAbout: [
      "الکتروموتور کولر آبی موتوژن و الکتروژن",
      "سیم و کابل تمام مس استاندارد",
      "تعمیرات تخصصی و سیم‌پیچی موتور کولر و پنکه",
      "کلید و پریز و روشنایی ساختمانی",
      "محاسبه کابل برق ساختمانی و افت ولتاژ"
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "کاتالوگ جامع ملزومات برق و الکتروموتور شیاسی",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "الکتروموتور، پمپ آب و پنکه سرمایشی",
        },
        {
          "@type": "OfferCatalog",
          name: "سیم و کابل ساختمانی تمام مس",
        },
        {
          "@type": "OfferCatalog",
          name: "کلید، پریز و اتصالات برقی",
        },
        {
          "@type": "OfferCatalog",
          name: "روشنایی، پروژکتور و لامپ‌های ال‌ای‌دی",
        },
      ],
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "03142626116",
      contactType: "customer service",
      areaServed: "IR",
      availableLanguage: "Persian",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "خیابان ۱۵ خرداد مرکزی، نبش بن‌بست نرگس",
      addressLocality: "نجف‌آباد",
      addressRegion: "اصفهان",
      postalCode: "8514612345",
      addressCountry: "IR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 32.6365457,
      longitude: 51.3551911,
    },
    hasMap: "https://maps.google.com/?q=32.6365457,51.3551911",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Saturday",
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
        ],
        opens: "08:30",
        closes: "20:30",
      },
    ],
    areaServed: [
      {
        "@type": "City",
        name: "نجف‌آباد",
      },
      {
        "@type": "City",
        name: "اصفهان",
      },
    ],
  };
}

/**
 * Builds Schema.org WebSite structured data with SearchAction for Google Sitelinks Search Box.
 */
export function buildWebSiteSchema(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: "فروشگاه و کارگاه شیاسی نجف‌آباد",
    alternateName: "فروشگاه اینترنتی کالای برق شیاسی",
    url: baseUrl,
    inLanguage: "fa-IR",
    description: "مرکز خرید آنلاین لوازم برقی و کارگاه تخصصی تعمیرات الکتروموتور، پنکه و بخاری در نجف‌آباد و اصفهان.",
    publisher: {
      "@id": `${baseUrl}/#store`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Builds Schema.org Organization structured data.
 */
export function buildOrganizationSchema(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "فروشگاه و کارگاه برق شیاسی",
    alternateName: "الکتریک شیاسی نجف‌آباد",
    url: baseUrl,
    logo: `${baseUrl}/favicon.svg`,
    inLanguage: "fa-IR",
    telephone: "03142626116",
    sameAs: [
      "https://t.me/shiasi_electric",
      "https://eitaa.com/shiasi_electric",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "خیابان ۱۵ خرداد مرکزی، نبش بن‌بست نرگس",
      addressLocality: "نجف‌آباد",
      addressRegion: "اصفهان",
      postalCode: "8514612345",
      addressCountry: "IR",
    },
    knowsAbout: [
      "الکتروموتور کولر آبی موتوژن و الکتروژن",
      "سیم و کابل تمام مس استاندارد",
      "تعمیرات تخصصی و سیم‌پیچی موتور کولر و پنکه",
      "کلید و پریز و روشنایی ساختمانی",
      "سیستم‌های اتوماسیون و برق صنعتی",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "03142626116",
      contactType: "customer service",
      areaServed: "IR",
      availableLanguage: "Persian",
    },
  };
}

/**
 * Builds Schema.org FAQPage structured data for Google search rich snippets.
 */
export function buildFaqPageSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Builds Schema.org BreadcrumbList structured data.
 */
export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
