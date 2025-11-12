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
 * Handler untuk GETLEAVEBYUSER
 */
export const GET = async (
	request: NextRequest,
	{ params }: { params: { id: string } }
) => {
	const token = getAuthToken();
	const { id: userId } = params; // Ini adalah user ID

	const unauthorizedResponse = tokenAvailable(token);
	if (unauthorizedResponse) {
		return unauthorizedResponse;
	}

	if (!userId) {
		return NextResponse.json(
			{ message: "User ID tidak ditemukan" },
			{ status: 400 }
		);
	}

	try {
		const response = await Axios.get(API_ENDPOINTS.GETLEAVEBYUSER(userId), {
			headers: {
				"Content-Type": "application/json", // Perbaikan typo
				Authorization: `Bearer ${token}`,
			},
		});

		return NextResponse.json(response.data);
	} catch (error: any) {
		console.error(`[API_ERROR] .../leave-request/user/${userId} (GET):`, error.message);
		if (error.response) {
			return NextResponse.json(
				{ message: error.response.data.message },
				{ status: error.response.status || 500 }
			);
		}

		return NextResponse.json(
			{ message: "Gagal mendapatkan data leave request pengguna" },
			{ status: 500 }
		);
	}
};