// app/(tools)/structure/merge/page.tsx
"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import ToolTitle from "@/components/ToolTitle";
import SendButton from "@/components/SendButton";
import ToolPageWrapper from "@/components/ToolPageWrapper";
import DropzoneSortable from "@/components/DropzoneSortable";
import CheckboxOption from "@/components/CheckboxOption";
import { AiOutlineMergeCells } from "react-icons/ai";

export default function Merge() {
  const { t } = useI18n();
  const [files, setFiles] = useState<File[]>([]);
  const [removeSignature, setRemoveSignature] = useState(false);

  return (
    <ToolPageWrapper>
      <ToolTitle
        icon={<AiOutlineMergeCells className="text-3xl" />}
        label={t.tools.merge.label}
      />

      <DropzoneSortable onFilesChange={setFiles} />

      <CheckboxOption
        id="remove-signature"
        checked={removeSignature}
        onChange={setRemoveSignature}
        labelKey="merge"
        labelPath="checkboxLabel"
      />

      <SendButton onClick={() => console.log(files)} />
    </ToolPageWrapper>
  );
}
