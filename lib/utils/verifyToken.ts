import { jwtVerify } from "jose";
import { getSecreteKey } from "./getSecretKey";

export async function verifyToken(token: string) {
	try {
		const secretKey = await getSecreteKey();
		const { payload } = await jwtVerify(token, secretKey);
		return payload;
	} catch (error: any) {
		console.error("Verifikasi JWT Gagal", error);
		return null;
	}
}
