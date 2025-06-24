import en from "@/locales/en.json";
import zh from "@/locales/zh.json";

export const translations = { en, zh };

export type Language = keyof typeof translations;

export type Translation = typeof en;

export function getT(lang: Language): Translation {
  return translations[lang];
}
