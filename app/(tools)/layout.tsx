// app/(tools)/layout.tsx

import ToolSidebar from "@/components/ToolSidebar";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col lg:flex-row max-w-[1200px] mx-auto w-full px-6 lg:px-10 md:px-16 pt-32 pb-10 gap-6 lg:gap-0">
      {/* Sidebar */}
      <aside className="w-full lg:w-[320px] mb-4 shrink-0">
        <ToolSidebar />
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex w-full min-h-[500px] items-center justify-center">
        {children}
      </main>
    </section>
  );
}
