"use client";

import { Download } from "lucide-react";
import { downloadToCSV } from "@/lib/utils/csv-export";

interface AnalyticsHeaderProps {
  data: any[];
}

export default function AnalyticsHeader({ data }: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
      <button 
        onClick={() => downloadToCSV(data, 'analytics-data.csv')}
        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Download size={16} />
        Download CSV
      </button>
    </div>
  );
}
