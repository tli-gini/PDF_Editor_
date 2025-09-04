// app/(tools)/structure/multi-page/page.tsx
"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import InfoToggle from "@/components/InfoToggle";
import ModeSelect from "@/components/ModeSelect";
import CheckboxOption from "@/components/CheckboxOption";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { TbLayoutBoard } from "react-icons/tb";
import { toast } from "react-toastify";

export default function MultiPage() {
  const { t } = useI18n();
  const [addBorder, setAddBorder] = useState(false);
  const [mode, setMode] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const modeOptions = [
    { value: "2", label: t.tools["multi-page"].modes.two },
    { value: "3", label: t.tools["multi-page"].modes.three },
    { value: "4", label: t.tools["multi-page"].modes.four },
    { value: "9", label: t.tools["multi-page"].modes.nine },
    { value: "16", label: t.tools["multi-page"].modes.sixteen },
  ];

  // Take the first uploaded file and store it in state
  const handleFiles = (files: File[]) => {
    setFile(files?.[0] ?? null);
  };

  const handleUpload = async () => {
    if (!file || !mode) {
      toast.warn(t.toast.missingFile);
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("fileInput", file);
      fd.append("pagesPerSheet", mode);
      fd.append("addBorder", String(addBorder));

      const res = await fetch("/api/multi-page-layout", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Try to get filename from Content-Disposition
      const cd = res.headers.get("Content-Disposition") || "";
      let serverName = "";
      const m5987 = cd.match(/filename\*=UTF-8''([^;]+)/i);
      if (m5987?.[1]) {
        try {
          serverName = decodeURIComponent(m5987[1]);
        } catch {}
      }
      if (!serverName) {
        const mQuoted = cd.match(/filename="([^"]+)"/i);
        if (mQuoted?.[1]) serverName = mQuoted[1];
      }
      if (!serverName) {
        const mPlain = cd.match(/filename=([^;]+)/i);
        if (mPlain?.[1]) serverName = mPlain[1].trim();
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download =
        serverName || `${file.name.replace(/\.pdf$/i, "")}-${mode}up.pdf`;
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
        icon={<TbLayoutBoard className="text-3xl" />}
        label={t.tools["multi-page"].label}
      />
      <DropzoneCard multiple={false} onFilesUpload={handleFiles} />

      <ModeSelect
        label={t.tools["multi-page"].modeLabel}
        value={mode}
        options={modeOptions}
        onChange={setMode}
      />
      <CheckboxOption
        id="add-border"
        checked={addBorder}
        onChange={setAddBorder}
        labelKey="multi-page"
        labelPath="checkboxLabel"
      />
      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {t.tools["multi-page"].description}
      </InfoToggle>
      <SendButton onClick={handleUpload} loading={loading} />
    </ToolPageWrapper>
  );
}
