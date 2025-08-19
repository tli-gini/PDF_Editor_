// components/PdfPreview.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";

export type PageState = {
  pageNumber: number; // 1-based
  selected: boolean;
  rotation: 0 | 90 | 180 | 270;
};

type PdfPreviewProps = {
  file: File | null;
  pageState: PageState[];
  setPageState: (next: PageState[]) => void;
  // Reserved: future toggle for a thumbnail grid; for now we implement "page" mode only
  mode?: "page" | "grid";
};

type Angle = "90" | "-90" | "180" | "reset";

export function PdfPreview({
  file,
  pageState,
  setPageState,
  mode = "page",
}: PdfPreviewProps) {
  const [numPages, setNumPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);

  // Single-page mode state
  const [current, setCurrent] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load PDF (dynamically import pdfjs and point workerSrc to the .mjs worker)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!file) {
        setPdfDoc(null);
        setNumPages(0);
        setCurrent(1);
        return;
      }
      const pdfjs = (await import("pdfjs-dist")) as typeof import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();

      const buf = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: buf });
      const pdf = (await loadingTask.promise) as PDFDocumentProxy;
      if (cancelled) return;

      setPdfDoc(pdf);
      setNumPages(pdf.numPages);

      // Initialize pageState if needed
      if (pageState.length !== pdf.numPages) {
        const init: PageState[] = Array.from(
          { length: pdf.numPages },
          (_, i) => ({
            pageNumber: i + 1,
            selected: false,
            rotation: 0 as const,
          })
        );
        setPageState(init);
      }
      setCurrent(1);
    }
    load();
    return () => {
      cancelled = true;
    };
    // Include stable deps to satisfy the hook rule
  }, [file, pageState.length, setPageState]);

  // Single-page mode: render the current page (respect per-page rotation)
  const currentRotation = pageState[current - 1]?.rotation ?? 0;
  useEffect(() => {
    if (mode !== "page") return;
    async function render() {
      if (!pdfDoc || !canvasRef.current || !containerRef.current) return;
      const page = await pdfDoc.getPage(current);

      const bbox = containerRef.current.clientWidth || 600;
      const base = page.getViewport({ scale: 1 });
      const scale = Math.max(0.1, Math.min(2, bbox / base.width));

      const viewport = page.getViewport({ scale, rotation: currentRotation });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, canvas, viewport }).promise;
    }
    render();
  }, [pdfDoc, current, currentRotation, mode]);

  const canPrev = current > 1;
  const canNext = current < numPages;

  const rotateAt = (delta: 90 | -90 | 180 | 0, targets?: number[]) => {
    const arr = [...pageState];
    const apply = (idx: number) => {
      const cur = arr[idx].rotation;
      const next =
        delta === 0 ? 0 : (((cur + delta + 360) % 360) as 0 | 90 | 180 | 270);
      arr[idx] = { ...arr[idx], rotation: next };
    };
    if (targets?.length) {
      for (const p of targets) if (p >= 1 && p <= arr.length) apply(p - 1);
    } else {
      apply(current - 1);
    }
    setPageState(arr);
  };

  // batch rotation input (e.g., 1,3,5-7)
  const [pagesText, setPagesText] = useState("");
  const [angle, setAngle] = useState<Angle>("90");
  const parsePages = (text: string): number[] => {
    const out: number[] = [];
    text.split(/[,\\s]+/).forEach((tok) => {
      if (!tok) return;
      const m = tok.match(/^(\\d+)-(\\d+)$/);
      if (m) {
        const a = parseInt(m[1], 10);
        const b = parseInt(m[2], 10);
        const [s, e] = a <= b ? [a, b] : [b, a];
        for (let i = s; i <= e; i++) out.push(i);
      } else {
        const n = parseInt(tok, 10);
        if (!Number.isNaN(n)) out.push(n);
      }
    });
    return Array.from(new Set(out));
  };
  const applyBatch = () => {
    const targets = parsePages(pagesText);
    if (!targets.length) return;
    if (angle === "reset") rotateAt(0, targets);
    else rotateAt(parseInt(angle, 10) as 90 | -90 | 180, targets);
  };

  if (!file) return;
  if (mode !== "page")
    return (
      <div className="text-white/80">Grid mode is not implemented yet.</div>
    );

  return (
    <div className="flex flex-col w-full gap-3">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/90">
          Page {current} / {numPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 text-xs rounded bg-white/80 hover:bg-white dark:hover:bg-background disabled:opacity-50"
            onClick={() => canPrev && setCurrent((c) => Math.max(1, c - 1))}
            disabled={!canPrev}
          >
            Prev
          </button>
          <button
            className="px-2 py-1 text-xs rounded bg-white/80 hover:bg-white dark:hover:bg-background disabled:opacity-50"
            onClick={() =>
              canNext && setCurrent((c) => Math.min(numPages, c + 1))
            }
            disabled={!canNext}
          >
            Next
          </button>
          <button
            className="px-2 py-1 text-xs rounded bg-white/80 dark:hover:bg-background hover:bg-white"
            title="Rotate -90"
            onClick={() => rotateAt(-90)}
          >
            ⟲
          </button>
          <button
            className="px-2 py-1 text-xs rounded bg-white/80 dark:hover:bg-background hover:bg-white"
            title="Rotate +90"
            onClick={() => rotateAt(90)}
          >
            ⟳
          </button>
          <button
            className="px-2 py-1 text-xs rounded bg-white/80 dark:hover:bg-background hover:bg-white"
            title="Reset"
            onClick={() => rotateAt(0)}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Canvas container */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden bg-white rounded-md"
      >
        <canvas ref={canvasRef} className="block mx-auto" />
      </div>

      {/* Batch rotation */}
      <div className="flex flex-col gap-2 p-2 rounded-md bg-white/80">
        <div className="text-xs text-black/80">
          Batch rotate pages (e.g., 1,3,5-7)
        </div>
        <div className="flex items-center gap-2">
          <input
            value={pagesText}
            onChange={(e) => setPagesText(e.target.value)}
            placeholder="Pages"
            className="flex-1 px-2 py-1 text-sm border rounded"
          />
          <select
            className="px-2 py-1 text-sm border rounded"
            value={angle}
            onChange={(e) => setAngle(e.target.value as Angle)}
          >
            <option value="90">+90°</option>
            <option value="-90">-90°</option>
            <option value="180">180°</option>
            <option value="reset">Reset</option>
          </select>
          <button
            className="px-2 py-1 text-xs text-white bg-black rounded"
            onClick={applyBatch}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
