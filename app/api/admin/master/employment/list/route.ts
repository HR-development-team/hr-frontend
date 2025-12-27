/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getAuthToken } from "@features/auth/utils/authUtils";
import { Axios } from "@/utils/axios";
import { API_ENDPOINTS } from "@/api/api";

const tokenAvailable = (token: string | null) => {
  if (!token) {
    return NextResponse.json(
      { message: "Akses ditolak: Tidak terauntetikasi" },
      { status: 401 }
    );
  }

  return null;
};

// This endpoint is specific for DROPDOWNS
export const GET = async () => {
  const token = getAuthToken();

  const unauthorizedResponse = tokenAvailable(token);
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const response = await Axios.get(API_ENDPOINTS.GETEMPLOYEMENTOPTION, {
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
      { message: "Gagal mendapatkan data master status karyawan" },
      { status: 500 }
    );
  }
};
