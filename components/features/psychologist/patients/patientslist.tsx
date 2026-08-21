"use client";

import { Search, ChevronLeft, ChevronRight, Building, Globe, Users } from "lucide-react";
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
  const [filterType, setFilterType] = useState<"ALL" | "ONLINE" | "OFFLINE">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const safePatients = useMemo(() => (Array.isArray(patients) ? patients : []), [patients]);

  // 🟢 Filter Real-time Murni (Bebas tebak nama)
  const isPatientOffline = (patient: any) => {
    if (!patient) return false;

    // 1. Jika backend sudah menandai OFFLINE
    if (patient.registrationType === "OFFLINE") return true;

    // 2. Jika ada tag [OFFLINE] pada catatan atau email internal
    const emailStr = String(patient.email || "").toLowerCase();
    if (emailStr.endsWith("@oasejiwa.com")) return true;

    const notesStr = String(patient.notes || "").toLowerCase();
    if (notesStr.includes("offline")) return true;

    if (Array.isArray(patient.sessions)) {
      return patient.sessions.some((s: any) =>
        String(s.notes || "").toLowerCase().includes("offline")
      );
    }

    return false;
  };

  const filteredPatients = useMemo(() => {
    return safePatients.filter((patient: any) => {
      const isOffline = isPatientOffline(patient);

      if (filterType === "ONLINE" && isOffline) return false;
      if (filterType === "OFFLINE" && !isOffline) return false;

      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      const name = (patient.name || patient.fullName || "").toLowerCase();
      const email = (patient.email || "").toLowerCase();
      const phone = (patient.phone || patient.phoneNumber || "").toLowerCase();
      return name.includes(term) || email.includes(term) || phone.includes(term);
    });
  }, [safePatients, searchTerm, filterType]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const offlineCount = useMemo(
    () => safePatients.filter((p: any) => isPatientOffline(p)).length,
    [safePatients]
  );
  const onlineCount = safePatients.length - offlineCount;

  return (
    <div className="space-y-4 font-poppins">
      {/* FILTER TAB ONLINE / OFFLINE */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => {
            setFilterType("ALL");
            setCurrentPage(1);
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            filterType === "ALL"
              ? "bg-[#2B5379] text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Semua Pasien ({safePatients.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setFilterType("ONLINE");
            setCurrentPage(1);
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            filterType === "ONLINE"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Booking Online ({onlineCount})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setFilterType("OFFLINE");
            setCurrentPage(1);
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            filterType === "OFFLINE"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Pasien Offline ({offlineCount})</span>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex flex-col lg:flex-row gap-4">
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

      {/* GRID PATIENT CARD */}
      {filteredPatients.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-600 font-semibold text-sm">Tidak ada pasien ditemukan</p>
          <p className="text-xs text-gray-400 mt-1">
            {searchTerm
              ? `Tidak ada kata kunci "${searchTerm}" pada daftar pasien`
              : "Belum ada data pasien pada filter ini"}
          </p>
        </div>
      ) : (
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

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 text-xs">
          <div className="text-gray-500">
            Menampilkan {startIndex + 1}-
            {Math.min(endIndex, filteredPatients.length)} dari {filteredPatients.length} pasien
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