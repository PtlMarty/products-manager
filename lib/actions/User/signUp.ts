"use server";

// TODO: add the sign in action

import { executeAction } from "@/lib/actions/executeAction";
import db from "@/lib/db/db";
import { schema } from "@/lib/zodSchema";
import bcrypt from "bcryptjs";

type SignUpResult = {
  success: boolean;
  error?: string;
};

export async function signUp(formData: FormData): Promise<SignUpResult> {
  return executeAction({
    actionFn: async () => {
      const email = formData.get("email");
      const password = formData.get("password");

      if (
        !email ||
        !password ||
        typeof email !== "string" ||
        typeof password !== "string"
      ) {
        return {
          success: false,
          error: "Email and password are required.",
        };
      }

      try {
        // Check if user already exists
        const existingUser = await db.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (existingUser) {
          return {
            success: false,
            error: "Email already in use.",
          };
        }

        const validatedData = schema.parse({ email, password });
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.create({
          data: {
            email: validatedData.email.toLowerCase(),
            password: hashedPassword,
          },
        });

        return { success: true };
      } catch (error) {
        console.error("Sign up error:", error);
        return {
          success: false,
          error: "Failed to create account. Please try again.",
        };
      }
    },
    successMessage: "Account created successfully",
  });
}
