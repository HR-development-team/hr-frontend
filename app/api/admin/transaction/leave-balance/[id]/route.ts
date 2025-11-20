import { API_ENDPOINTS } from "@/api/api";
import { getAuthToken } from "@/lib/utils/authUtils";
import { Axios } from "@/lib/utils/axios";
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

  try {
    const body = await request.json();

    const response = await Axios.put(
      API_ENDPOINTS.UPDATELEAVEBALANCE(params.id),
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
    if (error.response) {
      return NextResponse.json(error.response.data.message, {
        status: error.response.status,
      });
    } else {
      return NextResponse.json(
        { message: "Gagal mengupdate saldo cuti" },
        { status: 500 }
      );
    }
  }
};

export const DELETE = async (request: NextRequest, { params }: paramsProp) => {
  const token = getAuthToken();

  const unauthorizedResponse = tokenAvailable(token);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const response = await Axios.delete(
      API_ENDPOINTS.UPDATELEAVEBALANCE(params.id),
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
      return NextResponse.json(error.response.data.message, {
        status: error.response.status,
      });
    } else {
      return NextResponse.json(
        { message: "Gagal menghapus saldo cuti" },
        { status: 500 }
      );
    }
  }
};
