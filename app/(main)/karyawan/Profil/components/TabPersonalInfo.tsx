"use client";

import React from "react";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
// IMPORT DIPERBARUI
import { UserProfile, InfoItem } from "@/lib/types/profil";

interface TabPersonalInfoProps {
  profile: UserProfile;
}

export default function TabPersonalInfo({ profile }: TabPersonalInfoProps) {
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

  return (
    <Card className="border-none shadow-none h-full">
      <h3 className="m-0 mb-4 text-900 font-bold">Data Personal</h3>

      <div className="mb-4">
        <span className="block text-xs font-bold text-500 uppercase mb-3 tracking-wide">
          Identitas Utama
        </span>
        <div className="grid row-gap-3">
          <InfoItem
            icon="pi-id-card"
            label="Nomor KTP (NIK)"
            value={profile.ktp_number}
            className="md:col-12"
          />
          <InfoItem
            icon="pi-user"
            label="Jenis Kelamin"
            value={capitalizeFirstLetter(profile.gender)}
          />
          <InfoItem
            icon="pi-heart"
            label="Status Pernikahan"
            value={profile.maritial_status}
          />
        </div>
      </div>

      <Divider className="border-gray-100" />

      <div className="mb-4">
        <span className="block text-xs font-bold text-500 uppercase mb-3 tracking-wide">
          Detail Lainnya
        </span>
        <div className="grid row-gap-3">
          <InfoItem
            icon="pi-calendar"
            label="Tempat, Tanggal Lahir"
            value={`${profile.birth_place}, ${formatLocalDate(
              profile.birth_date
            )}`}
            className="md:col-12"
          />
          <InfoItem icon="pi-star" label="Agama" value={profile.religion} />
          <InfoItem
            icon="pi-book"
            label="Pendidikan Terakhir"
            value={profile.education}
          />
          <InfoItem
            icon="pi-tint"
            label="Golongan Darah"
            value={profile.blood_type || "-"}
          />
        </div>
      </div>
    </Card>
  );
}