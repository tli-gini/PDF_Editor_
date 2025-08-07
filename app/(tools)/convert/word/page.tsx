// app/(tools)/convert/word/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import InfoToggle from "@/components/InfoToggle";
import ModeSelect from "@/components/ModeSelect";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { PiFileDoc } from "react-icons/pi";
import { useState } from "react";

export default function ConvertWord() {
  const { t } = useI18n();
  const [mode, setMode] = useState("");

  const modeOptions = [
    { value: "docx", label: t.tools.word.modes.docx },
    { value: "doc", label: t.tools.word.modes.doc },
    { value: "odt", label: t.tools.word.modes.odt },
  ];

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<PiFileDoc className="text-3xl" />}
        label={t.tools.word.label}
      />

      <DropzoneCard />
      <ModeSelect
        label={t.tools.word.modeLabel}
        value={mode}
        options={modeOptions}
        onChange={setMode}
      />
      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {t.tools.word.info}
      </InfoToggle>
      <SendButton />
    </ToolPageWrapper>
  );
}
