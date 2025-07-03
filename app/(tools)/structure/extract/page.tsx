// app/(tools)/structure/extract/page.tsx
"use client";
import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import PageInput from "@/components/PageInput";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { MdFilter3 } from "react-icons/md";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ExtractPage() {
  const { t } = useI18n();
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (files.length === 0 || !pages.trim()) {
      toast.warn("Please upload a PDF and specify pages to extract.");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("fileInput", file));
    formData.append("pageNumbers", pages);

    try {
      const res = await fetch("/api/rearrange-pages", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const originalName = files[0].name.replace(/\.pdf$/i, "");

      a.href = url;
      a.download = `${originalName}-extract-pages.pdf`;
      a.click();

      toast.success("File processed successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Processing failed, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<MdFilter3 className="text-3xl" />}
        label={t.tools.extract.label}
      />
      <DropzoneCard onFilesUpload={setFiles} />
      <PageInput labelKey="extract" value={pages} onChange={setPages} />
      <SendButton onClick={handleUpload} loading={loading} />
    </ToolPageWrapper>
  );
}
