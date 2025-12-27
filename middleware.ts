/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@features/auth/utils/verifyToken";

const EMPLOYEE_ROLES = ["Employee"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  const loginPath = "/login";
  const adminDashboard = "/admin/dashboard";
  const employeeDashboard = "/karyawan/dashboard";

  let payload: any = null;
  if (token) {
    try {
      payload = await verifyToken(token);
    } catch (error) {
      console.error("Token verification failed:", error);
    }
  }

  const isAuthenticated = !!payload;

  // 2. CHANGE: Extract role_name instead of role_code
  // NOTE: Ensure your Backend JWT Token actually contains 'role_name' in the payload!
  const userRole = payload?.role_name;

  const isEmployee = EMPLOYEE_ROLES.includes(userRole);
  const isPublicPath = pathname === loginPath;

  // --- Scenario 1: Already Logged In (on Login Page) ---
  if (isPublicPath && isAuthenticated) {
    if (isEmployee)
      return NextResponse.redirect(new URL(employeeDashboard, request.url));
    return NextResponse.redirect(new URL(adminDashboard, request.url));
  }

  // --- Scenario 2: Not Logged In ---
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  // --- Scenario 3: Role Authorization ---
  if (isAuthenticated && !isPublicPath) {
    // Protect Admin Routes
    if (pathname.startsWith("/admin") && isEmployee) {
      return NextResponse.redirect(new URL(employeeDashboard, request.url));
    }

    // Protect Employee Routes
    if (pathname.startsWith("/karyawan") && !isEmployee) {
      return NextResponse.redirect(new URL(adminDashboard, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*|favicon.ico).*)"],
};
