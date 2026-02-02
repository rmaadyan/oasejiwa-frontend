import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oase Jiwa - Kenali Dirimu, Pulihkan Jiwamu",
  description: "Layanan psikologi profesional untuk kesehatan mental optimal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
