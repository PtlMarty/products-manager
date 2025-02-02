// TODO: add the sign in action

import { executeAction } from "@/lib/actions/executeAction";
import db from "@/lib/db/db";
import { schema } from "@/lib/zodSchema";
import bcrypt from "bcryptjs";

type SignUpResult = {
  success: boolean;
};

const signUp = async (formData: FormData): Promise<SignUpResult> => {
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

      return { success: true };
    },
    successMessage: "Signed up successfully",
  });
};

export { signUp };
