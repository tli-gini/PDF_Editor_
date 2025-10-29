// app/(tools)/editor/add-page-numbers/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import MultiPageInput, { type FieldSpec } from "@/components/MultiPageInput";
import ModeSelect from "@/components/ModeSelect";
import PositionSelector from "@/components/PositionSelector";
import InfoToggle from "@/components/InfoToggle";
import { MdOutlineNumbers } from "react-icons/md";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AddPageNumber() {
  const { t } = useI18n();
  const tool = t.tools["add-page-numbers"];

  // 1) File state (DropzoneCard -> onFilesUpload)
  const [file, setFile] = useState<File | null>(null);

  // 2) Selects / position / text fields
  const marginOptions = Object.entries(tool.modes1).map(([value, label]) => ({
    value,
    label,
  }));
  const fontOptions = Object.entries(tool.modes2).map(([value, label]) => ({
    value,
    label,
  }));

  const [margin, setMargin] = useState(marginOptions[0]?.value ?? "");
  const [font, setFont] = useState(fontOptions[0]?.value ?? "12");
  const [position, setPosition] = useState(8); // default to bottom-center (8)

  // MultiPageInput controlled values
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
      min: 1,
      step: 1,
      inputMode: "numeric",
      pattern: "^\\d+$",
    },
    {
      key: "starting-number",
      label: tool.fields["starting-number"].label,
      hint: tool.fields["starting-number"].hint,
      placeholder: tool.fields["starting-number"].placeholder,
      type: "number",
      min: 1,
      step: 1,
      inputMode: "numeric",
      pattern: "^\\d+$",
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

  // 3) Submit -> POST /api/add-page-numbers
  const [loading, setLoading] = useState(false);

  function hasAtMostOneDecimal(x: string) {
    return /^\d+(\.\d)?$/.test(x);
  }

  const handleSubmit = async () => {
    if (!file) {
      toast.warn(t.toast.missingFile);
      return;
    }

    // Pull values with sensible defaults
    const fontSizeStr = (formVals["font-size"] ?? "12").trim();
    const startStr = (formVals["starting-number"] ?? "1").trim();

    // Validate font size: >=1 and max one decimal
    const fontSize = Number(fontSizeStr);
    if (!(fontSize >= 1) || !hasAtMostOneDecimal(fontSizeStr)) {
      toast.error(t.toast.invalidFontSize);
      return;
    }

    // Validate starting number: integer >=1
    const startingNumber = Number(startStr);
    if (!(startingNumber >= 1) || !Number.isInteger(startingNumber)) {
      toast.error(t.toast.invalidStartingNumber);
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("fileInput", file);
      fd.append("fontSize", String(fontSize));
      fd.append("fontType", font);
      fd.append("position", String(position));
      fd.append("startingNumber", String(startingNumber));

      if (formVals["pages-to-number"])
        fd.append("pagesToNumber", formVals["pages-to-number"]);
      if (formVals["custom-text"])
        fd.append("customText", formVals["custom-text"]);
      if (margin) fd.append("customMargin", margin);

      const resp = await fetch("/api/add-page-numbers", {
        method: "POST",
        body: fd,
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || `Request failed (${resp.status})`);
      }

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name}_numbered.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success(t.toast.success);
    } catch (e) {
      console.error(e);
      toast.error(t.toast.fail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<MdOutlineNumbers className="text-3xl" />}
        label={tool.label}
      />

      {/* 1) Upload a single PDF */}
      <DropzoneCard
        multiple={false}
        onFilesUpload={(files) => setFile(files[0] ?? null)}
      />

      {/* 2) Position (independent of PDF preview) */}
      <PositionSelector value={position} onChange={setPosition} />

      {/* 3) Margin & Font selects */}
      <ModeSelect
        label={tool.modeLabel1}
        value={margin}
        options={marginOptions}
        onChange={setMargin}
      />
      <ModeSelect
        label={tool.modeLabel2}
        value={font}
        options={fontOptions}
        onChange={setFont}
      />

      {/* 4) Font Size / Starting Number / Pages / Custom Text */}
      <MultiPageInput
        fields={fields}
        values={formVals}
        onChange={onFieldChange}
      />

      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {tool.info}
      </InfoToggle>

      {/* 5) Submit */}
      <SendButton onClick={handleSubmit} loading={loading} />
    </ToolPageWrapper>
  );
}
