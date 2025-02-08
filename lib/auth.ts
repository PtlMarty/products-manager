import db from "@/lib/db/db";
import { schema } from "@/lib/zodSchema";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import { decode, encode as defaultEncode } from "next-auth/jwt";
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

          const user = await db.user.findFirst({
            where: { email: validatedCredentials.email },
          });

          if (!user || !user.password) {
            console.error(
              "Invalid credentials - User not found or no password"
            );
            return null;
          }

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
        token.email = user.email;
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

          await db.session.create({
            data: {
              sessionToken,
              userId: params.token.sub,
              expires: new Date(
                Date.now() + (params.maxAge || 30 * 24 * 60 * 60) * 1000
              ),
            },
          });

          return sessionToken;
        }

        return await defaultEncode(params);
      } catch (error) {
        console.error("JWT encode error:", error);
        throw error;
      }
    },
    decode: async function (params) {
      try {
        if (!params.token) return null;

        // Check if token is a session token (UUID format)
        if (
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            params.token
          )
        ) {
          const session = await db.session.findUnique({
            where: { sessionToken: params.token },
            include: { user: true },
          });

          if (!session || !session.user) return null;

          return {
            sub: session.user.id,
            email: session.user.email,
            name: session.user.name,
            credentials: true,
          } as JWT;
        }

        return decode(params);
      } catch (error) {
        console.error("JWT decode error:", error);
        return null;
      }
    },
  },
});
