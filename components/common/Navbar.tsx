"use client";

import { Button } from "@/components/ui/Button";
import { Menu, X, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; 
import { useAuth } from "@/hooks/use-auth";


export default function Navbar() {
  const [isSpecialPage, setIsSpecialPage] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // 1. Ambil data 'user' dari useAuth hook
  const { isLoggedIn, isLoading, user } = useAuth();
  console.log("ISI DATA USER DI NAVBAR:", user);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    setIsSpecialPage(
      pathname === "/about" ||
        pathname.startsWith("/booking") ||
        pathname.startsWith("/layanan") ||
        pathname.startsWith("/psikologlist") ||
        pathname.startsWith("/psikologdetail") ||
        pathname.startsWith("/tes")
    );

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const getRoleDashboardHref = (role?: string) => {
    if (!role) return "/userprofile";
    const upperRole = String(role).toUpperCase();
    switch (upperRole) {
      case "PSYCHOLOGIST":
        return "/psychologist/profile";
      case "ADMIN":
        return "/admin";
      case "USER":
      default:
        return "/userprofile";
    }
  };

  const dashboardHref = isLoggedIn ? getRoleDashboardHref(user?.role) : "/";
  const authHref = isLoggedIn ? getRoleDashboardHref(user?.role) : "/auth/signin";

  const baseNavItems = [
    { name: "Beranda", href: "/" },
    { name: "Tentang Kami", href: "/about" },
    { name: "Layanan Kami", href: "/layanan" },
    { name: "Psikolog", href: "/psikologlist" },
    { name: "Tes Psikologi", href: "/tes" },
  ];

  const navItems = isLoggedIn
    ? [
        ...baseNavItems,
        { name: "Dashboard", href: dashboardHref },
      ]
    : baseNavItems;

  const displayName = 
    user?.fullName || 
    user?.userProfile?.fullName || 
    user?.name || 
    (user?.email ? user.email.split('@')[0] : "Profile");

  const authLabel = isLoggedIn ? displayName : "Login";

  const buttonClassName = `transition-all ${
    isScrolled
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : isSpecialPage
        ? "border-2 border-blue-600 !text-blue-600 hover:bg-blue-600/10 bg-transparent"
        : "border-2 border-white text-white hover:bg-white/10 bg-transparent"
  }`;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 font-poppins no-print ${
        isScrolled ? "bg-[#D1EAFF] shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Text */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/assets/logo/logo.png"
                alt="Oase Jiwa Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            <span
              className={`text-2xl font-semibold transition-colors duration-300 ${
                isScrolled
                  ? "text-[#2B5379]"
                  : isSpecialPage
                    ? "text-[#234463]"
                    : "text-white"
              }`}
            >
              Oase Jiwa
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium transition-colors duration-300 select-none ${
                  isScrolled
                    ? "text-[#2B5379] hover:text-blue-600"
                    : isSpecialPage
                      ? "text-[#234463] hover:text-[#234463]/80"
                      : "text-white hover:text-white/80"
                } active:text-white`}
                style={{
                  WebkitUserSelect: "none",
                  userSelect: "none",
                }}
              >
                {item.name}
              </Link>
            ))}

            {!isLoading && (
              <Link href={authHref}>
                <Button className={buttonClassName}>
                  {isLoggedIn && <User className="w-4 h-4 mr-2" />}
                  {authLabel}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 transition-colors duration-300 ${
              isScrolled
                ? "text-[#2B5379]"
                : isSpecialPage
                  ? "text-[#234463]"
                  : "text-white"
            }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className={`md:hidden pb-4 transition-all duration-300 ${
              isScrolled
                ? "bg-[#D1EAFF]"
                : isSpecialPage
                  ? "bg-white"
                  : "bg-black/50"
            }`}
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-3 px-4 font-medium transition-colors ${
                  isScrolled
                    ? "text-[#2B5379] hover:text-blue-600"
                    : isSpecialPage
                      ? "text-[#234463] hover:text-[#234463]/80"
                      : "text-white hover:text-white/80"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="px-4 pt-2">
              {!isLoading && (
                <Link href={authHref} onClick={() => setIsOpen(false)}>
                  <Button className={`w-full ${buttonClassName}`}>
                    {isLoggedIn && <User className="w-4 h-4 mr-2" />}
                    {authLabel}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}