import { useState } from "react";

type ShowToastFn = (
  severity: "success" | "info" | "warn" | "error",
  summary: string,
  detail: string
) => void;

interface FetchOptions<T> {
  url: string;
  payload?: T;
  showToast?: ShowToastFn;
  onSuccess: () => void;
  onError?: (message: string) => void;
  method: "PUT" | "POST";
}

export const useSubmit = () => {
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const submitData = async <T>({
    url,
    payload,
    showToast,
    onSuccess,
    onError,
    method,
  }: FetchOptions<T>) => {
    setIsSaving(true);
    try {
      const res = await fetch(url, {
        method: method,
        ...(payload && { body: JSON.stringify(payload) }),
      });

      const response = await res.json();

      if (response && response.status === "00") {
        if (showToast) {
          showToast("success", "Sukses", response.message);
        }
        onSuccess();
      } else {
        const msg = response.message || "Gagal menyimpan data";

        if (showToast) {
          showToast(
            "error",
            "Gagal",
            response.message || "Gagal menyimpan data"
          );
        }
        if (onError) {
          onError(msg);
        }
      }
    } catch (error: any) {
      const msg = error.message || "Terjadi kesalahan sistem";
      if (showToast) {
        showToast(
          "error",
          "Gagal",
          error.message || "Terjadi kesalahan sistem"
        );
      }
      if (onError) onError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, submitData };
};
