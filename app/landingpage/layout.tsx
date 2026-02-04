"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
