// app/(tools)/structure/organize/page.tsx
"use client";
import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import PageInput from "@/components/PageInput";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { MdMoveUp } from "react-icons/md";

export default function Organize() {
  const { t } = useI18n();

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<MdMoveUp className="text-3xl" />}
        label={t.tools.organize.label}
      />

      <DropzoneCard />
      <PageInput labelKey="organize" />
      <SendButton />
    </ToolPageWrapper>
  );
}
