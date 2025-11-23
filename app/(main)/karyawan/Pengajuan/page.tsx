"use client";

import React, { useState, useEffect, useRef } from "react";

import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton";

// --- Tipe Data untuk Tabel ---
interface AllRequest {
  id: string;
  jenis: string;
  tanggal: string;
  detail: string;
  status: "Approved" | "Pending" | "Rejected";
}

// --- Opsi Filter ---
const statusFilterOptions = [
  { name: "Tertunda", value: "Pending" },
  { name: "Disetujui", value: "Approved" },
  { name: "Semua", value: "All" },
];

// Format rentang tanggal (19 Nov - 20 Nov)
function formatRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);

  return `${s.toLocaleDateString("id-ID", { day:"2-digit", month:"short" })} -
          ${e.toLocaleDateString("id-ID", { day:"2-digit", month:"short" })}`;
}

export default function StatusPengajuanPage() {
  const [allRequests, setAllRequests] = useState<AllRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<AllRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("Pending");
  const [globalFilter, setGlobalFilter] = useState("");

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // ===============================
  // 🔥 Fetch API Real
  // ===============================
  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch("/api/karyaan/leave-request/current-employee");
        const data = await res.json();

        const mapped: AllRequest[] = data.leave_requests?.map((item: any) => ({
          id: item.request_code,
          jenis: item.type_name,
          tanggal: item.start_date.slice(0, 10), // YYYY-MM-DD
          detail: formatRange(item.start_date, item.end_date),
          status: item.status,
        }));

        setAllRequests(mapped ?? []);
      } catch (err) {
        console.error("Gagal fetch data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, []);

  // ===============================
  // 🔥 Filtering Logic
  // ===============================
  useEffect(() => {
    let filtered = [...allRequests];

    if (statusFilter !== "All") {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }

    if (globalFilter) {
      const t = globalFilter.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.jenis.toLowerCase().includes(t) ||
          req.detail.toLowerCase().includes(t) ||
          req.status.toLowerCase().includes(t)
      );
    }

    setFilteredRequests(filtered);
  }, [allRequests, statusFilter, globalFilter]);

  useEffect(() => {
    if (isSearchVisible) searchRef.current?.focus();
  }, [isSearchVisible]);

  const statusBody = (req: AllRequest) => {
    const severity: any = {
      Approved: "success",
      Pending: "warning",
      Rejected: "danger",
    };
    return <Tag value={req.status} severity={severity[req.status]} />;
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
      <SelectButton
        value={statusFilter}
        options={statusFilterOptions}
        onChange={(e) => setStatusFilter(e.value)}
        optionLabel="name"
        allowEmpty={false}
      />

      <div>
        {isSearchVisible ? (
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              ref={searchRef}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Cari..."
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

  return (
    <div className="grid">
      <div className="col-12">
        <Card className="shadow-1" title="Status Semua Pengajuan">
          <DataTable
            value={filteredRequests}
            loading={loading}
            header={header}
            responsiveLayout="scroll"
            paginator
            sortField="tanggal"
            sortOrder={-1}
            rows={10}
            emptyMessage="Belum ada data pengajuan."
          >
            <Column field="jenis" header="Jenis Pengajuan" sortable />
            <Column field="tanggal" header="Tanggal" sortable />
            <Column field="detail" header="Rentang" />
            <Column field="status" header="Status" body={statusBody} sortable />
          </DataTable>
        </Card>
      </div>
    </div>
  );
}
