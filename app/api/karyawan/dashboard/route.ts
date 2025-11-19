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
 * Handler untuk GETEMPLOYEEDASHBOARD
 */
export const GET = async (request: NextRequest) => {
	const token = getAuthToken();

	const unauthorizedResponse = tokenAvailable(token);
	if (unauthorizedResponse) {
		return unauthorizedResponse;
	}

	try {
		// Panggil endpoint API utama
		const response = await Axios.get(API_ENDPOINTS.GETEMPLOYEEDASHBOARD, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		return NextResponse.json(response.data);
	} catch (error: any) {
        
        // --- [MODIFIKASI DEBUGGING] ---
		// Kita log error yang lebih detail ke terminal
		if (error.response) {
			console.error(
				`[API_ERROR] /api/karyawan/dashboard (GET) Gagal:`,
				{
					status: error.response.status, // Cth: 404, 500, 401
					data: JSON.stringify(error.response.data, null, 2), // Pesan error dari API Utama
					config: {
						method: error.config.method,
						url: error.config.url // URL mana yang sebenarnya dipanggil
					}
				}
			);
			// Kirim kembali pesan error yang jelas ke frontend
			return NextResponse.json(
				{ 
					message: error.response.data.message || "Gagal mengambil data dari API Utama", 
					detail: error.response.data 
				},
				{ status: error.response.status }
			);
		} else {
			// Error non-Axios (misal: 'getAuthToken' gagal atau masalah jaringan)
			console.error("[API_ERROR] /api/karyawan/dashboard (GET):", error.message);
			return NextResponse.json(
				{ message: "Gagal mendapatkan data dasbor karyawan" },
				{ status: 500 }
			);
		}
        // --- [BATAS MODIFIKASI] ---
	}
};