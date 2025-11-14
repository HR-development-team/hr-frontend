import { Axios } from "@/lib/utils/axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/dist/client/components/headers";
import { API_ENDPOINTS } from "@/api/api";

export const DELETE = async (request: NextRequest) => {
	const tokenCookie = cookies().get("token");

	if (!tokenCookie) {
		return NextResponse.json(
			{ message: "Akses ditolak: Tidak terauntetikasi" },
			{ status: 401 }
		);
	}

	const token = tokenCookie.value;

	try {
		const response = await Axios.delete(API_ENDPOINTS.LOGOUT, {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		const responseData = response.data;
		cookies().delete("token");
		console.log(responseData);

		const responseToBrowser = NextResponse.json({ message: responseData });

		return responseToBrowser;
	} catch (error: any) {
		return NextResponse.json({ message: error.message }, { status: 500 });
	}
};
