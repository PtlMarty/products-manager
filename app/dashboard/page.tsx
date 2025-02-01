import DashboardGlobal from "@/components/dashboard/DashboardGlobal";
import { getSession } from "@/lib/actions/getSession";
import { getProductsByShopId } from "@/lib/actions/Shop/getProductsByShopId";
import { getShopsByUserId } from "@/lib/actions/Shop/getShopsByUserId";
// TODO: Add a Dashboard Page with all data from shops and products

const DashboardPage = async () => {
  const session = await getSession();
  const user = session?.user;
  const shops = await getShopsByUserId(user?.id as string);
  const products = await getProductsByShopId(shops[0].id as string);
  return (
    <>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col text-center">
          {/* TODO onglet to switch between shops */}
          <div className="flex flex-row gap-3">
            {/* TODO: add a button to switch between shops */}

            {shops.map((shop) => (
              <div className="w-full" key={shop.id}>
                <h1 className="text-2xl font-bold">shop: {shop.name}</h1>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center">
          {shops.map((shop) => (
            <div className="m-auto w-full" key={shop.id}>
              <DashboardGlobal />
            </div>
          ))}
          <div>
            <div>Charts</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
