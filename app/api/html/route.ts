// app/api/html/route.ts

import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cd(originalPdfName: string, ext: string) {
  const base = originalPdfName.replace(/\.pdf$/i, "");
  const finalName = `${base}.${ext}`;
  const ascii = finalName.replace(/[^\x20-\x7E]/g, "_");
  const enc = encodeURIComponent(finalName);
  return `attachment; filename="${ascii}"; filename*=UTF-8''${enc}`;
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file)
    return NextResponse.json({ error: "Missing file" }, { status: 400 });

  const isVercel = !!process.env.VERCEL;
  const base =
    process.env.STIRLING_BASE_URL ??
    (isVercel
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.NEXT_INNER_API_URL ?? process.env.NEXT_PUBLIC_API_URL);
  if (!base)
    return NextResponse.json({ error: "BASE URL not set" }, { status: 500 });

  const fd = new FormData();
  fd.append("fileInput", file, file.name);

  const r = await fetch(`${base}/api/v1/convert/pdf/html`, {
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

  const ct = r.headers.get("content-type") || "";
  const isZip = ct.includes("zip");
  return new NextResponse(r.body, {
    headers: {
      "Content-Type": isZip ? "application/zip" : "text/html; charset=utf-8",
      "Content-Disposition": cd(file.name, isZip ? "zip" : "html"),
      "Cache-Control": "no-store",
    },
  });
}
