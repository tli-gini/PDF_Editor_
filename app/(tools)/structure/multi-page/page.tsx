// app/(tools)/structure/multi-page/page.tsx
"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import InfoToggle from "@/components/InfoToggle";
import ModeSelect from "@/components/ModeSelect";
import CheckboxOption from "@/components/CheckboxOption";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { TbLayoutBoard } from "react-icons/tb";

export default function MultiPage() {
  const { t } = useI18n();
  const [addBorder, setAddBorder] = useState(false);
  const [mode, setMode] = useState("");

  const modeOptions = [
    { value: "2", label: t.tools["multi-page"].modes.two },
    { value: "3", label: t.tools["multi-page"].modes.three },
    { value: "4", label: t.tools["multi-page"].modes.four },
    { value: "9", label: t.tools["multi-page"].modes.nine },
    { value: "16", label: t.tools["multi-page"].modes.sixteen },
  ];

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<TbLayoutBoard className="text-3xl" />}
        label={t.tools["multi-page"].label}
      />
      <DropzoneCard />

      <ModeSelect
        label={t.tools["multi-page"].modeLabel}
        value={mode}
        options={modeOptions}
        onChange={setMode}
      />
      <CheckboxOption
        id="remove-signature"
        checked={addBorder}
        onChange={setAddBorder}
        labelKey="multi-page"
        labelPath="checkboxLabel"
      />
      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {t.tools["multi-page"].description}
      </InfoToggle>
      <SendButton />
    </ToolPageWrapper>
  );
}
