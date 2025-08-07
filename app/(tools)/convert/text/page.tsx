// app/(tools)/convert/text/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import ModeSelect from "@/components/ModeSelect";
import InfoToggle from "@/components/InfoToggle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { PiFileTxt } from "react-icons/pi";
import { useState } from "react";

export default function ConvertText() {
  const { t } = useI18n();
  const [mode, setMode] = useState("");

  const modeOptions = [
    { value: "txt", label: t.tools.text.modes.txt },
    { value: "rtf", label: t.tools.text.modes.rtf },
  ];

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<PiFileTxt className="text-3xl" />}
        label={t.tools.text.label}
      />

      <DropzoneCard />
      <ModeSelect
        label={t.tools.text.modeLabel}
        value={mode}
        options={modeOptions}
        onChange={setMode}
      />
      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {t.tools.text.info}
      </InfoToggle>
      <SendButton />
    </ToolPageWrapper>
  );
}
