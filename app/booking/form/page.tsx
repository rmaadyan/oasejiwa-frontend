"use client";

import { useState, Suspense, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookingStepper from "@/components/booking/BookingStepper";
import { z } from "zod";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { createBooking } from "@/lib/api/booking";
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

const consentFormSchema = z.object({
  consentDate: z.string(),
  clientNameConfirmation: z.string().min(3, "Masukkan nama lengkap Anda"),
  signature: z.string().min(3, "Tanda tangan diperlukan"),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "Anda harus menyetujui ketentuan layanan",
  }),
});

type ConsentFormData = z.infer<typeof consentFormSchema>;

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

  const [formStep, setFormStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🟢 STATE HARI, JAM, & TANGGAL SESI KONSULTASI
  const [selectedDay, setSelectedDay] = useState<string>(dayParam);
  const [selectedTime, setSelectedTime] = useState<string>(timeParam);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    if (dateParam && dateParam.length >= 10) return dateParam.split("T")[0];
    const available = getAvailableDatesForDay(dayParam);
    return available[0]?.isoDate || new Date().toISOString().split("T")[0];
  });

  // Contoh array tanggal yang sudah dibooking orang lain dari database (misal tanggal 2026-08-08)
  const [bookedDates, setBookedDates] = useState<string[]>([]);

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
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Login Diperlukan
          </h2>
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

  if (!user) return null;

  const clientData = {
    fullName: user.profile!.name,
    gender: user.profile!.gender.toLowerCase(), 
    birthDate: user.profile!.birthday?.split('T')[0] ?? '',
    age: calculateAge(user.profile!.birthday),
    address: user.profile!.fullAddress,
    phone: user.profile!.phone,
    email: user.email,
    occupation: "-", 
    maritalStatus: "-",
    isFirstVisit: true,
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
      if (validateStep2()) {
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
            "veryHigh": "VERY_HIGH",
          };
          const therapyMap: Record<string, string> = {
            "noPreference": "NO_PREFERENCE",
          };

          const mappedConsultation = {
            ...consultationData,
            problemDuration: durationMap[consultationData.problemDuration!] ?? consultationData.problemDuration?.toUpperCase(),
            symptomFrequency: consultationData.symptomFrequency?.toUpperCase(),
            dailyImpact: consultationData.dailyImpact?.toUpperCase(),
            sleepQuality: consultationData.sleepQuality?.toUpperCase(),
            selfHarmThoughts: consultationData.selfHarmThoughts?.toUpperCase(),
            eatingPattern: consultationData.eatingPattern?.toUpperCase(),
            exerciseFrequency: consultationData.exerciseFrequency?.toUpperCase(),
            stressLevel: stressMap[consultationData.stressLevel!] ?? consultationData.stressLevel?.toUpperCase(),
            therapyPreference: therapyMap[consultationData.therapyPreference!] ?? consultationData.therapyPreference?.toUpperCase(),
          };

          const validScheduledDate = toValidIsoDateString(selectedDate);
          const validConsentDate = toValidIsoDateString(consentData.consentDate!);

          const payload: any = {
            serviceId: Number(serviceId),
            psychologistId: psychologistId || "",
            scheduleId: scheduleId || undefined,
            scheduledDate: validScheduledDate,
            scheduledTime: selectedTime,
            consultationForm: mappedConsultation,
            consentForm: {
              consentDate: validConsentDate,
              clientNameConfirmation: consentData.clientNameConfirmation || "",
              signatureData: consentData.signature || "",
              signatureType: useTextSignature ? 'TEXT' : 'DRAWING',
              agreedToTerms: consentData.agreedToTerms ?? false,
            },
          };

          if (scheduleId && typeof scheduleId === 'string' && scheduleId.trim() !== '' && scheduleId !== 'null' && !scheduleId.startsWith('sch-')) {
            payload.scheduleId = scheduleId;
          }

          console.log("PAYLOAD:", payload);
          const booking = await createBooking(payload);
          
          router.push(
            `/booking/payment-method?bookingId=${booking.data.id}` 
          );
        } catch (error: unknown) {
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

  const generatePDF = async () => {
    setIsDownloading(true);
    try {
      const element = document.getElementById("booking-form-pdf-content");
      if (!element) {
        setIsDownloading(false);
        return;
      }

      const cloneElement = element.cloneNode(true) as HTMLElement;

      const tempWrapper = document.createElement("div");
      tempWrapper.style.position = "absolute";
      tempWrapper.style.left = "-9999px";
      tempWrapper.style.top = "-9999px";
      tempWrapper.style.backgroundColor = "#ffffff";
      tempWrapper.style.padding = "0";
      tempWrapper.style.width = "900px";
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
        width: 900,
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

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 7;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;

      const scaledImgHeightMm = (canvas.height * contentWidth) / canvas.width;

      const pageCanvasHeight = Math.floor(
        (contentHeight / scaledImgHeightMm) * canvas.height
      );

      const totalPages = Math.ceil(canvas.height / pageCanvasHeight);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }

        const sourceY = page * pageCanvasHeight;
        const sourceH = Math.min(pageCanvasHeight, canvas.height - sourceY);

        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceH;
        const pageCtx = pageCanvas.getContext("2d");
        if (!pageCtx) continue;

        pageCtx.fillStyle = "#ffffff";
        pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        pageCtx.drawImage(
          canvas,
          0, sourceY, canvas.width, sourceH,
          0, 0, canvas.width, sourceH
        );

        const pageImgData = pageCanvas.toDataURL("image/png");
        const sliceHeightMm = (sourceH * contentWidth) / canvas.width;

        pdf.addImage(
          pageImgData,
          "PNG",
          margin,
          margin,
          contentWidth,
          sliceHeightMm
        );
      }

      const safeName = clientData.fullName.replace(/[\\/:*?"<>|]/g, "_");
      const fileName = `Formulir-Konsultasi-${safeName}.pdf`;

      pdf.save(fileName);
    } catch (err) {
      console.error("PDF Error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

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

  const renderFormStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`
              w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300
              ${step === formStep
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
              className={`w-16 md:w-24 h-1 mx-2 rounded-full transition-colors duration-300 ${step < formStep ? "bg-green-500" : "bg-gray-200"
                }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderPrintableForm = () => (
    <div
      id="booking-form-pdf-content"
      className="rounded-xl bg-white p-8 shadow-sm"
      style={{ fontFamily: "Arial, sans-serif", position: "absolute", left: "-9999px", top: "-9999px", width: "900px" }}
    >
      <div className="mb-5 flex items-start justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-white">
            <img
              src="/assets/oasejiwalogo.png"
              alt="Logo Oase Jiwa"
              crossOrigin="anonymous"
              className="h-12 w-12 object-contain"
              style={{ display: "block" }}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1964ae]">
              Oase Jiwa
            </h1>
            <p className="text-[11px] text-gray-600">
              Kenali Dirimu, Pulihkan Jiwamu
            </p>
          </div>
        </div>
        <div className="text-right text-[11px] text-gray-600">
          <p className="font-semibold text-[#1964ae]">
            Biro Psikologi Oase Jiwa
          </p>
          <p>Perumahan d&apos; soeta residence D no.1</p>
          <p>Desa Tegalgondo, Kec. Karangploso, Kab. Malang</p>
        </div>
      </div>

      <div className="mb-4 border-b border-gray-200 pb-3">
        <p className="mb-2 text-xs font-semibold text-[#1964ae]">
          Data Klien
        </p>
        <div className="space-y-1 text-xs text-gray-800">
          <div className="flex gap-2">
            <span className="w-28 font-semibold text-[#1f3b5b]">Tanggal</span>
            <span>:</span>
            <span>
              {new Date().toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              ({new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })})
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-28 font-semibold text-[#1f3b5b]">ID Booking</span>
            <span>:</span>
            <span>{bookingId}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-28 font-semibold text-[#1f3b5b]">Nama</span>
            <span>:</span>
            <span>{clientData.fullName}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-28 font-semibold text-[#1f3b5b]">Jenis Kelamin</span>
            <span>:</span>
            <span>{getLabelForValue("gender", clientData.gender)}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-28 font-semibold text-[#1f3b5b]">Tanggal Lahir</span>
            <span>:</span>
            <span>{new Date(clientData.birthDate + 'T00:00:00').toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-28 font-semibold text-[#1f3b5b]">Usia</span>
            <span>:</span>
            <span>{clientData.age} tahun</span>
          </div>
          <div className="flex gap-2">
            <span className="w-28 font-semibold text-[#1f3b5b]">Alamat</span>
            <span>:</span>
            <span>{clientData.address}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-28 font-semibold text-[#1f3b5b]">Telepon</span>
            <span>:</span>
            <span>{clientData.phone}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-28 font-semibold text-[#1f3b5b]">Email</span>
            <span>:</span>
            <span>{clientData.email}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-28 font-semibold text-[#1f3b5b]">Pekerjaan</span>
            <span>:</span>
            <span>{clientData.occupation}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-28 font-semibold text-[#1f3b5b]">Status</span>
            <span>:</span>
            <span>{getLabelForValue("maritalStatus", clientData.maritalStatus)}</span>
          </div>
        </div>
      </div>

      <div className="mb-5 rounded-lg bg-green-50 px-4 py-3 border border-purple-100">
        <p className="text-center text-sm font-semibold text-gray-800">
          Formulir Konsultasi Psikologi
        </p>
        <p className="mt-1 text-center text-xs text-gray-700">
          ID Booking: {bookingId}
        </p>
      </div>

      <div className="mb-7 overflow-hidden rounded-lg border border-gray-300">
        <div className="bg-[#1f3b5b] px-5 py-3 text-sm font-bold text-white">
          B. Alasan Konsultasi
        </div>
        <div className="space-y-0 text-sm">
          <div className="px-5 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs font-semibold text-[#1f3b5b] mb-1">Alasan utama mencari layanan:</p>
            <p className="text-gray-800">{consultationData.mainReason || "-"}</p>
          </div>
          <div className="px-5 py-2 border-t border-gray-200 bg-white flex gap-2">
            <span className="w-64 font-semibold text-[#1f3b5b] text-xs">Obat psikiatri</span>
            <span className="text-xs">:</span>
            <span className="text-xs text-gray-800">{getLabelForValue("takingPsychiatricMeds", consultationData.takingPsychiatricMeds)}</span>
          </div>
          <div className="px-5 py-2 border-t border-gray-200 bg-gray-50 flex gap-2">
            <span className="w-64 font-semibold text-[#1f3b5b] text-xs">Durasi masalah</span>
            <span className="text-xs">:</span>
            <span className="text-xs text-gray-800">{getLabelForValue("problemDuration", consultationData.problemDuration)}</span>
          </div>
          <div className="px-5 py-2 border-t border-gray-200 bg-white flex gap-2">
            <span className="w-64 font-semibold text-[#1f3b5b] text-xs">Frekuensi gejala</span>
            <span className="text-xs">:</span>
            <span className="text-xs text-gray-800">{getLabelForValue("symptomFrequency", consultationData.symptomFrequency)}</span>
          </div>
          <div className="px-5 py-2 border-t border-gray-200 bg-gray-50 flex gap-2">
            <span className="w-64 font-semibold text-[#1f3b5b] text-xs">Dampak aktivitas harian</span>
            <span className="text-xs">:</span>
            <span className="text-xs text-gray-800">{getLabelForValue("dailyImpact", consultationData.dailyImpact)}</span>
          </div>
        </div>
      </div>

      <div className="mb-7 overflow-hidden rounded-lg border border-gray-300">
        <div className="bg-[#1f3b5b] px-5 py-3 text-sm font-bold text-white">
          C. Riwayat Psikologis &amp; Kesehatan
        </div>
        <div className="space-y-0 text-sm">
          <div className="px-5 py-2 border-t border-gray-200 bg-gray-50 flex gap-2">
            <span className="w-64 font-semibold text-[#1f3b5b] text-xs">Riwayat masalah serupa</span>
            <span className="text-xs">:</span>
            <span className="text-xs text-gray-800">
              {consultationData.hasSimilarHistory === "yes" ? "Ya" : "Tidak"}
              {consultationData.hasSimilarHistory === "yes" && consultationData.similarHistoryDetail && ` — ${consultationData.similarHistoryDetail}`}
            </span>
          </div>
          <div className="px-5 py-2 border-t border-gray-200 bg-white flex gap-2">
            <span className="w-64 font-semibold text-[#1f3b5b] text-xs">Riwayat keluarga</span>
            <span className="text-xs">:</span>
            <span className="text-xs text-gray-800">
              {consultationData.hasFamilyHistory === "yes" ? "Ya" : "Tidak"}
              {consultationData.hasFamilyHistory === "yes" && consultationData.familyHistoryDetail && ` — ${consultationData.familyHistoryDetail}`}
            </span>
          </div>
          <div className="px-5 py-2 border-t border-gray-200 bg-gray-50 flex gap-2">
            <span className="w-64 font-semibold text-[#1f3b5b] text-xs">Pengobatan medis</span>
            <span className="text-xs">:</span>
            <span className="text-xs text-gray-800">
              {consultationData.hasMedicalTreatment === "yes" ? "Ya" : "Tidak"}
              {consultationData.hasMedicalTreatment === "yes" && consultationData.medicalTreatmentDetail && ` — ${consultationData.medicalTreatmentDetail}`}
            </span>
          </div>
          <div className="px-5 py-2 border-t border-gray-200 bg-white flex gap-2">
            <span className="w-64 font-semibold text-[#1f3b5b] text-xs">Kejadian traumatis</span>
            <span className="text-xs">:</span>
            <span className="text-xs text-gray-800">
              {consultationData.hasTraumaticEvent === "yes" ? "Ya" : "Tidak"}
              {consultationData.hasTraumaticEvent === "yes" && consultationData.traumaticEventDetail && ` — ${consultationData.traumaticEventDetail}`}
            </span>
          </div>
          <div className="px-5 py-2 border-t border-gray-200 bg-gray-50 flex gap-2">
            <span className="w-64 font-semibold text-[#1f3b5b] text-xs">Kualitas tidur</span>
            <span className="text-xs">:</span>
            <span className="text-xs text-gray-800">{getLabelForValue("sleepQuality", consultationData.sleepQuality)}</span>
          </div>
          <div className="px-5 py-2 border-t border-gray-200 bg-white flex gap-2">
            <span className="w-64 font-semibold text-[#1f3b5b] text-xs">Pemikiran menyakiti diri</span>
            <span className="text-xs">:</span>
            <span className="text-xs text-gray-800">{getLabelForValue("selfHarmThoughts", consultationData.selfHarmThoughts)}</span>
          </div>
        </div>
      </div>

      <div className="mb-7 overflow-hidden rounded-lg border border-gray-300">
        <div className="bg-[#1f3b5b] px-5 py-3 text-sm font-bold text-white">
          D. Kebiasaan &amp; Gaya Hidup
        </div>
        <div className="space-y-0 text-sm">
          <div className="px-5 py-2 border-t border-gray-200 bg-gray-50 flex gap-2">
            <span className="w-64 font-semibold text-[#1f3b5b] text-xs">Zat adiktif</span>
            <span className="text-xs">:</span>
            <span className="text-xs text-gray-800">
              {consultationData.usesAddictiveSubstances === "yes" ? "Ya" : "Tidak"}
              {consultationData.usesAddictiveSubstances === "yes" && consultationData.addictiveSubstancesDetail && ` — ${consultationData.addictiveSubstancesDetail}`}
            </span>
          </div>
          <div className="px-5 py-2 border-t border-gray-200 bg-white flex gap-2">
            <span className="w-64 font-semibold text-[#1f3b5b] text-xs">Pola makan</span>
            <span className="text-xs">:</span>
            <span className="text-xs text-gray-800">{getLabelForValue("eatingPattern", consultationData.eatingPattern)}</span>
          </div>
          <div className="px-5 py-2 border-t border-gray-200 bg-gray-50 flex gap-2">
            <span className="w-64 font-semibold text-[#1f3b5b] text-xs">Frekuensi olahraga</span>
            <span className="text-xs">:</span>
            <span className="text-xs text-gray-800">{getLabelForValue("exerciseFrequency", consultationData.exerciseFrequency)}</span>
          </div>
          <div className="px-5 py-2 border-t border-gray-200 bg-white flex gap-2">
            <span className="w-64 font-semibold text-[#1f3b5b] text-xs">Tingkat stres</span>
            <span className="text-xs">:</span>
            <span className="text-xs text-gray-800">{getLabelForValue("stressLevel", consultationData.stressLevel)}</span>
          </div>
        </div>
      </div>

      <div className="mb-7 overflow-hidden rounded-lg border border-gray-300">
        <div className="bg-[#1f3b5b] px-5 py-3 text-sm font-bold text-white">
          E. Tujuan Konsultasi
        </div>
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-xs font-semibold text-[#1f3b5b] mb-2">Tujuan yang ingin dicapai:</p>
          <ul className="space-y-1 text-xs text-gray-800">
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
              <li key={goal} className={`${(consultationData.consultationGoals || []).includes(goal) ? "font-semibold" : "text-gray-400"}`}>
                {(consultationData.consultationGoals || []).includes(goal) ? "[✓]" : "[ ]"} {goal}
              </li>
            ))}
          </ul>
        </div>
        <div className="px-5 py-2 border-t border-gray-200 bg-white flex gap-2">
          <span className="w-64 font-semibold text-[#1f3b5b] text-xs">Preferensi terapi</span>
          <span className="text-xs">:</span>
          <span className="text-xs text-gray-800">{getLabelForValue("therapyPreference", consultationData.therapyPreference)}</span>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-[#f8b4b4] bg-[#fff5f5] px-5 py-4 text-xs leading-relaxed text-[#7f1d1d]">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f97373] text-[11px] font-bold text-white">
            !
          </span>
          <p className="text-sm font-semibold text-[#991b1b]">
            Penting untuk diperhatikan!
          </p>
        </div>
        <ul className="ml-4 list-disc space-y-1.5">
          <li>Seluruh informasi yang disampaikan bersifat rahasia dan dilindungi oleh kode etik profesi.</li>
          <li>Formulir ini merupakan bagian dari proses asesmen awal dan bukan merupakan diagnosis.</li>
          <li>Sangat dianjurkan untuk meminta saran pada profesional psikiater/psikolog untuk pemeriksaan lanjutan jika diperlukan.</li>
        </ul>
      </div>

      <div className="mt-6 flex items-end justify-between border-t border-gray-300 pt-4 text-xs text-gray-600">
        <div>
          <p>Dokumen ini digenerate secara otomatis.</p>
          <p>
            {new Date().toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="text-right">
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
          <p className="text-sm font-medium">{consentData.clientNameConfirmation || clientData.fullName}</p>
          <p className="text-xs text-gray-500">Klien</p>
        </div>
      </div>
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

      {/* 🟢 KOMPONEN PILIHAN HARI, JAM & DAFTAR TANGGAL (4 MINGGU KE DEPAN) */}
      <div className="bg-[#E8F6FF]/60 border border-[#2B5379]/30 p-5 rounded-2xl mb-6 space-y-4">
        
        {/* 1. TAB HARI PRAKTIK */}
        <div>
          <label className="block text-xs font-bold text-[#234463] mb-2 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#2B5379]" />
            Hari Praktik Tersedia:
          </label>
          <div className="flex gap-2">
            {["SENIN", "SABTU"].map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => {
                  setSelectedDay(day);
                  const newDates = getAvailableDatesForDay(day);
                  setSelectedDate(newDates[0]?.isoDate || "");
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedDay === day
                    ? "bg-[#234463] text-white shadow-xs"
                    : "bg-white text-slate-600 border border-gray-200 hover:bg-slate-50"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* 2. TAB JAM / WAKTU */}
        <div>
          <label className="block text-xs font-bold text-[#234463] mb-2 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#2B5379]" />
            Jam Sesi Konsultasi:
          </label>
          <div className="flex gap-2">
            {["16:10"].map((timeStr) => (
              <button
                key={timeStr}
                type="button"
                onClick={() => setSelectedTime(timeStr)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
                  selectedTime === timeStr
                    ? "bg-[#234463] text-white border-[#234463] font-bold shadow-xs"
                    : "bg-white text-slate-700 border-gray-200 hover:border-gray-300"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {timeStr} (60 mnt)
              </button>
            ))}
          </div>
        </div>

        {/* 3. DAFTAR TANGGAL (4 MINGGU MENDATANG) */}
        <div className="pt-3 border-t border-[#2B5379]/20">
          <label className="block text-xs font-bold text-[#234463] mb-2">
            Pilih Tanggal Hari {selectedDay} ({selectedTime} WIB):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {getAvailableDatesForDay(selectedDay).map((item) => {
              const isBooked = bookedDates.includes(item.isoDate);

              return (
                <button
                  key={item.isoDate}
                  type="button"
                  disabled={isBooked}
                  onClick={() => setSelectedDate(item.isoDate)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition cursor-pointer ${
                    isBooked
                      ? "bg-red-50 border-red-200 text-red-400 cursor-not-allowed line-through"
                      : selectedDate === item.isoDate
                      ? "bg-[#234463] text-white border-[#234463] shadow-xs font-bold"
                      : "bg-white text-slate-700 border-gray-300 hover:bg-slate-50"
                  }`}
                >
                  <div>{item.label}</div>
                  <div className="text-[10px] mt-0.5 opacity-80 font-normal">
                    {isBooked ? "Telah Dibooking" : "Tersedia"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Nama Lengkap
          </label>
          <input
            type="text"
            value={clientData.fullName}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Jenis Kelamin</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 cursor-not-allowed flex-1">
              <input
                type="radio"
                name="gender"
                checked={clientData.gender === "male"}
                disabled
                className="w-4 h-4 text-[#2B5379]"
              />
              <span className="text-gray-600">Laki-laki</span>
            </label>
            <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 cursor-not-allowed flex-1">
              <input
                type="radio"
                name="gender"
                checked={clientData.gender === "female"}
                disabled
                className="w-4 h-4 text-[#2B5379]"
              />
              <span className="text-gray-600">Perempuan</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Tanggal Lahir
          </label>
          <input
            type="text"
            value={new Date(clientData.birthDate + 'T00:00:00').toLocaleDateString("id-ID", {
              day: "numeric", month: "long", year: "numeric",
            })}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Usia</label>
          <input
            type="text"
            value={`${clientData.age} tahun`}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Alamat
          </label>
          <textarea
            value={clientData.address}
            disabled
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Nomor Telepon
          </label>
          <input
            type="text"
            value={clientData.phone}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </label>
          <input
            type="text"
            value={clientData.email}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 cursor-not-allowed">
            <input
              type="checkbox"
              checked={clientData.isFirstVisit}
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

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-[#234463] border-b border-gray-100 pb-3">
          B. Alasan Konsultasi
        </h3>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Alasan utama Anda mencari layanan konseling <span className="text-red-500">*</span>
          </label>
          <textarea
            value={consultationData.mainReason || ""}
            onChange={(e) => handleConsultationChange("mainReason", e.target.value)}
            rows={4}
            placeholder="Ceritakan alasan utama Anda ingin berkonsultasi..."
            className={`w-full px-4 py-3 rounded-xl border ${errors.mainReason ? "border-red-500" : "border-gray-200"
              } focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none transition-all resize-none`}
          />
          {errors.mainReason && (
            <p className="text-sm text-red-500 mt-1">{errors.mainReason}</p>
          )}
        </div>

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
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${consultationData.takingPsychiatricMeds === option.value
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
                className={`flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all text-center ${consultationData.problemDuration === option.value
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
                className={`flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all text-center ${consultationData.symptomFrequency === option.value
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
                className={`flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all text-center ${consultationData.dailyImpact === option.value
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

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-[#234463] border-b border-gray-100 pb-3">
          C. Riwayat Psikologis &amp; Kesehatan
        </h3>

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
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${consultationData.hasSimilarHistory === option.value
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
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${consultationData.hasFamilyHistory === option.value
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
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${consultationData.hasMedicalTreatment === option.value
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
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${consultationData.hasTraumaticEvent === option.value
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
                className={`flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all text-center ${consultationData.sleepQuality === option.value
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${consultationData.selfHarmThoughts === option.value
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

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-[#234463] border-b border-gray-100 pb-3">
          D. Kebiasaan &amp; Gaya Hidup
        </h3>

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
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${consultationData.usesAddictiveSubstances === option.value
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
                className={`flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all text-center ${consultationData.eatingPattern === option.value
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
                className={`flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all text-center ${consultationData.exerciseFrequency === option.value
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
                className={`flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all text-center ${consultationData.stressLevel === option.value
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

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-[#234463] border-b border-gray-100 pb-3">
          E. Tujuan Konsultasi
        </h3>

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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${(consultationData.consultationGoals || []).includes(goal)
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
                className={`flex items-start gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${consultationData.therapyPreference === option.value
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
          <h2 className="text-xl font-semibold text-slate-800">Informasi Kebijakan &amp; Persetujuan</h2>
          <p className="text-sm text-slate-500">Baca dan setujui kebijakan layanan kami</p>
        </div>
      </div>

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

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-[#234463] border-b border-gray-100 pb-3">
          G. Pernyataan Persetujuan
        </h3>

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
              setConsentData((prev) => ({ ...prev, clientNameConfirmation: e.target.value }))
            }
            placeholder="Masukkan nama lengkap Anda sebagai konfirmasi"
            className={`w-full px-4 py-3 rounded-xl border ${errors.clientNameConfirmation ? "border-red-500" : "border-gray-200"
              } focus:border-[#2B5379] focus:ring-2 focus:ring-[#2B5379]/20 outline-none transition-all`}
          />
          {errors.clientNameConfirmation && (
            <p className="text-sm text-red-500 mt-1">{errors.clientNameConfirmation}</p>
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${useTextSignature
                ? "bg-[#2B5379] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              <span className="text-sm">Ketik Nama</span>
            </button>
            <button
              type="button"
              onClick={() => setUseTextSignature(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${!useTextSignature
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
              className={`w-full px-4 py-3 rounded-xl border ${errors.signature ? "border-red-500" : "border-gray-200"
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
                className="text-sm text-[#2B5379] hover:underline cursor-pointer"
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
            className={`flex items-start gap-3 px-4 py-4 rounded-xl border cursor-pointer transition-all ${consentData.agreedToTerms
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

        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-3">Simpan formulir untuk arsip Anda:</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={generatePDF}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2B5379] text-[#2B5379] hover:bg-[#E8F6FF] transition-colors text-sm font-medium no-print disabled:opacity-60 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? "Mengunduh..." : "Download PDF"}
            </button>
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
          <p className="text-lg text-[#4B4B4B] animate-fade-in-up">
            Lengkapi formulir berikut untuk membantu psikolog memahami kebutuhan Anda
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-8 no-print">
        <div className="mb-8 animate-fadeIn stagger-2">
          <BookingStepper currentStep={3} />
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 animate-fadeIn stagger-3">
          {renderFormStepIndicator()}

          <div className="flex justify-between mb-8 text-sm">
            <span
              className={`transition-colors ${formStep === 1 ? "text-[#2B5379] font-medium" : "text-gray-400"
                }`}
            >
              Informasi Klien
            </span>
            <span
              className={`transition-colors ${formStep === 2 ? "text-[#2B5379] font-medium" : "text-gray-400"
                }`}
            >
              Formulir Konsultasi
            </span>
            <span
              className={`transition-colors ${formStep === 3 ? "text-[#2B5379] font-medium" : "text-gray-400"
                }`}
            >
              Persetujuan
            </span>
          </div>

          {formStep === 1 && renderStep1()}
          {formStep === 2 && renderStep2()}
          {formStep === 3 && renderStep3()}

          <div className="flex justify-between items-center pt-8 mt-8 border-t border-[#D6E6F2] no-print">
            <button
              onClick={formStep === 1 ? () => router.back() : handlePrevFormStep}
              className="flex items-center gap-2 px-6 py-3 text-[#2B5379] font-medium hover:bg-[#E8F6FF] rounded-xl transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
              Kembali
            </button>
            <button
              onClick={handleNextFormStep}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold bg-[#2B5379] text-white hover:bg-[#234463] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? "Memproses..." : formStep === 3 ? "Lanjutkan ke Pembayaran" : "Lanjut"}
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
        <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#2B5379] border-t-transparent rounded-full" />
        </div>
      }
    >
      <ConsultationFormContent />
    </Suspense>
  );
}