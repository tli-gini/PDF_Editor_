// app/(tools)/security/remove-password/page.tsx
"use client";

import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import MultiPageInput from "@/components/MultiPageInput";
import InfoToggle from "@/components/InfoToggle";
import { TbLockOpen2 } from "react-icons/tb";
import { useState } from "react";
import { toast } from "react-toastify";

export default function RemovePassword() {
  const { t } = useI18n();
  const tool = t.tools["remove-password"];

  const [form, setForm] = useState({
    password: "",
  });

  const setField = (key: string, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  async function handleSend() {
    if (!form.password) {
      toast.error(t.toast.missingPassword);
      return;
    }
  }

  const fields = [
    {
      key: "password",
      label: tool.fields.password.label,
      hint: tool.fields.password.hint,
      placeholder: tool.fields.password.placeholder,
      type: "password" as const,
    },
  ];

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<TbLockOpen2 className="text-3xl" />}
        label={tool.label}
      />

      <DropzoneCard />

      <MultiPageInput fields={fields} values={form} onChange={setField} />
      <InfoToggle title={t.misc.showInfo} hideTitle={t.misc.hideInfo}>
        {tool.info}
      </InfoToggle>
      <SendButton onClick={handleSend} />
    </ToolPageWrapper>
  );
}
