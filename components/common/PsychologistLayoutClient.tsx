"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  ClipboardList,
  User,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.oasejiwa.id";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/psychologist/dashboard",
  },
  {
    icon: Calendar,
    label: "Jadwal Saya",
    href: "/psychologist/schedule",
  },
  {
    icon: Users,
    label: "Pasien Saya",
    href: "/psychologist/patients",
  },
  {
    icon: ClipboardList,
    label: "Rekam Medis Digital",
    href: "/psychologist/rekam-medis",
  },
  {
    icon: User,
    label: "Profil Saya",
    href: "/psychologist/profile",
  },
];

export default function PsychologistLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const clearClientStorage = () => {
    if (typeof window === "undefined") return;

    localStorage.clear();
    sessionStorage.clear();
  };

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      console.log("Logout status:", res.status);

      clearClientStorage();

      window.location.href = "/auth/signin";
    } catch (error) {
      console.error("Failed to logout:", error);

      clearClientStorage();

      window.location.href = "/auth/signin";
    }
  };

  const isActiveMenu = (href: string) => {
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex">
        <div className="border-b border-gray-200 px-6 py-6">
          <h1 className="text-xl font-bold text-[#2B5379]">Oase Jiwa</h1>
          <p className="mt-1 text-sm text-gray-600">Panel Psikolog</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveMenu(item.href);

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

        {/* Logout Desktop */}
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

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-6">
          <div>
            <h1 className="text-xl font-bold text-[#2B5379]">Oase Jiwa</h1>
            <p className="mt-1 text-sm text-gray-600">Panel Psikolog</p>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 hover:bg-gray-100"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveMenu(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
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

        {/* Logout Mobile */}
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

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 hover:bg-gray-100"
          aria-label="Buka menu"
        >
          <Menu className="h-6 w-6 text-[#2B5379]" />
        </button>

        <div className="text-center">
          <p className="text-sm font-semibold text-[#2B5379]">Oase Jiwa</p>
          <p className="text-xs text-gray-500">Panel Psikolog</p>
        </div>

        <div className="h-10 w-10" />
      </header>

      {/* Main Content */}
      <main className="min-h-screen lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}