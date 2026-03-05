"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface BookingChartProps {
  data: { returning: number; new: number };
  compact?: boolean;
}

const COLORS = {
  returning: "#3B82F6", // Blue
  new: "#EF4444",       // Red
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-900">
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function BookingChart({ data, compact = false }: BookingChartProps) {
  const chartData = [
    { name: "Klien Lama", value: data.returning, color: COLORS.returning },
    { name: "Klien Baru", value: data.new, color: COLORS.new },
  ];

  const total = data.returning + data.new;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative py-4">
      {/* Chart Container */}
      <div className="relative w-full" style={{ height: compact ? "200px" : "240px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={compact ? 50 : 60}
              outerRadius={compact ? 80 : 90}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label - TOTAL */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-xs text-gray-500 font-medium">TOTAL</div>
            <div className="text-3xl font-bold text-gray-900">{total}</div>
          </div>
        </div>
      </div>

      {/* Legend - INSIDE CARD */}
      <div className="flex items-center justify-center gap-6 mt-6 px-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
          <div className="text-sm whitespace-nowrap">
            <span className="text-gray-600">Klien Lama</span>
            <span className="ml-2 font-semibold text-gray-900">{data.returning}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
          <div className="text-sm whitespace-nowrap">
            <span className="text-gray-600">Klien Baru</span>
            <span className="ml-2 font-semibold text-gray-900">{data.new}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
