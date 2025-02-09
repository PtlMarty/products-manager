import { CreditCard, ShoppingBag, TrendingUp } from "lucide-react";
import { MetricCard } from "../MetricCard";

interface DashboardMetricsProps {
  metrics: {
    totalProducts: number;
    totalValue: number;
    avgValue: number;
  };
}

export const DashboardMetrics = ({ metrics }: DashboardMetricsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <MetricCard
        icon={ShoppingBag}
        title="Products"
        value={metrics.totalProducts}
        subtitle="Total products"
        color="text-blue-500"
      />
      <MetricCard
        icon={CreditCard}
        title="Total Value"
        value={`$${metrics.totalValue.toFixed(2)}`}
        subtitle="Total inventory value"
        color="text-green-500"
      />
      <MetricCard
        icon={TrendingUp}
        title="Average Value"
        value={`$${metrics.avgValue.toFixed(2)}`}
        subtitle="Average product value"
        color="text-purple-500"
      />
    </div>
  );
};
