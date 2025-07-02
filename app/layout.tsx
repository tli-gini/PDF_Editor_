import React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { I18nProvider } from "@/lib/i18n-context";
import type { Language } from "@/lib/i18n";
import { Bellota_Text, Kalam, Noto_Sans_TC } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = (await headers()).get("x-lang") || "en";

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${bellota.variable} ${kalam.variable} ${notoSansTC.variable}`}
    >
      <head>
        {/* Prevent dark mode + language flicker on first load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    const theme = localStorage.getItem("theme");
    const lang = localStorage.getItem("lang") || "en";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Set lang attribute early
    document.documentElement.setAttribute("lang", lang);

    // Apply dark mode if needed
    if (theme === "dark" || (!theme && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  } catch(e) {}
})();
            `,
          }}
        />

        {/* Load Material Symbols for icon usage */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=block"
        />
      </head>

      <body className="font-bellota bg-[var(--color-background)] text-[var(--color-secondary)] min-h-screen flex flex-col">
        <I18nProvider initialLang={lang as Language}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ToastContainer position="top-center" autoClose={3000} />
        </I18nProvider>
      </body>
    </html>
  );
}
