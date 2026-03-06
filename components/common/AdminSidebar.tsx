"use client";

import {
    BarChart3,
    Briefcase,
    CalendarCheck,
    FileText,
    LayoutDashboard,
    LogOut,
    UserCog,
    Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();

    const menuItems = [
        {
            icon: LayoutDashboard,
            label: "Dashboard Admin",
            href: "/admin"
        },
        {
            icon: BarChart3,
            label: "Analytics",
            href: "/admin/analytics"
        },
        {
            icon: Users,
            label: "Manajemen Psikolog",
            href: "/admin/psikologmanagement"
        },
        {
            icon: Briefcase,
            label: "Manajemen Layanan",
            href: "/admin/manajemen-layanan"
        },
        {
            icon: UserCog,
            label: "Manajemen User",
            href: "/admin/users"
        },
        {
            icon: CalendarCheck,
            label: "Manajemen Booking",
            href: "/admin/bookings"
        },
        {
            icon: FileText,
            label: "Manajemen Tes",
            href: "/admin/manajemen-tes"
        },
    ];

    // Check if current path matches menu item
    const isActive = (href: string) => {
        return pathname === href || pathname?.startsWith(`${href}/`);
    };

    return (
        <>
            {isOpen !== undefined && isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={onClose}
                />
            )}
            <aside className={"h-screen w-64 bg-white border-r border-gray-200" + (isOpen !== undefined ? (" fixed lg:static top-0 left-0 z-40 transform transition-transform duration-300 " + (isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")) : "")}>
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="border-b border-gray-200 px-6 py-6">
                        <h1 className="text-xl font-bold text-secondary-heading">Oase Jiwa</h1>
                        <p className="text-xs text-gray-600">Admin Panel</p>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                    flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors
                    ${active
                                            ? "bg-soft-bg text-secondary-heading font-bold"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }
                  `}
                                    onClick={() => onClose()} // Close sidebar on mobile after click
                                >
                                    <Icon size={20} className={active ? "text-primary-dark" : ""} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="border-t border-gray-200 px-3 py-4">
                        <button
                            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                            onClick={() => {
                                // Add logout logic here
                                console.log("Logout clicked");
                            }}
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}