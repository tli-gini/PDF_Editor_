// app/(tools)/structure/compress/page.tsx

"use client";
import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { MdOutlineZoomInMap } from "react-icons/md";

export default function Rotate() {
  const { t } = useI18n();

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<MdOutlineZoomInMap className="text-3xl" />}
        label={t.tools.compress.label}
      />

      <DropzoneCard />
      <SendButton />
    </ToolPageWrapper>
  );
}
