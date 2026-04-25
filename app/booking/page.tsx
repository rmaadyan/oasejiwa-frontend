"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BookingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to services selection (step 1)
    router.replace("/booking/psychologists");
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-[#2B5379] border-t-transparent rounded-full" />
    </div>
  );
}
