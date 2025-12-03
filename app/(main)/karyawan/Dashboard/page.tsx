"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { ProgressBar } from "primereact/progressbar";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";

// --- TIPE DATA & MOCK ---
interface RingkasanStats {
    totalHadir: number;
    totalTidakHadir: number;
    sisaCuti: number;
    totalJatahCuti: number;
}

interface EmployeeDetails {
    officeName: string;
    officeAddress: string;
    division: string;
    position: string;
    officeLat: number;
    officeLon: number;
    maxDistance: number;
}

// UPDATE: Alamat Lengkap Mock Data
const MOCK_EMPLOYEE_DETAILS: EmployeeDetails = {
    officeName: "Headquarters Jakarta (HQ)",
    officeAddress: "Gedung Menara Multimedia Lt. 5, Jl. Kebon Sirih No. 12, Gambir, Jakarta Pusat, DKI Jakarta 10110",
    division: "Engineering",
    position: "Senior Frontend Developer",
    officeLat: -6.1835, // Contoh koordinat sekitar Jakpus
    officeLon: 106.8304,
    maxDistance: 100,
};

const MOCK_STATS: RingkasanStats = {
    totalHadir: 18,
    totalTidakHadir: 1,
    sisaCuti: 8,
    totalJatahCuti: 12,
};

const mockJadwalKerja = {
    jamMasuk: "08:30",
    jamKeluar: "17:30",
};

// --- HELPER FUNCTIONS ---
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// --- COMPONENT UTAMA ---

export default function DashboardRingkasanPage() {
    const toast = useRef<Toast>(null);
    const { user } = useAuth();

    // State
    const [stats, setStats] = useState<RingkasanStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [checkInStatus, setCheckInStatus] = useState<string>("Belum Check-in");
    const [checkOutStatus, setCheckOutStatus] = useState<string>("Belum Check-out");
    const [isLate, setIsLate] = useState(false);
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
    const [displayModal, setDisplayModal] = useState(false);
    const [isAttendanceLoading, setIsAttendanceLoading] = useState(false);
    const [locationStatus, setLocationStatus] = useState<string>("Mencari lokasi...");
    const [locationDistance, setLocationDistance] = useState<number | null>(null);
    const [isInRange, setIsInRange] = useState(false);
    const [currentTime, setCurrentTime] = useState<string>("");

    // Clock
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Logic Absensi
    const handleAttendance = async () => {
        if (!employeeDetails) return;
        setIsAttendanceLoading(true);
        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
            });
            const { latitude, longitude } = position.coords;
            const dist = calculateDistance(latitude, longitude, employeeDetails.officeLat, employeeDetails.officeLon);
            setLocationDistance(Math.round(dist));

            if (dist > employeeDetails.maxDistance) {
                setIsInRange(false);
                setLocationStatus(`Diluar Radius (${Math.round(dist)}m)`);
                toast.current?.show({ severity: "error", summary: "Jarak Terlalu Jauh", detail: "Anda berada di luar area kantor.", life: 3000 });
                setIsAttendanceLoading(false);
                return;
            }

            setIsInRange(true);
            setLocationStatus("Lokasi Valid");

            setTimeout(() => {
                const now = new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });
                if (checkInStatus === "Belum Check-in") {
                    setCheckInStatus(now);
                    const [h, m] = now.split(':').map(Number);
                    const [schH, schM] = mockJadwalKerja.jamMasuk.split(':').map(Number);
                    if (h > schH || (h === schH && m > schM + 5)) setIsLate(true);
                } else {
                    setCheckOutStatus(now);
                }
                toast.current?.show({ severity: "success", summary: "Berhasil", detail: "Absensi tercatat.", life: 3000 });
                setIsAttendanceLoading(false);
                setDisplayModal(false);
            }, 1000);
        } catch (e) {
            setLocationStatus("Gagal Mengambil GPS");
            setIsAttendanceLoading(false);
        }
    };

    // Load Data Simulation
    useEffect(() => {
        setTimeout(() => {
            setStats(MOCK_STATS);
            setEmployeeDetails(MOCK_EMPLOYEE_DETAILS);
            setIsLoading(false);
        }, 1500);
    }, []);

    const cutiPercentage = stats ? Math.round(((stats.totalJatahCuti - stats.sisaCuti) / stats.totalJatahCuti) * 100) : 0;
    const actionRequired = checkInStatus === "Belum Check-in" ? "Check-in" : (checkOutStatus === "Belum Check-out" ? "Check-out" : "Selesai");

    // --- LOADING SKELETON ---
    if (isLoading) {
        return (
            <div className="p-4 max-w-7xl mx-auto">
                <div className="flex align-items-center mb-5 gap-3">
                    <Skeleton shape="circle" size="4rem" />
                    <Skeleton width="15rem" height="2rem" />
                </div>
                <div className="grid">
                    <div className="col-12 md:col-4"><Skeleton height="140px" borderRadius="16px" /></div>
                    <div className="col-12 md:col-4"><Skeleton height="140px" borderRadius="16px" /></div>
                    <div className="col-12 md:col-4"><Skeleton height="140px" borderRadius="16px" /></div>
                </div>
                <div className="mt-4"><Skeleton height="350px" borderRadius="16px" /></div>
            </div>
        );
    }

    if (!stats || !employeeDetails) return null;

    return (
        <div className="min-h-screen surface-ground p-4 md:p-6 font-primary">
            <Toast ref={toast} />

            <div className="max-w-7xl mx-auto">

                {/* --- 1. HEADER & GREETING --- */}
                <div className="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center mb-6 gap-4">
                    <div className="flex align-items-center gap-3">
                        <Avatar label={user?.full_name?.charAt(0) || "K"} size="xlarge" shape="circle" className="bg-indigo-600 text-white shadow-3" />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 m-0">
                                Selamat Pagi, {user?.full_name?.split(' ')[0] || "User"}!
                            </h1>
                            <div className="flex align-items-center gap-2 mt-1">
                                <span className="text-gray-500 font-medium text-sm">{employeeDetails.position}</span>
                                <span className="text-gray-300">•</span>
                                <Tag value={employeeDetails.division} severity="info" className="py-0 px-2 text-xs" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Jam Digital */}
                    <div className="surface-card px-4 py-2 border-round-2xl shadow-1 flex align-items-center gap-3 w-full md:w-auto justify-content-between md:justify-content-start">
                        <div className="text-right">
                            <span className="block text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Waktu Server</span>
                            <div className="flex align-items-center gap-2">
                                <i className="pi pi-clock text-indigo-500"></i>
                                <span className="text-xl font-bold text-gray-800 font-monospace">{currentTime} WIB</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- 2. SUMMARY STATS --- */}
                <div className="grid mb-5">
                    {/* Hadir */}
                    <div className="col-12 md:col-4">
                        <div className="surface-card shadow-1 p-4 border-round-2xl border-bottom-3 border-green-500 h-full hover:shadow-3 transition-all transition-duration-300 cursor-pointer">
                            <div className="flex justify-content-between align-items-start mb-2">
                                <span className="text-gray-500 font-medium text-sm">Total Hadir</span>
                                <div className="bg-green-100 text-green-600 border-circle w-2rem h-2rem flex align-items-center justify-content-center">
                                    <i className="pi pi-check text-sm"></i>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{stats.totalHadir} <span className="text-sm font-normal text-gray-500">Hari</span></div>
                        </div>
                    </div>

                    {/* Absen/Sakit */}
                    <div className="col-12 md:col-4">
                        <div className="surface-card shadow-1 p-4 border-round-2xl border-bottom-3 border-orange-500 h-full hover:shadow-3 transition-all transition-duration-300 cursor-pointer">
                            <div className="flex justify-content-between align-items-start mb-2">
                                <span className="text-gray-500 font-medium text-sm">Ketidakhadiran</span>
                                <div className="bg-orange-100 text-orange-600 border-circle w-2rem h-2rem flex align-items-center justify-content-center">
                                    <i className="pi pi-info-circle text-sm"></i>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{stats.totalTidakHadir} <span className="text-sm font-normal text-gray-500">Hari</span></div>
                        </div>
                    </div>

                    {/* Cuti */}
                    <div className="col-12 md:col-4">
                        <div className="surface-card shadow-1 p-4 border-round-2xl border-bottom-3 border-blue-500 h-full hover:shadow-3 transition-all transition-duration-300 cursor-pointer">
                            <div className="flex justify-content-between align-items-start mb-3">
                                <span className="text-gray-500 font-medium text-sm">Sisa Cuti Tahunan</span>
                                <div className="bg-blue-100 text-blue-600 border-circle w-2rem h-2rem flex align-items-center justify-content-center">
                                    <i className="pi pi-calendar text-sm"></i>
                                </div>
                            </div>
                            <div className="flex align-items-end gap-2 mb-2">
                                <span className="text-3xl font-bold text-gray-900">{stats.sisaCuti}</span>
                                <span className="text-sm text-gray-500 mb-1">dari {stats.totalJatahCuti} hari</span>
                            </div>
                            <ProgressBar value={cutiPercentage} showValue={false} style={{ height: '4px' }} color="var(--blue-500)" className="bg-blue-50" />
                        </div>
                    </div>
                </div>

                {/* --- 3. MAIN SECTION: ATTENDANCE & OFFICE INFO --- */}
                <div className="grid">
                    
                    {/* LEFT COLUMN: HERO ATTENDANCE CARD */}
                    <div className="col-12 lg:col-8">
                        <div className="surface-card shadow-2 border-round-3xl p-0 h-full overflow-hidden relative">
                            {/* Header Card */}
                            <div className="p-4 border-bottom-1 surface-border flex justify-content-between align-items-center bg-gray-50">
                                <div className="flex align-items-center gap-2">
                                    <i className="pi pi-id-card text-indigo-600 text-xl"></i>
                                    <span className="font-bold text-gray-800">Absensi & Lokasi</span>
                                </div>
                                <Tag value="Wajib" severity="warning" className="text-xs" rounded></Tag>
                            </div>

                            <div className="p-4 md:p-5">
                                {/* SECTION: STATUS WAKTU */}
                                <div className="grid mb-4">
                                    <div className="col-6">
                                        <span className="text-xs font-semibold text-gray-500 uppercase">Jam Masuk</span>
                                        <div className="flex align-items-center gap-2 mt-1">
                                            <span className={`text-2xl font-bold ${checkInStatus !== "Belum Check-in" ? 'text-green-600' : 'text-gray-400'}`}>
                                                {checkInStatus}
                                            </span>
                                            {isLate && <i className="pi pi-exclamation-triangle text-red-500" title="Terlambat"></i>}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <span className="text-xs font-semibold text-gray-500 uppercase">Jam Pulang</span>
                                        <div className="flex align-items-center gap-2 mt-1">
                                            <span className={`text-2xl font-bold ${checkOutStatus !== "Belum Check-out" ? 'text-orange-600' : 'text-gray-400'}`}>
                                                {checkOutStatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION: LOCATION CONTEXT CARD (NEW) */}
                                <div className="bg-blue-50 border-blue-100 border-1 border-round-xl p-3 mb-4 flex flex-column md:flex-row gap-3 align-items-start md:align-items-center">
                                    <div className="bg-white p-2 border-round-lg shadow-1 text-blue-600 min-w-min">
                                        <i className="pi pi-building text-2xl"></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="text-xs font-bold text-blue-600 uppercase m-0 mb-1 tracking-wide">
                                            Lokasi Kantor Terdaftar
                                        </p>
                                        <p className="font-bold text-gray-900 m-0 text-base">
                                            {employeeDetails.officeName}
                                        </p>
                                        <p className="text-sm text-gray-600 m-0 mt-1 line-height-3">
                                            {employeeDetails.officeAddress}
                                        </p>
                                    </div>
                                    <div className="hidden md:block">
                                         <i className="pi pi-map-marker text-blue-300 text-4xl opacity-50"></i>
                                    </div>
                                </div>

                                {/* ACTION BUTTON */}
                                {actionRequired !== "Selesai" ? (
                                    <Button
                                        onClick={() => { setDisplayModal(true); handleAttendance(); }}
                                        className={`w-full p-3 md:p-4 text-lg border-round-xl shadow-2 transition-transform transition-duration-200 hover:scale-[1.01] flex justify-content-center gap-2 ${actionRequired === 'Check-in' ? 'bg-indigo-600 border-indigo-600 hover:bg-indigo-700' : 'bg-orange-500 border-orange-500 hover:bg-orange-600'}`}
                                    >
                                        <i className="pi pi-fingerprint text-xl"></i>
                                        <div className="flex flex-column text-left">
                                            <span className="font-bold line-height-2">Tap untuk {actionRequired}</span>
                                            <span className="text-xs font-normal opacity-90">Pastikan Anda berada di lokasi kantor</span>
                                        </div>
                                    </Button>
                                ) : (
                                    <div className="w-full p-4 bg-green-50 text-green-700 border-1 border-green-200 border-round-xl flex align-items-center justify-content-center gap-2">
                                        <i className="pi pi-check-circle text-xl"></i>
                                        <span className="font-semibold">Absensi hari ini selesai. Selamat beristirahat!</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: QUICK MENU & WIDGETS */}
                    <div className="col-12 lg:col-4">
                        <div className="flex flex-column gap-4 h-full">
                            
                            {/* Menu Grid */}
                            <div className="surface-card shadow-2 border-round-3xl p-4">
                                <h3 className="text-base font-bold text-gray-800 m-0 mb-3 uppercase tracking-wide">Menu Cepat</h3>
                                <div className="grid">
                                    <div className="col-6">
                                        <Link href="/karyawan/Absensi" className="no-underline">
                                            <div className="surface-ground hover:surface-200 border-1 surface-border p-3 border-round-xl cursor-pointer text-center h-full flex flex-column align-items-center gap-2 transition-colors">
                                                <i className="pi pi-history text-xl text-indigo-500"></i>
                                                <span className="text-xs font-semibold text-gray-700">Riwayat</span>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="col-6">
                                        <Link href="/karyawan/Pengajuan/cuti" className="no-underline">
                                            <div className="surface-ground hover:surface-200 border-1 surface-border p-3 border-round-xl cursor-pointer text-center h-full flex flex-column align-items-center gap-2 transition-colors">
                                                <i className="pi pi-envelope text-xl text-purple-500"></i>
                                                <span className="text-xs font-semibold text-gray-700">Izin/Cuti</span>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="col-6 mt-2">
                                        <Link href="/karyawan/SlipGaji" className="no-underline">
                                            <div className="surface-ground hover:surface-200 border-1 surface-border p-3 border-round-xl cursor-pointer text-center h-full flex flex-column align-items-center gap-2 transition-colors">
                                                <i className="pi pi-wallet text-xl text-green-500"></i>
                                                <span className="text-xs font-semibold text-gray-700">Slip Gaji</span>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="col-6 mt-2">
                                        <Link href="/karyawan/Profil" className="no-underline">
                                            <div className="surface-ground hover:surface-200 border-1 surface-border p-3 border-round-xl cursor-pointer text-center h-full flex flex-column align-items-center gap-2 transition-colors">
                                                <i className="pi pi-user text-xl text-blue-500"></i>
                                                <span className="text-xs font-semibold text-gray-700">Profil</span>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                             {/* Info Widget */}
                             <div className="surface-card shadow-2 border-round-3xl p-4 flex-grow-1 bg-gray-900 text-white relative overflow-hidden">
                                <div className="relative z-1">
                                    <div className="flex align-items-center gap-2 mb-3">
                                        <i className="pi pi-info-circle text-yellow-400"></i>
                                        <span className="font-bold text-sm">Info HRD</span>
                                    </div>
                                    <p className="text-gray-300 text-sm line-height-3 m-0">
                                        Penutupan periode payroll dilakukan setiap tanggal 25. Pastikan semua absensi telah lengkap.
                                    </p>
                                </div>
                                <div className="absolute -bottom-5 -right-5 w-6rem h-6rem bg-white opacity-5 border-circle"></div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* --- MODAL DIALOG --- */}
                <Dialog 
                    header="Verifikasi Lokasi" 
                    visible={displayModal} 
                    style={{ width: '90vw', maxWidth: '450px' }} 
                    onHide={() => setDisplayModal(false)}
                    contentClassName="p-0 border-round-bottom-2xl"
                    headerClassName="border-round-top-2xl surface-ground border-bottom-1 surface-border"
                    modal
                    draggable={false}
                >
                    <div className="flex flex-column align-items-center p-5 text-center bg-white">
                        
                        {/* Status Icon */}
                        <div className={`border-circle w-5rem h-5rem flex align-items-center justify-content-center mb-4 ${isAttendanceLoading ? 'bg-blue-50' : (isInRange ? 'bg-green-50' : 'bg-red-50')}`}>
                            <i className={`pi ${isAttendanceLoading ? 'pi-spin pi-compass text-blue-500' : (isInRange ? 'pi-check text-green-500' : 'pi-times text-red-500')} text-3xl`}></i>
                        </div>
                        
                        {/* Status Text */}
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            {isAttendanceLoading ? "Sedang Memindai GPS..." : (isInRange ? "Lokasi Terkonfirmasi" : "Di Luar Jangkauan")}
                        </h2>
                        
                        {/* Detail Text */}
                        <div className="text-gray-600 mb-4 line-height-3 text-sm bg-gray-50 p-3 border-round w-full">
                            {isAttendanceLoading 
                                ? "Mohon tunggu, sistem sedang menghitung jarak Anda ke kantor."
                                : (
                                    <>
                                        <div>Jarak ke <strong>{employeeDetails.officeName}</strong>:</div>
                                        <div className="text-lg font-bold text-gray-800 my-1">{locationDistance} meter</div>
                                        <div className="text-xs text-gray-500">(Maksimal radius: {employeeDetails.maxDistance}m)</div>
                                    </>
                                  )
                            }
                        </div>

                        {/* Buttons */}
                        {!isAttendanceLoading && isInRange && (
                            <div className="w-full flex flex-column gap-2">
                                <Button label={`Ya, Lakukan ${actionRequired}`} icon="pi pi-check" className="w-full p-button-primary" onClick={handleAttendance} />
                                <Button label="Batal" className="w-full p-button-text p-button-secondary" onClick={() => setDisplayModal(false)} />
                            </div>
                        )}
                         {!isAttendanceLoading && !isInRange && (
                            <div className="w-full flex flex-column gap-2">
                                <Button label="Coba Scan Ulang" icon="pi pi-refresh" className="w-full p-button-outlined p-button-danger" onClick={handleAttendance} />
                                <Button label="Tutup" className="w-full p-button-text p-button-secondary" onClick={() => setDisplayModal(false)} />
                            </div>
                        )}
                    </div>
                </Dialog>

            </div>
        </div>
    );
}