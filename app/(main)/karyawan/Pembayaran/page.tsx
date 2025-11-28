"use client";

// --- PRIME REACT CSS ---
import "primereact/resources/themes/lara-light-blue/theme.css"; 
import "primereact/resources/primereact.min.css";               
import "primeicons/primeicons.css";                             
import "primeflex/primeflex.css";                               

import React, { useState, useRef, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Skeleton } from "primereact/skeleton"; 
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// --- IMPORT KOMPONEN & TYPES ---
import PayrollSlipContent from "./components/PayrollSlipContent";
import { Payroll } from "@/lib/types/payroll"; 
import { getPayrollData } from "@/lib/types/payrollService"; 

const PayrollPage: React.FC = () => {
  const employeeId = 3; 
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [selectedPayrollId, setSelectedPayrollId] = useState<number|string|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  
  const slipRef = useRef<HTMLDivElement>(null);

  const formatRupiah = (val: number | undefined) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val || 0);
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPayrollData(employeeId.toString());
        setPayrolls(data);
        if (data.length > 0) setSelectedPayrollId(data[0].id);
      } catch (err: any) {
        console.error("Error:", err);
        setError("Gagal memuat data slip gaji.");
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const selectedPayroll = payrolls.find(p => p.id === selectedPayrollId) || null;

  const handlePrint = () => {
    window.print();
  };
  
  const handleExportPDF = async () => {
    if (!slipRef.current) return;
    try {
      const canvas = await html2canvas(slipRef.current, { 
        scale: 2, 
        useCORS: true,
        windowWidth: 1200 
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      pdf.addImage(imgData, "PNG", (pdfWidth - imgWidth * ratio) / 2, 30, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`E-Payslip_${selectedPayroll?.period_label || "Periode"}.pdf`);
    } catch (e) {
      console.error(e);
      alert("Gagal mendownload PDF");
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans">
       
       <style>{`
        /* CSS KHUSUS PRINT */
        @media print {
          body * { visibility: hidden; }
          #slip-to-print, #slip-to-print * { visibility: visible; }
          #slip-to-print {
            position: absolute; left: 0; top: 0; width: 100%;
            margin: 0; padding: 0; background-color: white !important;
          }
          .no-print { display: none !important; }
        }

        /* --- LOGIC MOBILE FIT SCREEN (UPDATED) --- */
        
        .slip-content-wrapper {
            width: 100%;
        }

        /* Mobile (< 768px) */
        @media screen and (max-width: 768px) {
            .slip-mobile-container {
                width: 100%;
                overflow: hidden; /* Mencegah scrollbar muncul */
                display: flex;
                justify-content: center; /* Pastikan selalu di tengah */
                background-color: #f8f9fa; 
                padding: 10px 0;
            }

            .slip-content-wrapper {
                /* Lebar asli A4 */
                width: 794px;
                min-width: 794px;
                
                /* UPDATED SCALE: 0.41 (325px width actual) aman untuk layar 360px+ */
                transform: scale(0.41);
                transform-origin: top center; 
                
                /* Kompensasi ruang kosong vertikal akibat pengecilan */
                margin-bottom: -600px; 
            }
        }
      `}</style>

      {/* --- HEADER SECTION --- */}
      <div className="flex flex-column md:flex-row justify-content-between align-items-center mb-5 no-print gap-3">
        <div className="flex align-items-center gap-3 w-full md:w-auto">
            <div className="bg-blue-50 p-3 border-round-xl shadow-1 flex align-items-center justify-content-center">
                <i className="pi pi-receipt text-blue-600 text-2xl"></i>
            </div>
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 m-0">E-Payslip Digital</h1>
                <span className="text-gray-500 text-sm">Arsip pendapatan & tunjangan resmi</span>
            </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto p-2 bg-white border-round shadow-1 align-items-center">
            <Dropdown
                options={payrolls.map(p => ({ label: p.period_label, value: p.id }))}
                value={selectedPayrollId}
                onChange={e => setSelectedPayrollId(e.value)}
                placeholder={loading ? "Memuat..." : "Pilih Periode"}
                className="w-full md:w-15rem border-none"
                disabled={loading}
            />
            <Button icon="pi pi-print" tooltip="Cetak" className="p-button-text p-button-secondary" onClick={handlePrint} disabled={!selectedPayroll}/>
            <Button icon="pi pi-file-pdf" tooltip="Unduh PDF" className="p-button-text p-button-danger" onClick={handleExportPDF} disabled={!selectedPayroll}/>
        </div>
      </div>

      {error && <Message severity="error" text={error} className="w-full mb-4"/>}

      {/* --- LOADING STATE --- */}
      {loading ? (
        <div className="grid">
            <div className="col-12 md:col-6"><Skeleton height="150px" borderRadius="12px" className="mb-2"/></div>
            <div className="col-12 md:col-6"><Skeleton height="150px" borderRadius="12px" className="mb-2"/></div>
            <div className="col-12"><Skeleton height="400px" borderRadius="12px" /></div>
        </div>
      ) : selectedPayroll ? (
        <>
          {/* --- DASHBOARD SUMMARY --- */}
          <div className="grid mb-4 no-print">
            <div className="col-12 md:col-6 lg:col-5">
              <div className="p-4 border-round-xl shadow-2 relative overflow-hidden flex flex-column justify-content-between h-full"
                   style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white' }}>
                  <div className="absolute top-0 right-0 w-8rem h-8rem bg-white opacity-10 border-round-circle -mr-4 -mt-4"></div>
                  <div className="flex justify-content-between align-items-start z-1">
                      <div>
                          <p className="m-0 text-blue-100 text-sm font-medium uppercase tracking-wider">Take Home Pay</p>
                          <h2 className="m-0 text-4xl font-bold mt-2">{formatRupiah(selectedPayroll.net_salary)}</h2>
                      </div>
                      <div className="bg-white-alpha-20 p-2 border-round"><i className="pi pi-wallet text-2xl"></i></div>
                  </div>
                  <div className="flex align-items-center gap-2 mt-4 z-1">
                      <span className="bg-green-400 text-white text-xs font-bold px-3 py-1 border-round-2xl shadow-1">LUNAS</span>
                      <span className="text-sm text-blue-100">{selectedPayroll.period_label}</span>
                  </div>
              </div>
            </div>

            <div className="col-12 md:col-6 lg:col-7">
                <div className="grid h-full">
                    <div className="col-6">
                        <div className="p-3 surface-card border-round-xl shadow-1 h-full border-left-3 border-green-500">
                            <div className="flex align-items-center gap-2 mb-2">
                                <i className="pi pi-arrow-up text-green-500 bg-green-50 p-2 border-round-circle"></i>
                                <span className="text-gray-500 text-sm font-medium">Total Pendapatan</span>
                            </div>
                            <span className="text-xl font-bold text-gray-800 block">{formatRupiah(selectedPayroll.total_allowances || 0)}</span>
                            <span className="text-xs text-gray-400">Gaji Pokok + Tunjangan</span>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="p-3 surface-card border-round-xl shadow-1 h-full border-left-3 border-red-500">
                            <div className="flex align-items-center gap-2 mb-2">
                                <i className="pi pi-arrow-down text-red-500 bg-red-50 p-2 border-round-circle"></i>
                                <span className="text-gray-500 text-sm font-medium">Total Potongan</span>
                            </div>
                            <span className="text-xl font-bold text-gray-800 block">{formatRupiah(selectedPayroll.total_deductions || 0)}</span>
                            <span className="text-xs text-gray-400">Pajak, BPJS, dll</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* --- SLIP GAJI PREVIEW --- */}
          <div className="shadow-2 border-round-xl bg-white mb-6">
             <div className="bg-gray-100 p-3 border-bottom-1 border-gray-200 flex justify-content-between align-items-center no-print border-round-top-xl">
                <span className="font-bold text-gray-700 text-sm"><i className="pi pi-file mr-2"></i>Pratinjau Dokumen</span>
                <span className="text-xs text-gray-500 flex align-items-center gap-1">
                   <span className="hidden md:inline">A4 Format</span>
                   <span className="md:hidden text-blue-600"><i className="pi pi-mobile mr-1"></i>Fit to Screen</span>
                </span>
             </div>
             
             {/* WRAPPER UTAMA */}
             <div className="slip-mobile-container bg-bluegray-50 border-round-bottom-xl">
                 
                 {/* KONTEN SLIP */}
                 <div className="slip-content-wrapper mx-auto shadow-4 bg-white">
                    <div id="slip-to-print" ref={slipRef}>
                        <PayrollSlipContent payroll={selectedPayroll} />
                    </div>
                 </div>

             </div>
          </div>
        </>
      ) : (
        !loading && (
             <div className="flex flex-column align-items-center justify-content-center p-6 bg-white border-round-xl border-dashed border-gray-300">
                <i className="pi pi-inbox text-5xl text-gray-300 mb-3"></i>
                <span className="text-gray-500">Data slip gaji tidak ditemukan.</span>
             </div>
        )
      )}
    </div>
  );
};

export default PayrollPage;