"use client";

import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import PatientCard from "./patientcard";
import type { PsychologistPatient } from "@/lib/types/psychologist";

interface PatientsListProps {
  patients?: PsychologistPatient[];
  onViewDetails: (patient: PsychologistPatient) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sortBy: "name" | "lastSession" | "totalSessions") => void;
  sortBy: "name" | "lastSession" | "totalSessions";
}

export default function PatientsList({
  patients,
  onViewDetails,
  onSearchChange,
  onSortChange,
  sortBy,
}: PatientsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // 🟢 1. Amankan array data
  const safePatients = useMemo(() => (Array.isArray(patients) ? patients : []), [patients]);

  // 🟢 2. Filter Real-Time berdasarkan nama/email pasien secara otomatis
  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) return safePatients;
    const term = searchTerm.toLowerCase();
    return safePatients.filter((patient: any) => {
      const name = (patient.name || patient.fullName || "").toLowerCase();
      const email = (patient.email || "").toLowerCase();
      const phone = (patient.phone || patient.phoneNumber || "").toLowerCase();
      return name.includes(term) || email.includes(term) || phone.includes(term);
    });
  }, [safePatients, searchTerm]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
    setCurrentPage(1); // Reset ke halaman pertama saat melakukan pencarian
  };

  // Pagination berdasarkan hasil filter
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-4 font-poppins">
      {/* 🟢 BARIS SEARCH & SORT */}
      <div className="bg-white p-5 rounded-2xl border-2 border-slate-500 shadow-xs space-y-2">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Input Search Nama / Email */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Cari nama, email, atau nomor HP pasien..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Sort Select */}
          <select
            value={sortBy}
            onChange={(e) =>
              onSortChange(
                e.target.value as "name" | "lastSession" | "totalSessions"
              )
            }
            className="px-4 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none cursor-pointer"
          >
            <option value="name">Urutkan: Nama</option>
            <option value="lastSession">Urutkan: Sesi Terakhir</option>
            <option value="totalSessions">Urutkan: Total Sesi</option>
          </select>
        </div>
      </div>

      {/* 🟢 TAMPILAN JIKA PASIEN TIDAK DITEMUKAN */}
      {filteredPatients.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-600 font-semibold text-sm">Tidak ada pasien ditemukan</p>
          <p className="text-xs text-gray-400 mt-1">
            {searchTerm
              ? `Tidak ada kata kunci "${searchTerm}" pada daftar pasien Anda`
              : "Belum ada data pasien yang terdaftar"}
          </p>
        </div>
      ) : (
        /* 🟢 GRID PATIENT CARD */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentPatients.map((patient: any) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}

      {/* 🟢 PAGINASI */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 text-xs">
          <div className="text-gray-500">
            Menampilkan {startIndex + 1}-
            {Math.min(endIndex, filteredPatients.length)} dari {filteredPatients.length}{" "}
            pasien
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
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
                      className={`min-w-7 h-7 px-2 rounded-lg font-medium transition cursor-pointer ${
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
                  return (
                    <span key={page} className="px-1 text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}