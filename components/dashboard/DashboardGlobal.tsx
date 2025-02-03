"use client";

import { Button } from "@/components/ui/button";
import { useProducts } from "@/lib/hooks/useProducts";
import { Product, Shop, Supplier } from "@prisma/client";
import { CreditCard, ShoppingBag, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ProductForm } from "../products/ProductForm";
import { ProductsTable } from "../products/ProductsTable";

interface DashboardGlobalProps {
  shops: Shop[];
  products: Product[];
  suppliers: Supplier[];
}

interface DashboardData {
  monthlyData: { month: string; sales: number }[];
  categoryData: { name: string; sales: number }[];
  metrics: {
    totalProducts: number;
    totalValue: number;
    avgValue: number;
  };
}

interface MetricCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
}

const PRODUCTS_LIMIT = 6;

const MetricCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
}: MetricCardProps) => (
  <div className="bg-white p-4 rounded-lg shadow space-y-2">
    <div className="flex items-center space-x-2">
      <Icon className={`h-5 w-5 text-${color}-500`} />
      <span className="text-gray-600">{title}</span>
    </div>
    <div className="text-2xl font-bold">{value}</div>
    <div className={`text-${color}-500 text-sm`}>{subtitle}</div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
    <h2 className="text-2xl font-semibold text-gray-700">
      Welcome to your Dashboard
    </h2>
    <p className="text-gray-500">
      You don&apos;t have any shops yet. Create one to get started!
    </p>
    <Button asChild>
      <Link href="/dashboard/shops">Create Shop</Link>
    </Button>
  </div>
);

const DashboardGlobal = ({
  shops,
  products: initialProducts,
  suppliers,
}: DashboardGlobalProps) => {
  const { products, handleDeleteProduct, handleCreateProduct } =
    useProducts(initialProducts);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    monthlyData: [],
    categoryData: [],
    metrics: {
      totalProducts: 0,
      totalValue: 0,
      avgValue: 0,
    },
  });

  const getDisplayProducts = useCallback(() => {
    // Group products by shop
    const productsByShop = products.reduce(
      (acc: Record<string, Product[]>, product) => {
        if (!acc[product.shopId]) {
          acc[product.shopId] = [];
        }
        acc[product.shopId].push(product);
        return acc;
      },
      {}
    );

    // Get the most recent 6 products for each shop
    const limitedProducts = Object.values(productsByShop).flatMap(
      (shopProducts) =>
        shopProducts
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, PRODUCTS_LIMIT)
    );

    return limitedProducts;
  }, [products]);

  const calculateDashboardData = useCallback(() => {
    const totalValue =
      products.reduce((sum, product) => sum + product.price, 0) / 100;
    const avgValue = totalValue / (products.length || 1);

    const monthlyStats = products.reduce(
      (acc: Record<string, number>, product) => {
        const month = new Date(product.createdAt).toLocaleString("default", {
          month: "short",
        });
        acc[month] = (acc[month] || 0) + product.price / 100;
        return acc;
      },
      {}
    );

    const monthlyData = Object.entries(monthlyStats).map(([month, sales]) => ({
      month,
      sales,
    }));

    const categoryData = Object.entries(
      products.reduce((acc: Record<string, number>, product) => {
        acc[product.name] = (acc[product.name] || 0) + product.price / 100;
        return acc;
      }, {})
    ).map(([name, sales]) => ({ name, sales }));

    setDashboardData({
      monthlyData,
      categoryData,
      metrics: {
        totalProducts: products.length,
        totalValue,
        avgValue,
      },
    });
  }, [products]);

  useEffect(() => {
    calculateDashboardData();
  }, [calculateDashboardData]);

  if (!shops.length) {
    return <EmptyState />;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col gap-4 justify-center items-center">
        <ProductsTable
          products={getDisplayProducts()}
          onDelete={handleDeleteProduct}
          className="w-full"
          suppliers={suppliers}
          shops={shops}
        />
        <ProductForm
          shopId={shops[0].id}
          onSubmit={handleCreateProduct}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-fit"
          suppliers={suppliers}
        />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          icon={ShoppingBag}
          title="Products"
          value={dashboardData.metrics.totalProducts}
          subtitle="Total products"
          color="text-blue-500"
        />
        <MetricCard
          icon={CreditCard}
          title="Total Value"
          value={`$${dashboardData.metrics.totalValue.toFixed(2)}`}
          subtitle="Total inventory value"
          color="text-green-500"
        />
        <MetricCard
          icon={TrendingUp}
          title="Average Value"
          value={`$${dashboardData.metrics.avgValue.toFixed(2)}`}
          subtitle="Average product value"
          color="text-purple-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dashboardData.monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#4F46E5"
                fill="#4F46E5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Product Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dashboardData.categoryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardGlobal;
