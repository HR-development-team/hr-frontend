"use client";

import {
  Building2,
  FileText,
  LayoutDashboard,
  MonitorCheck,
  PiggyBank,
  PiIcon,
  Users,
  WalletCards,
  WalletIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Accordion, AccordionTab } from "primereact/accordion";
import { ReactNode, useState } from "react";
import { idText } from "typescript";
import Attendance from "../../admin/attendance/page";
import { FaUser, FaUserCheck } from "react-icons/fa";

interface ChildrenMenuItems {
  label: string;
  href: string;
}

interface MenuItems {
  id: string;
  label: string;
  icon: ReactNode;
  href?: string;
  children?: ChildrenMenuItems[];
}

const menuItems: MenuItems[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard />,
    href: "/karyawan",
  },
  {
    id: "attendance",
    label: "Absensi",
    icon: (
      <FaUserCheck size={25} className="text-gray-400 group-hover:text-white" />
    ),
    href: "/karyawan/Absensi",
  },
  {
    id: "pengajuan",
    label: "Pengajuan",
    icon: <FileText />,
    children: [
      {
        label: "Pengajuan Cuti",
        href: "/karyawan/Pengajuan/cuti",
      },
      {
        label: "Pengajuan Lembuar",
        href: "/karyawan/Pengajuan/lembur",
      },
      {
        label: "Status Pengajuan",
        href: "/karyawan/Pengajuan/status",
      },
    ],
  },
  {
    id: "profile",
    label: "Profil",
    icon: <MonitorCheck />,
    href: "/karyawan/Profil",
  },
  {
    id: "payrol",
    label: "Pembayaran",
    icon: <WalletIcon />,
    href: "/karyawan/Pembayaran",
  },
];

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function SidebarPopup({
  sidebarOpen,
  setSidebarOpen,
}: HeaderProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  const isActive = (href: string) => pathname === href;
  const isChildActive = (children: any[]) => {
    return children.some(
      (child) => pathname === child.href && pathname.startsWith(child.href)
    );
  };

  const renderNavItem = (item: any) => {
    const isItemActive = item.href
      ? isActive(item.href)
      : isChildActive(item.children || []);
    const isExpanded =
      expandedItems[item.label] || isChildActive(item.children || []);

    if (item.children) {
      return (
        <div key={item.id}>
          <Accordion>
            <AccordionTab
              header={
                <div className="flex align-items-center gap-2">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              }
              pt={{
                headerAction: {
                  className:
                    "bg-white border-none mb-2 p-2 flex-row-reverse justify-content-between hover:surface-100",
                },
                headerTitle: {
                  className: "text-sm",
                },
                content: {
                  className: "border-none p-2",
                },
              }}
            >
              {item.children.map((child: any) => (
                <Link
                  key={child.label}
                  href={child.href || "#"}
                  className={`flex align-items-center gap-3 border-round-md px-3 py-2 text-sm no-underline cursor-pointer ${
                    child.href && isActive(child.href)
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-600 hover:surface-100"
                  }`}
                >
                  {/* <span>{child.icon}</span> */}
                  <span className="font-medium py-1 ml-3">{child.label}</span>
                </Link>
              ))}
            </AccordionTab>
          </Accordion>
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        href={item.href || "#"}
        className={`flex align-items-center gap-3 rounded-md mb-2 p-2 text-sm font-medium transition-colors no-underline border-round-md ${
          isItemActive
            ? "bg-blue-50 text-blue-700"
            : "text-600 hover:surface-100"
        }`}
      >
        <div
          className={`flex align-items-center ${
            isItemActive ? "text-blue-600" : "text-500"
          }`}
        >
          <span>{item.icon}</span>
          <span className="ml-2 font-bold text-md">{item.label}</span>
        </div>
      </Link>
    );
  };

  return (
    <aside
      className={`h-sidebar-calc fixed left-0 top-auto bottom-0 md:relative z-4 w-16rem bg-white shadow-2 px-3 transition-transform animation-duration-300 animation-ease-in-out md:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-100"
      }`}
    >
      <div
        style={{ marginTop: "2rem", marginBottom: "7rem" }}
        className="bg-white px-2 border-round-xl"
      >
        <nav>{menuItems.map(renderNavItem)}</nav>
        {sidebarOpen && <div>Sidebar Terbuka</div>}
      </div>
    </aside>
  );
}
