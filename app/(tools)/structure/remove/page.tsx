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
      toast.warn(t.toast.missingFileAndPage);
      return;
    }
    setLoading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("fileInput", file);
        formData.append("pageNumbers", pages);

        const res = await fetch("/api/remove-pages", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error(`Error ${res.status}`);

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${file.name.replace(/\.pdf$/i, "")}-remove-pages.pdf`;
        a.click();
        toast.success(t.toast.success);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(t.toast.fail);
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
