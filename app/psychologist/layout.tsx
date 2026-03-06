import PsychologistLayoutClient from "@/app/components/common/PsychologistLayoutClient";

export default function PsychologistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PsychologistLayoutClient>{children}</PsychologistLayoutClient>;
}
