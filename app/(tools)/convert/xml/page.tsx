// app/(tools)/convert/xml/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { LuCodeXml } from "react-icons/lu";
import { useState } from "react";
import { toast } from "react-toastify";

// Identify if this runs on the cloud demo domain
const isCloudDemo =
  typeof window !== "undefined" && /\.vercel\.app$/.test(location.host);

// Turn HTTP response into a reviewer-friendly toast message
async function humanizeServerError(res: Response, t: any) {
  const ct = res.headers.get("content-type") || "";
  let detail = "";
  try {
    if (ct.includes("application/json")) {
      const data = await res.json();
      detail = String(data?.detail || data?.error || "");
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
  if (res.status === 413) {
    return (
      t.toast?.payloadTooLarge ||
      "Request payload is too large for this deployment."
    );
  }
  if (res.status === 400) {
    return detail ? `Bad request — ${detail}` : "Bad request (HTTP 400).";
  }
  if (res.status === 408) {
    return t.toast?.networkTimeout || "Network timeout. Please try again.";
  }
  return detail || `HTTP ${res.status}`;
}

export default function ConvertXml() {
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
      const res = await fetch("/api/xml", { method: "POST", body: formData });
      if (!res.ok) {
        const msg = await humanizeServerError(res, t);
        throw new Error(msg);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${files[0].name.replace(/\.pdf$/i, "")}.xml`;
      a.click();

      toast.update(toastId, {
        render: t.toast.success,
        type: "success",
        isLoading: false,
        autoClose: 1800,
      });
    } catch (err: unknown) {
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
      console.error("convert error:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<LuCodeXml className="text-3xl" />}
        label={t.tools.xml.label}
      />
      <DropzoneCard onFilesUpload={setFiles} multiple={false} />
      <SendButton onClick={handleSend} loading={loading} />
    </ToolPageWrapper>
  );
}
