import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const lang = request.cookies.get("lang")?.value || "en";
  const response = NextResponse.next();

  // Send lang to RootLayout via request header
  response.headers.set("x-lang", lang);
  return response;
}

// Apply to all routes except static ones
export const config = {
  matcher: ["/((?!_next|favicon.ico|images|fonts|api).*)"],
};
