import { SignInForm } from "@/components/auth/SignInForm";
import { getSession } from "@/lib/actions/getSession";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await getSession();
  if (session) redirect("/");

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <SignInForm />
      <div className="text-sm text-gray-500 flex flex-col text-center mt-2">
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
  );
}
