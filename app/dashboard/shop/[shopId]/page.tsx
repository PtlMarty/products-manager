import Shops from "@/components/shop/Shops";
import { getSession } from "@/lib/actions/getSession";
import { redirect } from "next/navigation";

// TODO: Add a dashboard Shop Page with all data from specific shop with shopId

const ShopPage = async () => {
  const session = await getSession();
  const user = session?.user; // Access user id from session
  if (!user) {
    redirect("/sign-in"); // Redirect if user is not found
  }

  return (
    <div>
      {user?.email}
      <Shops userId={user.id} products={[]} />
    </div>
  );
};

export default ShopPage;
