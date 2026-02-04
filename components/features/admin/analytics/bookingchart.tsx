"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { useState } from "react";

interface BookingChartProps {
  data: {
    returning: number;
    new: number;
  };
  compact?: boolean;
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export default function BookingChart({ data, compact = false }: BookingChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = [
    { name: "Klien Lama", value: data.returning, color: "#3B82F6" },
    { name: "Klien Baru", value: data.new, color: "#EF4444" },
  ];

  const total = data.returning + data.new;

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const size = compact ? { inner: 50, outer: 70, height: 240 } : { inner: 70, outer: 90, height: 280 };

  return (
    <div className={`h-${size.height} relative`} style={{ height: `${size.height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex !== null ? activeIndex : undefined}
            activeShape={renderActiveShape}
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={size.inner}
            outerRadius={size.outer}
            paddingAngle={2}
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Total di tengah donut */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <div className="text-[10px] text-gray-500 uppercase mb-0.5">Total</div>
        <div className={`${compact ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900`}>
          {total}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
        {chartData.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-700">{entry.name}</span>
              <span className="text-xs font-semibold text-gray-900">
                {entry.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
