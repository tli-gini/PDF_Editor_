// app/(tools)/structure/organize/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import PageInput from "@/components/PageInput";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { MdMoveUp } from "react-icons/md";
import { useState } from "react";

export default function OrganizePage() {
  const { t } = useI18n();
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (files.length === 0 || !pages.trim()) {
      alert("Please upload a PDF and specify pages to extract.");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("fileInput", file));
    formData.append("pageNumbers", pages);

    try {
      const res = await fetch("/api/organize", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "organize.pdf";
      a.click();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Processing failed, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<MdMoveUp className="text-3xl" />}
        label={t.tools.organize.label}
      />
      <DropzoneCard onFilesUpload={setFiles} />
      <PageInput labelKey="organize" value={pages} onChange={setPages} />
      <SendButton onClick={handleUpload} loading={loading} />
    </ToolPageWrapper>
  );
}
