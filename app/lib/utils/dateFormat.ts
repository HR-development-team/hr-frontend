export const formatDateIDN = (
	dateInput: string | Date | null | undefined
): string => {
	if (!dateInput) {
		return "-";
	}

	const dateObject = new Date(dateInput);

	if (isNaN(dateObject.getTime())) {
		return "Format tanggal tidak valid";
	}

	return dateObject.toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
};
