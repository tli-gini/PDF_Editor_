// app/(tools)/editor/add-page-numbers/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import ModeSelect from "@/components/ModeSelect";
import InfoToggle from "@/components/InfoToggle";
import { MdOutlineNumbers } from "react-icons/md";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AddPageNumber() {
  const { t } = useI18n();
  const tool = t.tools["add-page-numbers"];

  // 將 i18n 轉成 ModeSelect 需要的 {value,label} 陣列
  const marginOptions = Object.entries(tool.modes1).map(([value, label]) => ({
    value,
    label,
  }));
  const fontOptions = Object.entries(tool.modes2).map(([value, label]) => ({
    value,
    label,
  }));

  const [margin, setMargin] = useState(marginOptions[0]?.value ?? "");
  const [font, setFont] = useState(fontOptions[0]?.value ?? "");

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<MdOutlineNumbers className="text-3xl" />}
        label={tool.label}
      />

      <DropzoneCard multiple={false} />

      {/* Margin size */}
      <ModeSelect
        label={tool.modeLabel1}
        value={margin}
        options={marginOptions}
        onChange={setMargin}
      />

      {/* Font */}
      <ModeSelect
        label={tool.modeLabel2}
        value={font}
        options={fontOptions}
        onChange={setFont}
      />

      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {tool.info}
      </InfoToggle>

      <SendButton />
    </ToolPageWrapper>
  );
}
