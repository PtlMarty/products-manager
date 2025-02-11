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
  userId,
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
      userId={userId}
      products={products}
      suppliers={suppliers}
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
