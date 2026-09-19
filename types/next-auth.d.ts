import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "CUSTOMER";
      phone?: string;
      tokenVersion?: number;
      permissions?: string[];
      isSuspended?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: "ADMIN" | "CUSTOMER";
    phone?: string;
    tokenVersion?: number;
    permissions?: string[];
    isSuspended?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "ADMIN" | "CUSTOMER";
    phone?: string;
    tokenVersion?: number;
    permissions?: string[];
    isSuspended?: boolean;
  }
}

