"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  PenTool,
  Upload,
  RotateCcw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileImage,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { updatePsychologistProfile, uploadImage, getPsychologistProfile } from "@/lib/api/psychologist";
import type { Psychologist } from "@/lib/types/psychologist";

interface Props {
  psychologist: Psychologist;
  onUpdate: () => void;
}

export default function DigitalSignatureSection({ psychologist, onUpdate }: Props) {
  const [inputMethod, setInputMethod] = useState<"UPLOAD" | "DRAW">(
    (psychologist.signatureMethod as "UPLOAD" | "DRAW") || "UPLOAD"
  );

  // Active Signature & Timestamp Local State (Instant Sync)
  const [activeSignatureUrl, setActiveSignatureUrl] = useState<string | null>(
    psychologist?.signatureUrl || null
  );
  const [activeSignatureDate, setActiveSignatureDate] = useState<string | null>(
    psychologist?.signatureUpdatedAt || null
  );

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Canvas State & References for Interactive Draw Method
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStrokes, setHasStrokes] = useState(false);
  const strokeHistoryRef = useRef<ImageData[]>([]);

  // Sync Local State whenever Parent Psychologist Prop Updates
  useEffect(() => {
    if (psychologist?.signatureUrl) {
      setActiveSignatureUrl(psychologist.signatureUrl);
    }
    if (psychologist?.signatureUpdatedAt) {
      setActiveSignatureDate(psychologist.signatureUpdatedAt);
    }
  }, [psychologist?.signatureUrl, psychologist?.signatureUpdatedAt]);

  // Format Date Output for Last Signature Update
  const formattedDate = activeSignatureDate
    ? new Date(activeSignatureDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Belum pernah diperbarui";

  // Canvas Drawing Handlers (Mouse & Touch Events)
  useEffect(() => {
    if (inputMethod !== "DRAW" || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth || 500;
    canvas.height = 180;

    // Default canvas style (Smooth Line Cap & Dark Blue Stroke)
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1F415F"; // Professional dark blue stroke matching Profile Page
    ctx.lineWidth = 3;

    // Save initial blank state for undo
    strokeHistoryRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
  }, [inputMethod]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasStrokes(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Save current canvas state to stroke history
    strokeHistoryRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokeHistoryRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
    setHasStrokes(false);
  };

  const undoCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (strokeHistoryRef.current.length > 1) {
      strokeHistoryRef.current.pop();
      const lastState = strokeHistoryRef.current[strokeHistoryRef.current.length - 1];
      ctx.putImageData(lastState, 0, 0);
      setHasStrokes(strokeHistoryRef.current.length > 1);
    }
  };

  // Upload File Selection Handler with Validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation 1: Image type check
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Format file tidak valid. Harap pilih gambar PNG, JPG, atau JPEG." });
      return;
    }

    // Validation 2: File size <= 2MB
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: "error", text: "Ukuran file terlalu besar. Maksimal 2 MB." });
      return;
    }

    setUploadFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Save Signature Handler (Strict Validation & Instant Live Update)
  const handleSaveSignature = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setMessage(null);
    setSaving(true);

    try {
      let finalSignatureUrl = "";

      if (inputMethod === "UPLOAD") {
        if (!uploadFile && !uploadPreview) {
          setMessage({ type: "error", text: "Harap pilih file gambar tanda tangan terlebih dahulu." });
          setSaving(false);
          return;
        }

        if (uploadFile) {
          finalSignatureUrl = await uploadImage(uploadFile);
        } else if (uploadPreview) {
          finalSignatureUrl = uploadPreview;
        }
      } else {
        // DRAW METHOD (Canvas)
        if (!hasStrokes || !canvasRef.current) {
          setMessage({ type: "error", text: "Harap buat goresan tanda tangan pada kanvas sebelum menyimpan." });
          setSaving(false);
          return;
        }

        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL("image/png");

        // Convert Data URL to PNG Blob for multipart upload
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `signature_${psychologist.id || "psikolog"}_${Date.now()}.png`, { type: "image/png" });

        finalSignatureUrl = await uploadImage(file);
      }

      if (!finalSignatureUrl) {
        throw new Error("Gagal mendapatkan URL gambar tanda tangan setelah proses upload.");
      }

      // Update Psychologist Profile in Database via Backend API
      const updatedProfile = await updatePsychologistProfile({
        signatureUrl: finalSignatureUrl,
        signatureMethod: inputMethod,
      } as any);

      // INSTANT LIVE PREVIEW UPDATE
      const nowIso = new Date().toISOString();
      const newUrl = updatedProfile?.signatureUrl || finalSignatureUrl;
      const newDate = updatedProfile?.signatureUpdatedAt || nowIso;

      setActiveSignatureUrl(newUrl);
      setActiveSignatureDate(newDate);

      // SUCCESS: Clear transient inputs and display explicit success message ONLY on verified success
      setMessage({ type: "success", text: "Tanda tangan digital berhasil disimpan!" });
      setUploadFile(null);
      setUploadPreview(null);
      clearCanvas();

      // Trigger parent profile refetch
      onUpdate();
    } catch (err: any) {
      console.error("Gagal menyimpan tanda tangan:", err);
      setMessage({ type: "error", text: err.message || "Terjadi kesalahan saat menyimpan tanda tangan digital." });
    } finally {
      setSaving(false);
    }
  };

  // Delete / Clear Signature Handler
  const handleDeleteSignature = async () => {
    setDeleting(true);
    setMessage(null);

    try {
      await updatePsychologistProfile({
        clearSignature: true,
      } as any);

      setActiveSignatureUrl(null);
      setActiveSignatureDate(null);

      setMessage({ type: "success", text: "Tanda tangan digital berhasil dihapus." });
      setShowDeleteModal(false);
      onUpdate();
    } catch (err: any) {
      console.error("Gagal menghapus tanda tangan:", err);
      setMessage({ type: "error", text: err.message || "Gagal menghapus tanda tangan digital." });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-sm p-6 space-y-6 font-poppins text-xs">
      {/* Header Section (Matching Profile Page Theme) */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-[#1F415F] rounded-xl border border-blue-200">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1F415F]">TANDA TANGAN DIGITAL</h2>
            <p className="text-slate-500 text-[11px]">
              Tanda tangan resmi yang dipasangkan secara otomatis pada dokumen Rekam Medis PDF.
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Dokumen Legal Safe
        </span>
      </div>

      {/* Alert Message */}
      {message && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* ACTIVE SIGNATURE PREVIEW CARD */}
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span className="font-bold text-[#1F415F] text-xs uppercase tracking-wide">Tanda Tangan Aktif</span>
          <span className="text-[11px] text-slate-500 font-medium">
            Terakhir diperbarui: <strong className="text-slate-700">{formattedDate}</strong>
          </span>
        </div>

        <div className="flex items-center justify-center p-4 bg-white border border-dashed border-slate-300 rounded-xl min-h-[110px] shadow-xs">
          {activeSignatureUrl ? (
            <img
              src={activeSignatureUrl}
              alt="Tanda Tangan Digital Aktif"
              className="max-h-24 max-w-xs object-contain"
            />
          ) : (
            <div className="text-center text-slate-400 font-serif italic text-xs">
              ( Belum ada tanda tangan digital tersimpan )
            </div>
          )}
        </div>

        {activeSignatureUrl && (
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl text-[11px] font-semibold transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Hapus Tanda Tangan
            </button>
          </div>
        )}
      </div>

      {/* INPUT METHOD SELECTION (UPLOAD vs DRAW) */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 text-xs">
            <input
              type="radio"
              name="signatureMethod"
              checked={inputMethod === "UPLOAD"}
              onChange={() => {
                setInputMethod("UPLOAD");
                setMessage(null);
              }}
              className="w-4 h-4 text-[#1F415F] focus:ring-[#1F415F]"
            />
            <span className="flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-blue-600" /> Upload Gambar (PNG/JPG)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 text-xs">
            <input
              type="radio"
              name="signatureMethod"
              checked={inputMethod === "DRAW"}
              onChange={() => {
                setInputMethod("DRAW");
                setMessage(null);
              }}
              className="w-4 h-4 text-[#1F415F] focus:ring-[#1F415F]"
            />
            <span className="flex items-center gap-1.5">
              <PenTool className="w-4 h-4 text-blue-600" /> Gambar Langsung (Kanvas)
            </span>
          </label>
        </div>

        {/* METHOD 1: UPLOAD GAMBAR */}
        {inputMethod === "UPLOAD" && (
          <div className="p-5 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl bg-slate-50/50 transition flex flex-col items-center justify-center gap-3">
            <div className="p-3 bg-blue-100/60 text-[#1F415F] rounded-full">
              <FileImage className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-800 text-xs">Pilih File Tanda Tangan Digital</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Format PNG, JPG, JPEG (Maksimal 2 MB). Disarankan PNG background transparan.
              </p>
            </div>

            <label className="px-5 py-2 bg-[#1F415F] hover:bg-[#163047] text-white font-bold rounded-xl shadow-xs transition cursor-pointer">
              <span>Choose File</span>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {uploadPreview && (
              <div className="mt-3 w-full max-w-sm p-3 bg-white border border-slate-300 rounded-xl flex flex-col items-center gap-2">
                <span className="text-[10.5px] font-semibold text-slate-500">Pratinjau File Pilihan:</span>
                <img src={uploadPreview} alt="Upload Preview" className="max-h-24 object-contain" />
              </div>
            )}
          </div>
        )}

        {/* METHOD 2: GAMBAR LANGSUNG (KANVAS) */}
        {inputMethod === "DRAW" && (
          <div className="p-4 border border-slate-300 bg-slate-50/50 rounded-2xl space-y-3">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-slate-700">Gambar Tanda Tangan di Bawah Ini:</span>
              <span className="text-slate-500 italic">Gunakan mouse atau layar sentuh</span>
            </div>

            <div className="relative border-2 border-slate-300 rounded-xl bg-white overflow-hidden shadow-inner flex justify-center">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-44 cursor-crosshair touch-none"
              />
              {!hasStrokes && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 italic text-xs font-serif">
                  ( Goreskan Tanda Tangan Anda di Sini )
                </div>
              )}
            </div>

            {/* Canvas Actions */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
                <button
                  type="button"
                  onClick={undoCanvas}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Undo
                </button>
              </div>

              <span className="text-[11px] text-slate-500 italic font-medium">
                {hasStrokes ? "✓ Goresan terdeteksi" : "Goreskan kanvas untuk mengaktifkan simpan"}
              </span>
            </div>
          </div>
        )}

        {/* SAVE SUBMIT BUTTON */}
        <div className="flex justify-end pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={handleSaveSignature}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1F415F] hover:bg-[#163047] text-white font-bold rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Simpan Tanda Tangan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* CONFIRMATION DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs font-poppins">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">Hapus Tanda Tangan Digital?</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Tanda tangan digital Anda akan dihapus. PDF Rekam Medis selanjutnya akan kembali menampilkan placeholder hingga Anda menambahkan tanda tangan baru.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteSignature}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
