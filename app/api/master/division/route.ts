import { getAuthToken } from "@/lib/utils/authUtils";
import { Axios } from "@/lib/utils/axios";
import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "../../api";
import { elements } from "chart.js";

const tokenAvailable = (token: string | null) => {
	if (!token) {
		return NextResponse.json(
			{ message: "Akses ditolak: Tidak terauntetikasi" },
			{ status: 401 }
		);
	}

	return null;
};

export const GET = async (request: NextRequest) => {
	const token = getAuthToken();

	const unauthorizedResponse = tokenAvailable(token);
	if (unauthorizedResponse) {
		return unauthorizedResponse;
	}

	try {
		const response = await Axios.get(API_ENDPOINTS.GETALLDIVISION, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		return NextResponse.json(response.data);
	} catch (error: any) {
		if (error.response) {
			return NextResponse.json(
				{ message: "Tidak ada data master divisi" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "Gagal mendapatkan data master divisi" },
			{ status: 500 }
		);
	}
};

export const POST = async (request: NextRequest) => {
	const token = getAuthToken();

	const unauthorizedResponse = tokenAvailable(token);
	if (unauthorizedResponse) {
		return unauthorizedResponse;
	}

	try {
		const body = await request.json();

		const response = await Axios.post(API_ENDPOINTS.ADDDIVISION, body, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		return NextResponse.json(response.data);
	} catch (error: any) {
		if (error.response) {
			return NextResponse.json(error.response.data, {
				status: error.response.status,
			});
		} else {
			return NextResponse.json(
				{ message: "Gagal menambahkan data master divisi" },
				{ status: 500 }
			);
		}
	}
};
