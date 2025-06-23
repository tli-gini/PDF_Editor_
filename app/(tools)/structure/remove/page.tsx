// app/(tools)/structure/remove/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import { MdOutlineDelete } from "react-icons/md";

export default function ExtractPage() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center lg:w-9/12 md:w-9/12 rounded-2xl bg-primary-light">
      <ToolTitle
        icon={<MdOutlineDelete className="text-3xl" />}
        label={t.tools.remove.label}
      />

      <DropzoneCard>
        <p className="items-center justify-center text-base font-semibold text-white">
          Click or Drag & Drop
        </p>
      </DropzoneCard>

      <div className="w-full max-w-md mt-6 text-left">
        <label className="block mb-2 text-base font-semibold text-secondary">
          Pages To Delete
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

      <SendButton />
    </div>
  );
}
