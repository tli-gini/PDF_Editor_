// app/(tools)/convert/word/page.tsx

"use client";
import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import InfoToggle from "@/components/InfoToggle";
import ModeSelect from "@/components/ModeSelect";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { PiFileDoc } from "react-icons/pi";
import { useState } from "react";
import { toast } from "react-toastify";

type WordFmt = "docx" | "doc" | "odt";

export default function ConvertWord() {
  const { t } = useI18n();
  const [mode, setMode] = useState<WordFmt>("docx");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const modeOptions: { value: WordFmt; label: string }[] = [
    { value: "docx", label: t.tools.word.modes.docx },
    { value: "doc", label: t.tools.word.modes.doc },
    { value: "odt", label: t.tools.word.modes.odt },
  ];

  const handleSend = async () => {
    if (!files.length) {
      toast.warn(t.toast.missingFile);
      return;
    }

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("format", mode);

    setLoading(true);
    try {
      const res = await fetch("/api/word", { method: "POST", body: formData });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${files[0].name.replace(/\\.pdf$/i, "")}.${mode}`;
      a.click();

      toast.success(t.toast.success);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.toast.fail;
      console.error("convert error:", err);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<PiFileDoc className="text-3xl" />}
        label={t.tools.word.label}
      />
      <DropzoneCard onFilesUpload={setFiles} />
      <ModeSelect
        label={t.tools.word.modeLabel}
        value={mode}
        options={modeOptions}
        onChange={(v) => setMode(v as WordFmt)}
      />
      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {t.tools.word.info}
      </InfoToggle>
      <SendButton onClick={handleSend} loading={loading} />
    </ToolPageWrapper>
  );
}
