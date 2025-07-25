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
  const [mode, setMode] = useState("custom");
  const [loading, setLoading] = useState(false);

  const modeOptions = [
    { value: "custom", label: t.tools.organize.modes.custom },
    { value: "reverse", label: t.tools.organize.modes.reverse },
    { value: "duplex", label: t.tools.organize.modes.duplex },
    { value: "booklet", label: t.tools.organize.modes.booklet },
    {
      value: "side-stitch-booklet",
      label: t.tools.organize.modes.sideStitchBooklet,
    },
    { value: "odd-even-split", label: t.tools.organize.modes.oddEvenSplit },
    { value: "odd-even-merge", label: t.tools.organize.modes.oddEvenMerge },
    { value: "duplicate", label: t.tools.organize.modes.duplicateAll },
    { value: "remove-first", label: t.tools.organize.modes.removeFirst },
    { value: "remove-last", label: t.tools.organize.modes.removeLast },
    {
      value: "remove-first-last",
      label: t.tools.organize.modes.removeFirstLast,
    },
  ];

  const handleUpload = async () => {
    if (files.length === 0 || (mode === "custom" && !pages.trim())) {
      alert("Please upload a PDF and specify pages to extract.");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("fileInput", file));
    formData.append("mode", mode);
    if (mode === "custom") formData.append("pageNumbers", pages);

    try {
      const res = await fetch("/api/organize", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const originalName = files[0].name.replace(/\.pdf$/i, "");
      a.href = url;
      a.download = `${originalName}-organized.pdf`;
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

      {/* Mode Dropdown */}
      <div className="w-full max-w-md mt-6 text-left">
        <label className="block mb-2 text-base font-semibold text-secondary">
          {t.tools.organize.modeLabel}
        </label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full px-4 py-2 font-semibold bg-white border shadow-inner rounded-xl border-primary-light focus:outline-none focus:ring-2 focus:ring-primary text-primary dark:text-background"
        >
          {modeOptions.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-white text-primary hover:bg-primary hover:text-white"
            >
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {mode === "custom" && (
        <PageInput labelKey="organize" value={pages} onChange={setPages} />
      )}

      <SendButton onClick={handleUpload} loading={loading} />
    </ToolPageWrapper>
  );
}
