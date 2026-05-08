import type { Metadata } from "next";
import "./globals.css";

const title = "Oase Jiwa - Kenali Dirimu, Pulihkan Jiwamu";
const description = "Layanan psikologi profesional untuk kesehatan mental optimal";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: ["/logo.png"],
  },
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
