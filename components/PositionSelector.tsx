// components/PositionSelector.tsx
"use client";
import { useMemo } from "react";

type Props = {
  value: number;
  onChange: (n: number) => void;
  label?: string;
};

export default function PositionSelector({ value, onChange, label }: Props) {
  const cells = useMemo(() => Array.from({ length: 9 }, (_, i) => i + 1), []);
  return (
    <div className="w-full max-w-lg mt-4">
      {label && (
        <label className="block mb-2 text-base font-semibold text-left text-secondary">
          {label}
        </label>
      )}
      <div className="grid w-1/2 lg:h-[20rem] md:h-[20rem] h-[12rem] grid-cols-3 gap-2 p-2 bg-white border border-primary-light rounded-xl">
        {cells.map((n) => (
          <button
            key={n}
            type="button"
            className={`flex items-center justify-center rounded-md border text-lg font-semibold transition-colors duration-150 
        ${
          n === value
            ? "bg-primary text-white border-primary"
            : "bg-gray-100 text-primary border-primary-light hover:bg-gray-200"
        }`}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
      </div>

      <p className="mt-2 text-sm text-left text-secondary">
        Preview is approximate. Final output may vary due to PDF font/margins.
      </p>
    </div>
  );
}
