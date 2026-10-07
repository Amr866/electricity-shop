import React from "react";
import type { ProductDetailData, ProductSpecItem, TerminalPin } from "./productDetailHelpers";

interface ProductPrintDatasheetProps {
  product: ProductDetailData;
  selectedImage: string;
  effectiveUnitPrice: number;
  technicalSpecs: ProductSpecItem[];
  wiringSchematic: {
    title: string;
    diagramSubtitle: string;
    terminals: TerminalPin[];
  };
}

export function ProductPrintDatasheet({
  product,
  selectedImage,
  effectiveUnitPrice,
  technicalSpecs,
  wiringSchematic,
}: ProductPrintDatasheetProps) {
  return (
    <div className="hidden print:block bg-white text-black p-8 font-sans space-y-6" dir="rtl">
      {/* Printable Header */}
      <div className="border-b-2 border-black pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black">فروشگاه و مرکز خدمات فنی مهندسی شیاسی نجف‌آباد</h1>
          <p className="text-xs text-gray-700 mt-1">
            شناسنامه فنی و برگه مشخصات مهندسی کالا (Datasheet) • تاسیس ۱۳۷۸
          </p>
        </div>
        <div className="text-left text-xs font-mono">
          <div>تاریخ صدور: {new Date().toLocaleDateString("fa-IR")}</div>
          <div>تلفن کارگاه: <bdi dir="ltr">۰۳۱-۴۲۶۲۶۱۱۶</bdi></div>
          <div>همراه فنی: <bdi dir="ltr">۰۹۱۳-۶۲۶-۰۰۷۲</bdi></div>
        </div>
      </div>

      {/* Product Identity */}
      <div className="grid grid-cols-3 gap-6 items-center border border-gray-300 rounded-xl p-4">
        <div className="col-span-2 space-y-2">
          <h2 className="text-base font-black">{product.name}</h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><strong>کد شناسایی (SKU):</strong> {product.sku || product.id}</div>
            <div><strong>برند سازنده:</strong> {product.brand || "فروشگاه شیاسی"}</div>
            <div><strong>دسته‌بندی:</strong> {product.category?.name}</div>
            <div><strong>کشور سازنده:</strong> {product.madeIn || "ایران"}</div>
            <div><strong>وضعیت گارانتی:</strong> {product.warranty || "اصالت و سلامت فیزیکی"}</div>
            <div><strong>قیمت رسمی:</strong> {effectiveUnitPrice.toLocaleString("fa-IR")} تومان</div>
          </div>
        </div>
        <div className="col-span-1 text-center">
          <div className="w-28 h-28 mx-auto relative border border-gray-200 rounded-lg p-2">
            <img src={selectedImage} alt={product.name} className="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      {/* Technical Specs Table */}
      <div className="space-y-2">
        <h3 className="text-sm font-black border-b border-gray-400 pb-1">جدول مشخصات و استانداردهای فنی</h3>
        <table className="w-full text-xs border-collapse border border-gray-300">
          <tbody>
            {technicalSpecs.map((s, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="border border-gray-300 p-2 font-bold w-1/3">{s.label || s.key}</td>
                <td className="border border-gray-300 p-2">{s.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Wiring Diagram Pins */}
      <div className="space-y-2">
        <h3 className="text-sm font-black border-b border-gray-400 pb-1">{wiringSchematic.title}</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {wiringSchematic.terminals.map((t, idx) => (
            <div key={idx} className="border border-gray-300 p-2 rounded">
              <strong>{t.colorName} ({t.label}):</strong> {t.functionDesc}
            </div>
          ))}
        </div>
      </div>

      {/* Workshop Seal & Address */}
      <div className="border-t border-gray-300 pt-4 flex items-center justify-between text-xs text-gray-600">
        <div>آدرس: اصفهان، نجف‌آباد، ۱۵ خرداد مرکزی، نبش بن‌بست نرگس (فروشگاه شیاسی)</div>
        <div className="font-bold">مهر و تاییدیه اصالت کارگاه فنی شیاسی</div>
      </div>
    </div>
  );
}
