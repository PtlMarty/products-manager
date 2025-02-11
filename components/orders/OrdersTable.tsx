"use client";

import {
  Order,
  OrderStatus,
  Product,
  Shop,
  Supplier,
  User,
} from "@prisma/client";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { BaseTable } from "../ui/organisms/base-table";
import type { OrderFormData } from "./OrderForm";
import { OrderForm } from "./OrderForm";

type ExtendedOrder = Order & { user: User; shop: Shop };

interface OrdersTableProps {
  orders: ExtendedOrder[];
  shopId: string;
  products: Product[];
  suppliers: Supplier[];
  shops?: Shop[];
  onCreate: (
    order: OrderFormData
  ) => Promise<{ success: boolean; data?: Order; error?: Error }>;
  onDelete?: (order: Order) => void;
  onEdit?: (order: Order) => void;
  onView?: (order: Order) => void;
}

const OrdersTable = ({
  orders,
  shopId,
  products,
  suppliers,
  shops,
  onDelete,
  onEdit,
  onView,
  onCreate,
}: OrdersTableProps) => {
  const { data: session } = useSession();

  // Sort orders by creation date (newest first) and take last 5
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

  const columns = [
    {
      header: "Shop Name",
      accessor: (order: ExtendedOrder) => order.shop.name,
    },
    {
      header: "Customer Name",
      accessor: (order: ExtendedOrder) => order.user.name || "N/A",
    },
    {
      header: "Order Date",
      accessor: (order: ExtendedOrder) =>
        new Date(order.createdAt).toLocaleDateString(),
    },
    {
      header: "Total Amount",
      accessor: (order: ExtendedOrder) => formatCurrency(order.totalAmount),
    },
    {
      header: "Status",
      accessor: (order: ExtendedOrder) => (
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
      ),
    },
  ];

  const actions = [
    {
      icon: <Eye size={20} />,
      onClick: (order: ExtendedOrder) => onView?.(order),
      label: "View order",
      className:
        "text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded-full",
    },
    {
      icon: <Pencil size={20} />,
      onClick: (order: ExtendedOrder) => onEdit?.(order),
      label: "Edit order",
      className:
        "text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-gray-50 rounded-full",
    },
    {
      icon: <Trash2 size={20} />,
      onClick: (order: ExtendedOrder) => onDelete?.(order),
      label: "Delete order",
      className:
        "text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-full",
    },
  ].filter((action) => {
    if (action.label.startsWith("View") && !onView) return false;
    if (action.label.startsWith("Edit") && !onEdit) return false;
    if (action.label.startsWith("Delete") && !onDelete) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <OrderForm
          shopId={shopId}
          products={products}
          suppliers={suppliers}
          shops={shops}
          session={session}
          onSubmit={onCreate}
        />
      </div>

      <BaseTable<ExtendedOrder>
        data={latestOrders}
        columns={columns}
        actions={actions}
        emptyMessage="No orders found"
        mobileAccessor={(order) =>
          `${order.shop.name} - ${formatCurrency(order.totalAmount)}`
        }
      />
    </div>
  );
};

export default OrdersTable;
