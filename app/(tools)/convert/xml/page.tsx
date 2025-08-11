// app/(tools)/convert/xml/page.tsx

"use client";
import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { LuCodeXml } from "react-icons/lu";

export default function ConvertXml() {
  const { t } = useI18n();

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<LuCodeXml className="text-3xl" />}
        label={t.tools.xml.label}
      />
      <DropzoneCard />
      <SendButton />
    </ToolPageWrapper>
  );
}
