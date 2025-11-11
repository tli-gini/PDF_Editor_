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
import { toast } from "react-toastify";

const langOptions: MCOption[] = [
  { value: "eng", label: "English" },
  { value: "chi_sim", label: "Chinese" },
  { value: "fra", label: "French" },
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

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!file) {
      toast.error(t.toast.missingFile);
      return;
    }
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("fileInput", file);

      // languages -> array<string>
      langs.forEach((lang) => fd.append("languages", lang));

      // ocrType from select (skip-text / force-ocr / Normal)
      fd.append("ocrType", mode);

      // Compatibility Mode -> render type
      fd.append("ocrRenderType", compatibility ? "sandwich" : "hocr");

      const res = await fetch("/api/ocr-pdf", { method: "POST", body: fd });
      if (!res.ok) {
        let msg = "OCR failed";
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
        } catch {}
        throw new Error(msg);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name}_ocr.pdf`;
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
  }

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<MdManageSearch className="text-3xl" />}
        label={tool.label}
      />

      <DropzoneCard
        multiple={false}
        onFilesUpload={(files) => setFile(files[0])}
      />

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
        id="compatibility-mode"
        checked={compatibility}
        onChange={setCompatibility}
        labelKey="ocr-pdf"
        labelPath="checkboxLabel"
      />

      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {tool.info}
      </InfoToggle>

      <SendButton onClick={handleSend} loading={loading} />
    </ToolPageWrapper>
  );
}
