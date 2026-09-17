import { NextRequest, NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/adminAuth";
import { purgeBomSubmissionsBulk, purgeBomSubmission } from "@/lib/admin-bom-guard";

export async function DELETE(req: NextRequest) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let body: any = null;
    try {
      body = await req.json();
    } catch {
      // Body not JSON or empty
    }

    if (body?.ids && Array.isArray(body.ids)) {
      const result = await purgeBomSubmissionsBulk(body.ids);
      return NextResponse.json(result);
    }

    const targetId = id || body?.id;
    if (!targetId) {
      return NextResponse.json({ message: "شناسه استعلام ارسال نشده است." }, { status: 400 });
    }

    const result = await purgeBomSubmission(targetId);
    return NextResponse.json({
      ...result,
      message: "استعلام و فایل‌های پیوست آن با موفقیت به طور قطعی حذف شدند."
    });
  } catch (error: any) {
    console.error("Error deleting BOM:", error);
    return NextResponse.json({ message: error.message || "خطا در حذف استعلام." }, { status: 500 });
  }
}
