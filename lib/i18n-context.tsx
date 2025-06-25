"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getT, Language } from "./i18n";

// Define the structure of the i18n context
const I18nContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
  t: ReturnType<typeof getT>;
}>({
  lang: "en",
  setLang: () => {},
  t: getT("en"),
});

// I18nProvider expects initialLang to be passed from the server
export function I18nProvider({
  initialLang,
  children,
}: {
  initialLang: Language;
  children: React.ReactNode;
}) {
  // Initialize lang state from the server-provided initialLang
  const [lang, setLang] = useState<Language>(initialLang);

  // Optionally update language from localStorage if user changed it manually
  useEffect(() => {
    const stored = localStorage.getItem("lang") as Language | null;
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

// Custom hook to access translation context
export const useI18n = () => useContext(I18nContext);
