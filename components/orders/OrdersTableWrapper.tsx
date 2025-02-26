"use client";

import { useOrders } from "@/lib/hooks/UseOrders";
import { createOrderPdf } from "@/lib/utils/orderPdf";
import {
  Order,
  OrderItem,
  Product,
  Shop,
  Supplier,
  User,
} from "@/types/prisma";
import { Suspense } from "react";
import OrdersTable from "./OrdersTable";
import OrdersTableSkeleton from "./OrdersTableSkeleton";

type ExtendedOrder = Order & {
  user: User;
  shop: Shop;
  supplier: Supplier;
  orderItems: OrderItem[];
};

interface OrdersTableWrapperProps {
  shopId: string;
  userId: string;
  products: Product[];
  suppliers: Supplier[];
  shops?: Shop[];
  initialOrders: ExtendedOrder[];
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
    products
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

  const handleViewOrder = async (order: ExtendedOrder) => {
    try {
      if (!order.orderItems) {
        throw new Error("Order items not found");
      }

      const pdfOrderItems = order.orderItems.map((item: OrderItem) => {
        const product = products.find((p) => p.id === item.productId) ?? {
          id: item.productId,
          name: "Unknown Product",
          price: 0,
          stock: 0,
          shopId: order.shopId,
          supplierId: order.supplierId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return {
          ...item,
          product,
        };
      });

      const pdfOrder = {
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        shopId: order.shopId,
        supplierId: order.supplierId,
        userId: order.userId,
        shop: {
          id: order.shop.id,
          name: order.shop.name,
          createdAt: order.shop.createdAt,
          updatedAt: order.shop.updatedAt,
        },
      };

      const pdfBlob = await createOrderPdf(
        pdfOrder,
        pdfOrderItems,
        order.supplier
      );

      // Create a blob from the PDF data
      const blob = new Blob([pdfBlob], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Open PDF in new tab
      window.open(url, "_blank");

      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
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
