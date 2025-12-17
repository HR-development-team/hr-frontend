/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ENDPOINTS } from "@/api/api";
import { getAuthToken } from "@features/auth/utils/authUtils";
import { Axios } from "@/utils/axios";
import { NextRequest, NextResponse } from "next/server";

interface paramsProp {
  params: {
    id: string;
  };
}

const tokenAvailable = (token: string | null) => {
  if (!token) {
    return NextResponse.json(
      { message: "Akses ditolak: Tidak terauntetikasi" },
      { status: 401 }
    );
  }

  return null;
};

export const PUT = async (request: NextRequest, { params }: paramsProp) => {
  const token = getAuthToken();

  const unauthorizedResponse = tokenAvailable(token);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  if (!token) {
    return NextResponse.json(
      { message: "Akses ditolak: Tidak terauntetikasi" },
      { status: 401 }
    );
  }

  try {
    const response = await Axios.put(
      `${API_ENDPOINTS.CLOSEATTENDANCESESSION(params.id)}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (error.response) {
      return NextResponse.json(
        { message: error.response.data.message },
        { status: error.response.status }
      );
    }
    return NextResponse.json(
      { message: "Gagal mengubah status sesi" },
      { status: 500 }
    );
  }
};
