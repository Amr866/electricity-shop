import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function checkAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      isAdmin: false,
      response: NextResponse.json(
        { error: "دسترسی غیرمجاز. ورود با حساب مدیریت الزامی است." },
        { status: 401 }
      ),
    };
  }

  return { isAdmin: true, session, response: null };
}
