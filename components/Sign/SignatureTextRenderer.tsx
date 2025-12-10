// components/Sign/SignatureTextRenderer.tsx
"use client";

import { useEffect, useRef } from "react";

interface SignatureTextRendererProps {
  text: string;
  fontFamily: string;
  color: string;
  onRendered: (dataUrl: string | null) => void;
}

export function SignatureTextRenderer({
  text,
  fontFamily,
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

    const basePointSize = 32;
    const len = trimmed.length;
    const pointSize =
      len <= 8 ? basePointSize : Math.max(20, basePointSize - (len - 8) * 1.2);

    const dpiScale = 3; // High DPI scale to avoid blur

    // Convert “points” to CSS pixels
    const pxSize = pointSize * 1.333;

    const padding = pxSize * 0.8;

    // Measure text at high DPI
    ctx.font = `${pxSize * dpiScale}px "${fontFamily}"`;
    const metrics = ctx.measureText(trimmed);

    const textWidth = metrics.width;
    const width = textWidth + padding * dpiScale * 2;
    const height = pxSize * dpiScale + padding * dpiScale * 2;

    // Internal canvas has full high-DPI resolution
    canvas.width = width;
    canvas.height = height;

    const ctx2 = canvas.getContext("2d");
    if (!ctx2) {
      onRendered(null);
      return;
    }

    ctx2.clearRect(0, 0, width, height);
    ctx2.font = `${pxSize * dpiScale}px "${fontFamily}"`;
    ctx2.fillStyle = color;
    ctx2.textBaseline = "middle";

    const x = padding * dpiScale;
    const y = height / 2;

    ctx2.fillText(trimmed, x, y);

    // Downsample to 1× for use in the preview / pdf-lib
    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = width / dpiScale;
    outputCanvas.height = height / dpiScale;

    const outCtx = outputCanvas.getContext("2d");
    if (!outCtx) {
      onRendered(null);
      return;
    }

    outCtx.drawImage(
      canvas,
      0,
      0,
      width,
      height,
      0,
      0,
      outputCanvas.width,
      outputCanvas.height
    );

    const dataUrl = outputCanvas.toDataURL("image/png");
    onRendered(dataUrl);
  }, [text, fontFamily, color, onRendered]);

  // Hidden canvas used only for generating the high-DPI image
  return <canvas ref={canvasRef} className="hidden" />;
}
