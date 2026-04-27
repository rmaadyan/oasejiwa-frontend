"use client";

import { Search, SlidersHorizontal, Download } from "lucide-react";
import type { SortOption, GenderFilter } from "@/lib/types/users";

interface UserFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  genderFilter: GenderFilter;
  onGenderFilterChange: (value: GenderFilter) => void;
  perPage: number;
  onPerPageChange: (value: number) => void;
  onExport: () => void;
  totalUsers: number;
}

export default function UserFilterBar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  genderFilter,
  onGenderFilterChange,
  perPage,
  onPerPageChange,
  onExport,
  totalUsers
}: UserFilterBarProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="w-full lg:w-48">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="name-asc">Nama A-Z</option>
            <option value="name-desc">Nama Z-A</option>
            <option value="most-bookings">Tersering Booking</option>
          </select>
        </div>

        {/* Gender Filter */}
        <div className="w-full lg:w-48">
          <select
            value={genderFilter}
            onChange={(e) => onGenderFilterChange(e.target.value as GenderFilter)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
          >
            <option value="all">Semua Gender</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>
        </div>

        {/* Per Page */}
        <div className="w-full lg:w-32">
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
        </div>

        {/* Export Button */}
        <button
          onClick={onExport}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Info */}
      <div className="mt-3 text-xs text-gray-600">
        Menampilkan {totalUsers} user
      </div>
    </div>
  );
}
