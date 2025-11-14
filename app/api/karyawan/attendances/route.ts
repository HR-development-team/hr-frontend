import { API_ENDPOINTS } from "@/api/api";
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
 * Handler untuk GETALLATTENDANCE
 */
export const GET = async (request: NextRequest) => {
	const token = getAuthToken();

	const unauthorizedResponse = tokenAvailable(token);
	if (unauthorizedResponse) {
		return unauthorizedResponse;
	}

	try {
		const response = await Axios.get(API_ENDPOINTS.GETALLATTENDANCE, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		return NextResponse.json(response.data);
	} catch (error: any) {
		console.error("[API_ERROR] /api/karyawan/attendances (GET):", error.message);

		if (error.response) {
			return NextResponse.json(
				{ message: error.response.data.message },
				{ status: error.response.status || 500 }
			);
		}

		return NextResponse.json(
			{ message: "Gagal mendapatkan data absensi" },
			{ status: 500 }
		);
	}
};