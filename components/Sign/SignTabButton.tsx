// components/Sign/SignTabButton.tsx
"use client";

type ModeButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

export function SignTabButton({ label, active, onClick }: ModeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pb-1 border-b-2 ${
        active
          ? "border-transparent text-primary dark:text-white"
          : "border-transparent text-secondary dark:text-primary hover:text-primary hover:dark:text-white"
      }`}
    >
      {label}
    </button>
  );
}
