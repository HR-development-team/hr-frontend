"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@features/auth/context/AuthProvider";
import { useToastContext } from "@components/ToastProvider";

// PrimeReact Imports
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { Skeleton } from "primereact/skeleton";
import { Ripple } from "primereact/ripple";
import { classNames } from "primereact/utils";
import { Badge } from "primereact/badge";

export const UserDropdown = () => {
  const menuRef = useRef<Menu>(null);
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { showToast } = useToastContext();

  // --- Logic: Handlers ---
  const handleLogout = async () => {
    try {
      await logout();
      showToast("success", "Logout Berhasil", "Sampai jumpa kembali!");
      router.refresh();
      setTimeout(() => router.push("/login"), 500);
    } catch (error) {
      console.error(error);
    }
  };

  // --- Logic: Menu Items ---
  const menuItems: MenuItem[] = [
    // 1. HEADER: Increased padding (p-4) and gap (gap-2)
    {
      template: () => (
        <div className="flex flex-column align-items-start p-4 gap-2 w-full">
          <div className="flex align-items-center justify-content-between w-full mb-1">
            <span className="font-bold text-900 text-xl">
              {user?.full_name || "Pengguna"}
            </span>
            {/* Role Badge: moved to right for balance */}
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 border-round-2xl">
              {user?.role_name}
            </span>
          </div>

          <span className="text-sm text-500 text-overflow-ellipsis overflow-hidden w-full">
            {user?.email}
          </span>
        </div>
      ),
    },
    { separator: true },

    // 2. NAV ITEMS: Increased vertical padding (py-3) and horizontal padding (px-4)
    {
      label: "Profil Saya",
      template: (item, options) => (
        <a
          className={classNames(
            options.className,
            "p-ripple flex align-items-center px-4 py-3 gap-3 hover:surface-100 cursor-pointer transition-duration-150"
          )}
          onClick={options.onClick}
        >
          <span className="pi pi-user text-xl text-primary" />
          <div className="flex flex-column gap-1">
            <span className="font-medium text-800 text-base">{item.label}</span>
            <span className="text-xs text-500">Lihat detail akun anda</span>
          </div>
          <Ripple />
        </a>
      ),
    },
    {
      label: "Pengaturan",
      template: (item, options) => (
        <a
          className={classNames(
            options.className,
            "p-ripple flex align-items-center px-4 py-3 gap-3 hover:surface-100 cursor-pointer transition-duration-150"
          )}
          onClick={options.onClick}
        >
          <span className="pi pi-cog text-xl text-primary" />
          <div className="flex flex-column gap-1 flex-1">
            <span className="font-medium text-800 text-base">{item.label}</span>
            <span className="text-xs text-500">Preferensi sistem</span>
          </div>
          <Badge
            value="Baru"
            severity="danger"
            className="text-xs font-normal"
          />
          <Ripple />
        </a>
      ),
    },
    { separator: true },

    // 3. LOGOUT: Distinct styling with spacing
    {
      label: "Keluar",
      command: handleLogout,
      template: (item, options) => (
        <a
          className={classNames(
            options.className,
            "p-ripple flex align-items-center px-4 py-3 gap-3 hover:bg-red-50 cursor-pointer transition-colors transition-duration-150 mt-1"
          )}
          onClick={options.onClick}
        >
          <span className="pi pi-power-off text-xl text-red-500" />
          <span className="text-red-500 font-semibold text-base">
            {item.label}
          </span>
          <Ripple />
        </a>
      ),
    },
  ];

  // --- Helper: Initials ---
  const getInitials = () => {
    if (!user) return "U";
    return (user.full_name || user.email || "U").charAt(0).toUpperCase();
  };

  // --- Render: Loading ---
  if (isLoading) {
    return (
      <div className="flex align-items-center gap-3 px-3 py-2">
        <Skeleton shape="circle" size="3rem" />
        <div className="hidden md:block">
          <Skeleton width="8rem" height="1.2rem" className="mb-2" />
          <Skeleton width="6rem" height="0.9rem" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Menu
        model={menuItems}
        popup
        ref={menuRef}
        id="user_menu"
        // Increased width to 20rem (approx 320px) and rounded corners
        className="w-20rem border-none shadow-8 border-round-2xl mt-2"
      />

      {/* Trigger: Increased padding and gap */}
      <div
        className="
          cursor-pointer p-ripple
          flex align-items-center gap-3 
          pl-2 pr-4 py-2
          border-1 border-transparent hover:border-gray-200 
          hover:surface-100 border-round-3xl 
          transition-all transition-duration-200
        "
        onClick={(e) => menuRef.current?.toggle(e)}
        aria-controls="user_menu"
        aria-haspopup
      >
        <div className="relative">
          <Avatar
            label={getInitials()}
            className="text-white font-bold shadow-1 text-xl"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              width: "3rem",
              height: "3rem",
            }}
            shape="circle"
          />
          <span className="absolute bottom-0 right-0 block w-1rem h-1rem border-circle bg-green-500 border-2 border-white"></span>
        </div>

        <div className="hidden md:flex flex-column align-items-start gap-1">
          <span className="font-semibold text-800 text-base">
            {user?.full_name?.split(" ")[0] || "User"}
          </span>
          <span className="text-xs text-500 font-medium">
            {user?.role_name}
          </span>
        </div>

        <i className="hidden md:block pi pi-angle-down text-500 text-sm ml-2"></i>

        <Ripple />
      </div>
    </>
  );
};
