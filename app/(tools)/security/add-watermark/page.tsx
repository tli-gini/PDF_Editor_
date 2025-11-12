// app/(tools)/security/add-watermark/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import ModeSelect from "@/components/ModeSelect";
import MultiPageInput, { type FieldSpec } from "@/components/MultiPageInput";
import CheckboxOption from "@/components/CheckboxOption";
import InfoToggle from "@/components/InfoToggle";
import { MdOutlineWaterDrop } from "react-icons/md";
import { useState } from "react";

export default function OcrPdf() {
  const { t } = useI18n();
  const tool = t.tools["add-watermark"];

  const typeOptions = Object.entries(tool.modes1).map(([value, label]) => ({
    value,
    label,
  }));

  const langOptions = Object.entries(tool.modes2).map(([value, label]) => ({
    value,
    label,
  }));

  const [type, setType] = useState(typeOptions[0]?.value ?? "");
  const [lang, setLang] = useState(langOptions[0]?.value ?? "");

  // MultiPageInput controlled values
  const [formVals, setFormVals] = useState<Record<string, string>>({
    "font-size": "12",
  });
  const onFieldChange = (k: string, v: string) =>
    setFormVals((s) => ({ ...s, [k]: v }));

  const fields = [
    {
      key: "starting-number",
      label: tool.fields["watermark-text"].label,
      hint: tool.fields["watermark-text"].hint,
      placeholder: tool.fields["watermark-text"].placeholder,
      type: "text",
    },
    {
      key: "font-size",
      label: tool.fields["font-size"].label,
      hint: tool.fields["font-size"].hint,
      placeholder: tool.fields["font-size"].placeholder,
      type: "number",
      min: 1,
      step: 1,
      inputMode: "numeric",
      pattern: "^\\d+$",
    },
    {
      key: "opacity",
      label: tool.fields.opacity.label,
      hint: tool.fields.opacity.hint,
      placeholder: tool.fields.opacity.placeholder,
      type: "number",
      min: 1,
      step: 1,
      inputMode: "numeric",
      pattern: "^\\d+$",
    },
    {
      key: "rotation",
      label: tool.fields.rotation.label,
      hint: tool.fields.rotation.hint,
      placeholder: tool.fields.rotation.placeholder,
      type: "number",
      min: 1,
      step: 1,
      inputMode: "numeric",
      pattern: "^\\d+$",
    },
  ] satisfies FieldSpec[];

  const [flatten, setFlatten] = useState(false);

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<MdOutlineWaterDrop className="text-3xl" />}
        label={tool.label}
      />

      <DropzoneCard multiple={false} />

      {/* Watermark Type */}
      <ModeSelect
        label={tool.modeLabel1}
        value={type}
        options={typeOptions}
        onChange={setType}
      />

      {/* Language */}
      <ModeSelect
        label={tool.modeLabel2}
        value={lang}
        options={langOptions}
        onChange={setLang}
      />

      <div className="w-full h-6 max-w-lg border-b border-white " />

      {/* Watermark Text & Options */}
      <MultiPageInput
        fields={fields}
        values={formVals}
        onChange={onFieldChange}
      />

      <div className="w-full h-6 max-w-lg border-b border-white " />

      {/* Flatten PDF */}
      <CheckboxOption
        id="add-border"
        checked={flatten}
        onChange={setFlatten}
        labelKey="add-watermark"
        labelPath="checkboxLabel"
      />

      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {tool.info}
      </InfoToggle>

      <SendButton />
    </ToolPageWrapper>
  );
}
