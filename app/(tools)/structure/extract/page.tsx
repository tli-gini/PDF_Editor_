// app/(tools)/structure/extract/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import { MdFilter3, MdSend } from "react-icons/md";

export default function ExtractPage() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center lg:w-9/12 md:w-9/12 rounded-2xl bg-primary-light">
      <h1 className="flex items-center justify-center gap-2 mb-6 text-2xl font-bold text-secondary">
        <MdFilter3 className="text-3xl" />
        {t.tools.extract.label}
      </h1>

      <DropzoneCard>
        <p className="items-center justify-center text-base font-semibold text-white">
          Click or Drag & Drop
        </p>
      </DropzoneCard>

      <div className="w-full max-w-md mt-6 text-left">
        <label className="block mb-2 text-base font-semibold text-secondary">
          Custom Page Order
          <span className="ml-1 text-sm font-normal text-secondary">
            <br /> Enter a comma-separated list of page numbers: 4,7,12-16
          </span>
        </label>

        <input
          type="text"
          placeholder="2,4,7,12-16,20-22"
          className="w-full px-4 py-2 font-semibold border shadow-inner rounded-xl border-primary-light focus:outline-none focus:ring-2 focus:ring-primary text-primary placeholder:text-primary-light dark:text-background"
        />
      </div>

      <button className="px-5 pt-2 pb-2 mt-6 text-white transition-transform rounded-2xl bg-primary hover:scale-105 hover:shadow-[0_6px_24px_rgba(255,255,255,0.6)] active:scale-95 focus:ring-2 focus:ring-white">
        <MdSend className="w-6 h-6 " />
      </button>
    </div>
  );
}
