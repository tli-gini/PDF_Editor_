"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getT, Language } from "./i18n";

// Define the shape of our context
const I18nContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
  t: ReturnType<typeof getT>;
}>({
  lang: "en",
  setLang: () => {},
  t: getT("en"),
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Initialize language directly from <html lang="..."> to avoid hydration mismatch
  const [lang, setLang] = useState<Language>(() => {
    if (typeof document !== "undefined") {
      return (document.documentElement.lang as Language) || "en";
    }
    return "en"; // fallback if running on server
  });

  // update if localStorage has newer preference
  useEffect(() => {
    const stored = localStorage.getItem("lang") as Language;
    if (stored && stored !== lang) {
      setLang(stored);
    }
  }, [lang]);

  const t = getT(lang);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// Custom hook to access i18n context
export const useI18n = () => useContext(I18nContext);
