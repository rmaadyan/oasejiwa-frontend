"use client";

import {
  X,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  FileText,
  Calendar,
  Clock,
  Edit,
  Printer,
  ClipboardList,
  Activity,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Plus,
  User,
  Briefcase,
  Heart,
  Cake,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import EditMedicalModal from "../notes/editmedicalmodal";
import CreateNoteModal from "../notes/createnotemodal";
import { getPatientDetail, getNoteById } from "@/lib/api/psychologist";
import { getUserTesResults } from "@/lib/api/tes";
import SessionNoteModal from "./sessionnotemodal";
import MedicalRecordPdfModal from "./MedicalRecordPdfModal";
import type {
  PsychologistPatientDetail,
  SessionNote,
  SessionSummary,
} from "@/lib/types/psychologist";
import { getRiskConfig } from "@/lib/types/psychologist";

interface PatientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string | null;
}

const DUMMY_SESI_2_NOTE: SessionNote = {
  id: "note-sesi-2",
  psychologistId: "6",
  patientId: "1",
  patientName: "Budi Santoso",
  service: "Konseling Individu",
  sessionDate: "2026-07-15",
  sessionTime: "09.00",
  duration: 60,
  sessionNumber: 1,
  subjective:
    "Pasien mengeluhkan rasa cemas berlebihan selama beberapa minggu terakhir, sulit tidur, dan sering merasa gelisah ketika berada di lingkungan kerja.",
  objective:
    "• Pasien mampu berkomunikasi dengan baik.\n• Kontak mata cukup baik.\n• Mood tampak cemas.\n• Tidak ditemukan indikasi gangguan persepsi.\n• Pasien kooperatif selama sesi berlangsung.",
  assessment:
    "Gejala mengarah pada Gangguan Kecemasan Umum (Generalized Anxiety Disorder) dengan tingkat keparahan sedang berdasarkan hasil DASS-21.",
  plan:
    "• Psychoeducation mengenai kecemasan.\n• Teknik pernapasan diafragma.\n• Cognitive Behavioral Therapy (CBT) dasar.\n• Latihan relaksasi.",
  nextSessionRecommendation:
    "• Kontrol kembali dua minggu kemudian.\n• Mengerjakan jurnal emosi harian.\n• Melakukan latihan relaksasi minimal dua kali sehari.\n• Evaluasi perkembangan pada sesi berikutnya.",
  riskLevel: "medium",
  riskReason:
    "Pasien mengalami kecemasan sedang berdasarkan hasil DASS-21, kesulitan tidur, serta mengalami overthinking yang mengganggu aktivitas sehari-hari.",
  riskRecommendations: [
    "Konseling dua minggu sekali.",
    "CBT.",
    "Latihan relaksasi.",
    "Evaluasi pada sesi berikutnya.",
  ],
  assessmentDate: "2026-07-29",
  assessingPsychologistName: "Dr. Maya Putri, M.Psi., Psikolog",
  createdAt: "2026-07-15T09:00:00Z",
  updatedAt: "2026-07-15T10:00:00Z",
};

export default function PatientDetailModal({
  isOpen,
  onClose,
  patientId,
}: PatientDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [rawPatient, setRawPatient] = useState<PsychologistPatientDetail | null>(null);

  const [selectedNote, setSelectedNote] = useState<SessionNote | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [loadingNote, setLoadingNote] = useState(false);
  const [noteError, setNoteError] = useState<string | null>(null);
  const [isEditMedicalOpen, setIsEditMedicalOpen] = useState(false);
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isTesDetailOpen, setIsTesDetailOpen] = useState<Record<string, boolean>>({});

  const [tesResultsList, setTesResultsList] = useState<any[]>([]);
  const [loadingTes, setLoadingTes] = useState(false);

  useEffect(() => {
    if (isOpen && patientId) {
      fetchPatientDetail();
    }

    if (!isOpen) {
      setRawPatient(null);
      setSelectedNote(null);
      setIsNoteModalOpen(false);
      setNoteError(null);
      setIsEditMedicalOpen(false);
      setIsCreateNoteOpen(false);
      setIsPdfModalOpen(false);
      setIsTesDetailOpen({});
    }
  }, [isOpen, patientId]);

  const formatDate = (date?: string | Date | null) => {
    if (!date) return "-";

    const rawDate = String(date);

    if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
      const [year, month, day] = rawDate.split("-").map(Number);

      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(year, month - 1, day));
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return String(date);
    }

    return parsedDate.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const fetchPatientDetail = async () => {
    if (!patientId) return;

    setLoading(true);
    setLoadingTes(true);
    setNoteError(null);

    try {
      const [data, tesData] = await Promise.all([
        getPatientDetail(patientId).catch(() => null),
        getUserTesResults(patientId).catch(() => []),
      ]);
      setRawPatient(data);
      setTesResultsList(tesData || []);
    } catch (error) {
      console.error("Failed to fetch patient detail:", error);
      setRawPatient(null);
      setTesResultsList([]);
    } finally {
      setLoading(false);
      setLoadingTes(false);
    }
  };

  const getEnrichedPatient = (): PsychologistPatientDetail => {
    const raw = rawPatient;
    const isPatientSiti = patientId === "2" || raw?.name === "Siti Rahmawati" || raw?.email === "siti.rahmawati@example.com";

    const defaultDiagnosis = ["Gangguan Kecemasan Umum"];
    const defaultMedication = ["Sertraline 50 mg (1x sehari setelah makan pagi)"];
    const defaultAllergies = ["Tidak ada alergi yang diketahui"];

    const rawHistory = raw?.sessionHistory || [];

    if (isPatientSiti) {
      const sitiSessions: SessionSummary[] = [
        {
          id: "sesi-siti-3",
          bookingId: 105,
          scheduleId: "sch-siti-3",
          noteId: null,
          date: "2026-08-03",
          time: "14.00",
          duration: 60,
          service: "Konseling Individu",
          status: "upcoming",
          hasNotes: false,
        },
        {
          id: "sesi-siti-2",
          bookingId: 104,
          scheduleId: "sch-siti-2",
          noteId: "note-sesi-2",
          date: "2026-07-20",
          time: "14.00",
          duration: 60,
          service: "Konseling Individu",
          status: "completed",
          hasNotes: true,
        },
        {
          id: "sesi-siti-1",
          bookingId: 103,
          scheduleId: "sch-siti-1",
          noteId: "note-sesi-2",
          date: "2026-07-05",
          time: "14.00",
          duration: 60,
          service: "Konseling Individu",
          status: "completed",
          hasNotes: true,
        },
      ];

      return {
        id: "2",
        name: raw?.name || "Siti Rahmawati",
        email: raw?.email || "siti.rahmawati@example.com",
        phone: raw?.phone || "0821-9876-5432",
        age: raw?.age || 26,
        gender: raw?.gender || "female",
        address: raw?.address || "Jl. Gatot Subroto No. 88, Jakarta Selatan",
        birthday: raw?.birthday || "1999-09-22",
        maritalStatus: raw?.maritalStatus || "Menikah",
        occupation: raw?.occupation || "Financial Analyst",
        emergencyContact: raw?.emergencyContact || {
          name: "Ahmad Rahmawati",
          phone: "0813-1122-3344",
          relation: "Suami",
        },
        diagnosis: raw?.diagnosis && raw.diagnosis.length > 0 ? raw.diagnosis : ["Gangguan Depresi Ringan - Sedang (Mild to Moderate Depression)"],
        currentMedication: raw?.currentMedication && raw.currentMedication.length > 0 ? raw.currentMedication : ["Fluoxetine 20 mg (1x sehari pagi)"],
        allergies: raw?.allergies && raw.allergies.length > 0 ? raw.allergies : ["Alergi Makanan Laut (Seafood)"],
        firstSessionDate: raw?.firstSessionDate || "2026-07-05",
        lastSessionDate: raw?.lastSessionDate || "2026-07-20",
        totalSessions: raw?.totalSessions || 3,
        sessionHistory: rawHistory.length > 0 ? rawHistory : sitiSessions,
        lastNotes: raw?.lastNotes || "Pasien mengalami kecemasan dan mood menurun terkait beban kerja. Menunjukkan respon positif terhadap terapi pengaktifan perilaku.",
        riskLevel: raw?.riskLevel || "medium",
        riskReason: raw?.riskReason || "Pasien mengalami penurunan mood yang signifikan selama satu bulan terakhir, kesulitan berkonsentrasi pada pekerjaan, serta ada penurunan kualitas tidur.",
        riskRecommendations: raw?.riskRecommendations || [
          "Behavioral Activation Therapy.",
          "Konseling dua minggu sekali.",
          "Jurnal rasa syukur (Gratitude Journaling).",
          "Latihan olahraga ringan rutin.",
        ],
        assessmentDate: raw?.assessmentDate || "20 Juli 2026",
        assessingPsychologistName: raw?.assessingPsychologistName || "Dr. Ani Wijaya, M.Psi., Psikolog",
        sessionNotesList: [
          {
            id: "siti-note-2",
            scheduleId: "sch-siti-2",
            psychologistId: "6",
            patientId: "2",
            patientName: "Siti Rahmawati",
            consultationDate: "2026-07-20",
            sessionDate: "2026-07-20",
            sessionTime: "14.00",
            duration: 60,
            sessionNumber: 2,
            service: "Konseling Individu",
            subjective: "Pasien melaporkan adanya peningkatan energi dan perbaikan mood setelah rutin mengonsumsi Fluoxetine 20mg dan mempraktikkan Behavioral Activation Journal. Masih merasa sedikit lelah saat menghadapi deadline kerja.",
            objective: "Affect lebih fleksibel, kontak mata membaik. Pasien tampak lebih segar dan komunikatif. Skor DASS-21 Depresi: 12 (kategori Depresi Sedang, turun dari skor awal 16).",
            assessment: "Gangguan Depresi Ringan - Sedang (Mild to Moderate Depression) — Menunjukkan respon positif yang signifikan terhadap Behavioral Activation Therapy dan medikasi psikiatri.",
            plan: "1. Evaluasi Behavioral Activation Journal\n2. Terapkan Cognitive Restructuring untuk mengelola pikiran otomatis negatif\n3. Rutinkan latihan relaksasi diafragma sebelum tidur\n4. Lanjutkan sesi konseling 2 minggu sekali",
            riskLevel: "medium",
            riskReason: "Pasien mengalami penurunan mood yang signifikan selama satu bulan terakhir, kesulitan berkonsentrasi pada pekerjaan, serta ada penurunan kualitas tidur.",
            riskRecommendations: [
              "Behavioral Activation Therapy.",
              "Konseling dua minggu sekali.",
              "Jurnal rasa syukur (Gratitude Journaling).",
              "Latihan olahraga ringan rutin."
            ],
            followUpDate: "2026-08-03",
            additionalNotes: "Pasien sangat kooperatif dan disiplin dalam mencatat jurnal aktivitas harian.",
            createdAt: "2026-07-20T15:00:00Z",
            updatedAt: "2026-07-20T15:00:00Z"
          },
          {
            id: "siti-note-1",
            scheduleId: "sch-siti-1",
            psychologistId: "6",
            patientId: "2",
            patientName: "Siti Rahmawati",
            consultationDate: "2026-07-05",
            sessionDate: "2026-07-05",
            sessionTime: "14.00",
            duration: 60,
            sessionNumber: 1,
            service: "Konseling Individu",
            subjective: "Pasien pertama kali datang dengan keluhan mood rendah selama 1 bulan terakhir, sering menangis tanpa alasan yang jelas, serta merasa kehilangan minat pada hobi dan aktivitas harian.",
            objective: "Afek hipotimik, emosi labil dengan kecenderungan menangis saat menceritakan tekanan pekerjaan. Kontak mata sedang. Skor DASS-21 Depresi: 16 (Depresi Sedang).",
            assessment: "Gangguan Depresi Ringan - Sedang (Mild to Moderate Depression) — Dipicu oleh beban kerja tinggi dan kurangnya mekanisme koping yang adekuat.",
            plan: "1. Psikoedukasi mengenai depresi dan manajemen stres\n2. Rujukan evaluasi psikiatri (diresepkan Fluoxetine 20mg)\n3. Pemberian Behavioral Activation Journal\n4. Jadwal konseling lanjutan 2 minggu lagi",
            riskLevel: "medium",
            riskReason: "Keluhan depresi sedang yang mengganggu produktivitas kerja harian.",
            riskRecommendations: [
              "Konseling rutin 2 minggu sekali.",
              "Evaluasi psikiatri.",
              "Behavioral Activation."
            ],
            followUpDate: "2026-07-20",
            additionalNotes: "Pasien diberikan kontak darurat biro psikologi.",
            createdAt: "2026-07-05T15:00:00Z",
            updatedAt: "2026-07-05T15:00:00Z"
          }
        ]
      };
    }

    const defaultSessions: SessionSummary[] = [
      {
        id: "sesi-1",
        bookingId: 101,
        scheduleId: "sch-1",
        noteId: null,
        date: "2026-07-29",
        time: "09.00",
        duration: 60,
        service: "Konseling Individu",
        status: "upcoming",
        hasNotes: false,
      },
      {
        id: "sesi-2",
        bookingId: 102,
        scheduleId: "sch-2",
        noteId: "note-sesi-2",
        date: "2026-07-15",
        time: "09.00",
        duration: 60,
        service: "Konseling Individu",
        status: "completed",
        hasNotes: true,
      },
    ];

    const sessionHistory = rawHistory.length >= 2 ? rawHistory : defaultSessions;

    return {
      id: raw?.id || patientId || "1",
      name: raw?.name || "Budi Santoso",
      email: raw?.email || "budi.santoso@example.com",
      phone: raw?.phone || "0812-3456-7890",
      age: raw?.age || 28,
      gender: raw?.gender || "male",
      address: raw?.address || "Jl. Sudirman No. 45, Jakarta Selatan",
      birthday: raw?.birthday || "1998-05-14",
      maritalStatus: raw?.maritalStatus || "Belum Menikah",
      occupation: raw?.occupation || "Software Engineer",
      emergencyContact: raw?.emergencyContact || {
        name: "Siti Santoso",
        phone: "0822-9876-5432",
        relation: "Istri",
      },
      diagnosis:
        raw?.diagnosis && raw.diagnosis.length > 0
          ? raw.diagnosis
          : defaultDiagnosis,
      currentMedication:
        raw?.currentMedication && raw.currentMedication.length > 0
          ? raw.currentMedication
          : defaultMedication,
      allergies:
        raw?.allergies && raw.allergies.length > 0
          ? raw.allergies
          : defaultAllergies,
      firstSessionDate: raw?.firstSessionDate || "2026-07-15",
      lastSessionDate: raw?.lastSessionDate || "2026-07-29",
      totalSessions: raw?.totalSessions || sessionHistory.length,
      sessionHistory,
      lastNotes:
        raw?.lastNotes ||
        "Pasien mengeluhkan cemas berlebihan. Menunjukkan progres baik dengan latihan relaksasi.",
      riskLevel: raw?.riskLevel || "medium",
      riskReason:
        raw?.riskReason ||
        "Pasien mengalami kecemasan sedang berdasarkan hasil DASS-21, kesulitan tidur, serta mengalami overthinking yang mengganggu aktivitas sehari-hari.",
      riskRecommendations: raw?.riskRecommendations || [
        "Konseling dua minggu sekali.",
        "CBT.",
        "Latihan relaksasi.",
        "Evaluasi pada sesi berikutnya.",
      ],
      assessmentDate: raw?.assessmentDate || "29 Juli 2026",
      assessingPsychologistName:
        raw?.assessingPsychologistName || "Dr. Maya Putri, M.Psi., Psikolog",
    };
  };

  const patient = getEnrichedPatient();

  const handleViewNote = async (noteId: string) => {
    setLoadingNote(true);
    setNoteError(null);

    if (noteId === "note-sesi-2") {
      setSelectedNote({
        ...DUMMY_SESI_2_NOTE,
        patientName: patient.name,
      });
      setIsNoteModalOpen(true);
      setLoadingNote(false);
      return;
    }

    try {
      const note = await getNoteById(noteId);
      setSelectedNote(note);
      setIsNoteModalOpen(true);
    } catch (error) {
      console.warn("API note not found, fallback to dummy detail note:", error);
      setSelectedNote({
        ...DUMMY_SESI_2_NOTE,
        patientName: patient.name,
      });
      setIsNoteModalOpen(true);
    } finally {
      setLoadingNote(false);
    }
  };

  const handleMedicalUpdateSuccess = async () => {
    await fetchPatientDetail();
  };

  const handleCreateNoteSuccess = async () => {
    await fetchPatientDetail();
  };

  if (!isOpen) return null;

  const sessionHistory = patient.sessionHistory;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <div
          className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Sticky Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-[#2B5379]">
                Profil & Rekam Medis Digital Pasien
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Terhubung: Data Diri, Form Intake, Hasil Tes Psikologi, & Catatan Sesi
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCreateNoteOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Tambah Rekam Medis
              </button>

              <button
                type="button"
                onClick={() => setIsPdfModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2B5379] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#1f3b5b] shadow-sm"
              >
                <Printer className="h-4 w-4" />
                Cetak / PDF
              </button>

              <button
                onClick={onClose}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                type="button"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#2B5379] border-t-transparent" />
              <p className="text-gray-600 text-sm">Memuat data rekam medis pasien...</p>
            </div>
          ) : (
            <div className="space-y-6 p-6">
              {/* Header Pasien Card */}
              <div className="rounded-xl bg-gradient-to-r from-[#234463] to-[#2B5379] p-5 text-white shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 text-white flex items-center justify-center font-bold text-xl shrink-0">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{patient.name}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-blue-100 font-medium">
                        <span className="bg-white/20 px-2.5 py-0.5 rounded-md">
                          {patient.age} Tahun
                        </span>
                        <span>•</span>
                        <span className="bg-white/20 px-2.5 py-0.5 rounded-md">
                          {String(patient.gender).toLowerCase() === "female" ||
                          String(patient.gender).toLowerCase() === "perempuan"
                            ? "Perempuan"
                            : "Laki-laki"}
                        </span>
                        <span>•</span>
                        <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-2.5 py-0.5 rounded-md font-semibold">
                          {patient.totalSessions} Sesi Terdaftar
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. Informasi Profil & Demografi Pasien */}
              <div className="space-y-3">
                <h4 className="font-semibold text-[#2B5379] flex items-center gap-2 text-base">
                  <User className="h-4 w-4 text-[#2B5379]" />
                  Informasi Profil Pasien
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-200 p-3">
                    <Mail className="h-5 w-5 shrink-0 text-[#2B5379]" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-500 font-medium">Email</p>
                      <p className="break-words text-xs font-semibold text-gray-900">
                        {patient.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-200 p-3">
                    <Phone className="h-5 w-5 shrink-0 text-[#2B5379]" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-500 font-medium">Nomor Telepon</p>
                      <p className="break-words text-xs font-semibold text-gray-900">
                        {patient.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-200 p-3">
                    <MapPin className="h-5 w-5 shrink-0 text-[#2B5379]" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-500 font-medium">Alamat</p>
                      <p className="break-words text-xs font-semibold text-gray-900">
                        {patient.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-200 p-3">
                    <Cake className="h-5 w-5 shrink-0 text-[#2B5379]" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-500 font-medium">Tanggal Lahir</p>
                      <p className="break-words text-xs font-semibold text-gray-900">
                        {formatDate(patient.birthday)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-200 p-3">
                    <Heart className="h-5 w-5 shrink-0 text-[#2B5379]" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-500 font-medium">Status Pernikahan</p>
                      <p className="break-words text-xs font-semibold text-gray-900">
                        {patient.maritalStatus}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-200 p-3">
                    <Briefcase className="h-5 w-5 shrink-0 text-[#2B5379]" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-500 font-medium">Pekerjaan</p>
                      <p className="break-words text-xs font-semibold text-gray-900">
                        {patient.occupation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informasi Medis Summary */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-[#2B5379] flex items-center gap-2 text-base">
                    <ClipboardList className="h-4 w-4 text-[#2B5379]" />
                    Informasi Medis Pasien
                  </h4>

                  <button
                    onClick={() => setIsEditMedicalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#D1EAFF] px-3 py-1 text-xs font-semibold text-[#2B5379] transition-colors hover:bg-[#2B5379] hover:text-white"
                    type="button"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit Informasi Medis
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 shadow-sm">
                    <p className="mb-1.5 text-xs font-bold text-blue-900">
                      Diagnosis
                    </p>
                    <ul className="space-y-1">
                      {patient.diagnosis?.map((item, index) => (
                        <li key={index} className="text-xs font-medium text-blue-800">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-3.5 shadow-sm">
                    <p className="mb-1.5 text-xs font-bold text-orange-900">
                      Obat Saat Ini
                    </p>
                    <ul className="space-y-1">
                      {patient.currentMedication?.map((item, index) => (
                        <li key={index} className="text-xs font-medium text-orange-800">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-red-200 bg-red-50/70 p-3.5 shadow-sm">
                    <p className="mb-1.5 text-xs font-bold text-red-900">
                      Alergi
                    </p>
                    <ul className="space-y-1">
                      {patient.allergies?.map((item, index) => (
                        <li key={index} className="text-xs font-medium text-red-800">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2. Hasil Tes Psikologi */}
              <div className="space-y-3">
                <h4 className="font-semibold text-[#2B5379] flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4 text-[#2B5379]" />
                  Hasil Tes Psikologi Pasien
                </h4>

                {loadingTes ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-6 text-center animate-pulse space-y-3">
                    <div className="h-4 w-48 bg-emerald-200 rounded mx-auto" />
                    <div className="h-3 w-32 bg-emerald-200 rounded mx-auto" />
                    <p className="text-xs text-emerald-700">Memuat hasil tes psikologi...</p>
                  </div>
                ) : tesResultsList.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/80 p-6 text-center">
                    <Activity className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-xs font-semibold text-gray-700">Belum Ada Hasil Tes Psikologi</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Pasien belum menyelesaikan tes psikologi online di platform.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tesResultsList.map((tesItem: any, index: number) => {
                      const itemKey = tesItem.id || `tes-${index}`;
                      const isExpanded = isTesDetailOpen[itemKey] ?? (index === 0);

                      return (
                        <div key={itemKey} className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm transition hover:border-emerald-300">
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-gray-900 text-sm">
                                  {tesItem.namaTes}
                                </h5>
                                <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-0.5 text-xs">
                                  {tesItem.percentage}%
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                Kategori: <span className="font-semibold text-gray-800">{tesItem.kategoriNama || tesItem.jenisTes || "Psikologi"}</span> • Tanggal: <span className="font-semibold text-gray-800">{formatDate(tesItem.createdAt)}</span>
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="text-[11px] text-gray-500">Diagnosis Tes</p>
                                <p className="text-xs font-bold text-emerald-700">{tesItem.diagnosis || tesItem.kategoriNama || "-"}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setIsTesDetailOpen((prev) => ({
                                    ...prev,
                                    [itemKey]: !isExpanded,
                                  }))
                                }
                                className="flex items-center gap-1 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition shadow-xs"
                              >
                                {isExpanded ? (
                                  <span className="flex items-center gap-1">
                                    Sembunyikan Detail <ChevronUp className="h-4 w-4" />
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    Lihat Detail <ChevronDown className="h-4 w-4" />
                                  </span>
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                            <div className="rounded-lg bg-white p-2 border border-emerald-100">
                              <p className="text-[10px] text-gray-500">Skor</p>
                              <p className="text-sm font-bold text-gray-900">{tesItem.totalScore}/{tesItem.maxScore} <span className="text-xs text-emerald-600 font-semibold">({tesItem.percentage}%)</span></p>
                            </div>
                            <div className="rounded-lg bg-white p-2 border border-emerald-100">
                              <p className="text-[10px] text-gray-500">Diagnosis</p>
                              <p className="text-xs font-bold text-emerald-700">{tesItem.diagnosis || tesItem.kategoriNama || "-"}</p>
                            </div>
                            <div className="rounded-lg bg-white p-2 border border-emerald-100">
                              <p className="text-[10px] text-gray-500">Tanggal Tes</p>
                              <p className="text-xs font-semibold text-gray-800">{formatDate(tesItem.createdAt)}</p>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="mt-3 rounded-lg border border-emerald-200 bg-white p-3.5 text-xs space-y-2.5">
                              <div>
                                <p className="font-bold text-emerald-900 mb-0.5">Detail Diagnosis:</p>
                                <p className="text-gray-700 leading-relaxed">
                                  {tesItem.detailDiagnosis || `Berdasarkan hasil ${tesItem.namaTes}, pasien berada pada kategori ${tesItem.kategoriNama || "-"}.`}
                                </p>
                              </div>

                              {tesItem.interpretasi && (
                                <div>
                                  <p className="font-bold text-emerald-900 mb-0.5">Interpretasi:</p>
                                  <p className="text-gray-700 leading-relaxed">{tesItem.interpretasi}</p>
                                </div>
                              )}

                              {tesItem.rekomendasi && tesItem.rekomendasi.length > 0 && (
                                <div>
                                  <p className="font-semibold text-gray-800 mb-1">Rekomendasi:</p>
                                  <ul className="space-y-1 text-gray-600 pl-1">
                                    {tesItem.rekomendasi.map((rec: string, idx: number) => (
                                      <li key={idx} className="flex items-start gap-1.5">
                                        <span className="text-emerald-600 font-bold">•</span>
                                        <span>{rec}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3. Card Assessment Tingkat Risiko */}
              {(() => {
                const activeRiskConfig = getRiskConfig(patient.riskLevel || "medium");
                const riskReasonText =
                  patient.riskReason ||
                  "Pasien mengalami kecemasan sedang berdasarkan hasil DASS-21, kesulitan tidur, serta mengalami overthinking yang mengganggu aktivitas sehari-hari.";
                const recommendationsList = patient.riskRecommendations || [
                  "Konseling dua minggu sekali.",
                  "CBT.",
                  "Latihan relaksasi.",
                  "Evaluasi pada sesi berikutnya.",
                ];
                const assessmentDateText = patient.assessmentDate || "29 Juli 2026";
                const psychologistName =
                  patient.assessingPsychologistName || "Dr. Maya Putri, M.Psi., Psikolog";

                return (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-[#2B5379] flex items-center gap-2 text-base">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      Assessment Tingkat Risiko
                    </h4>

                    <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/80 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-700">Tingkat Risiko:</span>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${activeRiskConfig.badgeClass}`}
                          >
                            {activeRiskConfig.emoji} {activeRiskConfig.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          <span>
                            Tanggal Assessment:{" "}
                            <strong className="text-gray-900">
                              {formatDate(assessmentDateText)}
                            </strong>
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-gray-800 mb-1">Alasan Penilaian:</p>
                        <p className="text-xs text-gray-700 bg-white p-3 rounded-lg border border-amber-100 leading-relaxed font-normal">
                          {riskReasonText}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-gray-800 mb-1">Rekomendasi:</p>
                        <div className="rounded-lg bg-white p-3 border border-amber-100">
                          <ul className="space-y-1">
                            {recommendationsList.map((item, idx) => (
                              <li
                                key={idx}
                                className="text-xs text-gray-700 font-medium flex items-start gap-1.5"
                              >
                                <span className="text-amber-600 font-bold">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-amber-200/60 text-xs text-gray-600">
                        <span className="italic text-[11px] text-gray-500">
                          {activeRiskConfig.description}
                        </span>
                        <span className="font-semibold text-[#2B5379] flex items-center gap-1 shrink-0">
                          <UserCheck className="h-3.5 w-3.5" /> Psikolog: {psychologistName}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Statistik Sesi */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-3.5 text-center">
                  <p className="mb-0.5 text-xs text-gray-500 font-medium">Total Sesi</p>
                  <p className="text-2xl font-extrabold text-[#2B5379]">
                    {patient.totalSessions}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 border border-gray-200 p-3.5 text-center">
                  <p className="mb-0.5 text-xs text-gray-500 font-medium">Sesi Pertama</p>
                  <p className="text-xs font-bold text-gray-900">
                    {formatDate(patient.firstSessionDate)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 border border-gray-200 p-3.5 text-center">
                  <p className="mb-0.5 text-xs text-gray-500 font-medium">Sesi Terakhir</p>
                  <p className="text-xs font-bold text-gray-900">
                    {formatDate(patient.lastSessionDate)}
                  </p>
                </div>
              </div>

              {noteError && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                  <p className="text-xs text-red-700">{noteError}</p>
                </div>
              )}

              {/* Riwayat Sesi - 🟢 PERBAIKAN TAMPILAN STATUS DI SINI */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[#2B5379] flex items-center gap-2 text-base">
                    <Clock className="h-4 w-4 text-[#2B5379]" />
                    Riwayat Sesi
                  </h4>

                  <p className="text-xs text-gray-500 font-medium">
                    {sessionHistory.length} sesi tercatat
                  </p>
                </div>

                {sessionHistory.length > 0 ? (
                  <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                    {sessionHistory.map((session) => {
                      const canOpenNote =
                        Boolean(session.hasNotes) && Boolean(session.noteId);

                      const statusUpper = String(session.status || "").toUpperCase();

                      return (
                        <button
                          key={session.id}
                          onClick={() => {
                            if (canOpenNote) {
                              handleViewNote(String(session.noteId));
                            }
                          }}
                          disabled={!canOpenNote || loadingNote}
                          className={`flex w-full items-center justify-between rounded-xl border p-3.5 transition-all shadow-xs ${
                            canOpenNote
                              ? "cursor-pointer border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                              : "cursor-not-allowed border-gray-200 bg-gray-50/80"
                          } ${loadingNote ? "cursor-wait opacity-50" : ""}`}
                          type="button"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-left space-y-1">
                              <p className="text-sm font-bold text-gray-900">
                                {session.service}
                              </p>

                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="flex items-center gap-1 font-semibold text-slate-700">
                                  <Calendar className="h-3.5 w-3.5 text-[#2B5379]" />
                                  {formatDate(session.date)}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-1 font-semibold text-[#2B5379]">
                                  <Clock className="h-3.5 w-3.5" />
                                  {session.time || "-"}
                                </span>
                                <span className="text-slate-300">•</span>

                                {/* 🟢 BADGE STATUS JELAS DAN TEBAL */}
                                <span
                                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                    statusUpper === "COMPLETED" || statusUpper === "SELESAI"
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                      : statusUpper === "CANCELLED" || statusUpper === "REJECTED" || statusUpper === "DIBATALKAN"
                                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                                      : "bg-blue-100 text-blue-800 border border-blue-200"
                                  }`}
                                >
                                  {statusUpper === "COMPLETED" || statusUpper === "SELESAI"
                                    ? "Selesai"
                                    : statusUpper === "CANCELLED" || statusUpper === "REJECTED" || statusUpper === "DIBATALKAN"
                                    ? "Dibatalkan"
                                    : "Terjadwal"}
                                </span>
                              </div>

                              <p className="mt-1 text-xs text-gray-500 italic">
                                Catatan:{" "}
                                {isCompleted
                                  ? "Rekam medis sesi lengkap tersedia"
                                  : "Belum ada catatan"}
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-1.5 pl-2">
                            {canOpenNote ? (
                              <div className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-[#2B5379]">
                                <FileText className="h-4 w-4" />
                                <span className="text-xs font-semibold">
                                  Lihat Catatan
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs font-medium text-gray-400">
                                Tidak ada catatan
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
                    <p className="text-xs text-gray-500">Belum ada riwayat sesi.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {patient && (
        <EditMedicalModal
          isOpen={isEditMedicalOpen}
          onClose={() => setIsEditMedicalOpen(false)}
          onSuccess={handleMedicalUpdateSuccess}
          patientId={patient.id}
          initialData={{
            diagnosis: patient.diagnosis || [],
            currentMedication: patient.currentMedication || [],
            allergies: patient.allergies || [],
          }}
        />
      )}

      <CreateNoteModal
        isOpen={isCreateNoteOpen}
        onClose={() => setIsCreateNoteOpen(false)}
        onSuccess={handleCreateNoteSuccess}
      />

      <SessionNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setSelectedNote(null);
        }}
        note={selectedNote}
      />

      {patient && (
        <MedicalRecordPdfModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          patient={patient}
        />
      )}
    </>
  );
}