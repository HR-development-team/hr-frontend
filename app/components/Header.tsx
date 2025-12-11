"use client";

import React, { useMemo, useRef } from "react";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { classNames } from "primereact/utils";
import { MenuItem } from "primereact/menuitem";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { Skeleton } from "primereact/skeleton";
import { useToastContext } from "./ToastProvider";
import Image from "next/image";

const getMenuitems = (logoutHandler: () => void): MenuItem[] => [
  {
    label: "Akun Saya",
    items: [
      {
        label: "Profil",
        icon: "pi pi-user",
      },
      {
        label: "Laporkan Bug",
        icon: "pi pi-flag",
      },
      {
        separator: true,
      },
      {
        label: "Logout",
        icon: "pi pi-sign-out",
        command: logoutHandler,
        template: (item, options) => {
          return (
            <a
              className={classNames(
                options.className,
                "flex align-items-center",
                "text-red-500"
              )}
              onClick={options.onClick}
            >
              <span className={classNames(item.icon, "mr-2")} />
              <span>{item.label}</span>
            </a>
          );
        },
      },
    ],
  },
];

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const menu = useRef<Menu>(null);
  const router = useRouter();

  const { user, isLoading, logout } = useAuth();

  const { showToast } = useToastContext();

  const handleLogout = async () => {
    try {
      await logout();

      showToast(
        "success",
        "Berhasil Logout",
        "Logout berhasil. Sesi telah diakhiri"
      );

      router.refresh();

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      console.error("Gagal untuk logout", error);

      showToast("error", "Gagal Logout", "Terjadi kesalahan sistem");
    }
  };

  const items = getMenuitems(handleLogout);

  const getInitials = () => {
    if (!user) {
      return <i className="pi pi-exclamation-circle"></i>;
    }

    const initial = user.full_name ? user.full_name.charAt(0) : "";

    let initialName = initial.toUpperCase();

    if (!initialName && user.email) {
      initialName = user.email.charAt(0).toUpperCase();
    }

    return initialName || <i className="pi pi-exclamation-circle"></i>;
  };

  return (
    <header className="fixed top-0 z-5 w-full bg-white shadow-1 border-b py-2">
      <div className="px-4 md:px-6">
        <div className="flex justify-content-between align-items-center h-16">
          <div className="flex gap-2 md:gap-4 align-items-center">
            <Button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="block md:hidden text-800 text-xl"
              icon="pi pi-bars"
              text
            />
            <div className="surface-50 p-2 border-round-lg">
              <Image
                src="/img/logo.png"
                alt="logo"
                className="w-2rem md:w-3rem h-auto"
                width={0}
                height={0}
                sizes="100vw"
              />
            </div>
            <h1 className="text-sm md:text-lg font-bold text-800">
              HR Marstech
            </h1>
          </div>
          <div>
            <Menu
              model={items}
              popup
              ref={menu}
              id="popup_menu"
              pt={{ icon: { className: "mr-2" } }}
            />

            <Button
              className="flex gap-2 px-4 py-2 hover:bg-gray-100 animation-duration-300 animation-ease-in-out transition-colors"
              onClick={(event: React.MouseEvent) => menu.current?.toggle(event)}
              aria-controls="popup_menu"
              aria-haspopup
              text
            >
              {isLoading ? (
                <Skeleton shape="rectangle" size="2.5rem" className="mr-2" />
              ) : (
                <Avatar className="bg-blue-500 text-white">
                  {getInitials()}
                </Avatar>
              )}
              <div className="flex align-items-center gap-3">
                <div className="hidden text-800 md:flex md:flex-column md:align-items-start">
                  {isLoading ? (
                    <>
                      <Skeleton width="8rem" height="1rem" className="mb-1" />
                      <Skeleton width="6rem" height="0.8rem" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-base">
                        {user?.full_name ? user.full_name : "Logout"}
                      </span>
                      <span className="text-xs">{user?.email}</span>
                    </>
                  )}
                </div>
                {!isLoading && (
                  <i className="pi pi-chevron-down text-800 text-sm"></i>
                )}
              </div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
