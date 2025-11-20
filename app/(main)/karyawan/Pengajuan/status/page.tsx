"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton";

// ===========================
// TIPE DATA TABEL
// ===========================
interface AllRequest {
  id: number;
  jenis: string;
  mulai: string;
  selesai: string;
  alasan: string;
  status: "Approved" | "Pending" | "Rejected";
}

// ===========================
// OPSI FILTER STATUS
// ===========================
const statusFilterOptions = [
  { name: "Tertunda", value: "Pending" },
  { name: "Disetujui", value: "Approved" },
  { name: "Semua", value: "All" },
];

// Format tanggal: 2025-11-19 → 19 Nov
const formatDate = (dateString: string) => {
  return dateString.split("T")[0];
};


export default function Page() {
  const [allRequests, setAllRequests] = useState<AllRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<AllRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [globalFilter, setGlobalFilter] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ===========================
  // FETCH DATA DARI BACKEND
  // ===========================
  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch("/api/karyawan/leave-request/current-employee");
        const data = await res.json();

        if (!data.leave_requests) return;

        const mapped: AllRequest[] = data.leave_requests.map((req: any) => ({
          id: req.id,
          jenis: req.type_name,
          mulai: formatDate(req.start_date),
          selesai: formatDate(req.end_date),
          alasan: req.reason,
          status: req.status,
        }));

        setAllRequests(mapped);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    }

    fetchRequests();
  }, []);

  // ===========================
  // FILTERING
  // ===========================
  useEffect(() => {
    let filtered = [...allRequests];

    if (statusFilter !== "All") {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }

    if (globalFilter) {
      const q = globalFilter.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.jenis.toLowerCase().includes(q) ||
          req.alasan.toLowerCase().includes(q) ||
          req.status.toLowerCase().includes(q)
      );
    }

    setFilteredRequests(filtered);
  }, [allRequests, statusFilter, globalFilter]);

  // ===========================
  // BADGE STATUS
  // ===========================
  const statusBodyTemplate = (req: AllRequest) => {
    const severityMap: any = {
      Approved: "success",
      Pending: "warning",
      Rejected: "danger",
    };
    return <Tag value={req.status} severity={severityMap[req.status]} />;
  };

  // ===========================
  // HEADER TABLE
  // ===========================
  const renderHeader = () => (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
      <SelectButton
        value={statusFilter}
        options={statusFilterOptions}
        onChange={(e) => setStatusFilter(e.value)}
        optionLabel="name"
        allowEmpty={false}
      />

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

  // ===========================
  // RENDER PAGE
  // ===========================
  return (
    <div className="grid">
      <div className="col-12">
        <Card className="shadow-1" title="Status Semua Pengajuan">
          <DataTable
            value={filteredRequests}
            header={renderHeader()}
            responsiveLayout="scroll"
            paginator
            rows={10}
            emptyMessage="Tidak ada pengajuan yang ditemukan."
            sortField="mulai"
            sortOrder={-1}
          >
            <Column field="jenis" header="Jenis Pengajuan" sortable />
            <Column field="mulai" header="Mulai" sortable />
            <Column field="selesai" header="Selesai" sortable />
            <Column field="alasan" header="Alasan" />
            <Column
              field="status"
              header="Status"
              body={statusBodyTemplate}
              sortable
            />
          </DataTable>
        </Card>
      </div>
    </div>
  );
}
