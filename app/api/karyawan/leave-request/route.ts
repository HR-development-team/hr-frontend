/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_ENDPOINTS } from "@/api/api";
import { getAuthToken } from "@features/auth/utils/authUtils";
import { Axios } from "@/utils/axios";
import { NextRequest, NextResponse } from "next/server";

const tokenAvailable = (token: string | null) => {
  if (!token) {
    return NextResponse.json({ message: "Akses ditolak" }, { status: 401 });
  }
  return null;
};

// Handler untuk POSTLEAVEREQUEST (Submit)
export const POST = async (request: NextRequest) => {
  const token = getAuthToken();
  const unauthorizedResponse = tokenAvailable(token);
  if (unauthorizedResponse) return unauthorizedResponse;

  try {
    const body = await request.json(); // Menerima {"type_code": ..., "start_date": ...}
    const response = await Axios.post(API_ENDPOINTS.POSTLEAVEREQUEST, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    // [FIX 400 ERROR] Menambahkan log detail
    if (error.response && error.response.status === 400) {
      console.error(
        "[DETAIL_ERROR_400] /api/karyawan/leave-request (POST):",
        JSON.stringify(error.response.data, null, 2)
      );
      return NextResponse.json(
        {
          message: error.response.data.message || "Data tidak valid.",
          detail: error.response.data.errors,
        },
        { status: 400 }
      );
    }

    console.error(
      "[API_ERROR] /leave-request (POST):",
      error.response?.data || error.message
    );
    return NextResponse.json(
      {
        message:
          error.response?.data?.message || "Gagal mengirim pengajuan cuti",
      },
      { status: error.response?.status || 500 }
    );
  }
};
