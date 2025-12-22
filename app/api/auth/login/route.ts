/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_ENDPOINTS } from "@/api/api";
import { Axios } from "@/utils/axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const response = await Axios.post(API_ENDPOINTS.LOGIN, body);

    const loginData = response.data;
    const token = loginData?.auth?.token;
    const userRole = loginData?.auth?.user.role_code;

    const responseToBrowser = NextResponse.json(loginData);

    if (userRole) {
      responseToBrowser.cookies.set("token", token, {
        httpOnly: true,
        secure: true, // only in development
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
      });
    }

    return responseToBrowser;
  } catch (error: any) {
    if (error.response) {
      // [FIX] Don't hardcode the message.
      // Read the actual error message sent by the Express backend.
      const backendMessage = error.response.data?.message || "Login gagal";
      const status = error.response.status;

      return NextResponse.json({ message: backendMessage }, { status: status });
    }

    return NextResponse.json(
      { message: "Tidak dapat terhubung ke server" },
      { status: 500 }
    );
  }
};
