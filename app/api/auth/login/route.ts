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

    const roleMapping: Record<string, string> = {};

    console.log(loginData);

    if (token) {
      try {
        const roleResponse = await Axios.get(API_ENDPOINTS.GETALLROLES, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const rolesArray = roleResponse.data?.roles || [];

        rolesArray.forEach((r: any) => {
          if (r.role_code && r.name) {
            roleMapping[r.role_code] = r.name;
          }
        });
      } catch (error: any) {
        console.error("Gagal mengambil master data role:", error);
      }
    }

    const finalResponse = {
      ...loginData,
      meta: {
        role_mapping: roleMapping,
      },
    };

    const responseToBrowser = NextResponse.json(finalResponse);

    console.log(finalResponse);

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
      return NextResponse.json(
        { message: "Email atau Password salah" },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { message: "Tidak dapat terhubung ke server" },
      { status: 500 }
    );
  }
};
