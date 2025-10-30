"use client";

import React, { useRef } from "react";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { classNames } from "primereact/utils";
import { MenuItem } from "primereact/menuitem";

const items: MenuItem[] = [
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

  return (
    <header className="fixed top-0 z-5 w-full bg-white shadow-1 border-b py-2">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-content-between align-items-center h-16">
          <div className="flex gap-4 align-items-center">
            <Button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="block md:hidden text-800 text-xl"
              icon="pi pi-bars"
              text
            />
            <div className="surface-50 p-2 border-round-lg">
              <img src="/img/logo.png" alt="logo" className="w-3rem" />
            </div>
            <div className="flex flex-column gap-1">
              <h1 className="text-lg font-bold text-800">HR Marstech</h1>
              <p className="text-500 text-sm">Super Admin</p>
            </div>
          </div>
          <div>
            <Menu model={items} popup ref={menu} id="popup_menu" />

            <Button
              className="flex gap-2 px-4 py-2 hover:bg-gray-100 animation-duration-300 animation-ease-in-out transition-colors"
              onClick={(event: React.MouseEvent) => menu.current?.toggle(event)}
              aria-controls="popup_menu"
              aria-haspopup
              text
            >
              <Avatar label="AZ" className="bg-blue-500 text-white" />
              <div className="flex align-items-center gap-3">
                <div className="hidden text-800 md:flex md:flex-column md:align-items-start">
                  <span className="font-semibold text-base">
                    Agus Zahirudin
                  </span>
                  <span className="text-xs">Cabang Bandung</span>
                </div>
                <i className="pi pi-chevron-down text-800 text-sm"></i>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
