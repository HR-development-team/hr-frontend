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

  try {
    const searchParams = request.nextUrl.searchParams;

    const params = {
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
      office_code: searchParams.get("office_code"),
      department_code: searchParams.get("department_code"),
    };

    const response = await Axios.get(API_ENDPOINTS.GETALLDIVISION, {
      params: params,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
      { message: "Gagal mendapatkan data master divisi" },
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

    const response = await Axios.post(API_ENDPOINTS.ADDDIVISION, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (error.response) {
      return NextResponse.json(
        { message: error.response.data.message },
        { status: error.response.status }
      );
    } else {
      return NextResponse.json(
        { message: "Gagal menambahkan data master divisi" },
        { status: 500 }
      );
    }
  }
};
