'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/api/user";

export interface UserProfile {
    id: string;
    email: string;
    role: string;
    profile: {
        name: string;
        birthday: string;
        gender: string;
        country: string;
        city: string;
        fullAddress: string;
        phone: string;
        firstPsychologyVisit?: boolean;
    } | null;
}

export function useRequireCompleteProfile() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);

    useEffect(() => {
        getMe()
        .then((res) => {
            const profile = res.profile;

            // Cek apakah semua field wajib sudah terisi
            const isComplete =
            profile &&
            profile.name &&
            profile.birthday &&
            profile.gender &&
            profile.country &&
            profile.city &&
            profile.fullAddress &&
            profile.phone;

            if (!isComplete) {
                //redirect ke halaman lengkapi profil, simpan tujuan asal
                const currentUrl = typeof window !== "undefined" ? window.location.href : "";
                router.replace(
                    `/userprofile?redirect=${encodeURIComponent(currentUrl)}`
                );
                return;
            }

            setUser(res);
        })
        .catch(() => {
            setIsGuest(true);
        })
        .finally(() => setIsLoading(false));
    }, []);

    return { user, isLoading, isGuest };
}