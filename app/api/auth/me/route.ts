import { getAuthToken } from "@/lib/utils/authUtils";
import { getSecretKey } from "@/lib/utils/getSecretKey";
import { verifyToken } from "@/lib/utils/verifyToken";
import { API_ENDPOINTS } from "../../api";
import { Axios } from "@/lib/utils/axios";
import { NextResponse } from "next/server";

export const GET = async () => {
	const token = getAuthToken();

	try {
		if (token) {
			const verifyJwtToken = await verifyToken(token);
		}

		const response = await Axios.get(API_ENDPOINTS.GETUSER, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		return NextResponse.json(response.data);
	} catch (error: any) {
		if (error.response) {
			return NextResponse.json(
				{ message: error.response.data.message },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "Gagal mendapatkan data master divisi" },
			{ status: 500 }
		);
	}
};
