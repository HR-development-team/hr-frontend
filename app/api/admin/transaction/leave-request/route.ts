import { API_ENDPOINTS } from "@/app/api/api";
import { getAuthToken } from "@/lib/utils/authUtils";
import { Axios } from "@/lib/utils/axios";
import { NextResponse } from "next/server";

export const GET = async () => {
	const token = getAuthToken();

	if (!token) {
		return NextResponse.json(
			{ message: "Akses ditolak: Tidak terauntetikasi" },
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

		return NextResponse.json(response.data);
	} catch (error: any) {
		if (error.response) {
			return NextResponse.json(
				{ message: error.response.data.message },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "Gagal mendapatkan data pengajuan cuti" },
			{ status: 500 }
		);
	}
};
