"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full h-24 flex items-center justify-center bg-background shadow-[0_3px_15px_#c96c5e4d] z-[100]">
      <div className="flex items-center justify-between mx-[26px] my-[10px] w-[1200px]">
        <Link href="/">
          <div className="flex gap-4">
            <Image
              src="/img/half-tr-pdf-logo.png"
              alt="logo"
              width={60}
              height={60}
              className="object-cover w-[60px] h-[60px]"
            />
            <div className="flex items-center">
              <div className="text-4xl font-bold text-secondary">
                PDF_Editor_
              </div>
            </div>
          </div>
        </Link>

        <div className="flex items-center">
          <Link href="/">
            <div className="text-[14px] font-[340] px-[10px] py-[8px] mx-[6px] rounded-[10px] bg-background text-primary cursor-pointer transition-all hover:font-[400] hover:px-[14px] hover:py-[10px] hover:border-primary">
              item 1
            </div>
          </Link>
          <Link href="/">
            <div className="text-[14px] font-[340] px-[10px] py-[8px] mx-[6px] rounded-[10px] bg-background text-primary cursor-pointer transition-all hover:font-[400] hover:px-[14px] hover:py-[10px] hover:border-primary">
              item 2
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
