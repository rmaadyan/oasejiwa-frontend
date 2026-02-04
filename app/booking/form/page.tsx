"use client";

import { useState, Suspense, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookingStepper from "@/components/booking/BookingStepper";
import { z } from "zod";
import {
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Heart,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  FileText,
  Shield,
  PenTool,
  Printer,
  Download,
} from "lucide-react";

// Dummy client data (simulating data from signup)
const dummyClientData = {
  fullName: "Budi Santoso",
  gender: "male",
  birthDate: "1995-03-15",
  age: 30,
  address: "Jl. Sudirman No. 123, Jakarta Selatan, DKI Jakarta 12190",
  phone: "081234567890",
  email: "budi.santoso@email.com",
  occupation: "Software Engineer",
  maritalStatus: "single",
  isFirstVisit: true,
};

// Zod validation schema for Step 2
const consultationFormSchema = z.object({
  // B. Alasan Konsultasi
  mainReason: z.string().min(10, "Alasan konsultasi minimal 10 karakter"),
  takingPsychiatricMeds: z.enum(["yes", "no"], "Pilih salah satu opsi"),
  problemDuration: z.enum(["<1month", "1-3months", "3-6months", ">6months"], "Pilih durasi masalah"),
  symptomFrequency: z.enum(["daily", "weekly", "monthly", "rarely"], "Pilih frekuensi gejala"),
  dailyImpact: z.enum(["none", "mild", "moderate", "severe"], "Pilih tingkat dampak"),

  // C. Riwayat Psikologis & Kesehatan
  hasSimilarHistory: z.enum(["yes", "no"]),
  similarHistoryDetail: z.string().optional(),
  hasFamilyHistory: z.enum(["yes", "no"]),
  familyHistoryDetail: z.string().optional(),
  hasMedicalTreatment: z.enum(["yes", "no"]),
  medicalTreatmentDetail: z.string().optional(),
  hasTraumaticEvent: z.enum(["yes", "no"]),
  traumaticEventDetail: z.string().optional(),
  sleepQuality: z.enum(["good", "fair", "poor", "disturbed"], "Pilih kualitas tidur"),
  selfHarmThoughts: z.enum(["never", "sometimes", "frequent"], "Pilih salah satu opsi"),

  // D. Kebiasaan & Gaya Hidup
  usesAddictiveSubstances: z.enum(["yes", "no"]),
  addictiveSubstancesDetail: z.string().optional(),
  eatingPattern: z.enum(["regular", "irregular", "overeating", "undereating"], "Pilih pola makan"),
  exerciseFrequency: z.enum(["never", "rarely", "sometimes", "regularly"], "Pilih frekuensi olahraga"),
  stressLevel: z.enum(["low", "moderate", "high", "veryHigh"], "Pilih tingkat stres"),

  // E. Tujuan Konsultasi
  consultationGoals: z.array(z.string()).min(1, "Pilih minimal satu tujuan"),
  therapyPreference: z.enum(["directive", "collaborative", "noPreference"], "Pilih preferensi pendekatan terapi"),
});

type ConsultationFormData = z.infer<typeof consultationFormSchema>;

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

function ConsultationFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service");
  const psychologistId = searchParams.get("psychologist");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const [formStep, setFormStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form data for Step 2
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

  // Form data for Step 3
  const [consentData, setConsentData] = useState<Partial<ConsentFormData>>({
    consentDate: new Date().toISOString().split("T")[0],
    clientNameConfirmation: "",
    signature: "",
    agreedToTerms: false,
  });

  // Print preview state
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Generate booking ID
  const bookingId = `OJ-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // Signature canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [useTextSignature, setUseTextSignature] = useState(true);

  // Initialize canvas
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

  const handleNextFormStep = () => {
    if (formStep === 1) {
      setFormStep(2);
    } else if (formStep === 2) {
      if (validateStep2()) {
        setFormStep(3);
      }
    } else if (formStep === 3) {
      if (validateStep3()) {
        router.push(
          `/booking/payment-method?service=${serviceId}&psychologist=${psychologistId}&date=${date}&time=${time}`
        );
      }
    }
  };

  const handlePrevFormStep = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
      setErrors({});
    }
  };

  const handleConsultationChange = (field: keyof ConsultationFormData, value: string | string[]) => {
    setConsultationData((prev) => ({ ...prev, [field]: value }));
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

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Helper functions for print labels
  const getLabelForValue = (field: string, value: string | undefined): string => {
    const labels: Record<string, Record<string, string>> = {
      gender: { male: "Laki-laki", female: "Perempuan" },
      maritalStatus: { single: "Belum Menikah", married: "Menikah", divorced: "Cerai" },
      takingPsychiatricMeds: { yes: "Ya", no: "Tidak" },
      problemDuration: { "<1month": "< 1 bulan", "1-3months": "1-3 bulan", "3-6months": "3-6 bulan", ">6months": "> 6 bulan" },
      symptomFrequency: { daily: "Setiap hari", weekly: "Beberapa kali seminggu", monthly: "Beberapa kali sebulan", rarely: "Jarang" },
      dailyImpact: { none: "Tidak mengganggu", mild: "Sedikit mengganggu", moderate: "Cukup mengganggu", severe: "Sangat mengganggu" },
      hasSimilarHistory: { yes: "Ya", no: "Tidak" },
      hasFamilyHistory: { yes: "Ya", no: "Tidak" },
      hasMedicalTreatment: { yes: "Ya", no: "Tidak" },
      hasTraumaticEvent: { yes: "Ya", no: "Tidak" },
      sleepQuality: { good: "Baik", fair: "Cukup", poor: "Kurang", disturbed: "Terganggu" },
      selfHarmThoughts: { never: "Tidak pernah", sometimes: "Pernah, tapi tidak serius", frequent: "Sering / Butuh bantuan segera" },
      usesAddictiveSubstances: { yes: "Ya", no: "Tidak" },
      eatingPattern: { regular: "Teratur", irregular: "Tidak teratur", overeating: "Makan berlebihan", undereating: "Makan kurang" },
      exerciseFrequency: { never: "Tidak pernah", rarely: "Jarang", sometimes: "Kadang-kadang", regularly: "Rutin" },
      stressLevel: { low: "Rendah", moderate: "Sedang", high: "Tinggi", veryHigh: "Sangat tinggi" },
      therapyPreference: { directive: "Direktif", collaborative: "Kolaboratif", noPreference: "Tidak ada preferensi" },
    };
    return labels[field]?.[value || ""] || value || "-";
  };

  // Printable Form Component
  const renderPrintableForm = () => (
    <div ref={printRef} className="print-content hidden print:block bg-white">
      {/* Print Header - Letterhead */}
      <div className="print-header border-b-2 border-[#2B5379] pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#2B5379]">OASE JIWA</h1>
            <p className="text-sm text-gray-600">Layanan Konseling Psikologi Profesional</p>
          </div>
          <div className="text-right text-sm">
            <p><strong>ID Booking:</strong> {bookingId}</p>
            <p><strong>Tanggal Cetak:</strong> {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold text-center text-[#234463] mb-6 uppercase tracking-wide">
        Formulir Konsultasi Psikologi
      </h2>

      {/* A. Data Diri Klien - 2 Column Layout */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-[#234463] border-b border-gray-300 pb-1 mb-3">
          A. Data Diri Klien
        </h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div className="flex">
            <span className="w-32 text-gray-600">Nama Lengkap</span>
            <span className="font-medium">: {dummyClientData.fullName}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">Jenis Kelamin</span>
            <span className="font-medium">: {getLabelForValue("gender", dummyClientData.gender)}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">Tanggal Lahir</span>
            <span className="font-medium">: {new Date(dummyClientData.birthDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">Usia</span>
            <span className="font-medium">: {dummyClientData.age} tahun</span>
          </div>
          <div className="flex col-span-2">
            <span className="w-32 text-gray-600">Alamat</span>
            <span className="font-medium">: {dummyClientData.address}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">No. Telepon</span>
            <span className="font-medium">: {dummyClientData.phone}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">Email</span>
            <span className="font-medium">: {dummyClientData.email}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">Pekerjaan</span>
            <span className="font-medium">: {dummyClientData.occupation}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600">Status Pernikahan</span>
            <span className="font-medium">: {getLabelForValue("maritalStatus", dummyClientData.maritalStatus)}</span>
          </div>
          <div className="flex col-span-2">
            <span className="w-32 text-gray-600">Kunjungan Pertama</span>
            <span className="font-medium">: {dummyClientData.isFirstVisit ? "[✓] Ya" : "[ ] Ya"}</span>
          </div>
        </div>
      </div>

      {/* B. Alasan Konsultasi */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-[#234463] border-b border-gray-300 pb-1 mb-3">
          B. Alasan Konsultasi
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <p className="text-gray-600 mb-1">Alasan utama mencari layanan:</p>
            <p className="font-medium pl-4 border-l-2 border-[#2B5379]">{consultationData.mainReason || "-"}</p>
          </div>
          <div className="flex">
            <span className="w-64 text-gray-600">Sedang mengonsumsi obat psikiatri</span>
            <span className="font-medium">: {consultationData.takingPsychiatricMeds === "yes" ? "[✓] Ya" : consultationData.takingPsychiatricMeds === "no" ? "[✓] Tidak" : "-"}</span>
          </div>
          <div className="flex">
            <span className="w-64 text-gray-600">Durasi masalah</span>
            <span className="font-medium">: {getLabelForValue("problemDuration", consultationData.problemDuration)}</span>
          </div>
          <div className="flex">
            <span className="w-64 text-gray-600">Frekuensi gejala</span>
            <span className="font-medium">: {getLabelForValue("symptomFrequency", consultationData.symptomFrequency)}</span>
          </div>
          <div className="flex">
            <span className="w-64 text-gray-600">Dampak terhadap aktivitas harian</span>
            <span className="font-medium">: {getLabelForValue("dailyImpact", consultationData.dailyImpact)}</span>
          </div>
        </div>
      </div>

      {/* C. Riwayat Psikologis & Kesehatan */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-[#234463] border-b border-gray-300 pb-1 mb-3">
          C. Riwayat Psikologis & Kesehatan
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-600">Riwayat masalah serupa: </span>
            <span className="font-medium">{consultationData.hasSimilarHistory === "yes" ? "[✓] Ya" : "[✓] Tidak"}</span>
            {consultationData.hasSimilarHistory === "yes" && consultationData.similarHistoryDetail && (
              <p className="pl-4 mt-1 text-gray-700">→ {consultationData.similarHistoryDetail}</p>
            )}
          </div>
          <div>
            <span className="text-gray-600">Riwayat keluarga dengan masalah kesehatan mental: </span>
            <span className="font-medium">{consultationData.hasFamilyHistory === "yes" ? "[✓] Ya" : "[✓] Tidak"}</span>
            {consultationData.hasFamilyHistory === "yes" && consultationData.familyHistoryDetail && (
              <p className="pl-4 mt-1 text-gray-700">→ {consultationData.familyHistoryDetail}</p>
            )}
          </div>
          <div>
            <span className="text-gray-600">Sedang dalam pengobatan medis: </span>
            <span className="font-medium">{consultationData.hasMedicalTreatment === "yes" ? "[✓] Ya" : "[✓] Tidak"}</span>
            {consultationData.hasMedicalTreatment === "yes" && consultationData.medicalTreatmentDetail && (
              <p className="pl-4 mt-1 text-gray-700">→ {consultationData.medicalTreatmentDetail}</p>
            )}
          </div>
          <div>
            <span className="text-gray-600">Pernah mengalami kejadian traumatis: </span>
            <span className="font-medium">{consultationData.hasTraumaticEvent === "yes" ? "[✓] Ya" : "[✓] Tidak"}</span>
            {consultationData.hasTraumaticEvent === "yes" && consultationData.traumaticEventDetail && (
              <p className="pl-4 mt-1 text-gray-700">→ {consultationData.traumaticEventDetail}</p>
            )}
          </div>
          <div className="flex">
            <span className="w-64 text-gray-600">Kualitas tidur</span>
            <span className="font-medium">: {getLabelForValue("sleepQuality", consultationData.sleepQuality)}</span>
          </div>
          <div className="flex">
            <span className="w-64 text-gray-600">Pemikiran menyakiti diri sendiri</span>
            <span className="font-medium">: {getLabelForValue("selfHarmThoughts", consultationData.selfHarmThoughts)}</span>
          </div>
        </div>
      </div>

      {/* D. Kebiasaan & Gaya Hidup */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-[#234463] border-b border-gray-300 pb-1 mb-3">
          D. Kebiasaan & Gaya Hidup
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-600">Konsumsi zat adiktif: </span>
            <span className="font-medium">{consultationData.usesAddictiveSubstances === "yes" ? "[✓] Ya" : "[✓] Tidak"}</span>
            {consultationData.usesAddictiveSubstances === "yes" && consultationData.addictiveSubstancesDetail && (
              <p className="pl-4 mt-1 text-gray-700">→ {consultationData.addictiveSubstancesDetail}</p>
            )}
          </div>
          <div className="flex">
            <span className="w-64 text-gray-600">Pola makan</span>
            <span className="font-medium">: {getLabelForValue("eatingPattern", consultationData.eatingPattern)}</span>
          </div>
          <div className="flex">
            <span className="w-64 text-gray-600">Frekuensi olahraga</span>
            <span className="font-medium">: {getLabelForValue("exerciseFrequency", consultationData.exerciseFrequency)}</span>
          </div>
          <div className="flex">
            <span className="w-64 text-gray-600">Tingkat stres</span>
            <span className="font-medium">: {getLabelForValue("stressLevel", consultationData.stressLevel)}</span>
          </div>
        </div>
      </div>

      {/* E. Tujuan Konsultasi */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-[#234463] border-b border-gray-300 pb-1 mb-3">
          E. Tujuan Konsultasi
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <p className="text-gray-600 mb-2">Tujuan yang ingin dicapai:</p>
            <ul className="pl-4 space-y-1">
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
                <li key={goal} className={`${(consultationData.consultationGoals || []).includes(goal) ? "font-medium" : "text-gray-400"}`}>
                  {(consultationData.consultationGoals || []).includes(goal) ? "[✓]" : "[ ]"} {goal}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex mt-3">
            <span className="w-64 text-gray-600">Preferensi pendekatan terapi</span>
            <span className="font-medium">: {getLabelForValue("therapyPreference", consultationData.therapyPreference)}</span>
          </div>
        </div>
      </div>

      {/* Print Footer - Signature */}
      <div className="print-footer mt-8 pt-4 border-t border-gray-300">
        <div className="flex justify-between items-end">
          <div className="text-xs text-gray-500">
            <p>Dokumen ini dicetak secara digital dari sistem Oase Jiwa.</p>
            <p>Informasi bersifat rahasia dan dilindungi.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-2">Jakarta, {new Date(consentData.consentDate || "").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
            <div className="border-b border-gray-400 w-48 mb-1 pb-8">
              {useTextSignature ? (
                <p className="text-lg font-medium" style={{ fontFamily: "'Brush Script MT', cursive" }}>
                  {consentData.signature || consentData.clientNameConfirmation}
                </p>
              ) : (
                consentData.signature && (
                  <img src={consentData.signature} alt="Tanda tangan" className="h-12 object-contain" />
                )
              )}
            </div>
            <p className="text-sm font-medium">{consentData.clientNameConfirmation || dummyClientData.fullName}</p>
            <p className="text-xs text-gray-500">Klien</p>
          </div>
        </div>
      </div>
    </div>
  );

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
            {step < formStep ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              step
            )}
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

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#E8F6FF] rounded-xl flex items-center justify-center">
          <User className="w-6 h-6 text-[#2B5379]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Informasi Klien</h2>
          <p className="text-sm text-slate-500">Data profil dari akun Anda (tidak dapat diubah)</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Informasi Penting</p>
            <p className="text-sm text-amber-700">
              Data berikut diambil dari profil akun Anda. Jika ada perubahan, silakan update di halaman profil.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nama Lengkap */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Nama Lengkap
          </label>
          <input
            type="text"
            value={dummyClientData.fullName}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* Jenis Kelamin */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Jenis Kelamin</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 cursor-not-allowed flex-1">
              <input
                type="radio"
                name="gender"
                checked={dummyClientData.gender === "male"}
                disabled
                className="w-4 h-4 text-[#2B5379]"
              />
              <span className="text-gray-600">Laki-laki</span>
            </label>
            <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 cursor-not-allowed flex-1">
              <input
                type="radio"
                name="gender"
                checked={dummyClientData.gender === "female"}
                disabled
                className="w-4 h-4 text-[#2B5379]"
              />
              <span className="text-gray-600">Perempuan</span>
            </label>
          </div>
        </div>

        {/* Tanggal Lahir */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Tanggal Lahir
          </label>
          <input
            type="text"
            value={new Date(dummyClientData.birthDate).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* Usia */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Usia</label>
          <input
            type="text"
            value={`${dummyClientData.age} tahun`}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* Alamat */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Alamat
          </label>
          <textarea
            value={dummyClientData.address}
            disabled
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed resize-none"
          />
        </div>

        {/* Nomor Telepon */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Nomor Telepon
          </label>
          <input
            type="text"
            value={dummyClientData.phone}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </label>
          <input
            type="text"
            value={dummyClientData.email}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* Pekerjaan */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Briefcase className="w-4 h-4 inline mr-2" />
            Pekerjaan
          </label>
          <input
            type="text"
            value={dummyClientData.occupation}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* Status Pernikahan */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Heart className="w-4 h-4 inline mr-2" />
            Status Pernikahan
          </label>
          <input
            type="text"
            value={
              dummyClientData.maritalStatus === "single"
                ? "Belum Menikah"
                : dummyClientData.maritalStatus === "married"
                ? "Menikah"
                : "Cerai"
            }
            disabled
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* Kunjungan Pertama */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 cursor-not-allowed">
            <input
              type="checkbox"
              checked={dummyClientData.isFirstVisit}
              disabled
              className="w-5 h-5 rounded text-[#2B5379]"
            />
            <span className="text-gray-600">Ini adalah kunjungan pertama saya ke layanan konseling</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#E8F6FF] rounded-xl flex items-center justify-center">
          <FileText className="w-6 h-6 text-[#2B5379]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Formulir Konsultasi</h2>
          <p className="text-sm text-slate-500">Isi formulir berikut untuk membantu psikolog memahami kondisi Anda</p>
        </div>
      </div>

      {/* B. Alasan Konsultasi */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-[#234463] border-b border-gray-100 pb-3">
          B. Alasan Konsultasi
        </h3>

        {/* Alasan Utama */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Alasan utama Anda mencari layanan konseling <span className="text-red-500">*</span>
          </label>
          <textarea
            value={consultationData.mainReason || ""}
            onChange={(e) => handleConsultationChange("mainReason", e.target.value)}
            rows={4}
            placeholder="Ceritakan alasan utama Anda ingin berkonsultasi..."
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.mainReason ? "border-red-500" : "border-gray-200"
            } focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none transition-all resize-none`}
          />
          {errors.mainReason && (
            <p className="text-sm text-red-500 mt-1">{errors.mainReason}</p>
          )}
        </div>

        {/* Obat Psikiatri */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Apakah Anda sedang mengonsumsi obat psikiatri? <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            {[
              { value: "yes", label: "Ya" },
              { value: "no", label: "Tidak" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                  consultationData.takingPsychiatricMeds === option.value
                    ? "border-[#2B5379] bg-[#E8F6FF]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="takingPsychiatricMeds"
                  value={option.value}
                  checked={consultationData.takingPsychiatricMeds === option.value}
                  onChange={(e) =>
                    handleConsultationChange("takingPsychiatricMeds", e.target.value as "yes" | "no")
                  }
                  className="w-4 h-4 text-[#2B5379]"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.takingPsychiatricMeds && (
            <p className="text-sm text-red-500 mt-1">{errors.takingPsychiatricMeds}</p>
          )}
        </div>

        {/* Durasi Masalah */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Berapa lama Anda mengalami masalah ini? <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: "<1month", label: "< 1 bulan" },
              { value: "1-3months", label: "1-3 bulan" },
              { value: "3-6months", label: "3-6 bulan" },
              { value: ">6months", label: "> 6 bulan" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all text-center ${
                  consultationData.problemDuration === option.value
                    ? "border-[#2B5379] bg-[#E8F6FF]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="problemDuration"
                  value={option.value}
                  checked={consultationData.problemDuration === option.value}
                  onChange={(e) => handleConsultationChange("problemDuration", e.target.value)}
                  className="sr-only"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.problemDuration && (
            <p className="text-sm text-red-500 mt-1">{errors.problemDuration}</p>
          )}
        </div>

        {/* Frekuensi Gejala */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Seberapa sering Anda mengalami gejala ini? <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: "daily", label: "Setiap hari" },
              { value: "weekly", label: "Beberapa kali seminggu" },
              { value: "monthly", label: "Beberapa kali sebulan" },
              { value: "rarely", label: "Jarang" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all text-center ${
                  consultationData.symptomFrequency === option.value
                    ? "border-[#2B5379] bg-[#E8F6FF]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="symptomFrequency"
                  value={option.value}
                  checked={consultationData.symptomFrequency === option.value}
                  onChange={(e) => handleConsultationChange("symptomFrequency", e.target.value)}
                  className="sr-only"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.symptomFrequency && (
            <p className="text-sm text-red-500 mt-1">{errors.symptomFrequency}</p>
          )}
        </div>

        {/* Dampak Harian */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Seberapa besar masalah ini mengganggu aktivitas harian Anda? <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: "none", label: "Tidak mengganggu" },
              { value: "mild", label: "Sedikit mengganggu" },
              { value: "moderate", label: "Cukup mengganggu" },
              { value: "severe", label: "Sangat mengganggu" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all text-center ${
                  consultationData.dailyImpact === option.value
                    ? "border-[#2B5379] bg-[#E8F6FF]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="dailyImpact"
                  value={option.value}
                  checked={consultationData.dailyImpact === option.value}
                  onChange={(e) => handleConsultationChange("dailyImpact", e.target.value)}
                  className="sr-only"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.dailyImpact && (
            <p className="text-sm text-red-500 mt-1">{errors.dailyImpact}</p>
          )}
        </div>
      </div>

      {/* C. Riwayat Psikologis & Kesehatan */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-[#234463] border-b border-gray-100 pb-3">
          C. Riwayat Psikologis & Kesehatan
        </h3>

        {/* Riwayat Serupa */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Apakah Anda pernah mengalami masalah serupa sebelumnya?
          </label>
          <div className="flex gap-4 mb-3">
            {[
              { value: "yes", label: "Ya" },
              { value: "no", label: "Tidak" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                  consultationData.hasSimilarHistory === option.value
                    ? "border-[#2B5379] bg-[#E8F6FF]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="hasSimilarHistory"
                  value={option.value}
                  checked={consultationData.hasSimilarHistory === option.value}
                  onChange={(e) =>
                    handleConsultationChange("hasSimilarHistory", e.target.value as "yes" | "no")
                  }
                  className="w-4 h-4 text-[#2B5379]"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {consultationData.hasSimilarHistory === "yes" && (
            <textarea
              value={consultationData.similarHistoryDetail || ""}
              onChange={(e) => handleConsultationChange("similarHistoryDetail", e.target.value)}
              rows={2}
              placeholder="Jelaskan riwayat masalah serupa yang pernah Anda alami..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none transition-all resize-none"
            />
          )}
        </div>

        {/* Riwayat Keluarga */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Apakah ada anggota keluarga yang memiliki riwayat masalah kesehatan mental?
          </label>
          <div className="flex gap-4 mb-3">
            {[
              { value: "yes", label: "Ya" },
              { value: "no", label: "Tidak" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                  consultationData.hasFamilyHistory === option.value
                    ? "border-[#2B5379] bg-[#E8F6FF]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="hasFamilyHistory"
                  value={option.value}
                  checked={consultationData.hasFamilyHistory === option.value}
                  onChange={(e) =>
                    handleConsultationChange("hasFamilyHistory", e.target.value as "yes" | "no")
                  }
                  className="w-4 h-4 text-[#2B5379]"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {consultationData.hasFamilyHistory === "yes" && (
            <textarea
              value={consultationData.familyHistoryDetail || ""}
              onChange={(e) => handleConsultationChange("familyHistoryDetail", e.target.value)}
              rows={2}
              placeholder="Jelaskan riwayat kesehatan mental dalam keluarga Anda..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none transition-all resize-none"
            />
          )}
        </div>

        {/* Pengobatan Medis */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Apakah Anda sedang dalam pengobatan medis tertentu?
          </label>
          <div className="flex gap-4 mb-3">
            {[
              { value: "yes", label: "Ya" },
              { value: "no", label: "Tidak" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                  consultationData.hasMedicalTreatment === option.value
                    ? "border-[#2B5379] bg-[#E8F6FF]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="hasMedicalTreatment"
                  value={option.value}
                  checked={consultationData.hasMedicalTreatment === option.value}
                  onChange={(e) =>
                    handleConsultationChange("hasMedicalTreatment", e.target.value as "yes" | "no")
                  }
                  className="w-4 h-4 text-[#2B5379]"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {consultationData.hasMedicalTreatment === "yes" && (
            <textarea
              value={consultationData.medicalTreatmentDetail || ""}
              onChange={(e) => handleConsultationChange("medicalTreatmentDetail", e.target.value)}
              rows={2}
              placeholder="Sebutkan pengobatan medis yang sedang Anda jalani..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none transition-all resize-none"
            />
          )}
        </div>

        {/* Kejadian Traumatis */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Apakah Anda pernah mengalami kejadian traumatis?
          </label>
          <div className="flex gap-4 mb-3">
            {[
              { value: "yes", label: "Ya" },
              { value: "no", label: "Tidak" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                  consultationData.hasTraumaticEvent === option.value
                    ? "border-[#2B5379] bg-[#E8F6FF]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="hasTraumaticEvent"
                  value={option.value}
                  checked={consultationData.hasTraumaticEvent === option.value}
                  onChange={(e) =>
                    handleConsultationChange("hasTraumaticEvent", e.target.value as "yes" | "no")
                  }
                  className="w-4 h-4 text-[#2B5379]"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {consultationData.hasTraumaticEvent === "yes" && (
            <textarea
              value={consultationData.traumaticEventDetail || ""}
              onChange={(e) => handleConsultationChange("traumaticEventDetail", e.target.value)}
              rows={2}
              placeholder="Jika bersedia, ceritakan secara singkat kejadian traumatis tersebut..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none transition-all resize-none"
            />
          )}
        </div>

        {/* Kualitas Tidur */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Bagaimana kualitas tidur Anda? <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: "good", label: "Baik" },
              { value: "fair", label: "Cukup" },
              { value: "poor", label: "Kurang" },
              { value: "disturbed", label: "Terganggu" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all text-center ${
                  consultationData.sleepQuality === option.value
                    ? "border-[#2B5379] bg-[#E8F6FF]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="sleepQuality"
                  value={option.value}
                  checked={consultationData.sleepQuality === option.value}
                  onChange={(e) => handleConsultationChange("sleepQuality", e.target.value)}
                  className="sr-only"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.sleepQuality && (
            <p className="text-sm text-red-500 mt-1">{errors.sleepQuality}</p>
          )}
        </div>

        {/* Pemikiran Menyakiti Diri */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Apakah Anda pernah memiliki pemikiran untuk menyakiti diri sendiri? <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {[
              { value: "never", label: "Tidak pernah" },
              { value: "sometimes", label: "Pernah, tapi tidak serius" },
              { value: "frequent", label: "Sering / Butuh bantuan segera" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                  consultationData.selfHarmThoughts === option.value
                    ? "border-[#2B5379] bg-[#E8F6FF]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="selfHarmThoughts"
                  value={option.value}
                  checked={consultationData.selfHarmThoughts === option.value}
                  onChange={(e) => handleConsultationChange("selfHarmThoughts", e.target.value)}
                  className="w-4 h-4 text-[#2B5379]"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
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
                  <p className="text-sm font-medium text-red-800">Perhatian Penting</p>
                  <p className="text-sm text-red-700">
                    Jika Anda membutuhkan bantuan segera, silakan hubungi hotline crisis: <strong>119 ext. 8</strong> (Kemenkes RI) atau kunjungi IGD rumah sakit terdekat.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* D. Kebiasaan & Gaya Hidup */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-[#234463] border-b border-gray-100 pb-3">
          D. Kebiasaan & Gaya Hidup
        </h3>

        {/* Zat Adiktif */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Apakah Anda mengonsumsi zat adiktif (alkohol, rokok, narkoba, dll)?
          </label>
          <div className="flex gap-4 mb-3">
            {[
              { value: "yes", label: "Ya" },
              { value: "no", label: "Tidak" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                  consultationData.usesAddictiveSubstances === option.value
                    ? "border-[#2B5379] bg-[#E8F6FF]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="usesAddictiveSubstances"
                  value={option.value}
                  checked={consultationData.usesAddictiveSubstances === option.value}
                  onChange={(e) =>
                    handleConsultationChange("usesAddictiveSubstances", e.target.value as "yes" | "no")
                  }
                  className="w-4 h-4 text-[#2B5379]"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {consultationData.usesAddictiveSubstances === "yes" && (
            <input
              type="text"
              value={consultationData.addictiveSubstancesDetail || ""}
              onChange={(e) => handleConsultationChange("addictiveSubstancesDetail", e.target.value)}
              placeholder="Sebutkan jenis dan frekuensi konsumsi..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none transition-all"
            />
          )}
        </div>

        {/* Pola Makan */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Bagaimana pola makan Anda? <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: "regular", label: "Teratur" },
              { value: "irregular", label: "Tidak teratur" },
              { value: "overeating", label: "Makan berlebihan" },
              { value: "undereating", label: "Makan kurang" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all text-center ${
                  consultationData.eatingPattern === option.value
                    ? "border-[#2B5379] bg-[#E8F6FF]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="eatingPattern"
                  value={option.value}
                  checked={consultationData.eatingPattern === option.value}
                  onChange={(e) => handleConsultationChange("eatingPattern", e.target.value)}
                  className="sr-only"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.eatingPattern && (
            <p className="text-sm text-red-500 mt-1">{errors.eatingPattern}</p>
          )}
        </div>

        {/* Frekuensi Olahraga */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Seberapa sering Anda berolahraga? <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: "never", label: "Tidak pernah" },
              { value: "rarely", label: "Jarang" },
              { value: "sometimes", label: "Kadang-kadang" },
              { value: "regularly", label: "Rutin" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all text-center ${
                  consultationData.exerciseFrequency === option.value
                    ? "border-[#2B5379] bg-[#E8F6FF]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="exerciseFrequency"
                  value={option.value}
                  checked={consultationData.exerciseFrequency === option.value}
                  onChange={(e) => handleConsultationChange("exerciseFrequency", e.target.value)}
                  className="sr-only"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.exerciseFrequency && (
            <p className="text-sm text-red-500 mt-1">{errors.exerciseFrequency}</p>
          )}
        </div>

        {/* Tingkat Stres */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Bagaimana tingkat stres Anda saat ini? <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: "low", label: "Rendah" },
              { value: "moderate", label: "Sedang" },
              { value: "high", label: "Tinggi" },
              { value: "veryHigh", label: "Sangat tinggi" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all text-center ${
                  consultationData.stressLevel === option.value
                    ? "border-[#2B5379] bg-[#E8F6FF]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="stressLevel"
                  value={option.value}
                  checked={consultationData.stressLevel === option.value}
                  onChange={(e) => handleConsultationChange("stressLevel", e.target.value)}
                  className="sr-only"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.stressLevel && (
            <p className="text-sm text-red-500 mt-1">{errors.stressLevel}</p>
          )}
        </div>
      </div>

      {/* E. Tujuan Konsultasi */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-[#234463] border-b border-gray-100 pb-3">
          E. Tujuan Konsultasi
        </h3>

        {/* Tujuan (Multi-select) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Apa yang ingin Anda capai dari konsultasi ini? <span className="text-red-500">*</span>
            <span className="text-gray-500 font-normal"> (Pilih satu atau lebih)</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              <label
                key={goal}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                  (consultationData.consultationGoals || []).includes(goal)
                    ? "border-[#2B5379] bg-[#E8F6FF]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={(consultationData.consultationGoals || []).includes(goal)}
                  onChange={() => handleGoalToggle(goal)}
                  className="w-5 h-5 rounded text-[#2B5379]"
                />
                <span className="text-gray-700 text-sm">{goal}</span>
              </label>
            ))}
          </div>
          {errors.consultationGoals && (
            <p className="text-sm text-red-500 mt-1">{errors.consultationGoals}</p>
          )}
        </div>

        {/* Preferensi Pendekatan Terapi */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Preferensi pendekatan terapi <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {[
              { value: "directive", label: "Direktif - Psikolog lebih aktif memberikan arahan dan saran" },
              { value: "collaborative", label: "Kolaboratif - Klien dan psikolog bekerja sama mencari solusi" },
              { value: "noPreference", label: "Tidak ada preferensi - Sesuaikan dengan kebutuhan saya" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-start gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                  consultationData.therapyPreference === option.value
                    ? "border-[#2B5379] bg-[#E8F6FF]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="therapyPreference"
                  value={option.value}
                  checked={consultationData.therapyPreference === option.value}
                  onChange={(e) => handleConsultationChange("therapyPreference", e.target.value)}
                  className="w-4 h-4 text-[#2B5379] mt-0.5"
                />
                <span className="text-gray-700 text-sm">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.therapyPreference && (
            <p className="text-sm text-red-500 mt-1">{errors.therapyPreference}</p>
          )}
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
          <h2 className="text-xl font-semibold text-slate-800">Informasi Kebijakan & Persetujuan</h2>
          <p className="text-sm text-slate-500">Baca dan setujui kebijakan layanan kami</p>
        </div>
      </div>

      {/* F. Informasi Kebijakan */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-[#234463] border-b border-gray-100 pb-3 mb-4">
          F. Informasi Kebijakan Layanan
        </h3>
        <div className="bg-gray-50 rounded-xl p-4 max-h-80 overflow-y-auto text-sm text-gray-700 space-y-4">
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">1. Kerahasiaan (Confidentiality)</h4>
            <p className="leading-relaxed">
              Seluruh informasi yang Anda sampaikan dalam sesi konseling bersifat rahasia dan dilindungi. 
              Psikolog kami terikat dengan kode etik profesi untuk menjaga kerahasiaan informasi klien. 
              Informasi hanya akan dibagikan kepada pihak ketiga dengan persetujuan tertulis dari Anda, 
              kecuali dalam kondisi yang diatur oleh hukum atau ketika ada ancaman keselamatan.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-2">2. Pengecualian Kerahasiaan</h4>
            <p className="leading-relaxed">
              Kerahasiaan dapat dibatalkan dalam kondisi berikut: (a) Adanya ancaman serius terhadap 
              keselamatan diri sendiri atau orang lain; (b) Dugaan kekerasan atau penelantaran terhadap 
              anak, lansia, atau individu rentan; (c) Perintah pengadilan atau kewajiban hukum lainnya; 
              (d) Klien memberikan izin tertulis untuk pengungkapan informasi kepada pihak tertentu.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-2">3. Keamanan Data</h4>
            <p className="leading-relaxed">
              Data pribadi dan rekam medis Anda disimpan dengan sistem keamanan berlapis dan terenkripsi. 
              Akses terhadap data dibatasi hanya untuk personel yang berwenang. Kami mengikuti standar 
              keamanan data kesehatan yang berlaku di Indonesia dan secara berkala melakukan audit 
              keamanan sistem.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-2">4. Hak Klien</h4>
            <p className="leading-relaxed">
              Sebagai klien, Anda memiliki hak untuk: (a) Mendapatkan informasi lengkap tentang layanan 
              dan prosedur yang akan dilakukan; (b) Menolak atau menghentikan layanan kapan saja; 
              (c) Meminta akses atau salinan rekam psikologis Anda; (d) Mengajukan keluhan jika merasa 
              tidak puas dengan layanan; (e) Mendapatkan rujukan ke profesional lain jika diperlukan; 
              (f) Mendapatkan layanan tanpa diskriminasi.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-2">5. Ketentuan Pembatalan</h4>
            <p className="leading-relaxed">
              Pembatalan sesi harus dilakukan minimal 24 jam sebelum jadwal konsultasi. Pembatalan 
              yang dilakukan kurang dari 24 jam akan dikenakan biaya administrasi sebesar 50% dari 
              harga sesi. Ketidakhadiran tanpa pemberitahuan akan dikenakan biaya penuh.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-2">6. Batasan Layanan</h4>
            <p className="leading-relaxed">
              Layanan konseling yang kami berikan bukan pengganti perawatan medis atau psikiatri. 
              Jika kondisi Anda memerlukan penanganan medis atau psikiatri, psikolog akan memberikan 
              rujukan ke profesional kesehatan yang sesuai. Dalam keadaan darurat, segera hubungi 
              layanan darurat atau kunjungi IGD rumah sakit terdekat.
            </p>
          </div>
        </div>
      </div>

      {/* G. Pernyataan Persetujuan */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-[#234463] border-b border-gray-100 pb-3">
          G. Pernyataan Persetujuan
        </h3>

        {/* Tanggal */}
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

        {/* Nama Klien */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nama Lengkap Klien <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={consentData.clientNameConfirmation || ""}
            onChange={(e) =>
              setConsentData((prev) => ({ ...prev, clientNameConfirmation: e.target.value }))
            }
            placeholder="Masukkan nama lengkap Anda sebagai konfirmasi"
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.clientNameConfirmation ? "border-red-500" : "border-gray-200"
            } focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none transition-all`}
          />
          {errors.clientNameConfirmation && (
            <p className="text-sm text-red-500 mt-1">{errors.clientNameConfirmation}</p>
          )}
        </div>

        {/* Tanda Tangan */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tanda Tangan <span className="text-red-500">*</span>
          </label>

          {/* Toggle between text and canvas signature */}
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

        {/* Agreement Checkbox */}
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
                setConsentData((prev) => ({ ...prev, agreedToTerms: e.target.checked }))
              }
              className="w-5 h-5 rounded text-[#2B5379] mt-0.5"
            />
            <span className="text-gray-700 text-sm leading-relaxed">
              Saya menyatakan bahwa seluruh informasi yang saya berikan adalah benar dan akurat. 
              Saya telah membaca, memahami, dan menyetujui seluruh ketentuan dan kebijakan layanan 
              yang tercantum di atas. Saya memberikan persetujuan untuk menerima layanan konseling 
              psikologi dari OaseJiwa.
            </span>
          </label>
          {errors.agreedToTerms && (
            <p className="text-sm text-red-500 mt-1">{errors.agreedToTerms}</p>
          )}
        </div>

        {/* Print/Download Buttons */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-3">Simpan formulir untuk arsip Anda:</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2B5379] text-[#2B5379] hover:bg-[#E8F6FF] transition-colors text-sm font-medium no-print"
            >
              <Printer className="w-4 h-4" />
              Cetak Formulir
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium no-print"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-white font-[var(--font-poppins)] no-print-main">
      {/* Printable Form - Hidden on screen, shown on print */}
      {renderPrintableForm()}

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-6 lg:px-16 bg-gradient-to-b from-[#E8F6FF] to-white no-print">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-[40px] md:text-[48px] font-semibold mb-4 animate-fade-in-up">
            <span className="text-[#000000]">Formulir </span>
            <span className="text-[#234463]">Konsultasi</span>
          </h1>
          <p className="text-lg text-[#4B4B4B] animate-fade-in-up">
            Lengkapi formulir berikut untuk membantu psikolog memahami kebutuhan Anda
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 py-8 no-print">
        {/* Main Booking Stepper */}
        <div className="mb-8 animate-fadeIn stagger-2">
          <BookingStepper currentStep={4} />
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 animate-fadeIn stagger-3">
          {/* Form Step Indicator */}
          {renderFormStepIndicator()}

          {/* Step Labels */}
          <div className="flex justify-between mb-8 text-sm">
            <span
              className={`transition-colors ${
                formStep === 1 ? "text-[#2B5379] font-medium" : "text-gray-400"
              }`}
            >
              Informasi Klien
            </span>
            <span
              className={`transition-colors ${
                formStep === 2 ? "text-[#2B5379] font-medium" : "text-gray-400"
              }`}
            >
              Formulir Konsultasi
            </span>
            <span
              className={`transition-colors ${
                formStep === 3 ? "text-[#2B5379] font-medium" : "text-gray-400"
              }`}
            >
              Persetujuan
            </span>
          </div>

          {/* Form Steps Content */}
          {formStep === 1 && renderStep1()}
          {formStep === 2 && renderStep2()}
          {formStep === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8 mt-8 border-t border-[#D6E6F2] no-print">
            <button
              onClick={formStep === 1 ? () => router.back() : handlePrevFormStep}
              className="flex items-center gap-2 px-6 py-3 text-[#2B5379] font-medium hover:bg-[#E8F6FF] rounded-xl transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Kembali
            </button>
            <button
              onClick={handleNextFormStep}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold bg-[#2B5379] text-white hover:bg-[#234463] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              {formStep === 3 ? "Lanjutkan ke Pembayaran" : "Lanjut"}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ConsultationFormPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#2B5379] border-t-transparent rounded-full" />
        </div>
      }
    >
      <ConsultationFormContent />
    </Suspense>
  );
}
