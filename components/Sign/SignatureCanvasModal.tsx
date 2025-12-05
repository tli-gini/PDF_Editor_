// components/SignatureCanvasModal.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import type React from "react";
import { useI18n } from "@/lib/i18n-context";
import { MdClose } from "react-icons/md";

type Props = {
  open: boolean;
  onClose: () => void;
  onComplete: (url: string | null) => void;
};

type Point = { x: number; y: number };
type Stroke = Point[];

export default function SignatureCanvasModal({
  open,
  onClose,
  onComplete,
}: Props) {
  const { t } = useI18n();
  const tool = t.tools.sign;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const lastPosRef = useRef<Point | null>(null);

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);

  useEffect(() => {
    if (!open) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;

    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";

    ctx.clearRect(0, 0, rect.width, rect.height);
    redrawStrokes(ctx, strokes);
  }, [open]);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const redrawStrokes = (
    ctx: CanvasRenderingContext2D,
    allStrokes: Stroke[]
  ) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    for (const stroke of allStrokes) {
      if (!stroke.length) continue;
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i += 1) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
    }
    ctx.stroke();
  };

  const handleDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pos = getPos(e);
    lastPosRef.current = pos;
    setIsDrawing(true);

    setStrokes((prev) => [...prev, [pos]]);
    setRedoStack([]);
  };

  const handleMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const pos = getPos(e);
    const last = lastPosRef.current;

    if (!last) {
      lastPosRef.current = pos;
      return;
    }

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastPosRef.current = pos;

    setStrokes((prev) => {
      if (!prev.length) {
        return [[pos]];
      }
      const next = [...prev];
      const currentStroke = next[next.length - 1];
      next[next.length - 1] = [...currentStroke, pos];
      return next;
    });
  };

  const endStroke = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    lastPosRef.current = null;
  };

  const handleUndo = () => {
    if (!strokes.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const nextStrokes = strokes.slice(0, -1);
    const popped = strokes[strokes.length - 1];

    setStrokes(nextStrokes);
    setRedoStack((prev) => [...prev, popped]);

    redrawStrokes(ctx, nextStrokes);
  };

  const handleRedo = () => {
    if (!redoStack.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const popped = redoStack[redoStack.length - 1];
    const nextRedo = redoStack.slice(0, -1);
    const nextStrokes = [...strokes, popped];

    setRedoStack(nextRedo);
    setStrokes(nextStrokes);

    redrawStrokes(ctx, nextStrokes);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    setStrokes([]);
    setRedoStack([]);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      onComplete(null);
      onClose();
      return;
    }
    const url = strokes.length ? canvas.toDataURL("image/png") : null;
    onComplete(url);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[90%] max-w-lg p-4 bg-white rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold text-primary">
            {tool.sections?.canvasTitle ?? "Draw your signature"}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-sm font-semibold rounded-full text-secondary hover:bg-primary/5 hover:text-primary dark:text-background dark:hover:text-primary"
          >
            <MdClose className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas */}
        <div
          ref={containerRef}
          className="w-full h-48 bg-white border-2 border-dotted rounded-md border-primary-light"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full touch-none"
            onPointerDown={handleDown}
            onPointerMove={handleMove}
            onPointerUp={endStroke}
            onPointerLeave={endStroke}
          />
        </div>

        {/* Undo / Redo / Clear / Apply */}
        <div className="flex items-center justify-between mt-4">
          {/* Undo / Redo */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleUndo}
              disabled={!strokes.length}
              className="px-3 py-1.5 text-sm font-semibold rounded-full border border-transparent text-secondary hover:bg-primary/5 hover:text-primary disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-secondary dark:disabled:text-primary-light dark:text-background dark:hover:text-primary"
            >
              {tool.actions?.undo ?? "Undo"}
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={!redoStack.length}
              className="px-3 py-1.5 text-sm font-semibold rounded-full border border-transparent text-secondary hover:bg-primary/5 hover:text-primary disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-secondary dark:disabled:text-primary-light dark:text-background dark:hover:text-primary"
            >
              {tool.actions?.redo ?? "Redo"}
            </button>
          </div>

          {/* Clear / Apply */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-1.5 text-sm font-semibold transition-all duration-150 ease-in-out bg-white border rounded-full border-primary text-primary hover:bg-primary/5 hover:shadow-box hover:ring-1 hover:ring-primary active:scale-95 active:bg-primary/10"
            >
              {tool.actions?.clear ?? "Clear"}
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-1.5 text-sm font-semibold text-white transition-all duration-150 ease-in-out rounded-full bg-primary hover:shadow-box hover:ring-1 hover:ring-primary active:scale-95"
            >
              {tool.actions?.apply ?? "Apply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
