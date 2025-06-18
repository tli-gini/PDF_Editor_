// app/(tools)/editor/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";

export default function EditorHome() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center">
      <h1 className="mb-2 text-2xl font-bold text-primary">
        {t.page.editor.title}
      </h1>
      <p className="max-w-md text-secondary">{t.page.editor.description}</p>
    </div>
  );
}
