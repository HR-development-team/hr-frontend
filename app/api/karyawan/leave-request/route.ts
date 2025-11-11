import { Axios } from "@/lib/utils/axios";
import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "../../api";
import { getAuthToken } from "@/lib/utils/authUtils";

/**
 * =========================
 *  GET - Ambil semua riwayat cuti karyawan
 * =========================
 */
export const GET = async (request: NextRequest) => {
	const token = getAuthToken();

	if (!token) {
		return NextResponse.json(
			{ message: "Akses ditolak: Tidak terautentikasi." },
			{ status: 401 }
		);
	}

	try {
		const response = await Axios.get(API_ENDPOINTS.GETALLLEAVEREQUEST, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		return NextResponse.json(response.data, { status: 200 });
	} catch (error: any) {
		console.error("❌ Gagal mengambil data leave-request:", error);

		if (error.response) {
			return NextResponse.json(
				{
					message:
						error.response.data?.message ||
						"Gagal mengambil data dari server utama.",
				},
				{ status: error.response.status || 500 }
			);
		}

		return NextResponse.json(
			{ message: "Terjadi kesalahan pada server Next.js." },
			{ status: 500 }
		);
	}
};

/**
 * =========================
 *  POST - Ajukan cuti baru
 * =========================
 */
export const POST = async (request: NextRequest) => {
	const token = getAuthToken();

	if (!token) {
		return NextResponse.json(
			{ message: "Akses ditolak: Tidak terautentikasi." },
			{ status: 401 }
		);
	}

	try {
		const body = await request.json();

		// Debugging tambahan: pastikan body sesuai format backend
		console.log("📦 Data dikirim ke backend:", body);

		const response = await Axios.post(API_ENDPOINTS.POSTLEAVEREQUEST, body, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		console.log("✅ Respons backend:", response.data);

		return NextResponse.json(response.data, { status: 200 });
	} catch (error: any) {
		console.error("❌ Gagal mengirim pengajuan cuti:", error);

		if (error.response) {
			console.error("🧩 Detail respons error:", error.response.data);

			return NextResponse.json(
				{
					message:
						error.response.data?.message ||
						"Gagal mengirim data ke server utama.",
					statusCode: error.response.status,
					backendError: error.response.data || null,
				},
				{ status: error.response.status || 500 }
			);
		}

		return NextResponse.json(
			{ message: "Terjadi kesalahan pada server Next.js." },
			{ status: 500 }
		);
	}
};
