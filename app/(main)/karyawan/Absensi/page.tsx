"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Timeline } from "primereact/timeline";
import { Toast } from "primereact/toast";
import { TabView, TabPanel } from "primereact/tabview";
import { Chip } from "primereact/chip";
import { Skeleton } from "primereact/skeleton";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// --- LOGIC API & HELPER (TIDAK BERUBAH) ---

interface Session { id: string | number; session_code: string; open_time?: string; close_time?: string; date?: string; status?: string; }
interface HistoryItem { status: string; time: string; }
interface AttendanceStatus { id: string | number | null; checkInTime: string | null; checkOutTime: string | null; history: HistoryItem[]; }
type AttendanceStatusType = "Hadir" | "Terlambat" | "Absen";
interface DailyHistoryItem { id: string | number; date: string; checkIn: string | null; checkOut: string | null; status: AttendanceStatusType; raw_date: string; raw_check_in_time: string | null; raw_check_out_time: string | null; }
interface Coordinates { latitude: number; longitude: number; }

const API_URLS = {
  getActiveSession: "/api/karyawan/attendance-sessions",
  getHistory: "/api/karyawan/attendances/history",
  checkIn: "/api/karyawan/attendances/check-in",
  checkOut: "/api/karyawan/attendances/check-out",
};

const safeFormat = (dateString: string | null | undefined, formatStr: string): string | null => {
  if (!dateString) return null;
  try { return format(new Date(dateString), formatStr, { locale: id }); } catch (e) { return null; }
};

const isSameDay = (date1: Date, date2: Date) => {
  if (isNaN(date2.getTime())) return false;
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
};

const findActiveSession = (sessions: Session[]): Session | null => {
  const now = new Date();
  for (const session of sessions) {
    if (!session.open_time || !session.close_time || !session.date || !session.status) continue;
    const sessionDate = new Date(session.date);
    if (!isSameDay(now, sessionDate)) continue;
    if (session.status !== "open") continue;
    try {
      const [startH, startM, startS] = session.open_time.split(":").map(Number);
      const [endH, endM, endS] = session.close_time.split(":").map(Number);
      const startTime = new Date(); startTime.setHours(startH, startM, startS, 0);
      const endTime = new Date(); endTime.setHours(endH, endM, endS, 0);
      if (now >= startTime && now <= endTime) return session;
    } catch (e) {}
  }
  return null;
};

const getGeoLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) reject(new Error("Browser tidak mendukung Geolocation."));
    else navigator.geolocation.getCurrentPosition(
        (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
        (error) => { let msg = "Gagal lokasi."; if(error.code === error.PERMISSION_DENIED) msg = "Izin lokasi ditolak."; reject(new Error(msg)); },
        { enableHighAccuracy: true, timeout: 10000 }
      );
  });
};

const getGreeting = () => {
    const h = new Date().getHours();
    if(h < 4) return "Lembur?";
    if(h < 11) return "Pagi";
    if(h < 15) return "Siang";
    if(h < 18) return "Sore";
    return "Malam";
};

const getDailyQuote = () => {
    const quotes = [
        "Fokus pada progres.", "Cintal apa yang Anda lakukan.", "Mulai dari sekarang.", "Kerja cerdas & tuntas.", "Ciptakan peluangmu."
    ];
    return quotes[new Date().getDate() % quotes.length];
};

// --- COMPONENT UTAMA ---

export default function AttendancePage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({ id: null, checkInTime: null, checkOutTime: null, history: [], });
  const [history, setHistory] = useState<DailyHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastLocation, setLastLocation] = useState<Coordinates | null>(null);
  const toast = useRef<Toast>(null);

  useEffect(() => { setCurrentTime(new Date()); const timer = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(timer); }, []);
  useEffect(() => { fetchInitialData(); }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [resSession, resHistory] = await Promise.all([ fetch(API_URLS.getActiveSession), fetch(API_URLS.getHistory) ]);
      const dataSession = await resSession.json();
      const dataHistory = await resHistory.json();

      if (dataSession.status === "00" && Array.isArray(dataSession.attendance_sessions)) setActiveSession(findActiveSession(dataSession.attendance_sessions));
      else setActiveSession(null);

      let mappedHistory: DailyHistoryItem[] = [];
      if (dataHistory.status === "00" && Array.isArray(dataHistory.attendances)) {
        mappedHistory = dataHistory.attendances.map((item: any) => {
           let status: AttendanceStatusType = "Absen";
           if (item.check_in_status === "in-time") status = "Hadir"; else if (item.check_in_status === "late") status = "Terlambat";
           const dateToUse = item.check_in_time || item.created_at;
           return {
             id: item.id, date: safeFormat(dateToUse, "dd MMM yyyy") || "-", checkIn: safeFormat(item.check_in_time, "HH:mm"), checkOut: safeFormat(item.check_out_time, "HH:mm"),
             status: status, raw_date: dateToUse, raw_check_in_time: item.check_in_time, raw_check_out_time: item.check_out_time,
           };
        });
        setHistory(mappedHistory);
      }

      const now = new Date();
      const todayAttendance = mappedHistory.find((item) => isSameDay(now, new Date(item.raw_date)));
      if (todayAttendance) {
        const historyList: HistoryItem[] = [];
        if (todayAttendance.checkIn) historyList.push({ status: "Masuk", time: todayAttendance.checkIn });
        if (todayAttendance.checkOut) historyList.push({ status: "Pulang", time: todayAttendance.checkOut });
        setAttendanceStatus({ id: todayAttendance.id, checkInTime: todayAttendance.raw_check_in_time, checkOutTime: todayAttendance.raw_check_out_time, history: historyList });
      } else setAttendanceStatus({ id: null, checkInTime: null, checkOutTime: null, history: [] });
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  const handleCheckIn = async () => {
    if (!activeSession) return;
    setIsSubmitting(true);
    toast.current?.show({ severity: 'info', summary: 'Lokasi', detail: 'Mengambil lokasi...', life: 2000 });
    try {
      const coords = await getGeoLocation();
      setLastLocation(coords);
      const res = await fetch(API_URLS.checkIn, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ latitude: coords.latitude, longitude: coords.longitude }), });
      const data = await res.json();
      if (!res.ok || data.status !== "00") throw new Error(data.message);
      toast.current?.show({ severity: "success", summary: "Berhasil", detail: "Check-In Sukses" });
      await fetchInitialData();
    } catch (error: any) { toast.current?.show({ severity: "error", summary: "Gagal", detail: error.message }); } finally { setIsSubmitting(false); }
  };

  const handleCheckOut = async () => {
    if (!attendanceStatus.id) return;
    setIsSubmitting(true);
    try {
        const res = await fetch(API_URLS.checkOut, { method: "PUT" });
        const data = await res.json();
        if (!res.ok || data.status !== "00") throw new Error(data.message);
        toast.current?.show({ severity: "success", summary: "Berhasil", detail: "Check-Out Sukses" });
        await fetchInitialData();
    } catch (error: any) { toast.current?.show({ severity: "error", summary: "Gagal", detail: error.message }); } finally { setIsSubmitting(false); }
  };

  const formattedTime = currentTime ? format(currentTime, "HH:mm") : "--:--";
  const formattedSeconds = currentTime ? format(currentTime, "ss") : "00";
  const formattedDate = currentTime ? format(currentTime, "EEEE, dd MMMM", { locale: id }) : "...";
  const hasCheckedIn = !!attendanceStatus.checkInTime;
  const hasCheckedOut = !!attendanceStatus.checkOutTime;

  const timelineTemplate = (item: HistoryItem) => (
    <div className="flex align-items-center gap-3">
        <span className={`flex align-items-center justify-content-center border-circle w-2rem h-2rem shadow-1 ${item.status === 'Masuk' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
            <i className={`pi ${item.status === 'Masuk' ? 'pi-sign-in' : 'pi-sign-out'} text-xs`} />
        </span>
        <div className="flex flex-column">
            <span className="font-semibold text-color text-sm">{item.status}</span>
            <span className="text-xs text-color-secondary">{item.time}</span>
        </div>
    </div>
  );

  return (
    // [FIX MOBILE] Hapus padding besar di mobile (p-0 md:p-6) agar full width
    <div className="surface-ground min-h-screen p-0 md:p-6 font-sans">
      <Toast ref={toast} />

      {/* --- HEADER --- */}
      {/* [FIX MOBILE] Margin bottom dikurangi di mobile (mb-3 md:mb-5) */}
      <div className="mb-3 md:mb-5">
        <div 
            className="surface-card md:shadow-2 md:border-round-2xl p-4 flex flex-column md:flex-row md:align-items-center justify-content-between relative overflow-hidden gap-3"
            style={{ 
                // [FIX MOBILE] Di Mobile gradient lebih simpel, border radius bawah saja
                background: 'linear-gradient(120deg, #ffffff 40%, #f0f7ff 100%)', 
                borderLeft: 'none md:6px solid var(--primary-color)',
                borderBottomLeftRadius: '20px',
                borderBottomRightRadius: '20px'
            }}
        >
            <div className="flex align-items-center gap-3 z-1">
                <div className="hidden md:flex flex-shrink-0 align-items-center justify-content-center bg-white shadow-1 border-round-2xl w-6rem h-6rem text-primary relative">
                     <i className="pi pi-building text-5xl"></i>
                     <div className="absolute top-0 right-0 m-1 w-1rem h-1rem bg-green-400 border-circle border-2 border-white"></div>
                </div>

                <div>
                    <div className="text-500 font-bold text-xs mb-1 uppercase tracking-widest flex align-items-center gap-2">
                        <i className="pi pi-id-card"></i> Portal Karyawan
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-900 m-0 mb-1">
                        {getGreeting()}, <span className="text-primary">Rekan!</span>
                    </h1>
                    <p className="text-700 m-0 text-xs md:text-base font-medium font-italic opacity-80 line-clamp-1">
                        "{getDailyQuote()}"
                    </p>
                </div>
            </div>

            {/* STATUS SESI: Dibuat compact di mobile */}
            <div className="z-1 w-full md:w-auto mt-2 md:mt-0">
                {isLoading ? <Skeleton width="100%" height="3rem" borderRadius="10px" /> : (
                    <div className={`flex align-items-center justify-content-between gap-3 px-3 py-2 border-round-xl border-1 w-full md:w-auto ${activeSession ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                         <div className="flex flex-column">
                             <span className="text-xs text-color-secondary font-bold uppercase">Status</span>
                             <span className={`font-bold text-sm ${activeSession ? 'text-blue-700' : 'text-gray-600'}`}>
                                {activeSession ? "Sesi Buka" : "Sesi Tutup"}
                             </span>
                         </div>
                         <i className={`pi ${activeSession ? 'pi-check-circle text-blue-500' : 'pi-lock text-gray-400'} text-xl`}></i>
                    </div>
                )}
            </div>
        </div>
      </div>

      <div className="grid grid-nogutter md:grid-gutter px-3 md:px-0 pb-4">
        
        {/* KOLOM KIRI: JAM & TOMBOL */}
        <div className="col-12 md:col-5 lg:col-4 mb-3 md:mb-0">
            {/* [FIX MOBILE] Shadow dikurangi, border radius disesuaikan */}
            <Card className="h-full shadow-1 md:shadow-2 surface-card border-round-xl">
                 <div className="flex flex-column align-items-center justify-content-center h-full py-3 md:py-4 text-center">
                    
                    <div className="mb-2">
                        <span className="text-6xl md:text-7xl font-bold text-primary">{formattedTime}</span>
                        <span className="text-xl md:text-2xl text-400 font-medium ml-2">{formattedSeconds}</span>
                    </div>
                    <div className="text-sm md:text-lg text-700 font-medium mb-3 surface-100 px-3 py-1 border-round-2xl">
                        {formattedDate}
                    </div>

                    {lastLocation ? (
                         <Chip label={`GPS: ${lastLocation.latitude.toFixed(4)}, ...`} icon="pi pi-map-marker" className="mb-4 bg-blue-50 text-blue-700 text-xs font-bold border-none" />
                    ) : (
                        <div className="mb-4 text-xs text-500 flex align-items-center gap-2"><i className="pi pi-map-marker"></i> Lokasi mati</div>
                    )}

                    <div className="w-full px-2 md:px-4">
                        {isLoading ? ( <Skeleton height="3.5rem" className="border-round-xl" /> ) : hasCheckedOut ? (
                            <div className="p-3 bg-green-50 border-green-200 border-1 border-round-xl w-full">
                                <i className="pi pi-check-circle text-green-500 text-2xl mb-1 block"></i>
                                <span className="font-bold text-green-700 text-sm">Sudah Pulang</span>
                            </div>
                        ) : !hasCheckedIn ? (
                            <Button 
                                label={isSubmitting ? "Lokasi..." : "Check In"}
                                icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-map-marker"}
                                className="w-full shadow-2"
                                style={{ height: '3.5rem', fontSize: '1.1rem', borderRadius: '12px' }}
                                onClick={handleCheckIn}
                                disabled={!activeSession || isSubmitting}
                            />
                        ) : (
                            <div className="flex flex-column gap-2 w-full">
                                <div className="text-center p-2 text-blue-700 bg-blue-50 border-round-xl border-1 border-blue-100 flex justify-content-between align-items-center px-3">
                                    <div className="text-xs text-blue-500 uppercase font-bold">Masuk</div>
                                    <div className="text-xl font-bold">{safeFormat(attendanceStatus.checkInTime, "HH:mm")}</div>
                                </div>
                                <Button 
                                    label={isSubmitting ? "Proses..." : "Check Out"}
                                    icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-sign-out"}
                                    className="w-full p-button-danger shadow-2"
                                    style={{ height: '3rem', borderRadius: '12px' }}
                                    onClick={handleCheckOut}
                                    disabled={isSubmitting}
                                />
                            </div>
                        )}
                        {!activeSession && !hasCheckedIn && !isLoading && (
                            <div className="mt-2 text-red-400 text-xs font-medium"><i className="pi pi-lock mr-1"></i> Terkunci</div>
                        )}
                    </div>
                 </div>
            </Card>
        </div>

        {/* KOLOM KANAN: TAB (HISTORY) */}
        <div className="col-12 md:col-7 lg:col-8">
            <Card className="h-full shadow-1 md:shadow-2 border-round-xl">
                <TabView className="custom-tabview text-sm">
                    <TabPanel header="Hari Ini" leftIcon="pi pi-calendar">
                        <div className="p-1">
                             <div className="grid mb-3">
                                <div className="col-6">
                                    <div className="surface-50 p-2 border-round-lg text-center border-1 surface-border">
                                        <div className="text-500 text-xs mb-1">Masuk</div>
                                        <div className="text-lg font-bold text-blue-600">{attendanceStatus.checkInTime ? safeFormat(attendanceStatus.checkInTime, "HH:mm") : "-"}</div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="surface-50 p-2 border-round-lg text-center border-1 surface-border">
                                        <div className="text-500 text-xs mb-1">Pulang</div>
                                        <div className="text-lg font-bold text-orange-600">{attendanceStatus.checkOutTime ? safeFormat(attendanceStatus.checkOutTime, "HH:mm") : "-"}</div>
                                    </div>
                                </div>
                             </div>
                             {attendanceStatus.history.length > 0 ? ( <Timeline value={attendanceStatus.history} content={timelineTemplate} className="custom-timeline w-full ml-1" /> ) : ( <div className="text-center py-4 text-400 text-xs">Belum ada data.</div> )}
                        </div>
                    </TabPanel>

                    <TabPanel header="Riwayat" leftIcon="pi pi-history">
                        <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
                            {history.length > 0 ? (
                                <div className="flex flex-column gap-2">
                                    {history.map((h) => (
                                        <div key={h.id} className="flex align-items-center justify-content-between p-2 surface-50 border-round-lg border-1 border-transparent hover:border-300 cursor-pointer">
                                            <div>
                                                <div className="font-bold text-900 text-sm">{h.date}</div>
                                                <Tag value={h.status} severity={h.status === 'Hadir' ? 'success' : 'warning'} className="text-[10px] px-2 py-0 mt-1"></Tag>
                                            </div>
                                            <div className="flex gap-3 text-xs">
                                                <div className="text-center"><div className="text-500 mb-1">IN</div><div className="text-blue-700 font-bold font-mono">{h.checkIn || "-"}</div></div>
                                                <div className="text-center"><div className="text-500 mb-1">OUT</div><div className="text-orange-700 font-bold font-mono">{h.checkOut || "-"}</div></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : ( <div className="text-center p-4 text-500 text-xs">Kosong.</div> )}
                        </div>
                    </TabPanel>
                </TabView>
            </Card>
        </div>
      </div>

      <style jsx global>{`
        .p-tabview-nav { border-bottom: 1px solid #e5e7eb !important; background: transparent !important; }
        .p-tabview-nav li .p-tabview-nav-link { background: transparent !important; border-color: transparent !important; color: #6b7280; padding: 1rem; }
        .p-tabview-nav li.p-highlight .p-tabview-nav-link { color: var(--primary-color) !important; border-bottom: 2px solid var(--primary-color) !important; }
        .p-tabview-panels { background: transparent !important; padding: 1rem 0 0 0 !important; }
        .custom-timeline .p-timeline-event-opposite { flex: 0; padding: 0; }
        /* Hapus margin default body/layout jika ada */
        body { margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}