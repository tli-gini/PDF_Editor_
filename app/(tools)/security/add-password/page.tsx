// app/(tools)/security/add-password/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import InfoToggle from "@/components/InfoToggle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { TbLock } from "react-icons/tb";

export default function AddPassword() {
  const { t } = useI18n();

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<TbLock className="text-3xl" />}
        label={t.tools["add-password"].label}
      />
      <DropzoneCard />
      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {t.tools["add-password"].info}
      </InfoToggle>
      <SendButton />
    </ToolPageWrapper>
  );
}
