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

// Handler untuk GETATTENDANCEHISTORY
export const GET = async (request: NextRequest) => {
	const token = getAuthToken();
	const unauthorizedResponse = tokenAvailable(token);
	if (unauthorizedResponse) return unauthorizedResponse;

	try {
		const response = await Axios.get(API_ENDPOINTS.GETATTENDANCEHISTORY, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return NextResponse.json(response.data);
	} catch (error: any) {
		console.error("[API_ERROR] /attendances/history (GET):", error.message);
		return NextResponse.json(
			{ message: "Gagal mengambil riwayat absensi" },
			{ status: error.response?.status || 500 }
		);
	}
};