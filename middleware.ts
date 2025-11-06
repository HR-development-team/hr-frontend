import next from "next";
import { Ruthie } from "next/font/google";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const token = request.cookies.get("token")?.value;
	const role = request.cookies.get("role")?.value;

	const { pathname } = request.nextUrl;

	const publicPath: string = "/login";
	const isPublicPath: boolean = publicPath.includes(pathname);

	if (!token && !isPublicPath) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	if (token && isPublicPath) {
		if (role === "admin") {
			return NextResponse.redirect(new URL("/admin/dashboard", request.url));
		} else if (role === "employee") {
			return NextResponse.redirect(new URL("/karyawan", request.url));
		}
	}

	// 4. Logika OTORISASI (jika sudah login dan di halaman terproteksi)
	if (token && !isPublicPath) {
		// Contoh: Proteksi route /admin
		if (pathname.startsWith("/admin") && role !== "admin") {
			// Jika bukan admin coba akses /admin, lempar ke dashboard user
			return NextResponse.redirect(new URL("/karyawan", request.url));
		}

		// Contoh: Proteksi route /dashboard (hanya untuk user)
		if (pathname.startsWith("/karyawan") && role !== "employee") {
			// Jika bukan user (misal: admin) coba akses /dashboard, lempar ke dashboard admin
			return NextResponse.redirect(new URL("/admin/dashboard", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\..*|favicon.ico).*)"],
};
