import DashboardGlobal from "@/components/dashboard/DashboardGlobal";
import { getProductsByShopId } from "@/lib/actions/Shop/getProductsByShopId";
import { getShopsByUserId } from "@/lib/actions/Shop/getShopsByUserId";
import { getSession } from "@/lib/actions/getSession";
import { getSuppliers } from "@/lib/actions/suppliers/supplierActions";
// TODO: Add a Dashboard Page with all data from shops and products

const DashboardPage = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user?.id) {
    return <div>Please sign in to view the dashboard</div>;
  }

  const shops = await getShopsByUserId(user.id);

  // Fetch all products for all shops
  const allProducts = await Promise.all(
    shops.map(async (shop) => {
      const products = await getProductsByShopId(shop.id);
      return products;
    })
  );

  // Flatten the array of arrays into a single array of products
  const products = allProducts.flat();
  // Fetch all suppliers
  const suppliers = await getSuppliers();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col text-center">
        {/* TODO onglet to switch between shops */}
        <div className="flex flex-row gap-3">
          {/* TODO: add a button to switch between shops */}

          {shops.map((shop) => (
            <div className="w-full" key={shop.id}>
              <h1 className="text-2xl font-bold">{shop.name}</h1>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <div className="m-auto w-full">
          <DashboardGlobal
            shops={shops}
            products={products}
            suppliers={suppliers}
          />
        </div>
        <div>
          <div>Charts</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
