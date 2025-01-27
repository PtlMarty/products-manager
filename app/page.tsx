// This file is a server component
import Shops from "@/components/shop/Shops";
import { getShopsByUserId } from "@/lib/actions/Shop/getShopsByUserId";
import { getSession } from "@/lib/actions/getSession";
import Link from "next/link";
import { redirect } from "next/navigation";
// Define the Shop type

export default async function Home() {
  const session = await getSession(); // Await the promise to get the session
  const user = session?.user?.id; // Access user id from session
  if (!user) {
    redirect("/sign-in"); // Redirect if user is not found
  }
  const shops = await getShopsByUserId(user as string); // Cast user to string and fetch shops
  return (
    <div>
      {session.user.email}
      <Shops userId={user} />
      <Link href={`/dashboard/shop/${shops[1].id}`}>Dashboard</Link>
    </div>
  );
}
