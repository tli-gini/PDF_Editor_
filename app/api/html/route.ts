// app/api/html/route.ts
import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  const ab = await r.arrayBuffer();
  const buf = Buffer.from(ab);
  const isZip =
    buf.length > 3 &&
    buf[0] === 0x50 &&
    buf[1] === 0x4b &&
    (buf[2] === 3 || buf[2] === 5 || buf[2] === 7) &&
    (buf[3] === 4 || buf[3] === 6 || buf[3] === 8);

  let contentType =
    r.headers.get("content-type") ||
    (isZip ? "application/zip" : "text/html; charset=utf-8");
  let cd = r.headers.get("content-disposition");
  if (!cd) {
    const baseName = file.name.replace(/\.pdf$/i, "");
    const ext = isZip ? "zip" : "html";
    cd = `attachment; filename="${baseName}.${ext}"`;
  }

  return new NextResponse(buf, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": cd,
      "Cache-Control": "no-store",
    },
  });
}
