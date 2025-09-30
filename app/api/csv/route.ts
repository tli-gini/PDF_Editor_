// app/api/csv/route.ts

import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cdUTF8(originalPdfName: string, ext: string) {
  const base = originalPdfName.replace(/\.pdf$/i, "");
  const final = `${base}.${ext}`;
  const ascii = final.replace(/[^\x20-\x7E]/g, "_");
  const enc = encodeURIComponent(final);
  return `attachment; filename="${ascii}"; filename*=UTF-8''${enc}`;
}

function isZipSig(b: Uint8Array) {
  return (
    b.length >= 4 &&
    b[0] === 0x50 &&
    b[1] === 0x4b &&
    (b[2] === 0x03 || b[2] === 0x05 || b[2] === 0x07) &&
    (b[3] === 0x04 || b[3] === 0x06 || b[3] === 0x08)
  );
}
function getBaseUrl(): string | null {
  const isVercel = !!process.env.VERCEL;
  return isVercel
    ? process.env.NEXT_PUBLIC_API_URL || null
    : process.env.NEXT_INNER_API_URL || process.env.NEXT_PUBLIC_API_URL || null;
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const pages =
    (form.get("pages") as string | null) ||
    (form.get("pageNumbers") as string | null) ||
    "";
  if (!file)
    return NextResponse.json({ error: "Missing file" }, { status: 400 });

  const base = getBaseUrl();
  if (!base)
    return NextResponse.json({ error: "BASE URL not set" }, { status: 500 });

  const fd = new FormData();
  fd.append("fileInput", file, file.name);
  if (pages) {
    fd.append("pageNumbers", pages);
    fd.append("pages", pages);
  }

  const upstream = await fetch(`${base}/api/v1/convert/pdf/csv`, {
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

  const ctUp = upstream.headers.get("content-type");
  const cdUp = upstream.headers.get("content-disposition");

  if (upstream.body) {
    const reader = upstream.body.getReader();
    const first = await reader.read();
    const firstChunk = first.value ?? new Uint8Array(0);
    const looksZip = isZipSig(firstChunk);
    const contentType =
      ctUp ?? (looksZip ? "application/zip" : "text/csv; charset=utf-8");
    const contentDisposition =
      cdUp ?? cdUTF8(file.name, looksZip ? "zip" : "csv");

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        if (firstChunk.byteLength) controller.enqueue(firstChunk);
        const pump = (): void => {
          reader
            .read()
            .then(({ value, done }) => {
              if (done) return controller.close();
              if (value) controller.enqueue(value);
              pump();
            })
            .catch((err) => controller.error(err));
        };
        pump();
      },
      cancel() {
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

  // fallback: buffer
  const ab = await upstream.arrayBuffer();
  const buf = Buffer.from(ab);
  const looksZip = isZipSig(buf.subarray(0, 4));
  const contentType =
    ctUp ?? (looksZip ? "application/zip" : "text/csv; charset=utf-8");
  const contentDisposition =
    cdUp ?? cdUTF8(file.name, looksZip ? "zip" : "csv");
  return new NextResponse(buf, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": contentDisposition,
      "Cache-Control": "no-store",
    },
  });
}
