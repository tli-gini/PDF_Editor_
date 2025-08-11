// app/(tools)/convert/markdown/page.tsx

"use client";
import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { LiaMarkdown } from "react-icons/lia";

export default function ConvertMd() {
  const { t } = useI18n();

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<LiaMarkdown className="text-3xl" />}
        label={t.tools.markdown.label}
      />
      <DropzoneCard />
      <SendButton />
    </ToolPageWrapper>
  );
}
