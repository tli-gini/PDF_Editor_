// app/(tools)/structure/merge/page.tsx
"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import DropzoneSortable from "@/components/DropzoneSortable";
// import CheckboxOption from "@/components/CheckboxOption";
import InfoToggle from "@/components/InfoToggle";
import { AiOutlineMergeCells } from "react-icons/ai";
import { toast } from "react-toastify";

export default function Merge() {
  const { t } = useI18n();
  const [files, setFiles] = useState<File[]>([]);
  // const [removeSignature, setRemoveSignature] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.warn(t.toast.missingFile);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      // formData.append("removeSignature", String(removeSignature));

      const res = await fetch("/api/merge-pages", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();

      toast.success(t.toast.success);
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
        icon={<AiOutlineMergeCells className="text-3xl" />}
        label={t.tools.merge.label}
      />

      <DropzoneSortable onFilesChange={setFiles} />

      {/* <CheckboxOption
        id="remove-signature"
        checked={removeSignature}
        onChange={setRemoveSignature}
        labelKey="merge"
        labelPath="checkboxLabel"
      /> */}

      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {t.tools.merge.description}
      </InfoToggle>
      <SendButton onClick={handleUpload} loading={loading} />
    </ToolPageWrapper>
  );
}
