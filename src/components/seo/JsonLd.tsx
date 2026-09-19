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
    telephone: "03142626116",
    priceRange: "IRR",
    currenciesAccepted: "IRR",
    paymentAccepted: "Cash, Credit Card, Online Payment",
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
