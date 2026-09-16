"""
Contractor BOM Excel Parser CLI tool.
Uses openpyxl to extract item rows from contractor Excel spreadsheets,
normalizes Persian text, and queries/matches products against the database.
"""

import sys
import os
import json
import re
from openpyxl import load_workbook

def normalize_persian(text):
    if not text:
        return ""
    text = str(text)
    text = text.replace("ي", "ی").replace("ك", "ک").replace("ة", "ه")
    persian_digits = "۰۱۲۳۴۵۶۷۸۹"
    arabic_digits = "٠١٢٣٤٥٦٧٨٩"
    for i, d in enumerate(persian_digits):
        text = text.replace(d, str(i))
    for i, d in enumerate(arabic_digits):
        text = text.replace(d, str(i))
    # Replace symbols but preserve / and .
    text = re.sub(r"[()\[\]،:+*_\-]", " ", text)
    text = re.sub(r"\s+", " ", text).strip().lower()
    return text

def parse_contractor_bom_file(filepath):
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File not found: {filepath}")

    wb = load_workbook(filepath, data_only=True)
    sheet = wb.active

    rows = list(sheet.iter_rows(values_only=True))
    if not rows:
        return []

    # Find header row
    header_idx = -1
    col_map = {}

    for r_idx, row in enumerate(rows[:15]):
        row_cells = [str(c).strip() for c in row if c is not None and str(c).strip()]
        if len(row_cells) < 3:
            continue
        
        has_desc = any("شرح" in normalize_persian(c) or "نام" in normalize_persian(c) for c in row_cells)
        has_qty = any("تعداد" in normalize_persian(c) or "مقدار" in normalize_persian(c) or "متراژ" in normalize_persian(c) for c in row_cells)
        
        if has_desc and has_qty:
            header_idx = r_idx
            for c_idx, cell in enumerate(row):
                if cell is None: continue
                norm_c = normalize_persian(cell)
                if ("شرح" in norm_c or "نام کالا" in norm_c or "تجهیزات" in norm_c) and "description" not in col_map:
                    col_map["description"] = c_idx
                elif ("مشخصات" in norm_c or "فنی" in norm_c or "تیپ" in norm_c or "سایز" in norm_c) and "spec" not in col_map:
                    col_map["spec"] = c_idx
                elif ("تعداد" in norm_c or "مقدار" in norm_c or "متراژ" in norm_c) and "qty" not in col_map:
                    col_map["qty"] = c_idx
                elif "واحد" in norm_c and "unit" not in col_map:
                    col_map["unit"] = c_idx
                elif ("برند" in norm_c or "مارک" in norm_c or "سازنده" in norm_c) and "brand" not in col_map:
                    col_map["brand"] = c_idx
                elif ("کد" in norm_c or "پارت" in norm_c or "sku" in norm_c) and "sku" not in col_map:
                    col_map["sku"] = c_idx
            break

    if header_idx == -1:
        col_map = {"description": 0, "qty": 1}
        header_idx = 0

    parsed_items = []
    desc_col = col_map.get("description", 0)
    qty_col = col_map.get("qty", 1)
    spec_col = col_map.get("spec")
    brand_col = col_map.get("brand")
    unit_col = col_map.get("unit")

    for row in rows[header_idx + 1:]:
        if not row or desc_col >= len(row) or not row[desc_col]:
            continue
        raw_desc = str(row[desc_col]).strip()
        if not raw_desc or raw_desc.startswith("جمع"):
            continue

        raw_qty = row[qty_col] if qty_col < len(row) else 1
        try:
            clean_qty_str = re.sub(r"[^0-9.]", "", normalize_persian(raw_qty))
            qty = int(float(clean_qty_str)) if clean_qty_str else 1
        except (ValueError, TypeError):
            qty = 1

        parsed_items.append({
            "description": raw_desc,
            "spec": str(row[spec_col]).strip() if spec_col and spec_col < len(row) and row[spec_col] else "",
            "brand": str(row[brand_col]).strip() if brand_col and brand_col < len(row) and row[brand_col] else "",
            "unit": str(row[unit_col]).strip() if unit_col and unit_col < len(row) and row[unit_col] else "عدد",
            "quantity": qty,
        })

    return parsed_items

if __name__ == "__main__":
    if len(sys.argv) < 2:
        test_file = os.path.join(os.path.dirname(__file__), "..", "public", "templates", "sample-contractor-bom.xlsx")
    else:
        test_file = sys.argv[1]

    print(f"Parsing contractor BOM file: {test_file}")
    items = parse_contractor_bom_file(test_file)
    print(f"Parsed {len(items)} contractor items successfully:")
    print(json.dumps(items, ensure_ascii=False, indent=2))
