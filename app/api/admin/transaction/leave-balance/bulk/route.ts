/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_ENDPOINTS } from "@/api/api";
import { getAuthToken } from "@features/auth/utils/authUtils";
import { Axios } from "@/utils/axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const token = getAuthToken();
  if (!token) {
    return NextResponse.json(
      { message: "Akses ditolak: Tidak terauntetikasi" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const response = await Axios.post(
      API_ENDPOINTS.ADDLEAVEBALANCEFORALL,
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
      return NextResponse.json(
        { message: error.response.data.message },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { message: "Gagal menambahkan saldo cuti" },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  const token = getAuthToken();
  if (!token) {
    return NextResponse.json(
      { message: "Akses ditolak: Tidak terauntetikasi" },
      { status: 401 }
    );
  }

  try {
    const url = new URL(request.url);

    const type_code = url.searchParams.get("type_code") || "";
    const year = url.searchParams.get("year") || "";

    const response = await Axios.delete(API_ENDPOINTS.DELETEALLLEAVEBALANCE, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: {
        type_code: type_code,
        year: year,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (error.response) {
      return NextResponse.json(
        { message: error.response.data.message },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { message: "Gagal menambahkan saldo cuti" },
      { status: 500 }
    );
  }
};
