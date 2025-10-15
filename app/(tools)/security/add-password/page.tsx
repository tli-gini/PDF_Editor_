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

  const [form, setForm] = useState({
    userPassword: "",
    confirmPassword: "",
  });
  const setField = (key: string, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  async function handleSend() {
    if (!form.userPassword) {
      toast.error(t.toast.missingPassword);
      return;
    }
    if (form.userPassword !== form.confirmPassword) {
      toast.error(t.toast.passwordMismatch);
      return;
    }
  }

  const fields: FieldSpec[] = (
    ["userPassword", "confirmPassword"] as const
  ).map((k) => ({
    key: k,
    label: tool.fields[k].label,
    hint: tool.fields[k].hint,
    placeholder: tool.fields[k].placeholder,
    type: "password" as const,
  }));

  return (
    <ToolPageWrapper>
      <ToolTitle icon={<TbLock className="text-3xl" />} label={tool.label} />
      <DropzoneCard />

      <MultiPageInput fields={fields} values={form} onChange={setField} />

      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {tool.info}
      </InfoToggle>

      <SendButton onClick={handleSend} />
    </ToolPageWrapper>
  );
}
