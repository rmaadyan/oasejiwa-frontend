import type { Metadata } from "next";
import "./globals.css";

const title = "Oase Jiwa - Kenali Dirimu, Pulihkan Jiwamu";
const description = "Layanan psikologi profesional untuk kesehatan mental optimal";

export const metadata: Metadata = {
  metadataBase: new URL("https://oasejiwa.id"),
  title,
  description,
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title,
    description,
    images: [
      {
        url: "/logo-og.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 🟢 1. Tambahkan translate="no" pada tag html
    <html lang="id" translate="no">
      <head>
        {/* 🟢 2. Tambahkan meta tag notranslate */}
        <meta name="google" content="notranslate" />
      </head>
      <body>{children}</body>
    </html>
  );
}