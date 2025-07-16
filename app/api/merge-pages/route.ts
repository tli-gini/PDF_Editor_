// app/api/merge-pages/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const endpoint = "/api/v1/general/merge-pdfs";
  const fullUrl = `${baseUrl}${endpoint}`;

  if (!baseUrl) return NextResponse.error();

  try {
    const formData = await req.formData();
    const files = formData.getAll("files");
    const removeSignature = formData.get("removeSignature") === "true";

    const properFormData = new FormData();
    files.forEach((file) => {
      if (file instanceof Blob) {
        properFormData.append("fileInput", file);
      }
    });

    properFormData.append("removeCertSign", String(removeSignature));
    properFormData.append("sortType", ""); // optional

    const res = await fetch(fullUrl, {
      method: "POST",
      body: properFormData,
    });

    if (!res.ok || !res.body) {
      return NextResponse.json(
        { error: "Failed to merge PDFs." },
        { status: res.status }
      );
    }

    return new NextResponse(res.body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "application/pdf",
        "Content-Disposition":
          res.headers.get("content-disposition") ??
          "attachment; filename=merged.pdf",
      },
    });
  } catch (err) {
    console.error("Merge API error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
