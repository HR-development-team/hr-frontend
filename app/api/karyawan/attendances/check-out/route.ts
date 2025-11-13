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
 * Handler untuk EMPLOYEECHECKOUT
 */
export const PUT = async (request: NextRequest) => {
	const token = getAuthToken();

	const unauthorizedResponse = tokenAvailable(token);
	if (unauthorizedResponse) {
		return unauthorizedResponse;
	}

	try {
		// Asumsi check-out mungkin mengirim data (misal: catatan kerja harian)
		const body = await request.json();

		const response = await Axios.put(API_ENDPOINTS.EMPLOYEECHECKOUT, body, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		return NextResponse.json(response.data);
	} catch (error: any) {
		console.error("[API_ERROR] /api/karyawan/attendances/check-out (PUT):", error.message);

		if (error.response) {
			return NextResponse.json(
				{
					message: error.response.data.message || "Gagal melakukan check-out",
					detail: error.response.data.errors,
				},
				{ status: error.response.status || 500 }
			);
		} else {
			return NextResponse.json(
				{ message: "Gagal melakukan check-out" },
				{ status: 500 }
			);
		}
	}
};