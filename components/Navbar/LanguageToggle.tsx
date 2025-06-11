"use client";

import { IoLanguage } from "react-icons/io5";

export default function LanguageToggle() {
  const toggleLanguage = () => {
    const current = localStorage.getItem("lang") || "en";
    const next = current === "en" ? "zh" : "en";
    localStorage.setItem("lang", next);
    location.reload();
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 text-xl text-white transition rounded-full bg-primary-light hover:bg-primary hover:text-white"
    >
      <IoLanguage />
    </button>
  );
}
