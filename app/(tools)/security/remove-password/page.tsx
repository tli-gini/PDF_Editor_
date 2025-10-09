// app/(tools)/security/remove-password/page.tsx

"use client";
import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import PageInput from "@/components/PageInput";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { TbLockOpen2 } from "react-icons/tb";
import { useState } from "react";

export default function RemovePassword() {
  const { t } = useI18n();
  const [pages, setPages] = useState("");

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<TbLockOpen2 className="text-3xl" />}
        label={t.tools["remove-password"].label}
      />
      <DropzoneCard />
      <PageInput labelKey="remove-password" value={pages} onChange={setPages} />
      <SendButton />
    </ToolPageWrapper>
  );
}
