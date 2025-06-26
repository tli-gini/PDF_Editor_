// app/(tools)/structure/remove/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import PageInput from "@/components/PageInput";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { MdOutlineDelete } from "react-icons/md";

export default function RemovePage() {
  const { t } = useI18n();

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<MdOutlineDelete className="text-3xl" />}
        label={t.tools.remove.label}
      />

      <DropzoneCard />
      <PageInput labelKey="remove" />
      <SendButton />
    </ToolPageWrapper>
  );
}
