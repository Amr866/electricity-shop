import { NextRequest, NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/adminAuth";
import { purgeBomSubmission } from "@/lib/admin-bom-guard";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ message: "شناسه استعلام ارسال نشده است." }, { status: 400 });
    }

    const result = await purgeBomSubmission(id);
    return NextResponse.json({
      ...result,
      message: "استعلام و فایل‌های پیوست آن با موفقیت به طور قطعی حذف شدند."
    });
  } catch (error: any) {
    console.error("Error purging BOM by id:", error);
    return NextResponse.json({ message: error.message || "خطا در حذف استعلام." }, { status: 500 });
  }
}
