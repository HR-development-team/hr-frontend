// /app/karyawan/profil/page.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Divider } from 'primereact/divider';
import { Skeleton } from 'primereact/skeleton';
import { TabView, TabPanel } from 'primereact/tabview';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  contact_phone: string;
  address: string;
  join_date: string;
  position_id: number;
  email?: string;
  position_name?: string;
  department_name?: string;
  profile_image_url?: string | null;
}

const API_URL = '/api/karyawan/profile2';

export default function ProfilPage() {
  const toast = useRef<Toast>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ contact_phone: '', address: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
   const fileUploadRef = useRef<FileUpload>(null);

  // === 1. Ambil Data Profil dari Backend ===
  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();

        if (!res.ok || !data.users) {
          throw new Error(data.message || 'Gagal memuat profil dari server');
        }

        const userData = data.users;

        // Tambahkan field tambahan opsional (email, posisi, dsb.)
        const mergedProfile: UserProfile = {
          ...userData,
          email: userData.email || 'Tidak ada email',
          position_name: userData.position_name || 'Belum ditentukan',
          department_name: userData.department_name || 'Belum ditentukan',
          profile_image_url: userData.profile_image_url || null,
        };

        setProfile(mergedProfile);
        setFormData({
          contact_phone: mergedProfile.contact_phone,
          address: mergedProfile.address,
        });
      } catch (err: any) {
        console.error(err);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: err.message || 'Gagal memuat profil',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  // === 2. Fungsi Edit / Batal ===
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

  // === 3. Simpan Profil (PUT ke Backend) ===
  const handleSave = async () => {
    if (!profile) return;
    setIsSubmitting(true);

    try {
      const dataToSave = new FormData();
      dataToSave.append('contact_phone', formData.contact_phone);
      dataToSave.append('address', formData.address);
      if (selectedFile) {
        dataToSave.append('profile_image', selectedFile);
      }

      const res = await fetch(API_URL, {
        method: 'PUT',
        body: dataToSave,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal memperbarui profil.');

      toast.current?.show({
        severity: 'success',
        summary: 'Sukses',
        detail: 'Profil berhasil diperbarui',
      });

      // Update data setelah sukses
      setProfile({ ...profile, ...formData });
      setIsEditMode(false);
      setImagePreview(null);
      setSelectedFile(null);
    } catch (err: any) {
      console.error(err);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Terjadi kesalahan saat menyimpan profil',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // === 4. Format Tanggal ===
  const formatJoinDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // === 5. UI Skeleton (Loading State) ===
  if (isLoading) {
    return (
      <div className="grid">
        <div className="col-12">
          <Card className="shadow-1 mb-4">
            <div className="flex flex-column md:flex-row align-items-center">
              <Skeleton shape="circle" size="8rem" className="mb-3 md:mb-0 md:mr-4"></Skeleton>
              <div className="flex-1">
                <Skeleton width="15rem" height="2.5rem" className="mb-2"></Skeleton>
                <Skeleton width="10rem" height="1.5rem"></Skeleton>
              </div>
            </div>
          </Card>
          <Card className="shadow-1">
            <Skeleton height="350px"></Skeleton>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <Card title="Error">Gagal memuat profil. Silakan coba lagi.</Card>;
  }

  // === 6. UI Utama ===
  return (
    <div className="grid">
      <Toast ref={toast} />

      {/* Header Profil */}
      <div className="col-12">
        <Card className="shadow-1">
          <div className="flex flex-column md:flex-row align-items-center">
            <Avatar
              image={imagePreview || profile.profile_image_url || undefined}
              label={
                !imagePreview && !profile.profile_image_url
                  ? `${profile.first_name[0] || ''}${profile.last_name[0] || ''}`.toUpperCase()
                  : undefined
              }
              shape="circle"
              className="mb-3 md:mb-0 md:mr-4 p-avatar-info"
              style={{ width: '128px', height: '128px', fontSize: '3rem' }}
            />
            <div className="flex-1 text-center md:text-left">
              <h2 className="m-0">{profile.first_name} {profile.last_name}</h2>
              <p className="text-color-secondary mt-1 text-lg">{profile.position_name}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* TabView Profil */}
      <div className="col-12 mt-4">
        <TabView scrollable>
          {/* Tab 1: Detail Profil */}
          <TabPanel header="Detail Profil" leftIcon="pi pi-user mr-2">
            <Card>
              <div className="flex justify-content-end gap-2 mb-4">
                {!isEditMode ? (
                  <Button label="Edit Profil" icon="pi pi-user-edit" className="p-button-text" onClick={handleEdit} />
                ) : (
                  <>
                    <Button
                      label="Batal"
                      icon="pi pi-times"
                      className="p-button-text"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    />
                    <Button
                      label="Simpan Perubahan"
                      icon="pi pi-check"
                      onClick={handleSave}
                      loading={isSubmitting}
                    />
                  </>
                )}
              </div>

              <div className="p-fluid grid">
                {isEditMode && (
                  <>
                    <div className="field col-12">
                      <label htmlFor="upload" className="font-semibold block mb-2">
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
                        headerTemplate={(options) => (
                          <div className="flex flex-column md:flex-row align-items-center justify-content-between p-3 surface-overlay border-bottom-1 surface-border">
                            <span className="text-lg font-semibold mb-2 md:mb-0">Pilih Foto Profil Baru</span>
                            <div className="flex gap-2">{options.chooseButton}{options.cancelButton}</div>
                          </div>
                        )}
                      />
                    </div>
                    <div className="col-12"><Divider /></div>
                  </>
                )}

                {/* Field Nama */}
                <div className="field col-12 md:col-6">
                  <label htmlFor="firstname" className="font-semibold block mb-2">
                    <i className="pi pi-user mr-2" /> Nama Depan
                  </label>
                  <InputText id="firstname" value={profile.first_name} readOnly disabled />
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="lastname" className="font-semibold block mb-2">
                    <i className="pi pi-user mr-2" /> Nama Belakang
                  </label>
                  <InputText id="lastname" value={profile.last_name} readOnly disabled />
                </div>

                {/* Field yang Bisa Diedit */}
                <div className="field col-12 md:col-6">
                  <label htmlFor="phone" className="font-semibold block mb-2">
                    <i className="pi pi-phone mr-2" /> No. Telepon Kontak
                  </label>
                  <InputText
                    id="phone"
                    value={isEditMode ? formData.contact_phone : profile.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    readOnly={!isEditMode}
                    disabled={!isEditMode}
                  />
                </div>

                <div className="field col-12">
                  <label htmlFor="address" className="font-semibold block mb-2">
                    <i className="pi pi-home mr-2" /> Alamat
                  </label>
                  <InputTextarea
                    id="address"
                    value={isEditMode ? formData.address : profile.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    readOnly={!isEditMode}
                    disabled={!isEditMode}
                    rows={4}
                    autoResize
                  />
                </div>
              </div>
            </Card>
          </TabPanel>

          {/* Tab 2: Informasi Pekerjaan */}
          <TabPanel header="Informasi Pekerjaan" leftIcon="pi pi-briefcase mr-2">
            <Card>
              <div className="p-3">
                <div className="flex flex-column gap-4">
                  <div className="flex flex-column md:flex-row md:justify-content-between">
                    <span className="font-semibold text-lg flex align-items-center">
                      <i className="pi pi-envelope mr-3 text-xl" /> Email
                    </span>
                    <span className="text-color-secondary text-lg md:text-right">
                      {profile.email || 'Tidak ada email'}
                    </span>
                  </div>
                  <Divider />

                  <div className="flex flex-column md:flex-row md:justify-content-between">
                    <span className="font-semibold text-lg flex align-items-center">
                      <i className="pi pi-id-card mr-3 text-xl" /> Posisi / Jabatan
                    </span>
                    <span className="text-color-secondary text-lg md:text-right">
                      {profile.position_name}
                    </span>
                  </div>
                  <Divider />

                  <div className="flex flex-column md:flex-row md:justify-content-between">
                    <span className="font-semibold text-lg flex align-items-center">
                      <i className="pi pi-sitemap mr-3 text-xl" /> Departemen
                    </span>
                    <span className="text-color-secondary text-lg md:text-right">
                      {profile.department_name}
                    </span>
                  </div>
                  <Divider />

                  <div className="flex flex-column md:flex-row md:justify-content-between">
                    <span className="font-semibold text-lg flex align-items-center">
                      <i className="pi pi-calendar-plus mr-3 text-xl" /> Tanggal Bergabung
                    </span>
                    <span className="text-color-secondary text-lg">{formatJoinDate(profile.join_date)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
}

