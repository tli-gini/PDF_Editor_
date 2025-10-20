// app/(tools)/security/add-password/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import InfoToggle from "@/components/InfoToggle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import MultiPageInput from "@/components/MultiPageInput";
import type { FieldSpec } from "@/components/MultiPageInput";
import { TbLock } from "react-icons/tb";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AddPassword() {
  const { t } = useI18n();
  const tool = t.tools["add-password"];

  const [form, setForm] = useState({ userPassword: "", confirmPassword: "" });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const setField = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const fields: FieldSpec[] = (
    ["userPassword", "confirmPassword"] as const
  ).map((k) => ({
    key: k,
    label: tool.fields[k].label,
    hint: tool.fields[k].hint,
    placeholder: tool.fields[k].placeholder,
    type: "password" as const,
  }));

  async function handleSend() {
    if (!file) {
      toast.error(t.toast.missingFile);
      return;
    }
    if (!form.userPassword) {
      toast.error(t.toast.missingPassword);
      return;
    }
    if (form.userPassword !== form.confirmPassword) {
      toast.error(t.toast.passwordMismatch);
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("fileInput", file);
      fd.append("password", form.userPassword);
      // Optional: fd.append("keyLength", "128"); // default is fine
      // Optional: fd.append("ownerPassword", "");

      const res = await fetch("/api/add-password", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Failed to encrypt");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name}_encrypted.pdf`;
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success(t.toast.success);
    } catch (e) {
      console.error(e);
      toast.error(t.toast.fail);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageWrapper>
      <ToolTitle icon={<TbLock className="text-3xl" />} label={tool.label} />
      <DropzoneCard
        multiple={false}
        onFilesUpload={(files) => setFile(files[0])}
      />

      <MultiPageInput fields={fields} values={form} onChange={setField} />

      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {tool.info}
      </InfoToggle>

      <SendButton onClick={handleSend} loading={loading} />
    </ToolPageWrapper>
  );
}
