"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  ClipboardList,
  User,
  LogOut,
} from "lucide-react";
import { getPsychologistProfile } from "@/lib/api/psychologist";
import type { Psychologist } from "@/lib/types/psychologist";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.oasejiwa.id";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/psychologist/dashboard" },
  { icon: Calendar, label: "Jadwal Saya", href: "/psychologist/schedule" },
  { icon: Users, label: "Pasien Saya", href: "/psychologist/patients" },
  { icon: FileText, label: "Catatan Konseling", href: "/psychologist/notes" },
  { icon: ClipboardList, label: "Rekam Medis Digital", href: "/psychologist/rekam-medis" },
  { icon: User, label: "Profil Saya", href: "/psychologist/profile" },
];

export default function PsychologistSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [profile, setProfile] = useState<Psychologist | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getPsychologistProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const clearClientStorage = () => {
    const keys = [
      "token",
      "accessToken",
      "auth_token",
      "refreshToken",
      "user",
      "auth_user",
      "role",
      "user_role",
      "isAuthenticated",
    ];

    keys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  };

const handleLogout = async () => {
  alert("Tombol logout kepencet");
  console.log("Tombol logout kepencet");
  
  setLoggingOut(true);

  try {
    const res = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    console.log("Logout status:", res.status);

    localStorage.clear();
    sessionStorage.clear();

    window.location.href = "/auth/signin";
  } catch (error) {
    console.error("Failed to logout:", error);

    localStorage.clear();
    sessionStorage.clear();

    window.location.href = "/auth/signin";
  }
};

  return (
    <aside className="hidden border-r border-gray-200 bg-white lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      {/* Profile Section */}
      <div className="border-b border-gray-200 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full">
            {profile?.photo ? (
              <img
                src={profile.photo}
                alt={profile.name || "Psikolog"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#2B5379]">
                <span className="text-lg font-bold text-white">
                  {profile?.name?.charAt(0) || "P"}
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#2B5379]">
              {profile?.name || "Loading..."}
            </p>
            <p className="text-xs text-gray-600">Psikolog</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#D1EAFF] text-[#2B5379]"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-200 p-4">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogOut className="h-5 w-5" />
          {loggingOut ? "Keluar..." : "Keluar"}
        </button>
      </div>
    </aside>
  );
}