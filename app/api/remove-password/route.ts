// app/api/remove-password/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("fileInput") as File;
    const password = formData.get("password") as string;

    if (!file || !password)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/security/remove-password`;
    const fd = new FormData();
    fd.append("fileInput", file);
    fd.append("password", password);

    const resp = await fetch(apiUrl, { method: "POST", body: fd });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: text }, { status: 500 });
    }

    const blob = await resp.blob();
    return new Response(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=unlocked.pdf",
      },
    });
  } catch (e) {
    console.error("remove-password error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
