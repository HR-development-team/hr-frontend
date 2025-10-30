// /app/karyawan/absensi/page.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
// Hapus 'import type' yang error
import { Skeleton } from 'primereact/skeleton'; 

// --- Tipe Data (Sama seperti sebelumnya) ---
type AttendanceStatus = 'loading' | 'not_checked_in' | 'checked_in' | 'checked_out';

interface AttendanceLog {
  id: number;
  tanggal: string;
  waktuMasuk: string;
  waktuKeluar: string;
  status: 'Tepat Waktu' | 'Terlambat' | 'Alpha';
}

// --- Data Bohongan (Hanya untuk fallback) ---
const mockLog: AttendanceLog[] = [
  { id: 1, tanggal: '28 Okt 2025', waktuMasuk: '08:05', waktuKeluar: '17:00', status: 'Terlambat' },
  { id: 2, tanggal: '27 Okt 2025', waktuMasuk: '07:55', waktuKeluar: '17:02', status: 'Tepat Waktu' },
  { id: 3, tanggal: '26 Okt 2025', waktuMasuk: '-', waktuKeluar: '-', status: 'Alpha' },
];

const API_BASE_URL = '/api/karyawan/absensi'; 

export default function AbsensiPage() {
  const toast = useRef<Toast>(null);
  
  // State untuk Aksi Absensi
  const [status, setStatus] = useState<AttendanceStatus>('loading'); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [checkInTime, setCheckInTime] = useState('');
  const [attendanceLog, setAttendanceLog] = useState<AttendanceLog[]>([]);

  // State untuk Pencarian
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  
  // --- PERBAIKAN DI SINI ---
  // Gunakan tipe HTML standar, ini pasti terbaca
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- useEffect (Tidak ada perubahan) ---
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // ... (Simulasi loading Anda) ...
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        setStatus('not_checked_in'); 
        setAttendanceLog(mockLog); 
      } catch (error) {
        console.error("Gagal memuat data:", error);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Gagal memuat data absensi' });
        setStatus('not_checked_in');
      }
    };
    loadInitialData();
  }, []); 
  
  useEffect(() => {
    if (isSearchVisible) {
        searchInputRef.current?.focus();
    }
  }, [isSearchVisible]);

  // --- Handler (Tidak ada perubahan) ---
  const handleCheckIn = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      const jam = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      setCheckInTime(jam);
      setStatus('checked_in');
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Check-In Berhasil', 
        detail: `Anda masuk pukul ${jam}. Selamat bekerja!`, 
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
  
  const handleCheckOut = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setStatus('checked_out');
      toast.current?.show({ 
        severity: 'info', 
        summary: 'Check-Out Berhasil', 
        detail: 'Selamat beristirahat!', 
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

  // --- Helper Render (Tidak ada perubahan) ---
  const renderAttendanceAction = () => {
    if (status === 'loading') {
        return (
            <div className="text-center">
                <Skeleton shape="circle" size="3rem" className="mb-3"></Skeleton>
                <Skeleton width="10rem" height="1.5rem" className="mb-2"></Skeleton>
                <Skeleton width="15rem" height="1rem" className="mb-4"></Skeleton>
                <Skeleton height="3.5rem"></Skeleton>
            </div>
        );
    }
    
    switch (status) {
      case 'not_checked_in':
        return (
          <div className="text-center">
            <i className="pi pi-clock" style={{ fontSize: '3rem', color: 'var(--text-muted)' }}></i>
            <h3 className="mt-3">Aksi Absensi</h3>
            <p className="text-color-secondary">Anda belum melakukan absensi masuk hari ini.</p>
            <Button
              label="Check-In Sekarang"
              icon="pi pi-sign-in"
              className="w-full p-button-success p-button-lg mt-2"
              onClick={handleCheckIn}
              loading={isSubmitting}
            />
          </div>
        );
      
      case 'checked_in':
        return (
          <div className="text-center">
            <i className="pi pi-check-circle" style={{ fontSize: '3rem', color: 'var(--green-500)' }}></i>
            <h3 className="mt-3">Anda Sudah Masuk</h3>
            <p className="text-color-secondary">Waktu Check-In:</p>
            <h2 className="my-2" style={{ color: 'var(--text-color)' }}>{checkInTime} WIB</h2>
            <Button
              label="Check-Out"
              icon="pi pi-sign-out"
              className="w-full p-button-danger p-button-lg mt-2"
              onClick={handleCheckOut}
              loading={isSubmitting}
            />
          </div>
        );
        
      case 'checked_out':
        return (
          <div className="text-center">
            <i className="pi pi-thumbs-up" style={{ fontSize: '3rem', color: 'var(--blue-500)' }}></i>
            <h3 className="mt-3">Absensi Selesai</h3>
            <p className="text-color-secondary">
              Anda sudah berhasil Check-Out hari ini. Terima kasih!
            </p>
          </div>
        );
    }
  };
  
  const statusBodyTemplate = (log: AttendanceLog) => { 
    const severityMap: { [key: string]: 'success' | 'warning' | 'danger' } = {
      'Tepat Waktu': 'success',
      'Terlambat': 'warning',
      'Alpha': 'danger',
    };
    return <Tag value={log.status} severity={severityMap[log.status]} />;
  };

  const renderRiwayatHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center">
        {!isSearchVisible && (
          <h5 className="m-0">Riwayat Absensi (1 Minggu Terakhir)</h5>
        )}
        {isSearchVisible && (
          <span className="p-input-icon-left w-full">
            <i className="pi pi-search" />
            <InputText 
              ref={searchInputRef}
              type="search" 
              value={globalFilter} 
              onChange={(e) => setGlobalFilter(e.target.value)} 
              placeholder="Ketik untuk mencari (tanggal, status, dll...)" 
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

  // --- JSX (Return) Utama ---
  return (
    <div className="grid">
      <Toast ref={toast} />
      {/* Kolom Kiri */}
      <div className="col-12 md:col-5 lg:col-4">
        <Card className="shadow-1 h-full">
          {renderAttendanceAction()}
        </Card>
      </div>
      {/* Kolom Kanan */}
      <div className="col-12 md:col-7 lg:col-8">
        <Card className="shadow-1 h-full">
          <DataTable 
            value={attendanceLog} 
            responsiveLayout="scroll" 
            paginator 
            rows={5} 
            emptyMessage="Belum ada riwayat absensi."
            header={renderRiwayatHeader}
            globalFilter={globalFilter}
          >
            <Column field="tanggal" header="Tanggal" sortable />
            <Column field="waktuMasuk" header="Masuk" />
            <Column field="waktuKeluar" header="Keluar" />
            <Column header="Status" body={statusBodyTemplate} />
          </DataTable>
        </Card>
      </div>
    </div>
  );
}

