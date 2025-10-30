// /app/karyawan/page.tsx

'use client';

import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import Link from 'next/link';

// --- Tipe Data Bohongan (Mock) ---
interface RingkasanStats {
  totalHadir: number;
  totalTidakHadir: number; // Mengganti nama variabel agar lebih jelas
  sisaCuti: number;
}

interface PengajuanPending {
  id: string;
  jenis: 'Cuti' | 'Lembur';
  tanggal: string; // Tanggal pengajuan
  status: 'Pending' | 'Approved' | 'Rejected';
}

// --- Data Bohongan (Mock) ---
const mockStats: RingkasanStats = {
  totalHadir: 20,
  totalTidakHadir: 2, // Mengganti nama variabel
  sisaCuti: 8,
};

// Filter data mock agar hanya menampilkan yang pending di state awal
const mockPending: PengajuanPending[] = [
  { id: 'C-001', jenis: 'Cuti', tanggal: '28 Okt 2025', status: 'Pending' },
  { id: 'L-002', jenis: 'Lembur', tanggal: '25 Okt 2025', status: 'Approved' }, // Contoh data approved
  { id: 'C-004', jenis: 'Cuti', tanggal: '29 Okt 2025', status: 'Pending' }, // Contoh data pending lain
];

export default function DashboardRingkasanPage() {
  const [stats] = useState(mockStats);
  // Filter daftar pengajuan yang statusnya 'Pending'
  const [pendingList] = useState(mockPending.filter(p => p.status === 'Pending'));

  // Helper untuk styling status di tabel
  const statusBodyTemplate = (rowData: PengajuanPending) => {
    // Map untuk menentukan warna Tag berdasarkan status
    const severityMap: { [key: string]: 'warning' | 'success' | 'danger' } = {
      Pending: 'warning',
      Approved: 'success',
      Rejected: 'danger',
    };
    return <Tag value={rowData.status} severity={severityMap[rowData.status]} />;
  };

  return (
    <div>
      {/* --- 1. Header Sambutan --- */}
      <div className="mb-4">
        <h2 className="m-0">Dashboard</h2>
        <h3 className="m-0">Karyawan</h3>
        <p className="text-color-secondary">
          Ringkasan aktivitas dan status Anda bulan ini.
        </p>
      </div>

      {/* --- 2. Ringkasan Absensi (Statistik) --- */}
      <div className="grid">
        {/* Card Total Hadir */}
        <div className="col-12 md:col-4">
          <Card className="shadow-1 h-full"> {/* Tambah h-full agar tinggi sama */}
            <div className="flex align-items-center">
              <i className="pi pi-check-circle text-3xl text-green-500 mr-3"></i>
              <div>
                <span className="text-color-secondary">Total Hadir Bulan Ini</span>
                <h3 className="m-0 mt-1">{stats.totalHadir} Hari</h3>
              </div>
            </div>
          </Card>
        </div>
        {/* Card Total Tidak Hadir */}
        <div className="col-12 md:col-4">
          <Card className="shadow-1 h-full"> {/* Tambah h-full */}
            <div className="flex align-items-center">
              <i className="pi pi-exclamation-triangle text-3xl text-orange-500 mr-3"></i>
              <div>
                <span className="text-color-secondary">Total Tidak Hadir</span>
                <h3 className="m-0 mt-1">{stats.totalTidakHadir} Hari</h3>
              </div>
            </div>
          </Card>
        </div>
        {/* Card Sisa Cuti */}
        <div className="col-12 md:col-4">
          <Card className="shadow-1 h-full"> {/* Tambah h-full */}
            <div className="flex align-items-center">
              <i className="pi pi-calendar text-3xl text-blue-500 mr-3"></i>
              <div>
                <span className="text-color-secondary">Sisa Cuti Tahunan</span>
                <h3 className="m-0 mt-1">{stats.sisaCuti} Hari</h3>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* --- 3. Ringkasan Menu Lainnya --- */}
      <div className="grid mt-3">
        
        {/* Kolom Kiri: Ringkasan Pengajuan Pending */}
        <div className="col-12 lg:col-8">
          <Panel header="Ringkasan Pengajuan (Tertunda)">
            {pendingList.length > 0 ? (
              <DataTable value={pendingList} responsiveLayout="scroll" size="small"> {/* Tambah size small */}
                <Column field="jenis" header="Jenis Pengajuan"></Column>
                <Column field="tanggal" header="Tanggal Diajukan"></Column>
                <Column header="Status" body={statusBodyTemplate}></Column>
              </DataTable>
            ) : (
              <p className="m-0">Tidak ada pengajuan yang tertunda. Kerja bagus!</p>
            )}
          </Panel>
        </div>

        {/* Kolom Kanan: Akses Cepat */}
        <div className="col-12 lg:col-4">
          <Panel header="Akses Cepat">
            <div className="flex flex-column gap-3">
              {/* --- LINK SUDAH DIPERBAIKI --- */}
              <Link href="/karyawan/Absensi" passHref> 
                <Button 
                  label="Lakukan Absensi" 
                  icon="pi pi-clock" 
                  className="w-full p-button-success" 
                />
              </Link>
              <Link href="/karyawan/Pengajuan/cuti" passHref>
                <Button 
                  label="Buat Pengajuan Baru" 
                  icon="pi pi-file-edit" 
                  className="w-full" 
                  outlined 
                />
              </Link>
              <Link href="/karyawan/profil" passHref>
                <Button 
                  label="Lihat Profil Saya" 
                  icon="pi pi-user" 
                  className="w-full p-button-secondary" 
                  outlined 
                />
              </Link>
              {/* ----------------------------- */}
            </div>
          </Panel>
        </div>
        
      </div>
    </div>
  );
}
