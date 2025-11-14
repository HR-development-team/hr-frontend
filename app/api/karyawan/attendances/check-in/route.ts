import { API_ENDPOINTS } from "@/api/api";
import { getAuthToken } from "@/lib/utils/authUtils";
import { Axios } from "@/lib/utils/axios";
import { NextRequest, NextResponse } from "next/server";

const tokenAvailable = (token: string | null) => {
  if (!token) {
    return NextResponse.json({ message: "Akses ditolak" }, { status: 401 });
  }
  return null;
};

// Handler untuk EMPLOYEECHECKIN
export const POST = async (request: NextRequest) => {
  const token = getAuthToken();
  const unauthorizedResponse = tokenAvailable(token);
  if (unauthorizedResponse) return unauthorizedResponse;

  try {
    // [FIX 400 ERROR]
    // Sesuai konfirmasi Anda, API Utama tidak mau body.
    const response = await Axios.post(
      API_ENDPOINTS.EMPLOYEECHECKIN,
      undefined,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(
      "[API_ERROR] /check-in (POST):",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { message: error.response?.data?.message || "Gagal melakukan check-in" },
      { status: error.response?.status || 500 }
    );
  }
};
