// api/remove-pages/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return NextResponse.error();

  const formData = await req.formData();
  const res = await fetch(`${apiUrl}/remove-pages`, {
    method: "POST",
    body: formData,
  });

  return new NextResponse(res.body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/pdf",
    },
  });
}
