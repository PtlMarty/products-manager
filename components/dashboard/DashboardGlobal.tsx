"use client";

//TODO: Add Orders and Suppliers

import { Button } from "@/components/ui/atoms/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/molecules/tabs";
import { useProducts } from "@/lib/hooks/useProducts";
import { useSuppliers } from "@/lib/hooks/UseSuppliers";
import { Product, Shop, Supplier } from "@prisma/client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { DashboardCharts } from "./charts/DashboardCharts";
import { DashboardMetrics } from "./charts/DashboardMetrics";
import { DashboardProducts } from "./DashboardProducts";
import { DashboardSuppliers } from "./DashboardSuppliers";
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
    totalSuppliers: number;
    activeSuppliers: number;
  };
  supplierData: { name: string; value: number }[];
}

const PRODUCTS_LIMIT = 6;
const SUPPLIERS_LIMIT = 6;

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
  suppliers: initialSuppliers,
  totalProductsCount,
}: DashboardGlobalProps) => {
  const {
    products,
    handleDeleteProduct,
    handleCreateProduct,
    handleUpdateProduct,
  } = useProducts(initialProducts);
  const { suppliers, removeSupplier, addSupplier } =
    useSuppliers(initialSuppliers);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    monthlyData: [],
    categoryData: [],
    shopData: [],
    metrics: {
      totalProducts: 0,
      totalValue: 0,
      avgValue: 0,
      totalSuppliers: 0,
      activeSuppliers: 0,
    },
    supplierData: [],
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

  const getDisplaySuppliers = useCallback(() => {
    return suppliers
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, SUPPLIERS_LIMIT);
  }, [suppliers]);

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

    // Calculate supplier distribution data
    const supplierData = suppliers.map((supplier) => {
      const supplierProducts = products.filter(
        (product) => product.supplierId === supplier.id
      );
      const totalValue =
        supplierProducts.reduce((sum, product) => sum + product.price, 0) / 100;
      return {
        name: supplier.name,
        value: totalValue,
      };
    });

    // Calculate active suppliers (suppliers with at least one product)
    const activeSuppliers = suppliers.filter((supplier) =>
      products.some((product) => product.supplierId === supplier.id)
    ).length;

    setDashboardData({
      monthlyData,
      categoryData,
      shopData,
      metrics: {
        totalProducts: totalProductsCount,
        totalValue,
        avgValue,
        totalSuppliers: suppliers.length,
        activeSuppliers,
      },
      supplierData,
    });
  }, [products, shops, totalProductsCount, suppliers]);

  useEffect(() => {
    calculateDashboardData();
  }, [calculateDashboardData]);

  if (!shops.length) {
    return <EmptyState />;
  }

  return (
    <div className="p-2 sm:p-4 space-y-4 max-w-[1400px] mx-auto">
      {/*  onglet for supplier and product */}
      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <DashboardProducts
            products={getDisplayProducts()}
            shops={shops}
            suppliers={suppliers}
            onDelete={handleDeleteProduct}
            onSubmit={handleCreateProduct}
            onUpdate={handleUpdateProduct}
          />
        </TabsContent>
        <TabsContent value="suppliers">
          <DashboardSuppliers
            suppliers={getDisplaySuppliers()}
            shops={shops}
            onDelete={removeSupplier}
            onSubmit={addSupplier}
          />
        </TabsContent>
      </Tabs>
      <Tabs defaultValue="charts">
        <TabsList>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>
        <TabsContent value="charts">
          <DashboardCharts
            monthlyData={dashboardData.monthlyData}
            supplierData={dashboardData.supplierData}
          />
        </TabsContent>
        <TabsContent value="metrics">
          <DashboardMetrics metrics={dashboardData.metrics} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardGlobal;
