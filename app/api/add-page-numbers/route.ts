// app/api/add-page-numbers/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function buildOutName(original?: string) {
  const base = (original || "document.pdf").split(/[\\/]/).pop()!;
  const safe = /\.pdf$/i.test(base) ? base : `${base}.pdf`;
  return safe.replace(/\.pdf$/i, "-numbered.pdf");
}

export async function POST(req: Request) {
  try {
    const inForm = await req.formData();

    // accept either 'fileInput' or 'file'
    const file =
      (inForm.get("fileInput") as File | null) ||
      (inForm.get("file") as File | null);

    // required fields (per Swagger)
    const fontSize = (inForm.get("fontSize") as string | null) ?? "";
    const fontType = (inForm.get("fontType") as string | null) ?? "";
    const position = (inForm.get("position") as string | null) ?? "";
    const startingNumber =
      (inForm.get("startingNumber") as string | null) ?? "";

    if (!file) {
      return NextResponse.json({ error: "Missing fileInput" }, { status: 400 });
    }
    if (!fontSize || !fontType || !position || !startingNumber) {
      return NextResponse.json(
        {
          error:
            "Missing required fields (fontSize, fontType, position, startingNumber)",
        },
        { status: 400 }
      );
    }

    // basic validation/normalization
    const numFontSize = Number(fontSize);
    const numPosition = Number(position);
    const numStart = Number(startingNumber);
    if (
      !(numFontSize >= 1) ||
      !(numStart >= 1) ||
      !(numPosition >= 1 && numPosition <= 9)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid values: fontSize>=1, startingNumber>=1, position in [1..9]",
        },
        { status: 400 }
      );
    }

    // optional fields
    const pagesToNumber = (inForm.get("pagesToNumber") as string | null) ?? "";
    const customText = (inForm.get("customText") as string | null) ?? "";
    const customMargin = (inForm.get("customMargin") as string | null) ?? "";

    // build upstream FormData
    const forward = new FormData();
    forward.append("fileInput", file);
    forward.append("fontSize", String(numFontSize));
    forward.append("fontType", fontType);
    forward.append("position", String(numPosition));
    forward.append("startingNumber", String(numStart));
    if (pagesToNumber) forward.append("pagesToNumber", pagesToNumber);
    if (customText) forward.append("customText", customText);
    if (customMargin) forward.append("customMargin", customMargin);

    // call Stirling PDF backend
    const upstream = await fetch(`${API_BASE}/api/v1/misc/add-page-numbers`, {
      method: "POST",
      body: forward,
    });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      return NextResponse.json(
        { error: text || `Upstream error (${upstream.status})` },
        { status: 502 }
      );
    }

    // stream back the processed PDF with a friendly filename
    const buf = Buffer.from(await upstream.arrayBuffer());
    const filename = buildOutName(file.name);

    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("add-page-numbers error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
