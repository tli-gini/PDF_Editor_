// components/DropzoneCard.tsx
"use client";

import React from "react";

interface DropzoneCardProps {
  onClick?: () => void;
  children: React.ReactNode;
}

export default function DropzoneCard({ onClick, children }: DropzoneCardProps) {
  return (
    <div
      onClick={onClick}
      className="min-h-48 transition-all duration-200 transform hover:shadow-[0_6px_24px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] rounded-xl border-2 border-dashed border-white p-6 w-full max-w-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center"
    >
      {children}
    </div>
  );
}
