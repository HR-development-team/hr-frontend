"use client";

import React from "react";
import { Network } from "lucide-react";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import OrganizationNode from "./components/OrganizationNode";
import { PositionStructure, OfficeStructure } from "@/lib/types/organization";

export default function Organization() {
  const toastRef = useRef<Toast>(null);
  const isInitialLoad = useRef<boolean>(true);

  const [office, setOffice] = useState<OfficeStructure[]>([]);
  const [position, setPosition] = useState<PositionStructure[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAllOffice = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/organization/office");

      if (!res.ok) {
        throw new Error("Gagal mendapatkan data kantor");
      }

      const responseData = await res.json();

      if (responseData && responseData.status === "00") {
        if (isInitialLoad.current) {
          toastRef.current?.show({
            severity: "success",
            summary: "Sukses",
            detail: responseData.message,
            life: 3000,
          });
          isInitialLoad.current = false;
        }
        setOffice(responseData.offices || []);
      } else {
        toastRef.current?.show({
          severity: "error",
          summary: "Error",
          detail: responseData.message || "Gagal mendapatkan data kantor",
          life: 3000,
        });

        setOffice([]);
      }
    } catch (error: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Gagal mendapatkan data kantor",
        life: 3000,
      });
      setOffice([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllPosition = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/organization/position");

      if (!res.ok) {
        throw new Error("Gagal mendapatkan data kantor");
      }

      const responseData = await res.json();

      if (responseData && responseData.status === "00") {
        if (isInitialLoad.current) {
          toastRef.current?.show({
            severity: "success",
            summary: "Sukses",
            detail: responseData.message,
            life: 3000,
          });
          isInitialLoad.current = false;
        }
        setPosition(responseData.position || []);
      } else {
        toastRef.current?.show({
          severity: "error",
          summary: "Error",
          detail: responseData.message || "Gagal mendapatkan data kantor",
          life: 3000,
        });

        setPosition([]);
      }
    } catch (error: any) {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Gagal mendapatkan data kantor",
        life: 3000,
      });
      setPosition([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOffice();
    fetchAllPosition();
  }, []);

  return (
    <div>
      <Toast ref={toastRef} />
      <div className="mb-6 flex align-items-center gap-3 mt-4">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <Network className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2 ">
            Struktur Organisasi
          </h1>
          <p className="text-sm md:text-md text-gray-500">
            Kelola struktur departemen dan hierarki perusahaan
          </p>
        </div>
      </div>

      <OrganizationNode
        initialOfficeData={office}
        initialPositionData={position}
        isLoading={isLoading}
      />
    </div>
  );
}
