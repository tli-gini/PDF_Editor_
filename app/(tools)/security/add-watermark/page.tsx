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
import { useState, useMemo } from "react";

export default function AddWatermark() {
  const { t } = useI18n();
  const tool = t.tools["add-watermark"];

  // Watermark Type
  const typeOptions = useMemo(
    () =>
      Object.entries(tool.modes1).map(([value, label]) => ({ value, label })),
    [tool.modes1]
  );
  const [type, setType] = useState<"text" | "image">(
    (typeOptions[0]?.value as any) ?? "text"
  );

  // Font/Language（Alphabet）
  const langOptions = useMemo(
    () =>
      Object.entries(tool.modes2).map(([value, label]) => ({ value, label })),
    [tool.modes2]
  );
  const [alphabet, setAlphabet] = useState(langOptions[0]?.value ?? "roman");

  // MultiPageInput controlled values
  const [formVals, setFormVals] = useState<Record<string, string>>({
    watermarkText: "",
    customColor: "#d3d3d3",
    fontSize: "12",
    rotation: "0",
    opacityPercent: "50",
    widthSpacer: "50",
    heightSpacer: "50",
  });

  // Image watermark name
  const [wmImageName, setWmImageName] = useState("");

  // Flatten（convertPDFToImage）
  const [flatten, setFlatten] = useState(false);

  const onFieldChange = (k: string, v: string) =>
    setFormVals((s) => ({ ...s, watermarkText: "" }));

  // Field specs
  // Text
  const textFormattingFields: FieldSpec[] = [
    {
      key: "fontSize",
      label: tool.fields["font-size"].label,
      hint: tool.fields["font-size"].hint,
      placeholder: "12",
      type: "number",
      min: 1,
      step: 0.5,
      inputMode: "decimal",
      unit: "pt",
    },
    {
      key: "rotation",
      label: tool.fields.rotation.label,
      hint: tool.fields.rotation.hint,
      placeholder: "0",
      type: "number",
      step: 1,
      inputMode: "decimal",
      unit: "°",
    },
    {
      key: "opacityPercent",
      label: tool.fields.opacity.label,
      hint: tool.fields.opacity.hint,
      placeholder: "50",
      type: "number",
      min: 0,
      max: 100,
      step: 1,
      inputMode: "numeric",
      unit: "%",
    },
    {
      key: "widthSpacer",
      label: tool.fields["width-spacer"].label,
      hint: tool.fields["width-spacer"].hint,
      placeholder: "50",
      type: "number",
      step: 1,
      inputMode: "numeric",
      unit: "px",
    },
    {
      key: "heightSpacer",
      label: tool.fields["height-spacer"].label,
      hint: tool.fields["height-spacer"].hint,
      placeholder: "50",
      type: "number",
      step: 1,
      inputMode: "numeric",
      unit: "px",
    },
  ];

  // Image
  const imageFormattingFields: FieldSpec[] = [
    {
      key: "fontSize",
      label: tool.fields["font-size"].label,
      hint: tool.fields["font-size"].hint,
      placeholder: "12",
      type: "number",
      min: 1,
      step: 0.5,
      inputMode: "decimal",
      unit: "px",
    },
    {
      key: "rotation",
      label: tool.fields.rotation.label,
      hint: tool.fields.rotation.hint,
      placeholder: "0",
      type: "number",
      step: 1,
      inputMode: "decimal",
      unit: "°",
    },
    {
      key: "opacityPercent",
      label: tool.fields.opacity.label,
      hint: tool.fields.opacity.hint,
      placeholder: "50",
      type: "number",
      min: 0,
      max: 100,
      step: 1,
      inputMode: "numeric",
      unit: "%",
    },
    {
      key: "widthSpacer",
      label: tool.fields["width-spacer"].label,
      hint: tool.fields["width-spacer"].hint,
      placeholder: "50",
      type: "number",
      step: 1,
      inputMode: "numeric",
      unit: "px",
    },
    {
      key: "heightSpacer",
      label: tool.fields["height-spacer"].label,
      hint: tool.fields["height-spacer"].hint,
      placeholder: "50",
      type: "number",
      step: 1,
      inputMode: "numeric",
      unit: "px",
    },
  ];

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<MdOutlineWaterDrop className="text-3xl" />}
        label={tool.label}
      />

      {/* 1 Files */}
      <DropzoneCard multiple={false} />

      {/* 2 Watermark Type */}
      <ModeSelect
        label={tool.modeLabel1}
        value={type}
        options={typeOptions}
        onChange={(v) => setType(v as any)}
      />

      {/* 3 Section（Text: Wording / Image: Watermark File） */}
      {type === "text" ? (
        <div className="w-full max-w-lg">
          <div className="mb-2 text-base font-semibold text-secondary">
            Wording
          </div>
          <input
            type="text"
            value={formVals.watermarkText ?? ""}
            onChange={(e) => onFieldChange("watermarkText", e.target.value)}
            placeholder={tool.fields["watermark-text"].placeholder}
            className="w-full px-4 py-2 font-semibold bg-white border shadow-inner rounded-xl border-primary-light focus:outline-none focus:ring-2 focus:ring-primary text-primary"
          />
        </div>
      ) : (
        <div className="w-full max-w-lg">
          <div className="mb-2 text-base font-semibold text-secondary">
            Watermark File
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setWmImageName(f ? f.name : "");
            }}
            className="w-full px-4 py-2 font-semibold bg-white border shadow-inner rounded-xl border-primary-light focus:outline-none focus:ring-2 focus:ring-primary text-primary"
          />
          {wmImageName && (
            <p className="mt-2 text-sm text-secondary">{wmImageName}</p>
          )}
        </div>
      )}

      {/* 4 Style */}
      {type === "text" && (
        <div className="w-full max-w-lg">
          <div className="mb-2 text-base font-semibold text-secondary">
            Style
          </div>

          {/* Watermark Colour */}
          <label className="block mb-1 text-sm font-medium text-secondary">
            {tool.fields["custom-color"]?.label ?? "Watermark Color"}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={formVals.customColor ?? ""}
              onChange={(e) => onFieldChange("customColor", e.target.value)}
              className="w-10 h-10 p-0 border rounded border-primary-light"
              aria-label="Watermark colour"
            />
            <input
              type="text"
              value={formVals.customColor}
              onChange={(e) => onFieldChange("customColor", e.target.value)}
              className="flex-1 px-4 py-2 font-semibold bg-white border shadow-inner rounded-xl border-primary-light focus:outline-none focus:ring-2 focus:ring-primary text-primary"
            />
          </div>

          {/* Font/Language（Alphabet） */}
          <div className="mt-4">
            <ModeSelect
              label={tool.modeLabel2}
              value={alphabet}
              options={langOptions}
              onChange={setAlphabet}
            />
          </div>
        </div>
      )}

      {/* 5 Formatting */}
      <div className="w-full max-w-lg">
        <div className="mb-2 text-base font-semibold text-secondary">
          Formatting
        </div>
        <MultiPageInput
          fields={
            type === "text" ? textFormattingFields : imageFormattingFields
          }
          values={formVals}
          onChange={onFieldChange}
        />
      </div>

      {/* Flatten PDF pages to images */}
      <CheckboxOption
        id="flatten-pdf"
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
