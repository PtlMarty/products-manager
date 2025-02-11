import { Button } from "@/components/ui/atoms/button";
import { Input } from "@/components/ui/atoms/input";
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
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full max-w-sm mx-auto space-y-3">
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
        <div className="text-sm text-gray-500 flex flex-col text-center">
          To try this app, Sign-in with the following credentials:
          <p>
            <code className="text-gray-900">
              user@example.com
              <br />
              password: user123
            </code>
          </p>
          <br />
          <br />
          <p>
            Please be respectful and don&apos;t abuse the app.
            <br />
            This app is for personal use only.
            <br />
            If you have any questions, please contact the developer
            <a href="mailto:ptl_martin@yahoo.co.jp">Here</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
