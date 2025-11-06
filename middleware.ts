import next from "next";
import { Ruthie } from "next/font/google";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const token = request.cookies.get("token")?.value;

	const { pathname } = request.nextUrl;

	const publicPath: string = "/login";
	const isPublicPath: boolean = publicPath.includes(pathname);

	if (!token && !isPublicPath) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	if (token && isPublicPath) {
		return NextResponse.redirect(new URL("/admin/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\..*|favicon.ico).*)"],
};
