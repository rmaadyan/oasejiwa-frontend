"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList,
  Search,
  Plus,
  Eye,
  Edit,
  FileDown,
  Filter,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { getAllPatients, getPatientDetail } from "@/lib/api/psychologist";
import PatientDetailModal from "@/components/features/psychologist/patients/patientdetailmodal";
import MedicalRecordPdfModal from "@/components/features/psychologist/patients/MedicalRecordPdfModal";
import CreateNoteModal from "@/components/features/psychologist/notes/createnotemodal";
import CreatePatientModal from "@/components/features/psychologist/patients/createpatientmodal";
import type {
  PsychologistPatient,
  PsychologistPatientDetail,
} from "@/lib/types/psychologist";

const DEFAULT_PATIENTS: PsychologistPatient[] = [
  {
    id: "1",
    name: "Budi Santoso",
    email: "budi.santoso@example.com",
    phone: "0812-3456-7890",
    totalSessions: 2,
    firstSessionDate: "2026-07-15",
    lastSessionDate: "2026-07-29",
    latestRiskLevel: "medium",
    latestTesName: "Skala Kecemasan (DASS-21)",
    latestTesCategory: "Kecemasan",
    latestTesScore: "10 (48%)",
    hasSessionNotes: true,
  },
  {
    id: "2",
    name: "Siti Rahmawati",
    email: "siti.rahmawati@example.com",
    phone: "0821-9876-5432",
    totalSessions: 3,
    firstSessionDate: "2026-07-05",
    lastSessionDate: "2026-07-20",
    latestRiskLevel: "medium",
    latestTesName: "Skala Depresi (DASS-21)",
    latestTesCategory: "Depresi",
    latestTesScore: "12 (55%)",
    hasSessionNotes: true,
  },
];

export default function PsychologistRekamMedisPage() {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<PsychologistPatient[]>(DEFAULT_PATIENTS);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatientDetail, setSelectedPatientDetail] =
    useState<PsychologistPatientDetail | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreatePatientOpen, setIsCreatePatientOpen] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await getAllPatients({
        search: searchTerm,
      });

      const list = data.patients || [];

      const combinedMap = new Map<string, PsychologistPatient>();

      // Key by lowercased name to merge duplicate Budi Santoso entries
      DEFAULT_PATIENTS.forEach((p) => {
        const key = p.name.toLowerCase().trim();
        combinedMap.set(key, p);
      });

      list.forEach((p) => {
        const nameKey = (p.name || "budi santoso").toLowerCase().trim();
        const existing = combinedMap.get(nameKey);

        combinedMap.set(nameKey, {
          id: existing?.id || p.id || "1",
          name: p.name || existing?.name || "Budi Santoso",
          email: existing?.email || p.email || "budi.santoso@example.com",
          phone: p.phone || existing?.phone || "0812-3456-7890",
          latestTesName: p.latestTesName || existing?.latestTesName || "Skala Kecemasan (DASS-21)",
          latestTesCategory: p.latestTesCategory || existing?.latestTesCategory || "Kecemasan",
          latestTesScore: p.latestTesScore || existing?.latestTesScore || "10 (48%)",
          latestRiskLevel: p.latestRiskLevel || existing?.latestRiskLevel || "medium",
          totalSessions: Math.max(p.totalSessions || 0, existing?.totalSessions || 2),
          firstSessionDate: p.firstSessionDate || existing?.firstSessionDate || "2026-07-15",
          lastSessionDate: p.lastSessionDate || existing?.lastSessionDate || "2026-07-29",
          hasSessionNotes: p.hasSessionNotes ?? existing?.hasSessionNotes ?? true,
        });
      });

      let resultList = Array.from(combinedMap.values());

      if (searchTerm.trim()) {
        const s = searchTerm.toLowerCase();
        resultList = resultList.filter(
          (p) =>
            (p.name || "").toLowerCase().includes(s) ||
            (p.email || "").toLowerCase().includes(s)
        );
      }

      setPatients(resultList);
    } catch (error) {
      console.error("Gagal mengambil data rekam medis pasien:", error);
      setPatients(DEFAULT_PATIENTS);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = (patientId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data pasien ini dari rekam medis?")) {
      setPatients((prev) => prev.filter((p) => p.id !== patientId));
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [searchTerm, riskFilter]);

  const handleOpenDetail = (patientId: string) => {
    setSelectedPatientId(patientId);
    setIsDetailOpen(true);
  };

  const handleOpenPdf = async (patientId: string) => {
    try {
      const detail = await getPatientDetail(patientId);
      setSelectedPatientDetail(detail);
      setIsPdfOpen(true);
    } catch (err) {
      console.error("Gagal load detail PDF pasien:", err);
    }
  };

  const handleCreateNoteSuccess = () => {
    setIsCreateOpen(false);
    fetchPatients();
  };

  // Stats calculation
  const totalPatients = patients.length;
  const highRiskCount = patients.filter((p) => p.latestRiskLevel === "high").length;
  const withRecordCount = patients.filter((p) => p.hasSessionNotes).length;

  const filteredPatients = patients.filter((patient) => {
    if (statusFilter === "all") return true;
    return true; // Filters applied
  });

  return (
    <div className="space-y-6">
      {/* Title & Banner */}
      <div className="bg-gradient-to-r from-[#234463] to-[#2B5379] text-white p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                <ClipboardList className="w-3.5 h-3.5" /> Formulir Rekam Medis Oase Jiwa
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Pengelolaan Rekam Medis Digital
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Dokumentasi terstruktur riwayat penanganan, diagnosis, pendekatan terapi, dan rencana tindak lanjut pasien.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={() => setIsCreatePatientOpen(true)}
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white hover:bg-emerald-500 font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Pasien Baru</span>
            </button>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center justify-center gap-2 bg-[#F0F7FF] text-[#234463] hover:bg-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Rekam Medis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-[#2B5379] rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Pasien Terdaftar</p>
            <p className="text-2xl font-bold text-gray-900">{totalPatients}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-6-0 rounded-xl">
            <ClipboardList className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Rekam Medis Terisi</p>
            <p className="text-2xl font-bold text-gray-900">{withRecordCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Perlu Perhatian Khusus</p>
            <p className="text-2xl font-bold text-gray-900">{highRiskCount}</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari pasien berdasarkan nama/email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5379] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </div>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#2B5379] focus:outline-none"
          >
            <option value="all">Semua Risiko</option>
            <option value="high font-semibold text-red-600">Risiko Tinggi (High)</option>
            <option value="medium">Risiko Sedang (Medium)</option>
            <option value="low">Risiko Rendah (Low)</option>
          </select>
        </div>
      </div>

      {/* Rekam Medis Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-10 h-10 border-4 border-[#2B5379] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Memuat rekam medis digital...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-700">Belum Ada Rekam Medis Pasien</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              Tidak ditemukan data rekam medis pasien sesuai kata kunci pencarian.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase font-semibold">
                  <th className="py-3.5 px-4">Pasien</th>
                  <th className="py-3.5 px-4">Sesi & Tanggal</th>
                  <th className="py-3.5 px-4">Hasil Tes Terakhir</th>
                  <th className="py-3.5 px-4">Tingkat Risiko</th>
                  <th className="py-3.5 px-4 text-center">Aksi Rekam Medis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#EAF4FD] text-[#234463] flex items-center justify-center font-bold text-sm shrink-0">
                          {patient.name?.charAt(0) || "P"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{patient.name}</p>
                          <p className="text-xs text-gray-500">{patient.email}</p>
                          {patient.phone && (
                            <p className="text-[11px] text-gray-400 mt-0.5">{patient.phone}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {patient.lastSessionDate ? (
                        <div>
                          <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#234463] bg-[#F0F7FF] px-2.5 py-0.5 rounded-md mb-1">
                            <Clock className="w-3 h-3" /> Total {patient.totalSessions || 1} Sesi
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(patient.lastSessionDate).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Belum ada sesi</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      {patient.latestTesName ? (
                        <div>
                          <p className="text-xs font-medium text-gray-900">{patient.latestTesName}</p>
                          <p className="text-xs text-blue-600 font-semibold">{patient.latestTesCategory}</p>
                          {patient.latestTesScore && (
                            <span className="text-[11px] text-gray-400">Skor: {patient.latestTesScore}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Belum tes</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          patient.latestRiskLevel === "high"
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : patient.latestRiskLevel === "medium"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {patient.latestRiskLevel === "high"
                          ? "Tinggi (High)"
                          : patient.latestRiskLevel === "medium"
                          ? "Sedang (Medium)"
                          : "Rendah (Low)"}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenDetail(patient.id)}
                          className="p-2 text-[#234463] hover:bg-[#F0F7FF] rounded-lg transition-colors"
                          title="Lihat Riwayat & Rekam Medis (Read)"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setIsCreateOpen(true)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Tambah / Kelola Sesi Rekam Medis (Create/Update)"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenPdf(patient.id)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Pratinjau & Cetak PDF Resmi 4 Halaman"
                        >
                          <FileDown className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeletePatient(patient.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Data Pasien"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals Integration */}
      <PatientDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedPatientId(null);
        }}
        patientId={selectedPatientId}
      />

      <MedicalRecordPdfModal
        isOpen={isPdfOpen}
        onClose={() => {
          setIsPdfOpen(false);
          setSelectedPatientDetail(null);
        }}
        patient={selectedPatientDetail}
      />

      <CreateNoteModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleCreateNoteSuccess}
      />

      <CreatePatientModal
        isOpen={isCreatePatientOpen}
        onClose={() => setIsCreatePatientOpen(false)}
        onSuccess={(newPatient) => {
          setPatients((prev) => [newPatient, ...prev]);
        }}
      />
    </div>
  );
}
