import { NextRequest, NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/adminAuth";
import { toggleArchiveRepair } from "@/lib/admin-repair-guard";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ message: "شناسه سفارش تعمیر ارسال نشده است." }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const updated = await toggleArchiveRepair(id, body.isArchived);

    return NextResponse.json({
      success: true,
      repair: updated,
      message: updated.isArchived
        ? "سفارش با موفقیت به بایگانی سوابق فنی کارگاه منتقل شد."
        : "سفارش با موفقیت به کارگاه فعال بازگردانده شد.",
    });
  } catch (error: any) {
    console.error("Error toggling repair archive status:", error);
    return NextResponse.json({ message: error.message || "خطا در تغییر وضعیت بایگانی." }, { status: 400 });
  }
}
