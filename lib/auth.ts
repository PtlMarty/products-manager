import db from "@/lib/db/db";
import { schema } from "@/lib/validation/zodSchema";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: Role;
      emailVerified: null;
    };
  }

  interface User {
    id?: string;
    email?: string | null;
    name?: string | null;
    role?: Role;
    emailVerified?: null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    email: string;
    name?: string | null;
    role: Role;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
  debug: process.env.NODE_ENV === "development",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing credentials");
          }

          const validatedCredentials = schema.parse(credentials);

          const user = await db.user.findUnique({
            where: { email: validatedCredentials.email.toLowerCase() },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true,
            },
          });

          if (!user || !user.password) {
            throw new Error("User not found");
          }

          const isPasswordMatch = await bcrypt.compare(
            validatedCredentials.password,
            user.password
          );

          if (!isPasswordMatch) {
            throw new Error("Invalid password");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            emailVerified: null,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.email = user.email as string;
        token.name = user.name ?? null;
        token.role = user.role as Role;
      }
      return token;
    },
    async session({ session, token }) {
      if (!token.id || !token.email) return session;

      return {
        ...session,
        user: {
          id: token.id,
          email: token.email,
          name: token.name ?? null,
          role: token.role,
          emailVerified: null,
        },
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  logger: {
    error(error: Error) {
      console.error("AUTH_ERROR:", error);
    },
    warn(code: string) {
      console.warn("AUTH_WARN:", code);
    },
    debug(code: string, metadata: unknown) {
      console.debug("AUTH_DEBUG:", code, metadata);
    },
  },
});
