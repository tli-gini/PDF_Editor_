// app/api/add-image/route.ts
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

function upstreamBase() {
  return process.env.NEXT_INNER_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
}

export async function POST(req: NextRequest) {
  const base = upstreamBase();
  if (!base) {
    return new Response("Missing NEXT_PUBLIC_API_URL", { status: 500 });
  }

  // FormData（PDF + image + x,y,everyPage）
  const formData = await req.formData();

  const upstreamRes = await fetch(`${base}/api/v1/misc/add-image`, {
    method: "POST",
    body: formData,
  });

  const contentType =
    upstreamRes.headers.get("content-type") ?? "application/pdf";
  const buf = await upstreamRes.arrayBuffer();

  return new Response(buf, {
    status: upstreamRes.status,
    headers: {
      "content-type": contentType,
    },
  });
}
