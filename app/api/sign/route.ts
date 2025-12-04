// app/api/sign/route.ts
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function upstreamBase() {
  return process.env.NEXT_INNER_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
}

export async function POST(req: NextRequest) {
  try {
    const upstream = upstreamBase();
    if (!upstream) {
      return NextResponse.json(
        { error: "Missing NEXT_INNER_API_URL or NEXT_PUBLIC_API_URL" },
        { status: 500 }
      );
    }

    const form = await req.formData();

    const pdfFile = form.get("fileInput");
    const imageFile = form.get("imageFile");
    const x = form.get("x");
    const y = form.get("y");
    const everyPage = form.get("everyPage") ?? "false";

    if (!(pdfFile instanceof File)) {
      return NextResponse.json(
        { error: "fileInput is required and must be a file" },
        { status: 400 }
      );
    }
    if (!(imageFile instanceof File)) {
      return NextResponse.json(
        { error: "imageFile is required and must be a file" },
        { status: 400 }
      );
    }

    const xVal = typeof x === "string" ? x : "0";
    const yVal = typeof y === "string" ? y : "0";
    const everyPageVal =
      typeof everyPage === "string" ? everyPage : String(everyPage);

    const upstreamForm = new FormData();
    upstreamForm.append("fileInput", pdfFile);
    upstreamForm.append("imageFile", imageFile);
    upstreamForm.append("x", xVal);
    upstreamForm.append("y", yVal);
    upstreamForm.append("everyPage", everyPageVal);

    const res = await fetch(`${upstream}/api/v1/misc/add-image`, {
      method: "POST",
      body: upstreamForm,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        {
          error: "Stirling-PDF add-image failed",
          status: res.status,
          details: text,
        },
        { status: 502 }
      );
    }

    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") ?? "application/pdf";

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": 'inline; filename="signed.pdf"',
      },
    });
  } catch (err: any) {
    console.error("[/api/sign] error", err);
    return NextResponse.json(
      {
        error: "Internal error in /api/sign",
        details: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}
