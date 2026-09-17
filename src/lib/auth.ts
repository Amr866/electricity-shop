import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { normalizeIranianPhone, toAsciiDigits } from "@/lib/utils";
import { verifyPassword } from "@/lib/password";

export const ADMIN_PHONES = ["09136260072", "09162665884", "09131112233", "09132334455"];

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

          const isDbAdminMatch =
            Boolean(adminUser) &&
            (adminUser!.role === "ADMIN" || ADMIN_PHONES.includes(phone)) &&
            verifyPassword(inputPass, adminUser!.password);

          if (isDbAdminMatch && adminUser) {
            if (adminUser.role !== "ADMIN") {
              adminUser = await prisma.user.update({
                where: { id: adminUser.id },
                data: { role: "ADMIN", isVerified: true },
              });
            }

            return {
              id: adminUser.id,
              name: adminUser.name || "مدیر ارشد فروشگاه",
              phone: adminUser.phone,
              role: "ADMIN" as const,
            };
          }
          return null;
        }

        // 2. OTP-based authentication (Customer & Admin via Phone Code)
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
          const shouldBeAdmin = ADMIN_PHONES.includes(phone) || user?.role === "ADMIN";

          if (!user) {
            user = await prisma.user.create({
              data: {
                phone,
                name: credentials.name?.trim() || (shouldBeAdmin ? "مدیریت کارگاه شیاسی" : "مشتری گرامی"),
                role: shouldBeAdmin ? "ADMIN" : "CUSTOMER",
                isVerified: true,
                city: "نجف‌آباد",
              },
            });
          } else {
            const updateData: { role?: "ADMIN"; isVerified?: boolean; name?: string } = {};
            if (shouldBeAdmin && user.role !== "ADMIN") {
              updateData.role = "ADMIN";
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

          return {
            id: user.id,
            name: user.name || (shouldBeAdmin ? "مدیر فروشگاه" : "مشتری گرامی"),
            phone: user.phone,
            role: (shouldBeAdmin ? "ADMIN" : "CUSTOMER") as "ADMIN" | "CUSTOMER",
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
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = (token.id as string) || "";
        session.user.role = (token.role as "ADMIN" | "CUSTOMER") || "CUSTOMER";
        session.user.phone = (token.phone as string) || "";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "shiasi-secret-key-1403-najafabad-isfahan-auth",
};
