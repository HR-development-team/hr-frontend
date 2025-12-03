import React from "react";
import Link from "next/link";

export default function QuickMenu() {
    const menuItems = [
        { href: "/karyawan/Absensi", icon: "pi-history", color: "text-indigo-500", label: "Riwayat" },
        { href: "/karyawan/Pengajuan/cuti", icon: "pi-envelope", color: "text-purple-500", label: "Izin/Cuti" },
        { href: "/karyawan/SlipGaji", icon: "pi-wallet", color: "text-green-500", label: "Slip Gaji" },
        { href: "/karyawan/Profil", icon: "pi-user", color: "text-blue-500", label: "Profil" },
    ];

    return (
        <div className="flex flex-column gap-4 h-full">
            <div className="surface-card shadow-2 border-round-3xl p-4">
                <h3 className="text-base font-bold text-gray-800 m-0 mb-3 uppercase tracking-wide">Menu Cepat</h3>
                <div className="grid">
                    {menuItems.map((item, index) => (
                        <div className="col-6" key={index}>
                            <Link href={item.href} className="no-underline">
                                <div className="surface-ground hover:surface-200 active:surface-300 border-1 surface-border p-3 border-round-xl cursor-pointer text-center h-full flex flex-column align-items-center gap-2 transition-duration-100 active:scale-95">
                                    <i className={`pi ${item.icon} text-xl ${item.color}`}></i>
                                    <span className="text-xs font-semibold text-gray-700">{item.label}</span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

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
    );
}