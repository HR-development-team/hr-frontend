// /app/karyawan/Absensi/page.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton'; 
import { Divider } from 'primereact/divider';

// --- ALUR 1: KONTRAK DATA (INTERFACE) ---
// Ini adalah "Kontrak Data" Anda.
// Nama field di sini SAMA PERSIS dengan nama field di JSON Postman Anda.
// ---------------------------------------------

type AttendanceStatus = 'loading' | 'not_checked_in' | 'checked_in' | 'checked_out';

// Tipe untuk objek di dalam array "attendances"
// Sesuai dengan JSON 'GET Get Current Employee Attendance'
interface AttendanceLog {
  id: number;
  employee_id: number;
  work_date: string | null;
  check_in_time: string | null; 
  check_out_time: string | null;
  created_at?: string; 
  updated_at?: string;
  // 'status' ('Tepat Waktu', 'Terlambat') akan kita tambahkan nanti jika ada di API
}

// Tipe untuk respons 'GET Get Current Employee Attendance'
interface AttendanceResponse {
  status: string;
  message: string;
  datetime: string;
  attendances: AttendanceLog[]; // <-- Array-nya ada di sini
}

// Tipe untuk respons 'POST Check-In' dan 'PUT Check-Out'
interface CheckInOutResponse {
  status: string;
  message: string;
  datetime: string;
  attendances: AttendanceLog; // <-- Objek tunggal
}

// --- Ganti ini dengan URL API dari Postman Anda ---
const API_BASE_URL = 'http://localhost:8000/api/v1'; // Ganti 8000 dengan port backend Anda

// --- ALUR 2: KOMPONEN UTAMA & SETUP STATE ---
// ---------------------------------------------
export default function AbsensiPage() {
  const toast = useRef<Toast>(null);
  
  // State untuk Kartu Aksi
  const [status, setStatus] = useState<AttendanceStatus>('loading'); 
  const [isSubmitting, setIsSubmitting] = useState(false); // Untuk loading tombol
  const [checkInTime, setCheckInTime] = useState('');
  
  // State untuk Tabel Riwayat
  const [attendanceLog, setAttendanceLog] = useState<AttendanceLog[]>([]);

  // State untuk Fitur Tambahan (Search & Jam)
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [currentTime, setCurrentTime] = useState('--:--:--');
  const [currentDate, setCurrentDate] = useState('');

  // --- ALUR 3: MEMUAT DATA AWAL (useEffect) ---
  // Kode ini berjalan OTOMATIS saat halaman dibuka.
  // --------------------------------------------------
  useEffect(() => {
    const loadInitialData = async () => {
      // 'status' sudah 'loading' secara default
      const token = localStorage.getItem('authToken');
      if (!token) {
        window.location.href = '/login'; // Asumsi login ada di /login
        return;
      }

      try {
        //
        // --- INI ADALAH KODE BACKEND YANG SEBENARNYA (GET) ---
        //
        // 1. Panggil 'GET Get Current Employee Attendanc...' (dari Postman)
        // Pastikan URL ini benar
        const logResponse = await fetch(`${API_BASE_URL}/attendances/current-employee`, { 
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (logResponse.status === 401) {
            localStorage.removeItem('authToken'); // Hapus token buruk
            window.location.href = '/login'; // Paksa login ulang
            return;
        }
        if (!logResponse.ok) throw new Error('Gagal memuat riwayat (Server Error)');
        
        const logData: AttendanceResponse = await logResponse.json();
        console.log("Respons Riwayat Absensi (GET):", logData); // Cek data di konsol

        if (logData.status !== "00") {
          throw new Error(logData.message || 'Gagal memuat riwayat absensi');
        }
        setAttendanceLog(logData.attendances); // Isi state tabel

        // 2. Panggil API untuk cek status HARI INI
        // Pastikan Anda punya endpoint ini di Postman
        const statusResponse = await fetch(`${API_BASE_URL}/attendances/status-today`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (statusResponse.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
            return;
        }
         if (!statusResponse.ok) throw new Error('Gagal memuat status absensi');
        
         const statusData = await statusResponse.json(); 
         console.log("Respons Status Hari Ini (GET):", statusData); // Cek data di konsol
        
        // Isi state kartu aksi
        setStatus(statusData.status); // misal: 'checked_in' atau 'not_checked_in'
        if (statusData.attendance && statusData.attendance.check_in_time) {
           const jam = new Date(statusData.attendance.check_in_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
           setCheckInTime(jam);
        }

      } catch (error) {
        console.error("Gagal memuat data:", error);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: (error as Error).message });
        setStatus('not_checked_in'); // Fallback jika error
      } 
    };
    
    loadInitialData(); // <-- FUNGSI DIAMBIL DARI SINI
    
  }, []); // [] = Dijalankan sekali
  
  // useEffect untuk auto-focus search (tidak berubah)
  useEffect(() => {
    if (isSearchVisible) {
        searchInputRef.current?.focus();
    }
  }, [isSearchVisible]);

  // useEffect untuk Jam Real-time (tidak berubah)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    };
    updateTime();
    const timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId);
  }, []); 

  // --- ALUR 4: AKSI PENGGUNA (HANDLERS) ---
  // Kode ini berjalan saat pengguna MENGEKLIK TOMBOL.
  // --------------------------------------------
  
  // Handler untuk Tombol "Check-In"
  const handleCheckIn = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem('authToken');
    if (!token) { /* ... (Handle error/redirect) ... */ return; }

    try {
      // Panggil 'POST Employee Check In' (dari Postman)
      // Pastikan URL ini benar
      const response = await fetch(`${API_BASE_URL}/attendances/check-in`, { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data: CheckInOutResponse = await response.json(); 
      console.log("Respons Check-In (POST):", data);
      
      if (data.status !== "00") {
        throw new Error(data.message || 'Gagal Check-In di server');
      }
      
      // Ambil data 'check_in_time' dari JSON Postman Anda
      const checkInTimestamp = data.attendances.check_in_time;
      const jam = new Date(checkInTimestamp!).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      
      // Update Tampilan (State)
      setCheckInTime(jam);
      setStatus('checked_in');
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Check-In Berhasil', 
        detail: data.message, // Tampilkan pesan sukses dari API
        life: 3000 
      });
      
    } catch (error) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Gagal', 
        detail: (error as Error).message || 'Gagal melakukan Check-In', 
        life: 3000 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handler untuk Tombol "Check-Out"
  const handleCheckOut = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem('authToken');
    if (!token) { /* ... (Handle error/redirect) ... */ return; }

    try {
      // Panggil 'PUT Employee Check Out' (dari Postman)
      // Pastikan URL ini benar
      const response = await fetch(`${API_BASE_URL}/attendances/check-out`, { 
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data: CheckInOutResponse = await response.json(); 
      console.log("Respons Check-Out (PUT):", data); 

      if (data.status !== "00") {
          throw new Error(data.message || 'Gagal Check-Out di server');
      }

      // Update Tampilan (State)
      setStatus('checked_out');
      toast.current?.show({ 
        severity: 'info', 
        summary: 'Check-Out Berhasil', 
        detail: data.message, // Tampilkan pesan sukses dari API
        life: 3000 
      });

    } catch (error) {
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Gagal', 
        detail: (error as Error).message || 'Gagal melakukan Check-Out', 
        life: 3000 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- ALUR 5: FUNGSI BANTU TAMPILAN (HELPERS) ---
  // Kode di sini hanya mengatur TAMPILAN (UI) berdasarkan data dari state.
  // --------------------------------------------------

  // Helper untuk Kartu Aksi (sudah rapi)
  const renderAttendanceAction = () => {
    
    const clockDisplay = (
      <div className="text-center mb-4">
        <h1 className="m-0" style={{ fontSize: '3.5rem', color: 'var(--text-color)' }}>{currentTime}</h1>
        <p className="m-0 text-color-secondary text-lg">{currentDate}</p>
      </div>
    );

    if (status === 'loading') {
        return ( 
            <div className="text-center">
                <Skeleton width="12rem" height="3.5rem" className="mb-2 mx-auto"></Skeleton>
                <Skeleton width="15rem" height="1.5rem" className="mb-4 mx-auto"></Skeleton>
                <Divider />
                <Skeleton width="10rem" height="1.5rem" className="mb-2 mx-auto"></Skeleton>
                <Skeleton width="15rem" height="1rem" className="mb-4 mx-auto"></Skeleton>
                <Skeleton height="3.5rem"></Skeleton>
            </div>
        );
    }
    
    switch (status) {
      case 'not_checked_in':
        return (
          <div className="text-center">
            {clockDisplay} 
            <Divider />
            <div className="mt-4">
              <i className="pi pi-clock" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}></i>
              <h3 className="mt-2">Aksi Absensi</h3>
              <p className="text-color-secondary">Anda belum melakukan absensi masuk hari ini.</p>
              <Button label="Check-In Sekarang" icon="pi pi-sign-in" className="w-full p-button-success p-button-lg mt-2" onClick={handleCheckIn} loading={isSubmitting} />
            </div>
          </div>
        );
      case 'checked_in':
        return (
          <div className="text-center">
            {clockDisplay}
            <Divider /> 
            <div className="mt-4">
              <i className="pi pi-check-circle" style={{ fontSize: '2rem', color: 'var(--green-500)' }}></i>
              <h3 className="mt-2">Anda Sudah Masuk</h3>
              <p className="text-color-secondary">Waktu Check-In:</p>
              <h2 className="my-2" style={{ color: 'var(--text-color)' }}>{checkInTime} WIB</h2>
              <Button label="Check-Out" icon="pi pi-sign-out" className="w-full p-button-danger p-button-lg mt-2" onClick={handleCheckOut} loading={isSubmitting} />
            </div>
          </div>
        );
      case 'checked_out':
        return (
          <div className="text-center">
            {clockDisplay}
            <Divider />
            <div className="mt-4">
              <i className="pi pi-thumbs-up" style={{ fontSize: '2rem', color: 'var(--blue-500)' }}></i>
              <h3 className="mt-2">Absensi Selesai</h3>
              <p className="text-color-secondary">Anda sudah berhasil Check-Out hari ini. Terima kasih!</p>
            </div>
          </div>
        );
    }
  };
  
  // Helper untuk format tanggal dari "2025-10-28T08:05:00"
  const tanggalBodyTemplate = (log: AttendanceLog) => {
    const dateToUse = log.work_date || log.check_in_time;
    if (!dateToUse) return 'N/A'; // Jika Alpha
    return new Date(dateToUse).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Helper untuk format waktu masuk
  const waktuMasukBodyTemplate = (log: AttendanceLog) => {
    if (!log.check_in_time) return '-';
    return new Date(log.check_in_time).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper untuk format waktu keluar
  const waktuKeluarBodyTemplate = (log: AttendanceLog) => {
    if (!log.check_out_time) return '-';
    return new Date(log.check_out_time).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Header tabel (Search)
  const renderRiwayatHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center">
        {!isSearchVisible && (
          <h5 className="m-0">Riwayat Absensi</h5>
        )}
        {isSearchVisible && (
          <span className="p-input-icon-left w-full">
            <i className="pi pi-search" />
            <InputText 
              ref={searchInputRef}
              type="search" 
              value={globalFilter} 
              onChange={(e) => setGlobalFilter(e.target.value)} 
              placeholder="Cari..." 
              className="w-full"
              onBlur={() => { 
                  if (!globalFilter) setIsSearchVisible(false);
              }}
            />
          </span>
        )}
        <Button 
          icon={isSearchVisible ? "pi pi-times" : "pi pi-search"} 
          className="p-button-text p-button-rounded ml-2" 
          onClick={() => {
            setIsSearchVisible(!isSearchVisible);
            if (isSearchVisible) {
              setGlobalFilter('');
            }
          }} 
        />
      </div>
    );
  };

  // --- ALUR 6: TAMPILAN UTAMA (JSX) ---
  // Ini adalah struktur HTML/PrimeReact yang menampilkan semua data
  // dari state Anda.
  // ----------------------------------------
  return (
    <div className="grid">
      <Toast ref={toast} />
      
      {/* Kolom Kiri: Kartu Aksi */}
      <div className="col-12 md:col-5 lg:col-4">
        <Card className="shadow-1 h-full">
          {renderAttendanceAction()}
        </Card>
      </div>
      
      {/* Kolom Kanan: Tabel Riwayat */}
      <div className="col-12 md:col-7 lg:col-8">
        <Card className="shadow-1 h-full">
          <DataTable 
            value={attendanceLog} 
            responsiveLayout="stack"
            breakpoint="768px" 
            paginator 
            rows={5} 
            emptyMessage="Belum ada riwayat absensi."
            header={renderRiwayatHeader}
            globalFilter={globalFilter}
            sortField="check_in_time" 
            sortOrder={-1}
            className="compact-datatable-mobile"
          >
            {/* Kolom ini sudah disinkronkan dengan Kontrak Data */}
            <Column field="check_in_time" header="Tanggal" body={tanggalBodyTemplate} sortable />
            <Column field="check_in_time" header="Masuk" body={waktuMasukBodyTemplate} />
            <Column field="check_out_time" header="Keluar" body={waktuKeluarBodyTemplate} />
            
            {/* CATATAN: Kolom 'Status' ('Tepat Waktu', 'Terlambat') tidak ada di JSON Anda.
              Jika backend menambahkannya, Anda bisa aktifkan (uncomment) baris ini 
              dan membuat fungsi 'statusBodyTemplate'
            */}
            {/* <Column field="status" header="Status" body={statusBodyTemplate} /> */}
          </DataTable>
        </Card>
      </div>
    </div>
  );
}