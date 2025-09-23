// app/(tools)/convert/html/page.tsx
"use client";
import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { PiFileHtml } from "react-icons/pi";
import { useState } from "react";
import { toast } from "react-toastify";

type ToastI18n = {
  toast?: {
    serverUnavailableWithCode?: string;
    cloudHint?: string;
    payloadTooLarge?: string;
    networkTimeout?: string;
    success?: string;
    fail?: string;
    pending?: string;
    missingFile?: string;
  };
};

type UpstreamError = { error?: unknown; detail?: unknown };

const isCloudDemo =
  typeof window !== "undefined" && /\.vercel\.app$/.test(location.host);

// ---------- helpers ----------
function parseContentDispositionFilename(h: string | null): string | null {
  if (!h) return null;
  const star = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(h);
  if (star?.[1]) {
    try {
      return decodeURIComponent(star[1].trim());
    } catch {}
  }
  const quoted = /filename\s*=\s*"([^"]+)"/i.exec(h);
  if (quoted?.[1]) return quoted[1].trim();
  const bare = /filename\s*=\s*([^;]+)/i.exec(h);
  if (bare?.[1]) return bare[1].trim();
  return null;
}

async function isZipBlob(blob: Blob): Promise<boolean> {
  const head = await blob.slice(0, 4).arrayBuffer();
  const b = new Uint8Array(head);
  const sigA = b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04; // PK\x03\x04
  const sigB = b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x05 && b[3] === 0x06; // PK\x05\x06
  return sigA || sigB;
}
// -----------------------------

async function humanizeServerError(
  res: Response,
  t: ToastI18n
): Promise<string> {
  const ct = res.headers.get("content-type") || "";
  let detail = "";
  try {
    if (ct.includes("application/json")) {
      const data = (await res.json()) as unknown;
      if (data && typeof data === "object") {
        const j = data as UpstreamError;
        if (typeof j.detail === "string") detail = j.detail;
        else if (typeof j.error === "string") detail = j.error;
      }
    } else {
      detail = (await res.text()) || "";
    }
  } catch {}

  if ([500, 502, 503, 504].includes(res.status)) {
    const tmpl =
      t.toast?.serverUnavailableWithCode ||
      "Server unavailable or over capacity (HTTP {code}).";
    const codeMsg = tmpl.replace("{code}", String(res.status));
    const hint =
      t.toast?.cloudHint ||
      (isCloudDemo
        ? "Cloud demo conversion server may be under-provisioned."
        : "Server may be under-provisioned.");
    return `${codeMsg} ${hint}${detail ? ` — ${detail}` : ""}`;
  }
  if (res.status === 413)
    return (
      t.toast?.payloadTooLarge ||
      "Request payload is too large for this deployment."
    );
  if (res.status === 400)
    return detail ? `Bad request — ${detail}` : "Bad request (HTTP 400).";
  if (res.status === 408)
    return t.toast?.networkTimeout || "Network timeout. Please try again.";
  return detail || `HTTP ${res.status}`;
}

export default function ConvertHtml() {
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
    const toastId = toast.loading(t.toast.pending ?? "Converting…");
    try {
      const res = await fetch("/api/html", { method: "POST", body: formData });
      if (!res.ok) {
        const msg = await humanizeServerError(res, { toast: t.toast });
        throw new Error(msg);
      }

      const blob = await res.blob();

      // 1) Prefer filename from Content-Disposition (if present)
      const cd = res.headers.get("content-disposition");
      let filename = parseContentDispositionFilename(cd);

      // 2) Decide ZIP vs HTML: filename ext -> magic bytes -> content-type
      let looksZip = filename?.toLowerCase().endsWith(".zip") ?? false;
      if (!looksZip) {
        looksZip = await isZipBlob(blob);
        if (!looksZip) {
          const ct = (res.headers.get("content-type") || "").toLowerCase();
          looksZip = ct.includes("zip");
        }
      }

      // 3) Safe fallback filename
      if (!filename) {
        const base = files[0].name.replace(/\.pdf$/i, "");
        filename = `${base}.${looksZip ? "zip" : "html"}`;
      } else if (!/\.[a-z0-9]+$/i.test(filename)) {
        filename = `${filename}.${looksZip ? "zip" : "html"}`;
      }

      // 4) Download
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();

      toast.update(toastId, {
        render: t.toast.success,
        type: "success",
        isLoading: false,
        autoClose: 1800,
      });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : t.toast.fail || "Conversion failed";
      toast.update(toastId, {
        render: msg,
        type: "error",
        isLoading: false,
        autoClose: 3500,
      });
      console.error("convert html error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<PiFileHtml className="text-3xl" />}
        label={t.tools.html.label}
      />
      <DropzoneCard onFilesUpload={setFiles} multiple={false} />
      <SendButton onClick={handleSend} loading={loading} />
    </ToolPageWrapper>
  );
}
