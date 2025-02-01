import DashboardGlobal from "@/components/dashboard/DashboardGlobal";
import { redirect } from "next/navigation";

// TODO: Add a dashboard Shop Page with all data from specific shop with shopId

const ShopPage = async ({
  params,
}: {
  params: { shopId: string; userId: string };
}) => {
  const user = params.userId; // Access user id from session
  if (!user) {
    redirect("/sign-in"); // Redirect if user is not found
  }
  return (
    <div>
      {user}
      <DashboardGlobal />
    </div>
  );
};

export default ShopPage;
