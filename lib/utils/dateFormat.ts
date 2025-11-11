export const formatDateIDN = (
	dateInput: string | Date | null | undefined
): string => {
	// 1. Cek jika input kosong (null, undefined, "")
	if (!dateInput) {
		return "Tanggal tidak tersedia";
	}

	// 2. Buat objek Date
	const dateObject = new Date(dateInput);

	// 3. Cek jika hasil konversi adalah "Invalid Date"
	//    (isNaN(dateObject.getTime()) adalah cara standar mengecek Invalid Date)
	if (isNaN(dateObject.getTime())) {
		return "Format tanggal tidak valid";
	}

	// 4. Kembalikan format yang diinginkan
	return dateObject.toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
};
