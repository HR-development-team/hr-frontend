"use client";

import "primereact/resources/themes/lara-light-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback, // Pastikan useCallback di-import
} from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { Chart } from "primereact/chart";

// ANIMATION WRAPPERS
const fadeInUp = "animate__animated animate__fadeInUp animate__faster";
const fadeIn = "animate__animated animate__fadeIn animate__faster";
const zoomIn = "animate__animated animate__zoomIn";

interface LeaveType {
  id: number;
  type_code: string;
  name: string;
  deduction: string;
  description: string;
}

interface LeaveRequest {
  id: string | number;
  jenisCuti: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: "Approved" | "Pending" | "Rejected";
  alasan: string;
}

const JATAH_CUTI_TAHUNAN = 12;

const API_URLS = {
  leaveTypes: "/api/admin/master/leave-type",
  leaveHistory: "/api/karyawan/leave-request/current-employee",
  submit: "/api/karyawan/leave-request",
};

export default function PengajuanCutiPage() {
  const toast = useRef<Toast>(null);

  const [history, setHistory] = useState<LeaveRequest[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [sisaCuti, setSisaCuti] = useState(0);
  const [chartData, setChartData] = useState<any>(null);
  const [chartOptions, setChartOptions] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [jenisCuti, setJenisCuti] = useState<LeaveType | null>(null);
  const [tanggal, setTanggal] = useState<(Date | null)[] | null>(null);
  const [alasan, setAlasan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [globalFilter, setGlobalFilter] = useState("");
  const [filterJenisCuti, setFilterJenisCuti] = useState<LeaveType | null>(
    null
  );
  const [filterTanggalMulai, setFilterTanggalMulai] = useState<Date | null>(
    null
  );
  const [filterTanggalSelesai, setFilterTanggalSelesai] = useState<Date | null>(
    null
  );

  // State untuk toggle filter di mobile
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const filteredHistory = useMemo(() => {
    let data = history;

    // Filter berdasarkan Jenis Cuti
    if (filterJenisCuti) {
      data = data.filter((item) => item.jenisCuti === filterJenisCuti.name);
    }

    // Filter berdasarkan Tanggal Mulai
    if (filterTanggalMulai) {
      const filterDate = new Date(filterTanggalMulai);
      filterDate.setHours(0, 0, 0, 0);
      data = data.filter((item) => {
        const itemDate = new Date(item.tanggalMulai);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate >= filterDate;
      });
    }

    // Filter berdasarkan Tanggal Selesai
    if (filterTanggalSelesai) {
      const filterDate = new Date(filterTanggalSelesai);
      filterDate.setHours(0, 0, 0, 0);
      data = data.filter((item) => {
        const itemDate = new Date(item.tanggalSelesai);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate <= filterDate;
      });
    }

    return data;
  }, [history, filterJenisCuti, filterTanggalMulai, filterTanggalSelesai]);

  // Fungsi loadData dipindah ke luar dan dibungkus useCallback
  const loadData = useCallback(async () => {
    setIsLoadingData(true);
    let leaveTypesData: LeaveType[] = [];
    let mappedHistory: LeaveRequest[] = [];

    try {
      const res = await fetch(API_URLS.leaveTypes);
      const data = await res.json();
      if (data.status === "00") {
        leaveTypesData = data.leave_types;
        setLeaveTypes(leaveTypesData);
      }
    } catch (err) {}

    try {
      const res = await fetch(API_URLS.leaveHistory);
      const data = await res.json();
      if (data.status === "00") {
        mappedHistory = data.leave_requests.map((item: any) => ({
          id: item.id,
          jenisCuti:
            leaveTypesData.find((lt) => lt.type_code === item.type_code)
              ?.name || "Lainnya",
          tanggalMulai: item.start_date.split("T")[0],
          tanggalSelesai: item.end_date.split("T")[0],
          alasan: item.reason,
          status: item.status,
        }));
        setHistory(mappedHistory);
      }
    } catch (err) {}

    const cutiTerpakai_Approved: { [key: string]: number } = {};
    let totalTahunan_Approved = 0;
    mappedHistory.forEach((item) => {
      if (item.jenisCuti === "Cuti Tahunan" && item.status === "Approved") {
        totalTahunan_Approved++;
      }
      if (item.status === "Approved") {
        const jenis = item.jenisCuti || "Lainnya";
        cutiTerpakai_Approved[jenis] =
          (cutiTerpakai_Approved[jenis] || 0) + 1;
      }
    });

    setSisaCuti(JATAH_CUTI_TAHUNAN - totalTahunan_Approved);
    setChartData({
      labels: Object.keys(cutiTerpakai_Approved),
      datasets: [
        {
          data: Object.values(cutiTerpakai_Approved),
          backgroundColor: ["#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE"],
          hoverBackgroundColor: ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC"],
          borderWidth: 0,
        },
      ],
    });
    setChartOptions({
      cutout: "75%",
      plugins: {
        legend: { position: "bottom" },
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
    });

    setIsLoadingData(false);
  }, []); // Dependensi kosong

  // useEffect sekarang hanya memanggil loadData
  useEffect(() => {
    loadData();
  }, [loadData]); // Tambahkan loadData sebagai dependensi

  // *** INI ADALAH FUNGSI DENGAN LOGIKA OPTIMISTIC UI UPDATE ***
  const handleSubmitCuti = async () => {
    // 1. Validasi
    if (!jenisCuti || !tanggal?.[0] || !tanggal?.[1] || !alasan) {
      toast.current?.show({
        severity: "warn",
        summary: "Validasi Gagal",
        detail: "Lengkapi semua field.",
      });
      return;
    }

    // --- Simpan state form saat ini untuk 'revert' jika gagal ---
    const currentJenisCuti = jenisCuti;
    const currentTanggal = tanggal;
    const currentAlasan = alasan;
    // --------------------------------------------------------

    // 2. Buat payload API & data optimis
    const tempId = `temp_${Date.now()}`; // ID sementara untuk UI
    const startDate = tanggal[0].toISOString().split("T")[0];
    const endDate = tanggal[1].toISOString().split("T")[0];

    const payload = {
      type_code: jenisCuti.type_code,
      start_date: startDate,
      end_date: endDate,
      reason: alasan,
    };

    // Ini adalah data "palsu" yang akan kita tampilkan di tabel
    const optimisticRequest: LeaveRequest = {
      id: tempId,
      jenisCuti: jenisCuti.name,
      tanggalMulai: startDate,
      tanggalSelesai: endDate,
      alasan: alasan,
      status: "Pending", // Asumsi status "Pending"
    };

    // 3. Update UI secara optimis (LANGSUNG TAMBAH KE TABEL)
    // Kita tambahkan di awal array agar muncul di paling atas
    setHistory((prevHistory) => [optimisticRequest, ...prevHistory]);

    // 4. Langsung bersihkan form (agar user merasa sukses)
    setJenisCuti(null);
    setTanggal(null);
    setAlasan("");

    // 5. Kirim request ke server
    setIsSubmitting(true);
    try {
      const res = await fetch(API_URLS.submit, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === "00") {
        // 6a. Sukses
        toast.current?.show({
          severity: "success",
          summary: "Berhasil",
          detail: data.message,
        });

        // Panggil loadData untuk sinkronisasi data asli dari server.
        // Ini akan menggantikan data optimis (tempId) dengan data asli (ID dari DB).
        loadData();
      } else {
        // 6b. Gagal (Error dari API, misal validasi backend)
        toast.current?.show({
          severity: "error",
          summary: "Gagal",
          detail: data.message || "Pengajuan gagal.",
        });
        // Kembalikan state history (hapus data optimis dari tabel)
        setHistory((prevHistory) =>
          prevHistory.filter((item) => item.id !== tempId)
        );
        // Kembalikan data form agar user bisa edit
        setJenisCuti(currentJenisCuti);
        setTanggal(currentTanggal);
        setAlasan(currentAlasan);
      }
    } catch (err: any) {
      // 6c. Gagal (Network error, server mati, dll)
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message,
      });
      // Kembalikan state history (hapus data optimis dari tabel)
      setHistory((prevHistory) =>
        prevHistory.filter((item) => item.id !== tempId)
      );
      // Kembalikan data form agar user bisa edit
      setJenisCuti(currentJenisCuti);
      setTanggal(currentTanggal);
      setAlasan(currentAlasan);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusBodyTemplate = (req: LeaveRequest) => {
    const severity: any = {
      Approved: "success",
      Pending: "warning",
      Rejected: "danger",
    };
    return (
      <Tag
        value={req.status}
        severity={severity[req.status]}
      />
    );
  };

  // Ini adalah fungsi header yang telah diperbaiki
  const renderHistoryHeader = () => (
    <div>
      {/* Tombol Toggle Filter (Hanya Mobile) */}
      <Button
        label="Filter"
        icon="pi pi-filter"
        className="p-button-sm p-button-outlined mb-3 md:hidden"
        onClick={() => setIsFilterVisible(!isFilterVisible)}
      />

      {/* Kontainer Filter (Responsive) */}
      <div
        className={`
          flex-column md:flex-row md:align-items-center gap-3
          ${isFilterVisible ? "flex" : "hidden"} 
          md:flex
        `}
      >
        {/* Filter Jenis Cuti */}
        <span className="p-input-icon-left w-full md:w-auto">
          <i className="pi pi-filter" />
          <Dropdown
            value={filterJenisCuti}
            options={leaveTypes}
            optionLabel="name"
            onChange={(e) => setFilterJenisCuti(e.value)}
            placeholder="Filter Jenis Cuti"
            className="p-inputtext-sm w-full"
            showClear
          />
        </span>

        {/* Filter Tanggal Mulai */}
        <Calendar
          value={filterTanggalMulai}
          onChange={(e) => setFilterTanggalMulai(e.value as any)}
          placeholder="Filter Tgl Mulai"
          className="p-inputtext-sm w-full md:w-auto"
          showIcon
        />

        {/* Filter Tanggal Selesai */}
        <Calendar
          value={filterTanggalSelesai}
          onChange={(e) => setFilterTanggalSelesai(e.value as any)}
          placeholder="Filter Tgl Selesai"
          className="p-inputtext-sm w-full md:w-auto"
          showIcon
        />

        {/* Filter Global (Search) - Pindah ke paling kanan di desktop */}
        <span className="p-input-icon-left w-full md:w-auto md:ml-auto">
          <i className="pi pi-search" />
          <InputText
            type="search"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Cari..."
            className="p-inputtext-sm w-full"
          />
        </span>
      </div>
    </div>
  );

  return (
    <div className="grid px-0 md:px-4 py-4" style={{ animation: "fadeIn 0.5s ease" }}>
      <Toast ref={toast} />

      {/* FORM */}
      <div className={`col-12 md:col-8 ${fadeInUp}`}>
        <Card
          title="Formulir Pengajuan Cuti"
          className="shadow-3 border-round-xl h-full"
        >
          {isLoadingData ? (
            <Skeleton height="12rem" />
          ) : (
            <div className="p-fluid grid">
              <div className="field col-12 md:col-6">
                <label htmlFor="jenisCuti">Jenis Cuti</label>
                <Dropdown
                  id="jenisCuti"
                  value={jenisCuti}
                  options={leaveTypes}
                  optionLabel="name"
                  onChange={(e) => setJenisCuti(e.value)}
                  placeholder="Pilih Jenis Cuti"
                />
              </div>

              <div className="field col-12 md:col-6">
                <label htmlFor="tanggal">Tanggal Cuti</label>
                <Calendar
                  id="tanggal"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.value as any)}
                  selectionMode="range"
                  readOnlyInput
                  showIcon
                />
              </div>

              <div className="field col-12">
                <label htmlFor="alasan">Alasan</label>
                <InputTextarea
                  id="alasan"
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  rows={4}
                  autoResize
                />
              </div>

              <div className="col-12">
                <Button
                  label="Kirim Pengajuan"
                  icon="pi pi-send"
                  loading={isSubmitting}
                  className="p-button-rounded"
                  onClick={handleSubmitCuti}
                />
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* CHART */}
      <div className={`col-1v2 md:col-4 ${zoomIn}`}>
        <Card
          title="Ringkasan Cuti Anda"
          className="shadow-3 border-round-xl h-full"
        >
          {isLoadingData ? (
            <Skeleton height="300px" />
          ) : (
            <div
              className="relative flex justify-content-center align-items-center"
              style={{ height: "350px" }}
            >
              {/* --- INI ADALAH DIV YANG TELAH DIPERBAIKI --- */}
              <div
                className="absolute flex flex-column align-items-center justify-content-center"
                style={{
                  top: "40%", // DIUBAH LAGI: Dinaikkan dari 45% ke 40%
                  left: "50%",
                  transform: "translate(-50%, -50%)", 
                  zIndex: 9,
                  pointerEvents: "none",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <span className="text-xl">Sisa Cuti</span>
                <span className="text-lg" style={{ marginTop: "-5px" }}>
                  Tahunan
                </span>

                <h1
                  className="m-0"
                  style={{
                    fontSize: "3.5rem",
                    color: "#6366F1",
                    margin: "0.25rem 0", 
                  }}
                >
                  {sisaCuti}
                </h1>
                <span className="text-lg">Hari</span>
              </div>
              {/* --- BATAS AKHIR DIV YANG DIPERBAIKI --- */}

              <Chart
                type="doughnut"
                data={chartData}
                options={chartOptions}
                style={{ height: "350px" }}
              />
            </div>
          )}
        </Card>
      </div>

      {/* HISTORY TABLE */}
      <div className={`col-12 mt-4 ${fadeIn}`}>
        <Card
          title="Riwayat Pengajuan Cuti"
          className="shadow-3 border-round-xl"
        >
          {isLoadingData ? (
            <Skeleton height="200px" />
          ) : (
            <DataTable
              value={filteredHistory}
              header={renderHistoryHeader()}
              globalFilter={globalFilter}
              globalFilterFields={["jenisCuti", "alasan", "status"]}
              paginator
              rows={5}
              className="p-datatable-striped"
              responsiveLayout="stack"
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