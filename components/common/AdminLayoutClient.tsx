"use client";

import AdminSidebar from "@/components/common/AdminSidebar";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar Container */}
            <div>
                {/* Mobile Overlay Backdrop */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                        onClick={handleCloseSidebar}
                    />
                )}

                {/* Sidebar */}
                <div
                    className={`fixed md:relative top-0 left-0 h-screen w-64 transform transition-transform duration-300 z-40 md:transform-none md:transition-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                        }`}
                >
                    <AdminSidebar onClose={handleCloseSidebar} />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header with Toggle Button */}
                <header className="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between md:hidden">
                    <h1 className="text-sm sm:text-base font-semibold text-gray-900">Admin Dashboard</h1>
                    <button
                        onClick={handleToggleSidebar}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                    >
                        {sidebarOpen ? (
                            <X className="w-5 h-5 text-gray-600" />
                        ) : (
                            <Menu className="w-5 h-5 text-gray-600" />
                        )}
                    </button>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}