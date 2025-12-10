"use client";

import React, { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import { useAuth } from "@/components/AuthContext";

// Import Custom Components (Pastikan file-file ini sudah ada di folder components)
import { RingkasanStats, EmployeeDetails } from "./components/types";
import DashboardHeader from "./components/DashboardHeader";
import StatsGrid from "./components/StatsGrid";
import AttendanceCard from "./components/AttendanceCard";
import QuickMenu from "./components/QuickMenu";
import AttendanceModal from "./components/AttendanceModal";

// --- MOCK DATA ---
const MOCK_EMPLOYEE_DETAILS: EmployeeDetails = {
    officeName: "PT MARSTECH GLOBAL",
    officeAddress: "Jl. Margatama Asri IV, Kanigoro, Kec. Kartoharjo, Kota Madiun, Jawa Timur 63118",
    division: "Engineering",
    position: "Senior Frontend Developer",
    officeLat: -7.636902589335165,
    officeLon: 111.54261553695524,
    maxDistance: 100, // dalam meter
};

const MOCK_STATS: RingkasanStats = {
    totalHadir: 18,
    totalTidakHadir: 1,
    sisaCuti: 8,
    totalJatahCuti: 12,
};

// Konfigurasi Jadwal Kerja
const mockJadwalKerja = { 
    shiftName: "Regular Office (WFO)",
    jamMasuk: "08:30", 
    jamKeluar: "17:30" 
};

// --- HELPER FUNCTIONS ---
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Radius bumi dalam meter
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

    // 1. Data State
    const [stats, setStats] = useState<RingkasanStats | null>(null);
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // 2. Attendance Status State
    const [checkInStatus, setCheckInStatus] = useState<string>("Belum Check-in");
    const [checkOutStatus, setCheckOutStatus] = useState<string>("Belum Check-out");
    const [isLate, setIsLate] = useState(false);
    
    // 3. Modal & GPS State
    const [displayModal, setDisplayModal] = useState(false);
    const [isAttendanceLoading, setIsAttendanceLoading] = useState(false);
    const [locationDistance, setLocationDistance] = useState<number | null>(null);
    const [isInRange, setIsInRange] = useState(false);
    
    // 4. Time & Session Logic State
    const [currentTime, setCurrentTime] = useState<string>("");
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [timeToStart, setTimeToStart] = useState<string>("");

    // --- EFFECT: Clock & Session Validation ---
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));

            // LOGIKA SESI ABSENSI
            // -----------------------------------------------------
            // Parsing jam masuk dari string "08:30"
            const [scheduleH, scheduleM] = mockJadwalKerja.jamMasuk.split(':').map(Number);
            
            const scheduleDate = new Date();
            scheduleDate.setHours(scheduleH, scheduleM, 0);

            // Tentukan "Jendela Buka Absen" (Misal: 60 menit sebelum jam masuk)
            const openGateDate = new Date(scheduleDate.getTime() - 60 * 60 * 1000); 

            // Logic Pengecekan:
            // 1. Jika User sudah Check-in (sedang kerja), maka sesi Check-out harus SELALU aktif.
            // 2. Jika Belum Check-in, cek apakah waktu sekarang >= waktu buka gate.
            if (checkInStatus !== "Belum Check-in") {
                setIsSessionActive(true);
                setTimeToStart("");
            } else {
                if (now >= openGateDate) {
                    setIsSessionActive(true);
                    setTimeToStart("");
                } else {
                    setIsSessionActive(false);
                    // Hitung mundur sederhana untuk display di tombol (opsional)
                    const diffMs = openGateDate.getTime() - now.getTime();
                    const diffMins = Math.ceil(diffMs / 60000);
                    
                    if (diffMins > 60) {
                        const hours = Math.floor(diffMins / 60);
                        setTimeToStart(`${hours} jam lagi`);
                    } else {
                        setTimeToStart(`${diffMins} menit lagi`);
                    }
                }
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [checkInStatus]); // Re-run effect jika status check-in berubah

    // --- EFFECT: Load Mock Data ---
    useEffect(() => {
        setTimeout(() => {
            setStats(MOCK_STATS);
            setEmployeeDetails(MOCK_EMPLOYEE_DETAILS);
            setIsLoading(false);
        }, 1500);
    }, []);

    // Tentukan aksi selanjutnya berdasarkan status
    const actionRequired = checkInStatus === "Belum Check-in" ? "Check-in" : (checkOutStatus === "Belum Check-out" ? "Check-out" : "Selesai");

    // --- HANDLER: Trigger Absensi (GPS) ---
    const handleAttendance = async () => {
        if (!employeeDetails) return;
        
        setIsAttendanceLoading(true);
        // Reset state modal jika ini adalah retry
        setLocationDistance(null);
        setIsInRange(false);

        try {
            // 1. Ambil Lokasi Browser
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { 
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
            });
            
            const { latitude, longitude } = position.coords;
            
            // 2. Hitung Jarak
            const dist = calculateDistance(latitude, longitude, employeeDetails.officeLat, employeeDetails.officeLon);
            setLocationDistance(Math.round(dist));

            // 3. Validasi Jarak
            if (dist > employeeDetails.maxDistance) {
                setIsInRange(false);
                setIsAttendanceLoading(false);
                toast.current?.show({ severity: "error", summary: "Jarak Terlalu Jauh", detail: "Anda berada di luar area kantor.", life: 3000 });
                return;
            }

            // 4. Jika Valid
            setIsInRange(true);

            // Simulasi API Latency
            setTimeout(() => {
                const now = new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });
                
                if (checkInStatus === "Belum Check-in") {
                    // Logika Check-In
                    setCheckInStatus(now);
                    
                    // Cek Terlambat
                    const [h, m] = now.split(':').map(Number);
                    const [schH, schM] = mockJadwalKerja.jamMasuk.split(':').map(Number);
                    if (h > schH || (h === schH && m > schM + 5)) setIsLate(true);
                    
                    toast.current?.show({ severity: "success", summary: "Check-in Berhasil", detail: `Selamat bekerja! Masuk pukul ${now}`, life: 3000 });
                } else {
                    // Logika Check-Out
                    setCheckOutStatus(now);
                    toast.current?.show({ severity: "success", summary: "Check-out Berhasil", detail: `Terima kasih! Pulang pukul ${now}`, life: 3000 });
                }
                
                setIsAttendanceLoading(false);
                setDisplayModal(false);
            }, 1500);

        } catch (e) {
            setIsAttendanceLoading(false);
            toast.current?.show({ severity: "error", summary: "Gagal GPS", detail: "Pastikan GPS aktif dan izin lokasi diberikan.", life: 3000 });
        }
    };

    // Handler klik tombol di Card
    const onAttendanceClick = () => {
        // Double check session (untuk keamanan ekstra)
        if (!isSessionActive && actionRequired === "Check-in") {
             toast.current?.show({ severity: "warn", summary: "Sesi Belum Dibuka", detail: "Silakan tunggu hingga jam absen dibuka.", life: 3000 });
             return;
        }
        setDisplayModal(true);
        handleAttendance(); // Langsung trigger GPS saat modal dibuka
    };

    // --- RENDER LOADING SKELETON ---
    if (isLoading) {
        return (
            <div className="p-3 md:p-4 max-w-7xl mx-auto">
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

    // --- RENDER MAIN UI ---
    return (
        <div className="min-h-screen surface-ground p-3 md:p-6 font-primary">
            <Toast ref={toast} />

            <div className="max-w-7xl mx-auto">
                {/* 1. Header (Salam & Jam) */}
                <DashboardHeader 
                    user={user} 
                    employeeDetails={employeeDetails} 
                    currentTime={currentTime} 
                />

                {/* 2. Statistik Ringkas */}
                <StatsGrid stats={stats} />

                <div className="grid">
                    {/* 3. Kolom Kiri: Kartu Absensi Utama */}
                    <div className="col-12 lg:col-8">
                        <AttendanceCard 
                            employeeDetails={employeeDetails}
                            checkInStatus={checkInStatus}
                            checkOutStatus={checkOutStatus}
                            isLate={isLate}
                            actionRequired={actionRequired}
                            // Data Shift & Sesi
                            shiftName={mockJadwalKerja.shiftName}
                            scheduleIn={mockJadwalKerja.jamMasuk}
                            scheduleOut={mockJadwalKerja.jamKeluar}
                            // Status Validasi Sesi
                            isSessionActive={isSessionActive}
                            timeToStart={timeToStart}
                            // Action
                            onAttendanceClick={onAttendanceClick}
                        />
                    </div>

                    {/* 4. Kolom Kanan: Menu Cepat */}
                    <div className="col-12 lg:col-4">
                        <QuickMenu />
                    </div>
                </div>

                {/* 5. Modal Verifikasi Lokasi */}
                <AttendanceModal 
                    visible={displayModal}
                    onHide={() => !isAttendanceLoading && setDisplayModal(false)}
                    isLoading={isAttendanceLoading}
                    isInRange={isInRange}
                    distance={locationDistance}
                    maxDistance={employeeDetails.maxDistance}
                    officeName={employeeDetails.officeName}
                    actionRequired={actionRequired}
                    onConfirm={handleAttendance}
                />
            </div>
        </div>
    );
}