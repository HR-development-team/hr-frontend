// /app/page.tsx

'use client'; // Gunakan "use client" agar bisa pakai komponen PrimeReact

import React from 'react';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import Link from 'next/link'
import { InputText } from 'primereact/inputtext';



// Ini adalah halaman Dashboard Anda
export default function DashboardPage() {
  return (
    <div className="grid">
      <div className="col-12">
        
        <Panel header="Dashboard Admin">
          <p className="m-0">
            Selamat datang di Dashboard Admin. <InputText/>
          </p>
          <p>
            Silakan pilih menu di sidebar untuk memulai. 
            Anda bisa langsung ke:
          </p>
          
          <Link href="/karyawan">
            <Button 
              label="Manajemen Karyawan" 
              icon="pi pi-users" 
              className="p-button-success" 
            />
          </Link>

        </Panel>

        {/* Anda bisa tambahkan card/grafik lain di sini nanti */}

      </div>
    </div>
  );
}