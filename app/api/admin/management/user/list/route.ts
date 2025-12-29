/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@features/auth/utils/authUtils";
import { Axios } from "@/utils/axios";
import { API_ENDPOINTS } from "@/api/api";

const validateToken = (token: string | null) => {
  if (!token) {
    return NextResponse.json(
      { message: "Akses ditolak: Tidak terauntetikasi" },
      { status: 401 }
    );
  }
  return null;
};

// This endpoint is specific for DROPDOWNS
export const GET = async (request: NextRequest) => {
  const token = getAuthToken();
  const authError = validateToken(token);
  if (authError) return authError;

  try {
    const searchParams = request.nextUrl.searchParams;
    const roleCode = searchParams.get("role_code");

    // Construct params dynamically
    const params: Record<string, string> = {};
    if (roleCode) params.role_code = roleCode;

    const response = await Axios.get(API_ENDPOINTS.GETUSEROPTION, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: params,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Dynamic status handling
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      message: "Gagal mendapatkan data user",
    };

    return NextResponse.json(data, { status });
  }
};
