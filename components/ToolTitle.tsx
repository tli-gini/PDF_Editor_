import React from "react";

interface ToolTitleProps {
  icon: React.ReactNode;
  label: string;
}

export default function ToolTitle({ icon, label }: ToolTitleProps) {
  return (
    <div className="flex justify-start w-full max-w-md my-2">
      <h1 className="flex items-center justify-center gap-2 mb-6 text-2xl font-bold text-secondary">
        {icon}
        {label}
      </h1>
    </div>
  );
}
