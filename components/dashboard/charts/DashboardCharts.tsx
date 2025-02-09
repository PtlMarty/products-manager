import { useState } from "react";
import {
  Area,
  AreaChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Props as LegendProps } from "recharts/types/component/DefaultLegendContent";
import { CustomActiveShape } from "./CustomActiveShape";

interface DashboardChartsProps {
  monthlyData: { month: string; sales: number }[];
  supplierData: { name: string; value: number }[];
}

// Define an array of colors for the pie chart segments
const COLORS = [
  "#4F46E5", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#6366F1", // Violet
  "#F97316", // Orange
];

// Custom renderer for the legend
const renderLegend = (props: LegendProps) => {
  const { payload } = props;

  if (!payload) return null;

  return (
    <ul className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          />
          <span className="text-sm text-gray-600">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

export const DashboardCharts = ({
  monthlyData,
  supplierData,
}: DashboardChartsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
        <h3 className="text-base sm:text-lg font-semibold mb-4">
          Monthly Sales
        </h3>
        <div className="h-[250px] sm:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
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
          Product Distribution by Supplier
        </h3>
        <div className="h-[250px] sm:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={CustomActiveShape}
                data={supplierData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                onMouseEnter={onPieEnter}
                stroke="none"
              >
                {supplierData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                content={renderLegend}
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
