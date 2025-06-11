"use client";

import { CiMenuBurger } from "react-icons/ci";
import { TfiClose } from "react-icons/tfi";

export default function MobileMenuToggle({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="text-2xl transition text-secondary hover:text-primary"
    >
      {isOpen ? <TfiClose /> : <CiMenuBurger />}
    </button>
  );
}
