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

// Handler untuk GETACTIVESESSION
export const GET = async (request: NextRequest) => {
  const token = getAuthToken();
  const unauthorizedResponse = tokenAvailable(token);
  if (unauthorizedResponse) return unauthorizedResponse;

  try {
    const response = await Axios.get(API_ENDPOINTS.GETALLATTENDANCESESSION, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("[API_ERROR] /attendance-sessions (GET):", error.message);
    return NextResponse.json(
      { message: "Gagal mengambil data sesi" },
      { status: error.response?.status || 500 }
    );
  }
};
