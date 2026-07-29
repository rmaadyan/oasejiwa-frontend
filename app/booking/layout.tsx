import type { ReactNode } from "react";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";

export default function BookingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="pt-24 min-h-screen">{children}</div>
      <Footer />
    </>
  );
}
