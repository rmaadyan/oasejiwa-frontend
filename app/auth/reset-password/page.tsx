"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthLayout from "@/components/features/user/authLayout";
import FormField from "@/components/common/formField";
import { resetPassword } from "@/lib/api/auth";
import { Lock } from "lucide-react";
import { useAuthValidation } from "@/hooks/use-auth-validation";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    passwordError,
    setPasswordError,
    validatePasswordOnly,
    getPasswordRuleStatus,
  } = useAuthValidation();

  const passwordRules = getPasswordRuleStatus(password);

  useEffect(() => {
    if (!token) {
      setError("Token tidak ditemukan atau tidak valid");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) {
      setError("Token tidak valid atau sudah expired");
      return;
    }

    const isValid = validatePasswordOnly(password);
    if (!isValid) return;

    try {
      setIsLoading(true);

      await resetPassword({
        token,
        newPassword: password,
      });

      setMessage("Password berhasil diubah");

      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (err: any) {
      const msg = err.message || "Terjadi kesalahan";
      setError(msg);

      if (
        msg.toLowerCase().includes("expired") ||
        msg.toLowerCase().includes("tidak valid")
      ) {
        setTimeout(() => {
          router.push("/auth/email-input");
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      description="Masukkan password baru Anda"
      titleSize="sm"
    >
      <form onSubmit={handleSubmit}>
        <FormField
          label="Password Baru"
          id="password"
          name="password"
          type="password"
          value={password}
          placeholder="••••••••"
          onChange={(val) => {
            setPassword(val);
            setPasswordError("");
            setError("");
          }}
          icon={<Lock className="h-5 w-5" />}
          isPassword={true}
          enableToggle={true}
          error={passwordError || error || undefined}
          onClearError={() => {
            setPasswordError("");
            setError("");
          }}
          passwordRules={password.length > 0 ? passwordRules : undefined}
        />

        <div className="w-full max-w-xl">
          <button
            type="submit"
            disabled={isLoading}
            className="font-bold text-white bg-[#234463] w-full mt-8 py-2 border rounded-2xl hover:bg-[#2B5379] hover:shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Menyimpan..." : "Simpan Password"}
          </button>
        </div>

        {error && !passwordError && (
          <div className="w-full max-w-xl text-red-600 text-sm text-center bg-red-50 py-2 px-3 rounded-lg">
            {error}
            {error.toLowerCase().includes("expired") && (
              <span className="block mt-1">
                Anda akan diarahkan ke halaman reset ulang...
              </span>
            )}
          </div>
        )}

        {message && (
          <div className="w-full max-w-xl text-green-600 text-sm text-center bg-green-50 mt-4 py-2 px-3 rounded-lg">
            {message}
          </div>
        )}
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}