"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

// 🔗 API
const API_URLS = {
    dashboard: "/api/karyawan/dashboard",
    history: "/api/karyawan/attendances/history"
};

// 🎨 CARD STYLE
const cardStyle = {
    borderRadius: "18px",
    padding: "1.2rem",
    boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
    border: "1px solid rgba(0,0,0,0.03)",
    transition: "0.25s",
};

const cardHover = {
    transform: "translateY(-4px)",
    boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
};

interface RingkasanStats {
    totalHadir: number;
    totalTidakHadir: number;
    sisaCuti: number;
}

export default function DashboardRingkasanPage() {
    const toast = useRef<Toast>(null);
    const { user } = useAuth();

    const [stats, setStats] = useState<RingkasanStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [checkInStatus, setCheckInStatus] = useState<string>("Belum Check-in");
    const [checkOutStatus, setCheckOutStatus] = useState<string>("Belum Check-out");

    // Convert ISO date "2025-11-19T08:30:39.000Z" → "08:30"
    const formatTime = (iso: string | null) => {
        if (!iso) return null;
        const d = new Date(iso);
        return d.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);

            try {
                const [resDashboard, resHistory] = await Promise.all([
                    fetch(API_URLS.dashboard),
                    fetch(API_URLS.history),
                ]);

                // --- DASHBOARD ---
                if (!resDashboard.ok) throw new Error("Gagal memuat data dashboard");
                const dataDashboard = await resDashboard.json();

                if (dataDashboard.status === "00") {
                    setStats({
                        totalHadir: dataDashboard.master_employees.totalAttendance,
                        totalTidakHadir: dataDashboard.master_employees.totalNotAttend,
                        sisaCuti: 8,
                    });
                }

                // --- HISTORY ABSENSI HARI INI ---
                if (!resHistory.ok) throw new Error("Gagal memuat data absensi hari ini");

                const dataHistory = await resHistory.json();

                if (dataHistory.status === "03") {
                    // Tidak ada absensi hari ini
                    setCheckInStatus("Belum Check-in");
                    setCheckOutStatus("Belum Check-out");
                } else if (dataHistory.status === "00") {
                    // Ada data absensi
                    const record = dataHistory.attendances?.[0];

                    if (record) {
                        const checkIn = formatTime(record.check_in_time);
                        const checkOut = formatTime(record.check_out_time);

                        setCheckInStatus(checkIn ?? "Belum Check-in");
                        setCheckOutStatus(checkOut ?? "Belum Check-out");
                    }
                }

            } catch (error) {
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: (error as Error).message,
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // LOADING UI
    if (isLoading) {
        return (
            <div>
                <Skeleton width="18rem" height="2.2rem" className="mb-3" />
                <Skeleton width="14rem" height="1.5rem" />

                <div className="grid mt-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="col-12 md:col-4">
                            <Card style={cardStyle}>
                                <Skeleton width="100%" height="80px" />
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div>
            <Toast ref={toast} />

            {/* HEADER */}
            <div className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-[1px] shadow-lg mb-4">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Selamat Datang,{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                {user?.full_name ?? "Karyawan"}
                            </span>{" "}
                            👋
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                            Berikut ringkasan aktivitas terbaru Anda ✨
                        </p>
                    </div>
                </div>
            </div>

            <Divider />

            {/* STAT CARDS */}
            <div className="grid">
                <div className="col-12 md:col-4">
                    <Card
                        style={cardStyle}
                        className="cursor-pointer"
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
                    >
                        <div className="flex align-items-center">
                            <div className="bg-green-100 p-3 border-circle mr-3">
                                <i className="pi pi-check-circle text-green-600 text-2xl"></i>
                            </div>
                            <div>
                                <span className="text-600">Total Hadir</span>
                                <h2 className="m-0 mt-1 text-2xl font-semibold">{stats.totalHadir} Hari</h2>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-12 md:col-4">
                    <Card
                        style={cardStyle}
                        className="cursor-pointer"
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
                    >
                        <div className="flex align-items-center">
                            <div className="bg-orange-100 p-3 border-circle mr-3">
                                <i className="pi pi-times-circle text-orange-600 text-2xl"></i>
                            </div>
                            <div>
                                <span className="text-600">Tidak Hadir</span>
                                <h2 className="m-0 mt-1 text-2xl font-semibold">{stats.totalTidakHadir} Hari</h2>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-12 md:col-4">
                    <Card
                        style={cardStyle}
                        className="cursor-pointer"
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
                    >
                        <div className="flex align-items-center">
                            <div className="bg-blue-100 p-3 border-circle mr-3">
                                <i className="pi pi-calendar text-blue-600 text-2xl"></i>
                            </div>
                            <div>
                                <span className="text-600">Sisa Cuti</span>
                                <h2 className="m-0 mt-1 text-2xl font-semibold">{stats.sisaCuti} Hari</h2>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* STATUS ABSENSI HARI INI */}
            <div className="grid mt-4">
                <div className="col-12 lg:col-8">
                    <Panel header="🟩 Status Absensi Hari Ini" className="shadow-2 border-round-xl">
                        <div className="grid">
                            {/* CHECK-IN */}
                            <div className="col-12 md:col-6">
                                <Card className="border-round-xl shadow-1 p-3">
                                    <div className="flex align-items-center gap-3">
                                        <span className="bg-green-100 text-green-600 p-3 border-circle">
                                            <i className="pi pi-sign-in text-xl"></i>
                                        </span>
                                        <div>
                                            <p className="m-0 text-sm text-gray-600">Check-in</p>
                                            <h2 className="m-0 text-xl font-semibold">{checkInStatus}</h2>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* CHECK-OUT */}
                            <div className="col-12 md:col-6">
                                <Card className="border-round-xl shadow-1 p-3">
                                    <div className="flex align-items-center gap-3">
                                        <span className="bg-blue-100 text-blue-600 p-3 border-circle">
                                            <i className="pi pi-sign-out text-xl"></i>
                                        </span>
                                        <div>
                                            <p className="m-0 text-sm text-gray-600">Check-out</p>
                                            <h2 className="m-0 text-xl font-semibold">{checkOutStatus}</h2>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </Panel>
                </div>

                {/* AKSES CEPAT */}
                <div className="col-12 lg:col-4">
                    <Panel header="Akses Cepat" className="shadow-2 border-round-xl">
                        <div className="flex flex-column gap-3">
                            <Link href="/karyawan/Absensi">
                                <Button label="Lakukan Absensi" icon="pi pi-clock" className="w-full p-button-primary p-button-raised" />
                            </Link>

                            <Link href="/karyawan/Pengajuan/cuti">
                                <Button label="Ajukan Cuti" icon="pi pi-file-edit" className="w-full p-button-outlined" />
                            </Link>

                            <Link href="/karyawan/Profil">
                                <Button label="Lihat Profil" icon="pi pi-user" className="w-full p-button-secondary p-button-outlined" />
                            </Link>
                        </div>
                    </Panel>
                </div>
            </div>
        </div>
    );
}
