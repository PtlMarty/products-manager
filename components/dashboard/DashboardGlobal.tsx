"use client";

import { useProducts } from "@/lib/hooks/useProducts";
import { Product, Shop, Supplier } from "@prisma/client";
import { CreditCard, ShoppingBag, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
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

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff0000"];
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

const ChartCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-sm font-medium mb-4">{title}</h3>
    <div className="h-[200px]">{children}</div>
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
    metrics: { totalProducts: 0, totalValue: 0, avgValue: 0 },
  });

  const calculateDashboardData = useCallback(
    (currentProducts: Product[]) => {
      const totalValue =
        currentProducts.reduce((sum, product) => sum + product.price, 0) / 100;
      const avgValue = totalValue / (currentProducts.length || 1);

      // Monthly data calculation
      const monthlyStats = currentProducts.reduce(
        (acc: Record<string, number>, product) => {
          const month = new Date(product.createdAt).toLocaleString("default", {
            month: "short",
          });
          acc[month] = (acc[month] || 0) + product.price / 100;
          return acc;
        },
        {}
      );

      // Shop distribution calculation
      const shopStats = currentProducts.reduce(
        (acc: Record<string, number>, product) => {
          const shop =
            shops.find((s) => s.id === product.shopId)?.name || "Unknown";
          acc[shop] = (acc[shop] || 0) + product.price / 100;
          return acc;
        },
        {}
      );

      const total = Object.values(shopStats).reduce((a, b) => a + b, 0);

      setDashboardData({
        monthlyData: Object.entries(monthlyStats).map(([month, sales]) => ({
          month,
          sales,
        })),
        categoryData: Object.entries(shopStats).map(([name, sales]) => ({
          name,
          sales: Number(((sales / total) * 100).toFixed(1)),
        })),
        metrics: {
          totalProducts: currentProducts.length,
          totalValue,
          avgValue,
        },
      });
    },
    [shops]
  );

  // Initialize dashboard data
  useEffect(() => {
    calculateDashboardData(products);
  }, [products, calculateDashboardData]);

  const getDisplayProducts = useCallback(() => {
    return products
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, PRODUCTS_LIMIT);
  }, [products]);

  const { metrics, monthlyData, categoryData } = dashboardData;

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col gap-4 justify-center items-center">
        <ProductsTable
          products={getDisplayProducts()}
          onDelete={handleDeleteProduct}
          className="w-full"
          suppliers={suppliers}
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
          value={metrics.totalProducts}
          subtitle="Total Products"
          color="blue"
        />
        <MetricCard
          icon={CreditCard}
          title="Total Value"
          value={`¥${metrics.totalValue.toLocaleString()}`}
          subtitle="Combined Value"
          color="green"
        />
        <MetricCard
          icon={TrendingUp}
          title="Average Value"
          value={`¥${metrics.avgValue.toLocaleString()}`}
          subtitle="Per Product"
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ChartCard title="Monthly Value">
          <ResponsiveContainer>
            <AreaChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [
                  `¥${value.toLocaleString()}`,
                  "Sales",
                ]}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Shop Distribution">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="sales"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Products by Shop">
          <ResponsiveContainer>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default DashboardGlobal;
