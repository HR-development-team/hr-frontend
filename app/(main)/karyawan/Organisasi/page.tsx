"use client";

import React from "react";
import { Network } from "lucide-react";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import OrganizationNode from "./components/OrganizationNode";
import {
  PositionStructure,
  OfficeStructure,
} from "@features/office-organization/schemas/officeOrganizationSchema";

export default function Organization() {
  const toastRef = useRef<Toast>(null);

  const [office, setOffice] = useState<OfficeStructure[]>([]);
  const [position, setPosition] = useState<PositionStructure[]>([]);

  //   const { isLoading, fetchData } = useFetch();

  const fetchAllOffice = async () => {
    // await fetchData({
    //   url: "/api/admin/organization/office",
    //   // toastRef: toastRef,
    //   onSuccess: (responseData) => {
    //     setOffice(responseData.offices || []);
    //   },
    //   onError: () => {
    //     setOffice([]);
    //   },
    // });
  };

  const fetchAllPosition = async () => {
    // await fetchData({
    //   url: "/api/admin/organization/position",
    //   // toastRef: toastRef,
    //   onSuccess: (responseData) => {
    //     setPosition(responseData.position || []);
    //   },
    //   onError: () => {
    //     setPosition([]);
    //   },
    // });
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

      {/* <OrganizationNode
        initialOfficeData={office}
        initialPositionData={position}
        isLoading={isLoading}
      /> */}
    </div>
  );
}
