/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ENDPOINTS } from "@/api/api";
import { getAuthToken } from "@features/auth/utils/authUtils";
import { Axios } from "@/utils/axios";
import { NextRequest, NextResponse } from "next/server";

// Standard helper
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
  };

  try {
    const response = await Axios.get(API_ENDPOINTS.GETALLROLE, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: backendParams,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Dynamic status handling
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      message: "Gagal mendapatkan data role",
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

    const response = await Axios.post(API_ENDPOINTS.ADDROLE, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Return FULL error data for validation (422)
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      message: "Gagal menambahkan data role",
    };

    return NextResponse.json(data, { status });
  }
};
