// app/(tools)/structure/merge/page.tsx
"use client";
import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { AiOutlineMergeCells } from "react-icons/ai";

export default function Merge() {
  const { t } = useI18n();

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<AiOutlineMergeCells className="text-3xl" />}
        label={t.tools.merge.label}
      />

      <DropzoneCard />
      <SendButton />
    </ToolPageWrapper>
  );
}
