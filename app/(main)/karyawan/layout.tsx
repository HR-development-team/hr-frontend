// /app/layout.tsx

'use client';

import React, { useState, useRef } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { classNames } from 'primereact/utils';
import Link from 'next/link';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import type { Menu as MenuType } from 'primereact/menu';
import Image from 'next/image'; // <-- 1. TAMBAHKAN IMPORT INI

// Impor file menu Anda
import AppMenu from './AppMenu'; 

// Impor semua CSS
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './globals.css'; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarActive, setSidebarActive] = useState(true);
  const menuRef = useRef<MenuType>(null); 

  const wrapperClass = classNames('layout-wrapper', {
      'layout-static-inactive': !sidebarActive
  });

  const userMenuModel = [
    {
      label: 'LogOut',
      icon: 'pi pi-fw pi-sign-out',
      className: 'logout-menu-item', 
      command: () => {
        console.log('Logout clicked');
      }
    }
  ];

  return (
    <html lang="id">
      <head>
        {/* CSS sudah diimpor */}
      </head>
      <body>
        <PrimeReactProvider>
          <div className={wrapperClass}>
            
            {/* 1. TOPBAR (Bagian Atas) */}
            <div className="layout-topbar">
              
              {/* Grup Kiri: Tombol Hamburger & Logo */}
              <div className="layout-topbar-left">
                <button 
                  type="button" 
                  className="p-link layout-menu-button layout-topbar-button" 
                  onClick={() => setSidebarActive(!sidebarActive)}
                >
                  <i className="pi pi-bars" />
                </button>

                <Link href="/" className="layout-topbar-logo">
                  
                  {/* --- 2. GANTI BAGIAN INI --- */}
                  <Image
                    src="/logo.png"
                    alt="Logo Perusahaan"
                    width={40}  // Atur lebar logo
                    height={40} // Atur tinggi logo
                    className="mr-2"
                    style={{ borderRadius: '6px' }} // Opsional: agar sudut rapi
                  />
                  {/* --- BATAS AKHIR PERUBAHAN --- */}

                  <div className="flex flex-column">
                    <span className="logo-text-main">SI-HR</span>
                    <span className="logo-text-sub">Karyawan</span>
                  </div>
                </Link>
              </div>

              {/* Grup Kanan: Menu User (DIPERBARUI) */}
              <div className="layout-topbar-right">
                
                <Menu model={userMenuModel} popup ref={menuRef} /> 
                
                <button 
                  type="button" 
                  className="p-link layout-topbar-button layout-user-button"
                  onClick={(e) => menuRef.current?.toggle(e)} 
                >
                  <Avatar 
                    image="https://placehold.co/40x40/007bff/FFFFFF?text=LH" 
                    shape="circle" 
                    className="p-avatar-info" 
                  />
                  <div className="flex flex-column mx-2 text-left">
                    <span className="user-name">Lugas Hermanto</span>
                    <span className="email">lugas655@gmail.com</span> 
                  </div>
                  <i className="pi pi-angle-down" />
                </button>
              </div>
            </div>

            {/* 2. SIDEBAR (Bagian Kiri) */}
            <div className="layout-sidebar">
              <AppMenu />
            </div>

            {/* 3. KONTEN UTAMA (Halaman Anda) */}
            <div className="layout-main-container">
              <div className="layout-main">
                {children}
              </div>
            </div>

          </div>
        </PrimeReactProvider>
      </body>
    </html>
  )
}