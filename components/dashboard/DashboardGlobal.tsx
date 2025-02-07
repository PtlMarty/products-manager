"use client";

//TODO: Add Orders and Suppliers

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
  totalProductsCount: number;
}

interface DashboardData {
  monthlyData: { month: string; sales: number }[];
  categoryData: { name: string; sales: number }[];
  shopData: { name: string; value: number }[];
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
  <div className="bg-white p-4 rounded-lg shadow space-y-2 w-full">
    <div className="flex items-center space-x-2">
      <Icon className={`h-5 w-5 text-${color}-500`} />
      <span className="text-gray-600 text-sm sm:text-base">{title}</span>
    </div>
    <div className="text-xl sm:text-2xl font-bold">{value}</div>
    <div className={`text-${color}-500 text-xs sm:text-sm`}>{subtitle}</div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 space-y-4 text-center">
    <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
      Welcome to your Dashboard
    </h2>
    <p className="text-gray-500 text-sm sm:text-base px-4">
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
  totalProductsCount,
}: DashboardGlobalProps) => {
  const { products, handleDeleteProduct, handleCreateProduct } =
    useProducts(initialProducts);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    monthlyData: [],
    categoryData: [],
    shopData: [],
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

    // Calculate shop distribution data
    const shopData = shops.map((shop) => {
      const shopProducts = products.filter(
        (product) => product.shopId === shop.id
      );
      const totalValue =
        shopProducts.reduce((sum, product) => sum + product.price, 0) / 100;
      return {
        name: shop.name,
        value: totalValue,
      };
    });

    setDashboardData({
      monthlyData,
      categoryData,
      shopData,
      metrics: {
        totalProducts: totalProductsCount,
        totalValue,
        avgValue,
      },
    });
  }, [products, shops, totalProductsCount]);

  useEffect(() => {
    calculateDashboardData();
  }, [calculateDashboardData]);

  if (!shops.length) {
    return <EmptyState />;
  }

  return (
    <div className="p-2 sm:p-4 space-y-4 max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-4">
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <div className="min-w-full inline-block align-middle">
            <ProductsTable
              products={getDisplayProducts()}
              onDelete={handleDeleteProduct}
              className="w-full"
              suppliers={suppliers}
              shops={shops}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <ProductForm
            shopId={shops[0].id}
            onSubmit={handleCreateProduct}
            className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded hover:bg-blue-600 w-fit"
            suppliers={suppliers}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-4">
            Monthly Sales
          </h3>
          <div className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
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
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-4">
            Product Distribution
          </h3>
          <div className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.categoryData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="sales" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGlobal;
