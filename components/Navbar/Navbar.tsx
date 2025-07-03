"use client";

import Image from "next/image";
import Link from "next/link";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";
import MobileMenuToggle from "./MobileMenuToggle";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-close menu when screen becomes desktop size
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)"); // Tailwind's `lg` breakpoint

    const handleScreenChange = () => {
      if (mediaQuery.matches) {
        setMenuOpen(false); // close if screen goes to desktop
      }
    };

    mediaQuery.addEventListener("change", handleScreenChange);
    return () => mediaQuery.removeEventListener("change", handleScreenChange);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 w-full bg-background shadow-box z-[100] transition-all duration-300 ease-in-out ${
        menuOpen ? "h-[144px]" : "h-[72px] sm:h-[88px]"
      }`}
    >
      <div className="flex flex-col justify-center w-full h-full">
        <div className="flex items-center justify-between w-full px-[16px] my-[10px] max-w-[1200px] mx-auto">
          {/* Logo & Title */}
          <Link href="/" className="flex items-center min-w-0 gap-4">
            <Image
              src="/img/half-tr-pdf-logo.png"
              alt="logo"
              width={56}
              height={56}
              className="object-cover w-[44px] h-[44px] sm:w-[56px] sm:h-[56px]"
            />
            <div className="text-2xl font-extrabold truncate font-bellota sm:text-3xl text-secondary">
              PDF_Editor_
            </div>
          </Link>

          {/* Desktop */}
          <div className="items-center hidden gap-3 lg:flex">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          {/* Mobile */}
          <div className="lg:hidden">
            <MobileMenuToggle isOpen={menuOpen} setIsOpen={setMenuOpen} />
          </div>
        </div>

        {/* Mobile menu open */}
        {menuOpen && (
          <div className="flex lg:hidden justify-end px-[16px] gap-4">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        )}
      </div>
    </nav>
  );
}
