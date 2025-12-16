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

export const GET = async (request: NextRequest, { params }: paramsProp) => {
  const token = getAuthToken();

  const unauthorizedResponse = tokenAvailable(token);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const response = await Axios.get(API_ENDPOINTS.GETDIVISIONBYID(params.id), {
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

export const PUT = async (request: NextRequest, { params }: paramsProp) => {
  const token = getAuthToken();

  const unauthorizedResponse = tokenAvailable(token);
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const body = await request.json();

    const response = await Axios.put(
      API_ENDPOINTS.EDITDIVISION(params.id),
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
        { message: "Gagal mengedit data master divisi" },
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
      API_ENDPOINTS.DELETEDIVISION(params.id),
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
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Gagal menghapus data master departemen" },
      { status: 500 }
    );
  }
};
