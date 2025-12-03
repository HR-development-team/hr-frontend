import React from "react";
import { ProgressBar } from "primereact/progressbar";
import { RingkasanStats } from "./types";

interface StatsGridProps {
    stats: RingkasanStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
    const cutiPercentage = Math.round(((stats.totalJatahCuti - stats.sisaCuti) / stats.totalJatahCuti) * 100);

    return (
        <div className="grid mb-4 md:mb-5">
            {/* Total Hadir */}
            <div className="col-12 md:col-4">
                <div className="surface-card shadow-1 p-3 md:p-4 border-round-2xl border-left-3 md:border-left-0 md:border-bottom-3 border-green-500 h-full hover:shadow-3 transition-all transition-duration-300 cursor-pointer flex justify-content-between md:block align-items-center">
                    <div className="flex justify-content-between align-items-start md:mb-2 flex-column md:flex-row">
                        <span className="text-gray-500 font-medium text-sm">Total Hadir</span>
                        <div className="bg-green-100 text-green-600 border-circle w-2rem h-2rem hidden md:flex align-items-center justify-content-center">
                            <i className="pi pi-check text-sm"></i>
                        </div>
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">{stats.totalHadir} <span className="text-sm font-normal text-gray-500">Hari</span></div>
                    <i className="pi pi-check-circle text-green-500 text-2xl md:hidden block"></i>
                </div>
            </div>

            {/* Absen / Tidak Hadir */}
            <div className="col-6 md:col-4">
                <div className="surface-card shadow-1 p-3 md:p-4 border-round-2xl border-bottom-3 border-orange-500 h-full hover:shadow-3 transition-all transition-duration-300 cursor-pointer">
                    <div className="flex justify-content-between align-items-start mb-2">
                        <span className="text-gray-500 font-medium text-sm">Absen</span>
                        <div className="bg-orange-100 text-orange-600 border-circle w-2rem h-2rem flex align-items-center justify-content-center">
                            <i className="pi pi-info-circle text-sm"></i>
                        </div>
                    </div>
                    <div className="text-xl md:text-3xl font-bold text-gray-900">{stats.totalTidakHadir} <span className="text-xs md:text-sm font-normal text-gray-500">Hari</span></div>
                </div>
            </div>

            {/* Sisa Cuti */}
            <div className="col-6 md:col-4">
                <div className="surface-card shadow-1 p-3 md:p-4 border-round-2xl border-bottom-3 border-blue-500 h-full hover:shadow-3 transition-all transition-duration-300 cursor-pointer">
                    <div className="flex justify-content-between align-items-start mb-3">
                        <span className="text-gray-500 font-medium text-sm">Sisa Cuti</span>
                        <div className="bg-blue-100 text-blue-600 border-circle w-2rem h-2rem flex align-items-center justify-content-center">
                            <i className="pi pi-calendar text-sm"></i>
                        </div>
                    </div>
                    <div className="flex flex-column md:flex-row align-items-start md:align-items-end gap-1 md:gap-2 mb-2">
                        <span className="text-xl md:text-3xl font-bold text-gray-900">{stats.sisaCuti}</span>
                        <span className="text-xs md:text-sm text-gray-500 mb-1">/ {stats.totalJatahCuti}</span>
                    </div>
                    <ProgressBar value={cutiPercentage} showValue={false} style={{ height: '4px' }} color="var(--blue-500)" className="bg-blue-50" />
                </div>
            </div>
        </div>
    );
}