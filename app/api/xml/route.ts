// app/api/xml/route.ts
import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file)
    return NextResponse.json({ error: "Missing file" }, { status: 400 });

  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base)
    return NextResponse.json({ error: "BASE URL not set" }, { status: 500 });

  for (const out of ["Xml", "xml"]) {
    const fd = new FormData();
    fd.append("fileInput", file, file.name);
    fd.append("outputFormat", out);

    const r = await fetch(`${base}/api/v1/convert/pdf/xml`, {
      method: "POST",
      body: fd,
      headers: { Accept: "application/octet-stream" },
      cache: "no-store",
    });

    if (r.ok) {
      const buf = Buffer.from(await r.arrayBuffer());
      return new NextResponse(buf, {
        headers: {
          "Content-Type": "application/xml",
          "Content-Disposition": `attachment; filename="${file.name.replace(
            /\\.pdf$/i,
            ""
          )}.xml"`,
          "Cache-Control": "no-store",
        },
      });
    }
    if (r.status !== 400) {
      const detail = await r.text().catch(() => "");
      return NextResponse.json(
        { error: `Upstream ${r.status}`, detail },
        { status: r.status }
      );
    }
  }
  return NextResponse.json({ error: "Upstream 400" }, { status: 400 });
}
