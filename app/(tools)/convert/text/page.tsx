// app/(tools)/convert/text/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import ModeSelect from "@/components/ModeSelect";
import InfoToggle from "@/components/InfoToggle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { PiFileTxt } from "react-icons/pi";
import { useState } from "react";
import { toast } from "react-toastify";

type TextFmt = "txt" | "rtf";

export default function ConvertText() {
  const { t } = useI18n();
  const [mode, setMode] = useState<"txt" | "rtf">("txt");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const modeOptions = [
    { value: "txt", label: t.tools.text.modes.txt },
    { value: "rtf", label: t.tools.text.modes.rtf },
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
      const res = await fetch("/api/text", { method: "POST", body: formData });
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
        icon={<PiFileTxt className="text-3xl" />}
        label={t.tools.text.label}
      />

      <DropzoneCard onFilesUpload={setFiles} multiple={false} />
      <ModeSelect
        label={t.tools.text.modeLabel}
        value={mode}
        options={modeOptions}
        onChange={(v) => setMode(v as TextFmt)}
      />
      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {t.tools.text.info}
      </InfoToggle>
      <SendButton onClick={handleSend} loading={loading} />
    </ToolPageWrapper>
  );
}
