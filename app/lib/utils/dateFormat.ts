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

export const formatTime = (date: Date | string): string => {
  if (!date) return "";
  // If it's already a string, return it (handle edge cases)
  if (typeof date === "string") return date;

  const d = new Date(date);
  // padStart ensures "9:5:0" becomes "09:05:00"
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};

export const formatDateToYYYYMMDD = (
  dateInput: Date | string | null | undefined
): string => {
  if (!dateInput) return "";

  const date = new Date(dateInput);

  // Check if date is invalid
  if (isNaN(date.getTime())) return "";

  // Get year, month, and day using local time
  const year = date.getFullYear();
  // getMonth() returns 0-11, so we add 1. padStart adds leading zero.
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
