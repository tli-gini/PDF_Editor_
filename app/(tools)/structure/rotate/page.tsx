// app/(tools)/structure/rotate/page.tsx
"use client";
import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { MdOutlineRotateRight } from "react-icons/md";

export default function Rotate() {
  const { t } = useI18n();

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<MdOutlineRotateRight className="text-3xl" />}
        label={t.tools.rotate.label}
      />

      <DropzoneCard />
      <SendButton />
    </ToolPageWrapper>
  );
}
