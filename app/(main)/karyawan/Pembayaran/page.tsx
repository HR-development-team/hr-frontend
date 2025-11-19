"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";

// Pastikan library ini sudah diinstall: npm install jspdf html2canvas
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// NOTE: Pastikan Anda mengimport CSS PrimeFlex di layout utama atau _app.tsx/main.tsx Anda
// import 'primeflex/primeflex.css';
// import 'primereact/resources/themes/lara-light-indigo/theme.css';
// import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';

// --- Tipe Data ---
type PayrollLine = {
  code?: string;
  label: string;
  amount: number;
};

type Employee = {
  id: number | string;
  name: string;
  nik?: string;
  position?: string;
  department?: string;
  bank_account?: string;
  email?: string;
};

type Payroll = {
  id: number | string;
  period_label?: string;
  employee: Employee;
  earnings: PayrollLine[];
  deductions: PayrollLine[];
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
  generated_at?: string;
};

// --- Helper Function: Format Rupiah ---
const formatRp = (n: number) => {
  if (typeof n !== 'number' || isNaN(n)) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0, // Biasanya slip gaji tidak butuh desimal
  }).format(n);
};

// --- Helper Function: Terbilang ---
const terbilang = (n: number): string => {
  if (n === 0) return "Nol";

  const angka = [
    "", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan",
  ];
  const belasan = [
    "Sepuluh", "Sebelas", "Dua Belas", "Tiga Belas", "Empat Belas", "Lima Belas",
    "Enam Belas", "Tujuh Belas", "Delapan Belas", "Sembilan Belas",
  ];
  const puluhan = [
    "", "", "Dua Puluh", "Tiga Puluh", "Empat Puluh", "Lima Puluh",
    "Enam Puluh", "Tujuh Puluh", "Delapan Puluh", "Sembilan Puluh",
  ];
  const ribuan = ["", "Ribu", "Juta", "Miliar", "Triliun"];

  let result = "";
  let absN = Math.abs(Math.floor(n));
  let strN = absN.toString();
  let chunks: string[] = [];

  // Pecah menjadi grup 3 digit
  while (strN.length > 0) {
    chunks.unshift(strN.slice(Math.max(0, strN.length - 3)));
    strN = strN.slice(0, Math.max(0, strN.length - 3));
  }

  chunks.forEach((chunk, i) => {
    let num = parseInt(chunk, 10);
    if (num === 0) return;

    let chunkText = "";
    let ratus = Math.floor(num / 100);
    let sisa = num % 100;

    if (ratus > 0) {
      chunkText += ratus === 1 ? "Seratus" : `${angka[ratus]} Ratus`;
    }

    if (sisa > 0) {
      if (sisa >= 10 && sisa <= 19) {
        chunkText += (chunkText ? " " : "") + belasan[sisa - 10];
      } else {
        let puluh = Math.floor(sisa / 10);
        let satu = sisa % 10;
        if (puluh > 0) {
          chunkText += (chunkText ? " " : "") + puluhan[puluh];
        }
        if (satu > 0) {
          chunkText += (chunkText ? " " : "") + angka[satu];
        }
      }
    }

    // Logika khusus "Seribu"
    // Posisi Ribuan ada di index chunks.length - 2 (karena ribuan array index 1)
    const ribuanIndex = chunks.length - 1 - i;
    
    if (ribuanIndex === 1 && num === 1) { // Jika Ribuan dan angkanya 1
        chunkText = "Seribu";
    } else {
         chunkText += (chunkText ? " " : "") + (ribuan[ribuanIndex] || "");
    }

    result += (result ? " " : "") + chunkText;
  });

  return (n < 0 ? "Minus " : "") + (result || "Nol");
};

/**
 * Sub-komponen: Typografi label & value
 */
const LinesTable: React.FC<{ lines: PayrollLine[] }> = ({ lines }) => (
  <div className="flex flex-column gap-3">
    {lines.map((l, idx) => (
      <div
        key={idx}
        className="flex justify-content-between align-items-center border-bottom-1 border-dashed border-gray-200 pb-2"
      >
        <span className="text-gray-600">{l.label}</span>
        <span className="font-semibold text-gray-900">
          {formatRp(l.amount)}
        </span>
      </div>
    ))}
  </div>
);

/**
 * Komponen Utama Slip Gaji
 */
const PayrollSlip: React.FC<{ employeeId: number | string }> = ({ employeeId }) => {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [selectedPayrollId, setSelectedPayrollId] = useState<number | string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Gunakan null sebagai initial value ref agar aman
  const slipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulasi fetch data
    const fetchPayrolls = async () => {
      try {
        setLoading(true);
        setError(null);

        // --- SIMULASI API ---
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const mockData = {
          payrolls: [
            {
              id: 1,
              generated_at: "2025-10-25",
              employee: {
                id: employeeId,
                name: "Budi Santoso",
                nik: "12345678",
                position: "Software Engineer",
                department: "IT",
                bank_account: "BCA 123-456-7890",
                email: "budi@example.com",
              },
              earnings: [
                { label: "Gaji Pokok", amount: 8000000 },
                { label: "Tunjangan Transport", amount: 500000 },
                { label: "Tunjangan Makan", amount: 600000 },
              ],
              deductions: [
                { label: "BPJS Kesehatan", amount: 200000 },
                { label: "BPJS Ketenagakerjaan", amount: 150000 },
                { label: "PPH 21", amount: 450000 },
              ],
              gross_salary: 9100000,
              total_deductions: 800000,
              net_salary: 8300000,
            },
            {
              id: 2,
              generated_at: "2025-09-25",
              employee: {
                id: employeeId,
                name: "Budi Santoso",
                nik: "12345678",
                position: "Software Engineer",
                department: "IT",
                bank_account: "BCA 123-456-7890",
                email: "budi@example.com",
              },
              earnings: [
                { label: "Gaji Pokok", amount: 8000000 },
                { label: "Tunjangan Transport", amount: 500000 },
                { label: "Tunjangan Makan", amount: 600000 },
                { label: "Bonus Kinerja", amount: 1000000 },
              ],
              deductions: [
                { label: "BPJS Kesehatan", amount: 200000 },
                { label: "BPJS Ketenagakerjaan", amount: 150000 },
                { label: "PPH 21", amount: 550000 },
              ],
              gross_salary: 10100000,
              total_deductions: 900000,
              net_salary: 9200000,
            },
          ],
        };
        // --- END SIMULASI ---

        const list: Payroll[] = mockData.payrolls;
        const normalized = list.map((p) => ({
          ...p,
          period_label:
            p.period_label ||
            (p.generated_at
              ? new Date(p.generated_at).toLocaleString("id-ID", {
                  month: "long",
                  year: "numeric",
                })
              : `#${p.id}`),
        }));

        setPayrolls(normalized);
        if (normalized.length > 0) {
            setSelectedPayrollId(normalized[0].id);
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat mengambil payroll");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayrolls();
  }, [employeeId]);

  const selectedPayroll = payrolls.find((p) => p.id === selectedPayrollId) || null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    if (!slipRef.current) return;

    try {
        // Tambahkan opsi logging: false agar console tidak penuh saat render
        const canvas = await html2canvas(slipRef.current, {
            scale: 2,
            logging: false, 
            useCORS: true
        });

        const imgData = canvas.toDataURL("image/png");
        // "p" = portrait, "pt" = points, "a4" = ukuran kertas
        const pdf = new jsPDF("p", "pt", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const w = imgWidth * ratio;
        const h = imgHeight * ratio;

        // Pusatkan gambar secara horizontal
        const x = (pdfWidth - w) / 2;
        const y = 30; // Margin atas

        pdf.addImage(imgData, "PNG", x, y, w, h);

        const fileName = `Slip_Gaji_${
            selectedPayroll?.employee.name || "Karyawan"
        }_${selectedPayroll?.period_label || "Periode"}.pdf`;

        pdf.save(fileName.replace(/\s+/g, "_"));
    } catch (error) {
        console.error("Gagal export PDF:", error);
        alert("Gagal mengunduh PDF. Silakan coba lagi.");
    }
  };

  const renderContentState = () => {
    if (loading) {
      return (
        <div className="flex justify-content-center align-items-center p-5">
          <ProgressSpinner />
        </div>
      );
    }
    if (error) {
      return <Message severity="error" text={error} className="w-full" />;
    }
    if (!selectedPayroll && payrolls.length > 0) {
      return (
        <Message
          severity="info"
          text="Pilih periode untuk melihat slip gaji."
          className="w-full"
        />
      );
    }
    if (payrolls.length === 0 && !loading) {
      return (
        <Message
          severity="warn"
          text="Tidak ada data payroll yang ditemukan untuk karyawan ini."
          className="w-full"
        />
      );
    }
    return null;
  };

  return (
    <div className="p-4 md:p-5 bg-gray-50 min-h-screen">
      {/* =============================================
        STYLE CSS UNTUK PRINT 
        Menggunakan tag <style> biasa agar kompatibel
        dengan Vite/CRA dan tidak error build
        =============================================
      */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #slip-to-print, #slip-to-print * {
            visibility: visible;
          }
          #slip-to-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background-color: white !important;
          }
          /* Sembunyikan elemen UI PrimeReact yang mungkin mengganggu saat print */
          .p-card {
            box-shadow: none !important;
            border: none !important;
          }
          /* Sembunyikan elemen kontrol */
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* 1. JUDUL HALAMAN */}
      <div className="flex flex-column md:flex-row justify-content-between md:align-items-center mb-4 no-print">
        <div>
          <h2 className="m-0 text-3xl font-bold text-gray-800">
            Slip Gaji Karyawan
          </h2>
          <small className="text-gray-500 text-lg">
            Lihat dan cetak slip gaji Anda per periode.
          </small>
        </div>
      </div>

      {/* 2. PANEL KONTROL (Dropdown & Tombol) */}
      <Card className="mb-4 shadow-md no-print">
        <div className="grid align-items-center gap-3">
          <div className="col-12 md:col-6">
            <label
              htmlFor="selectPeriod"
              className="block mb-2 font-medium text-gray-700"
            >
              Pilih Periode Gaji
            </label>
            <Dropdown
              id="selectPeriod"
              options={payrolls.map((p) => ({
                label: p.period_label,
                value: p.id,
              }))}
              value={selectedPayrollId}
              onChange={(e) => setSelectedPayrollId(e.value)}
              placeholder={loading ? "Memuat..." : "Pilih periode"}
              className="w-full"
              disabled={loading || payrolls.length === 0}
              emptyMessage="Tidak ada data"
            />
          </div>

          <div className="col-12 md:col-6">
            <div className="flex flex-wrap justify-content-start md:justify-content-end gap-2">
              <Button
                label="Cetak"
                icon="pi pi-print"
                onClick={handlePrint}
                className="p-button-secondary p-button-outlined"
                disabled={!selectedPayroll}
              />
              <Button
                label="Export PDF"
                icon="pi pi-file-pdf"
                onClick={handleExportPDF}
                className="p-button-danger"
                disabled={!selectedPayroll}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* --- 3. KONTEN UTAMA (Slip Gaji) --- */}
      <div id="slip-container">
        {renderContentState()}

        {selectedPayroll && (
          <Card className="shadow-lg border-round-lg overflow-hidden">
            <div
              ref={slipRef}
              id="slip-to-print"
              className="p-5 md:p-6 bg-white"
              style={{
                // Inline style untuk border agar tetap muncul saat di-convert html2canvas
                border: "1px solid #dee2e6",
              }}
            >
              {/* Header Slip */}
              <div className="flex justify-content-between align-items-start pb-4 mb-4 border-bottom-1 border-gray-300">
                <div className="flex align-items-center">
                  <i className="pi pi-building text-4xl text-blue-600 mr-3"></i>
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      PT. MARSTECH GLOBAL
                    </div>
                    <div className="text-sm text-gray-600">
                      JL. Margatama Asri IV No. 3 - Kota Madiun
                    </div>
                    <div className="text-sm text-gray-600">
                      Telp: 0351-2812555
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    SLIP GAJI
                  </div>
                  <div className="text-md text-gray-600">
                    Periode: {selectedPayroll.period_label}
                  </div>
                </div>
              </div>

              {/* Info Karyawan & Periode */}
              <div className="grid mb-4">
                {/* Info Karyawan */}
                <div className="col-12 md:col-6 pr-0 md:pr-4">
                  <h5 className="mb-3 font-semibold text-gray-700">
                    DATA KARYAWAN
                  </h5>
                  <div className="grid text-sm">
                    <div className="col-4 text-gray-600">Nama</div>
                    <div className="col-8 font-semibold text-gray-900">
                      : {selectedPayroll.employee.name || "-"}
                    </div>

                    <div className="col-4 text-gray-600">NIK</div>
                    <div className="col-8 font-semibold text-gray-900">
                      : {selectedPayroll.employee.nik || "-"}
                    </div>

                    <div className="col-4 text-gray-600">Jabatan</div>
                    <div className="col-8 font-semibold text-gray-900">
                      : {selectedPayroll.employee.position || "-"}
                    </div>

                    <div className="col-4 text-gray-600">Departemen</div>
                    <div className="col-8 font-semibold text-gray-900">
                      : {selectedPayroll.employee.department || "-"}
                    </div>
                  </div>
                </div>

                {/* Info Pembayaran */}
                <div className="col-12 md:col-6 mt-4 md:mt-0 pt-4 md:pt-0 pl-0 md:pl-4 border-top-1 md:border-top-0 md:border-left-1 border-gray-200">
                  <h5 className="mb-3 font-semibold text-gray-700">
                    INFO PEMBAYARAN
                  </h5>
                  <div className="grid text-sm">
                    <div className="col-4 text-gray-600">Tgl Terbit</div>
                    <div className="col-8 font-semibold text-gray-900">
                      :{" "}
                      {selectedPayroll.generated_at
                        ? new Date(selectedPayroll.generated_at).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : "-"}
                    </div>

                    <div className="col-4 text-gray-600">Rekening</div>
                    <div className="col-8 font-semibold text-gray-900">
                      : {selectedPayroll.employee.bank_account || "-"}
                    </div>

                    <div className="col-4 text-gray-600">Status</div>
                    <div className="col-8 font-semibold text-green-600">
                      : LUNAS / PAID
                    </div>
                  </div>
                </div>
              </div>

              <Divider className="my-4 md:my-5" />

              {/* Rincian Gaji */}
              <div className="grid">
                <div className="col-12 md:col-6">
                  <h5 className="mb-3 text-lg font-semibold text-green-600">
                    <i className="pi pi-plus-circle mr-2"></i>PENGHASILAN
                  </h5>
                  <LinesTable lines={selectedPayroll.earnings} />
                </div>
                <div className="col-12 md:col-6 mt-4 md:mt-0">
                  <h5 className="mb-3 text-lg font-semibold text-red-600">
                    <i className="pi pi-minus-circle mr-2"></i>POTONGAN
                  </h5>
                  <LinesTable lines={selectedPayroll.deductions} />
                </div>
              </div>

              {/* Total Summary */}
              <div className="grid justify-content-end mt-5">
                <div className="col-12 md:col-7 lg:col-6">
                  <div className="flex flex-column gap-3 p-3 bg-gray-50 border-round-lg">
                    <div className="flex justify-content-between align-items-center">
                      <span className="text-gray-700 text-lg">Gaji Bruto</span>
                      <strong className="text-lg text-gray-800">
                        {formatRp(selectedPayroll.gross_salary)}
                      </strong>
                    </div>
                    <div className="flex justify-content-between align-items-center">
                      <span className="text-gray-700 text-lg">
                        Total Potongan
                      </span>
                      <strong className="text-lg text-gray-800">
                        ({formatRp(selectedPayroll.total_deductions)})
                      </strong>
                    </div>

                    {/* Highlight Gaji Bersih */}
                    <div className="p-3 bg-blue-700 text-white border-round-lg flex justify-content-between align-items-center mt-2">
                      <strong className="text-xl font-bold text-blue-50">
                        GAJI BERSIH
                      </strong>
                      <strong className="text-2xl font-bold text-white">
                        {formatRp(selectedPayroll.net_salary)}
                      </strong>
                    </div>

                    {/* Terbilang */}
                    <div className="text-right mt-1 pr-2">
                      <span className="text-gray-600 italic">Terbilang: </span>
                      <strong className="text-gray-800 italic">
                        {terbilang(selectedPayroll.net_salary)} Rupiah
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-6 pt-4 border-top-1 border-gray-200 text-gray-500 text-xs">
                <strong>RAHASIA & PRIBADI (CONFIDENTIAL & PRIVATE)</strong>
                <br />
                Ini adalah slip gaji yang sah dan dibuat oleh sistem HRD PT.
                Marstech Global.
                <br />
                Informasi yang terkandung bersifat rahasia dan hanya untuk
                karyawan yang bersangkutan.
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PayrollSlip;