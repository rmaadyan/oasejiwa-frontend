'use client'
import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import FormField from "@/components/common/formField";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/features/user/authLayout";

const PASSWORD_RULES = [
    { label: "Minimal 8 karakter",              test: (p: string) => p.length >= 8 },
    { label: "Maksimal 64 karakter",            test: (p: string) => p.length <= 64 },
    { label: "Mengandung huruf kapital (A-Z)",  test: (p: string) => /[A-Z]/.test(p) },
    { label: "Mengandung huruf kecil (a-z)",    test: (p: string) => /[a-z]/.test(p) },
    { label: "Mengandung angka (0-9)",          test: (p: string) => /[0-9]/.test(p) },
    { label: "Mengandung karakter khusus (!@#$%^&*)",  test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

const POPULAR_DOMAINS = [
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
    "mail.com", "protonmail.com", "icloud.com", "aol.com",

    "zoho.com", "fastmail.com", "mailbox.org", "tutanota.com",
    "yandex.com", "rediff.com", "gmx.com",

    "yahoo.co.id", "yahoo.co.uk", "yahoo.co.jp",
    "outlook.co.id",
];

function validateEmail(email: string): string {
    if (!email.trim()) return "Email tidak boleh kosong";
    if (/\s/.test(email)) return "Email tidak boleh mengandung spasi";
    const atCount = (email.match(/@/g) || []).length;
    if (atCount === 0) return "Email harus mengandung '@'";
    if (atCount > 1)  return "Email hanya boleh mengandung satu '@'";

    const [local, domain] = email.split("@");
    if (!local)                          return "Bagian sebelum '@' tidak boleh kosong";
    if (local.length > 64)               return "Bagian sebelum '@' maksimal 64 karakter";
    if (local.startsWith("."))           return "Bagian sebelum '@' tidak boleh dimulai dengan titik";
    if (local.endsWith("."))             return "Bagian sebelum '@' tidak boleh diakhiri dengan titik";
    if (/\.\./.test(local))              return "Bagian sebelum '@' tidak boleh mengandung dua titik berurutan";
    if (!/^[a-zA-Z0-9._%+\-]+$/.test(local)) return "Bagian sebelum '@' mengandung karakter yang tidak diizinkan";

    if (!domain)                         return "Bagian domain tidak boleh kosong";
    if (!domain.includes("."))           return "Domain harus mengandung minimal satu titik (misal: gmail.com)";
    if (domain.startsWith("."))          return "Domain tidak boleh dimulai dengan titik";
    if (domain.endsWith("."))            return "Domain tidak boleh diakhiri dengan titik";
    if (/\.\./.test(domain))             return "Domain tidak boleh mengandung dua titik berurutan";

    const domainParts = domain.split(".");
    for (const part of domainParts) {
        if (!part)                                          return "Domain tidak boleh mengandung bagian kosong";
        if (!/^[a-zA-Z0-9\-]+$/.test(part))                return "Domain hanya boleh mengandung huruf, angka, dan tanda hubung (-)";
        if (part.startsWith("-") || part.endsWith("-"))     return "Setiap bagian domain tidak boleh dimulai atau diakhiri dengan tanda hubung (-)";
    }

    const ALLOWED_TLDS = [
    "com", "org", "net", "edu", "gov", "mil",
    "co", "io", "id", "us", "uk", "au", "ca", "de", "fr", "jp", "sg",
    "info", "biz", "me", "tv", "dev", "app", "cloud",
    "web", "store", "online", "site", "tech", "xyz",
    ];

    const tld = domainParts[domainParts.length - 1].toLowerCase();
    if (!ALLOWED_TLDS.includes(tld)) return `TLD "${tld}" tidak dikenali. Gunakan TLD yang valid (misal: com, org, id)`;

    const fullDomain = domain.toLowerCase();
    if (!POPULAR_DOMAINS.includes(fullDomain)) {
        return `Domain "${fullDomain}" tidak dikenali. Gunakan email dari provider resmi (misal: gmail.com, yahoo.com)`;
    }

    return ""; 
}

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const [emailError, setEmailError]     = useState("");
    const [passwordError, setPasswordError] = useState("");

    const passwordRuleStatus = PASSWORD_RULES.map((rule) => ({
        ...rule,
        passed: rule.test(password),
    }));

    const allPasswordRulesPassed = passwordRuleStatus.every((r) => r.passed);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setEmailError("");
        setPasswordError("");
        setIsLoading(true);

        const emailErr = validateEmail(email);
        if (emailErr) {
            setEmailError(emailErr);
            setIsLoading(false);
            return;
        }

        if (!password) {
            setPasswordError("Password tidak boleh kosong");
            setIsLoading(false);
            return;
        }
        if (!allPasswordRulesPassed) {
            setPasswordError("Password tidak memenuhi semua ketentuan di atas");
            setIsLoading(false);
            return;
        }

        setTimeout(() => {
            router.push("/userprofile");
            setIsLoading(false);
        }, 100);
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
                            passwordRules={password.length > 0 ? passwordRuleStatus : undefined}  
                        />

                            {error && (
                                <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="w-full max-w-xl flex flex-col justify-center gap-6">
                                <Link href="/auth/resetpassword" className="text-center text-blue-950 font-bold text-sm hover:text-blue-900 cursor-pointer">
                                Forgot Password?
                                </Link>
                                <button className="font-bold text-white bg-blue-900 w-full py-2 border rounded-2xl hover:bg-blue-800 hover:shadow cursor-pointer">Sign in</button>
                            </div>
                            
                            <div className="text-center">
                                <span className="text-gray-600 pr-2">Belum punya akun?</span>
                                <Link href="/auth/signup" className="text-blue-950 font-bold hover:text-blue-900">Daftar Sekarang</Link>
                            </div>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center mb-6">
                                <span className="font-light text-center text-blue-950 bg-white">Or login with</span>
                            </div>
                        </div>
                    </div>
                    
                    
                    <div className="flex justify-center">
                        <button className="flex justify-center gap-2 mb-10 py-2 md:py-3 px-8 md:px-12 border border-blue-950 rounded-4xl bg-blue-50 text-md font-bold text-blue-950 hover:shadow-md hover:border-blue-900 cursor-pointer">
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Google
                        </button>
                    </div>
            </AuthLayout>
        </div>
    )
}