// TODO: add the sign in action

import db from "@/lib/db";
import { executeAction } from "@/lib/executeAction";
import { schema } from "@/lib/zodSchema";
import bcrypt from "bcryptjs";

const signUp = async (formData: FormData) => {
  return executeAction({
    actionFn: async () => {
      const email = formData.get("email") as string | null;
      const password = formData.get("password") as string | null;

      if (!email || !password) {
        throw new Error("Email and password are required.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const validatedData = schema.parse({ email, password });
      await db.user.create({
        data: {
          email: validatedData.email.toLocaleLowerCase(),
          password: hashedPassword,
        },
      });
    },
    successMessage: "Signed up successfully",
  });
};

export { signUp };
