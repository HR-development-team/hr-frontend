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
    const response = await Axios.get(API_ENDPOINTS.GETOFFICEORGANIZATION, {
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
      { message: "Gagal mendapatkan data organisasi kantor" },
      { status: 500 }
    );
  }
};