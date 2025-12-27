/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_ENDPOINTS } from "@/api/api";
import { getAuthToken } from "@features/auth/utils/authUtils";
import { Axios } from "@/utils/axios";
import { NextRequest, NextResponse } from "next/server";

const tokenAvailable = (token: string | null) => {
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

  const unauthorizedResponse = tokenAvailable(token);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

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
    if (error.response) {
      return NextResponse.json(
        { message: error.response.data.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Gagal mendapatkan data role" },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  const token = getAuthToken();

  const unauthorizedResponse = tokenAvailable(token);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

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
    if (error.response) {
      return NextResponse.json(error.response.data.message, {
        status: error.response.status,
      });
    } else {
      return NextResponse.json(
        { message: "Gagal mengedit data role" },
        { status: 500 }
      );
    }
  }
};
