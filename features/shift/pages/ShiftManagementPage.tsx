"use client";

import DateRangeFilter from "@components/DateRangeFilter";
import TableToolbar from "@components/TableToolbar";
import { ClockFading } from "lucide-react";
import { Card } from "primereact/card";
import { usePageShift } from "../hooks/usePageShift";

export default function ShiftManagementPage() {
  const { filter } = usePageShift();

  return (
    <div>
      {/* Title Section */}
      <div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <ClockFading className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Manajemen Role
          </h1>
          <p className="text-sm md:text-md text-gray-500">
            Kelola data dan informasi Role
          </p>
        </div>
      </div>

      <Card>
        <div className="flex flex-column gap-4">
          {/* Section Header */}
          <div className="flex gap-2 align-items-center">
            <ClockFading className="h-2" />
            <h2 className="text-base text-800">Master Data Shift Kerja</h2>
          </div>

          {/* Filters & Toolbar */}
          <TableToolbar
            searchValue={filter.search}
            onSearchChange={(e) => filter.setSearch(e.target.value)}
            searchPlaceholder="Cari berdasarkan ID atau nama"
            //   onAdd={dialog.openAdd}
            addLabel="Tambah Role"
          />
        </div>
      </Card>
    </div>
  );
}
