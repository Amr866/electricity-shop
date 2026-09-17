import { NextRequest, NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/adminAuth";
import { toggleArchiveBom } from "@/lib/admin-bom-guard";

export async function PATCH(
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

    let shouldArchive: boolean | undefined = undefined;
    try {
      const body = await req.json();
      if (typeof body.shouldArchive === "boolean") {
        shouldArchive = body.shouldArchive;
      }
    } catch {
      // Body not provided, will toggle
    }

    const updated = await toggleArchiveBom(id, shouldArchive);
    return NextResponse.json({
      success: true,
      bom: updated,
      message: updated.isArchived
        ? "استعلام با موفقیت به بایگانی منتقل شد."
        : "استعلام با موفقیت از بایگانی بازگردانده شد."
    });
  } catch (error: any) {
    console.error("Error toggling BOM archive:", error);
    return NextResponse.json({ message: error.message || "خطا در تغییر وضعیت آرشیو." }, { status: 500 });
  }
}
