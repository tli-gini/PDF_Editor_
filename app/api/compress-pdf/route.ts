// app/api/compress-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
// Build a compressed filename based on the original file name
function buildCompressedName(original: string | undefined) {
  const base = (original && original.trim()) || "document.pdf";
  // Strip possible path separators
  const justName = base.split("/").pop()!.split("\\").pop()!;
  // Ensure it has a .pdf extension
  const name = /\.pdf$/i.test(justName) ? justName : `${justName}.pdf`;
  return name.replace(/\.pdf$/i, "-compressed.pdf");
}

export async function POST(req: NextRequest) {
  try {
    const inbound = await req.formData();

    const file = inbound.get("fileInput");
    const level = inbound.get("optimizeLevel");

    // Validate required fields
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing fileInput" }, { status: 400 });
    }
    if (!level) {
      return NextResponse.json(
        { error: "Missing optimizeLevel" },
        { status: 400 }
      );
    }

    // Build FormData for upstream request
    const fd = new FormData();
    fd.append("fileInput", file);
    fd.append("optimizeLevel", String(level));

    // Forward request to Stirling PDF service
    const upstream = await fetch(
      `${NEXT_PUBLIC_API_URL}/api/v1/misc/compress-pdf`,
      { method: "POST", body: fd }
    );

    if (!upstream.ok) {
      const text = await upstream.text();
      return NextResponse.json(
        { error: "Upstream error", status: upstream.status, detail: text },
        { status: 502 }
      );
    }

    // Read PDF from upstream response
    const blob = await upstream.blob();

    // Generate download filename
    const outName = buildCompressedName((file as File).name);

    // Return response with Content-Disposition for download
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
