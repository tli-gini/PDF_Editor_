"use client";
import { ReactNode, useState } from "react";
import { MdLightbulbOutline, MdKeyboardArrowUp } from "react-icons/md";

type InfoToggleProps = {
  title?: string;
  hideTitle?: string;
  children: ReactNode;
};

export default function InfoToggle({
  title = "",
  hideTitle = "",
  children,
}: InfoToggleProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-lg text-left">
      <button
        className="flex items-center gap-1 mt-4 text-base font-normal text-primary dark:text-white hover:underline"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        {open ? (
          <MdKeyboardArrowUp className="text-2xl" />
        ) : (
          <MdLightbulbOutline className="text-xl" />
        )}
        {open ? hideTitle : title}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? " opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="text-sm font-light whitespace-pre-line">{children}</div>
      </div>
    </div>
  );
}
