// app/(tools)/structure/rotate/page.tsx
"use client";

import { useState } from "react";
import DropzonePreview, {
  DropzonePreviewFile,
} from "@/components/DropzonePreview";
import { useI18n } from "@/lib/i18n-context";
import ToolTitle from "@/components/ToolTitle";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import InfoToggle from "@/components/InfoToggle";
import SendButton from "@/components/SendButton";
import { PdfPreview, PageState } from "@/components/PdfPreview";
import { toast } from "react-toastify";
import { MdRotateRight } from "react-icons/md";
import { PDFDocument, degrees } from "pdf-lib";

export default function RotatePage() {
  const { t } = useI18n();
  const [files, setFiles] = useState<DropzonePreviewFile[]>([]);
  const [pageState, setPageState] = useState<PageState[]>([]);
  const active = files[0] ?? null; // single-file flow for rotate; can extend to multi-file later

  async function handleRotateAndDownload() {
    try {
      if (!active) {
        toast.warn("Please upload a PDF first.");
        return;
      }
      if (pageState.length === 0) {
        toast.warn("Preview not ready yet.");
        return;
      }
      const fileBuf = await active.file.arrayBuffer();
      const pdf = await PDFDocument.load(fileBuf);

      // If no explicit selection, apply rotations to all pages that have rotation != 0
      const targets = pageState.filter((p) => p.selected || p.rotation !== 0);
      if (targets.length === 0) {
        toast.info("No changes to apply.");
        return;
      }

      for (const p of targets) {
        const page = pdf.getPage(p.pageNumber - 1);
        // Apply rotation relative to current rotation
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + p.rotation) % 360));
      }

      const bytes = await pdf.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${active.file.name.replace(/\.pdf$/i, "")}-rotated.pdf`;
      a.click();
      toast.success("Rotated PDF downloaded.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to rotate PDF.");
    }
  }

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<MdRotateRight className="text-3xl" />}
        label={t.tools.rotate.label}
      />
      <DropzonePreview
        multiple={false}
        onFilesChange={setFiles}
        renderRightPanel={({ files: f }) => (
          <PdfPreview
            mode="page"
            file={f.length ? f[0].file : null}
            pageState={pageState}
            setPageState={setPageState}
          />
        )}
      />
      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {t.tools.rotate.info}
      </InfoToggle>

      <SendButton onClick={handleRotateAndDownload} />
    </ToolPageWrapper>
  );
}
