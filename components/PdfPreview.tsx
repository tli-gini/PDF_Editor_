// components/PdfPreview.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import type {
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist/types/src/display/api";
import { FaArrowRotateLeft, FaArrowRotateRight } from "react-icons/fa6";
import { useI18n } from "@/lib/i18n-context";

/** Windows detection for targeted canvas workaround */
const IS_WIN =
  typeof navigator !== "undefined" && /Windows/i.test(navigator.userAgent);

/** Tiny redraw helper to force a fresh paint path on buggy GPU/driver combos */
const forceCanvasRedraw = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) => {
  try {
    const prev = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(canvas, 0, 0);
    ctx.globalCompositeOperation = prev;
  } catch {
    /* no-op */
  }
};

// ---- Feature flags to reuse PdfPreview for both Rotate and CSV ----
export type PdfPreviewFeatures = {
  rotateControls?: boolean; // show single-page rotate buttons
  batchControls?: boolean; // show batch-rotate toolbar
  selectionControls?: boolean; // show per-page selection toggle
};

export type PageState = {
  pageNumber: number;
  rotation: number;
  selected?: boolean;
};

type PdfPreviewProps = {
  file: File | null;
  pageState: PageState[];
  setPageState: (next: PageState[]) => void;
  mode?: "page" | "grid"; // reserved; only "page" is implemented
  current: number;
  setCurrent: (n: number) => void;
  features?: PdfPreviewFeatures;
};

type Angle = "90" | "-90" | "180" | "reset";

export default function PdfPreview(props: PdfPreviewProps) {
  const {
    file,
    pageState,
    setPageState,
    current,
    setCurrent,
    mode = "page", // default 'page' so TS knows it's defined
    features = {
      rotateControls: true,
      batchControls: true,
      selectionControls: false,
    },
  } = props;

  const { t } = useI18n();
  const [numPages, setNumPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);

  // Single-page mode state
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [, setIsRendering] = useState(false);

  // Load PDF (dynamically import pdfjs and point workerSrc to the .mjs worker)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsRendering(true);
      if (!file) {
        setPdfDoc(null);
        setNumPages(0);
        setCurrent(1);
        setIsRendering(false);
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

      // reset UI rotations/selection for the new file
      const init: PageState[] = Array.from(
        { length: pdf.numPages },
        (_, i) => ({
          pageNumber: i + 1,
          selected: false,
          rotation: 0,
        })
      );
      setPageState(init);
      setCurrent(1);
    }
    load();
    return () => {
      cancelled = true;
    };
    // include stable deps to satisfy the hook rule
  }, [file, setPageState, setCurrent]);

  // Single-page mode: render the current page (respect per-page rotation)
  const currentRotation = pageState[current - 1]?.rotation ?? 0;
  useEffect(() => {
    if (mode !== "page") return;
    async function render() {
      setIsRendering(true);
      if (!pdfDoc || !canvasRef.current || !containerRef.current) {
        setIsRendering(false);
        return;
      }
      const page = await pdfDoc.getPage(current);

      // pdf.js: `rotation` replaces, not adds, the intrinsic page rotation.
      // Combine intrinsic page rotate with UI rotation.
      const intrinsic = (page as PDFPageProxy).rotate ?? 0; // 0/90/180/270
      const combined = (((intrinsic + currentRotation) % 360) + 360) % 360;

      const bbox = containerRef.current.clientWidth || 600;
      const base = page.getViewport({ scale: 1, rotation: combined });
      const scale = Math.max(0.1, Math.min(2, bbox / base.width));
      const viewport = page.getViewport({ scale, rotation: combined });

      // Render to an offscreen canvas, then copy to visible canvas to avoid mirroring glitches
      const off = document.createElement("canvas");
      off.width = viewport.width;
      off.height = viewport.height;
      const offCtx = off.getContext("2d", {
        alpha: false,
        willReadFrequently: true,
      } as CanvasRenderingContext2DSettings);
      if (!offCtx) {
        setIsRendering(false);
        return;
      }

      await page.render({ canvasContext: offCtx, canvas: off, viewport })
        .promise;

      if (IS_WIN) {
        // let GPU settle on Windows
        await new Promise<void>((r) => requestAnimationFrame(() => r()));
        await new Promise<void>((r) => requestAnimationFrame(() => r()));
      }

      const canvas = canvasRef.current;
      const visCtx = canvas.getContext("2d", {
        alpha: false,
      }) as CanvasRenderingContext2D | null;
      if (!visCtx) {
        setIsRendering(false);
        return;
      }

      if (typeof visCtx.setTransform === "function")
        visCtx.setTransform(1, 0, 0, 1, 0, 0);
      canvas.style.transform = "none";
      canvas.style.willChange = "auto";

      canvas.width = off.width;
      canvas.height = off.height;
      visCtx.clearRect(0, 0, canvas.width, canvas.height);
      visCtx.drawImage(off, 0, 0);

      if (IS_WIN) forceCanvasRedraw(canvas, visCtx);
      off.width = off.height = 0; // release
      setIsRendering(false);
    }
    render();
  }, [pdfDoc, current, currentRotation, mode]);

  // --- Actions ---
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

  // selection toggle for CSV use-case
  const toggleSelectCurrent = () => {
    const total = pageState.length;
    if (!total) return;
    const idx = Math.max(0, Math.min(current - 1, total - 1));
    const next = [...pageState];
    const cur = next[idx] || {
      pageNumber: idx + 1,
      rotation: 0,
      selected: false,
    };
    next[idx] = { ...cur, selected: !cur.selected };
    setPageState(next);
  };

  // ---- Helpers that were used previously but are now handled inline in JSX ----
  /**
   * prev / next / rotate / resetRotation / applyBatchRotation were previously
   * defined as local helpers and called from buttons. We now call the logic
   * inline (or via `rotateAt`) to keep the surface smaller and satisfy
   * strict ESLint rules (no-unused-vars). Keeping the old versions here as
   * commented reference for future refactors.
   */
  /*
  const prev = () => setCurrent(Math.max(1, current - 1));
  const next = () => setCurrent(Math.min(pageState.length, current + 1));
  const rotate = (delta: number) => rotateAt(delta as 90 | -90 | 180 | 0);
  const resetRotation = () => rotateAt(0);
  const applyBatchRotation = (pages: number[], deg: number) => rotateAt(deg as 90 | -90 | 180 | 0, pages);
  */

  // batch rotation input (e.g., 1,3,5-7)
  const [pagesText, setPagesText] = useState("");
  const [angle, setAngle] = useState<Angle>("90");

  // Robust page parser supporting: commas/spaces, ranges (a-b), open ranges (-b, a-), and all/*
  const parsePages = (text: string): number[] => {
    const out: number[] = [];
    const N = numPages || 0;
    if (N === 0) return out;
    const tokens = text
      .split(/[\,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    for (const tok of tokens) {
      if (tok === "*" || /^all$/i.test(tok)) {
        for (let i = 1; i <= N; i++) out.push(i);
        continue;
      }
      let m: RegExpMatchArray | null;
      if ((m = tok.match(/^(\d+)-(\d+)$/))) {
        let a = +m[1],
          b = +m[2];
        if (a > b) [a, b] = [b, a];
        a = Math.max(1, a);
        b = Math.min(N, b);
        for (let i = a; i <= b; i++) out.push(i);
        continue;
      }
      if ((m = tok.match(/^-(\d+)$/))) {
        const b = Math.min(+m[1], N);
        for (let i = 1; i <= b; i++) out.push(i);
        continue;
      }
      if ((m = tok.match(/^(\d+)-$/))) {
        const a = Math.max(+m[1], 1);
        for (let i = a; i <= N; i++) out.push(i);
        continue;
      }
      const n = parseInt(tok, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= N) out.push(n);
    }
    return Array.from(new Set(out)).sort((a, b) => a - b);
  };

  const applyBatch = () => {
    const targets = parsePages(pagesText);
    if (!targets.length) return;
    if (angle === "reset") rotateAt(0, targets);
    else rotateAt(parseInt(angle, 10) as 90 | -90 | 180, targets);
  };

  if (!file) return null;
  if (mode !== "page")
    return (
      <div className="text-white/80">Grid mode is not implemented yet.</div>
    );

  const canPrev = current > 1;
  const canNext = current < numPages;

  return (
    <div className="flex flex-col w-full gap-3 pt-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold text-white/90">
          Page {current} / {numPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 text-sm rounded-md bg-white/80 hover:bg-white dark:hover:bg-background disabled:opacity-50"
            onClick={() => canPrev && setCurrent(Math.max(1, current - 1))}
            disabled={!canPrev}
          >
            {t.components.pdfPreview.prev}
          </button>
          <button
            className="px-2 py-1 text-sm rounded-md bg-white/80 hover:bg-white dark:hover:bg-background disabled:opacity-50"
            onClick={() =>
              canNext && setCurrent(Math.min(numPages, current + 1))
            }
            disabled={!canNext}
          >
            {t.components.pdfPreview.next}
          </button>

          {/* Selection toggle — only visible for CSV/selection mode */}
          {features?.selectionControls && (
            <button
              className="px-2 py-1 text-sm rounded-md bg-white/80 hover:bg-white dark:hover:bg-background"
              onClick={toggleSelectCurrent}
            >
              {pageState[current - 1]?.selected ? "Unselect" : "Select"}
            </button>
          )}

          {/* Rotate controls — hidden on CSV */}
          {features?.rotateControls && (
            <>
              <button
                className="px-2 py-1.5 text-base rounded-md bg-white/80 dark:hover:bg-background hover:bg-white"
                title="Rotate -90"
                onClick={() => rotateAt(-90)}
              >
                <FaArrowRotateLeft />
              </button>
              <button
                className="px-2 py-1.5 text-base rounded-md bg-white/80 dark:hover:bg-background hover:bg-white"
                title="Rotate +90"
                onClick={() => rotateAt(90)}
              >
                <FaArrowRotateRight />
              </button>
              <button
                className="px-2 py-1 text-sm rounded-md bg-white/80 dark:hover:bg-background hover:bg-white"
                title="Reset"
                onClick={() => rotateAt(0)}
              >
                {t.components.pdfPreview.reset}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Canvas container */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden bg-white rounded-md"
      >
        <canvas ref={canvasRef} className="block mx-auto" />
      </div>

      {/* Batch rotation — hidden on CSV */}
      {features?.batchControls && (
        <div className="flex flex-col gap-2 rounded-md bg-white/80">
          <div className="flex items-start">
            <label className="block mt-2 text-base font-semibold text-secondary">
              {t.tools.rotate.inputLabel}
              <span className="ml-2 text-base font-normal whitespace-pre-wrap text-secondary">
                {t.tools.rotate.inputHint}
              </span>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={pagesText}
              onChange={(e) => setPagesText(e.target.value)}
              placeholder="1,3,5-7"
              className="flex-1 px-3 py-2 text-sm font-semibold border rounded-md placeholder:text-primary-light border-primary-light focus:outline-none focus:ring-2 focus:ring-primary text-primary"
            />
            <select
              className="px-3 py-2 text-sm border rounded-md shadow-inner text-secondary dark:text-background hover:dark:text-secondary border-primary-light focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-primary-light "
              value={angle}
              onChange={(e) => setAngle(e.target.value as Angle)}
            >
              <option value="90">+90°</option>
              <option value="-90">-90°</option>
              <option value="180">180°</option>
              <option value="reset">{t.components.pdfPreview.reset}</option>
            </select>
            <button
              className="px-2 py-2 text-sm text-center text-white rounded-md hover:bg-primary bg-secondary dark:bg-background hover:dark:bg-primary"
              onClick={applyBatch}
            >
              {t.components.pdfPreview.apply}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
