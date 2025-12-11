"use client";

import React, { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { useAuth } from "@/components/AuthContext";

// IMPORT DIPERBARUI (Types & Components)
import { UserProfile, OfficeInfo } from "@/lib/types/profil";
import ProfileSidebar from "./components/ProfileSidebar";
import ProfileTabs from "./components/ProfileTabs";

const API_PROFILE_URL = "/api/karyawan/profile";

export default function ProfilPage() {
  const toast = useRef<Toast>(null);
  const { user, updateAuthUser } = useAuth();
  const fileUploadRef = useRef<FileUpload>(null);

  // --- STATE ---
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ contact_phone: "", address: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // --- FETCH DATA ---
  useEffect(() => {
    if (!user) {
      setIsLoading(true);
      return;
    }

    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        const profileRes = await fetch(API_PROFILE_URL);
        const profileJson = await profileRes.json();

        if (!profileRes.ok) {
          throw new Error(profileJson.message || "Gagal memuat data profil.");
        }

        const dataFromServer = profileJson.users;
        if (!dataFromServer) {
          throw new Error("Data profil karyawan tidak ditemukan.");
        }

        const nameParts = (dataFromServer.full_name || "").split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        const profileData: UserProfile = {
          ...dataFromServer,
          first_name: firstName,
          last_name: lastName,
          profile_image_url: dataFromServer.profile_picture,
          email: user.email,
        };

        setProfile(profileData);
        setFormData({
          contact_phone: profileData.contact_phone,
          address: profileData.address,
        });
      } catch (err: any) {
        console.error(err);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: err.message || "Gagal memuat profil",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  // --- LOGIKA KANTOR ---
  const getOfficeLocationInfo = (): OfficeInfo => {
    if (!profile)
      return { label: "", severity: undefined, icon: "", detail: "" };

    const officeName = profile.office_name || "";
    const isHeadOffice =
      officeName.toLowerCase().includes("pusat") ||
      officeName.toLowerCase().includes("head") ||
      profile.department_code === "HO";

    if (isHeadOffice) {
      return {
        label: "Kantor Pusat",
        severity: "warning",
        icon: "pi pi-building",
        detail: officeName,
      };
    } else {
      return {
        label: "Kantor Cabang",
        severity: "info",
        icon: "pi pi-map-marker",
        detail: officeName,
      };
    }
  };

  const officeInfo = getOfficeLocationInfo();

  // --- HANDLERS ---
  const handleEdit = () => {
    setIsEditMode(true);
    setImagePreview(null);
    setSelectedFile(null);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        contact_phone: profile.contact_phone,
        address: profile.address,
      });
    }
    setIsEditMode(false);
    setImagePreview(null);
    setSelectedFile(null);
    fileUploadRef.current?.clear();
  };

  const handleFileSelect = (e: FileUploadSelectEvent) => {
    const file = e.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!profile || !user) return;

    setIsSubmitting(true);
    try {
      const dataToSave = new FormData();
      dataToSave.append("contact_phone", formData.contact_phone);
      dataToSave.append("address", formData.address);
      if (selectedFile) {
        dataToSave.append("profile_picture", selectedFile);
      }

      const res = await fetch(API_PROFILE_URL, {
        method: "PUT",
        body: dataToSave,
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || "Gagal memperbarui profil.");

      toast.current?.show({
        severity: "success",
        summary: "Sukses",
        detail: "Profil berhasil diperbarui",
      });

      const updatedProfileFromServer = result.updatedUser;
      const finalUpdatedProfile = { ...profile, ...updatedProfileFromServer };

      setProfile(finalUpdatedProfile);
      setFormData({
        contact_phone: finalUpdatedProfile.contact_phone,
        address: finalUpdatedProfile.address,
      });

      updateAuthUser({
        ...user,
        contact_phone: formData.contact_phone,
        address: formData.address,
        profile_picture:
          updatedProfileFromServer?.profile_picture || user.profile_picture,
        full_name: profile.full_name,
      });

      setIsEditMode(false);
      setImagePreview(null);
      setSelectedFile(null);
      fileUploadRef.current?.clear();
    } catch (err: any) {
      console.error(err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Terjadi kesalahan saat menyimpan profil",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- SKELETON LOADING ---
  if (isLoading) {
    return (
      <div className="grid p-fluid">
        <div className="col-12 lg:col-4">
          <Skeleton height="400px" className="mb-2" />
        </div>
        <div className="col-12 lg:col-8">
          <Skeleton height="400px" />
        </div>
      </div>
    );
  }

  if (!profile) return <div>Error</div>;

  // --- RENDER UTAMA ---
  return (
    <div className="grid p-fluid">
      <Toast ref={toast} />

      <div className="col-12 lg:col-4">
        <ProfileSidebar
          profile={profile}
          officeInfo={officeInfo}
          imagePreview={imagePreview}
        />
      </div>

      <div className="col-12 lg:col-8">
        <ProfileTabs
          profile={profile}
          officeInfo={officeInfo}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          isEditMode={isEditMode}
          isSubmitting={isSubmitting}
          handleEdit={handleEdit}
          handleCancel={handleCancel}
          handleSave={handleSave}
          formData={formData}
          setFormData={setFormData}
          fileUploadRef={fileUploadRef}
          handleFileSelect={handleFileSelect}
        />
      </div>
    </div>
  );
}