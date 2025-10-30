"use client";

import {
	Building,
	Building2,
	ClipboardClock,
	ClipboardX,
	Divide,
	FileText,
	icons,
	MonitorCheck,
	User,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Accordion, AccordionTab } from "primereact/accordion";
import { ReactNode, useState } from "react";
import { idText } from "typescript";

const menuItems = [
	{
		id: "dashboard",
		label: "Dashboard",
		icon: <Users />,
		href: "/admin/dashboard",
	},
	{
		id: "master",
		label: "Master",
		icon: <FileText />,
		children: [
			{
				label: "Master Departemen",
				icon: <Building />,
				href: "#",
			},
			{
				label: "Master Divisi",
				icon: <Building2 />,
				href: "#",
			},
			{
				label: "Master Karyawan",
				icon: <Users />,
				href: "#",
			},
			{
				label: "Master User",
				icon: <User />,
				href: "#",
			},
		],
	},
	{
		id: "attendance",
		label: "Kehadiran",
		icon: <MonitorCheck />,
		children: [
			{
				label: "Monitoring Kehadiran",
				icon: <ClipboardClock />,
				href: "#",
			},
			{
				label: "Pengajuan Cuti",
				icon: <ClipboardX />,
				href: "#",
			},
		],
	},
	{
		id: "organization",
		label: "Struktur Organisasi",
		icon: <Building2 />,
		href: "/admin/organization",
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
									<span className="text-500 font-medium py-1 ml-3">{child.label}</span>
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
		<aside className="surface-100 w-3 px-3 min-h-screen">
			<div
				style={{ marginTop: "7rem", marginBottom: "7rem" }}
				className="bg-white p-3 border-round-xl shadow-2"
			>
				<nav>{menuItems.map(renderNavItem)}</nav>
			</div>
		</aside>
	);
}
