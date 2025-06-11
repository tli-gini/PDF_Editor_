import en from "@/locales/en.json";
import zh from "@/locales/zh.json";

export const translations = { en, zh };

export type Language = keyof typeof translations;

export function getT(lang: Language) {
  return translations[lang];
}
