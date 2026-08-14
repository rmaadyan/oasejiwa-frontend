'use client'
import { useState, useEffect } from "react";
import { Mail, X, RefreshCw, Edit3, CheckCircle2, AlertCircle } from "lucide-react";
import { resendVerification, changeVerificationEmail } from "@/lib/api/auth";

interface VerifyEmailModalProps {
    email: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function VerifyEmailModal({
    email,
    isOpen,
    onClose,
}: VerifyEmailModalProps) {
    const [currentEmail, setCurrentEmail] = useState(email);
    const [isEditing, setIsEditing] = useState(false);
    const [newEmailInput, setNewEmailInput] = useState("");
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

    const [resendStatus, setResendStatus] = useState<
        "idle" | "loading" | "sent" | "error" | "verified"
    >("idle");

    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        setCurrentEmail(email);
        setNewEmailInput(email);
        setIsEditing(false);
        setEditError(null);
    }, [email, isOpen]);

    if (!isOpen) return null;

    const handleResend = async () => {
        if (countdown > 0) return;

        setResendStatus("loading");

        try {
            const data = await resendVerification(currentEmail);

            if (data.message.toLowerCase().includes("sudah terverifikasi")) {
                setResendStatus("verified");
                return; 
            }

            setResendStatus("sent");

            setCountdown(60);
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setResendStatus("idle");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } catch (err: any) {
            setResendStatus("error");
        }
    };

    const handleSaveNewEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditError(null);

        if (!newEmailInput || newEmailInput.trim() === currentEmail) {
            setIsEditing(false);
            return;
        }

        setEditLoading(true);
        try {
            await changeVerificationEmail(currentEmail, newEmailInput.trim());
            setCurrentEmail(newEmailInput.trim());
            setIsEditing(false);
            setResendStatus("sent");
            setCountdown(60);
        } catch (err: any) {
            setEditError(err.message || "Gagal mengubah email verifikasi");
        } finally {
            setEditLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                <div className="flex justify-center mb-5">
                    <div className="bg-blue-50 p-4 rounded-full">
                        <Mail size={36} className="text-[#234463]" />
                    </div>
                </div>

                <h2 className="text-xl font-bold text-blue-950 text-center mb-2">
                    Verifikasi Email Kamu
                </h2>

                {!isEditing ? (
                    <>
                        <p className="text-sm text-gray-500 text-center mb-1">
                            Kami sudah mengirimkan link verifikasi ke:
                        </p>

                        <p className="text-sm font-semibold text-blue-900 text-center mb-4 break-all">
                            {currentEmail}
                        </p>

                        <p className="text-xs text-gray-400 text-center mb-6">
                            Buka email kamu dan klik link verifikasi untuk mengaktifkan akun. Cek folder spam jika tidak muncul.
                        </p>

                        {resendStatus === "sent" && (
                            <p className="text-xs text-green-600 text-center mb-3 flex items-center justify-center gap-1">
                                <CheckCircle2 size={14} />
                                Email verifikasi berhasil dikirim ulang!
                            </p>
                        )}

                        {resendStatus === "error" && (
                            <p className="text-xs text-red-500 text-center mb-3">
                                Gagal mengirim ulang, coba lagi.
                            </p>
                        )}

                        {resendStatus === "verified" && (
                            <p className="text-xs text-blue-600 text-center mb-3">
                                Email sudah terverifikasi, tidak perlu kirim ulang
                            </p>
                        )}

                        <div className="space-y-3">
                            <button
                                onClick={handleResend}
                                disabled={
                                    resendStatus === "loading" ||
                                    countdown > 0 ||
                                    resendStatus === "verified"
                                }
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#234463] text-white rounded-xl text-sm font-semibold hover:bg-[#1c3650] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <RefreshCw
                                    size={15}
                                    className={resendStatus === "loading" ? "animate-spin" : ""}
                                />

                                {resendStatus === "verified"
                                    ? "Email sudah diverifikasi"
                                    : countdown > 0
                                    ? `Kirim ulang dalam ${countdown}s`
                                    : resendStatus === "loading"
                                    ? "Mengirim..."
                                    : "Kirim Ulang Email"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setNewEmailInput(currentEmail);
                                    setIsEditing(true);
                                }}
                                className="w-full py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <Edit3 size={14} />
                                <span>Email Salah? Ubah Alamat Email</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleSaveNewEmail} className="space-y-4 pt-2">
                        <p className="text-xs text-slate-600 text-center">
                            Masukkan alamat email yang benar untuk menerima ulang email verifikasi:
                        </p>

                        {editError && (
                            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                                <AlertCircle size={15} className="shrink-0" />
                                <span>{editError}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Email Baru
                            </label>
                            <input
                                type="email"
                                required
                                value={newEmailInput}
                                onChange={(e) => setNewEmailInput(e.target.value)}
                                placeholder="Masukkan email baru..."
                                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={editLoading}
                                className="px-5 py-2 bg-[#234463] text-white text-xs font-semibold rounded-xl hover:bg-[#1c3650] shadow-xs cursor-pointer flex items-center gap-1.5"
                            >
                                {editLoading && <RefreshCw size={12} className="animate-spin" />}
                                <span>{editLoading ? "Menyimpan..." : "Simpan & Kirim Ulang"}</span>
                            </button>
                        </div>
                    </form>
                )}

                <p className="text-xs text-gray-400 text-center mt-4">
                    Sudah verifikasi?{" "}
                    <a
                        href="/auth/signin"
                        className="text-[#234463] font-medium hover:underline"
                    >
                        Login sekarang
                    </a>
                </p>

            </div>
        </div>
    );
}