// app/(tools)/layout.tsx
import Link from "next/link";
import { ReactNode } from "react";

const navItems = [
  { href: "/structure/extract", label: "Extract selected pages from PDF." },
  { href: "/structure/merge", label: "Merge multiple PDFs into one." },
  { href: "/structure/split", label: "Split PDFs into multiple documents." },
  { href: "/structure/remove", label: "Delete unwanted pages from PDF." },
  { href: "/structure/rotate", label: "Rotate PDFs." },
  {
    href: "/structure/organize",
    label: "Remove/Rearrange pages in any order.",
  },
];

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="px-4 py-6 space-y-4 bg-gray-100 border-r w-60 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Structure Tools
        </h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block text-sm text-gray-700 dark:text-gray-300 hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-6 py-8 text-gray-800 bg-white dark:bg-black dark:text-gray-100">
        {children}
      </main>
    </div>
  );
}
