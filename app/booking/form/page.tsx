"use client";

import { useState, Suspense, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookingStepper from "@/components/booking/BookingStepper";
import { z } from "zod";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { createBooking } from "@/lib/api/booking";
import { getLayananById } from "@/lib/api/layanan";
import {
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  FileText,
  Shield,
  PenTool,
  Download,
  Clock,
} from "lucide-react";
import { useRequireCompleteProfile } from "@/hooks/use-require-complete-profile";

// Zod validation schema for Step 2
const consultationFormSchema = z.object({
  mainReason: z.string().min(10, "Alasan konsultasi minimal 10 karakter"),
  takingPsychiatricMeds: z.enum(["yes", "no"]),
  problemDuration: z.enum(["<1month", "1-3months", "3-6months", ">6months"]),
  symptomFrequency: z.enum(["daily", "weekly", "monthly", "rarely"]),
  dailyImpact: z.enum(["none", "mild", "moderate", "severe"]),

  hasSimilarHistory: z.enum(["yes", "no"]),
  similarHistoryDetail: z.string().optional(),
  hasFamilyHistory: z.enum(["yes", "no"]),
  familyHistoryDetail: z.string().optional(),
  hasMedicalTreatment: z.enum(["yes", "no"]),
  medicalTreatmentDetail: z.string().optional(),
  hasTraumaticEvent: z.enum(["yes", "no"]),
  traumaticEventDetail: z.string().optional(),
  sleepQuality: z.enum(["good", "fair", "poor", "disturbed"]),
  selfHarmThoughts: z.enum(["never", "sometimes", "frequent"]),

  usesAddictiveSubstances: z.enum(["yes", "no"]),
  addictiveSubstancesDetail: z.string().optional(),
  eatingPattern: z.enum(["regular", "irregular", "overeating", "undereating"]),
  exerciseFrequency: z.enum(["never", "rarely", "sometimes", "regularly"]),
  stressLevel: z.enum(["low", "moderate", "high", "veryHigh"]),

  consultationGoals: z.array(z.string()).min(1, "Pilih minimal satu tujuan"),
  therapyPreference: z.enum(["directive", "collaborative", "noPreference"]),
});

type ConsultationFormData = z.infer<typeof consultationFormSchema>;

// Zod validation schema untuk Formulir Konsultasi Pasangan (JenisLayanan.KonselingPasangan)
// Mengikuti Formulir_Klien_Oase_Jiwa_Pasangan.doc: hanya bagian B (Alasan Konsultasi)
// dan C (Riwayat Psikologis & Kesehatan versi pasangan). Tidak ada bagian
// D (Kebiasaan & Gaya Hidup) maupun E (Tujuan Konsultasi) seperti pada formulir individu.
const coupleConsultationFormSchema = z.object({
  // B. Alasan Konsultasi (sama seperti formulir individu)
  mainReason: z.string().min(10, "Alasan konsultasi minimal 10 karakter"),
  takingPsychiatricMeds: z.enum(["yes", "no"], "Pilih salah satu opsi"),
  problemDuration: z.enum(["<1month", "1-3months", "3-6months", ">6months"], "Pilih durasi masalah"),
  symptomFrequency: z.enum(["daily", "weekly", "monthly", "rarely"], "Pilih frekuensi gejala"),
  dailyImpact: z.enum(["none", "mild", "moderate", "severe"], "Pilih tingkat dampak"),

  // C. Riwayat Psikologis & Kesehatan (versi Anda dan pasangan)
  hasSimilarHistory: z.enum(["yes", "no"]),
  similarHistoryDetail: z.string().optional(),
  hasFamilyHistory: z.enum(["yes", "no"]),
  familyHistoryDetail: z.string().optional(),
  hasMedicalTreatment: z.enum(["yes", "no"]),
  medicalTreatmentDetail: z.string().optional(),
  hasTraumaticEvent: z.enum(["yes", "no"]),
  traumaticEventDetail: z.string().optional(),
  sleepQuality: z.enum(["good", "fair", "poor", "disturbed"], "Pilih kualitas tidur Anda"),
  partnerSleepQuality: z.enum(["good", "fair", "poor", "disturbed"], "Pilih kualitas tidur pasangan"),
});

type CoupleConsultationFormData = z.infer<typeof coupleConsultationFormSchema>;

// Consent form schema for Step 3
const consentFormSchema = z.object({
  consentDate: z.string(),
  clientNameConfirmation: z.string().min(3, "Masukkan nama lengkap Anda"),
  signature: z.string().min(3, "Tanda tangan diperlukan"),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "Anda harus menyetujui ketentuan layanan",
  }),
});

type ConsentFormData = z.infer<typeof consentFormSchema>;

interface ClientFormData {
  fullName: string;
  gender: string; // "male" | "female"
  birthDate: string;
  birthPlace: string;
  address: string;
  originAddress: string;
  phone: string;
  email: string;
  occupation: string;
  maritalStatus: string; // "single" | "married" | "divorced"
  childOrder: string;
  siblingsCount: string;
  educationSD: string;
  educationSMP: string;
  educationSMA: string;
  educationCollege: string;
  educationSDMajor: string;
  educationSDYearStart: string;
  educationSDYearEnd: string;
  educationSMPMajor: string;
  educationSMPYearStart: string;
  educationSMPYearEnd: string;
  educationSMAMajor: string;
  educationSMAYearStart: string;
  educationSMAYearEnd: string;
  educationCollegeMajor: string;
  educationCollegeYearStart: string;
  educationCollegeYearEnd: string;
}

const emptyClientData: ClientFormData = {
  fullName: "",
  gender: "",
  birthDate: "",
  birthPlace: "",
  address: "",
  originAddress: "",
  phone: "",
  email: "",
  occupation: "",
  maritalStatus: "",
  childOrder: "",
  siblingsCount: "",
  educationSD: "",
  educationSMP: "",
  educationSMA: "",
  educationCollege: "",
  educationSDMajor: "",
  educationSDYearStart: "",
  educationSDYearEnd: "",
  educationSMPMajor: "",
  educationSMPYearStart: "",
  educationSMPYearEnd: "",
  educationSMAMajor: "",
  educationSMAYearStart: "",
  educationSMAYearEnd: "",
  educationCollegeMajor: "",
  educationCollegeYearStart: "",
  educationCollegeYearEnd: "",
};

// Data klien untuk Formulir Konsultasi Pasangan (JenisLayanan.KonselingPasangan).
// Bagian A pada formulir pasangan jauh lebih sederhana daripada formulir individu:
// tidak ada jenis kelamin, tanggal/tempat lahir, status pernikahan, anak ke-, atau
// riwayat pendidikan — hanya identitas dasar klien + identitas dasar pasangan.
interface CoupleClientFormData {
  fullName: string;
  age: string;
  address: string;
  phone: string;
  email: string;
  occupation: string;
  partnerName: string;
  partnerAge: string;
  partnerAddress: string;
  partnerOccupation: string;
}

const emptyCoupleClientData: CoupleClientFormData = {
  fullName: "",
  age: "",
  address: "",
  phone: "",
  email: "",
  occupation: "",
  partnerName: "",
  partnerAge: "",
  partnerAddress: "",
  partnerOccupation: "",
};

function OptionPill({
  name,
  value,
  label,
  checked,
  onChange,
  variant = "radio",
}: {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
  variant?: "radio" | "checkbox";
}) {
  return (
    <label className="flex items-center gap-3 py-1.5 cursor-pointer">
      <span
        className={`flex h-4 w-4 flex-shrink-0 items-center justify-center border ${
          variant === "radio" ? "rounded-full" : ""
        } ${checked ? "border-[#1f3b5b] bg-[#1f3b5b]" : "border-gray-400 bg-white"}`}
      >
        {checked && (
          <span className={`h-1.5 w-1.5 bg-white ${variant === "radio" ? "rounded-full" : ""}`} />
        )}
      </span>
      <input
        type={variant}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
      <span className="text-sm text-gray-800">{label}</span>
    </label>
  );
}

function calculateAge(birthday: string): number {
  if (!birthday) return 0;
  const birth = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// 🟢 Helper Generator 4 Tanggal Mendatang Sesuai Hari Praktik
function getAvailableDatesForDay(dayName: string, count = 4) {
  const daysMap: Record<string, number> = {
    Minggu: 0, MINGGU: 0, SUNDAY: 0,
    Senin: 1, SENIN: 1, MONDAY: 1,
    Selasa: 2, SELASA: 2, TUESDAY: 2,
    Rabu: 3, RABU: 3, WEDNESDAY: 3,
    Kamis: 4, KAMIS: 4, THURSDAY: 4,
    Jumat: 5, JUMAT: 5, FRIDAY: 5,
    Sabtu: 6, SABTU: 6, SATURDAY: 6,
  };

  const targetDay = daysMap[dayName] ?? 6;
  const resultDates: { isoDate: string; label: string }[] = [];

  const today = new Date();
  const currentDay = today.getDay();

  let distance = targetDay - currentDay;
  if (distance <= 0) distance += 7;

  const baseDate = new Date(today);
  baseDate.setDate(today.getDate() + distance);

  for (let i = 0; i < count; i++) {
    const nextDate = new Date(baseDate);
    nextDate.setDate(baseDate.getDate() + i * 7);

    const isoDate = nextDate.toISOString().split("T")[0];
    const label = nextDate.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    resultDates.push({ isoDate, label });
  }

  return resultDates;
}

function ConsultationFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service");
  const psychologistId = searchParams.get("psychologist");
  const dateParam = searchParams.get("date");
  const scheduleId = searchParams.get("scheduleId");
  const timeParam = searchParams.get("time") || "16:10";
  const dayParam = searchParams.get("day") || "SABTU";

  const { user, isLoading: isLoadingUser, isGuest } = useRequireCompleteProfile();

  // Deteksi otomatis jenis layanan (individu vs pasangan) berdasarkan `serviceId`
  // di URL, dengan fetch ke backend lewat getLayananById. Kalau jenis layanan
  // adalah "KonselingPasangan" (sesuai enum JenisLayanan di Prisma schema),
  // halaman ini akan render formulir konsultasi pasangan; selain itu tetap
  // pakai formulir individu seperti biasa.
  const [layananJenis, setLayananJenis] = useState<string | null>(null);
  const [isLoadingLayanan, setIsLoadingLayanan] = useState(true);
  const [layananFetchError, setLayananFetchError] = useState<string | null>(null);
  const isCouple = layananJenis === "KonselingPasangan";

  // Preload logo yang dipakai di header PDF, supaya saat tombol "Download PDF"
  // diklik pertama kali gambar sudah ada di cache browser (bukan baru mulai
  // di-fetch), sehingga tinggi elemen sudah pasti benar saat diukur.
  useEffect(() => {
    const img = new window.Image();
    img.src = "/assets/oasejiwalogo.png";
  }, []);

  useEffect(() => {
    if (!serviceId) {
      setIsLoadingLayanan(false);
      return;
    }
    let cancelled = false;
    setIsLoadingLayanan(true);
    setLayananFetchError(null);
    getLayananById(serviceId)
      .then((layanan) => {
        if (!cancelled) setLayananJenis(layanan.jenis);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) {
          setLayananFetchError("Gagal memuat detail layanan. Coba muat ulang halaman.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingLayanan(false);
      });
    return () => {
      cancelled = true;
    };
  }, [serviceId]);

  const [formStep, setFormStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedDay, setSelectedDay] = useState<string>(dayParam);
  const [selectedTime, setSelectedTime] = useState<string>(timeParam);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    if (dateParam && dateParam.length >= 10) return dateParam.split("T")[0];
    const available = getAvailableDatesForDay(dayParam);
    return available[0]?.isoDate || new Date().toISOString().split("T")[0];
  });

  const [clientData, setClientData] = useState<ClientFormData>(emptyClientData);
  const [coupleClientData, setCoupleClientData] = useState<CoupleClientFormData>(emptyCoupleClientData);

  const [coupleConsultationData, setCoupleConsultationData] = useState<Partial<CoupleConsultationFormData>>({
    mainReason: "",
    takingPsychiatricMeds: undefined,
    problemDuration: undefined,
    symptomFrequency: undefined,
    dailyImpact: undefined,
    hasSimilarHistory: "no",
    similarHistoryDetail: "",
    hasFamilyHistory: "no",
    familyHistoryDetail: "",
    hasMedicalTreatment: "no",
    medicalTreatmentDetail: "",
    hasTraumaticEvent: "no",
    traumaticEventDetail: "",
    sleepQuality: undefined,
    partnerSleepQuality: undefined,
  });

  const [consultationData, setConsultationData] = useState<Partial<ConsultationFormData>>({
    mainReason: "",
    takingPsychiatricMeds: undefined,
    problemDuration: undefined,
    symptomFrequency: undefined,
    dailyImpact: undefined,
    hasSimilarHistory: "no",
    similarHistoryDetail: "",
    hasFamilyHistory: "no",
    familyHistoryDetail: "",
    hasMedicalTreatment: "no",
    medicalTreatmentDetail: "",
    hasTraumaticEvent: "no",
    traumaticEventDetail: "",
    sleepQuality: undefined,
    selfHarmThoughts: undefined,
    usesAddictiveSubstances: "no",
    addictiveSubstancesDetail: "",
    eatingPattern: undefined,
    exerciseFrequency: undefined,
    stressLevel: undefined,
    consultationGoals: [],
    therapyPreference: undefined,
  });

  const [consentData, setConsentData] = useState<Partial<ConsentFormData>>({
    consentDate: new Date().toISOString().split("T")[0],
    clientNameConfirmation: "",
    signature: "",
    agreedToTerms: false,
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [useTextSignature, setUseTextSignature] = useState(true);

  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    if (user?.profile) {
      setIsFirstVisit(user.profile.firstPsychologyVisit ?? false);
    }
  }, [user]);

  // ===== Simpan draft formulir ke localStorage supaya tidak hilang saat refresh =====
  // Kunci draft dipisah per akun + per layanan, supaya draft satu klien tidak
  // tertukar dengan klien lain di browser yang sama, dan draft satu layanan
  // tidak tertukar dengan layanan lain.
  const draftStorageKey =
    user && serviceId ? `oasejiwa-booking-draft-${(user as any).id}-${serviceId}` : null;
  const hasLoadedDraftRef = useRef(false);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);

  // Muat draft yang tersimpan (sekali saja, begitu draftStorageKey siap)
  useEffect(() => {
    if (!draftStorageKey || hasLoadedDraftRef.current) return;
    hasLoadedDraftRef.current = true;

    try {
      const raw = window.localStorage.getItem(draftStorageKey);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.clientData) {
          setClientData((prev) => ({ ...prev, ...saved.clientData }));
        }
        if (saved.coupleClientData) {
          setCoupleClientData((prev) => ({ ...prev, ...saved.coupleClientData }));
        }
        if (saved.consultationData) {
          setConsultationData((prev) => ({ ...prev, ...saved.consultationData }));
        }
        if (saved.coupleConsultationData) {
          setCoupleConsultationData((prev) => ({ ...prev, ...saved.coupleConsultationData }));
        }
        if (typeof saved.isFirstVisit === "boolean") {
          setIsFirstVisit(saved.isFirstVisit);
        }
        // Step 3 (persetujuan & tanda tangan) sengaja tidak dipulihkan otomatis —
        // klien tetap perlu menyetujui & tanda tangan ulang tiap sesi demi keabsahan
        // persetujuan, jadi step dibatasi maksimal ke step 2.
        if (typeof saved.formStep === "number") {
          setFormStep(Math.min(saved.formStep, 2));
        }
      }
    } catch (err) {
      console.error("Gagal memuat draft formulir:", err);
    } finally {
      setIsDraftLoaded(true);
    }
  }, [draftStorageKey]);

  // Simpan draft setiap kali data step 1 & 2 berubah, setelah draft awal selesai dimuat
  // (supaya tidak menimpa draft lama dengan state kosong sebelum sempat dimuat).
  useEffect(() => {
    if (!draftStorageKey || !isDraftLoaded) return;
    try {
      window.localStorage.setItem(
        draftStorageKey,
        JSON.stringify({
          clientData,
          coupleClientData,
          consultationData,
          coupleConsultationData,
          isFirstVisit,
          formStep,
        })
      );
    } catch (err) {
      console.error("Gagal menyimpan draft formulir:", err);
    }
  }, [
    draftStorageKey,
    isDraftLoaded,
    clientData,
    coupleClientData,
    consultationData,
    coupleConsultationData,
    isFirstVisit,
    formStep,
  ]);

  const clearDraft = () => {
    if (!draftStorageKey) return;
    try {
      window.localStorage.removeItem(draftStorageKey);
    } catch (err) {
      console.error("Gagal menghapus draft formulir:", err);
    }
  };
  // ===== Selesai bagian draft localStorage =====

  // Ambil data pribadi dari profil akun (diisi saat registrasi), tapi tetap
  // bisa diedit lagi oleh klien di form ini. Hanya mengisi field yang masih
  // kosong supaya tidak menimpa perubahan yang sudah diketik klien.
  // Struktur data mengikuti response getMe(): { email, profile: { name, gender: "MALE"|"FEMALE", birthday, phone, fullAddress, country, city } }
  useEffect(() => {
    if (!user) return;
    const profile = (user as any).profile || {};
    const genderMap: Record<string, string> = { MALE: "male", FEMALE: "female" };
    const autoBirthDate = profile.birthday
      ? new Date(profile.birthday).toISOString().split("T")[0]
      : "";
    const autoAddress = [profile.fullAddress, profile.city, profile.country]
      .filter(Boolean)
      .join(", ");

    setClientData((prev) => ({
      ...prev,
      fullName: prev.fullName || profile.name || "",
      gender: prev.gender || (profile.gender ? genderMap[profile.gender] ?? "" : ""),
      birthDate: prev.birthDate || autoBirthDate,
      email: prev.email || (user as any).email || "",
      phone: prev.phone || profile.phone || "",
      address: prev.address || autoAddress,
    }));

    // Sama seperti clientData: isi otomatis field yang masih kosong pada
    // formulir pasangan dari profil akun, tanpa menimpa yang sudah diketik klien.
    setCoupleClientData((prev) => ({
      ...prev,
      fullName: prev.fullName || profile.name || "",
      email: prev.email || (user as any).email || "",
      phone: prev.phone || profile.phone || "",
      address: prev.address || autoAddress,
    }));
  }, [user]);

  const bookingId = `OJ-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  useEffect(() => {
    if (!useTextSignature && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#234463";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
      }
    }
  }, [useTextSignature]);

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#2B5379] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isGuest) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#E8F6FF] rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-[#2B5379]" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Login Diperlukan</h2>
          <p className="text-slate-500 text-sm mb-6">
            Untuk melakukan booking konsultasi, Anda perlu login terlebih dahulu.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push(`/auth/signin?redirect=${encodeURIComponent(window.location.href)}`)}
              className="w-full py-2 rounded-xl bg-[#2B5379] text-white font-semibold hover:bg-[#234463] transition-colors cursor-pointer"
            >
              Login Sekarang
            </button>
            <button
              onClick={() => router.back()}
              className="w-full py-2 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingLayanan) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#2B5379] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (layananFetchError) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Gagal Memuat Layanan</h2>
          <p className="text-slate-500 text-sm mb-6">{layananFetchError}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2 rounded-xl bg-[#2B5379] text-white font-semibold hover:bg-[#234463] transition-colors"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const clientAge = clientData.birthDate ? calculateAge(clientData.birthDate) : 0;

  const handleClientDataChange = (field: keyof ClientFormData, value: string) => {
    setClientData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCoupleClientDataChange = (field: keyof CoupleClientFormData, value: string) => {
    setCoupleClientData((prev) => ({ ...prev, [field]: value }));
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    if (ctx) {
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      setConsentData((prev) => ({
        ...prev,
        signature: canvasRef.current?.toDataURL() || "",
      }));
    }
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    setConsentData((prev) => ({ ...prev, signature: "" }));
  };

  const validateStep2 = (): boolean => {
    const result = consultationFormSchema.safeParse(consultationData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      const issues = result.error.issues || [];
      issues.forEach((err) => {
        const key = String(err.path[0]);
        newErrors[key] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep2Couple = (): boolean => {
    const result = coupleConsultationFormSchema.safeParse(coupleConsultationData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      const issues = result.error.issues || [];
      issues.forEach((err) => {
        const key = String(err.path[0]);
        newErrors[key] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep3 = (): boolean => {
    const result = consentFormSchema.safeParse(consentData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      const issues = result.error.issues || [];
      issues.forEach((err) => {
        const key = String(err.path[0]);
        newErrors[key] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const toValidIsoDateString = (inputDateStr: string): string => {
    if (!inputDateStr) return new Date().toISOString();
    const cleanDate = inputDateStr.split("T")[0];
    const d = new Date(`${cleanDate}T00:00:00.000Z`);
    return !isNaN(d.getTime()) ? d.toISOString() : new Date().toISOString();
  };

  const handleNextFormStep = async () => {
    if (!selectedDate) {
      alert("Mohon pilih tanggal sesi konsultasi terlebih dahulu.");
      return;
    }

    if (formStep === 1) {
      setFormStep(2);
    } else if (formStep === 2) {
      if (isCouple ? validateStep2Couple() : validateStep2()) {
        setFormStep(3);
      }
    } else if (formStep === 3) {
      if (validateStep3()) {
        try {
          setIsSubmitting(true);
          const durationMap: Record<string, string> = {
            "<1month": "LESS_THAN_1_MONTH",
            "1-3months": "ONE_TO_3_MONTHS",
            "3-6months": "THREE_TO_6_MONTHS",
            ">6months": "MORE_THAN_6_MONTHS",
          };
          const stressMap: Record<string, string> = {
            veryHigh: "VERY_HIGH",
          };
          const therapyMap: Record<string, string> = {
            noPreference: "NO_PREFERENCE",
          };

          // Bentuk consultationForm berbeda untuk layanan pasangan (lihat
          // coupleConsultationFormSchema) vs layanan individu.
          // CATATAN: sama seperti clientData pada formulir individu (yang juga
          // tidak dikirim ke createBooking), coupleClientData (nama/usia/alamat
          // klien & pasangan) saat ini HANYA dipakai untuk formulir cetak/PDF,
          // belum dikirim ke API. Kalau backend butuh data ini per booking,
          // beri tahu aku bentuk payload yang diharapkan supaya bisa ditambahkan.
          const mappedConsultation = isCouple
            ? {
                ...coupleConsultationData,
                problemDuration:
                  durationMap[coupleConsultationData.problemDuration!] ??
                  coupleConsultationData.problemDuration?.toUpperCase(),
                symptomFrequency: coupleConsultationData.symptomFrequency?.toUpperCase(),
                dailyImpact: coupleConsultationData.dailyImpact?.toUpperCase(),
                sleepQuality: coupleConsultationData.sleepQuality?.toUpperCase(),
                partnerSleepQuality: coupleConsultationData.partnerSleepQuality?.toUpperCase(),
              }
            : {
                ...consultationData,
                problemDuration:
                  durationMap[consultationData.problemDuration!] ??
                  consultationData.problemDuration?.toUpperCase(),
                symptomFrequency: consultationData.symptomFrequency?.toUpperCase(),
                dailyImpact: consultationData.dailyImpact?.toUpperCase(),
                sleepQuality: consultationData.sleepQuality?.toUpperCase(),
                selfHarmThoughts: consultationData.selfHarmThoughts?.toUpperCase(),
                eatingPattern: consultationData.eatingPattern?.toUpperCase(),
                exerciseFrequency: consultationData.exerciseFrequency?.toUpperCase(),
                stressLevel:
                  stressMap[consultationData.stressLevel!] ??
                  consultationData.stressLevel?.toUpperCase(),
                therapyPreference:
                  therapyMap[consultationData.therapyPreference!] ??
                  consultationData.therapyPreference?.toUpperCase(),
              };

          const validScheduledDate = toValidIsoDateString(selectedDate);
const validConsentDate = toValidIsoDateString(consentData.consentDate!);

// 🟢 PERBARUI BAGIAN PAYLOAD INI:
const payload: any = {
  serviceId: Number(serviceId),
  psychologistId: psychologistId || "",
  scheduledDate: validScheduledDate,
  scheduledTime: selectedTime,
  consultationForm: mappedConsultation,
  consentForm: {
    consentDate: consentData.consentDate,
    clientNameConfirmation: consentData.clientNameConfirmation,
    signatureData: consentData.signature,
    signatureType: useTextSignature ? "TEXT" : "DRAWING",
    agreedToTerms: consentData.agreedToTerms ?? false,
  },
};

// 🟢 Hanya masukkan scheduleId jika nilainya berupa string valid
if (
  scheduleId &&
  scheduleId !== "null" &&
  scheduleId !== "undefined" &&
  scheduleId.trim() !== ""
) {
  payload.scheduleId = scheduleId;
}

const booking = await createBooking(payload);
clearDraft();
router.push(`/booking/payment-method?bookingId=${booking.data.id}`);
        } catch (error: any) {
          console.error(error);
          alert(
            error instanceof Error ? error.message : "Gagal membuat booking"
          );
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  const handlePrevFormStep = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
      setErrors({});
    }
  };

  const handleConsultationChange = (
    field: keyof ConsultationFormData,
    value: string | string[]
  ) => {
    setConsultationData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCoupleConsultationChange = (
    field: keyof CoupleConsultationFormData,
    value: string
  ) => {
    setCoupleConsultationData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleGoalToggle = (goal: string) => {
    const currentGoals = consultationData.consultationGoals || [];
    if (currentGoals.includes(goal)) {
      handleConsultationChange(
        "consultationGoals",
        currentGoals.filter((g) => g !== goal)
      );
    } else {
      handleConsultationChange("consultationGoals", [...currentGoals, goal]);
    }
  };

  // PDF download handler
  const generatePDF = async () => {
    // Pastikan bagian F. Pernyataan Persetujuan (nama konfirmasi, tanda tangan,
    // dan centang persetujuan) sudah lengkap SEBELUM proses download PDF
    // dimulai. Kalau belum lengkap, tampilkan pesan error di masing-masing
    // field (lewat validateStep3) dan hentikan proses download.
    if (!validateStep3()) {
      const consentSection = document.getElementById("consent-section");
      consentSection?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setIsDownloading(true);
    try {
      const element = document.getElementById("booking-form-pdf-content");
      const headerBlock = document.getElementById("pdf-header-block");
      const forcePageBreakBlock = document.getElementById("pdf-force-pagebreak");
      if (!element || !headerBlock) {
        setIsDownloading(false);
        return;
      }

      // 0. Tunggu semua <img> di dalam elemen (mis. logo header) benar-benar
      // selesai dimuat sebelum diukur/di-capture. Tanpa ini, pada percobaan
      // download PERTAMA (gambar belum ada di cache browser) tinggi logo
      // masih 0px saat diukur, sehingga semua perhitungan posisi header &
      // titik potong halaman jadi salah -> hasil PDF kosong/berantakan.
      // Download kedua terlihat normal karena gambar sudah ter-cache.
      const waitForImages = (root: HTMLElement) => {
        const imgs = Array.from(root.querySelectorAll("img"));
        return Promise.all(
          imgs.map((img) => {
            if (img.complete && img.naturalWidth > 0) return Promise.resolve();
            return new Promise<void>((resolve) => {
              img.addEventListener("load", () => resolve(), { once: true });
              img.addEventListener("error", () => resolve(), { once: true });
            });
          })
        );
      };
      await waitForImages(element);

      // 1. Ukur posisi elemen SEBELUM di-clone (dalam px DOM asli), supaya kita
      // tahu di mana header berakhir (untuk diulang tiap halaman) dan di mana
      // batas-batas aman antar elemen berada (supaya potongan antar halaman
      // tidak pernah memotong teks/baris di tengah).
      const containerRect = element.getBoundingClientRect();
      const headerRect = headerBlock.getBoundingClientRect();
      const headerBottomDomPx = headerRect.bottom - containerRect.top;

      // Bagian "Catatan untuk Psikolog" WAJIB dimulai di halaman baru (page break),
      // supaya selalu jadi 1 halaman sendiri di akhir dokumen, tidak nyambung
      // dengan halaman sebelumnya.
      const forcedBreakDomPx = forcePageBreakBlock
        ? forcePageBreakBlock.getBoundingClientRect().top - containerRect.top
        : null;

      const breakSet = new Set<number>();
      element
        .querySelectorAll<HTMLElement>("div, p, tr, h1, h2, h3, table, ul, li")
        .forEach((el) => {
          const r = el.getBoundingClientRect();
          const bottom = Math.round(r.bottom - containerRect.top);
          if (bottom > headerBottomDomPx) breakSet.add(bottom);
        });
      const bodyBreaksDomPx = Array.from(breakSet).sort((a, b) => a - b);

      const cloneElement = element.cloneNode(true) as HTMLElement;

      const tempWrapper = document.createElement("div");
      tempWrapper.style.position = "absolute";
      tempWrapper.style.left = "-9999px";
      tempWrapper.style.top = "-9999px";
      tempWrapper.style.backgroundColor = "#ffffff";
      tempWrapper.style.padding = "0";
      tempWrapper.style.width = "850px";
      tempWrapper.appendChild(cloneElement);
      document.body.appendChild(tempWrapper);

      const allElements = cloneElement.querySelectorAll<HTMLElement>("*");
      allElements.forEach((el) => {
        const computed = window.getComputedStyle(el);
        const bg = computed.backgroundColor;
        const col = computed.color;
        const border = computed.borderColor;

        if (bg && bg !== "rgba(0, 0, 0, 0)") el.style.backgroundColor = bg;
        if (col && col !== "rgba(0, 0, 0, 0)") el.style.color = col;
        if (border && border !== "rgba(0, 0, 0, 0)") el.style.borderColor = border;
      });

      const styleTags = cloneElement.querySelectorAll("style");
      styleTags.forEach((tag) => tag.remove());

      const canvas = await html2canvas(cloneElement, {
        scale: 2,
        backgroundColor: "#ffffff",
        allowTaint: true,
        useCORS: true,
        logging: false,
        width: 850,
        ignoreElements: (el) =>
          el.tagName === "SCRIPT" || el.tagName === "NOSCRIPT",
        onclone: (clonedDoc) => {
          const imgs = clonedDoc.querySelectorAll("img");
          imgs.forEach((img) => {
            if (!img.getAttribute("crossorigin")) {
              img.setAttribute("crossorigin", "anonymous");
            }
          });
        },
      });

      document.body.removeChild(tempWrapper);

      // 2. Konversi ukuran dari px DOM asli -> px canvas hasil render (scale:2, width:850)
      const scaleRatio = canvas.width / 850;
      const headerBottomPx = Math.round(headerBottomDomPx * scaleRatio);
      const bodyBreaksPx = bodyBreaksDomPx.map((v) => Math.round(v * scaleRatio));
      const forcedBreakPx =
        forcedBreakDomPx !== null ? Math.round(forcedBreakDomPx * scaleRatio) : null;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const contentWidth = pageWidth - margin * 2;
      const footerReserveMm = 7;
      const headerGapMm = 3;

      const headerHeightMm = (headerBottomPx * contentWidth) / canvas.width;
      const bodyAvailableHeightMm =
        pageHeight - margin * 2 - headerHeightMm - headerGapMm - footerReserveMm;
      const bodyPageHeightPx = Math.max(
        50,
        Math.floor((bodyAvailableHeightMm * canvas.width) / contentWidth)
      );

      // 3. Tentukan titik potong antar halaman: cari batas elemen teraman
      // (bukan potongan lurus per piksel) supaya tidak ada teks yang terpotong.
      // Bagian "Catatan untuk Psikolog" dipaksa selalu mulai di halaman baru.
      const pageBreaksPx: number[] = [headerBottomPx];
      let cursor = headerBottomPx;
      while (cursor < canvas.height) {
        let naive = Math.min(cursor + bodyPageHeightPx, canvas.height);
        const isForcedBreakAhead =
          forcedBreakPx !== null && forcedBreakPx > cursor && forcedBreakPx < naive;
        if (isForcedBreakAhead) {
          naive = forcedBreakPx as number;
        }

        let cut = naive;
        if (naive < canvas.height && !isForcedBreakAhead) {
          const candidates = bodyBreaksPx.filter(
            (b) => b > cursor + 20 && b <= naive
          );
          if (candidates.length > 0) cut = candidates[candidates.length - 1];
        }
        if (cut <= cursor) cut = naive; // jaga-jaga agar tidak terjebak loop
        pageBreaksPx.push(cut);
        cursor = cut;
      }

      const totalPages = pageBreaksPx.length - 1;

      // Potong bagian header sekali saja dari canvas utuh, lalu dipakai berulang
      const headerCanvas = document.createElement("canvas");
      headerCanvas.width = canvas.width;
      headerCanvas.height = headerBottomPx;
      const headerCtx = headerCanvas.getContext("2d");
      if (headerCtx) {
        headerCtx.fillStyle = "#ffffff";
        headerCtx.fillRect(0, 0, headerCanvas.width, headerCanvas.height);
        headerCtx.drawImage(
          canvas,
          0,
          0,
          canvas.width,
          headerBottomPx,
          0,
          0,
          canvas.width,
          headerBottomPx
        );
      }
      const headerImgData = headerCanvas.toDataURL("image/png");

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }

        // HEADER: ditempel ulang di setiap halaman
        pdf.addImage(headerImgData, "PNG", margin, margin, contentWidth, headerHeightMm);

        const sourceY = pageBreaksPx[page];
        const sourceH = pageBreaksPx[page + 1] - sourceY;

        if (sourceH > 0) {
          const pageCanvas = document.createElement("canvas");
          pageCanvas.width = canvas.width;
          pageCanvas.height = sourceH;
          const pageCtx = pageCanvas.getContext("2d");
          if (pageCtx) {
            pageCtx.fillStyle = "#ffffff";
            pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            pageCtx.drawImage(
              canvas,
              0,
              sourceY,
              canvas.width,
              sourceH,
              0,
              0,
              canvas.width,
              sourceH
            );

            const pageImgData = pageCanvas.toDataURL("image/png");
            const sliceHeightMm = (sourceH * contentWidth) / canvas.width;

            pdf.addImage(
              pageImgData,
              "PNG",
              margin,
              margin + headerHeightMm + headerGapMm,
              contentWidth,
              sliceHeightMm
            );
          }
        }

        // FOOTER: garis tipis + kotak nomor halaman teal di kanan bawah (tiap halaman)
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.2);
        pdf.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

        const badgeW = 10;
        const badgeH = 7;
        const badgeX = pageWidth - margin - badgeW;
        const badgeY = pageHeight - 10;
        pdf.setFillColor(93, 184, 214); // teal - senada gradasi header
        pdf.roundedRect(badgeX, badgeY, badgeW, badgeH, 1.5, 1.5, "F");
        pdf.setFontSize(9);
        pdf.setTextColor(255, 255, 255);
        pdf.text(String(page + 1), badgeX + badgeW / 2, badgeY + badgeH / 2 + 1, {
          align: "center",
        });

        pdf.setFontSize(7);
        pdf.setTextColor(140, 140, 140);
        pdf.text(
          "Dokumen dihasilkan otomatis oleh sistem Booking Oase Jiwa",
          margin,
          pageHeight - 7
        );
      }

      const safeName = (clientData.fullName || "Klien").replace(/[\\/:*?"<>|]/g, "_");
      const fileName = `Formulir-Pendaftaran-Klien-${safeName}.pdf`;

      pdf.save(fileName);
    } catch (err) {
      console.error("PDF Error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Printable Form Component - Presisi persis template PDF Biro Psikologi Oase Jiwa
  const renderPrintableForm = () => {
    const RenderBox = ({ checked, label }: { checked: boolean; label: string }) => (
      <span className="inline-flex items-center gap-1.5 mr-4 my-1">
        <span
          className={`inline-flex h-4 w-4 flex-shrink-0 items-center justify-center border border-gray-800 text-[10px] font-bold ${
            checked ? "bg-slate-800 text-white" : "bg-white text-transparent"
          }`}
        >
          {checked ? "✓" : ""}
        </span>
        <span className="text-xs text-gray-900">{label}</span>
      </span>
    );

    // Field-field bagian B (Alasan Konsultasi) sama persis antara formulir
    // individu dan formulir pasangan, jadi cukup pilih sumber datanya di sini.
    const activeConsultation: Partial<ConsultationFormData> | Partial<CoupleConsultationFormData> =
      isCouple ? coupleConsultationData : consultationData;

    return (
      <div
        id="booking-form-pdf-content"
        className="bg-white p-10 shadow-sm"
        style={{
          fontFamily: "Arial, sans-serif",
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: "850px",
          color: "#1a1a1a",
          lineHeight: "1.5",
        }}
      >
        {/* HEADER DENGAN LOGO & JUDUL TEMPLATE - diulang di setiap halaman PDF */}
        <div
          id="pdf-header-block"
          className="bg-gradient-to-r from-[#CAFBDA] via-[#AFDAEC] to-[#95BBFE] text-white px-6 py-5 text-center -mt-10 -mx-10 mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              src="/assets/oasejiwalogo.png"
              alt="Logo Oase Jiwa"
              crossOrigin="anonymous"
              className="h-12 w-auto object-contain"
            />
            <div className="text-left">
              <h2 className="text-xl font-extrabold uppercase tracking-wider text-white leading-tight">
                BIRO PSIKOLOGI OASE JIWA
              </h2>
              <p className="text-xs italic text-blue-100 font-medium">Temukan Dirimu, Pulihkan Jiwamu</p>
            </div>
          </div>
        </div>

        {/* Judul formulir - hanya tampil sekali di halaman pertama, sebelum bagian A */}
        <h1 className="mb-6 text-center text-base font-bold uppercase tracking-wide text-[#1f3b5b] border-b-2 border-[#1f3b5b] pb-2">
          FORMULIR PENDAFTARAN KLIEN BARU
        </h1>

        {isCouple ? (
          /* A. INFORMASI KLIEN — versi Konseling Pasangan, mengikuti
             Formulir_Klien_Oase_Jiwa_Pasangan.doc: identitas dasar klien +
             identitas dasar pasangan, tanpa jenis kelamin/tanggal lahir/status
             pernikahan/riwayat pendidikan seperti pada formulir individu. */
          <div className="mb-6 space-y-2 text-xs">
            <h3 className="text-sm font-bold italic uppercase text-[#1f3b5b] mb-3">
              A. INFORMASI KLIEN
            </h3>

            <div className="grid grid-cols-1 gap-y-2">
              <div>
                <span className="font-semibold">1. Nama Lengkap: </span>
                <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                  {coupleClientData.fullName || "...................................................................................."}
                </span>
              </div>
              <div>
                <span className="font-semibold">2. Nama Pasangan: </span>
                <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                  {coupleClientData.partnerName || "...................................................................................."}
                </span>
              </div>
              <div className="flex flex-col gap-y-2">
                <div>
                  <span className="font-semibold">3. Usia: </span>
                  <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                    {coupleClientData.age || "......"}
                  </span>{" "}
                  tahun
                </div>
                <div>
                  <span className="font-semibold">4. Usia Pasangan: </span>
                  <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                    {coupleClientData.partnerAge || "......"}
                  </span>{" "}
                  tahun
                </div>
              </div>
              <div>
                <span className="font-semibold">5. Alamat: </span>
                <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                  {coupleClientData.address || "...................................................................................."}
                </span>
              </div>
              <div>
                <span className="font-semibold">6. Alamat Pasangan: </span>
                <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                  {coupleClientData.partnerAddress || "...................................................................................."}
                </span>
              </div>
              <div className="flex flex-col gap-y-2">
                <div>
                  <span className="font-semibold">7. Nomor Telepon: </span>
                  <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                    {coupleClientData.phone || "..................................."}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">8. Email: </span>
                  <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                    {coupleClientData.email || "..................................."}
                  </span>
                </div>
              </div>
              <div>
                <span className="font-semibold">9. Pekerjaan: </span>
                <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                  {coupleClientData.occupation || "..................................................."}
                </span>
              </div>
              <div>
                <span className="font-semibold">10. Pekerjaan Pasangan: </span>
                <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                  {coupleClientData.partnerOccupation || "..................................................."}
                </span>
              </div>
              <div>
                <span className="font-semibold mr-2">11. Apakah ini kunjungan pertama Anda ke layanan psikologi:</span>
                <RenderBox checked={isFirstVisit} label="Ya" />
                <RenderBox checked={!isFirstVisit} label="Tidak, Saya sudah pernah" />
              </div>
            </div>
          </div>
        ) : (
        /* A. INFORMASI KLIEN — versi individu */
        <div className="mb-6 space-y-2 text-xs">
          <h3 className="text-sm font-bold italic uppercase text-[#1f3b5b] mb-3">
            A. INFORMASI KLIEN
          </h3>

          <div className="grid grid-cols-1 gap-y-2">
            <div>
              <span className="font-semibold">1. Nama Lengkap: </span>
              <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                {clientData.fullName || "...................................................................................."}
              </span>
            </div>

            <div>
              <span className="font-semibold mr-2">2. Jenis Kelamin :</span>
              <RenderBox checked={clientData.gender === "male"} label="Laki-laki" />
              <RenderBox checked={clientData.gender === "female"} label="Perempuan" />
            </div>

            <div className="flex flex-col gap-y-2">
              <div>
                <span className="font-semibold">3. Tanggal Lahir : </span>
                <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                  {clientData.birthDate
                    ? new Date(clientData.birthDate + "T00:00:00").toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "..................................."}
                </span>
              </div>
              <div>
                <span className="font-semibold">4. Tempat Lahir : </span>
                <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                  {clientData.birthPlace || "..................................."}
                </span>
              </div>
              <div>
                <span className="font-semibold">5. Usia : </span>
                <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                  {clientAge ? `${clientAge}` : "......"}
                </span>{" "}
                tahun
              </div>
            </div>

            <div>
              <span className="font-semibold">6. Alamat : </span>
              <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                {clientData.address || "...................................................................................."}
              </span>
            </div>

            <div>
              <span className="font-semibold">7. Anak ke </span>
              <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                {clientData.childOrder || "......"}
              </span>{" "}
              dari{" "}
              <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                {clientData.siblingsCount || "......"}
              </span>{" "}
              Bersaudara
            </div>

            <div>
              <span className="font-semibold">8. Alamat Asal : </span>
              <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                {clientData.originAddress || "...................................................................................."}
              </span>
            </div>

            <div className="flex flex-col gap-y-2">
              <div>
                <span className="font-semibold">9. Nomor Telepon : </span>
                <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                  {clientData.phone || "..................................."}
                </span>
              </div>
              <div>
                <span className="font-semibold">10. Email : </span>
                <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                  {clientData.email || "..................................."}
                </span>
              </div>
            </div>

            <div>
              <span className="font-semibold">11. Pekerjaan : </span>
              <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                {clientData.occupation || "..................................................."}
              </span>
            </div>

            <div>
              <span className="font-semibold mr-2">12. Status Pernikahan:</span>
              <RenderBox checked={clientData.maritalStatus === "single"} label="Lajang" />
              <RenderBox checked={clientData.maritalStatus === "married"} label="Menikah" />
              <RenderBox checked={clientData.maritalStatus === "divorced"} label="Duda/Janda" />
            </div>

            <div>
              <span className="font-semibold mr-2">13. Apakah ini kunjungan pertama Anda ke layanan psikologi:</span>
              <RenderBox checked={isFirstVisit} label="Ya" />
              <RenderBox checked={!isFirstVisit} label="Tidak, Saya sudah pernah" />
            </div>

            <div className="mt-2">
              <span className="font-semibold">14. Riwayat Pendidikan:</span>
              <table className="mt-1 w-full border-collapse border border-gray-400 text-xs">
                <thead>
                  <tr className="bg-[#cfe2f3] font-semibold text-[#1f3b5b]">
                    <th className="border border-gray-400 px-2 py-1 text-left w-28">Jenjang</th>
                    <th className="border border-gray-400 px-2 py-1 text-left">Sekolah/Perguruan Tinggi</th>
                    <th className="border border-gray-400 px-2 py-1 text-left w-32">Jurusan</th>
                    <th className="border border-gray-400 px-2 py-1 text-center w-24">Tahun Masuk</th>
                    <th className="border border-gray-400 px-2 py-1 text-center w-24">Tahun Lulus</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "SD",
                      val: clientData.educationSD,
                      major: clientData.educationSDMajor,
                      yearStart: clientData.educationSDYearStart,
                      yearEnd: clientData.educationSDYearEnd,
                    },
                    {
                      label: "SMP",
                      val: clientData.educationSMP,
                      major: clientData.educationSMPMajor,
                      yearStart: clientData.educationSMPYearStart,
                      yearEnd: clientData.educationSMPYearEnd,
                    },
                    {
                      label: "SMA",
                      val: clientData.educationSMA,
                      major: clientData.educationSMAMajor,
                      yearStart: clientData.educationSMAYearStart,
                      yearEnd: clientData.educationSMAYearEnd,
                    },
                    {
                      label: "Perguruan Tinggi",
                      val: clientData.educationCollege,
                      major: clientData.educationCollegeMajor,
                      yearStart: clientData.educationCollegeYearStart,
                      yearEnd: clientData.educationCollegeYearEnd,
                    },
                  ].map((row) => (
                    <tr key={row.label} className="border-t border-gray-300">
                      <td className="border border-gray-400 px-2 py-1 font-medium">{row.label}</td>
                      <td className="border border-gray-400 px-2 py-1">{row.val || "-"}</td>
                      <td className="border border-gray-400 px-2 py-1">{row.major || "-"}</td>
                      <td className="border border-gray-400 px-2 py-1 text-center">{row.yearStart || "-"}</td>
                      <td className="border border-gray-400 px-2 py-1 text-center">{row.yearEnd || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}

        {/* B. ALASAN KONSULTASI */}
        <div className="mb-6 space-y-2 text-xs">
          <h3 className="text-sm font-bold italic uppercase text-[#1f3b5b] mb-3">
            B. ALASAN KONSULTASI
          </h3>

          <div className="space-y-2">
            <div>
              <p className="font-semibold">1. Alasan utama mencari layanan psikologi :</p>
              <p className="pl-4 pt-1 font-medium text-slate-800 border-b border-dotted border-gray-500 pb-1">
                {activeConsultation.mainReason || "...................................................................................................................................................."}
              </p>
            </div>

            <div>
              <span className="font-semibold mr-2">2. Apakah saat ini sedang mengonsumsi obat-obatan psikiatri?</span>
              <RenderBox checked={activeConsultation.takingPsychiatricMeds === "yes"} label="Ya" />
              <RenderBox checked={activeConsultation.takingPsychiatricMeds === "no"} label="Tidak" />
            </div>

            <div>
              <p className="font-semibold">3. Sejak kapan Anda mengalami masalah ini?</p>
              <div className="flex flex-wrap gap-2 pl-2 pt-0.5">
                <RenderBox checked={activeConsultation.problemDuration === "<1month"} label="Kurang dari 1 bulan" />
                <RenderBox checked={activeConsultation.problemDuration === "1-3months"} label="1-3 bulan" />
                <RenderBox checked={activeConsultation.problemDuration === "3-6months"} label="3-6 bulan" />
                <RenderBox checked={activeConsultation.problemDuration === ">6months"} label="Lebih dari 6 bulan" />
              </div>
            </div>

            <div>
              <p className="font-semibold">4. Seberapa sering Anda merasakan gejala ini?</p>
              <div className="flex flex-wrap gap-2 pl-2 pt-0.5">
                <RenderBox checked={activeConsultation.symptomFrequency === "daily"} label="Setiap hari" />
                <RenderBox checked={activeConsultation.symptomFrequency === "weekly"} label="Beberapa kali dalam seminggu" />
                <RenderBox checked={activeConsultation.symptomFrequency === "monthly"} label="Beberapa kali dalam sebulan" />
                <RenderBox checked={activeConsultation.symptomFrequency === "rarely"} label="Jarang" />
              </div>
            </div>

            <div>
              <p className="font-semibold">5. Bagaimana perasaan atau dampaknya terhadap kehidupan sehari-hari Anda?</p>
              <div className="flex flex-wrap gap-2 pl-2 pt-0.5">
                <RenderBox checked={activeConsultation.dailyImpact === "none"} label="Tidak terlalu mengganggu" />
                <RenderBox checked={activeConsultation.dailyImpact === "mild"} label="Sedikit mengganggu" />
                <RenderBox checked={activeConsultation.dailyImpact === "moderate"} label="Cukup mengganggu" />
                <RenderBox checked={activeConsultation.dailyImpact === "severe"} label="Sangat mengganggu" />
              </div>
            </div>
          </div>
        </div>

        {/* C. RIWAYAT PSIKOLOGIS DAN KESEHATAN */}
        <div className="mb-6 space-y-2 text-xs">
          <h3 className="text-sm font-bold italic uppercase text-[#1f3b5b] mb-3">
            C. RIWAYAT PSIKOLOGIS DAN KESEHATAN
          </h3>

          {isCouple ? (
            <div className="space-y-2">
              <div>
                <p className="font-semibold">1. Apakah Anda dan pasangan pernah mengalami hal serupa sebelumnya?</p>
                <div className="pl-2 pt-0.5">
                  <RenderBox
                    checked={coupleConsultationData.hasSimilarHistory === "yes"}
                    label={`Ya, kapan: ${coupleConsultationData.hasSimilarHistory === "yes" && coupleConsultationData.similarHistoryDetail ? coupleConsultationData.similarHistoryDetail : "..................................."}`}
                  />
                  <RenderBox checked={coupleConsultationData.hasSimilarHistory === "no"} label="Tidak" />
                </div>
              </div>

              <div>
                <p className="font-semibold">2. Apakah ada anggota keluarga yang memiliki riwayat gangguan psikologis?</p>
                <div className="pl-2 pt-0.5">
                  <RenderBox
                    checked={coupleConsultationData.hasFamilyHistory === "yes"}
                    label={`Ya (sebutkan hubungan dan jenis gangguan jika diketahui): ${coupleConsultationData.hasFamilyHistory === "yes" && coupleConsultationData.familyHistoryDetail ? coupleConsultationData.familyHistoryDetail : "..................................."}`}
                  />
                  <RenderBox checked={coupleConsultationData.hasFamilyHistory === "no"} label="Tidak" />
                </div>
              </div>

              <div>
                <p className="font-semibold">3. Apakah Anda atau pasangan sedang menjalani pengobatan medis atau terapi psikologis?</p>
                <div className="pl-2 pt-0.5">
                  <RenderBox
                    checked={coupleConsultationData.hasMedicalTreatment === "yes"}
                    label={`Ya, sebutkan: ${coupleConsultationData.hasMedicalTreatment === "yes" && coupleConsultationData.medicalTreatmentDetail ? coupleConsultationData.medicalTreatmentDetail : "..................................."}`}
                  />
                  <RenderBox checked={coupleConsultationData.hasMedicalTreatment === "no"} label="Tidak" />
                </div>
              </div>

              <div>
                <p className="font-semibold">4. Apakah Anda atau pasangan pernah mengalami kejadian traumatis (misalnya kehilangan orang terdekat, kecelakaan, kekerasan, dll.)?</p>
                <div className="pl-2 pt-0.5">
                  <RenderBox
                    checked={coupleConsultationData.hasTraumaticEvent === "yes"}
                    label={`Ya, sebutkan jika bersedia: ${coupleConsultationData.hasTraumaticEvent === "yes" && coupleConsultationData.traumaticEventDetail ? coupleConsultationData.traumaticEventDetail : "..................................."}`}
                  />
                  <RenderBox checked={coupleConsultationData.hasTraumaticEvent === "no"} label="Tidak" />
                </div>
              </div>

              <div>
                <p className="font-semibold">5. Bagaimana kualitas tidur Anda dalam sebulan terakhir?</p>
                <div className="flex flex-wrap gap-2 pl-2 pt-0.5">
                  <RenderBox checked={coupleConsultationData.sleepQuality === "good"} label="Baik (7-8 jam per hari)" />
                  <RenderBox checked={coupleConsultationData.sleepQuality === "fair"} label="Cukup (5-6 jam per hari)" />
                  <RenderBox checked={coupleConsultationData.sleepQuality === "poor"} label="Kurang dari 5 jam per hari" />
                  <RenderBox checked={coupleConsultationData.sleepQuality === "disturbed"} label="Sering mengalami gangguan tidur" />
                </div>
              </div>

              <div>
                <p className="font-semibold">6. Bagaimana kualitas tidur pasangan Anda dalam sebulan terakhir?</p>
                <div className="flex flex-wrap gap-2 pl-2 pt-0.5">
                  <RenderBox checked={coupleConsultationData.partnerSleepQuality === "good"} label="Baik (7-8 jam per hari)" />
                  <RenderBox checked={coupleConsultationData.partnerSleepQuality === "fair"} label="Cukup (5-6 jam per hari)" />
                  <RenderBox checked={coupleConsultationData.partnerSleepQuality === "poor"} label="Kurang dari 5 jam per hari" />
                  <RenderBox checked={coupleConsultationData.partnerSleepQuality === "disturbed"} label="Sering mengalami gangguan tidur" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <p className="font-semibold">1. Apakah Anda pernah mengalami hal serupa sebelumnya?</p>
                <div className="pl-2 pt-0.5">
                  <RenderBox
                    checked={consultationData.hasSimilarHistory === "yes"}
                    label={`Ya, kapan: ${consultationData.hasSimilarHistory === "yes" && consultationData.similarHistoryDetail ? consultationData.similarHistoryDetail : "..................................."}`}
                  />
                  <RenderBox checked={consultationData.hasSimilarHistory === "no"} label="Tidak" />
                </div>
              </div>

              <div>
                <p className="font-semibold">2. Apakah ada anggota keluarga yang memiliki riwayat gangguan psikologis?</p>
                <div className="pl-2 pt-0.5">
                  <RenderBox
                    checked={consultationData.hasFamilyHistory === "yes"}
                    label={`Ya (sebutkan hubungan dan jenis gangguan jika diketahui): ${consultationData.hasFamilyHistory === "yes" && consultationData.familyHistoryDetail ? consultationData.familyHistoryDetail : "..................................."}`}
                  />
                  <RenderBox checked={consultationData.hasFamilyHistory === "no"} label="Tidak" />
                </div>
              </div>

              <div>
                <p className="font-semibold">3. Apakah Anda sedang menjalani pengobatan medis atau terapi psikologis?</p>
                <div className="pl-2 pt-0.5">
                  <RenderBox
                    checked={consultationData.hasMedicalTreatment === "yes"}
                    label={`Ya, sebutkan: ${consultationData.hasMedicalTreatment === "yes" && consultationData.medicalTreatmentDetail ? consultationData.medicalTreatmentDetail : "..................................."}`}
                  />
                  <RenderBox checked={consultationData.hasMedicalTreatment === "no"} label="Tidak" />
                </div>
              </div>

              <div>
                <p className="font-semibold">4. Apakah Anda pernah mengalami kejadian traumatis (misalnya kehilangan orang terdekat, kecelakaan, kekerasan, dll.)?</p>
                <div className="pl-2 pt-0.5">
                  <RenderBox
                    checked={consultationData.hasTraumaticEvent === "yes"}
                    label={`Ya, sebutkan jika bersedia: ${consultationData.hasTraumaticEvent === "yes" && consultationData.traumaticEventDetail ? consultationData.traumaticEventDetail : "..................................."}`}
                  />
                  <RenderBox checked={consultationData.hasTraumaticEvent === "no"} label="Tidak" />
                </div>
              </div>

              <div>
                <p className="font-semibold">5. Bagaimana kualitas tidur Anda dalam sebulan terakhir?</p>
                <div className="flex flex-wrap gap-2 pl-2 pt-0.5">
                  <RenderBox checked={consultationData.sleepQuality === "good"} label="Baik (7-8 jam per hari)" />
                  <RenderBox checked={consultationData.sleepQuality === "fair"} label="Cukup (5-6 jam per hari)" />
                  <RenderBox checked={consultationData.sleepQuality === "poor"} label="Kurang dari 5 jam per hari" />
                  <RenderBox checked={consultationData.sleepQuality === "disturbed"} label="Sering mengalami gangguan tidur" />
                </div>
              </div>

              <div>
                <p className="font-semibold">6. Apakah Anda pernah memiliki pemikiran untuk menyakiti diri sendiri atau orang lain?</p>
                <div className="flex flex-wrap gap-2 pl-2 pt-0.5">
                  <RenderBox checked={consultationData.selfHarmThoughts === "never"} label="Tidak pernah" />
                  <RenderBox checked={consultationData.selfHarmThoughts === "sometimes"} label="Pernah, tetapi tidak serius" />
                  <RenderBox checked={consultationData.selfHarmThoughts === "frequent"} label="Sering, dan saya membutuhkan bantuan segera" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* D. KEBIASAAN DAN GAYA HIDUP — tidak ada pada Formulir Konsultasi Pasangan */}
        {!isCouple && (
        <>
        <div className="mb-6 space-y-2 text-xs">
          <h3 className="text-sm font-bold italic uppercase text-[#1f3b5b] mb-3">
            D. KEBIASAAN DAN GAYA HIDUP
          </h3>

          <div className="space-y-2">
            <div>
              <p className="font-semibold">1. Apakah Anda mengonsumsi alkohol, rokok, atau zat adiktif lainnya?</p>
              <div className="pl-2 pt-0.5">
                <RenderBox checked={consultationData.usesAddictiveSubstances === "no"} label="Tidak" />
                <RenderBox
                  checked={consultationData.usesAddictiveSubstances === "yes"}
                  label={`Ya, sebutkan: ${consultationData.usesAddictiveSubstances === "yes" && consultationData.addictiveSubstancesDetail ? consultationData.addictiveSubstancesDetail : "..................................."}`}
                />
              </div>
            </div>

            <div>
              <p className="font-semibold">2. Bagaimana pola makan Anda sehari-hari?</p>
              <div className="flex flex-wrap gap-2 pl-2 pt-0.5">
                <RenderBox checked={consultationData.eatingPattern === "regular"} label="Seimbang dan sehat" />
                <RenderBox checked={consultationData.eatingPattern === "irregular"} label="Tidak teratur" />
                <RenderBox checked={consultationData.eatingPattern === "undereating" || consultationData.eatingPattern === "overeating"} label="Kurang makan atau sering melewatkan makan" />
              </div>
            </div>

            <div>
              <p className="font-semibold">3. Seberapa sering Anda berolahraga?</p>
              <div className="flex flex-wrap gap-2 pl-2 pt-0.5">
                <RenderBox checked={consultationData.exerciseFrequency === "regularly"} label="Setiap hari" />
                <RenderBox checked={consultationData.exerciseFrequency === "sometimes"} label="Beberapa kali dalam seminggu" />
                <RenderBox checked={consultationData.exerciseFrequency === "rarely"} label="Jarang" />
                <RenderBox checked={consultationData.exerciseFrequency === "never"} label="Tidak pernah" />
              </div>
            </div>

            <div>
              <p className="font-semibold">4. Bagaimana tingkat stres Anda dalam kehidupan sehari-hari?</p>
              <div className="flex flex-wrap gap-2 pl-2 pt-0.5">
                <RenderBox checked={consultationData.stressLevel === "low"} label="Rendah" />
                <RenderBox checked={consultationData.stressLevel === "moderate"} label="Sedang" />
                <RenderBox checked={consultationData.stressLevel === "high" || consultationData.stressLevel === "veryHigh"} label="Tinggi" />
              </div>
            </div>
          </div>
        </div>
        </>
        )}

        {/* E. INFORMASI KEBIJAKAN */}
        <div className="mb-6 text-xs space-y-2">
          <h3 className="text-sm font-bold italic uppercase text-[#1f3b5b] mb-3">
            E. INFORMASI KEBIJAKAN
          </h3>
          <p className="text-gray-800 leading-relaxed">
            Kami berkomitmen untuk menjaga kerahasiaan informasi pribadi klien sesuai dengan kode etik psikologi dan peraturan yang berlaku. Berikut adalah kebijakan yang harus dipahami oleh setiap klien:
          </p>
          <div className="space-y-1.5 pl-2">
            <div>
              <p className="font-semibold">1. Kerahasiaan Informasi</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-0.5">
                <li>Semua informasi yang diberikan klien, baik secara lisan maupun tertulis, akan dijaga kerahasiaannya.</li>
                <li>Informasi tidak akan dibagikan kepada pihak ketiga tanpa persetujuan tertulis dari klien, kecuali dalam kondisi tertentu (lihat poin 2).</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">2. Pengecualian Kerahasiaan</p>
              <p className="text-gray-700">Informasi klien dapat dibuka kepada pihak berwenang tanpa persetujuan klien dalam kondisi berikut:</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-0.5">
                <li>Jika ada ancaman serius terhadap keselamatan diri klien atau orang lain.</li>
                <li>Jika diwajibkan oleh hukum atau perintah pengadilan.</li>
                <li>Jika klien berada dalam kondisi yang mengancam nyawa dan membutuhkan bantuan medis atau hukum segera.</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">3. Keamanan Data</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-0.5">
                <li>Semua catatan klien akan disimpan dalam sistem yang aman dan hanya dapat diakses oleh psikolog yang menangani.</li>
                <li>Data elektronik akan dienkripsi, dan catatan fisik akan disimpan di tempat terkunci.</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">4. Hak Klien</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-0.5">
                <li>Klien berhak meminta akses terhadap catatan konsultasi mereka dengan mengajukan permohonan tertulis.</li>
                <li>Klien berhak untuk berhenti dari layanan kapan saja, dengan syarat mengikuti kebijakan pembatalan janji temu yang telah ditetapkan.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* F. PERNYATAAN PERSETUJUAN */}
        <div className="mb-6 text-xs space-y-3">
          <h3 className="text-sm font-bold italic uppercase text-[#1f3b5b] mb-3">
            F. PERNYATAAN PERSETUJUAN
          </h3>
          <p className="text-gray-800 leading-relaxed">
            Saya yang bertanda tangan di bawah ini, menyatakan bahwa saya telah membaca, memahami, dan menyetujui kebijakan privasi dan kerahasiaan layanan konsultasi psikologi ini. Saya memahami bahwa informasi saya akan dijaga kerahasiaannya, kecuali dalam kondisi tertentu sebagaimana disebutkan di atas.
          </p>

          <div className="pt-2 flex justify-end">
            <div className="space-y-2 text-left">
              <div>
                <span className="font-semibold">Tanggal : </span>
                <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                  {consentData.consentDate
                    ? new Date(consentData.consentDate + "T00:00:00").toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "..................................................."}
                </span>
              </div>
              <div>
                <span className="font-semibold">Nama Klien : </span>
                <span className="border-b border-dotted border-gray-600 px-2 font-medium">
                  {consentData.clientNameConfirmation || clientData.fullName || "..................................................."}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="font-semibold">Tanda Tangan: </span>
                <span className="inline-block border-b border-dotted border-gray-600 px-4 min-w-[200px]">
                  {useTextSignature ? (
                    <span style={{ fontFamily: "'Brush Script MT', cursive" }} className="text-lg">
                      {consentData.signature || consentData.clientNameConfirmation || ""}
                    </span>
                  ) : consentData.signature ? (
                    <img src={consentData.signature} alt="Tanda tangan" className="h-10 object-contain" />
                  ) : (
                    "..................................................."
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  };

  const renderFormStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`
              w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300
              ${
                step === formStep
                  ? "bg-[#2B5379] text-white"
                  : step < formStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }
            `}
          >
            {step < formStep ? <CheckCircle2 className="w-5 h-5" /> : step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 md:w-24 h-1 mx-2 rounded-full transition-colors duration-300 ${
                step < formStep ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1Couple = () => {
    const infoRows: { no: number; label: string; input: React.ReactNode }[] = [
      {
        no: 1,
        label: "Nama Lengkap",
        input: (
          <input
            type="text"
            value={coupleClientData.fullName}
            onChange={(e) => handleCoupleClientDataChange("fullName", e.target.value)}
            placeholder="Nama lengkap Anda"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none"
          />
        ),
      },
      {
        no: 2,
        label: "Nama Pasangan",
        input: (
          <input
            type="text"
            value={coupleClientData.partnerName}
            onChange={(e) => handleCoupleClientDataChange("partnerName", e.target.value)}
            placeholder="Nama lengkap pasangan Anda"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none"
          />
        ),
      },
      {
        no: 3,
        label: "Usia",
        input: (
          <input
            type="number"
            min={0}
            value={coupleClientData.age}
            onChange={(e) => handleCoupleClientDataChange("age", e.target.value)}
            placeholder="cth. 28"
            className="w-32 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none"
          />
        ),
      },
      {
        no: 4,
        label: "Usia Pasangan",
        input: (
          <input
            type="number"
            min={0}
            value={coupleClientData.partnerAge}
            onChange={(e) => handleCoupleClientDataChange("partnerAge", e.target.value)}
            placeholder="cth. 30"
            className="w-32 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none"
          />
        ),
      },
      {
        no: 5,
        label: "Alamat",
        input: (
          <textarea
            value={coupleClientData.address}
            onChange={(e) => handleCoupleClientDataChange("address", e.target.value)}
            rows={2}
            placeholder="Alamat domisili Anda saat ini"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none resize-none"
          />
        ),
      },
      {
        no: 6,
        label: "Alamat Pasangan",
        input: (
          <textarea
            value={coupleClientData.partnerAddress}
            onChange={(e) => handleCoupleClientDataChange("partnerAddress", e.target.value)}
            rows={2}
            placeholder="Alamat domisili pasangan Anda"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none resize-none"
          />
        ),
      },
      {
        no: 7,
        label: "Nomor Telepon",
        input: (
          <input
            type="tel"
            value={coupleClientData.phone}
            onChange={(e) => handleCoupleClientDataChange("phone", e.target.value)}
            placeholder="08xxxxxxxxxx"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none"
          />
        ),
      },
      {
        no: 8,
        label: "Email",
        input: (
          <input
            type="email"
            value={coupleClientData.email}
            onChange={(e) => handleCoupleClientDataChange("email", e.target.value)}
            placeholder="nama@email.com"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none"
          />
        ),
      },
      {
        no: 9,
        label: "Pekerjaan",
        input: (
          <input
            type="text"
            value={coupleClientData.occupation}
            onChange={(e) => handleCoupleClientDataChange("occupation", e.target.value)}
            placeholder="cth. Karyawan Swasta"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none"
          />
        ),
      },
      {
        no: 10,
        label: "Pekerjaan Pasangan",
        input: (
          <input
            type="text"
            value={coupleClientData.partnerOccupation}
            onChange={(e) => handleCoupleClientDataChange("partnerOccupation", e.target.value)}
            placeholder="cth. Wiraswasta"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none"
          />
        ),
      },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-[#E8F6FF] rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-[#2B5379]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Informasi Klien & Pasangan</h2>
            <p className="text-sm text-slate-500">
              Isi data Anda dan pasangan secara lengkap dan sesuai
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Informasi Penting</p>
              <p className="text-sm text-amber-700">
                1. Mohon isi data berikut secara manual dan pastikan datanya benar. Data ini
                akan digunakan psikolog untuk proses konsultasi pasangan Anda.
              </p>
              <p className="text-sm text-amber-700">
                2. Setelah booking berhasil, kami akan mengirimkan email konfirmasi. Silakan cek Inbox atau folder Spam email Anda.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-300">
          <div className="bg-[#1f3b5b] px-5 py-3 text-sm font-bold text-white">
            A. Informasi Klien
          </div>
          <div className="text-sm">
            {infoRows.map((row, idx) => (
              <div
                key={row.label}
                className={`flex flex-col gap-2 px-5 py-3 border-t border-gray-200 md:flex-row md:items-center md:gap-3 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <span className="flex-shrink-0 font-semibold text-[#1f3b5b] md:w-52">
                  <span className="text-gray-500 mr-1">{row.no}.</span>
                  {row.label}
                </span>
                <span className="flex-1">{row.input}</span>
              </div>
            ))}

            <div className="flex items-center gap-2 px-5 py-3 border-t border-gray-200 bg-gray-50">
              <span className="w-6 flex-shrink-0 text-gray-500">11.</span>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFirstVisit}
                  onChange={(e) => setIsFirstVisit(e.target.checked)}
                  className="w-4 h-4 text-[#2B5379]"
                />
                <span className="text-gray-800">
                  Ini adalah kunjungan pertama saya ke layanan konseling
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep1 = () => {
    const infoRows: { no: number; label: string; input: React.ReactNode }[] = [
      {
        no: 1,
        label: "Nama Lengkap",
        input: (
          <input
            type="text"
            value={clientData.fullName}
            onChange={(e) => handleClientDataChange("fullName", e.target.value)}
            placeholder="Nama lengkap Anda"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none"
          />
        ),
      },
      {
        no: 2,
        label: "Jenis Kelamin",
        input: (
          <div className="flex gap-8">
            <OptionPill
              name="clientGender"
              value="male"
              label="Laki-laki"
              checked={clientData.gender === "male"}
              onChange={(v) => handleClientDataChange("gender", v)}
            />
            <OptionPill
              name="clientGender"
              value="female"
              label="Perempuan"
              checked={clientData.gender === "female"}
              onChange={(v) => handleClientDataChange("gender", v)}
            />
          </div>
        ),
      },
      {
        no: 3,
        label: "Tanggal Lahir",
        input: (
          <input
            type="date"
            value={clientData.birthDate}
            onChange={(e) => handleClientDataChange("birthDate", e.target.value)}
            className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none"
          />
        ),
      },
      {
        no: 4,
        label: "Tempat Lahir",
        input: (
          <input
            type="text"
            value={clientData.birthPlace}
            onChange={(e) => handleClientDataChange("birthPlace", e.target.value)}
            placeholder="Kota tempat lahir"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none"
          />
        ),
      },
      {
        no: 5,
        label: "Usia",
        input: (
          <span className="inline-flex rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-600">
            {clientData.birthDate
              ? `${clientAge} tahun (otomatis dari tanggal lahir)`
              : "Isi tanggal lahir terlebih dahulu"}
          </span>
        ),
      },
      {
        no: 6,
        label: "Anak ke",
        input: (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={clientData.childOrder}
              onChange={(e) => handleClientDataChange("childOrder", e.target.value)}
              placeholder="cth. 2"
              className="w-20 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none"
            />
            <span className="text-sm text-gray-600">dari</span>
            <input
              type="number"
              min={1}
              value={clientData.siblingsCount}
              onChange={(e) => handleClientDataChange("siblingsCount", e.target.value)}
              placeholder="cth. 3"
              className="w-20 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none"
            />
            <span className="text-sm text-gray-600">Bersaudara</span>
          </div>
        ),
      },
      {
        no: 7,
        label: "Alamat",
        input: (
          <textarea
            value={clientData.address}
            onChange={(e) => handleClientDataChange("address", e.target.value)}
            rows={2}
            placeholder="Alamat domisili saat ini"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none resize-none"
          />
        ),
      },
      {
        no: 8,
        label: "Alamat Asal",
        input: (
          <textarea
            value={clientData.originAddress}
            onChange={(e) => handleClientDataChange("originAddress", e.target.value)}
            rows={2}
            placeholder="Alamat asal / kampung halaman"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none resize-none"
          />
        ),
      },
      {
        no: 9,
        label: "Nomor Telepon",
        input: (
          <input
            type="tel"
            value={clientData.phone}
            onChange={(e) => handleClientDataChange("phone", e.target.value)}
            placeholder="08xxxxxxxxxx"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none"
          />
        ),
      },
      {
        no: 10,
        label: "Email",
        input: (
          <input
            type="email"
            value={clientData.email}
            onChange={(e) => handleClientDataChange("email", e.target.value)}
            placeholder="nama@email.com"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none"
          />
        ),
      },
      {
        no: 11,
        label: "Pekerjaan",
        input: (
          <input
            type="text"
            value={clientData.occupation}
            onChange={(e) => handleClientDataChange("occupation", e.target.value)}
            placeholder="cth. Mahasiswa, Karyawan Swasta"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none"
          />
        ),
      },
      {
        no: 12,
        label: "Status Pernikahan",
        input: (
          <div className="flex flex-wrap gap-6">
            {[
              { value: "single", label: "Lajang" },
              { value: "married", label: "Menikah" },
              { value: "divorced", label: "Duda/Janda" },
            ].map((o) => (
              <OptionPill
                key={o.value}
                name="clientMaritalStatus"
                value={o.value}
                label={o.label}
                checked={clientData.maritalStatus === o.value}
                onChange={(v) => handleClientDataChange("maritalStatus", v)}
              />
            ))}
          </div>
        ),
      },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-[#E8F6FF] rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-[#2B5379]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Informasi Klien</h2>
            <p className="text-sm text-slate-500">
              Isi data diri Anda secara lengkap dan sesuai
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Informasi Penting</p>
              <p className="text-sm text-amber-700">
                1. Mohon isi data berikut secara manual dan pastikan datanya sudah benar untuk kebutuhan sesi konsultasi.
              </p>
              <p className="text-sm text-amber-700">
                2. Setelah booking berhasil, kami akan mengirimkan email konfirmasi. Silakan cek Inbox atau folder Spam email Anda.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-300">
          <div className="bg-[#1f3b5b] px-5 py-3 text-sm font-bold text-white">
            A. Informasi Klien
          </div>
          <div className="text-sm">
            {infoRows.map((row, idx) => (
              <div
                key={row.label}
                className={`flex flex-col gap-2 px-5 py-3 border-t border-gray-200 md:flex-row md:items-center md:gap-3 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <span className="flex-shrink-0 font-semibold text-[#1f3b5b] md:w-52">
                  <span className="text-gray-500 mr-1">{row.no}.</span>
                  {row.label}
                </span>
                <span className="flex-1">{row.input}</span>
              </div>
            ))}

            <div className="flex gap-2 px-5 pt-3 border-t border-gray-200 bg-white">
              <span className="w-6 flex-shrink-0 text-gray-500">13.</span>
              <span className="font-semibold text-[#1f3b5b]">Riwayat Pendidikan</span>
            </div>
            <div className="px-5 pb-4 pt-2 bg-white">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-[#E8F6FF] text-[#1f3b5b]">
                    <th className="border border-gray-300 px-3 py-2 text-left w-28">
                      Jenjang
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left">
                      Sekolah / Perguruan Tinggi
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left w-32">
                      Jurusan <span className="font-normal text-[10px]">(opsional)</span>
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left w-24">
                      Tahun Masuk <span className="font-normal text-[10px]">(opsional)</span>
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left w-24">
                      Tahun Lulus <span className="font-normal text-[10px]">(opsional)</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {(
                    [
                      {
                        jenjang: "SD",
                        field: "educationSD",
                        majorField: "educationSDMajor",
                        yearStartField: "educationSDYearStart",
                        yearEndField: "educationSDYearEnd",
                      },
                      {
                        jenjang: "SMP",
                        field: "educationSMP",
                        majorField: "educationSMPMajor",
                        yearStartField: "educationSMPYearStart",
                        yearEndField: "educationSMPYearEnd",
                      },
                      {
                        jenjang: "SMA",
                        field: "educationSMA",
                        majorField: "educationSMAMajor",
                        yearStartField: "educationSMAYearStart",
                        yearEndField: "educationSMAYearEnd",
                      },
                      {
                        jenjang: "Perguruan Tinggi",
                        field: "educationCollege",
                        majorField: "educationCollegeMajor",
                        yearStartField: "educationCollegeYearStart",
                        yearEndField: "educationCollegeYearEnd",
                      },
                    ] as {
                      jenjang: string;
                      field: keyof ClientFormData;
                      majorField: keyof ClientFormData;
                      yearStartField: keyof ClientFormData;
                      yearEndField: keyof ClientFormData;
                    }[]
                  ).map((row) => (
                    <tr key={row.jenjang}>
                      <td className="border border-gray-300 px-3 py-2 font-medium">
                        {row.jenjang}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <input
                          type="text"
                          value={clientData[row.field]}
                          onChange={(e) =>
                            handleClientDataChange(row.field, e.target.value)
                          }
                          placeholder="Nama sekolah / perguruan tinggi"
                          className="w-full rounded-md border border-transparent px-2 py-1.5 text-xs text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <input
                          type="text"
                          value={clientData[row.majorField]}
                          onChange={(e) =>
                            handleClientDataChange(row.majorField, e.target.value)
                          }
                          placeholder="Jurusan"
                          className="w-full rounded-md border border-transparent px-2 py-1.5 text-xs text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <input
                          type="text"
                          value={clientData[row.yearStartField]}
                          onChange={(e) =>
                            handleClientDataChange(row.yearStartField, e.target.value)
                          }
                          placeholder="cth. 2018"
                          className="w-full rounded-md border border-transparent px-2 py-1.5 text-xs text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <input
                          type="text"
                          value={clientData[row.yearEndField]}
                          onChange={(e) =>
                            handleClientDataChange(row.yearEndField, e.target.value)
                          }
                          placeholder="cth. 2021"
                          className="w-full rounded-md border border-transparent px-2 py-1.5 text-xs text-gray-800 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-2 px-5 py-3 border-t border-gray-200 bg-gray-50">
              <span className="w-6 flex-shrink-0 text-gray-500">14.</span>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFirstVisit}
                  onChange={(e) => setIsFirstVisit(e.target.checked)}
                  className="w-4 h-4 text-[#2B5379]"
                />
                <span className="text-gray-800">
                  Ini adalah kunjungan pertama saya ke layanan konseling
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep2Couple = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-[#E8F6FF] rounded-xl flex items-center justify-center">
          <FileText className="w-6 h-6 text-[#2B5379]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Formulir Konsultasi Pasangan
          </h2>
          <p className="text-sm text-slate-500">
            Isi formulir berikut untuk membantu psikolog memahami kondisi Anda dan pasangan
          </p>
        </div>
      </div>

      {/* B. Alasan Konsultasi */}
      <div className="overflow-hidden rounded-lg border border-gray-300">
        <div className="bg-[#1f3b5b] px-5 py-3 text-sm font-bold text-white">
          B. Alasan Konsultasi
        </div>
        <div className="bg-white px-5 py-5 space-y-6 text-sm">
          <div>
            <p className="font-medium text-slate-700 mb-2">
              1. Alasan utama Anda mencari layanan konseling{" "}
              <span className="text-red-500">*</span>
            </p>
            <textarea
              value={coupleConsultationData.mainReason || ""}
              onChange={(e) =>
                handleCoupleConsultationChange("mainReason", e.target.value)
              }
              rows={4}
              placeholder="Ceritakan alasan utama Anda dan pasangan ingin berkonsultasi..."
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.mainReason ? "border-red-500" : "border-gray-300"
              } focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none transition-all resize-none`}
            />
            {errors.mainReason && (
              <p className="text-sm text-red-500 mt-1">{errors.mainReason}</p>
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">
              2. Apakah Anda sedang mengonsumsi obat psikiatri?{" "}
              <span className="text-red-500">*</span>
            </p>
            <div className="flex gap-8">
              {[
                { value: "yes", label: "Ya" },
                { value: "no", label: "Tidak" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="coupleTakingPsychiatricMeds"
                  value={o.value}
                  label={o.label}
                  checked={coupleConsultationData.takingPsychiatricMeds === o.value}
                  onChange={(v) =>
                    handleCoupleConsultationChange("takingPsychiatricMeds", v as "yes" | "no")
                  }
                />
              ))}
            </div>
            {errors.takingPsychiatricMeds && (
              <p className="text-sm text-red-500 mt-1">
                {errors.takingPsychiatricMeds}
              </p>
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">
              3. Berapa lama Anda mengalami masalah ini?{" "}
              <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-col">
              {[
                { value: "<1month", label: "Kurang dari 1 bulan" },
                { value: "1-3months", label: "1-3 bulan" },
                { value: "3-6months", label: "3-6 bulan" },
                { value: ">6months", label: "Lebih dari 6 bulan" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="coupleProblemDuration"
                  value={o.value}
                  label={o.label}
                  checked={coupleConsultationData.problemDuration === o.value}
                  onChange={(v) => handleCoupleConsultationChange("problemDuration", v)}
                />
              ))}
            </div>
            {errors.problemDuration && (
              <p className="text-sm text-red-500 mt-1">{errors.problemDuration}</p>
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">
              4. Seberapa sering Anda merasakan gejala ini?{" "}
              <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-col">
              {[
                { value: "daily", label: "Setiap hari" },
                { value: "weekly", label: "Beberapa kali dalam seminggu" },
                { value: "monthly", label: "Beberapa kali dalam sebulan" },
                { value: "rarely", label: "Jarang" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="coupleSymptomFrequency"
                  value={o.value}
                  label={o.label}
                  checked={coupleConsultationData.symptomFrequency === o.value}
                  onChange={(v) => handleCoupleConsultationChange("symptomFrequency", v)}
                />
              ))}
            </div>
            {errors.symptomFrequency && (
              <p className="text-sm text-red-500 mt-1">{errors.symptomFrequency}</p>
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">
              5. Bagaimana perasaan atau dampaknya terhadap kehidupan sehari-hari Anda?{" "}
              <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-col">
              {[
                { value: "none", label: "Tidak terlalu mengganggu" },
                { value: "mild", label: "Sedikit mengganggu" },
                { value: "moderate", label: "Cukup mengganggu" },
                { value: "severe", label: "Sangat mengganggu" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="coupleDailyImpact"
                  value={o.value}
                  label={o.label}
                  checked={coupleConsultationData.dailyImpact === o.value}
                  onChange={(v) => handleCoupleConsultationChange("dailyImpact", v)}
                />
              ))}
            </div>
            {errors.dailyImpact && (
              <p className="text-sm text-red-500 mt-1">{errors.dailyImpact}</p>
            )}
          </div>
        </div>
      </div>

      {/* C. Riwayat Psikologis dan Kesehatan */}
      <div className="overflow-hidden rounded-lg border border-gray-300">
        <div className="bg-[#1f3b5b] px-5 py-3 text-sm font-bold text-white">
          C. Riwayat Psikologis dan Kesehatan
        </div>
        <div className="bg-white px-5 py-5 space-y-6 text-sm">
          <div>
            <p className="font-medium text-slate-700 mb-2">
              1. Apakah Anda dan pasangan pernah mengalami hal serupa sebelumnya?
            </p>
            <div className="flex gap-8 mb-2">
              {[
                { value: "yes", label: "Ya" },
                { value: "no", label: "Tidak" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="coupleHasSimilarHistory"
                  value={o.value}
                  label={o.label}
                  checked={coupleConsultationData.hasSimilarHistory === o.value}
                  onChange={(v) =>
                    handleCoupleConsultationChange("hasSimilarHistory", v as "yes" | "no")
                  }
                />
              ))}
            </div>
            {coupleConsultationData.hasSimilarHistory === "yes" && (
              <textarea
                value={coupleConsultationData.similarHistoryDetail || ""}
                onChange={(e) =>
                  handleCoupleConsultationChange("similarHistoryDetail", e.target.value)
                }
                rows={2}
                placeholder="Jelaskan kapan dan riwayat masalah serupa yang pernah dialami..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none transition-all resize-none"
              />
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">
              2. Apakah ada anggota keluarga yang memiliki riwayat gangguan psikologis?
            </p>
            <div className="flex gap-8 mb-2">
              {[
                { value: "yes", label: "Ya" },
                { value: "no", label: "Tidak" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="coupleHasFamilyHistory"
                  value={o.value}
                  label={o.label}
                  checked={coupleConsultationData.hasFamilyHistory === o.value}
                  onChange={(v) =>
                    handleCoupleConsultationChange("hasFamilyHistory", v as "yes" | "no")
                  }
                />
              ))}
            </div>
            {coupleConsultationData.hasFamilyHistory === "yes" && (
              <textarea
                value={coupleConsultationData.familyHistoryDetail || ""}
                onChange={(e) =>
                  handleCoupleConsultationChange("familyHistoryDetail", e.target.value)
                }
                rows={2}
                placeholder="Sebutkan hubungan dan jenis gangguan jika diketahui..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none transition-all resize-none"
              />
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">
              3. Apakah Anda atau pasangan sedang menjalani pengobatan medis atau terapi psikologis?
            </p>
            <div className="flex gap-8 mb-2">
              {[
                { value: "yes", label: "Ya" },
                { value: "no", label: "Tidak" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="coupleHasMedicalTreatment"
                  value={o.value}
                  label={o.label}
                  checked={coupleConsultationData.hasMedicalTreatment === o.value}
                  onChange={(v) =>
                    handleCoupleConsultationChange("hasMedicalTreatment", v as "yes" | "no")
                  }
                />
              ))}
            </div>
            {coupleConsultationData.hasMedicalTreatment === "yes" && (
              <textarea
                value={coupleConsultationData.medicalTreatmentDetail || ""}
                onChange={(e) =>
                  handleCoupleConsultationChange("medicalTreatmentDetail", e.target.value)
                }
                rows={2}
                placeholder="Sebutkan pengobatan medis yang sedang dijalani..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none transition-all resize-none"
              />
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">
              4. Apakah Anda atau pasangan pernah mengalami kejadian traumatis (misalnya kehilangan orang terdekat, kecelakaan, kekerasan, dll.)?
            </p>
            <div className="flex gap-8 mb-2">
              {[
                { value: "yes", label: "Ya" },
                { value: "no", label: "Tidak" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="coupleHasTraumaticEvent"
                  value={o.value}
                  label={o.label}
                  checked={coupleConsultationData.hasTraumaticEvent === o.value}
                  onChange={(v) =>
                    handleCoupleConsultationChange("hasTraumaticEvent", v as "yes" | "no")
                  }
                />
              ))}
            </div>
            {coupleConsultationData.hasTraumaticEvent === "yes" && (
              <textarea
                value={coupleConsultationData.traumaticEventDetail || ""}
                onChange={(e) =>
                  handleCoupleConsultationChange("traumaticEventDetail", e.target.value)
                }
                rows={2}
                placeholder="Jika bersedia, ceritakan secara singkat kejadian traumatis tersebut..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none transition-all resize-none"
              />
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">
              5. Bagaimana kualitas tidur Anda dalam sebulan terakhir?{" "}
              <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-col">
              {[
                { value: "good", label: "Baik (7-8 jam per hari)" },
                { value: "fair", label: "Cukup (5-6 jam per hari)" },
                { value: "poor", label: "Kurang dari 5 jam per hari" },
                { value: "disturbed", label: "Sering mengalami gangguan tidur" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="coupleSleepQuality"
                  value={o.value}
                  label={o.label}
                  checked={coupleConsultationData.sleepQuality === o.value}
                  onChange={(v) => handleCoupleConsultationChange("sleepQuality", v)}
                />
              ))}
            </div>
            {errors.sleepQuality && (
              <p className="text-sm text-red-500 mt-1">{errors.sleepQuality}</p>
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">
              6. Bagaimana kualitas tidur pasangan Anda dalam sebulan terakhir?{" "}
              <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-col">
              {[
                { value: "good", label: "Baik (7-8 jam per hari)" },
                { value: "fair", label: "Cukup (5-6 jam per hari)" },
                { value: "poor", label: "Kurang dari 5 jam per hari" },
                { value: "disturbed", label: "Sering mengalami gangguan tidur" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="couplePartnerSleepQuality"
                  value={o.value}
                  label={o.label}
                  checked={coupleConsultationData.partnerSleepQuality === o.value}
                  onChange={(v) => handleCoupleConsultationChange("partnerSleepQuality", v)}
                />
              ))}
            </div>
            {errors.partnerSleepQuality && (
              <p className="text-sm text-red-500 mt-1">{errors.partnerSleepQuality}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-[#E8F6FF] rounded-xl flex items-center justify-center">
          <FileText className="w-6 h-6 text-[#2B5379]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Formulir Konsultasi
          </h2>
          <p className="text-sm text-slate-500">
            Isi formulir berikut untuk membantu psikolog memahami kondisi Anda
          </p>
        </div>
      </div>

      {/* B. Alasan Konsultasi */}
      <div className="overflow-hidden rounded-lg border border-gray-300">
        <div className="bg-[#1f3b5b] px-5 py-3 text-sm font-bold text-white">
          B. Alasan Konsultasi
        </div>
        <div className="bg-white px-5 py-5 space-y-6 text-sm">
          <div>
            <p className="font-medium text-slate-700 mb-2">
              1. Alasan utama Anda mencari layanan konseling{" "}
              <span className="text-red-500">*</span>
            </p>
            <textarea
              value={consultationData.mainReason || ""}
              onChange={(e) =>
                handleConsultationChange("mainReason", e.target.value)
              }
              rows={4}
              placeholder="Ceritakan alasan utama Anda ingin berkonsultasi..."
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.mainReason ? "border-red-500" : "border-gray-300"
              } focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none transition-all resize-none`}
            />
            {errors.mainReason && (
              <p className="text-sm text-red-500 mt-1">{errors.mainReason}</p>
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">
              2. Apakah Anda sedang mengonsumsi obat psikiatri?{" "}
              <span className="text-red-500">*</span>
            </p>
            <div className="flex gap-8">
              {[
                { value: "yes", label: "Ya" },
                { value: "no", label: "Tidak" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="takingPsychiatricMeds"
                  value={o.value}
                  label={o.label}
                  checked={consultationData.takingPsychiatricMeds === o.value}
                  onChange={(v) =>
                    handleConsultationChange("takingPsychiatricMeds", v as "yes" | "no")
                  }
                />
              ))}
            </div>
            {errors.takingPsychiatricMeds && (
              <p className="text-sm text-red-500 mt-1">
                {errors.takingPsychiatricMeds}
              </p>
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">
              3. Berapa lama Anda mengalami masalah ini?{" "}
              <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-col">
              {[
                { value: "<1month", label: "Kurang dari 1 bulan" },
                { value: "1-3months", label: "1-3 bulan" },
                { value: "3-6months", label: "3-6 bulan" },
                { value: ">6months", label: "Lebih dari 6 bulan" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="problemDuration"
                  value={o.value}
                  label={o.label}
                  checked={consultationData.problemDuration === o.value}
                  onChange={(v) => handleConsultationChange("problemDuration", v)}
                />
              ))}
            </div>
            {errors.problemDuration && (
              <p className="text-sm text-red-500 mt-1">{errors.problemDuration}</p>
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">
              4. Seberapa sering Anda merasakan gejala ini?{" "}
              <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-col">
              {[
                { value: "daily", label: "Setiap hari" },
                { value: "weekly", label: "Beberapa kali dalam seminggu" },
                { value: "monthly", label: "Beberapa kali dalam sebulan" },
                { value: "rarely", label: "Jarang" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="symptomFrequency"
                  value={o.value}
                  label={o.label}
                  checked={consultationData.symptomFrequency === o.value}
                  onChange={(v) => handleConsultationChange("symptomFrequency", v)}
                />
              ))}
            </div>
            {errors.symptomFrequency && (
              <p className="text-sm text-red-500 mt-1">{errors.symptomFrequency}</p>
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">
              5. Bagaimana perasaan atau dampaknya terhadap kehidupan sehari-hari Anda?{" "}
              <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-col">
              {[
                { value: "none", label: "Tidak terlalu mengganggu" },
                { value: "mild", label: "Sedikit mengganggu" },
                { value: "moderate", label: "Cukup mengganggu" },
                { value: "severe", label: "Sangat mengganggu" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="dailyImpact"
                  value={o.value}
                  label={o.label}
                  checked={consultationData.dailyImpact === o.value}
                  onChange={(v) => handleConsultationChange("dailyImpact", v)}
                />
              ))}
            </div>
            {errors.dailyImpact && (
              <p className="text-sm text-red-500 mt-1">{errors.dailyImpact}</p>
            )}
          </div>
        </div>
      </div>

      {/* C. Riwayat Psikologis dan Kesehatan */}
      <div className="overflow-hidden rounded-lg border border-gray-300">
        <div className="bg-[#1f3b5b] px-5 py-3 text-sm font-bold text-white">
          C. Riwayat Psikologis dan Kesehatan
        </div>
        <div className="bg-white px-5 py-5 space-y-6 text-sm">
          <div>
            <p className="font-medium text-slate-700 mb-2">
              1. Apakah Anda pernah mengalami hal serupa sebelumnya?
            </p>
            <div className="flex gap-8 mb-2">
              {[
                { value: "yes", label: "Ya" },
                { value: "no", label: "Tidak" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="hasSimilarHistory"
                  value={o.value}
                  label={o.label}
                  checked={consultationData.hasSimilarHistory === o.value}
                  onChange={(v) =>
                    handleConsultationChange("hasSimilarHistory", v as "yes" | "no")
                  }
                />
              ))}
            </div>
            {consultationData.hasSimilarHistory === "yes" && (
              <textarea
                value={consultationData.similarHistoryDetail || ""}
                onChange={(e) =>
                  handleConsultationChange("similarHistoryDetail", e.target.value)
                }
                rows={2}
                placeholder="Jelaskan riwayat masalah serupa yang pernah Anda alami..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none transition-all resize-none"
              />
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">
              2. Apakah ada anggota keluarga yang memiliki riwayat gangguan psikologis?
            </p>
            <div className="flex gap-8 mb-2">
              {[
                { value: "yes", label: "Ya" },
                { value: "no", label: "Tidak" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="hasFamilyHistory"
                  value={o.value}
                  label={o.label}
                  checked={consultationData.hasFamilyHistory === o.value}
                  onChange={(v) =>
                    handleConsultationChange("hasFamilyHistory", v as "yes" | "no")
                  }
                />
              ))}
            </div>
            {consultationData.hasFamilyHistory === "yes" && (
              <textarea
                value={consultationData.familyHistoryDetail || ""}
                onChange={(e) =>
                  handleConsultationChange("familyHistoryDetail", e.target.value)
                }
                rows={2}
                placeholder="Sebutkan hubungan dan jenis gangguan jika diketahui..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none transition-all resize-none"
              />
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">
              3. Apakah Anda sedang menjalani pengobatan medis atau terapi psikologis?
            </p>
            <div className="flex gap-8 mb-2">
              {[
                { value: "yes", label: "Ya" },
                { value: "no", label: "Tidak" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="hasMedicalTreatment"
                  value={o.value}
                  label={o.label}
                  checked={consultationData.hasMedicalTreatment === o.value}
                  onChange={(v) =>
                    handleConsultationChange("hasMedicalTreatment", v as "yes" | "no")
                  }
                />
              ))}
            </div>
            {consultationData.hasMedicalTreatment === "yes" && (
              <textarea
                value={consultationData.medicalTreatmentDetail || ""}
                onChange={(e) =>
                  handleConsultationChange("medicalTreatmentDetail", e.target.value)
                }
                rows={2}
                placeholder="Sebutkan pengobatan medis yang sedang Anda jalani..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none transition-all resize-none"
              />
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">
              4. Apakah Anda pernah mengalami kejadian traumatis (misalnya kehilangan orang terdekat, kecelakaan, kekerasan, dll.)?
            </p>
            <div className="flex gap-8 mb-2">
              {[
                { value: "yes", label: "Ya" },
                { value: "no", label: "Tidak" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="hasTraumaticEvent"
                  value={o.value}
                  label={o.label}
                  checked={consultationData.hasTraumaticEvent === o.value}
                  onChange={(v) =>
                    handleConsultationChange("hasTraumaticEvent", v as "yes" | "no")
                  }
                />
              ))}
            </div>
            {consultationData.hasTraumaticEvent === "yes" && (
              <textarea
                value={consultationData.traumaticEventDetail || ""}
                onChange={(e) =>
                  handleConsultationChange("traumaticEventDetail", e.target.value)
                }
                rows={2}
                placeholder="Jika bersedia, ceritakan secara singkat kejadian traumatis tersebut..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none transition-all resize-none"
              />
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">
              5. Bagaimana kualitas tidur Anda dalam sebulan terakhir?{" "}
              <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-col">
              {[
                { value: "good", label: "Baik (7-8 jam per hari)" },
                { value: "fair", label: "Cukup (5-6 jam per hari)" },
                { value: "poor", label: "Kurang dari 5 jam per hari" },
                { value: "disturbed", label: "Sering mengalami gangguan tidur" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="sleepQuality"
                  value={o.value}
                  label={o.label}
                  checked={consultationData.sleepQuality === o.value}
                  onChange={(v) => handleConsultationChange("sleepQuality", v)}
                />
              ))}
            </div>
            {errors.sleepQuality && (
              <p className="text-sm text-red-500 mt-1">{errors.sleepQuality}</p>
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">
              6. Apakah Anda pernah memiliki pemikiran untuk menyakiti diri sendiri atau orang lain?{" "}
              <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-col">
              {[
                { value: "never", label: "Tidak pernah" },
                { value: "sometimes", label: "Pernah, tetapi tidak serius" },
                { value: "frequent", label: "Sering, dan saya membutuhkan bantuan segera" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="selfHarmThoughts"
                  value={o.value}
                  label={o.label}
                  checked={consultationData.selfHarmThoughts === o.value}
                  onChange={(v) => handleConsultationChange("selfHarmThoughts", v)}
                />
              ))}
            </div>
            {errors.selfHarmThoughts && (
              <p className="text-sm text-red-500 mt-1">{errors.selfHarmThoughts}</p>
            )}
            {consultationData.selfHarmThoughts === "frequent" && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      Perhatian Penting
                    </p>
                    <p className="text-sm text-red-700">
                      Jika Anda membutuhkan bantuan segera, silakan hubungi hotline crisis:{" "}
                      <strong>119 ext. 8</strong> (Kemenkes RI) atau kunjungi IGD rumah
                      sakit terdekat.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* D. Kebiasaan dan Gaya Hidup */}
      <div className="overflow-hidden rounded-lg border border-gray-300">
        <div className="bg-[#1f3b5b] px-5 py-3 text-sm font-bold text-white">
          D. Kebiasaan dan Gaya Hidup
        </div>
        <div className="bg-white px-5 py-5 space-y-6 text-sm">
          <div>
            <p className="font-medium text-slate-700 mb-2">
              1. Apakah Anda mengonsumsi alkohol, rokok, atau zat adiktif lainnya?
            </p>
            <div className="flex gap-8 mb-2">
              {[
                { value: "yes", label: "Ya" },
                { value: "no", label: "Tidak" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="usesAddictiveSubstances"
                  value={o.value}
                  label={o.label}
                  checked={consultationData.usesAddictiveSubstances === o.value}
                  onChange={(v) =>
                    handleConsultationChange("usesAddictiveSubstances", v as "yes" | "no")
                  }
                />
              ))}
            </div>
            {consultationData.usesAddictiveSubstances === "yes" && (
              <input
                type="text"
                value={consultationData.addictiveSubstancesDetail || ""}
                onChange={(e) =>
                  handleConsultationChange("addictiveSubstancesDetail", e.target.value)
                }
                placeholder="Sebutkan jenis dan frekuensi konsumsi..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none transition-all"
              />
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">
              2. Bagaimana pola makan Anda sehari-hari?{" "}
              <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-col">
              {[
                { value: "regular", label: "Seimbang dan sehat" },
                { value: "irregular", label: "Tidak teratur" },
                { value: "undereating", label: "Kurang makan atau sering melewatkan makan" },
                { value: "overeating", label: "Makan berlebihan" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="eatingPattern"
                  value={o.value}
                  label={o.label}
                  checked={consultationData.eatingPattern === o.value}
                  onChange={(v) => handleConsultationChange("eatingPattern", v)}
                />
              ))}
            </div>
            {errors.eatingPattern && (
              <p className="text-sm text-red-500 mt-1">{errors.eatingPattern}</p>
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">
              3. Seberapa sering Anda berolahraga?{" "}
              <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-col">
              {[
                { value: "regularly", label: "Setiap hari" },
                { value: "sometimes", label: "Beberapa kali dalam seminggu" },
                { value: "rarely", label: "Jarang" },
                { value: "never", label: "Tidak pernah" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="exerciseFrequency"
                  value={o.value}
                  label={o.label}
                  checked={consultationData.exerciseFrequency === o.value}
                  onChange={(v) => handleConsultationChange("exerciseFrequency", v)}
                />
              ))}
            </div>
            {errors.exerciseFrequency && (
              <p className="text-sm text-red-500 mt-1">{errors.exerciseFrequency}</p>
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">
              4. Bagaimana tingkat stres Anda dalam kehidupan sehari-hari?{" "}
              <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-col">
              {[
                { value: "low", label: "Rendah" },
                { value: "moderate", label: "Sedang" },
                { value: "high", label: "Tinggi" },
                { value: "veryHigh", label: "Sangat tinggi" },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="stressLevel"
                  value={o.value}
                  label={o.label}
                  checked={consultationData.stressLevel === o.value}
                  onChange={(v) => handleConsultationChange("stressLevel", v)}
                />
              ))}
            </div>
            {errors.stressLevel && (
              <p className="text-sm text-red-500 mt-1">{errors.stressLevel}</p>
            )}
          </div>
        </div>
      </div>

      {/* E. Tujuan Konsultasi */}
      <div className="overflow-hidden rounded-lg border border-gray-300">
        <div className="bg-[#1f3b5b] px-5 py-3 text-sm font-bold text-white">
          E. Tujuan Konsultasi
        </div>
        <div className="bg-white px-5 py-5 space-y-6 text-sm">
          <div>
            <p className="font-medium text-slate-700 mb-2">
              1. Apa yang ingin Anda capai dari konsultasi ini?{" "}
              <span className="text-red-500">*</span>
              <span className="text-gray-500 font-normal"> (Pilih satu atau lebih)</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {[
                "Mengatasi kecemasan atau kekhawatiran",
                "Mengelola stres dengan lebih baik",
                "Memperbaiki kualitas tidur",
                "Meningkatkan kepercayaan diri",
                "Mengatasi depresi atau kesedihan",
                "Memperbaiki hubungan interpersonal",
                "Mengembangkan keterampilan komunikasi",
                "Mengatasi trauma masa lalu",
                "Menemukan tujuan hidup",
                "Lainnya",
              ].map((goal) => (
                <OptionPill
                  key={goal}
                  variant="checkbox"
                  name="consultationGoals"
                  value={goal}
                  label={goal}
                  checked={(consultationData.consultationGoals || []).includes(goal)}
                  onChange={() => handleGoalToggle(goal)}
                />
              ))}
            </div>
            {errors.consultationGoals && (
              <p className="text-sm text-red-500 mt-1">{errors.consultationGoals}</p>
            )}
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-2">
              2. Preferensi pendekatan terapi <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-col">
              {[
                {
                  value: "directive",
                  label: "Direktif - Psikolog lebih aktif memberikan arahan dan saran",
                },
                {
                  value: "collaborative",
                  label: "Kolaboratif - Klien dan psikolog bekerja sama mencari solusi",
                },
                {
                  value: "noPreference",
                  label: "Tidak ada preferensi - Sesuaikan dengan kebutuhan saya",
                },
              ].map((o) => (
                <OptionPill
                  key={o.value}
                  name="therapyPreference"
                  value={o.value}
                  label={o.label}
                  checked={consultationData.therapyPreference === o.value}
                  onChange={(v) => handleConsultationChange("therapyPreference", v)}
                />
              ))}
            </div>
            {errors.therapyPreference && (
              <p className="text-sm text-red-500 mt-1">{errors.therapyPreference}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#E8F6FF] rounded-xl flex items-center justify-center">
          <Shield className="w-6 h-6 text-[#2B5379]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Informasi Kebijakan & Persetujuan
          </h2>
          <p className="text-sm text-slate-500">
            Baca dan setujui kebijakan layanan kami
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-300">
        <div className="bg-[#1f3b5b] px-5 py-3 text-sm font-bold text-white">
          E. Informasi Kebijakan
        </div>
        <div className="bg-gray-50 p-5 max-h-80 overflow-y-auto text-sm text-gray-700 space-y-4">
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">
              1. Kerahasiaan (Confidentiality)
            </h4>
            <p className="leading-relaxed">
              Seluruh informasi yang Anda sampaikan dalam sesi konseling bersifat rahasia dan
              dilindungi. Psikolog kami terikat dengan kode etik profesi untuk menjaga
              kerahasiaan informasi klien.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-2">
              2. Pengecualian Kerahasiaan
            </h4>
            <p className="leading-relaxed">
              Kerahasiaan dapat dibatalkan dalam kondisi ancaman keselamatan diri atau orang lain,
              perintah hukum, atau kondisi darurat medis.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-2">3. Keamanan Data</h4>
            <p className="leading-relaxed">
              Data pribadi disimpan dengan sistem keamanan berlapis dan terenkripsi.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-2">4. Hak Klien</h4>
            <p className="leading-relaxed">
              Klien berhak mengakses rekam konsultasi, menolak/menghentikan layanan, dan mengajukan keluhan.
            </p>
          </div>
        </div>
      </div>

      <div id="consent-section" className="overflow-hidden rounded-lg border border-gray-300">
        <div className="bg-[#1f3b5b] px-5 py-3 text-sm font-bold text-white">
          F. Pernyataan Persetujuan
        </div>
        <div className="bg-white px-5 py-5 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tanggal Persetujuan
            </label>
            <input
              type="date"
              value={consentData.consentDate}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nama Lengkap Klien <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={consentData.clientNameConfirmation || ""}
              onChange={(e) =>
                setConsentData((prev) => ({
                  ...prev,
                  clientNameConfirmation: e.target.value,
                }))
              }
              placeholder="Masukkan nama lengkap Anda sebagai konfirmasi"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.clientNameConfirmation ? "border-red-500" : "border-gray-200"
              } focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none transition-all`}
            />
            {errors.clientNameConfirmation && (
              <p className="text-sm text-red-500 mt-1">
                {errors.clientNameConfirmation}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tanda Tangan <span className="text-red-500">*</span>
            </label>

            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setUseTextSignature(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  useTextSignature
                    ? "bg-[#2B5379] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span className="text-sm">Ketik Nama</span>
              </button>
              <button
                type="button"
                onClick={() => setUseTextSignature(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  !useTextSignature
                    ? "bg-[#2B5379] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <PenTool className="w-4 h-4" />
                <span className="text-sm">Gambar Tanda Tangan</span>
              </button>
            </div>

            {useTextSignature ? (
              <input
                type="text"
                value={consentData.signature || ""}
                onChange={(e) =>
                  setConsentData((prev) => ({ ...prev, signature: e.target.value }))
                }
                placeholder="Ketik nama lengkap Anda sebagai tanda tangan digital"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.signature ? "border-red-500" : "border-gray-200"
                } focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none transition-all font-signature text-xl`}
                style={{ fontFamily: "'Brush Script MT', cursive" }}
              />
            ) : (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-white">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={150}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full cursor-crosshair"
                  />
                </div>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-sm text-[#2B5379] hover:underline"
                >
                  Hapus dan Ulangi
                </button>
              </div>
            )}
            {errors.signature && (
              <p className="text-sm text-red-500 mt-1">{errors.signature}</p>
            )}
          </div>

          <div>
            <label
              className={`flex items-start gap-3 px-4 py-4 rounded-xl border cursor-pointer transition-all ${
                consentData.agreedToTerms
                  ? "border-[#2B5379] bg-[#E8F6FF]"
                  : errors.agreedToTerms
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                checked={consentData.agreedToTerms || false}
                onChange={(e) =>
                  setConsentData((prev) => ({
                    ...prev,
                    agreedToTerms: e.target.checked,
                  }))
                }
                className="w-5 h-5 rounded text-[#2B5379] mt-0.5"
              />
              <span className="text-gray-700 text-sm leading-relaxed">
                Saya menyatakan bahwa seluruh informasi yang saya berikan adalah benar dan
                akurat. Saya telah membaca, memahami, dan menyetujui seluruh ketentuan dan
                kebijakan layanan yang tercantum di atas.
              </span>
            </label>
            {errors.agreedToTerms && (
              <p className="text-sm text-red-500 mt-1">{errors.agreedToTerms}</p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 mb-3">Simpan formulir untuk arsip Anda:</p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={generatePDF}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2B5379] text-white hover:bg-[#234463] transition-colors text-sm font-medium no-print disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? "Mengunduh..." : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f5f7fb] font-[var(--font-poppins)] no-print-main">
      {renderPrintableForm()}

      <section className="relative pt-24 pb-12 px-6 lg:px-16 bg-gradient-to-b from-[#E8F6FF] to-[#f5f7fb] no-print">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-[40px] md:text-[48px] font-semibold mb-4 animate-fade-in-up">
            <span className="text-[#000000]">Formulir </span>
            <span className="text-[#234463]">Konsultasi</span>
          </h1>
          <p className="text-slate-600 text-base max-w-2xl mx-auto mb-8">
            Lengkapi informasi di bawah ini untuk memulai sesi konsultasi Anda
          </p>

          <BookingStepper currentStep={2} />
        </div>
      </section>

      {/* Form Content Section */}
      <section className="pb-24 px-6 lg:px-16 no-print">
        <div className="max-w-3xl mx-auto">
          {renderFormStepIndicator()}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            {formStep === 1 && (isCouple ? renderStep1Couple() : renderStep1())}
            {formStep === 2 && (isCouple ? renderStep2Couple() : renderStep2())}
            {formStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevFormStep}
                disabled={formStep === 1}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  formStep === 1
                    ? "opacity-0 cursor-default"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Kembali
              </button>

              <button
                type="button"
                onClick={handleNextFormStep}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-[#2B5379] text-white hover:bg-[#234463] transition-colors text-sm font-semibold disabled:opacity-50"
              >
                {isSubmitting
                  ? "Memproses..."
                  : formStep === 3
                  ? "Lanjut ke Pembayaran"
                  : "Selanjutnya"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ConsultationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#2B5379] border-t-transparent rounded-full" />
        </div>
      }
    >
      <ConsultationFormContent />
    </Suspense>
  );
}