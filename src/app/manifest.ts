import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "فروشگاه شیاسی",
    short_name: "فروشگاه شیاسی",
    description: "مرکز خرید و تعمیرات تخصصی لوازم برقی خانگی، پنکه، موتور کولر، بخاری، آنتن، سیم و کابل استاندارد مس در نجف‌آباد و اصفهان",
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
