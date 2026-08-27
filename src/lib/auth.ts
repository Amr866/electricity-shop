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
        role: { label: "نقش", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone) return null;

        const phone = credentials.phone.trim();

        // 1. Admin login with password
        if (credentials.password) {
          if (phone === "09131112233" && credentials.password === "admin123") {
            let adminUser = await prisma.user.findUnique({ where: { phone } });
            if (!adminUser) {
              adminUser = await prisma.user.create({
                data: {
                  phone,
                  name: "مدیریت فروشگاه شیاسی",
                  role: "ADMIN",
                  isVerified: true,
                },
              });
            }
            return {
              id: adminUser.id,
              name: adminUser.name || "مدیر فروشگاه",
              phone: adminUser.phone,
              role: "ADMIN",
            };
          }
          return null;
        }

        // 2. Customer OTP Verification Login
        if (credentials.otpCode) {
          const validToken = await prisma.verificationToken.findFirst({
            where: {
              phone,
              code: credentials.otpCode.trim(),
              expiresAt: { gt: new Date() },
            },
          });

          // Also allow test OTP "12345" for seamless testing
          if (!validToken && credentials.otpCode !== "12345") {
            return null;
          }

          // Delete token once used
          if (validToken) {
            await prisma.verificationToken.delete({ where: { id: validToken.id } });
          }

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
            role: user.role,
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
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).phone = token.phone;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "shiasi-secret-key-1403-najafabad-isfahan-auth",
};
