// app/(tools)/structure/split/page.tsx
"use client";
import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import PageInput from "@/components/PageInput";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { MdContentCut } from "react-icons/md";

export default function Split() {
  const { t } = useI18n();

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<MdContentCut className="text-3xl" />}
        label={t.tools.split.label}
      />

      <DropzoneCard />
      <PageInput labelKey="split" />
      <SendButton />
    </ToolPageWrapper>
  );
}
