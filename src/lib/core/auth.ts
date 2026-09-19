import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { normalizeIranianPhone, toAsciiDigits } from "@/lib/utils";
import { verifyPassword } from "@/lib/password";

export const ADMIN_PHONES = ["09136260072", "09162665884", "09131112233", "09132334455"];

export function parseAdminPermissions(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "Phone OTP or Admin Credentials",
      credentials: {
        phone: { label: "شماره موبایل", type: "text" },
        otpCode: { label: "کد تایید", type: "text" },
        password: { label: "کلمه عبور (ادمین)", type: "password" },
        name: { label: "نام خریدار", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone) return null;

        const phone = normalizeIranianPhone(credentials.phone);
        if (!phone) return null;

        // 1. Password-based authentication (Admin / Back-office)
        if (credentials.password) {
          const inputPass = credentials.password.trim();
          let adminUser = await prisma.user.findUnique({
            where: { phone },
          });

          if (!adminUser || adminUser.isSuspended) {
            return null;
          }

          const isRootOwner = ADMIN_PHONES.includes(phone);
          const isDbAdmin = adminUser.role === "ADMIN" || isRootOwner;

          if (!isDbAdmin) {
            return null;
          }

          if (!verifyPassword(inputPass, adminUser.password)) {
            return null;
          }

          if (adminUser.role !== "ADMIN") {
            adminUser = await prisma.user.update({
              where: { id: adminUser.id },
              data: { role: "ADMIN", isVerified: true },
            });
          }

          const permissions: string[] = isRootOwner
            ? ["ALL"]
            : parseAdminPermissions(adminUser.adminPermissions);

          return {
            id: adminUser.id,
            name: adminUser.name || (isRootOwner ? "مدیر ارشد فروشگاه" : "مدیر سیستم"),
            phone: adminUser.phone,
            role: "ADMIN" as const,
            tokenVersion: adminUser.tokenVersion,
            permissions,
          };
        }

        // 2. OTP-based authentication (Customer & Admin via Phone Code)
        // Per FR-067: Strictly clamped to role: "CUSTOMER" to prevent SMS OTP role escalation
        if (credentials.otpCode) {
          const inputCode = toAsciiDigits(credentials.otpCode.trim());
          const validToken = await prisma.verificationToken.findFirst({
            where: {
              phone,
              code: inputCode,
              expiresAt: { gt: new Date() },
            },
          });

          if (!validToken) {
            return null;
          }

          // Single-use token: invalidate immediately
          await prisma.verificationToken.delete({ where: { id: validToken.id } });

          // Resolve user record strictly from PostgreSQL database
          let user = await prisma.user.findUnique({ where: { phone } });

          if (!user) {
            user = await prisma.user.create({
              data: {
                phone,
                name: credentials.name?.trim() || "مشتری گرامی",
                role: "CUSTOMER",
                isVerified: true,
                city: "نجف‌آباد",
              },
            });
          } else {
            const updateData: { isVerified?: boolean; name?: string } = {};
            if (!user.isVerified) {
              updateData.isVerified = true;
            }
            if (credentials.name?.trim() && (!user.name || user.name === "مشتری گرامی")) {
              updateData.name = credentials.name.trim();
            }
            if (Object.keys(updateData).length > 0) {
              user = await prisma.user.update({
                where: { id: user.id },
                data: updateData,
              });
            }
          }

          // Clamped to CUSTOMER session per FR-067
          return {
            id: user.id,
            name: user.name || "مشتری گرامی",
            phone: user.phone,
            role: "CUSTOMER" as const,
            tokenVersion: user.tokenVersion,
            permissions: [],
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "CUSTOMER";
        token.phone = user.phone;
        token.tokenVersion = user.tokenVersion ?? 0;
        token.permissions = user.permissions ?? [];
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = (token.id as string) || "";
        session.user.role = (token.role as "ADMIN" | "CUSTOMER") || "CUSTOMER";
        session.user.phone = (token.phone as string) || "";
        session.user.tokenVersion = typeof token.tokenVersion === "number" ? token.tokenVersion : 0;
        session.user.permissions = Array.isArray(token.permissions) ? token.permissions : [];
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "shiasi-secret-key-1403-najafabad-isfahan-auth",
};
