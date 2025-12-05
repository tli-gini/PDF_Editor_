// components/Sign/SignatureTextRenderer.tsx
"use client";

import { useEffect, useRef } from "react";

export type SignatureTextRendererProps = {
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  onRendered: (url: string | null) => void;
};

export function SignatureTextRenderer({
  text,
  fontFamily,
  fontSize,
  color,
  onRendered,
}: SignatureTextRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      onRendered(null);
      return;
    }

    const trimmed = text.trim();
    if (!trimmed) {
      onRendered(null);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      onRendered(null);
      return;
    }

    const px = Math.max(8, fontSize || 16);
    const padding = px * 0.6;

    ctx.font = `${px}px "${fontFamily}"`;
    const metrics = ctx.measureText(trimmed);
    const textWidth = metrics.width;

    const width = Math.max(1, textWidth + padding * 2);
    const height = Math.max(1, px + padding * 2);

    canvas.width = width;
    canvas.height = height;

    const ctx2 = canvas.getContext("2d");
    if (!ctx2) {
      onRendered(null);
      return;
    }

    ctx2.clearRect(0, 0, width, height);
    ctx2.font = `${px}px "${fontFamily}"`;
    ctx2.fillStyle = color;
    ctx2.textBaseline = "middle";

    ctx2.fillText(trimmed, padding, height / 2);

    const dataUrl = canvas.toDataURL("image/png");
    onRendered(dataUrl);
  }, [text, fontFamily, fontSize, color, onRendered]);

  return <canvas ref={canvasRef} className="hidden" />;
}
