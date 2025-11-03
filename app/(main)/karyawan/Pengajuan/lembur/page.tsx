// /app/karyawan/pengajuan/lembur/page.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Calendar } from 'primereact/calendar'; // Untuk tanggal & waktu
import { InputTextarea } from 'primereact/inputtextarea'; // Untuk alasan

// --- Tipe Data Bohongan (Mock) ---
interface OvertimeRequest {
  id: string;
  tanggal: string;
  waktuMulai: string;
  waktuSelesai: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  alasan: string;
}

// --- Data Bohongan (Mock) ---
const mockHistory: OvertimeRequest[] = [
  { id: 'L-001', tanggal: '25 Okt 2025', waktuMulai: '17:00', waktuSelesai: '19:00', status: 'Approved', alasan: 'Deploy hotfix v1.2' },
  { id: 'L-002', tanggal: '29 Okt 2025', waktuMulai: '17:00', waktuSelesai: '18:00', status: 'Pending', alasan: 'Meeting darurat' },
];

export default function PengajuanLemburPage() {
  const toast = useRef<Toast>(null);
  const [history, setHistory] = useState<OvertimeRequest[]>([]);

  // --- State untuk Form ---
  const [tanggal, setTanggal] = useState<Date | null>(null);
  const [waktuMulai, setWaktuMulai] = useState<Date | null>(null);
  const [waktuSelesai, setWaktuSelesai] = useState<Date | null>(null);
  const [alasan, setAlasan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Muat data riwayat saat halaman dibuka
  useEffect(() => {
    setHistory(mockHistory);
  }, []);

  // --- Fungsi Aksi ---
  const handleSubmitLembur = () => {
    // Validasi Sederhana
    if (!tanggal || !waktuMulai || !waktuSelesai || !alasan) {
      toast.current?.show({ 
        severity: 'warn', 
        summary: 'Validasi Gagal', 
        detail: 'Harap lengkapi semua field.', 
        life: 3000 
      });
      return;
    }
    
    // Validasi Waktu
    if (waktuSelesai <= waktuMulai) {
      toast.current?.show({ 
        severity: 'warn', 
        summary: 'Validasi Waktu', 
        detail: 'Waktu selesai harus setelah waktu mulai.', 
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
        detail: 'Pengajuan lembur Anda sedang ditinjau.', 
        life: 3000 
      });
      
      // Reset form
      setTanggal(null);
      setWaktuMulai(null);
      setWaktuSelesai(null);
      setAlasan('');
      // Di aplikasi nyata, Anda akan refresh data 'history'
    }, 1500);
  };

  // --- Helper untuk styling status di tabel ---
  const statusBodyTemplate = (req: OvertimeRequest) => {
    const severityMap: { [key: string]: 'success' | 'warning' | 'danger' } = {
      'Approved': 'success',
      'Pending': 'warning',
      'Rejected': 'danger',
    };
    return <Tag value={req.status} severity={severityMap[req.status]} />;
  };

  return (
    <div className="grid">
      <Toast ref={toast} />

      {/* --- Bagian Atas: Form Pengajuan Lembur --- */}
      <div className="col-12">
        <Card className="shadow-1" title="Formulir Pengajuan Lembur">
          <div className="p-fluid grid">
            
            {/* Tanggal Lembur */}
            <div className="field col-12 md:col-4">
              <label htmlFor="tanggal" className="font-semibold block mb-2">Tanggal Lembur</label>
              <Calendar 
                id="tanggal"
                value={tanggal} 
                onChange={(e) => setTanggal(e.value as Date | null)} 
                placeholder="Pilih tanggal"
                dateFormat="dd/mm/yy"
                showIcon
              />
            </div>
            
            {/* Waktu Mulai */}
            <div className="field col-6 md:col-4">
              <label htmlFor="waktuMulai" className="font-semibold block mb-2">Waktu Mulai</label>
              <Calendar 
                id="waktuMulai"
                value={waktuMulai} 
                onChange={(e) => setWaktuMulai(e.value as Date | null)} 
                placeholder="Pilih jam"
                timeOnly
                hourFormat="24"
                showIcon
              />
            </div>
            
            {/* Waktu Selesai */}
            <div className="field col-6 md:col-4">
              <label htmlFor="waktuSelesai" className="font-semibold block mb-2">Waktu Selesai</label>
              <Calendar 
                id="waktuSelesai"
                value={waktuSelesai} 
                onChange={(e) => setWaktuSelesai(e.value as Date | null)} 
                placeholder="Pilih jam"
                timeOnly
                hourFormat="24"
                showIcon
              />
            </div>
            
            {/* Alasan */}
            <div className="field col-12">
              <label htmlFor="alasan" className="font-semibold block mb-2">Alasan / Tugas Lembur</label>
              <InputTextarea 
                id="alasan"
                value={alasan} 
                onChange={(e) => setAlasan(e.target.value)} 
                rows={3} 
                placeholder="Tuliskan tugas yang dikerjakan saat lembur..." 
                autoResize 
              />
            </div>
            
            {/* Tombol Submit */}
            <div className="col-12">
              <Button 
                label="Kirim Pengajuan" 
                icon="pi pi-send" 
                onClick={handleSubmitLembur}
                loading={isSubmitting}
                className="w-full md:w-auto"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* --- Bagian Bawah: Riwayat Pengajuan --- */}
      <div className="col-12 mt-4">
        <Card className="shadow-1" title="Riwayat Pengajuan Lembur">
          <DataTable 
            value={history} 
            responsiveLayout="scroll" 
            paginator 
            rows={5} 
            emptyMessage="Belum ada riwayat pengajuan lembur."
          >
            <Column field="tanggal" header="Tanggal" sortable />
            <Column field="waktuMulai" header="Mulai" />
            <Column field="waktuSelesai" header="Selesai" />
            <Column field="alasan" header="Alasan" style={{ minWidth: '250px' }} />
            <Column header="Status" body={statusBodyTemplate} />
          </DataTable>
        </Card>
      </div>
      
    </div>
  );
}