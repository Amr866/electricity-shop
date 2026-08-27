import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const settings = await req.json();

    for (const [key, value] of Object.entries(settings)) {
      if (typeof value === "string") {
        await prisma.storeSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ message: "خطا در ذخیره تنظیمات." }, { status: 500 });
  }
}
