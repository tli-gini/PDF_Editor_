"use client";

import { useId } from "react";

export type FieldSpec = {
  key: string;
  label: string;
  hint?: string;
  placeholder?: string;
  type?: "text" | "password" | "number";
};

interface MultiPageInputProps {
  fields: FieldSpec[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  className?: string;
}

export default function MultiPageInput({
  fields,
  values,
  onChange,
  className = "",
}: MultiPageInputProps) {
  const baseId = useId();

  return (
    <div className={`w-full max-w-lg ${className}`}>
      {fields.map((field, index) => {
        const id = `${baseId}-${field.key}-${index}`;
        return (
          <div key={field.key} className="mt-6 text-left">
            {/* label */}
            <label
              htmlFor={id}
              className="block mb-2 text-base font-semibold text-secondary"
            >
              {field.label}
              {field.hint && (
                <span className="ml-1 text-sm font-normal whitespace-pre-wrap text-secondary">
                  <br />
                  {field.hint}
                </span>
              )}
            </label>

            {/* input */}
            <input
              id={id}
              type={field.type ?? "text"}
              value={values[field.key] ?? ""}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={field.placeholder ?? ""}
              className="w-full px-4 py-2 font-semibold border shadow-inner rounded-xl border-primary-light focus:outline-none focus:ring-2 focus:ring-primary text-primary placeholder:text-primary-light dark:text-background"
            />
          </div>
        );
      })}
    </div>
  );
}
