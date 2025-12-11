"use client";

import React from "react";
import { Card } from "primereact/card";
// IMPORT DIPERBARUI
import { UserProfile, InfoItem } from "@/lib/types/profil";

interface TabFinancialInfoProps {
  profile: UserProfile;
}

export default function TabFinancialInfo({ profile }: TabFinancialInfoProps) {
  return (
    <Card className="border-none shadow-none h-full">
      <h3 className="m-0 mb-4 text-900 font-bold">Informasi Finansial</h3>

      <div className="grid">
        {/* Kartu Bank Style */}
        <div className="col-12 md:col-6">
          <div
            className="p-4 border-round-xl h-full shadow-1"
            style={{
              background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
              color: "white",
            }}
          >
            <div className="flex justify-content-between align-items-start mb-4">
              <i className="pi pi-credit-card text-3xl opacity-80"></i>
              <span className="text-xs border-1 border-white border-round px-2 py-1 opacity-70">
                PAYROLL
              </span>
            </div>
            <div className="mb-1 text-sm opacity-70">Nomor Rekening</div>
            <div className="text-2xl font-mono font-bold tracking-wider mb-4">
              {profile.bank_account || "Belum Terdaftar"}
            </div>
            <div className="text-sm font-medium">Bank Transfer</div>
          </div>
        </div>

        {/* Kartu NPWP Style */}
        <div className="col-12 md:col-6">
          <div className="p-4 surface-50 border-1 border-gray-200 border-round-xl h-full">
            <div className="flex align-items-center gap-3 mb-3">
              <div className="bg-yellow-100 text-yellow-700 p-2 border-round">
                <i className="pi pi-file text-xl"></i>
              </div>
              <span className="font-bold text-700">NPWP</span>
            </div>
            <div className="text-xl font-bold text-900">
              {profile.npwp || "-"}
            </div>
            <div className="text-xs text-500 mt-2">
              Wajib Pajak Orang Pribadi
            </div>
          </div>
        </div>

        {/* Kartu BPJS */}
        <div className="col-12 mt-3">
          <div className="surface-card border-1 border-gray-200 border-round-xl p-0 overflow-hidden">
            <div className="bg-green-50 p-3 border-bottom-1 border-green-100 flex justify-content-between">
              <span className="font-bold text-green-800">
                <i className="pi pi-shield mr-2"></i>Jaminan Sosial (BPJS)
              </span>
            </div>
            <div className="grid p-3">
              <InfoItem
                icon="pi-briefcase"
                label="BPJS Ketenagakerjaan"
                value={profile.bpjs_ketenagakerjaan}
              />
              <InfoItem
                icon="pi-heart-fill"
                label="BPJS Kesehatan"
                value={profile.bpjs_kesehatan}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}