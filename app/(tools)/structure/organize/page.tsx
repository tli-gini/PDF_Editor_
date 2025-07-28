// app/(tools)/structure/organize/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import ModeSelect from "@/components/ModeSelect";
import PageInput from "@/components/PageInput";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { MdMoveUp } from "react-icons/md";
import { useState } from "react";
import { toast } from "react-toastify";

export default function OrganizePage() {
  const { t } = useI18n();
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState("");
  const [mode, setMode] = useState("CUSTOM");
  const [loading, setLoading] = useState(false);

  const modeOptions = [
    { value: "CUSTOM", label: t.tools.organize.modes.CUSTOM },
    { value: "REVERSE_ORDER", label: t.tools.organize.modes.REVERSE_ORDER },
    { value: "DUPLEX_SORT", label: t.tools.organize.modes.DUPLEX_SORT },
    { value: "BOOKLET_SORT", label: t.tools.organize.modes.BOOKLET_SORT },
    {
      value: "SIDE_STITCH_BOOKLET",
      label: t.tools.organize.modes.SIDE_STITCH_BOOKLET,
    },
    { value: "ODD_EVEN_SPLIT", label: t.tools.organize.modes.ODD_EVEN_SPLIT },
    { value: "ODD_EVEN_MERGE", label: t.tools.organize.modes.ODD_EVEN_MERGE },
    { value: "DUPLICATE_ALL", label: t.tools.organize.modes.DUPLICATE_ALL },
    { value: "REMOVE_FIRST", label: t.tools.organize.modes.REMOVE_FIRST },
    { value: "REMOVE_LAST", label: t.tools.organize.modes.REMOVE_LAST },
    {
      value: "REMOVE_FIRST_AND_LAST",
      label: t.tools.organize.modes.REMOVE_FIRST_AND_LAST,
    },
  ];

  const handleUpload = async () => {
    if (files.length === 0 || (mode === "CUSTOM" && !pages.trim())) {
      toast.warn(t.toast.missingFileAndPage);
      return;
    }
    setLoading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("fileInput", file);
        formData.append("customMode", mode);
        if (mode === "CUSTOM") {
          formData.append("pageNumbers", pages);
        }

        const res = await fetch("/api/rearrange-pages", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error(`Error ${res.status}`);

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${file.name.replace(/\.pdf$/i, "")}-organized.pdf`;
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
        icon={<MdMoveUp className="text-3xl" />}
        label={t.tools.organize.label}
      />
      <DropzoneCard onFilesUpload={setFiles} />

      <ModeSelect
        label={t.tools.organize.modeLabel}
        value={mode}
        options={modeOptions}
        onChange={setMode}
      />

      {mode === "CUSTOM" && (
        <PageInput labelKey="organize" value={pages} onChange={setPages} />
      )}

      <SendButton onClick={handleUpload} loading={loading} />
    </ToolPageWrapper>
  );
}
