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
  LabelList,
} from "recharts";
import { useState, useMemo } from "react";
import { MONTH_LABELS } from "@/lib/data/mock-ui-data";

interface MonthlyChartProps {
  data?: Array<{ month: string; value: number }>;
  height?: number;
  compact?: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-900">
          {payload[0].payload.monthLabel}: {payload[0].value} pasien
        </p>
      </div>
    );
  }
  return null;
};

const CustomLabel = (props: any) => {
  const { x, y, width, height, value } = props;
  
  if (height < 25) return null;
  
  return (
    <text
      x={x + width / 2}
      y={y + height - 10}
      fill="#FFFFFF"
      textAnchor="middle"
      fontSize={12}
      fontWeight={700}
    >
      {value}
    </text>
  );
};

export default function MonthlyChart({
  data,
  height = 250,
  compact = false,
}: MonthlyChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("2026");

  const years = ["2024", "2025", "2026"];

  // Pastikan data tidak undefined
  const chartData = data && data.length > 0 ? data : [];

  // Calculate dynamic max value
  const maxValue = useMemo(() => {
    if (chartData.length === 0) return 400;
    const dataMax = Math.max(...chartData.map((item) => item.value));
    return Math.ceil(dataMax / 100) * 100;
  }, [chartData]);

  // Transform data
  const dataWithIndex = useMemo(() => {
    return chartData.map((item, idx) => ({
      ...item,
      monthIndex: idx,
      monthLabel: MONTH_LABELS[idx] || item.month,
    }));
  }, [chartData]);

  // Generate unique key berdasarkan data untuk force re-render
  const chartKey = useMemo(() => {
    return dataWithIndex.map(d => d.value).join('-');
  }, [dataWithIndex]);

  if (dataWithIndex.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Tidak ada data untuk ditampilkan
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Year Filter */}
      <div className="flex gap-2">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="text-xs text-gray-600 border border-gray-200 rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer bg-white"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* PENTING: key={chartKey} untuk force re-render */}
      <ResponsiveContainer width="100%" height={height} key={chartKey}>
        <BarChart
          data={dataWithIndex}
          onMouseMove={(state: any) => {
            if (state.isTooltipActive) {
              setHoveredIndex(state.activeTooltipIndex);
            } else {
              setHoveredIndex(null);
            }
          }}
          onMouseLeave={() => setHoveredIndex(null)}
          barGap={6}
          barCategoryGap="20%"
          margin={{ top: 10, right: 20, left: 15, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E5E7EB"
            vertical={false}
          />
          
          <XAxis
            dataKey="monthLabel"
            tick={{ 
              fontSize: 12, 
              fill: "#6B7280", 
              fontWeight: 600 
            }}
            axisLine={{ stroke: "#E5E7EB" }}
            tickLine={false}
            tickMargin={12}
            interval={0}
            height={40}
          />
          
          <YAxis
            tick={{ 
              fontSize: 12, 
              fill: "#6B7280", 
              fontWeight: 600 
            }}
            axisLine={{ stroke: "#E5E7EB" }}
            tickLine={false}
            domain={[0, maxValue]}
            width={50}
            tickCount={6}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={false} />
          
          <Bar
            dataKey="value"
            radius={[8, 8, 8, 8]}
            animationDuration={800}
            maxBarSize={40}
            fillOpacity={0.85}
          >
            <LabelList content={<CustomLabel />} />
            {dataWithIndex.map((entry, index) => (
              <Cell
                key={`cell-${index}-${entry.value}`}
                fill={hoveredIndex === index ? "#1E40AF" : "#2B5379"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
