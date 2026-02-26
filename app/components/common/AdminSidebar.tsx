"use client";

import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  UserCog, 
  CreditCard, 
  BarChart3, 
  LogOut,
  ChevronRight,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
  onClose: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: "Dashboard", 
      href: "/admin/dashboard" 
    },
    { 
      icon: BarChart3, 
      label: "Analytics", 
      href: "/admin/analytics" 
    },
    { 
      icon: UserCog, 
      label: "Manajemen User", 
      href: "/admin/users" 
    },
    { 
      icon: Users, 
      label: "Manajemen Psikolog", 
      href: "/admin/psychologists" 
    },
    { 
      icon: Briefcase, 
      label: "Manajemen Layanan", 
      href: "/admin/services" 
    },
    { 
      icon: CreditCard, 
      label: "Validasi Pembayaran", 
      href: "/admin/payments" 
    },
    { 
      icon: FileText,
      label: "Manajemen Tes",
      href: "/admin/tests",
    },
  ];

  // Check if current path matches menu item
  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside className="h-screen w-72 bg-linear-to-b from-white to-gray-50 border-r border-gray-200 shadow-sm">
      <div className="flex h-full flex-col">
        {/* Logo Section - Simple */}
        <div className="border-b border-gray-200 px-6 py-6">
          <h1 className="text-2xl font-bold text-[#2B5379]">Oase Jiwa</h1>
          <p className="text-sm text-gray-600 mt-1">Admin Panel</p>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Menu Utama
          </p>
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                  ${active 
                    ? "bg-[#2B5379] text-white shadow-md shadow-[#2B5379]/20" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-[#2B5379]"
                  }
                `}
                onClick={() => onClose()}
              >
                <div className="flex items-center gap-3">
                  <Icon 
                    size={20} 
                    className={`transition-transform duration-200 ${
                      active ? "text-white" : "text-gray-500 group-hover:text-[#2B5379]"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                
                {active && (
                  <ChevronRight size={16} className="text-white" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Only */}
        <div className="border-t border-gray-200 px-4 py-4">
          <button 
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
            onClick={() => {
              // Add logout logic here
              console.log("Logout clicked");
            }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
