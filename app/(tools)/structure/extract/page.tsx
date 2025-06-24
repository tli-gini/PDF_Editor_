// app/(tools)/structure/extract/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import PageInput from "@/components/PageInput";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { MdFilter3 } from "react-icons/md";

export default function ExtractPage() {
  const { t } = useI18n();

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<MdFilter3 className="text-3xl" />}
        label={t.tools.extract.label}
      />

      <DropzoneCard />
      <PageInput labelKey="extract" />
      <SendButton />
    </ToolPageWrapper>
  );
}
