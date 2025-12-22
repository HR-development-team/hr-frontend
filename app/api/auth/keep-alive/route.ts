/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_ENDPOINTS } from "@/api/api";
import { Axios } from "@/utils/axios";
import { getAuthToken } from "@features/auth/utils/authUtils";
import { NextResponse } from "next/server";

export const POST = async () => {
  const token = getAuthToken();

  if (!token) {
    return NextResponse.json(
      { message: "Akses ditolak: Tidak terauntetikasi" },
      { status: 401 }
    );
  }

  try {
    const response = await Axios.post(
      API_ENDPOINTS.KEEPALIVE,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (error.response) {
      return NextResponse.json(error.response.data.message, {
        status: error.response.status,
      });
    } else {
      return NextResponse.json(
        { message: "Gagal memperpanjang sesi login" },
        { status: 500 }
      );
    }
  }
};
