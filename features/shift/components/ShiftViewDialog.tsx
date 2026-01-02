"use client";

import {
  Clock,
  History,
  Hourglass,
  LogIn,
  LogOut,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { formatDateIDN } from "@/utils/dateFormat";
import { ShiftDetail } from "../schemas/shiftSchema";
import ShiftViewDialogSkeleton from "./ShiftViewDialogSkeleton";
import { Tooltip } from "primereact/tooltip";

interface ShiftViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shift: ShiftDetail | null;
  isLoading: boolean;
}

export default function ShiftViewDialog({
  isOpen,
  onClose,
  shift,
  isLoading,
}: ShiftViewDialogProps) {
  // --- 1. NEW: Dynamic Duration Calculator ---
  const calculateDuration = () => {
    if (!shift?.start_time || !shift?.end_time) return "-";

    const [startH, startM] = shift.start_time.split(":").map(Number);
    const [endH, endM] = shift.end_time.split(":").map(Number);

    // Convert everything to minutes from midnight
    const startTotalMins = startH * 60 + startM;
    const endTotalMins = endH * 60 + endM;

    let diffMins = endTotalMins - startTotalMins;

    // If overnight or end time is smaller than start time (wrapping midnight), add 24 hours
    if (shift.is_overnight === 1 || diffMins < 0) {
      diffMins += 24 * 60;
    }

    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;

    if (minutes > 0) {
      return `${hours} Jam ${minutes} Menit`;
    }
    return `${hours} Jam Kerja`;
  };

  // Helper to render the weekly schedule strip (Fixed version with modulo)
  const renderWeekStrip = (activeDays: number[]) => {
    const days = [
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
      "Minggu",
    ];
    const shortDays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

    return (
      <div className="flex justify-content-between align-items-center bg-gray-50 p-3 border-round-xl border-1 border-gray-200">
        {days.map((dayName, index) => {
          // Map index (0-6) to Backend ID (0=Sun, 1=Mon... 6=Sat)
          // Mon(0) -> 1, Tue(1) -> 2, ..., Sat(5) -> 6, Sun(6) -> 0
          const dayId = (index + 1) % 7;
          const isActive = activeDays?.includes(dayId);

          return (
            <div
              key={dayName}
              className="flex flex-column align-items-center gap-2"
            >
              <div
                className={`w-2rem h-2rem flex align-items-center justify-content-center border-circle text-xs font-bold transition-all transition-duration-300 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-2 scale-110"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {shortDays[index].charAt(0)}
              </div>
              <span
                className={`text-[10px] font-medium hidden sm:block ${
                  isActive ? "text-indigo-700" : "text-gray-400"
                }`}
              >
                {shortDays[index]}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Dialog
      header="Detail Shift Kerja"
      visible={isOpen}
      onHide={onClose}
      modal
      className="w-full md:w-6 lg:w-5"
      contentClassName="p-0"
      headerClassName="border-bottom-1 border-gray-100 pb-2"
      footer={
        <div className="flex justify-content-end pt-2 border-top-1 border-gray-100">
          <Button
            className="flex gap-1"
            label="Tutup"
            icon="pi pi-times"
            text
            severity="secondary"
            onClick={onClose}
          />
        </div>
      }
    >
      {isLoading ? (
        <ShiftViewDialogSkeleton />
      ) : shift ? (
        <div className="flex flex-column">
          {/* --- Header Section --- */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-50 p-5">
            <div className="absolute -right-2 -top-2 text-indigo-100 opacity-50 rotate-12">
              <Clock size={120} />
            </div>

            <div className="relative z-1 flex flex-column gap-3">
              <div className="flex justify-content-between align-items-start">
                <div className="flex align-items-center gap-3">
                  <div className="w-4rem h-4rem bg-white border-round-xl shadow-1 flex align-items-center justify-content-center text-indigo-600">
                    <History size={32} />
                  </div>
                  <div>
                    <div className="flex align-items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 border-round uppercase">
                        SHIFT REGULER
                      </span>
                      {shift.is_overnight === 1 && (
                        <Tag
                          value="Lintas Hari"
                          severity="warning"
                          icon="pi pi-moon"
                          className="text-xs gap-1"
                          rounded
                        />
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 m-0">
                      {shift.name}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="inline-flex align-items-center gap-2 bg-white bg-opacity-60 px-3 py-2 border-round-lg border-1 border-white shadow-sm w-max backdrop-blur-sm">
                <MapPin size={16} className="text-indigo-500" />
                <span className="text-sm font-medium text-gray-700">
                  {shift.office_name || "Semua Kantor"}
                </span>
                {shift.office_code && (
                  <span className="text-xs text-gray-400 font-mono border-left-1 border-gray-300 pl-2 ml-1">
                    {shift.office_code}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 flex flex-column gap-5">
            {/* --- 2. Time Card (Calculated Duration) --- */}
            <div className="bg-white border-1 border-gray-200 border-round-xl shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-3 py-2 border-bottom-1 border-gray-200 flex align-items-center gap-2">
                <Clock size={14} className="text-gray-500" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Jam Operasional
                </span>
              </div>

              <div className="p-4 flex align-items-center justify-content-between">
                {/* Start Time */}
                <div className="flex flex-column gap-1">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Masuk
                  </span>
                  <span className="text-3xl font-bold text-gray-800 font-mono tracking-tight">
                    {shift.start_time?.substring(0, 5)}
                  </span>
                </div>

                {/* VISUAL CONNECTOR: Minimalist Route */}
                <div className="flex-1 flex flex-column align-items-center px-4 relative mt-2">
                  <div className="flex align-items-center w-full">
                    <div className="w-2rem h-2rem flex-shrink-0 border-circle bg-gray-100 flex align-items-center justify-content-center">
                      <div className="w-2 h-2 bg-gray-400 border-circle"></div>
                    </div>
                    <div className="flex-1 h-1 bg-gray-100 relative">
                      <div
                        className="absolute left-0 top-0 bottom-0 w-full bg-gray-200"
                        style={{ height: "2px", top: "50%", marginTop: "-1px" }}
                      ></div>
                    </div>
                    <div className="w-2rem h-2rem flex-shrink-0 border-circle bg-gray-100 flex align-items-center justify-content-center">
                      <div className="w-2 h-2 bg-indigo-500 border-circle"></div>
                    </div>
                  </div>

                  {/* UPDATED: Dynamic Duration Badge */}
                  {shift.is_overnight === 1 ? (
                    // If overnight, show +1 Day AND duration
                    <div className="absolute -bottom-5 flex flex-column align-items-center gap-1">
                      <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 border-round-xl">
                        +1 HARI
                      </span>
                      <span className="text-[10px] font-medium text-gray-400">
                        ({calculateDuration()})
                      </span>
                    </div>
                  ) : (
                    // Normal day, show duration only
                    <span className="absolute -bottom-4 text-[10px] font-medium text-gray-500 bg-white px-2 border-1 border-gray-100 border-round-lg shadow-sm">
                      {calculateDuration()}
                    </span>
                  )}
                </div>

                {/* End Time */}
                <div className="flex flex-column align-items-end gap-1">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Pulang
                  </span>
                  <span className="text-3xl font-bold text-gray-800 font-mono tracking-tight">
                    {shift.end_time?.substring(0, 5)}
                  </span>
                </div>
              </div>
            </div>

            {/* --- 3. Work Days --- */}
            <div>
              <div className="flex align-items-center gap-2 mb-2">
                <ShieldCheck size={16} className="text-gray-700" />
                <h3 className="text-sm font-bold text-gray-800 m-0 uppercase">
                  Jadwal Efektif
                </h3>
              </div>
              {renderWeekStrip(shift.work_days || [])}
            </div>

            {/* --- 4. Rules Grid --- */}
            <div>
              {/* Tooltip Component: Shared instance for performance */}
              <Tooltip
                target=".rule-card-tooltip"
                position="top"
                mouseTrack
                style={{ width: "300px" }}
                mouseTrackLeft={10}
              />

              <div className="flex align-items-center gap-2 mb-3">
                <ShieldCheck size={16} className="text-gray-700" />
                <h3 className="text-sm font-bold text-gray-800 m-0 uppercase">
                  Konfigurasi Aturan
                </h3>
              </div>
              <div className="grid">
                {/* 1. Tolerance Card */}
                <div className="col-12 md:col-4">
                  <div
                    className="rule-card-tooltip h-full p-3 bg-red-50 border-1 border-red-100 border-round-xl flex flex-column gap-2 cursor-pointer transition-duration-200 hover:shadow-2"
                    data-pr-tooltip="Durasi keterlambatan yang masih dianggap 'Tepat Waktu'. Pegawai tidak akan dipotong gaji jika telat kurang dari menit ini."
                  >
                    <span className="text-xs font-bold text-red-600 uppercase">
                      Toleransi
                    </span>
                    <div className="mt-1">
                      <span className="text-2xl font-bold text-red-900">
                        {shift.late_tolerance_minutes}
                      </span>
                      <span className="text-xs text-red-600 ml-1">menit</span>
                    </div>
                  </div>
                </div>

                {/* 2. Check In Limit Card */}
                <div className="col-6 md:col-4">
                  <div
                    className="rule-card-tooltip h-full p-3 bg-white border-1 border-gray-200 border-round-xl flex flex-column gap-2 cursor-pointer transition-duration-200 hover:shadow-2"
                    data-pr-tooltip="Waktu akses absen dibuka SEBELUM jam masuk. Contoh: Jika 60 menit, pegawai bisa absen mulai 1 jam sebelum jadwal."
                  >
                    <div className="flex align-items-center justify-content-between text-gray-500">
                      <span className="text-xs font-bold uppercase">
                        Buka Absen
                      </span>
                      <LogIn size={14} />
                    </div>
                    <div className="mt-1">
                      <span className="text-xl font-bold text-gray-800">
                        {shift.check_in_limit_minutes}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">mnt</span>
                    </div>
                  </div>
                </div>

                {/* 3. Check Out Limit Card */}
                <div className="col-6 md:col-4">
                  <div
                    className="rule-card-tooltip h-full p-3 bg-white border-1 border-gray-200 border-round-xl flex flex-column gap-2 cursor-pointer transition-duration-200 hover:shadow-2"
                    data-pr-tooltip="Batas waktu akses absen ditutup SETELAH jam pulang. Pegawai tidak bisa absen pulang jika melewati batas ini."
                  >
                    <div className="flex align-items-center justify-content-between text-gray-500">
                      <span className="text-xs font-bold uppercase">
                        Tutup Absen
                      </span>
                      <LogOut size={14} />
                    </div>
                    <div className="mt-1">
                      <span className="text-xl font-bold text-gray-800">
                        {shift.check_out_limit_minutes}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">mnt</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-column sm:flex-row justify-content-between gap-2 pt-4 mt-2 border-top-1 border-gray-100 text-xs text-gray-500">
              <div className="flex align-items-center gap-2">
                <Hourglass size={14} />
                <span>
                  Dibuat:{" "}
                  <span className="font-medium text-gray-700">
                    {formatDateIDN(shift.created_at)}
                  </span>
                </span>
              </div>
              <div className="flex align-items-center gap-2">
                <History size={14} />
                <span>
                  Update:{" "}
                  <span className="font-medium text-gray-700">
                    {formatDateIDN(shift.updated_at)}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 text-gray-500">
          Data shift tidak ditemukan.
        </div>
      )}
    </Dialog>
  );
}
