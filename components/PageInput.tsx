"use client";

import { useI18n } from "@/lib/i18n-context";
import type { Translation } from "@/lib/i18n";

type ToolKey = keyof Translation["tools"];

interface PageInputProps {
  value: string;
  onChange: (val: string) => void;
  labelKey: ToolKey;
}

export default function PageInput({
  labelKey,
  value,
  onChange,
}: PageInputProps) {
  const { t } = useI18n();

  return (
    <div className="w-full max-w-md mt-6 text-left">
      <label className="block mb-2 text-base font-semibold text-secondary">
        {t.tools[labelKey].inputLabel}
        <span className="ml-1 text-sm font-normal whitespace-pre-wrap text-secondary">
          <br />
          {t.tools[labelKey].inputHint}
        </span>
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        placeholder="2,4,7,12-16"
        className="w-full px-4 py-2 font-semibold border shadow-inner rounded-xl border-primary-light focus:outline-none focus:ring-2 focus:ring-primary text-primary placeholder:text-primary-light dark:text-background"
      />
    </div>
  );
}
