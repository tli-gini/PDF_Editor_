// api/remove-pages/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const endpoint = "/api/v1/general/remove-pages";
  if (!baseUrl) return NextResponse.error();

  try {
    const formData = await req.formData();
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok || !res.body) {
      return NextResponse.json(
        { error: "Failed to remove pages." },
        { status: res.status }
      );
    }

    return new NextResponse(res.body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "application/pdf",
        "Content-Disposition":
          res.headers.get("content-disposition") ??
          "attachment; filename=removed.pdf",
      },
    });
  } catch (err) {
    console.error("Remove pages API error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
