export async function getSecretKey() {
	const secret = process.env.JWT_SECRET_KEY;
	if (!secret) {
		throw new Error("JWT_SECRET_KEY tidak ditemukan di environment variables");
	}

	return new TextEncoder().encode(secret);
}
