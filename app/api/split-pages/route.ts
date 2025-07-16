// api/split-pages/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return NextResponse.error();

  const formData = await req.formData();
  const res = await fetch(`${apiUrl}/api/v1/general/split-pages`, {
    method: "POST",
    body: formData,
  });

  const contentType = res.headers.get("content-type") ?? "application/zip";
  const contentDisposition =
    res.headers.get("content-disposition") ??
    "attachment; filename=split-pages.zip";

  return new NextResponse(res.body, {
    status: res.status,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": contentDisposition,
    },
  });
}
