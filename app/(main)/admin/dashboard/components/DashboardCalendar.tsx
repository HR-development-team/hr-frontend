"use client";

import { Card } from "primereact/card";
import { useEffect, useState } from "react";
import { Skeleton } from "primereact/skeleton";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { addLocale, locale } from "primereact/api";
import { Button } from "primereact/button"; 
import 'primeicons/primeicons.css'; 

export default function DashboardCalendar() {
  const [date, setDate] = useState<Date | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    addLocale('id', {
        firstDayOfWeek: 1,
        dayNames: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
        dayNamesShort: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
        dayNamesMin: ['Mi', 'Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb'],
        monthNames: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
        today: 'Hari ini',
        clear: 'Hapus'
    });
    locale('id');

    // Jam Digital
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!date) {
    return (
      <Card className="surface-0 shadow-2 border-round-2xl h-full border-none">
        <Skeleton height="100%" className="min-h-15rem" />
      </Card>
    );
  }

  const timeString = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const secondString = date.toLocaleTimeString("id-ID", {
    second: "2-digit",
  });

  const dialogHeader = (
    <div className="flex align-items-center justify-content-between w-full pt-2 px-2">
        <span className="text-lg font-bold text-gray-800">Kalender Agenda</span>
        <Button 
            icon="pi pi-times" 
            text 
            rounded 
            severity="secondary" 
            aria-label="Close" 
            onClick={() => setVisible(false)} 
        />
    </div>
  );

  return (
    <>
      {/* --- KARTU UTAMA --- */}
      <Card 
        className="
            relative h-full overflow-hidden border-none border-round-2xl cursor-pointer 
            surface-card shadow-2 
            transition-all transition-duration-300 
            hover:shadow-4 hover:-translate-y-1
        "
        onClick={() => setVisible(true)}
      >
        {/* Background Mesh */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none"
             style={{
                background: `radial-gradient(circle at 100% 0%, #dbeafe 0%, transparent 50%), 
                             radial-gradient(circle at 0% 100%, #eff6ff 0%, transparent 50%)`
             }}
        />

        {/* Icon Background */}
        <i className="pi pi-calendar absolute -bottom-4 -right-4 text-blue-500 opacity-10" 
           style={{ fontSize: '8rem', transform: 'rotate(-15deg)' }}>
        </i>

        {/* KONTEN UTAMA */}
        <div className="flex flex-column h-full justify-content-center align-items-center relative z-2 gap-3 py-3">
          
          {/* Bagian Tanggal */}
          <div className="text-center">
            {/* Hari (Badge) */}
            <span className="inline-block px-2 py-1 mb-2 text-xs font-bold tracking-wider text-blue-600 uppercase bg-blue-50 border-round-md">
              {date.toLocaleDateString("id-ID", { weekday: "long" })}
            </span>

            {/* Tanggal & Bulan */}
            <div className="flex align-items-center justify-content-center gap-2 text-gray-800">
                <span className="text-4xl font-bold">{date.getDate()}</span>
                <div className="flex flex-column align-items-start line-height-1">
                    <span className="text-base font-semibold">{date.toLocaleDateString("id-ID", { month: "long" })}</span>
                    <span className="text-xs text-gray-500">{date.getFullYear()}</span>
                </div>
            </div>
          </div>

          {/* Garis Pembatas */}
          <div className="w-6 border-top-1 border-gray-100"></div>

          {/* Bagian Jam */}
          <div className="text-center">
            <div className="flex align-items-baseline justify-content-center text-blue-600 line-height-1">
                <span className="text-5xl font-bold tracking-tight">{timeString}</span>
                <span className="text-lg font-medium opacity-60 ml-1">{secondString}</span>
            </div>
            <p className="m-0 mt-2 text-xs text-gray-400 font-medium tracking-wide uppercase" style={{fontSize: '0.65rem'}}>
                Waktu Indonesia Barat
            </p>
          </div>
        </div>
      </Card>

      {/* --- POPUP KALENDER (DIALOG) --- */}
      <Dialog 
        visible={visible} 
        onHide={() => setVisible(false)}
        className="w-full md:w-auto"
        style={{ maxWidth: '90vw' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        showHeader={false}
        contentClassName="border-round-2xl shadow-none p-0 overflow-hidden"
        maskClassName="backdrop-blur-sm bg-black-alpha-40"
        dismissableMask
        modal
      >
        <div className="bg-white p-3">
            {dialogHeader}
            
            <div className="flex justify-content-center mt-2">
                <Calendar 
                    value={date} 
                    onChange={(e) => setDate(e.value as Date)} 
                    inline 
                    locale="id"
                    className="w-full border-none shadow-none"
                    panelClassName="border-none shadow-none w-full"
                />
            </div>

            <div className="border-top-1 border-gray-100 pt-2 mt-2 flex justify-content-end">
                <Button label="Tutup" link onClick={() => setVisible(false)} size="small" className="text-sm" />
                <Button label="Hari Ini" size="small" className="text-sm" onClick={() => setDate(new Date())} />
            </div>
        </div>
      </Dialog>
    </>
  );
}