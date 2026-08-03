"use client";

import { Search, Plus, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useState } from "react";
import NoteCard from "./notecard";
import type { SessionNote } from "@/lib/types/psychologist";

interface NotesListProps {
  notes: SessionNote[];
  onViewDetails: (note: SessionNote) => void;
  onCreateNote: () => void;
  onSearchChange: (search: string) => void;
  onRiskFilterChange: (risk: "low" | "medium" | "high" | "all") => void;
  onSortChange: (sortBy: "date" | "patient" | "riskLevel") => void;
  riskFilter: "low" | "medium" | "high" | "all";
  sortBy: "date" | "patient" | "riskLevel";
}

export default function NotesList({
  notes,
  onViewDetails,
  onCreateNote,
  onSearchChange,
  onRiskFilterChange,
  onSortChange,
  riskFilter,
  sortBy
}: NotesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
    setCurrentPage(1);
  };

  if (notes.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-600 font-medium">Tidak ada catatan</p>
        <p className="text-sm text-gray-500 mt-1">Belum ada catatan konseling dengan filter ini</p>
        <button
          onClick={onCreateNote}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#2B5379] text-white rounded-lg hover:bg-[#2B5379]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Buat Catatan Baru
        </button>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(notes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotes = notes.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari nama pasien atau kata kunci..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </div>

            {/* Risk Filter */}
            <select
              value={riskFilter}
              onChange={(e) => onRiskFilterChange(e.target.value as "low" | "medium" | "high" | "all")}
              className="text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none font-medium"
            >
              <option value="all">Semua Risk Level</option>
              <option value="high">Risiko Tinggi (High)</option>
              <option value="medium">Risiko Sedang (Medium)</option>
              <option value="low">Risiko Rendah (Low)</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as "date" | "patient" | "riskLevel")}
              className="text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none font-medium"
            >
              <option value="date">Urutkan: Tanggal Terbaru</option>
              <option value="patient">Urutkan: Nama Pasien</option>
              <option value="riskLevel">Urutkan: Risk Level</option>
            </select>

            {/* Create Button */}
            <button
              onClick={onCreateNote}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#2B5379] text-white rounded-lg hover:bg-[#2B5379]/90 text-xs font-semibold transition-colors shrink-0 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Buat Catatan Sesi
            </button>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-600">
            Menampilkan {startIndex + 1}-{Math.min(endIndex, notes.length)} dari {notes.length} catatan
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`min-w-8 h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-[#2B5379] text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="px-2 text-gray-400">...</span>;
                }
                return null;
              })}
            </div>
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
