"use client";

interface AnalyticsStatsProps {
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: { direction: "up" | "down"; percent: number };
}

export default function AnalyticsStats({
  label,
  value,
  sublabel,
  trend,
}: AnalyticsStatsProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          {sublabel && <p className="text-xs text-gray-500 mt-1">{sublabel}</p>}
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold ${
              trend.direction === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.direction === "up" ? "↑" : "↓"} {trend.percent}%
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
