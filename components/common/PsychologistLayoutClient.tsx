"use client";

import { useState, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  User
} from "lucide-react";
import { getPsychologistProfile } from "@/lib/api/psychologist";
import type { Psychologist } from "@/lib/types/psychologist";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/psychologist/dashboard" },
  { icon: Calendar, label: "Jadwal Saya", href: "/psychologist/schedule" },
  { icon: Users, label: "Pasien Saya", href: "/psychologist/patients" },
  { icon: FileText, label: "Catatan Konseling", href: "/psychologist/notes" },
  { icon: User, label: "Profil Saya", href: "/psychologist/profile" },
];

export default function PsychologistLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<Psychologist | null>(null);
  const pathname = usePathname();

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        {/* Profile Section */}
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {/* Photo */}
            <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
              {profile?.photo ? (
                <img 
                  src={profile.photo} 
                  alt={profile.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#2B5379] flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {profile?.name.charAt(0) || "P"}
                  </span>
                </div>
              )}
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#2B5379] truncate">
                {profile?.name || "Loading..."}
              </p>
              <p className="text-xs text-gray-600">Psikolog</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#D1EAFF] text-[#2B5379]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {/* Photo */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
              {profile?.photo ? (
                <img 
                  src={profile.photo} 
                  alt={profile.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#2B5379] flex items-center justify-center">
                  <span className="text-base font-bold text-white">
                    {profile?.name.charAt(0) || "P"}
                  </span>
                </div>
              )}
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#2B5379] truncate">
                {profile?.name || "Loading..."}
              </p>
              <p className="text-xs text-gray-600">Psikolog</p>
            </div>
          </div>
          
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-[#2B5379]" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#D1EAFF] text-[#2B5379]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Logout */}
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Top Bar - Only Menu Button */}
        <header className="sticky top-0 z-30 flex items-center h-16 px-6 bg-white border-b border-gray-200 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6 text-[#2B5379]" />
          </button>
          
          <div className="ml-4">
            <p className="text-sm font-semibold text-[#2B5379]">Oase Jiwa</p>
            <p className="text-xs text-gray-600">Portal Psikolog</p>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
