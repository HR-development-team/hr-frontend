"use client";

import React, { useState, useRef, useTransition, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PrimeReactProvider } from "primereact/api";
import { classNames } from "primereact/utils";
import type { Menu as MenuType } from "primereact/menu";
import { Toast } from "primereact/toast";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./globals.css";
import Header from "@features/layout/header/Header";
import SidebarPopup from "./components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const pathName = usePathname();

  const [sidebarActive, setSidebarActive] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string }>({
    name: "Memuat...",
    email: "",
  });

  const menuRef = useRef<MenuType>(null);
  const toast = useRef<Toast>(null);
  const router = useRouter();
  const [, startTransition] = useTransition();

  const wrapperClass = classNames("layout-wrapper", {
    "layout-static-inactive": !sidebarActive,
  });

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathName]);

  // === Ambil Data Profil & Email ===
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // 1️⃣ Ambil data profil karyawan
        const resProfile = await fetch("/api/karyawan/profile");
        const dataProfile = await resProfile.json();

        if (!resProfile.ok || !dataProfile.users) {
          console.error("Gagal mendapatkan data profil:", dataProfile.message);
          return;
        }

        const { first_name, last_name, id } = dataProfile.users;

        // 2️⃣ Ambil daftar users (yang berisi email)
        const resUsers = await fetch("/api/karyawan/user");
        const dataUsers = await resUsers.json();

        let email = "Tidak ada email";
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
        console.error("Gagal mengambil data profil pengguna:", error);
      }
    };

    fetchProfile();
  }, []);

  // === Fungsi Logout ===
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal logout");

      toast.current?.show({
        severity: "success",
        summary: "Logout Berhasil",
        detail: "Sesi telah diakhiri.",
        life: 2500,
      });

      startTransition(() => {
        router.push("/login");
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Gagal Logout",
        detail: "Terjadi kesalahan.",
        life: 2500,
      });
    }
  };

  const userMenuModel = [
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: handleLogout,
    },
  ];

  return (
    <PrimeReactProvider>
      <div className="min-h-screen surface-50">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div style={{ height: "calc(100vh - 5rem)" }} className="flex pt-8">
          <SidebarPopup
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <main
            style={{ height: "calc(100vh - 5rem)" }}
            className="relative flex-1 surface-100 transition-all animation-duration-300 min-w-0"
          >
            {/* backdrop for mobile sidebar */}
            {sidebarOpen && (
              <div
                className="fixed top-0 right-0 bottom-0 left-0 z-3 surface-900 opacity-50 md:hidden"
                onClick={() => setSidebarOpen(false)}
              ></div>
            )}
            <div
              style={{ height: "calc(100vh - 5rem)" }}
              className="overflow-y-auto flex justify-content-center"
              // className="overflow-y-auto"
            >
              <div className="w-full py-4 px-4 md:px-6">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </PrimeReactProvider>
  );
}
