"use client";

import { useEffect, useState } from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Sync with real DOM state on mount
  useEffect(() => {
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    setIsDark(isCurrentlyDark);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
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
