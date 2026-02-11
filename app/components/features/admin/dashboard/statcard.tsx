import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    label: string;
    isPositive?: boolean;
  };
}

export default function StatCard({
  title,
  value,
  subtitle,
  trend
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-3xl font-bold text-[#2B5379] mt-2">{value}</p>
      {(trend || subtitle) && (
        <div className="flex items-center gap-1 mt-2">
          {trend && (
            <>
              <span className={`text-xs font-medium ${
                trend.isPositive !== false ? "text-green-600" : "text-red-600"
              }`}>
                {trend.value}
              </span>
              <span className="text-xs text-gray-500">{trend.label}</span>
            </>
          )}
          {!trend && subtitle && (
            <span className="text-xs text-gray-500">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}
