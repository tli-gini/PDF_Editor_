// app/(tools)/convert/xml/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { LuCodeXml } from "react-icons/lu";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ConvertXml() {
  const { t } = useI18n();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!files.length) {
      toast.warn(t.toast.missingFile);
      return;
    }

    const formData = new FormData();
    formData.append("file", files[0]);

    setLoading(true);
    try {
      const res = await fetch("/api/xml", { method: "POST", body: formData });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${files[0].name.replace(/\\.pdf$/i, "")}.xml`;
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
        icon={<LuCodeXml className="text-3xl" />}
        label={t.tools.xml.label}
      />
      <DropzoneCard onFilesUpload={setFiles} multiple={false} />
      <SendButton onClick={handleSend} loading={loading} />
    </ToolPageWrapper>
  );
}
