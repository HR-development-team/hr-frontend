import {
  Building2,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Users2,
  LucideIcon,
} from "lucide-react";

export interface SubMenuItem {
  label: string;
  href: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  children?: SubMenuItem[];
  // Optional: Add roles if you want to filter later
  allowedRoles?: string[];
}

export const SIDEBAR_ITEMS: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    id: "master",
    label: "Master Data",
    icon: FileText,
    children: [
      { label: "Master Kantor", href: "/admin/master/office" },
      { label: "Master Departemen", href: "/admin/master/departments" },
      { label: "Master Divisi", href: "/admin/master/division" },
      { label: "Master Jabatan", href: "/admin/master/position" },
      { label: "Master Karyawan", href: "/admin/master/employees" },
      // { label: "Master Tipe Cuti", href: "/admin/master/leave-type" },
      // { label: "Master Shift", href: "/admin/master/shift" },
    ],
  },
  {
    id: "transaction",
    label: "Transaksi",
    icon: ClipboardList,
    children: [
      { label: "Pengajuan Cuti", href: "/admin/transaction/leave-request" },
      { label: "Saldo Cuti", href: "/admin/transaction/leave-balance" },
    ],
  },
  {
    id: "user-management",
    label: "Manajemen",
    icon: Users2,
    children: [
      { label: "Manajemen Pengguna", href: "/admin/management/user" },
      { label: "Role & Permissions", href: "/admin/management/roles" },
    ],
  },
  {
    id: "organization",
    label: "Struktur Organisasi",
    icon: Building2,
    href: "/admin/organization",
  },
];
