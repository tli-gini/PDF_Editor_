"use client";

import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { useId } from "react";

export interface MCOption {
  value: string;
  label: string;
}

interface MultiCheckboxListProps {
  label: string;
  options: MCOption[];
  values: string[];
  onChange: (values: string[]) => void;
  columns?: 2 | 3 | 4;
  className?: string;
}

export default function MultiCheckboxList({
  label,
  options,
  values,
  onChange,
  columns = 3,
  className = "",
}: MultiCheckboxListProps) {
  const groupId = useId();

  const isChecked = (v: string) => values.includes(v);

  const toggle = (v: string) => {
    const next = isChecked(v) ? values.filter((x) => x !== v) : [...values, v];
    onChange(next);
  };

  const responsiveCols =
    columns === 4
      ? "sm:grid-cols-4"
      : columns === 2
      ? "sm:grid-cols-2"
      : "sm:grid-cols-3";

  return (
    <div className={`w-full max-w-lg mt-6 text-left ${className}`}>
      <label
        className="block mb-2 text-base font-semibold text-secondary"
        htmlFor={groupId}
      >
        {label}
      </label>

      <div
        id={groupId}
        role="group"
        className={`grid grid-cols-1 ${responsiveCols} gap-2 p-2 bg-white border rounded-xl border-primary-light`}
      >
        {options.map((opt) => {
          const checked = isChecked(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={checked}
              onClick={() => toggle(opt.value)}
              className={[
                "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-primary",
                checked
                  ? "bg-primary text-white border-primary"
                  : "bg-gray-50 text-primary border-primary-light hover:bg-gray-100",
              ].join(" ")}
            >
              <span className="text-xl shrink-0">
                {checked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
              </span>
              <span className="text-sm font-semibold truncate">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* <p className="mt-2 text-sm text-secondary"></p> */}
    </div>
  );
}
