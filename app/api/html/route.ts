// app/api/html/route.ts

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function contentDispositionUTF8(originalPdfName: string, ext: string): string {
  const base = originalPdfName.replace(/\.pdf$/i, "");
  const finalName = `${base}.${ext}`;
  const asciiFallback = finalName.replace(/[^\x20-\x7E]/g, "_");
  const encoded = encodeURIComponent(finalName);
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`;
}

function isZipSig(bytes: Uint8Array): boolean {
  // ZIP signatures: PK\x03\x04 (normal), PK\x05\x06 (empty), PK\x07\x08 (spanned)
  return (
    bytes.length >= 4 &&
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    (bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07) &&
    (bytes[3] === 0x04 || bytes[3] === 0x06 || bytes[3] === 0x08)
  );
}

function getBaseUrl(): string | null {
  const isVercel = !!process.env.VERCEL;
  return isVercel
    ? process.env.NEXT_PUBLIC_API_URL || null
    : process.env.NEXT_INNER_API_URL || process.env.NEXT_PUBLIC_API_URL || null;
}

export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/html" });
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const base = getBaseUrl();
    if (!base) {
      return NextResponse.json({ error: "BASE URL not set" }, { status: 500 });
    }

    // Build upstream request
    const fd = new FormData();
    fd.append("fileInput", file, file.name); // no outputFormat needed for HTML

    const upstream = await fetch(`${base}/api/v1/convert/pdf/html`, {
      method: "POST",
      body: fd,
      headers: { Accept: "application/octet-stream" },
      cache: "no-store",
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      return NextResponse.json(
        { error: `Upstream ${upstream.status}`, detail },
        { status: upstream.status }
      );
    }

    // Prefer streaming; sniff first bytes to decide ZIP vs HTML
    const upstreamCT = upstream.headers.get("content-type");
    const upstreamCD = upstream.headers.get("content-disposition");

    // If body is streamable, peek first chunk then re-stream
    if (upstream.body) {
      const reader = upstream.body.getReader();
      const first = await reader.read();
      const firstChunk = first.value ?? new Uint8Array(0);

      const looksZip = isZipSig(firstChunk);
      const contentType =
        upstreamCT ??
        (looksZip ? "application/zip" : "text/html; charset=utf-8");
      const contentDisposition =
        upstreamCD ??
        contentDispositionUTF8(file.name, looksZip ? "zip" : "html");

      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          if (firstChunk.byteLength) controller.enqueue(firstChunk);
          const pump = (): void => {
            reader
              .read()
              .then(({ value, done }) => {
                if (done) {
                  controller.close();
                  return;
                }
                if (value) controller.enqueue(value);
                pump();
              })
              .catch((err) => controller.error(err));
          };
          pump();
        },
        cancel() {
          // Best-effort cancel
          reader.cancel().catch(() => undefined);
        },
      });

      return new NextResponse(stream, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": contentDisposition,
          "Cache-Control": "no-store",
        },
      });
    }

    // Fallback: no stream available (unlikely) → buffer then respond
    const ab = await upstream.arrayBuffer();
    const buf = Buffer.from(ab);
    const head = buf.subarray(0, 4);
    const looksZip = isZipSig(head);

    const contentType =
      upstreamCT ?? (looksZip ? "application/zip" : "text/html; charset=utf-8");
    const contentDisposition =
      upstreamCD ??
      contentDispositionUTF8(file.name, looksZip ? "zip" : "html");

    return new NextResponse(buf, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
        "Cache-Control": "no-store",
      },
    });
  } catch (e: unknown) {
    const detail = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Proxy failed", detail },
      { status: 502 }
    );
  }
}
