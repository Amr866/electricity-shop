"""
Generates an official Contractor BOM Excel template adhering to the xlsx skill guidelines.
Features:
- Professional Arial typography
- Formal Iranian electrical contractor column layout
- Dynamic formulas for row count and totals
- User guidance legend and styling
"""

import os
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def generate_contractor_bom_template():
    output_dir = os.path.join(os.path.dirname(__file__), "..", "public", "templates")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "sample-contractor-bom.xlsx")

    wb = Workbook()
    ws = wb.active
    ws.title = "صورت متره و برآورد تجهیزات"
    ws.views.sheetView[0].rightToLeft = True

    # Styling Palette
    font_title = Font(name="Arial", size=14, bold=True, color="1E293B")
    font_subtitle = Font(name="Arial", size=10, italic=True, color="64748B")
    font_header = Font(name="Arial", size=10, bold=True, color="0F172A")
    font_body = Font(name="Arial", size=10, color="0000FF") # Blue for user inputs per skill
    font_formula = Font(name="Arial", size=10, bold=True, color="000000")
    font_legend = Font(name="Arial", size=9, bold=True, color="92400E")

    header_fill = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid")
    legend_fill = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")
    total_fill = PatternFill(start_color="E2E8F0", end_color="E2E8F0", fill_type="solid")

    thin_border = Border(
        left=Side(style='thin', color='CBD5E1'),
        right=Side(style='thin', color='CBD5E1'),
        top=Side(style='thin', color='CBD5E1'),
        bottom=Side(style='thin', color='CBD5E1')
    )

    align_center = Alignment(horizontal="center", vertical="center")
    align_right = Alignment(horizontal="right", vertical="center")

    # 1. Title Block
    ws.merge_cells("A1:F1")
    ws["A1"] = "فروشگاه تخصصی لوازم برقی و کارگاه شیاسی (نجف‌آباد)"
    ws["A1"].font = font_title
    ws["A1"].alignment = align_center

    ws.merge_cells("A2:F2")
    ws["A2"] = "فرم استاندارد استعلام قیمت و متره اقلام پروژه (BOM)"
    ws["A2"].font = font_subtitle
    ws["A2"].alignment = align_center

    # 2. Legend / Guidance Box (Row 4)
    ws.merge_cells("A4:F4")
    ws["A4"] = "راهنما: سلول‌های دارای فونت آبی رنگ ورودی‌های شما هستند. لطفاً شرح کالا و تعداد مورد نیاز را در جدول زیر وارد فرمایید."
    ws["A4"].font = font_legend
    ws["A4"].fill = legend_fill
    ws["A4"].alignment = align_right

    # 3. Table Headers (Row 6)
    headers = [
        ("A6", "ردیف"),
        ("B6", "شرح کالا / تجهیزات برقی"),
        ("C6", "مشخصات فنی و تیپ"),
        ("D6", "تعداد / متراژ"),
        ("E6", "واحد"),
        ("F6", "برند یا سازنده مدنظر"),
    ]

    for cell_id, text in headers:
        cell = ws[cell_id]
        cell.value = text
        cell.font = font_header
        cell.fill = header_fill
        cell.alignment = align_center
        cell.border = thin_border

    # 4. Realistic Sample Rows (Rows 7 to 11)
    sample_data = [
        (1, "موتور کولر آبی", "۳/۴ اسب بخار دو خازنه مسی", 2, "دستگاه", "موتوژن"),
        (2, "پمپ آب کولر آبی", "مخصوص کولر تا ۷۰۰۰", 5, "عدد", "الکتروژن"),
        (3, "سیم افشان مسی", "سایز ۲.۵ استاندارد ساختمانی", 4, "حلقه", "البرز"),
        (4, "کابل برق افشان", "سایز ۲ در ۱.۵ تمام مس", 3, "کلاف ۱۰۰ متری", "خراسان"),
        (5, "کلید مینیاتوری", "۱۶ آمپر تک پل تیپ C", 12, "عدد", "هیوندای"),
    ]

    for idx, row in enumerate(sample_data, start=7):
        ws[f"A{idx}"] = row[0]
        ws[f"A{idx}"].alignment = align_center
        ws[f"A{idx}"].border = thin_border
        ws[f"A{idx}"].font = font_formula

        ws[f"B{idx}"] = row[1]
        ws[f"B{idx}"].alignment = align_right
        ws[f"B{idx}"].border = thin_border
        ws[f"B{idx}"].font = font_body

        ws[f"C{idx}"] = row[2]
        ws[f"C{idx}"].alignment = align_right
        ws[f"C{idx}"].border = thin_border
        ws[f"C{idx}"].font = font_body

        ws[f"D{idx}"] = row[3]
        ws[f"D{idx}"].alignment = align_center
        ws[f"D{idx}"].border = thin_border
        ws[f"D{idx}"].font = font_body

        ws[f"E{idx}"] = row[4]
        ws[f"E{idx}"].alignment = align_center
        ws[f"E{idx}"].border = thin_border
        ws[f"E{idx}"].font = font_body

        ws[f"F{idx}"] = row[5]
        ws[f"F{idx}"].alignment = align_center
        ws[f"F{idx}"].border = thin_border
        ws[f"F{idx}"].font = font_body

    # 5. Summary / Formula Row (Row 12)
    ws.merge_cells("A12:C12")
    ws["A12"] = "مجموع تعداد کل اقلام اقلام درخواستی:"
    ws["A12"].font = font_formula
    ws["A12"].fill = total_fill
    ws["A12"].alignment = align_right
    ws["A12"].border = thin_border
    ws["B12"].border = thin_border
    ws["C12"].border = thin_border

    ws["D12"] = "=SUM(D7:D11)"
    ws["D12"].font = font_formula
    ws["D12"].fill = total_fill
    ws["D12"].alignment = align_center
    ws["D12"].border = thin_border

    ws.merge_cells("E12:F12")
    ws["E12"] = "واحد مرکب"
    ws["E12"].font = font_formula
    ws["E12"].fill = total_fill
    ws["E12"].alignment = align_center
    ws["E12"].border = thin_border
    ws["F12"].border = thin_border

    # Set column widths
    column_widths = {
        "A": 8,
        "B": 32,
        "C": 30,
        "D": 16,
        "E": 15,
        "F": 22,
    }
    for col, width in column_widths.items():
        ws.column_dimensions[col].width = width

    wb.save(output_path)
    print(f"Successfully generated contractor BOM template at: {output_path}")

if __name__ == "__main__":
    generate_contractor_bom_template()
