"use client";

import { Menu, Bell, User } from "lucide-react";

interface AdminNavbarProps {
  onMenuClick: () => void;
}

export default function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Menu Button (Mobile) */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} className="text-gray-700" />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <button className="relative rounded-lg p-2 hover:bg-gray-100">
            <Bell size={20} className="text-gray-700" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User Profile */}
          <button className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100">
            <div className="h-8 w-8 rounded-full bg-linear-to-br from-blue-400 to-blue-600" />
            <span className="hidden text-sm font-medium text-gray-700 sm:inline">
              Admin
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
