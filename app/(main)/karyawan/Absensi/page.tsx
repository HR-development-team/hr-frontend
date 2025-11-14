"use client"; // WAJIB: Menandakan ini adalah Client Component untuk Next.js

import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Timeline } from "primereact/timeline";
import { Toast } from "primereact/toast";
import { TabView, TabPanel } from "primereact/tabview";
import { DataView } from "primereact/dataview";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// --- BAGIAN 1: TIPE DATA & ENDPOINT API ---

// Tipe data berdasarkan JSON Anda
interface Session {
  id: string | number;
  session_code: string;
  open_time?: string;
  close_time?: string;
  date?: string;
  status?: string;
}

interface HistoryItem {
  status: string;
  time: string;
}

// Status hari ini (berasal dari data riwayat)
interface AttendanceStatus {
  id: string | number | null; // ID absensi (bukan employee)
  checkInTime: string | null;
  checkOutTime: string | null;
  history: HistoryItem[];
}

type AttendanceStatusType = "Hadir" | "Terlambat" | "Absen";

// Riwayat (dari JSON #5)
interface DailyHistoryItem {
  id: string | number;
  date: string; // Ini adalah string tanggal yang akan kita format
  checkIn: string | null; // Ini adalah string jam
  checkOut: string | null; // Ini adalah string jam
  status: AttendanceStatusType;
  // Kita juga butuh data mentah untuk filter
  raw_date: string; // cth: "2025-11-14T07:05:31.000Z" (akan kita ambil dari check_in_time)
  raw_check_in_time: string | null;
  raw_check_out_time: string | null;
}

// API URLS (Hanya 4 endpoint)
const API_URLS = {
  getActiveSession: "/api/karyawan/attendance-sessions",
  getHistory: "/api/karyawan/attendances/history", // HANYA INI SUMBER DATA ABSENSI
  checkIn: "/api/karyawan/attendances/check-in",
  checkOut: "/api/karyawan/attendances/check-out",
};

// Helper untuk format tanggal (Memperbaiki RangeError)
const safeFormat = (
  dateString: string | null | undefined,
  formatStr: string
): string | null => {
  if (!dateString) {
    return null;
  }
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn(
        `[DEBUG] safeFormat: Nilai tanggal tidak valid: ${dateString}`
      );
      return null;
    }
    return format(date, formatStr, { locale: id });
  } catch (e) {
    console.error(
      `[DEBUG] safeFormat: Error memformat tanggal: ${dateString}`,
      e
    );
    return null;
  }
};

// Helper untuk cek tanggal
const isSameDay = (date1: Date, date2: Date) => {
  // PENTING: Cek jika date2 valid
  if (isNaN(date2.getTime())) {
    return false;
  }
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Helper untuk mencari sesi aktif (dari JSON Array baru Anda)
const findActiveSession = (sessions: Session[]): Session | null => {
  const now = new Date();
  console.log(`[DEBUG] Waktu 'now' (Lokal): ${now.toString()}`);

  for (const session of sessions) {
    console.log(`[DEBUG] Mengecek Sesi ID: ${session.id}`, session);
    if (
      !session.open_time ||
      !session.close_time ||
      !session.date ||
      !session.status
    ) {
      console.log(
        "   - Gagal: Field 'date', 'status', 'open_time', or 'close_time' hilang."
      );
      continue;
    }
    const sessionDate = new Date(session.date);
    const isToday = isSameDay(now, sessionDate);
    console.log(
      `   - Cek Tanggal: ${isToday} (Pencocokan: ${now.toDateString()} vs ${sessionDate.toDateString()})`
    );
    if (!isToday) {
      continue;
    }
    const isOpen = session.status === "open";
    console.log(`   - Cek Status: ${isOpen} (API: ${session.status})`);
    if (!isOpen) {
      continue;
    }
    try {
      const [startH, startM, startS] = session.open_time.split(":").map(Number);
      const [endH, endM, endS] = session.close_time.split(":").map(Number);
      const startTime = new Date();
      startTime.setHours(startH, startM, startS, 0);
      const endTime = new Date();
      endTime.setHours(endH, endM, endS, 0);
      const timeCheck = now >= startTime && now <= endTime;
      console.log(
        `   - Cek Jam: ${timeCheck} (Pencocokan: ${format(now, "HH:mm:ss")} vs ${session.open_time}-${session.close_time})`
      );
      if (timeCheck) {
        console.log("   - BERHASIL: Sesi ini aktif!");
        return session;
      }
    } catch (e) {
      console.error("   - Gagal: Error parsing session time:", session, e);
    }
  }
  console.log("[DEBUG] Tidak ada sesi aktif ditemukan.");
  return null;
};

// --- BAGIAN 2: KOMPONEN REACT (TSX) ---

export default function AttendancePage() {
  // State untuk jam (Memperbaiki Hydration Error)
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({
    id: null,
    checkInTime: null,
    checkOutTime: null,
    history: [],
  });
  const [history, setHistory] = useState<DailyHistoryItem[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const toast = useRef<Toast>(null);

  // Efek untuk jam
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Efek untuk memuat data awal
  useEffect(() => {
    fetchInitialData();
  }, []);

  const showErrorToast = (message: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: message,
    });
  };

  // --- [PERBAIKAN UTAMA] Logika fetchInitialData yang Jauh Lebih Sederhana ---
  const fetchInitialData = async () => {
    setIsLoading(true);
    console.log("[DEBUG] Memulai fetchInitialData...");
    try {
      // Panggil HANYA 2 endpoint API
      const [resSession, resHistory] = await Promise.all([
        fetch(API_URLS.getActiveSession),
        fetch(API_URLS.getHistory),
      ]);

      console.log("[DEBUG] Selesai fetch 2 API");

      if (!resSession.ok || !resHistory.ok) {
        console.error("Salah satu API gagal:", { resSession, resHistory });
        throw new Error("Gagal mengambil data dari server");
      }

      // Parse semua JSON
      const dataSession = await resSession.json();
      const dataHistory = await resHistory.json();

      console.log("[DEBUG] dataSession (JSON Sesi):", dataSession);
      console.log("[DEBUG] dataHistory (JSON Riwayat):", dataHistory);

      // 1. Proses Sesi Aktif
      // (Menggunakan JSON Array baru Anda)
      if (
        dataSession.status === "00" &&
        Array.isArray(dataSession.attendance_sessions)
      ) {
        const active = findActiveSession(dataSession.attendance_sessions);
        setActiveSession(active);
      } else {
        console.log("[DEBUG] Tidak ada data sesi (bukan array) dari API.");
        setActiveSession(null);
      }

      // 2. Proses Riwayat (JSON #5)
      let mappedHistory: DailyHistoryItem[] = [];
      if (
        dataHistory.status === "00" &&
        Array.isArray(dataHistory.attendances)
      ) {
        mappedHistory = dataHistory.attendances.map(
          (item: any): DailyHistoryItem => {
            let status: AttendanceStatusType = "Absen";
            if (item.check_in_status === "in-time") status = "Hadir";
            else if (item.check_in_status === "late") status = "Terlambat";

            // [FIX BUG "Tanggal Tidak Valid"]
            // Ambil tanggal dari check_in_time (karena item.date tidak ada)
            const dateToUse = item.check_in_time || item.created_at;

            return {
              id: item.id,
              date:
                safeFormat(dateToUse, "EEEE, dd MMMM yyyy") ||
                "Tanggal Tidak Valid",
              checkIn: safeFormat(item.check_in_time, "HH:mm:ss"),
              checkOut: safeFormat(item.check_out_time, "HH:mm:ss"),
              status: status,
              // Simpan data mentah untuk filter
              raw_date: dateToUse, // <-- [FIX] Gunakan tanggal yang valid
              raw_check_in_time: item.check_in_time,
              raw_check_out_time: item.check_out_time,
            };
          }
        );
        setHistory(mappedHistory);
        console.log("[DEBUG] Riwayat absensi DITEMUKAN:", mappedHistory);
      } else {
        console.log("[DEBUG] Tidak ada riwayat absensi dari API.");
      }

      // 3. Proses Status Hari Ini (Berdasarkan data Riwayat)
      const now = new Date();
      // [FIX BUG UI] Cari di 'mappedHistory' yang baru saja kita buat
      const todayAttendance = mappedHistory.find((item) =>
        isSameDay(now, new Date(item.raw_date))
      );

      if (todayAttendance) {
        console.log(
          "[DEBUG] Status hari ini DITEMUKAN (dari riwayat):",
          todayAttendance
        );
        const history: HistoryItem[] = [];
        if (todayAttendance.checkIn)
          history.push({ status: "Check In", time: todayAttendance.checkIn });
        if (todayAttendance.checkOut)
          history.push({ status: "Check Out", time: todayAttendance.checkOut });

        setAttendanceStatus({
          id: todayAttendance.id,
          checkInTime: todayAttendance.raw_check_in_time,
          checkOutTime: todayAttendance.raw_check_out_time,
          history: history,
        });
      } else {
        console.log("[DEBUG] Tidak ada data absensi hari ini (dari riwayat).");
        setAttendanceStatus({
          id: null,
          checkInTime: null,
          checkOutTime: null,
          history: [],
        });
      }
    } catch (error: unknown) {
      console.error("Error fetching data:", error);
      showErrorToast("Gagal memuat data absensi");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler untuk Check-In
  const handleCheckIn = async () => {
    if (!activeSession) {
      showErrorToast("Tidak ada sesi absensi yang aktif saat ini.");
      return;
    }
    setIsSubmitting(true);
    console.log("[DEBUG] Memulai Check-In...");
    try {
      // Sesuai konfirmasi Anda ("Tidak ada body")
      const res = await fetch(API_URLS.checkIn, {
        method: "POST",
      });

      const data = await res.json();
      console.log("[DEBUG] Respons Check-In:", data);

      if (!res.ok || data.status !== "00") {
        // Tangkap error dari API (misal: "Sudah check-in")
        throw new Error(data.message || "Gagal melakukan Check In");
      }

      toast.current?.show({
        severity: "success",
        summary: "Berhasil",
        detail: data.message || "Anda berhasil Check In",
      });
      await fetchInitialData(); // Muat ulang semua data
    } catch (error: any) {
      console.error("Error Check In:", error);
      showErrorToast(error.message || "Gagal melakukan Check In");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler untuk Check-Out
  const handleCheckOut = async () => {
    if (!attendanceStatus.id) {
      showErrorToast("ID Absensi tidak ditemukan untuk check-out.");
      return;
    }
    setIsSubmitting(true);
    console.log("[DEBUG] Memulai Check-Out...");
    try {
      const res = await fetch(API_URLS.checkOut, {
        method: "PUT",
      });

      const data = await res.json();
      console.log("[DEBUG] Respons Check-Out:", data);

      if (!res.ok || data.status !== "00") {
        throw new Error(data.message || "Gagal melakukan Check Out");
      }

      toast.current?.show({
        severity: "success",
        summary: "Berhasil",
        detail: data.message || "Anda berhasil Check Out",
      });
      await fetchInitialData();
    } catch (error: any) {
      console.error("Error Check Out:", error);
      showErrorToast(error.message || "Gagal melakukan Check Out");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Helper Tampilan ---
  const formattedTime = currentTime
    ? format(currentTime, "HH:mm:ss")
    : "00:00:00";
  const formattedDate = currentTime
    ? format(currentTime, "EEEE, dd MMMM yyyy", { locale: id })
    : "Memuat tanggal...";

  // Logika Tombol
  const hasCheckedIn = !!attendanceStatus.checkInTime;
  const hasCheckedOut = !!attendanceStatus.checkOutTime;
  const isButtonDisabled =
    isLoading || isSubmitting || !activeSession || hasCheckedOut;

  const cardTitle = (
    <div className="flex justify-content-between align-items-center">
      <span>Absensi Karyawan</span>
      {!isLoading && (
        <Tag
          value={activeSession ? "Sesi Aktif" : "Sesi Tidak Aktif"}
          severity={activeSession ? "success" : "danger"}
        />
      )}
    </div>
  );

  const cardSubtitle = (
    <span>
      {activeSession
        ? activeSession.session_code
        : isLoading
          ? "Memuat sesi..."
          : "Tidak ada sesi absensi yang aktif."}
    </span>
  );

  const getHistorySeverity = (status: AttendanceStatusType) => {
    switch (status) {
      case "Hadir":
        return "success";
      case "Terlambat":
        return "warning";
      case "Absen":
        return "danger";
      default:
        return "info";
    }
  };

  const historyItemTemplate = (item: DailyHistoryItem) => {
    return (
      <div className="col-12 p-3">
        <div
          className="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3"
          style={{
            borderBottom: "1px solid var(--surface-d)",
            paddingBottom: "1rem",
          }}
        >
          <div className="flex flex-column gap-1">
            <div className="text-lg font-bold">{item.date}</div>
            <Tag
              value={item.status}
              severity={getHistorySeverity(item.status)}
              style={{ width: "fit-content" }}
            />
          </div>

          <div className="flex flex-row md:flex-column md:align-items-end gap-3 md:gap-1">
            <span className="text-md font-medium text-green-600">
              <i className="pi pi-sign-in mr-2" />
              {item.checkIn || "N/A"}
            </span>
            <span className="text-md font-medium text-red-600">
              <i className="pi pi-sign-out mr-2" />
              {item.checkOut || "N/A"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // --- TAMPILAN JSX (RENDER) ---
  return (
    <div
      className="grid grid-nogutter justify-content-center p-4"
      style={{ minHeight: "90vh", background: "#f4f4f4" }}
    >
      <Toast ref={toast} />
      <div className="col-12 md:col-12 lg:col-12">
        <Card title={cardTitle} subTitle={cardSubtitle} className="shadow-5">
          {/* --- [PERBAIKAN TATA LETAK] --- */}
          <div className="text-center p-4">
            <div className="mb-4">
              <div className="text-6xl font-bold text-primary">
                {formattedTime}
              </div>
              <div className="text-xl text-color-secondary">
                {formattedDate}
              </div>
            </div>

            {/* Tampilkan Tag "Checked In @ ..." */}
            {hasCheckedIn && !hasCheckedOut && (
              <div className="mb-4">
                <Tag
                  className="p-3"
                  severity="success"
                  value={`Checked In @ ${safeFormat(attendanceStatus.checkInTime, "HH:mm:ss")}`}
                  icon="pi pi-check-circle"
                />
              </div>
            )}

            {/* Bungkus Tombol dan Tag di dalam div flex-column */}
            <div className="flex flex-column align-items-center">
              {/* Logika Tampilan Tombol */}
              {!hasCheckedIn ? (
                // Tampilkan Check In jika BELUM check-in
                <Button
                  label="Check In"
                  icon="pi pi-sign-in"
                  className="p-button-success p-button-lg p-button-raised w-full md:w-auto"
                  onClick={handleCheckIn}
                  loading={isSubmitting}
                  disabled={isButtonDisabled}
                />
              ) : (
                // Tampilkan Check Out jika SUDAH check-in
                <Button
                  label="Check Out"
                  icon="pi pi-sign-out"
                  className="p-button-danger p-button-lg p-button-raised w-full md:w-auto"
                  onClick={handleCheckOut}
                  loading={isSubmitting}
                  disabled={isButtonDisabled}
                />
              )}

              {/* Tampilkan jika sudah check-out */}
              {hasCheckedOut && (
                <Tag
                  className="mt-4"
                  severity="info"
                  value="Anda sudah menyelesaikan absensi hari ini."
                />
              )}

              {/* Tampilkan jika tidak ada sesi */}
              {!activeSession && !isLoading && (
                <Tag
                  className="mt-4"
                  severity="warning"
                  value="Tidak ada sesi absensi yang aktif saat ini."
                />
              )}
            </div>
          </div>
          {/* --- BATAS PERBAIKAN --- */}

          <TabView>
            <TabPanel header="Hari Ini">
              <div className="px-1 py-3">
                {attendanceStatus.history.length > 0 ? (
                  <Timeline
                    value={attendanceStatus.history}
                    align="alternate"
                    className="custom-timeline"
                    content={(item: HistoryItem) => (
                      <>
                        <strong
                          className={
                            item.status === "Check Out"
                              ? "text-red-500"
                              : "text-blue-500"
                          }
                        >
                          {item.status}
                        </strong>
                        <div className="text-sm text-color-secondary">
                          {item.time}
                        </div>
                      </>
                    )}
                  />
                ) : (
                  <div className="text-center text-color-secondary">
                    <i className="pi pi-info-circle mr-2" />
                    Belum ada riwayat check-in/out hari ini.
                  </div>
                )}
              </div>
            </TabPanel>

            <TabPanel header="Riwayat Sebelumnya">
              <DataView
                value={history}
                itemTemplate={historyItemTemplate}
                loading={isLoading}
                layout="list"
                emptyMessage="Tidak ada riwayat absensi sebelumnya."
              />
            </TabPanel>
          </TabView>
        </Card>
      </div>
    </div>
  );
}
