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
  requiredFeature?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  children?: SubMenuItem[];
  allowedRoles?: string[];
  requiredFeature?: string;
}

export const SIDEBAR_ITEMS: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
    // No requiredFeature means it's always visible (or you can add a 'Dashboard' feature)
  },
  {
    id: "master",
    label: "Master Data",
    icon: FileText,
    // Parent doesn't need a feature, it relies on children visibility
    children: [
      {
        label: "Master Kantor",
        href: "/admin/master/office",
        requiredFeature: "Office Management",
      },
      {
        label: "Master Departemen",
        href: "/admin/master/departments",
        requiredFeature: "Department Management",
      },
      {
        label: "Master Divisi",
        href: "/admin/master/division",
        requiredFeature: "Division Management",
      },
      {
        label: "Master Jabatan",
        href: "/admin/master/position",
        requiredFeature: "Position Management",
      },
      {
        label: "Master Karyawan",
        href: "/admin/master/employees",
        requiredFeature: "Employee Management",
      },
    ],
  },
  {
    id: "attendance",
    label: "Absensi",
    icon: ClipboardList,
    children: [
      {
        label: "Shift Kerja",
        href: "/admin/master/shift",
        requiredFeature: "Shift Management",
      },
    ],
  },
  {
    id: "user-management",
    label: "Manajemen",
    icon: Users2,
    children: [
      {
        label: "Manajemen Pengguna",
        href: "/admin/management/user",
        requiredFeature: "User Management",
      },
      {
        label: "Role & Permissions",
        href: "/admin/management/roles",
        requiredFeature: "Role Management",
      },
    ],
  },
  {
    id: "organization",
    label: "Struktur Organisasi",
    icon: Building2,
    href: "/admin/organization",
    requiredFeature: "Organization Management",
  },
];
