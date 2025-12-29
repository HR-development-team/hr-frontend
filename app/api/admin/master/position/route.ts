/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ENDPOINTS } from "@/api/api";
import { getAuthToken } from "@features/auth/utils/authUtils";
import { Axios } from "@/utils/axios";
import { NextRequest, NextResponse } from "next/server";

// Standard helper for token validation
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

  // Construct query params object
  // Using empty strings as default is generally safe if backend expects it,
  // otherwise, you could conditionally add properties.
  const backendParams = {
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 5,
    search: searchParams.get("search") || "",
    office_code: searchParams.get("office_code") || "",
    department_code: searchParams.get("department_code") || "",
    division_code: searchParams.get("division_code") || "",
  };

  try {
    const response = await Axios.get(API_ENDPOINTS.GETALLPOSITION, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: backendParams,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Dynamic status and message handling
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      message: "Gagal mendapatkan data master jabatan",
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

    const response = await Axios.post(API_ENDPOINTS.ADDPOSITION, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Return FULL error data to handle validation (422) properly
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      message: "Gagal menambahkan data master jabatan",
    };

    return NextResponse.json(data, { status });
  }
};
