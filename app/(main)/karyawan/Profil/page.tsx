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
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";

// --- INTERFACE ---
interface UserProfile {
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
  first_name: string;
  last_name: string;
  email?: string;
  profile_image_url?: string | null;
}

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

  // --- useEffect ---
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

  // --- FUNGSI CRUD ---
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

  // --- FUNGSI HELPER ---
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

  // --- LOGIKA PENENTUAN KANTOR ---
  const getOfficeLocationInfo = () => {
    if (!profile) return { label: "", severity: null, icon: "" };

    const division = profile.division_name?.toUpperCase() || "";
    const isHeadOffice =
      division.includes("PUSAT") ||
      division.includes("HEAD") ||
      division.includes("DIREKSI") ||
      profile.department_code === "HO";

    if (isHeadOffice) {
      return {
        label: "Kantor Pusat",
        severity: "warning", // Warna Emas/Oranye
        icon: "pi pi-building",
        detail: "Head Office - Jakarta",
      };
    } else {
      return {
        label: "Kantor Cabang",
        severity: "info", // Warna Biru
        icon: "pi pi-map-marker",
        detail: `Cabang ${profile.birth_place || "Regional"}`,
      };
    }
  };

  const officeInfo = getOfficeLocationInfo();

  // --- 6. FUNGSI RENDER KONTEN (MODERN GRID + ICON BUTTON) ---
  const renderTabContent = () => {
    if (!profile) return null;

    // Helper Component
    const InfoItem = ({
      icon,
      label,
      value,
      className = "",
    }: {
      icon: string;
      label: string;
      value: React.ReactNode;
      className?: string;
    }) => (
      <div className={`col-12 md:col-6 mb-2 ${className}`}>
        <div className="flex align-items-center mb-2">
          <div className="w-2rem h-2rem flex align-items-center justify-content-center bg-blue-50 text-blue-600 border-round mr-2">
            <i className={`pi ${icon} text-sm`} />
          </div>
          <span className="text-500 text-sm font-medium">{label}</span>
        </div>
        <div className="pl-6">
          <span className="text-900 font-semibold text-lg">{value}</span>
        </div>
      </div>
    );

    switch (activeIndex) {
      // --- TAB 0: DETAIL PROFIL ---
      case 0:
        return (
          <Card className="border-none shadow-none h-full">
            {/* Header dengan Tombol Minimalis */}
            <div className="flex align-items-center justify-content-between mb-5">
              <h3 className="m-0 text-900 font-bold">Detail Dasar</h3>
              
              {!isEditMode ? (
                // TOMBOL EDIT: Ikon Bulat
                <Button
                  icon="pi pi-pencil"
                  rounded
                  text
                  severity="secondary" 
                  aria-label="Edit"
                  tooltip="Edit Profil"
                  tooltipOptions={{ position: 'left' }}
                  onClick={handleEdit}
                  className="surface-100 text-700 hover:surface-200"
                />
              ) : (
                // TOMBOL ACTION: Kecil & Rapi
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
            </div>

            {/* MODE EDIT (Form Input) */}
            {isEditMode ? (
              <div className="p-fluid grid formgrid">
                <div className="field col-12">
                  <label className="font-semibold block mb-2">
                    Ubah Foto Profil
                  </label>
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
                  <label className="text-sm font-medium text-700">
                    Nama Depan
                  </label>
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
                  <label className="text-sm font-medium text-700">
                    No. Telepon
                  </label>
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
              /* MODE BACA (Grid Modern) */
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
            )}
          </Card>
        );

      // --- TAB 1: INFORMASI PEKERJAAN ---
      case 1:
        const detailedOfficeAddress =
          officeInfo.label === "Kantor Pusat"
            ? "Gedung Menara HR, Jl. Jend. Sudirman Kav. 52-53, Senayan, Jakarta Selatan"
            : `Ruko Bisnis Center No. 88, ${
                profile.birth_place || "Kota Cabang"
              }, Jawa Timur`;

        return (
          <Card className="border-none shadow-none h-full">
            <h3 className="m-0 mb-4 text-900 font-bold">Status & Penempatan</h3>

            {/* KARTU LOKASI */}
            <div className="surface-50 border-1 border-gray-200 border-round-xl p-4 mb-5 hover:shadow-2 transition-duration-200">
              <div className="flex justify-content-between mb-3">
                <span className="text-blue-600 font-bold flex align-items-center gap-2">
                  <i className="pi pi-building"></i> Lokasi Kerja
                </span>
                <Tag
                  value={officeInfo.label}
                  severity={officeInfo.severity as any}
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
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    detailedOfficeAddress
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-500 no-underline hover:text-blue-700 mt-2 font-medium"
                >
                  <i className="pi pi-map-marker mr-1"></i> Lihat di Peta
                </a>
              </div>
            </div>

            {/* GRID INFO PEKERJAAN */}
            <div className="grid row-gap-4">
              <InfoItem
                icon="pi-id-card"
                label="Posisi / Jabatan"
                value={profile.position_name}
              />
              <InfoItem
                icon="pi-briefcase"
                label="Status Kepegawaian"
                value={
                  <Tag
                    severity="success"
                    value={capitalizeFirstLetter(profile.employment_status)}
                  />
                }
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
                icon="pi-calendar"
                label="Tanggal Bergabung"
                value={formatLocalDate(profile.join_date)}
              />
              <InfoItem
                icon="pi-calendar-times"
                label="Tanggal Resign"
                value={
                  profile.resign_date
                    ? formatLocalDate(profile.resign_date)
                    : "-"
                }
              />
            </div>
          </Card>
        );

      // --- TAB 2: DATA PRIBADI ---
      case 2:
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
                <InfoItem
                  icon="pi-star"
                  label="Agama"
                  value={profile.religion}
                />
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

      // --- TAB 3: DATA FINANSIAL ---
      case 3:
        return (
          <Card className="border-none shadow-none h-full">
            <h3 className="m-0 mb-4 text-900 font-bold">Informasi Finansial</h3>

            <div className="grid">
              {/* Kartu Bank Style */}
              <div className="col-12 md:col-6">
                <div
                  className="p-4 border-round-xl h-full shadow-1"
                  style={{
                    background:
                      "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                    color: "white",
                  }}
                >
                  <div className="flex justify-content-between align-items-start mb-4">
                    <i className="pi pi-credit-card text-3xl opacity-80"></i>
                    <span className="text-xs border-1 border-white border-round px-2 py-1 opacity-70">
                      PAYROLL
                    </span>
                  </div>
                  <div className="mb-1 text-sm opacity-70">Nomor Rekening</div>
                  <div className="text-2xl font-mono font-bold tracking-wider mb-4">
                    {profile.bank_account || "Belum Terdaftar"}
                  </div>
                  <div className="text-sm font-medium">Bank Transfer</div>
                </div>
              </div>

              {/* Kartu NPWP Style */}
              <div className="col-12 md:col-6">
                <div className="p-4 surface-50 border-1 border-gray-200 border-round-xl h-full">
                  <div className="flex align-items-center gap-3 mb-3">
                    <div className="bg-yellow-100 text-yellow-700 p-2 border-round">
                      <i className="pi pi-file text-xl"></i>
                    </div>
                    <span className="font-bold text-700">NPWP</span>
                  </div>
                  <div className="text-xl font-bold text-900">
                    {profile.npwp || "-"}
                  </div>
                  <div className="text-xs text-500 mt-2">
                    Wajib Pajak Orang Pribadi
                  </div>
                </div>
              </div>

              {/* Kartu BPJS */}
              <div className="col-12 mt-3">
                <div className="surface-card border-1 border-gray-200 border-round-xl p-0 overflow-hidden">
                  <div className="bg-green-50 p-3 border-bottom-1 border-green-100 flex justify-content-between">
                    <span className="font-bold text-green-800">
                      <i className="pi pi-shield mr-2"></i>Jaminan Sosial (BPJS)
                    </span>
                  </div>
                  <div className="grid p-3">
                    <InfoItem
                      icon="pi-briefcase"
                      label="BPJS Ketenagakerjaan"
                      value={profile.bpjs_ketenagakerjaan}
                    />
                    <InfoItem
                      icon="pi-heart-fill"
                      label="BPJS Kesehatan"
                      value={profile.bpjs_kesehatan}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  // --- SKELETON ---
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

  // --- RETURN UTAMA ---
  return (
    <div className="grid p-fluid">
      <Toast ref={toast} />

      {/* --- KOLOM KIRI (COVER BANNER STYLE) --- */}
      <div className="col-12 lg:col-4">
        <Card className="shadow-4 border-none p-0 overflow-hidden h-full flex flex-column">
          {/* 1. BANNER BACKGROUND */}
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
                severity={officeInfo.severity as any}
                icon={officeInfo.icon}
                className="shadow-2"
              />
            </div>
          </div>

          {/* 2. AREA FOTO & NAMA */}
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

          {/* 3. KONTAK CEPAT (LIST CLEAN) */}
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
      </div>

      {/* --- KOLOM KANAN (MODERN GRID TAB CONTENT) --- */}
      <div className="col-12 lg:col-8">
        <div className="hidden lg:block">
          <TabView
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
            className="shadow-2 h-full"
          >
            {tabOptions.map((tab) => (
              <TabPanel
                key={tab.value}
                header={tab.label}
                leftIcon={tab.icon}
              />
            ))}
          </TabView>
        </div>

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

        <div className="card shadow-2 p-0 lg:p-0 border-none">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}