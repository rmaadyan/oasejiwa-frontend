"use client";

import { BarChart3, Users, Calendar, Settings, LogOut } from "lucide-react";
import Link from "next/link";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const menuItems = [
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: Users, label: "Pasien", href: "/admin/patients" },
    { icon: Calendar, label: "Booking", href: "/admin/bookings" },
    { icon: Settings, label: "Pengaturan", href: "/admin/settings" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-30 h-screen w-64 bg-white border-r border-gray-200 transition-transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-gray-200 px-6 py-6">
            <h1 className="text-xl font-bold text-primary-dark">Oasejiwa</h1>
            <p className="text-xs text-gray-600">Admin Panel</p>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-1 px-3 py-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-gray-200 px-3 py-4">
            <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
