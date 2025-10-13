// app/api/remove-password/route.ts
export const runtime = "nodejs";

export async function POST(req: Request) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return Response.error();

  try {
    const formData = await req.formData();
    const file = formData.get("fileInput") as File | null;
    const password = formData.get("password") as string | null;

    if (!file) {
      return new Response("Missing file", { status: 400 });
    }
    if (!password || password.trim() === "") {
      return new Response("Missing password", { status: 400 });
    }

    // Forward file and password to the Stirling PDF API
    const forward = new FormData();
    forward.append("fileInput", file);
    forward.append("password", password);

    const res = await fetch(`${apiUrl}/api/v1/security/remove-password`, {
      method: "POST",
      body: forward,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Upstream error:", errorText);
      return new Response(`Failed to remove password: ${res.status}`, {
        status: 502,
      });
    }

    // Return the processed PDF to the client
    const blob = await res.arrayBuffer();
    const filename = file.name.replace(/\.pdf$/i, "") + "-nopw.pdf";

    return new Response(Buffer.from(blob), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("remove-password route error:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
