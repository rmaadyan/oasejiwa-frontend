"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { useState } from "react";

interface MonthlyChartProps {
  data: Array<{ month: string; value: number }>;
  height?: number;
  compact?: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-900">
          {payload[0].payload.month}: {payload[0].value} pasien
        </p>
      </div>
    );
  }
  return null;
};

export default function MonthlyChart({
  data,
  height = 250,
  compact = false,
}: MonthlyChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        onMouseMove={(state: any) => {
          if (state.isTooltipActive) {
            setHoveredIndex(state.activeTooltipIndex);
          } else {
            setHoveredIndex(null);
          }
        }}
        onMouseLeave={() => setHoveredIndex(null)}
        barGap={6}
        barCategoryGap="25%"
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
      >
        {!compact && (
          <>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              domain={[0, 500]}
              width={30}
              tickCount={6}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
          </>
        )}
        <Bar
          dataKey="value"
          radius={[6, 6, 0, 0]}
          animationDuration={800}
          maxBarSize={18}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={hoveredIndex === index ? "#1E40AF" : "#2B5379"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
