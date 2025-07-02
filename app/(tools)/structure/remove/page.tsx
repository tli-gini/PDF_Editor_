// app/(tools)/structure/remove/page.tsx
"use client";
import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import PageInput from "@/components/PageInput";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { MdOutlineDelete } from "react-icons/md";
import { useState } from "react";
import { toast } from "react-toastify";

export default function RemovePage() {
  const { t } = useI18n();
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (files.length === 0 || !pages.trim()) {
      toast.warn("Please upload a PDF and specify pages to remove.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("fileInput", file));
    formData.append("pageNumbers", pages);

    try {
      const res = await fetch("/api/remove-pages", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const originalName = files[0].name.replace(/\.pdf$/i, "");

      a.href = url;
      a.download = `${originalName}-remove-pages.pdf`;
      a.click();

      toast.success("File processed successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Processing failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<MdOutlineDelete className="text-3xl" />}
        label={t.tools.remove.label}
      />
      <DropzoneCard onFilesUpload={setFiles} />
      <PageInput labelKey="remove" value={pages} onChange={setPages} />
      <SendButton onClick={handleUpload} loading={loading} />
    </ToolPageWrapper>
  );
}
