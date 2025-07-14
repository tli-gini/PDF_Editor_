"use client";

import { useI18n } from "@/lib/i18n-context";
import type { Translation } from "@/lib/i18n";

interface CheckboxOptionProps<K extends keyof Translation["tools"]> {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  labelKey: K;
  labelPath: Extract<keyof Translation["tools"][K], string>;
}

export default function CheckboxOption<K extends keyof Translation["tools"]>({
  id,
  checked,
  onChange,
  labelKey,
  labelPath,
}: CheckboxOptionProps<K>) {
  const { t } = useI18n();
  const labelText = t.tools[labelKey][labelPath];

  return (
    <div className="w-full max-w-md mt-6 text-left">
      <label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="hidden peer"
        />
        <span className="w-[22px] h-[22px] rounded-full border-2 border-white bg-white relative peer-checked:after:opacity-100 after:content-[''] after:w-[14px] after:h-[14px] after:rounded-full after:bg-primary after:dark:bg-background after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-0 transition-opacity" />
        <span className="text-base text-secondary">{String(labelText)}</span>
      </label>
    </div>
  );
}
