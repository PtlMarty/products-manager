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
  const { orders, handleCreateOrder, handleDeleteOrder } = useOrders(
    shopId,
    shops,
    initialOrders,
    products || []
  );

  if (!products || !Array.isArray(products)) {
    return (
      <div className="p-4 text-center text-gray-500">
        Error: Products data is invalid. Please refresh the page.
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No products available. Please add products before creating orders.
      </div>
    );
  }

  const handleViewOrder = (order: Order) => {
    // TODO: Implement view order functionality
    console.log("View order:", order);
  };

  const handleEditOrder = (order: Order) => {
    // TODO: Implement edit order functionality
    console.log("Edit order:", order);
  };

  return (
    <OrdersTable
      orders={orders}
      shopId={shopId}
      products={products}
      suppliers={suppliers}
      shops={shops}
      onCreate={handleCreateOrder}
      onView={handleViewOrder}
      onEdit={handleEditOrder}
      onDelete={handleDeleteOrder}
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
