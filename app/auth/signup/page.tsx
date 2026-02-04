'use client'

import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Calendar } from "lucide-react";
import React, {use, useState} from "react";
import AuthLayout from "@/components/features/user/authLayout";
import FormField from "@/components/common/formField";
import GenderSelect from "@/components/features/user/genderSelect";
import {useRouter} from "next/navigation";
import CustomCalendar from "@/components/common/calendar";

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

    const tld = domainParts[domainParts.length - 1];
    if (!/^[a-zA-Z]{2,}$/.test(tld))    return "TLD (misal: com, org) harus berisi huruf dan minimal 2 karakter";

    const fullDomain = domain.toLowerCase();
    if (!POPULAR_DOMAINS.includes(fullDomain)) {
        return `Domain "${fullDomain}" tidak dikenali. Gunakan email dari provider resmi (misal: gmail.com, yahoo.com)`;
    }

    return ""; 
}

export default function SignUp(){
    const [name, setName] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [date, setDate] = useState("");
    const [gender, setGender] = useState<"male" | "female">("male");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [nameError, setNameError] = useState("");
    const [telephoneError, setTelephoneError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [dateError, setDateError] = useState("");
    const [addressError, setAddressError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const router = useRouter();

    const passwordRuleStatus = PASSWORD_RULES.map((rule) => ({
        ...rule,
        passed: rule.test(password),
    }));

    const allPasswordRulesPassed = passwordRuleStatus.every((r) => r.passed);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setNameError("");
        setTelephoneError("");
        setEmailError("");
        setDateError("");
        setAddressError("");
        setPasswordError("");

        let hasError = false;

        if (!name.trim()) {
            setNameError("Nama lengkap harus diisi");
            hasError = true;
        }

        if (!telephone.trim()) {
            setTelephoneError("Nomor WhatsApp harus diisi");
            hasError = true;
        } else if (!/^\+?[0-9]{10,15}$/.test(telephone.replace(/\s/g, ''))) {
            setTelephoneError("Format nomor tidak valid (10-15 digit)");
            hasError = true;
        }

        const emailErr = validateEmail(email);
        if (emailErr) {
            setEmailError(emailErr);
            hasError = true;
        }

        if (!date) {
            setDateError("Tanggal lahir harus dipilih");
            hasError = true;
        }

        if (!address.trim()) {
            setAddressError("Alamat harus diisi");
            hasError = true;
        }

        if (!password) {
            setPasswordError("Password tidak boleh kosong");
            hasError = true;
        } else if (!allPasswordRulesPassed) {
            setPasswordError("Password tidak memenuhi semua ketentuan di atas");
            hasError = true;
        }

        if (hasError) return;

        setTimeout(() => {
            router.push('/profile')
        }, 500);
    };

    return(
        <div>
            <AuthLayout
            title="Welcome!"
            description="Create new account"
            >
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <FormField
                        label="Full Name"
                        id="name"
                        name="name"
                        type="text"  
                        value={name}
                        placeholder="Your full name"
                        onChange={setName}
                        error={nameError}
                        onClearError={() => setNameError("")}
                        ></FormField>

                        <div className="flex w-full flex-col gap-6">
                            <div>
                                <label className="block text-sm font-bold text-blue-950 mb-2">
                                    Birthday
                                </label>
                                <CustomCalendar
                                value={date}
                                onChange={(newDate) => setDate(newDate)}
                                placeholder="Pilih tanggal lahir"
                                className="text-gray-700"
                                />
                            </div>

                            <GenderSelect
                            value={gender}
                            onChange={setGender}
                            ></GenderSelect>
                        </div>

                        <FormField
                        label="Address"
                        id="address"
                        name="address"
                        type="textarea"
                        value={address}
                        placeholder="your address"
                        onChange={setAddress}
                        error={addressError}
                        onClearError={() => setAddressError("")}
                        ></FormField>

                        <FormField
                        label="WhatsApp"
                        id="whatsapp"
                        name="number"
                        type="tel"
                        value={telephone}
                        placeholder="+62"
                        onChange={setTelephone}
                        error={telephoneError}
                        onClearError={() => setTelephoneError("")}
                        ></FormField>

                        <FormField
                        label="Email"
                        id="email"
                        name="email"
                        type="text"  
                        autoComplete="email"
                        value={email}
                        placeholder="your@gmail.com"
                        onChange={setEmail}
                        error={emailError}
                        onClearError={() => setEmailError("")}
                        ></FormField>

                        <FormField
                        label="Password"
                        id="password"
                        name="password"
                        type="password"  
                        autoComplete="new-password"  
                        value={password}
                        placeholder="••••••••"
                        onChange={setPassword}
                        isPassword={true}
                        enableToggle={true}
                        error={passwordError}
                        onClearError={() => setPasswordError("")}
                        passwordRules={password.length > 0 ? passwordRuleStatus : undefined}
                    />

                        <div className="w-full max-w-xl flex flex-col justify-center mt-8">
                            <button type="submit" className="font-bold text-white bg-blue-900 w-full py-2 border border-blue-900 rounded-2xl hover:bg-blue-800 hover:shadow cursor-pointer">Save</button>
                        </div>
                    </div>
                </form>
            </AuthLayout>
        </div>
    );
} 