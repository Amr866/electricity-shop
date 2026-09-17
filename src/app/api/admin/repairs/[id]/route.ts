import { NextRequest, NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/adminAuth";
import { guardRepairDeletion } from "@/lib/admin-repair-guard";

export async function DELETE(
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

    const result = await guardRepairDeletion(id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error deleting repair by id:", error);
    return NextResponse.json({ message: error.message || "خطا در پردازش حذف سفارش تعمیر." }, { status: 400 });
  }
}
