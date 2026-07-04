import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "./prisma";

export type SessionRole = "DIRECTOR" | "FINANCE";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      role?: SessionRole;
    };
  }
  interface User {
    role?: SessionRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: SessionRole;
  }
}

export function constantTimeEqual(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "utf8");
    const bufB = Buffer.from(b, "utf8");
    if (bufA.length !== bufB.length) {
      crypto.timingSafeEqual(bufA, bufA);
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function verifyPassword(
  input: string,
  stored: string | undefined
): Promise<boolean> {
  if (!stored) return false;
  if (
    stored.startsWith("$2a$") ||
    stored.startsWith("$2b$") ||
    stored.startsWith("$2y$")
  ) {
    return bcrypt.compare(input, stored);
  }
  return false;
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        username: { label: "Email or username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const username = credentials.username.trim();

        // 1. Database user lookup (by email, case-insensitive).
        const dbUser = await prisma.user.findFirst({
          where: {
            email: { equals: username, mode: "insensitive" },
            isActive: true,
          },
        });
        if (dbUser) {
          const ok = await verifyPassword(credentials.password, dbUser.passwordHash);
          if (!ok) return null;
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { lastLoginAt: new Date() },
          });
          return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role as SessionRole,
          };
        }

        // 2. Env-var bootstrap admin — always treated as DIRECTOR.
        // Lets you get in even before any DB user exists, and acts as a
        // break-glass account if all directors are locked out.
        const expectedUser = process.env.ADMIN_USERNAME;
        const expectedPass = process.env.ADMIN_PASSWORD;
        if (
          expectedUser &&
          expectedPass &&
          constantTimeEqual(username, expectedUser)
        ) {
          const ok = expectedPass.startsWith("$2")
            ? await bcrypt.compare(credentials.password, expectedPass)
            : constantTimeEqual(credentials.password, expectedPass);
          if (ok) {
            return {
              id: "env:admin",
              name: expectedUser,
              email: process.env.ADMIN_EMAIL ?? null,
              role: "DIRECTOR" as SessionRole,
            };
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
