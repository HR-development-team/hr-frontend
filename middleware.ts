import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/utils/verifyToken";

const ADMIN_ROLES = ["ROL0000001", "ROL0000002"];
const EMPLOYEE_ROLES = ["ROL0000003", "ROL0000004", "ROL0000005"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;
  const publicPath: string = "/login";
  const isPublicPath: boolean = publicPath.includes(pathname);

  let payload: any = null;
  if (token) {
    try {
      payload = await verifyToken(token);
    } catch (error) {
      console.error("Token verification failed:", error);
    }
  }

  const userRole = payload?.role_code;

  if (payload && isPublicPath) {
    if (ADMIN_ROLES.includes(userRole)) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else if (EMPLOYEE_ROLES.includes(userRole)) {
      return NextResponse.redirect(new URL("/karyawan/Dashboard", request.url));
    }
  }

  if (!payload && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // otorization
  if (payload && !isPublicPath) {
    if (pathname.startsWith("/admin")) {
      if (!ADMIN_ROLES.includes(userRole)) {
        return NextResponse.redirect(
          new URL("/karyawan/Dashboard", request.url)
        );
      }
    }

    if (pathname.startsWith("/karyawan")) {
      if (!EMPLOYEE_ROLES.includes(userRole)) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }

    if (pathname.startsWith("/karyawan")) {
      if (
        !EMPLOYEE_ROLES.includes(userRole) &&
        !ADMIN_ROLES.includes(userRole)
      ) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*|favicon.ico).*)"],
};
