import { getShopsByUserId } from "@/lib/actions/Shop/getShopsByUserId";
import { getSession } from "@/lib/actions/getSession";
import Link from "next/link";

// TODO: improve the shops page

const ShopsPage = async () => {
  const session = await getSession();
  const user = session?.user?.id;
  const shops = await getShopsByUserId(user as string);

  return (
    <div>
      {shops.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">
            Welcome to your Dashboard
          </h2>
          <p className="text-gray-500">
            You haven&apos;t created any shops yet.
          </p>
          <Link
            href="/shops/new"
            className=" hover:underline bg-violet-500 text-white px-4 py-2 rounded-md"
          >
            Create your first shop
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="p-4 border rounded-lg hover:bg-gray-50"
            >
              <Link
                href={`/dashboard/shops/${shop.id}`}
                className="p-2 bg-violet-500 text-white rounded-md"
              >
                {shop.name}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopsPage;
