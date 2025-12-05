import { Toast } from "primereact/toast";
import { useState } from "react";

interface FetchOptions<T> {
  url: string;
  payload: T;
  toastRef?: React.RefObject<Toast>;
  onSuccess: () => void;
  onError?: (message: string) => void;
  method: "PUT" | "POST";
}

export const useSubmit = () => {
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const submitData = async <T>({
    url,
    payload,
    toastRef,
    onSuccess,
    onError,
    method,
  }: FetchOptions<T>) => {
    setIsSaving(true);
    try {
      const res = await fetch(url, {
        method: method,
        body: JSON.stringify(payload),
      });

      const response = await res.json();

      if (response && response.status === "00") {
        toastRef?.current?.show({
          severity: "success",
          summary: "Sukses",
          detail: response.message,
          life: 3000,
        });
        onSuccess();
      } else {
        const msg = response.message || "Gagal menyimpan data";
        toastRef?.current?.show({
          severity: "error",
          summary: "Gagal",
          detail: msg || "Terjadi kesalahan sistem",
          life: 3000,
        });
        if (onError) {
          onError(msg);
        }
      }
    } catch (error: any) {
      const msg = error.message || "Terjadi kesalahan sistem";
      if (toastRef?.current) {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: msg,
          life: 3000,
        });
      }
      if (onError) onError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return {isSaving, submitData}
};
