// /app/karyawan/Profil/page.tsx

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

// --- ALUR 1: KONTRAK DATA (INTERFACE) ---

// Interface untuk data dari GET /profil
interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  contact_phone: string | null;
  address: string | null;
  join_date: string; 
  position_id: number;
  
  // Data opsional yang akan kita tambahkan dari API lain
  profile_image_url?: string | null; 
  email?: string;
  position_name?: string;
  department_name?: string;
}

// Interface "pembungkus" untuk GET /profil
interface ProfileResponse {
  status: string;
  message: string;
  datetime: string;
  users: UserProfile; // <-- Data profil ada di sini
}

// Interface "pembungkus" untuk GET /auth/current-user (SESUAI JSON ANDA)
interface AuthUserResponse {
  status: string;
  message: string;
  datetime: string;
  users: {
    id: number;
    email: string;
    employee_id: number;
    role: string;
  }
}

// Interface "pembungkus" untuk PUT /profil (Update)
interface ProfileUpdateResponse {
  status: string;
  message: string;
  datetime: string;
  users: UserProfile; // <-- Objek 'users' yang diperbarui
}

// --- Konstanta API ---
const API_URLS = {
  profile: 'localhost:8000/api/v1/profiles', // Ganti URL & Port
  currentUser: 'http://localhost:8000/api/auth/current-user', // Ganti URL & Port
  updateProfile: 'http://localhost:8000/api/karyawan/profil' // Ganti URL & Port
}

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

  // --- ALUR 2: MEMUAT DATA (useEffect) ---
  useEffect(() => {
    
    const loadProfileData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        //
        // --- TEMPAT BACKEND (GET) ---
        // Panggil kedua API secara bersamaan
        //
        const [profileResponse, authResponse] = await Promise.all([
          // 1. Ambil data profil
          fetch(API_URLS.profile, { 
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          // 2. Ambil data email dari auth
          fetch(API_URLS.currentUser, { 
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        if (!profileResponse.ok || !authResponse.ok) {
          throw new Error('Gagal memuat data lengkap profil');
        }

        // Baca JSON dari kedua respons
        const profileData: ProfileResponse = await profileResponse.json();
        const authData: AuthUserResponse = await authResponse.json();

        console.log("Respons Profil (GET):", profileData);
        console.log("Respons Auth (GET):", authData);

        if (profileData.status !== "00" || authData.status !== "00") {
          throw new Error('Salah satu API gagal mengambil data');
        }

        // --- SINKRONISASI: GABUNGKAN DATA ---
        // Buat satu objek 'profile' gabungan
        const combinedProfile: UserProfile = {
          ...profileData.users, // Ambil semua data dari GET /profil
          email: authData.users.email // Tambahkan 'email' dari GET /auth/current-user
          // Anda juga bisa menambahkan 'position_name' di sini jika API profil di-JOIN
        };

        setProfile(combinedProfile); 
        
        // Inisialisasi form data (tangani data null)
        setFormData({
          contact_phone: combinedProfile.contact_phone || '',
          address: combinedProfile.address || ''
        });
        //
        // --- Batas Tempat Backend ---

      } catch (error) {
        console.error(error);
        toast.current?.show({ 
          severity: 'error', 
          summary: 'Error', 
          detail: (error as Error).message || 'Gagal memuat profil' 
        });
        setIsLoading(false); // Pastikan loading berhenti jika error
      } finally {
        setIsLoading(false); 
      }
    };
    
    loadProfileData(); // <-- (AKTIFKAN INI SAAT BACKEND SIAP)
    
  }, []); // [] = Dijalankan sekali saat halaman dimuat

  // --- Fungsi Aksi (Edit, Batal, Pilih File) ---
  const handleEdit = () => {
    setIsEditMode(true);
    setImagePreview(null);
    setSelectedFile(null);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        contact_phone: profile.contact_phone || '',
        address: profile.address || ''
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


  // --- ALUR 3: MENGIRIM DATA (handleSave) ---
  const handleSave = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem('authToken');
    if (!token) { /* ... */ return; }
    
    const dataToSave = new FormData();
    dataToSave.append('contact_phone', formData.contact_phone);
    dataToSave.append('address', formData.address);
    if (selectedFile) {
      dataToSave.append('profile_image', selectedFile); 
    }
    
    try {
      //
      // --- TEMPAT BACKEND (PUT) ---
      // (Ini adalah kode yang akan Anda gunakan nanti)
      //
      const response = await fetch(API_URLS.updateProfile, { // Panggil UR
        method: 'PUT', // atau 'POST'
        headers: { 'Authorization': `Bearer ${token}` },
        body: dataToSave
      });
      
      // Gunakan 'ProfileUpdateResponse' yang baru
      const data: ProfileUpdateResponse = await response.json();
      console.log("Respons Update Profil (PUT):", data);
      
      if (data.status !== "00") {
        throw new Error(data.message || 'Gagal menyimpan profil');
      }
      
      // SINKRONISASI: Ambil data 'users' dari respons
      const updatedProfile = data.users;
      const successMessage = data.message;
      //
      // --- Batas Tempat Backend ---
      
      // Update state UI dengan data balikan dari server
      setProfile(prevProfile => ({
          ...prevProfile!, // Ambil data lama (seperti email, position_name)
          ...updatedProfile  // Timpa dengan data baru dari server (first_name, address, dll)
      }));
      setFormData({
        contact_phone: updatedProfile.contact_phone || '',
        address: updatedProfile.address || ''
      });
      
      setIsSubmitting(false);
      setIsEditMode(false);
      setImagePreview(null);
      setSelectedFile(null);
      fileUploadRef.current?.clear();
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Sukses', 
        detail: successMessage, // <-- Ambil pesan dari API
        life: 3000 
      });
    } catch (error) {
      setIsSubmitting(false);
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: (error as Error).message || 'Gagal menyimpan profil' 
      });
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
    // ... (Skeleton code tidak berubah) ...
    return (
      <div className="grid">
        <div className="col-12">
            <Card className="shadow-1 mb-4">
                <div className="flex flex-column md:flex-row align-items-center">
                    <Skeleton shape="circle" size="8rem" className="mb-3 md:mb-0 md:mr-4"></Skeleton>
                    <div className="flex-1 text-center md:text-left">
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

  // --- ALUR 4: TAMPILAN (JSX) ---
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
              {/* Tampilkan posisi HANYA JIKA ADA */}
              {profile.position_name ? (
                <p className="text-color-secondary mt-1 text-lg">
                  {profile.position_name}
                </p>
              ) : (
                <p className="text-color-secondary mt-1 text-lg">
                  ID Karyawan: {profile.id}
                </p>
              )}
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
                  <Button label="Edit Profil" icon="pi pi-user-edit" className="p-button-text" onClick={handleEdit} />
                ) : (
                  <>
                    <Button label="Batal" icon="pi pi-times" className="p-button-text" onClick={handleCancel} disabled={isSubmitting} />
                    <Button label="Simpan Perubahan" icon="pi pi-check" onClick={handleSave} loading={isSubmitting} />
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
                        uploadLabel="Upload"
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
                    <div className="col-12"><Divider /></div>
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
                    value={isEditMode ? formData.contact_phone : (profile.contact_phone || '')}
                    onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                    readOnly={!isEditMode}
                    disabled={!isEditMode}
                    placeholder={!isEditMode && !profile.contact_phone ? "(Belum diisi)" : ""}
                  />
                </div>
                <div className="field col-12">
                  <label htmlFor="address" className="font-semibold block mb-2">
                    <i className="pi pi-home mr-2" />
                    Alamat
                  </label>
                  <InputTextarea 
                    id="address" 
                    value={isEditMode ? formData.address : (profile.address || '')}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    readOnly={!isEditMode}
                    disabled={!isEditMode}
                    rows={4} 
                    autoResize
                    placeholder={!isEditMode && !profile.address ? "(Belum diisi)" : ""}
                  />
                </div>
              </div>
            </Card>
          </TabPanel>

          {/* --- Tab 2: Informasi Pekerjaan (Read-Only) --- */}
          {/* SINKRONISASI: Bagian ini di-uncomment dan diberi cek kondisional */}
          <TabPanel header="Informasi Pekerjaan" leftIcon="pi pi-briefcase mr-2">
            <Card>
              <div className="p-3">
                <div className="flex flex-column gap-4">
                  
                  {/* Tanggal Bergabung */}
                  <div className="flex flex-column md:flex-row md:justify-content-between gap-2 md:gap-0">
                    <span className="font-semibold text-lg flex align-items-center">
                      <i className="pi pi-calendar-plus mr-3 text-xl" />
                      Tanggal Bergabung
                    </span>
                    <span className="text-color-secondary text-lg">{formatJoinDate(profile.join_date)}</span>
                  </div>
                  
                  {/* --- DATA YANG DIPERTAHANKAN (KONDISIONAL) --- */}

                  {/* Tampilkan Email HANYA JIKA ADA */}
                  {profile.email && (
                    <>
                      <Divider />
                      <div className="flex flex-column md:flex-row md:justify-content-between gap-2 md:gap-0">
                        <span className="font-semibold text-lg flex align-items-center">
                          <i className="pi pi-envelope mr-3 text-xl" />
                          Email
                        </span>
                        <span className="text-color-secondary text-lg md:text-right">{profile.email}</span>
                      </div>
                    </>
                  )}

                  {/* Tampilkan Posisi HANYA JIKA ADA */}
                  {profile.position_name && (
                    <>
                      <Divider />
                      <div className="flex flex-column md:flex-row md:justify-content-between gap-2 md:gap-0">
                        <span className="font-semibold text-lg flex align-items-center">
                          <i className="pi pi-id-card mr-3 text-xl" />
                          Posisi / Jabatan
                        </span>
                        <span className="text-color-secondary text-lg md:text-right">{profile.position_name}</span>
                      </div>
                    </>
                  )}
                  
                  {/* Tampilkan Departemen HANYA JIKA ADA */}
                  {profile.department_name && (
                    <>
                      <Divider />
                      <div className="flex flex-column md:flex-row md:justify-content-between gap-2 md:gap-0">
                        <span className="font-semibold text-lg flex align-items-center">
                          <i className="pi pi-sitemap mr-3 text-xl" />
                          Departemen
                        </span>
                        <span className="text-color-secondary text-lg md:text-right">{profile.department_name}</span>
                      </div> 
                    </>
                  )}
                  {/* --- AKHIR DATA YANG DIPERTAHANKAN --- */}
                  
                </div>
              </div>
            </Card>
          </TabPanel>
        </TabView>
      </div>

    </div>
  );
}