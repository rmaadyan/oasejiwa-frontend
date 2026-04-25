"use client";

import { useState } from "react";
import AdminSidebar from "@/components/common/AdminSidebar";
import AdminNavbar from "@/components/common/AdminNavbar";
import AdminLayoutClient from "@/components/common/AdminLayoutClient";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}