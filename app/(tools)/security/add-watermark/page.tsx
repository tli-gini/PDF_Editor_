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
import { MdOutlineWaterDrop, MdClose } from "react-icons/md";
import { BiImageAdd, BiSolidImageAlt } from "react-icons/bi";
import { useState, useMemo } from "react";
import { toast } from "react-toastify";

type WatermarkType = "text" | "image";

export default function AddWatermark() {
  const { t } = useI18n();
  const tool = t.tools["add-watermark"];
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // Watermark Type
  const typeOptions = useMemo(
    () =>
      Object.entries(tool.modes1).map(([value, label]) => ({ value, label })),
    [tool.modes1]
  );
  const firstType = typeOptions[0]?.value;
  const [type, setType] = useState<WatermarkType>(
    firstType === "image" ? "image" : "text"
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
    fontSize: "20",
    rotation: "0",
    opacityPercent: "50",
    widthSpacer: "50",
    heightSpacer: "50",
  });

  // Image watermark
  const [wmImageName, setWmImageName] = useState("");
  const [wmImageFile, setWmImageFile] = useState<File | null>(null);

  // Flatten
  const [flatten, setFlatten] = useState(false);

  const onFieldChange = (k: string, v: string) =>
    setFormVals((s) => ({ ...s, [k]: v }));

  // Field specs
  // Text – Font Size
  const textSizeField: FieldSpec = {
    key: "fontSize",
    label: tool.fields["font-size"].label,
    hint: tool.fields["font-size"].hint,
    placeholder: "20",
    type: "number",
    min: 1,
    step: 0.5,
    inputMode: "decimal",
    unit: "pt",
  };

  // Text – 2×2（Rotation / Opacity / Position X / Position Y）
  const textGridFields: FieldSpec[] = [
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

  // Image – Font Size
  const imageSizeField: FieldSpec = {
    ...textSizeField,
    unit: "px",
  };

  // Image – 2×2
  const imageGridFields: FieldSpec[] = [
    { ...textGridFields[0] },
    { ...textGridFields[1] },
    { ...textGridFields[2] },
    { ...textGridFields[3] },
  ];

  const handleSubmit = async () => {
    // 1) Files
    if (!pdfFiles[0]) {
      toast.error(t.toast.missingFile);
      return;
    }

    // 2) Text mode
    if (type === "text" && !formVals.watermarkText.trim()) {
      toast.error(t.toast.watermarkMissingText);
      return;
    }

    // 3) Image mode
    if (type === "image" && !wmImageFile) {
      toast.error(t.toast.watermarkMissingImage);
      return;
    }

    // 4) opacity（0–100）
    const opacityPercent = Number(formVals.opacityPercent ?? "");
    if (
      Number.isNaN(opacityPercent) ||
      opacityPercent < 0 ||
      opacityPercent > 100
    ) {
      toast.error(t.toast.watermarkInvalidOpacity);
      return;
    }

    // 5) rotation
    if (formVals.rotation.trim() !== "") {
      const rot = Number(formVals.rotation);
      if (Number.isNaN(rot)) {
        toast.error(t.toast.watermarkInvalidRotation);
        return;
      }
    }

    setLoading(true);

    // loading
    const pendingId = toast.info(t.toast.watermarkProcessing, {
      autoClose: false,
    });

    try {
      const fd = new FormData();

      // mandatory
      fd.append("fileInput", pdfFiles[0]);
      fd.append("watermarkType", type);

      if (type === "text") {
        fd.append("watermarkText", formVals.watermarkText ?? "");
        fd.append("alphabet", alphabet);
        if (formVals.customColor) {
          fd.append("customColor", formVals.customColor);
        }
      } else if (wmImageFile) {
        fd.append("watermarkImage", wmImageFile);
      }

      if (formVals.fontSize) {
        fd.append("fontSize", formVals.fontSize);
      }
      if (formVals.rotation) {
        fd.append("rotation", formVals.rotation);
      }

      // opacity: UI 0–100 → API 0–1
      const normalizedOpacity = Math.min(Math.max(opacityPercent / 100, 0), 1);
      fd.append("opacity", String(normalizedOpacity));

      if (formVals.widthSpacer) {
        fd.append("widthSpacer", formVals.widthSpacer);
      }
      if (formVals.heightSpacer) {
        fd.append("heightSpacer", formVals.heightSpacer);
      }

      // Flatten
      fd.append("convertPDFToImage", flatten ? "true" : "false");

      const res = await fetch("/api/add-watermark", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const text = await res.text();

        if (res.status === 502 || res.status === 503) {
          toast.error(t.toast.watermarkServerHeavy);
          toast.info(t.toast.cloudHint);
          return;
        }

        if (
          text.includes("Server overloaded") ||
          text.includes("capacity") ||
          text.includes("Too many requests") ||
          text.includes("memory")
        ) {
          toast.error(t.toast.watermarkServerHeavy);
          return;
        }

        toast.error(t.toast.watermarkFailed);
        throw new Error(text || `Request failed (${res.status})`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      const originalName = pdfFiles[0]?.name ?? "file.pdf";
      const baseName = originalName.replace(/\.pdf$/i, "");

      a.download = `${baseName}__watermarked.pdf`;

      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      // success
      toast.success(t.toast.watermarkDone || t.toast.success);
    } catch (err) {
      console.error(err);

      toast.error(t.toast.watermarkFailed);
    } finally {
      setLoading(false);
      toast.dismiss(pendingId);
    }
  };

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<MdOutlineWaterDrop className="text-3xl" />}
        label={tool.label}
      />

      {/* 1 Files */}
      <DropzoneCard
        multiple={false}
        onFilesUpload={(files) => {
          setPdfFiles(files);
        }}
      />

      {/* 2 Watermark Type */}
      <ModeSelect
        label={tool.modeLabel1}
        value={type}
        options={typeOptions}
        onChange={(v) => setType(v === "image" ? "image" : "text")}
      />

      {/* 3 Section（Text / Image） */}
      {type === "text" ? (
        <div key="wording-text" className="w-full max-w-lg">
          <div className="mt-6 mb-2 text-base font-semibold text-left text-secondary">
            {tool.fields["watermark-text"].label}
          </div>
          <input
            type="text"
            value={formVals.watermarkText ?? ""}
            onChange={(e) => onFieldChange("watermarkText", e.target.value)}
            placeholder={tool.fields["watermark-text"].placeholder}
            className="w-full px-4 py-2 font-semibold bg-white border shadow-inner rounded-xl border-primary-light focus:outline-none focus:ring-2 focus:ring-primary text-primary placeholder:text-primary-light dark:text-background"
          />
        </div>
      ) : (
        <div key="wording-image" className="w-full max-w-lg">
          <div className="mt-6 mb-2 text-base font-semibold text-left text-secondary">
            {tool.fields["watermark-img"].label}
          </div>
          {/* Hidden input */}
          <input
            id="wm-image-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              setWmImageName(f ? f.name : "");
              setWmImageFile(f);
            }}
          />

          <div className="flex flex-col gap-2">
            {wmImageName ? (
              <div className="flex items-center justify-between w-full px-4 py-2 bg-white border shadow-inner rounded-xl border-primary-light">
                <div className="flex items-center min-w-0 gap-2">
                  <BiSolidImageAlt className="w-5 h-5 text-primary" />
                  <span className="text-sm truncate text-primary">
                    {wmImageName}
                  </span>
                </div>
                <MdClose
                  className="w-4 h-4 text-gray-400 transition cursor-pointer hover:text-red-500"
                  onClick={() => {
                    setWmImageName("");
                    const input = document.getElementById(
                      "wm-image-input"
                    ) as HTMLInputElement | null;
                    if (input) input.value = "";
                  }}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  (
                    document.getElementById(
                      "wm-image-input"
                    ) as HTMLInputElement | null
                  )?.click()
                }
                className="flex items-center justify-center w-full gap-2 px-4 py-2 font-semibold transition bg-white border shadow-inner rounded-xl border-primary-light text-primary hover:ring-2 hover:ring-primary"
              >
                <BiImageAdd className="w-6 h-6" />
                <span>{tool.fields["watermark-img"]?.placeholder}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4 Style */}
      {type === "text" && (
        <div className="w-full max-w-lg text-left">
          {/* Watermark Color */}
          <label className="block mt-6 mb-1 text-base font-semibold text-secondary">
            {tool.fields["custom-color"]?.label ?? "Watermark Color"}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={formVals.customColor ?? ""}
              onChange={(e) => onFieldChange("customColor", e.target.value)}
              className="color-circle"
              aria-label="Watermark colour"
            />
            <input
              type="text"
              value={formVals.customColor ?? ""}
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
            {tool.languageHint && (
              <p className="mt-2 text-xs text-secondary/70">
                {tool.languageHint}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="w-full h-6 max-w-lg border-b border-white " />

      {/* 5 Formatting */}
      <div className="w-full max-w-lg">
        <MultiPageInput
          fields={[type === "text" ? textSizeField : imageSizeField]}
          values={formVals}
          onChange={onFieldChange}
        />

        {/* Rotation / Opacity / Position X / Position Y → 2×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0 ">
          {(type === "text" ? textGridFields : imageGridFields).map((field) => (
            <MultiPageInput
              key={field.key}
              fields={[field]}
              values={formVals}
              onChange={onFieldChange}
            />
          ))}
        </div>
      </div>

      <div className="w-full h-6 max-w-lg border-b border-white " />

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

      <SendButton onClick={handleSubmit} loading={loading} />
    </ToolPageWrapper>
  );
}
