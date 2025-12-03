import React, { useState, useEffect } from "react";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";

// Pastikan types sudah didefinisikan di file terpisah atau di sini
import { EmployeeDetails } from "./types"; 

interface DashboardHeaderProps {
    user: any; 
    employeeDetails: EmployeeDetails;
    currentTime: string;
}

export default function DashboardHeader({ user, employeeDetails, currentTime }: DashboardHeaderProps) {
    // 1. Logika Nama
    const initialName = user?.full_name?.charAt(0) || "U";
    const firstName = user?.full_name?.split(' ')[0] || "User";

    // 2. State untuk Tanggal & Motivasi
    const [currentDate, setCurrentDate] = useState<string>("");
    const [motivation, setMotivation] = useState<string>("");

    useEffect(() => {
        const date = new Date();
        
        // Format Tanggal (Indonesia)
        const options: Intl.DateTimeFormatOptions = { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        };
        setCurrentDate(date.toLocaleDateString('id-ID', options));

        // Logika Kata-kata Motivasi Acak
        const quotes = [
            "Jadikan hari ini lebih baik dari kemarin. ✨",
            "Kerja keras tidak akan mengkhianati hasil. 💪",
            "Kesuksesan dimulai dari niat yang kuat. 🚀",
            "Setiap langkah kecil membawa perubahan besar. 🌱",
            "Tetap fokus dan jangan lupa tersenyum! 😊",
            "Peluang tidak ditunggu, tapi diciptakan. 🔥",
            "Mimpi besar dimulai dari langkah pertama. 🌟",
            "Konsistensi adalah kunci keberhasilan. 🔑"
        ];
        
        // Pilih satu quote secara acak
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setMotivation(randomQuote);

    }, []);

    return (
        <div className="surface-card p-4 md:p-5 shadow-4 border-round-3xl mb-5 flex flex-column md:flex-row justify-content-between align-items-center gap-4 relative overflow-hidden border-1 surface-border transition-all transition-duration-300 hover:shadow-6">
            
            {/* --- DECORATIVE BACKGROUND (Optional) --- */}
            {/* Menggunakan inline style untuk blur karena PrimeFlex standard tidak punya utility blur yang kuat */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-10rem h-10rem bg-indigo-50 border-circle opacity-60 pointer-events-none" style={{ filter: 'blur(40px)' }}></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-10rem h-10rem bg-purple-50 border-circle opacity-60 pointer-events-none" style={{ filter: 'blur(40px)' }}></div>

            {/* --- BAGIAN KIRI: PROFILE --- */}
            <div className="flex align-items-center gap-4 w-full md:w-auto z-1 relative">
                
                {/* Avatar Wrapper */}
                <div className="relative">
                    <Avatar 
                        label={initialName} 
                        size="xlarge" 
                        shape="circle" 
                        className="shadow-4 font-bold border-2 border-white text-white"
                        style={{ 
                            width: '5rem', 
                            height: '5rem', 
                            fontSize: '2rem', 
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' 
                        }}
                    />
                    {/* Status Dot */}
                    <div className="absolute bottom-0 right-0 mb-1 mr-1 w-1rem h-1rem bg-white border-circle flex align-items-center justify-content-center">
                        <span className="block w-1rem h-1rem bg-green-500 border-circle border-2 border-white"></span>
                    </div>
                </div>

                <div className="flex flex-column">
                    {/* Sapaan & Nama User Satu Baris */}
                    <h1 className="text-2xl md:text-3xl font-bold text-900 m-0 mb-1 line-height-2">
                        <span className="font-medium text-500 text-xl md:text-2xl mr-2">Selamat Datang,</span>
                        {firstName}
                    </h1>

                    {/* Kata Motivasi Dinamis */}
                    <p className="m-0 mb-3 text-sm font-medium font-italic text-indigo-500" style={{ maxWidth: '400px' }}>
                        "{motivation}"
                    </p>
                    
                    {/* Badges Info */}
                    <div className="flex flex-wrap align-items-center gap-2">
                        {/* Position Badge (Manual Styling dengan PrimeFlex) */}
                        <div className="surface-100 border-1 surface-border px-3 py-1 border-round-2xl flex align-items-center gap-2 text-600 text-xs font-semibold hover:surface-200 transition-colors cursor-default">
                            <i className="pi pi-briefcase text-indigo-500" style={{ fontSize: '0.8rem' }}></i>
                            <span>{employeeDetails.position}</span>
                        </div>
                        
                        {/* Division Badge (Menggunakan component Tag PrimeReact) */}
                        <Tag 
                            value={employeeDetails.division} 
                            icon="pi pi-map-marker"
                            className="bg-indigo-50 text-indigo-700 border-1 border-indigo-100 font-semibold px-2 py-1"
                            rounded
                        ></Tag>
                    </div>
                </div>
            </div>

            {/* --- BAGIAN KANAN: WIDGET JAM & TANGGAL --- */}
            <div className="w-full md:w-auto z-1 relative">
                <div className="surface-900 border-round-2xl p-4 md:p-5 flex align-items-center justify-content-between gap-5 shadow-4 text-white hover:shadow-6 transition-all transition-duration-300 transform hover:-translate-y-1" style={{ background: '#0f172a' }}>
                    
                    <div className="flex flex-column">
                        {/* Tanggal */}
                        <div className="flex align-items-center gap-2 text-400 text-xs font-bold uppercase mb-1 letter-spacing-1">
                            <i className="pi pi-calendar" style={{ fontSize: '0.75rem' }}></i>
                            <span>{currentDate || "Memuat..."}</span>
                        </div>
                        
                        {/* Jam Digital */}
                        <div className="flex align-items-baseline gap-2">
                            <span className="text-3xl md:text-4xl font-bold font-monospace text-white">
                                {currentTime}
                            </span>
                            <span className="text-sm font-semibold text-indigo-400 surface-800 px-2 py-1 border-round">WIB</span>
                        </div>
                    </div>
                    
                    {/* Icon Jam Estetik */}
                    <div className="w-3rem h-3rem md:w-4rem md:h-4rem border-round-xl flex align-items-center justify-content-center shadow-4" 
                         style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
                        <i className="pi pi-clock text-white text-xl md:text-2xl opacity-90"></i>
                    </div>
                </div>
            </div>
        </div>
    );
}