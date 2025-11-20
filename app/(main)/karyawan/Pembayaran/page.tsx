"use client";

// --- PRIME REACT CSS ---
import "primereact/resources/themes/lara-light-blue/theme.css"; 
import "primereact/resources/primereact.min.css";               
import "primeicons/primeicons.css";                             
import "primeflex/primeflex.css";                               

import React, { useState, useRef, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Import komponen yang sudah dipisah
import PayrollSlipContent from "./components/PayrollSlipContent";
import { Payroll } from "./types";
// Import service yang baru dibuat
import { getPayrollData } from "./services/api";

const PayrollPage: React.FC = () => {
  const employeeId = 3; 
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [selectedPayrollId, setSelectedPayrollId] = useState<number|string|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const slipRef = useRef<HTMLDivElement>(null);

  // --- DISINI LOGIKA UTAMANYA ---
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Panggil fungsi dari services/api.ts
        const data = await getPayrollData(employeeId.toString());
        
        setPayrolls(data);

        // Jika ada data, otomatis pilih bulan terbaru
        if (data.length > 0) {
          setSelectedPayrollId(data[0].id);
        }
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

  const handlePrint = () => window.print();
  
  const handleExportPDF = async () => {
    if (!slipRef.current) return;
    try {
      const canvas = await html2canvas(slipRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const w = imgWidth * ratio;
      const h = imgHeight * ratio;
      const x = (pdfWidth - w) / 2;
      
      pdf.addImage(imgData, "PNG", x, 30, w, h);
      pdf.save(`Slip_Gaji_${selectedPayroll?.period_label || "Periode"}.pdf`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans">
       {/* Print CSS */}
       <style>{`
        @media print {
          body * { visibility: hidden; }
          #slip-to-print, #slip-to-print * { visibility: visible; }
          #slip-to-print {
            position: absolute; left: 50%; top: 0; transform: translateX(-50%);
            width: 800px; background-color: white !important; padding: 20px; border: 1px solid #dee2e6;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="mb-4 no-print">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">SLIP GAJI</h1>
        <span className="text-gray-500">Lihat dan cetak slip gaji Anda per periode</span>
      </div>

      <Card className="mb-4 shadow-lg no-print border-round-xl">
        <div className="grid align-items-center">
          <div className="col-12 md:col-7 lg:col-8 flex flex-column gap-3">
            <div>
              <label className="block mb-2 font-medium text-gray-700">Pilih Periode</label>
              <Dropdown
                options={payrolls.map(p => ({ label: p.period_label, value: p.id }))}
                value={selectedPayrollId}
                onChange={e => setSelectedPayrollId(e.value)}
                placeholder={loading ? "Memuat..." : "Pilih periode"}
                className="w-full" 
                disabled={loading || payrolls.length === 0}
              />
            </div>
            <div className="flex gap-2">
              <Button label="Cetak" icon="pi pi-print" onClick={handlePrint} className="p-button-outlined p-button-secondary p-button-sm" disabled={!selectedPayroll}/>
              <Button label="Export PDF" icon="pi pi-file-pdf" onClick={handleExportPDF} className="p-button-danger p-button-sm" disabled={!selectedPayroll}/>
            </div>
          </div>

          <div className="col-12 md:col-5 lg:col-4 mt-3 md:mt-0">
            {selectedPayroll ? (
              <div className="p-3 bg-blue-50 border-round-lg border-1 border-blue-100">
                <div className="flex justify-content-between mb-2">
                    <span className="text-sm text-gray-500 font-bold">STATUS PEMBAYARAN</span>
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold border-round">LUNAS</span>
                </div>
                <div className="flex align-items-center gap-3">
                    <div className="w-3rem h-3rem bg-blue-500 text-white border-round-circle flex align-items-center justify-content-center"><i className="pi pi-wallet text-xl"></i></div>
                    <div>
                        <span className="block text-xs text-gray-600">Total Diterima (Net)</span>
                        <span className="block text-2xl font-bold text-gray-800">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(selectedPayroll.net_salary)}
                        </span>
                    </div>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center border-dashed border-gray-300 text-gray-400 text-sm">Pilih periode untuk melihat data</div>
            )}
          </div>
        </div>
      </Card>

      {loading && <div className="flex justify-center p-5"><ProgressSpinner/></div>}
      {error && <Message severity="error" text={error} className="w-full"/>}
      
      {selectedPayroll && <PayrollSlipContent ref={slipRef} payroll={selectedPayroll} />}
    </div>
  );
};

export default PayrollPage;