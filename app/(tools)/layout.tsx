// app/(tools)/layout.tsx
import Link from "next/link";
import { ReactNode } from "react";

const navItems = [
  { href: "/structure/extract", label: "Extract Pages" },
  { href: "/structure/merge", label: "Merge PDFs" },
  { href: "/structure/split", label: "Split PDF" },
  { href: "/structure/remove", label: "Remove Pages" },
  { href: "/structure/rotate", label: "Rotate Pages" },
  { href: "/structure/reorder", label: "Reorder Pages" },
];

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-100 dark:bg-gray-900 border-r px-4 py-6 space-y-4">
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
      <main className="flex-1 px-6 py-8 bg-white dark:bg-black text-gray-800 dark:text-gray-100">
        {children}
      </main>
    </div>
  );
}
