import { Toast } from "primereact/toast";
import { useRef, useState } from "react";

interface ApiResponse<T> {
  status: string;
  message: string;
  [key: string]: any;
}

interface FetchOptions<T> {
  url: string;
  onSuccess: (data: ApiResponse<T>) => void;
  onError?: (message: string) => void;
  toastRef?: React.RefObject<Toast>;
}

interface FetchMultipleOptions {
  urls: string[];
  onSuccess: (data: any[]) => void;
  onError?: (message: string) => void;
}

interface FetchByIdOptions<T> {
  url: string;
  onSuccess: (data: ApiResponse<T>) => void;
  onError?: (message: string) => void;
}

export const useFetch = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isInitialLoad = useRef<boolean>(true);

  const fetchData = async <T>({
    url,
    onSuccess,
    onError,
    toastRef,
  }: FetchOptions<T>) => {
    setIsLoading(true);
    try {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP Error! status: ${res.status}`);
      }

      const responseData: ApiResponse<T> = await res.json();

      if (responseData && responseData.status === "00") {
        if (isInitialLoad.current && toastRef?.current) {
          toastRef.current.show({
            severity: "success",
            summary: "Sukses",
            detail: responseData.message || "Data berhasil dimuat",
            life: 3000,
          });
          isInitialLoad.current = false;
        }

        onSuccess(responseData);
      } else {
        const msg = responseData.message || "Gagal mendapatkan data";
        if (toastRef?.current) {
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: msg,
            life: 3000,
          });
        }
        if (onError) onError(msg);
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
      setIsLoading(false);
    }
  };

  const fetchMultiple = async ({
    urls,
    onSuccess,
    onError,
  }: FetchMultipleOptions) => {
    try {
      const responses = await Promise.all(urls.map((url) => fetch(url)));

      const errorResponse = responses.find((res) => !res.ok);
      if (errorResponse) {
        throw new Error(
          `Gagal memuat data dari salah satu sumber (${errorResponse.status})`
        );
      }

      const dataArray = await Promise.all(responses.map((res) => res.json()));

      const allSuccess = dataArray.every((d) => d && d.status === "00");

      if (allSuccess) {
        onSuccess(dataArray);
      } else {
        const failedItem = dataArray.find((d) => d.status !== "00");
        const msg = failedItem?.message || "Gagal memuat sebagian data";
        throw new Error(msg);
      }
    } catch (error: any) {
      const msg = error.message || "Terjadi kesalahan sistem";
      if (onError) {
        onError(msg);
      }
    }
  };

  const fetchDataById = async <T>({
    url,
    onSuccess,
    onError,
  }: FetchByIdOptions<T>) => {
    setIsLoading(true);
    try {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP Error! status: ${res.status}`);
      }

      const responseData: ApiResponse<T> = await res.json();

      if (responseData && responseData.status === "00") {
        onSuccess(responseData);
      } else {
        const msg = responseData.message || "Gagal mendapatkan data";
        if (onError) {
          onError(msg);
        }
      }
    } catch (error: any) {
      const msg = error.message || "Terjadi kesalahan sistem";
      if (onError) {
        onError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, fetchData, fetchMultiple, fetchDataById };
};
