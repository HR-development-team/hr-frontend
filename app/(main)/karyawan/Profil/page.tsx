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

// --- Tipe Data (Harus sesuai dengan respons API) ---
interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  contact_phone: string;
  address: string;
  join_date: string; 
  position_id: number;
  profile_image_url: string | null;
  
  // Data tambahan (didapat dari 'join' di backend)
  email: string;
  position_name: string;
  department_name: string;
}

// --- Data Bohongan (Hanya untuk fallback/simulasi) ---
const mockProfile: UserProfile = {
  id: 1,
  first_name: 'Lugas',
  last_name: 'Hermanto',
  email: 'lugas655@gmail.com',
  contact_phone: '08123456789',
  address: 'Jl. Merdeka No. 17, Jakarta Pusat, DKI Jakarta 10110',
  join_date: '2023-03-15T00:00:00Z',
  position_id: 10,
  profile_image_url: null, 
  position_name: 'Software Developer',
  department_name: 'Information Technology (IT)',
};

// --- Konstanta API ---
// Ganti ini dengan URL API Anda yang sebenarnya
const API_URL = '/api/karyawan/profil'; 

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

  // State untuk File Upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileUploadRef = useRef<FileUpload>(null);

  // --- 1. MEMUAT DATA PROFIL (useEffect) ---
  useEffect(() => {
    
    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        //
        // --- TEMPAT BACKEND: Ambil Data Profil ---
        // (Hilangkan komentar ini saat backend siap)
        //
        // const response = await fetch(API_URL); // Method GET
        // if (!response.ok) {
        //   throw new Error('Gagal memuat profil dari server');
        // }
        // const data: UserProfile = await response.json();
        // setProfile(data);
        // setFormData({
        //   contact_phone: data.contact_phone,
        //   address: data.address
        // });
        //
        // --- Batas Tempat Backend ---

        // --- Simulasi (HAPUS INI SAAT BACKEND SIAP) ---
        await new Promise(resolve => setTimeout(resolve, 1200));
        setProfile(mockProfile);
        if (mockProfile) {
            setFormData({
              contact_phone: mockProfile.contact_phone,
              address: mockProfile.address
            });
        }
        // --- Batas Simulasi ---

      } catch (error) {
        console.error(error);
        toast.current?.show({ 
          severity: 'error', 
          summary: 'Error', 
          detail: (error as Error).message || 'Gagal memuat profil' 
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfileData();
  }, []); // [] = Dijalankan sekali saat halaman dimuat

  // --- 2. FUNGSI AKSI (Edit, Batal, Pilih File) ---
  // (Ini adalah murni logika frontend, sudah rapi)
  
  const handleEdit = () => {
    setIsEditMode(true);
    setImagePreview(null);
    setSelectedFile(null);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        contact_phone: profile.contact_phone,
        address: profile.address
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

  // --- 3. MENYIMPAN DATA (handleSave) ---
  // Dibuat 'async' dan siap untuk mengirim 'FormData'
  
  const handleSave = async () => {
    setIsSubmitting(true);
    
    //
    // --- TEMPAT BACKEND: Kirim Data Profil ---
    //
    // // 1. Buat FormData untuk mengirim data teks + file
    // const dataToSave = new FormData();
    // dataToSave.append('contact_phone', formData.contact_phone);
    // dataToSave.append('address', formData.address);
    // if (selectedFile) {
    //   dataToSave.append('profile_image', selectedFile); // 'profile_image' = nama field di API
    // }
    //
    
    try {
      // // 2. Kirim ke API (Method PUT atau POST/PATCH)
      // const response = await fetch(API_URL, {
      //   method: 'PUT',
      //   // PENTING: JANGAN set Content-Type header. 
      //   // Browser akan otomatis mengaturnya ke 'multipart/form-data'
      //   // dan menambahkan 'boundary' yang benar.
      //   body: dataToSave,
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Gagal menyimpan profil');
      // }
      // const updatedProfile: UserProfile = await response.json();
      //
      // --- Batas Tempat Backend ---


      // --- Simulasi (HAPUS INI SAAT BACKEND SIAP) ---
      await new Promise(resolve => setTimeout(resolve, 1500));
      let updatedProfile = { ...profile!, ...formData };
      if (imagePreview) {
        updatedProfile.profile_image_url = imagePreview;
      }
      // --- Batas Simulasi ---

      // 3. Update UI setelah sukses (dari data 'updatedProfile' di atas)
      setProfile(updatedProfile);
      setFormData({
        contact_phone: updatedProfile.contact_phone,
        address: updatedProfile.address
      });
      
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Sukses', 
        detail: 'Profil berhasil diperbarui', 
        life: 3000 
      });

    } catch (error) {
      console.error(error);
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: (error as Error).message || 'Gagal menyimpan profil' 
      });
    } finally {
      // 4. Reset state
      setIsSubmitting(false);
      setIsEditMode(false);
      setImagePreview(null);
      setSelectedFile(null);
      fileUploadRef.current?.clear();
    }
  };

  // --- 4. Helper & Tampilan (JSX) ---
  
  const formatJoinDate = (dateString: string) => {
    // ... (Logika format tanggal tidak berubah) ...
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Tampilan Skeleton (Loading)
  if (isLoading) {
    // ... (Kode skeleton tidak berubah) ...
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

  // Tampilan Halaman (Jika data gagal dimuat)
  if (!profile) {
    return <Card title="Error">Gagal memuat profil. Silakan coba muat ulang halaman.</Card>;
  }

  // Tampilan Halaman (Data sukses dimuat)
  return (
    <div className="grid">
      <Toast ref={toast} />

      {/* --- 1. Header Profil (Full Width) --- */}
      <div className="col-12">
        <Card className="shadow-1">
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
            <div className="flex-1 text-center md:text-left">
              <h2 className="m-0">{profile.first_name} {profile.last_name}</h2>
              <p className="text-color-secondary mt-1 text-lg">{profile.position_name}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* --- 2. Konten (Full Width) --- */}
      <div className="col-12 mt-4">
        <TabView scrollable>
          {/* --- Tab 1: Detail Profil & Form Edit --- */}
          <TabPanel header="Detail Profil" leftIcon="pi pi-user mr-2">
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
              
              <div className="p-fluid grid">
                
                {isEditMode && (
                  <>
                    <div className="field col-12">
                      <label htmlFor="upload" className="font-semibold block mb-2">
                        <i className="pi pi-image mr-2" />
                        Ubah Foto Profil
                      </label>
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
                        uploadLabel="Upload" // Tombol ini tidak akan kita gunakan
                        headerTemplate={(options) => (
                            <div className="flex flex-column md:flex-row align-items-center justify-content-between p-3 surface-overlay border-bottom-1 surface-border">
                                <span className="text-lg font-semibold mb-2 md:mb-0">Pilih Foto Profil Baru</span>
                                <div className="flex gap-2">
                                    {options.chooseButton}
                                    {options.cancelButton}
                                </div>
                            </div>
                        )}
                        emptyTemplate={
                            <div className="flex align-items-center justify-content-center text-center flex-column py-4">
                                <i className="pi pi-image text-5xl text-color-secondary mb-3"></i>
                                <p className="mt-0 mb-0 text-color-secondary text-sm md:text-base">Seret dan lepas file ke sini, atau klik "Pilih Foto".</p>
                            </div>
                        }
                      />
                    </div>
                    <div className="col-12">
                      <Divider />
                    </div>
                  </>
                )}

                {/* Field Nama (Selalu Read-Only) */}
                <div className="field col-12 md:col-6">
                  <label htmlFor="firstname" className="font-semibold block mb-2">
                    <i className="pi pi-user mr-2" />
                    Nama Depan
                  </label>
                  <InputText id="firstname" value={profile.first_name} readOnly disabled />
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="lastname" className="font-semibold block mb-2">
                    <i className="pi pi-user mr-2" />
                    Nama Belakang
                  </label>
                  <InputText id="lastname" value={profile.last_name} readOnly disabled />
                </div>
                
                {/* Field yang Bisa Diedit */}
                <div className="field col-12 md:col-6">
                  <label htmlFor="phone" className="font-semibold block mb-2">
                    <i className="pi pi-phone mr-2" />
                    No. Telepon Kontak
                  </label>
                  <InputText 
                    id="phone" 
                    value={isEditMode ? formData.contact_phone : profile.contact_phone}
                    onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                    readOnly={!isEditMode}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="field col-12">
                  <label htmlFor="address" className="font-semibold block mb-2">
                    <i className="pi pi-home mr-2" />
                    Alamat
                  </label>
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
          <TabPanel header="Informasi Pekerjaan" leftIcon="pi pi-briefcase mr-2">
            <Card>
              <div className="p-3">
                <div className="flex flex-column gap-4">
                  <div className="flex flex-column md:flex-row md:justify-content-between gap-2 md:gap-0">
                    <span className="font-semibold text-lg flex align-items-center">
                      <i className="pi pi-envelope mr-3 text-xl" />
                      Email
                    </span>
                    <span className="text-color-secondary text-lg md:text-right">{profile.email}</span>
                  </div>
                  <Divider />
                  
                  <div className="flex flex-column md:flex-row md:justify-content-between gap-2 md:gap-0">
                    <span className="font-semibold text-lg flex align-items-center">
                      <i className="pi pi-id-card mr-3 text-xl" />
                      Posisi / Jabatan
                    </span>
                    <span className="text-color-secondary text-lg md:text-right">{profile.position_name}</span>
                  </div>
                  <Divider />
                  
                  <div className="flex flex-column md:flex-row md:justify-content-between gap-2 md:gap-0">
                    <span className="font-semibold text-lg flex align-items-center">
                      <i className="pi pi-sitemap mr-3 text-xl" />
                      Departemen
                    </span>
                    <span className="text-color-secondary text-lg md:text-right">{profile.department_name}</span>
                  </div>
                  <Divider />
                  
                  <div className="flex flex-column md:flex-row md:justify-content-between gap-2 md:gap-0">
                    <span className="font-semibold text-lg flex align-items-center">
                      <i className="pi pi-calendar-plus mr-3 text-xl" />
                      Tanggal Bergabung
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

