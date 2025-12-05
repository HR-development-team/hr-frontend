import { Toast } from "primereact/toast";

interface FetchOptions {
  url: string;
  onSuccess: () => void;
  onError?: (message: string) => void;
  toastRef?: React.RefObject<Toast>;
  id: number;
}

export const useDelete = () => {
  const deleteData = async ({
    url,
    onSuccess,
    onError,
    toastRef,
    id,
  }: FetchOptions) => {
    try {
      const res = await fetch(url, {
        method: "DELETE",
      });

      const responseData = await res.json();

      if (!res.ok)
        throw new Error(responseData.message || "Terjadi kesalahan sistem");

      toastRef?.current?.show({
        severity: "success",
        summary: "Sukses",
        detail: responseData.message || "Data berhasil dihapus",
        life: 3000,
      });

      onSuccess();
    } catch (error: any) {
      toastRef?.current?.show({
        severity: "error",
        summary: "Gagal",
        detail: error.message,
        life: 3000,
      });
    }
  };
};
