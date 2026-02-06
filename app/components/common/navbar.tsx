"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // TODO: Connect to auth

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Beranda", href: "/" },
    { name: "Tentang Kami", href: "/tentang" },
    { name: "Layanan", href: "/layanan" },
    { name: "Psikolog", href: "/psikolog" },
    { name: "Tes Psikologi", href: "/tes-psikologi" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 font-poppins ${
        isScrolled ? "bg-[#D1EAFF] shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Text */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/logo.png"
                alt="Oase Jiwa Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span
              className={`text-2xl font-semibold transition-colors duration-300 ${
                isScrolled ? "text-[#2B5379]" : "text-white"
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
                    ? "text-[#2B5379] hover:text-[#2B5379]/80"
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

            {/* Login Button or Profile */}
            {isLoggedIn ? (
              <Link
                href="/profile"
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  isScrolled
                    ? "bg-[#2B5379] text-white hover:bg-[#2B5379]/90"
                    : "border-2 border-white text-white hover:bg-white/10"
                }`}
              >
                <User size={18} />
                <span>Profile</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className={`inline-flex items-center justify-center px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  isScrolled
                    ? "bg-[#2B5379] text-white hover:bg-[#2B5379]/90"
                    : "border-2 border-white bg-transparent text-white hover:bg-white/10"
                }`}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 transition-colors duration-300 ${
              isScrolled ? "text-[#2B5379]" : "text-white"
            }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className={`md:hidden pb-4 transition-all duration-300 ${
              isScrolled ? "bg-[#D1EAFF]" : "bg-black/50"
            }`}
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-3 px-4 font-medium transition-colors duration-300 ${
                  isScrolled
                    ? "text-[#2B5379] hover:text-[#2B5379]/80 active:text-white active:bg-[#2B5379]"
                    : "text-white hover:text-white/80 active:bg-white/20"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-4 pt-2">
              {isLoggedIn ? (
                <Link
                  href="/profile"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#2B5379] text-white hover:bg-[#2B5379]/90 font-medium transition-all duration-300"
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center px-4 py-2 rounded-full bg-[#2B5379] text-white hover:bg-[#2B5379]/90 font-medium transition-all duration-300"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
