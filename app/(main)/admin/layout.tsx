"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
	const pathName = usePathname();

	useEffect(() => {
		setSidebarOpen(false);
	}, [pathName]);
	return (
		<div className="min-h-screen surface-50">
			<Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
			<div className="flex">
				<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
				<main
					style={{ height: "100vh" }}
					className="flex-1 p-6 ml-8 mt-6 surface-100 overflow-y-auto relative"
				>
					{/* backdrop for mobile sidebar */}
					{sidebarOpen && (
						<div
							className="absolute top-0 right-0 bottom-0 left-0 z-3 surface-900 opacity-50 md:hidden"
							onClick={() => setSidebarOpen(false)}
						></div>
					)}
					{children}
				</main>
			</div>
		</div>
	);
}
