import React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Bellota_Text, Kalam, Noto_Sans_TC } from "next/font/google";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";

const bellota = Bellota_Text({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  variable: "--font-bellota",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-kalam",
});

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-noto-tc",
});

export const metadata: Metadata = {
  title: "PDF_Editor_",
  description: "A minimalist, responsive PDF editing UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bellota.variable} ${kalam.variable} ${notoSansTC.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=block"
        />
      </head>
      <body className="font-bellota bg-[var(--color-background)] text-[var(--color-secondary)] min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
