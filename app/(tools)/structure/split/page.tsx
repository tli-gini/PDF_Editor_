// app/(tools)/structure/split/page.tsx
"use client";
import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import { MdContentCut } from "react-icons/md";

export default function Split() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center lg:w-9/12 md:w-9/12 rounded-2xl bg-primary-light">
      <ToolTitle
        icon={<MdContentCut className="text-3xl" />}
        label={t.tools.split.label}
      />

      <DropzoneCard>
        <p className="items-center justify-center text-base font-semibold text-white">
          Click or Drag & Drop
        </p>
      </DropzoneCard>

      <div className="w-full max-w-md mt-6 text-left">
        <label className="block mb-2 text-base font-semibold text-secondary">
          Enter pages to split on:
        </label>

        <input
          type="text"
          placeholder="1,3,5-10"
          className="w-full px-4 py-2 font-semibold border shadow-inner rounded-xl border-primary-light focus:outline-none focus:ring-2 focus:ring-primary text-primary placeholder:text-primary-light dark:text-background"
        />
      </div>

      <SendButton />
    </div>
  );
}
