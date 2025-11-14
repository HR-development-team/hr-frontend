import { number } from "zod";

export const formatRupiah = (value: string | number) => {
	const numberValue = Number(value);

	if (isNaN(numberValue)) {
		return value;
	}

	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
		// maximumFractionDigits: 0,
	}).format(numberValue);
};
