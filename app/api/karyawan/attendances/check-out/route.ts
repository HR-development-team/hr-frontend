import { API_ENDPOINTS } from "@/app/api/api";
import { getAuthToken } from "@/lib/utils/authUtils";
import { Axios } from "@/lib/utils/axios";
import { NextRequest, NextResponse } from "next/server";

const tokenAvailable = (token: string | null) => {
	if (!token) {
		return NextResponse.json({ message: "Akses ditolak" }, { status: 401 });
	}
	return null;
};

// Handler untuk EMPLOYEECHECKOUT
export const PUT = async (request: NextRequest) => {
	const token = getAuthToken();
	const unauthorizedResponse = tokenAvailable(token);
	if (unauthorizedResponse) return unauthorizedResponse;

	try {
        // [FIX 400 ERROR]
        // Sama seperti check-in, kita kirim 'undefined' sebagai body
		const response = await Axios.put(API_ENDPOINTS.EMPLOYEECHECKOUT, undefined, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return NextResponse.json(response.data);
	} catch (error: any) {
		console.error("[API_ERROR] /check-out (PUT):", error.response?.data || error.message);
		return NextResponse.json(
			{ message: error.response?.data?.message || "Gagal melakukan check-out" },
			{ status: error.response?.status || 500 }
		);
	}
};