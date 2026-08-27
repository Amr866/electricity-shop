import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

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

        // 1. Admin login with password
        if (credentials.password) {
          const adminUser = await prisma.user.findFirst({
            where: {
              phone,
              role: "ADMIN",
            },
          });

          // Check credentials (or auto-bootstrap primary admin in DB)
          if (phone === "09131112233" && credentials.password === "admin123") {
            let admin = adminUser;
            if (!admin) {
              admin = await prisma.user.create({
                data: {
                  phone,
                  name: "مدیریت فروشگاه شیاسی",
                  role: "ADMIN",
                  isVerified: true,
                },
              });
            }
            return {
              id: admin.id,
              name: admin.name || "مدیر فروشگاه",
              phone: admin.phone,
              role: "ADMIN",
            };
          }
          return null;
        }

        // 2. Customer OTP Verification Login
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

          // Delete token once used
          await prisma.verificationToken.delete({ where: { id: validToken.id } });

          // Find or create customer
          let user = await prisma.user.findUnique({ where: { phone } });
          if (!user) {
            user = await prisma.user.create({
              data: {
                phone,
                name: "مشتری گرامی",
                role: "CUSTOMER",
                isVerified: true,
                city: "نجف‌آباد",
              },
            });
          }

          return {
            id: user.id,
            name: user.name || "مشتری گرامی",
            phone: user.phone,
            role: "CUSTOMER",
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
