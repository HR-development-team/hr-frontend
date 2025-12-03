import React from "react";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { EmployeeDetails } from "./types";

interface AttendanceCardProps {
    employeeDetails: EmployeeDetails;
    checkInStatus: string;
    checkOutStatus: string;
    isLate: boolean;
    actionRequired: string;
    shiftName: string;
    scheduleIn: string;
    scheduleOut: string;
    isSessionActive: boolean;
    timeToStart?: string; 
    
    onAttendanceClick: () => void;
}

export default function AttendanceCard({ 
    employeeDetails, 
    checkInStatus, 
    checkOutStatus, 
    isLate, 
    actionRequired,
    shiftName,
    scheduleIn,
    scheduleOut,
    isSessionActive, // Props baru
    timeToStart,     // Props baru
    onAttendanceClick 
}: AttendanceCardProps) {
    
    // Helper untuk menentukan style tombol
    const getButtonContent = () => {
        if (!isSessionActive && actionRequired === "Check-in") {
            return {
                label: `Sesi Belum Dibuka`,
                subLabel: `Dibuka ${timeToStart}`,
                icon: "pi pi-lock",
                className: "bg-gray-400 border-gray-400 cursor-auto opacity-60", // Style Disabled
                disabled: true
            };
        }
        
        if (actionRequired === 'Check-in') {
            return {
                label: "Tap untuk Check-in",
                subLabel: "Pastikan Anda berada di lokasi kantor",
                icon: "pi pi-fingerprint",
                className: "bg-indigo-600 border-indigo-600 hover:bg-indigo-700",
                disabled: false
            };
        } else {
            return {
                label: "Tap untuk Check-out",
                subLabel: "Selesaikan pekerjaan hari ini",
                icon: "pi pi-sign-out",
                className: "bg-orange-500 border-orange-500 hover:bg-orange-600",
                disabled: false
            };
        }
    };

    const buttonConfig = getButtonContent();

    return (
        <div className="surface-card shadow-2 border-round-3xl p-0 h-full overflow-hidden relative">
            <div className="p-3 md:p-4 border-bottom-1 surface-border flex justify-content-between align-items-center bg-gray-50">
                <div className="flex align-items-center gap-2">
                    <i className="pi pi-id-card text-indigo-600 text-xl"></i>
                    <span className="font-bold text-gray-800">Absensi & Lokasi</span>
                </div>
                {/* Status Aktif/Tidak di Header */}
                <Tag 
                    value={isSessionActive ? "Sesi Aktif" : "Belum Mulai"} 
                    severity={isSessionActive ? "success" : "warning"} 
                    className="text-xs" 
                    rounded
                ></Tag>
            </div>

            <div className="p-3 md:p-5">
                
                {/* 1. LOCATION CONTEXT */}
                <div className="bg-blue-50 border-blue-100 border-1 border-round-xl p-3 mb-3 flex flex-column md:flex-row gap-3 align-items-start md:align-items-center">
                   {/* ... (Code lokasi sama seperti sebelumnya) ... */}
                   <div className="bg-white p-2 border-round-lg shadow-1 text-blue-600 min-w-min hidden md:block">
                        <i className="pi pi-building text-2xl"></i>
                    </div>
                    <div className="flex-grow-1 w-full">
                        <p className="text-xs font-bold text-blue-600 uppercase m-0 tracking-wide mb-1">
                            Lokasi Kantor
                        </p>
                        <p className="font-bold text-gray-900 m-0 text-sm md:text-base">{employeeDetails.officeName}</p>
                        <p className="text-xs md:text-sm text-gray-600 m-0 mt-1 line-height-3">{employeeDetails.officeAddress}</p>
                    </div>
                </div>

                {/* 2. SESSION INFO */}
                <div className={`border-1 border-round-xl p-3 mb-4 flex align-items-center gap-3 ${isSessionActive ? 'bg-purple-50 border-purple-100' : 'bg-gray-100 border-gray-200 opacity-70'}`}>
                     <div className={`p-2 border-round-lg shadow-1 flex-shrink-0 bg-white ${isSessionActive ? 'text-purple-600' : 'text-gray-500'}`}>
                         <i className="pi pi-calendar-clock text-xl"></i>
                     </div>
                     <div>
                         <p className={`text-xs font-bold uppercase m-0 tracking-wide mb-1 ${isSessionActive ? 'text-purple-600' : 'text-gray-500'}`}>
                             Sesi Absensi
                         </p>
                         <div className="font-bold text-gray-900 text-sm md:text-base">
                             {shiftName} 
                             <span className="hidden md:inline mx-2 text-gray-400">|</span>
                             <span className="block md:inline text-gray-600 font-medium text-xs md:text-sm mt-1 md:mt-0">
                                {scheduleIn} - {scheduleOut} WIB
                             </span>
                         </div>
                     </div>
                </div>

                {/* 3. TIME STATUS */}
                <div className="grid mb-4">
                     {/* ... (Code Time Status sama seperti sebelumnya) ... */}
                     <div className="col-6">
                        <div className="text-center md:text-left">
                            <span className="text-xs font-semibold text-gray-500 uppercase">Jam Masuk</span>
                            <div className="flex align-items-center justify-content-center md:justify-content-start gap-2 mt-1">
                                <span className={`text-xl md:text-2xl font-bold ${checkInStatus !== "Belum Check-in" ? 'text-green-600' : 'text-gray-400'}`}>
                                    {checkInStatus}
                                </span>
                                {isLate && <i className="pi pi-exclamation-triangle text-red-500" title="Terlambat"></i>}
                            </div>
                            <small className="text-xs text-gray-400 block mt-1">Jadwal: {scheduleIn}</small>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="text-center md:text-left">
                            <span className="text-xs font-semibold text-gray-500 uppercase">Jam Pulang</span>
                            <div className="flex align-items-center justify-content-center md:justify-content-start gap-2 mt-1">
                                <span className={`text-xl md:text-2xl font-bold ${checkOutStatus !== "Belum Check-out" ? 'text-orange-600' : 'text-gray-400'}`}>
                                    {checkOutStatus}
                                </span>
                            </div>
                             <small className="text-xs text-gray-400 block mt-1">Jadwal: {scheduleOut}</small>
                        </div>
                    </div>
                </div>

                {/* 4. ACTION BUTTON (UPDATED) */}
                {actionRequired !== "Selesai" ? (
                    <Button
                        onClick={onAttendanceClick}
                        disabled={buttonConfig.disabled} // LOGIC DISABLE TOMBOL
                        className={`w-full p-3 md:p-4 text-lg border-round-xl shadow-2 transition-transform transition-duration-200 ${!buttonConfig.disabled && 'active:scale-95'} flex justify-content-center gap-2 ${buttonConfig.className}`}
                    >
                        <i className={`${buttonConfig.icon} text-xl md:text-2xl`}></i>
                        <div className="flex flex-column text-left">
                            <span className="font-bold line-height-2 text-base md:text-lg">{buttonConfig.label}</span>
                            <span className="text-xs font-normal opacity-90 hidden md:inline">{buttonConfig.subLabel}</span>
                        </div>
                    </Button>
                ) : (
                    <div className="w-full p-4 bg-green-50 text-green-700 border-1 border-green-200 border-round-xl flex align-items-center justify-content-center gap-2">
                        <i className="pi pi-check-circle text-xl"></i>
                        <span className="font-semibold text-sm md:text-base">Absensi hari ini selesai.</span>
                    </div>
                )}
            </div>
        </div>
    );
}