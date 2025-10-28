// app/(tools)/editor/add-page-numbers/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import MultiPageInput from "@/components/MultiPageInput";
import type { FieldSpec } from "@/components/MultiPageInput";
import ModeSelect from "@/components/ModeSelect";
import InfoToggle from "@/components/InfoToggle";
import { MdOutlineNumbers } from "react-icons/md";
import { useState } from "react";

export default function AddPageNumber() {
  const { t } = useI18n();
  const tool = t.tools["add-page-numbers"];

  const [formVals, setFormVals] = useState<Record<string, string>>({});
  const onFieldChange = (k: string, v: string) =>
    setFormVals((s) => ({ ...s, [k]: v }));

  const fields = [
    {
      key: "font-size",
      label: tool.fields["font-size"].label,
      hint: tool.fields["font-size"].hint,
      placeholder: tool.fields["font-size"].placeholder,
      type: "number",
    },
    {
      key: "starting-number",
      label: tool.fields["starting-number"].label,
      hint: tool.fields["starting-number"].hint,
      placeholder: tool.fields["starting-number"].placeholder,
      type: "number",
    },
    {
      key: "pages-to-number",
      label: tool.fields["pages-to-number"].label,
      hint: tool.fields["pages-to-number"].hint,
      placeholder: tool.fields["pages-to-number"].placeholder,
      type: "text",
    },
    {
      key: "custom-text",
      label: tool.fields["custom-text"].label,
      hint: tool.fields["custom-text"].hint,
      placeholder: tool.fields["custom-text"].placeholder,
      type: "text",
    },
  ] satisfies FieldSpec[];

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

      {/* 1. Margin Size */}
      <ModeSelect
        label={tool.modeLabel1}
        value={margin}
        options={marginOptions}
        onChange={setMargin}
      />

      {/* 2. Font Name */}
      <ModeSelect
        label={tool.modeLabel2}
        value={font}
        options={fontOptions}
        onChange={setFont}
      />

      {/* 3. Font Size → Starting Number → Pages → Custom Text */}
      <MultiPageInput
        fields={fields}
        values={formVals}
        onChange={onFieldChange}
        className="mt-2"
      />

      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {tool.info}
      </InfoToggle>

      <SendButton />
    </ToolPageWrapper>
  );
}
