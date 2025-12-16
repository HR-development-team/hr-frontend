"use client";

import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from "primereact/divider";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
// import { UserProfile, InfoItem } from "@/lib/types/profil";

interface TabBasicInfoProps {
  // profile: UserProfile;
  isEditMode: boolean;
  isSubmitting: boolean;
  handleEdit: () => void;
  handleCancel: () => void;
  handleSave: () => void;
  formData: { contact_phone: string; address: string };
  setFormData: (data: { contact_phone: string; address: string }) => void;
  fileUploadRef: React.RefObject<FileUpload>;
  handleFileSelect: (e: FileUploadSelectEvent) => void;
}

export default function TabBasicInfo({
  // profile,
  isEditMode,
  isSubmitting,
  handleEdit,
  handleCancel,
  handleSave,
  formData,
  setFormData,
  fileUploadRef,
  handleFileSelect,
}: TabBasicInfoProps) {
  return (
    <Card className="border-none shadow-none h-full">
      {/* HEADER: Judul & Tombol Action */}
      {/* <div className="flex align-items-center justify-content-between mb-5">
        <h3 className="m-0 text-900 font-bold">Detail Dasar</h3>
        {!isEditMode ? (
          <Button
            icon="pi pi-pencil"
            rounded
            text
            severity="secondary"
            aria-label="Edit"
            tooltip="Edit Profil"
            tooltipOptions={{ position: "left" }}
            onClick={handleEdit}
            className="surface-100 text-700 hover:surface-200"
          />
        ) : (
          <div className="flex align-items-center gap-2">
            <Button
              icon="pi pi-times"
              rounded
              text
              severity="danger"
              aria-label="Batal"
              tooltip="Batal"
              onClick={handleCancel}
              disabled={isSubmitting}
            />
            <Button
              icon="pi pi-check"
              rounded
              aria-label="Simpan"
              tooltip="Simpan"
              className="p-button-success shadow-2"
              onClick={handleSave}
              loading={isSubmitting}
            />
          </div>
        )}
      </div> */}

      {/* KONTEN: Form Edit vs Mode Baca */}
      {/* {isEditMode ? (
        <div className="p-fluid grid formgrid">
          <div className="field col-12">
            <label className="font-semibold block mb-2">Ubah Foto Profil</label>
            <FileUpload
              ref={fileUploadRef}
              name="profile_pic"
              mode="basic"
              accept="image/*"
              maxFileSize={2000000}
              auto={false}
              customUpload={true}
              onSelect={handleFileSelect}
              chooseLabel="Pilih File Foto"
              className="w-full"
            />
          </div>
          <Divider className="col-12 mb-4" />
          <div className="field col-12 md:col-6">
            <label className="text-sm font-medium text-700">Nama Depan</label>
            <InputText
              value={profile.first_name}
              disabled
              className="bg-gray-50"
            />
          </div>
          <div className="field col-12 md:col-6">
            <label className="text-sm font-medium text-700">
              Nama Belakang
            </label>
            <InputText
              value={profile.last_name}
              disabled
              className="bg-gray-50"
            />
          </div>
          <div className="field col-12 md:col-6">
            <label className="text-sm font-medium text-700">No. Telepon</label>
            <InputText
              value={formData.contact_phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact_phone: e.target.value,
                })
              }
            />
          </div>
          <div className="field col-12">
            <label className="text-sm font-medium text-700">
              Alamat Lengkap
            </label>
            <InputTextarea
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              rows={3}
            />
          </div>
        </div>
      ) : (
        <div className="grid">
          <InfoItem
            icon="pi-user"
            label="Nama Lengkap"
            value={profile.full_name}
            className="md:col-12"
          />
          <Divider className="col-12 my-2 border-gray-100" />
          <InfoItem
            icon="pi-phone"
            label="No. Telepon"
            value={profile.contact_phone}
          />
          <InfoItem
            icon="pi-envelope"
            label="Email Akun"
            value={profile.email}
          />
          <Divider className="col-12 my-2 border-gray-100" />
          <InfoItem
            icon="pi-home"
            label="Alamat Domisili"
            value={profile.address}
            className="md:col-12"
          />
        </div>
      )} */}
    </Card>
  );
}
