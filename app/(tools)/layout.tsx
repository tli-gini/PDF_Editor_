// app/(tools)/layout.tsx

import ToolSidebar from "@/components/ToolSidebar";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col lg:flex-row max-w-[1200px] mx-auto w-full px-4 pt-32 pb-10 gap-6">
      {/* Sidebar for navigation */}
      <aside className="w-full lg:w-[300px] mb-4 shrink-0">
        <ToolSidebar />
      </aside>

      {/* Main content area */}
      <main className="flex-1 w-full min-h-[500px]">{children}</main>
    </section>
  );
}
