/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@features/auth/utils/authUtils";
import { Axios } from "@/utils/axios";
import { API_ENDPOINTS } from "@/api/api";

// Helper to check token presence
const validateToken = (token: string | null) => {
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
  const authError = validateToken(token);
  if (authError) return authError;

  const searchParams = request.nextUrl.searchParams;

  const backendParams = {
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 5,
    search: searchParams.get("search") || "",
    office_code: searchParams.get("office_code") || "",
  };

  try {
    const response = await Axios.get(API_ENDPOINTS.GETALLDEPARTMENT, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: backendParams,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Forward the exact error from the backend (e.g., 404 Not Found, 403 Forbidden)
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      message: "Gagal mendapatkan data master departemen",
    };

    return NextResponse.json(data, { status });
  }
};

export const POST = async (request: NextRequest) => {
  const token = getAuthToken();
  const authError = validateToken(token);
  if (authError) return authError;

  try {
    const body = await request.json();
    const response = await Axios.post(API_ENDPOINTS.ADDDEPARTMENT, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Forward validation errors (422) or server errors (500)
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      message: "Gagal menambahkan data master departemen",
    };

    return NextResponse.json(data, { status });
  }
};
