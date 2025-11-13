import { API_ENDPOINTS } from "@/app/api/api";
import { getAuthToken } from "@/lib/utils/authUtils";
import { Axios } from "@/lib/utils/axios";
import { NextRequest, NextResponse } from "next/server";

// Helper untuk cek token
const tokenAvailable = (token: string | null) => {
	if (!token) {
		return NextResponse.json(
			{ message: "Akses ditolak: Tidak terauntetikasi" },
			{ status: 401 }
		);
	}
	return null;
};

/**
 * Handler untuk GETALLATTENDANCESESSION
 */
export const GET = async (request: NextRequest) => {
	const token = getAuthToken();

	const unauthorizedResponse = tokenAvailable(token);
	if (unauthorizedResponse) {
		return unauthorizedResponse;
	}

	try {
		// Panggil endpoint API utama
		const response = await Axios.get(
			API_ENDPOINTS.GETALLATTENDANCESESSION, // <-- Pastikan ini ada di API_ENDPOINTS
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return NextResponse.json(response.data);
	} catch (error: any) {
		console.error("[API_ERROR] /api/karyawan/attendance-sessions (GET):", error.message);
		if (error.response) {
			return NextResponse.json(
				{ message: error.response.data.message },
				{ status: error.response.status || 500 }
			);
		}

		return NextResponse.json(
			{ message: "Gagal mendapatkan data sesi absensi" },
			{ status: 500 }
		);
	}
};