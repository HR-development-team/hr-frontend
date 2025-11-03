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
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { Chart } from 'primereact/chart';
import type { ChartData, ChartOptions } from 'chart.js';

// --- Tipe Data (Harus sesuai dengan respons API) ---
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
  code: string; // 'code' akan digunakan sebagai ID untuk dikirim ke backend
}

// Data master jatah cuti (sebaiknya juga dari API)
const JATAH_CUTI_TAHUNAN = 12; 

// --- Data Bohongan (Hanya untuk fallback/simulasi) ---
const mockHistory: LeaveRequest[] = [
  { id: 'C-001', jenisCuti: 'Cuti Tahunan', tanggalMulai: '25 Okt 2025', tanggalSelesai: '25 Okt 2025', status: 'Approved', alasan: 'Acara keluarga' },
  { id: 'C-002', jenisCuti: 'Sakit', tanggalMulai: '15 Okt 2025', tanggalSelesai: '16 Okt 2025', status: 'Approved', alasan: 'Demam' },
  { id: 'C-003', jenisCuti: 'Cuti Melahirkan', tanggalMulai: '01 Nov 2025', tanggalSelesai: '02 Nov 2025', status: 'Pending', alasan: 'Persiapan' },
  { id: 'C-004', jenisCuti: 'Cuti Tahunan', tanggalMulai: '05 Sep 2025', tanggalSelesai: '05 Sep 2025', status: 'Approved', alasan: '-' },
  { id: 'C-006', jenisCuti: 'Cuti Penting', tanggalMulai: '20 Aug 2025', tanggalSelesai: '20 Aug 2025', status: 'Approved', alasan: 'Keluarga' },
  { id: 'C-007', jenisCuti: 'Cuti Tahunan', tanggalMulai: '20 Aug 2025', tanggalSelesai: '20 Aug 2025', status: 'Approved', alasan: 'Keluarga' },
];

const mockLeaveTypes: LeaveType[] = [
  { name: 'Cuti Tahunan', code: 'CT' },
  { name: 'Cuti Sakit', code: 'CS' },
  { name: 'Cuti Melahirkan', code: 'CM' },
  { name: 'Cuti Penting', code: 'CP' }, 
];

// --- Konstanta API (Tempat menaruh URL Backend) ---
const API_URLS = {
  // GET: /api/karyawan/cuti/data (Harapannya mengembalikan { history: [], leaveTypes: [], jatahCuti: 12 })
  data: '/api/karyawan/cuti/data',
  // POST: /api/karyawan/cuti/submit (Mengirim data form baru)
  submit: '/api/karyawan/cuti/submit'
};

export default function PengajuanCutiPage() {
  const toast = useRef<Toast>(null);
  
  // State Data
  const [history, setHistory] = useState<LeaveRequest[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [sisaCuti, setSisaCuti] = useState(0);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [chartOptions, setChartOptions] = useState<ChartOptions | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // State Form
  const [jenisCuti, setJenisCuti] = useState<LeaveType | null>(null);
  const [tanggal, setTanggal] = useState<(Date | null)[] | null>(null);
  const [alasan, setAlasan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Search
  const [globalFilter, setGlobalFilter] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- 1. MEMUAT DATA AWAL (useEffect) ---
  useEffect(() => {
    const loadPageData = async () => {
      setIsLoadingData(true);
      try {
        //
        // --- TEMPAT BACKEND (GET DATA) ---
        // (Hilangkan komentar ini saat backend siap)
        //
        // const response = await fetch(API_URLS.data);
        // if (!response.ok) throw new Error('Gagal memuat data cuti');
        // const data = await response.json(); 
        // 
        // const { history, leaveTypes, jatahCuti } = data;
        // setHistory(history);
        // setLeaveTypes(leaveTypes);
        //
        // --- Batas Tempat Backend ---

        // --- Simulasi (HAPUS INI SAAT BACKEND SIAP) ---
        await new Promise(resolve => setTimeout(resolve, 1000));
        const history = mockHistory;
        const leaveTypes = mockLeaveTypes;
        const jatahCuti = JATAH_CUTI_TAHUNAN;
        setHistory(history);
        setLeaveTypes(leaveTypes);
        // --- Batas Simulasi ---

        // --- Logika untuk Memproses Data Chart ---
        const cutiTerpakai: { [key: string]: number } = {};
        let totalTerpakai = 0;

        history
          .filter((req: LeaveRequest) => req.status === 'Approved')
          .forEach((req: LeaveRequest) => {
            // Logika ini menghitung SEMUA jenis cuti (untuk data donat)
            cutiTerpakai[req.jenisCuti] = (cutiTerpakai[req.jenisCuti] || 0) + 1;
            
            // Logika ini HANYA menghitung Cuti Tahunan (untuk angka Sisa Cuti)
            if (req.jenisCuti === 'Cuti Tahunan') { 
              totalTerpakai++;
            }
          });
        
        const sisa = jatahCuti - totalTerpakai;
        setSisaCuti(sisa); // Ini akan berisi Sisa Cuti Tahunan

        // Siapkan data untuk Doughnut Chart
        // Chart ini akan menampilkan SEMUA jenis cuti
        const chartJSData = {
          labels: Object.keys(cutiTerpakai),
          datasets: [
            {
              data: Object.values(cutiTerpakai),
              backgroundColor: ['#42A5F5', '#FFCA28', '#66BB6A', '#FF7043', '#AB47BC'],
              hoverBackgroundColor: ['#64B5F6', '#FFD54F', '#81C784', '#FF8A65', '#BA68C8']
            }
          ]
        };
        
        const chartJSOptions = {
          cutout: '60%',
          responsive: true,
          maintainAspectRatio: false, 
          plugins: {
            legend: {
              position: 'bottom' as const,
            }
          }
        };
        
        setChartData(chartJSData);
        setChartOptions(chartJSOptions);

      } catch (error) {
        console.error(error);
        toast.current?.show({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Gagal memuat data riwayat.' 
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    loadPageData();
  }, []); // [] = Dijalankan sekali

  // useEffect untuk auto-focus search (tidak berubah)
  useEffect(() => {
    if (isSearchVisible) {
        searchInputRef.current?.focus();
    }
  }, [isSearchVisible]);


  // --- 2. FUNGSI AKSI (Kirim Form) ---
  const handleSubmitCuti = async () => {
    // Validasi Sederhana
    if (!jenisCuti || !tanggal || !tanggal[0] || !tanggal[1] || !alasan) {
      toast.current?.show({ 
        severity: 'warn', 
        summary: 'Validasi Gagal', 
        detail: 'Harap lengkapi semua field.', 
        life: 3000 
      });
      return;
    }

    setIsSubmitting(true);
    
    // Siapkan data untuk dikirim ke backend
    // Sesuai dengan skema DB Anda (leave_requests)
    const submissionData = {
      leave_type_id: jenisCuti.code, // (FK) Kirim 'code' (ID) ke backend
      start_date: tanggal[0].toISOString().split('T')[0], // (date) Format YYYY-MM-DD
      end_date: tanggal[1].toISOString().split('T')[0], // (date) Format YYYY-MM-DD
      reason: alasan, // (text)
      // 'employee_id' dan 'status' (pending) akan di-handle oleh backend
    };

    try {
      //
      // --- TEMPAT BACKEND (POST DATA) ---
      // (Hilangkan komentar ini saat backend siap)
      //
      // console.log("Mengirim data:", JSON.stringify(submissionData));
      // const response = await fetch(API_URLS.submit, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(submissionData)
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Gagal mengirim pengajuan ke server');
      // }
      //
      // const newRequest: LeaveRequest = await response.json(); // Data baru dari server
      //
      // --- Batas Tempat Backend ---
      
      // --- Simulasi (HAPUS INI SAAT BACKEND SIAP) ---
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Buat data palsu seolah-olah dari backend
      const newRequest: LeaveRequest = {
        id: `C-00${Math.floor(Math.random() * 100)}`,
        jenisCuti: jenisCuti.name,
        tanggalMulai: tanggal[0].toLocaleDateString('id-ID'),
        tanggalSelesai: tanggal[1].toLocaleDateString('id-ID'),
        status: 'Pending',
        alasan: alasan
      };
      // --- Batas Simulasi ---
      
      // Update UI
      setHistory([newRequest, ...history]); // Tambahkan pengajuan baru ke atas tabel
      setJenisCuti(null);
      setTanggal(null);
      setAlasan('');
      toast.current?.show({ 
        severity: 'success', 
        summary: 'Pengajuan Terkirim', 
        detail: 'Pengajuan cuti Anda sedang ditinjau.', 
        life: 3000 
      });

    } catch (error) {
      console.error(error);
      toast.current?.show({ 
        severity: 'error', 
        summary: 'Error', 
        detail: (error as Error).message || 'Gagal mengirim pengajuan' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 3. HELPER RENDER (Status & Header) ---
  
  // Helper untuk styling status di tabel
  const statusBodyTemplate = (req: LeaveRequest) => {
    const severityMap: { [key: string]: 'success' | 'warning' | 'danger' } = {
      'Approved': 'success',
      'Pending': 'warning',
      'Rejected': 'danger',
    };
    return <Tag value={req.status} severity={severityMap[req.status]} />;
  };
  
  // Helper untuk Header Tabel Riwayat (Search Modern)
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
  const historyHeader = renderHistoryHeader(); // Panggil fungsi untuk header

  // --- 4. JSX (Tampilan) ---
  return (
    <div className="grid">
      <Toast ref={toast} />

      {/* --- Kolom Kiri: Form Pengajuan --- */}
      <div className="col-12 md:col-8">
        <Card className="shadow-1 h-full" title="Formulir Pengajuan Cuti">
          
          {isLoadingData ? (
            // Skeleton untuk Form
            <div className="p-fluid grid">
              <div className="field col-12 md:col-6"><Skeleton height="3rem" /></div>
              <div className="field col-12 md:col-6"><Skeleton height="3rem" /></div>
              <div className="field col-12"><Skeleton height="6rem" /></div>
              <div className="col-12"><Skeleton height="3rem" width="10rem" /></div>
            </div>
          ) : (
            // Form Sebenarnya
            <div className="p-fluid grid">
              {/* Jenis Cuti */}
              <div className="field col-12 md:col-6">
                <label htmlFor="jenisCuti" className="font-semibold block mb-2">Jenis Cuti</label>
                <Dropdown
                  id="jenisCuti"
                  value={jenisCuti}
                  options={leaveTypes} // Gunakan state 'leaveTypes'
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
          )}
        </Card>
      </div>

      {/* --- Kolom Kanan: Chart Sisa Cuti --- */}
      <div className="col-12 md:col-4">
        <Card className="shadow-1 h-full" title="Ringkasan Cuti Anda">
          {isLoadingData ? (
            // Skeleton untuk Chart
            <Skeleton height="300px" />
          ) : (
            // Chart Sebenarnya
            <div className="relative">
              {/* Teks Tengah */}
              <div className="absolute flex align-items-center justify-content-center w-full" 
                   style={{ 
                     top: '50%', 
                     left: '50%',
                     transform: 'translate(-50%, -50%)',
                     marginTop: '-20px', /* Sesuaikan sedikit ke atas karena ada legenda di bawah */
                     zIndex: 1
                   }}>
                <div className="text-center">
                  <span className="text-xl text-color-secondary">Sisa Cuti</span>
                  <h1 className="m-0" style={{ fontSize: '4rem', color: 'var(--blue-500)' }}>
                    {sisaCuti}
                  </h1>
                  <span className="text-lg text-color-secondary">Hari</span>
                </div>
              </div>
              
              <Chart type="doughnut" data={chartData!} options={chartOptions!} style={{ height: '300px' }} />
            </div>
          )}
        </Card>
      </div>

      {/* --- Baris Bawah: Riwayat Pengajuan (Full Width) --- */}
      <div className="col-12 mt-4">
        <Card className="shadow-1">
          {isLoadingData ? (
            // Skeleton untuk Tabel
            <Skeleton height="200px" />
          ) : (
            // Tabel Sebenarnya
            <DataTable
              value={history}
              header={historyHeader}
              globalFilter={globalFilter}
              responsiveLayout="stack"
              breakpoint="768px"
              paginator
              rows={5}
              emptyMessage="Belum ada riwayat pengajuan cuti."
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

