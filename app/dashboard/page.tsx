import { getSession } from "@/lib/actions/getSession";
import { getShopsByUserId } from "@/lib/actions/Shop/getShopsByUserId";

// TODO: Add a Dashboard Page with all data fron shops and products

const DashboardPage = async () => {
  const session = await getSession();
  const user = session?.user;
  const shops = await getShopsByUserId(user?.id as string);
  return (
    <div>
      {shops.map((shop) => (
        <div key={shop.id}>{shop.name}</div>
      ))}
      {user?.email}
      {shops.map((shop) => (
        <div key={shop.id}>
          {shop.products.map((product) => (
            <div key={product.id}>{product.name}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DashboardPage;
