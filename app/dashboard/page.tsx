import DashboardGlobal from "@/components/dashboard/DashboardGlobal";
import { getProductsByShopId } from "@/lib/actions/Shop/getProductsByShopId";
import { getShopsByUserId } from "@/lib/actions/Shop/getShopsByUserId";
import { getSession } from "@/lib/actions/getSession";
import { getSuppliers } from "@/lib/actions/suppliers/supplierActions";
import { redirect } from "next/navigation";
// TODO: Add a Dashboard Page with all data from shops and products

const PRODUCTS_LIMIT = 6;

const DashboardPage = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user?.id) {
    redirect("/sign-in");
  }

  const [shops, suppliers] = await Promise.all([
    getShopsByUserId(user.id),
    getSuppliers(),
  ]);

  // Fetch all products for all shops
  const allProducts = await Promise.all(
    shops.map(async (shop) => {
      const products = await getProductsByShopId(shop.id);
      return products;
    })
  );

  // Flatten the array and sort by creation date
  const flattenedProducts = allProducts.flat();
  const totalProductsCount = flattenedProducts.length; // Get total number of products

  const products = flattenedProducts
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, PRODUCTS_LIMIT);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
        Dashboard Overview
      </h1>
      <div className="bg-white rounded-lg shadow">
        <DashboardGlobal
          shops={shops}
          products={products}
          suppliers={suppliers}
          totalProductsCount={totalProductsCount}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
