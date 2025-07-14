// app/(tools)/structure/multi-page/page.tsx
"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import DropzoneCard from "@/components/DropzoneCard";
import ToolTitle from "@/components/ToolTitle";
import CheckboxOption from "@/components/CheckboxOption";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import { TbLayoutBoard } from "react-icons/tb";

export default function MultiPage() {
  const { t } = useI18n();
  const [addBorder, setAddBorder] = useState(false);

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<TbLayoutBoard className="text-3xl" />}
        label={t.tools["multi-page"].label}
      />
      <DropzoneCard />
      <CheckboxOption
        id="remove-signature"
        checked={addBorder}
        onChange={setAddBorder}
        labelKey="multi-page"
        labelPath="checkboxLabel"
      />

      <SendButton />
    </ToolPageWrapper>
  );
}
