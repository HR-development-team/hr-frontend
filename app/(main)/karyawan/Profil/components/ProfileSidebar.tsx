"use client";

import React from "react";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
// IMPORT DIPERBARUI
import { UserProfile, OfficeInfo } from "@/lib/types/profil";

interface ProfileSidebarProps {
  profile: UserProfile;
  officeInfo: OfficeInfo;
  imagePreview: string | null;
}

export default function ProfileSidebar({
  profile,
  officeInfo,
  imagePreview,
}: ProfileSidebarProps) {
  return (
    <Card className="shadow-4 border-none p-0 overflow-hidden h-full flex flex-column">
      <div
        className="relative w-full h-8rem bg-blue-600"
        style={{
          background:
            "linear-gradient(90deg, var(--primary-color) 0%, var(--primary-700) 100%)",
        }}
      >
        <div className="absolute top-0 right-0 m-3">
          <Tag
            value={officeInfo.label}
            severity={officeInfo.severity}
            icon={officeInfo.icon}
            className="shadow-2"
          />
        </div>
      </div>

      <div className="flex flex-column align-items-center text-center px-4 pb-4 -mt-6 relative z-1">
        <Avatar
          image={imagePreview || profile.profile_image_url || undefined}
          label={
            !imagePreview && !profile.profile_image_url
              ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
              : undefined
          }
          shape="circle"
          className="w-10rem h-10rem text-5xl shadow-4 surface-card text-primary font-bold mb-3"
          style={{ border: "5px solid var(--surface-card)" }}
        />
        <h2 className="text-2xl font-bold text-900 mb-1 mt-2">
          {profile.full_name}
        </h2>
        <span className="text-lg text-600 font-medium mb-2 block">
          {profile.position_name}
        </span>
        <div className="surface-200 text-700 border-round-2xl px-3 py-1 text-sm font-semibold">
          {profile.department_name}
        </div>
      </div>

      <Divider className="my-0" />

      <div className="p-4 flex-1">
        <h5 className="mb-3 text-700 font-bold">Kontak & Lokasi</h5>
        <div className="flex flex-column gap-3">
          <div className="flex align-items-center p-2 border-round hover:surface-100 transition-duration-200 cursor-pointer">
            <div className="w-2rem h-2rem flex align-items-center justify-content-center bg-blue-100 border-round mr-3">
              <i className="pi pi-envelope text-blue-600" />
            </div>
            <div className="flex flex-column overflow-hidden">
              <span className="text-xs text-500">Email</span>
              <span
                className="text-sm font-medium text-900 white-space-nowrap overflow-hidden text-overflow-ellipsis"
                title={profile.email}
              >
                {profile.email}
              </span>
            </div>
          </div>
          <div className="flex align-items-center p-2 border-round hover:surface-100 transition-duration-200 cursor-pointer">
            <div className="w-2rem h-2rem flex align-items-center justify-content-center bg-green-100 border-round mr-3">
              <i className="pi pi-phone text-green-600" />
            </div>
            <div className="flex flex-column">
              <span className="text-xs text-500">Telepon</span>
              <span className="text-sm font-medium text-900">
                {profile.contact_phone}
              </span>
            </div>
          </div>
          <div className="flex align-items-center p-2 border-round hover:surface-100 transition-duration-200 cursor-pointer">
            <div className="w-2rem h-2rem flex align-items-center justify-content-center bg-orange-100 border-round mr-3">
              <i className="pi pi-building text-orange-600" />
            </div>
            <div className="flex flex-column">
              <span className="text-xs text-500">Penempatan</span>
              <span className="text-sm font-medium text-900">
                {officeInfo.detail}
              </span>
            </div>
          </div>
          <div className="flex align-items-center p-2 border-round hover:surface-100 transition-duration-200 cursor-pointer">
            <div className="w-2rem h-2rem flex align-items-center justify-content-center bg-gray-100 border-round mr-3">
              <i className="pi pi-home text-gray-600" />
            </div>
            <div className="flex flex-column">
              <span className="text-xs text-500">Domisili</span>
              <span className="text-sm font-medium text-900 line-height-3">
                {profile.address}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}