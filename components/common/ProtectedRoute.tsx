"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AllowedRole = "ADMIN" | "PSYCHOLOGIST" | "USER";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AllowedRole[];
}

function getCookie(name: string) {
  if (typeof document === "undefined") return null;

  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";

    if (bypassAuth) {
      setIsChecking(false);
      return;
    }

    const token = getCookie("token");

    if (!token) {
      router.replace("/auth/signin");
      return;
    }

    setIsChecking(false);
  }, [router]);

  if (isChecking) return null;

  return <>{children}</>;
}