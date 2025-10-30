// /app/karyawan/pengajuan/cuti/page.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';

// --- Tipe Data Bohongan (Mock) ---
interface LeaveRequest {
  id: string;
  jenisCuti: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  alasan: string;
}

interface LeaveType {
  name: string;
  code: string;
}

// --- Data Bohongan (Mock) ---
const mockHistory: LeaveRequest[] = [
  { id: 'C-001', jenisCuti: 'Cuti Tahunan', tanggalMulai: '25 Okt 2025', tanggalSelesai: '25 Okt 2025', status: 'Approved', alasan: 'Acara keluarga' },
  { id: 'C-002', jenisCuti: 'Sakit', tanggalMulai: '15 Okt 2025', tanggalSelesai: '16 Okt 2025', status: 'Approved', alasan: 'Demam' },
  { id: 'C-003', jenisCuti: 'Cuti Tahunan', tanggalMulai: '01 Nov 2025', tanggalSelesai: '02 Nov 2025', status: 'Pending', alasan: 'Liburan' },
];

const mockLeaveTypes: LeaveType[] = [
  { name: 'Cuti Tahunan', code: 'CT' },
  { name: 'Cuti Sakit', code: 'CS' },
  { name: 'Cuti Melahirkan', code: 'CM' },
  { name: 'Cuti Lainya', code: 'CL' },
  { name: 'Cuti Penting', code: 'CP' },
];

export default function PengajuanCutiPage() {
  const toast = useRef<Toast>(null);
  const [history, setHistory] = useState<LeaveRequest[]>([]);
  const [sisaCuti] = useState(8); // Data bohongan
  const [isLoadingData, setIsLoadingData] = useState(true); // State loading data

  // --- State untuk Form ---
  const [jenisCuti, setJenisCuti] = useState<LeaveType | null>(null);
  const [tanggal, setTanggal] = useState<(Date | null)[] | null>(null);
  const [alasan, setAlasan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- State untuk Search ---
  const [globalFilter, setGlobalFilter] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Muat data riwayat saat halaman dibuka
  useEffect(() => {
    // Simulasi fetch data
    setTimeout(() => {
        setHistory(mockHistory);
        setIsLoadingData(false); // Selesai loading
    }, 1000);
  }, []);

  // Efek untuk auto-focus search
  useEffect(() => {
    if (isSearchVisible) {
        searchInputRef.current?.focus();
    }
  }, [isSearchVisible]);


  // --- Fungsi Aksi ---
  const handleSubmitCuti = () => {
    if (!jenisCuti || !tanggal || !alasan) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validasi Gagal',
        detail: 'Harap lengkapi semua field.',
        life: 3000
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.current?.show({
        severity: 'success',
        summary: 'Pengajuan Terkirim',
        detail: 'Pengajuan cuti Anda sedang ditinjau.',
        life: 3000
      });

      // Reset form
      setJenisCuti(null);
      setTanggal(null);
      setAlasan('');
    }, 1500);
  };

  // --- Helper untuk styling status di tabel ---
  const statusBodyTemplate = (req: LeaveRequest) => {
    const severityMap: { [key: string]: 'success' | 'warning' | 'danger' } = {
      'Approved': 'success',
      'Pending': 'warning',
      'Rejected': 'danger',
    };
    return <Tag value={req.status} severity={severityMap[req.status]} />;
  };

  // --- Helper untuk Header Tabel Riwayat (Search Modern) ---
  const renderHistoryHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center">
        {!isSearchVisible && (
          <h5 className="m-0">Riwayat Pengajuan Cuti</h5>
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
              onBlur={() => { if (!globalFilter) setIsSearchVisible(false); }}
            />
          </span>
        )}
        <Button
          icon={isSearchVisible ? "pi pi-times" : "pi pi-search"}
          className="p-button-text p-button-rounded ml-2"
          onClick={() => {
            setIsSearchVisible(!isSearchVisible);
            if (isSearchVisible) setGlobalFilter('');
          }}
        />
      </div>
    );
  };
  const historyHeader = renderHistoryHeader();

  return (
    <div className="grid">
      <Toast ref={toast} />

      {/* --- Bagian 1: Form Pengajuan (Full Width) --- */}
      <div className="col-12">
        <Card className="shadow-1" title="Formulir Pengajuan Cuti">

          {/* --- Info Sisa Cuti --- */}
          <Message
            severity="info"
            className="w-full mb-4"
            content={
              <div className="flex align-items-center">
                <i className="pi pi-info-circle text-2xl mr-3"></i>
                <div>
                  <div className="font-bold">Sisa Cuti Tahunan Anda: {sisaCuti} Hari</div>
                  <span className="text-sm">Gunakan sisa cuti Anda dengan bijak.</span>
                </div>
              </div>
            }
          />

          {/* --- Form Fields (Menggunakan PrimeFlex Grid) --- */}
          <div className="p-fluid grid">
            {/* Jenis Cuti */}
            <div className="field col-12 md:col-6">
              <label htmlFor="jenisCuti" className="font-semibold block mb-2">Jenis Cuti</label>
              <Dropdown
                id="jenisCuti"
                value={jenisCuti}
                options={mockLeaveTypes}
                onChange={(e) => setJenisCuti(e.value)}
                optionLabel="name"
                placeholder="Pilih Jenis Cuti"
              />
            </div>

            {/* Pilihan Tanggal (Range) */}
            <div className="field col-12 md:col-6">
              <label htmlFor="tanggal" className="font-semibold block mb-2">Tanggal Cuti</label>
              <Calendar
                id="tanggal"
                value={tanggal}
                onChange={(e) => setTanggal(e.value as any)}
                selectionMode="range"
                readOnlyInput
                placeholder="Pilih rentang tanggal"
                dateFormat="dd/mm/yy"
                showIcon
              />
            </div>

            {/* Alasan */}
            <div className="field col-12">
              <label htmlFor="alasan" className="font-semibold block mb-2">Alasan</label>
              <InputTextarea
                id="alasan"
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                rows={4}
                placeholder="Tuliskan alasan cuti Anda..."
                autoResize
              />
            </div>

            {/* Tombol Submit */}
            <div className="col-12">
              <Button
                label="Kirim Pengajuan"
                icon="pi pi-send"
                onClick={handleSubmitCuti}
                loading={isSubmitting}
                className="w-full md:w-auto"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* --- Bagian 2: Riwayat Pengajuan (Full Width) --- */}
      <div className="col-12 mt-4">
        <Card className="shadow-1">
          {isLoadingData ? (
             // Tampilkan Skeleton saat data riwayat sedang loading
             <Skeleton height="200px" />
          ) : (
            <DataTable
                value={history}
                header={historyHeader}
                globalFilter={globalFilter}
                responsiveLayout="stack"
                breakpoint="768px"
                paginator
                rows={5}
                emptyMessage="Belum ada riwayat pengajuan cuti."
                // --- TAMBAHKAN CLASS INI ---
                className="compact-datatable-mobile" 
            >
                <Column field="jenisCuti" header="Jenis Cuti" sortable />
                <Column field="tanggalMulai" header="Mulai" />
                <Column field="tanggalSelesai" header="Selesai" />
                <Column field="alasan" header="Alasan" style={{ minWidth: '200px' }} />
                <Column header="Status" body={statusBodyTemplate} />
            </DataTable>
          )}
        </Card>
      </div>

    </div>
  );
}

