"use server";

import { getShopsByUserId } from "@/lib/actions/Shop/getShopsByUserId";

async function Shops({ ...props }: { userId: string }) {
  //server component
  const shops = await getShopsByUserId(props.userId);

  return (
    <div>
      {shops && shops.length > 0 ? (
        shops.map((shop) => (
          <div key={shop.id}>
            {shop.name}
            {shop.products.map((product) => (
              <div key={product.id}>
                {product.name} {product.price}
              </div>
            ))}
          </div>
        ))
      ) : (
        <div>No shops available.</div>
      )}
    </div>
  );
}

export default Shops;
