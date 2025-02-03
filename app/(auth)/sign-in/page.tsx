import { SignInForm } from "@/components/auth/SignInForm";
import { getSession } from "@/lib/actions/getSession";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await getSession();
  if (session) redirect("/");

  return <SignInForm />;
}
