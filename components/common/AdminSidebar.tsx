"use client";

import {
  BarChart3,
  Briefcase,
  CalendarCheck,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Star,
  UserCog,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose: () => void;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.oasejiwa.id";

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard Admin",
      href: "/admin",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      href: "/admin/analytics",
    },
    {
      icon: ClipboardList,
      label: "Rekam Medis Digital",
      href: "/admin/rekam-medis",
    },
    {
      icon: Users,
      label: "Manajemen Psikolog",
      href: "/admin/psikologmanagement",
    },
    {
      icon: Briefcase,
      label: "Manajemen Layanan",
      href: "/admin/manajemen-layanan",
    },
    {
      icon: UserCog,
      label: "Manajemen User",
      href: "/admin/users",
    },
    {
      icon: CalendarCheck,
      label: "Manajemen Booking",
      href: "/admin/bookings",
    },
    {
      icon: FileText,
      label: "Manajemen Tes",
      href: "/admin/manajemen-tes",
    },
    {
      icon: Star,
      label: "Google Reviews",
      href: "/admin/google-reviews",
    },
  ];

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

      console.log("Admin logout status:", res.status);

      clearClientStorage();

      window.location.href = "/auth/signin";
    } catch (error) {
      console.error("Failed to logout admin:", error);

      clearClientStorage();

      window.location.href = "/auth/signin";
    }
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/dashboard";
    }

    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <>
      {isOpen !== undefined && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={
          "h-screen w-64 border-r border-gray-200 bg-white" +
          (isOpen !== undefined
            ? " fixed left-0 top-0 z-40 transform transition-transform duration-300 lg:static " +
              (isOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0")
            : "")
        }
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-gray-200 px-6 py-6">
            <h1 className="text-xl font-bold text-secondary-heading">
              Oase Jiwa
            </h1>
            <p className="text-xs text-gray-600">Admin Panel</p>
          </div>

          {/* Menu */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-soft-bg font-bold text-secondary-heading"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={onClose}
                >
                  <Icon
                    size={20}
                    className={active ? "text-primary-dark" : ""}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-gray-200 px-3 py-4">
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut size={20} />
              {loggingOut ? "Logout..." : "Logout"}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}