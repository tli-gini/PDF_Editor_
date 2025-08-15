// app/api/ppt/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const fmt = ((form.get("format") as string) || "txt").toLowerCase();

  if (!file)
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  if (!new Set(["txt", "rtf"]).has(fmt))
    return NextResponse.json({ error: "Invalid format" }, { status: 400 });

  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base)
    return NextResponse.json({ error: "BASE URL not set" }, { status: 500 });

  const candidates = fmt === "rtf" ? ["Rtf", "rtf"] : ["Txt", "txt"];
  let finalResp: Response | null = null;
  let lastDetail = "";

  for (const out of candidates) {
    const fd = new FormData();
    fd.append("fileInput", file, file.name);
    fd.append("outputFormat", out);

    const r = await fetch(`${base}/api/v1/convert/pdf/text`, {
      method: "POST",
      body: fd,
      headers: { Accept: "application/octet-stream" },
      cache: "no-store",
    });

    if (r.ok) {
      finalResp = r;
      break;
    }
    const text = await r.text().catch(() => "");
    lastDetail = `Upstream ${r.status}${text ? `: ${text}` : ""}`;

    if (r.status !== 400) {
      return NextResponse.json({ error: lastDetail }, { status: r.status });
    }
  }

  if (!finalResp) {
    return NextResponse.json(
      { error: lastDetail || "Upstream 400" },
      { status: 400 }
    );
  }

  const buf = Buffer.from(await finalResp.arrayBuffer());
  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="converted.${fmt}"`,
      "Cache-Control": "no-store",
    },
  });
}
