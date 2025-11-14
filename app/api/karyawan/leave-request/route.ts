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
 * Handler untuk GETALLLEAVEREQUEST
 */
export const GET = async (request: NextRequest) => {
	const token = getAuthToken();

	const unauthorizedResponse = tokenAvailable(token);
	if (unauthorizedResponse) {
		return unauthorizedResponse;
	}

	try {
		// --- PERBAIKAN 1: Menggunakan endpoint yang benar ---
		const response = await Axios.get(API_ENDPOINTS.GETALLLEAVEREQUEST, {
			headers: {
				// --- PERBAIKAN 2: Typo 'application/json' ---
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		return NextResponse.json(response.data);
	} catch (error: any) {
		// Tambahkan logging untuk melihat error di terminal
		console.error("[API_ERROR] /api/karyawan/leave-request (GET):", error.message);

		if (error.response) {
			return NextResponse.json(
				{ message: error.response.data.message },
				{ status: error.response.status || 500 }
			);
		}

		return NextResponse.json(
			{ message: "Gagal mendapatkan data leave request" },
			{ status: 500 }
		);
	}
};

/**
 * Handler untuk POSTLEAVEREQUEST
 */
export const POST = async (request: NextRequest) => {
	const token = getAuthToken();

	const unauthorizedResponse = tokenAvailable(token);
	if (unauthorizedResponse) {
		return unauthorizedResponse;
	}

	try {
		const body = await request.json();

		const response = await Axios.post(API_ENDPOINTS.POSTLEAVEREQUEST, body, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		return NextResponse.json(response.data);
	} catch (error: any) {
		// --- INI BAGIAN YANG DIPERBARUI ---
		// Kita cek jika ini error Axios dengan status 400
		if (error.response && error.response.status === 400) {
			console.error(
				"[DETAIL_ERROR_400] /api/karyawan/leave-request (POST):",
				// Cetak detail error validasi dari API utama ke terminal
				JSON.stringify(error.response.data, null, 2)
			);
			// Kirim kembali pesan error yang jelas ke frontend
			return NextResponse.json(
				{
					message: "Data tidak valid. Silakan cek kembali input Anda.",
					detail: error.response.data.errors || error.response.data.message,
				},
				{ status: 400 }
			);
		}

		// Error lain yang tidak terduga
		console.error("[API_ERROR] /api/karyawan/leave-request (POST):", error.message);
		if (error.response) {
			return NextResponse.json(error.response.data.message, {
				status: error.response.status,
			});
		} else {
			return NextResponse.json(
				{ message: "Gagal mengirim leave request" },
				{ status: 500 }
			);
		}
		// --- BATAS AKHIR PEMBARUAN ---
	}
};