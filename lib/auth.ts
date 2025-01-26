import db from "@/lib/db";
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
  debug: true,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedCredentials = schema.parse(credentials);

        const user = await db.user.findFirst({
          where: {
            email: validatedCredentials.email,
          },
        });

        // check id the password match to the encrypted password

        if (user && typeof user.password === "string") {
          const isPasswordMatch = await bcrypt.compare(
            validatedCredentials.password,
            user.password
          );
          if (!isPasswordMatch) {
            throw new Error("Invalid credentials.");
          }
        }

        //if user is not found, throw an error

        if (!user) {
          throw new Error("Invalid credentials.");
        }

        return user;
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
    },
  },
});
