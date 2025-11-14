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
 * Handler untuk EMPLOYEECHECKIN
 */
export const POST = async (request: NextRequest) => {
	const token = getAuthToken();

	const unauthorizedResponse = tokenAvailable(token);
	if (unauthorizedResponse) {
		return unauthorizedResponse;
	}

	try {
		// Asumsi check-in mungkin mengirim data (misal: lokasi)
		const body = await request.json();

		const response = await Axios.post(API_ENDPOINTS.EMPLOYEECHECKIN, body, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		return NextResponse.json(response.data);
	} catch (error: any) {
		console.error("[API_ERROR] /api/karyawan/attendances/check-in (POST):", error.message);

		if (error.response) {
			// Menampilkan detail error validasi jika ada (misal: "Anda sudah check-in hari ini")
			return NextResponse.json(
				{
					message: error.response.data.message || "Gagal melakukan check-in",
					detail: error.response.data.errors,
				},
				{ status: error.response.status || 500 }
			);
		} else {
			return NextResponse.json(
				{ message: "Gagal melakukan check-in" },
				{ status: 500 }
			);
		}
	}
};