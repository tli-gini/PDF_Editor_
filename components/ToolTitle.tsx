import React from "react";

interface ToolTitleProps {
  icon: React.ReactNode;
  label: string;
}

export default function ToolTitle({ icon, label }: ToolTitleProps) {
  return (
    <div className="flex justify-start w-full max-w-md my-2">
      <h1 className="flex items-center justify-center gap-2 mb-6 text-xl font-bold text-secondary lg:text-2xl">
        {icon}
        {label}
      </h1>
    </div>
  );
}
