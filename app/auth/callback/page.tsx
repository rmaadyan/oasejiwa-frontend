"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const errorMsg = searchParams.get("error");

    if (errorMsg) {
      setError(decodeURIComponent(errorMsg));
      return;
    }

    if (!token) {
      router.push("/auth/signin");
      return;
    }

    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      if (role === "PSYCHOLOGIST") {
        router.push("/psychologist/dashboard");
      } else if (role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/userprofile");
      }
    } catch {
      router.push("/userprofile");
    }
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-blue-950">Login Gagal</h2>
          <p className="text-gray-600 text-sm">{error}</p>

          <button
            onClick={() => router.push("/auth/signin")}
            className="w-full bg-blue-900 text-white font-semibold py-2 rounded-2xl hover:bg-blue-800 transition cursor-pointer"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-blue-950 font-medium">Login dengan Google...</p>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={null}>
      <GoogleCallbackContent />
    </Suspense>
  );
}