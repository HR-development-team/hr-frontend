/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { FormEvent } from "react";

interface DateRangeFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (e: any) => void;
  onEndDateChange: (e: any) => void;
  onApply: () => void;
  onClear: () => void;
}

export default function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
  onClear,
}: DateRangeFilterProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onApply();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap align-items-end gap-3"
    >
      <div className="flex flex-row gap-2">
        <div className="flex flex-column gap-2">
          <label htmlFor="startDate">Dari</label>
          <Calendar
            id="startDate"
            value={startDate}
            onChange={onStartDateChange}
            placeholder="Mulai"
            showIcon
            className="w-10rem"
          />
        </div>

        <div className="flex flex-column gap-2">
          <label htmlFor="endDate">Sampai</label>
          <Calendar
            id="endDate"
            value={endDate}
            onChange={onEndDateChange}
            placeholder="Selesai"
            showIcon
            className="w-10rem"
          />
        </div>
      </div>

      <div className="flex flex-column gap-2">
        <div className="flex align-items-center gap-2">
          <Button
            icon="pi pi-check"
            type="submit"
            severity="info"
            tooltip="Terapkan Filter"
          />
          <Button
            icon="pi pi-times"
            type="button"
            severity="secondary"
            onClick={onClear}
            tooltip="Hapus Filter"
          />
        </div>
      </div>
    </form>
  );
}
