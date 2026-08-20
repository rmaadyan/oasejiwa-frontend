'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/features/user/authLayout";
import FormField from "@/components/common/formField";
import { changePasswordPsychologist } from "@/lib/api/auth";
import { useAuthValidation } from "@/hooks/use-auth-validation";

export default function ChangePasswordPsychologist() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const { passwordError, setPasswordError, validatePasswordOnly, getPasswordRuleStatus } = useAuthValidation();
    const passwordRules = getPasswordRuleStatus(newPassword);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setPasswordError("");

        if (!oldPassword || !newPassword) {
            setError("Semua field harus diisi");
            return;
        }
        const isValid = validatePasswordOnly(newPassword);
        if (!isValid) {
            return;
        }

        try {
            await changePasswordPsychologist({
                oldPassword,
                newPassword,
            });

            setMessage("Password berhasil diubah");

            // Update localStorage agar isFirstLogin = false
            try {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    userData.isFirstLogin = false;
                    localStorage.setItem("user", JSON.stringify(userData));
                }
            } catch {}

            setTimeout(() => {
                router.push("/psychologist/profile");
            }, 2000);

        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan");
        }
    };

    return (
        <AuthLayout
            title="Ganti Password"
            description="Silakan ubah password Anda"
            titleSize="sm"
        >
            <form onSubmit={handleSubmit}>

                {error && !passwordError && (
                    <p className="text-red-600 text-sm text-center mb-3">
                        {error}
                    </p>
                )}

                <div className="w-full max-w-xl">
                    <FormField
                    label="Password Lama"
                    id="oldPassword"
                    name="oldPassword"
                    type="password"
                    value={oldPassword}
                    placeholder="••••••••"
                    onChange={(val) => {
                        setOldPassword(val);
                        setError("");
                    }}
                    isPassword={true}
                    enableToggle={true}
                    />
                </div>

                <div className="w-full max-w-xl mt-4">
                    <FormField
                    label="Password Baru"
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={newPassword}
                    placeholder="••••••••"
                    onChange={(val) => {
                        setNewPassword(val);
                        setPasswordError("");
                        setError("");
                    }}
                    isPassword={true}
                    enableToggle={true}
                    error={passwordError || error || undefined}
                    onClearError={() => {
                        setPasswordError("");
                        setError("");
                    }}
                    passwordRules={newPassword.length > 0 ? passwordRules : undefined}
                    />
                </div>

                <div className="w-full mt-4 max-w-xl flex flex-col justify-center">
                    <button
                        type="submit"
                        className="font-bold text-white bg-[#234463] w-full py-2 border border-[#234463] rounded-2xl hover:bg-[#2B5379] hover:shadow"
                    >
                        Simpan
                    </button>
                </div>

                {message && (
                    <p className="text-green-600 mt-3 text-center">
                        {message}
                    </p>
                )}

            </form>
        </AuthLayout>
    );
}