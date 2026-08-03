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

        // 1. Set data lokal terlebih dahulu agar UI cepat muncul
        try {
            const parsedUser = JSON.parse(localUser);
            setUser(parsedUser);
            setIsLoggedIn(true);
        } catch (e) {
            console.error(e);
        }

        // 2. Validasi ke backend
        getAuthMe()
            .then((freshUser) => {
                // Ambil data lokal lama sebagai cadangan jika freshUser dari API me tidak membawa fullName
                const existingData = localUser ? JSON.parse(localUser) : {};
                
                const mergedUser = {
                    ...existingData,
                    ...freshUser,
                    // Jika freshUser tidak punya fullName, pertahankan fullName dari data lokal/login sebelumnya
                    fullName: freshUser?.fullName || freshUser?.userProfile?.fullName || existingData?.fullName
                };

                localStorage.setItem("user", JSON.stringify(mergedUser));
                setUser(mergedUser);
                setIsLoggedIn(true);
            })
            .catch(() => {
                // Cookie expired/invalid, bersihkan localStorage
                localStorage.removeItem("user");
                setIsLoggedIn(false);
                setUser(null);
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