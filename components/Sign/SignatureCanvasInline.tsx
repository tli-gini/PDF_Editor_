// components/SignatureCanvasInline.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import type React from "react";

type SignatureCanvasInlineProps = {
  onChange: (url: string | null) => void;
  clearSignal?: number;
};

export default function SignatureCanvasInline({
  onChange,
  clearSignal,
}: SignatureCanvasInlineProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize canvas size and styles
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const setup = () => {
      const rect = container.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;

      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#1f1634";
    };

    setup();
    window.addEventListener("resize", setup);
    return () => window.removeEventListener("resize", setup);
  }, []);

  // Clear canvas when clearSignal changes
  useEffect(() => {
    if (clearSignal === undefined) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    const ratio = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    if (!ctx) return;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    onChange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearSignal]);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pos = getPos(e);
    lastPosRef.current = pos;
    setIsDrawing(true);
    canvasRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
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
  };

  const endStroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    setIsDrawing(false);
    try {
      canvasRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      onChange(url);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden border-2 border-dotted rounded-md border-primary-light dark:border-indigo-300 bg-white/80"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endStroke}
        onPointerLeave={endStroke}
      />
    </div>
  );
}
