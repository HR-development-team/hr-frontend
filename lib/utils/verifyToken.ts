import { jwtVerify } from "jose";
import { getSecretKey } from "./getSecretKey";

export async function verifyToken(token: string) {
	try {
		const secretKey = await getSecretKey();
		const { payload } = await jwtVerify(token, secretKey);
		return payload;
	} catch (error: any) {
		console.error("Verifikasi JWT Gagal", error);
		return null;
	}
}
