// app/(tools)/structure/compress/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import InfoToggle from "@/components/InfoToggle";
import ModeSelect from "@/components/ModeSelect";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { MdOutlineZoomInMap } from "react-icons/md";
import { useState } from "react";

export default function Rotate() {
  const { t } = useI18n();
  const [mode, setMode] = useState("");

  const modeOptions = [
    { value: "1", label: t.tools.compress.modes.one },
    { value: "2", label: t.tools.compress.modes.two },
    { value: "3", label: t.tools.compress.modes.three },
    { value: "4", label: t.tools.compress.modes.four },
    { value: "5", label: t.tools.compress.modes.five },
    { value: "6", label: t.tools.compress.modes.six },
    { value: "7", label: t.tools.compress.modes.seven },
    { value: "8", label: t.tools.compress.modes.eight },
    { value: "9", label: t.tools.compress.modes.nine },
  ];

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<MdOutlineZoomInMap className="text-3xl" />}
        label={t.tools.compress.label}
      />

      <DropzoneCard />

      <ModeSelect
        label={t.tools.compress.modeLabel}
        value={mode}
        options={modeOptions}
        onChange={setMode}
      />
      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {t.tools.compress.info}
      </InfoToggle>
      <SendButton />
    </ToolPageWrapper>
  );
}
