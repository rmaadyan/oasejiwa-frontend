import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
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
  icon: Icon,
  iconBgColor,
  iconColor,
  trend
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
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
        <div className={`h-14 w-14 ${iconBgColor} rounded-full flex items-center justify-center shrink-0`}>
          <Icon className={`h-7 w-7 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
