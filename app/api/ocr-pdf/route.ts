// app/api/ocr-pdf/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const API_BASE =
  process.env.NEXT_INNER_API_URL || process.env.NEXT_PUBLIC_API_URL;

//  Restrict ocrType to valid values; default to "skip-text" if invalid
function normalizeOcrType(x?: string) {
  const valid = ["skip-text", "force-ocr", "Normal"];
  return valid.includes(x ?? "") ? (x as string) : "skip-text";
}

//  Restrict ocrRenderType to either "hocr" or "sandwich"; default to "hocr"
function normalizeRenderType(x?: string) {
  return x === "sandwich" ? "sandwich" : "hocr";
}

export async function POST(req: Request) {
  try {
    //  Parse incoming multipart/form-data
    const inForm = await req.formData();

    //  Get file (accepts both 'fileInput' or 'file' field names)
    const file =
      (inForm.get("fileInput") as File | null) ||
      (inForm.get("file") as File | null);

    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    //  Normalize OCR options (to avoid invalid values from UI)
    const rawType = inForm.get("ocrType");
    const ocrType = normalizeOcrType(
      typeof rawType === "string" ? rawType : undefined
    );

    const rawRender = inForm.get("ocrRenderType");
    const ocrRenderType = normalizeRenderType(
      typeof rawRender === "string" ? rawRender : undefined
    );

    //  Extract and normalize language codes
    const langsIn = inForm
      .getAll("languages")
      .filter((v) => typeof v === "string") as string[];

    //  Prepare FormData for forwarding to Stirling API
    const forward = new FormData();

    //  Include the file with filename (some backends use filename for MIME detection)
    const filename = (file as File).name || "document.pdf";
    forward.append("fileInput", file, filename);

    //  Language passing strategy
    if (langsIn.length <= 1) {
      if (langsIn[0]) forward.append("languages", langsIn[0]);
    } else {
      langsIn.forEach((lang) => forward.append("languages", lang));
    }

    //  Add OCR mode and rendering type
    forward.append("ocrType", ocrType);
    forward.append("ocrRenderType", ocrRenderType);

    //  Send request to the upstream Stirling API
    const upstream = await fetch(`${API_BASE}/api/v1/misc/ocr-pdf`, {
      method: "POST",
      body: forward,
    });

    if (!upstream.ok) {
      //  If the upstream returns error, capture and forward its error text for debugging
      const text = await upstream.text().catch(() => "");
      return NextResponse.json(
        {
          error:
            text ||
            `Upstream error (${upstream.status}) from ${API_BASE}/api/v1/misc/ocr-pdf`,
        },
        { status: 502 }
      );
    }

    const buf = Buffer.from(await upstream.arrayBuffer());
    const outName = filename.replace(/\.pdf$/i, "") + "-ocr.pdf";

    //  Return binary PDF with correct headers for automatic download
    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${outName}"`,
      },
    });
  } catch (err) {
    console.error("ocr-pdf error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
