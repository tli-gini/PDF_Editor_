// app/(tools)/editor/ocr-pdf/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import MultiCheckboxList, {
  type MCOption,
} from "@/components/MultiCheckboxList";
import ModeSelect from "@/components/ModeSelect";
import CheckboxOption from "@/components/CheckboxOption";
import InfoToggle from "@/components/InfoToggle";
import { MdManageSearch } from "react-icons/md";
import { useState } from "react";

const langOptions: MCOption[] = [
  { value: "eng", label: "English" },
  { value: "chi_sim", label: "Chinese" },
  { value: "fre", label: "French" },
  { value: "deu", label: "German" },
  { value: "por", label: "Portuguese" },
];

export default function OcrPdf() {
  const { t } = useI18n();
  const tool = t.tools["ocr-pdf"];

  const [langs, setLangs] = useState<string[]>(["eng"]);

  const modeOptions = Object.entries(tool.modes1).map(([value, label]) => ({
    value,
    label,
  }));

  const [mode, setMode] = useState(modeOptions[0]?.value ?? "");
  const [compatibility, setCompatibility] = useState(false);

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<MdManageSearch className="text-3xl" />}
        label={tool.label}
      />

      <DropzoneCard multiple={false} />

      {/* Languages */}
      <MultiCheckboxList
        label="Languages"
        options={langOptions}
        values={langs}
        onChange={setLangs}
        columns={3}
      />

      {/* OCR Mode */}
      <ModeSelect
        label={tool.modeLabel1}
        value={mode}
        options={modeOptions}
        onChange={setMode}
      />

      <div className="w-full h-6 max-w-lg border-b border-white " />

      {/* Compatibility Mode */}
      <CheckboxOption
        id="add-border"
        checked={compatibility}
        onChange={setCompatibility}
        labelKey="ocr-pdf"
        labelPath="checkboxLabel"
      />

      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {tool.info}
      </InfoToggle>

      <SendButton />
    </ToolPageWrapper>
  );
}
