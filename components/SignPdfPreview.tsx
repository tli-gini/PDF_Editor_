// components/SignPdfPreview.tsx
"use client";

import React, { useRef, useState } from "react";
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

  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!overlayRef.current) return;

    const boxRect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - boxRect.left,
      y: e.clientY - boxRect.top,
    };

    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !overlayRef.current) return;

    const containerRect = overlayRef.current.getBoundingClientRect();

    const newX = e.clientX - containerRect.left - dragOffset.current.x;
    const newY = e.clientY - containerRect.top - dragOffset.current.y;

    setPos({
      x: newX,
      y: newY,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
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
          <div
            ref={overlayRef}
            className="absolute inset-0 pointer-events-none"
          >
            <div
              className="absolute cursor-move pointer-events-auto"
              style={{ left: pos.x, top: pos.y, width: 150 }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              <img
                src={signatureUrl}
                alt="Signature preview"
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
