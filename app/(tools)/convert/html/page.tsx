// app/(tools)/convert/html/page.tsx

"use client";
import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { PiFileHtml } from "react-icons/pi";

export default function ConvertHtml() {
  const { t } = useI18n();

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<PiFileHtml className="text-3xl" />}
        label={t.tools.html.label}
      />
      <DropzoneCard />
      <SendButton />
    </ToolPageWrapper>
  );
}
