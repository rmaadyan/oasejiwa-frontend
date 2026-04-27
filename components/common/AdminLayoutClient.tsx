"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import AdminSidebar from "@/components/common/AdminSidebar";

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
            onClick={handleCloseSidebar}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed md:relative top-0 left-0 h-screen w-72 transform transition-transform duration-300 z-40 md:transform-none md:transition-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <AdminSidebar onClose={handleCloseSidebar} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header - Simple */}
        <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between md:hidden shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-[#2B5379]">Oase Jiwa</h1>
            <p className="text-xs text-gray-600">Admin Panel</p>
          </div>
          <button
            onClick={handleToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
