import { test, describe, it } from "node:test";
import assert from "node:assert";
import * as XLSX from "xlsx";
import {
  normalizePersianText,
  parseBomWorkbook,
  scoreProductMatch,
  parseAndMatchContractorBom,
  type ParsedBomRow,
} from "../bomParser";

describe("Contractor BOM Excel Parser & Product Matcher", () => {
  it("normalizes Persian/Arabic digits, characters and spaces correctly", () => {
    const raw = "موتور کولر آبی ۳/۴ اسب\u200cبخار (موتوژن) - كابل ۱.۵";
    const normalized = normalizePersianText(raw);
    assert.ok(normalized.includes("3/4"));
    assert.ok(normalized.includes("1.5"));
    assert.ok(normalized.includes("موتوژن"));
    assert.ok(normalized.includes("کابل"));
    assert.ok(!normalized.includes("ك")); // Arabic kaf replaced
    assert.ok(!normalized.includes("۳")); // Persian digit replaced
  });

  it("parses an in-memory contractor Excel workbook with standard Iranian columns", () => {
    // Create an Excel workbook in memory
    const workbook = XLSX.utils.book_new();
    const data = [
      ["ردیف", "شرح کالا", "مشخصات فنی", "تعداد", "واحد", "برند پیشنهادی"],
      [1, "موتور کولر آبی", "۳/۴ اسب بخار دو خازنه", 5, "دستگاه", "موتوژن"],
      [2, "پمپ آب کولر آبی", "مخصوص کولرهای آبی تا ۷۰۰۰", 10, "عدد", "الکتروژن"],
      [3, "سیم افشان مسی", "سایز ۲.۵ استاندارد", 4, "حلقه", "البرز"],
      ["جمع", "جمع کل اقلام پروژه", "", 19, "", ""],
    ];
    const sheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, sheet, "صورت اقلام برقی");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    const rows = parseBomWorkbook(buffer);
    assert.strictEqual(rows.length, 3, "Should parse 3 item rows and exclude header and summary footer");

    assert.strictEqual(rows[0].quantity, 5);
    assert.strictEqual(rows[0].unit, "دستگاه");
    assert.strictEqual(rows[0].brand, "موتوژن");
    assert.ok(rows[0].rawDescription.includes("موتور کولر"));

    assert.strictEqual(rows[1].quantity, 10);
    assert.strictEqual(rows[1].brand, "الکتروژن");

    assert.strictEqual(rows[2].quantity, 4);
    assert.strictEqual(rows[2].unit, "حلقه");
  });

  it("scores exact SKU or MPN match with 100 points", () => {
    const bomRow: ParsedBomRow = {
      rowNumber: 1,
      rawDescription: "موتور کولر ۳/۴",
      quantity: 1,
      unit: "دستگاه",
      skuOrCode: "MOT-34-CU",
    };

    const product = {
      id: "prod-1",
      name: "موتور کولر ۳/۴",
      slug: "cooler-motor-3-4",
      sku: "MOT-34-CU",
      mpn: null,
      brand: "موتوژن",
    };

    const score = scoreProductMatch(bomRow, product);
    assert.strictEqual(score, 100);
  });

  it("scores technical specification and brand match accurately", () => {
    const bomRow: ParsedBomRow = {
      rowNumber: 1,
      rawDescription: "موتور کولر آبی موتوژن",
      technicalSpec: "۳/۴ اسب بخار",
      brand: "موتوژن",
      quantity: 2,
      unit: "عدد",
    };

    const matchingProduct = {
      id: "prod-match",
      name: "موتور کولر آبی موتوژن ۳/۴ اسب بخار دو خازنه اصل تبریز",
      slug: "cooler-motor-motogen-3-4",
      sku: "MOT-COOL-34",
      brand: "موتوژن",
    };

    const unrelatedProduct = {
      id: "prod-unrelated",
      name: "آنتن برقی هانی مدل بوستردار",
      slug: "hani-antenna-booster",
      sku: "HANI-ANT-01",
      brand: "هانی",
    };

    const matchScore = scoreProductMatch(bomRow, matchingProduct);
    const nonMatchScore = scoreProductMatch(bomRow, unrelatedProduct);

    assert.ok(matchScore >= 75, `Matching score should be high, got: ${matchScore}`);
    assert.ok(nonMatchScore < 20, `Unrelated score should be low, got: ${nonMatchScore}`);
  });

  it("integrates end-to-end with live Product database and computes quotation summary", async () => {
    // Generate a test Excel buffer with products known to exist in database
    const workbook = XLSX.utils.book_new();
    const data = [
      ["ردیف", "شرح کالا", "تعداد", "واحد"],
      [1, "موتور کولر موتوژن ۳/۴", 2, "دستگاه"],
      [2, "کالای کاملاً ناموجود و تخیلی برای تست اقلام نامنطبق ۹۹۹۹", 1, "عدد"],
    ];
    const sheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, sheet, "BOM");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    const result = await parseAndMatchContractorBom(buffer);

    assert.strictEqual(result.totalItemsCount, 2);
    assert.strictEqual(result.matchedItemsCount, 1);
    assert.strictEqual(result.unmatchedItemsCount, 1);

    const matchedItem = result.items.find((i) => i.matchConfidence !== "UNMATCHED");
    assert.ok(matchedItem);
    assert.ok(matchedItem?.matchedProduct);
    assert.ok(matchedItem.lineTotal > 0);
    assert.ok(result.estimatedTotalAmount > 0);
  });
});
