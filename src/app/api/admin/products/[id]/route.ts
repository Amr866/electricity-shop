import { NextRequest, NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/adminAuth";
import { deleteGuardedProduct } from "@/lib/admin-product-guard";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ message: "شناسه محصول ارسال نشده است." }, { status: 400 });
    }

    const result = await deleteGuardedProduct(id);
    return NextResponse.json({
      success: true,
      ...result,
      message:
        result.action === "DELETED"
          ? "کالا به همراه تصاویر با موفقیت به طور کامل حذف شد."
          : "کالا به دلیل داشتن سابقه فاکتور خرید به بایگانی منتقل شد و از ویترین عمومی حذف گردید."
    });
  } catch (error: any) {
    console.error("Error deleting product by id:", error);
    return NextResponse.json({ message: error.message || "خطا در حذف محصول." }, { status: 500 });
  }
}
