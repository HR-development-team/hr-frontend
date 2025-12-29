/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@features/auth/utils/authUtils";
import { Axios } from "@/utils/axios";
import { API_ENDPOINTS } from "@/api/api";

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

export const GET = async () => {
  const token = getAuthToken();
  const authError = validateToken(token);
  if (authError) return authError;

  try {
    const response = await Axios.get(API_ENDPOINTS.GETALLATTENDANCESESSION, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Dynamic status handling
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      message: "Gagal mendapatkan data sesi absensi",
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
    const response = await Axios.post(
      API_ENDPOINTS.ADDATTENDANCESESSION,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Return FULL error data for validation (422)
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      message: "Gagal menambahkan sesi absensi",
    };

    return NextResponse.json(data, { status });
  }
};
