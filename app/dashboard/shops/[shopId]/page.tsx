import DashboardGlobal from "@/components/dashboard/DashboardGlobal";
import { getProductsByShopId } from "@/lib/actions/Shop/getProductsByShopId";
import { getShopsByUserId } from "@/lib/actions/Shop/getShopsByUserId";
import { getSession } from "@/lib/actions/getSession";
import { getSuppliers } from "@/lib/actions/suppliers/supplierActions";
import { redirect } from "next/navigation";

// TODO: Add a dashboard Shop Page with all data from specific shop with shopId

interface PageProps {
  params: Promise<{ shopId: string }>;
}

const ShopPage = async ({ params }: PageProps) => {
  const { shopId } = await params;
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/sign-in");
  }

  // Get all shops to find the current one
  const shops = await getShopsByUserId(user.id);
  const currentShop = shops.find((shop) => shop.id === shopId);
  const suppliers = await getSuppliers();

  if (!currentShop) {
    return <div>Shop not found</div>;
  }

  // Get products for this specific shop
  const products = await getProductsByShopId(shopId);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{currentShop.name} Dashboard</h1>
      <DashboardGlobal
        shops={[currentShop]}
        products={products}
        suppliers={suppliers}
        totalProductsCount={products.length}
      />
    </div>
  );
};

export default ShopPage;
