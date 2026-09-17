import { NextRequest, NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/adminAuth";
import { guardRepairDeletion, guardRepairDeletionBulk } from "@/lib/admin-repair-guard";

export async function DELETE(req: NextRequest) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const body = await req.json().catch(() => ({}));
    const { id, ids } = body;

    if (ids && Array.isArray(ids)) {
      const result = await guardRepairDeletionBulk(ids);
      return NextResponse.json(result);
    }

    if (!id) {
      return NextResponse.json({ message: "شناسه سفارش تعمیر ارسال نشده است." }, { status: 400 });
    }

    const result = await guardRepairDeletion(id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in admin deleting repairs:", error);
    return NextResponse.json({ message: error.message || "خطا در حذف سفارشات تعمیر." }, { status: 400 });
  }
}
