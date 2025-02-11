import DashboardGlobal from "@/components/dashboard/DashboardGlobal";
import { getProductsByShopId } from "@/lib/actions/Shop/getProductsByShopId";
import { getShopsByUserId } from "@/lib/actions/Shop/getShopsByUserId";
import { getSession } from "@/lib/actions/getSession";
import { getOrdersByShopId } from "@/lib/actions/orders/ordersActions";
import { getSuppliers } from "@/lib/actions/suppliers/supplierActions";
import { Order, Shop, User } from "@prisma/client";
import { redirect } from "next/navigation";

// TODO: Add a dashboard Shop Page with all data from specific shop with shopId

interface PageProps {
  params: Promise<{ shopId: string }>;
}

type OrderWithUserAndShop = Order & { user: User; shop: Shop };

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

  // Get orders for this shop
  const ordersResult = await getOrdersByShopId({ shopId });
  const initialOrders = (
    ordersResult.success ? ordersResult.data : []
  ) as OrderWithUserAndShop[];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{currentShop.name} Dashboard</h1>
      <DashboardGlobal
        shops={[currentShop]}
        products={products}
        suppliers={suppliers}
        totalProductsCount={products.length}
        initialOrders={initialOrders}
      />
    </div>
  );
};

export default ShopPage;
