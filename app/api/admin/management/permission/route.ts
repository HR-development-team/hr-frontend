/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ENDPOINTS } from "@/api/api";
import { getAuthToken } from "@features/auth/utils/authUtils";
import { Axios } from "@/utils/axios";
import { NextResponse } from "next/server";

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
    const response = await Axios.get(API_ENDPOINTS.GETCURRENTUSERPERMISSION, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Dynamic status handling (Important: permission errors might be 403, not just 404)
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      message: "Gagal mendapatkan data permission",
    };

    return NextResponse.json(data, { status });
  }
};
