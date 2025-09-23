// app/api/xml/route.ts
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

export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/xml" });
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file)
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  if (file.size > 50 * 1024 * 1024)
    return NextResponse.json({ error: "File too large" }, { status: 413 });

  const base =
    process.env.NEXT_INNER_API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!base)
    return NextResponse.json({ error: "BASE URL not set" }, { status: 500 });

  try {
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
        // Stream the upstream body back to the client (avoid arrayBuffer memory spike)
        return new NextResponse(r.body, {
          headers: {
            "Content-Type": "application/xml",
            "Content-Disposition": contentDispositionUTF8(file.name, "xml"),
            "Cache-Control": "no-store",
          },
        });
      }

      const detail = await r.text().catch(() => "");
      if (r.status !== 400) {
        return new NextResponse(
          JSON.stringify({ error: `Upstream ${r.status}`, detail }),
          {
            status: r.status,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      // 400 → try the other casing
    }

    return NextResponse.json({ error: "Upstream 400" }, { status: 400 });
  } catch (e: unknown) {
    const detail = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Proxy failed", detail },
      { status: 502 }
    );
  }
}
