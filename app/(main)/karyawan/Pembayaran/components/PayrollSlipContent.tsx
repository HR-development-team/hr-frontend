"use client";

import React, { forwardRef } from "react";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Payroll, PayrollLine } from "../types";

// --- Helper Function: Format Rupiah ---
const formatRp = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

// --- Helper Function: Terbilang ---
const terbilang = (n: number): string => {
  if (n === 0) return "Nol";
  const angka = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan"];
  const belasan = ["Sepuluh", "Sebelas", "Dua Belas", "Tiga Belas", "Empat Belas", "Lima Belas", "Enam Belas", "Tujuh Belas", "Delapan Belas", "Sembilan Belas"];
  const puluhan = ["", "", "Dua Puluh", "Tiga Puluh", "Empat Puluh", "Lima Puluh", "Enam Puluh", "Tujuh Puluh", "Delapan Puluh", "Sembilan Puluh"];
  const ribuan = ["", "Ribu", "Juta", "Miliar", "Triliun"];
  let result = "";
  let absN = Math.abs(Math.floor(n));
  let strN = absN.toString();
  let chunks: string[] = [];
  while (strN.length > 0) { chunks.unshift(strN.slice(Math.max(0, strN.length - 3))); strN = strN.slice(0, Math.max(0, strN.length - 3)); }
  chunks.forEach((chunk, i) => {
    let num = parseInt(chunk, 10); if (num === 0) return;
    let chunkText = "";
    let ratus = Math.floor(num / 100);
    let sisa = num % 100;
    if (ratus > 0) chunkText += ratus === 1 ? "Seratus" : `${angka[ratus]} Ratus`;
    if (sisa > 0) {
      if (sisa >= 10 && sisa <= 19) chunkText += (chunkText ? " " : "") + belasan[sisa - 10];
      else {
        let puluh = Math.floor(sisa / 10);
        let satu = sisa % 10;
        if (puluh > 0) chunkText += (chunkText ? " " : "") + puluhan[puluh];
        if (satu > 0) chunkText += (chunkText ? " " : "") + angka[satu];
      }
    }
    const ribuanIndex = chunks.length - 1 - i;
    if (ribuanIndex === 1 && num === 1) chunkText = "Seribu";
    else chunkText += (chunkText ? " " : "") + (ribuan[ribuanIndex] || "");
    result += (result ? " " : "") + chunkText;
  });
  return (n < 0 ? "Minus " : "") + (result || "Nol");
};

// --- Sub-komponen untuk daftar earnings/deductions ---
const LinesTable: React.FC<{ lines: PayrollLine[] }> = ({ lines }) => (
  <div className="flex flex-column gap-3">
    {lines.map((l, idx) => (
      <div key={idx} className="flex justify-content-between align-items-center border-bottom-1 border-dashed border-gray-200 pb-2">
        <span className="text-gray-600">{l.label}</span>
        <span className="font-semibold text-gray-900">{formatRp(l.amount)}</span>
      </div>
    ))}
  </div>
);

// --- Komponen utama Slip Gaji ---
type Props = {
  payroll: Payroll;
};

const PayrollSlipContent = forwardRef<HTMLDivElement, Props>(({ payroll }, ref) => {
  return (
    <Card className="shadow-lg border-round-lg overflow-hidden">
      <div ref={ref} id="slip-to-print" className="p-5 md:p-6 bg-white" style={{ border: "1px solid #dee2e6" }}>
        
        {/* --- PERBAIKAN HEADER --- 
          Menggunakan class PrimeFlex yang benar:
          - justify-content-between (bukan justify-between)
          - align-items-center (bukan items-center)
          - border-bottom-1 (bukan border-b)
        */}
        <div className="flex justify-content-between align-items-center pb-4 mb-4 border-bottom-1 border-gray-300">
          <div className="flex align-items-center gap-3">
            {/* Logo Wrapper agar ukuran konsisten */}
            <div style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                    src="/logo.png" 
                    alt="Logo Perusahaan" 
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 uppercase">PT. MARSTECH GLOBAL</div>
              <div className="text-sm text-gray-600">JL. Margatama Asri IV No. 3 - Kota Madiun</div>
            </div>
          </div>
          <div className="text-right hidden md:block"> {/* Hidden di mobile agar tidak nabrak */}
            <div className="text-2xl font-bold text-gray-800">SLIP GAJI</div>
            <div className="text-md text-gray-600">Periode: {payroll.period_label}</div>
          </div>
        </div>
        
        {/* Judul Slip untuk Mobile (Tampil hanya saat layar kecil) */}
        <div className="md:hidden text-center mb-4">
             <div className="text-xl font-bold text-gray-800">SLIP GAJI</div>
             <div className="text-sm text-gray-600">Periode: {payroll.period_label}</div>
        </div>


        {/* Data Karyawan & Info Pembayaran */}
        <div className="grid mb-4">
          <div className="col-12 md:col-6 pr-0 md:pr-4">
            <h5 className="mb-3 font-semibold text-gray-700 m-0">DATA KARYAWAN</h5>
            <div className="grid text-sm mt-2">
              <div className="col-4 text-gray-600">Nama</div>
              <div className="col-8 font-semibold text-gray-900">: {payroll.employee.name}</div>
              <div className="col-4 text-gray-600">NIK</div>
              <div className="col-8 font-semibold text-gray-900">: {payroll.employee.nik}</div>
              <div className="col-4 text-gray-600">Jabatan</div>
              <div className="col-8 font-semibold text-gray-900">: {payroll.employee.position}</div>
              <div className="col-4 text-gray-600">Departemen</div>
              <div className="col-8 font-semibold text-gray-900">: {payroll.employee.department}</div>
            </div>
          </div>

          <div className="col-12 md:col-6 mt-4 md:mt-0 pt-4 md:pt-0 pl-0 md:pl-4 border-top-1 md:border-top-0 md:border-left-1 border-gray-200">
            <h5 className="mb-3 font-semibold text-gray-700 m-0">INFO PEMBAYARAN</h5>
            <div className="grid text-sm mt-2">
              <div className="col-4 text-gray-600">Tgl Terbit</div>
              <div className="col-8 font-semibold text-gray-900">: {payroll.generated_at}</div>
              <div className="col-4 text-gray-600">Rekening</div>
              <div className="col-8 font-semibold text-gray-900">: {payroll.employee.bank_account}</div>
              <div className="col-4 text-gray-600">Status</div>
              <div className="col-8 font-semibold text-green-600">: LUNAS</div>
            </div>
          </div>
        </div>

        <Divider className="my-4 md:my-5" />

        {/* Penghasilan & Potongan */}
        <div className="grid">
          <div className="col-12 md:col-6">
            <h5 className="mb-3 text-lg font-semibold text-green-600 mt-0">PENGHASILAN</h5>
            <LinesTable lines={payroll.earnings} />
          </div>
          <div className="col-12 md:col-6 mt-4 md:mt-0">
            <h5 className="mb-3 text-lg font-semibold text-red-600 mt-0">POTONGAN</h5>
            <LinesTable lines={payroll.deductions} />
          </div>
        </div>

        {/* Summary Gaji */}
        <div className="grid justify-content-end mt-5">
          <div className="col-12 md:col-7 lg:col-6">
            <div className="flex flex-column gap-3 p-3 bg-gray-50 border-round-lg">
              <div className="flex justify-content-between align-items-center">
                <span className="text-gray-700 text-lg">Gaji Bruto</span>
                <strong className="text-lg text-gray-800">{formatRp(payroll.gross_salary)}</strong>
              </div>
              <div className="flex justify-content-between align-items-center">
                <span className="text-gray-700 text-lg">Total Potongan</span>
                <strong className="text-lg text-gray-800">({formatRp(payroll.total_deductions)})</strong>
              </div>
              <div className="p-3 bg-blue-700 text-white border-round-lg flex justify-content-between align-items-center mt-2">
                <strong className="text-xl font-bold text-blue-50">GAJI BERSIH</strong>
                <strong className="text-2xl font-bold text-white">{formatRp(payroll.net_salary)}</strong>
              </div>
              <div className="text-right mt-1 pr-2">
                <span className="text-gray-600 italic">Terbilang: </span>
                <strong className="text-gray-800 italic">{terbilang(payroll.net_salary)} Rupiah</strong>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Card>
  );
});

export default PayrollSlipContent;