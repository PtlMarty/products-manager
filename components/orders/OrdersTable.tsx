"use client";

import {
  Order,
  OrderItem,
  OrderStatus,
  Product,
  Shop,
  Supplier,
  User,
} from "@prisma/client";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { OrderForm } from "./OrderForm";

type CreateOrderInput = Omit<Order, "id" | "createdAt" | "updatedAt"> & {
  orderItems: Omit<OrderItem, "id" | "orderId" | "createdAt" | "updatedAt">[];
};

interface OrdersProps {
  orders: (Order & { user: User; shop: Shop })[];
  shopId: string;
  userId: string;
  products: Product[];
  suppliers: Supplier[];
  onDelete?: (order: Order) => void;
  onEdit?: (order: Order) => void;
  onView?: (order: Order) => void;
  onCreate?: (
    order: CreateOrderInput
  ) => Promise<{ success: boolean; data?: Order; error?: Error }>;
}

const OrdersTable = ({
  orders,
  shopId,
  products = [],
  suppliers = [],
  onDelete = (order) => console.log("Delete order:", order),
  onEdit = (order) => console.log("Edit order:", order),
  onView = (order) => console.log("View order:", order),
  onCreate,
}: OrdersProps) => {
  // Sort orders by creation date (newest first) and take last 10
  const latestOrders = [...orders]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  if (!products.length || !suppliers.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        Cannot manage orders:{" "}
        {!products.length ? "No products available. " : ""}
        {!suppliers.length ? "No suppliers available." : ""}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  return (
    <>
      <div className="p-4 border-b flex justify-center items-center">
        <OrderForm
          shopId={shopId}
          products={products}
          suppliers={suppliers}
          onSubmit={async (order) => {
            if (onCreate) {
              await onCreate(order as unknown as CreateOrderInput);
              return { success: true };
            }
            return {
              success: false,
              error: new Error("onCreate not provided"),
            };
          }}
        />
      </div>

      {!orders?.length ? (
        <div className="p-4 text-center">No orders found</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          {/* Mobile View */}
          <div className="block sm:hidden">
            {latestOrders.map((order) => (
              <div
                key={order.id}
                className="border-b p-4 space-y-2 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium">Shop: {order.shop.name}</div>
                  <div className="flex space-x-2">
                    {onView && (
                      <button
                        onClick={() => onView(order)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(order)}
                        className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-50"
                      >
                        <Pencil size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(order)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Customer: {order.user.name || "N/A"}</div>
                  <div>
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div>Total: {formatCurrency(order.totalAmount)}</div>
                  <div>Status: {order.status}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden sm:block">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Shop Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Customer Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Order Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Total Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {latestOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{order.shop.name}</td>
                    <td className="px-4 py-3 text-sm">
                      {order.user.name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === OrderStatus.DELIVERED
                            ? "bg-green-100 text-green-800"
                            : order.status === OrderStatus.PENDING
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === OrderStatus.CANCELLED
                            ? "bg-red-100 text-red-800"
                            : order.status === OrderStatus.SHIPPED
                            ? "bg-blue-100 text-blue-800"
                            : order.status === OrderStatus.CONFIRMED
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        {onView && (
                          <button
                            onClick={() => onView(order)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(order)}
                            className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-50"
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(order)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersTable;
