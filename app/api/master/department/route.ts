import { Axios } from "@/lib/utils/axios";
import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "../../api";

export const GET = async (request: NextRequest) => {
	try {
		const response = await Axios.get(API_ENDPOINTS.GETALLDEPARTMENT);

		return NextResponse.json(response.data);
	} catch (error: any) {
		if (error.response) {
			return NextResponse.json(
				{ message: "Tidak ada data master departemen" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "Gagal mendapatkan data master departemen" },
			{ status: 500 }
		);
	}
};
