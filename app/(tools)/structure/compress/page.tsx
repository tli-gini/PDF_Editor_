// app/(tools)/structure/compress/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import InfoToggle from "@/components/InfoToggle";
import ModeSelect from "@/components/ModeSelect";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { MdOutlineZoomInMap } from "react-icons/md";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CompressPage() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState("1"); // Default optimization level
  const [loading, setLoading] = useState(false);

  const modeOptions = [
    { value: "1", label: t.tools.compress.modes.one },
    { value: "2", label: t.tools.compress.modes.two },
    { value: "3", label: t.tools.compress.modes.three },
    { value: "4", label: t.tools.compress.modes.four },
    { value: "5", label: t.tools.compress.modes.five },
    { value: "6", label: t.tools.compress.modes.six },
    { value: "7", label: t.tools.compress.modes.seven },
    { value: "8", label: t.tools.compress.modes.eight },
    { value: "9", label: t.tools.compress.modes.nine },
  ];

  // Handle uploaded files (only take the first one)
  const handleFiles = (files: File[]) => {
    setFile(files?.[0] ?? null);
  };

  // Send file and compression level to the backend
  const handleUpload = async () => {
    if (!file) {
      toast.warn(t.toast.missingFile);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fileInput", file);
      formData.append("optimizeLevel", mode);

      const res = await fetch("/api/compress-pdf", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Receive compressed file as Blob
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // Trigger browser download
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace(/\.pdf$/i, "")}-compressed.pdf`;
      a.click();

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
        icon={<MdOutlineZoomInMap className="text-3xl" />}
        label={t.tools.compress.label}
      />

      <DropzoneCard multiple={false} onFilesUpload={handleFiles} />

      {/* Select compression level (1–9) */}
      <ModeSelect
        label={t.tools.compress.modeLabel}
        value={mode}
        options={modeOptions}
        onChange={setMode}
      />

      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {t.tools.compress.info}
      </InfoToggle>

      <SendButton onClick={handleUpload} loading={loading} />
    </ToolPageWrapper>
  );
}
