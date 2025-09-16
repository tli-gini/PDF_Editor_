// app/(tools)/convert/markdown/page.tsx
"use client";
import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { LiaMarkdown } from "react-icons/lia";
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

export default function ConvertMd() {
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
      const res = await fetch("/api/markdown", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const msg = await humanizeServerError(res, { toast: t.toast });
        throw new Error(msg);
      }

      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${files[0].name.replace(/\.pdf$/i, "")}.md`;
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
      console.error("convert md error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<LiaMarkdown className="text-3xl" />}
        label={t.tools.markdown.label}
      />
      <DropzoneCard onFilesUpload={setFiles} multiple={false} />
      <SendButton onClick={handleSend} loading={loading} />
    </ToolPageWrapper>
  );
}
