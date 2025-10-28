"use client";

import { useId, useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export type FieldSpec = {
  key: string;
  label: string;
  hint?: string;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number";
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
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  return (
    <div className={`w-full max-w-lg ${className}`}>
      {fields.map((field, index) => {
        const id = `${baseId}-${field.key}-${index}`;
        const isPwd = field.type === "password";
        const show = !!visible[field.key];
        const inputType = isPwd
          ? show
            ? "text"
            : "password"
          : field.type ?? "text";

        return (
          <div key={field.key} className="mt-6 text-left ">
            {/* Label */}
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

            {/* Input + Icon */}
            <div className="relative">
              <input
                id={id}
                type={inputType}
                value={values[field.key] ?? ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder ?? ""}
                className="w-full px-4 py-2 pr-12 font-semibold border shadow-inner rounded-xl border-primary-light focus:outline-none focus:ring-2 focus:ring-primary text-primary placeholder:text-primary-light dark:text-background"
                autoComplete={isPwd ? "new-password" : undefined}
              />

              {isPwd && (
                <button
                  type="button"
                  onClick={() =>
                    setVisible((s) => ({ ...s, [field.key]: !s[field.key] }))
                  }
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700 focus:outline-none"
                >
                  {show ? (
                    <MdVisibilityOff size={20} />
                  ) : (
                    <MdVisibility size={20} />
                  )}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
