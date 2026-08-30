import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "فروشگاه و کارگاه تخصصی برق شیاسی نجف‌آباد",
    short_name: "برق شیاسی",
    description: "مرکز خرید و تعمیرات تخصصی انواع پنکه، موتور کولر، بخاری، آنتن، سیم و کابل استاندارد مس در نجف‌آباد و اصفهان",
    start_url: "/",
    display: "standalone",
    background_color: "#090d16",
    theme_color: "#f59e0b",
    dir: "rtl",
    lang: "fa",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
