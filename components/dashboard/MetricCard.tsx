interface MetricCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
}

export const MetricCard = ({
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
