"use client";

import React from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
// import { UserProfile, OfficeInfo, InfoItem } from "@/lib/types/profil";

interface TabJobInfoProps {
  profile: [];
  officeInfo: [];
}

export default function TabJobInfo({ profile, officeInfo }: TabJobInfoProps) {
  const capitalizeFirstLetter = (string: string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const formatLocalDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // const detailedOfficeAddress =
  //   officeInfo.label === "Kantor Pusat"
  //     ? "Gedung Menara HR, Jl. Jend. Sudirman, Jakarta Selatan"
  //     : `${profile.office_name}, Indonesia`;

  return (
    <Card className="border-none shadow-none h-full">
      {/* <h3 className="m-0 mb-4 text-900 font-bold">Status & Penempatan</h3> */}

      {/* KARTU LOKASI */}
      {/* <div className="surface-50 border-1 border-gray-200 border-round-xl p-4 mb-5 hover:shadow-2 transition-duration-200">
        <div className="flex justify-content-between mb-3">
          <span className="text-blue-600 font-bold flex align-items-center gap-2">
            <i className="pi pi-building"></i> Lokasi Kerja
          </span>
          <Tag
            value={officeInfo.label}
            severity={officeInfo.severity}
            rounded
          ></Tag>
        </div>
        <div className="flex flex-column gap-1">
          <span className="text-xl font-bold text-900">
            {officeInfo.detail}
          </span>
          <span className="text-600 line-height-3">
            {detailedOfficeAddress}
          </span>
          <a
            href={`http://googleusercontent.com/maps.google.com/search?q=${encodeURIComponent(
              detailedOfficeAddress
            )}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-500 no-underline hover:text-blue-700 mt-2 font-medium"
          >
            <i className="pi pi-map-marker mr-1"></i> Lihat di Peta
          </a>
        </div>
      </div> */}

      {/* GRID INFO PEKERJAAN */}
      {/* <div className="grid row-gap-4">
        
        <InfoItem
          icon="pi-briefcase"
          label="Posisi / Jabatan"
          value={profile.position_name}
        />

        <div className="col-12">
          <Divider className="my-0 border-gray-100" />
        </div>

        <InfoItem
          icon="pi-sitemap"
          label="Divisi"
          value={profile.division_name || "-"}
        />
        <InfoItem
          icon="pi-building"
          label="Departemen"
          value={profile.department_name}
        />

        <div className="col-12">
          <Divider className="my-0 border-gray-100" />
        </div>

        <InfoItem
          icon="pi-user-check"
          label="Status Kepegawaian"
          value={
            <Tag
              severity="success"
              icon="pi pi-check"
              value={capitalizeFirstLetter(profile.employment_status)}
            />
          }
        />
        
        <InfoItem
          icon="pi-calendar"
          label="Tanggal Bergabung"
          value={formatLocalDate(profile.join_date)}
        />
        <InfoItem
          icon="pi-calendar-times"
          label="Tanggal Resign"
          value={
            profile.resign_date ? formatLocalDate(profile.resign_date) : "-"
          }
        />
      </div> */}
    </Card>
  );
}
