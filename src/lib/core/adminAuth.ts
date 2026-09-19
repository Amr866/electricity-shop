import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions, ADMIN_PHONES, parseAdminPermissions } from "./auth";
import { prisma } from "@/lib/prisma";

import { Session } from "next-auth";

export type AdminModule = "CATALOG" | "ORDERS" | "REPAIRS" | "REVIEWS";

export function checkAdminPermission(
  sessionOrPermissions: { user?: { permissions?: string[]; phone?: string } } | string[] | null | undefined,
  requiredModule: AdminModule
): boolean {
  if (!sessionOrPermissions) return false;

  let permissions: string[] = [];
  let phone: string | undefined;

  if (Array.isArray(sessionOrPermissions)) {
    permissions = sessionOrPermissions;
  } else if (sessionOrPermissions.user) {
    permissions = sessionOrPermissions.user.permissions || [];
    phone = sessionOrPermissions.user.phone;
  }

  if (phone && ADMIN_PHONES.includes(phone)) {
    return true;
  }

  if (permissions.includes("ALL")) {
    return true;
  }

  return permissions.includes(requiredModule);
}

export type CheckAdminSessionSuccess = {
  isAdmin: true;
  isRootOwner: boolean;
  session: Session;
  dbUser: {
    id: string;
    name: string | null;
    phone: string;
    role: string;
    tokenVersion: number;
    isSuspended: boolean;
    adminPermissions: string | null;
  };
  response: null;
};

export type CheckAdminSessionFailure = {
  isAdmin: false;
  isRootOwner: false;
  session: Session | null;
  dbUser: null;
  response: NextResponse;
};

export type CheckAdminSessionResult = CheckAdminSessionSuccess | CheckAdminSessionFailure;

export async function checkAdminSession(requiredModule?: AdminModule): Promise<CheckAdminSessionResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      isAdmin: false,
      isRootOwner: false,
      session: null,
      dbUser: null,
      response: NextResponse.json(
        { error: "دسترسی غیرمجاز. ورود با حساب مدیریت الزامی است." },
        { status: 401 }
      ),
    };
  }

  // Live database check for session invalidation (tokenVersion) and suspension
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      phone: true,
      role: true,
      tokenVersion: true,
      isSuspended: true,
      adminPermissions: true,
    },
  });

  if (!dbUser || dbUser.role !== "ADMIN" || dbUser.isSuspended) {
    return {
      isAdmin: false,
      isRootOwner: false,
      session: null,
      dbUser: null,
      response: NextResponse.json(
        { error: "حساب کاربری معلق یا دسترسی نامعتبر است." },
        { status: 401 }
      ),
    };
  }

  const sessionTokenVersion = session.user.tokenVersion ?? 0;
  if (dbUser.tokenVersion !== sessionTokenVersion) {
    return {
      isAdmin: false,
      isRootOwner: false,
      session: null,
      dbUser: null,
      response: NextResponse.json(
        { error: "نشست شما منقضی شده است. لطفا مجددا وارد شوید." },
        { status: 401 }
      ),
    };
  }

  const isRootOwner = ADMIN_PHONES.includes(dbUser.phone);

  // If a specific module is requested, verify permission
  if (requiredModule && !isRootOwner) {
    const permissions = parseAdminPermissions(dbUser.adminPermissions);

    if (!permissions.includes("ALL") && !permissions.includes(requiredModule)) {
      return {
        isAdmin: false,
        isRootOwner: false,
        session: null,
        dbUser: null,
        response: NextResponse.json(
          { error: `دسترسی غیرمجاز. شما مجوز دسترسی به بخش ${requiredModule} را ندارید.` },
          { status: 403 }
        ),
      };
    }
  }

  return {
    isAdmin: true,
    isRootOwner,
    session,
    dbUser,
    response: null,
  };
}
