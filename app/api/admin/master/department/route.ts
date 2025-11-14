import { Axios } from "@/lib/utils/axios";
import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/utils/authUtils";
import { API_ENDPOINTS } from "@/api/api";

export const GET = async (request: NextRequest) => {
	const token = getAuthToken();

	if (!token) {
		return NextResponse.json(
			{ message: "Akses ditolak: Tidak terauntetikasi" },
			{ status: 401 }
		);
	}

	try {
		const response = await Axios.get(API_ENDPOINTS.GETALLDEPARTMENT, {
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
			{ message: "Gagal mendapatkan data master departemen" },
			{ status: 500 }
		);
	}
};

export const POST = async (request: NextRequest) => {
	const token = getAuthToken();

	if (!token) {
		return NextResponse.json(
			{ message: "Akses ditolak: Tidak terauntetikasi" },
			{ status: 401 }
		);
	}

	try {
		const body = await request.json();
		const response = await Axios.post(API_ENDPOINTS.ADDDEPARTMENT, body, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return NextResponse.json(response.data);
	} catch (error: any) {
		if (error.response) {
			return NextResponse.json(error.response.data.message, {
				status: error.response.status,
			});
		} else {
			return NextResponse.json(
				{ message: "Gagal menambahkan data master departemen" },
				{ status: 500 }
			);
		}
	}
};
