// /app/karyawan/pengajuan/status/page.tsx

"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton"; // Untuk filter "Pending", "Approved"

// --- Tipe Data Bohongan (Mock) ---
interface AllRequest {
  id: string;
  jenis: string;
  tanggal: string; // Tanggal utama untuk sort
  detail: string; // Misal: "01 Nov - 02 Nov" atau "17:00 - 19:00"
  status: "Approved" | "Pending" | "Rejected";
}

// --- Data Bohongan (Mock) ---
// Ini adalah gabungan dari Cuti dan Lembur
const mockAllRequests: AllRequest[] = [
  {
    id: "C-003",
    jenis: "Cuti Tahunan",
    tanggal: "2025-11-01",
    detail: "01 Nov - 02 Nov",
    status: "Pending",
  },
  {
    id: "L-002",
    jenis: "Lembur",
    tanggal: "2025-10-29",
    detail: "17:00 - 18:00",
    status: "Pending",
  },
  {
    id: "C-001",
    jenis: "Cuti Tahunan",
    tanggal: "2025-10-25",
    detail: "25 Okt - 25 Okt",
    status: "Approved",
  },
  {
    id: "L-001",
    jenis: "Lembur",
    tanggal: "2025-10-25",
    detail: "17:00 - 19:00",
    status: "Approved",
  },
  {
    id: "C-002",
    jenis: "Sakit",
    tanggal: "2025-10-15",
    detail: "15 Okt - 16 Okt",
    status: "Rejected",
  },
];

// Opsi untuk tombol filter status
const statusFilterOptions = [
  { name: "Tertunda", value: "Pending" },
  { name: "Disetujui", value: "Approved" },
  { name: "Semua", value: "All" },
];

export default function StatusPengajuanPage() {
  // --- State ---
  const [allRequests] = useState(mockAllRequests);
  const [filteredRequests, setFilteredRequests] = useState<AllRequest[]>([]);

  // State untuk filter
  // Default ke 'Pending' (IMK Baik: Tunjukkan apa yang butuh perhatian)
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [globalFilter, setGlobalFilter] = useState("");

  // State untuk search bar modern
  const [isSearchVisible, setIsSearchVisible] = useState(false);
	const searchInputRef = useRef<HTMLInputElement>(null);

  // --- Logika Filtering ---
  useEffect(() => {
    let filtered = [...allRequests];

    // 1. Filter berdasarkan Status (Pending, Approved, All)
    if (statusFilter !== "All") {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }

    // 2. Filter berdasarkan Teks Pencarian
    if (globalFilter) {
      const lowerCaseFilter = globalFilter.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.jenis.toLowerCase().includes(lowerCaseFilter) ||
          req.detail.toLowerCase().includes(lowerCaseFilter) ||
          req.status.toLowerCase().includes(lowerCaseFilter)
      );
    }

    setFilteredRequests(filtered);
  }, [allRequests, statusFilter, globalFilter]); // Jalankan ulang jika filter berubah

  // Efek untuk auto-focus ke search bar
  useEffect(() => {
    if (isSearchVisible) {
      searchInputRef.current?.focus();
    }
  }, [isSearchVisible]);

  // --- Helper & Render ---

  // Helper untuk styling status di tabel
  const statusBodyTemplate = (req: AllRequest) => {
    const severityMap: { [key: string]: "success" | "warning" | "danger" } = {
      Approved: "success",
      Pending: "warning",
      Rejected: "danger",
    };
    return <Tag value={req.status} severity={severityMap[req.status]} />;
  };

  // Render Header Tabel (Filter + Search Modern)
  const renderHeader = () => {
    return (
      <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
        {/* Kiri: Filter Status (Pending, Approved, All) */}
        <SelectButton
          value={statusFilter}
          options={statusFilterOptions}
          onChange={(e) => setStatusFilter(e.value)}
          optionLabel="name"
          allowEmpty={false}
        />

        {/* Kanan: Search Bar */}
        <div className="flex justify-content-end">
          {isSearchVisible ? (
            <span className="p-input-icon-left w-full md:w-auto">
              <i className="pi pi-search" />
              <InputText
                ref={searchInputRef}
                type="search"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Cari..."
                className="w-full md:w-auto"
                onBlur={() => {
                  if (!globalFilter) setIsSearchVisible(false);
                }}
              />
            </span>
          ) : (
            <Button
              icon="pi pi-search"
              className="p-button-text p-button-rounded"
              onClick={() => setIsSearchVisible(true)}
            />
          )}
        </div>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div className="grid">
      <div className="col-12">
        <Card className="shadow-1" title="Status Semua Pengajuan">
          <DataTable
            value={filteredRequests}
            header={header}
            responsiveLayout="scroll"
            paginator
            rows={10}
            emptyMessage="Tidak ada pengajuan yang ditemukan."
            sortField="tanggal" // Sortir berdasarkan tanggal
            sortOrder={-1} // Tampilkan yang terbaru dulu
          >
            <Column field="jenis" header="Jenis Pengajuan" sortable />
            <Column field="tanggal" header="Tanggal" sortable />
            <Column field="detail" header="Detail" />
            <Column
              header="Status"
              body={statusBodyTemplate}
              sortable
              field="status"
            />
          </DataTable>
        </Card>
      </div>
    </div>
  );
}
