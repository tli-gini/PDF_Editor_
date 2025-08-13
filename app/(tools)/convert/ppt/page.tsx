// app/(tools)/convert/ppt/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import ModeSelect from "@/components/ModeSelect";
import InfoToggle from "@/components/InfoToggle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { PiFilePpt } from "react-icons/pi";
import { useState } from "react";
import { toast } from "react-toastify";

type PPTFmt = "pptx" | "ppt" | "odp";

export default function ConvertPpt() {
  const { t } = useI18n();
  const [mode, setMode] = useState<"pptx" | "ppt" | "odp">("pptx");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const modeOptions: { value: PPTFmt; label: string }[] = [
    { value: "pptx", label: t.tools.ppt.modes.pptx },
    { value: "ppt", label: t.tools.ppt.modes.ppt },
    { value: "odp", label: t.tools.ppt.modes.odp },
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
      const res = await fetch("/api/ppt", { method: "POST", body: formData });
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
        icon={<PiFilePpt className="text-3xl" />}
        label={t.tools.ppt.label}
      />

      <DropzoneCard onFilesUpload={setFiles} multiple={false} />
      <ModeSelect
        label={t.tools.ppt.modeLabel}
        value={mode}
        options={modeOptions}
        onChange={(v) => setMode(v as PPTFmt)}
      />
      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {t.tools.ppt.info}
      </InfoToggle>
      <SendButton onClick={handleSend} loading={loading} />
    </ToolPageWrapper>
  );
}
