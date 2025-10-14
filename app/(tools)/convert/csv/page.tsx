// app/(tools)/convert/csv/page.tsx
"use client";

import { useState, useMemo } from "react";
import DropzonePreview, {
  DropzonePreviewFile,
} from "@/components/DropzonePreview";
import { useI18n } from "@/lib/i18n-context";
import ToolTitle from "@/components/ToolTitle";
import InfoToggle from "@/components/InfoToggle";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import SendButton from "@/components/SendButton";
import PdfPreview, { PageState } from "@/components/PdfPreview";
import { toast } from "react-toastify";
import { PiFileCsv } from "react-icons/pi";

function rangeify(nums: number[]): string {
  const a = Array.from(new Set(nums)).sort((x, y) => x - y);
  if (!a.length) return "";
  const out: string[] = [];
  let s = a[0],
    p = a[0];
  for (let i = 1; i <= a.length; i++) {
    const cur = a[i];
    if (cur === p + 1) {
      p = cur;
      continue;
    }
    out.push(s === p ? `${s}` : `${s}-${p}`);
    s = p = cur!;
  }
  return out.join(",");
}

export default function ConvertCsv() {
  const { t } = useI18n();
  const [files, setFiles] = useState<DropzonePreviewFile[]>([]);
  const [pageState, setPageState] = useState<PageState[]>([]);
  const active = files[0] ?? null;
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const selectedPages = useMemo(
    () => pageState.filter((p) => p.selected).map((p) => p.pageNumber),
    [pageState]
  );

  async function isZipBlob(blob: Blob): Promise<boolean> {
    const head = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
    const s = head.join(",");
    return s === "80,75,3,4" || s === "80,75,5,6" || s === "80,75,7,8";
  }

  const handleSend = async () => {
    if (!active) {
      toast.warn(t.toast.missingFile);
      return;
    }
    if (!selectedPages.length) {
      toast.warn("Please select at least one page.");
      return;
    }

    const form = new FormData();
    form.append("file", active.file);
    form.append("pages", rangeify(selectedPages));

    setLoading(true);
    try {
      const res = await fetch("/api/csv", { method: "POST", body: form });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const blob = await res.blob();
      const cd = res.headers.get("content-disposition");
      let filename = cd?.match(/filename\\*=UTF-8''([^;]+)/i)?.[1];
      filename = filename
        ? decodeURIComponent(filename)
        : cd?.match(/filename=\"?([^\";]+)\"?/i)?.[1] ??
          `${active.file.name.replace(/\\.pdf$/i, "")}.csv`;

      // if the result is a zip but the filename does not end with .zip, append it
      const zip = await isZipBlob(blob);
      if (zip && !/\\.zip$/i.test(filename)) {
        filename = filename.replace(/\\.[^\\.]+$/, "") + ".zip";
      }

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      toast.success(t.toast.success);
    } catch (e) {
      const msg = e instanceof Error ? e.message : t.toast.fail;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<PiFileCsv className="text-3xl" />}
        label={t.tools.csv.label}
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
            current={current}
            setCurrent={setCurrent}
            features={{
              rotateControls: false,
              batchControls: false,
              selectionControls: true,
            }}
          />
        )}
      />
      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {t.tools.csv.info}
      </InfoToggle>
      <SendButton onClick={handleSend} loading={loading} />
    </ToolPageWrapper>
  );
}
