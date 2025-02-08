import db from "@/lib/db/db";
import { schema } from "@/lib/zodSchema";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import { encode as defaultEncode } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { v4 as uuid } from "uuid";

const adapter = PrismaAdapter(db);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const validatedCredentials = schema.parse(credentials);

          // Find user by email
          const user = await db.user.findFirst({
            where: { email: validatedCredentials.email },
          });

          if (!user || !user.password) {
            console.error(
              "Invalid credentials - User not found or no password"
            );
            return null;
          }

          // Validate password
          const isPasswordMatch = await bcrypt.compare(
            validatedCredentials.password,
            user.password
          );

          if (!isPasswordMatch) {
            console.error("Invalid credentials - Password does not match");
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }

      if (account?.provider === "credentials") {
        token.credentials = true;
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.id && typeof token.id === "string") {
        session.user = {
          ...session.user,
          id: token.id,
        };
      }

      return session;
    },
  },
  jwt: {
    encode: async function (params) {
      try {
        if (params.token?.credentials) {
          const sessionToken = uuid();

          if (!params.token.sub) {
            throw new Error("No user ID found in token");
          }

          const createdSession = await adapter?.createSession?.({
            sessionToken: sessionToken,
            userId: params.token.sub,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          });

          if (!createdSession) {
            throw new Error("Failed to create session");
          }

          return sessionToken;
        }
        return defaultEncode(params);
      } catch (error) {
        console.error("JWT encode error:", error);
        throw error;
      }
    },
  },
});
