'use client';

import React, { useState, useRef, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PrimeReactProvider } from 'primereact/api';
import { classNames } from 'primereact/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import type { Menu as MenuType } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import AppMenu from './AppMenu';

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarActive, setSidebarActive] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string }>({
    name: 'Memuat...',
    email: '',
  });

  const menuRef = useRef<MenuType>(null);
  const toast = useRef<Toast>(null);
  const router = useRouter();
  const [, startTransition] = useTransition();

  const wrapperClass = classNames('layout-wrapper', {
    'layout-static-inactive': !sidebarActive,
  });

  // === Ambil Data Profil & Email ===
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // 1️⃣ Ambil data profil karyawan
        const resProfile = await fetch('/api/karyawan/profile');
        const dataProfile = await resProfile.json();

        if (!resProfile.ok || !dataProfile.users) {
          console.error('Gagal mendapatkan data profil:', dataProfile.message);
          return;
        }

        const { first_name, last_name, id } = dataProfile.users;

        // 2️⃣ Ambil daftar users (yang berisi email)
        const resUsers = await fetch('/api/karyawan/user');
        const dataUsers = await resUsers.json();

        let email = 'Tidak ada email';
        if (resUsers.ok && dataUsers.users) {
          // Cari user yang punya employee_id = id dari profil
          const matchedUser = dataUsers.users.find(
            (u: any) => u.employee_id === id
          );
          if (matchedUser) email = matchedUser.email;
        }

        // 3️⃣ Simpan ke state
        setUser({
          name: `${first_name} ${last_name}`,
          email,
        });
      } catch (error) {
        console.error('Gagal mengambil data profil pengguna:', error);
      }
    };

    fetchProfile();
  }, []);

  // === Fungsi Logout ===
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal logout');

      toast.current?.show({
        severity: 'success',
        summary: 'Logout Berhasil',
        detail: 'Sesi telah diakhiri.',
        life: 2500,
      });

      startTransition(() => {
        router.push('/login');
      });
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Gagal Logout',
        detail: 'Terjadi kesalahan.',
        life: 2500,
      });
    }
  };

  const userMenuModel = [
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: handleLogout,
    },
  ];

  return (
    <html lang="id">
      <body>
        <PrimeReactProvider>
          <Toast ref={toast} />
          <div className={wrapperClass}>
            {/* === TOPBAR === */}
            <div className="layout-topbar">
              <div className="layout-topbar-left">
                <button
                  type="button"
                  className="p-link layout-menu-button layout-topbar-button"
                  onClick={() => setSidebarActive(!sidebarActive)}
                >
                  <i className="pi pi-bars" />
                </button>
                <Link href="/" className="layout-topbar-logo">
                  <Image
                    src="/logo.png"
                    alt="Logo Perusahaan"
                    width={40}
                    height={40}
                    className="mr-2 rounded-md"
                  />
                  <div className="flex flex-column">
                    <span className="logo-text-main">Marstech</span>
                    <span className="logo-text-main">Sistem Informasi</span>
                    <span className="logo-text-sub">Karyawan</span>
                  </div>
                </Link>
              </div>

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
                  />
                  <div className="flex flex-column mx-2 text-left">
                    <span className="user-name">{user.name}</span>
                    <span className="email">{user.email}</span>
                  </div>
                  <i className="pi pi-angle-down" />
                </button>
              </div>
            </div>

            {/* === SIDEBAR === */}
            <div className="layout-sidebar">
              <AppMenu />
            </div>

            {/* === KONTEN UTAMA === */}
            <div className="layout-main-container">
              <div className="layout-main">{children}</div>
            </div>

            {/* === MASK UNTUK MODE MOBILE === */}
            <div
              className="layout-mask"
              onClick={() => setSidebarActive(false)}
            ></div>
          </div>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
