"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthMe } from "@/lib/api/auth";

export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const localUser = localStorage.getItem("user");

        if (!localUser) {
        setIsLoading(false);
        return;
        }

        // Validasi ke backend, memastikan cookie masih valid
        getAuthMe()
        .then((freshUser) => {
            localStorage.setItem("user", JSON.stringify(freshUser));
            setUser(freshUser);
            setIsLoggedIn(true);
        })
        .catch(() => {
            // Cookie expired/invalid, bersihkan localStorage
            localStorage.removeItem("user");
            setIsLoggedIn(false);
        })
        .finally(() => setIsLoading(false));
    }, []);

    const logout = () => {
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUser(null);
        router.push("/auth/signin");
    };

    return { isLoggedIn, user, isLoading, logout };
}