'use client'
import { useState } from "react";
import { Mail, X, RefreshCw } from "lucide-react";
import { resendVerification } from "@/lib/api/auth";

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

    const [resendStatus, setResendStatus] = useState<
        "idle" | "loading" | "sent" | "error" | "verified"
    >("idle");

    const [countdown, setCountdown] = useState(0);

    if (!isOpen) return null;

    const handleResend = async () => {
        if (countdown > 0) return;

        setResendStatus("loading");

        try {
            const data = await resendVerification(email);

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

                <p className="text-sm text-gray-500 text-center mb-1">
                    Kami sudah mengirimkan link verifikasi ke:
                </p>

                <p className="text-sm font-semibold text-blue-900 text-center mb-6 break-all">
                    {email}
                </p>

                <p className="text-xs text-gray-400 text-center mb-6">
                    Buka email kamu dan klik link verifikasi untuk mengaktifkan akun. Cek folder spam jika tidak muncul.
                </p>

                {resendStatus === "sent" && (
                    <p className="text-xs text-green-600 text-center mb-3">
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

                <button
                    onClick={handleResend}
                    disabled={
                        resendStatus === "loading" ||
                        countdown > 0 ||
                        resendStatus === "verified"
                    }
                    className="w-full flex items-center justify-center gap-2 py-2 border border-[#234463] text-[#234463] rounded-xl text-sm font-medium hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
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