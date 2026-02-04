"use client";

import { useState } from "react";
import AdminSidebar from "@/components/common/AdminSidebar";
import AdminNavbar from "@/components/common/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content - dengan margin-left untuk sidebar */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Navbar */}
        <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content dengan padding yang cukup */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-400 mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}