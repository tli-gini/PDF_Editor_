"use client";

interface Option {
  value: string;
  label: string;
}

interface ModeSelectProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (val: string) => void;
}

export default function ModeSelect({
  label,
  value,
  options,
  onChange,
}: ModeSelectProps) {
  return (
    <div className="w-full max-w-lg mt-6 text-left">
      <label className="block mb-2 text-base font-semibold text-secondary">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 font-semibold bg-white border shadow-inner rounded-xl border-primary-light focus:outline-none focus:ring-2 focus:ring-primary text-primary"
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-white text-primary hover:bg-primary hover:text-white"
          >
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
