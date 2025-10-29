// /app/AppMenu.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { classNames } from 'primereact/utils';

// Ini adalah komponen Menu Kustom
export default function AppMenu() {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState('');

  // 1. Model menu diperbarui
  const model = [
    { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
    { label: 'Absensi', icon: 'pi pi-fw pi-database', to: '/absensi' },
    {
      label: 'Pengajuan',
      icon: 'pi pi-fw pi-desktop',
      items: [
        { label: 'Pengajuan Cuti', to: '/pengajuan/cuti' },
        { label: 'Pengajuan Lembur', to: '/pengajuan/lembur' },
        { label: 'Status Pengajuan', to: '/pengajuan/status' }, // <-- INI YANG BARU
      ],
    },
    { label: 'Profil', icon: 'pi pi-fw pi-cog', to: '/profil' },
  ];

  return (
    <ul className="layout-menu">
      {model.map((item, i) => {
        
        if (item.items) {
          // Cek apakah menu parent ini sedang aktif (terbuka)
          // Kita juga cek apakah salah satu anaknya aktif
          const isParentActive = activeMenu === item.label || 
                                 item.items.some(sub => pathname.startsWith(sub.to));

          return (
            <li key={i} className={classNames({ 'active-menuitem': isParentActive })}>
              {/* Ini adalah tombol untuk toggle dropdown */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveMenu(isParentActive ? '' : item.label); // Toggle
                }}
              >
                <i className={classNames('layout-menuitem-icon', item.icon)}></i>
                <span className="layout-menuitem-text">{item.label}</span>
                <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>
              </a>
              
              {/* Ini adalah kontainer sub-menu */}
              <ul className={classNames('layout-submenu', { 'layout-submenu-active': isParentActive })}>
                {item.items.map((subItem, j) => {
                  // Cek apakah sub-item ini adalah halaman yang aktif
                  const isSubActive = pathname === subItem.to;
                  return (
                    <li key={j} className={classNames({ 'active-menuitem': isSubActive })}>
                      <Link href={subItem.to}>
                        <span className="layout-menuitem-text">{subItem.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        }

        // Ini adalah logika lama untuk link biasa (tidak punya sub-menu)
        const isActive = pathname.startsWith(item.to) && (item.to !== '/' || pathname === '/');
        const liClassName = classNames({ 'active-menuitem': isActive });

        return (
          <li key={i} className={liClassName}>
            <Link href={item.to}>
              <i className={classNames('layout-menuitem-icon', item.icon)}></i>
              <span className="layout-menuitem-text">{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}