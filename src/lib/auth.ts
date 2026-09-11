import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

const ADMIN_PHONES = ["09136260072", "09162665884", "09131112233", "09132334455"];

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
      },
      async authorize(credentials) {
        if (!credentials?.phone) return null;

        const phone = credentials.phone.trim();

        // 1. Password-based authentication (Admin / Back-office)
        if (credentials.password) {
          const inputPass = credentials.password.trim();
          const adminUser = await prisma.user.findUnique({
            where: { phone },
          });

          // Check credentials
          const isMasterAdmin = ADMIN_PHONES.includes(phone) && inputPass === "admin123";
          
          if (isMasterAdmin) {
            let admin = adminUser;
            if (!admin) {
              admin = await prisma.user.create({
                data: {
                  phone,
                  name: "مدیریت کارگاه و فروشگاه شیاسی",
                  role: "ADMIN",
                  isVerified: true,
                },
              });
            } else if (admin.role !== "ADMIN") {
              admin = await prisma.user.update({
                where: { id: admin.id },
                data: { role: "ADMIN", isVerified: true },
              });
            }

            return {
              id: admin.id,
              name: admin.name || "مدیر ارشد فروشگاه",
              phone: admin.phone,
              role: (admin.role as "ADMIN" | "CUSTOMER") || "ADMIN",
            };
          }
          return null;
        }

        // 2. OTP-based authentication (Customer & Admin via Phone Code)
        if (credentials.otpCode) {
          const inputCode = credentials.otpCode.trim();
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
          const shouldBeAdmin = ADMIN_PHONES.includes(phone);

          if (!user) {
            user = await prisma.user.create({
              data: {
                phone,
                name: shouldBeAdmin ? "مدیریت کارگاه شیاسی" : "مشتری گرامی",
                role: shouldBeAdmin ? "ADMIN" : "CUSTOMER",
                isVerified: true,
                city: "نجف‌آباد",
              },
            });
          } else if (shouldBeAdmin && user.role !== "ADMIN") {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { role: "ADMIN", isVerified: true },
            });
          }

          return {
            id: user.id,
            name: user.name || (user.role === "ADMIN" ? "مدیر فروشگاه" : "مشتری گرامی"),
            phone: user.phone,
            role: (user.role as "ADMIN" | "CUSTOMER") || "CUSTOMER",
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
        token.role = (user as any).role || "CUSTOMER";
        token.phone = (user as any).phone;
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
