"use client";

import { Calendar as CalendarIcon, List } from "lucide-react";
import type { SessionStatus } from "@/lib/types/psychologist";

interface FilterBarProps {
  view: "calendar" | "list";
  onViewChange: (view: "calendar" | "list") => void;
  statusFilter: SessionStatus | "all";
  onStatusFilterChange: (status: SessionStatus | "all") => void;
}

export default function FilterBar({
  view,
  onViewChange,
  statusFilter,
  onStatusFilterChange,
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* View Toggle */}
        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => onViewChange("calendar")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view === "calendar"
                ? "bg-white text-[#2B5379] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            Kalender
          </button>
          <button
            onClick={() => onViewChange("list")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              view === "list"
                ? "bg-white text-[#2B5379] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <List className="w-4 h-4" />
            List
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as SessionStatus | "all")}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="upcoming">Akan Datang</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>
      </div>
    </div>
  );
}
