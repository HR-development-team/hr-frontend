import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/utils/verifyToken";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;
  const publicPath: string = "/login";
  const isPublicPath: boolean = publicPath.includes(pathname);

  let payload: any = null;
  if (token) {
    payload = await verifyToken(token);
  }

  if (payload && isPublicPath) {
    const role = payload.role;
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else if (role === "employee") {
      return NextResponse.redirect(new URL("/karyawan/Dashboard", request.url));
    }
  }

  if (!payload && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // otorization
  if (payload && !isPublicPath) {
    const role = payload.role;
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/karyawan/Dashboard", request.url));
    }

    if (pathname.startsWith("/karyawan") && role !== "employee") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*|favicon.ico).*)"],
};
