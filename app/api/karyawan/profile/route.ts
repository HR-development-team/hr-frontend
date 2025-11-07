import { Axios } from "@/lib/utils/axios";
import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "../../api";
import { getAuthToken } from "@/lib/utils/authUtils";

export const GET = async (request: NextRequest) => {
	const token = getAuthToken();

	if (!token) {
		return NextResponse.json(
			{ message: "Akses ditolak: Tidak terautentikasi" },
			{ status: 401 }
		);
	}

	try {
		// Panggil endpoint profil dari backend kamu
		const response = await Axios.get(API_ENDPOINTS.GETUSERPROFILE, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		// Jika respons sukses
		return NextResponse.json(response.data, { status: 200 });
	} catch (error: any) {
		console.error("Gagal mendapatkan data profil:", error);

		// Jika server backend memberikan respons error
		if (error.response) {
			return NextResponse.json(
				{
					message: error.response.data?.message || "Gagal mendapatkan data profil dari server.",
				},
				{ status: error.response.status || 500 }
			);
		}

		// Jika error tidak diketahui
		return NextResponse.json(
			{ message: "Terjadi kesalahan pada server Next.js." },
			{ status: 500 }
		);
	}
};
