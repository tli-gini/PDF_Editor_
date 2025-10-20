// app/api/add-password/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: Request) {
  try {
    const inForm = await req.formData();

    // accept either 'fileInput' or 'file'
    const file =
      (inForm.get("fileInput") as File | null) ||
      (inForm.get("file") as File | null);
    const userPassword = (inForm.get("password") as string | null) ?? "";

    if (!file || !userPassword?.trim()) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // optional inputs (you can omit these from the client)
    const ownerPassword = (inForm.get("ownerPassword") as string | null) ?? "";
    const keyLength = (inForm.get("keyLength") as string | null) ?? "128";

    // optional permission flags – pass-through if provided ("true"/"false")
    const passThrough = [
      "canAssembleDocument",
      "canExtractContent",
      "canExtractForAccessibility",
      "canFillInForm",
      "canModify",
      "canModifyAnnotations",
      "canPrint",
      "canPrintDegraded",
    ] as const;

    // build upstream FormData
    const forward = new FormData();
    forward.append("fileInput", file);
    forward.append("password", userPassword);
    if (ownerPassword) forward.append("ownerPassword", ownerPassword);
    if (keyLength) forward.append("keyLength", keyLength);
    for (const k of passThrough) {
      const v = inForm.get(k);
      if (typeof v === "string" && v.length) forward.append(k, v);
    }

    const upstream = await fetch(`${API_BASE}/api/v1/security/add-password`, {
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

    const buf = Buffer.from(await upstream.arrayBuffer());
    const filename =
      (file.name || "document").replace(/\.pdf$/i, "") + "-encrypted.pdf";

    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("add-password error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
