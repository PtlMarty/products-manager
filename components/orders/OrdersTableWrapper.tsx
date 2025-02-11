"use client";

import { useOrders } from "@/lib/hooks/UseOrders";
import { Order, Product, Shop, Supplier, User } from "@prisma/client";
import { Suspense } from "react";
import OrdersTable from "./OrdersTable";
import OrdersTableSkeleton from "./OrdersTableSkeleton";

interface OrdersTableWrapperProps {
  shopId: string;
  userId: string;
  products: Product[];
  suppliers: Supplier[];
  shops?: Shop[];
  initialOrders: (Order & { user: User; shop: Shop })[];
}

function OrdersTableContent({
  shopId,
  products,
  suppliers,
  shops,
  initialOrders,
}: OrdersTableWrapperProps) {
  const { orders, handleCreateOrder } = useOrders(shopId, shops, initialOrders);

  return (
    <OrdersTable
      orders={orders}
      shopId={shopId}
      products={products}
      suppliers={suppliers}
      shops={shops}
      onCreate={handleCreateOrder}
    />
  );
}

export default function OrdersTableWrapper(props: OrdersTableWrapperProps) {
  return (
    <Suspense fallback={<OrdersTableSkeleton />}>
      <OrdersTableContent {...props} />
    </Suspense>
  );
}
