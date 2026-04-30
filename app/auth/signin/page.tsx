'use client'
import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import FormField from "@/components/common/formField";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/features/user/authLayout";
import { useAuthValidation } from "@/hooks/use-auth-validation";
import { loginUser } from "@/lib/api/auth";
import { googleLogin } from "@/lib/api/auth";
import { validateLogin } from "@/hooks/use-auth-validation";
import VerifyEmailModal from "@/components/common/VerifyEmailModal";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState("");

    const {
        emailError,
        passwordError,
        setEmailError,
        setPasswordError,
    } = useAuthValidation();

    const handleGoogleLogin = () => {
        const existingUser = localStorage.getItem("user");
        if (existingUser) {
            setError("Kamu sudah login. Silakan logout terlebih dahulu untuk login dengan Google.");
            return;
        }
        googleLogin();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const validationError = validateLogin(email, password);

        if (validationError) {
            setError(validationError);
            setIsLoading(false);
            return;
        }

        try {
            const data = await loginUser({ email, password });

            console.log("Response:", data);

            const token = data.accessToken ?? data.token ?? data.data?.accessToken;
            const user = data.user ?? data.data?.user;
            const role = user?.role;

            if (!token) {
                setError("Token tidak ditemukan, cek response backend");
                return;
            }

            if (!user || !role) {
                setError("Data user tidak ditemukan, cek response backend");
                return;
            }
            localStorage.setItem("user", JSON.stringify(user));

            console.log("Role:", role);

            if (role === "PSYCHOLOGIST" && user.isFirstLogin) {
                router.push("/auth/change-password-psychologist");
            } else if (role === "PSYCHOLOGIST") {
                router.push("/psychologist/dashboard");
            } else if (role === "ADMIN") {
                router.push("/admin");
            } else {
                router.push("/userprofile");
            }
        } catch (err: any) {
            if (err.message?.includes("EMAIL_NOT_VERIFIED")) {
                setRegisteredEmail(email);
                setShowVerifyModal(true);
            } else {
                setError(err.message || "Login gagal");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <AuthLayout
            title="Welcome"
            description="Sign In to Your Account"
            >
                <form onSubmit={handleSubmit} noValidate>
                        <div className="space-y-8 flex flex-col items-center">
                            <FormField
                                label="Email"
                                id="email"
                                name="email"
                                type="text"
                                autoComplete="email"
                                value={email}
                                placeholder="your@gmail.com"
                                onChange={setEmail}
                                icon={<Mail className="h-5 w-5"></Mail>}
                                error={emailError}                         
                                onClearError={() => setEmailError("")} 
                            />

                            <FormField
                            label="Password"
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            placeholder="••••••••"
                            onChange={setPassword}
                            icon={<Lock className="h-5 w-5" />}
                            isPassword={true}
                            enableToggle={true}
                            error={passwordError}
                            onClearError={() => setPasswordError("")}
                        />

                            {error && (
                                <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                        <div className="w-full max-w-xl flex flex-col justify-center gap-6">
                            <Link href="/auth/email-input" className="text-center text-[#234463] font-bold text-sm hover:text-[#2B5379] cursor-pointer">
                                Forgot Password?
                            </Link>
                            <button 
                            suppressHydrationWarning
                            className="font-bold text-white bg-[#234463] w-full py-2 border rounded-2xl hover:[#2B5379] hover:shadow cursor-pointer">Sign in</button>
                        </div>

                        <div className="text-center">
                            <span className="text-gray-600 pr-2">Belum punya akun?</span>
                            <Link href="/auth/signup" className="text-[#234463] font-bold hover:[#2B5379]">Daftar Sekarang</Link>
                        </div>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center mb-6">
                            <span className="font-light text-center text-[#234463] bg-white">Or login with</span>
                        </div>
                    </div>
                </div>


                <div className="flex justify-center">
                    <button className="flex justify-center gap-2 mb-10 py-2 md:py-3 px-8 md:px-12 border border-[#234463] rounded-4xl bg-blue-50 text-md font-bold text-[#234463] hover:shadow-md hover:border-blue-900 cursor-pointer"
                    suppressHydrationWarning
                    type="button"
                    onClick={handleGoogleLogin}
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                </div>
            </AuthLayout>
            <VerifyEmailModal
            email={registeredEmail}
            isOpen={showVerifyModal}
            onClose={() => setShowVerifyModal(false)}
            />
        </div>
    )
}