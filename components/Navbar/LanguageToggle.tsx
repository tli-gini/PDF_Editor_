"use client";
import { useI18n } from "@/lib/i18n-context";
import { IoLanguage } from "react-icons/io5";

export default function LanguageToggle() {
  const { lang, setLang } = useI18n(); // get current language and setter from context

  const toggleLanguage = () => {
    const next = lang === "en" ? "zh" : "en"; // determine next language
    setLang(next); // update context
    localStorage.setItem("lang", next); // save preference
    document.documentElement.setAttribute("lang", next);
    setLang(next); // update context again to ensure re-render
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
