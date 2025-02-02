import { getShopsByUserId } from "@/lib/actions/Shop/getShopsByUserId";
import { getSession } from "@/lib/actions/getSession";
import Link from "next/link";

// TODO: Add a  Page with all  shops

const ShopsPage = async () => {
  const session = await getSession();
  const user = session?.user?.id;
  const shops = await getShopsByUserId(user as string);
  return (
    <div>
      {shops.map((shop) => (
        <div key={shop.id}>
          <Link href={`/dashboard/shops/${shop.id}`} className="text-blue-500">
            {shop.name}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ShopsPage;
