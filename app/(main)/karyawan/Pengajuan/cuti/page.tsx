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

interface LeaveRequest {
  id: string | number;
  jenisCuti: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  alasan: string;
}

interface LeaveType {
  id: number;
  name: string;
  deduction: string;
  description: string;
}

const JATAH_CUTI_TAHUNAN = 12;

const API_URLS = {
  leaveTypes: '/api/admin/master/leave-type',
  leaveHistory: '/api/karyawan/leave-request', // route lokal nextjs
  submit: '/api/karyawan/leave-request',
};

export default function PengajuanCutiPage() {
  const toast = useRef<Toast>(null);

  const [history, setHistory] = useState<LeaveRequest[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [sisaCuti, setSisaCuti] = useState(0);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [chartOptions, setChartOptions] = useState<ChartOptions | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [jenisCuti, setJenisCuti] = useState<LeaveType | null>(null);
  const [tanggal, setTanggal] = useState<(Date | null)[] | null>(null);
  const [alasan, setAlasan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [globalFilter, setGlobalFilter] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- LOAD DATA DARI API (Next.js Route) ---
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);

        // 1️⃣ Fetch jenis cuti
        const resLeaveType = await fetch(API_URLS.leaveTypes);
        const dataType = await resLeaveType.json();
        let leaveTypesData: LeaveType[] = [];
        if (dataType.status === '00') {
          leaveTypesData = dataType.leave_types;
          setLeaveTypes(leaveTypesData);
        }

        // 2️⃣ Fetch riwayat cuti (sudah difilter di backend berdasarkan user login)
        const resHistory = await fetch(API_URLS.leaveHistory);
        const dataHistory = await resHistory.json();
        let mappedHistory: LeaveRequest[] = [];

        if (dataHistory.status === '00') {
          mappedHistory = dataHistory.leave_requests.map((item: any) => ({
            id: item.id,
            jenisCuti: leaveTypesData.find(lt => lt.id === item.leave_type_id)?.name || 'Lainnya',
            tanggalMulai: item.start_date.split('T')[0],
            tanggalSelesai: item.end_date.split('T')[0],
            alasan: item.reason,
            status: item.status,
          }));
          setHistory(mappedHistory);
        }

        // 3️⃣ Hitung sisa cuti dan buat chart
        const approvedOnly = mappedHistory.filter(item => item.status === 'Approved');
        const cutiTerpakai: { [key: string]: number } = {};
        let totalTahunan = 0;

        approvedOnly.forEach((item) => {
          const jenis = item.jenisCuti || 'Lainnya';
          cutiTerpakai[jenis] = (cutiTerpakai[jenis] || 0) + 1;
          if (jenis === 'Cuti Tahunan') totalTahunan++;
        });

        const sisa = JATAH_CUTI_TAHUNAN - totalTahunan;
        setSisaCuti(sisa);

        const chartJSData = {
          labels: Object.keys(cutiTerpakai),
          datasets: [
            {
              data: Object.values(cutiTerpakai),
              backgroundColor: ['#42A5F5', '#FFCA28', '#66BB6A', '#FF7043'],
              hoverBackgroundColor: ['#64B5F6', '#FFD54F', '#81C784', '#FF8A65']
            }
          ]
        };

        const chartJSOptions = {
          cutout: '70%',
          responsive: true,
          plugins: { legend: { position: 'bottom' as const } }
        };

        setChartData(chartJSData);
        setChartOptions(chartJSOptions);

      } catch (err) {
        console.error(err);
        toast.current?.show({
          severity: 'error',
          summary: 'Gagal Memuat',
          detail: 'Tidak dapat mengambil data dari server',
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (isSearchVisible) searchInputRef.current?.focus();
  }, [isSearchVisible]);

  // --- SUBMIT CUTI ---
  const handleSubmitCuti = async () => {
    if (!jenisCuti || !tanggal?.[0] || !tanggal?.[1] || !alasan) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validasi Gagal',
        detail: 'Lengkapi semua field.',
      });
      return;
    }

    const payload = {
      leave_type_id: jenisCuti.id,
      start_date: tanggal[0].toISOString().split('T')[0],
      end_date: tanggal[1].toISOString().split('T')[0],
      reason: alasan,
      deduction: jenisCuti.deduction,
    };

    try {
      setIsSubmitting(true);
      const res = await fetch(API_URLS.submit, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.status === '00') {
        toast.current?.show({
          severity: 'success',
          summary: 'Berhasil',
          detail: 'Pengajuan cuti berhasil dikirim!',
        });
        setJenisCuti(null);
        setTanggal(null);
        setAlasan('');

        // 🔁 Refresh otomatis
        const resHistory = await fetch(API_URLS.leaveHistory);
        const dataHistory = await resHistory.json();
        if (dataHistory.status === '00') {
          const mappedHistory = dataHistory.leave_requests.map((item: any) => ({
            id: item.id,
            jenisCuti: leaveTypes.find(lt => lt.id === item.leave_type_id)?.name || 'Lainnya',
            tanggalMulai: item.start_date.split('T')[0],
            tanggalSelesai: item.end_date.split('T')[0],
            alasan: item.reason,
            status: item.status,
          }));
          setHistory(mappedHistory);
        }
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Gagal',
          detail: data.message || 'Terjadi kesalahan.',
        });
      }
    } catch (e) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Tidak dapat mengirim ke server',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusBodyTemplate = (req: LeaveRequest) => {
    const severityMap: { [key: string]: 'success' | 'warning' | 'danger' } = {
      Approved: 'success',
      Pending: 'warning',
      Rejected: 'danger',
    };
    return <Tag value={req.status} severity={severityMap[req.status]} />;
  };

  const historyHeader = (
    <div className="flex justify-content-between align-items-center">
      {!isSearchVisible && <h5 className="m-0">Riwayat Pengajuan Cuti</h5>}
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
        icon={isSearchVisible ? 'pi pi-times' : 'pi pi-search'}
        className="p-button-text p-button-rounded ml-2"
        onClick={() => {
          setIsSearchVisible(!isSearchVisible);
          if (isSearchVisible) setGlobalFilter('');
        }}
      />
    </div>
  );

  return (
    <div className="grid">
      <Toast ref={toast} />

      {/* FORM CUTI */}
      <div className="col-12 md:col-8">
        <Card title="Formulir Pengajuan Cuti" className="shadow-1 h-full">
          {isLoadingData ? (
            <Skeleton height="12rem" />
          ) : (
            <div className="p-fluid grid">
              <div className="field col-12 md:col-6">
                <label className="font-semibold block mb-2">Jenis Cuti</label>
                <Dropdown
                  value={jenisCuti}
                  options={leaveTypes}
                  onChange={(e) => setJenisCuti(e.value)}
                  optionLabel="name"
                  placeholder="Pilih Jenis Cuti"
                />
              </div>

              <div className="field col-12 md:col-6">
                <label className="font-semibold block mb-2">Tanggal Cuti</label>
                <Calendar
                  value={tanggal}
                  onChange={(e) => setTanggal(e.value as any)}
                  selectionMode="range"
                  readOnlyInput
                  placeholder="Pilih rentang tanggal"
                  showIcon
                />
              </div>

              <div className="field col-12">
                <label className="font-semibold block mb-2">Alasan</label>
                <InputTextarea
                  rows={4}
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  placeholder="Tuliskan alasan cuti minimal 10 karakter..."
                  autoResize
                />
              </div>

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

      {/* RINGKASAN CHART */}
      <div className="col-12 md:col-4">
        <Card title="Ringkasan Cuti Anda" className="shadow-1 h-full">
          {isLoadingData ? (
            <Skeleton height="300px" />
          ) : (
            <div className="flex flex-column align-items-center justify-content-center" style={{ position: 'relative' }}>
              <div style={{ width: '260px', height: '260px', position: 'relative' }}>
                <Chart type="doughnut" data={chartData!} options={chartOptions!} />
                <div
                  className="flex flex-column align-items-center justify-content-center text-center"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    transform: 'translateY(-4px)',
                  }}
                >
                  <span className="text-lg text-color-secondary" style={{ marginBottom: '4px' }}>
                    Sisa Cuti
                  </span>
                  <h1
                    className="m-0"
                    style={{
                      fontSize: '3.2rem',
                      color: 'var(--blue-500)',
                      lineHeight: 1,
                      marginBottom: '6px',
                    }}
                  >
                    {sisaCuti}
                  </h1>
                  <span className="text-base text-color-secondary">Hari</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* RIWAYAT CUTI */}
      <div className="col-12 mt-4">
        <Card className="shadow-1">
          {isLoadingData ? (
            <Skeleton height="200px" />
          ) : (
            <DataTable
              value={history}
              header={historyHeader}
              globalFilter={globalFilter}
              paginator
              rows={5}
              responsiveLayout="stack"
              emptyMessage="Belum ada riwayat pengajuan cuti."
            >
              <Column field="jenisCuti" header="Jenis Cuti" sortable />
              <Column field="tanggalMulai" header="Mulai" />
              <Column field="tanggalSelesai" header="Selesai" />
              <Column field="alasan" header="Alasan" />
              <Column header="Status" body={statusBodyTemplate} />
            </DataTable>
          )}
        </Card>
      </div>
    </div>
  );
}
