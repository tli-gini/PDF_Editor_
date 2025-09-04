// app/api/multi-page-layout/route.ts
import { NextRequest, NextResponse } from "next/server";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

// Build output filename with pagesPerSheet suffix (e.g., report-2up.pdf)
function buildOutName(original?: string, pages?: string | null) {
  const base = (original || "document.pdf").split(/[\\/]/).pop()!;
  const safe = /\.pdf$/i.test(base) ? base : `${base}.pdf`;
  const suffix = pages ? `-${pages}up.pdf` : "-nup.pdf";
  return safe.replace(/\.pdf$/i, suffix);
}

export async function POST(req: NextRequest) {
  try {
    const inbound = await req.formData();
    const file = inbound.get("fileInput");
    const pages = inbound.get("pagesPerSheet");
    const addBorder = inbound.get("addBorder");

    // Validate input
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing fileInput" }, { status: 400 });
    }
    if (!pages) {
      return NextResponse.json(
        { error: "Missing pagesPerSheet" },
        { status: 400 }
      );
    }

    // Build FormData for upstream request
    const fd = new FormData();
    fd.append("fileInput", file);
    fd.append("pagesPerSheet", String(pages));
    fd.append("addBorder", String(addBorder));

    // Send to Stirling PDF backend
    const upstream = await fetch(
      `${NEXT_PUBLIC_API_URL}/api/v1/general/multi-page-layout`,
      { method: "POST", body: fd }
    );

    if (!upstream.ok) {
      const text = await upstream.text();
      return NextResponse.json(
        { error: "Upstream error", status: upstream.status, detail: text },
        { status: 502 }
      );
    }

    // Return the processed PDF with custom filename
    const blob = await upstream.blob();
    const outName = buildOutName((file as File).name, pages as string);

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          outName
        ).replace(/%20/g, " ")}"; filename*=UTF-8''${encodeURIComponent(
          outName
        )}`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
