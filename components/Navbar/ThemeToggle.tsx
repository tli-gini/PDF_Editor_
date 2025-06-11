"use client";

import { useEffect, useState } from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");

    if (stored === "dark") {
      // Apply dark mode if previously selected
      root.classList.add("dark");
      setIsDark(true);
    } else if (stored === "light") {
      // Apply light mode if previously selected
      root.classList.remove("dark");
      setIsDark(false);
    } else {
      // No preference stored, fallback to system preference
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (systemPrefersDark) {
        root.classList.add("dark");
        setIsDark(true);
      } else {
        root.classList.remove("dark");
        setIsDark(false);
      }
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      // Enable dark mode and store preference
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      // Disable dark mode and store preference
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-xl text-white transition rounded-full bg-primary-light hover:bg-primary hover:text-white"
    >
      {isDark ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
    </button>
  );
}
