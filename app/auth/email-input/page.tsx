'use client'
import React, { useState } from "react";
import { Mail } from "lucide-react";
import AuthLayout from "@/components/features/user/authLayout";
import FormField from "@/components/common/formField";
import ResetPassModal from "@/components/features/user/resetPassModal";
import { validateEmail } from "@/lib/email"; 
import { emailInput } from "@/lib/api/auth"; 

export default function EmailInput() {
    const [email, setEmail] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [isGoogleUser, setIsGoogleUser] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            setIsLoading(false);
            return;
        }

        try {
            const res = await emailInput(email);
            setResponseMessage(res.message);
            if (res.message.toLowerCase().includes("google")) {
                setIsGoogleUser(true);
            } else {
                setIsGoogleUser(false);
            }
            setShowModal(true);
        } catch (err: any) {
            setError(err.message || "Gagal mengirim email");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <AuthLayout
                title="Reset Password"
                description="Masukkan email untuk mengatur ulang password"
                titleSize="sm"
            >
                <form onSubmit={handleSubmit}>
                    <FormField
                        label="Email"
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        placeholder="your@gmail.com"
                        onChange={(val) => {
                            setEmail(val);
                            setError("");
                        }}
                        icon={<Mail className="h-5 w-5" />}
                        error={error}
                    />

                    <div className="w-full max-w-xl flex flex-col justify-center mt-8">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="font-bold text-white bg-[#234463] w-full py-2 border border-[#234463] rounded-2xl hover:bg-[#2B5379] hover:shadow cursor-pointer"
                        >
                            {isLoading ? "Sending..." : "Send"}
                        </button>
                    </div>
                </form>
            </AuthLayout>

            <ResetPassModal
                open={showModal}
                title={
                    isGoogleUser
                        ? "Akun Google terdeteksi"
                        : "Berhasil terkirim"
                }
                message={responseMessage}
                onClose={() => setShowModal(false)}
            />
        </div>
    );
}