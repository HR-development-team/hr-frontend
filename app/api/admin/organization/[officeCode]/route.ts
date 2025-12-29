/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ENDPOINTS } from "@/api/api";
import { getAuthToken } from "@features/auth/utils/authUtils";
import { Axios } from "@/utils/axios";
import { NextRequest, NextResponse } from "next/server";

interface paramsProp {
  params: {
    officeCode: string;
  };
}

// Consistent helper
const validateToken = (token: string | null) => {
  if (!token) {
    return NextResponse.json(
      { message: "Akses ditolak: Tidak terauntetikasi" },
      { status: 401 }
    );
  }
  return null;
};

export const GET = async (request: NextRequest, { params }: paramsProp) => {
  const token = getAuthToken();
  const authError = validateToken(token);
  if (authError) return authError;

  try {
    const response = await Axios.get(
      API_ENDPOINTS.GETPOSITIONORGANIZATION(params.officeCode),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Dynamic status handling
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      message: "Gagal mendapatkan data organisasi kantor",
    };

    return NextResponse.json(data, { status });
  }
};
