// components/SignPdfPreview.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import PdfPreview, { type PageState } from "../PdfPreview";

export type SignaturePlacement = {
  pageIndex: number;
  xPx: number;
  yPx: number;
  widthPx: number;
  heightPx: number;
  pageScale: number;
  pageWidthPx: number;
  pageHeightPx: number;
};

type SignPdfPreviewProps = {
  file: File | null;
  signatureUrl: string | null;
  scale?: number;
  onPlacementChange?: (placement: SignaturePlacement | null) => void;
};

export default function SignPdfPreview({
  file,
  signatureUrl,
  scale = 1,
  onPlacementChange,
}: SignPdfPreviewProps) {
  const [pageState, setPageState] = useState<PageState[]>([]);
  const [current, setCurrent] = useState(1);

  // position of the signature box in overlay CSS pixels
  const [pos, setPos] = useState({ x: 100, y: 100 });

  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // overlayRef = full overlay layer inside PdfPreview
  const overlayRef = useRef<HTMLDivElement | null>(null);
  // boxRef = draggable signature box
  const boxRef = useRef<HTMLDivElement | null>(null);
  // track current page index
  const currentPageRef = useRef(1);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!boxRef.current) return;

    const boxRect = boxRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - boxRect.left,
      y: e.clientY - boxRect.top,
    };

    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !overlayRef.current || !boxRef.current) return;

    const overlayRect = overlayRef.current.getBoundingClientRect();
    const boxRect = boxRef.current.getBoundingClientRect();

    let newX = e.clientX - overlayRect.left - dragOffset.current.x;
    let newY = e.clientY - overlayRect.top - dragOffset.current.y;

    // Restrict dragging range: prevent the signature box from moving outside the PDF page area
    const maxX = overlayRect.width - boxRect.width;
    const maxY = overlayRect.height - boxRect.height;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

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

  /**
   * Emit SignaturePlacement whenever:
   * - position (pos) changes
   * - scale changes
   * - signatureUrl changes
   * - current page (current) changes <<-- New dependency
   *
   * IMPORTANT: coordinates are now measured relative to the actual PDF canvas,
   * not the outer white container. This is what makes preview and final PDF match.
   */
  useEffect(() => {
    if (!onPlacementChange) return;

    // No signature image => clear placement
    if (!signatureUrl) {
      onPlacementChange(null);
      return;
    }

    if (!overlayRef.current || !boxRef.current) return;

    const overlayRoot = overlayRef.current;

    // overlayRoot structure:
    // containerRef (relative)
    //   ├─ <canvas>  <-- the real PDF page
    //   └─ <div class="absolute inset-0">  (overlay container)
    //        └─ overlayRef (our div)
    //
    // So we go up twice to reach container, then query the canvas.
    const overlayContainer = overlayRoot.parentElement;
    const container = overlayContainer?.parentElement as HTMLDivElement | null;
    if (!container) return;

    // Find the <canvas> element rendering the PDF
    const canvas = container.querySelector("canvas");
    if (!canvas) return;

    const pageRect = canvas.getBoundingClientRect(); // Canvas on-screen size (in CSS pixels)
    const boxRect = boxRef.current.getBoundingClientRect(); // Signature box on-screen size (in CSS pixels)

    // Coordinates relative to the visible PDF page (canvas)
    // This is key: (xPx, yPx) must be the offset of the signature box's top-left corner relative to the PDF Canvas's top-left corner
    const xPx = boxRect.left - pageRect.left;
    const yPx = boxRect.top - pageRect.top;
    const widthPx = boxRect.width;
    const heightPx = boxRect.height;
    const pageWidthPx = pageRect.width;
    const pageHeightPx = pageRect.height;

    // pageScale: ratio from screen pixels → canvas internal pixels
    // internalWidth is the width of the PDF page in pdf.js pixels (e.g., 595)
    // pageWidthPx is the width on screen (e.g., 793)
    // pageScale = 793 / 595 ≈ 1.33
    const internalWidth = canvas.width || pageWidthPx || 1;
    const pageScale = pageWidthPx > 0 ? pageWidthPx / internalWidth : 1;

    onPlacementChange({
      pageIndex: currentPageRef.current,
      xPx,
      yPx,
      widthPx,
      heightPx,
      pageScale,
      pageWidthPx,
      pageHeightPx,
    });
  }, [pos, scale, signatureUrl, onPlacementChange, current]);

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
      renderOverlay={({ current: curPage }) => {
        // keep the page index in sync
        currentPageRef.current = curPage;

        return (
          signatureUrl && (
            <div
              ref={overlayRef}
              className="absolute inset-0 pointer-events-none"
            >
              <div
                ref={boxRef}
                className="absolute cursor-move pointer-events-auto"
                style={{
                  left: pos.x,
                  top: pos.y,
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              >
                <img
                  src={signatureUrl}
                  alt="Signature preview"
                  className="h-auto select-none"
                  style={{ maxWidth: `${150 * scale}px` }}
                  draggable={false}
                />
              </div>
            </div>
          )
        );
      }}
    />
  );
}
