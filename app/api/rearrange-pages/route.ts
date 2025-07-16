// api/rearrange-pages/route.ts
import { NextRequest, NextResponse } from "next/server";

const endpoint = "/api/v1/general/rearrange-pages";

export async function POST(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) return NextResponse.error();

  try {
    const formData = await req.formData();
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok || !res.body) {
      return NextResponse.json(
        { error: "Failed to rearrange pages." },
        { status: res.status }
      );
    }

    return new NextResponse(res.body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "application/pdf",
        "Content-Disposition":
          res.headers.get("content-disposition") ??
          "attachment; filename=rearranged.pdf",
      },
    });
  } catch (err) {
    console.error("Rearrange API error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
