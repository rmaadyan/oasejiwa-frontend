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
  Clock,
  Trash2,
  Sparkles,
} from "lucide-react";
import { getAllPatients, getPatientDetail, deletePatient } from "@/lib/api/psychologist";
import PatientDetailModal from "@/components/features/psychologist/patients/patientdetailmodal";
import MedicalRecordPdfModal from "@/components/features/psychologist/patients/MedicalRecordPdfModal";
import CreateNoteModal from "@/components/features/psychologist/notes/createnotemodal";
import CreatePatientModal from "@/components/features/psychologist/patients/createpatientmodal";
import type {
  PsychologistPatient,
  PsychologistPatientDetail,
  SessionNote,
} from "@/lib/types/psychologist";

export default function PsychologistRekamMedisPage() {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<PsychologistPatient[]>([]);

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
  const [editingNote, setEditingNote] = useState<SessionNote | null>(null);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await getAllPatients({
        search: searchTerm,
      });

      let resultList = data.patients || [];

      if (searchTerm.trim()) {
        const s = searchTerm.toLowerCase();
        resultList = resultList.filter(
          (p) =>
            (p.name || "").toLowerCase().includes(s) ||
            (p.email || "").toLowerCase().includes(s)
        );
      }

      if (riskFilter !== "all") {
        resultList = resultList.filter((p) => p.latestRiskLevel === riskFilter);
      }

      setPatients(resultList);
    } catch (error) {
      console.error("Gagal mengambil data rekam medis pasien:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data pasien ini dari rekam medis?")) {
      try {
        await deletePatient(patientId);
        await fetchPatients();
      } catch (err: any) {
        console.error("Gagal menghapus pasien:", err);
        alert(err.message || "Gagal menghapus data pasien.");
      }
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
    setSelectedPatientId(patientId);
    setLoading(true);

    try {
      const detail = await getPatientDetail(patientId);
      setSelectedPatientDetail(detail);
      if (!detail?.sessionNotesList?.length && !detail?.totalSessions) {
        alert("Pasien ini belum memiliki rekam medis digital (0 Sesi). Rekam Medis PDF akan tersedia secara otomatis setelah Sesi Konseling / Rekam Medis pertama dibuat.");
        return;
      }
      setIsPdfOpen(true);
    } catch (err) {
      console.error("Gagal memuat detail pasien untuk PDF:", err);
      alert("Gagal memuat dokumen rekam medis untuk preview PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNoteSuccess = async () => {
    await fetchPatients();
    if (selectedPatientId) {
      try {
        const detail = await getPatientDetail(selectedPatientId);
        setSelectedPatientDetail(detail);
      } catch (err) {
        console.error("Gagal memuat ulang detail pasien:", err);
      }
    }
  };

  const handleEditMedicalRecord = async (patient: PsychologistPatient) => {
    try {
      const detail = await getPatientDetail(patient.id);
      const noteToEdit = detail?.sessionNotesList?.[0] || (detail as any)?.notes?.[0];
      if (noteToEdit && noteToEdit.id && String(noteToEdit.id).trim() !== "") {
        setEditingNote(noteToEdit);
      } else {
        setEditingNote(null);
      }
    } catch {
      setEditingNote(null);
    }
    setIsCreateOpen(true);
  };

  // Stats calculation
  const totalPatients = patients.length;
  const highRiskCount = patients.filter((p) => p.latestRiskLevel === "high").length;
  const withRecordCount = patients.filter((p) => p.hasSessionNotes).length;

  return (
    <div className="space-y-6 font-poppins text-xs">
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
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white hover:bg-emerald-500 font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Pasien Baru</span>
            </button>

            <button
              onClick={() => {
                setEditingNote(null);
                setIsCreateOpen(true);
              }}
              className="flex items-center justify-center gap-2 bg-[#1F415F] text-white hover:bg-[#163047] font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm border border-white/20 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
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
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
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
            className="text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#2B5379] focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Risiko</option>
            <option value="high">Risiko Tinggi (High)</option>
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
        ) : patients.length === 0 ? (
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
                {patients.map((patient) => (
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
                        <div className="space-y-0.5 max-w-[200px]">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold text-[#234463]">
                              {patient.latestTesName.toUpperCase().includes("DASS") ? "DASS-21" : patient.latestTesName}
                            </span>
                            {patient.latestTesDate && (
                              <span className="text-[10px] text-gray-400 shrink-0">
                                {new Date(patient.latestTesDate).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            )}
                          </div>
                          {patient.latestTesSummary ? (
                            <p className="text-[11px] font-medium text-gray-600 truncate" title={patient.latestTesSummary}>
                              {patient.latestTesSummary}
                            </p>
                          ) : patient.latestTesScore ? (
                            <p className="text-[11px] text-gray-500 truncate">
                              Skor: {patient.latestTesScore}
                            </p>
                          ) : null}
                          {patient.latestTesCategory && (
                            <div className="pt-0.5">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E8F6FF] text-[#234463] border border-[#d4edff]">
                                Kategori: {patient.latestTesCategory}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Belum tes</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      {!patient.latestRiskLevel || patient.totalSessions === 0 || !patient.hasSessionNotes ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                          Belum Dinilai
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            patient.latestRiskLevel === "very_high" || patient.latestRiskLevel === "sangat_tinggi" || patient.latestRiskLevel === "high" || patient.latestRiskLevel === "tinggi"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : patient.latestRiskLevel === "medium" || patient.latestRiskLevel === "sedang"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {patient.latestRiskLevel === "very_high" || patient.latestRiskLevel === "sangat_tinggi"
                            ? "Sangat Tinggi (Very High)"
                            : patient.latestRiskLevel === "high" || patient.latestRiskLevel === "tinggi"
                            ? "Tinggi (High)"
                            : patient.latestRiskLevel === "medium" || patient.latestRiskLevel === "sedang"
                            ? "Sedang (Medium)"
                            : patient.latestRiskLevel === "very_low" || patient.latestRiskLevel === "sangat_rendah"
                            ? "Sangat Rendah (Very Low)"
                            : "Rendah (Low)"}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenPdf(patient.id)}
                          className="p-2 text-[#234463] hover:bg-[#F0F7FF] rounded-lg transition-colors cursor-pointer"
                          title="Lihat Pratinjau Dokumen Rekam Medis (👁️ Lihat Detail)"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleEditMedicalRecord(patient)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit / Kelola Isi Rekam Medis"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenPdf(patient.id)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="Pratinjau & Cetak PDF Resmi"
                        >
                          <FileDown className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeletePatient(patient.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
        onClose={() => {
          setIsCreateOpen(false);
          setEditingNote(null);
        }}
        onSuccess={handleCreateNoteSuccess}
        editNote={editingNote}
      />

      <CreatePatientModal
        isOpen={isCreatePatientOpen}
        onClose={() => setIsCreatePatientOpen(false)}
        onSuccess={async (newPatient) => {
          setIsCreatePatientOpen(false);
          await fetchPatients();
        }}
      />
    </div>
  );
}
