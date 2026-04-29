"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthLayout from "@/components/features/user/authLayout";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token tidak ditemukan");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setStatus("success");
        setMessage(data.message);
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Verifikasi gagal");
      }
    };

    verify();
  }, [token]);

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        router.push("/auth/signin");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status, router]);

  return (
    <div>
      <AuthLayout
        title="Verify Email"
        description="Memproses verifikasi akun Anda"
        titleSize="sm"
      >
        <div className="w-full max-w-xl mx-auto flex flex-col items-center space-y-8">
          {status === "loading" && (
            <>
              <Loader2 className="h-14 w-14 text-[#234463] animate-spin" />
              <p className="text-[#234463] font-bold text-sm text-center">
                Memverifikasi email Anda...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500" />
              <div className="w-full flex flex-col items-center gap-3">
                <div className="w-full text-green-600 text-sm font-bold text-center">
                  {message}
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Mengarahkan ke halaman login...
                </p>
              </div>
              <div className="w-full flex flex-col justify-center">
                <button
                  onClick={() => router.push("/auth/signin")}
                  className="font-bold text-white bg-[#234463] w-full py-2 border border-[#234463] rounded-2xl hover:bg-[#2B5379] hover:shadow cursor-pointer"
                >
                  Ke Halaman Login
                </button>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-12 w-12" />
              <div className="w-full text-red-600 text-sm font-bold text-center">
                {message}
              </div>
              <div className="w-full flex flex-col justify-center">
                <button
                  onClick={() => router.push("/auth/signin")}
                  className="font-bold text-white bg-[#234463] w-full py-2 border border-[#234463] rounded-2xl hover:bg-[#2B5379] hover:shadow cursor-pointer"
                >
                  Kembali ke Login
                </button>
              </div>
            </>
          )}
        </div>
      </AuthLayout>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}