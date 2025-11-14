"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from "primereact/divider";
import { Skeleton } from "primereact/skeleton";
import { TabView, TabPanel } from "primereact/tabview";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { classNames } from "primereact/utils";
import { useAuth } from "@/components/AuthContext";
import { Dropdown } from "primereact/dropdown"; // Import Dropdown

// --- 1. INTERFACE LENGKAP (TETAP SAMA) ---
interface UserProfile {
  // Properti langsung dari JSON
  id: number;
  employee_code: string;
  position_code: string;
  full_name: string;
  ktp_number: string;
  birth_place: string;
  birth_date: string;
  gender: string;
  address: string;
  contact_phone: string;
  religion: string;
  maritial_status: string;
  join_date: string;
  resign_date: string | null;
  employment_status: string;
  education: string;
  blood_type: string;
  profile_picture: string | null;
  bpjs_ketenagakerjaan: string;
  bpjs_kesehatan: string;
  npwp: string;
  bank_account: string;
  created_at: string;
  updated_at: string;
  position_name: string;
  division_code: string;
  division_name: string;
  department_code: string;
  department_name: string;

  // --- Properti "Virtual" ---
  first_name: string;
  last_name: string;
  email?: string;
  profile_image_url?: string | null;
}
// --- BATAS INTERFACE ---

const API_PROFILE_URL = "/api/karyawan/profile";

export default function ProfilPage() {
  const toast = useRef<Toast>(null);
  const { user, updateAuthUser } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ contact_phone: "", address: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileUploadRef = useRef<FileUpload>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const tabOptions = [
    { label: "Detail Profil", value: 0, icon: "pi pi-user mr-2" },
    { label: "Informasi Pekerjaan", value: 1, icon: "pi pi-briefcase mr-2" },
    { label: "Data Pribadi", value: 2, icon: "pi pi-shield mr-2" },
    { label: "Data Finansial", value: 3, icon: "pi pi-wallet mr-2" },
  ];

  // --- 2. useEffect (TETAP SAMA) ---
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

        // Pecah 'full_name'
        const nameParts = (dataFromServer.full_name || "").split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        // Buat objek 'profileData' yang LENGKAP
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

  // --- 3. FUNGSI-FUNGSI (LENGKAP) ---
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

      // Perbarui state GLOBAL
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

  // --- FUNGSI HELPER (LENGKAP) ---
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
  // --- BATAS FUNGSI HELPER ---

  // --- 6. FUNGSI RENDER KONTEN (DENGAN PERBAIKAN) ---
  const renderTabContent = () => {
    // --- INI SOLUSINYA ---
    // Cek ini akan memberitahu TypeScript bahwa 'profile'
    // tidak 'null' dan akan menghentikan error 'possibly 'null''
    // 'return null' adalah ReactNode yang valid (menghentikan error 'void')
    if (!profile) {
      return null;
    }
    // --- BATAS SOLUSI ---

    // Sekarang, semua 'profile.ktp_number', dll. di bawah ini aman
    switch (activeIndex) {
      // --- KONTEN TAB 1: DETAIL PROFIL ---
      case 0:
        return (
          <Card className="border-none shadow-none">
            <div className="flex justify-content-end gap-2 mb-4">
              {!isEditMode ? (
                <Button
                  label="Edit Profil"
                  icon="pi pi-user-edit"
                  className="p-button-outlined p-button-info"
                  onClick={handleEdit}
                />
              ) : (
                <>
                  <Button
                    label="Batal"
                    icon="pi pi-times"
                    className="p-button-text p-button-secondary"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  />
                  <Button
                    label="Simpan Perubahan"
                    icon="pi pi-check"
                    className="p-button-success"
                    onClick={handleSave}
                    loading={isSubmitting}
                  />
                </>
              )}
            </div>
            <div className="p-fluid grid formgrid">
              {isEditMode && (
                <>
                  <div className="field col-12">
                    <label
                      htmlFor="upload"
                      className="font-semibold block mb-2"
                    >
                      <i className="pi pi-image mr-2" /> Ubah Foto Profil
                    </label>
                    <FileUpload
                      ref={fileUploadRef}
                      name="profile_pic"
                      mode="advanced"
                      accept="image/*"
                      maxFileSize={2000000}
                      auto={false}
                      customUpload={true}
                      onSelect={handleFileSelect}
                      chooseLabel="Pilih Foto"
                      cancelLabel="Hapus"
                      emptyTemplate={
                        <p className="m-0 text-500">
                          Seret dan lepas gambar di sini atau pilih untuk
                          mengunggah.
                        </p>
                      }
                      headerTemplate={(options) => (
                        <div className="flex flex-column md:flex-row align-items-center justify-content-between p-3 surface-overlay border-bottom-1 surface-border">
                          <span className="text-lg font-semibold mb-2 md:mb-0">
                            Pilih Foto Profil Baru
                          </span>
                          <div className="flex gap-2">
                            {options.chooseButton}
                            {options.cancelButton}
                          </div>
                        </div>
                      )}
                    />
                  </div>
                  <div className="col-12">
                    <Divider />
                  </div>
                </>
              )}
              <div className="field col-12 md:col-6">
                <label htmlFor="firstname" className="font-semibold block mb-2">
                  <i className="pi pi-user mr-2 text-primary-500" /> Nama Depan
                </label>
                <InputText
                  id="firstname"
                  value={profile.first_name}
                  readOnly
                  disabled
                  className="p-inputtext-sm"
                />
              </div>
              <div className="field col-12 md:col-6">
                <label htmlFor="lastname" className="font-semibold block mb-2">
                  <i className="pi pi-user mr-2 text-primary-500" /> Nama
                  Belakang
                </label>
                <InputText
                  id="lastname"
                  value={profile.last_name}
                  readOnly
                  disabled
                  className="p-inputtext-sm"
                />
              </div>
              <div className="field col-12 md:col-6">
                <label htmlFor="phone" className="font-semibold block mb-2">
                  <i className="pi pi-phone mr-2 text-primary-500" /> No.
                  Telepon Kontak
                </label>
                <InputText
                  id="phone"
                  value={
                    isEditMode ? formData.contact_phone : profile.contact_phone
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact_phone: e.target.value,
                    })
                  }
                  readOnly={!isEditMode}
                  disabled={!isEditMode}
                  className={classNames({
                    "p-inputtext-sm": true,
                    "p-invalid": !formData.contact_phone && isEditMode,
                  })}
                />
                {isEditMode && !formData.contact_phone && (
                  <small className="p-error">Nomor telepon wajib diisi.</small>
                )}
              </div>
              <div className="field col-12">
                <label htmlFor="address" className="font-semibold block mb-2">
                  <i className="pi pi-home mr-2 text-primary-500" /> Alamat
                </label>
                <InputTextarea
                  id="address"
                  value={isEditMode ? formData.address : profile.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  readOnly={!isEditMode}
                  disabled={!isEditMode}
                  rows={4}
                  autoResize
                  className={classNames({
                    "p-inputtext-sm": true,
                    "p-invalid": !formData.address && isEditMode,
                  })}
                />
                {isEditMode && !formData.address && (
                  <small className="p-error">Alamat wajib diisi.</small>
                )}
              </div>
            </div>
          </Card>
        );

      // --- KONTEN TAB 2: INFORMASI PEKERJAAN ---
      case 1:
        return (
          <Card className="border-none shadow-none">
            <div className="p-3">
              <div className="flex flex-column gap-4">
                <div className="flex flex-column md:flex-row md:justify-content-between align-items-start md:align-items-center">
                  <span className="font-semibold text-base flex align-items-center">
                    <i className="pi pi-envelope mr-2 text-lg text-primary-500" />{" "}
                    Email
                  </span>
                  <span className="text-color-secondary text-lg mt-1 md:mt-0 md:text-right">
                    {profile.email || "Tidak ada email"}
                  </span>
                </div>
                <Divider className="my-1" />
                <div className="flex flex-column md:flex-row md:justify-content-between align-items-start md:align-items-center">
                  <span className="font-semibold text-base flex align-items-center">
                    <i className="pi pi-id-card mr-2 text-lg text-primary-500" />{" "}
                    Posisi / Jabatan
                  </span>
                  <span className="text-color-secondary text-lg mt-1 md:mt-0 md:text-right">
                    {profile.position_name}
                  </span>
                </div>
                <Divider className="my-1" />
                <div className="flex flex-column md:flex-row md:justify-content-between align-items-start md:align-items-center">
                  <span className="font-semibold text-base flex align-items-center">
                    <i className="pi pi-sitemap mr-2 text-lg text-primary-500" />{" "}
                    Divisi
                  </span>
                  <span className="text-color-secondary text-lg mt-1 md:mt-0 md:text-right">
                    {profile.division_name || "-"}
                  </span>
                </div>
                <Divider className="my-1" />
                <div className="flex flex-column md:flex-row md:justify-content-between align-items-start md:align-items-center">
                  <span className="font-semibold text-base flex align-items-center">
                    <i className="pi pi-building mr-2 text-lg text-primary-500" />{" "}
                    Departemen
                  </span>
                  <span className="text-color-secondary text-lg mt-1 md:mt-0 md:text-right">
                    {profile.department_name}
                  </span>
                </div>
                <Divider className="my-1" />
                <div className="flex flex-column md:flex-row md:justify-content-between align-items-start md:align-items-center">
                  <span className="font-semibold text-base flex align-items-center">
                    <i className="pi pi-check-circle mr-2 text-lg text-primary-500" />{" "}
                    Status Kepegawaian
                  </span>
                  <span className="text-color-secondary text-lg mt-1 md:mt-0 md:text-right">
                    {capitalizeFirstLetter(profile.employment_status)}
                  </span>
                </div>
                <Divider className="my-1" />
                <div className="flex flex-column md:flex-row md:justify-content-between align-items-start md:align-items-center">
                  <span className="font-semibold text-base flex align-items-center">
                    <i className="pi pi-calendar-plus mr-2 text-lg text-primary-500" />{" "}
                    Tanggal Bergabung
                  </span>
                  <span className="text-color-secondary text-lg mt-1 md:mt-0 md:text-right">
                    {formatLocalDate(profile.join_date)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        );

      // --- KONTEN TAB 3: DATA PRIBADI ---
      case 2:
        return (
          <Card className="border-none shadow-none">
            <div className="p-3">
              <div className="flex flex-column gap-4">
                <div className="flex flex-column md:flex-row md:justify-content-between align-items-start md:align-items-center">
                  <span className="font-semibold text-base flex align-items-center">
                    <i className="pi pi-id-card mr-2 text-lg text-primary-500" />{" "}
                    No. KTP
                  </span>
                  <span className="text-color-secondary text-lg mt-1 md:mt-0 md:text-right">
                    {profile.ktp_number || "-"}
                  </span>
                </div>
                <Divider className="my-1" />
                <div className="flex flex-column md:flex-row md:justify-content-between align-items-start md:align-items-center">
                  <span className="font-semibold text-base flex align-items-center">
                    <i className="pi pi-calendar mr-2 text-lg text-primary-500" />{" "}
                    Tempat, Tanggal Lahir
                  </span>
                  <span className="text-color-secondary text-lg mt-1 md:mt-0 md:text-right">
                    {profile.birth_place || "-"},{" "}
                    {formatLocalDate(profile.birth_date)}
                  </span>
                </div>
                <Divider className="my-1" />
                <div className="flex flex-column md:flex-row md:justify-content-between align-items-start md:align-items-center">
                  <span className="font-semibold text-base flex align-items-center">
                    <i className="pi pi-users mr-2 text-lg text-primary-500" />{" "}
                    Jenis Kelamin
                  </span>
                  <span className="text-color-secondary text-lg mt-1 md:mt-0 md:text-right">
                    {capitalizeFirstLetter(profile.gender) || "-"}
                  </span>
                </div>
                <Divider className="my-1" />
                <div className="flex flex-column md:flex-row md:justify-content-between align-items-start md:align-items-center">
                  <span className="font-semibold text-base flex align-items-center">
                    <i className="pi pi-star mr-2 text-lg text-primary-500" />{" "}
                    Agama
                  </span>
                  <span className="text-color-secondary text-lg mt-1 md:mt-0 md:text-right">
                    {profile.religion || "-"}
                  </span>
                </div>
                <Divider className="my-1" />
                <div className="flex flex-column md:flex-row md:justify-content-between align-items-start md:align-items-center">
                  <span className="font-semibold text-base flex align-items-center">
                    <i className="pi pi-heart mr-2 text-lg text-primary-500" />{" "}
                    Status Pernikahan
                  </span>
                  <span className="text-color-secondary text-lg mt-1 md:mt-0 md:text-right">
                    {profile.maritial_status || "-"}
                  </span>
                </div>
                <Divider className="my-1" />
                <div className="flex flex-column md:flex-row md:justify-content-between align-items-start md:align-items-center">
                  <span className="font-semibold text-base flex align-items-center">
                    <i className="pi pi-tint mr-2 text-lg text-primary-500" />{" "}
                    Golongan Darah
                  </span>
                  <span className="text-color-secondary text-lg mt-1 md:mt-0 md:text-right">
                    {profile.blood_type || "-"}
                  </span>
                </div>
                <Divider className="my-1" />
                <div className="flex flex-column md:flex-row md:justify-content-between align-items-start md:align-items-center">
                  <span className="font-semibold text-base flex align-items-center">
                    <i className="pi pi-book mr-2 text-lg text-primary-500" />{" "}
                    Pendidikan
                  </span>
                  <span className="text-color-secondary text-lg mt-1 md:mt-0 md:text-right">
                    {profile.education || "-"}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        );

      // --- KONTEN TAB 4: DATA FINANSIAL ---
      case 3:
        return (
          <Card className="border-none shadow-none">
            <div className="p-3">
              <div className="flex flex-column gap-4">
                <div className="flex flex-column md:flex-row md:justify-content-between align-items-start md:align-items-center">
                  <span className="font-semibold text-base flex align-items-center">
                    <i className="pi pi-briefcase mr-2 text-lg text-primary-500" />{" "}
                    BPJS Ketenagakerjaan
                  </span>
                  <span className="text-color-secondary text-lg mt-1 md:mt-0 md:text-right">
                    {profile.bpjs_ketenagakerjaan || "-"}
                  </span>
                </div>
                <Divider className="my-1" />
                <div className="flex flex-column md:flex-row md:justify-content-between align-items-start md:align-items-center">
                  <span className="font-semibold text-base flex align-items-center">
                    <i className="pi pi-heart-fill mr-2 text-lg text-primary-500" />{" "}
                    BPJS Kesehatan
                  </span>
                  <span className="text-color-secondary text-lg mt-1 md:mt-0 md:text-right">
                    {profile.bpjs_kesehatan || "-"}
                  </span>
                </div>
                <Divider className="my-1" />
                <div className="flex flex-column md:flex-row md:justify-content-between align-items-start md:align-items-center">
                  <span className="font-semibold text-base flex align-items-center">
                    <i className="pi pi-file mr-2 text-lg text-primary-500" />{" "}
                    NPWP
                  </span>
                  <span className="text-color-secondary text-lg mt-1 md:mt-0 md:text-right">
                    {profile.npwp || "-"}
                  </span>
                </div>
                <Divider className="my-1" />
                <div className="flex flex-column md:flex-row md:justify-content-between align-items-start md:align-items-center">
                  <span className="font-semibold text-base flex align-items-center">
                    <i className="pi pi-credit-card mr-2 text-lg text-primary-500" />{" "}
                    Akun Bank
                  </span>
                  <span className="text-color-secondary text-lg mt-1 md:mt-0 md:text-right">
                    {profile.bank_account || "-"}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };
  // --- BATAS FUNGSI RENDER KONTEN ---

  // --- 7. UI SKELETON (LENGKAP) ---
  if (isLoading) {
    return (
      <div className="grid p-fluid">
        <div className="col-12 lg:col-4">
          <Card className="shadow-2 mb-4 h-full flex flex-column">
            <div className="flex flex-column align-items-center mb-4">
              <Skeleton shape="circle" size="8rem" className="mb-3"></Skeleton>
              <Skeleton width="10rem" height="2rem" className="mb-2"></Skeleton>
              <Skeleton width="8rem" height="1.2rem"></Skeleton>
            </div>
            <Divider />
            <div className="flex-1 flex flex-column gap-2">
              <Skeleton width="80%" height="1.2rem" />
              <Skeleton width="70%" height="1.2rem" />
              <Skeleton width="90%" height="1.2rem" />
              <Skeleton width="60%" height="1.2rem" />
            </div>
          </Card>
        </div>
        <div className="col-12 lg:col-8">
          <Card className="shadow-2 h-full">
            <Skeleton height="400px"></Skeleton>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-content-center align-items-center h-screen">
        <Card title="Error">Gagal memuat profil. Silakan coba lagi.</Card>
      </div>
    );
  }

  // --- 8. UI UTAMA (DENGAN LOGIKA DROPDOWN) ---
  return (
    <div className="grid p-fluid">
      <Toast ref={toast} />

      {/* Kolom Kiri (Avatar, dll) - Tidak Berubah */}
      <div className="col-12 lg:col-4">
        <Card className="profile-summary-card shadow-2 h-full flex flex-column">
          <div className="flex flex-column align-items-center text-center p-4">
            <Avatar
              image={imagePreview || profile.profile_image_url || undefined}
              label={
                !imagePreview && !profile.profile_image_url
                  ? `${profile.first_name[0] || ""}${
                      profile.last_name[0] || ""
                    }`.toUpperCase()
                  : undefined
              }
              shape="circle"
              className={classNames(
                "p-overlay-badge p-avatar-info mb-4",
                "w-8rem h-8rem text-4xl lg:w-12rem lg:h-12rem lg:text-6xl"
              )}
              style={{
                border: "4px solid var(--primary-color)",
              }}
            />
            <h2 className="m-0 text-2xl lg:text-3xl font-bold text-color-primary">
              {profile.full_name}
            </h2>
            <p className="text-lg lg:text-xl text-color-secondary mt-2">
              {profile.position_name}
            </p>
            <span className="text-500 text-sm mt-1">
              {profile.department_name}
            </span>
          </div>

          <Divider align="center" type="dashed">
            <b>Kontak Cepat</b>
          </Divider>

          <div className="flex flex-column gap-3 p-4">
            <div className="flex align-items-center">
              <i className="pi pi-envelope mr-3 text-lg lg:text-xl text-primary-500" />
              <span className="text-base lg:text-lg">{profile.email}</span>
            </div>
            <div className="flex align-items-center">
              <i className="pi pi-phone mr-3 text-lg lg:text-xl text-primary-500" />
              <span className="text-base lg:text-lg">
                {profile.contact_phone}
              </span>
            </div>
            <div className="flex align-items-start">
              <i
                className="pi pi-home mr-3 text-lg lg:text-xl text-primary-500"
                style={{ marginTop: "0.2rem" }}
              />
              <span className="text-base lg:text-lg">{profile.address}</span>
            </div>
          </div>
        </Card>
      </div>
      {/* --- BATAS KOLOM KIRI --- */}

      {/* --- Kolom Kanan (DIPERBARUI DENGAN LOGIKA DROPDOWN) --- */}
      <div className="col-12 lg:col-8">
        {/* 1. TAMPILAN DESKTOP (Muncul di 'lg' ke atas) */}
        <div className="hidden lg:block">
          <TabView
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
            className="shadow-2 h-full"
          >
            {/* TabView ini HANYA untuk navigasi, KONTEN ada di renderTabContent */}
            <TabPanel header="Detail Profil" leftIcon="pi pi-user mr-2" />
            <TabPanel
              header="Informasi Pekerjaan"
              leftIcon="pi pi-briefcase mr-2"
            />
            <TabPanel header="Data Pribadi" leftIcon="pi pi-shield mr-2" />
            <TabPanel header="Data Finansial" leftIcon="pi pi-wallet mr-2" />
          </TabView>
        </div>

        {/* 2. TAMPILAN MOBILE (Muncul di bawah 'lg') */}
        <div className="block lg:hidden mb-3">
          <label htmlFor="tab-dropdown" className="font-semibold block mb-2">
            Pilih Halaman
          </label>
          <Dropdown
            id="tab-dropdown"
            value={activeIndex}
            options={tabOptions}
            onChange={(e) => setActiveIndex(e.value)}
            className="w-full"
          />
        </div>

        {/* 3. KONTEN (Selalu tampil, di bawah navigasi) */}
        {/* Kita bungkus konten di dalam Card agar sama seperti sebelumnya */}
        <div className="card shadow-2 p-0 lg:p-0 border-none">
          {renderTabContent()}
        </div>
      </div>
      {/* --- BATAS KOLOM KANAN --- */}
    </div>
  );
}
