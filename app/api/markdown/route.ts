// app/api/markdown/route.ts

import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function contentDispositionUTF8(originalPdfName: string, ext: string) {
  const base = originalPdfName.replace(/\.pdf$/i, "");
  const finalName = `${base}.${ext}`;
  const asciiFallback = finalName.replace(/[^\x20-\x7E]/g, "_");
  const encoded = encodeURIComponent(finalName);
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`;
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file)
    return NextResponse.json({ error: "Missing file" }, { status: 400 });

  const base =
    process.env.NEXT_INNER_API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!base)
    return NextResponse.json({ error: "BASE URL not set" }, { status: 500 });

  const fd = new FormData();
  fd.append("fileInput", file, file.name);
  const r = await fetch(`${base}/api/v1/convert/pdf/markdown`, {
    method: "POST",
    body: fd,
    headers: { Accept: "application/octet-stream" },
    cache: "no-store",
  });

  if (!r.ok) {
    const detail = await r.text().catch(() => "");
    return NextResponse.json(
      { error: `Upstream ${r.status}`, detail },
      { status: r.status }
    );
  }

  return new NextResponse(r.body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": contentDispositionUTF8(file.name, "md"),
      "Cache-Control": "no-store",
    },
  });
}
