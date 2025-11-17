// app/api/add-watermark/route.ts
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

function upstreamBase() {
  return process.env.NEXT_INNER_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
}

export async function POST(req: NextRequest) {
  const base = upstreamBase();
  if (!base) {
    return new Response("Missing NEXT_INNER_API_URL or NEXT_PUBLIC_API_URL", {
      status: 500,
    });
  }

  const form = await req.formData();

  const fileInput = form.get("fileInput");
  const watermarkType = String(form.get("watermarkType") ?? "");
  if (!fileInput || (watermarkType !== "text" && watermarkType !== "image")) {
    return new Response("fileInput and valid watermarkType required", {
      status: 400,
    });
  }
  if (watermarkType === "text" && !form.get("watermarkText")) {
    return new Response("watermarkText required for text type", {
      status: 400,
    });
  }
  if (watermarkType === "image" && !form.get("watermarkImage")) {
    return new Response("watermarkImage required for image type", {
      status: 400,
    });
  }

  const url = `${base.replace(/\/$/, "")}/api/v1/security/add-watermark`;

  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), 60_000);

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(url, {
      method: "POST",
      body: form,
      signal: ac.signal,
    });
  } catch (err: any) {
    clearTimeout(timeout);
    const msg =
      err?.name === "AbortError"
        ? "Upstream timeout"
        : err?.message || "Upstream fetch failed";
    return new Response(msg, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }

  if (!upstreamRes.ok) {
    const text = await upstreamRes.text().catch(() => "");
    return new Response(text || `Upstream error ${upstreamRes.status}`, {
      status: upstreamRes.status,
    });
  }

  const ct = upstreamRes.headers.get("content-type") ?? "application/pdf";
  const cd =
    upstreamRes.headers.get("content-disposition") ??
    'attachment; filename="watermarked.pdf"';

  return new Response(upstreamRes.body, {
    status: 200,
    headers: {
      "Content-Type": ct,
      "Content-Disposition": cd,
      "Cache-Control": "no-store",
    },
  });
}

export async function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
