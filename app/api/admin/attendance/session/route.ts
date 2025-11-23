/* eslint-disable @typescript-eslint/no-explicit-any */
import { Axios } from "@/lib/utils/axios";
import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/utils/authUtils";
import { API_ENDPOINTS } from "@/api/api";

export const GET = async (request: NextRequest) => {
  const token = getAuthToken();

  if (!token) {
    return NextResponse.json(
      { message: "Akses ditolak: Tidak terauntetikasi" },
      { status: 401 }
    );
  }

  try {
    const response = await Axios.get(API_ENDPOINTS.GETALLATTENDANCESESSION, {
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
      { message: "Gagal mendapatkan data master departemen" },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  const token = getAuthToken();

  if (!token) {
    return NextResponse.json(
      { message: "Akses ditolak: Tidak terauntetikasi" },
      { status: 401 }
    );
  }

  console.log(token);

  try {
    const body = await request.json();
    console.log("body: ", body);
    const response = await Axios.post(
      API_ENDPOINTS.ADDATTENDANCESESSION,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("response: ", response);

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (error.response) {
      console.log("❌ BACKEND ERROR STATUS:", error.response.status);
      console.log("❌ BACKEND ERROR DATA:", error.response.data);

      return NextResponse.json(error.response.data.errors, {
        status: error.response.status,
      });
    } else {
      console.log("⚠️ REQUEST SETUP ERROR:", error.message);
      return NextResponse.json(
        { message: "Gagal menambahkan data master departemen" },
        { status: 500 }
      );
    }
  }
};
