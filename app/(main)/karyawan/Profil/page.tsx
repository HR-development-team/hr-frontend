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
// 1. Impor TabView dan TabPanel untuk layout baru
import { TabView, TabPanel } from 'primereact/tabview';
// 1. Impor FileUpload dan tipenya
import { FileUpload, FileUploadSelectEvent, FileUploadHandlerEvent } from 'primereact/fileupload';

// --- Tipe Data Bohongan (Mock) ---
interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  contact_phone: string;
  address: string;
  join_date: string; // Akan kita format
  position_id: number;
  profile_image_url: string | null;
  
  // Data tambahan (mock)
  email: string;
  position_name: string;
  department_name: string;
}

// --- Data Bohongan (Mock) ---
const mockProfile: UserProfile = {
  id: 1,
  first_name: 'Lugas',
  last_name: 'Hermanto',
  email: 'lugas655@gmail.com',
  contact_phone: '08123456789',
  address: 'Jl. Merdeka No. 17, Jakarta Pusat, DKI Jakarta 10110',
  join_date: '2023-03-15T00:00:00Z',
  position_id: 10,
  profile_image_url: null, // Set ke null untuk tes fallback inisial
  position_name: 'Software Developer',
  department_name: 'Information Technology (IT)',
};

export default function ProfilPage() {
  const toast = useRef<Toast>(null);
  
  // State Utama
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State untuk form yang diedit
  const [formData, setFormData] = useState({
    contact_phone: '',
    address: ''
  });

  // --- 2. State Baru untuk File Upload ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileUploadRef = useRef<FileUpload>(null); // Ref untuk clear file

  // Muat data profil saat halaman dibuka
  useEffect(() => {
    //
    // --- TEMPAT UNTUK KONEKSI BACKEND (Fetch Profil) ---
    //
    // const fetchProfile = async () => { ... };
    // fetchProfile();
    //
    
    // Simulasi (Hapus ini saat backend siap)
    setTimeout(() => {
      setProfile(mockProfile);
      if (mockProfile) {
          setFormData({
            contact_phone: mockProfile.contact_phone,
            address: mockProfile.address
          });
      }
      setIsLoading(false);
    }, 1200);
  }, []);

  // --- Fungsi Aksi ---
  const handleEdit = () => {
    setIsEditMode(true);
    setImagePreview(null); // Bersihkan preview saat masuk mode edit
    setSelectedFile(null); // Bersihkan file saat masuk mode edit
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        contact_phone: profile.contact_phone,
        address: profile.address
      });
    }
    setIsEditMode(false);
    setImagePreview(null); // Bersihkan preview
    setSelectedFile(null); // Bersihkan file
    fileUploadRef.current?.clear(); // Hapus file dari komponen FileUpload
  };

  const handleSave = () => {
    setIsSubmitting(true);
    
    //
    // --- TEMPAT UNTUK SIMPAN KE BACKEND ---
    //
    // // 1. Buat FormData
    // const dataToSave = new FormData();
    // ... (Logika FormData Anda) ...
    //
    // // 2. Kirim ke API
    // const saveProfile = async (formData) => {
    //   ... (Logika fetch Anda) ...
    // };
    // saveProfile(dataToSave);
    //
    // --- Akhir Tempat Simpan Backend ---

    // Simulasi (Hapus ini saat backend siap)
    setTimeout(() => {
      // 1. Simpan data teks
      let updatedProfile = { ...profile!, ...formData };

      // 2. Jika ada file preview, update URL profil (simulasi)
      if (imagePreview) {
        updatedProfile.profile_image_url = imagePreview;
      }
      
      setProfile(updatedProfile);
      
      setIsSubmitting(false);
      setIsEditMode(false);
      setImagePreview(null);
      setSelectedFile(null);
      fileUploadRef.current?.clear();
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Sukses', 
        detail: 'Profil berhasil diperbarui', 
        life: 3000 
      });
    }, 1500);
  };

  // --- 3. Fungsi untuk menangani pemilihan file ---
  const handleFileSelect = (e: FileUploadSelectEvent) => {
    const file = e.files[0];
    if (file) {
      setSelectedFile(file);
      // Buat URL lokal untuk preview
      setImagePreview(URL.createObjectURL(file));
    }
  };


  // Helper untuk format tanggal
  const formatJoinDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // --- Tampilan Skeleton (Loading) ---
  if (isLoading) {
    return (
      <div className="grid">
        <div className="col-12">
            <Card className="shadow-1 mb-4">
                {/* Gunakan PrimeFlex (flex-column md:flex-row) agar skeleton juga responsif */}
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

  // --- Tampilan Halaman (Setelah Data Dimuat) ---
  if (!profile) {
    return <Card title="Error">Gagal memuat profil.</Card>;
  }

  return (
    <div className="grid">
      <Toast ref={toast} />

      {/* --- 1. Header Profil (Full Width) --- */}
      <div className="col-12">
        <Card className="shadow-1">
          {/* PrimeFlex 'flex-column' (mobile) 'md:flex-row' (desktop) sudah responsif */}
          <div className="flex flex-column md:flex-row align-items-center">
            
            <Avatar 
              image={imagePreview || profile.profile_image_url || undefined} 
              label={!imagePreview && !profile.profile_image_url 
                        ? `${profile.first_name[0] || ''}${profile.last_name[0] || ''}`.toUpperCase() 
                        : undefined}
              shape="circle" 
              className="mb-3 md:mb-0 md:mr-4 p-avatar-info"
              style={{ width: '128px', height: '128px', fontSize: '3rem' }}
            />

            {/* PrimeFlex 'flex-1' (ambil sisa ruang) 'text-center' (mobile) 'md:text-left' (desktop) */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="m-0">{profile.first_name} {profile.last_name}</h2>
              <p className="text-color-secondary mt-1 text-lg">{profile.position_name}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* --- 2. Konten (Full Width) --- */}
      <div className="col-12 mt-4">
        {/* PERUBAHAN 1: Tambahkan 'scrollable' agar header tab responsif */}
        <TabView scrollable>
          
          {/* --- Tab 1: Detail Profil & Form Edit --- */}
          <TabPanel header="Detail Profil">
            <Card>
              <div className="flex justify-content-end gap-2 mb-4">
                {!isEditMode ? (
                  <Button 
                    label="Edit Profil" 
                    icon="pi pi-user-edit" 
                    className="p-button-text" 
                    onClick={handleEdit}
                  />
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
              
              {/* PrimeFlex 'grid' sudah responsif dengan 'col-12' (mobile) dan 'md:col-6' (desktop) */}
              <div className="p-fluid grid">
                
                {isEditMode && (
                  <>
                    <div className="field col-12">
                      <label htmlFor="upload" className="font-semibold block mb-2">Ubah Foto Profil</label>
                      <FileUpload 
                        ref={fileUploadRef}
                        name="profile_pic" 
                        mode="advanced" 
                        accept="image/*" 
                        maxFileSize={2000000} // 2MB
                        auto={false} 
                        customUpload={true}
                        onSelect={handleFileSelect}
                        chooseLabel="Pilih Foto"
                        cancelLabel="Hapus"
                        uploadLabel="Upload" 
                        // --- PERBAIKAN STYLING DI SINI ---
                        headerTemplate={(options) => (
                            // Gunakan PrimeFlex: flex-column (mobile) md:flex-row (desktop)
                            <div className="flex flex-column md:flex-row align-items-center justify-content-between p-3 surface-overlay border-bottom-1 surface-border">
                                <span className="text-lg font-semibold mb-2 md:mb-0">Pilih Foto Profil Baru</span>
                                <div className="flex gap-2"> {/* Tambahkan gap antar tombol */}
                                    {options.chooseButton}
                                    {options.cancelButton}
                                </div>
                            </div>
                        )}
                        emptyTemplate={
                            // Gunakan PrimeFlex & text-center
                            <div className="flex align-items-center justify-content-center text-center flex-column py-4">
                                <i className="pi pi-image text-5xl text-color-secondary mb-3"></i>
                                <p className="mt-0 mb-0 text-color-secondary text-sm md:text-base">Seret dan lepas file ke sini, atau klik "Pilih Foto".</p>
                            </div>
                        }
                        // --- AKHIR PERBAIKAN STYLING ---
                      />
                    </div>
                    <div className="col-12">
                      <Divider />
                    </div>
                  </>
                )}

                {/* Field Nama (Selalu Read-Only) */}
                <div className="field col-12 md:col-6">
                  <label htmlFor="firstname" className="font-semibold block mb-2">Nama Depan</label>
                  <InputText id="firstname" value={profile.first_name} readOnly disabled />
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="lastname" className="font-semibold block mb-2">Nama Belakang</label>
                  <InputText id="lastname" value={profile.last_name} readOnly disabled />
                </div>
                
                {/* Field yang Bisa Diedit */}
                <div className="field col-12 md:col-6">
                  <label htmlFor="phone" className="font-semibold block mb-2">No. Telepon Kontak</label>
                  <InputText 
                    id="phone" 
                    value={isEditMode ? formData.contact_phone : profile.contact_phone}
                    onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                    readOnly={!isEditMode}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="field col-12">
                  <label htmlFor="address" className="font-semibold block mb-2">Alamat</label>
                  <InputTextarea 
                    id="address" 
                    value={isEditMode ? formData.address : profile.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    readOnly={!isEditMode}
                    disabled={!isEditMode}
                    rows={4} 
                    autoResize
                  />
                </div>
              </div>
            </Card>
          </TabPanel>

          {/* --- Tab 2: Informasi Pekerjaan (Read-Only) --- */}
          <TabPanel header="Informasi Pekerjaan">
            <Card>
              <div className="p-3">
                {/* PERUBAHAN 2: Layout Key-Value dibuat responsif */}
                <div className="flex flex-column gap-4">
                  {/* Email */}
                  <div className="flex flex-column md:flex-row md:justify-content-between gap-2 md:gap-0">
                    <span className="font-semibold text-lg">Email</span>
                    <span className="text-color-secondary text-lg md:text-right">{profile.email}</span>
                  </div>
                  <Divider />
                  {/* Posisi */}
                  <div className="flex flex-column md:flex-row md:justify-content-between gap-2 md:gap-0">
                    <span className="font-semibold text-lg">Posisi / Jabatan</span>
                    <span className="text-color-secondary text-lg md:text-right">{profile.position_name}</span>
                  </div>
                  <Divider />
                  {/* Departemen */}
                  <div className="flex flex-column md:flex-row md:justify-content-between gap-2 md:gap-0">
                    <span className="font-semibold text-lg">Departemen</span>
                    <span className="text-color-secondary text-lg md:text-right">{profile.department_name}</span>
                  </div>
                  <Divider />
                  {/* Tanggal Bergabung */}
                  <div className="flex flex-column md:flex-row md:justify-content-between gap-2 md:gap-0">
                    <span className="font-semibold text-lg">Tanggal Bergabung</span>
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

