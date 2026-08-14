"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AllowedRole = "ADMIN" | "PSYCHOLOGIST" | "USER";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AllowedRole[];
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.oasejiwa.id";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";

      if (bypassAuth) {
        setIsAllowed(true);
        setIsChecking(false);
        return;
      }

      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("auth_token") ||
              localStorage.getItem("token") ||
              localStorage.getItem("accessToken")
            : null;

        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers,
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          const currentPath = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/booking";
          router.replace(`/auth/signin?redirect=${encodeURIComponent(currentPath)}`);
          return;
        }

        const user = await res.json();

        if (
          allowedRoles &&
          allowedRoles.length > 0 &&
          !allowedRoles.includes(user.role)
        ) {
          router.replace("/");
          return;
        }

        setIsAllowed(true);
      } catch (error) {
        router.replace("/auth/signin");
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router, allowedRoles]);

  if (isChecking || !isAllowed) return null;

  return <>{children}</>;
}