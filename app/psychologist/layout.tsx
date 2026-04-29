import PsychologistLayoutClient from "@/components/common/PsychologistLayoutClient";
import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function PsychologistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["PSYCHOLOGIST"]}>
      <PsychologistLayoutClient>{children}</PsychologistLayoutClient>
    </ProtectedRoute>
  );
}