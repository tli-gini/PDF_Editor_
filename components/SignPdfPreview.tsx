"use client";

import { useState } from "react";
import type React from "react";
import PdfPreview, { type PageState } from "./PdfPreview";

type SignPdfPreviewProps = {
  file: File | null;
  signatureUrl: string | null;
};

export default function SignPdfPreview({
  file,
  signatureUrl,
}: SignPdfPreviewProps) {
  const [pageState, setPageState] = useState<PageState[]>([]);
  const [current, setCurrent] = useState(1);
  const [pos, setPos] = useState({ x: 100, y: 100 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // TODO: Implement drag logic
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // TODO: Implement drag logic
  };

  return (
    <PdfPreview
      file={file}
      pageState={pageState}
      setPageState={setPageState}
      current={current}
      setCurrent={setCurrent}
      features={{
        rotateControls: false,
        batchControls: false,
        selectionControls: false,
      }}
      renderOverlay={() =>
        signatureUrl && (
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute cursor-move pointer-events-auto"
              style={{ left: pos.x, top: pos.y, width: 150 }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
            >
              <img
                src={signatureUrl}
                className="w-full h-auto select-none"
                draggable={false}
              />
            </div>
          </div>
        )
      }
    />
  );
}
