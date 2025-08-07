// app/(tools)/convert/ppt/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import ModeSelect from "@/components/ModeSelect";
import InfoToggle from "@/components/InfoToggle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { PiFilePpt } from "react-icons/pi";
import { useState } from "react";

export default function ConvertPpt() {
  const { t } = useI18n();
  const [mode, setMode] = useState("");

  const modeOptions = [
    { value: "pptx", label: t.tools.ppt.modes.pptx },
    { value: "ppt", label: t.tools.ppt.modes.ppt },
    { value: "odp", label: t.tools.ppt.modes.odp },
  ];

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<PiFilePpt className="text-3xl" />}
        label={t.tools.ppt.label}
      />

      <DropzoneCard />
      <ModeSelect
        label={t.tools.ppt.modeLabel}
        value={mode}
        options={modeOptions}
        onChange={setMode}
      />
      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {t.tools.ppt.info}
      </InfoToggle>
      <SendButton />
    </ToolPageWrapper>
  );
}
