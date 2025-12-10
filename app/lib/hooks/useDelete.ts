import { Toast } from "primereact/toast";

type ShowToastFn = (
  severity: "success" | "info" | "warn" | "error",
  summary: string,
  detail: string
) => void;

interface FetchOptions {
  url: string;
  onSuccess: () => void;
  onError?: (message: string) => void;
  showToast?: ShowToastFn;
}

export const useDelete = () => {
  const deleteData = async ({
    url,
    onSuccess,
    onError,
    showToast,
  }: FetchOptions) => {
    try {
      const res = await fetch(url, {
        method: "DELETE",
      });

      const responseData = await res.json();

      if (!res.ok)
        throw new Error(responseData.message || "Terjadi kesalahan sistem");

      if (showToast) {
        showToast(
          "success",
          "Sukses",
          responseData.message || "Data berhasil dihapus"
        );
      }
      onSuccess();
    } catch (error: any) {
      if (showToast) {
        showToast("error", "Gagal", error.message);
      }
    }
  };

  return deleteData;
};
