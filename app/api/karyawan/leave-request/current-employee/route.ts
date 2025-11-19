import { API_ENDPOINTS } from "@/api/api";
import { getAuthToken } from "@/lib/utils/authUtils";
import { Axios } from "@/lib/utils/axios";
import { NextRequest, NextResponse } from "next/server";

const tokenAvailable = (token: string | null) => {
	if (!token) {
		return NextResponse.json({ message: "Akses ditolak" }, { status: 401 });
	}
	return null;
};

// Handler untuk GETLEAVEBYEMPLOYEE
export const GET = async (request: NextRequest) => {
	const token = getAuthToken();
	const unauthorizedResponse = tokenAvailable(token);
	if (unauthorizedResponse) return unauthorizedResponse;

	try {
		const response = await Axios.get(API_ENDPOINTS.GETLEAVEBYEMPLOYEE, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return NextResponse.json(response.data); // Mengembalikan {"leave_requests": [...]}
	} catch (error: any) {
		console.error("[API_ERROR] /current-employee (GET):", error.message);
		return NextResponse.json(
			{ message: "Gagal mengambil riwayat cuti pengguna" },
			{ status: error.response?.status || 500 }
		);
	}
};