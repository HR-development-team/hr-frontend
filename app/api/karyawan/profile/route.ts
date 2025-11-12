import { Axios } from "@/lib/utils/axios";
import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/app/api/api";
import { cookies } from "next/headers";

export const GET = async (request: NextRequest) => {
	try {
		const token = cookies().get("token")?.value;

		if (!token) {
			return NextResponse.json(
				{ message: "Akses ditolak: Tidak terautentikasi" },
				{ status: 401 }
			);
		}

		const response = await Axios.get(API_ENDPOINTS.GETPROFILES, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		return NextResponse.json(response.data, { status: 200 });
	} catch (error: any) {
		console.error("Gagal mendapatkan data profil:", error.message || error);

		if (error.response) {
			return NextResponse.json(
				{
					message:
						error.response.data?.message ||
						"Gagal mendapatkan data profil dari server.",
				},
				{ status: error.response?.status ?? 500 }
			);
		}

		return NextResponse.json(
			{ message: "Terjadi kesalahan pada server Next.js." },
			{ status: 500 }
		);
	}
};
