import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/actions/User/signUp";
import Link from "next/link";
import { redirect } from "next/navigation";

const SignUpPage = async () => {
  async function action(formData: FormData) {
    "use server";

    try {
      const result = await signUp(formData);
      if (result.success) {
        redirect("/sign-in");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

      <form action={action} className="space-y-4">
        <Input
          name="email"
          placeholder="Email"
          type="email"
          required
          autoComplete="email"
        />
        <Input
          name="password"
          placeholder="Password"
          type="password"
          required
          autoComplete="new-password"
        />
        <Button className="w-full" type="submit">
          Sign Up
        </Button>
      </form>

      <div className="text-center">
        <Button asChild variant="link">
          <Link href="/sign-in">Already have an account? Sign in</Link>
        </Button>
      </div>
    </div>
  );
};

export default SignUpPage;
