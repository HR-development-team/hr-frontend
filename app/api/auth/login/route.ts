import { Axios } from "@/lib/utils/axios";
import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "../../api";
import { error } from "console";

export const POST = async (request: NextRequest) => {
	try {
		const body = await request.json();
		const response = await Axios.post(API_ENDPOINTS.LOGIN, body);

		const responseData = response.data;
		const token = responseData?.auth?.token;
		const role = responseData?.auth?.user.role;

		console.log(responseData);
		const responseToBrowser = NextResponse.json(responseData);

		if (token && role) {
			responseToBrowser.cookies.set("token", token, {
				httpOnly: true,
				secure: false, // only in development
				sameSite: "lax",
				maxAge: 60 * 60 * 24,
			});

			responseToBrowser.cookies.set("role", role, {
				httpOnly: true,
				secure: false, // only in development
				sameSite: "lax",
				maxAge: 60 * 60 * 24,
			});
		}

		return responseToBrowser;
	} catch (error: any) {
		if (error.response) {
			return NextResponse.json(
				{ message: "Email atau Password salah" },
				{ status: error.response.status }
			);
		}

		return NextResponse.json(
			{ message: "Tidak dapat terhubung ke server" },
			{ status: 500 }
		);
	}
};
