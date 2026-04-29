"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AllowedRole = "ADMIN" | "PSYCHOLOGIST" | "USER";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AllowedRole[];
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          router.replace("/auth/signin");
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