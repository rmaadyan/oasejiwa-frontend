import AdminLayoutClient from "@/components/common/AdminLayoutClient";
import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </ProtectedRoute>
  );
}