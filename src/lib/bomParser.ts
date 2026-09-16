import * as XLSX from "xlsx";
import { prisma } from "./prisma.ts";
import { toAsciiDigits } from "./utils.ts";

export interface ParsedBomRow {
  rowNumber: number;
  rawDescription: string;
  brand?: string | null;
  technicalSpec?: string | null;
  quantity: number;
  unit: string;
  skuOrCode?: string | null;
}

export interface BomMatchResult {
  rowNumber: number;
  originalQuery: string;
  requestedQty: number;
  unit: string;
  matchedProduct: {
    id: string;
    name: string;
    slug: string;
    sku?: string | null;
    brand?: string | null;
    unitPrice: number;
    stock: number;
    image: string | null;
    hasSufficientStock: boolean;
  } | null;
  matchScore: number;
  matchConfidence: "EXACT" | "HIGH" | "MEDIUM" | "UNMATCHED";
  lineTotal: number;
}

export interface BomQuotationSummary {
  totalItemsCount: number;
  matchedItemsCount: number;
  unmatchedItemsCount: number;
  sufficientStockCount: number;
  estimatedTotalAmount: number;
  items: BomMatchResult[];
}

/**
 * Normalizes Persian and Arabic characters, removes extra symbols and half-spaces.
 */
export function normalizePersianText(text: string): string {
  if (!text) return "";
  return text
    .replace(/[ي]/g, "ی")
    .replace(/[ك]/g, "ک")
    .replace(/[ة]/g, "ه")
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1584))
    .replace(/[\u200c\u200b\u200e\u200f]/g, " ") // Replace ZWNJ with space
    .replace(/[()\[\]،:+*_-]/g, " ") // Preserve / and . for ratings and cable sizes
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Maps contractor Excel column headers to standardized BOM fields.
 */
function identifyColumns(headerRow: any[]): Record<string, number> {
  const mapping: Record<string, number> = {};

  headerRow.forEach((cellVal, idx) => {
    if (!cellVal) return;
    const str = normalizePersianText(String(cellVal));

    if (
      str.includes("شرح") ||
      str.includes("نام کالا") ||
      str.includes("تجهیزات") ||
      str.includes("عنوان") ||
      str === "item" ||
      str === "description" ||
      str === "name"
    ) {
      if (mapping.description === undefined) mapping.description = idx;
    } else if (
      str.includes("مشخصات") ||
      str.includes("فنی") ||
      str.includes("سایز") ||
      str.includes("تیپ") ||
      str === "spec" ||
      str === "specification"
    ) {
      if (mapping.spec === undefined) mapping.spec = idx;
    } else if (
      str.includes("تعداد") ||
      str.includes("مقدار") ||
      str.includes("متراژ") ||
      str === "qty" ||
      str === "quantity" ||
      str === "count"
    ) {
      if (mapping.quantity === undefined) mapping.quantity = idx;
    } else if (str.includes("واحد") || str === "unit") {
      if (mapping.unit === undefined) mapping.unit = idx;
    } else if (
      str.includes("برند") ||
      str.includes("مارک") ||
      str.includes("سازنده") ||
      str === "brand" ||
      str === "manufacturer"
    ) {
      if (mapping.brand === undefined) mapping.brand = idx;
    } else if (
      str.includes("پارت") ||
      str.includes("کد") ||
      str === "sku" ||
      str === "code" ||
      str === "mpn"
    ) {
      if (mapping.sku === undefined) mapping.sku = idx;
    } else if (str.includes("ردیف") || str.includes("شماره") || str === "row" || str === "no") {
      if (mapping.rowNo === undefined) mapping.rowNo = idx;
    }
  });

  return mapping;
}

/**
 * Extracts rows from an Excel file buffer (.xlsx, .xls, or .csv).
 */
export function parseBomWorkbook(buffer: Buffer): ParsedBomRow[] {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error("فایل اکسل ارسالی فاقد هرگونه برگه معتبر می‌باشد.");
  }

  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  if (!rawRows || rawRows.length === 0) {
    throw new Error("برگه اکسل خالی است.");
  }

  // Find header row by looking for keyword columns in the first 15 rows
  let headerIndex = -1;
  let columnMap: Record<string, number> = {};

  for (let r = 0; r < Math.min(15, rawRows.length); r++) {
    const row = rawRows[r];
    if (!row) continue;
    const nonEmpty = row.filter((c) => c !== undefined && c !== null && String(c).trim().length > 0);
    if (nonEmpty.length < 2) continue; // Skip merged title/legend banner rows

    const map = identifyColumns(row);
    if (
      map.description !== undefined &&
      (map.quantity !== undefined || map.rowNo !== undefined || map.spec !== undefined || map.brand !== undefined)
    ) {
      headerIndex = r;
      columnMap = map;
      break;
    }
  }

  // Fallback if no header row found: Column 0 is description, Column 1 is quantity
  if (headerIndex === -1) {
    headerIndex = 0;
    columnMap = { description: 0, quantity: 1 };
  }

  const parsedRows: ParsedBomRow[] = [];

  for (let r = headerIndex + 1; r < rawRows.length; r++) {
    const row = rawRows[r];
    if (!row || row.length === 0) continue;

    const descIdx = columnMap.description ?? 0;
    const rawDesc = String(row[descIdx] || "").trim();
    if (!rawDesc || rawDesc === "جمع" || rawDesc.startsWith("جمع کل")) {
      continue; // Skip blank or total footer rows
    }

    // Extract quantity
    let qty = 1;
    if (columnMap.quantity !== undefined && row[columnMap.quantity] !== undefined) {
      const parsedQtyStr = toAsciiDigits(String(row[columnMap.quantity])).replace(/[^0-9.]/g, "");
      const num = parseFloat(parsedQtyStr);
      if (!isNaN(num) && num > 0) {
        qty = Math.round(num);
      }
    }

    // Extract Unit
    const unit = columnMap.unit !== undefined ? String(row[columnMap.unit] || "").trim() : "عدد";

    // Extract Brand
    const brand = columnMap.brand !== undefined ? String(row[columnMap.brand] || "").trim() : null;

    // Extract Tech Spec
    const technicalSpec =
      columnMap.spec !== undefined ? String(row[columnMap.spec] || "").trim() : null;

    // Extract Code / SKU
    const skuOrCode =
      columnMap.sku !== undefined ? String(row[columnMap.sku] || "").trim() : null;

    parsedRows.push({
      rowNumber: parsedRows.length + 1,
      rawDescription: rawDesc,
      brand,
      technicalSpec,
      quantity: qty,
      unit: unit || "عدد",
      skuOrCode: skuOrCode || null,
    });
  }

  return parsedRows;
}

/**
 * Calculates a match score between a BOM item and a Database Product.
 */
export function scoreProductMatch(
  bomItem: ParsedBomRow,
  product: {
    id: string;
    name: string;
    slug: string;
    sku?: string | null;
    mpn?: string | null;
    brand?: string | null;
    specs?: { label: string; value: string }[];
  }
): number {
  // 1. Exact SKU / MPN Match -> 100
  if (bomItem.skuOrCode) {
    const cleanSku = bomItem.skuOrCode.trim().toLowerCase();
    if (
      (product.sku && product.sku.toLowerCase() === cleanSku) ||
      (product.mpn && product.mpn.toLowerCase() === cleanSku) ||
      product.slug.toLowerCase() === cleanSku
    ) {
      return 100;
    }
  }

  let score = 0;
  const normalizedQuery = normalizePersianText(
    `${bomItem.rawDescription} ${bomItem.technicalSpec || ""} ${bomItem.brand || ""}`
  );
  const normalizedProdName = normalizePersianText(product.name);
  const queryTokens = normalizedQuery.split(/\s+/).filter((t) => t.length > 1);

  if (queryTokens.length === 0) return 0;

  // 2. Brand Check (+25 points)
  if (product.brand) {
    const normBrand = normalizePersianText(product.brand);
    if (normalizedQuery.includes(normBrand)) {
      score += 25;
    }
  } else if (bomItem.brand) {
    const normBomBrand = normalizePersianText(bomItem.brand);
    if (normalizedProdName.includes(normBomBrand)) {
      score += 25;
    }
  }

  // 3. Extract Technical numbers & ratings (e.g. 3/4, 1/3, 16, 25, 2.5) (+35 points)
  const numberTokens = normalizedQuery.match(/\d+(\/\d+|\.\d+)?/g) || [];
  let numMatchCount = 0;
  for (const num of numberTokens) {
    if (normalizedProdName.includes(num)) {
      numMatchCount++;
    }
  }
  if (numberTokens.length > 0) {
    const numRatio = numMatchCount / numberTokens.length;
    score += Math.round(numRatio * 35);
  }

  // 4. Token Overlap Score (+40 points)
  let matchedTokens = 0;
  for (const token of queryTokens) {
    if (normalizedProdName.includes(token)) {
      matchedTokens++;
    }
  }
  const tokenRatio = matchedTokens / queryTokens.length;
  score += Math.round(tokenRatio * 40);

  return Math.min(100, score);
}

/**
 * End-to-end BOM parser & database matcher.
 * Parses the Excel file and matches every item against the live PostgreSQL catalog.
 */
export async function parseAndMatchContractorBom(buffer: Buffer): Promise<BomQuotationSummary> {
  const parsedRows = parseBomWorkbook(buffer);

  if (parsedRows.length === 0) {
    return {
      totalItemsCount: 0,
      matchedItemsCount: 0,
      unmatchedItemsCount: 0,
      sufficientStockCount: 0,
      estimatedTotalAmount: 0,
      items: [],
    };
  }

  // Fetch all active products with primary image & specs
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      sku: true,
      mpn: true,
      brand: true,
      price: true,
      stock: true,
      images: {
        where: { isPrimary: true },
        select: { url: true },
        take: 1,
      },
      specs: {
        select: { label: true, value: true },
      },
    },
  });

  const matchResults: BomMatchResult[] = [];
  let matchedCount = 0;
  let unmatchedCount = 0;
  let sufficientStockCount = 0;
  let estimatedTotal = 0;

  for (const row of parsedRows) {
    let bestProduct: (typeof products)[0] | null = null;
    let highestScore = 0;

    for (const prod of products) {
      const currentScore = scoreProductMatch(row, prod);
      if (currentScore > highestScore) {
        highestScore = currentScore;
        bestProduct = prod;
      }
    }

    // Determine confidence threshold
    let confidence: BomMatchResult["matchConfidence"] = "UNMATCHED";
    if (highestScore >= 85) {
      confidence = "EXACT";
    } else if (highestScore >= 65) {
      confidence = "HIGH";
    } else if (highestScore >= 45) {
      confidence = "MEDIUM";
    }

    if (confidence !== "UNMATCHED" && bestProduct) {
      matchedCount++;
      const hasStock = bestProduct.stock >= row.quantity;
      if (hasStock) sufficientStockCount++;

      const lineTotal = bestProduct.price * row.quantity;
      estimatedTotal += lineTotal;

      matchResults.push({
        rowNumber: row.rowNumber,
        originalQuery: `${row.rawDescription}${row.technicalSpec ? ` (${row.technicalSpec})` : ""}${
          row.brand ? ` - ${row.brand}` : ""
        }`,
        requestedQty: row.quantity,
        unit: row.unit,
        matchedProduct: {
          id: bestProduct.id,
          name: bestProduct.name,
          slug: bestProduct.slug,
          sku: bestProduct.sku,
          brand: bestProduct.brand,
          unitPrice: bestProduct.price,
          stock: bestProduct.stock,
          image: bestProduct.images[0]?.url || null,
          hasSufficientStock: hasStock,
        },
        matchScore: highestScore,
        matchConfidence: confidence,
        lineTotal,
      });
    } else {
      unmatchedCount++;
      matchResults.push({
        rowNumber: row.rowNumber,
        originalQuery: `${row.rawDescription}${row.technicalSpec ? ` (${row.technicalSpec})` : ""}`,
        requestedQty: row.quantity,
        unit: row.unit,
        matchedProduct: null,
        matchScore: highestScore,
        matchConfidence: "UNMATCHED",
        lineTotal: 0,
      });
    }
  }

  return {
    totalItemsCount: parsedRows.length,
    matchedItemsCount: matchedCount,
    unmatchedItemsCount: unmatchedCount,
    sufficientStockCount,
    estimatedTotalAmount: estimatedTotal,
    items: matchResults,
  };
}
