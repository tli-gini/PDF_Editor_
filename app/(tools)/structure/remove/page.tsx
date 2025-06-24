// app/(tools)/structure/remove/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import PageInput from "@/components/PageInput";
import { MdOutlineDelete } from "react-icons/md";

export default function ExtractPage() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center lg:w-9/12 md:w-9/12 rounded-2xl bg-primary-light">
      <ToolTitle
        icon={<MdOutlineDelete className="text-3xl" />}
        label={t.tools.remove.label}
      />

      <DropzoneCard />
      <PageInput labelKey="remove" />
      <SendButton />
    </div>
  );
}
